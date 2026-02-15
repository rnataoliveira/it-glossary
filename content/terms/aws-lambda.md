---
title: "AWS Lambda"
letter: "A"
categories:
  - "cloud"
  - "backend"
shortDefinition: "A serverless compute service from AWS that runs code in response to events and automatically manages the underlying infrastructure."
---

## Why does it exist?

Running backend code traditionally requires provisioning servers, configuring runtimes, managing capacity, and patching operating systems — even if the code only runs for a few seconds at a time. AWS Lambda eliminates all of that by executing functions on demand in response to events like HTTP requests, file uploads, database changes, or queue messages. You upload your code, define a trigger, and AWS handles provisioning, scaling, and availability. You pay only for the compute time consumed, measured in milliseconds.

Lambda is a core building block of serverless architectures on AWS, enabling developers to compose event-driven systems without managing any infrastructure.

## Practical example of use

An online marketplace needs to generate thumbnails whenever a seller uploads a product image. A Lambda function is triggered by an S3 PUT event. It reads the uploaded image, generates three thumbnail sizes, stores them back in S3, and updates the product record in DynamoDB.

```javascript
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const s3 = new S3Client({});
const SIZES = [{ name: "small", width: 150 }, { name: "medium", width: 400 }, { name: "large", width: 800 }];

exports.handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const imageBuffer = Buffer.from(await Body.transformToByteArray());

  const uploads = SIZES.map(async (size) => {
    const resized = await sharp(imageBuffer).resize(size.width).webp().toBuffer();
    const thumbKey = key.replace("uploads/", `thumbnails/${size.name}/`);

    return s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: thumbKey,
        Body: resized,
        ContentType: "image/webp",
      })
    );
  });

  await Promise.all(uploads);
  return { statusCode: 200, body: `Generated ${SIZES.length} thumbnails for ${key}` };
};
```

## When to use

- For event-driven workloads like processing file uploads, reacting to database changes, or handling webhook callbacks
- For lightweight APIs behind API Gateway where traffic is sporadic or unpredictable
- For scheduled tasks (cron jobs) that run periodically without needing a dedicated server
- When you want to minimize operational overhead and let AWS manage scaling, patching, and availability

## When to avoid

- For long-running processes that exceed the 15-minute execution limit
- When you need persistent in-memory state or long-lived connections like WebSockets
- For latency-critical paths where cold starts (100ms to several seconds depending on runtime and VPC config) are unacceptable
- When sustained high-throughput workloads make Lambda significantly more expensive than reserved EC2 or Fargate capacity

## Trade-offs

- **Zero operations vs. limited control**: AWS manages everything below your code, but you cannot control OS-level settings, install system-level agents, or use custom runtimes beyond what Lambda supports.
- **Pay-per-use vs. cost at scale**: Lambda is extremely cost-effective for sporadic workloads but can become expensive for sustained high-volume processing compared to reserved compute.
- **Fast iteration vs. vendor lock-in**: Lambda's tight integration with S3, DynamoDB, SQS, and EventBridge accelerates development but makes migrating to another provider a substantial rewrite.

## Common small mistakes

- Not configuring reserved concurrency, allowing a single runaway function to consume the account-wide concurrency limit and throttle other functions
- Bundling large dependencies that inflate cold start times — use Lambda layers or tree-shaking to keep packages small
- Ignoring the function's memory setting, which also controls CPU allocation — under-provisioned functions run slower and may cost more due to longer execution times
- Placing Lambda in a VPC without NAT Gateway configuration, causing it to lose internet access and fail to reach AWS services
- Not setting appropriate timeout values, leading to functions that hang for 15 minutes on transient errors instead of failing fast
