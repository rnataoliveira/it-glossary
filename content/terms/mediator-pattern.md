---
title: "Mediator"
letter: "M"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that reduces chaotic dependencies between objects by having them communicate only through a central mediator object."
---

## Why does it exist?

When many objects interact directly with each other, the result is a web of dependencies where every class knows about many others. Adding a new interaction or changing one component forces changes across multiple classes. The Mediator centralizes communication: colleagues only know the mediator, not each other. The mediator orchestrates interactions, making it easy to change how objects communicate by modifying just the mediator.

## Practical example of use

A chat room where users send messages to the room (mediator), which distributes them to other participants, rather than each user holding references to all other users.

```ts
interface Mediator {
  send(message: string, sender: Colleague): void;
}

abstract class Colleague {
  constructor(protected mediator: Mediator) {}
  abstract receive(message: string): void;
}

class ChatRoom implements Mediator {
  private colleagues: Colleague[] = [];

  register(colleague: Colleague) { this.colleagues.push(colleague); }

  send(message: string, sender: Colleague) {
    for (const colleague of this.colleagues) {
      if (colleague !== sender) colleague.receive(message);
    }
  }
}

class User extends Colleague {
  constructor(mediator: Mediator, private name: string) { super(mediator); }

  send(message: string) {
    console.log(`${this.name} sends: ${message}`);
    this.mediator.send(message, this);
  }

  receive(message: string) {
    console.log(`${this.name} receives: ${message}`);
  }
}

const room = new ChatRoom();
const alice = new User(room, "Alice");
const bob = new User(room, "Bob");
room.register(alice);
room.register(bob);
alice.send("Hello!"); // Bob receives: Hello!
```

## When to use

- When a set of objects communicate in well-defined but complex ways, creating many interdependencies
- When reusing an object is difficult because it refers to and communicates with many other objects
- When you want to customize behavior distributed across several classes without creating many subclasses
- When implementing event bus, air traffic control, UI form orchestration, or workflow coordination

## When to avoid

- When there are only two or three objects that interact — direct references are simpler
- When the mediator itself becomes a God Object that knows too much about too many colleagues
- When the communication patterns are simple and fixed — a mediator adds unnecessary indirection

## Trade-offs

- **Decoupled colleagues vs. complex mediator**: Colleagues are freed from knowing each other, but the mediator accumulates all the routing logic and can become very large.
- **Single point of control vs. single point of failure**: All communication flows through the mediator, making changes easy to coordinate but also making the mediator a bottleneck and potential failure point.
- **Reduced coupling vs. reduced reusability of the mediator**: The mediator is tightly coupled to the specific set of colleagues it orchestrates, making it hard to reuse for a different set.

## Common small mistakes

- Letting the mediator grow into a God Object with business logic that belongs in individual colleagues
- Not defining the mediator interface, coupling colleagues to a concrete mediator class
- Using Mediator when an event bus or message broker (e.g., EventEmitter, Pub/Sub) would be simpler and more scalable
- Forgetting that colleagues still need to be able to act independently when not mediated
