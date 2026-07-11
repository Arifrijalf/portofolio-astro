# Portofolio Astro

Portfolio website migrated from Vite/Vanilla JS to **Astro**.
Hosted on **Cloudflare Pages**.
Custom domain: [arifrijalfadhilah.fun](https://arifrijalfadhilah.fun)

## Features
- Astro v7 & Tailwind CSS v4
- Smooth slideshow (videos + images) with asset preloading
- GitHub Activity Graph
- Contact form with Formspree & EmailJS fallback
- Responsive design
- CV download with availability check

## Build
```bash
npm install
npm run build
```

## Deployment
Deployed automatically to Cloudflare Pages via GitHub integration.
- Build command: `npm run build`
- Build output directory: `dist`
- Deploy command: `npx wrangler pages deploy dist --project-name portofolio-astro`
