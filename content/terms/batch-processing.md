---
title: "Batch Processing"
letter: "B"
categories:
  - "data"
  - "backend"
shortDefinition: "A data processing paradigm that collects, groups, and processes large volumes of data at scheduled intervals rather than in real time."
---

## Why does it exist?

Not every computation needs to happen the instant data arrives. Payroll runs once a month, financial reconciliation happens overnight, and machine learning models retrain on yesterday's data. Batch processing exists to handle these workloads efficiently by accumulating data over a period, then processing it all at once. This approach maximizes throughput because the system can optimize disk I/O, parallelize across large datasets, and amortize fixed costs (opening connections, initializing contexts) over millions of records instead of one at a time.

The pattern predates modern computing itself, going back to mainframe job scheduling. Today, tools like Apache Spark, Apache Hadoop MapReduce, AWS Glue, Azure Data Factory, and dbt operate on the same principle: take a bounded dataset, apply transformations, and produce output. Batch processing remains the workhorse of data engineering because most analytical and reporting workloads do not require sub-second freshness, and the simplicity and cost-effectiveness of batch jobs make them the pragmatic default.

## Practical example of use

A SaaS company needs to generate daily usage reports for each customer. Every night at 2 AM, a scheduled job reads the previous day's event logs from a data lake, aggregates usage metrics per customer, joins with billing information from a database, and writes the final report to a data warehouse. Downstream dashboards refresh when users log in the next morning, showing up-to-date usage data. The entire pipeline processes tens of millions of events in a single run, taking about 20 minutes. Running this as a continuous stream would be more complex and expensive for a report that only needs to be accurate once per day.

## When to use

- The workload operates on a bounded, known dataset (yesterday's logs, this month's transactions) and results are needed at scheduled intervals, not instantly.
- Throughput matters more than latency; you need to process millions or billions of records efficiently rather than react to each one individually.
- Downstream consumers (reports, dashboards, ML training pipelines) tolerate hours of delay between when data is generated and when it is available.
- Transformations require global context such as full-table joins, sorting, or deduplication that are difficult to perform incrementally on a stream.

## When to avoid

- The business requires real-time or near-real-time responses, such as fraud detection, live dashboards, or instant notifications; stream processing is a better fit.
- Data arrives continuously and users expect results to reflect the latest state within seconds or minutes.
- The dataset is small enough that processing it on every request (or micro-batching every few minutes) is feasible and eliminates the need for a scheduled pipeline.
- The cost of stale data is high; for example, inventory counts that are hours old can lead to overselling in a high-volume e-commerce system.

## Trade-offs

- **Throughput vs. latency**: Batch processing excels at high throughput by processing data in bulk, but results are only available after the entire job completes, introducing latency measured in minutes to hours.
- **Simplicity vs. freshness**: Batch pipelines are conceptually simpler to build, test, and debug than streaming counterparts, but the data they produce is always at least one interval old, which may not satisfy time-sensitive use cases.
- **Cost efficiency vs. resource spikes**: Running a large job once a day is often cheaper than maintaining always-on streaming infrastructure, but the job itself can require a burst of compute resources, leading to spiky resource utilization and potential contention with other workloads.

## Common small mistakes

- Not making batch jobs idempotent, so rerunning a failed job produces duplicate records instead of cleanly replacing the previous output.
- Scheduling jobs without dependency management (e.g., the transform job starts before the extract job finishes), causing it to process incomplete data.
- Ignoring data skew in distributed batch frameworks like Spark, where one partition has far more data than others, causing a single task to bottleneck the entire job.
- Writing output to the same location as input without using a staging pattern, risking data corruption if the job fails midway.
- Treating batch processing as the only option out of habit when a micro-batch or streaming approach would better serve the actual latency requirements.
