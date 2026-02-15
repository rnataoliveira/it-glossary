---
title: "SQL vs NoSQL"
letter: "S"
categories:
  - "create-system-design"
  - "explain-architecture"
  - "back-end-applications"
shortDefinition: "Two database paradigms — SQL uses structured tables with strict schemas, while NoSQL offers flexible document, key-value, or graph models."
---

## Why does it exist?

Relational databases (SQL) were designed in the 1970s to store structured, interrelated data with strong consistency guarantees. As web-scale applications emerged, developers needed databases that could handle massive volumes of unstructured data, scale horizontally, and evolve schemas without downtime. NoSQL databases were created to fill that gap. Today both paradigms coexist because different problems demand different data models.

## Practical example of use

A fintech company uses PostgreSQL (SQL) for its core banking ledger, where every transaction must be ACID-compliant and relationships between accounts, users, and transfers are well-defined. The same company uses MongoDB (NoSQL) for its activity feed service, where each event is a self-contained document with varying fields depending on the event type, and the schema changes frequently as new features are shipped.

## When to use

- Choose SQL when your data is highly relational, you need complex joins, or transactional integrity is critical
- Choose NoSQL when your schema evolves rapidly or varies between records
- Choose SQL when regulatory or compliance requirements demand strict data validation at the database level
- Choose NoSQL when you need to scale horizontally across many nodes with large volumes of semi-structured data

## When to avoid

- Avoid SQL for storing deeply nested, hierarchical data that does not map well to flat tables
- Avoid NoSQL when you need multi-record transactions with strong consistency guarantees across related entities
- Avoid choosing based on hype — pick based on your actual data access patterns and consistency requirements

## Trade-offs

- **Schema rigidity vs. flexibility**: SQL enforces structure upfront, catching errors early but making schema migrations harder. NoSQL allows flexible documents but can lead to inconsistent data if not managed carefully.
- **Consistency vs. scalability**: SQL databases prioritize consistency (ACID) which can limit horizontal scaling. NoSQL databases often relax consistency (eventual consistency) to achieve better distributed performance.
- **Query power vs. simplicity**: SQL provides a powerful, standardized query language with joins and aggregations. NoSQL queries are often simpler but may require denormalization or application-side joins.

## Common small mistakes

- Choosing NoSQL to avoid learning SQL, then rebuilding relational features in application code
- Using a document database but storing all data in a single collection with no structure, making queries slow and unpredictable
- Assuming NoSQL always scales better — poorly designed NoSQL schemas can perform worse than a well-indexed relational database
- Treating the choice as permanent instead of using both paradigms where each fits best (polyglot persistence)
