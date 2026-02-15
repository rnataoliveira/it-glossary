---
title: "Sharding"
letter: "S"
categories:
  - "improve-performance"
  - "create-system-design"
  - "improve-scalability"
shortDefinition: "Splitting a database into smaller, independent pieces called shards, each holding a subset of the total data."
---

## Why does it exist?

A single database server has finite CPU, memory, and disk. When data grows beyond what one machine can handle efficiently, vertical scaling (adding more resources to the same server) hits a ceiling. Sharding exists to break that ceiling by distributing data across multiple servers horizontally. Each shard operates independently, allowing the system to handle more data and more traffic than any single node ever could.

## Practical example of use

A SaaS platform with 50 million users shards its `users` and `orders` tables by `tenant_id`. Tenant A's data lives on Shard 1, Tenant B's on Shard 2, and so on. A routing layer inspects the `tenant_id` in each query and directs it to the correct shard. This keeps each shard small enough to maintain fast query times and allows the platform to add new shards as new customers onboard.

## When to use

- Your dataset has grown too large for a single database server to handle with acceptable performance
- You need to scale write throughput beyond what a single primary node can deliver
- Your data naturally partitions along a clear key (e.g., tenant ID, region, user ID)
- Regulatory requirements demand data residency in specific geographic regions

## When to avoid

- Your data fits comfortably on a single well-tuned database server
- Most of your queries require cross-shard joins or aggregations, which negate the benefits
- You have not yet exhausted simpler scaling strategies like read replicas, caching, or indexing

## Trade-offs

- **Scalability vs. operational complexity**: Sharding enables near-linear horizontal scaling but introduces routing logic, shard management, rebalancing, and more complex deployments.
- **Write throughput vs. cross-shard queries**: Each shard handles its own writes efficiently, but queries spanning multiple shards become slow and complicated, often requiring scatter-gather patterns.
- **Data isolation vs. flexibility**: Sharding locks you into a partition key. Choosing the wrong key leads to hotspots (one shard getting most of the traffic) and is extremely painful to change later.

## Common small mistakes

- Choosing a shard key with low cardinality (e.g., country code), causing uneven data distribution and hotspot shards
- Sharding too early when simpler optimizations like indexing, caching, or read replicas would have been sufficient
- Forgetting to plan a rebalancing strategy for when shards grow unevenly over time
- Not accounting for cross-shard transactions, then discovering that features like "global search" or "admin reports" become engineering nightmares
