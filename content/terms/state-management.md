---
title: "State Management"
letter: "S"
categories:
  - "avoid-state-bugs"
  - "explain-architecture"
  - "front-end-applications"
shortDefinition: "Patterns and tools for managing, storing, and synchronizing application data that changes over time across components."
---

## Why does it exist?

As front-end applications grew from simple pages to complex, interactive experiences, passing data between deeply nested components became unmanageable. Prop drilling across ten layers of components made code fragile and hard to refactor. State management emerged as a discipline and set of tools to provide predictable, centralized ways to store shared data so that any component in the tree can access and update it without creating a tangled web of dependencies.

## Practical example of use

A project management app like Trello has a board view where multiple components need access to the same data: the sidebar shows project stats, the main area renders columns with cards, and a modal displays card details. Using a state management library like Zustand, the application stores all board data in a single store. When a user drags a card from one column to another, a single action updates the store, and every subscribed component — the column counts, the card positions, the activity log — re-renders with consistent data automatically.

```js
import { create } from "zustand";

const useBoardStore = create((set) => ({
  columns: [],
  moveCard: (cardId, fromCol, toCol) =>
    set((state) => {
      const card = state.columns[fromCol].cards.find((c) => c.id === cardId);
      return {
        columns: state.columns.map((col, i) => {
          if (i === fromCol) return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
          if (i === toCol) return { ...col, cards: [...col.cards, card] };
          return col;
        }),
      };
    }),
}));

// Any component can read and update the store
function ColumnCount({ index }) {
  const count = useBoardStore((s) => s.columns[index]?.cards.length);
  return <span>{count} cards</span>;
}
```

## When to use

- When multiple unrelated components need to read and write the same piece of data
- When you need to track complex state transitions such as multi-step forms, undo/redo history, or optimistic updates
- When debugging requires a clear audit trail of what changed, when, and why — tools like Redux DevTools make this possible
- When server state and client state need to be kept in sync, using libraries like React Query or TanStack Query for server state

## When to avoid

- For state that is local to a single component, such as a toggle or input field — useState or component-level state is sufficient
- In small applications with few components where introducing a state management library adds more boilerplate than it saves
- When URL-based state (query parameters, route params) is enough to represent the application's current view

## Trade-offs

- **Predictability vs. boilerplate**: Centralized stores with strict update patterns (actions, reducers) make data flow predictable but require more code to set up than ad-hoc local state
- **Global access vs. implicit coupling**: Any component can read from the store without prop drilling, but this makes it harder to track which components depend on which data
- **Powerful debugging vs. learning curve**: Time-travel debugging and action logs are invaluable for complex apps, but they require developers to learn specific patterns and tooling

## Common small mistakes

- Putting everything in global state, including form inputs and UI toggles that belong in local component state
- Storing derived data (like filtered lists) in the store instead of computing it on the fly from the source data
- Mutating state directly instead of creating new references, which breaks change detection in most frameworks
- Choosing a heavy state management library before understanding whether the built-in framework primitives (Context, signals, composables) would be enough
