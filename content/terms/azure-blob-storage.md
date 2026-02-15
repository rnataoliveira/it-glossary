---
title: "Azure Blob Storage"
letter: "A"
categories:
  - "cloud"
  - "data"
shortDefinition: "A managed object storage service from Microsoft Azure designed to store massive amounts of unstructured data such as images, videos, logs, and backups."
---

## Why does it exist?

Traditional file systems and relational databases struggle to handle the volume, variety, and access patterns of unstructured data. Organizations need a place to store terabytes or petabytes of files (images, videos, log archives, machine learning datasets) without managing physical disks, replication, or capacity planning. Azure Blob Storage fills that gap by providing a fully managed, highly durable object store accessible over HTTP/HTTPS.

Beyond raw storage, Blob Storage offers tiered pricing (Hot, Cool, Cold, and Archive) so teams can optimize costs based on how frequently data is accessed. It integrates natively with other Azure services such as Azure Functions, Azure Data Factory, and Azure CDN, making it a foundational building block for cloud-native architectures on the Microsoft platform.

## Practical example of use

A web application allows users to upload profile photos. Instead of writing files to a local disk on the application server, the backend pushes them directly to a Blob Storage container. This decouples storage from compute, allows the app to scale horizontally without worrying about shared file systems, and gives each file a unique URL that can be served through a CDN.

```javascript
const { BlobServiceClient } = require("@azure/storage-blob");
const client = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION);
const container = client.getContainerClient("uploads");
const blob = container.getBlockBlobClient("photo.jpg");
await blob.uploadFile("./photo.jpg");
```

The snippet above connects to Blob Storage using a connection string stored in an environment variable, selects a container named "uploads," and uploads a local file. In production, you would typically generate SAS tokens or use managed identities rather than full connection strings.

## When to use

- You need to store large volumes of unstructured data (images, videos, documents, backups) without provisioning disks.
- Your application requires globally accessible, HTTP-addressable files that can be fronted by a CDN.
- You want cost-effective archival storage with lifecycle policies that automatically move data to cooler tiers.
- You are building data pipelines in Azure and need a staging area for raw data before processing.

## When to avoid

- Your workload requires POSIX file-system semantics such as file locking, random in-place writes, or directory-level permissions; consider Azure Files or Azure NetApp Files instead.
- You need a fully relational or strongly consistent transactional store; use a database service instead.
- Latency-sensitive workloads demand sub-millisecond access to small records; a cache or database is more appropriate.
- Your data is highly structured and queried with SQL patterns; a data warehouse or relational database is a better fit.

## Trade-offs

- **Cost vs. access speed**: Archive and Cool tiers are significantly cheaper per gigabyte, but retrieving data from them incurs higher latency and retrieval fees, so misclassifying data tiers can either waste money or slow operations.
- **Simplicity vs. fine-grained control**: Blob Storage abstracts away replication and hardware management, but you give up low-level control over data placement, disk I/O tuning, and custom replication strategies.
- **Vendor integration vs. portability**: Deep integration with Azure services (Functions triggers, Data Factory connectors, Event Grid notifications) accelerates development but increases coupling to the Azure ecosystem, making multi-cloud or migration scenarios harder.

## Common small mistakes

- Storing the full connection string in source code or client-side bundles instead of using managed identities or SAS tokens with limited scope and expiry.
- Forgetting to set the correct content type when uploading files, causing browsers to download blobs instead of rendering them inline.
- Using the Hot tier for data that is rarely accessed, leading to unnecessarily high storage costs over time.
- Not enabling soft delete or versioning, which means accidental overwrites or deletions are irreversible.
- Ignoring network rules and leaving containers with public anonymous access when the data should be private.
