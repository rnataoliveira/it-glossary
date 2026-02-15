---
title: "Scalability"
letter: "S"
categories:
  - "architecture"
  - "performance"
shortDefinition: "The ability of a system to handle growing amounts of work by adding resources rather than rewriting code."
---

## Why does it exist?

Software systems rarely start at peak load. Scalability ensures that as user count, data volume, or request rate grows, the system can adapt without a full redesign. Without scalability planning, success can become a system's worst enemy — more users means more crashes.

## Practical example of use

A social media app starts on a single server. As it grows, horizontal scaling is applied: multiple app servers behind a load balancer, a read replica for the database, and a CDN for static assets. Each layer can grow independently as demand increases.

## When to use

- When you expect user growth or variable traffic patterns
- Multi-tenant SaaS applications
- Systems that process large volumes of data or events
- Any production system with uptime requirements

## When to avoid

- Internal tools with a fixed, small user base
- Prototypes or MVPs where you are still validating the idea
- When scaling prematurely would waste engineering time and money

## Trade-offs

- **Vertical vs. horizontal**: Scaling up (bigger machine) is simpler but has limits. Scaling out (more machines) is more flexible but adds distributed systems complexity.
- **Cost vs. capacity**: Over-provisioning wastes money; under-provisioning causes outages.
- **Consistency vs. availability**: Distributed systems must choose trade-offs (see CAP Theorem).

## Common small mistakes

- Premature optimization — scaling before there is a real bottleneck
- Assuming vertical scaling will always work (it has hard limits)
- Not load testing to find actual bottlenecks
- Scaling the wrong layer (e.g., adding app servers when the database is the bottleneck)
- Ignoring stateful components like sessions or file uploads that break horizontal scaling
