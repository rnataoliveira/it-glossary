---
title: "Mocking"
letter: "M"
categories:
  - "testing"
shortDefinition: "Replacing real dependencies with controlled substitutes during testing to isolate the code under test."
---

## Why does it exist?

Real software depends on databases, APIs, file systems, clocks, and other components that are slow, unpredictable, or unavailable in a test environment. Mocking replaces these dependencies with programmable stand-ins that return predetermined responses, throw specific errors, or record how they were called. This allows tests to run fast, deterministically, and without requiring complex infrastructure.

Beyond practical concerns, mocking serves a design purpose. When a function is hard to mock, it often has too many responsibilities or is too tightly coupled to its dependencies. The need to mock pushes developers toward dependency injection and clear interfaces, which are hallmarks of well-structured code.

## Practical example of use

A notification service sends an email when an order is placed. In tests, you mock the email client to avoid sending real emails while verifying the correct email would be sent.

```javascript
// orderService.js
class OrderService {
  constructor(emailClient) {
    this.emailClient = emailClient;
  }

  async placeOrder(order) {
    // ... save order to database ...
    await this.emailClient.send({
      to: order.customerEmail,
      subject: 'Order Confirmation',
      body: `Your order #${order.id} has been placed.`,
    });
    return { success: true, orderId: order.id };
  }
}

module.exports = { OrderService };

// orderService.test.js
const { OrderService } = require('./orderService');

describe('OrderService.placeOrder', () => {
  it('sends a confirmation email with the order ID', async () => {
    const mockEmailClient = {
      send: jest.fn().mockResolvedValue({ messageId: 'abc-123' }),
    };

    const service = new OrderService(mockEmailClient);
    const order = { id: 42, customerEmail: 'buyer@example.com' };

    const result = await service.placeOrder(order);

    expect(result).toEqual({ success: true, orderId: 42 });
    expect(mockEmailClient.send).toHaveBeenCalledTimes(1);
    expect(mockEmailClient.send).toHaveBeenCalledWith({
      to: 'buyer@example.com',
      subject: 'Order Confirmation',
      body: 'Your order #42 has been placed.',
    });
  });

  it('propagates email client errors', async () => {
    const mockEmailClient = {
      send: jest.fn().mockRejectedValue(new Error('SMTP timeout')),
    };

    const service = new OrderService(mockEmailClient);
    const order = { id: 99, customerEmail: 'buyer@example.com' };

    await expect(service.placeOrder(order)).rejects.toThrow('SMTP timeout');
  });
});
```

## When to use

- When testing code that depends on external services you do not control (payment gateways, email providers, third-party APIs)
- When you need deterministic tests that do not depend on network availability or database state
- When simulating error conditions that are difficult to reproduce with real dependencies (timeouts, rate limits, server errors)
- When you want to verify that your code calls a dependency with specific arguments without triggering side effects

## When to avoid

- When testing the actual integration between your code and the dependency — use integration tests with real (or containerized) dependencies
- When the mock becomes so complex that it reimplements the dependency's behavior, which defeats the purpose
- When testing data access logic; mocking the database hides query bugs that only appear with real SQL execution
- When the external behavior is simple and deterministic enough that mocking adds complexity without value

## Trade-offs

- **Speed vs. realism**: Mocks make tests fast and deterministic but do not verify that the real dependency behaves as the mock assumes.
- **Isolation vs. false confidence**: A passing test with mocks proves your code handles the mock's behavior correctly, but the real dependency might respond differently in production.
- **Testability vs. maintenance**: Mocks must be updated when the dependency's interface changes, adding a maintenance burden that grows with the number of mocked interactions.

## Common small mistakes

- Mocking too deeply — replacing internal implementation details instead of external boundaries, making tests brittle to refactoring
- Forgetting to verify that mock expectations are met (e.g., using `jest.fn()` without asserting it was called)
- Creating mocks that always succeed, never testing how your code handles failures from the mocked dependency
- Using global mocks that leak between tests, causing order-dependent failures
- Mocking what you do not own without also having integration tests that verify the real behavior
