---
title: "Adapter"
letter: "A"
categories:
  - "design-patterns"
shortDefinition: "A structural pattern that converts the interface of a class into another interface that clients expect, enabling incompatible interfaces to work together."
---

## Why does it exist?

Third-party libraries, legacy code, and external APIs rarely match the interface your application expects. Modifying the original class is often impossible (third-party) or risky (legacy). The Adapter wraps the incompatible class and exposes the interface the client expects, bridging the gap without touching either side.

## Practical example of use

Your application expects a `Logger` interface with a `log(message: string)` method, but the third-party logging library you adopted exposes `write(level: string, msg: string)`. An Adapter wraps the library and translates calls.

```ts
interface Logger {
  log(message: string): void;
}

class ThirdPartyLogger {
  write(level: string, msg: string) {
    console.log(`[${level}] ${msg}`);
  }
}

class LoggerAdapter implements Logger {
  constructor(private thirdParty: ThirdPartyLogger) {}

  log(message: string) {
    this.thirdParty.write("INFO", message);
  }
}

const adapter: Logger = new LoggerAdapter(new ThirdPartyLogger());
adapter.log("Application started");
```

## When to use

- When you want to use an existing class but its interface does not match what you need
- When integrating a third-party library or legacy component whose source you cannot or should not modify
- When you want to create a reusable class that cooperates with unrelated or unforeseen classes

## When to avoid

- When you control both sides of the interface and can modify one of them directly
- When the interface mismatch is so fundamental that an adapter would need to perform substantial logic beyond translation
- When the cost of wrapping and indirection outweighs the benefit of keeping the adaptee unchanged

## Trade-offs

- **Integration without modification vs. added indirection**: Adapters let incompatible code work together without touching either side, but add a layer that can obscure what is happening.
- **Reusability vs. proliferation**: A well-designed adapter lets you swap the adaptee without touching the client, but large codebases can accumulate many thin adapter classes.
- **Isolation vs. leaky abstraction**: If the adaptee's behavior bleeds through the adapter interface (e.g., different error types), the abstraction breaks.

## Common small mistakes

- Adapting too much — letting the adapter contain business logic instead of just translating interface calls
- Not adapting exceptions and error types, so the adaptee's internal error model leaks through
- Creating an adapter that only works with one specific adaptee version, breaking when the third-party library updates
- Confusing Adapter (interface translation) with Facade (interface simplification of a subsystem)
