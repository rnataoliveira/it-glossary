---
title: "Cloud Native"
letter: "C"
categories:
  - "cloud"
  - "architecture"
shortDefinition: "An approach to building and running applications that fully exploits the advantages of cloud computing such as containers, microservices, and declarative APIs."
---

## Why does it exist?

Traditional applications were designed to run on a single server or a small cluster with manual scaling and deployment. When organizations moved these applications to the cloud, they often just lifted and shifted them onto virtual machines, gaining little benefit beyond not owning hardware. Cloud native emerged as a philosophy and set of practices to build applications that are designed from the ground up to leverage elastic infrastructure, automated deployment pipelines, and resilient distributed architectures.

The Cloud Native Computing Foundation (CNCF) formalizes this approach around containers, service meshes, microservices, immutable infrastructure, and declarative APIs. Together, these techniques enable loosely coupled systems that are resilient, manageable, and observable, allowing engineers to make high-impact changes frequently with minimal toil.

## Practical example of use

An e-commerce company redesigns its monolithic order processing system as a cloud native application. Each bounded context — catalog, cart, payment, fulfillment — becomes an independent microservice packaged in a container. Kubernetes orchestrates these containers across nodes, automatically restarting failed pods and scaling replicas based on CPU usage. A CI/CD pipeline builds container images on every merge, runs integration tests, and rolls out changes using a canary deployment strategy. Observability is built in from day one with structured logging, distributed tracing via OpenTelemetry, and Prometheus metrics. When Black Friday traffic spikes, the system scales horizontally without manual intervention.

## When to use

- When building new applications that need to scale elastically and deploy frequently
- When your team has adopted containers and orchestration tooling like Kubernetes
- When you need resilience through redundancy, automated failover, and self-healing infrastructure
- When your organization is committed to DevOps culture with CI/CD, infrastructure as code, and shared ownership

## When to avoid

- When the application is simple enough that a single server or a managed PaaS handles it without operational burden
- When the team lacks experience with distributed systems and the debugging complexity they introduce
- When the project has a short lifespan or is a prototype where operational sophistication adds no business value
- When regulatory constraints require you to run on fixed, audited infrastructure that cannot be dynamically orchestrated

## Trade-offs

- **Resilience vs. complexity**: Distributing workloads across many containers and services increases fault tolerance but introduces networking, observability, and debugging challenges that monoliths do not have.
- **Deployment speed vs. tooling investment**: Cloud native enables rapid, automated deployments, but it requires significant upfront investment in CI/CD pipelines, container registries, orchestration platforms, and developer training.
- **Portability vs. pragmatism**: Designing for cloud portability using open standards (OCI containers, Kubernetes APIs) is possible but often conflicts with using managed cloud services that accelerate delivery at the cost of vendor coupling.

## Common small mistakes

- Equating "cloud native" with "running on Kubernetes" — cloud native is a set of principles, not a specific tool
- Adopting microservices prematurely before the team understands service boundaries, leading to a distributed monolith
- Ignoring observability until production issues arise, making it nearly impossible to debug cross-service failures
- Treating containers as lightweight VMs by running multiple processes inside a single container instead of one process per container
- Skipping chaos engineering and resilience testing, then discovering single points of failure during real incidents
