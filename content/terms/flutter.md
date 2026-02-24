---
title: "Flutter"
letter: "F"
categories:
  - "mobile"
  - "frontend"
shortDefinition: "Google's UI toolkit for building natively compiled apps for mobile, web, and desktop from a single Dart codebase, using its own rendering engine instead of platform-native components."
---

## Why does it exist?

Every cross-platform framework before Flutter faced the same tension: use native UI components (consistent with the platform but hard to share) or use a WebView (easy to share but not native). Flutter took a third approach — ship its own high-performance rendering engine (Skia, later Impeller) and draw every pixel itself. This means Flutter apps look identical on iOS and Android because they do not delegate rendering to platform widgets at all. Google also designed a new language, Dart, optimized for UI work: hot reload for instant development feedback, strong typing, and ahead-of-time compilation to native ARM code for production performance.

## Practical example of use

A fintech company builds a banking app in Flutter. The design team creates a custom card widget with a gradient, an animated balance counter, and a swipeable transaction list. Because Flutter renders everything itself, the card looks pixel-perfect on both platforms with no platform-specific adjustments. The same widget tree renders in a web browser for the desktop experience. The team uses Flutter's `BLoC` pattern to separate business logic from UI, and communicates with the bank's REST API through a shared Dart service layer that works identically on all targets.

## When to use

- When pixel-perfect, highly customized UI is a core product requirement and you cannot accept platform-native component appearance variation
- When targeting multiple platforms (iOS, Android, web, desktop) from a single codebase is a strategic priority
- When your team is willing to learn Dart, which has a shallow learning curve for developers familiar with Java, Kotlin, or TypeScript
- Consumer apps, fintech, and design-driven products where visual consistency across platforms is critical

## When to avoid

- When deep integration with platform-specific UI paradigms is important — Flutter's custom rendering means it does not automatically adopt new platform design guidelines like Material You or iOS design changes
- When the team has existing native expertise and the product requires platform-specific features that Flutter's plugin ecosystem does not yet cover
- Very simple apps where the overhead of the Flutter engine binary (~5-10MB) and Dart runtime is not justified

## Trade-offs

- **Pixel-perfect consistency vs. platform feel**: Flutter controls every pixel, ensuring identical appearance everywhere, but apps may feel slightly foreign on each platform since they do not use native components
- **Single codebase vs. app size**: One Dart codebase targets all platforms, but Flutter bundles its own rendering engine, making apps larger than minimal native apps
- **Fast development vs. Dart lock-in**: Hot reload and a coherent widget system make iteration fast, but the team must invest in Dart, a language not used elsewhere in most organizations
- **Custom rendering vs. accessibility**: Flutter's custom renderer has improved accessibility significantly but still lags behind native components in some edge cases

## Common small mistakes

- Building everything as a `StatefulWidget` when `StatelessWidget` with a state management solution (Provider, Riverpod, BLoC) is more maintainable for complex apps
- Putting logic directly in widget `build()` methods, which is called on every frame — expensive computations should live in controllers or notifiers
- Ignoring `const` constructors — Flutter can skip rebuilding `const` widgets, significantly improving performance in large widget trees
- Not handling platform channels correctly when bridging to native code, leading to type mismatches or threading issues
- Overlooking accessibility: not providing semantic labels for custom-drawn widgets that screen readers cannot interpret without explicit `Semantics` wrappers
