# IT Glossary

A developer's dictionary of technology terms — searchable, filterable, and designed for practical understanding.

Built for developers who want quick, structured explanations of core IT concepts. Each term goes beyond a simple definition to include why it exists, when to use it, trade-offs, and common mistakes.

**Live site** — [rnataoliveira.github.io/it-glossary](https://rnataoliveira.github.io/it-glossary/)

---

## Features

**Structured term pages** — Every term includes consistent sections: why it exists, practical examples, when to use, when to avoid, trade-offs, and common mistakes. No fluff, no filler.

**Search** — Filter terms instantly by typing. Matches against titles and definitions.

**A-Z navigation** — Jump to terms by letter. Unavailable letters are dimmed so you always know what exists.

**Category filters** — Filter terms by practical use case:

| Category | Example terms |
|---|---|
| Improve performance | Caching, Load Balancing, Rate Limiting |
| Explain architecture in a job interview | Microservices, SOLID, Trade-offs |
| Create a system design | CAP Theorem, Event-Driven Architecture, API Gateway |
| Avoid state bugs | Idempotency |
| Improve maintainability | Design Patterns, Technical Debt, CI/CD |
| Improve reliability | Observability, Rate Limiting, Load Balancing |

**Composable filtering** — Search, letter, and category filters work together. Combine them to narrow results precisely.

---

## Terms included

Caching · Scalability · Microservices · API Gateway · SOLID · Design Patterns · CI/CD · Load Balancing · Event-Driven Architecture · Observability · Technical Debt · CAP Theorem · Idempotency · Rate Limiting · Trade-offs

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) with App Router |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + Typography plugin |
| Content | Markdown files with YAML frontmatter |
| Parsing | gray-matter + remark + remark-html |
| Hosting | GitHub Pages (static export) |
| CI/CD | GitHub Actions |

---

## Project structure

```
it-glossary/
├── content/terms/              # One .md file per term (filename = URL slug)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with header
│   │   ├── page.tsx            # Home page (server component)
│   │   └── term/[slug]/
│   │       └── page.tsx        # Term detail page (SSG)
│   ├── components/
│   │   ├── Header.tsx          # Site header
│   │   ├── HomeClient.tsx      # Client component with search/filter state
│   │   ├── SearchBar.tsx       # Debounced search input
│   │   ├── AlphabetNav.tsx     # A-Z letter buttons
│   │   ├── CategoryFilter.tsx  # Category pill toggles
│   │   ├── TermCard.tsx        # Term preview card
│   │   ├── TermList.tsx        # Grid of term cards
│   │   └── TermSection.tsx     # Rendered markdown section
│   ├── lib/
│   │   ├── terms.ts            # Markdown parsing and data access
│   │   └── categories.ts       # Category definitions
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── next.config.ts              # Static export + basePath config
└── .github/workflows/
    └── deploy.yml              # Build and deploy to GitHub Pages
```

---

## Adding a new term

Create a markdown file in `content/terms/`:

```markdown
---
title: "Your Term"
letter: "Y"
categories:
  - "improve-performance"
  - "create-system-design"
shortDefinition: "A concise one-sentence definition."
---

## Why does it exist?
...

## Practical example of use
...

## When to use
...

## When to avoid
...

## Trade-offs
...

## Common small mistakes
...
```

The filename becomes the URL slug (`your-term.md` → `/term/your-term`). Push to `main` and the site rebuilds automatically.

### Available categories

- `architecture` — Architecture & Patterns
- `backend` — Backend
- `frontend` — Frontend
- `cloud` — Cloud & Platforms
- `devops` — DevOps & Infrastructure
- `data` — Data & Storage
- `security` — Security
- `testing` — Testing
- `ai-ml` — AI & Machine Learning
- `design-systems` — Design Systems
- `performance` — Performance & Scaling
- `reliability` — Reliability & Observability

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000/it-glossary](http://localhost:3000/it-glossary).

### Production build

```bash
npm run build
npx serve out
```

---

## Deployment

Deployment is automated via GitHub Actions. Every push to `main` triggers a build and deploy to GitHub Pages.

To set up on a new repo:

1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` — the workflow handles the rest

---

## Contributing

Want to add a term or suggest one? See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to participate.

---

## License

MIT
