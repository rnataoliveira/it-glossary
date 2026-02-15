---
title: "Azure Cosmos DB"
letter: "A"
categories:
  - "cloud"
  - "data"
shortDefinition: "A globally distributed, multi-model NoSQL database service from Microsoft Azure that offers single-digit-millisecond latency and automatic horizontal scaling."
---

## Why does it exist?

Modern applications increasingly serve users across multiple continents and need data that is both fast to read and resilient to regional outages. Traditional databases force teams to choose between consistency and availability, and scaling them globally requires complex manual replication. Azure Cosmos DB was built to eliminate that burden by providing turnkey global distribution with configurable consistency levels, so a single database account can replicate data across dozens of Azure regions transparently.

Cosmos DB also addresses the reality that different teams prefer different data models. It exposes APIs compatible with MongoDB, Cassandra, Gremlin (graph), Table, and its native SQL-like API, letting developers adopt it without rewriting query logic. Combined with guaranteed SLAs for throughput, latency, availability, and consistency, it targets mission-critical workloads where downtime or slowness translates directly into lost revenue.

## Practical example of use

An e-commerce platform stores its product catalog in Cosmos DB. The catalog is read-heavy, served globally, and needs low-latency lookups by category. Using the SQL API, the application queries products filtered by category and receives results in milliseconds regardless of the user's geographic location, because Cosmos DB replicates the container to the nearest region.

```javascript
const { CosmosClient } = require("@azure/cosmos");
const client = new CosmosClient({ endpoint, key });
const { resources } = await client
  .database("shop")
  .container("products")
  .items.query("SELECT * FROM c WHERE c.category = 'electronics'")
  .fetchAll();
```

The code above connects to a Cosmos DB account, targets the "shop" database and "products" container, and runs a SQL-style query to retrieve all electronics. In production, you would paginate results with continuation tokens and scope queries with a partition key for efficiency.

## When to use

- You need globally distributed data with automatic multi-region replication and low-latency reads from any region.
- Your workload demands flexible schema design and you want a document, key-value, graph, or column-family model without managing separate database engines.
- You require predictable, SLA-backed performance at any scale with throughput provisioned in Request Units.
- The application is event-driven and benefits from Cosmos DB's built-in change feed for reactive architectures.

## When to avoid

- Your data model is heavily relational with complex joins across many tables; a relational database like Azure SQL or PostgreSQL is more natural and cost-effective.
- The workload is small, single-region, and cost-sensitive; Cosmos DB's minimum throughput charges can be expensive for light usage compared to simpler databases.
- You need full ACID transactions across multiple partitions or containers; Cosmos DB supports transactions only within a single logical partition.
- Your team relies on mature ORM tooling or SQL features like stored procedures with broad ecosystem support that relational databases provide out of the box.

## Trade-offs

- **Global reach vs. cost**: Multi-region writes and replication provide unmatched availability, but each additional region multiplies throughput costs, so enabling writes in every region can become expensive quickly.
- **Flexible consistency vs. complexity**: Five tunable consistency levels (Strong, Bounded Staleness, Session, Consistent Prefix, Eventual) give fine-grained control, but choosing the wrong level leads to either stale reads or unnecessary latency and cost.
- **Schema freedom vs. query discipline**: Schemaless documents allow rapid iteration, but without a well-chosen partition key and indexing policy, queries can consume excessive Request Units and perform poorly at scale.

## Common small mistakes

- Choosing a partition key with low cardinality (such as a boolean or status field), creating hot partitions that throttle throughput.
- Provisioning throughput at the database level when individual containers have very different access patterns, leading to under- or over-provisioning.
- Fetching all results with `fetchAll()` on large datasets instead of using pagination with continuation tokens, causing high memory usage and RU consumption.
- Ignoring the cost implications of cross-partition queries by not including the partition key in filters.
- Enabling multi-region writes without implementing conflict resolution policies, risking silent data loss on concurrent updates.
