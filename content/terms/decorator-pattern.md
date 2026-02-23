---
title: "Decorator"
letter: "D"
categories:
  - "design-patterns"
shortDefinition: "A structural pattern that attaches additional responsibilities to an object dynamically by wrapping it in decorator objects that share its interface."
---

## Why does it exist?

Subclassing is a rigid way to extend behavior: you must decide at compile time what combinations of behaviors you need, and each combination requires a new subclass. Decorator extends an object's behavior at runtime by wrapping it in another object that adds the new behavior and then delegates to the original. Wrappers can be stacked, producing any combination of behaviors without a class explosion.

## Practical example of use

A text stream that can be compressed, encrypted, and buffered in any combination. Each concern is a decorator that wraps the previous stream.

```ts
interface DataSource {
  write(data: string): void;
  read(): string;
}

class FileDataSource implements DataSource {
  private data = "";
  write(data: string) { this.data = data; }
  read() { return this.data; }
}

class CompressionDecorator implements DataSource {
  constructor(private wrapped: DataSource) {}
  write(data: string) { this.wrapped.write(`compressed(${data})`); }
  read() { return `decompressed(${this.wrapped.read()})`; }
}

class EncryptionDecorator implements DataSource {
  constructor(private wrapped: DataSource) {}
  write(data: string) { this.wrapped.write(`encrypted(${data})`); }
  read() { return `decrypted(${this.wrapped.read()})`; }
}

const source = new EncryptionDecorator(
  new CompressionDecorator(new FileDataSource())
);
source.write("hello");
console.log(source.read()); // decrypted(decompressed(compressed(encrypted(hello))))
```

## When to use

- When you need to add responsibilities to individual objects dynamically and transparently
- When extension by subclassing is impractical because it would create a large number of independent extensions
- When behaviors should be composable at runtime in any combination
- When you want to add cross-cutting concerns (logging, caching, validation) without modifying the core class

## When to avoid

- When the component interface is very large — decorators must implement every method, even irrelevant ones
- When the order of decorators matters in non-obvious ways that are hard to document and enforce
- When a simpler solution like a single subclass or a composition with an explicit options object is more readable

## Trade-offs

- **Runtime flexibility vs. identity confusion**: Decorators can be stacked at runtime, but a decorated object is not the same instance as the original, which can break identity checks.
- **Composability vs. deep stacks**: Any combination of behaviors is possible, but long decorator chains are hard to debug and trace.
- **Single-responsibility vs. interface coupling**: Each decorator has one job, but all decorators must implement the entire component interface, creating boilerplate.

## Common small mistakes

- Implementing a decorator that does not delegate all methods to the wrapped component, silently swallowing behavior
- Stacking decorators in the wrong order — the outermost decorator executes first, so order matters significantly
- Using Decorator when a simple subclass with overriding one method would be cleaner
- Applying Decorator to a class with a large interface, forcing many no-op delegation methods in each decorator
