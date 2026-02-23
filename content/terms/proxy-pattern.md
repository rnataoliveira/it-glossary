---
title: "Proxy"
letter: "P"
categories:
  - "design-patterns"
shortDefinition: "A structural pattern that provides a surrogate object that controls access to another object, adding a layer for lazy loading, caching, access control, or logging."
---

## Why does it exist?

Direct access to an object is not always desirable or practical. The object may be expensive to create, located on a remote machine, require access control, or benefit from transparent caching. A Proxy implements the same interface as the real object and intercepts calls to it, adding behavior before or after delegating. Clients cannot tell whether they are talking to the proxy or the real object.

## Practical example of use

A virtual proxy for a large image delays loading the actual image data until the first time it is actually rendered.

```ts
interface Image {
  display(): void;
}

class RealImage implements Image {
  private data: string;
  constructor(private filename: string) {
    // Simulate expensive load
    this.data = `<binary data of ${filename}>`;
    console.log(`Loaded ${filename} from disk`);
  }
  display() { console.log(`Displaying ${this.filename}`); }
}

class ProxyImage implements Image {
  private realImage: RealImage | null = null;
  constructor(private filename: string) {}

  display() {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename); // Load only when needed
    }
    this.realImage.display();
  }
}

const image: Image = new ProxyImage("photo.jpg");
// Image not yet loaded
image.display(); // Loaded here
image.display(); // Already loaded, just displays
```

## When to use

- **Virtual proxy**: Defer expensive object creation until it is actually needed (lazy initialization)
- **Remote proxy**: Provide a local representative for an object in a different address space or remote server
- **Protection proxy**: Control access to the original object based on access rights
- **Caching proxy**: Cache results of expensive operations and return cached data for repeated identical calls
- **Logging proxy**: Record all calls to an object without modifying it

## When to avoid

- When there is no meaningful behavior to add between the client and the real object — the proxy becomes a pointless passthrough
- When the added indirection increases latency in a performance-critical path without sufficient benefit
- When the proxy interface grows complex and diverges from the real subject, breaking transparency

## Trade-offs

- **Transparency vs. behavior change**: Clients believe they are using the real object, which is useful but also means bugs in the proxy are non-obvious.
- **Lazy loading vs. timing unpredictability**: Virtual proxies delay initialization, but the first call is suddenly slow when the real object is created, creating latency spikes.
- **Separation of concerns vs. interface coupling**: The proxy must implement the full interface of the real subject, creating maintenance burden when that interface changes.

## Common small mistakes

- Implementing a proxy that does not faithfully forward all methods to the real subject, silently swallowing calls
- Forgetting thread safety in a caching or virtual proxy that may be initialized concurrently
- Using Proxy when Decorator would be more appropriate — Proxy controls access to a specific object; Decorator adds behavior that can be stacked
- Letting the proxy accumulate domain logic that belongs in the real subject
