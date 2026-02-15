---
title: "CAP Theorem"
letter: "C"
categories:
  - "create-system-design"
  - "explain-architecture"
shortDefinition: "A distributed system can provide at most two of three guarantees: Consistency, Availability, and Partition tolerance."
---

## Why does it exist?

Distributed systems run across multiple nodes connected by a network. Networks can fail (partitions). The CAP theorem, proven by Eric Brewer, states that during a network partition, a system must choose between consistency (every read gets the latest write) and availability (every request gets a response). Understanding this helps architects make informed trade-offs.

## Practical example of use

A distributed database cluster experiences a network partition between two data centers. A CP system (like HBase) rejects writes to the disconnected partition to maintain consistency. An AP system (like Cassandra) continues accepting writes on both sides, resolving conflicts later. The choice depends on whether your application tolerates stale reads or rejected writes.

## When to use

- When designing distributed databases or data storage systems
- During system design interviews to demonstrate understanding of distributed systems
- When choosing between databases (e.g., PostgreSQL vs. Cassandra vs. MongoDB)
- When reasoning about failure modes in multi-region deployments

## When to avoid

- Single-node systems where partitions are not a concern
- As a prescriptive rule — it describes limitations, not best practices
- As the sole factor in database selection (consider performance, cost, and ecosystem too)

## Trade-offs

- **CP (Consistency + Partition tolerance)**: System may become unavailable during partitions. Good for financial transactions.
- **AP (Availability + Partition tolerance)**: System stays available but may return stale data. Good for social media feeds.
- **CA (Consistency + Availability)**: Only possible without partitions — essentially a single-node system.

## Common small mistakes

- Thinking CAP means you always lose one of the three (it only matters during partitions)
- Treating CAP as a binary choice — real systems offer tunable consistency
- Ignoring latency — even without partitions, consistency has a latency cost
- Not understanding that "availability" in CAP means every non-failing node responds, which is stricter than typical uptime SLAs
