---
title: "Web Components"
letter: "W"
categories:
  - "frontend"
shortDefinition: "A set of browser-native APIs (Custom Elements, Shadow DOM, and HTML Templates) for creating reusable, encapsulated UI components without a framework."
---

## Why does it exist?

Frameworks like React, Vue, and Angular each have their own component model, but none of them produce components that work everywhere. A React component cannot be dropped into an Angular app. Web Components solve this by leveraging browser-native standards: Custom Elements let you define new HTML tags, Shadow DOM provides style and DOM encapsulation, and HTML Templates enable declarative markup patterns. The result is components that work in any framework or no framework at all.

This universality makes Web Components particularly appealing for design systems that need to serve teams using different technology stacks. Instead of maintaining a React version, a Vue version, and an Angular version of every component, a team can build one set of Web Components that works everywhere the browser runs.

## Practical example of use

A team builds a `<user-card>` custom element that renders a user's name and role with encapsulated styles that cannot leak into or be affected by the rest of the page:

```javascript
class UserCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["name", "role"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .card { padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
        .name { font-weight: bold; }
      </style>
      <div class="card">
        <p class="name">${this.getAttribute("name")}</p>
        <p>${this.getAttribute("role")}</p>
      </div>
    `;
  }
}

customElements.define("user-card", UserCard);
```

Any page can now use `<user-card name="Alice" role="Engineer"></user-card>` regardless of whether it is built with React, plain HTML, or a server-side framework. The Shadow DOM ensures the card's styles remain isolated.

## When to use

- When you need framework-agnostic components that work across React, Angular, Vue, or plain HTML applications.
- When building a design system for a large organization where different teams use different frameworks.
- When style encapsulation is important and you want to guarantee that component styles do not leak into or get overridden by the host page.
- When you want to create shareable widgets or embeddable components for third-party sites.

## When to avoid

- When your entire application uses a single framework and the framework's component model already meets your needs without the ergonomic trade-offs of Web Components.
- When you need rich server-side rendering, as Shadow DOM and Custom Elements have limited SSR support compared to framework components.
- When complex reactivity and state management are central requirements, since the built-in attribute observation API is verbose compared to framework-level reactivity.
- When your target audience includes older browsers that do not support the Web Components APIs and polyfilling would add unacceptable overhead.

## Trade-offs

- **Universal compatibility vs. developer ergonomics**: Web Components work everywhere, but the imperative API (manual attribute observation, `innerHTML` updates) is more verbose and less ergonomic than declarative framework approaches.
- **Style encapsulation vs. theming difficulty**: Shadow DOM prevents style leakage, but it also makes it harder for consumers to customize component appearance from the outside without explicit CSS custom property hooks.
- **No framework dependency vs. missing framework features**: Web Components do not require a framework, but they also lack built-in solutions for state management, routing, and other concerns that frameworks provide out of the box.

## Common small mistakes

- Using `innerHTML` with user-supplied attributes without sanitization, creating cross-site scripting (XSS) vulnerabilities.
- Forgetting to list attributes in `observedAttributes`, which causes `attributeChangedCallback` to never fire for those attributes.
- Performing heavy work in the `constructor` instead of deferring to `connectedCallback`, which can cause errors when the element is created but not yet attached to the DOM.
- Not providing CSS custom property hooks for theming, which forces consumers to use workarounds like `::part()` or abandon Shadow DOM entirely.
- Assuming all attributes are strings and not handling type coercion for booleans and numbers, leading to subtle bugs.
