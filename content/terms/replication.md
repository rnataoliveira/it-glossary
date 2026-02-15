---
title: "Replication"
letter: "R"
categories:
  - "data"
  - "reliability"
shortDefinition: "Copying data across multiple database servers to improve availability, fault tolerance, and read performance."
---

## Why does it exist?

A single database server is a single point of failure. If it crashes, the entire application goes down and data may be lost. Replication exists to keep identical copies of data on multiple servers so that if one node fails, another can take over immediately. Beyond fault tolerance, replication also distributes read traffic across multiple nodes, reducing the load on any single server and improving response times for read-heavy workloads.

## Practical example of use

A news platform runs a PostgreSQL primary-replica setup with one primary and three read replicas. All write operations (publishing articles, saving comments) go to the primary. Read operations (loading the homepage, fetching article content) are distributed across the three replicas using a load balancer. When the primary fails during a hardware issue, an automated failover promotes one replica to primary within 30 seconds, keeping the site online.

## When to use

- Your application requires high availability and cannot afford downtime from a single server failure
- Read traffic significantly exceeds write traffic and a single server cannot keep up
- You need disaster recovery with data copies in different data centers or regions
- Your SLA demands a recovery point objective (RPO) close to zero

## When to avoid

- Write-heavy workloads where replication lag causes unacceptable stale reads
- Extremely small-scale applications where a single server with regular backups is sufficient
- When the added infrastructure and operational cost outweighs the reliability benefit

## Trade-offs

- **Availability vs. consistency**: Asynchronous replication offers better performance but replicas may serve slightly stale data. Synchronous replication guarantees consistency but adds latency to every write.
- **Read scalability vs. write bottleneck**: Adding replicas scales reads linearly, but all writes still go through a single primary, which remains the bottleneck.
- **Fault tolerance vs. operational complexity**: More replicas mean better resilience, but also more infrastructure to monitor, more failover logic, and more potential for configuration drift.

## Common small mistakes

- Reading from a replica immediately after writing to the primary and expecting the latest data (read-after-write inconsistency)
- Not setting up automated failover, so a primary failure still causes downtime until someone manually promotes a replica
- Ignoring replication lag monitoring and discovering too late that replicas are minutes behind the primary
- Using synchronous replication across geographically distant regions, introducing hundreds of milliseconds of write latency
