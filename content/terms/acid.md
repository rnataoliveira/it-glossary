---
title: "ACID"
letter: "A"
categories:
  - "avoid-state-bugs"
  - "improve-reliability"
  - "back-end-applications"
shortDefinition: "A set of four properties — Atomicity, Consistency, Isolation, Durability — that guarantee reliable database transactions."
---

## Why does it exist?

Databases handle concurrent operations from many users simultaneously — transfers, purchases, updates. Without strict guarantees, money could disappear between accounts, inventory could go negative, or partially completed operations could corrupt data. ACID was formalized to provide a contract: every transaction either fully succeeds or fully rolls back, data always remains valid, concurrent transactions do not interfere with each other, and committed data survives crashes. These properties are the foundation of trustworthy data systems.

## Practical example of use

A banking application transfers $500 from Account A to Account B. The transaction debits Account A and credits Account B. With ACID guarantees, if the system crashes after debiting Account A but before crediting Account B, the entire transaction rolls back (Atomicity) — no money is lost. Meanwhile, another transaction checking both balances sees either the state before the transfer or after, never a partial state where $500 has vanished (Isolation).

## When to use

- Financial systems where incorrect balances or duplicate transactions are unacceptable
- Any operation that modifies multiple related records and must succeed or fail as a unit
- Systems where regulatory compliance demands an auditable, consistent data trail
- Booking and reservation systems where double-selling the same resource would cause real-world harm

## When to avoid

- High-throughput analytics pipelines where data is append-only and eventual consistency is acceptable
- Systems that prioritize availability over consistency in distributed environments (see CAP theorem)
- Logging, telemetry, or event streaming workloads where strict transactional overhead is unnecessary

## Trade-offs

- **Reliability vs. performance**: ACID guarantees require locking, write-ahead logs, and synchronization, which add latency compared to systems that relax these guarantees.
- **Correctness vs. scalability**: Maintaining ACID across distributed nodes (distributed transactions) is expensive and limits horizontal scaling, which is why many distributed databases relax Isolation or Consistency.
- **Safety vs. complexity**: Choosing the right isolation level (Read Committed, Repeatable Read, Serializable) requires understanding subtle concurrency issues like phantom reads and write skew.

## Common small mistakes

- Assuming all databases are fully ACID-compliant — many NoSQL databases and even some SQL configurations provide weaker guarantees by default
- Using the default isolation level without understanding what anomalies it permits (e.g., PostgreSQL defaults to Read Committed, not Serializable)
- Wrapping too many operations in a single large transaction, holding locks for too long and causing contention and deadlocks
- Confusing application-level validation with database-level Consistency — ACID Consistency means the database enforces its own constraints, not your business rules
