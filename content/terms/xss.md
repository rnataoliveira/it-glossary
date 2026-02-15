---
title: "XSS (Cross-Site Scripting)"
letter: "X"
categories:
  - "security"
  - "frontend"
shortDefinition: "A web security vulnerability where an attacker injects malicious scripts into web pages viewed by other users, enabling theft of session tokens, defacement of content, or redirection to malicious sites."
---

## Why does it exist?

Web applications routinely display user-generated content: comments, search queries, profile names, forum posts, and countless other inputs. When an application inserts this content into an HTML page without proper sanitization or encoding, the browser cannot distinguish between legitimate page markup and injected malicious code. An attacker who injects a `<script>` tag or an event handler attribute into the page can execute arbitrary JavaScript in the context of the victim's session.

XSS is one of the most persistent web vulnerabilities because the web's fundamental design mixes code (JavaScript) and data (HTML content) in the same document. Any point where user input flows into the page without proper handling is a potential injection vector. The consequences range from session hijacking (stealing cookies) to keylogging, phishing overlays, and complete account takeover. XSS consistently ranks among the OWASP Top 10 security risks because it is easy to introduce and difficult to eliminate entirely across a large application.

## Practical example of use

The most effective defense is to never insert untrusted data as raw HTML. Use safe APIs like `textContent` for plain text, sanitization libraries like DOMPurify when HTML rendering is necessary, and Content-Security-Policy headers to restrict script execution as a defense-in-depth measure.

```javascript
// BAD: directly inserting user input
element.innerHTML = userInput; // XSS vulnerability!

// GOOD: use textContent for plain text
element.textContent = userInput;

// GOOD: sanitize HTML with DOMPurify
import DOMPurify from "dompurify";
element.innerHTML = DOMPurify.sanitize(userInput);

// GOOD: use Content-Security-Policy header
// Content-Security-Policy: default-src 'self'; script-src 'self'
```

The `textContent` approach escapes all HTML, making it impossible for injected markup to be interpreted as code. When rich HTML is required (for example, in a blog editor that supports bold and italic text), DOMPurify strips dangerous elements and attributes while preserving safe formatting. The Content-Security-Policy header provides an additional layer by instructing the browser to refuse to execute inline scripts, even if they somehow make it into the page.

## When to use

- When building any web application that displays user-supplied content, regardless of how trustworthy the user base appears.
- When rendering dynamic content from databases, URL parameters, or third-party APIs that could contain untrusted markup.
- When implementing rich text editors, comment systems, or any feature that accepts and displays formatted user input.
- When developing single-page applications that manipulate the DOM directly based on data from API responses.

## When to avoid

- XSS protection should never be skipped. There is no scenario where it is appropriate to render untrusted input without sanitization. The "when to avoid" consideration applies only to specific defense mechanisms.
- Avoid overly aggressive sanitization that strips legitimate content (such as code examples in a developer documentation site) when a more targeted approach like output encoding would suffice.
- Avoid relying solely on Content-Security-Policy without also implementing input sanitization, since CSP is a mitigation layer, not a complete solution.
- Avoid client-side-only sanitization without server-side validation, since attackers can bypass client-side controls entirely.

## Trade-offs

- **Security vs. functionality**: Strict sanitization can strip legitimate HTML formatting that users need, requiring careful allowlist configuration to balance safety with usability.
- **CSP strictness vs. third-party integrations**: A tight Content-Security-Policy blocks inline scripts and unauthorized sources but can break analytics, chat widgets, and other third-party embeds that rely on inline code.
- **Performance vs. thoroughness**: Running every piece of user content through a sanitization library adds processing time, though for most applications this overhead is negligible.

## Common small mistakes

- Sanitizing input on submission but not on output, which fails to protect against stored XSS when data entered before sanitization was implemented is later displayed.
- Using `innerHTML` for convenience when `textContent` would be sufficient and far safer.
- Relying on simple string replacement (like escaping `<script>` tags) instead of comprehensive sanitization, missing vectors like event handler attributes (`onerror`, `onload`) and JavaScript URIs.
- Forgetting to set the `Content-Security-Policy` header, leaving no defense-in-depth if a sanitization mistake is introduced.
- Trusting data from your own API without sanitization, assuming that because the data passed through your server, it is safe, when it may have been submitted by an attacker.
