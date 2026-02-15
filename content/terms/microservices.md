---
title: "Microservices"
letter: "M"
categories:
  - "architecture"
  - "backend"
shortDefinition: "An architectural style where an application is composed of small, independent services that communicate over a network."
---

## Why does it exist?

Monolithic applications become harder to change, deploy, and scale as they grow. Microservices break a large system into smaller, focused services that can be developed, deployed, and scaled independently. Each team can own a service end-to-end, using the best technology for that specific problem.

## Practical example of use

An online marketplace splits into services: User Service, Product Catalog, Order Service, Payment Service, and Notification Service. Each runs independently, has its own database, and communicates via REST APIs or message queues. The product team can deploy catalog changes without touching payments.

## When to use

- Large teams where independent deployment is important
- Systems with components that have very different scaling needs
- When different parts of the system benefit from different technology choices
- Organizations practicing DevOps with mature CI/CD pipelines

## When to avoid

- Small teams (under 5-8 developers) — the operational overhead is not worth it
- Early-stage startups still finding product-market fit
- When the domain boundaries are unclear or frequently changing
- If the team lacks experience with distributed systems

## Trade-offs

- **Autonomy vs. complexity**: Teams move faster independently, but debugging across services is harder.
- **Scalability vs. overhead**: Each service can scale independently, but you need service discovery, load balancing, and monitoring for each one.
- **Flexibility vs. consistency**: Teams can choose their own tech stack, but this can lead to fragmentation.

## Common small mistakes

- Creating too many services too early (nano-services)
- Sharing databases between services, defeating the purpose of independence
- Not investing in observability (distributed tracing, centralized logging)
- Synchronous communication everywhere, creating tight coupling
- Ignoring data consistency across service boundaries
