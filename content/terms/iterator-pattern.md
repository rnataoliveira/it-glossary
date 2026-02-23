---
title: "Iterator"
letter: "I"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that provides a way to access elements of a collection sequentially without exposing the underlying representation."
---

## Why does it exist?

Collections can be implemented as arrays, linked lists, trees, graphs, or custom data structures. Client code that needs to traverse a collection should not need to know its internal structure. Iterator separates the traversal logic from the collection, providing a uniform interface (`hasNext`, `next`) regardless of the underlying structure. Multiple iterators can traverse the same collection independently without interfering with each other.

## Practical example of use

A custom range collection with a lazy iterator that generates values on demand, without allocating the full array.

```ts
class Range {
  constructor(private start: number, private end: number, private step = 1) {}

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    const step = this.step;

    return {
      next(): IteratorResult<number> {
        if (current < end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { value: undefined as any, done: true };
      }
    };
  }
}

const range = new Range(0, 10, 2);
for (const n of range) {
  console.log(n); // 0, 2, 4, 6, 8
}
```

## When to use

- When you want to access a collection's elements without exposing its internal structure
- When you need multiple simultaneous traversals of the same collection
- When you want a uniform traversal interface across collections with different implementations
- When traversal logic is complex (tree traversal strategies, filtered/transformed iteration) and should be extracted

## When to avoid

- When the collection is simple (a plain array) and the language already provides adequate iteration support
- When adding an iterator abstraction for a one-off traversal adds more complexity than the direct access it replaces
- When the iterator must keep significant state to track position, making it as complex as the collection itself

## Trade-offs

- **Encapsulation vs. performance**: The iterator hides collection internals, but for performance-critical loops, going through an iterator interface can be slower than direct index access.
- **Multiple traversals vs. state management**: Multiple independent iterators are possible, but each iterator must independently track position, adding memory overhead for large numbers of concurrent iterators.
- **Uniform interface vs. lost type information**: Iterating through a generic interface can obscure the type and capabilities of the underlying collection.

## Common small mistakes

- Modifying the collection while iterating without defining the behavior of the iterator in that case
- Not making iterators implement the standard iteration protocol of the language (e.g., `Symbol.iterator` in JavaScript), missing interoperability with built-in loops
- Creating a stateful iterator that is not safe to use concurrently from multiple threads
- Returning the same iterator object from `[Symbol.iterator]()` on the iterator itself when the collection is meant to be re-iterable
