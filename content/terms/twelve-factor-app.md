---
title: "Twelve-Factor App"
letter: "T"
categories:
  - "architecture"
  - "devops"
shortDefinition: "A methodology of twelve best practices for building modern, portable, and scalable software-as-a-service applications."
---

## Why does it exist?

As software moved from on-premise servers to cloud platforms, developers repeatedly hit the same problems: apps that were hard to deploy, tightly coupled to specific infrastructure, and painful to scale. Configuration was buried in code, state was stored on local disks, and builds differed between environments. Each team reinvented solutions to these problems independently.

The Twelve-Factor App methodology, published by engineers at Heroku, distilled the common patterns that made cloud-native applications successful into twelve explicit principles. It provides a shared vocabulary and checklist -- covering everything from configuration management to logging -- that helps teams build applications which are easy to deploy, scale horizontally, and run consistently across development, staging, and production.

## Practical example of use

Consider a team migrating a monolithic Django application to a cloud platform. They audit the codebase against the twelve factors and discover several violations: database credentials are hardcoded (Factor III: Config), log output is written to local files (Factor XI: Logs), and background workers share state through the filesystem (Factor VI: Processes). By extracting configuration into environment variables, sending logs to stdout, and replacing file-based state with a Redis-backed queue, the team makes the app deployable to any cloud platform -- Heroku, AWS ECS, or Kubernetes -- without code changes. Each instance becomes stateless and disposable, so horizontal scaling is just a matter of increasing replica count.

## When to use

- You are building or refactoring a web application intended for cloud deployment (PaaS, containers, serverless).
- Your team needs a shared set of conventions for structuring services in a microservices architecture.
- You want to ensure parity between development and production environments to reduce "works on my machine" issues.
- You are onboarding new developers and need a concise reference for how the project handles config, dependencies, and processes.

## When to avoid

- Embedded systems, desktop applications, or firmware where cloud deployment patterns are irrelevant.
- Extremely short-lived scripts or data pipelines where the overhead of strict twelve-factor compliance adds no value.
- Legacy systems where adopting all twelve factors at once would require a prohibitively large rewrite -- in this case, adopt incrementally.

## Trade-offs

- **Portability vs. convenience**: Strictly separating config from code and treating backing services as attached resources makes the app portable, but requires more upfront setup (secret managers, environment injection) than just hardcoding values.
- **Statelessness vs. simplicity**: Making processes share-nothing forces reliance on external stores (databases, caches, object storage), adding operational dependencies.
- **Dev/prod parity vs. speed**: Running the same backing services locally as in production (e.g., PostgreSQL instead of SQLite) catches bugs earlier but slows down initial development setup.

## Common small mistakes

- Treating the twelve factors as all-or-nothing instead of adopting them incrementally where they provide the most value.
- Storing secrets in environment variables without encryption, mistaking "config in env vars" for "env vars are secure."
- Ignoring Factor XII (Admin Processes) and running one-off tasks like migrations through ad-hoc SSH sessions instead of the same deployment pipeline.
- Conflating "stateless processes" with "no state at all" -- the app is stateless, but state lives in backing services like databases and caches.
- Skipping Factor X (Dev/Prod Parity) by using SQLite locally and PostgreSQL in production, then being surprised by query behavior differences.
