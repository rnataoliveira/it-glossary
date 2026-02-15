---
title: "CSS-in-JS"
letter: "C"
categories:
  - "frontend"
  - "design-systems"
shortDefinition: "A styling approach that writes CSS directly in JavaScript files, enabling scoped styles, dynamic theming, and co-location of component logic with its visual presentation."
---

## Why does it exist?

Traditional CSS operates in a global namespace. A class name defined in one file can collide with the same name in another, leading to unexpected overrides and specificity wars. CSS-in-JS libraries solve this by generating unique, scoped class names at build time or runtime, guaranteeing that styles for one component never leak into another. This eliminates an entire category of bugs related to naming conflicts and cascade order.

Beyond scoping, CSS-in-JS enables dynamic styling driven by component props and application state. Instead of toggling between pre-defined CSS classes, a component can compute its styles based on props, theme values, or any JavaScript expression. This co-location of styling logic with component logic makes it easier to understand how a component looks and behaves by reading a single file.

## Practical example of use

A team uses styled-components to create a Button with a `$primary` prop that controls its visual style. The styles are co-located with the component and automatically scoped:

```tsx
import styled from "styled-components";

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: 2px solid #0066ff;
  background: ${(props) => (props.$primary ? "#0066ff" : "transparent")};
  color: ${(props) => (props.$primary ? "#fff" : "#0066ff")};
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

// Usage
<Button $primary>Save</Button>
<Button>Cancel</Button>
```

Each rendered button receives a unique class name like `sc-aXZVg`, preventing collisions. The `$primary` prop dynamically switches between a filled and an outlined appearance without requiring separate CSS classes or conditional class name logic.

## When to use

- When your application has many components and you want guaranteed style isolation without manually managing class name uniqueness.
- When styles depend heavily on props or runtime state and you need the full power of JavaScript to compute them.
- When you want to co-locate styles with component logic so that everything about a component lives in a single file.
- When building a design system that uses a theme object and you want type-safe access to theme values inside style definitions.

## When to avoid

- When performance is critical and the runtime overhead of CSS-in-JS (style injection, serialization) is not acceptable, especially in server-side rendered applications.
- When the team prefers a clear separation of concerns and finds CSS-in-JS files harder to read and maintain than dedicated CSS or SCSS files.
- When the project already uses CSS Modules or utility-first CSS (like Tailwind) that provides scoping without the runtime cost of CSS-in-JS.
- When the application needs to work well without JavaScript, as runtime CSS-in-JS requires JS to inject styles.

## Trade-offs

- **Scoping and co-location vs. runtime cost**: CSS-in-JS eliminates global scope issues and keeps styles near logic, but runtime libraries like styled-components inject styles via JavaScript, which adds to the critical rendering path.
- **Dynamic styling power vs. caching efficiency**: Styles that depend on props generate unique CSS for each prop combination, which can reduce the effectiveness of browser style caching compared to static CSS files.
- **Developer experience vs. tooling lock-in**: CSS-in-JS libraries provide a smooth developer experience with autocompletion and type safety, but switching libraries later requires rewriting all styles.

## Common small mistakes

- Not using the transient prop prefix (`$`) in styled-components, causing styling props to leak through to the DOM element and trigger React warnings.
- Defining styled components inside render functions, which causes them to be recreated on every render and breaks memoization.
- Over-relying on dynamic styles for values that are actually static, paying a runtime cost for something that could be a plain CSS class.
- Forgetting to configure server-side rendering support, which causes a flash of unstyled content on the initial page load.
- Mixing CSS-in-JS with global CSS stylesheets without a clear boundary, creating confusion about which system owns which styles.
