---
title: "Middleware"
letter: "M"
categories:
  - "explain-architecture"
  - "improve-maintainability"
  - "back-end-applications"
shortDefinition: "Software that sits between a request and response, processing or transforming data as it passes through the application pipeline."
---

## Why does it exist?

Every web application needs to perform repetitive tasks on incoming requests — authentication, logging, input validation, CORS headers, compression — before the actual business logic runs. Without a structured way to handle these concerns, developers would scatter the same boilerplate across every route handler. Middleware was introduced as a composable pipeline pattern where each step processes the request, optionally modifies it, and passes it to the next step. This keeps route handlers focused on business logic and makes cross-cutting concerns reusable and testable.

## Practical example of use

An Express.js API uses a chain of middleware functions. First, `helmet()` sets security headers. Next, `cors()` allows requests from approved origins. Then, a custom `authenticateJWT` middleware verifies the bearer token and attaches the user object to `req.user`. A `rateLimiter` middleware checks Redis to enforce 100 requests per minute per API key. Only after all four middleware functions pass does the request reach the route handler that queries the database and returns the response. If any middleware rejects the request, the pipeline short-circuits and returns an appropriate error.

## When to use

- You have cross-cutting concerns (auth, logging, rate limiting) that apply to many or all routes
- You want to keep route handlers clean and focused on a single responsibility
- You need to compose request processing steps in a specific, configurable order
- Different environments or routes require different combinations of processing steps

## When to avoid

- The logic is specific to a single route and will never be reused — inline it in the handler instead
- The middleware introduces hidden state mutations that make the request flow difficult to reason about
- You are stacking so many middleware layers that debugging which one modified the request becomes impractical

## Trade-offs

- **Reusable logic vs. hidden behavior**: Cross-cutting concerns are written once and applied everywhere, but developers unfamiliar with the middleware stack may not realize what transformations happen before their handler runs.
- **Clean separation vs. ordering sensitivity**: Each middleware has a single responsibility, but the order in which middleware is registered matters — authentication must come before authorization, and mistakes in ordering cause subtle bugs.
- **Composability vs. performance overhead**: Adding middleware is as simple as registering a function, but each layer adds processing time, and unnecessary middleware on hot paths can degrade latency.

## Common small mistakes

- Registering middleware globally when it only applies to specific routes, adding unnecessary processing to every request
- Forgetting to call `next()` (or the equivalent in your framework), causing requests to hang indefinitely
- Placing error-handling middleware before route handlers instead of after them, so it never catches route errors
- Mutating the request object in ways that downstream middleware or handlers do not expect, creating hard-to-trace bugs
