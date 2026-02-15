---
title: "Circuit Breaker"
letter: "C"
categories:
  - "improve-reliability"
  - "create-system-design"
shortDefinition: "A stability pattern that stops calling a failing service after repeated failures, giving it time to recover before retrying."
---

## Why does it exist?

In distributed systems, a failing downstream service can cascade failures upstream. Without protection, a caller keeps sending requests to a broken service, exhausting its own thread pool, increasing latency, and eventually failing itself. The circuit breaker pattern, popularized by Michael Nygard in "Release It!", was introduced to detect sustained failures and short-circuit requests early. This gives the failing service time to recover while the caller degrades gracefully instead of collapsing.

## Practical example of use

A payment gateway depends on an external fraud detection API. Under normal conditions, the circuit is "closed" and every transaction is checked. When the fraud API starts returning 503 errors, the circuit breaker counts five consecutive failures within ten seconds and trips to "open." For the next 30 seconds, all fraud-check calls return immediately with a fallback response — the system flags the transaction for manual review instead of blocking checkout entirely. After 30 seconds, the circuit moves to "half-open," letting one probe request through. If it succeeds, the circuit closes and normal operation resumes.

## When to use

- Your service depends on an external or remote system that may become temporarily unavailable
- Failure in a downstream dependency should not bring down the entire request path
- You want to provide a degraded but functional experience (fallback behavior) during outages
- The downstream service needs breathing room to recover rather than being hammered with retries

## When to avoid

- The downstream call is to a local, in-process component where failure means a code bug, not a transient issue
- The operation is critical and has no acceptable fallback — tripping the circuit would cause more harm than retrying
- You are already behind a load balancer or service mesh that provides its own circuit-breaking capabilities

## Trade-offs

- **Fast failure vs. reduced availability**: Requests fail immediately instead of timing out, but legitimate requests are rejected while the circuit is open.
- **System resilience vs. configuration complexity**: The pattern prevents cascading failures, but choosing the right thresholds (failure count, timeout window, half-open probe count) requires tuning and monitoring.
- **Downstream protection vs. fallback design effort**: The failing service gets recovery time, but every circuit breaker needs a meaningful fallback path that the team must design and test.

## Common small mistakes

- Setting the failure threshold too low, causing the circuit to trip on normal transient errors like a single timeout
- Not implementing a fallback, so the circuit breaker just converts a slow failure into a fast failure with no user benefit
- Sharing a single circuit breaker across unrelated endpoints of the same service, causing one bad endpoint to block calls to healthy ones
- Forgetting to add monitoring and alerts on circuit state transitions, making it invisible when the circuit trips in production
