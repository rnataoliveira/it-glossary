---
title: "SOLID"
letter: "S"
categories:
  - "architecture"
shortDefinition: "Five design principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) that make object-oriented code more maintainable."
---

## Why does it exist?

As codebases grow, poorly structured code becomes expensive to change. SOLID principles provide guidelines for organizing code so that it is easier to understand, extend, and refactor. They reduce coupling between components and make the system more resilient to change.

## Practical example of use

Instead of a single `UserService` class that handles registration, email sending, and database access, you apply Single Responsibility: `UserRegistration` handles the flow, `EmailSender` sends emails, and `UserRepository` manages persistence. Each can be changed or tested independently.

## When to use

- Any object-oriented codebase that will be maintained over time
- When building libraries or frameworks used by other developers
- When you notice classes growing too large or methods doing too many things
- During code reviews as a shared vocabulary for design feedback

## When to avoid

- Throwaway scripts or one-off utilities
- Very early prototypes where speed matters more than structure
- When strict adherence leads to over-abstraction (pragmatism over dogma)

## Trade-offs

- **Flexibility vs. indirection**: More interfaces and abstractions make code extensible but harder to follow.
- **Testability vs. complexity**: Dependency injection improves testability but adds wiring code.
- **Purity vs. pragmatism**: Blindly following SOLID can create unnecessary abstractions for simple problems.

## Common small mistakes

- Applying SOLID dogmatically to trivial code, creating excessive indirection
- Confusing Single Responsibility with "one method per class"
- Creating interfaces for everything even when there is only one implementation
- Ignoring SOLID entirely, leading to god classes and tight coupling
- Not understanding Liskov Substitution and creating broken inheritance hierarchies
