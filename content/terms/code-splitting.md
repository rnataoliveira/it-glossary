---
title: "Code Splitting"
letter: "C"
categories:
  - "improve-performance"
  - "front-end-applications"
shortDefinition: "Breaking a JavaScript bundle into smaller chunks that are loaded on demand, reducing the initial page load size."
---

## Why does it exist?

Modern web applications can easily produce JavaScript bundles of several megabytes. Sending all of this code to the browser upfront means users must download, parse, and execute JavaScript for features they may never use — like the settings page or the admin panel — before they can interact with the page they actually requested. Code splitting was introduced to break monolithic bundles into smaller, focused chunks that are loaded only when needed, dramatically reducing the initial load time and improving Time to Interactive.

## Practical example of use

A SaaS analytics dashboard built with React uses route-based code splitting via React.lazy and dynamic imports. The main bundle contains the login page, navigation shell, and the primary dashboard view — about 120KB gzipped. When a user navigates to the reports section for the first time, a separate 85KB chunk containing the charting library and report components is fetched on demand. The admin settings panel, used by only 5% of users, lives in its own 40KB chunk that most users never download at all. The initial page load went from 350KB to 120KB, cutting Time to Interactive by 40%.

```js
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// These chunks are only loaded when the user navigates to the route
const Reports = lazy(() => import("./pages/Reports"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin" element={<AdminSettings />} />
      </Routes>
    </Suspense>
  );
}
```

## When to use

- Any application with multiple routes or views where users typically visit only a subset during a session
- When your bundle includes heavy libraries (chart libraries, rich text editors, PDF generators) that are only used in specific features
- Single Page Applications where the entire application would otherwise ship as one large file
- When Lighthouse or bundle analysis reveals that unused JavaScript is a significant portion of the initial page load

## When to avoid

- Very small applications where the total JavaScript is already under 50-100KB gzipped and the overhead of managing chunks outweighs the savings
- When aggressive splitting creates too many tiny chunks, causing excessive HTTP requests that hurt performance more than a slightly larger single bundle
- Server-rendered pages where the critical JavaScript is already minimal and most content is static HTML

## Trade-offs

- **Faster initial load vs. navigation delays**: Users get the first page faster, but navigating to a new route may show a brief loading spinner while the chunk downloads
- **Smaller bundles vs. build complexity**: Each chunk is smaller and more focused, but configuring split points, managing shared dependencies, and avoiding duplicate code across chunks requires careful setup
- **On-demand loading vs. caching granularity**: Loading only what is needed saves bandwidth, but changing one shared utility can invalidate the cache for multiple chunks if the bundler does not isolate shared code properly

## Common small mistakes

- Splitting at too granular a level, creating dozens of tiny files that generate excessive network requests and negate the performance benefit
- Forgetting to prefetch or preload chunks for routes the user is likely to visit next, causing unnecessary loading delays on navigation
- Not extracting shared vendor libraries into a separate chunk, resulting in React or Lodash being duplicated across multiple route chunks
- Ignoring the loading state when a chunk is being fetched — users clicking a navigation link should see a loading indicator, not a frozen interface
