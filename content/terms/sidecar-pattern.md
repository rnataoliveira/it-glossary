---
title: "Sidecar Pattern"
letter: "S"
categories:
  - "architecture"
  - "devops"
shortDefinition: "A deployment pattern where a helper container runs alongside the main application container in the same pod to handle cross-cutting concerns."
---

## Why does it exist?

Microservices often need capabilities that are not part of their core business logic: logging, monitoring, TLS termination, request retrying, circuit breaking, and configuration syncing. Embedding these concerns into every service creates duplication, tight coupling to specific libraries, and forces every team to implement the same infrastructure logic in their language of choice.

The Sidecar Pattern addresses this by extracting cross-cutting concerns into a separate process (the sidecar) that runs alongside the main application. In container orchestration platforms like Kubernetes, the sidecar is a second container in the same pod, sharing the same network namespace and lifecycle. The main application communicates with the sidecar over localhost, and the sidecar handles everything else -- the application code stays focused on business logic.

## Practical example of use

A team runs a Python API that needs mTLS encryption, distributed tracing, and automatic retries when calling other services. Instead of integrating an Envoy library into the Python code, they deploy an Envoy proxy as a sidecar. All outbound traffic from the Python app goes to `localhost:15001`, where Envoy handles TLS, adds trace headers, and retries failed requests. The Python code simply makes plain HTTP calls.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: order-service
  labels:
    app: order-service
spec:
  containers:
    # Main application container
    - name: order-api
      image: myregistry/order-api:1.4.0
      ports:
        - containerPort: 8080
      env:
        - name: UPSTREAM_BASE_URL
          value: "http://localhost:15001"  # traffic goes through sidecar

    # Sidecar container
    - name: envoy-proxy
      image: envoyproxy/envoy:v1.28-latest
      ports:
        - containerPort: 15001
      volumeMounts:
        - name: envoy-config
          mountPath: /etc/envoy
      args: ["-c", "/etc/envoy/envoy.yaml"]

  volumes:
    - name: envoy-config
      configMap:
        name: order-service-envoy-config
```

The order API team writes zero networking code. When the platform team updates retry policies or TLS certificates, they update the Envoy ConfigMap -- no redeployment of the application container is needed.

## When to use

- You need to add infrastructure concerns (mTLS, tracing, logging, rate limiting) to services written in multiple languages without duplicating library integrations.
- Your organization uses a service mesh (Istio, Linkerd) that automatically injects sidecar proxies.
- You want to decouple the lifecycle of infrastructure components from the application -- updating the sidecar should not require rebuilding the app.
- A third-party tool (log forwarder, config agent, secret injector) needs to run alongside the application and share its network or filesystem.

## When to avoid

- Your application is a simple, standalone service where the overhead of an extra container is not justified.
- Latency is extremely critical and the extra network hop through localhost to the sidecar is unacceptable (rare, but possible in ultra-low-latency systems).
- You are running in an environment that does not support multi-container pods or multi-process orchestration.
- The cross-cutting concern is trivially handled by a language-native library that is already well integrated.

## Trade-offs

- **Separation of concerns vs. resource overhead**: The sidecar keeps the app clean, but every pod now runs an extra container consuming CPU, memory, and startup time.
- **Language agnosticism vs. debugging complexity**: One sidecar works for all languages, but debugging now involves correlating logs and traces across two containers in the same pod.
- **Centralized policy updates vs. version drift**: The platform team can update sidecar configuration globally, but different pods may run different sidecar versions if rollouts are not coordinated.

## Common small mistakes

- Forgetting that containers in a pod share the network namespace but not the filesystem by default -- volumes must be explicitly shared.
- Not setting resource requests and limits on the sidecar, leading to the sidecar starving the main container (or vice versa).
- Ignoring sidecar startup order: the main app may start making requests before the sidecar is ready, causing early failures. Kubernetes 1.28+ supports native sidecar containers with `restartPolicy: Always` in init containers to address this.
- Over-relying on sidecars for logic that belongs in the application, such as business validation or data transformation.
- Running too many sidecars in a single pod (log forwarder, proxy, secret agent, config watcher), turning the pod into a heavyweight unit that is hard to reason about.
