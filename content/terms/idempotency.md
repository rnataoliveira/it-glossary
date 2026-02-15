---
title: "Idempotency"
letter: "I"
categories:
  - "architecture"
  - "reliability"
shortDefinition: "The property of an operation where performing it multiple times produces the same result as performing it once."
---

## Why does it exist?

In distributed systems, requests can be retried due to timeouts, network issues, or client bugs. Without idempotency, a retried payment could charge a customer twice, or a retried order could create duplicate entries. Idempotent operations are safe to retry, making systems more resilient.

## Practical example of use

A payment API assigns each request a unique `idempotency_key`. When a client sends a payment request, the server stores the key and result. If the same key is sent again (e.g., due to a timeout retry), the server returns the stored result instead of processing the payment again. The customer is never charged twice.

## When to use

- Payment processing and financial transactions
- API endpoints that create or modify resources
- Message queue consumers (messages may be delivered more than once)
- Any operation in a distributed system that may be retried

## When to avoid

- Read-only operations (GET requests are naturally idempotent)
- Operations where duplicates are acceptable (logging, analytics events)
- Internal function calls within a single process where retry is not a concern

## Trade-offs

- **Safety vs. storage**: Storing idempotency keys requires additional state management.
- **Simplicity vs. robustness**: Implementing idempotency adds complexity to the API layer.
- **Freshness vs. consistency**: Returning a cached response might not reflect the latest system state.

## Common small mistakes

- Confusing idempotent with safe — a DELETE is idempotent (deleting twice has the same effect) but not safe (it changes state)
- Not setting an expiration on idempotency keys, leading to unbounded storage growth
- Making POST endpoints non-idempotent and relying on clients to never retry
- Implementing idempotency at the wrong layer (e.g., only in the controller but not in the service that talks to external systems)
