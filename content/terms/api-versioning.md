---
title: "API Versioning"
letter: "A"
categories:
  - "architecture"
  - "backend"
shortDefinition: "A strategy for managing breaking changes in an API by maintaining multiple versions simultaneously."
---

## Why does it exist?

APIs are contracts between providers and consumers. Once clients depend on an endpoint's response shape, changing a field name, removing a property, or altering validation rules breaks those clients. Without a versioning strategy, teams face an impossible choice: freeze the API forever or break existing consumers every time they improve it.

API versioning lets you evolve your API while giving existing consumers time to migrate. By running multiple versions in parallel, you can ship improvements in a new version while the old version continues to work. This is essential for public APIs where you do not control the consumers, and valuable for internal APIs in large organizations where coordinating simultaneous upgrades across dozens of teams is impractical.

## Practical example of use

A team maintains a user management API. Version 1 returns a single `name` string, but a new requirement needs separate `firstName` and `lastName` fields. Rather than breaking all existing clients, they introduce v2 while keeping v1 available.

```typescript
import express from "express";

const app = express();

// Shared data layer
function getUserFromDB(id: string) {
  return { id, firstName: "Jane", lastName: "Doe", email: "jane@example.com" };
}

// --- Version 1: original contract ---
const v1Router = express.Router();

v1Router.get("/users/:id", (req, res) => {
  const user = getUserFromDB(req.params.id);
  res.json({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,  // combined name
    email: user.email,
  });
});

// --- Version 2: improved contract ---
const v2Router = express.Router();

v2Router.get("/users/:id", (req, res) => {
  const user = getUserFromDB(req.params.id);
  res.json({
    id: user.id,
    firstName: user.firstName,   // split name fields
    lastName: user.lastName,
    email: user.email,
  });
});

// Mount versioned routes
app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

app.listen(3000, () => console.log("API running on port 3000"));
```

Existing clients continue calling `/api/v1/users/123` and receive the combined `name` field. New clients use `/api/v2/users/123` with the split fields. After a deprecation period, v1 is retired.

## When to use

- You maintain a public or partner API where you do not control consumer upgrade timelines.
- A breaking change is necessary (removing fields, renaming properties, changing behavior) and consumers need a migration window.
- Multiple teams consume your API internally and cannot all upgrade simultaneously.
- You want a clear deprecation lifecycle: announce sunset, provide migration guides, then remove the old version.

## When to avoid

- Your API is internal to a single team and all consumers can be updated in the same deployment.
- The change is backward-compatible (adding a new optional field) and does not require a new version.
- You are in the early prototyping phase with no external consumers -- versioning adds overhead before you have a stable contract.

## Trade-offs

- **Consumer stability vs. maintenance burden**: Multiple live versions keep consumers happy but mean you are maintaining and testing multiple code paths.
- **URL versioning simplicity vs. flexibility**: Path-based versioning (`/v1/`, `/v2/`) is easy to understand and route, but header-based or query-parameter versioning allows more granular control without changing URLs.
- **Long deprecation windows vs. technical debt**: Generous migration periods are consumer-friendly, but the longer old versions live, the more legacy code you carry.

## Common small mistakes

- Versioning every change, including backward-compatible additions, which creates unnecessary version churn and confuses consumers.
- Not documenting a clear deprecation policy, so old versions linger indefinitely because no one knows when they can be removed.
- Duplicating entire codebases per version instead of sharing common logic and only branching where the contract differs.
- Using version numbers in the codebase that do not match the public API version, causing confusion during debugging.
- Forgetting to version error response formats alongside success responses, causing client error-handling code to break.
