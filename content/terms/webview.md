---
title: "WebView"
letter: "W"
categories:
  - "mobile"
  - "frontend"
shortDefinition: "An embeddable browser component that allows a native mobile app to display web content or run a web application inside a native shell."
---

## Why does it exist?

Not all content in a mobile app needs to be implemented natively. Legal documents, marketing pages, payment flows from third-party providers, and feature-rich web applications can be displayed inside a native app without rebuilding them. WebView provides a browser engine embedded directly in the app — on iOS this is `WKWebView`, on Android it is `android.webkit.WebView`. This lets teams reuse existing web code inside native apps, integrate third-party web flows, and ship web-based features to mobile users without publishing a new app version.

WebView also underpins hybrid app frameworks like Cordova and Ionic, where the entire app UI runs as a web page inside a full-screen WebView with JavaScript bridges to native device APIs.

## Practical example of use

A banking app uses native screens for the main dashboard, account summary, and transfers — areas that require native performance and deep OS integration (biometrics, notifications). However, the bank's loan application flow was built as a complex multi-step web form by a separate team. Instead of rewriting it natively, the app opens a `WKWebView` when the user taps "Apply for a loan," loading the web form with the user's session token injected into the initial request headers. The user completes the form in the WebView. When the form submits, a JavaScript bridge posts a message to the native app, which dismisses the WebView and updates the native UI to reflect the pending application.

## When to use

- Rendering third-party content or payment flows that you do not control and cannot rebuild natively
- Displaying rich text content (help articles, terms of service, release notes) that is easier to maintain as HTML than as native UI
- Hybrid apps (Cordova, Ionic, Capacitor) where the entire UI is web-based and WebView is the deliberate architecture
- Shipping web-based features to existing app users without requiring an app store update

## When to avoid

- Core app screens where users expect native performance, smooth scrolling, and platform-native gestures — WebView lags noticeably compared to native UI on older devices
- When the web content is not optimized for mobile, resulting in a desktop-site-in-a-phone experience
- Security-sensitive flows where loading arbitrary URLs in a WebView could expose the app to JavaScript injection or phishing via URL spoofing

## Trade-offs

- **Code reuse vs. performance**: WebView lets you ship web content in a native shell without rebuilding it, but web rendering is slower than native rendering, and the experience can feel foreign compared to the rest of the app
- **Easy updates vs. App Store control**: Web content inside a WebView can be updated without an app store review, but Apple and Google prohibit using this to deliver entirely new functionality without going through the review process
- **Integration flexibility vs. security risk**: JavaScript bridges between the WebView and native code enable powerful integrations, but each bridge method exposed to the web layer expands the attack surface

## Common small mistakes

- Loading arbitrary URLs passed in through deep links or push notifications without validating them first — this opens the app to open redirect attacks and phishing
- Exposing overly broad JavaScript bridge interfaces that allow web content to call sensitive native functions (file system, contacts, camera) without proper permission checks
- Not setting `allowsInlineMediaPlayback` and other platform-specific policies correctly, resulting in unexpected fullscreen video or audio behavior
- Ignoring the WebView's back-navigation behavior — users expect the hardware back button (Android) or swipe gesture (iOS) to navigate within the WebView's history before exiting it
- Not handling SSL errors: dismissing SSL certificate errors to avoid user-facing alerts creates a man-in-the-middle vulnerability
