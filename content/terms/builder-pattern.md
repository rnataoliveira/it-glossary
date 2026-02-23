---
title: "Builder"
letter: "B"
categories:
  - "design-patterns"
shortDefinition: "A creational pattern that separates the construction of a complex object from its representation, building it step by step."
---

## Why does it exist?

Some objects require many parameters or configuration steps, and the order or combination of steps matters. Telescoping constructors — `new Car(make, model, color, doors, sunroof, GPS, ...)` — quickly become unreadable and error-prone. Builder extracts the construction steps into a dedicated builder object, letting callers configure only what they need, in a readable way, and then retrieve the finished product.

## Practical example of use

An HTTP client builder allows configuring a request step by step without a giant constructor.

```ts
class HttpRequest {
  constructor(
    public readonly url: string,
    public readonly method: string,
    public readonly headers: Record<string, string>,
    public readonly body?: string,
    public readonly timeout?: number,
  ) {}
}

class HttpRequestBuilder {
  private method = "GET";
  private headers: Record<string, string> = {};
  private body?: string;
  private timeout?: number;

  constructor(private url: string) {}

  withMethod(method: string) { this.method = method; return this; }
  withHeader(key: string, value: string) { this.headers[key] = value; return this; }
  withBody(body: string) { this.body = body; return this; }
  withTimeout(ms: number) { this.timeout = ms; return this; }

  build(): HttpRequest {
    return new HttpRequest(this.url, this.method, this.headers, this.body, this.timeout);
  }
}

const request = new HttpRequestBuilder("https://api.example.com/data")
  .withMethod("POST")
  .withHeader("Content-Type", "application/json")
  .withBody(JSON.stringify({ key: "value" }))
  .withTimeout(5000)
  .build();
```

## When to use

- When constructing an object requires many optional parameters or configuration steps
- When the same construction process should produce different representations
- When you want to prevent partially constructed (invalid) objects from existing
- When construction logic is complex enough to warrant its own class

## When to avoid

- When the object has only a few required parameters — a simple constructor is clearer
- When a plain object literal or options object pattern (`{ url, method, headers }`) solves the readability problem without extra classes
- When the Builder class grows to mirror every field of the product, adding boilerplate without real benefit

## Trade-offs

- **Readability vs. verbosity**: Builder calls read like prose and make optional fields explicit, but they introduce more code than a constructor call.
- **Immutability vs. step-by-step construction**: Builders make it easy to produce immutable objects by calling `build()` once, but the builder itself is mutable state until that point.
- **Validation centralization vs. deferred errors**: Putting validation in `build()` centralizes checks, but errors are raised late, after all configuration steps are done.

## Common small mistakes

- Allowing `build()` to produce an object in an invalid state because required fields were not validated
- Using Builder when a plain options object or named parameters (in languages that support them) would be simpler
- Mutating the product directly on the builder instead of accumulating parameters and constructing at the end
- Forgetting to return `this` from each setter method, breaking the fluent chaining interface
