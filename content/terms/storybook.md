---
title: "Storybook"
letter: "S"
categories:
  - "design-systems"
  - "testing"
shortDefinition: "An open-source tool for developing, documenting, and visually testing UI components in isolation outside of the main application."
---

## Why does it exist?

Developing UI components inside a full application is slow and cumbersome. You need to navigate to the right page, set up the right state, and hope the backend returns the data you need. Storybook removes that friction by letting developers render any component in isolation with controlled props, making it possible to see every variant, edge case, and state without spinning up the entire app.

Beyond development speed, Storybook serves as living documentation. Each "story" is a concrete example of a component in a specific state, which designers, product managers, and QA engineers can browse without reading code. Combined with addons for accessibility auditing, viewport testing, and visual regression, Storybook becomes a central hub for component quality assurance.

## Practical example of use

A team writes stories for their Button component so that every variant is visible and interactive in the Storybook UI:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary", children: "Click me" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancel" },
};
```

Anyone on the team can open Storybook, navigate to "Components/Button," and interact with every variant using the controls panel. The QA engineer uses the accessibility addon to verify contrast and ARIA attributes without writing a single test.

## When to use

- When building a component library or design system that multiple teams consume and you need a catalog of available components.
- When you want to develop and iterate on components without the overhead of running the full application.
- When you need visual regression testing to catch unintended styling changes across releases.
- When non-engineering stakeholders (designers, PMs) need a way to review component states and provide feedback without reading code.

## When to avoid

- When your project has only a handful of simple components and the setup overhead of Storybook outweighs the benefit.
- When your components are tightly coupled to application state or API responses and isolating them requires extensive mocking that provides little value.
- When the team does not commit to maintaining stories alongside components, leading to a stale Storybook that nobody trusts.
- When you already have a lightweight alternative (like a dedicated dev page or a tool like Ladle) that meets your needs with less configuration.

## Trade-offs

- **Isolation fidelity vs. integration reality**: Components in Storybook run outside the application context, so issues related to routing, global state, or CSS cascade may not surface until integration.
- **Documentation value vs. maintenance cost**: Stories are incredibly useful as living docs, but they require updating whenever the component API changes, doubling the work for each change.
- **Rich addon ecosystem vs. configuration complexity**: Addons for a11y, viewports, and visual testing are powerful, but configuring and maintaining them adds tooling overhead.

## Common small mistakes

- Writing stories that only cover the "happy path" and ignoring edge cases like empty states, long text, error states, and loading states.
- Not using `argTypes` or controls, which forces developers to write separate stories for every prop combination instead of letting users explore interactively.
- Letting stories fall out of sync with the actual component API, which erodes trust in the Storybook as a documentation source.
- Installing too many addons at once without evaluating whether the team will actually use them, bloating the configuration.
- Placing story files far from the components they document, making it easy to forget to update them when the component changes.
