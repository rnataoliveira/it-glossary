---
title: "Authentication vs Authorization"
letter: "A"
categories:
  - "improve-reliability"
  - "explain-architecture"
  - "improve-security"
shortDefinition: "Authentication verifies who a user is; authorization determines what they are allowed to do."
---

## Why does it exist?

Systems need to distinguish between identity verification and access control because they solve fundamentally different problems. Authentication answers "who are you?" while authorization answers "what can you do?" Separating these concerns allows each to evolve independently — you can change your login method without rewriting permission rules, and you can restructure roles without touching the login flow.

## Practical example of use

A developer logs into their company's internal dashboard using SSO with their corporate Google account — that is authentication. Once logged in, the system checks their role: as a "backend-engineer" they can view production logs and restart staging services, but they cannot access the billing panel or modify infrastructure settings reserved for the "platform-admin" role. The authentication layer confirmed their identity; the authorization layer enforced what they are permitted to do.

## When to use

- When designing any system that serves more than one user or role
- When integrating third-party identity providers like Google, Okta, or Auth0
- When building APIs that expose different capabilities depending on the caller
- When auditing or logging access for compliance requirements

## When to avoid

- When building a purely public, read-only service with no user-specific data
- When the system is a single-user local tool with no network exposure
- When adding authorization layers to a prototype would slow down validated learning with zero security risk

## Trade-offs

- **Security vs. Complexity**: Separating authn and authz properly increases code and infrastructure complexity, but prevents privilege-escalation bugs that arise from conflating the two
- **Flexibility vs. Overhead**: Fine-grained authorization (e.g., attribute-based access control) gives precise control but requires more maintenance and testing than simple role-based checks
- **Centralized vs. Distributed enforcement**: A centralized authorization service provides consistency but introduces a single point of failure, while distributed checks are resilient but harder to keep in sync

## Common small mistakes

- Treating authentication as authorization — confirming a user is logged in but never checking if they have permission for the specific action
- Performing authorization checks only on the frontend, allowing direct API calls to bypass restrictions
- Hardcoding role names or permission strings throughout the codebase instead of centralizing them behind an abstraction
- Forgetting to re-evaluate authorization after a user's role or group membership changes mid-session
