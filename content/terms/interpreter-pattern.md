---
title: "Interpreter"
letter: "I"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that defines a grammar for a language and provides an interpreter to process sentences in that language."
---

## Why does it exist?

When a recurring type of problem can be expressed as sentences in a simple language, and instances of these problems arise often, it is worth building an interpreter. Each rule in the grammar becomes a class; each sentence is parsed into a tree of these objects, and evaluating the tree interprets the sentence. This makes it easy to add new expressions by adding new classes, and easy to change the grammar without rewriting the interpreter.

## Practical example of use

A simple boolean expression language for a rules engine. Expressions like `AND(true, OR(false, true))` are parsed into a tree of interpreter objects.

```ts
interface Expression {
  interpret(): boolean;
}

class LiteralExpression implements Expression {
  constructor(private value: boolean) {}
  interpret() { return this.value; }
}

class AndExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret() { return this.left.interpret() && this.right.interpret(); }
}

class OrExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret() { return this.left.interpret() || this.right.interpret(); }
}

class NotExpression implements Expression {
  constructor(private expr: Expression) {}
  interpret() { return !this.expr.interpret(); }
}

// AND(true, OR(false, true))
const expression = new AndExpression(
  new LiteralExpression(true),
  new OrExpression(new LiteralExpression(false), new LiteralExpression(true)),
);
console.log(expression.interpret()); // true
```

## When to use

- When the grammar of the language is simple and stable
- When efficiency of interpretation is not critical
- When the same types of expressions recur frequently and benefit from a structured representation
- When building query languages, configuration parsers, rule engines, or simple scripting within an application

## When to avoid

- When the grammar is complex — complex grammars result in many classes that are hard to manage and modify
- When performance is critical — interpreter trees add object creation and traversal overhead compared to compiled approaches
- When the language changes frequently — every grammar change requires updating multiple interpreter classes
- When a mature parser generator (ANTLR, PEG.js) or expression library exists for the problem

## Trade-offs

- **Expressiveness vs. complexity**: Each grammar rule maps cleanly to a class, making the structure self-documenting, but large grammars produce large class hierarchies.
- **Extensibility vs. proliferation**: Adding a new expression type requires only a new class, but over time the number of expression classes can become hard to navigate.
- **Simplicity of evaluation vs. performance**: Walking an expression tree is simple to implement but slower than bytecode compilation or other optimization strategies.

## Common small mistakes

- Implementing Interpreter for a complex grammar that would be better served by a dedicated parser library
- Not handling precedence and associativity correctly when building the expression tree from raw input
- Mixing parsing logic (string → tree) with interpretation logic (tree → result) in the same classes
- Forgetting to handle error cases in the grammar, causing the interpreter to silently produce incorrect results
