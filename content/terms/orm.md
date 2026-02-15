---
title: "ORM"
letter: "O"
categories:
  - "backend"
  - "data"
shortDefinition: "A technique that maps database tables to programming language objects, allowing developers to interact with data using code instead of raw SQL."
---

## Why does it exist?

There is a fundamental mismatch between how relational databases store data (rows and columns) and how application code represents data (objects and classes). Developers constantly had to write repetitive SQL, manually map query results to objects, and handle database-specific syntax differences. ORMs were created to bridge this gap — they generate SQL from code, handle result mapping automatically, and provide a higher-level abstraction so developers can focus on business logic rather than database plumbing.

## Practical example of use

A team building a REST API with Python and SQLAlchemy defines a `User` model class with fields like `id`, `email`, and `created_at`. Instead of writing `SELECT * FROM users WHERE email = 'jane@example.com'`, the developer writes `User.query.filter_by(email='jane@example.com').first()`. The ORM generates the SQL, executes it, and returns a `User` object with attributes ready to use. When the team switches from MySQL to PostgreSQL, they change one connection string and the ORM handles the dialect differences.

```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Query — no raw SQL needed
user = session.query(User).filter_by(email="jane@example.com").first()
print(user.email, user.created_at)
```

## When to use

- CRUD-heavy applications where most database interactions are straightforward reads and writes
- Projects that benefit from database-agnostic code for easier testing and potential migration
- Teams that want type safety, auto-completion, and compile-time checks on database operations
- Rapid prototyping where developer speed matters more than query optimization

## When to avoid

- Performance-critical queries that require hand-tuned SQL, complex joins, or database-specific features like window functions
- Batch processing or ETL pipelines where the overhead of object mapping adds unnecessary latency at scale
- When the team is proficient in SQL and the abstraction layer hides important performance characteristics

## Trade-offs

- **Developer speed vs. query control**: ORMs accelerate common operations but make it harder to write and optimize complex queries, often requiring escape hatches to raw SQL.
- **Portability vs. feature access**: Database-agnostic code means you lose access to powerful vendor-specific features like PostgreSQL's JSONB operators or MySQL's spatial indexes.
- **Abstraction vs. understanding**: ORMs can shield developers from understanding how their queries actually execute, leading to performance problems that are hard to diagnose without SQL knowledge.

## Common small mistakes

- Triggering the N+1 query problem by lazily loading related objects inside a loop instead of eager loading them in a single query
- Blindly trusting the ORM's generated SQL without ever checking the query plan or monitoring slow queries
- Over-relying on the ORM for everything and avoiding raw SQL even when it would be dramatically simpler and faster
- Not configuring connection pooling properly, leading to exhausted database connections under load
