---
title: "Semantic Versioning"
letter: "S"
categories:
  - "devops"
shortDefinition: "A versioning scheme that uses a three-part number (MAJOR.MINOR.PATCH) to communicate the nature of changes in a release."
---

## Why does it exist?

Software depends on other software. A web application depends on dozens of packages, each of which depends on dozens more. When a dependency releases a new version, consumers need to know: will upgrading break my code? Without a shared convention, version numbers are meaningless -- is version 2.0 a breaking change or just a marketing rebrand?

Semantic Versioning (SemVer) establishes a universal contract. Given a version number `MAJOR.MINOR.PATCH`, increment the MAJOR version for incompatible API changes, MINOR for backward-compatible new functionality, and PATCH for backward-compatible bug fixes. With this contract in place, package managers can automatically resolve compatible updates, and developers can make informed upgrade decisions at a glance.

## Practical example of use

A team maintains a shared utility library used by several internal projects. Here is how they version their releases:

```text
1.0.0   Initial stable release
1.0.1   Fix: corrected timezone handling in date formatter (PATCH)
1.1.0   Add: new currency formatting function (MINOR, backward-compatible)
1.1.1   Fix: currency formatter handles negative values correctly (PATCH)
1.2.0   Add: locale parameter to all formatting functions (MINOR)
2.0.0   BREAKING: rename formatDate() to dateFormat(), remove deprecated methods (MAJOR)
2.0.1   Fix: dateFormat() handles leap years correctly (PATCH)
2.1.0   Add: relative time formatting ("3 hours ago") (MINOR)
```

In `package.json`, consumers declare their tolerance for updates:

```json
{
  "dependencies": {
    "utils-lib": "^1.2.0"
  }
}
```

The `^` prefix tells npm: "install any version >=1.2.0 and <2.0.0." This means patch and minor updates install automatically, but the breaking 2.0.0 release requires an explicit, deliberate upgrade.

## When to use

- You publish a library, API, or package consumed by others who need predictable compatibility guarantees.
- Your project uses a package manager (npm, pip, Maven, Cargo) that relies on SemVer for dependency resolution.
- You want a clear, shared language for communicating the impact of releases across teams.
- Your CI/CD pipeline automates releases and needs rules for when to bump which part of the version.

## When to avoid

- Internal applications (not libraries) where there are no external consumers -- a simple build number or date-based version is often sufficient.
- Pre-1.0 software under active experimentation where the API changes frequently; SemVer technically allows any breaking change before 1.0.0.
- Marketing-driven version numbers where business stakeholders want a "version 5.0" for branding regardless of technical changes.

## Trade-offs

- **Predictability vs. subjective judgment**: SemVer gives consumers confidence, but deciding what counts as a "breaking change" is often a judgment call (is fixing a bug that people depended on a breaking change?).
- **Automated updates vs. false security**: Caret (`^`) and tilde (`~`) ranges automate minor and patch updates, but a MINOR release can still introduce subtle behavioral changes that break consumers despite being "backward-compatible."
- **Versioning discipline vs. version fatigue**: Strictly following SemVer means a small breaking change bumps the MAJOR version, which can lead to high version numbers (e.g., version 47.0.0) that feel excessive.

## Common small mistakes

- Introducing breaking changes in a MINOR or PATCH release because the author considers the change "small."
- Never reaching 1.0.0 out of fear of commitment, leaving consumers permanently on 0.x versions where any release can break things.
- Confusing SemVer with calendar versioning (CalVer) -- `2025.1.0` is not SemVer.
- Not documenting what constitutes the "public API" for the library, making it impossible to objectively determine whether a change is breaking.
- Forgetting pre-release identifiers (`2.0.0-beta.1`) for unstable releases, publishing experimental changes as stable versions.
