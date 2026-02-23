---
title: "Creational Patterns"
letter: "C"
categories:
  - "design-patterns"
shortDefinition: "A GoF category of five patterns that control how objects are created, hiding the construction logic from the caller."
---

## Why does it exist?

Object creation can become a source of tight coupling. When callers directly instantiate concrete classes with `new`, they become dependent on specific implementations, making substitution, testing, and configuration difficult. Creational patterns encapsulate the instantiation logic so that callers depend on abstractions instead of concrete types, giving the system flexibility to decide what to create, how to create it, and when.

## Practical example of use

A game engine needs to spawn enemies of different types depending on the current level. Instead of scattering `new Goblin()` and `new Dragon()` throughout the game loop, a Factory Method or Abstract Factory is introduced. The game loop calls `enemy = enemyFactory.create()` and never knows which concrete class it received. Swapping enemy types for a new level means swapping the factory, not rewriting the spawning logic.

## When to use

- When object creation is complex, conditional, or must vary at runtime
- When you want to decouple the caller from the concrete class being instantiated
- When you need controlled access to instances (e.g., limiting to one, or pooling)
- When the exact type of object to create is determined by configuration or context

## When to avoid

- When a plain `new` call is all that is needed and complexity would be artificial
- When the codebase is small enough that the abstraction adds more cognitive load than it removes
- When the pattern is applied speculatively for future flexibility that never materializes

## Trade-offs

- **Flexibility vs. indirection**: Creational patterns make it easy to swap implementations but add layers that can make tracing object creation harder.
- **Testability vs. complexity**: Factories and builders make unit testing easier by allowing injection of test doubles, but they introduce additional classes to maintain.
- **Decoupling vs. discoverability**: Hiding `new` behind an interface reduces coupling but makes it less obvious which concrete type is in use during code review.

## Common small mistakes

- Using Singleton when what you actually need is dependency injection
- Overusing Factory when a simple constructor with parameters would be clearer
- Creating a factory hierarchy that mirrors the class hierarchy exactly, doubling maintenance burden
- Ignoring thread safety when implementing Singleton or object pools in concurrent environments
