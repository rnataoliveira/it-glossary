---
title: "WebSockets"
letter: "W"
categories:
  - "create-system-design"
  - "explain-architecture"
  - "back-end-applications"
  - "front-end-applications"
shortDefinition: "A protocol that enables full-duplex, persistent communication between a client and server over a single TCP connection."
---

## Why does it exist?

HTTP follows a request-response model — the client asks, the server answers, and the connection is effectively idle until the next request. For applications that need real-time updates (chat, live scores, collaborative editing), this model forces wasteful workarounds like polling or long-polling. WebSockets were standardized in 2011 (RFC 6455) to provide a persistent, bidirectional channel where both client and server can send messages at any time without the overhead of repeated HTTP handshakes.

## Practical example of use

A collaborative document editor like Google Docs uses WebSockets to sync changes between users. When User A types a sentence, the browser sends the operation over an open WebSocket connection to the server. The server processes the change, applies conflict resolution (via operational transforms or CRDTs), and immediately pushes the update to User B's open WebSocket connection — all within milliseconds, without either client needing to poll for changes.

```js
// Server (Node.js with ws)
const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    // Broadcast the edit to all other clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(data);
      }
    });
  });
});

// Client (browser)
const ws = new WebSocket("ws://localhost:8080");
ws.onopen = () => ws.send(JSON.stringify({ op: "insert", pos: 12, text: "Hello" }));
ws.onmessage = (event) => applyRemoteEdit(JSON.parse(event.data));
```

## When to use

- Real-time applications: chat systems, multiplayer games, live notifications, collaborative editing
- Financial dashboards or trading platforms that need sub-second price updates
- IoT systems where devices push telemetry data continuously to a backend
- Any scenario where the server needs to push data to the client without the client requesting it

## When to avoid

- Standard CRUD applications where request-response is sufficient — WebSockets add unnecessary complexity
- When clients are mostly reading data that changes infrequently — Server-Sent Events (SSE) is simpler for one-way server-to-client streaming
- Environments where persistent connections are impractical, such as serverless platforms (AWS Lambda) that charge per execution time

## Trade-offs

- **Real-time communication vs. infrastructure complexity**: Instant bidirectional messaging, but you must manage connection state, reconnection logic, and horizontal scaling with sticky sessions or a pub/sub layer like Redis.
- **Low latency vs. resource consumption**: No repeated handshakes or headers, but each open connection holds a socket on the server, limiting how many concurrent users a single instance can handle.
- **Protocol efficiency vs. ecosystem support**: Binary frames and minimal overhead, but WebSockets bypass HTTP caching, load balancer features, and standard middleware — requiring additional configuration for proxies like Nginx or HAProxy.

## Common small mistakes

- Not implementing reconnection logic with exponential backoff on the client, causing users to lose real-time updates after a brief network interruption
- Scaling horizontally without a shared pub/sub system (Redis, NATS) — users connected to different server instances cannot communicate with each other
- Sending large payloads over WebSockets instead of using them for lightweight event notifications and fetching heavy data via REST
- Forgetting to implement heartbeat/ping-pong frames to detect and clean up dead connections that consume server resources
