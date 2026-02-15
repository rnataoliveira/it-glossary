---
title: "Leader Election"
letter: "L"
categories:
  - "architecture"
  - "reliability"
shortDefinition: "A coordination mechanism that designates a single node in a distributed system to perform exclusive tasks while others stand by as followers."
---

## Why does it exist?

In distributed systems, some tasks must be performed by exactly one node at a time -- processing a job queue without duplicating work, coordinating cluster-wide configuration changes, or managing a write-ahead log. If multiple nodes attempt these tasks simultaneously, you get duplicate processing, data corruption, or split-brain scenarios.

Leader election solves this by establishing a protocol through which a group of nodes agrees on one node to be the leader. The leader performs the exclusive work while the remaining nodes act as followers, monitoring the leader's health. If the leader fails, the followers detect the failure and elect a new leader, ensuring the system continues operating without manual intervention.

## Practical example of use

Consider a distributed task scheduler where cron-like jobs must fire exactly once. Three scheduler instances run for redundancy. Without leader election, all three would fire every scheduled job, sending triple emails or processing triple payments. With leader election -- implemented through a tool like Apache ZooKeeper, etcd, or even a database lock -- one instance becomes the leader and fires the jobs. The other two instances run in standby, heartbeating to monitor the leader. If the leader's process crashes, one of the standbys detects the missing heartbeat within seconds, wins the election, and takes over scheduling duties. The transition is automatic, and no jobs are missed or duplicated.

## When to use

- A task in your distributed system must be performed by exactly one node at a time (job scheduling, log compaction, partition assignment).
- You need automatic failover without human intervention when the active node goes down.
- You are building a consensus-based system (e.g., a replicated state machine) that requires a leader to coordinate writes.
- Multiple instances of a service need to coordinate which one handles singleton work like database migrations on startup.

## When to avoid

- Your workload can be safely distributed across all nodes without coordination (e.g., stateless HTTP request handling behind a load balancer).
- You have only a single instance and no plans for redundancy, making election unnecessary.
- The cost and complexity of a consensus system (ZooKeeper, etcd, Raft) outweigh the benefit for your use case.
- A simple distributed lock with a TTL is sufficient and you do not need a persistent leader role.

## Trade-offs

- **Automatic failover vs. split-brain risk**: Leader election enables self-healing, but network partitions can cause two nodes to both believe they are the leader unless the election protocol handles this (e.g., using fencing tokens).
- **Consistency vs. availability**: During an election, the system may briefly have no leader, causing a short period where exclusive tasks are not processed.
- **Simplicity vs. external dependencies**: Implementing leader election correctly is difficult; relying on proven systems like etcd or ZooKeeper is safer but adds operational complexity.

## Common small mistakes

- Implementing leader election from scratch without understanding the subtleties of distributed consensus, leading to split-brain bugs that only manifest under network partitions.
- Forgetting fencing tokens -- a mechanism that prevents a stale leader (one that was deposed but does not know it yet) from performing actions after a new leader is elected.
- Setting heartbeat and election timeouts too aggressively, causing unnecessary leader churn under transient network jitter.
- Assuming the leader is always healthy just because the election succeeded; the leader can become slow or unresponsive without fully crashing.
- Not testing failover scenarios in staging, then discovering the election mechanism does not work when it matters most.
