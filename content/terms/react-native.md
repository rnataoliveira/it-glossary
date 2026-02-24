---
title: "React Native"
letter: "R"
categories:
  - "mobile"
  - "frontend"
shortDefinition: "A JavaScript framework for building native iOS and Android apps using React components that map to platform-native UI elements."
---

## Why does it exist?

Building mobile apps traditionally required two entirely separate codebases — Swift or Objective-C for iOS, Kotlin or Java for Android — maintained by teams with different skill sets, diverging features, and doubled QA effort. React Native, released by Meta in 2015, was created to let product teams write most of their app logic once in JavaScript using the same React programming model as web, while still rendering genuine native UI components instead of a WebView. The result is a single codebase that produces apps that look, feel, and perform like native apps, without the overhead of maintaining two parallel implementations.

## Practical example of use

A startup builds a social feed app. The main feed screen is written once in React Native: a `FlatList` rendering `PostCard` components. On iOS, `FlatList` compiles to `UITableView`; on Android, it compiles to `RecyclerView`. Navigation uses React Navigation, which renders native stack transitions on both platforms. Platform-specific code is isolated to a few files — the camera permission dialog uses a conditional import with `.ios.ts` and `.android.ts` suffixes. The team ships to both stores from one codebase, maintained by frontend engineers already familiar with React.

## When to use

- When your team has strong JavaScript/React skills and limited native iOS or Android experience
- When time-to-market matters and maintaining two native codebases is not justified by the product's current scale
- Business apps, content apps, e-commerce, and social products where the UI is primarily lists, forms, and standard navigation patterns
- When a significant portion of business logic (API calls, state management, validation) can be shared across platforms

## When to avoid

- Apps that require deep, platform-specific integrations like advanced AR, complex animations at 120fps, or heavy use of platform-specific APIs not yet bridged by the community
- CPU or GPU-intensive applications like 3D games or video editors where the JavaScript bridge introduces unacceptable latency
- When the team has strong native expertise on both platforms and the product requires highly differentiated iOS and Android experiences

## Trade-offs

- **Code sharing vs. platform fidelity**: Most logic and many UI components are shared, but subtle differences in platform behavior (gestures, navigation, keyboard handling) require platform-specific adjustments that can erode the "write once" ideal
- **JavaScript vs. native performance**: Business logic runs in a JS engine and communicates with native modules via a bridge (or the newer JSI), adding overhead compared to fully native code for performance-critical paths
- **Large ecosystem vs. dependency risk**: A rich ecosystem of community libraries extends React Native, but third-party packages may lag behind new OS versions or be abandoned, requiring the team to fork or replace them

## Common small mistakes

- Treating React Native as identical to React web — layout uses Flexbox but there is no CSS cascade, no `display: block`, and no `<div>` elements
- Ignoring platform-specific styling, resulting in an app that looks fine on iOS but feels out of place on Android (or vice versa)
- Putting heavy computation directly in the render thread instead of offloading it to background threads via `InteractionManager` or native modules
- Not testing on real physical devices — simulators hide real-world performance issues, especially on mid-range Android hardware
- Upgrading React Native without reading the upgrade guide, as breaking changes between versions require careful migration of dependencies and native code
