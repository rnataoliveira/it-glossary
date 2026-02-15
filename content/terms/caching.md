---
title: "Caching"
letter: "C"
categories:
  - "improve-performance"
  - "create-system-design"
shortDefinition: "Storing copies of data in a faster-access layer to reduce latency and load on the original source."
---

## Why does it exist?

Every time a system fetches data from a database or external API, it takes time. Caching exists to avoid repeating expensive operations by keeping frequently accessed data closer to where it is needed — in memory, on disk, or at the edge. This reduces response times, lowers infrastructure costs, and improves user experience.

## Practical example of use

An e-commerce site caches product catalog pages in Redis. When a user visits a product page, the app first checks the cache. If the data is there (cache hit), it returns instantly. If not (cache miss), it queries the database, stores the result in cache with a 5-minute TTL, and returns it to the user.

## When to use

- Read-heavy workloads where the same data is requested repeatedly
- Expensive computations or slow external API calls
- Static or semi-static content (configuration, reference data)
- When you need sub-millisecond response times

## When to avoid

- Highly dynamic data that changes every request
- When data consistency is critical and stale data is unacceptable
- Small datasets that are already fast to query
- Early-stage projects where caching adds unnecessary complexity

## Trade-offs

- **Speed vs. freshness**: Cached data can become stale. You must decide on a TTL or invalidation strategy.
- **Memory vs. cost**: Caching uses RAM, which is more expensive than disk storage.
- **Simplicity vs. complexity**: Cache invalidation is famously one of the hardest problems in computer science.

## Common small mistakes

- Not setting a TTL, leading to permanently stale data
- Caching error responses or empty results
- Using cache as a primary data store instead of a performance layer
- Not handling cache misses gracefully (thundering herd problem)
- Over-caching in development, then wondering why changes don't appear
