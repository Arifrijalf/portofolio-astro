# Graph Report - portofolio-astro  (2026-08-04)

## Corpus Check
- 24 files · ~41,971 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 79 nodes · 80 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `04a04970`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- dependencies
- package.json
- tsconfig.json
- allowScripts
- stars.js
- Portofolio Astro
- BaseLayout.astro
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `scripts` - 6 edges
2. `allowScripts` - 6 edges
3. `include` - 4 edges
4. `Portofolio Astro` - 4 edges
5. `goToNext()` - 3 edges
6. `onVideoEnded()` - 3 edges
7. `scheduleNext()` - 3 edges
8. `engines` - 2 edges
9. `@tailwindcss/vite` - 2 edges
10. `astro` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 1 - "main.ts"
Cohesion: 0.27
Nodes (3): goToNext(), onVideoEnded(), scheduleNext()

### Community 2 - "dependencies"
Cohesion: 0.22
Nodes (9): astro, lucide, dependencies, astro, lucide, tailwindcss, @tailwindcss/vite, tailwindcss (+1 more)

### Community 3 - "package.json"
Cohesion: 0.13
Nodes (14): devDependencies, wrangler, engines, node, name, scripts, astro, build (+6 more)

### Community 4 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): **/*, astro/tsconfigs/strict, .astro/types.d.ts, dist, ./worker-configuration.d.ts, exclude, extends, include

### Community 5 - "allowScripts"
Cohesion: 0.33
Nodes (6): allowScripts, esbuild@0.28.1, sharp@0.34.5, sharp@0.35.3, workerd@1.20260708.1, workerd@1.20260722.1

### Community 7 - "stars.js"
Cohesion: 0.60
Nodes (4): addShootingStar(), draw(), drawStaticStars(), resize()

### Community 8 - "Portofolio Astro"
Cohesion: 0.40
Nodes (4): Build, Deployment, Features, Portofolio Astro

## Knowledge Gaps
- **31 isolated node(s):** `name`, `type`, `version`, `node`, `dev` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `allowScripts` connect `allowScripts` to `package.json`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._