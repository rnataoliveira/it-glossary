---
title: "Factory Method"
letter: "F"
categories:
  - "design-patterns"
shortDefinition: "A creational pattern that defines an interface for creating an object but lets subclasses decide which class to instantiate."
---

## Why does it exist?

When a framework or base class needs to create objects but cannot know in advance which concrete class to instantiate, hardcoding `new ConcreteClass()` couples the framework to that class. Factory Method solves this by declaring a method that returns an object of a product interface. Subclasses override this method to produce whatever concrete product fits their context, keeping the framework decoupled from specific implementations.

## Practical example of use

A UI toolkit provides a `Dialog` base class that renders a dialog with a button. Different platforms need different button styles. Instead of subclassing `Dialog` and re-implementing the entire rendering logic, each platform subclass overrides `createButton()` to return its platform-specific button.

```ts
interface Button {
  render(): void;
}

class WindowsButton implements Button {
  render() { console.log("Rendering Windows button"); }
}

class MacButton implements Button {
  render() { console.log("Rendering Mac button"); }
}

abstract class Dialog {
  abstract createButton(): Button;

  renderDialog() {
    const button = this.createButton();
    button.render();
  }
}

class WindowsDialog extends Dialog {
  createButton(): Button { return new WindowsButton(); }
}

class MacDialog extends Dialog {
  createButton(): Button { return new MacButton(); }
}
```

## When to use

- When a class cannot anticipate the class of objects it must create
- When subclasses should control which objects are created as part of a larger algorithm
- When you want to localize the knowledge of which class gets created
- When a library or framework needs to allow users to extend its internal components

## When to avoid

- When there is only one concrete product and no variation is expected
- When a simple function or constructor with parameters would express the intent more clearly
- When the hierarchy of creators mirrors the hierarchy of products exactly — this doubles the number of classes for marginal benefit

## Trade-offs

- **Open/Closed compliance vs. class proliferation**: Adding new products requires only a new subclass, but large systems can accumulate many creator-product pairs.
- **Decoupling vs. indirection**: The caller is decoupled from the concrete product, but the factory method adds a layer that requires reading two classes to understand object creation.
- **Framework extensibility vs. inheritance dependency**: Subclassing to override a factory method ties you to inheritance, which can be limiting compared to composition-based alternatives.

## Common small mistakes

- Confusing Factory Method (a method on an object) with a static factory function (which is not this pattern)
- Creating a factory method that returns a concrete type instead of an interface, defeating the decoupling intent
- Not documenting that the factory method is the extension point, so subclasses miss overriding it
- Using Factory Method when Abstract Factory (producing families of related objects) is what the problem actually requires
