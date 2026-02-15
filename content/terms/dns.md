---
title: "DNS"
letter: "D"
categories:
  - "devops"
  - "architecture"
shortDefinition: "The Domain Name System translates human-readable domain names into IP addresses so browsers can locate servers."
---

## Why does it exist?

The early internet required users to remember numeric IP addresses to reach any server. As the network grew, this became unmanageable. DNS was introduced in 1983 as a hierarchical, distributed naming system that maps human-friendly domain names like `example.com` to IP addresses like `93.184.216.34`. It acts as the internet's phone book, enabling users and services to find each other by name rather than number.

## Practical example of use

A user types `shop.example.com` into their browser. The browser checks its local cache, then queries a recursive DNS resolver (typically provided by the ISP or a service like Cloudflare's `1.1.1.1`). The resolver walks the DNS hierarchy — root server, then the `.com` TLD server, then `example.com`'s authoritative nameserver — which returns an A record pointing to `104.21.55.12`. The browser connects to that IP, and the page loads. The entire lookup takes around 20-50 ms and the result is cached for the duration specified by the record's TTL.

## When to use

- Any system that serves traffic over the internet — DNS is not optional, it is foundational
- Implementing failover and geographic routing using DNS-based load balancing (e.g., AWS Route 53 with health checks)
- Blue-green deployments where DNS records are updated to point traffic to the new environment
- Service discovery in hybrid or multi-cloud architectures using internal DNS zones

## When to avoid

- Sub-second failover requirements — DNS TTLs and client caching make instant switchovers unreliable
- Internal service-to-service communication in Kubernetes — use cluster DNS and service abstractions instead of managing records manually
- When you need sticky sessions or connection-level routing — DNS operates at the name resolution layer, not at the connection layer

## Trade-offs

- **Human-readable names vs. propagation delay**: Easy to remember and share, but DNS changes can take minutes to hours to propagate globally depending on TTL values and resolver caching.
- **Distributed resilience vs. attack surface**: The hierarchical design prevents a single point of failure, but DNS is vulnerable to cache poisoning, DDoS on authoritative servers, and hijacking attacks.
- **Simplicity vs. limited control**: DNS is universally supported with zero client-side setup, but it offers no awareness of server health or load at query time (unless combined with advanced services like Route 53 or NS1).

## Common small mistakes

- Setting TTLs too high before a migration, making rollback slow because clients cache the old IP for hours
- Forgetting to set up both A (IPv4) and AAAA (IPv6) records, leaving IPv6-only clients unable to connect
- Not monitoring DNS resolution times — a slow authoritative nameserver adds latency to every first connection
- Relying on a single DNS provider without a secondary, creating a single point of failure for all services
