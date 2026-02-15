---
title: "Blue-Green Deployment"
letter: "B"
categories:
  - "improve-reliability"
  - "improve-maintainability"
shortDefinition: "A release strategy that runs two identical production environments, switching traffic from the old version to the new one instantly."
---

## Why does it exist?

Traditional deployments that update servers in place create a window where the application is partially running old code and partially running new code, leading to errors and downtime. Blue-green deployment eliminates this risk by maintaining two identical environments. The new version is deployed to the idle environment, thoroughly validated, and then traffic is switched over in a single step. If something goes wrong, switching back is equally instant.

## Practical example of use

A fintech company runs its payment API on two identical Kubernetes namespaces: blue and green. The current live traffic points to blue (v2.3). The team deploys v2.4 to green, runs automated smoke tests and manual QA against the green environment using an internal URL. Once validated, they update the load balancer to route all traffic to green. Five minutes later, monitoring shows a spike in 500 errors. The on-call engineer switches the load balancer back to blue in under 10 seconds, fully restoring service while the team investigates the bug.

## When to use

- When zero-downtime deployments are a hard requirement, such as payment systems or APIs with strict SLAs
- When you need instant, reliable rollback capability without redeployment
- When the release process includes a manual or automated validation step before exposing users to the new version
- When database schema changes are backward-compatible or handled separately from application releases

## When to avoid

- When running two full production environments doubles infrastructure costs beyond what the budget allows
- When the application relies on database migrations that are not backward-compatible, making it impossible to run both versions against the same data store
- For small internal tools or low-traffic applications where a brief deployment window is acceptable

## Trade-offs

- **Instant rollback vs. double infrastructure cost**: You can revert in seconds by switching traffic back, but maintaining two production-grade environments requires twice the compute, memory, and storage.
- **Zero downtime vs. database complexity**: Traffic switches seamlessly, but both versions must work against the same database, requiring careful migration strategies and backward-compatible schema changes.
- **Deployment confidence vs. operational overhead**: Full validation before go-live reduces risk, but the team must maintain tooling and processes to manage two environments, sync configurations, and coordinate the switch.

## Common small mistakes

- Forgetting to keep the idle environment updated with the same configuration, certificates, and environment variables as the live one
- Running destructive database migrations as part of the deployment, breaking the old version and eliminating the ability to roll back
- Not automating the traffic switch, leading to slow and error-prone manual steps under pressure
- Failing to run a meaningful health check or smoke test against the new environment before switching traffic
