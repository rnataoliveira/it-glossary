---
title: "Integration Testing"
letter: "I"
categories:
  - "testing"
  - "backend"
shortDefinition: "Testing how multiple components or services work together to verify that their interactions produce correct results."
---

## Why does it exist?

Unit tests prove that individual pieces work in isolation, but software failures frequently occur at the boundaries — where a service calls a database, where one microservice sends a request to another, where a message is published to a queue. Integration testing exists to verify these seams. It catches mismatched data formats, incorrect query logic, misconfigured connections, and protocol-level issues that unit tests, by design, cannot detect.

Real-world systems depend on databases, caches, message brokers, and third-party APIs. An integration test exercises the actual interaction between your code and these dependencies (or realistic substitutes like test containers), ensuring that the contract between components holds under real conditions.

## Practical example of use

A REST API endpoint creates a user and stores them in a database. An integration test sends a real HTTP request to the running application and verifies the response and the database state.

```typescript
// user.integration.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/database';

beforeAll(async () => {
  await db.migrate.latest();
});

afterEach(async () => {
  await db('users').truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe('POST /api/users', () => {
  it('creates a user and returns 201', async () => {
    const payload = { name: 'Alice', email: 'alice@example.com' };

    const response = await request(app)
      .post('/api/users')
      .send(payload)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'Alice',
      email: 'alice@example.com',
    });

    // Verify the record actually exists in the database
    const row = await db('users').where({ email: 'alice@example.com' }).first();
    expect(row).toBeDefined();
    expect(row.name).toBe('Alice');
  });

  it('returns 409 when email already exists', async () => {
    await db('users').insert({ name: 'Alice', email: 'alice@example.com' });

    await request(app)
      .post('/api/users')
      .send({ name: 'Alice2', email: 'alice@example.com' })
      .expect(409);
  });
});
```

## When to use

- When verifying that your application correctly reads from and writes to a database
- When testing API endpoints that involve request parsing, validation, business logic, and persistence together
- When validating that message producers and consumers agree on the message schema and behavior
- When checking that third-party service integrations handle real response formats and error codes

## When to avoid

- For testing pure business logic that has no external dependencies — unit tests are faster and more precise
- When the test would require spinning up the entire distributed system; use contract tests instead
- For verifying UI behavior or user workflows — end-to-end tests are a better fit
- When rapid feedback is the priority; integration tests are slower and should not replace unit tests for fine-grained logic checks

## Trade-offs

- **Realism vs. speed**: Integration tests catch real interaction bugs but are orders of magnitude slower than unit tests, increasing CI pipeline duration.
- **Confidence vs. complexity**: They require managing external dependencies (databases, containers, network services), which adds infrastructure complexity and potential flakiness.
- **Coverage vs. cost**: Each integration test exercises more code paths per test but is more expensive to write, maintain, and debug when it fails.

## Common small mistakes

- Not cleaning up test data between runs, causing tests to pass individually but fail when run together
- Using a shared staging database instead of isolated test instances, leading to interference between parallel test suites
- Testing too many scenarios at the integration level when most of them could be covered faster with unit tests
- Forgetting to test error paths — such as database connection failures, timeouts, or malformed responses from downstream services
- Hardcoding ports or hostnames that differ between local development and CI environments
