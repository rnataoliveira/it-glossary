---
title: "Reverse Proxy"
letter: "R"
categories:
  - "create-system-design"
  - "improve-performance"
  - "back-end-applications"
shortDefinition: "A server that sits in front of backend servers, forwarding client requests and providing load balancing, caching, and SSL termination."
---

## Why does it exist?

Exposing backend application servers directly to the internet creates problems: they must handle SSL termination, serve static files efficiently, manage slow clients, and defend against malicious traffic — all while running application logic. A reverse proxy was introduced as an intermediary layer that accepts client requests, handles these cross-cutting concerns, and forwards only clean, well-formed requests to the backend. This separation of responsibilities makes backends simpler, more secure, and easier to scale.

## Practical example of use

A startup runs three instances of a Node.js API behind Nginx configured as a reverse proxy. Nginx listens on port 443, terminates TLS using a Let's Encrypt certificate, and forwards requests to the Node.js instances on ports 3001-3003 using round-robin load balancing. It also serves static files directly from disk, compresses responses with gzip, and caches JSON responses for product listings with a 60-second TTL. The Node.js processes never deal with SSL, static files, or compression — they only execute business logic.

## When to use

- Any production web application that needs SSL termination, compression, or static file serving without burdening the application server
- Load balancing traffic across multiple backend instances without a dedicated cloud load balancer
- Protecting backend servers by hiding their IP addresses and filtering malicious requests (rate limiting, request size limits, IP blocking)
- A/B testing or canary deployments by routing a percentage of traffic to a new version of the backend

## When to avoid

- Serverless architectures where the cloud provider (AWS API Gateway, Cloudflare Workers) already handles routing, SSL, and scaling
- Simple single-instance applications in development or early prototyping where the added configuration is unnecessary overhead
- When a managed cloud load balancer (ALB, Cloud Load Balancing) already provides the same features with less operational burden

## Trade-offs

- **Security and control vs. added infrastructure**: Backends are shielded from direct exposure, but you must deploy, configure, and maintain another service (Nginx, HAProxy, Envoy, Caddy).
- **Performance from caching and compression vs. single point of failure**: A reverse proxy can dramatically reduce backend load, but if it goes down without redundancy, all traffic stops.
- **Flexibility vs. configuration complexity**: Reverse proxies support sophisticated routing rules, header manipulation, and rewrites, but misconfiguration can silently break functionality or introduce security holes.

## Common small mistakes

- Not setting proper `X-Forwarded-For` and `X-Forwarded-Proto` headers, causing backend applications to misidentify client IPs and protocols
- Configuring buffer sizes too small for large request bodies (file uploads), resulting in `413 Request Entity Too Large` errors at the proxy layer
- Caching authenticated or user-specific responses, accidentally serving one user's data to another
- Running a single reverse proxy instance without health checks or failover, turning it into the single point of failure it was meant to prevent
