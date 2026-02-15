---
title: "Test-Driven Development (TDD)"
letter: "T"
categories:
  - "testing"
shortDefinition: "A development methodology where you write a failing test before writing the code that makes it pass, following a red-green-refactor cycle."
---

## Why does it exist?

Most developers write code first and tests afterward — if they write tests at all. This approach leads to code that is difficult to test, tests that are an afterthought, and subtle design problems that only surface later. Test-Driven Development inverts the process: you write a test that defines what the code should do, watch it fail (proving the test is valid), write the simplest code to make it pass, and then refactor with the safety net of a passing test. This cycle produces code that is testable by construction, better designed, and covered from the start.

TDD also acts as a design tool. When writing a test is difficult, it usually signals that the code has too many dependencies, unclear responsibilities, or a convoluted API. By forcing you to think about how code will be used before you write it, TDD naturally pushes toward simpler interfaces and better separation of concerns.

## Practical example of use

Building a password validator using the red-green-refactor cycle. Each step writes a failing test first, then the minimal code to pass it.

```javascript
// Step 1: RED — Write a failing test
// passwordValidator.test.js
const { validatePassword } = require('./passwordValidator');

test('rejects passwords shorter than 8 characters', () => {
  expect(validatePassword('abc')).toEqual({
    valid: false,
    errors: ['Password must be at least 8 characters'],
  });
});

// Step 2: GREEN — Write the minimum code to pass
// passwordValidator.js
function validatePassword(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  return { valid: errors.length === 0, errors };
}
module.exports = { validatePassword };

// Step 3: RED — Add the next failing test
test('rejects passwords without a number', () => {
  expect(validatePassword('abcdefgh')).toEqual({
    valid: false,
    errors: ['Password must contain at least one number'],
  });
});

// Step 4: GREEN — Extend the code to pass both tests
function validatePassword(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return { valid: errors.length === 0, errors };
}

// Step 5: REFACTOR — Extract rules into a data structure
const rules = [
  { test: (pw) => pw.length >= 8, message: 'Password must be at least 8 characters' },
  { test: (pw) => /\d/.test(pw), message: 'Password must contain at least one number' },
];

function validatePassword(password) {
  const errors = rules.filter((r) => !r.test(password)).map((r) => r.message);
  return { valid: errors.length === 0, errors };
}
```

## When to use

- When building business logic with well-defined rules and expected behaviors
- When designing APIs or libraries where the consumer interface matters and you want it to be ergonomic
- When working on bug fixes — write a test that reproduces the bug, then fix it
- When you need high confidence in critical code paths such as payment processing or data validation

## When to avoid

- For exploratory or prototype code where requirements are unclear and will change rapidly
- When writing glue code or configuration that has no meaningful logic to test
- For UI layout work where visual testing tools are more appropriate than assertion-based tests
- When working with legacy code that is not testable yet — refactor toward testability first before applying strict TDD

## Trade-offs

- **Design quality vs. speed**: TDD produces cleaner, more modular code but feels slower initially because you write tests before features. The investment pays off as the codebase grows.
- **Test coverage vs. rigidity**: TDD guarantees high coverage from the start, but tests written too tightly against implementation details can resist beneficial refactoring.
- **Discipline vs. flexibility**: Strict adherence to the red-green-refactor cycle can feel rigid, especially for experienced developers who can anticipate the design. Pragmatic teams adapt TDD intensity based on the complexity of the code.

## Common small mistakes

- Writing too large a test in the first step, trying to cover multiple behaviors at once instead of taking small incremental steps
- Skipping the refactor step, accumulating code that passes tests but has poor structure
- Writing tests that mirror the implementation instead of specifying behavior, defeating the design benefit of TDD
- Abandoning TDD when it feels slow instead of recognizing that smaller steps actually increase overall velocity
- Not running the test before writing code, so you never confirm that the test actually fails (the "red" step)
