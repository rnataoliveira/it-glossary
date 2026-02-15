---
title: "Pub/Sub"
letter: "P"
categories:
  - "architecture"
  - "backend"
shortDefinition: "A messaging pattern where publishers send messages to topics and subscribers receive them, without either side knowing the other."
---

## Why does it exist?

As systems grow, point-to-point communication between services becomes a web of dependencies. Every new consumer means modifying the producer to add another call. Pub/Sub was created to eliminate this coupling. Publishers emit events to a topic without knowing who — or how many — subscribers will consume them. Subscribers register interest in topics without knowing who produces the messages. This indirection allows systems to evolve independently and makes it trivial to add new consumers without changing existing code.

## Practical example of use

A SaaS platform publishes an `AccountCreated` event to a Google Cloud Pub/Sub topic whenever a new user signs up. Three independent subscribers react to this event: the Email Service sends a welcome email, the Analytics Service records the signup in the data warehouse, and the Provisioning Service creates the user's default workspace. When the marketing team later wants to trigger a trial onboarding flow, they simply deploy a new subscriber — no changes to the signup service or any existing subscriber are needed.

## When to use

- Multiple independent consumers need to react to the same event
- You want to add new consumers in the future without modifying the producer
- The publisher should not be blocked or affected by the speed or availability of any consumer
- You are building an event-driven architecture where services communicate through domain events

## When to avoid

- You need a direct request-response interaction where the caller depends on the result
- There is only one producer and one consumer with no foreseeable need for fan-out, making a simple queue more appropriate
- Message ordering is critical and your pub/sub system does not guarantee per-key ordering

## Trade-offs

- **Loose coupling vs. reduced traceability**: Services are independent, but following the path of an event through multiple subscribers requires distributed tracing tooling.
- **Easy fan-out vs. eventual consistency**: Adding new subscribers is effortless, but each subscriber processes events at its own pace, so different parts of the system may be temporarily out of sync.
- **Scalable event distribution vs. message management overhead**: The broker handles routing and delivery, but you must configure retention policies, handle dead letters, and manage subscription backlogs.

## Common small mistakes

- Publishing overly large payloads in events instead of including an identifier and letting subscribers fetch the data they need
- Not defining a schema or contract for events, causing subscribers to break silently when the publisher changes the event structure
- Ignoring unacknowledged message backlogs, which can lead to memory exhaustion on the broker or message expiration
- Assuming message ordering across partitions — most pub/sub systems only guarantee ordering within a single partition or key
