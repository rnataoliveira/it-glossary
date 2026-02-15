---
title: "Stream Processing"
letter: "S"
categories:
  - "data"
  - "backend"
shortDefinition: "A data processing paradigm that ingests, transforms, and acts on data continuously as it arrives, rather than waiting for it to accumulate in batches."
---

## Why does it exist?

Many business-critical decisions cannot wait for a nightly batch job. Fraud detection must flag suspicious transactions within seconds, not hours. Real-time dashboards need to reflect the current state of operations, not yesterday's snapshot. IoT systems must react to sensor readings the moment they cross a threshold. Stream processing exists to handle these requirements by treating data as an unbounded, continuous flow of events that are processed incrementally as they arrive.

The pattern gained momentum with the rise of distributed messaging systems like Apache Kafka and cloud-native services like AWS Kinesis and Azure Event Hubs. Frameworks such as Apache Flink, Kafka Streams, and Apache Spark Structured Streaming provide the programming models and fault-tolerance guarantees needed to build reliable stream processing applications. Together, they enable architectures where every event is captured, processed, and potentially triggers downstream actions within milliseconds to seconds of occurring.

## Practical example of use

An e-commerce platform uses stream processing to handle incoming orders in real time. Each order event is published to a Kafka topic. A consumer service subscribes to that topic and processes each order as it arrives: validating payment, updating inventory, and sending a confirmation email. This approach ensures orders are handled immediately rather than sitting in a queue waiting for a scheduled batch run.

```javascript
const { Kafka } = require("kafkajs");
const kafka = new Kafka({ brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "order-service" });

await consumer.connect();
await consumer.subscribe({ topic: "orders", fromBeginning: false });
await consumer.run({
  eachMessage: async ({ message }) => {
    const order = JSON.parse(message.value.toString());
    await processOrder(order);
  },
});
```

The consumer joins the "order-service" group, subscribes to the "orders" topic, and processes each message as it arrives. If the service crashes and restarts, Kafka tracks the consumer's offset so processing resumes from where it left off without reprocessing already-handled orders.

## When to use

- Your application must react to events within seconds or milliseconds, such as fraud detection, alerting, or real-time personalization.
- You need to maintain continuously updated materialized views or dashboards that reflect the latest state of the system.
- The data source is inherently unbounded and continuous, such as clickstreams, IoT sensor readings, or financial market feeds.
- You want to decouple producers and consumers so that services can publish events independently and multiple downstream systems can process them concurrently.

## When to avoid

- The workload is naturally periodic and latency of hours is acceptable, such as nightly report generation or monthly billing; batch processing is simpler and often cheaper.
- Transformations require access to the entire dataset at once (e.g., global sorting, full-table aggregations with exact results); batch systems handle these more naturally.
- The team lacks experience with distributed systems and the operational complexity of managing brokers, consumer groups, offset management, and exactly-once semantics.
- Event volumes are very low (a few per hour) and the overhead of maintaining a streaming infrastructure is not justified.

## Trade-offs

- **Latency vs. throughput**: Stream processing optimizes for low latency on individual events, but processing records one at a time is less throughput-efficient than batch processing, which amortizes overhead across large chunks of data.
- **Freshness vs. correctness**: Streaming results are available almost immediately, but late-arriving or out-of-order events can cause intermediate results to be temporarily inaccurate until watermarks or retractions correct them.
- **Operational complexity vs. responsiveness**: A streaming architecture introduces additional infrastructure (brokers, partitions, consumer groups, schema registries) that must be monitored and scaled, adding operational burden compared to simpler batch-oriented designs.

## Common small mistakes

- Not handling poison messages (malformed events that cause repeated processing failures), leading to a blocked consumer that stops processing all subsequent messages.
- Committing offsets before processing completes, which causes data loss if the service crashes between the commit and the actual processing.
- Ignoring backpressure and allowing a slow consumer to fall further and further behind the producer, eventually causing out-of-memory errors or unbounded lag.
- Assuming exactly-once processing comes for free; achieving it requires idempotent consumers or transactional guarantees, which add complexity.
- Performing blocking I/O (such as synchronous database writes) inside the message handler without concurrency controls, turning the stream processor into a bottleneck.
