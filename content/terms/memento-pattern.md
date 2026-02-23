---
title: "Memento"
letter: "M"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that captures and externalizes an object's internal state so it can be restored later, without violating encapsulation."
---

## Why does it exist?

Implementing undo/redo or saving and restoring snapshots requires capturing an object's state at a point in time. The naive approach is to expose all internal fields — but this breaks encapsulation and couples the snapshot logic to the object's internals. Memento solves this by letting the object itself create a snapshot (a memento) with opaque contents. The object knows how to serialize and restore its own state; the caretaker stores and returns mementos without ever inspecting their contents.

## Practical example of use

A text editor saves and restores state using mementos, keeping the editor's internals private.

```ts
class EditorMemento {
  constructor(
    private readonly text: string,
    private readonly cursorPosition: number,
  ) {}

  getText() { return this.text; }
  getCursorPosition() { return this.cursorPosition; }
}

class Editor {
  private text = "";
  private cursorPosition = 0;

  type(text: string) {
    this.text += text;
    this.cursorPosition = this.text.length;
  }

  save(): EditorMemento {
    return new EditorMemento(this.text, this.cursorPosition);
  }

  restore(memento: EditorMemento) {
    this.text = memento.getText();
    this.cursorPosition = memento.getCursorPosition();
  }

  getContent() { return `"${this.text}" (cursor: ${this.cursorPosition})`; }
}

const editor = new Editor();
editor.type("Hello");
const snapshot = editor.save();
editor.type(" World");
console.log(editor.getContent()); // "Hello World" (cursor: 11)
editor.restore(snapshot);
console.log(editor.getContent()); // "Hello" (cursor: 5)
```

## When to use

- When you need to implement undo/redo or save/restore functionality
- When taking a snapshot of an object's state for later restoration, without exposing its internals
- When a direct interface to the object's state would expose implementation details that should remain private
- When implementing transaction-like behavior where operations can be rolled back

## When to avoid

- When the object's state is large or changes frequently — storing many mementos consumes significant memory
- When the state cannot be easily serialized into a memento (e.g., it contains non-serializable resources)
- When only a single field changes and simpler approaches (storing the previous value in a variable) suffice

## Trade-offs

- **Encapsulation preservation vs. memory cost**: The originator creates and restores its own snapshots, keeping internals private, but storing multiple mementos can be expensive.
- **Simplicity of restoration vs. snapshot completeness**: Restoring from a memento is clean and complete, but partial state restoration (restoring only some fields) requires more granular memento design.
- **Flexibility vs. memento coupling**: The memento must contain everything the originator needs to restore itself, which tightly couples the memento structure to the originator's implementation.

## Common small mistakes

- Making the memento's fields public or accessible to all classes, breaking encapsulation
- Storing references to mutable objects inside the memento instead of deep copies, causing the snapshot to change when the originator's state changes
- Not limiting the history size, leading to unbounded memory growth in long-running applications
- Forgetting that mementos capture a point-in-time snapshot — if the originator's structure changes (e.g., new fields added), old mementos may be incompatible
