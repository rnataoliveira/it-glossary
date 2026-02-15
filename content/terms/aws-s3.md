---
title: "AWS S3"
letter: "A"
categories:
  - "cloud"
  - "data"
shortDefinition: "Amazon Simple Storage Service (S3) is a highly durable, scalable object storage service used for storing and retrieving any amount of data from anywhere on the web."
---

## Why does it exist?

Applications need a reliable place to store files — images, backups, logs, datasets, static assets — without worrying about disk capacity, replication, or hardware failures. Before S3, teams managed their own file servers or NAS devices, dealing with capacity planning, RAID configurations, and disaster recovery. S3 abstracts all of that behind a simple API: you PUT an object, and AWS stores it across multiple facilities with 99.999999999% durability. It was one of the first AWS services (launched in 2006) and remains the foundation for countless architectures, from data lakes to static website hosting.

## Practical example of use

A SaaS application stores user-generated documents in S3. The backend generates pre-signed URLs so clients can upload directly to S3 without routing traffic through the application server. When another service needs the document, it retrieves it using the SDK.

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });

// Generate a pre-signed URL for direct upload from the client
async function getUploadUrl(userId: string, fileName: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: "app-documents",
    Key: `users/${userId}/${fileName}`,
    ContentType: "application/pdf",
  });
  return getSignedUrl(s3, command, { expiresIn: 300 });
}

// Retrieve an object from S3
async function getDocument(userId: string, fileName: string): Promise<Buffer> {
  const { Body } = await s3.send(
    new GetObjectCommand({
      Bucket: "app-documents",
      Key: `users/${userId}/${fileName}`,
    })
  );
  return Buffer.from(await Body!.transformToByteArray());
}
```

## When to use

- For storing any unstructured data: images, videos, documents, backups, log archives, and data lake files
- As the origin for a CloudFront CDN distribution to serve static assets globally with low latency
- For hosting static websites (HTML, CSS, JS) without a web server
- As a durable event source — S3 event notifications can trigger Lambda functions, SQS messages, or SNS notifications

## When to avoid

- When you need a database with queries, indexes, and transactions — S3 is not a database
- For workloads that require POSIX file system semantics like file locking, appending, or symlinks
- When you need sub-millisecond latency for small random reads — use DynamoDB or ElastiCache instead
- For frequently mutated small objects where the overhead of full-object replacement is wasteful

## Trade-offs

- **Durability vs. retrieval costs**: S3 offers exceptional durability across storage classes, but retrieval from Glacier or Deep Archive tiers takes minutes to hours and incurs per-GB retrieval fees.
- **Simplicity vs. limited operations**: The key-value API is straightforward, but you cannot update a portion of an object, rename it atomically, or append to it — every change requires a full rewrite.
- **Flexible access control vs. misconfiguration risk**: S3 offers granular bucket policies, ACLs, and IAM controls, but a single misconfigured policy can expose sensitive data publicly.

## Common small mistakes

- Leaving buckets publicly accessible by misconfiguring bucket policies or ACLs — always enable S3 Block Public Access unless explicitly needed
- Not using lifecycle rules to transition infrequently accessed data to cheaper storage classes, leading to unnecessary costs
- Forgetting to enable versioning on important buckets, making accidental deletes or overwrites unrecoverable
- Using ListObjects in production code paths — it is slow and expensive at scale; use a database to track object keys instead
- Not configuring server-side encryption, leaving data at rest unencrypted
