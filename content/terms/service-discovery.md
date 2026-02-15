---
title: "Service Discovery"
letter: "S"
categories:
  - "devops"
  - "architecture"
shortDefinition: "A mechanism that allows services in a distributed system to automatically find and communicate with each other without hardcoded network addresses, typically through a central registry or DNS-based lookup."
---

## Why does it exist?

In monolithic applications, components communicate through in-process function calls, so there is no need to know network addresses. In distributed systems and microservices architectures, services run as independent processes across multiple hosts, containers, or pods. Their network locations change frequently due to scaling events, deployments, and failovers. Hardcoding IP addresses or hostnames in configuration files becomes unmanageable and brittle.

Service discovery automates the process of registering service instances when they start and deregistering them when they stop. Consumer services query the registry to find healthy instances of the service they need. This enables dynamic scaling, zero-downtime deployments, and resilient communication patterns because consumers always receive up-to-date information about where to send requests.

## Practical example of use

A team uses Consul for service discovery. Each service instance registers itself with Consul on startup, providing its name, port, and a health check endpoint. Consul periodically calls the health check and removes unhealthy instances from the registry.

```json
{
  "service": {
    "name": "payment-api",
    "port": 8080,
    "check": {
      "http": "http://localhost:8080/health",
      "interval": "10s",
      "timeout": "3s"
    },
    "tags": ["v2", "production"]
  }
}
```

Other services that need to call the payment API query Consul's DNS interface (e.g., `payment-api.service.consul`) or its HTTP API to get a list of healthy instances. Load balancing can happen client-side by randomly selecting from the returned addresses, or through Consul's built-in DNS round-robin. Tags like `v2` enable traffic routing to specific versions during canary deployments.

## When to use

- When running microservices or distributed systems where service instances are created and destroyed dynamically.
- When using container orchestration platforms like Kubernetes or Nomad where pod IPs are ephemeral.
- When implementing blue-green or canary deployment strategies that require routing traffic to specific service versions.
- When you need health-aware routing that automatically removes failing instances from the pool.

## When to avoid

- When your system consists of a small number of stable services with fixed, well-known addresses that rarely change.
- When you are running a monolithic application where all components share the same process and network stack.
- When your platform already provides built-in service discovery (such as Kubernetes DNS) and adding another layer would create redundancy.
- When the operational overhead of running a discovery cluster outweighs the benefits for your scale.

## Trade-offs

- **Automation vs. added infrastructure**: Service discovery removes manual configuration but requires running and maintaining a highly available registry cluster.
- **Freshness vs. stability**: Aggressive health check intervals detect failures quickly but can cause flapping if services are temporarily slow under load.
- **Client-side vs. server-side discovery**: Client-side discovery gives consumers more control and avoids an extra network hop, but couples them to the registry API. Server-side discovery (via a load balancer) is simpler for clients but adds latency and a potential bottleneck.

## Common small mistakes

- Setting health check intervals too long, causing stale entries that route traffic to crashed instances.
- Not implementing graceful deregistration on shutdown, leaving ghost entries in the registry until the next health check fails.
- Forgetting to handle the case where the discovery service itself is unavailable, leading to cascading failures.
- Using service discovery for configuration data it was not designed to hold, overloading the registry with non-discovery concerns.
- Ignoring DNS TTL caching on the client side, which can cause consumers to keep connecting to deregistered instances.
