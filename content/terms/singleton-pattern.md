---
title: "Singleton"
letter: "S"
categories:
  - "design-patterns"
shortDefinition: "A creational pattern that ensures a class has exactly one instance and provides a global access point to it."
---

## Why does it exist?

Some resources must exist only once in a process — a configuration object, a connection pool, a registry, or a hardware interface driver. Without discipline, multiple instances of these can be created accidentally, leading to inconsistent state or wasted resources. Singleton makes the uniqueness constraint explicit and enforced by the class itself, so callers cannot accidentally create a second copy.

## Practical example of use

A logging service should write to a single file handle. Implementing it as a Singleton ensures every module in the application that calls `Logger.getInstance()` receives the same object, with the same file handle, without any module needing to pass the logger around explicitly.

```ts
class Logger {
  private static instance: Logger;
  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
}

const logger = Logger.getInstance();
logger.log("App started");
```

## When to use

- When exactly one instance is needed to coordinate actions across a system (e.g., a thread pool, config manager, or device driver)
- When you need lazy initialization of an expensive resource
- When global state is unavoidable and you want to make it explicit and controlled

## When to avoid

- When the "global instance" desire is actually a disguised need for dependency injection
- When unit tests need to swap the instance for a mock — Singletons make this difficult without extra scaffolding
- When you reach for it simply to avoid passing arguments — that is a code smell, not a valid use case

## Trade-offs

- **Controlled instance vs. hidden dependency**: The caller does not need to know where the instance comes from, but the dependency is invisible and hard to trace.
- **Lazy init vs. thread safety**: Lazy initialization saves resources, but in multi-threaded environments requires double-checked locking or an initialization-on-demand holder to prevent race conditions.
- **Convenience vs. testability**: Singletons are easy to call anywhere but make test isolation painful because state persists between test runs.

## Common small mistakes

- Not handling thread safety — two threads both checking `instance == null` simultaneously can create two instances
- Using Singleton for services that actually benefit from multiple instances (e.g., different loggers per module)
- Making Singleton act as a service locator by storing unrelated dependencies on it
- Forgetting to reset Singleton state between tests, causing test order dependency
