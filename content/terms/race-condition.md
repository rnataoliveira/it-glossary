---
title: "Race Condition"
letter: "R"
categories:
  - "reliability"
  - "backend"
shortDefinition: "A bug that occurs when the behavior of a system depends on the unpredictable timing or ordering of concurrent operations."
---

## Why does it exist?

Modern software is concurrent. Web servers handle multiple requests simultaneously, databases process parallel transactions, and frontend applications fire asynchronous events. When two or more operations access shared state -- a database row, a file, a variable in memory -- and at least one of them modifies it, the outcome depends on which operation runs first. If the code assumes a specific ordering that is not guaranteed, the result is a race condition: a bug that works most of the time but fails unpredictably under load or unlucky timing.

Race conditions are particularly dangerous because they are hard to reproduce. The system passes all tests in a single-threaded test environment, works fine under light load, and only fails intermittently in production when two requests happen to arrive milliseconds apart.

## Practical example of use

A classic race condition: two users simultaneously try to purchase the last item in stock. Both read the inventory count as 1, both decide the purchase is valid, and both decrement the count. The result is -1 items in stock and two orders for an item that only existed once.

Here is the bug and the fix in a Node.js application with PostgreSQL:

```typescript
// BUG: Race condition with separate read and write
async function purchaseItem(itemId: string): Promise<void> {
  const result = await db.query(
    "SELECT stock FROM items WHERE id = $1",
    [itemId]
  );
  const stock = result.rows[0].stock;

  if (stock <= 0) {
    throw new Error("Out of stock");
  }

  // Another request can read stock=1 here, before this write completes
  await db.query(
    "UPDATE items SET stock = stock - 1 WHERE id = $1",
    [itemId]
  );
}

// FIX 1: Atomic conditional update (no separate read)
async function purchaseItemSafe(itemId: string): Promise<void> {
  const result = await db.query(
    "UPDATE items SET stock = stock - 1 WHERE id = $1 AND stock > 0 RETURNING stock",
    [itemId]
  );

  if (result.rowCount === 0) {
    throw new Error("Out of stock");
  }
}

// FIX 2: Using SELECT ... FOR UPDATE (pessimistic locking)
async function purchaseItemWithLock(itemId: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock the row -- other transactions must wait
    const result = await client.query(
      "SELECT stock FROM items WHERE id = $1 FOR UPDATE",
      [itemId]
    );

    if (result.rows[0].stock <= 0) {
      await client.query("ROLLBACK");
      throw new Error("Out of stock");
    }

    await client.query(
      "UPDATE items SET stock = stock - 1 WHERE id = $1",
      [itemId]
    );
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
```

## When to use

"When to use" does not quite apply to a bug, but knowing when to watch for race conditions is critical:

- Any time shared mutable state is accessed by concurrent operations (parallel requests, threads, async tasks).
- Financial or inventory operations where double-processing causes real-world harm.
- Distributed systems where multiple nodes can modify the same resource.
- User-facing forms that can be double-submitted by clicking a button twice rapidly.

## When to avoid

Strategies for avoiding race conditions vary by context:

- Use atomic operations (e.g., `UPDATE ... WHERE condition`) when the check and modification can be combined into a single statement.
- Use pessimistic locking (`SELECT ... FOR UPDATE`) when you need to read, compute, and then write within a transaction.
- Use optimistic concurrency control (version columns or ETags) when contention is rare and you prefer retrying over locking.
- Use idempotency keys to make operations safe to retry without causing duplicate effects.

## Trade-offs

- **Pessimistic locking vs. throughput**: Locking rows prevents race conditions but serializes access, reducing throughput under high contention.
- **Optimistic concurrency vs. retry storms**: Optimistic control avoids locks but requires retries on conflict, which can cascade under heavy contention.
- **Atomic operations vs. flexibility**: Single-statement atomic updates are race-free, but not every operation can be expressed as a single SQL statement.

## Common small mistakes

- Checking a condition in application code and then acting on it in a separate database call ("check-then-act"), creating a window where the condition can change.
- Assuming that because individual database queries are atomic, a sequence of queries is also atomic -- it is not, without a transaction.
- Testing only with a single concurrent user and assuming the logic is safe for production traffic.
- Using `READ COMMITTED` isolation and expecting it to prevent phantom reads or non-repeatable reads.
- Adding sleep-based delays as a "fix," which only reduces the probability of the race without eliminating it.
