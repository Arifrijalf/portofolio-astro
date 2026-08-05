# Graph Report - portofolio-astro  (2026-08-05)

## Corpus Check
- 24 files · ~41,878 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 98 nodes · 107 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b9a773fc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.astro
- main.ts
- dependencies
- package.json
- tsconfig.json
- scripts
- ThreeScene.tsx
- stars.js
- Portofolio Astro
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `init()` - 9 edges
2. `scripts` - 6 edges
3. `allowScripts` - 6 edges
4. `ThreeScene()` - 5 edges
5. `include` - 4 edges
6. `Portofolio Astro` - 4 edges
7. `initNav()` - 3 edges
8. `engines` - 2 edges
9. `@astrojs/react` - 2 edges
10. `@tailwindcss/vite` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 1 - "main.ts"
Cohesion: 0.35
Nodes (10): closeMobileMenu(), init(), initBoot(), initContactForm(), initCursor(), initDownloadCv(), initIcons(), initNav() (+2 more)

### Community 2 - "dependencies"
Cohesion: 0.10
Nodes (21): astro, @astrojs/react, lucide, dependencies, astro, @astrojs/react, lucide, react (+13 more)

### Community 3 - "package.json"
Cohesion: 0.13
Nodes (14): allowScripts, esbuild@0.28.1, sharp@0.34.5, sharp@0.35.3, workerd@1.20260708.1, workerd@1.20260722.1, devDependencies, wrangler (+6 more)

### Community 4 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): **/*, astro/tsconfigs/strict, .astro/types.d.ts, dist, ./worker-configuration.d.ts, exclude, extends, include

### Community 5 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, astro, build, deploy, dev, preview

### Community 6 - "ThreeScene.tsx"
Cohesion: 0.60
Nodes (5): buildChip(), buildGear(), buildOrbit(), buildTraces(), ThreeScene()

### Community 7 - "stars.js"
Cohesion: 0.60
Nodes (4): addShootingStar(), draw(), drawStaticStars(), resize()

### Community 8 - "Portofolio Astro"
Cohesion: 0.40
Nodes (4): Build, Deployment, Features, Portofolio Astro

## Knowledge Gaps
- **38 isolated node(s):** `name`, `type`, `version`, `node`, `dev` (+33 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _38 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.astro` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._