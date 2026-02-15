---
title: "Rate Limiting"
letter: "R"
categories:
  - "improve-reliability"
  - "improve-performance"
  - "create-system-design"
shortDefinition: "Controlling the number of requests a client can make to a service within a given time window to prevent abuse and protect resources."
---

## Why does it exist?

Without rate limiting, a single client — whether malicious or buggy — can overwhelm a service, causing degraded performance or outages for everyone. Rate limiting protects shared resources, ensures fair usage, and provides a defense layer against DDoS attacks and scraping.

## Practical example of use

A public REST API allows 100 requests per minute per API key. The server uses a token bucket algorithm backed by Redis. When a client exceeds the limit, it receives a `429 Too Many Requests` response with a `Retry-After` header indicating when they can try again.

## When to use

- Public-facing APIs consumed by external clients
- Authentication endpoints (to prevent brute-force attacks)
- Expensive operations like file uploads, report generation, or search
- Multi-tenant systems where one tenant should not starve others

## When to avoid

- Internal service-to-service calls in trusted networks (use circuit breakers instead)
- When the overhead of tracking request counts is not justified
- Real-time systems where any request delay is unacceptable

## Trade-offs

- **Protection vs. user experience**: Aggressive limits protect the system but frustrate legitimate users.
- **Simplicity vs. fairness**: Simple per-IP limiting is easy but can block shared networks (offices, VPNs). Per-user or per-API-key is fairer but requires authentication.
- **Algorithms**: Fixed window is simple but has burst issues at window boundaries. Sliding window and token bucket are smoother but more complex.

## Common small mistakes

- Not returning helpful rate limit headers (`X-RateLimit-Remaining`, `Retry-After`)
- Applying the same limits to all endpoints (an expensive search should have a lower limit than a simple read)
- Rate limiting only at the edge and not protecting downstream services
- Not testing what happens when limits are reached (does the app handle 429 gracefully?)
- Storing rate limit state only in memory, losing it on server restart
