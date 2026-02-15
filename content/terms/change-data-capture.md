---
title: "Change Data Capture (CDC)"
letter: "C"
categories:
  - "data"
  - "backend"
shortDefinition: "A pattern that identifies and captures row-level changes (inserts, updates, deletes) in a database and delivers them as a stream of events to downstream systems."
---

## Why does it exist?

When data changes in an operational database, other systems often need to know about it: a search index must be updated, a cache must be invalidated, a data warehouse must reflect the latest state, or another microservice must react. The traditional approach, periodic bulk queries or full-table dumps, is wasteful, slow, and can miss intermediate states. If a record is inserted, updated, and deleted between two polling intervals, the change is invisible to downstream consumers.

Change Data Capture solves this by tapping directly into the database's own change mechanism, most commonly the transaction log (write-ahead log in PostgreSQL, binlog in MySQL). Every committed change is captured in order and published as an event, typically to a message broker like Apache Kafka. This gives downstream systems a near-real-time, complete, and ordered view of every mutation without adding load to the source database through polling queries. Tools like Debezium, AWS DMS, and Fivetran have made CDC accessible without requiring deep database internals knowledge.

## Practical example of use

An e-commerce company runs its order management system on PostgreSQL. Whenever an order is placed, updated, or cancelled, the data warehouse, search index, and notification service all need to react. Instead of each system polling the orders table, a Debezium connector reads the PostgreSQL write-ahead log and publishes change events to Kafka topics. Each downstream system consumes the topic it cares about and applies the change independently.

```json
{
  "name": "postgres-cdc",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "db.example.com",
    "database.dbname": "orders",
    "table.include.list": "public.orders,public.payments",
    "topic.prefix": "cdc",
    "plugin.name": "pgoutput"
  }
}
```

This Debezium connector configuration connects to a PostgreSQL database, watches the "orders" and "payments" tables, and publishes changes to Kafka topics prefixed with "cdc." Each change event includes the before and after state of the row, the operation type, and metadata about the transaction.

## When to use

- You need near-real-time synchronization between an operational database and downstream systems (warehouses, caches, search indexes) without polling.
- Your architecture follows event-driven or microservices patterns and you want the database to be a source of truth that emits events for every state change.
- You need to capture every intermediate state of a record, not just the latest snapshot, for auditing, debugging, or temporal analysis.
- You want to replicate data across systems without adding query load to the source database during peak hours.

## When to avoid

- The source database changes infrequently and a simple periodic batch export (hourly or daily) satisfies latency requirements without the complexity of CDC infrastructure.
- Your database does not expose a transaction log or the log format is proprietary and unsupported by CDC tools; trigger-based CDC alternatives exist but add write overhead.
- The team lacks experience operating Kafka or similar streaming infrastructure, and the operational burden of connectors, schema evolution, and offset management outweighs the benefits.
- Downstream consumers only need aggregated summaries, not row-level changes; a scheduled aggregation query is simpler and more appropriate.

## Trade-offs

- **Low latency vs. infrastructure overhead**: CDC provides near-real-time data propagation, but it requires running and monitoring connectors, a message broker (usually Kafka), and schema management tooling, which is significantly more complex than a scheduled batch job.
- **Completeness vs. volume**: Capturing every row-level change ensures nothing is missed, but high-write tables can produce enormous event volumes that require careful topic partitioning, retention policies, and downstream consumer scaling.
- **Source independence vs. database coupling**: Log-based CDC avoids adding load to the source database, but it couples the pipeline to the specific database engine's log format, making database migrations (e.g., PostgreSQL to MySQL) more involved.

## Common small mistakes

- Not configuring the database's transaction log retention long enough, causing the CDC connector to lose its position and require a full re-snapshot of the table.
- Ignoring schema evolution; when a column is added or renamed in the source table, downstream consumers break if they are not designed to handle schema changes gracefully.
- Treating CDC events as a queue (process and forget) instead of a log (replayable), which prevents replaying events to rebuild a downstream system after a bug.
- Failing to filter out irrelevant tables or columns in the connector configuration, publishing excessive data to Kafka and wasting broker storage and consumer bandwidth.
- Not monitoring connector health and lag, so a stalled connector silently stops emitting events while downstream systems serve increasingly stale data.
