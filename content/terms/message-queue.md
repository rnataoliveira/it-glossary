---
title: "Message Queue"
letter: "M"
categories:
  - "create-system-design"
  - "improve-reliability"
  - "improve-scalability"
shortDefinition: "A middleware component that stores messages between producers and consumers, enabling asynchronous and decoupled communication."
---

## Why does it exist?

Synchronous communication between services creates tight coupling: if the receiver is slow or down, the sender is blocked or fails. Message queues were introduced to decouple producers from consumers in both time and availability. The producer drops a message into the queue and moves on. The consumer processes it when ready. This buffering mechanism absorbs traffic spikes, enables independent scaling, and ensures that work is not lost even when parts of the system are temporarily unavailable.

## Practical example of use

An e-commerce platform receives a burst of 10,000 orders during a flash sale. Instead of processing each order synchronously — which would overwhelm the inventory, payment, and shipping services — the Order Service publishes each order as a message to a RabbitMQ queue. Three consumer instances pull messages at their own pace, processing around 200 orders per second each. If a consumer crashes, unacknowledged messages remain in the queue and are redelivered to a healthy consumer. The queue depth is monitored, and auto-scaling adds more consumers when the backlog exceeds a threshold.

## When to use

- You need to absorb traffic spikes without overloading downstream services
- The producer and consumer operate at different speeds or have different availability requirements
- Work must not be lost, even if the consumer is temporarily down
- You want to decouple services so they can be developed, deployed, and scaled independently

## When to avoid

- The operation requires an immediate, synchronous response (e.g., a user waiting for a real-time validation result)
- The added latency of asynchronous processing is unacceptable for the use case
- The system is simple enough that direct HTTP calls between two services are sufficient and reliable

## Trade-offs

- **Decoupled services vs. added infrastructure**: Producers and consumers evolve independently, but you now have a broker to deploy, monitor, and maintain.
- **Resilience to spikes vs. increased latency**: The queue absorbs bursts, but messages are processed asynchronously, introducing a delay between submission and completion.
- **Guaranteed delivery vs. duplicate handling**: Most queues offer at-least-once delivery, which means consumers must be idempotent to handle the same message being delivered more than once.

## Common small mistakes

- Not making consumers idempotent, leading to duplicate side effects when a message is redelivered after a processing timeout
- Ignoring dead-letter queues, so poison messages (ones that always fail) are retried indefinitely and block the queue
- Treating the queue as a database by storing messages for long periods instead of processing and discarding them promptly
- Not monitoring queue depth, missing the signal that consumers are falling behind until the backlog causes visible user-facing delays
