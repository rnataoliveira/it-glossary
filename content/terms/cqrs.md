---
title: "CQRS"
letter: "C"
categories:
  - "architecture"
  - "backend"
shortDefinition: "Command Query Responsibility Segregation — a pattern that separates read and write operations into different models."
---

## Why does it exist?

In many systems, the shape of data needed for reading is fundamentally different from the shape needed for writing. A single model forced to serve both ends up being a compromise that does neither well. CQRS was formalized to address this tension by allowing the write side to enforce business rules with a rich domain model while the read side uses optimized, denormalized views tailored to specific queries. This separation enables each side to scale, evolve, and be optimized independently.

## Practical example of use

An online marketplace processes thousands of orders per minute. The write model validates inventory, applies discount rules, and records order events using normalized tables with strict constraints. The read model is a set of denormalized PostgreSQL materialized views (or an Elasticsearch index) optimized for the dashboard: "show all orders for customer X with product names, totals, and delivery status." When a new order is placed, a domain event updates the read model asynchronously. The dashboard loads in under 50ms without touching the transactional tables.

## When to use

- Read and write workloads have very different performance or scaling requirements
- The read model needs to aggregate data from multiple sources into a single view
- You are already using event sourcing and need a way to project events into queryable state
- Complex business rules on the write side make the domain model unsuitable for direct querying

## When to avoid

- The application is a straightforward CRUD system where reads and writes share the same shape
- The team does not have the operational capacity to maintain two data models and keep them in sync
- Eventual consistency between the write and read models is unacceptable for the use case

## Trade-offs

- **Optimized reads and writes vs. increased complexity**: Each side is purpose-built, but you now maintain two models instead of one.
- **Independent scalability vs. eventual consistency**: The read side can scale horizontally, but there is a propagation delay between a write and its visibility on the read side.
- **Flexibility in technology choices vs. operational overhead**: You can use different databases for reads and writes, but synchronization logic (projections, event handlers) must be reliable and monitored.

## Common small mistakes

- Applying CQRS to the entire system instead of only the bounded contexts where the read/write asymmetry justifies it
- Ignoring the consistency gap and not communicating to users that data may be slightly stale on the read side
- Building synchronous projections that block the write path, negating the performance benefits
- Coupling the read model schema to the write model schema, defeating the purpose of separation
