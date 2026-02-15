---
title: "OAuth"
letter: "O"
categories:
  - "security"
  - "backend"
shortDefinition: "An open standard for delegated authorization that lets users grant third-party apps limited access without sharing passwords."
---

## Why does it exist?

Before OAuth, granting a third-party application access to your data on another service meant handing over your username and password directly. This was dangerous — the third party had full access, there was no way to limit scope, and revoking access meant changing your password everywhere. OAuth was created to solve this by introducing a delegation model: the user approves specific permissions through the resource owner (e.g., Google), and the third-party app receives a scoped token instead of raw credentials.

## Practical example of use

A project management tool wants to create GitHub issues on behalf of the user. Instead of asking for their GitHub password, the tool redirects the user to GitHub's authorization page, where they see a consent screen: "This app wants to read and write issues in your repositories." The user approves, GitHub redirects back to the tool with an authorization code, and the tool exchanges that code for an access token scoped only to issue management. The tool never sees the user's GitHub password, and the user can revoke access at any time from their GitHub settings.

## When to use

- When your application needs to access user data hosted on a third-party service like Google, GitHub, or Slack
- When implementing "Sign in with X" flows to simplify onboarding without managing passwords yourself
- When building an API platform and you want third-party developers to access user resources with explicit consent
- When you need fine-grained, revocable, scoped access control between services

## When to avoid

- When you only need simple authentication and have no third-party integrations — a straightforward username/password or passkey flow is simpler
- When communicating between internal services you fully control, where mutual TLS or service-account tokens are more appropriate
- When the overhead of maintaining OAuth flows, token refresh logic, and consent screens is disproportionate to the application's scope

## Trade-offs

- **Security vs. Implementation complexity**: OAuth eliminates password sharing and supports scoped access, but the full authorization code flow with PKCE, token refresh, and error handling is significantly more complex than basic auth
- **User trust vs. Friction**: Consent screens build user confidence by showing exactly what access is being granted, but they add steps to the login flow and can cause drop-off
- **Flexibility vs. Inconsistency**: OAuth 2.0 is a framework, not a strict protocol, which means providers implement it differently — redirect URI handling, token formats, and scope naming vary across services

## Common small mistakes

- Confusing OAuth (authorization) with OpenID Connect (authentication) — OAuth alone does not tell you who the user is, only what they have authorized
- Not using the PKCE extension in public clients like SPAs and mobile apps, leaving the authorization code flow vulnerable to interception
- Storing refresh tokens insecurely on the client side, giving attackers long-lived access if the device is compromised
- Requesting overly broad scopes out of convenience, violating the principle of least privilege and eroding user trust
