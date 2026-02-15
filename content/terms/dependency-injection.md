---
title: "Dependency Injection"
letter: "D"
categories:
  - "architecture"
  - "backend"
shortDefinition: "A design pattern where an object receives its dependencies from the outside rather than creating them internally."
---

## Why does it exist?

When a class creates its own dependencies -- instantiating a database client, constructing an HTTP client, or building a logger inside its constructor -- it becomes tightly coupled to those specific implementations. You cannot test the class without a real database, swap the logger for a different provider, or reuse the class in a different context. Changes to a dependency ripple through every class that constructs it.

Dependency Injection (DI) inverts this relationship. Instead of a class creating what it needs, the dependencies are passed in from the outside -- typically through the constructor. The class depends on abstractions (interfaces), not concrete implementations. This makes the code testable (inject mocks), flexible (swap implementations), and explicit about what it needs (dependencies are visible in the constructor signature).

## Practical example of use

A notification service needs to send messages and log activity. Without DI, it would create its own email client and logger. With DI, these are injected, making the service testable and adaptable.

```typescript
// --- Interfaces (abstractions) ---
interface MessageSender {
  send(to: string, body: string): Promise<void>;
}

interface Logger {
  info(message: string): void;
  error(message: string, err: Error): void;
}

// --- Service with constructor injection ---
class NotificationService {
  constructor(
    private readonly sender: MessageSender,
    private readonly logger: Logger
  ) {}

  async notify(userId: string, message: string): Promise<void> {
    try {
      this.logger.info(`Sending notification to ${userId}`);
      await this.sender.send(userId, message);
      this.logger.info(`Notification sent to ${userId}`);
    } catch (err) {
      this.logger.error(`Failed to notify ${userId}`, err as Error);
      throw err;
    }
  }
}

// --- Production wiring ---
class SmtpEmailSender implements MessageSender {
  async send(to: string, body: string): Promise<void> {
    // real SMTP logic here
  }
}

class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }
  error(message: string, err: Error): void {
    console.error(`[ERROR] ${message}`, err);
  }
}

const service = new NotificationService(
  new SmtpEmailSender(),
  new ConsoleLogger()
);

// --- Test wiring (no real email, no real logger) ---
class FakeSender implements MessageSender {
  public sent: { to: string; body: string }[] = [];
  async send(to: string, body: string): Promise<void> {
    this.sent.push({ to, body });
  }
}

class FakeLogger implements Logger {
  public logs: string[] = [];
  info(message: string): void { this.logs.push(message); }
  error(message: string): void { this.logs.push(message); }
}

// In tests:
const fakeSender = new FakeSender();
const fakeLogger = new FakeLogger();
const testService = new NotificationService(fakeSender, fakeLogger);
```

The `NotificationService` has no idea whether it is using a real SMTP server or a fake -- and it does not care. This makes unit tests fast, deterministic, and free of external dependencies.

## When to use

- Classes have dependencies on external systems (databases, APIs, file systems) that you want to mock in tests.
- You need to swap implementations at runtime or between environments (e.g., S3 in production, local filesystem in development).
- Your codebase follows SOLID principles and you want to enforce the Dependency Inversion Principle.
- You are building a library or framework that needs to be extensible by consumers who provide their own implementations.

## When to avoid

- Simple scripts or small utilities where introducing interfaces and injection adds unnecessary ceremony.
- The dependency is a pure utility with no side effects (e.g., a math helper) that does not need to be swapped or mocked.
- Over-engineering: injecting every tiny dependency (date functions, string formatters) when direct usage is clearer.

## Trade-offs

- **Testability vs. indirection**: DI makes testing trivial, but reading the code requires tracing through interfaces to find the concrete implementation.
- **Flexibility vs. wiring complexity**: You can swap any dependency, but someone must wire everything together, either manually or through a DI container, adding a setup step.
- **Explicit dependencies vs. constructor bloat**: All dependencies are visible in the constructor, but a class with many dependencies ends up with a long parameter list -- often a signal to refactor.

## Common small mistakes

- Injecting too many dependencies into a single class, which is a sign the class has too many responsibilities rather than a problem with DI itself.
- Using a DI container as a service locator (calling `container.get(X)` deep inside business logic), which hides dependencies instead of making them explicit.
- Creating interfaces for classes that will only ever have one implementation, adding abstraction without benefit.
- Forgetting to inject dependencies in test setup, leading to null reference errors that obscure the real problem being tested.
- Mixing constructor injection with property injection inconsistently, making it unclear which dependencies are required vs. optional.
