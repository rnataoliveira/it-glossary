---
title: "JWT"
letter: "J"
categories:
  - "security"
  - "backend"
shortDefinition: "JSON Web Token — a compact, URL-safe token format that encodes claims as a signed JSON payload for stateless authentication."
---

## Why does it exist?

Traditional session-based authentication requires the server to store session state, which becomes a bottleneck when scaling across multiple servers or services. JWT was created to enable stateless authentication — the token itself carries all the information the server needs to verify identity and claims, signed cryptographically so it cannot be tampered with. This makes it especially well-suited for distributed systems, microservices, and APIs where sharing server-side session stores is impractical.

## Practical example of use

A user logs into a SaaS application. The auth server validates their credentials and returns a JWT containing their user ID, email, role, and an expiration time, all signed with the server's private key. On every subsequent API request, the client sends this token in the `Authorization: Bearer <token>` header. Each microservice independently verifies the signature using the public key and extracts the user's role from the payload to make authorization decisions — no database lookup or shared session store required.

```js
const jwt = require("jsonwebtoken");

// After login — create the token
const token = jwt.sign(
  { userId: 42, email: "jane@example.com", role: "editor" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// On each request — verify and decode
try {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  console.log(payload.userId); // 42
  console.log(payload.role);   // "editor"
} catch (err) {
  console.error("Invalid or expired token");
}
```

## When to use

- When building stateless REST or GraphQL APIs that need to authenticate requests without server-side sessions
- When multiple services or microservices need to trust the same authentication token independently
- When implementing short-lived access tokens paired with longer-lived refresh tokens
- When you need to pass identity claims between systems in a compact, URL-safe format

## When to avoid

- When you need the ability to instantly revoke a user's session, since JWTs remain valid until they expire unless you add a revocation list
- When the token payload would contain highly sensitive data that should never be exposed client-side, since the payload is only Base64-encoded, not encrypted
- When your application is a simple server-rendered monolith where cookie-based sessions are simpler and sufficient

## Trade-offs

- **Stateless scalability vs. Revocation difficulty**: JWTs eliminate the need for shared session stores, but revoking a token before expiration requires maintaining a deny-list, partially negating the stateless benefit
- **Self-contained convenience vs. Token size**: Embedding claims in the token avoids extra database calls, but large payloads increase the size of every HTTP request
- **Simplicity of verification vs. Key management burden**: Any service can verify a token with the public key, but rotating keys, managing JWKS endpoints, and handling key compromise adds operational complexity

## Common small mistakes

- Storing JWTs in localStorage, making them vulnerable to XSS attacks, instead of using httpOnly cookies
- Setting excessively long expiration times, which widens the attack window if a token is leaked
- Not validating the `alg` header, which can allow an attacker to switch the algorithm to `none` or use a symmetric key attack
- Putting sensitive information like passwords or API keys in the JWT payload, forgetting that the payload is readable by anyone who has the token
