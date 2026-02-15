---
title: "Eventual Consistency"
letter: "E"
categories:
  - "architecture"
  - "data"
shortDefinition: "A consistency model where replicas may temporarily diverge but are guaranteed to converge to the same state given enough time."
---

## Why does it exist?

In distributed systems, the CAP theorem tells us we cannot simultaneously have perfect consistency, availability, and partition tolerance. Strong consistency requires coordination between nodes, which adds latency and reduces availability when network partitions occur. Eventual consistency exists as a pragmatic compromise: it allows every node to accept reads and writes immediately, even if replicas are temporarily out of sync, with the guarantee that all nodes will eventually agree on the same data. This enables systems to stay available and responsive at global scale.

## Practical example of use

A social media platform stores user posts across data centers in the US, Europe, and Asia. When a user in Tokyo publishes a post, it is written to the local Asian data center and returned as successful in 15 milliseconds. The post then propagates asynchronously to the US and European data centers over the next 200-500 milliseconds. During that brief window, a user in London might not see the post yet, but within a second all replicas converge and the post is visible everywhere.

## When to use

- Globally distributed applications where low latency matters more than instant consistency
- Social feeds, likes, view counts, and other data where brief staleness is acceptable
- Shopping carts and user preferences where local writes must be fast and available
- DNS systems, CDN cache propagation, and other inherently asynchronous replication scenarios

## When to avoid

- Financial transactions where two users must never see conflicting account balances
- Inventory systems where overselling a limited-stock item would cause real business harm
- Any workflow where reading stale data leads to incorrect, irreversible decisions

## Trade-offs

- **Availability vs. accuracy**: Every node can serve reads and accept writes at all times, but clients may temporarily see outdated data.
- **Latency vs. synchronization**: Skipping cross-node coordination before responding makes writes fast, but conflict resolution (last-write-wins, vector clocks, CRDTs) adds design complexity.
- **Simplicity vs. correctness**: The programming model is harder because developers must design for the possibility of stale reads and write conflicts, rather than assuming a single consistent view.

## Common small mistakes

- Treating "eventual" as "instant" and building UI flows that depend on reading your own write immediately after submitting it
- Not defining a conflict resolution strategy, leading to silent data loss when concurrent writes collide (e.g., naive last-write-wins discarding valid updates)
- Failing to communicate staleness to end users — showing a count of "142 likes" that jumps to "139" a second later erodes user trust
- Assuming eventual consistency means no consistency guarantees at all — the convergence guarantee is real and important, it just takes time
