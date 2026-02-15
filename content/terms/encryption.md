---
title: "Encryption (At Rest & In Transit)"
letter: "E"
categories:
  - "security"
shortDefinition: "The process of converting data into an unreadable format using cryptographic algorithms, applied both to stored data (at rest) and to data being transmitted over networks (in transit), to prevent unauthorized access."
---

## Why does it exist?

Data is vulnerable at two fundamental stages: when it is stored on disk and when it travels across networks. Without encryption at rest, anyone who gains physical or logical access to a storage device, database backup, or cloud storage bucket can read sensitive information directly. Without encryption in transit, attackers can intercept network traffic through techniques like man-in-the-middle attacks, packet sniffing on shared networks, or compromised routing infrastructure.

Encryption addresses both threats by making data unintelligible without the correct decryption key. At rest, encryption protects against stolen hard drives, unauthorized database access, and improperly decommissioned hardware. In transit, protocols like TLS ensure that even if traffic is intercepted, the attacker sees only ciphertext. Together, these two forms of encryption provide defense in depth, ensuring that data remains protected throughout its entire lifecycle.

## Practical example of use

A Node.js application serves sensitive financial data over HTTPS. The development team configures the server to use TLS 1.2 as the minimum protocol version and restricts the cipher suite to strong, modern algorithms. This ensures that all data transmitted between clients and the server is encrypted and that outdated, vulnerable protocol versions cannot be negotiated.

```javascript
const https = require("https");
const fs = require("fs");

const server = https.createServer(
  {
    key: fs.readFileSync("private-key.pem"),
    cert: fs.readFileSync("certificate.pem"),
    minVersion: "TLSv1.2",
    ciphers: "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256",
  },
  app
);
```

On the storage side, the team enables transparent data encryption (TDE) on their PostgreSQL database and configures their cloud storage buckets to use AES-256 server-side encryption with customer-managed keys. This ensures that database files and object storage contents are encrypted at rest without requiring application-level changes.

## When to use

- When storing personally identifiable information (PII), financial data, health records, or any other sensitive information in databases or file systems.
- When transmitting data over any network, including internal networks, since Zero Trust principles advise encrypting all traffic regardless of network trust level.
- When compliance regulations such as GDPR, HIPAA, PCI DSS, or SOC 2 mandate encryption of data at rest and in transit.
- When using cloud infrastructure where the physical security of storage media is managed by a third party and you need an additional layer of protection.

## When to avoid

- When encrypting data that is already public and non-sensitive, where the CPU overhead of encryption and decryption adds latency without any security benefit.
- When working with high-throughput, low-latency systems where encryption overhead is measurable and the data being processed has no confidentiality requirement.
- When the operational complexity of key management would exceed the team's capacity to manage it correctly, potentially leading to lost keys and inaccessible data.

## Trade-offs

- **Security vs. performance**: Encryption and decryption consume CPU cycles. While modern hardware acceleration (AES-NI) has minimized this cost, it can still be noticeable in extremely high-throughput scenarios.
- **Protection vs. key management burden**: Encryption is only as strong as the protection of its keys. Managing key rotation, access policies, and backup of encryption keys adds significant operational responsibility.
- **Compliance vs. complexity**: Meeting encryption requirements satisfies auditors but introduces complexity in debugging (encrypted logs are harder to inspect), backup management (keys must be backed up separately from data), and disaster recovery.

## Common small mistakes

- Storing encryption keys alongside the encrypted data, which means anyone who accesses the data also has the key to decrypt it.
- Using outdated protocols like TLS 1.0 or 1.1, or weak cipher suites, which provide a false sense of security while remaining vulnerable to known attacks.
- Encrypting data in transit but neglecting encryption at rest, or vice versa, leaving a gap in the data protection lifecycle.
- Hardcoding encryption keys in application source code or configuration files checked into version control.
- Failing to implement key rotation, meaning a single compromised key exposes all data encrypted over the entire lifetime of the system.
