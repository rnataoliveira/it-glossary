---
title: "Hydration"
letter: "H"
categories:
  - "frontend"
shortDefinition: "The process of attaching JavaScript event handlers to server-rendered HTML, making a static page interactive on the client."
---

## Why does it exist?

Server-Side Rendering solves the problem of showing content quickly, but the HTML it produces is inert — buttons do not respond to clicks, forms do not validate, and dropdowns do not open. The browser needs JavaScript to make these elements interactive. Hydration bridges this gap by taking the server-rendered HTML that is already visible on screen and wiring up the JavaScript framework's event listeners, state, and component logic on top of it, without discarding and re-rendering the existing DOM.

## Practical example of use

A Next.js e-commerce site server-renders a product page with images, a description, price, and an "Add to Cart" button. The browser displays this HTML immediately. Then React's JavaScript bundle loads and hydration begins: React walks the existing DOM, confirms it matches its expected output, and attaches an onClick handler to the "Add to Cart" button, an onChange handler to the quantity selector, and initializes the image carousel's swipe logic. The page goes from visible to fully interactive in a smooth transition.

```js
import { hydrateRoot } from "react-dom/client";
import App from "./App";

// The server already rendered <div id="root">...</div> with full HTML.
// hydrateRoot attaches event handlers to the existing DOM
// instead of re-creating it from scratch.
hydrateRoot(document.getElementById("root"), <App />);
```

## When to use

- Any application using SSR or SSG with a framework like React, Vue, or Angular that needs client-side interactivity after the initial HTML render
- When you want both fast content display (good LCP) and full interactivity without re-rendering the entire page from scratch
- E-commerce, media, and content sites where the first impression must be fast but the page still needs rich interactive features
- When using frameworks like Next.js, Nuxt, or SvelteKit that handle hydration as part of their built-in rendering pipeline

## When to avoid

- Fully static pages with no interactive elements — hydration adds JavaScript overhead for zero benefit on pages that only display content
- When using frameworks like Astro with its islands architecture, where you can selectively hydrate only the interactive components instead of the entire page
- Performance-critical scenarios where the hydration JavaScript bundle is too large, negating the speed advantage of server rendering

## Trade-offs

- **Fast initial content vs. delayed interactivity**: Users see the page immediately, but there is a window where visible elements do not respond to interaction until hydration completes
- **No visual flash vs. CPU cost**: The page does not re-render from a blank screen, but the browser must download, parse, and execute the full JavaScript framework to replay component logic on existing DOM nodes
- **SSR compatibility vs. hydration mismatches**: The approach enables the best of server and client rendering, but differences between server and client output cause warnings and can break the layout

## Common small mistakes

- Rendering different content on the server and client (such as using Date.now() or Math.random()), which causes hydration mismatch errors
- Not realizing that hydration still requires downloading the full JavaScript bundle, so a page with a 2MB bundle will have a long gap between visible and interactive
- Ignoring the "uncanny valley" problem where users click buttons during the hydration gap and nothing happens, leading to frustration and repeated clicks
- Treating hydration as free — on low-powered mobile devices, parsing and executing JavaScript to hydrate a large page can block the main thread for seconds
