---
title: "Serverless"
letter: "S"
categories:
  - "explain-architecture"
  - "create-system-design"
  - "improve-scalability"
shortDefinition: "A cloud execution model where the provider dynamically manages server allocation, charging only for actual compute time used."
---

## Why does it exist?

Traditional server management forces teams to provision, patch, and scale infrastructure even when the application is idle. Serverless shifts that responsibility to the cloud provider, letting developers focus entirely on business logic. The pay-per-invocation pricing model also eliminates the cost of idle resources, making it economically efficient for workloads with variable or unpredictable traffic.

## Practical example of use

A SaaS company needs to generate PDF invoices whenever a customer completes a purchase. They create an AWS Lambda function triggered by an SQS message. The function receives the order data, renders a PDF using a template, uploads it to S3, and sends a download link via email. During normal hours, the function runs a few times per minute. On billing day, it scales automatically to handle thousands of concurrent invocations without any capacity planning. The company pays only for the milliseconds of actual execution.

```js
// AWS Lambda handler
exports.handler = async (event) => {
  const order = JSON.parse(event.Records[0].body);

  const pdf = await renderInvoice(order);
  await s3.putObject({
    Bucket: "invoices",
    Key: `${order.id}.pdf`,
    Body: pdf,
  }).promise();

  await sendEmail(order.email, `Your invoice is ready`, {
    attachmentUrl: `https://invoices.example.com/${order.id}.pdf`,
  });

  return { statusCode: 200 };
};
```

## When to use

- For event-driven workloads like file processing, webhook handlers, or scheduled jobs
- When traffic is highly variable or unpredictable and you want automatic scaling to zero
- For lightweight APIs and microservices where minimizing operational overhead matters more than fine-tuned performance
- When the team is small and cannot dedicate resources to infrastructure management

## When to avoid

- For long-running processes that exceed function timeout limits (typically 15 minutes on AWS Lambda)
- When the application requires persistent connections like WebSockets or in-memory state across requests
- For latency-sensitive workloads where cold starts (100ms-2s depending on runtime) are unacceptable

## Trade-offs

- **Zero ops vs. limited control**: The provider manages scaling and infrastructure, but you cannot tune the underlying OS, runtime version, or network configuration.
- **Cost efficiency at low scale vs. cost explosion at high scale**: Pay-per-use is cheap for sporadic workloads, but sustained high-throughput workloads can be significantly more expensive than reserved compute.
- **Fast development vs. vendor lock-in**: Provider-specific triggers, IAM integrations, and runtime APIs accelerate development but make it costly to migrate to another cloud or self-hosted solution.

## Common small mistakes

- Not accounting for cold start latency in user-facing request paths, leading to occasional slow responses
- Putting too much logic into a single function instead of composing smaller functions, making debugging and testing harder
- Ignoring function concurrency limits, which can throttle traffic or overwhelm downstream databases
- Failing to set appropriate timeouts and memory allocations, resulting in either wasted cost or unexpected terminations
