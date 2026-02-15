---
title: "API Gateway"
letter: "A"
categories:
  - "create-system-design"
  - "explain-architecture"
shortDefinition: "A single entry point that sits between clients and backend services, handling routing, authentication, and rate limiting."
---

## Why does it exist?

In a system with multiple backend services, clients should not need to know about each one individually. An API Gateway provides a unified interface — routing requests to the right service, handling cross-cutting concerns like authentication, rate limiting, and response transformation in one place.

## Practical example of use

A mobile app calls `api.example.com/products` and `api.example.com/orders`. The API Gateway receives both requests, validates the JWT token, routes `/products` to the Product Service and `/orders` to the Order Service, and aggregates responses if needed before sending them back to the client.

## When to use

- Microservice architectures where clients interact with multiple services
- When you need centralized authentication, rate limiting, or logging
- Mobile or single-page applications that benefit from response aggregation
- When you want to decouple client API contracts from internal service APIs

## When to avoid

- Simple monolithic applications with a single backend
- Internal service-to-service communication (use service mesh instead)
- When the gateway would become a bottleneck or single point of failure without proper scaling

## Trade-offs

- **Simplicity for clients vs. added infrastructure**: Clients get a clean API, but you maintain another service.
- **Centralized control vs. single point of failure**: One place for cross-cutting concerns, but if it goes down, everything goes down.
- **Performance**: Adds a network hop to every request.

## Common small mistakes

- Putting business logic in the gateway instead of in the services
- Not scaling the gateway — it handles all traffic and can become a bottleneck
- Overloading the gateway with too many responsibilities (transformation, orchestration, caching)
- Not implementing proper health checks and circuit breakers
