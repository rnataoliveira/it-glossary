---
title: "Feature Flags"
letter: "F"
categories:
  - "improve-reliability"
  - "improve-maintainability"
  - "improve-developer-experience"
shortDefinition: "Toggles that allow enabling or disabling features at runtime without deploying new code."
---

## Why does it exist?

Releasing new features traditionally requires a full deployment, which couples the act of shipping code with the act of exposing functionality to users. Feature flags decouple these two steps. Code can be merged and deployed continuously while the feature remains hidden behind a toggle. This enables safer releases, gradual rollouts, and instant kill switches, all without touching the deployment pipeline.

## Practical example of use

A product team at a B2B SaaS company builds a new dashboard redesign. They wrap the new UI behind a feature flag called `new-dashboard-v2`. First, they enable it only for internal employees to dogfood for a week. Then they roll it out to 5% of customers, monitoring error rates and page load times. After confirming metrics are stable, they increase to 25%, then 50%, then 100% over three weeks. When a critical rendering bug is reported by the 25% cohort, they disable the flag in the admin panel within seconds, reverting all users to the old dashboard while the fix is developed.

## When to use

- When rolling out a risky or high-impact feature gradually to a subset of users before full release
- When different customers or plans need access to different capabilities (entitlement management)
- When the team practices trunk-based development and needs to merge incomplete features without exposing them
- When you want an instant kill switch to disable problematic features in production without a rollback deployment

## When to avoid

- For trivial changes like copy updates or color tweaks where the overhead of flag management is not justified
- When the team does not have a process for cleaning up old flags, leading to an ever-growing tangle of conditional logic
- When the feature has deep, cross-cutting effects across the codebase that make toggling it on and off unreliable or untestable

## Trade-offs

- **Release safety vs. code complexity**: Flags allow instant rollback and gradual rollouts, but every flag adds a conditional branch that increases the number of code paths to test.
- **Deployment speed vs. technical debt**: Teams can merge and deploy continuously, but flags that are never removed accumulate as dead code and confuse future developers.
- **Granular control vs. operational risk**: Targeting specific users or segments enables precise rollouts, but a misconfigured flag rule can accidentally expose an unfinished feature or hide a critical one.

## Common small mistakes

- Never removing flags after a feature is fully launched, leaving stale conditional logic scattered throughout the codebase
- Not testing both the flag-on and flag-off paths, leading to bugs that only appear when the flag is toggled
- Using feature flags for permanent configuration that should be handled by environment variables or application settings
- Nesting multiple flags in the same code path, creating combinatorial complexity that is nearly impossible to reason about
