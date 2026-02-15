---
title: "Theming"
letter: "T"
categories:
  - "design-systems"
  - "frontend"
shortDefinition: "A technique for dynamically swapping visual properties like colors, fonts, and spacing to support multiple visual modes such as light and dark themes."
---

## Why does it exist?

Users expect applications to respect their preferences: dark mode for low-light environments, high-contrast mode for accessibility, or brand-specific skins for white-label products. Hard-coding visual values throughout a codebase makes supporting these variations a nightmare of find-and-replace. Theming introduces a layer of indirection where components reference abstract tokens (like `--color-bg`) rather than literal values, allowing the entire look and feel to change by swapping the underlying token set.

Theming also matters for organizations that offer white-label solutions. A SaaS company might sell the same dashboard to ten clients, each wanting their own brand colors and typography. With a proper theming architecture, each client gets a unique theme file while sharing the same component library and application code.

## Practical example of use

A common approach combines CSS custom properties for the styling layer with a React context provider to manage theme state. The CSS layer defines variables for each theme:

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-primary: #0066ff;
}

[data-theme="dark"] {
  --color-bg: #121212;
  --color-text: #e0e0e0;
  --color-primary: #4d94ff;
}
```

The React provider manages state and applies the `data-theme` attribute to the root element so CSS picks up the correct variable set:

```tsx
const ThemeContext = createContext<{ theme: string; toggle: () => void }>(null!);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

Components simply use `var(--color-bg)` in their styles and automatically reflect whatever theme is active without any prop drilling or conditional logic.

## When to use

- When your application needs to support light and dark modes to respect user preferences and system settings.
- When building a white-label product that multiple clients deploy with their own branding.
- When accessibility requirements demand a high-contrast theme option.
- When you want to centralize visual decisions so that sweeping design changes can be made by updating a theme file rather than touching every component.

## When to avoid

- When the application has a single fixed visual identity and there are no foreseeable requirements for alternative themes.
- When the project is a short-lived prototype and the overhead of a theming layer would slow delivery without providing value.
- When the team does not have design tokens or a systematic approach to styling, meaning a theming layer would sit on top of an inconsistent foundation.
- When using server-rendered pages where the flash of incorrect theme (FOIT) problem is difficult to solve and degrades user experience.

## Trade-offs

- **Flexibility vs. complexity**: A theming layer adds indirection. Developers must trace variable references to understand what color they are actually seeing, which can slow debugging.
- **User experience vs. implementation effort**: Dark mode looks simple on the surface, but ensuring every component, illustration, shadow, and image works well in both themes requires significant design and testing effort.
- **CSS variables vs. JS-based themes**: CSS custom properties are performant and simple but limited to CSS-expressible values. JS-based themes (like styled-components `ThemeProvider`) offer more power but come with runtime overhead.

## Common small mistakes

- Not persisting the user's theme preference in localStorage or a cookie, causing the theme to reset on every page load.
- Ignoring the flash of unstyled/incorrectly-themed content by applying the theme only after JavaScript hydrates, which causes a visible flicker.
- Defining themes with only two modes (light/dark) and hard-coding the toggle logic, making it difficult to add a third theme later.
- Testing components only in the default theme and discovering contrast or readability issues in the alternate theme after shipping.
- Using opacity or filter hacks instead of defining proper theme-aware color values, resulting in washed-out or inaccessible visuals.
