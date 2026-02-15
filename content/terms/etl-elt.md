---
title: "ETL vs ELT"
letter: "E"
categories:
  - "data"
  - "devops"
shortDefinition: "Two data integration patterns where ETL transforms data before loading it into a target system, while ELT loads raw data first and transforms it inside the destination."
---

## Why does it exist?

Organizations collect data from dozens of sources: APIs, databases, flat files, and event streams. That data rarely arrives in the shape analysts and applications need. ETL (Extract, Transform, Load) emerged decades ago when storage was expensive and compute in the warehouse was limited, so it made sense to clean and reshape data before loading it. Purpose-built ETL tools would extract from a source, apply transformations on a separate server, and write the polished result into the warehouse.

As cloud data warehouses like BigQuery, Snowflake, and Redshift made storage cheap and compute elastic, ELT (Extract, Load, Transform) gained popularity. The idea is to land raw data quickly into the warehouse and then use the warehouse's own processing power (often with tools like dbt) to transform it in place. Both patterns solve the same fundamental problem of getting data from where it is generated to where it is analyzed, but they differ in where and when the transformation step happens.

## Practical example of use

A company pulls user records from an external API nightly. In the ETL approach, a script extracts the data, applies schema validation and field mapping on an intermediate server, and loads only the clean result into the warehouse. In the ELT approach, the same raw data is loaded directly into a staging table, and a dbt model handles cleaning and reshaping inside the warehouse.

```python
# ETL: Transform before loading
raw = extract_from_api("/users")
cleaned = transform(raw, schema="user_v2")
load_to_warehouse(cleaned, table="dim_users")

# ELT: Load raw, transform in warehouse
raw = extract_from_api("/users")
load_to_warehouse(raw, table="raw_users")
run_dbt_model("stg_users")  # transform in-place
```

The ETL path guarantees only validated data reaches the warehouse, while the ELT path preserves the raw data for reprocessing if business logic changes later.

## When to use

- Choose ETL when the target system has limited compute power and cannot efficiently run heavy transformations, such as a traditional on-premises data warehouse.
- Choose ELT when you use a modern cloud warehouse with elastic compute, and you want to retain raw data for auditability and reprocessing.
- Use ETL when regulatory or compliance rules require that sensitive fields be masked or removed before data ever reaches the destination.
- Use ELT when transformation logic changes frequently and you want to rerun models against already-loaded raw data without re-extracting from sources.

## When to avoid

- Avoid ETL when you need to iterate quickly on transformation logic, because every change requires reprocessing from extraction onward.
- Avoid ELT when the destination system charges heavily for compute and your transformations are complex, as running them inside the warehouse can become expensive.
- Avoid ETL if your team prefers SQL-based transformations and the intermediate processing server adds operational burden without clear benefit.
- Avoid ELT when loading raw, unsanitized data into the warehouse violates data governance policies or exposes PII to users with broad access.

## Trade-offs

- **Data freshness vs. data quality**: ELT can land data faster because it skips upfront transformation, but raw data in the warehouse may contain duplicates or malformed records until transformation jobs complete.
- **Flexibility vs. governance**: ELT preserves raw data, enabling schema changes and reprocessing, but it also means potentially sensitive or messy data sits in the warehouse, requiring tighter access controls.
- **Infrastructure simplicity vs. cost**: ELT eliminates the need for a separate transformation server, simplifying architecture, but shifts compute costs to the warehouse, which can be expensive at scale if queries are not optimized.

## Common small mistakes

- Treating ETL and ELT as mutually exclusive when many real-world pipelines blend both approaches, applying light transformations during extraction and heavier ones in the warehouse.
- Loading raw data via ELT without establishing a clear staging-to-curated layer separation, causing analysts to query unreliable raw tables directly.
- Building ETL pipelines with tightly coupled, monolithic transformation steps instead of modular, independently testable stages.
- Neglecting idempotency so that rerunning a pipeline creates duplicate records instead of cleanly replacing or upserting data.
- Skipping data validation entirely in ELT pipelines, assuming the warehouse transformation step will catch all issues.
