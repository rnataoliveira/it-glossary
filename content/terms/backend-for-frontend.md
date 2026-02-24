---
title: "Backend for Frontend (BFF)"
letter: "B"
categories:
  - "architecture"
  - "backend"
  - "mobile"
shortDefinition: "A dedicated backend service tailored to the specific needs of a single frontend application or client type."
---

## Why does it exist?

When multiple frontends -- a web SPA, a mobile app, a smart TV app -- all share a single general-purpose API, compromises are inevitable. The mobile app receives fields it never displays, the web app needs data aggregated from three endpoints, and the TV app wants a simplified payload optimized for low bandwidth. Over time, the shared API accumulates client-specific logic, query parameters for conditional fields, and increasingly complex response shapes that serve no single client well.

The Backend for Frontend pattern solves this by giving each client type its own lightweight backend. Each BFF is owned by the frontend team that consumes it and exposes exactly the data shapes, aggregation, and formatting that specific client needs. The BFFs, in turn, call the same downstream microservices. This keeps the core services generic and clean while giving each frontend a purpose-built API layer.

## Practical example of use

A streaming platform has a web application and a mobile app. The web app displays a rich home screen with editorial banners, personalized rows, and detailed metadata. The mobile app shows a simpler grid with thumbnails and short titles to minimize bandwidth. Instead of one API that tries to serve both, the team creates two BFFs: `web-bff` aggregates data from the catalog, recommendation, and editorial services into a rich payload; `mobile-bff` calls the same downstream services but returns a slim response with compressed image URLs and truncated titles. Each BFF is maintained by the frontend team that uses it, so changes to the mobile layout do not require coordinating with the web team.

## When to use

- You have multiple client types (web, mobile, TV, third-party) with significantly different data and performance requirements.
- Frontend teams want autonomy to evolve their API contract without waiting on a shared backend team.
- Your general-purpose API is accumulating client-specific logic, conditional fields, or "variant" parameters.
- You need to aggregate data from multiple downstream services before sending it to the client, and the aggregation differs per client.

## When to avoid

- You have only one frontend or all frontends need identical data -- a single API gateway or shared API is simpler.
- Your team is too small to maintain multiple backend services; the operational cost of running several BFFs outweighs the benefits.
- The differences between clients are trivial (e.g., one extra field) and can be handled with content negotiation or sparse fieldsets.

## Trade-offs

- **Client optimization vs. service duplication**: Each BFF is perfectly tailored, but common logic (authentication, error handling, caching) may be duplicated across BFFs.
- **Team autonomy vs. consistency**: Frontend teams can move independently, but without shared standards, BFFs can diverge in logging, error formats, and security practices.
- **Reduced payload size vs. operational overhead**: Clients get exactly what they need, but each BFF is another service to deploy, monitor, and maintain.

## Common small mistakes

- Putting business logic in the BFF instead of keeping it as a thin aggregation and formatting layer that delegates to core services.
- Creating one BFF per screen or feature instead of per client type, leading to an explosion of micro-BFFs.
- Forgetting to apply the same authentication and authorization checks in every BFF, creating security gaps.
- Not sharing libraries or templates across BFFs for cross-cutting concerns like logging and error handling, resulting in inconsistent behavior.
