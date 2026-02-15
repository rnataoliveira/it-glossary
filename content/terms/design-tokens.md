---
title: "Design Tokens"
letter: "D"
categories:
  - "design-systems"
  - "frontend"
shortDefinition: "Platform-agnostic variables that store visual design attributes such as colors, spacing, and typography so they can be shared across tools and codebases."
---

## Why does it exist?

Design decisions like "the primary color is #0066FF" or "the base spacing unit is 8px" are used everywhere: in Figma files, CSS stylesheets, React Native apps, and email templates. Without a single source of truth, these values drift apart. A designer updates a color in Figma, but the iOS team never hears about it, and the web team hard-codes a slightly different shade. Design tokens solve this by capturing these decisions in a structured, platform-agnostic format that can be transformed into any output a consuming platform needs.

Tokens also create a shared vocabulary between designers and engineers. Instead of debating hex codes in a pull request, both sides refer to `color.primary`. This abstraction makes large-scale changes, like a full rebrand or adding a dark theme, far more manageable because you update the tokens rather than hunting through thousands of lines of code.

## Practical example of use

A team defines its tokens in a JSON file that acts as the single source of truth:

```json
{
  "color": {
    "primary": { "value": "#0066FF", "type": "color" },
    "text": { "value": "#1A1A1A", "type": "color" },
    "background": { "value": "#FFFFFF", "type": "color" }
  },
  "spacing": {
    "sm": { "value": "8px", "type": "dimension" },
    "md": { "value": "16px", "type": "dimension" },
    "lg": { "value": "32px", "type": "dimension" }
  },
  "font": {
    "body": { "value": "16px/1.5 'Inter', sans-serif", "type": "font" }
  }
}
```

A build tool like Style Dictionary reads this file and generates CSS custom properties for the web team, XML resources for Android, and a Swift struct for iOS. When the brand team decides to change the primary color, they update one value in the JSON file, and every platform receives the change after the next build.

## When to use

- When your product ships on multiple platforms (web, iOS, Android) that need to stay visually aligned.
- When you are building or maintaining a design system and need a single source of truth for visual decisions.
- When your organization is planning a rebrand or introducing theming (light/dark mode) and wants to minimize manual work.
- When designers and engineers need a shared language for design decisions that reduces ambiguity in handoffs.

## When to avoid

- When you have a single small application with no theming needs and a handful of CSS variables would suffice.
- When the team lacks tooling or pipeline maturity to automate token transformation, making the indirection more costly than helpful.
- When the project is a throwaway prototype where maintaining a token layer adds unnecessary complexity.

## Trade-offs

- **Abstraction vs. simplicity**: Tokens add an indirection layer. Developers must look up what `spacing.md` resolves to rather than seeing `16px` directly in the code.
- **Automation power vs. tooling overhead**: Tools like Style Dictionary or Theo are powerful but require setup, configuration, and maintenance of transformation pipelines.
- **Consistency vs. speed of change**: Centralizing values makes sweeping changes easy but means even small tweaks require updating the token source, rebuilding, and redeploying consuming packages.

## Common small mistakes

- Naming tokens after their current value (e.g., `color.blue`) instead of their semantic role (e.g., `color.primary`), which breaks when the brand color changes to green.
- Creating tokens for every conceivable value, leading to an unmanageable token set that nobody can navigate.
- Forgetting to version the token package, so consumers cannot pin to a stable release.
- Skipping the transformation step and copy-pasting token values into code, which defeats the entire purpose.
- Not distinguishing between global tokens (raw palette values) and semantic/alias tokens (contextual references like `color.surface`), making theming difficult.
