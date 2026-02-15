---
title: "Event-Driven Architecture"
letter: "E"
categories:
  - "create-system-design"
  - "explain-architecture"
  - "improve-maintainability"
shortDefinition: "A design pattern where components communicate by producing and consuming events, enabling loose coupling and asynchronous processing."
---

## Why does it exist?

In tightly coupled systems, a change in one component cascades through others. Event-driven architecture decouples producers from consumers: a service emits an event ("order placed"), and any interested service reacts independently. This enables scalability, resilience, and easier evolution of the system.

## Practical example of use

When a user places an order, the Order Service publishes an `OrderPlaced` event to a message broker (e.g., Kafka). The Inventory Service reserves stock, the Notification Service sends a confirmation email, and the Analytics Service records the sale — all independently, without the Order Service knowing about any of them.

## When to use

- Systems where multiple services need to react to the same event
- Asynchronous workflows (email, notifications, data pipelines)
- When you need to decouple services for independent scaling and deployment
- Event sourcing or audit trail requirements

## When to avoid

- Simple CRUD applications with no complex workflows
- When strong consistency is required for every operation
- If the team is unfamiliar with message brokers and eventual consistency
- Synchronous request-response flows where the client needs an immediate answer

## Trade-offs

- **Loose coupling vs. debugging complexity**: Services are independent, but tracing a flow across events is harder.
- **Scalability vs. eventual consistency**: Events enable async processing, but data is not immediately consistent everywhere.
- **Resilience vs. infrastructure**: Message brokers add reliability but also operational complexity.

## Common small mistakes

- Not handling duplicate events (consumers should be idempotent)
- Using events for everything, including simple synchronous operations
- Not monitoring consumer lag, leading to growing backlogs
- Publishing events without a schema, causing integration issues as the system evolves
- Ignoring dead letter queues for failed event processing
