---
title: "Rolling Deployment"
letter: "R"
categories:
  - "devops"
shortDefinition: "A deployment strategy that incrementally replaces instances of the old version with the new version, ensuring the application remains available throughout the update."
---

## Why does it exist?

Taking an entire application offline to deploy a new version is unacceptable for most production systems. Users expect continuous availability, and downtime directly impacts revenue and trust. Rolling deployments solve this by updating instances one at a time (or in small batches) rather than all at once. At any point during the rollout, some instances run the old version and others run the new version, but the application as a whole remains available behind a load balancer.

This strategy has become the default deployment method in container orchestration platforms like Kubernetes. It strikes a balance between simplicity and safety: it does not require the additional infrastructure of blue-green deployments (duplicate environments) or the traffic-splitting complexity of canary deployments. The orchestrator handles draining connections from old pods, starting new ones, waiting for readiness checks, and proceeding only when the new instance is healthy.

## Practical example of use

A team runs a web application with six replicas on Kubernetes. When deploying version 2.0, the rolling update strategy creates up to two new pods at a time while ensuring no more than one pod is unavailable. Kubernetes waits for each new pod to pass its readiness probe before proceeding. If a new pod fails its health check, the rollout pauses automatically, preventing a bad version from fully replacing the good one.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 6
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2
      maxUnavailable: 1
  template:
    spec:
      containers:
        - name: web
          image: app:2.0.0
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
```

The `maxSurge: 2` setting allows Kubernetes to create up to two extra pods beyond the desired six during the rollout, and `maxUnavailable: 1` ensures at least five pods are always serving traffic. The readiness probe on `/health` gates when a new pod starts receiving requests.

## When to use

- You need zero-downtime deployments and your application can tolerate running two versions simultaneously behind a load balancer during the transition.
- The application is stateless or handles state externally (database, cache, session store), so any instance can serve any request regardless of version.
- You want a straightforward deployment strategy that is natively supported by Kubernetes and most container orchestrators without additional tooling.
- Rollbacks should be simple; Kubernetes can reverse a rolling update by rolling back to the previous ReplicaSet.

## When to avoid

- The new version introduces breaking changes to APIs, database schemas, or message formats that are incompatible with the old version; running both simultaneously will cause errors.
- You need precise control over which users see the new version (e.g., internal users first, then 5% of external traffic); a canary deployment with traffic splitting is more appropriate.
- The application requires all instances to be on the same version at all times, such as when distributed consensus or cluster coordination depends on version homogeneity.
- Rollout speed is critical and you prefer an instant switch; a blue-green deployment swaps traffic atomically rather than incrementally.

## Trade-offs

- **Availability vs. version consistency**: Rolling deployments keep the application available throughout, but during the transition, some requests hit the old version and others hit the new version, which can cause inconsistent behavior if the versions differ in response format or business logic.
- **Simplicity vs. rollback speed**: Rolling deployments are simpler to configure than blue-green or canary strategies, but rolling back also happens incrementally, which is slower than an instant traffic switch.
- **Resource efficiency vs. transition capacity**: Unlike blue-green deployments, rolling updates do not require a full duplicate environment, but `maxSurge` temporarily increases resource usage, and setting it too low prolongs the rollout.

## Common small mistakes

- Not defining a readiness probe, causing Kubernetes to route traffic to pods that have started but are not yet ready to handle requests, resulting in errors during the rollout.
- Setting `maxUnavailable` too high, which causes too many old pods to terminate before new ones are ready, reducing capacity below acceptable levels during the transition.
- Ignoring the need for backward-compatible database migrations; the old and new versions will query the same database simultaneously, so schema changes must work for both.
- Deploying without resource requests and limits, which can cause new pods to be scheduled on overloaded nodes and fail readiness checks, stalling the rollout.
- Not monitoring the rollout progress and missing a stalled deployment where new pods are crash-looping but the old pods are still serving traffic, masking the problem.
