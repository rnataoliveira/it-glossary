---
title: "gRPC"
letter: "G"
categories:
  - "architecture"
  - "backend"
shortDefinition: "A high-performance, language-agnostic remote procedure call framework built on HTTP/2 and Protocol Buffers."
---

## Why does it exist?

REST APIs exchange JSON over HTTP/1.1, which is human-readable but relatively slow to serialize, verbose on the wire, and lacks a built-in contract between client and server. As microservice architectures grew, teams needed a faster, strongly typed communication protocol that could generate client and server code automatically across many languages.

gRPC was created by Google to address these needs. It uses Protocol Buffers (protobuf) as its interface definition language and serialization format, and runs over HTTP/2, which provides multiplexed streams, header compression, and bidirectional streaming out of the box. The result is significantly lower latency and bandwidth usage compared to JSON-based REST for service-to-service communication.

## Practical example of use

Suppose you have an order service that needs to call an inventory service to check stock before confirming a purchase. You define the contract in a `.proto` file and generate typed clients in any language your services use.

```protobuf
// inventory.proto
syntax = "proto3";

package inventory;

service InventoryService {
  rpc CheckStock (StockRequest) returns (StockResponse);
  rpc WatchStock (StockRequest) returns (stream StockUpdate);
}

message StockRequest {
  string product_id = 1;
  int32 quantity = 2;
}

message StockResponse {
  bool available = 1;
  int32 remaining = 2;
}

message StockUpdate {
  int32 remaining = 1;
  string timestamp = 2;
}
```

After running `protoc` to generate the client code, the order service can call the inventory service with full type safety:

```javascript
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("inventory.proto");
const proto = grpc.loadPackageDefinition(packageDef).inventory;

const client = new proto.InventoryService(
  "inventory-service:50051",
  grpc.credentials.createInsecure()
);

client.CheckStock({ product_id: "SKU-1234", quantity: 2 }, (err, response) => {
  if (err) {
    console.error("gRPC error:", err.message);
    return;
  }

  if (response.available) {
    console.log(`In stock. ${response.remaining} units remaining.`);
  } else {
    console.log("Insufficient stock.");
  }
});
```

## When to use

- Internal microservice-to-microservice communication where latency and throughput matter.
- You need streaming (server-push, client-push, or bidirectional) as a first-class feature.
- Your organization uses multiple programming languages and wants a single source of truth for API contracts.
- Mobile or IoT clients that benefit from smaller payloads and lower bandwidth usage.

## When to avoid

- Public-facing APIs consumed by browsers -- gRPC requires HTTP/2 and is not natively supported in browser JavaScript without a proxy like gRPC-Web.
- Simple CRUD applications where REST's tooling ecosystem (OpenAPI, Postman, curl) is more productive.
- Teams unfamiliar with protobuf who would spend more time on tooling setup than they save on performance.

## Trade-offs

- **Performance vs. debuggability**: Binary protobuf payloads are fast but not human-readable; inspecting traffic requires specialized tools like `grpcurl` or Bloom RPC.
- **Strong contracts vs. flexibility**: The `.proto` file enforces strict schemas, which prevents drift but makes quick ad-hoc changes harder than editing a JSON response.
- **HTTP/2 benefits vs. infrastructure requirements**: Multiplexed streams reduce connection overhead, but load balancers, proxies, and firewalls must all support HTTP/2 end-to-end.

## Common small mistakes

- Forgetting that gRPC uses HTTP/2, then deploying behind an HTTP/1.1-only load balancer, which silently breaks streaming.
- Not versioning `.proto` files, leading to breaking changes that crash clients still using the old schema.
- Using gRPC for browser-facing APIs without a gRPC-Web proxy, then wondering why calls fail.
- Ignoring deadline propagation -- every gRPC call should set a deadline to avoid hanging requests in a chain of services.
- Returning large payloads without pagination; gRPC messages have a default 4 MB size limit.
