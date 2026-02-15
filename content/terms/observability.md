---
title: "Observability"
letter: "O"
categories:
  - "reliability"
  - "devops"
shortDefinition: "The ability to understand a system's internal state by examining its outputs — logs, metrics, and traces."
---

## Why does it exist?

Modern distributed systems are complex. When something goes wrong, you cannot just attach a debugger. Observability gives you the tools to ask arbitrary questions about your system's behavior using three pillars: logs (what happened), metrics (how much), and traces (the path of a request across services).

## Practical example of use

A user reports slow checkout. The team checks metrics dashboards and sees elevated latency in the Payment Service. They use distributed tracing (Jaeger) to find that a specific payment provider API is timing out. Logs confirm the provider is returning 503 errors. The team enables a fallback provider within minutes.

## When to use

- Any production system, especially distributed architectures
- When you need to diagnose issues without reproducing them locally
- Systems with SLAs or uptime requirements
- When debugging requires understanding cross-service request flows

## When to avoid

- Local development environments (standard debugging tools are fine)
- Throwaway prototypes that will never see production traffic

## Trade-offs

- **Visibility vs. cost**: More data (logs, metrics, traces) gives better insights but increases storage and processing costs.
- **Detail vs. noise**: Too many logs make it harder to find relevant information.
- **Performance impact**: Instrumentation adds overhead, especially heavy tracing.

## Common small mistakes

- Only adding logging after an incident (observability should be built in from the start)
- Logging sensitive data (PII, passwords, tokens)
- Not correlating logs across services (missing request IDs or trace IDs)
- Collecting metrics but never setting up alerts
- Treating observability as just logging — ignoring metrics and traces
