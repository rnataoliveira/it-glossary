---
title: "Visitor"
letter: "V"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that lets you add further operations to objects without modifying them, by separating the algorithm from the object structure it operates on."
---

## Why does it exist?

When you need to perform many different operations on a stable object structure (a tree of nodes, a collection of shapes), embedding all these operations in the node classes creates bloated classes that mix unrelated concerns. Visitor separates the operations from the structure. Each new operation is a visitor class with a `visit` method for each concrete node type. The node only needs one `accept(visitor)` method. Adding a new operation means adding a new visitor, not modifying the nodes.

## Practical example of use

An abstract syntax tree (AST) with multiple operations: pretty-printing, type checking, and code generation — each is a visitor.

```ts
interface ASTNode {
  accept(visitor: Visitor): void;
}

interface Visitor {
  visitNumber(node: NumberNode): void;
  visitAdd(node: AddNode): void;
}

class NumberNode implements ASTNode {
  constructor(public value: number) {}
  accept(visitor: Visitor) { visitor.visitNumber(this); }
}

class AddNode implements ASTNode {
  constructor(public left: ASTNode, public right: ASTNode) {}
  accept(visitor: Visitor) { visitor.visitAdd(this); }
}

class PrintVisitor implements Visitor {
  visitNumber(node: NumberNode) { process.stdout.write(String(node.value)); }
  visitAdd(node: AddNode) {
    process.stdout.write("(");
    node.left.accept(this);
    process.stdout.write(" + ");
    node.right.accept(this);
    process.stdout.write(")");
  }
}

// AST for (1 + 2)
const ast = new AddNode(new NumberNode(1), new NumberNode(2));
const printer = new PrintVisitor();
ast.accept(printer); // (1 + 2)
```

## When to use

- When you need to perform many distinct and unrelated operations on an object structure without polluting the classes
- When the object structure is stable (node types rarely change) but operations on it change often
- When you want to accumulate state across a traversal (e.g., counting nodes, collecting values)
- When implementing compilers, document processing, or any traversal-heavy system

## When to avoid

- When the object structure changes frequently — adding a new node type requires updating every visitor class
- When the object structure's classes have restricted access that prevents adding `accept` methods
- When the number of operations is small and stable — putting the operation directly on the nodes is simpler

## Trade-offs

- **Open to new operations vs. closed to new types**: Adding a new operation is a new class; adding a new node type requires updating every existing visitor — the opposite of the trade-off in the Open/Closed Principle.
- **Separation of concerns vs. double dispatch complexity**: The visitor separates algorithms from data structures cleanly, but double dispatch (node calls visitor; visitor calls specific method) is non-obvious to developers unfamiliar with the pattern.
- **Accumulation of state vs. visitor coupling**: Visitors can accumulate state across traversal, but they are tightly coupled to the concrete types in the object structure.

## Common small mistakes

- Adding a new node type without updating all visitor interfaces and implementations, causing compile errors or missing method implementations
- Confusing Visitor with Iterator — Iterator traverses a collection; Visitor performs typed operations on a heterogeneous structure
- Putting traversal logic in the visitor instead of the nodes, making the visitor dependent on the structure's internal organization
- Not using double dispatch correctly, falling back to `instanceof` checks inside the visitor which defeats the pattern's type-safety benefit
