# Contributing to IT Glossary

Thanks for your interest in contributing! This glossary grows one term at a time, and every contribution helps.

## Suggest a term

If you'd like to suggest a term but don't want to write the content yourself, [open a Term Suggestion issue](../../issues/new?template=term-suggestion.yml). Fill in the term name, why it should be included, and a suggested category.

## Add a term via Pull Request

1. **Fork** this repository
2. **Create a branch** from `main` (e.g. `add-term-websocket`)
3. **Add a markdown file** in `content/terms/` — the filename becomes the URL slug (`websocket.md` → `/term/websocket`)
4. **Open a Pull Request** targeting `main`

### Term file format

Every term file uses YAML frontmatter followed by markdown sections:

```markdown
---
title: "Your Term"
letter: "Y"
categories:
  - "architecture"
  - "backend"
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

All six sections are required. Keep explanations practical — focus on what a developer needs to know day-to-day.

### Available categories

| Slug | Label |
|---|---|
| `architecture` | Architecture & Patterns |
| `backend` | Backend |
| `frontend` | Frontend |
| `cloud` | Cloud & Platforms |
| `devops` | DevOps & Infrastructure |
| `data` | Data & Storage |
| `security` | Security |
| `testing` | Testing |
| `ai-ml` | AI & Machine Learning |
| `design-systems` | Design Systems |
| `performance` | Performance & Scaling |
| `reliability` | Reliability & Observability |

A term can belong to multiple categories.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/it-glossary](http://localhost:3000/it-glossary).

Run a production build to verify everything compiles:

```bash
npm run build
```

## PR expectations

- **One term per PR** — keeps reviews focused and easy to merge
- **Build must pass** — the CI workflow runs `npm run build` on every PR
- **Review required** — at least one maintainer approval before merge
- **Use the PR template** — fill in the checklist when you open your PR
