---
title: "Strangler Fig Pattern"
letter: "S"
categories:
  - "architecture"
shortDefinition: "A migration strategy that incrementally replaces a legacy system by routing features one at a time to a new implementation."
---

## Why does it exist?

Rewriting a large legacy system from scratch is one of the riskiest undertakings in software engineering. Big-bang rewrites often take longer than expected, introduce regressions, and sometimes never ship at all. Meanwhile, the legacy system continues to evolve, widening the gap between old and new.

The Strangler Fig Pattern, named after the tropical fig vine that gradually envelops and replaces a host tree, offers a safer alternative. Instead of replacing the entire system at once, you build new functionality alongside the old system and incrementally redirect traffic -- feature by feature, route by route -- from the legacy code to the new implementation. At each step, both systems coexist, so you can validate behavior, roll back easily, and deliver value continuously.

## Practical example of use

A company runs a monolithic PHP e-commerce application and wants to migrate to a Node.js microservices architecture. Rather than rewriting everything, they place a reverse proxy (e.g., NGINX or an API gateway) in front of the monolith. They start with the product catalog: a new Catalog Service is built, tested, and deployed. The proxy is configured to route `/api/products/*` to the new service while all other routes still hit the monolith. After validating the new catalog service in production for a few weeks, they move on to the next feature -- the shopping cart. Over months, the proxy routes shift one by one until the monolith handles nothing and can be decommissioned.

This approach lets the team ship the new catalog immediately, gather real production feedback, and keep the rest of the system stable throughout the migration.

## When to use

- You need to migrate away from a legacy monolith but cannot afford the risk or downtime of a big-bang rewrite.
- The legacy system is still actively serving users and must remain available during the transition.
- Your application has clear feature boundaries or URL paths that can be individually re-routed.
- You want to adopt new technology (language, framework, infrastructure) gradually rather than all at once.

## When to avoid

- The legacy system is small enough that a direct rewrite can be completed in a few weeks with minimal risk.
- There are no clear boundaries in the legacy code, making it extremely difficult to isolate individual features for migration.
- The old and new systems share tightly coupled state (e.g., in-process shared memory) that cannot be easily externalized.
- Your team lacks the infrastructure to run both systems in parallel (dual deployments, a routing layer, shared data stores).

## Trade-offs

- **Safety vs. operational overhead**: Incremental migration reduces risk, but running two systems in parallel means maintaining, monitoring, and deploying both simultaneously.
- **Continuous delivery vs. data synchronization**: You can ship features incrementally, but both systems may need to read from and write to the same database, creating complex synchronization challenges.
- **Gradual progress vs. extended timeline**: The migration is safer, but it takes longer than a rewrite because each slice must be individually extracted, tested, and validated.

## Common small mistakes

- Starting with the most complex, deeply coupled feature instead of picking a well-isolated, low-risk feature to prove the approach.
- Forgetting to set up observability for both old and new systems, making it hard to compare behavior and catch regressions.
- Not defining a clear "done" criteria for decommissioning the legacy system, leading to an indefinite period of running both.
- Allowing the new system to take hard dependencies on legacy internals (shared database tables, internal APIs), which undermines the separation.
- Skipping the routing layer and trying to manage the migration through DNS or code-level feature flags, which becomes fragile at scale.
