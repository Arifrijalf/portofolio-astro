# ARCHITECTURE.md

## Stack

| Layer | Choice |
| --- | --- |
| Meta-framework | Astro 7 (static output) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` (single `global.css`) |
| UI framework | React 19 islands (`@astrojs/react`) |
| 3D | Three.js 0.185 (vanilla, no fiber/drei) |
| Icons | lucide (`createIcons`, `data-lucide` attrs) |
| Hosting | Cloudflare Pages (wrangler) |

## Directory tree

```
public/
  favicon-v2.ico|png
  _headers                 # CSP + caching
  video1.mp4, video2.mp4   # unused
  scripts/stars.js         # unused
src/
  assets/                  # profile-photo.jpg, project-*.jpg (Astro Image)
  components/
    BootScreen.astro       # PCB boot log overlay
    Navigation.astro       # sticky nav + mobile menu
    Hero.astro             # name, title, tagline, CTAs + 3D scene
    About.astro            # philosophy, education, interests, photo
    Skills.astro           # 7 category pinout cards
    Projects.astro         # 3 project component cards
    Experience.astro       # circuit-trace timeline
    Certificates.astro     # cert card
    GitHub.astro           # contribution graph image
    Contact.astro          # channels + Formspree form
    Footer.astro           # copyright + social links
    islands/
      ThreeScene.tsx       # React island: procedural 3D scene
  layouts/
    BaseLayout.astro       # grid bg, cursor, BootScreen, Nav, main, main.ts
  pages/
    index.astro            # all sections in order
  scripts/
    main.ts                # all client interactivity
  styles/
    global.css             # @theme tokens + custom classes + keyframes
```

## Component responsibilities

- **BaseLayout** renders: `.schematic-grid` bg, `#cursor` crosshair, `<BootScreen/>`, `<Navigation/>`, `<main>` slot, and loads `main.ts`. No per-section CSS.
- **index.astro** section order: `Hero → About → Skills → Projects → Experience → Certificates → GitHub → Contact → Footer`.
- **ThreeScene** (React island, `client:only="react"`): builds chip/gear/traces/orbit procedurally, mouse-parallax group, rAF loop, full cleanup on unmount. Desktop-only (>1024px, else renders nothing). `prefers-reduced-motion` → single static frame, no loop.
- **Navigation**: brand `ARIF_RIJAL` + 5 links (about/skills/projects/experience/contact) with `.nav-link`; `#mobile-menu` expandable panel; menu open/close lucide icons.

## Scripts (`src/scripts/main.ts`)

Runs on `DOMContentLoaded` → `init()`:

- `initIcons()` — lucide `createIcons({ icons })`.
- `initCursor()` — crosshair lerp (rAF, ×0.2), skipped on `pointer: coarse`.
- `initReveal()` — `[data-reveal]` IntersectionObserver (threshold 0.12, rootMargin `0 -40px`).
- `initNav()` — `is-scrolled` on `scrollY > 50`; smooth anchor scroll; mobile menu toggle (`maxHeight` swap, icon hidden-toggle, `aria-expanded`).
- `initNavTilt()` — desktop only (`pointer: fine`, not reduced-motion): per-link `--rx`/`--ry` vars lerped (×0.15) toward cursor targets (max 8°), reset on mouseleave.
- `initBoot()` — percent counter (90ms, `+5..14`), at 100 → `.boot-done` wipe + remove overlay; 4s hard fallback.
- `initContactForm()` — POST to Formspree (`https://formspree.io/f/mqevrdnv`), body `JSON.stringify(Object.fromEntries(formData))`, `Accept: application/json`; validates name ≥3 / message ≥20, 5s rate limit, honeypot `_gotcha`, button busy/success/error states.
- `initDownloadCv()` — HEAD `/ArifRijalFadhilah_CV.pdf`; ok+pdf → open, else `alert('Maaf, CV belum di-update')`.

## Data flow

- All content is **static** in the `.astro` components (see CONTENT.md — single source of truth).
- The only runtime data is: boot percentage, cursor/nav-tilt pointer positions, scroll reveals, form submission.
- No server, no API calls except Formspree + GitHub graph image.

## Deploy pipeline

`npm run build` (Astro static → `dist/`) → `wrangler pages deploy dist`. See DEPLOYMENT.md.
