---
title: "Technical Debt"
letter: "T"
categories:
  - "improve-maintainability"
  - "explain-architecture"
shortDefinition: "The implied cost of future rework caused by choosing an easy or quick solution now instead of a better approach that would take longer."
---

## Why does it exist?

Sometimes teams make deliberate trade-offs — shipping faster with shortcuts that will need to be fixed later. Other times, debt accumulates accidentally through lack of knowledge, changing requirements, or neglected maintenance. Like financial debt, technical debt accrues interest: the longer you wait, the more expensive it becomes to fix.

## Practical example of use

A team hardcodes configuration values to meet a deadline. This works initially, but as the system grows to support multiple environments (dev, staging, production), every deployment requires manual code changes. The debt is paid by refactoring to environment variables and a configuration service.

## When to use

- When you need to ship quickly with a conscious trade-off (deliberate debt)
- As a communication tool with non-technical stakeholders to explain why refactoring matters
- When prioritizing a backlog — debt items compete with features for engineering time

## When to avoid

- As an excuse for consistently poor engineering practices
- When the "debt" is actually a missing feature or a bug
- When the cost of the debt is negligible and the code will be replaced anyway

## Trade-offs

- **Speed now vs. speed later**: Taking on debt accelerates current delivery but slows future work.
- **Visibility vs. urgency**: Debt is invisible to users, making it hard to justify fixing over new features.
- **Refactoring vs. rewriting**: Sometimes paying the debt means incremental improvement; other times it requires starting over.

## Common small mistakes

- Not tracking technical debt explicitly (use tickets, labels, or a debt register)
- Treating all debt as equal — some debt is high-interest (blocks daily work), some is low-interest (cosmetic issues)
- Never paying it down, letting it compound until the codebase is unmaintainable
- Taking on debt without the team agreeing it is intentional
- Confusing messy code with technical debt (mess is not debt — it is just mess)
