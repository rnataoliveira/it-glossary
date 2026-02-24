---
title: "Push Notifications"
letter: "P"
categories:
  - "mobile"
  - "backend"
shortDefinition: "Server-initiated messages delivered to a user's device even when the app is not actively in use, routed through platform notification services like APNs or FCM."
---

## Why does it exist?

Mobile apps cannot maintain persistent connections to servers without draining the battery — the operating system aggressively suspends background apps. Push notifications solve this by delegating message delivery to always-on platform infrastructure: Apple Push Notification service (APNs) for iOS and Firebase Cloud Messaging (FCM) for Android. The app registers with the platform, receives a device token, and sends that token to the server. When the server needs to reach the user, it sends the message to APNs or FCM, which wake the device and deliver the notification without the app needing to be running.

## Practical example of use

A food delivery app tracks an order in real-time. When the driver picks up the order, the backend receives the status update, looks up the customer's device token in the database, and calls FCM's API with a payload: `{ title: "Your order is on the way", body: "Estimated arrival: 12 minutes" }`. FCM routes the message to the customer's Android device. The OS displays the notification in the system tray even though the app is in the background. The customer taps it, the app opens to the live tracking screen with the driver's location. The entire delivery chain happens with zero battery impact from a persistent connection.

## When to use

- Re-engaging users with time-sensitive information: order updates, messages, alerts, breaking news
- Delivering transactional confirmations: payment receipts, booking confirmations, verification codes
- Triggering silent background data refreshes so the app has fresh content ready when the user opens it
- Any scenario where the information is valuable enough to interrupt the user and the timing is controlled by a server event

## When to avoid

- Marketing blasts and promotions sent without clear user consent or relevance — users disable notifications or uninstall apps in response
- Non-urgent information that is better surfaced passively when the user opens the app (e.g., a feed update that can wait)
- High-frequency updates (every few seconds) that should use a WebSocket or polling once the app is open instead

## Trade-offs

- **Server control vs. platform gatekeeping**: Your server decides when to send, but APNs and FCM control delivery — messages can be delayed, throttled, or dropped under heavy load or poor connectivity
- **Re-engagement vs. notification fatigue**: Push notifications increase retention when relevant, but irrelevant or excessive notifications cause users to opt out, losing the channel permanently
- **Simple API vs. platform fragmentation**: Sending a notification is a simple HTTP call, but handling delivery across iOS, Android, web, and their different permission models, payload limits, and delivery guarantees adds complexity

## Common small mistakes

- Storing device tokens indefinitely without handling token rotation — tokens change when users reinstall apps or restore devices, and stale tokens must be cleaned up when APNs or FCM return registration errors
- Not requesting notification permissions at the right moment — asking on first app launch before demonstrating value leads to high denial rates; ask after the user completes an action that makes notifications obviously useful
- Sending the same push to all users regardless of preferences or timezone, resulting in 3am notifications that immediately get disabled
- Not handling notification taps — the user expects tapping a notification to deep-link to the relevant screen, not just open the app's home screen
- Putting sensitive data (full message content, personal identifiers) directly in the push payload, which is visible to the OS and potentially to third-party notification services
