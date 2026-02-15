---
title: "Object Storage"
letter: "O"
categories:
  - "cloud"
  - "data"
shortDefinition: "A storage architecture that manages data as discrete objects with metadata and unique identifiers, rather than as files in a hierarchy or blocks on a disk."
---

## Why does it exist?

Traditional file systems organize data in directory hierarchies with limited metadata, and block storage operates at the raw disk level. Neither is well suited for storing massive volumes of unstructured data — images, videos, backups, logs, data lake files — at cloud scale. Object storage was designed to handle this by treating each piece of data as a self-contained object with a unique key, rich custom metadata, and built-in redundancy across multiple availability zones. It offers virtually unlimited capacity, high durability (typically 99.999999999% or "eleven nines"), and simple HTTP-based access.

Object storage is the backbone of data lakes, static website hosting, backup solutions, and content delivery architectures. Its flat namespace and RESTful API make it straightforward to integrate with any application.

## Practical example of use

A media platform allows users to upload profile photos. When a user uploads an image, the backend resizes it into multiple dimensions and stores each variant in an S3 bucket with metadata indicating the original upload ID and dimensions. The objects are served to end users via a CDN that pulls from the bucket.

```javascript
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: "us-east-1" });

async function uploadImage(buffer, userId, size) {
  const key = `profiles/${userId}/${size}.webp`;

  await s3.send(
    new PutObjectCommand({
      Bucket: "media-platform-images",
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
      Metadata: {
        "original-user-id": userId,
        "image-size": size,
      },
    })
  );

  return `https://media-platform-images.s3.amazonaws.com/${key}`;
}
```

## When to use

- For storing large volumes of unstructured data like images, videos, logs, and backups where you need high durability
- As the foundation for a data lake where analytics tools query data directly from storage using formats like Parquet or ORC
- For static asset hosting and serving content through a CDN
- When you need inexpensive, scalable storage with lifecycle policies to automatically archive or delete old data

## When to avoid

- When you need low-latency random read/write access to small pieces of data — a database or block storage is more appropriate
- When your application requires POSIX file system semantics like file locking, appending, or directory listings
- For frequently updated data that changes in place — object storage treats each write as a full object replacement
- When strong consistency on read-after-write is critical and your object store only offers eventual consistency (though most modern stores now offer strong consistency)

## Trade-offs

- **Scalability vs. latency**: Object storage scales to exabytes effortlessly but has higher per-request latency (tens of milliseconds) compared to local disk or block storage.
- **Durability vs. cost awareness**: Eleven-nines durability is built in, but costs accumulate across storage, API requests, and data retrieval — especially with frequent access patterns or cross-region transfers.
- **Simplicity vs. limited operations**: The flat key-value model is simple to reason about, but you cannot rename objects, append to them, or do partial updates without rewriting the entire object.

## Common small mistakes

- Using object storage as a primary database, leading to poor performance for transactional workloads
- Forgetting to set lifecycle policies, causing storage costs to grow indefinitely as old data accumulates
- Not enabling versioning, then losing data to accidental overwrites or deletes
- Ignoring request pricing — millions of small LIST or GET operations can cost more than the storage itself
- Storing sensitive data without enabling server-side encryption and properly restricting bucket policies
