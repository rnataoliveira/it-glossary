---
title: "Progressive Web App"
letter: "P"
categories:
  - "frontend"
  - "mobile"
shortDefinition: "A web application that uses modern browser features like service workers and manifests to deliver app-like experiences."
---

## Why does it exist?

Native mobile apps offer features that traditional websites cannot match — offline access, push notifications, home screen icons, and smooth performance. However, building native apps requires separate codebases for iOS and Android, going through app store review processes, and convincing users to install yet another app. Progressive Web Apps bridge this gap by using web technologies with modern browser APIs to deliver app-like experiences directly through the browser, with no app store required and a single codebase that works across all platforms.

## Practical example of use

Starbucks built a PWA for their ordering experience. When a customer visits the site on their phone, the browser prompts them to "Add to Home Screen," which installs the PWA with the Starbucks icon. A service worker caches the menu, UI assets, and recent order data. The next time the customer opens the app in an area with poor connectivity — like a subway — the full menu loads from the cache, they can browse and customize their order offline, and the order is submitted automatically when connectivity returns. The PWA is 99.84% smaller than the native iOS app while delivering a comparable experience.

## When to use

- When you want to reach users across all platforms (iOS, Android, desktop) with a single web-based codebase
- Content and commerce applications where reducing friction to first use matters — no app store download, no install wait
- When offline or low-connectivity support is valuable, such as field service apps, travel guides, or news readers
- Applications where push notifications drive re-engagement but building a full native app is not justified by the use case

## When to avoid

- When you need deep access to device hardware like Bluetooth, NFC, advanced camera controls, or AR frameworks that are not yet available through web APIs
- Highly performance-sensitive applications like 3D games, video editors, or real-time audio processing where native performance is essential
- When your primary distribution channel is the app store and users expect the full native app store experience including ratings, reviews, and discovery

## Trade-offs

- **Single codebase vs. platform limitations**: One codebase runs everywhere, but iOS still restricts PWA capabilities — no push notifications until recent versions, limited background sync, and storage quotas that can cause data loss
- **No install friction vs. lower discoverability**: Users access the app instantly via URL, but they miss the app store as a discovery and trust mechanism
- **Offline capability vs. cache management complexity**: Service workers enable offline access, but caching strategies (cache-first, network-first, stale-while-revalidate) must be carefully designed to avoid serving stale data or consuming excessive storage

## Common small mistakes

- Not providing a proper web app manifest with correct icons, theme colors, and display mode, resulting in a generic browser shortcut instead of an app-like experience
- Using a cache-first strategy for API responses without a revalidation mechanism, serving users data that is days or weeks out of date
- Forgetting to handle service worker updates — users can be stuck on an old version of the app indefinitely if the update flow is not managed with skipWaiting and clients.claim
- Assuming PWAs work identically across all browsers — Safari and iOS WebKit have historically lagged behind Chrome in PWA feature support, requiring careful feature detection and fallbacks
