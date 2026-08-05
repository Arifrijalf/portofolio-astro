# STYLE.md — Design Tokens & CSS Classes

All styles live in `src/styles/global.css` (Tailwind CSS v4, single file).

## Fonts (loaded via Google Fonts)

```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Space+Mono:wght@400;700&display=swap");
```

`--font-display: 'Space Grotesk'`, `--font-mono: 'Space Mono'`. Tailwind classes: `font-display`, `font-mono`.

## @theme tokens (Tailwind v4)

| Token | Value | Tailwind classes |
| --- | --- | --- |
| `--color-background` | `#0a0f16` | `bg-background`, `text-background` |
| `--color-panel` | `#0e1520` | `bg-panel` |
| `--color-panel-high` | `#131c2b` | `bg-panel-high` |
| `--color-gridline` | `#1a2433` | `border-gridline`, `bg-gridline` |
| `--color-trace` | `#00e5ff` | `text-trace`, `border-trace/30`, `bg-trace` |
| `--color-copper` | `#ffb000` | `text-copper`, `bg-copper` |
| `--color-text-primary` | `#e6edf3` | `text-text-primary` |
| `--color-text-secondary` | `#7d8ca3` | `text-text-secondary` |
| `--color-error` | `#ff4444` | `text-error` |

Base: dark color-scheme, smooth scroll, body bg `#0a0f16`, text `#e6edf3`, Space Grotesk, `overflow-x: hidden`. `::selection` cyan.

## Custom classes

| Class | Behavior |
| --- | --- |
| `.schematic-grid` | Fixed full-viewport blueprint grid (48px cell, cyan `rgba(0,229,255,0.04)` lines) + radial vignette `::after`. `pointer-events: none`, z-0. |
| `.corner-brackets` | Cyan 2px L-brackets (`::before`/`::after`, 14px) at top-left / bottom-right. |
| `.silkscreen` | Space Mono, 10px, `letter-spacing: .2em`, uppercase, muted. Variants `.silkscreen.trace` (cyan) and `.silkscreen.copper` (amber). |
| `.chip-card` | Panel card: bg `#0e1520`, 1px `#1a2433` border, cyan bracket `::before` top-left. Hover: cyan border + glow shadow + `translateY(-2px)`. |
| `.trace-line` | 1px cyan gradient line (divider). |
| `.pin-label` | Space Mono 9px muted label (e.g. `PIN-01`, `VALID // VERIFIED`). |
| `.cursor-crosshair` | Fixed 20px element, `mix-blend-difference`; `::before` vertical 1px line, `::after` horizontal. Centered via `translate(-50%,-50%)`. |
| `.nav-link` | Nav link effect: `position:relative`, `padding-left:1.1em`, `transform: perspective(600px) rotateX(var(--rx,0)) rotateY(var(--ry,0))`, `preserve-3d`, `will-change:transform`, color `.25s` transition. `::before` caret `>` (cyan, slides in), `::after` scan sweep (`linear-gradient(105deg, transparent 40%, rgba(0,229,255,.5) 50%, transparent 60%)`, `background-size:250% 100%`, `background-position -100%→200%` on hover, `.6s`). `:hover/:active/:focus-visible` → cyan + `text-shadow 0 0 12px rgba(0,229,255,.6)`. |
| `[data-reveal]` | Opacity 0, `translateY(24px)`, `.7s` transition; `.is-visible` → visible. Optional `--reveal-delay` var (delays 0.08–0.4s). |
| `.boot-screen` | Fullscreen fixed mono boot log, z-100, flex-center. `.boot-done` → `bootWipe` keyframes (translateY -100%, `.8s cubic-bezier(.76,0,.24,1)`). |
| `.no-scrollbar` | Hide scrollbar (`scrollbar-width:none` + webkit). |

## Keyframes

`blink`, `bootWipe`, `bootBar`, and reveal transitions. All animations gated: `@media (prefers-reduced-motion: reduce)` kills animation/transition and forces `[data-reveal]` visible.

## Responsive

- Desktop >1024px: nav 3D tilt + full layout.
- `<1024px`: mobile menu, no custom cursor/tilt, no 3D scene.
- Sections stack to single column on small screens (Tailwind `grid-cols-1 → lg:grid-cols-N`).
