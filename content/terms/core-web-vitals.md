---
title: "Core Web Vitals"
letter: "C"
categories:
  - "frontend"
  - "performance"
shortDefinition: "A set of Google-defined metrics — LCP, INP, and CLS — that measure real-world user experience for loading, interactivity, and visual stability."
---

## Why does it exist?

Web performance has dozens of metrics, and developers historically focused on technical indicators like DOM Content Loaded or Time to First Byte that do not always correlate with what users actually experience. Google introduced Core Web Vitals to standardize how the industry measures user-perceived performance around three critical dimensions: how fast the main content appears (LCP), how quickly the page responds to interaction (INP), and how visually stable the layout is during loading (CLS). These metrics are also factored into Google's search ranking algorithm, giving teams a business incentive to optimize them.

## Practical example of use

An e-commerce team notices their product pages rank poorly in Google Search and their analytics show a high bounce rate on mobile. They run a Core Web Vitals assessment using PageSpeed Insights and discover three problems: LCP is 5.2 seconds because the hero product image is unoptimized and loaded lazily above the fold, INP is 340ms because a third-party analytics script blocks the main thread during click handlers, and CLS is 0.18 because an ad banner loads after the page renders and pushes the "Add to Cart" button down. They fix each issue — preloading the hero image, deferring the analytics script, and reserving space for the ad — bringing LCP to 2.1s, INP to 120ms, and CLS to 0.04.

## When to use

- As the primary performance metrics for any user-facing web application, especially those dependent on organic search traffic
- During development, as part of a performance budget in CI pipelines using Lighthouse CI or similar tools
- When diagnosing why users complain about a site feeling slow, unresponsive, or "jumpy" — CWV metrics pinpoint the exact category of problem
- For ongoing monitoring in production using Real User Monitoring (RUM) tools like Google's CrUX report, Datadog, or SpeedCurve

## When to avoid

- Do not use CWV as the only performance metrics — they do not cover everything, such as Time to First Byte, total page weight, or JavaScript execution time
- Internal tools and authenticated dashboards where search ranking is irrelevant may benefit from different performance priorities
- Avoid over-optimizing CWV scores at the expense of functionality or developer experience — a perfect score means nothing if the product does not work

## Trade-offs

- **Standardized benchmarks vs. incomplete picture**: CWV provides universal, comparable metrics across sites, but three numbers cannot capture every aspect of user experience
- **SEO incentive vs. metric gaming**: The search ranking signal motivates performance investment, but teams may chase scores by deferring content rather than genuinely improving the experience
- **Real user data vs. variability**: Field data from CrUX reflects actual user experience, but it aggregates over 28 days and varies by geography, device, and network, making it hard to correlate with specific code changes

## Common small mistakes

- Optimizing only lab data (Lighthouse) while ignoring field data (CrUX), which reflects what real users on real devices actually experience
- Lazy-loading the LCP element (usually the hero image or largest heading), which delays the very metric you are trying to improve
- Not reserving explicit dimensions for images, ads, and embeds, which causes layout shifts that tank your CLS score
- Treating Core Web Vitals as a one-time fix rather than an ongoing concern — third-party scripts, new features, and content changes can regress metrics at any time
