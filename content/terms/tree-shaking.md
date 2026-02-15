---
title: "Tree Shaking"
letter: "T"
categories:
  - "frontend"
  - "performance"
shortDefinition: "A dead-code elimination technique used by bundlers to remove unused exports from JavaScript modules, reducing the final bundle size."
---

## Why does it exist?

Modern JavaScript applications depend on dozens or hundreds of libraries, but they rarely use every function a library exports. Without tree shaking, the bundler includes the entire library in the output, shipping kilobytes or even megabytes of code the user never executes. Tree shaking analyzes the import graph using ES module static structure to determine which exports are actually referenced and drops everything else.

The name comes from the mental image of shaking a tree so that dead leaves fall off. When a bundler like Webpack, Rollup, or esbuild processes your application, it builds a dependency graph starting from the entry point. Any export that no import path leads to is considered dead code and is excluded from the final bundle. This directly translates into faster downloads, faster parsing, and better performance for end users.

## Practical example of use

The way you import a module determines whether tree shaking can do its job. Named imports from ES module packages give the bundler the information it needs to eliminate unused exports:

```javascript
// GOOD: named imports allow tree shaking
import { debounce } from "lodash-es";

// BAD: imports entire library, no tree shaking
import _ from "lodash";
const debounce = _.debounce;

// GOOD: deep import path (older pattern)
import debounce from "lodash/debounce";
```

In the first example, the bundler knows you only need `debounce` and can exclude the hundreds of other functions in lodash-es. In the second example, the default import pulls in the entire library because the bundler cannot statically determine which properties of `_` you will access at runtime. The third example works but relies on the library's internal file structure rather than the bundler's analysis.

## When to use

- When you are building production bundles and want to minimize the JavaScript payload sent to users.
- When your application imports from large utility libraries (like lodash, date-fns, or Ramda) but only uses a fraction of their exports.
- When you are authoring a library and want consumers to benefit from tree shaking by publishing ES module output.
- When performance budgets are in place and you need measurable reductions in bundle size.

## When to avoid

- When the dependency you are importing does not publish ES modules (only CommonJS), since tree shaking relies on static `import`/`export` syntax.
- When you genuinely use most of a library's exports, in which case tree shaking provides minimal benefit and is not worth optimizing for.
- When you are working on a server-side application where bundle size does not affect end-user download times.
- When debugging production issues, as aggressive tree shaking can make stack traces harder to follow if source maps are not configured properly.

## Trade-offs

- **Smaller bundles vs. build complexity**: Tree shaking adds analysis time to the build process and requires the entire dependency graph to use ES modules for maximum effectiveness.
- **Static analysis vs. dynamic patterns**: Tree shaking only works with statically analyzable imports. Dynamic `require()` calls, namespace re-exports, and barrel files can defeat the analysis.
- **Library authoring burden vs. consumer benefit**: For tree shaking to work, library authors must publish ES module builds, mark side effects correctly, and avoid patterns that prevent static analysis.

## Common small mistakes

- Using default imports or namespace imports (`import * as lib`) from large libraries, which prevents the bundler from dropping unused exports.
- Not setting `"sideEffects": false` in the library's `package.json`, causing the bundler to assume every file might have side effects and refusing to drop it.
- Relying on barrel files (`index.ts` that re-exports everything) without understanding that some bundlers struggle to tree-shake through them efficiently.
- Assuming tree shaking happens automatically without verifying the output, when in reality misconfiguration can silently include dead code.
- Confusing tree shaking with code splitting; tree shaking removes unused code from bundles, while code splitting breaks the bundle into smaller chunks loaded on demand.
