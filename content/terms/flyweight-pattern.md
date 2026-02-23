---
title: "Flyweight"
letter: "F"
categories:
  - "design-patterns"
shortDefinition: "A structural pattern that reduces memory usage by sharing as much data as possible between similar objects."
---

## Why does it exist?

When an application creates a very large number of similar objects, memory consumption can become prohibitive. Flyweight recognizes that many objects share intrinsic state (data that is the same across all instances) and extrinsic state (data that varies per context). By factoring out the intrinsic state into a shared flyweight object and passing extrinsic state at use time, the number of distinct objects in memory can be reduced by orders of magnitude.

## Practical example of use

A text editor renders millions of characters. Each character shares a font and style (intrinsic), but has a unique position on screen (extrinsic). Instead of allocating one object per character with all data, flyweight objects represent each unique (character, font, style) combination.

```ts
class CharacterFlyweight {
  constructor(
    public readonly char: string,
    public readonly font: string,
    public readonly size: number,
  ) {}

  render(x: number, y: number) {
    console.log(`Rendering '${this.char}' at (${x},${y}) in ${this.font} ${this.size}pt`);
  }
}

class FlyweightFactory {
  private cache = new Map<string, CharacterFlyweight>();

  get(char: string, font: string, size: number): CharacterFlyweight {
    const key = `${char}-${font}-${size}`;
    if (!this.cache.has(key)) {
      this.cache.set(key, new CharacterFlyweight(char, font, size));
    }
    return this.cache.get(key)!;
  }
}

const factory = new FlyweightFactory();
const a = factory.get("a", "Arial", 12);
a.render(10, 20);
a.render(50, 30); // same flyweight, different extrinsic state
```

## When to use

- When an application uses a very large number of objects that consume too much RAM
- When most object state can be made extrinsic and passed in from outside
- When many groups of objects may be replaced by relatively few shared objects once extrinsic state is separated
- When the application does not depend on object identity (two flyweights representing the same data must be interchangeable)

## When to avoid

- When the number of objects is small enough that memory consumption is not a concern
- When it is difficult or unnatural to separate intrinsic and extrinsic state
- When objects need to maintain their own identity and mutable individual state
- When the runtime cost of looking up flyweights from a factory is more expensive than just allocating objects

## Trade-offs

- **Memory reduction vs. runtime overhead**: Sharing flyweights reduces memory significantly, but each use requires a factory lookup and extrinsic state must be passed at call time.
- **Object immutability vs. flexibility**: Flyweight objects must be immutable (intrinsic state only) — any mutable shared state would cause interference between all users of the flyweight.
- **Complexity vs. necessity**: The pattern requires careful separation of state and a factory, adding complexity that is only justified at very large scale.

## Common small mistakes

- Putting mutable or context-specific state into the flyweight, causing all users to share and corrupt that state
- Not using a factory with a cache — creating new flyweight objects on every call defeats the purpose of sharing
- Applying Flyweight when there are only a few hundred objects, adding complexity for negligible benefit
- Forgetting that if extrinsic state is expensive to compute or pass, the savings from sharing intrinsic state can be negated
