---
title: "Monolith"
letter: "M"
categories:
  - "explain-architecture"
shortDefinition: "A single, unified application where all components share one codebase, one deployment, and one process."
---

## Why does it exist?

The monolithic architecture is the most natural way to build software. Before distributed systems became mainstream, applications were built as single deployable units because it was simpler to develop, test, and reason about. It remains a pragmatic starting point for most projects because it avoids the operational complexity of distributed architectures while still allowing internal modularization.

## Practical example of use

A startup building an e-commerce platform deploys a single Rails application that handles user authentication, product catalog, shopping cart, payment processing, and order management. All modules share one PostgreSQL database and are deployed together to a single server. The team of five developers can run the entire application locally, debug issues with a single stack trace, and ship features multiple times per day without coordinating across services.

## When to use

- You are in the early stages of a product and the domain boundaries are not yet clear
- Your team is small (fewer than 10 developers) and cross-cutting changes are frequent
- You need fast iteration speed and cannot afford the overhead of managing multiple deployments
- The application has modest scale requirements that a single well-provisioned server can handle

## When to avoid

- Multiple teams need to deploy different parts of the system on independent schedules
- Parts of the application have drastically different scaling requirements (e.g., image processing vs. serving static pages)
- The codebase has grown so large that build times, test suites, and deployment cycles are slowing the team down

## Trade-offs

- **Simple operations vs. limited scalability**: One deployment pipeline is easy to manage, but you cannot scale individual components independently.
- **Fast local development vs. growing complexity**: Everything runs in one process for easy debugging, but as the codebase grows, understanding the full system becomes harder.
- **Consistent data access vs. tight coupling**: Direct database queries across modules are straightforward, but they create hidden dependencies that make future extraction difficult.

## Common small mistakes

- Treating "monolith" as inherently bad — a well-structured monolith is far better than a poorly designed set of microservices
- Skipping internal module boundaries, leading to a "big ball of mud" where everything depends on everything
- Sharing database tables freely between modules instead of defining clear internal APIs or service objects
- Waiting too long to extract components when the codebase has clearly outgrown a single deployment unit
