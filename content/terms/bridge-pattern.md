---
title: "Bridge"
letter: "B"
categories:
  - "design-patterns"
shortDefinition: "A structural pattern that decouples an abstraction from its implementation so that the two can vary independently."
---

## Why does it exist?

When a class hierarchy needs to vary along two dimensions — for example, shapes and rendering APIs — combining them through inheritance creates a Cartesian explosion of subclasses (`CircleOpenGL`, `CircleDirectX`, `SquareOpenGL`, `SquareDirectX`). Bridge separates the two hierarchies and connects them via composition. The abstraction holds a reference to an implementation object, and each can be extended independently.

## Practical example of use

A drawing application supports multiple shapes and multiple renderers. Bridge keeps shapes and renderers as separate hierarchies connected by composition.

```ts
interface Renderer {
  renderCircle(radius: number): void;
  renderSquare(side: number): void;
}

class SVGRenderer implements Renderer {
  renderCircle(radius: number) { console.log(`SVG circle r=${radius}`); }
  renderSquare(side: number) { console.log(`SVG square s=${side}`); }
}

class CanvasRenderer implements Renderer {
  renderCircle(radius: number) { console.log(`Canvas circle r=${radius}`); }
  renderSquare(side: number) { console.log(`Canvas square s=${side}`); }
}

abstract class Shape {
  constructor(protected renderer: Renderer) {}
  abstract draw(): void;
}

class Circle extends Shape {
  constructor(renderer: Renderer, private radius: number) { super(renderer); }
  draw() { this.renderer.renderCircle(this.radius); }
}

const circle = new Circle(new SVGRenderer(), 5);
circle.draw();
```

## When to use

- When you want to avoid a permanent binding between an abstraction and its implementation
- When both abstractions and implementations should be extensible through subclassing independently
- When changes in the implementation should not affect the client's code
- When you have a proliferation of subclasses because two orthogonal dimensions are mixed into one hierarchy

## When to avoid

- When there is only one implementation — the extra indirection adds complexity with no benefit
- When the abstraction and implementation are tightly coupled and do not vary independently
- When simpler composition or strategy-based injection would solve the problem with less ceremony

## Trade-offs

- **Independent variation vs. indirection**: Abstraction and implementation evolve separately, but connecting them through composition adds a level of indirection.
- **Class explosion prevention vs. design complexity**: Bridge prevents the combinatorial class explosion of multi-dimensional inheritance, but the pattern itself requires careful upfront design.
- **Flexibility vs. discoverability**: It is not immediately obvious which implementation is in use at runtime, making debugging and code navigation harder.

## Common small mistakes

- Applying Bridge prematurely when there is only one implementation today
- Confusing Bridge with Adapter — Bridge is designed upfront to decouple two hierarchies; Adapter makes existing incompatible interfaces work together
- Letting the abstraction layer add logic that belongs in the implementation, blurring the separation
- Forgetting to define a clear boundary between what the abstraction does and what the implementation provides
