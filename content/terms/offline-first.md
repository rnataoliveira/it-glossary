---
title: "Offline-First"
letter: "O"
categories:
  - "mobile"
  - "architecture"
shortDefinition: "An architectural approach where an app is designed to work fully without a network connection by default, treating connectivity as an enhancement rather than a requirement."
---

## Why does it exist?

Most apps are built with the implicit assumption that a network connection is always available. When connectivity drops — in a subway, on a plane, in a rural area — the app shows spinners, error screens, or blank pages. Offline-first flips this assumption: the app reads from and writes to a local data store first, and syncs with the server in the background whenever connectivity is available. This model acknowledges that mobile users frequently encounter unreliable or absent network conditions, and that a degraded experience in those moments erodes trust in the product.

The approach gained traction alongside mobile development, where intermittent connectivity is the norm rather than the exception, and with the rise of local-first software principles that prioritize immediate responsiveness and user data ownership.

## Practical example of use

A field inspection app used by engineers on construction sites must work in basements and remote areas with no signal. Using an offline-first architecture, all inspection forms, site data, and reference documents are synced to the device when connectivity is available. Engineers fill out inspections, take photos, and mark defects — all writes go to a local SQLite database (via something like WatermelonDB or Realm) with a sync queue. When the engineer returns to an area with connectivity, the app automatically uploads all queued changes and fetches any updates from other inspectors. The engineer never sees a loading spinner during field work; the network is purely a background concern.

## When to use

- Apps used in environments with unreliable connectivity: field work, travel, remote areas, dense urban transit
- Productivity apps (notes, tasks, documents) where users expect to work at any time regardless of network state
- Apps where perceived performance is critical — reading from a local cache is always faster than a network round-trip
- Any app where data loss due to connectivity failures would be unacceptable (forms, journaling, collaborative docs)

## When to avoid

- Real-time applications where stale data is unacceptable and the value entirely depends on live state (e.g., live trading, real-time collaborative editing with strict consistency requirements)
- Apps with highly sensitive data where local storage on the device creates a security risk that outweighs the UX benefits
- Simple CRUD apps where the product team has decided that connectivity is always a prerequisite and the added complexity is not justified

## Trade-offs

- **Resilient UX vs. sync complexity**: Users have a fast, always-available experience, but the sync layer that merges local and remote changes is one of the hardest problems in software — conflicts, ordering, and partial failures must all be handled explicitly
- **Local-first reads vs. eventual consistency**: The app always shows the user something immediately, but what it shows may be slightly stale until the next sync completes
- **Developer simplicity vs. infrastructure requirements**: Writing to a local store is simple; the complexity emerges in conflict resolution strategies (last-write-wins, CRDTs, operational transforms) and the backend infrastructure that processes sync queues

## Common small mistakes

- Building optimistic UI for writes without handling the case where the sync fails and the server rejects the operation — the UI shows success, the data never actually saves
- Not showing users any indication of sync status, so they do not know if their latest changes have been uploaded or are still pending
- Treating all data as needing offline support when in practice only a subset is accessed offline — sync only what is necessary to avoid storage bloat and sync overhead
- Not handling clock skew between devices, which causes last-write-wins conflict resolution to produce incorrect results when device clocks are wrong
- Not testing with airplane mode and with simulated slow/flaky connections, which are the conditions that reveal edge cases in sync logic
