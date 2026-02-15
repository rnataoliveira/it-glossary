---
title: "Domain-Driven Design"
letter: "D"
categories:
  - "explain-architecture"
  - "improve-maintainability"
shortDefinition: "A software design approach that models code around the business domain, using a shared language between developers and domain experts."
---

## Why does it exist?

Most software failures are not technical — they are communication failures. Domain-Driven Design (DDD) was introduced by Eric Evans to close the gap between how business experts think about problems and how developers model them in code. By establishing a ubiquitous language and aligning code structure with business concepts, DDD reduces misunderstandings and makes the system easier to evolve as the business changes.

## Practical example of use

An insurance company builds a claims processing system. Instead of organizing code by technical layers (controllers, services, repositories), the team identifies bounded contexts: Policy Management, Claims Adjudication, and Payments. Within Claims Adjudication, they define entities like `Claim`, `Assessment`, and `Settlement` with value objects such as `ClaimAmount` and `PolicyNumber`. The domain experts and developers use the same terms in meetings and in code, so when a business rule changes — for example, "claims under $500 are auto-approved" — the developer knows exactly where to modify the `AutoApprovalPolicy` class.

## When to use

- The business domain is complex and has nuanced rules that cannot be captured by simple CRUD operations
- You are building long-lived software where the cost of misunderstanding the domain compounds over time
- Multiple teams work on the same system and need clear boundaries to avoid stepping on each other
- Domain experts are available and willing to collaborate closely with the development team

## When to avoid

- The application is primarily data-entry or CRUD with minimal business logic
- The project is a short-lived prototype or proof-of-concept where speed matters more than correctness
- The team lacks access to domain experts who can validate the model

## Trade-offs

- **Accurate business modeling vs. upfront investment**: The domain model closely mirrors reality, but requires significant time in workshops and collaboration before writing code.
- **Clear boundaries vs. duplication**: Bounded contexts prevent unwanted coupling, but may require duplicating data or concepts across contexts.
- **Evolving design vs. learning curve**: DDD provides patterns for managing change, but the vocabulary (aggregates, value objects, domain events) takes time for the team to internalize.

## Common small mistakes

- Applying DDD patterns everywhere instead of reserving them for the core domain where complexity justifies the cost
- Creating anemic domain models that are just data holders with all logic living in service classes
- Treating bounded contexts as microservices by default — a bounded context is a logical boundary, not necessarily a deployment boundary
- Skipping the ubiquitous language work and jumping straight into aggregate design without understanding the domain
