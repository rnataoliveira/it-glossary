---
title: "Site Reliability Engineering (SRE)"
letter: "S"
categories:
  - "devops"
  - "reliability"
shortDefinition: "A discipline that applies software engineering principles to infrastructure and operations, using service level objectives, error budgets, and automation to balance system reliability with the pace of feature delivery."
---

## Why does it exist?

Traditionally, development and operations teams had conflicting incentives. Developers wanted to ship features quickly, while operations teams wanted to minimize change to keep systems stable. This tension led to slow release cycles, adversarial relationships, and reliability problems that were addressed reactively rather than proactively.

Site Reliability Engineering, pioneered at Google, resolves this conflict by defining reliability as a measurable, negotiable property of a system. Teams set explicit Service Level Objectives (SLOs) that quantify how reliable a service must be, and they track error budgets that represent the acceptable amount of unreliability within a given period. When the error budget is healthy, the team can ship features aggressively. When it is depleted, the team shifts focus to reliability improvements. This data-driven framework aligns incentives and makes the trade-off between velocity and stability explicit and transparent.

## Practical example of use

An SRE team defines an SLO for their checkout service, requiring 99.9% availability over a rolling 30-day window. They configure alerting based on burn rate, which measures how quickly the error budget is being consumed, rather than simple threshold alerts that fire on individual failures.

```yaml
slos:
  - name: checkout-availability
    description: "Checkout flow must be available"
    sli:
      type: availability
      filter: "service='checkout' AND type='request'"
    objectives:
      - target: 0.999
        window: 30d
    alerts:
      burnRate:
        - shortWindow: 1h
          longWindow: 6h
          factor: 14.4
```

With this configuration, the team is alerted not when a single request fails, but when failures are occurring at a rate that would exhaust the monthly error budget if sustained. A burn rate factor of 14.4 means the budget would be consumed 14.4 times faster than the steady-state rate, indicating a significant incident that needs immediate attention. This approach reduces alert noise and focuses the team on events that genuinely threaten the SLO.

## When to use

- When operating services where downtime has a direct and measurable business impact, such as e-commerce, payments, or SaaS platforms.
- When development and operations teams need a shared framework to negotiate the trade-off between feature velocity and system stability.
- When you want to move from reactive firefighting to proactive reliability work driven by data and error budgets.
- When alert fatigue is a problem and you need a principled approach to deciding what is worth paging an engineer about.

## When to avoid

- When the system is in an early prototyping phase where reliability targets are premature and the product direction is still being validated.
- When the team is too small to separate SRE concerns from general development work, and the overhead of formal SLO processes would slow everyone down.
- When the service has very few users and the cost of downtime is negligible, making the investment in SRE practices disproportionate.
- When the organization is not willing to enforce error budget policies, which would reduce SRE to a monitoring exercise without teeth.

## Trade-offs

- **Reliability vs. velocity**: SRE makes this trade-off explicit through error budgets, but enforcing budget policies can frustrate product teams when they are forced to pause feature work.
- **Automation vs. upfront cost**: Investing in automation (self-healing, automated rollbacks, capacity planning) reduces toil long-term but requires significant engineering effort initially.
- **Precision vs. simplicity**: Sophisticated SLI/SLO definitions capture reliability accurately but add complexity to monitoring infrastructure and can be difficult for non-SRE team members to understand.

## Common small mistakes

- Setting SLO targets arbitrarily (like 99.99%) without understanding the engineering cost required to meet them or whether users actually need that level of reliability.
- Defining SLIs that do not reflect the actual user experience, such as measuring server-side latency while ignoring client-side rendering time.
- Treating error budgets as suggestions rather than enforced policies, which removes the incentive mechanism that makes SRE effective.
- Alerting on symptoms at the infrastructure level instead of on SLO burn rates, leading to noisy alerts that do not correlate with user impact.
- Confusing SRE with traditional operations by staffing the role with sysadmins and not investing in their software engineering skills.
