---
title: "Kubernetes"
letter: "K"
categories:
  - "create-system-design"
  - "improve-reliability"
  - "improve-scalability"
shortDefinition: "An open-source container orchestration platform that automates deployment, scaling, and management of containerized applications."
---

## Why does it exist?

Running a handful of containers manually is manageable, but coordinating hundreds across multiple servers is not. Kubernetes was created to automate the placement, scaling, health monitoring, and networking of containerized workloads. It provides a declarative model where you describe the desired state of your system, and the platform continuously works to make reality match that description.

## Practical example of use

An e-commerce company deploys its checkout service as a Kubernetes Deployment with 3 replicas. They define a Horizontal Pod Autoscaler that adds pods when CPU exceeds 70%. During a flash sale, traffic spikes and Kubernetes automatically scales the checkout service from 3 to 12 pods in under a minute. A Service resource load-balances traffic across all healthy pods. When the sale ends, Kubernetes scales back down to 3 pods, reducing compute costs.

## When to use

- When managing tens or hundreds of containerized services that need automated scheduling and scaling
- When you need self-healing infrastructure that restarts failed containers and reschedules them to healthy nodes
- When deploying across multiple availability zones or regions for high availability
- When teams need standardized deployment workflows through declarative YAML manifests

## When to avoid

- For a single application or a small number of services where a simpler tool like Docker Compose or a managed PaaS suffices
- When the team lacks operational experience with distributed systems and there is no dedicated platform team
- When the project is a prototype or proof of concept that does not justify the setup and maintenance cost

## Trade-offs

- **Automation vs. complexity**: Kubernetes handles scaling, rolling updates, and self-healing automatically, but its learning curve is steep and misconfiguration can cause outages.
- **Flexibility vs. operational burden**: You can run any workload with fine-grained control, but you own responsibility for cluster upgrades, networking policies, and security patches (unless using a managed service like EKS, GKE, or AKS).
- **Standardization vs. overhead**: A unified deployment model across all services improves consistency, but the abstraction layers (pods, services, ingresses, config maps) add cognitive overhead for developers.

## Common small mistakes

- Not setting resource requests and limits on pods, leading to noisy-neighbor problems or out-of-memory kills
- Using `latest` as the image tag in deployments, making rollbacks impossible and builds non-reproducible
- Skipping liveness and readiness probes, so Kubernetes cannot detect or route around unhealthy containers
- Storing configuration and secrets directly in deployment manifests instead of using ConfigMaps and Secrets resources
