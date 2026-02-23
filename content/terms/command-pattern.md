---
title: "Command"
letter: "C"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that encapsulates a request as an object, allowing it to be parameterized, queued, logged, or undone."
---

## Why does it exist?

When actions need to be more than simple function calls — queued for later, logged, undone, or combined into composite actions — a simple method call is insufficient. Command turns each action into an object with a consistent interface (`execute`, optionally `undo`). The invoker that triggers actions and the receiver that performs them are fully decoupled — the invoker only knows how to call `execute()`.

## Practical example of use

A text editor with undo/redo support. Each edit is a Command object stored on a history stack.

```ts
interface Command {
  execute(): void;
  undo(): void;
}

class TextEditor {
  private text = "";
  getText() { return this.text; }
  insertText(text: string, position: number) {
    this.text = this.text.slice(0, position) + text + this.text.slice(position);
  }
  deleteText(position: number, length: number) {
    this.text = this.text.slice(0, position) + this.text.slice(position + length);
  }
}

class InsertCommand implements Command {
  constructor(
    private editor: TextEditor,
    private text: string,
    private position: number,
  ) {}
  execute() { this.editor.insertText(this.text, this.position); }
  undo() { this.editor.deleteText(this.position, this.text.length); }
}

class CommandHistory {
  private history: Command[] = [];
  execute(command: Command) { command.execute(); this.history.push(command); }
  undo() { this.history.pop()?.undo(); }
}

const editor = new TextEditor();
const history = new CommandHistory();
history.execute(new InsertCommand(editor, "Hello", 0));
history.execute(new InsertCommand(editor, " World", 5));
console.log(editor.getText()); // Hello World
history.undo();
console.log(editor.getText()); // Hello
```

## When to use

- When you need to parameterize objects with actions (e.g., menu items, buttons)
- When you need undo/redo functionality
- When you need to queue, log, or schedule operations for later execution
- When you need to support transactions where a group of commands can be committed or rolled back together
- When operations need to be serialized and sent over a network or stored for replay

## When to avoid

- When undo is not needed and the operations are simple — a direct method call is clearer
- When the command objects grow so large that they replicate the receiver's logic, creating duplication
- When the added abstraction (command objects, invokers, receivers) exceeds the complexity it solves

## Trade-offs

- **Decoupling vs. indirection**: The invoker is fully decoupled from the receiver, but tracing what happens when `execute()` is called requires finding the command implementation.
- **Undo capability vs. memory cost**: Storing a history of command objects enables undo but consumes memory proportional to history depth.
- **Composability vs. explosion of classes**: Commands can be composed into macro commands, but large applications can accumulate hundreds of small command classes.

## Common small mistakes

- Not implementing `undo()` consistently, making partial rollback scenarios corrupt state
- Capturing the receiver's state at execution time rather than at construction time, causing undo to restore the wrong state
- Mixing business logic into the Command class itself instead of delegating to the receiver
- Not defining a maximum history depth, leading to unbounded memory growth in long-running sessions
