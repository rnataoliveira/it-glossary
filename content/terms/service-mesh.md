---
title: "Service Mesh"
letter: "S"
categories:
  - "architecture"
  - "devops"
shortDefinition: "A dedicated infrastructure layer that handles service-to-service communication, providing observability, security, and traffic management."
---

## Why does it exist?

When an organization runs dozens or hundreds of microservices, every service needs the same cross-cutting capabilities: mutual TLS, retries, circuit breaking, load balancing, and distributed tracing. Implementing these concerns in each service's application code leads to inconsistency and duplication. A service mesh was created to extract this logic into a transparent infrastructure layer — typically a sidecar proxy deployed alongside each service — so that communication policies are enforced uniformly without changing application code.

## Practical example of use

A fintech company runs 60 microservices on Kubernetes. They deploy Istio as their service mesh. Each pod gets an Envoy sidecar proxy injected automatically. With a single configuration change, the platform team enables mutual TLS between all services, eliminating the need for each team to manage their own certificates. They configure retry policies so that transient 503 errors are retried twice before propagating. Traffic splitting routes 5% of requests to a canary deployment of the Payment Service. The observability dashboard shows request latency, error rates, and a full service topology map — all without any application code changes.

## When to use

- You operate a large number of microservices and need uniform security, observability, and traffic policies
- You want mutual TLS, retries, and circuit breaking without embedding these concerns in application code
- Your platform team needs centralized control over traffic routing for canary deployments, A/B testing, or blue-green rollouts
- Debugging cross-service latency issues requires distributed tracing that is difficult to instrument manually

## When to avoid

- You have a small number of services (fewer than five) where the overhead of a mesh is not justified
- Your team lacks Kubernetes or container orchestration expertise to operate the mesh infrastructure
- The added latency of sidecar proxies is unacceptable for ultra-low-latency use cases

## Trade-offs

- **Uniform policies vs. operational complexity**: Every service gets consistent security and observability, but the mesh control plane and sidecar proxies are significant infrastructure to deploy, upgrade, and debug.
- **Application simplicity vs. infrastructure overhead**: Developers no longer implement retries or TLS in their code, but each sidecar consumes CPU and memory, increasing resource costs.
- **Centralized traffic control vs. added latency**: Fine-grained traffic management is powerful, but every request passes through an additional proxy hop, adding 1-3ms of latency per call.

## Common small mistakes

- Adopting a service mesh before the team has operational maturity with Kubernetes, leading to debugging nightmares when the mesh itself misbehaves
- Not setting resource limits on sidecar proxies, allowing them to consume significant cluster resources unnoticed
- Relying entirely on the mesh for retries without making services idempotent, which causes duplicate processing on retried requests
- Neglecting to monitor the mesh control plane itself — if it goes down, sidecar configurations stop updating and routing rules become stale
