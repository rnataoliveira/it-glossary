---
title: "Deadlock"
letter: "D"
categories:
  - "avoid-state-bugs"
shortDefinition: "A situation where two or more processes are stuck waiting for each other to release resources, so none can proceed."
---

## Why does it exist?

Deadlocks are not a feature — they are an emergent failure mode of concurrent systems that use shared resources with mutual exclusion. When multiple processes or threads need exclusive access to more than one resource, and they acquire those resources in different orders, a circular dependency can form where each holds what the other needs. Understanding deadlocks exists as a concept because recognizing, preventing, and resolving them is essential to building reliable concurrent software.

## Practical example of use

A banking system has two accounts, A and B. Thread 1 processes a transfer from A to B: it locks Account A, then tries to lock Account B. Simultaneously, Thread 2 processes a transfer from B to A: it locks Account B, then tries to lock Account A. Thread 1 holds A and waits for B; Thread 2 holds B and waits for A. Neither can proceed — the system is deadlocked. The fix is to always acquire locks in a consistent order (e.g., always lock the account with the lower ID first), breaking the circular wait condition.

```python
import threading

lock_a = threading.Lock()
lock_b = threading.Lock()

def transfer(from_lock, to_lock, amount):
    # Always acquire locks in a consistent order (by id) to prevent deadlock
    first, second = sorted([from_lock, to_lock], key=id)
    with first:
        with second:
            # safe — no circular wait is possible
            from_lock.balance -= amount
            to_lock.balance += amount
```

## When to use

- When designing any system that acquires multiple locks or resources, you must actively consider deadlock prevention strategies
- When debugging a system that has frozen or stopped making progress under concurrent load
- When choosing between locking strategies — understanding deadlock informs whether to use lock ordering, timeouts, or lock-free data structures
- When conducting code reviews of concurrent code to verify that resource acquisition follows a consistent, documented order

## When to avoid

- When your system is single-threaded or purely event-loop-based with no blocking locks — deadlock cannot occur without concurrent resource contention
- When using message-passing architectures (like actors) where shared mutable state and explicit locks are absent by design
- When over-engineering deadlock prevention for systems with trivially simple locking that will never encounter circular dependencies

## Trade-offs

- **Safety vs. Performance**: Strict lock ordering or using a single global lock prevents deadlocks but can serialize work and reduce throughput
- **Simplicity vs. Flexibility**: Lock-free or wait-free algorithms eliminate deadlocks entirely but are significantly harder to implement and reason about correctly
- **Detection vs. Prevention**: Runtime deadlock detection (e.g., wait-for graphs, lock timeouts) allows more flexible code but adds overhead and requires recovery logic, while prevention strategies constrain the design upfront

## Common small mistakes

- Acquiring multiple locks in inconsistent orders across different code paths without realizing a circular dependency is possible
- Using nested synchronized blocks or reentrant locks without a clear, enforced locking hierarchy
- Setting lock timeouts but not implementing proper retry or recovery logic, turning a deadlock into a livelock or silent failure
- Assuming that deadlocks only happen under heavy load — they can occur with just two threads if the timing is right
