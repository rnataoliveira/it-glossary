---
title: "CORS"
letter: "C"
categories:
  - "improve-reliability"
  - "explain-architecture"
  - "improve-security"
  - "front-end-applications"
shortDefinition: "Cross-Origin Resource Sharing — a browser security mechanism that controls which domains can make HTTP requests to your server."
---

## Why does it exist?

Browsers enforce the Same-Origin Policy, which prevents a web page from making requests to a different domain than the one that served it. This exists to stop malicious websites from silently making authenticated requests to your bank or email on your behalf. However, legitimate use cases require cross-origin requests — a front end on app.example.com needs to call an API on api.example.com, or a web app needs to load fonts from Google Fonts. CORS was created as a controlled relaxation of the Same-Origin Policy, letting servers explicitly declare which origins, methods, and headers are allowed.

## Practical example of use

A React application hosted at https://app.acme.com makes a POST request with a JSON body to an API at https://api.acme.com/orders. Because the request uses Content-Type: application/json (a non-simple header), the browser first sends a preflight OPTIONS request to the API asking "does this origin have permission?" The API server responds with headers: `Access-Control-Allow-Origin: https://app.acme.com`, `Access-Control-Allow-Methods: GET, POST`, and `Access-Control-Allow-Headers: Content-Type, Authorization`. The browser validates the preflight response, confirms the origin is allowed, and proceeds with the actual POST request. Without these headers, the browser would block the response entirely.

## When to use

- When your front-end application and API are served from different domains or subdomains, which is the standard architecture for SPAs with separate API servers
- When your API is consumed by third-party web applications that run on their own domains
- When serving static assets like fonts, images, or scripts from a CDN on a different origin
- Any time a browser makes a cross-origin fetch, XMLHttpRequest, or loads a resource that triggers CORS enforcement

## When to avoid

- When the front end and API are served from the same origin — same-origin requests do not trigger CORS at all
- Do not use `Access-Control-Allow-Origin: *` with credentialed requests (cookies or Authorization headers) — the browser will reject it and it opens security risks
- Server-to-server communication does not involve browsers and therefore does not involve CORS — configuring it there is unnecessary

## Trade-offs

- **Security control vs. configuration complexity**: CORS lets servers precisely control access, but misconfiguration is one of the most common sources of front-end bugs and confusing error messages
- **Preflight protection vs. latency cost**: The OPTIONS preflight request ensures the server approves the action before it happens, but it adds an extra round trip that can increase latency for every unique cross-origin request
- **Granular origin allowlists vs. maintenance burden**: Listing specific allowed origins is more secure than wildcards, but every new client domain requires a server configuration update

## Common small mistakes

- Setting `Access-Control-Allow-Origin: *` in production APIs that use cookies or tokens, which the browser will reject and which exposes the API to requests from any website
- Debugging CORS errors by looking at the response body — the browser blocks the response before your code can read it, so errors appear in the console, not in your catch handler
- Forgetting to handle the OPTIONS preflight method on the server, causing the preflight to return a 404 or 405 and blocking all subsequent requests
- Not caching preflight responses with `Access-Control-Max-Age`, causing the browser to send a redundant OPTIONS request before every single cross-origin call
