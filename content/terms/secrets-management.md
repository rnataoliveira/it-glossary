---
title: "Secrets Management"
letter: "S"
categories:
  - "devops"
  - "security"
shortDefinition: "The practice of securely storing, accessing, rotating, and auditing sensitive credentials such as API keys, passwords, certificates, and tokens using dedicated tooling rather than embedding them in code or configuration files."
---

## Why does it exist?

Applications depend on credentials to connect to databases, call external APIs, and authenticate between services. Historically, developers stored these values in configuration files, environment variables baked into deployment scripts, or even hardcoded them in source code. This approach creates severe security risks: secrets end up in version control history, build logs, and container images where they can be discovered by anyone with repository or artifact access.

Secrets management tools solve this by providing a centralized, encrypted vault where credentials are stored and accessed programmatically at runtime. They enforce access control policies so that only authorized services and users can retrieve specific secrets, and they maintain audit logs that record every access event. Many solutions also support automatic rotation, reducing the window of exposure if a credential is compromised.

## Practical example of use

A team uses HashiCorp Vault to manage secrets for a Kubernetes-based application. They define a policy that grants the application read-only access to its secrets and configure Kubernetes authentication so that only the correct service account in the production namespace can retrieve them.

```hcl
# vault policy
path "secret/data/myapp/*" {
  capabilities = ["read"]
}

# Kubernetes auth method
vault write auth/kubernetes/role/myapp \
  bound_service_account_names=myapp \
  bound_service_account_namespaces=production \
  policies=myapp-policy \
  ttl=1h
```

With this configuration, the application pod authenticates to Vault using its Kubernetes service account token, receives a short-lived Vault token valid for one hour, and uses it to fetch database credentials or API keys on demand. No secret ever appears in a Kubernetes manifest or environment variable definition.

## When to use

- When your application needs credentials for databases, third-party APIs, or inter-service communication.
- When you operate in environments subject to compliance requirements like SOC 2, HIPAA, or PCI DSS that mandate credential auditing.
- When multiple teams or services share infrastructure and you need fine-grained access control over who can read which secrets.
- When you want to implement automatic credential rotation without redeploying applications.

## When to avoid

- When you are building a quick prototype or proof of concept that will never handle real user data or connect to production systems.
- When the overhead of running and maintaining a secrets management system outweighs the risk, such as a single-developer personal project with no sensitive data.
- When simpler platform-native solutions (like cloud provider secret stores with managed encryption) are sufficient and a full vault deployment adds unnecessary complexity.

## Trade-offs

- **Security vs. operational complexity**: A centralized vault greatly reduces secret sprawl but introduces a critical dependency that must itself be highly available, backed up, and secured.
- **Dynamic secrets vs. debugging difficulty**: Short-lived, dynamically generated credentials reduce exposure but make it harder to trace issues since credentials change frequently.
- **Centralization vs. single point of failure**: Consolidating all secrets in one system simplifies management but means that vault unavailability can block every service from starting.

## Common small mistakes

- Logging secret values in application logs or CI/CD pipeline output, negating the security benefits of vault storage.
- Setting excessively long TTLs on dynamic secrets, which defeats the purpose of short-lived credentials.
- Granting overly broad vault policies (like access to `secret/*` instead of scoping to the specific application path).
- Not configuring vault high availability, creating a single point of failure for all credential retrieval.
- Storing the vault unseal keys or root token in the same location as the secrets they protect.
