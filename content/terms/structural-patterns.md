---
title: "Structural Patterns"
letter: "S"
categories:
  - "design-patterns"
shortDefinition: "A GoF category of seven patterns that describe how to compose classes and objects into larger, flexible structures."
---

## Why does it exist?

As systems grow, code needs to combine components in ways their original designers did not anticipate — wrapping third-party libraries, building tree-shaped hierarchies, or adding cross-cutting concerns without touching existing classes. Structural patterns provide proven compositions that make these relationships manageable without rewriting existing code.

## Practical example of use

A React application needs to add analytics tracking to dozens of existing UI components without modifying each one. Using the Decorator pattern, a higher-order component wraps any component and fires a tracking event on click. The original components are untouched; the behavior is layered on top. The same principle applies in backend code when wrapping repository classes with caching or logging decorators.

## When to use

- When you need to adapt an interface to one a client expects without modifying the original
- When you want to add or compose behaviors at runtime rather than through inheritance
- When a system has complex object trees that should be treated uniformly (whole vs. part)
- When you need to reduce the cost of many fine-grained objects that share state

## When to avoid

- When the relationships are simple enough that composition via constructor injection is sufficient
- When a pattern would add layers of abstraction for a single, stable use case
- When the team is unfamiliar with the pattern and the cognitive overhead outweighs the benefit

## Trade-offs

- **Flexibility vs. complexity**: Structural patterns allow runtime composition but introduce extra classes and interfaces.
- **Open/Closed adherence vs. transparency**: Wrapping existing classes preserves them but makes the call stack less obvious.
- **Reusability vs. indirection**: Shared flyweight state or adapter layers enable reuse but require careful lifecycle management.

## Common small mistakes

- Confusing Adapter with Facade — Adapter converts an interface, Facade simplifies multiple interfaces
- Using Decorator when simple subclassing with a clear hierarchy would be more readable
- Creating deep Decorator chains that make debugging and stack traces painful
- Letting Facade become a dumping ground for business logic instead of just delegating to subsystems
