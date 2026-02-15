---
title: "Environment Variables"
letter: "E"
categories:
  - "devops"
  - "security"
shortDefinition: "Key-value pairs set outside the application code that configure its behavior across different environments without changing the source."
---

## Why does it exist?

Applications need configuration that changes between environments: database URLs for development vs. production, API keys for different providers, feature flags, and debug settings. Hardcoding these values into the source code creates several problems: secrets end up in version control, deploying to a new environment requires a code change, and running the same application in different contexts (local development, staging, production) demands separate builds.

Environment variables solve this by externalizing configuration. The application reads values from the operating system's environment at runtime, and each environment (your laptop, a CI server, a Kubernetes pod) sets different values. The same binary or container image works everywhere -- only the environment variables change. This is Factor III of the Twelve-Factor App methodology and a foundational practice for secure, portable deployments.

## Practical example of use

A Node.js API needs a database connection string, an API key for a payment provider, and a port number. In development, these are loaded from a `.env` file. In production, they are injected by the container orchestrator.

```typescript
// .env (local development only -- NEVER commit this file)
// DATABASE_URL=postgresql://dev:devpass@localhost:5432/myapp
// PAYMENT_API_KEY=sk_test_abc123
// PORT=3000

import "dotenv/config"; // loads .env file in development

interface AppConfig {
  databaseUrl: string;
  paymentApiKey: string;
  port: number;
}

function loadConfig(): AppConfig {
  const databaseUrl = process.env.DATABASE_URL;
  const paymentApiKey = process.env.PAYMENT_API_KEY;
  const port = parseInt(process.env.PORT || "3000", 10);

  if (!databaseUrl) {
    throw new Error("Missing required env var: DATABASE_URL");
  }
  if (!paymentApiKey) {
    throw new Error("Missing required env var: PAYMENT_API_KEY");
  }

  return { databaseUrl, paymentApiKey, port };
}

const config = loadConfig();

console.log(`Server starting on port ${config.port}`);
// Use config.databaseUrl and config.paymentApiKey throughout the app
```

```bash
# .gitignore -- always exclude .env files
.env
.env.local
.env.production
```

In production (e.g., Kubernetes), the variables are injected without any `.env` file:

```yaml
# k8s deployment snippet
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: database-url
  - name: PAYMENT_API_KEY
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: payment-api-key
  - name: PORT
    value: "8080"
```

## When to use

- Any configuration that differs between environments: connection strings, API keys, feature flags, log levels.
- Secrets that must not be stored in source code (passwords, tokens, private keys).
- Twelve-Factor applications designed for cloud and container deployment.
- CI/CD pipelines where build-time and runtime configuration must be injected dynamically.

## When to avoid

- Complex structured configuration (deeply nested objects, arrays) that is awkward to express as flat key-value pairs -- use a configuration file loaded from a mounted volume or a config service instead.
- Values that are truly constant and never change between environments (e.g., a mathematical constant) -- these belong in code.
- Secrets in highly regulated environments where environment variables in memory may be considered insufficient; use a dedicated secrets manager (Vault, AWS Secrets Manager) with short-lived credentials.

## Trade-offs

- **Simplicity vs. security**: Environment variables are easy to set, but they are visible in process listings, crash dumps, and container inspection commands, making them less secure than dedicated secrets managers.
- **Portability vs. discoverability**: Any platform supports env vars, but there is no built-in schema or documentation for which variables an application expects, leading to "missing env var" errors on first setup.
- **Flexibility vs. validation**: Environment variables are always strings, so your application must parse and validate them (convert to numbers, booleans, URLs), and missing or malformed values surface only at runtime.

## Common small mistakes

- Committing `.env` files to version control, exposing secrets in the repository history forever (even deleting the file later does not remove it from git history).
- Not validating environment variables at application startup, leading to cryptic errors minutes later when the missing value is first accessed.
- Using different variable names in development and production (e.g., `DB_URL` locally, `DATABASE_URL` in production), causing environment-specific bugs.
- Setting defaults for secrets (`const key = process.env.API_KEY || "default-key"`), which masks misconfiguration and can leak test credentials into production.
- Storing large values (certificates, JSON blobs) in environment variables instead of mounting them as files, hitting shell or OS length limits.
