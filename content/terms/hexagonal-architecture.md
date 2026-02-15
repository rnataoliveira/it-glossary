---
title: "Hexagonal Architecture"
letter: "H"
categories:
  - "architecture"
shortDefinition: "An architectural pattern that isolates core business logic from external systems by communicating through ports and adapters."
---

## Why does it exist?

In typical layered architectures, business logic often becomes entangled with infrastructure details -- database queries leak into service classes, HTTP request objects get passed deep into the domain, and switching from one database to another means rewriting core logic. This coupling makes the code fragile, hard to test, and resistant to change.

Hexagonal Architecture (also called Ports and Adapters), introduced by Alistair Cockburn, solves this by placing the domain at the center and defining explicit boundaries. The domain exposes "ports" -- interfaces that describe what it needs from the outside world -- and "adapters" implement those interfaces for specific technologies. The domain never imports anything from infrastructure; all dependencies point inward. This makes it trivial to swap databases, replace an HTTP API with a CLI, or test business rules in complete isolation.

## Practical example of use

Imagine an order management system. The domain defines a port for persisting orders, and adapters implement it for PostgreSQL in production and an in-memory store in tests.

```typescript
// --- Port (defined by the domain) ---
interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}

// --- Domain entity ---
class Order {
  constructor(
    public readonly id: string,
    public readonly items: string[],
    public status: "pending" | "confirmed" | "shipped"
  ) {}

  confirm(): void {
    if (this.items.length === 0) {
      throw new Error("Cannot confirm an empty order.");
    }
    this.status = "confirmed";
  }
}

// --- Application service (orchestrates domain through ports) ---
class ConfirmOrderUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error("Order not found.");

    order.confirm();
    await this.orderRepo.save(order);
  }
}

// --- Adapter: PostgreSQL (infrastructure) ---
class PostgresOrderRepository implements OrderRepository {
  constructor(private readonly pool: Pool) {}

  async save(order: Order): Promise<void> {
    await this.pool.query(
      `INSERT INTO orders (id, items, status) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET status = $3`,
      [order.id, JSON.stringify(order.items), order.status]
    );
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Order(row.id, JSON.parse(row.items), row.status);
  }
}

// --- Adapter: In-Memory (for testing) ---
class InMemoryOrderRepository implements OrderRepository {
  private orders = new Map<string, Order>();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }
}
```

With this structure, the `ConfirmOrderUseCase` is tested without a database, and switching from PostgreSQL to DynamoDB only requires writing a new adapter -- the domain code never changes.

## When to use

- Applications with complex business rules that need to be tested independently of databases and frameworks.
- Projects where the infrastructure is expected to change (e.g., migrating from one cloud provider to another).
- Teams building long-lived systems where maintainability and clear boundaries pay off over time.
- Microservices that need to expose the same logic through multiple interfaces (HTTP, gRPC, message queues).

## When to avoid

- Simple CRUD applications with little or no business logic -- the extra layers add overhead without meaningful benefit.
- Rapid prototypes or throwaway proofs of concept where speed of delivery matters more than architecture.
- Very small teams or solo projects where the cognitive overhead of ports and adapters slows development without enough payoff.

## Trade-offs

- **Testability vs. indirection**: Pure domain tests are fast and reliable, but the extra interfaces and adapter classes increase the number of files and indirection levels.
- **Flexibility vs. up-front cost**: Swapping infrastructure becomes easy, but defining ports and writing adapters takes more initial effort than calling the database directly.
- **Enforced boundaries vs. team discipline**: The architecture guides developers toward separation of concerns, but without code reviews or linting rules, shortcuts (e.g., importing infrastructure into the domain) erode the boundaries over time.

## Common small mistakes

- Creating ports that mirror the database schema instead of expressing domain intent, turning the architecture into a glorified data access layer.
- Letting framework-specific types (Express `Request`, NestJS decorators) leak into the domain layer.
- Over-abstracting by creating ports for everything, including trivial utilities like date formatting that have no infrastructure dependency.
- Skipping the application service layer and putting orchestration logic directly in the adapter, which re-couples infrastructure to business rules.
