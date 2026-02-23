---
title: "Prototype"
letter: "P"
categories:
  - "design-patterns"
shortDefinition: "A creational pattern that creates new objects by copying an existing object, avoiding the cost of full initialization from scratch."
---

## Why does it exist?

Sometimes creating an object from scratch is expensive — it may involve database queries, complex computation, or slow I/O. If you need many similar objects that differ only slightly, cloning an already-initialized prototype is much cheaper than repeating the full construction each time. Prototype also decouples the code that creates objects from the concrete classes of those objects, since the client only needs the interface to call `clone()`.

## Practical example of use

A game creates hundreds of enemy objects per level. Each enemy shares a base configuration loaded from a data file. Instead of reloading and parsing the configuration for every enemy, one prototype is created at startup and cloned for each spawn.

```ts
interface Cloneable<T> {
  clone(): T;
}

class Enemy implements Cloneable<Enemy> {
  constructor(
    public type: string,
    public health: number,
    public speed: number,
    public abilities: string[],
  ) {}

  clone(): Enemy {
    return new Enemy(this.type, this.health, this.speed, [...this.abilities]);
  }
}

const goblinPrototype = new Enemy("Goblin", 50, 3, ["sneak", "stab"]);

// Spawn 100 goblins cheaply
const goblins = Array.from({ length: 100 }, () => goblinPrototype.clone());
goblins[0].health = 30; // Each clone is independent
```

## When to use

- When object creation is expensive and most instances share the same initial state
- When the number of classes needed to instantiate objects would otherwise be large
- When code should be decoupled from the concrete classes of the objects it creates
- When you need to save and restore snapshots of object state (often combined with Memento)

## When to avoid

- When objects are cheap to create and cloning adds no practical benefit
- When deep cloning is complex because the object graph contains circular references or non-copyable resources (e.g., file handles, database connections)
- When the prototype's state is not well-defined enough to serve as a valid starting point for clones

## Trade-offs

- **Performance vs. clone complexity**: Cloning avoids expensive initialization, but implementing a correct deep clone for complex object graphs is non-trivial.
- **Decoupling vs. shallow copy bugs**: Using a prototype interface decouples creators from concrete types, but shallow copies sharing mutable state between clones cause subtle bugs.
- **Flexibility vs. registry management**: A prototype registry lets you create objects by name, but the registry itself must be kept consistent as new types are added.

## Common small mistakes

- Performing a shallow copy when the object contains mutable nested objects, causing unintended sharing of state between clones
- Cloning objects that contain non-serializable resources like open file handles or active network sockets
- Not exposing a `clone()` interface, making it impossible to clone objects polymorphically through a base reference
- Forgetting to update the prototype registry when new subclasses are introduced
