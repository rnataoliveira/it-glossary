---
title: "Composite"
letter: "C"
categories:
  - "design-patterns"
shortDefinition: "A structural pattern that composes objects into tree structures and lets clients treat individual objects and compositions uniformly."
---

## Why does it exist?

Applications often work with tree-like structures — file systems, UI component trees, organizational charts, expression trees. Without Composite, code must distinguish between leaf nodes and branch nodes at every point, leading to `if (node instanceof Container) { ... } else { ... }` logic scattered everywhere. Composite defines a common interface for both, so client code can recursively call the same operation on any node without knowing if it is a leaf or a composite.

## Practical example of use

A file system where files and directories share the same interface. Calling `getSize()` on a directory recursively sums the sizes of its children.

```ts
interface FileSystemNode {
  getSize(): number;
  getName(): string;
}

class File implements FileSystemNode {
  constructor(private name: string, private size: number) {}
  getSize() { return this.size; }
  getName() { return this.name; }
}

class Directory implements FileSystemNode {
  private children: FileSystemNode[] = [];
  constructor(private name: string) {}

  add(node: FileSystemNode) { this.children.push(node); }
  getSize() { return this.children.reduce((sum, n) => sum + n.getSize(), 0); }
  getName() { return this.name; }
}

const root = new Directory("root");
root.add(new File("readme.md", 1000));
const src = new Directory("src");
src.add(new File("index.ts", 2000));
root.add(src);

console.log(root.getSize()); // 3000
```

## When to use

- When you need to represent part-whole hierarchies of objects
- When clients should ignore the difference between compositions of objects and individual objects
- When tree structures need to be traversed recursively with the same operation applied at every level
- When you want to add new types of components without changing the code that uses the tree

## When to avoid

- When the tree is not naturally recursive or the objects are not truly hierarchical
- When leaf and composite operations are fundamentally different and sharing an interface forces unnatural method implementations on leaves
- When the structure is flat and composite adds unnecessary recursion overhead

## Trade-offs

- **Uniform treatment vs. type safety**: Treating leaves and composites identically simplifies client code, but it can be hard to restrict which operations are valid only for leaves vs. composites.
- **Flexibility vs. overly general design**: The common interface makes it easy to add new component types, but it may force some components to implement methods that do not apply to them.
- **Recursive simplicity vs. performance**: Recursive delegation is elegant but can be slow for very deep trees or operations that trigger full tree traversal.

## Common small mistakes

- Adding child-management methods (`add`, `remove`, `getChildren`) to the shared component interface, forcing leaf classes to implement them with no-ops or exceptions
- Not defining a clear ownership model for the tree — who adds children, who removes them, and what happens to orphaned nodes
- Using Composite when the hierarchy has only one level, making it an over-engineered list
- Forgetting to handle cycles in the graph, which cause infinite recursion if the structure is a DAG rather than a strict tree
