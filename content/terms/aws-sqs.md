---
title: "AWS SQS"
letter: "A"
categories:
  - "cloud"
  - "backend"
shortDefinition: "Amazon Simple Queue Service (SQS) is a fully managed message queue that decouples and buffers communication between distributed system components."
---

## Why does it exist?

In distributed systems, components often produce work faster than consumers can process it, or producers and consumers may not be available at the same time. Without a buffer, requests are dropped, services become tightly coupled, and failures cascade. SQS provides a durable, fully managed queue that sits between producers and consumers: producers send messages, SQS stores them reliably, and consumers pull messages at their own pace. This decoupling improves resilience, enables independent scaling, and smooths out traffic spikes.

SQS offers two queue types: Standard queues (at-least-once delivery, nearly unlimited throughput) and FIFO queues (exactly-once processing, guaranteed ordering, up to 3,000 messages per second with batching).

## Practical example of use

An order processing system uses SQS to decouple the checkout API from the payment and fulfillment services. When a customer places an order, the API sends a message to an SQS queue and immediately responds to the user. A fleet of worker services polls the queue, processes payments, and triggers fulfillment — each at their own rate.

```typescript
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({ region: "us-east-1" });
const QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/123456789/order-processing";

// Producer: send order to queue
async function enqueueOrder(order: { orderId: string; items: string[]; total: number }) {
  await sqs.send(
    new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(order),
      MessageAttributes: {
        OrderType: { DataType: "String", StringValue: "standard" },
      },
    })
  );
}

// Consumer: poll and process messages
async function processMessages() {
  const { Messages } = await sqs.send(
    new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20, // long polling
      VisibilityTimeout: 60,
    })
  );

  if (!Messages) return;

  for (const message of Messages) {
    const order = JSON.parse(message.Body!);
    await processPayment(order);
    await triggerFulfillment(order);

    // Delete message after successful processing
    await sqs.send(
      new DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle!,
      })
    );
  }
}
```

## When to use

- To decouple producers from consumers so they can scale, deploy, and fail independently
- To buffer bursty traffic so backend workers process at a sustainable rate without being overwhelmed
- For reliable task distribution across a fleet of workers with automatic retry on failure
- When you need a simple, fully managed queue without operating RabbitMQ, Redis, or Kafka

## When to avoid

- When you need real-time pub/sub to multiple consumers — use SNS or EventBridge instead, or SNS+SQS fan-out
- When strict message ordering is critical and throughput exceeds FIFO queue limits (consider Kinesis or Kafka)
- When consumers need to filter messages by complex criteria — SQS message filtering is limited compared to EventBridge rules
- For request-response patterns where the caller needs an immediate synchronous reply

## Trade-offs

- **Simplicity vs. limited routing**: SQS is a straightforward point-to-point queue, but it does not support topics, routing keys, or complex exchange patterns like RabbitMQ or Kafka.
- **Reliability vs. latency**: Messages are stored durably across multiple AZs, but polling introduces latency compared to push-based systems. Long polling mitigates this but does not eliminate it.
- **Managed vs. cost at volume**: No infrastructure to manage, but at very high message volumes (millions per day), SQS costs can exceed self-managed alternatives like Kafka on EC2.

## Common small mistakes

- Not using long polling (WaitTimeSeconds > 0), causing excessive empty responses and unnecessary API costs
- Forgetting to delete messages after processing, causing them to reappear after the visibility timeout expires
- Setting visibility timeout too short, leading to duplicate processing when a slow consumer does not finish in time
- Not configuring a dead-letter queue (DLQ) for messages that repeatedly fail processing, losing visibility into errors
- Assuming Standard queues guarantee ordering — they provide best-effort ordering only; use FIFO queues if order matters
