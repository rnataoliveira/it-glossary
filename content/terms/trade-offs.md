---
title: "Trade-offs"
letter: "T"
categories:
  - "architecture"
shortDefinition: "The deliberate choice to gain one quality (speed, simplicity, cost) at the expense of another — the core skill of software engineering."
---

## Why does it exist?

There is no perfect solution in software engineering. Every technical decision involves giving something up to gain something else. Understanding trade-offs is what separates junior developers (who look for the "right" answer) from senior developers (who evaluate options and choose the best fit for the context).

## Practical example of use

A team debates using a relational database vs. a document database. The relational DB offers strong consistency and complex queries but requires schema migrations. The document DB offers flexible schemas and horizontal scaling but makes joins difficult. The team chooses based on their access patterns: mostly reads by ID → document DB; complex reporting queries → relational DB.

## When to use

- Every architectural decision (database choice, communication pattern, deployment strategy)
- System design interviews (interviewers want to see you reason about trade-offs, not memorize solutions)
- Code reviews — explaining why you chose one approach over another
- Prioritizing features and technical work (scope vs. quality vs. time)

## When to avoid

- Never — trade-off thinking is always relevant
- Do not use "it depends" as a cop-out. Identify what it depends on and explain the factors

## Trade-offs

- **Consistency vs. availability**: (see CAP Theorem)
- **Speed vs. quality**: Shipping fast vs. shipping well — conscious debt vs. accidental mess
- **Simplicity vs. flexibility**: YAGNI vs. extensible design
- **Build vs. buy**: Custom solution vs. third-party tool — control vs. maintenance burden
- **Latency vs. throughput**: Optimizing for response time vs. total processing capacity

## Common small mistakes

- Presenting one option without alternatives (always show at least two options with their trade-offs)
- Optimizing for a trade-off that does not matter for your specific use case
- Not revisiting trade-offs as requirements change — a decision that was right a year ago may not be right today
- Treating trade-offs as permanent — many can be revisited or reversed with reasonable effort
