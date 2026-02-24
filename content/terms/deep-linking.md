---
title: "Deep Linking"
letter: "D"
categories:
  - "mobile"
shortDefinition: "A technique that uses URLs to open a mobile app directly to a specific screen or state, bypassing the home screen."
---

## Why does it exist?

A URL in a browser takes you directly to a specific page. Mobile apps historically had no equivalent — a link to a product could open the app store at best, or nothing at all. Deep linking brings URL-like navigation to native apps: a single URL can open an app installed on the device and navigate it to a specific screen with the correct context. This matters for sharing content, marketing campaigns, email CTAs, and push notification taps — all scenarios where users expect to land on the relevant content immediately rather than hunt for it after the app opens.

Modern deep linking has two layers: **URI schemes** (custom `myapp://product/123` links that only work if the app is installed) and **Universal Links / App Links** (standard HTTPS URLs that open the app if installed, or fall through to the website if not), which solve the problem of sending links to users who may not have the app.

## Practical example of use

An e-commerce app sends an abandoned cart email. The "Complete your purchase" button links to `https://shop.example.com/cart/abc123`. On a phone with the app installed, iOS intercepts this standard HTTPS URL and opens the app directly to the cart screen because `shop.example.com` is registered as an associated domain in the app. On a phone without the app, the same URL loads the mobile website, where the user can still complete the purchase. Both paths work from one URL, with no special handling required from the email sender.

## When to use

- Any content that users might share or receive via link: products, articles, profiles, events
- Marketing campaigns and email CTAs where landing the user on a specific screen dramatically improves conversion
- Push notification taps that should open a specific screen rather than the app's home screen
- Onboarding flows where a referral link should open the app pre-configured for the inviter's context

## When to avoid

- Screens that require authentication where the user arriving via link is not yet logged in — these require deferred deep linking to store the destination and redirect after login
- Highly dynamic screens whose state cannot be fully encoded in a URL (though most cases can be parameterized with some design effort)

## Trade-offs

- **Universal links vs. URI schemes**: HTTPS Universal Links fall through gracefully to the web when the app is not installed, but require server-side configuration (`apple-app-site-association` and `assetlinks.json` files). URI schemes (`myapp://`) require no server config but fail silently if the app is not installed
- **Seamless UX vs. configuration overhead**: Deep linking significantly improves user experience but requires coordination between the app team, backend, and sometimes marketing to maintain link mappings as screens change
- **Deferred deep linking vs. privacy**: Storing a destination link across an install to redirect the user after onboarding requires a third-party service (Branch, Firebase Dynamic Links) or a device fingerprinting approach, which has privacy implications

## Common small mistakes

- Only implementing URI schemes without Universal Links, so links sent to users without the app installed silently fail instead of falling back to the website
- Not testing deep links across both platforms and both scenarios (app installed, app not installed), as behavior differs significantly between iOS and Android
- Not handling the authentication edge case — if a deep link destination requires login, the app must store the target route and navigate there after sign-in rather than dropping the user at the home screen
- Hardcoding deep link paths in marketing materials or emails without a redirect layer, making it impossible to update paths if the app's navigation structure changes
- Not validating deep link parameters on the receiving screen, allowing malformed or malicious URLs to crash the app or expose unintended state
