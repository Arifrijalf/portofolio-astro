# Graph Report - portofolio-astro  (2026-08-06)

## Corpus Check
- 34 files · ~106,244 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 204 nodes · 231 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7311a984`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.astro
- main.ts
- dependencies
- package.json
- tsconfig.json
- CONTENT.md — Site Content (single source of truth)
- ThreeScene.tsx
- stars.js
- ARCHITECTURE.md
- DEPLOYMENT.md
- CLAUDE.md
- DESIGN.md — PCB / Blueprint Aesthetic
- Impeccable Critique — PCB/Blueprint Portfolio (src/pages/index.astro)
- RepoUniverse.tsx
- STYLE.md — Design Tokens & CSS Classes

## God Nodes (most connected - your core abstractions)
1. `ThreeScene()` - 10 edges
2. `init()` - 10 edges
3. `CONTENT.md — Site Content (single source of truth)` - 10 edges
4. `Impeccable Critique — PCB/Blueprint Portfolio (src/pages/index.astro)` - 9 edges
5. `scripts` - 6 edges
6. `allowScripts` - 6 edges
7. `DESIGN.md — PCB / Blueprint Aesthetic` - 6 edges
8. `Signature elements` - 6 edges
9. `Portofolio Astro` - 6 edges
10. `STYLE.md — Design Tokens & CSS Classes` - 6 edges

## Surprising Connections (you probably didn't know these)
- `RepoPanelProps` --references--> `Repo`  [EXTRACTED]
  src/components/islands/repo-universe/RepoPanel.tsx → src/data/repos.ts
- `RepoUniverseProps` --references--> `Repo`  [EXTRACTED]
  src/components/islands/repo-universe/RepoUniverse.tsx → src/data/repos.ts

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 1 - "main.ts"
Cohesion: 0.32
Nodes (11): closeMobileMenu(), init(), initBoot(), initContactForm(), initCursor(), initDownloadCv(), initIcons(), initNav() (+3 more)

### Community 2 - "dependencies"
Cohesion: 0.06
Nodes (31): astro, @astrojs/react, @dimforge/rapier3d-compat, framer-motion, lucide, dependencies, astro, @astrojs/react (+23 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (20): allowScripts, esbuild@0.28.1, sharp@0.34.5, sharp@0.35.3, workerd@1.20260708.1, workerd@1.20260722.1, devDependencies, wrangler (+12 more)

### Community 4 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): **/*, astro/tsconfigs/strict, .astro/types.d.ts, dist, ./worker-configuration.d.ts, exclude, extends, include

### Community 5 - "CONTENT.md — Site Content (single source of truth)"
Cohesion: 0.15
Nodes (13): About — "Engineering Philosophy", Certificates, Contact channels, Contact form, CONTENT.md — Site Content (single source of truth), Education, Experience (2), Footer (+5 more)

### Community 6 - "ThreeScene.tsx"
Cohesion: 0.35
Nodes (10): buildBoard(), buildChip(), buildLed(), buildOrbit(), buildSignalDot(), buildSparkles(), buildTraceChords(), buildTraces() (+2 more)

### Community 7 - "stars.js"
Cohesion: 0.60
Nodes (4): addShootingStar(), draw(), drawStaticStars(), resize()

### Community 8 - "ARCHITECTURE.md"
Cohesion: 0.12
Nodes (12): Component responsibilities, Data flow, Deploy pipeline, Directory tree, Scripts (`src/scripts/main.ts`), Stack, Documentation, Features (+4 more)

### Community 9 - "DEPLOYMENT.md"
Cohesion: 0.18
Nodes (10): astro.config.mjs, Caching, Configuration, Content-Security-Policy, Deploy, Hosting, HTTP headers (`public/_headers`), Local (+2 more)

### Community 12 - "DESIGN.md — PCB / Blueprint Aesthetic"
Cohesion: 0.17
Nodes (11): 3D scene (desktop only, >1024px), Boot screen, Custom cursor, DESIGN.md — PCB / Blueprint Aesthetic, Direction, Interactivity rules, Navigation hover, Palette (+3 more)

### Community 13 - "Impeccable Critique — PCB/Blueprint Portfolio (src/pages/index.astro)"
Cohesion: 0.20
Nodes (9): Design Health Score (Nielsen heuristics, out of 32, 2 n/a), Design Specificity Verdict, Impeccable Critique — PCB/Blueprint Portfolio (src/pages/index.astro), Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Provocative Questions (+1 more)

### Community 14 - "RepoUniverse.tsx"
Cohesion: 0.13
Nodes (16): repoLinks, LANG_COLORS, RepoObject(), RepoObjectProps, RepoPanel(), RepoPanelProps, RepoUniverseProps, SPAWN (+8 more)

### Community 15 - "STYLE.md — Design Tokens & CSS Classes"
Cohesion: 0.29
Nodes (6): Custom classes, Fonts (loaded via Google Fonts), Keyframes, Responsive, STYLE.md — Design Tokens & CSS Classes, @theme tokens (Tailwind v4)

## Knowledge Gaps
- **97 isolated node(s):** `name`, `type`, `version`, `node`, `dev` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `CONTENT.md — Site Content (single source of truth)` connect `CONTENT.md — Site Content (single source of truth)` to `ARCHITECTURE.md`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.astro` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `ARCHITECTURE.md` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._