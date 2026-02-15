---
title: "Chaos Engineering"
letter: "C"
categories:
  - "testing"
  - "reliability"
shortDefinition: "The practice of deliberately injecting failures into a system to uncover weaknesses and build confidence in its ability to withstand turbulent conditions."
---

## Why does it exist?

Distributed systems fail in unpredictable ways. A network partition between two services, a sudden spike in CPU usage, a cloud provider losing an availability zone — these are not hypothetical scenarios but inevitable realities. Traditional testing validates that systems work when everything goes right. Chaos engineering validates that systems degrade gracefully when things go wrong, which is far more important for production reliability.

The discipline was pioneered at Netflix with their Chaos Monkey tool, which randomly terminated production instances to ensure their services could tolerate individual machine failures. The core insight is simple: if you are going to experience failures in production anyway, it is better to experience them on your terms, during business hours, with the team ready to respond, than to discover them at 3 AM during a traffic spike.

## Practical example of use

A team runs a microservices architecture with three services: an API gateway, an order service, and an inventory service. They hypothesize that if the inventory service becomes unavailable, the order service should return cached inventory data and queue orders for later processing instead of failing entirely.

To test this hypothesis, they design an experiment: inject a network failure between the order service and the inventory service for 5 minutes during low-traffic hours. They monitor order success rates, response times, and error rates. The experiment reveals that the circuit breaker trips correctly, but the fallback cache had expired entries, causing 12% of orders to fail. The team fixes the cache TTL policy and reruns the experiment, confirming the fix. This defect would have surfaced during the next real outage — now it is already resolved.

A typical chaos engineering workflow follows these steps: define the steady state (normal system behavior), form a hypothesis (what should happen when X fails), design the experiment (inject a specific failure), run the experiment (observe real behavior), and analyze the results (compare actual vs. expected behavior).

## When to use

- When operating distributed systems where individual component failures are expected and must be tolerated
- After implementing resilience patterns (circuit breakers, retries, fallbacks) to verify they work under real failure conditions
- When preparing for high-traffic events where system reliability is critical to revenue or safety
- As a regular practice to build institutional knowledge about how the system behaves under stress

## When to avoid

- On systems that have no resilience mechanisms in place — chaos experiments will simply confirm what you already know (the system will break)
- In production environments without proper observability (monitoring, alerting, tracing) to detect and measure the impact of injected failures
- When the team lacks the ability to quickly stop an experiment if it causes unexpected cascading failures
- On systems handling life-safety workloads (medical devices, air traffic control) without rigorous blast radius controls

## Trade-offs

- **Resilience confidence vs. risk of real impact**: Injecting failures in production gives the most realistic results but carries real risk of affecting users if the experiment goes wrong.
- **Proactive discovery vs. organizational readiness**: Chaos engineering requires mature observability, incident response, and a blameless culture — without these, experiments create stress without actionable outcomes.
- **Ongoing practice vs. resource investment**: Chaos engineering is most valuable as a continuous practice, not a one-time event, but it requires dedicated time, tooling, and cross-team coordination.

## Common small mistakes

- Running experiments without a clear hypothesis, turning chaos engineering into random destruction rather than scientific inquiry
- Starting with large blast radius experiments in production instead of beginning in staging or with a small percentage of traffic
- Not having a kill switch to immediately stop the experiment if the impact exceeds expectations
- Confusing chaos engineering with breaking things on purpose — the goal is to learn about the system, not to cause outages
- Ignoring the findings by not following up with engineering fixes after an experiment reveals a weakness
