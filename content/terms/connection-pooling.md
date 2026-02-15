---
title: "Connection Pooling"
letter: "C"
categories:
  - "backend"
  - "performance"
shortDefinition: "A technique that reuses a set of pre-established database connections instead of opening and closing a new one for every request."
---

## Why does it exist?

Opening a database connection is expensive. It involves a TCP handshake, TLS negotiation (if encrypted), authentication, and protocol setup -- all of which can take tens of milliseconds. In a web application handling hundreds of requests per second, creating a fresh connection for each query and destroying it afterward wastes significant time and puts unnecessary load on the database server, which has a hard limit on concurrent connections.

Connection pooling solves this by maintaining a pool of ready-to-use connections. When application code needs a connection, it borrows one from the pool; when done, it returns it instead of closing it. This amortizes the connection setup cost across thousands of requests and bounds the total number of connections to the database, preventing overload.

## Practical example of use

A Node.js API serves product data from PostgreSQL. Without pooling, each of the 500 requests per second would open a new connection, quickly exhausting the database's default limit of 100 connections and causing failures. With a connection pool, only a fixed number of connections are established, and requests share them efficiently.

```typescript
import { Pool } from "pg";

// Create a pool once at application startup
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: "products_db",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  min: 5,          // keep at least 5 idle connections
  max: 20,         // never exceed 20 connections
  idleTimeoutMillis: 30000,       // close idle connections after 30s
  connectionTimeoutMillis: 5000,  // fail if no connection available within 5s
});

// Use pool.query -- it automatically borrows and returns a connection
async function getProduct(id: string) {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
}

// For transactions, explicitly check out and return a client
async function transferStock(fromId: string, toId: string, qty: number) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [qty, fromId]);
    await client.query("UPDATE products SET stock = stock + $1 WHERE id = $2", [qty, toId]);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release(); // return connection to pool
  }
}
```

## When to use

- Any application that makes repeated database queries, which is nearly every backend service.
- High-throughput systems where the cost of establishing connections on each request would be a bottleneck.
- Environments with database connection limits (cloud-managed databases often cap connections at a low number).
- Multi-tenant applications where you need to carefully control how many connections each service consumes.

## When to avoid

- Serverless functions where the execution environment is short-lived and pools cannot be reused across invocations (use an external pooler like PgBouncer or RDS Proxy instead).
- One-off scripts or CLI tools that make a single query and exit -- pooling adds no benefit.
- Scenarios where the database client library already provides built-in pooling and configuring a second pool would cause confusion.

## Trade-offs

- **Throughput vs. memory**: More connections in the pool improve throughput under high load, but each connection consumes memory on both the application and database servers.
- **Fast checkout vs. stale connections**: Keeping idle connections ready avoids setup latency, but idle connections can be terminated by firewalls or the database, requiring health checks.
- **Bounded connections vs. request queuing**: Capping the pool size protects the database, but when all connections are in use, incoming requests must wait in a queue or fail.

## Common small mistakes

- Setting the pool size equal to the database's max connections, leaving no room for migrations, monitoring tools, or other services.
- Forgetting to release connections back to the pool (especially during error paths), which causes the pool to drain and all subsequent requests to hang.
- Creating a new pool per request instead of once at application startup, which defeats the entire purpose.
- Not configuring connection timeouts, causing requests to wait indefinitely when the pool is exhausted instead of failing fast.
- Ignoring idle connection eviction, leading to connections that the database has already closed, resulting in "connection reset" errors.
