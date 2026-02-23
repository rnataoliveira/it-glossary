---
title: "Chain of Responsibility"
letter: "C"
categories:
  - "design-patterns"
shortDefinition: "A behavioral pattern that passes a request along a chain of handlers, where each handler decides to process the request or forward it to the next handler."
---

## Why does it exist?

When multiple objects might handle a request, and the appropriate handler is not known at design time, hardcoding the routing logic tightly couples the sender to every potential handler. Chain of Responsibility decouples sender from receiver by letting the request travel through a sequence of handlers. Each handler checks whether it should process the request and either handles it or passes it on — the sender only knows about the first handler in the chain.

## Practical example of use

An HTTP middleware pipeline where each middleware either handles the request or passes it to the next handler.

```ts
type Handler = (req: { path: string; user?: string }, next: () => void) => void;

function authMiddleware(req: { path: string; user?: string }, next: () => void) {
  if (req.path.startsWith("/admin") && !req.user) {
    console.log("Unauthorized");
    return;
  }
  next();
}

function loggingMiddleware(req: { path: string }, next: () => void) {
  console.log(`Request: ${req.path}`);
  next();
}

function finalHandler(req: { path: string }, _next: () => void) {
  console.log(`Handled: ${req.path}`);
}

function buildChain(handlers: Handler[]) {
  return (req: { path: string; user?: string }) => {
    let index = 0;
    const next = () => {
      if (index < handlers.length) handlers[index++](req, next);
    };
    next();
  };
}

const handle = buildChain([loggingMiddleware, authMiddleware, finalHandler]);
handle({ path: "/admin", user: "alice" });
```

## When to use

- When more than one object may handle a request and the handler is not known a priori
- When you want to issue a request to one of several objects without specifying the receiver explicitly
- When the set of handlers should be configurable at runtime or vary by context
- When building middleware, event handling pipelines, or request processing workflows

## When to avoid

- When a request must always be handled — a chain with no default handler at the end silently drops requests
- When the chain is long and the request must travel many hops, creating performance overhead
- When the routing logic is simple and a simple conditional or strategy would be clearer

## Trade-offs

- **Flexibility vs. guaranteed handling**: The chain can be reconfigured at runtime, but there is no compile-time guarantee that any handler will process a given request.
- **Loose coupling vs. debugging difficulty**: Senders and receivers are decoupled, but tracing which handler processed a request requires understanding the entire chain at runtime.
- **Extensibility vs. ordering sensitivity**: Adding or reordering handlers is easy, but subtle bugs can arise when handler order matters and that constraint is not enforced.

## Common small mistakes

- Not providing a default handler at the end of the chain, causing requests to be silently swallowed
- Designing handlers that do both processing and forwarding in ways that make it unclear when forwarding stops
- Creating chains where the order of handlers is critical but undocumented, leading to hard-to-debug ordering bugs
- Making the chain a linked list of objects when a simple array of handler functions is clearer
