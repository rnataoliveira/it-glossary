---
title: "Data Pipeline"
letter: "D"
categories:
  - "data"
  - "devops"
shortDefinition: "An automated sequence of steps that moves data from one or more sources through transformations and into a destination system for storage or analysis."
---

## Why does it exist?

Raw data sitting in an operational database or a third-party API is not useful to analysts, dashboards, or machine learning models until it is extracted, cleaned, transformed, and delivered to the right destination. Doing this manually is error-prone and does not scale. A data pipeline automates the entire flow: scheduling extraction from sources, applying transformations (filtering, joining, aggregating, validating), and loading results into a data warehouse, data lake, or downstream service. It makes the process repeatable, observable, and recoverable when failures occur.

As organizations moved from single-database architectures to distributed systems with dozens of data sources, the need for orchestrated pipelines grew. Tools like Apache Airflow, Prefect, Dagster, and cloud-native services (AWS Step Functions, Azure Data Factory, Google Cloud Dataflow) provide the scheduling, dependency management, retry logic, and monitoring that production pipelines require. Without them, data teams spend more time firefighting broken scripts than building analytical value.

## Practical example of use

A data engineering team builds a daily pipeline that extracts order data from a transactional database, transforms it by joining with customer and product dimensions and computing revenue metrics, and loads the results into a Snowflake data warehouse. The pipeline is defined as a Directed Acyclic Graph (DAG) in Apache Airflow, where each step is a task with explicit dependencies.

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

with DAG("daily_etl", start_date=datetime(2025, 1, 1), schedule="@daily") as dag:
    extract = PythonOperator(task_id="extract", python_callable=extract_data)
    transform = PythonOperator(task_id="transform", python_callable=transform_data)
    load = PythonOperator(task_id="load", python_callable=load_data)
    extract >> transform >> load
```

The DAG runs every day, executing extract first, then transform, then load. If the transform step fails, Airflow retries it automatically and sends an alert. The team can monitor execution history, inspect logs for each task, and manually trigger backfills for missed dates.

## When to use

- You need to move data regularly from operational systems to analytical stores (warehouses, lakes, or BI tools) on a schedule.
- Your data flow involves multiple dependent steps where downstream tasks should only run after upstream tasks complete successfully.
- You want built-in retry logic, alerting, and execution history so that pipeline failures are detected and resolved quickly.
- Multiple data sources need to be joined or reconciled before they are useful for analysis, and this process must be repeatable and auditable.

## When to avoid

- Data movement is a one-time migration rather than an ongoing process; a script or managed migration tool is simpler than setting up a full pipeline framework.
- The data flow is trivial (single source, no transformation, direct copy) and can be handled by a database replication feature or a simple cron job without orchestration overhead.
- Real-time, event-by-event processing is required; a stream processing system is more appropriate than a scheduled batch pipeline.
- The team does not have the capacity to operate and maintain the orchestration infrastructure (Airflow servers, metadata databases, worker pools).

## Trade-offs

- **Reliability vs. complexity**: Orchestration frameworks add retry logic, dependency tracking, and monitoring, but they also introduce their own infrastructure (schedulers, workers, metadata stores) that must be deployed, scaled, and maintained.
- **Modularity vs. overhead**: Breaking a pipeline into many small, independent tasks improves testability and debuggability, but adds scheduling overhead and can increase total execution time due to task startup costs and inter-task communication.
- **Flexibility vs. standardization**: General-purpose frameworks like Airflow allow any Python code as a task, but this freedom can lead to inconsistent patterns across pipelines if the team does not enforce conventions.

## Common small mistakes

- Not making pipeline tasks idempotent, so rerunning a failed pipeline creates duplicates or corrupts downstream tables instead of producing the same correct result.
- Hardcoding connection strings, table names, and file paths instead of using configuration or environment variables, making pipelines brittle and environment-specific.
- Building a single monolithic DAG with dozens of tasks instead of separating concerns into smaller, focused DAGs that can run and fail independently.
- Ignoring pipeline execution time growth over months as data volumes increase, eventually causing jobs to overlap with the next scheduled run.
- Skipping data quality checks between stages, so bad data propagates silently through the pipeline and is only discovered when a dashboard shows incorrect numbers.
