---
title: "Load Balancing"
letter: "L"
categories:
  - "architecture"
  - "performance"
shortDefinition: "Distributing incoming network traffic across multiple servers to ensure no single server is overwhelmed."
---

## Why does it exist?

A single server has finite capacity. Load balancing distributes requests across multiple servers, ensuring better resource utilization, higher throughput, and fault tolerance. If one server fails, the load balancer routes traffic to healthy servers, preventing downtime.

## Practical example of use

A web application runs on three identical servers behind an Nginx load balancer. The load balancer uses round-robin to distribute incoming HTTP requests. Health checks run every 10 seconds — if a server stops responding, it is removed from the pool until it recovers.

## When to use

- High-traffic applications that exceed single-server capacity
- When you need high availability and fault tolerance
- Horizontal scaling setups with multiple identical instances
- Microservice architectures where services have multiple replicas

## When to avoid

- Single-server applications with low traffic
- When requests must always go to the same server (unless you use sticky sessions)
- Development or staging environments where simplicity is preferred

## Trade-offs

- **Availability vs. complexity**: Load balancing improves uptime but adds infrastructure to manage.
- **Stateless vs. stateful**: Works best with stateless applications. Stateful apps need sticky sessions or externalized state.
- **Algorithms**: Round-robin is simple but does not account for server load. Least-connections is smarter but more complex.

## Common small mistakes

- Not configuring health checks, so traffic goes to dead servers
- Using sticky sessions as a crutch instead of making the application stateless
- Not considering SSL termination (where does TLS end?)
- Forgetting that the load balancer itself can become a single point of failure
- Ignoring connection draining during deployments
