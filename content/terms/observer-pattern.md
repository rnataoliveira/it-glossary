---
title: "Observer"
letter: "O"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that defines a one-to-many dependency so that when one object changes state, all its dependents are notified and updated automatically."
---

## Why does it exist?

When one object's state change must trigger updates in other objects, and you do not know in advance how many objects need to react or which they are, hardcoding the notifications creates tight coupling. Observer makes the subject (observable) maintain a list of observers and notify them automatically on state change. Observers register themselves; the subject knows nothing specific about them beyond the observer interface.

## Practical example of use

A stock price feed that notifies any number of display widgets when the price updates.

```ts
interface Observer {
  update(price: number): void;
}

class StockFeed {
  private observers: Observer[] = [];
  private price = 0;

  subscribe(observer: Observer) { this.observers.push(observer); }
  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  setPrice(price: number) {
    this.price = price;
    this.observers.forEach(o => o.update(price));
  }
}

class PriceDisplay implements Observer {
  constructor(private name: string) {}
  update(price: number) { console.log(`${this.name}: $${price}`); }
}

const feed = new StockFeed();
const display1 = new PriceDisplay("Dashboard");
const display2 = new PriceDisplay("Mobile App");
feed.subscribe(display1);
feed.subscribe(display2);
feed.setPrice(150.25); // Both displays notified
```

## When to use

- When a change in one object requires notifying an unknown number of other objects
- When objects should be able to notify other objects without knowing who those objects are
- When implementing event systems, reactive data bindings, or pub/sub within a component
- When you want to enforce the Open/Closed Principle — new observers can be added without modifying the subject

## When to avoid

- When the order of observer notification matters and must be guaranteed — this is hard to manage with dynamic observer lists
- When observers trigger cascading updates that create complex, hard-to-trace chains of notifications
- When there is only one observer and the relationship will never change — a direct reference is simpler

## Trade-offs

- **Loose coupling vs. unexpected updates**: Subjects and observers are decoupled, but observers may receive updates at unexpected times or frequencies.
- **Dynamic subscription vs. memory leaks**: Observers can register and unregister dynamically, but forgetting to unsubscribe keeps observers (and their referenced objects) alive longer than needed.
- **Simplicity vs. notification cascade**: The pattern is simple to implement, but complex observer graphs can produce notification cascades that are hard to debug.

## Common small mistakes

- Forgetting to unsubscribe observers, causing memory leaks and stale notifications being sent to destroyed objects
- Notifying observers while the subject's state is still being updated, allowing observers to see an inconsistent intermediate state
- Allowing observers to modify the subject during notification, causing re-entrant notification loops
- Not defining which thread notifications are delivered on in multi-threaded environments, causing concurrency bugs
