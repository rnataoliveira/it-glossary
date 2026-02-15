---
title: "REST API"
letter: "R"
categories:
  - "architecture"
  - "backend"
shortDefinition: "An architectural style for web APIs that uses HTTP methods and resource-based URLs to perform CRUD operations."
---

## Why does it exist?

Before REST, web services relied on heavyweight protocols like SOAP with complex XML contracts and rigid tooling. Roy Fielding proposed REST in 2000 as a set of constraints that leverage the existing HTTP protocol — using standard methods (GET, POST, PUT, DELETE), status codes, and resource-based URLs. This made APIs simpler to build, understand, and consume without requiring specialized libraries or contract negotiation.

## Practical example of use

An e-commerce platform exposes a REST API for its product catalog. A client sends `GET /api/v1/products/42` and receives a JSON response with the product details and a `200 OK` status. To update the price, the client sends `PUT /api/v1/products/42` with the updated JSON body. The server validates the input, persists the change, and returns `200 OK` with the updated resource. A mobile app team and a web frontend team both consume the same API without any coordination beyond reading the API documentation.

```http
GET /api/v1/products/42 HTTP/1.1
Host: store.example.com
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "name": "Wireless Keyboard",
  "price": 59.99,
  "category": "peripherals",
  "inStock": true
}
```

## When to use

- Public-facing APIs that need to be easy for third-party developers to adopt
- CRUD-heavy applications where resources map naturally to database entities
- When you need broad ecosystem support (every language and framework has HTTP clients)
- Systems where caching at the HTTP layer (CDNs, browser cache) is important

## When to avoid

- Real-time applications that require persistent connections (use WebSockets instead)
- Clients that need to fetch deeply nested or related data in a single call (consider GraphQL)
- Internal service-to-service communication where performance is critical (consider gRPC)

## Trade-offs

- **Simplicity vs. over-fetching**: Easy to understand and implement, but clients often receive more data than they need or must make multiple requests to assemble a view.
- **Cacheability vs. flexibility**: HTTP caching works well for GET requests, but invalidation strategies become complex for frequently updated resources.
- **Statelessness vs. overhead**: Each request is self-contained, improving scalability, but authentication tokens and context must be sent with every request.

## Common small mistakes

- Using verbs in URLs (`/api/getProducts`) instead of nouns (`/api/products`) with proper HTTP methods
- Returning `200 OK` for every response and embedding the actual status in the JSON body instead of using proper HTTP status codes
- Not versioning the API from the start, making breaking changes impossible to introduce safely
- Ignoring HATEOAS and pagination — returning unbounded collections that grow until they crash clients
