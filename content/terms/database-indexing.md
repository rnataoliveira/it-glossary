---
title: "Database Indexing"
letter: "D"
categories:
  - "improve-performance"
  - "back-end-applications"
shortDefinition: "A data structure technique that speeds up data retrieval by creating quick lookup references to rows in a database table."
---

## Why does it exist?

Without indexes, a database must scan every row in a table to find matching results — a full table scan. As tables grow to millions or billions of rows, this becomes unacceptably slow. Indexes exist to give the database engine a shortcut, much like a book index lets you jump directly to the right page instead of reading cover to cover. They transform O(n) lookups into O(log n) or even O(1) operations.

## Practical example of use

An online marketplace has a `products` table with 12 million rows. Users frequently search by `category_id` and sort by `price`. Without an index, each search takes over 3 seconds. After adding a composite index on `(category_id, price)`, the same queries return in under 20 milliseconds. The database uses a B-tree to navigate directly to the matching category and returns results already sorted by price.

## When to use

- Columns frequently used in WHERE clauses, JOIN conditions, or ORDER BY
- Foreign key columns that are involved in frequent lookups
- Columns with high cardinality (many unique values), like email addresses or UUIDs
- Read-heavy workloads where query speed matters more than write speed

## When to avoid

- Small tables where a full scan is already fast enough
- Columns with very low cardinality (e.g., a boolean `is_active` column with only two values)
- Write-heavy tables where the overhead of maintaining indexes on every INSERT, UPDATE, and DELETE hurts throughput

## Trade-offs

- **Read speed vs. write overhead**: Indexes dramatically speed up reads but slow down writes because the index must be updated with every data change.
- **Query performance vs. storage cost**: Each index consumes additional disk space and memory, sometimes adding 10-30% to the table size.
- **Specificity vs. flexibility**: A highly specialized composite index accelerates one query pattern but may be useless for others, leading to index bloat if you create too many.

## Common small mistakes

- Adding indexes on every column "just in case" instead of analyzing actual query patterns
- Forgetting that column order in a composite index matters — an index on `(a, b)` does not help queries filtering only on `b`
- Not monitoring unused indexes, which waste storage and slow down writes for no benefit
- Ignoring the EXPLAIN plan and guessing which indexes are needed instead of measuring
