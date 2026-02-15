---
title: "Load Testing"
letter: "L"
categories:
  - "testing"
  - "performance"
shortDefinition: "Simulating realistic user traffic against a system to measure its performance, throughput, and behavior under expected and peak loads."
---

## Why does it exist?

Applications that work flawlessly for one user can collapse under a thousand concurrent users. Database connection pools exhaust, memory leaks surface, response times degrade nonlinearly, and queues back up in ways that are invisible during normal development and testing. Load testing exists to reveal these bottlenecks before real users encounter them by simulating realistic traffic patterns and measuring how the system responds.

Without load testing, capacity planning is guesswork. Teams discover scaling limits during traffic spikes — Black Friday sales, product launches, viral moments — when the cost of failure is highest. Load testing shifts this discovery left, giving teams data to make informed decisions about infrastructure, caching, and architectural changes.

## Practical example of use

An e-commerce API needs to handle 500 concurrent users browsing products and placing orders during peak hours. A k6 script simulates this traffic and measures response times.

```javascript
// load-test.js — run with: k6 run load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // Ramp up to 100 users over 1 minute
    { duration: '3m', target: 500 },  // Ramp up to 500 users over 3 minutes
    { duration: '5m', target: 500 },  // Hold at 500 users for 5 minutes
    { duration: '1m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests must complete under 300ms
    http_req_failed: ['rate<0.01'],   // Less than 1% failure rate
  },
};

export default function () {
  // Browse product catalog
  const catalog = http.get('https://api.example.com/products?page=1&limit=20');
  check(catalog, {
    'catalog returns 200': (r) => r.status === 200,
    'catalog has products': (r) => JSON.parse(r.body).length > 0,
  });

  sleep(1); // Simulate user think time

  // View a specific product
  const product = http.get('https://api.example.com/products/42');
  check(product, {
    'product returns 200': (r) => r.status === 200,
  });

  sleep(2);

  // Place an order
  const order = http.post(
    'https://api.example.com/orders',
    JSON.stringify({ productId: 42, quantity: 1 }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(order, {
    'order returns 201': (r) => r.status === 201,
  });

  sleep(1);
}
```

## When to use

- Before major releases or launches to validate that the system meets expected traffic demands
- When infrastructure changes (new database, different cloud region, container orchestration changes) may affect performance
- After significant architectural changes such as introducing caching layers, switching databases, or adding microservices
- As part of regular CI/CD pipelines for performance-critical services to catch regressions early

## When to avoid

- As a substitute for profiling — load testing reveals symptoms (slow responses), but profiling tools pinpoint causes (inefficient queries, memory leaks)
- Against production systems without proper safeguards, as the synthetic traffic can degrade service for real users
- When the application is still in early development and the architecture is changing frequently — results will be invalidated quickly
- For testing correctness of business logic — functional tests are the right tool for that

## Trade-offs

- **Realism vs. cost**: Realistic load tests require production-like infrastructure, which is expensive. Testing against undersized environments gives misleading results.
- **Thoroughness vs. complexity**: Simulating real user behavior (varied endpoints, think times, session state) produces accurate results but requires significant scripting effort.
- **Early detection vs. environment availability**: Running load tests early in development is ideal, but staging environments that mirror production are often not available until later.

## Common small mistakes

- Running load tests against environments that do not match production sizing, leading to false confidence or false alarms
- Ignoring think time between requests, which inflates the effective load beyond what real users would generate
- Only testing the happy path and ignoring error scenarios like timeouts, retries, and 5xx responses under load
- Focusing solely on average response time instead of percentiles (p95, p99), which hide tail latency problems
- Not establishing a performance baseline before making changes, making it impossible to measure improvement or regression
