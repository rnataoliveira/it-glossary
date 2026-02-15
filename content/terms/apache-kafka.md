---
title: "Apache Kafka"
letter: "A"
categories:
  - "data"
  - "backend"
shortDefinition: "A distributed event streaming platform designed for high-throughput, fault-tolerant, real-time data pipelines and event-driven architectures."
---

## Why does it exist?

Modern systems generate enormous volumes of events: user clicks, transactions, sensor readings, log entries, and service-to-service messages. Traditional message brokers like RabbitMQ handle point-to-point messaging well but were not designed for the persistent, replayable, high-throughput event streams that data-intensive applications require. Apache Kafka was originally built at LinkedIn to solve this exact problem: ingesting hundreds of thousands of events per second, storing them durably on disk, and allowing multiple consumers to read the same stream independently at their own pace.

Kafka achieves this through a distributed commit log architecture. Events are appended to partitioned, replicated topics and retained for a configurable period (or indefinitely). Producers and consumers are fully decoupled; adding a new consumer does not affect existing ones, and consumers can rewind to replay historical events. This design makes Kafka the backbone for event-driven microservices, real-time analytics, change data capture, and data integration pipelines across industries.

## Practical example of use

A web application tracks user activity by publishing click events to a Kafka topic. An analytics service consumes those events to compute real-time metrics, while a separate recommendation service reads the same topic to personalize content. Both consumers operate independently, and if either falls behind, it catches up by reading from its last committed offset without affecting the other.

```javascript
const { Kafka } = require("kafkajs");
const kafka = new Kafka({ brokers: ["localhost:9092"] });

// Producer
const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: "events",
  messages: [{ key: "user-123", value: JSON.stringify({ action: "click" }) }],
});

// Consumer
const consumer = kafka.consumer({ groupId: "analytics" });
await consumer.subscribe({ topic: "events" });
await consumer.run({
  eachMessage: async ({ message }) => {
    console.log(JSON.parse(message.value.toString()));
  },
});
```

The producer publishes a click event with a user key to the "events" topic. The key ensures all events for the same user land on the same partition, preserving ordering. The consumer in the "analytics" group processes each event as it arrives. Multiple instances of this consumer can run in parallel, with Kafka distributing partitions across them.

## When to use

- You need a durable, high-throughput event bus that can handle hundreds of thousands of messages per second with replication and fault tolerance.
- Multiple independent consumers need to read the same stream of events at their own pace without interfering with each other.
- Your architecture requires event replay, meaning consumers should be able to rewind and reprocess historical events after a bug fix or schema change.
- You are building event-driven microservices, CQRS/event sourcing patterns, or real-time data pipelines that connect operational systems to analytical platforms.

## When to avoid

- Your messaging needs are simple point-to-point task queues with low throughput; a lighter broker like RabbitMQ or cloud-native queues (SQS, Cloud Tasks) adds less operational overhead.
- You need complex routing logic such as topic exchanges, headers-based routing, or priority queues; traditional message brokers offer these features natively while Kafka does not.
- The team is small, message volumes are low, and the operational cost of running and monitoring a Kafka cluster (ZooKeeper or KRaft, broker tuning, partition management) is not justified.
- You need strict message ordering across an entire topic rather than per-partition ordering; Kafka guarantees order only within a single partition.

## Trade-offs

- **Throughput vs. operational complexity**: Kafka delivers exceptional throughput and durability, but running a production cluster requires managing brokers, replication, partition rebalancing, and monitoring consumer lag, which is significantly more complex than simpler queuing solutions.
- **Durability vs. latency**: Kafka persists every message to disk and replicates it across brokers, which adds a small amount of latency compared to in-memory brokers, though for most use cases this is negligible.
- **Decoupling vs. debugging difficulty**: Fully decoupled producers and consumers simplify architecture, but tracing an event's journey through multiple consumers and topics becomes harder without proper observability tools like distributed tracing and schema registries.

## Common small mistakes

- Creating too many partitions per topic, which increases metadata overhead, slows rebalancing, and complicates consumer group management without proportional throughput gains.
- Not setting a message key, causing events for the same entity to be distributed across random partitions and losing per-entity ordering guarantees.
- Using Kafka as a database by relying on infinite retention and key-value lookups; Kafka is a commit log, not a query engine, and lacks indexing for efficient random reads.
- Ignoring consumer lag monitoring, so a slow or stuck consumer falls hours behind the latest offset without anyone noticing until data freshness issues surface in dashboards.
- Deploying without a schema registry, allowing producers to change message formats freely and breaking downstream consumers with incompatible schema changes.
