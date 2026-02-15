---
title: "AWS DynamoDB"
letter: "A"
categories:
  - "cloud"
  - "data"
shortDefinition: "A fully managed NoSQL key-value and document database from AWS that delivers single-digit millisecond performance at any scale."
---

## Why does it exist?

Relational databases struggle with certain workloads at massive scale: shopping carts, session stores, gaming leaderboards, and IoT telemetry demand consistent low-latency reads and writes across millions of requests per second. DynamoDB was built by Amazon (based on lessons from their Dynamo paper) to provide a fully managed database that handles partitioning, replication, and scaling automatically. You define a table with a partition key, optionally a sort key, and DynamoDB distributes data across partitions for predictable performance regardless of table size.

It eliminates the operational burden of managing database clusters, backups, patching, and capacity planning while offering features like global tables for multi-region replication, DynamoDB Streams for change events, and both on-demand and provisioned capacity modes.

## Practical example of use

An e-commerce platform stores order data in DynamoDB. Each order is stored with the customer ID as the partition key and order timestamp as the sort key, allowing efficient queries for "all orders by customer X sorted by date." The application writes new orders and queries recent ones using the AWS SDK.

```typescript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));

// Store a new order
async function createOrder(order: { customerId: string; orderId: string; total: number }) {
  await client.send(
    new PutCommand({
      TableName: "Orders",
      Item: {
        PK: `CUSTOMER#${order.customerId}`,
        SK: `ORDER#${new Date().toISOString()}#${order.orderId}`,
        orderId: order.orderId,
        total: order.total,
        status: "PENDING",
      },
    })
  );
}

// Query recent orders for a customer
async function getRecentOrders(customerId: string, limit: number = 10) {
  const result = await client.send(
    new QueryCommand({
      TableName: "Orders",
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `CUSTOMER#${customerId}`,
        ":skPrefix": "ORDER#",
      },
      ScanIndexForward: false,
      Limit: limit,
    })
  );
  return result.Items;
}
```

## When to use

- For high-throughput, low-latency workloads like session stores, shopping carts, user profiles, and real-time leaderboards
- When you need a fully managed database with automatic scaling and built-in replication across availability zones
- For event sourcing with DynamoDB Streams, which captures item-level changes and can trigger Lambda functions
- When your access patterns are well-defined and can be modeled with partition and sort keys plus secondary indexes

## When to avoid

- When you need complex ad-hoc queries with JOINs, aggregations, or full-text search — use a relational database or search engine instead
- When your data model is highly relational with many-to-many relationships that are awkward to denormalize
- For analytics or reporting workloads where scanning large amounts of data is required — use Athena, Redshift, or a data warehouse
- When your access patterns are unknown or frequently changing, as DynamoDB schema design is tightly coupled to query patterns

## Trade-offs

- **Predictable performance vs. rigid access patterns**: DynamoDB guarantees single-digit millisecond latency, but you must design your table schema around known access patterns. Changing patterns later often requires a table migration.
- **Fully managed vs. cost complexity**: No servers to manage, but pricing depends on read/write capacity units, storage, streams, backups, and global table replication — costs can surprise you without monitoring.
- **Horizontal scalability vs. limited query flexibility**: DynamoDB scales to handle trillions of items, but Scan operations are expensive and slow. You must precompute access patterns using GSIs (Global Secondary Indexes).

## Common small mistakes

- Designing the table like a relational database with normalized data instead of using single-table design with denormalized access patterns
- Choosing a low-cardinality partition key (like "status"), creating hot partitions that throttle requests
- Using Scan operations in production code paths instead of Query with proper key conditions
- Forgetting to configure DynamoDB auto-scaling or on-demand mode, leading to throttling during traffic spikes
- Not projecting only necessary attributes in queries, consuming more read capacity units than needed
