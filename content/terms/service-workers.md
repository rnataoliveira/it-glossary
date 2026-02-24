---
title: "Service Workers"
letter: "S"
categories:
  - "frontend"
  - "performance"
  - "mobile"
shortDefinition: "A browser API that runs a script in the background, separate from the web page, enabling features like offline caching, push notifications, and network request interception."
---

## Why does it exist?

The traditional web model assumes a constant network connection: the browser requests a resource, the server responds, and the page renders. When the connection drops, the user sees a blank page or a browser error. Service workers break this assumption by sitting between the browser and the network as a programmable proxy. They can intercept fetch requests, serve cached responses, and enable offline functionality that was previously only possible in native applications.

Beyond offline support, service workers unlock capabilities like background sync (queuing actions while offline and replaying them when connectivity returns) and push notifications (receiving messages from a server even when the page is closed). These features are the foundation of Progressive Web Apps (PWAs), which aim to deliver app-like experiences through the browser.

## Practical example of use

A service worker implementing a cache-first strategy ensures that users see content instantly from the cache while the network is used as a fallback. If both the cache and network fail, it serves a dedicated offline page:

```javascript
// sw.js — Cache-first strategy with network fallback
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) =>
      cache.addAll(["/", "/styles.css", "/app.js", "/offline.html"])
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (cached) => cached || fetch(event.request).catch(() => caches.match("/offline.html"))
    )
  );
});
```

During the `install` phase, critical assets are pre-cached. On every subsequent fetch, the service worker checks the cache first. If the requested resource is cached, it returns it immediately without touching the network. If not, it falls back to a network request. If the network also fails, the user sees the offline page instead of a browser error.

## When to use

- When building a Progressive Web App that needs to work offline or on unreliable networks.
- When you want to pre-cache critical assets so that repeat visits load instantly regardless of network conditions.
- When the application requires push notifications to re-engage users even when the browser tab is closed.
- When you need fine-grained control over caching strategies (cache-first, network-first, stale-while-revalidate) for different types of resources.

## When to avoid

- When the application is entirely dynamic with user-specific, real-time data that cannot be meaningfully cached (e.g., a live trading dashboard).
- When the added complexity of cache invalidation and versioning is not justified by the offline or performance benefits.
- When you are building an internal tool used exclusively on a reliable corporate network where offline capability provides no value.
- When the team lacks experience with service worker lifecycle management and cache debugging, which can lead to users being stuck on stale content.

## Trade-offs

- **Offline capability vs. cache staleness**: Serving cached responses makes the app fast and available offline, but users may see outdated content unless the cache invalidation strategy is carefully designed.
- **Performance gains vs. debugging difficulty**: Service workers operate in a separate thread with their own lifecycle, making them harder to debug than regular application code.
- **Progressive enhancement vs. complexity**: Adding a service worker to an existing app is non-trivial and introduces new failure modes (stale caches, registration errors, update races) that the team must handle.

## Common small mistakes

- Caching API responses with user-specific data, which can cause one user to see another user's data if the cache key is not scoped properly.
- Not versioning the cache (e.g., `"v1"`, `"v2"`) and not cleaning up old caches during the `activate` event, leading to storage bloat.
- Forgetting that service workers only work over HTTPS (with the exception of `localhost` for development).
- Not handling the update flow properly, causing users to be stuck on an old version of the service worker until they close all tabs.
- Caching everything aggressively without considering storage limits, which can cause the browser to evict important cached resources.
