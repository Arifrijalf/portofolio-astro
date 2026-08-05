# DEPLOYMENT.md

## Hosting

- Platform: **Cloudflare Pages**
- Project: `portofolio-astro`
- Custom domain: **https://arifrijalfadhilah.fun**
- Deployed via **GitHub integration** (repo `Arifrijalf/portofolio-astro`) or manually with wrangler.

## Local

```bash
npm install
npm run build      # Astro static build -> dist/
npm run preview    # build + wrangler pages dev dist (port 8788)
```

Dev server (background):

```bash
astro dev --background   # stop: astro dev stop | status: astro dev status | logs: astro dev logs
```

## Deploy

```bash
npm run deploy
```

Equivalent to `npm run build && npx wrangler pages deploy dist --project-name portofolio-astro`.

## Configuration

### wrangler.jsonc

- `pages_build_output_dir: ./dist`
- `compatibility_date: 2026-07-29` (pinned — local workerd is older than today)

### astro.config.mjs

- `output: 'static'`
- `compressHTML: true`
- Vite plugin: `tailwindcss()`
- React integration: `@astrojs/react`

## HTTP headers (`public/_headers`)

### Content-Security-Policy

```
default-src 'self'
script-src 'self' 'unsafe-inline'
style-src 'self' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' https://github-readme-activity-graph.vercel.app data: blob:
connect-src 'self' https://formspree.io blob:
frame-src 'none'
object-src 'none'
base-uri 'self'
form-action 'self' https://formspree.io
frame-ancestors 'none'
```

Notes:
- `img-src` allows the GitHub graph service + `blob:`/`data:` (3D canvas textures, image fallbacks).
- `connect-src` allows Formspree for the contact form + `blob:`.
- **No `wasm-unsafe-eval`** — no Draco/WASM in this project.

Other headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, HSTS (`max-age=31536000; includeSubDomains; preload`), `Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 1; mode=block`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`.

### Caching

- `/_astro/*`, `/assets/*`, `*.js`, `*.css` → `Cache-Control: public, max-age=31536000, immutable`
- Media (mp4/webp/jpg/png/svg/ico/pdf) → `max-age=31536000`

## Troubleshooting

- Preview serves stale CSP if the dev server was started before editing `_headers` — restart `wrangler pages dev`.
- Node engine: `>= 22.12.0`.
