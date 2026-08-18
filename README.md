# Portofolio Astro

Portfolio website for **Arif Rijal Fadhilah** — Embedded Systems Engineer & IoT Developer.

Built from scratch with a **PCB / blueprint aesthetic**: schematic grid background, circuit-trace accents, terminal/monospace touches, cyan + copper on deep graphite. Original design — no copied templates.

Hosted on **Cloudflare Pages**. Custom domain: [arifrijalfadhilah.fun](https://arifrijalfadhilah.fun)

## Stack

- **Astro v7** + **Tailwind CSS v4** (`@tailwindcss/vite`)
- **React 19** islands (`@astrojs/react`) — only the 3D scene is an island
- **Three.js 0.185** — vanilla, no fiber/drei
- **lucide** — inline icons
- **wrangler** — local preview + Cloudflare Pages deploy

## Features

- PCB boot screen (mono `BOOT/INITIALIZING {percent}%` readout, panel wipe)
- Custom crosshair cursor (mix-blend, rAF lerp)
- Original procedural 3D scene (chip + gear + circuit traces + orbit particles, mouse parallax, desktop-only)
- **3D GitHub Repo Universe** — physics-based interactive galaxy of repos (R3F + Rapier), draggable soccer-ball modules with spring return, language-colored textures, hover/select panel
- Sticky nav with scan-sweep + caret hover and cursor-following 3D tilt
- Scroll reveal via IntersectionObserver
- GitHub Activity Graph (fallback for non-WebGL)
- Contact form via Formspree (rate-limited, honeypot-protected)
- CV download with availability check

## Quick start

```bash
npm install
npm run dev        # or: astro dev --background
npm run build      # static build -> dist/
npm run preview    # build + serve dist locally (port 8788)
npm run deploy     # build + wrangler pages deploy dist
```

## Documentation

| Doc | Content |
| --- | --- |
| [DESIGN.md](./DESIGN.md) | Aesthetic direction, palette, fonts, key effects |
| [STYLE.md](./STYLE.md) | Design tokens + custom CSS classes reference |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, component tree, data flow |
| [CONTENT.md](./CONTENT.md) | All site content (verbatim, single source of truth) |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Cloudflare Pages, CSP, deploy workflow |

## License

All code and design in this repository is original and licensed under the project's own terms. The previous design source (Portfolio-Website) is **PPL v1.0 licensed** and its design/assets were not reused.
