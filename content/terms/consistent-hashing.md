---
title: "Consistent Hashing"
letter: "C"
categories:
  - "architecture"
  - "performance"
shortDefinition: "A hashing technique that minimizes key remapping when the number of nodes in a distributed system changes."
---

## Why does it exist?

In distributed systems, data must be spread across multiple servers. Traditional hashing (e.g., `hash(key) % N`) works fine until you add or remove a server -- at that point, nearly every key maps to a different node, triggering a massive redistribution of data. For a cache cluster, this means almost every request becomes a cache miss simultaneously, potentially overwhelming the backend.

Consistent hashing solves this by arranging nodes on a virtual ring. When a node is added or removed, only the keys that were assigned to the affected segment of the ring need to move, keeping the vast majority of mappings stable.

## Practical example of use

Imagine you run a web application with four Memcached servers caching user session data. Traffic is growing and you need to add a fifth server. With naive modular hashing, adding the fifth server would remap roughly 80% of keys, causing a sudden spike of cache misses and a surge of database queries. With consistent hashing, only about 20% of keys (those in the segment now assigned to the new node) need to move. The other 80% stay exactly where they were, so your database load barely changes during the scale-out.

Services like Amazon DynamoDB, Apache Cassandra, and many CDN edge networks rely on consistent hashing (often with virtual nodes) to distribute and rebalance data smoothly as the cluster topology changes.

## When to use

- You operate a distributed cache (Redis Cluster, Memcached) and need to add or remove nodes without mass invalidation.
- You are building a partitioned data store and want predictable, minimal data movement during rebalancing.
- Your system uses a hash ring for request routing and must handle frequent topology changes (e.g., auto-scaling groups).
- You need uniform load distribution and plan to use virtual nodes to avoid hotspots.

## When to avoid

- Your system only runs on a single node or a fixed, small set of nodes that never changes.
- Simple modular hashing is sufficient because your cluster is static and downtime for full re-hashing is acceptable.
- You have very few keys and the cost of redistributing all of them is negligible.

## Trade-offs

- **Complexity vs. stability**: Consistent hashing adds implementation and debugging complexity, but prevents cache stampedes during scaling events.
- **Virtual nodes vs. memory overhead**: Using many virtual nodes per physical node improves load balance, but increases the size of the ring metadata that every client must store and traverse.
- **Even distribution vs. determinism**: Without virtual nodes, consistent hashing can produce uneven partitions; adding virtual nodes fixes this at the cost of a less intuitive mapping.

## Common small mistakes

- Forgetting to use virtual nodes, which leads to highly uneven data distribution especially with a small number of physical nodes.
- Assuming consistent hashing eliminates all data movement -- it minimizes it, but a fraction of keys still need to migrate when topology changes.
- Not accounting for node weight differences; servers with more capacity should be assigned more virtual nodes.
- Ignoring replication: consistent hashing determines placement, but you still need a replication strategy for fault tolerance.
- Using a weak or poorly distributed hash function, which undermines the uniformity the ring depends on.
