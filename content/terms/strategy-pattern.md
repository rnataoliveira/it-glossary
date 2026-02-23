---
title: "Strategy"
letter: "S"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable so the algorithm can vary independently from the clients that use it."
---

## Why does it exist?

When a class needs to perform a task but there are multiple algorithms for doing it, embedding all the variants with `if/else` or `switch` makes the class hard to maintain and impossible to extend without modifying it. Strategy extracts each algorithm into its own class with a common interface. The context class holds a reference to a strategy and delegates the work to it. Swapping the strategy changes the algorithm at runtime without changing the context.

## Practical example of use

A payment processor that supports multiple payment methods. Each method is a strategy; the checkout process is the context.

```ts
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardStrategy implements PaymentStrategy {
  constructor(private cardNumber: string) {}
  pay(amount: number) { console.log(`Charged $${amount} to card ending ${this.cardNumber.slice(-4)}`); }
}

class PayPalStrategy implements PaymentStrategy {
  constructor(private email: string) {}
  pay(amount: number) { console.log(`Sent $${amount} via PayPal to ${this.email}`); }
}

class CryptoStrategy implements PaymentStrategy {
  constructor(private walletAddress: string) {}
  pay(amount: number) { console.log(`Transferred $${amount} in crypto to ${this.walletAddress}`); }
}

class Checkout {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy) { this.strategy = strategy; }
  processPayment(amount: number) { this.strategy.pay(amount); }
}

const checkout = new Checkout(new CreditCardStrategy("4111111111111234"));
checkout.processPayment(99.99);
checkout.setStrategy(new PayPalStrategy("user@example.com"));
checkout.processPayment(49.99);
```

## When to use

- When you want to define a class that will use one of several related algorithms, selectable at runtime
- When you have a family of algorithms and only their implementation differs
- When multiple conditional branches implement variations of the same basic operation
- When an algorithm uses data the client should not know about (encapsulating the algorithm hides those details)

## When to avoid

- When there is only one algorithm and variation is not expected
- When the strategies are so simple that a function reference or lambda is more readable than a class
- When clients must be aware of the differences between strategies to choose correctly — this couples clients to the strategies

## Trade-offs

- **Flexibility vs. client awareness**: Strategies can be swapped at runtime, but the client must know which strategy to pick, introducing a selection concern.
- **Open/Closed compliance vs. class proliferation**: Adding a new algorithm requires only a new class, but a large system can accumulate many small strategy classes.
- **Encapsulation vs. data sharing**: Strategy encapsulates the algorithm, but passing the data the algorithm needs from the context can lead to passing large amounts of data through the interface.

## Common small mistakes

- Defining a strategy interface that is too broad, forcing strategy classes to implement methods they do not use
- Using Strategy when the variation is in only one line of code — a simple function parameter or lambda is cleaner
- Not injecting the strategy, instead constructing it inside the context, which defeats the purpose of making it interchangeable
- Branching on the strategy type inside the context to perform pre- or post-processing, which reintroduces the conditional that Strategy was meant to eliminate
