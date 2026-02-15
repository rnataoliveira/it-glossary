---
title: "Auto-Scaling"
letter: "A"
categories:
  - "cloud"
  - "performance"
shortDefinition: "A cloud mechanism that automatically adjusts the number of compute resources based on real-time demand to maintain performance and optimize cost."
---

## Why does it exist?

Fixed-capacity infrastructure forces you to choose between over-provisioning (paying for idle resources during low traffic) and under-provisioning (degraded performance or outages during traffic spikes). Auto-scaling solves this by continuously monitoring metrics like CPU utilization, memory usage, request latency, or queue depth, and automatically adding or removing instances or containers to match current demand. This keeps response times stable during peak loads while reducing costs during quiet periods.

Cloud providers and orchestration platforms like Kubernetes have built-in auto-scaling capabilities that handle the mechanics of launching new instances, registering them with load balancers, and draining traffic from instances being terminated.

## Practical example of use

A food delivery platform experiences predictable traffic spikes during lunch and dinner hours, plus unpredictable surges during sporting events. Their backend API runs on Kubernetes with a Horizontal Pod Autoscaler (HPA) that watches average CPU utilization across pods. When CPU crosses 70%, the HPA adds more replicas. When it drops below 40%, it removes them. The cluster itself uses a node autoscaler to provision or terminate underlying VMs as pod demand changes.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: order-api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-api
  minReplicas: 3
  maxReplicas: 50
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
        - type: Pods
          value: 4
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 2
          periodSeconds: 120
```

## When to use

- When your application experiences variable traffic patterns — daily cycles, seasonal peaks, or unpredictable surges
- When you want to optimize cloud costs by not paying for idle capacity during low-demand periods
- When your application is stateless and can handle instances being added or removed without session loss
- When combined with load balancing to distribute traffic evenly across a dynamic pool of instances

## When to avoid

- When your application is stateful and cannot tolerate instances being terminated without complex coordination
- When cold start times are too long for new instances to become useful before the traffic spike subsides
- When the workload is steady and predictable enough that fixed capacity is simpler and cheaper
- When your database or downstream dependencies cannot handle the increased load from scaled-up application instances

## Trade-offs

- **Cost optimization vs. response lag**: Scaling takes time — new instances need to start, pass health checks, and warm up. During that window, existing instances bear the extra load.
- **Simplicity vs. accuracy**: Scaling on CPU alone is simple but may not reflect actual user-facing performance. Custom metrics (request latency, queue depth) are more accurate but require more instrumentation.
- **Aggressive scaling vs. flapping**: Setting sensitive thresholds means faster response to spikes but risks rapid scale-up/scale-down oscillation that wastes resources and destabilizes the system.

## Common small mistakes

- Setting min replicas to 1, which means a single failure takes down the service before scaling can react
- Not configuring scale-down stabilization windows, causing the system to remove capacity too quickly after a brief dip
- Forgetting that auto-scaling the application tier does not auto-scale the database — the database becomes the bottleneck
- Using only CPU as the scaling metric when the application is I/O-bound, resulting in scaling that never triggers
- Not load-testing to verify that the auto-scaling configuration actually works before relying on it in production
