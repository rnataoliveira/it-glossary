---
title: "Static Site Generation"
letter: "S"
categories:
  - "improve-performance"
  - "explain-architecture"
  - "front-end-applications"
shortDefinition: "Pre-rendering all pages at build time into static HTML files that can be served directly from a CDN."
---

## Why does it exist?

Dynamic server rendering for every request is wasteful when the content is the same for every visitor. If a blog post or documentation page looks identical no matter who requests it, generating the HTML once at build time and serving it as a static file is dramatically faster and cheaper. Static Site Generation emerged to let developers use modern frameworks and templating while producing plain HTML files that CDNs can serve globally with near-instant response times and zero server-side compute at runtime.

## Practical example of use

A developer documentation site built with Astro pulls content from 500 Markdown files and an API containing code examples. At build time, the framework fetches all content, renders every page into static HTML with syntax-highlighted code blocks, and outputs the result to a dist folder. The files are deployed to Cloudflare Pages. When a developer in Tokyo requests a page, it is served from the nearest CDN edge node in under 50ms with no origin server involved.

## When to use

- Content that changes infrequently and is the same for all users, such as blogs, documentation, marketing sites, and changelogs
- When you need maximum performance and minimal hosting costs — static files on a CDN are the fastest and cheapest way to serve web content
- Sites where high availability matters, because static files have no server to crash, no database to go down
- When SEO is important and you want every page fully rendered with correct meta tags at crawl time

## When to avoid

- Pages with highly personalized or real-time content, such as social feeds, live dashboards, or user-specific pricing
- Sites with thousands of pages that change frequently, where rebuild times become impractically long
- Applications that require dynamic server-side logic per request, such as authentication-gated content or A/B testing at the page level

## Trade-offs

- **Fastest possible delivery vs. stale content**: Pre-built files are served instantly from CDNs, but content updates require a full or incremental rebuild and redeployment
- **Simplified infrastructure vs. build complexity**: No servers to manage at runtime, but build pipelines become critical infrastructure and long build times can slow down publishing workflows
- **Excellent SEO and reliability vs. limited dynamism**: Every page is a complete HTML document ready for crawlers, but client-side JavaScript or edge functions are needed for any personalized or interactive features

## Common small mistakes

- Not setting up incremental or on-demand rebuilds, forcing a full rebuild of thousands of pages for a single content change
- Embedding secrets or API keys in the build output because "it is just a static site" — the HTML and JavaScript are fully public
- Forgetting to configure cache invalidation on the CDN after a new build, so users keep seeing stale content
- Using SSG for pages that actually need per-request data, leading to workarounds with client-side fetching that negate the benefits of pre-rendering
