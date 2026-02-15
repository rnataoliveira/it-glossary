---
title: "Micro Frontends"
letter: "M"
categories:
  - "frontend"
  - "architecture"
shortDefinition: "An architectural pattern that decomposes a monolithic frontend into smaller, independently deployable applications owned by separate teams."
---

## Why does it exist?

As frontend applications grow, a single monolithic codebase becomes a coordination bottleneck. Every team merges into the same repository, shares the same build pipeline, and risks breaking each other's features. Micro frontends apply the same decomposition principle behind backend microservices to the frontend: each team owns a vertical slice of the product, from the UI down to the data layer, and can develop, test, and deploy independently.

This pattern is especially valuable in large organizations where multiple teams contribute to a single user-facing product. The checkout team should not have to wait for the search team's release cycle to ship a bug fix. Micro frontends give each team autonomy over their technology choices, release cadence, and internal architecture while still presenting a unified experience to the end user.

## Practical example of use

A retail company splits its storefront into three micro frontends: product catalog, shopping cart, and user profile. Each is a separate application with its own repository and CI/CD pipeline. The host application loads them at runtime using Webpack Module Federation:

```javascript
// webpack.config.js (host app)
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        cart: "cart@https://cart.example.com/remoteEntry.js",
        profile: "profile@https://profile.example.com/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
};
```

The host application renders a shell with a header and navigation, then lazily loads the cart and profile micro frontends into designated regions of the page. Each remote team deploys independently, and the host picks up the latest version automatically.

## When to use

- When the frontend is large enough that a single codebase creates merge conflicts, slow builds, and coordination overhead across multiple teams.
- When teams need autonomy to choose their own frameworks, libraries, or release schedules without affecting others.
- When independent deployability is a business requirement, allowing critical bug fixes in one area without redeploying the entire application.
- When the organization is structured around domain-oriented teams (checkout, search, account) that map naturally to separate frontend slices.

## When to avoid

- When the application is small or maintained by a single team, where the operational overhead of multiple deployments and shared contracts outweighs the benefits.
- When a consistent user experience is paramount and the team lacks the discipline to enforce shared design systems across micro frontends.
- When the performance budget is tight, because loading multiple independently bundled applications increases total JavaScript payload and can hurt Time to Interactive.
- When the team does not have the infrastructure maturity (CI/CD, monitoring, versioning) to support multiple independently deployed frontends.

## Trade-offs

- **Team autonomy vs. user experience consistency**: Independent teams can move fast, but without a shared design system and communication protocols, the product can feel disjointed.
- **Independent deployments vs. integration complexity**: Each micro frontend deploys on its own, but the host must handle loading, error boundaries, routing, and shared state across independently built applications.
- **Technology freedom vs. payload duplication**: Teams can pick different frameworks, but if two micro frontends both bundle React, the user downloads it twice unless shared dependencies are carefully coordinated.

## Common small mistakes

- Sharing too much state between micro frontends, which couples them tightly and negates the independence that motivated the architecture.
- Not investing in a shared design system, leading to visual inconsistencies that confuse users and undermine the unified product feel.
- Letting micro frontend boundaries follow technical layers (header, sidebar, footer) instead of business domains, which creates cross-team dependencies for every feature.
- Ignoring performance implications of loading multiple remote bundles, especially on slower networks and devices.
- Overcomplicating communication between micro frontends with custom event buses or global stores when simple URL-based routing or browser events would suffice.
