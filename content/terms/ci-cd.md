---
title: "CI/CD"
letter: "C"
categories:
  - "devops"
shortDefinition: "Continuous Integration and Continuous Delivery — automating the process of building, testing, and deploying code changes."
---

## Why does it exist?

Manual builds and deployments are slow, error-prone, and do not scale. CI/CD automates these processes: every code change is automatically built, tested, and optionally deployed. This catches bugs early, reduces integration conflicts, and enables teams to ship faster with confidence.

## Practical example of use

A team uses GitHub Actions: on every pull request, the pipeline runs linting, unit tests, and integration tests (CI). When code is merged to `main`, it automatically builds a Docker image, pushes it to a registry, and deploys to a staging environment (CD). Production deployments require a manual approval step.

## When to use

- Any team with more than one developer
- Projects that deploy regularly (daily, weekly)
- When manual testing and deployment is a bottleneck
- When you want fast feedback on code quality

## When to avoid

- Solo hobby projects where the overhead of setting up pipelines is not worth it
- One-time scripts or tools that never change
- When the team has no tests to run (fix that first)

## Trade-offs

- **Speed vs. setup cost**: CI/CD requires initial investment in pipeline configuration and test infrastructure.
- **Safety vs. speed**: More pipeline stages (tests, scans, approvals) increase confidence but slow down deployments.
- **Automation vs. control**: Fully automated deploys are fast but risky without proper safeguards (rollback, canary releases).

## Common small mistakes

- Setting up CI without writing meaningful tests (the pipeline runs but catches nothing)
- Not caching dependencies, leading to slow builds
- Deploying to production without a staging or preview step
- Ignoring flaky tests instead of fixing them
- Not securing secrets in the pipeline (hardcoding API keys)
