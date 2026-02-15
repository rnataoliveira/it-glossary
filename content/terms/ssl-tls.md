---
title: "SSL/TLS"
letter: "S"
categories:
  - "improve-reliability"
  - "improve-security"
shortDefinition: "Cryptographic protocols that encrypt data in transit between clients and servers, ensuring privacy and integrity."
---

## Why does it exist?

In the early web, all HTTP traffic was sent in plaintext — anyone on the network path (ISPs, Wi-Fi operators, attackers) could read passwords, credit card numbers, and personal data. SSL was created by Netscape in 1995 to encrypt communication between browsers and servers. It evolved into TLS, which is the modern standard. TLS ensures that data in transit is encrypted, the server's identity is verified via certificates, and messages cannot be tampered with without detection.

## Practical example of use

A user visits `https://bank.example.com` to check their account balance. The browser initiates a TLS 1.3 handshake: it verifies the server's certificate (issued by Let's Encrypt and chained to a trusted root CA), negotiates a cipher suite, and establishes a shared session key — all within one round trip. From that point, every byte exchanged (login credentials, account data, session cookies) is encrypted. Even if an attacker intercepts the traffic on a public Wi-Fi network, they see only opaque ciphertext.

## When to use

- Every production web application — TLS is no longer optional; browsers flag HTTP sites as "Not Secure" and search engines penalize them
- API communication between services, especially across network boundaries or public clouds
- Database connections that traverse untrusted networks (e.g., an application server connecting to a managed database over the internet)
- Email servers (STARTTLS), MQTT for IoT, and any protocol that transmits sensitive data

## When to avoid

- Purely internal communication within a trusted, isolated network segment where the performance overhead is measurable and security policies allow plaintext (rare and increasingly discouraged)
- Local development environments where self-signed certificate warnings create friction — use tools like `mkcert` to generate locally trusted certs instead of disabling TLS
- Between sidecar proxies in a service mesh (e.g., Istio with mTLS) where encryption is already handled at the mesh layer — doubling encryption adds latency with no security benefit

## Trade-offs

- **Security vs. latency**: Encryption protects data, but the TLS handshake adds 1-2 round trips (TLS 1.2) or 1 round trip (TLS 1.3) to the initial connection, plus CPU cost for cryptographic operations.
- **Trust via certificates vs. operational burden**: Certificates verify server identity, but they expire and must be renewed — automated tools like Let's Encrypt and cert-manager reduce this burden significantly.
- **End-to-end encryption vs. inspection difficulty**: Encrypted traffic prevents eavesdropping, but it also prevents legitimate network monitoring, requiring TLS termination at load balancers or dedicated inspection proxies.

## Common small mistakes

- Letting certificates expire in production because no automated renewal or monitoring is in place, causing outages and browser warnings
- Using outdated TLS versions (TLS 1.0 or 1.1) or weak cipher suites that are vulnerable to known attacks like POODLE or BEAST
- Terminating TLS at the load balancer but sending plaintext traffic between the load balancer and backend servers over an untrusted network
- Not enabling HSTS (HTTP Strict Transport Security), allowing the first request to be made over HTTP and exposing it to downgrade attacks
