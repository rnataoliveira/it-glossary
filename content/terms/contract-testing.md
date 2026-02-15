---
title: "Contract Testing"
letter: "C"
categories:
  - "testing"
  - "architecture"
shortDefinition: "Verifying that two services agree on the structure and behavior of their shared API by testing each side independently against a shared contract."
---

## Why does it exist?

In a microservices architecture, services communicate over APIs. When the order service expects a field called `userId` from the user service, but the user service renames it to `customerId`, the integration breaks — often discovered only in staging or production. Integration tests can catch this, but they require running both services simultaneously, which becomes impractical as the number of services grows.

Contract testing solves this by capturing the agreement between a consumer (the service making requests) and a provider (the service handling them) as a formal contract. The consumer generates the contract based on its expectations, and the provider verifies it can fulfill those expectations. Each side is tested independently, so you get the confidence of integration testing without the overhead of running the entire system.

## Practical example of use

An order service (consumer) depends on a user service (provider) to fetch user details. Using Pact, the consumer defines what it expects, and the provider verifies it can deliver.

```javascript
// Consumer test — orderService.pact.test.js
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like, integer, string } = MatchersV3;
const { fetchUser } = require('./userClient');

const provider = new PactV3({
  consumer: 'OrderService',
  provider: 'UserService',
});

describe('User API contract', () => {
  it('returns user details by ID', async () => {
    // Define the expected interaction
    provider
      .given('user with ID 1 exists')
      .uponReceiving('a request for user 1')
      .withRequest({
        method: 'GET',
        path: '/api/users/1',
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: integer(1),
          name: string('Alice'),
          email: string('alice@example.com'),
        },
      });

    // Execute the consumer code against the mock provider
    await provider.executeTest(async (mockServer) => {
      const user = await fetchUser(mockServer.url, 1);

      expect(user.id).toBe(1);
      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
    });
  });
});

// Provider verification — userService.pact.verify.js
const { Verifier } = require('@pact-foundation/pact');

describe('UserService provider verification', () => {
  it('fulfills the OrderService contract', async () => {
    await new Verifier({
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: ['./pacts/OrderService-UserService.json'],
      stateHandlers: {
        'user with ID 1 exists': async () => {
          // Seed the database with the required test data
          await db('users').insert({ id: 1, name: 'Alice', email: 'alice@example.com' });
        },
      },
    }).verifyProvider();
  });
});
```

## When to use

- When multiple teams own different microservices that communicate via APIs and deploy independently
- When integration testing requires too many services to be running at once, making the test environment slow and fragile
- When you want to catch breaking API changes before deployment rather than in staging or production
- When using a Pact Broker or similar tool to share contracts across CI pipelines for automated compatibility checks

## When to avoid

- For monolithic applications where all code is deployed together and API boundaries are internal
- When the API is consumed by external parties you do not control — use API versioning and OpenAPI specification instead
- For simple systems with only two or three services where end-to-end integration tests are practical and sufficient
- When the API is event-driven with complex asynchronous workflows that are difficult to express in a request-response contract

## Trade-offs

- **Independent deployment confidence vs. contract management overhead**: Contract testing enables independent deployments with confidence, but managing and versioning contracts across many services requires tooling and discipline.
- **Speed vs. incomplete coverage**: Contract tests run faster than integration tests because each side is tested independently, but they verify the contract shape, not full business logic.
- **Decoupled testing vs. trust in the contract**: Both consumer and provider must trust and maintain the contract. A stale or incorrect contract gives false confidence.

## Common small mistakes

- Writing contracts that are too strict (matching exact values instead of types), causing tests to break when data changes but the structure is still correct
- Not setting up provider states properly, so the provider verification always runs against an empty database or wrong data
- Skipping the Pact Broker and sharing contract files manually, which breaks down as the number of services and consumers grows
- Testing only the happy path and not including contracts for error responses (404, 422, 500)
- Treating contract tests as a replacement for all other testing levels instead of as a complement to unit and E2E tests
