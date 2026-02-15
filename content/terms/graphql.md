---
title: "GraphQL"
letter: "G"
categories:
  - "explain-architecture"
  - "create-system-design"
  - "back-end-applications"
  - "front-end-applications"
shortDefinition: "A query language for APIs that lets clients request exactly the data they need in a single request."
---

## Why does it exist?

Facebook created GraphQL in 2012 to solve a problem their mobile apps faced: REST endpoints either returned too much data (wasting bandwidth) or too little (requiring multiple round trips). GraphQL gives clients a typed schema and the power to specify exactly which fields and relationships they need in a single query, eliminating both over-fetching and under-fetching.

## Practical example of use

A social media app needs to display a user's profile page showing their name, avatar, last 5 posts, and each post's comment count. Instead of calling `GET /users/7`, then `GET /users/7/posts?limit=5`, then `GET /posts/:id/comments/count` for each post, the client sends one GraphQL query: `{ user(id: 7) { name, avatar, posts(last: 5) { title, commentCount } } }`. The server resolves all the data and returns a single JSON response shaped exactly like the query.

```graphql
# Query
query {
  user(id: 7) {
    name
    avatar
    posts(last: 5) {
      title
      commentCount
    }
  }
}

# Response
{
  "data": {
    "user": {
      "name": "Jane",
      "avatar": "https://cdn.example.com/jane.jpg",
      "posts": [
        { "title": "GraphQL Tips", "commentCount": 12 },
        { "title": "API Design", "commentCount": 8 }
      ]
    }
  }
}
```

## When to use

- Mobile applications where bandwidth and round trips are expensive
- Frontend-heavy products where multiple teams consume the same backend with different data needs
- Applications with deeply nested or interconnected data models (social graphs, content management)
- When you want a strongly typed, self-documenting API contract via the schema

## When to avoid

- Simple CRUD APIs with one or two consumers that have uniform data needs
- File upload or download-heavy services where REST or dedicated protocols are more natural
- When your team lacks experience with GraphQL and the project timeline does not allow for the learning curve

## Trade-offs

- **Flexible queries vs. server complexity**: Clients get exactly what they need, but the server must implement resolvers, handle query depth, and guard against expensive queries.
- **Single endpoint vs. caching difficulty**: One URL for all queries simplifies routing, but HTTP-level caching (CDNs, browser cache) no longer works out of the box — you need application-level caching with tools like Apollo Cache or Relay.
- **Strong typing vs. schema management**: The schema serves as a contract and documentation, but evolving it across teams requires careful coordination and tooling like schema registries.

## Common small mistakes

- Not setting query depth or complexity limits, allowing clients to craft queries that overload the server
- Building a 1:1 mapping between GraphQL types and database tables instead of designing the schema around client use cases
- Using GraphQL for everything, including simple internal services where REST or gRPC would be lighter
- Ignoring the N+1 problem in resolvers — always use DataLoader or equivalent batching to avoid flooding the database
