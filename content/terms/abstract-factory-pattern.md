---
title: "Abstract Factory"
letter: "A"
categories:
  - "design-patterns"
shortDefinition: "A creational pattern that provides an interface for creating families of related objects without specifying their concrete classes."
---

## Why does it exist?

When a system must work with multiple families of related products — for example, UI widgets for Windows vs. macOS, or data access objects for PostgreSQL vs. MongoDB — the code that uses these products should not be coupled to any specific family. Abstract Factory groups the creation of a family into a single interface. Swapping the factory object swaps the entire family coherently, preventing mixed-family inconsistencies like a macOS button inside a Windows dialog.

## Practical example of use

A cross-platform UI library needs to render buttons and checkboxes for both light and dark themes. An `AbstractThemeFactory` defines `createButton()` and `createCheckbox()`. `LightThemeFactory` and `DarkThemeFactory` implement those methods, each producing the matching variants. Application code only ever calls `factory.createButton()` — swapping the theme means swapping the factory.

```ts
interface Button { render(): void; }
interface Checkbox { render(): void; }

interface ThemeFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class LightThemeFactory implements ThemeFactory {
  createButton(): Button { return { render: () => console.log("Light Button") }; }
  createCheckbox(): Checkbox { return { render: () => console.log("Light Checkbox") }; }
}

class DarkThemeFactory implements ThemeFactory {
  createButton(): Button { return { render: () => console.log("Dark Button") }; }
  createCheckbox(): Checkbox { return { render: () => console.log("Dark Checkbox") }; }
}

function renderUI(factory: ThemeFactory) {
  factory.createButton().render();
  factory.createCheckbox().render();
}
```

## When to use

- When the system must be independent of how its products are created, composed, and represented
- When you want to enforce the constraint that products from one family are used together
- When you are providing a product library and want to reveal only interfaces, not implementations
- When you anticipate switching between product families (e.g., different databases, different themes, different cloud providers)

## When to avoid

- When there is only one product family — a simpler Factory Method or plain constructor is sufficient
- When the product family is unlikely to change — the added abstraction costs more than it saves
- When each concrete factory is so distinct that a shared interface would be forced and artificial

## Trade-offs

- **Family consistency vs. rigidity**: Abstract Factory guarantees products are compatible, but adding a new product type requires updating every factory, which can be extensive.
- **Decoupling vs. complexity**: Application code is fully decoupled from concrete products, but the factory hierarchy and product hierarchy together add significant structural complexity.
- **Extensibility vs. open/closed tension**: Adding a new factory family (e.g., a third theme) is easy; adding a new product kind to an existing family is not.

## Common small mistakes

- Conflating Abstract Factory with Factory Method — Factory Method is a single creation method on a class; Abstract Factory is an object with multiple creation methods for a family
- Defining the abstract factory interface too broadly, coupling unrelated products into one factory
- Not defining interfaces for the products themselves, forcing clients to know concrete types
- Forgetting that when a new product type is added to the interface, every factory implementation must be updated
