---
title: "CDN"
letter: "C"
categories:
  - "performance"
  - "architecture"
shortDefinition: "A geographically distributed network of servers that delivers cached content from locations closest to the user."
---

## Why does it exist?

Serving all traffic from a single origin server means users far from that server experience high latency — a request from Tokyo to a server in Virginia adds hundreds of milliseconds of round-trip time. CDNs were created to solve this by caching content at edge locations around the world. When a user requests a resource, the CDN serves it from the nearest point of presence (PoP), dramatically reducing latency and offloading traffic from the origin.

## Practical example of use

A news website uses Cloudflare as its CDN. Static assets — images, CSS, JavaScript bundles — are cached at over 300 edge locations worldwide. When a reader in Sao Paulo loads the homepage, the HTML is fetched from the origin in US-East, but all static assets are served from Cloudflare's Sao Paulo PoP with sub-10 ms latency. During a traffic spike from a breaking news story, the CDN absorbs 95% of the requests, keeping the origin server healthy and responsive.

## When to use

- Serving static assets (images, fonts, CSS, JS) for any web application with a geographically distributed audience
- Protecting origin servers from traffic spikes and DDoS attacks by absorbing requests at the edge
- Streaming video or large file downloads where latency and throughput matter
- Improving Time to First Byte (TTFB) for SEO and Core Web Vitals performance metrics

## When to avoid

- Highly dynamic, personalized content that changes per user and cannot be cached (e.g., real-time dashboards with per-user data)
- Internal applications accessed only from a corporate network close to the origin
- When cache invalidation complexity outweighs the performance benefit — frequently changing content may result in stale responses

## Trade-offs

- **Low latency vs. cache staleness**: Content loads faster from the edge, but you must carefully manage TTLs and purge strategies to avoid serving outdated data.
- **Origin offloading vs. cost**: CDNs reduce load on your servers, but bandwidth and request costs at scale can be significant, especially for video streaming.
- **Global reach vs. debugging complexity**: Users worldwide get fast responses, but troubleshooting issues becomes harder because behavior varies by PoP, cache state, and region.

## Common small mistakes

- Setting `Cache-Control: no-cache` on assets that rarely change, forcing every request back to the origin and negating the CDN entirely
- Not versioning static assets (e.g., `app.v2.js` or content hashing) — deploying new code while the CDN still serves the old cached version
- Caching responses that contain user-specific data (auth tokens, personalized content), leaking private information to other users
- Forgetting to enable compression (gzip/Brotli) at the CDN layer, sending uncompressed assets to clients despite edge proximity
