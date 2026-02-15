---
title: "CSRF (Cross-Site Request Forgery)"
letter: "C"
categories:
  - "security"
  - "frontend"
shortDefinition: "A web security vulnerability where an attacker tricks a user's browser into making an unintended request to a trusted site, exploiting the fact that the browser automatically includes cookies with every request to that site."
---

## Why does it exist?

Browsers automatically attach cookies, including session cookies, to every request sent to a domain. This convenience is what makes persistent login sessions work, but it also creates a vulnerability. If a user is logged into their bank and visits a malicious website, that site can craft a form or image tag that triggers a request to the bank's API. The browser dutifully attaches the session cookie, and the bank's server processes the request as if the user intentionally initiated it.

CSRF attacks exploit this trust that a server places in authenticated requests from a browser. The attack does not require stealing credentials or session tokens. It only requires that the victim visits a page controlled by the attacker while they have an active session on the target site. Without CSRF protection, any state-changing operation, such as transferring money, changing an email address, or modifying account settings, is vulnerable.

## Practical example of use

A common defense is the synchronizer token pattern, where the server generates a unique, unpredictable token for each session and requires that every state-changing request includes this token. Since the attacker's site cannot read the token (due to the same-origin policy), it cannot forge a valid request.

```javascript
// Server: generate and set CSRF token
app.use((req, res, next) => {
  const token = crypto.randomUUID();
  res.cookie("csrf-token", token, { httpOnly: true, sameSite: "strict" });
  res.locals.csrfToken = token;
  next();
});

// Client: include token in requests
fetch("/api/transfer", {
  method: "POST",
  headers: { "X-CSRF-Token": document.cookie.match(/csrf-token=([^;]+)/)[1] },
  body: JSON.stringify({ amount: 100 }),
});
```

The server validates that the token in the `X-CSRF-Token` header matches the token it issued. An attacker's page on a different origin cannot read the cookie value (when `httpOnly` is properly handled and the token is also embedded in the page), so it cannot include the correct header. Modern frameworks often provide CSRF middleware that handles token generation and validation automatically.

## When to use

- When building web applications that perform state-changing operations (POST, PUT, DELETE) based on cookie-authenticated sessions.
- When your application uses session cookies for authentication and serves content that users interact with via forms or AJAX calls.
- When you need to comply with security standards like OWASP guidelines that explicitly require CSRF protection.
- When your application handles sensitive operations like financial transactions, account modifications, or privilege changes.

## When to avoid

- When your API uses token-based authentication (such as Bearer tokens in the Authorization header) instead of cookies, since CSRF relies on automatic cookie attachment.
- When building a purely stateless API consumed by non-browser clients (mobile apps, server-to-server) where cookies are not used.
- When you have already implemented the `SameSite=Strict` cookie attribute across all session cookies and your application does not need to support older browsers that ignore this attribute.
- When building read-only endpoints that do not modify any state, since CSRF only matters for state-changing requests.

## Trade-offs

- **Security vs. implementation effort**: Token-based CSRF protection adds complexity to both the server (token generation and validation) and the client (including the token in every request).
- **SameSite cookies vs. compatibility**: The `SameSite` cookie attribute provides robust CSRF protection with minimal effort but is not supported by very old browsers, potentially leaving some users unprotected.
- **Stateless tokens vs. server storage**: Storing CSRF tokens server-side in the session is straightforward but requires session state. Stateless approaches using signed tokens avoid server storage but add cryptographic complexity.

## Common small mistakes

- Protecting only form submissions while leaving AJAX endpoints unguarded, allowing CSRF through JavaScript-initiated requests.
- Using predictable or static CSRF tokens that an attacker can guess or reuse from a previous session.
- Setting the CSRF cookie without the `SameSite` attribute, reducing the defense-in-depth layering.
- Validating CSRF tokens only on some routes and forgetting to apply middleware to newly added state-changing endpoints.
- Not regenerating the CSRF token after login, which can allow a token fixation attack where the attacker sets a known token before the user authenticates.
