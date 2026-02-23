---
title: "Behavioral Patterns"
letter: "B"
categories:
  - "design-patterns"
shortDefinition: "A GoF category of eleven patterns that define how objects communicate, distribute responsibility, and encapsulate algorithms."
---

## Why does it exist?

Once objects are created and composed, the next challenge is how they interact. Behavioral patterns address communication complexity — how to avoid hardcoded dependencies between senders and receivers, how to encapsulate varying algorithms, how to traverse structures without exposing internals, and how to capture and restore state. They replace tangled conditional logic with clear, extensible structures.

## Practical example of use

An e-commerce checkout has different discount rules: loyalty discounts, seasonal promotions, coupon codes. Without a behavioral pattern, this becomes a growing chain of `if/else if`. With the Strategy pattern, each discount rule is encapsulated in a class implementing a `DiscountStrategy` interface. The checkout calculates the final price by calling `strategy.apply(cart)`, making it trivial to add new rules or change them at runtime based on user context.

## When to use

- When an algorithm or behavior varies and you want to select it at runtime
- When a sender should not know which object handles its request
- When an object's state changes should automatically notify dependents
- When you need to encapsulate a request as an object to support undo, queuing, or logging

## When to avoid

- When the behavior is fixed and a simple function or method is clearer
- When the pattern introduces an abstraction hierarchy for a single algorithm with no anticipated variation
- When observer chains or mediator hubs grow so large they become maintenance problems themselves

## Trade-offs

- **Loose coupling vs. traceability**: Behavioral patterns decouple senders from receivers, but tracing the flow of a request through observers, mediators, or chains of responsibility is harder.
- **Extensibility vs. proliferation**: Adding new behaviors via Strategy or Command is clean, but large systems can accumulate many small classes.
- **Expressiveness vs. overhead**: Patterns like Command or Memento allow rich features (undo, replay) at the cost of extra object allocation and storage.

## Common small mistakes

- Using Observer when a simpler callback or event bus would be clearer
- Building a Chain of Responsibility with no default handler, silently swallowing unhandled requests
- Implementing Strategy but then branching on the strategy type internally, defeating the purpose
- Overusing Mediator until it becomes a god object that knows too much about too many colleagues
