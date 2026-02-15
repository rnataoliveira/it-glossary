---
title: "Unit Testing"
letter: "U"
categories:
  - "testing"
  - "backend"
shortDefinition: "Testing individual functions or methods in isolation to verify they produce correct outputs for given inputs."
---

## Why does it exist?

Software is built from small pieces — functions, methods, classes — that each carry specific responsibilities. When these pieces contain bugs, errors compound as they interact with one another, making defects harder to trace. Unit testing exists to catch problems at the smallest possible scope: a single function, a single method, a single logical unit. By verifying each piece independently, developers gain confidence that the foundations of their system are sound before layering on complexity.

Without unit tests, teams discover bugs late — during integration, QA, or worse, in production. Late-stage bug discovery is exponentially more expensive to fix because it requires understanding how the defect propagates through the entire system. Unit tests provide a fast, cheap feedback loop that catches regressions within seconds of making a change.

## Practical example of use

Consider a utility function that calculates the total price of items in a shopping cart, applying a discount when the total exceeds a threshold. A unit test verifies this logic without involving a database, HTTP server, or UI.

```javascript
// cartUtils.js
function calculateTotal(items, discountThreshold = 100, discountRate = 0.1) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (subtotal >= discountThreshold) {
    return subtotal * (1 - discountRate);
  }
  return subtotal;
}

module.exports = { calculateTotal };

// cartUtils.test.js
const { calculateTotal } = require('./cartUtils');

describe('calculateTotal', () => {
  it('sums item prices correctly', () => {
    const items = [
      { price: 20, quantity: 2 },
      { price: 10, quantity: 1 },
    ];
    expect(calculateTotal(items)).toBe(50);
  });

  it('applies discount when subtotal meets threshold', () => {
    const items = [{ price: 50, quantity: 3 }]; // subtotal = 150
    expect(calculateTotal(items)).toBe(135); // 150 * 0.9
  });

  it('does not apply discount below threshold', () => {
    const items = [{ price: 30, quantity: 1 }];
    expect(calculateTotal(items)).toBe(30);
  });

  it('returns 0 for an empty cart', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

## When to use

- For any pure function or method that takes inputs and produces outputs without side effects
- When building core business logic that must remain correct across future changes
- Before refactoring, to ensure the rewritten code preserves existing behavior
- In CI pipelines as the first line of defense against regressions

## When to avoid

- When testing requires a running database, network calls, or filesystem access — those are integration tests
- For verifying that multiple components work together correctly across service boundaries
- When the "unit" is just a thin wrapper that delegates entirely to another library, offering no meaningful logic to test
- For UI layout or visual appearance verification, which is better handled by snapshot or visual regression tests

## Trade-offs

- **Fast feedback vs. limited scope**: Unit tests run in milliseconds and catch logic errors early, but they cannot reveal problems that only appear when components interact.
- **Maintenance cost vs. safety**: Every test is code that must be maintained. Over-testing trivial getters or simple pass-through methods adds maintenance burden without proportional safety.
- **Isolation vs. realism**: Unit tests deliberately isolate code from its dependencies, which means a passing unit test suite does not guarantee the system works end-to-end.

## Common small mistakes

- Testing implementation details (like which internal method was called) instead of observable behavior, causing tests to break during harmless refactors
- Writing tests that depend on execution order or shared mutable state, leading to flaky test suites
- Aiming for 100% code coverage as a goal rather than focusing coverage on complex or critical logic paths
- Forgetting to test edge cases such as empty inputs, null values, boundary values, and error conditions
- Making assertions too loose (e.g., `toBeTruthy()` when `toBe(42)` is what you actually expect)
