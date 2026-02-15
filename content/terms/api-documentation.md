---
title: "API Documentation"
letter: "A"
categories:
  - "backend"
  - "architecture"
shortDefinition: "A structured reference that describes an API's endpoints, request/response formats, authentication, and usage examples so consumers can integrate with it."
---

## Why does it exist?

An API without documentation is like a library without a catalog -- technically usable, but only by the person who built it. When another team, a partner company, or a future version of yourself needs to integrate with your API, they need to know: what endpoints are available, what parameters each accepts, what the response looks like, how to authenticate, and what errors to expect. Without this, every consumer resorts to reading source code, guessing, or pinging the API team on chat.

API documentation formalizes this knowledge into a living reference. Modern tools like OpenAPI (formerly Swagger) go further: they provide a machine-readable specification that can auto-generate client SDKs, interactive test consoles, and validation middleware. Good documentation reduces integration time from days to hours and dramatically cuts support requests.

## Practical example of use

A team builds a task management API and documents it using the OpenAPI 3.0 specification. This single YAML file powers auto-generated documentation, client libraries, and request validation.

```yaml
openapi: 3.0.3
info:
  title: Task Management API
  version: 1.2.0
  description: API for creating and managing tasks within projects.

servers:
  - url: https://api.example.com/v1

paths:
  /tasks:
    get:
      summary: List all tasks
      operationId: listTasks
      parameters:
        - name: status
          in: query
          required: false
          schema:
            type: string
            enum: [pending, in_progress, done]
          description: Filter tasks by status
        - name: limit
          in: query
          required: false
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        "200":
          description: A list of tasks
          content:
            application/json:
              schema:
                type: object
                properties:
                  tasks:
                    type: array
                    items:
                      $ref: "#/components/schemas/Task"
                  total:
                    type: integer

    post:
      summary: Create a new task
      operationId: createTask
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title]
              properties:
                title:
                  type: string
                  maxLength: 200
                description:
                  type: string
                assignee:
                  type: string
                  format: email
      responses:
        "201":
          description: Task created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Task"
        "400":
          description: Validation error

components:
  schemas:
    Task:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
        status:
          type: string
          enum: [pending, in_progress, done]
        assignee:
          type: string
          format: email
        createdAt:
          type: string
          format: date-time

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

This specification can be fed into tools like Swagger UI for an interactive explorer, `openapi-generator` for client SDKs in any language, and middleware like `express-openapi-validator` to enforce the schema at runtime.

## When to use

- You are building an API consumed by other teams, external partners, or the public.
- Your API has more than a handful of endpoints, making it impractical for consumers to guess the contract.
- You want to auto-generate client libraries, test consoles, or request validators from a single source of truth.
- Onboarding new developers who need to understand and integrate with your services quickly.

## When to avoid

- Purely internal, unstable prototypes where the API changes daily and documentation would be constantly outdated (document once it stabilizes).
- Tightly coupled systems where the producer and consumer are in the same codebase and shared types serve as the documentation.
- One-off scripts or CLIs that are not APIs and would not benefit from OpenAPI tooling.

## Trade-offs

- **Accuracy vs. maintenance effort**: Documentation is only useful if it matches the actual API. Generating docs from code (or validating code against the spec) helps, but adds tooling.
- **Comprehensiveness vs. readability**: Documenting every edge case and error code is thorough, but can overwhelm consumers. A good quickstart guide paired with detailed reference pages strikes the best balance.
- **Machine-readable specs vs. learning curve**: OpenAPI enables powerful automation, but writing and maintaining YAML specs has a learning curve and can be verbose for simple APIs.

## Common small mistakes

- Writing documentation once at launch and never updating it, so it drifts from the actual API within weeks.
- Documenting only the happy path and omitting error responses, leaving consumers to discover error shapes through trial and error.
- Not including authentication details, forcing every new consumer to ask "how do I get a token?"
- Providing no runnable examples; even the best reference docs are frustrating without copy-paste curl or SDK snippets.
- Keeping the OpenAPI spec in a separate repository from the code, making it easy for them to fall out of sync.
