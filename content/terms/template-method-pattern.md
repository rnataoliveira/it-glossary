---
title: "Template Method"
letter: "T"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that defines the skeleton of an algorithm in a base class and lets subclasses override specific steps without changing the algorithm's overall structure."
---

## Why does it exist?

When multiple classes implement the same algorithm with the same overall structure but different details in individual steps, code duplication grows. Template Method moves the algorithm skeleton into a base class and identifies the steps that vary. These are declared as abstract (or virtual) methods — the "template steps" — that subclasses implement. The base class calls these steps in order; only the varying parts need to be overridden.

## Practical example of use

A data processing pipeline that parses, validates, and saves data, but with different implementations for CSV and JSON sources.

```ts
abstract class DataProcessor {
  // Template method — defines the skeleton
  process(input: string): void {
    const data = this.parse(input);
    const validated = this.validate(data);
    this.save(validated);
  }

  protected abstract parse(input: string): unknown[];
  protected abstract validate(data: unknown[]): unknown[];

  protected save(data: unknown[]) {
    console.log(`Saving ${data.length} records`);
  }
}

class CSVProcessor extends DataProcessor {
  protected parse(input: string): string[][] {
    return input.split("\n").map(row => row.split(","));
  }
  protected validate(data: string[][]): string[][] {
    return data.filter(row => row.length > 0 && row[0] !== "");
  }
}

class JSONProcessor extends DataProcessor {
  protected parse(input: string): object[] {
    return JSON.parse(input);
  }
  protected validate(data: object[]): object[] {
    return data.filter(item => item !== null);
  }
}

new CSVProcessor().process("a,b,c\n1,2,3");
new JSONProcessor().process('[{"id":1},{"id":2}]');
```

## When to use

- When you have multiple classes that implement the same algorithm with invariant and variant parts
- When you want to avoid code duplication by centralizing the invariant structure in a base class
- When you want to control which parts of an algorithm subclasses can and cannot override
- When implementing frameworks where the framework defines the workflow and clients provide domain-specific steps

## When to avoid

- When the algorithm steps are too tightly coupled to the order defined by the template, making it inflexible for legitimate variations
- When subclasses override the template method itself, defeating the pattern's purpose
- When Strategy (delegation via composition) would be more appropriate than inheritance — use Template Method only when the relationship is truly "is-a" and not "uses-a"

## Trade-offs

- **Code reuse vs. inheritance rigidity**: Common algorithm structure lives in one place, but subclasses are permanently tied to the base class hierarchy.
- **Control vs. flexibility**: The base class controls the overall algorithm, preventing incorrect step ordering, but this limits how much subclasses can deviate from the defined structure.
- **Simplicity vs. Liskov compliance**: Template method is simple, but if subclasses must implement abstract steps in ways that violate the base class's assumptions, the Liskov Substitution Principle is broken.

## Common small mistakes

- Defining too many abstract steps, making subclasses burdensome to implement and the template brittle to change
- Making the template method itself overridable, allowing subclasses to bypass the algorithm structure entirely
- Not documenting the intended contract for each abstract step, causing subclasses to implement them incorrectly
- Using Template Method when the variation is in the selection of an algorithm rather than its steps — Strategy is more appropriate in that case
