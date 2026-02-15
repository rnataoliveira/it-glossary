---
title: "Saga Pattern"
letter: "S"
categories:
  - "architecture"
  - "backend"
shortDefinition: "A sequence of local transactions where each step triggers the next, with compensating actions to undo changes if any step fails."
---

## Why does it exist?

In distributed systems, a single business operation often spans multiple services, each with its own database. Traditional ACID transactions cannot stretch across service boundaries, so there is no built-in way to guarantee all-or-nothing behavior. The Saga pattern was introduced to solve this by breaking a distributed transaction into a series of local transactions, each paired with a compensating action that can logically reverse it if a later step fails. This preserves data consistency without requiring distributed locks.

## Practical example of use

A travel booking platform processes a vacation package that requires reserving a flight, a hotel, and a rental car — each managed by a separate service. The saga orchestrator first calls the Flight Service to reserve a seat, then the Hotel Service to book a room, then the Car Service. If the Car Service fails because no vehicles are available, the orchestrator triggers compensating actions: it cancels the hotel booking and releases the flight reservation. Each service only manages its own local transaction, and the orchestrator coordinates the overall flow.

## When to use

- A business operation spans multiple services that each own their data and cannot share a database transaction
- You need to maintain data consistency across services without using distributed locking protocols like two-phase commit
- Each step in the process has a clear compensating action that can undo its effect
- Long-running workflows need to be resilient to partial failures

## When to avoid

- The operation can be completed within a single service and a single database transaction
- Compensating actions are not feasible (e.g., sending an email or charging a credit card cannot be trivially undone)
- The number of steps is very small and a simpler retry-with-idempotency approach would suffice

## Trade-offs

- **Data consistency without distributed locks vs. eventual consistency**: Services stay loosely coupled, but intermediate states are visible to other parts of the system until the saga completes.
- **Resilience to partial failure vs. compensation complexity**: Each step can be independently recovered, but designing and testing correct compensating actions for every step adds significant effort.
- **Choreography simplicity vs. orchestration visibility**: Choreography (event-driven) avoids a central coordinator but makes the overall flow hard to trace; orchestration centralizes logic but introduces a single point of coordination.

## Common small mistakes

- Forgetting to make each step idempotent, which causes duplicate processing when a step is retried after a transient failure
- Not handling the case where the compensating action itself fails — compensations need their own retry logic
- Allowing external side effects (notifications, third-party API calls) in the middle of a saga without a strategy to undo or suppress them
- Using choreography for complex sagas with many steps, making the flow nearly impossible to debug across service logs
