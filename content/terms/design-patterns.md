---
title: "Design Patterns"
letter: "D"
categories:
  - "architecture"
  - "design-patterns"
shortDefinition: "Reusable solutions to commonly occurring problems in software design, providing a shared vocabulary for developers."
---

## Why does it exist?

Developers encounter the same structural problems repeatedly — how to create objects flexibly, how to compose behaviors, how to manage state transitions. Design patterns document proven solutions so teams can communicate using a shared vocabulary instead of reinventing solutions from scratch.

## Practical example of use

A notification system needs to support email, SMS, and push notifications. Instead of a giant `if/else` chain, the Strategy pattern is applied: a `NotificationStrategy` interface with `EmailStrategy`, `SMSStrategy`, and `PushStrategy` implementations. Adding a new channel means adding a new strategy class — no existing code changes.

## When to use

- When you recognize a recurring structural problem that a pattern solves well
- When communicating architectural decisions with a team
- When you need to decouple components or make code extensible
- Refactoring existing code to improve clarity and flexibility

## When to avoid

- When the problem is simple and a pattern adds unnecessary complexity
- When you are pattern-matching a solution to a problem that does not fit
- Prototype code where speed outweighs structure

## Trade-offs

- **Clarity vs. indirection**: Patterns introduce abstractions that can make code harder to trace.
- **Reusability vs. over-engineering**: Not every variation warrants a full pattern implementation.
- **Shared vocabulary vs. barrier to entry**: Patterns help experienced developers communicate but can confuse newcomers.

## Common small mistakes

- Forcing a pattern where none is needed (pattern-itis)
- Using patterns as a substitute for understanding the actual problem
- Implementing patterns exactly as described in textbooks without adapting to the language or framework
- Not recognizing when a framework already implements the pattern for you
