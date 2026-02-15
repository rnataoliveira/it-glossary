---
title: "Immutable Infrastructure"
letter: "I"
categories:
  - "devops"
  - "cloud"
shortDefinition: "An approach where deployed infrastructure components are never modified after creation; instead, updates are made by replacing entire instances with new ones built from a common image."
---

## Why does it exist?

Traditional mutable infrastructure, where administrators apply patches and configuration changes to live servers, leads to configuration drift over time. Each server gradually becomes unique, making it nearly impossible to reproduce environments reliably or diagnose issues caused by subtle differences between machines. This problem, often called "snowflake servers," grows worse as teams scale and the number of manual interventions accumulates.

Immutable infrastructure eliminates this class of problems by treating deployed artifacts as read-only. When a change is needed, a new machine image or container is built from scratch using automated tooling, tested, and deployed to replace the existing instance. The old instance is then destroyed. This guarantees that every running instance matches the exact specification defined in code, making deployments predictable and rollbacks straightforward.

## Practical example of use

A team manages a fleet of web servers running behind a load balancer. Instead of SSH-ing into each server to apply an OS patch, they update their base image definition (for example, a Packer template or a Dockerfile), build a new image through their CI pipeline, and perform a rolling deployment. The load balancer drains connections from old instances while routing traffic to new ones. Once all traffic has shifted, the old instances are terminated. If the new image causes issues, the team redeploys the previous known-good image, achieving a rollback in minutes rather than hours.

## When to use

- When you need reproducible, consistent environments across development, staging, and production.
- When operating in cloud or containerized environments where spinning up new instances is fast and inexpensive.
- When compliance or audit requirements demand that you can prove exactly what is running at any point in time.
- When you want to simplify rollback procedures to simply redeploying a previous image version.

## When to avoid

- When working with stateful systems like databases that require in-place upgrades and cannot be trivially replaced.
- When infrastructure provisioning times are too long to make frequent replacements practical, such as bare-metal environments without automation.
- When the team lacks the automation maturity to build, test, and deploy images reliably through a pipeline.
- When rapid, one-off debugging on a live server is essential during an incident and there is no time to rebuild an image.

## Trade-offs

- **Deployment speed vs. build overhead**: Every change requires building and deploying a full image, which adds pipeline time compared to applying a small in-place patch.
- **Consistency vs. flexibility**: You gain perfect reproducibility but lose the ability to make quick ad-hoc fixes on running instances during emergencies.
- **Storage costs vs. reliability**: Keeping multiple image versions for rollback purposes consumes additional storage, but provides a safety net that reduces mean time to recovery.

## Common small mistakes

- Allowing SSH access to production instances and making manual changes, which defeats the purpose of immutability.
- Not versioning and tagging images properly, making it difficult to identify which image corresponds to which release.
- Forgetting to handle persistent data separately from the immutable instances, leading to data loss during replacement.
- Skipping image validation and security scanning in the build pipeline, assuming that automation alone guarantees correctness.
