---
title: "Distributed Cache"
letter: "D"
categories:
  - "architecture"
  - "performance"
shortDefinition: "A caching layer spread across multiple nodes that provides shared, fast data access to all application instances."
---

## Why does it exist?

In-process caches (like a hash map in your application's memory) are fast but limited: each application instance maintains its own copy, leading to inconsistencies, duplicated memory usage, and cache misses when a load balancer routes a request to a different instance. As applications scale horizontally, local caches become increasingly ineffective.

A distributed cache solves this by placing the cache in a shared, network-accessible layer that all application instances read from and write to. Systems like Redis and Memcached run as separate processes (or clusters of processes) that store data in memory and serve requests over the network in sub-millisecond time. This gives you a single source of cached truth, consistent across all instances, with the ability to scale the cache independently of the application.

## Practical example of use

An e-commerce platform queries its product catalog database on every page load. The database handles it fine at low traffic, but during a flash sale, tens of thousands of requests per second saturate the database. A Redis cluster is deployed as a distributed cache. The application checks Redis first; if the product data is cached, it is returned in under a millisecond. If not, the application queries the database, stores the result in Redis with a TTL, and returns it. All application instances share the same Redis cluster, so a cache entry written by one instance benefits every other instance immediately.

```yaml
# redis-cluster.yaml - Redis Cluster with 3 masters and 3 replicas
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-cluster-config
data:
  redis.conf: |
    port 6379
    cluster-enabled yes
    cluster-config-file nodes.conf
    cluster-node-timeout 5000
    appendonly yes
    maxmemory 2gb
    maxmemory-policy allkeys-lru
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-cluster
spec:
  serviceName: redis-cluster
  replicas: 6
  selector:
    matchLabels:
      app: redis-cluster
  template:
    metadata:
      labels:
        app: redis-cluster
    spec:
      containers:
        - name: redis
          image: redis:7.2-alpine
          ports:
            - containerPort: 6379
            - containerPort: 16379  # cluster bus
          command: ["redis-server", "/conf/redis.conf"]
          volumeMounts:
            - name: config
              mountPath: /conf
            - name: data
              mountPath: /data
          resources:
            requests:
              memory: "2Gi"
              cpu: "500m"
            limits:
              memory: "2Gi"
      volumes:
        - name: config
          configMap:
            name: redis-cluster-config
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

With `maxmemory-policy allkeys-lru`, Redis automatically evicts the least recently used keys when memory is full, ensuring the cache does not run out of space during traffic spikes.

## When to use

- Multiple application instances need a shared, consistent view of cached data.
- Database query latency is a bottleneck and the data can tolerate being slightly stale.
- You need to cache session data, rate-limiting counters, or feature flags that must be visible across all instances.
- Read-heavy workloads where the same data is requested far more often than it changes.

## When to avoid

- Your application runs as a single instance and an in-process cache is sufficient.
- Data changes so frequently that the cache is invalidated before it can be read, providing no benefit.
- Strong consistency is required and even brief staleness is unacceptable (e.g., financial balances during transactions).
- The added network hop to the cache is slower than querying the primary data source directly (rare, but possible with very fast local databases).

## Trade-offs

- **Speed vs. staleness**: Cached data is fast to retrieve, but it may be out of date until the TTL expires or the cache is explicitly invalidated.
- **Scalability vs. operational complexity**: A cache cluster scales independently, but introduces another system to deploy, monitor, and maintain (replication, failover, memory tuning).
- **Memory efficiency vs. cost**: Storing data in RAM is fast but expensive; over-caching large datasets can drive up infrastructure costs significantly.

## Common small mistakes

- Not setting a TTL on cache entries, leading to stale data that never expires and bugs that are hard to reproduce.
- Using the cache as a primary data store instead of a performance layer -- if the cache is flushed, the application should still work (just slower).
- Cache stampede: when a popular key expires, hundreds of requests simultaneously hit the database. Mitigate with locking or staggered TTLs.
- Serializing complex objects without versioning, so a code deployment changes the schema and the cache returns incompatible data.
- Ignoring cache eviction policies and being surprised when keys disappear -- understand whether your cache uses LRU, LFU, or random eviction.
