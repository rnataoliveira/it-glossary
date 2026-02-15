---
title: "Canary Deployment"
letter: "C"
categories:
  - "devops"
  - "reliability"
shortDefinition: "A deployment strategy that rolls out a new version to a small subset of users or traffic first, monitors for errors, and gradually increases exposure before full rollout."
---

## Why does it exist?

No matter how thorough testing is, some bugs only appear under real production conditions: unexpected data patterns, subtle performance regressions, or integration issues with live third-party services. Deploying a new version to every user simultaneously means that if something goes wrong, everyone is affected. Canary deployments reduce this blast radius by directing a small percentage of traffic to the new version while the majority continues using the stable release.

The name comes from the historical practice of bringing canaries into coal mines; if the canary showed signs of distress, miners knew the air was unsafe. Similarly, if the canary deployment shows elevated error rates, increased latency, or abnormal behavior, the team can halt the rollout and route all traffic back to the stable version. This approach gives teams confidence to ship more frequently because the cost of a bad release is contained to a small percentage of users rather than the entire user base.

## Practical example of use

A team is releasing version 2.0 of their API. Instead of switching all traffic at once, they configure a service mesh to send 5% of requests to the new version and 95% to the stable version. The team monitors error rates, response times, and business metrics for the canary. If everything looks healthy after an observation period, they gradually shift traffic to 25%, then 50%, then 100%. If the canary shows problems at any stage, traffic is shifted entirely back to the stable version.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-app
spec:
  hosts: [my-app]
  http:
    - route:
        - destination:
            host: my-app
            subset: stable
          weight: 95
        - destination:
            host: my-app
            subset: canary
          weight: 5
```

This Istio VirtualService splits traffic between the stable and canary subsets. The weights can be adjusted incrementally as confidence grows. Paired with monitoring dashboards and automated rollback rules, this configuration enables safe, progressive delivery.

## When to use

- You want to validate a new release under real production traffic before exposing all users to it, especially for changes that are difficult to test fully in staging.
- The application has well-defined health metrics (error rates, latency percentiles, business KPIs) that can be monitored in real time to decide whether to proceed or roll back.
- Your infrastructure supports traffic splitting at the load balancer, service mesh, or CDN level (Istio, Envoy, AWS ALB, Kubernetes Ingress controllers).
- You ship frequently and want a safety net that limits the blast radius of any individual release to a controlled percentage of users.

## When to avoid

- The application does not have observable health metrics or monitoring in place; without data to compare canary vs. stable behavior, the deployment is canary in name only.
- Database schema changes are involved that are not backward compatible; both the canary and stable versions must be able to operate against the same database simultaneously.
- Traffic cannot be meaningfully split, such as batch processing jobs, background workers, or single-tenant deployments where there is only one instance.
- The team is not prepared to monitor the canary during the rollout window; an unmonitored canary provides a false sense of safety.

## Trade-offs

- **Safety vs. speed**: Gradually shifting traffic reduces risk, but a full canary rollout with multiple observation stages takes longer than a simple all-at-once deployment.
- **Confidence vs. complexity**: Canary deployments add infrastructure requirements (traffic splitting, metric comparison, automated rollback) that increase the complexity of the deployment pipeline.
- **Coverage vs. statistical significance**: A 5% canary may not receive enough traffic to surface rare bugs; increasing the percentage improves detection but also increases the number of users affected if something goes wrong.

## Common small mistakes

- Running the canary for too short a period, missing bugs that only manifest under sustained load or during specific time-of-day patterns.
- Comparing canary metrics to historical averages instead of the concurrent stable version, which can be misleading if overall traffic patterns change between the two time periods.
- Forgetting that both canary and stable versions must coexist against the same data stores, caches, and APIs, and failing to ensure backward compatibility.
- Not automating the rollback; relying on a human to notice problems and manually reroute traffic introduces delay during incidents.
- Canary testing only the happy path while ignoring error paths, edge cases, and downstream dependency behavior that differ between versions.
