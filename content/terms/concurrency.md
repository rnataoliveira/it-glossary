---
title: "Concurrency"
letter: "C"
categories:
  - "avoid-state-bugs"
  - "improve-performance"
  - "back-end-applications"
shortDefinition: "The ability of a system to handle multiple tasks in overlapping time periods, not necessarily simultaneously."
---

## Why does it exist?

Real-world software constantly deals with tasks that involve waiting — network requests, disk I/O, user input, database queries. Without concurrency, a program would sit idle during each wait, wasting time and compute resources. Concurrency exists to let programs make progress on multiple tasks during these idle periods, improving throughput and responsiveness. It is distinct from parallelism: concurrency is about structuring work to overlap, while parallelism is about executing work at the exact same instant on multiple cores.

## Practical example of use

A web server receives 500 incoming HTTP requests per second. Each request queries a database (taking ~50ms of waiting) and then formats a response. Without concurrency, the server processes one request at a time, handling at most 20 requests per second. With concurrency — using async I/O or a thread pool — the server starts processing new requests while others are waiting on database responses. The same single-core machine can now handle hundreds of requests per second because it uses wait time productively instead of blocking.

## When to use

- When your application performs I/O-bound work like HTTP calls, file reads, or database queries and you want to overlap the waiting periods
- When building servers or event-driven systems that must handle many simultaneous connections
- When you need a responsive UI that does not freeze while performing background computations or fetching data
- When orchestrating multiple independent tasks that can be structured as coroutines, threads, or message-passing actors

## When to avoid

- When the task is purely CPU-bound on a single core with no I/O waits — concurrency adds overhead without improving throughput in this case
- When the shared state is so deeply interleaved that correct synchronization becomes harder to maintain than the performance gain justifies
- When the workload is simple, sequential, and fast enough that the added complexity of concurrent code provides no measurable benefit

## Trade-offs

- **Throughput vs. Complexity**: Concurrent code can dramatically improve throughput for I/O-bound workloads, but introduces race conditions, deadlocks, and non-deterministic bugs that are hard to reproduce and debug
- **Responsiveness vs. Resource usage**: Running multiple concurrent tasks keeps the system responsive, but each thread or coroutine consumes memory and scheduling overhead that can degrade performance if over-provisioned
- **Abstraction level vs. Control**: High-level abstractions like async/await simplify concurrency, but hide details about scheduling and execution order that matter when diagnosing performance issues or subtle bugs

## Common small mistakes

- Confusing concurrency with parallelism and assuming that concurrent code always runs on multiple cores simultaneously
- Sharing mutable state between concurrent tasks without proper synchronization, leading to data races that only manifest under load
- Using locks too broadly (coarse-grained locking), which serializes work and eliminates the performance benefit of concurrency
- Forgetting to handle errors in concurrent tasks, causing silent failures when one task in a group throws an exception
