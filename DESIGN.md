# DESIGN.md — PCB / Blueprint Aesthetic

## Direction

Dark technical blueprint. The site reads like a manufactured device:

- **Schematic grid** background (faint cyan lines on deep graphite) — like blueprint graph paper.
- **Circuit-trace accents** — thin cyan lines and traces decorate panels.
- **Silkscreen labels** — mono uppercase micro-labels (`ARIF_RIJAL`, `PIN-01`) like text printed on a PCB.
- **Component cards** — sections are styled as mounted components/chips with corner brackets.
- **Terminal/coordinate touches** — mono coordinates, status readouts, boot log.

Nothing flashy; everything looks like it was **designed for precision manufacturing**.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--color-background` | `#0a0f16` | Page base (deep blue-graphite) |
| `--color-panel` | `#0e1520` | Card/section panels |
| `--color-panel-high` | `#131c2b` | Raised panels |
| `--color-gridline` | `#1a2433` | Borders, dividers |
| `--color-trace` | `#00E5FF` | Cyan accent (traces, active states) |
| `--color-copper` | `#FFB000` | Copper accent (pins, highlights) |
| `--color-text-primary` | `#e6edf3` | Primary text |
| `--color-text-secondary` | `#7d8ca3` | Muted text / labels |
| `--color-error` | `#ff4444` | Errors |

## Typography

- **Space Grotesk** (300–700) — display/headings, body.
- **Space Mono** (400/700) — silkscreen labels, coordinates, boot readout, code.

## Signature elements

### Boot screen
Fullscreen mono log: `PCB SYSTEMS v2.6 — OK`, `MOUNT: ARIF RIJAL FADHILAH`, `CHECK: MEM OK | FLASH OK | IO OK`, then `BOOT/INITIALIZING {percent}%` with a progress bar. On 100% the panel wipes upward (`.boot-done` → `bootWipe` keyframes) and reveals the site.

### Custom cursor
Small crosshair (two 1px crossing lines, `mix-blend-difference`), follows the mouse with a lerp (rAF, ×0.2). Hidden on touch devices (`pointer: coarse`).

### Navigation hover
Links animate on hover/tap (`.nav-link`):
- **Caret** `>` slides in from the left.
- **Scan sweep** — a cyan light gradient sweeps across the text (`.::after`, `background-position` transition).
- **3D tilt** (desktop only) — the link rotates toward the cursor (`perspective(600px)`, `--rx`/`--ry` vars, max 8°, JS lerp).
- Text turns cyan with a subtle glow (`text-shadow`). `:active` covers mobile tap.

### Scroll reveal
`[data-reveal]` blocks fade + rise (`translateY(24px) → 0`) when scrolled into view (IntersectionObserver, threshold 0.12). Disabled under `prefers-reduced-motion`.

### 3D scene (desktop only, >1024px)
Procedural scene behind the hero: rotating **chip** (box + gold pins + cyan edges), a **gear** meshed with the chip, random radial **circuit traces** (line segments), and an **orbit ring of copper particles**. Mouse parallax tilts the whole group. No models, no textures, no Draco. Falls back to a static frame under `prefers-reduced-motion`.

### 3D GitHub Repo Universe (GitHub section)
Physics-based interactive galaxy of repository modules:
- **Soccer-ball PCB texture**: Procedurally generated icosphere texture (`makeSoccerTexture`) — cyan pentagons on graphite, PCB-trace edges, `mix-blend` difference for readability.
- **Language-colored label sprites**: Each repo gets a canvas-rendered label (repo name + language) with a language-colored dot (TypeScript blue, C++ pink, Python blue, etc.).
- **Rapier physics**: Zero-gravity `<Physics>`, `<RigidBody>` + `<BallCollider>` per repo. Drag → spring-damped follow cursor. Release → impulse throw + sparkle burst.
- **Spring return**: Custom spring constants (`HOME_STIFFNESS`, `HOME_DAMPING`) pull repos back to their home positions. Settles to sleep when close enough.
- **Boundary push**: Repos pushed back inside the viewport bounds to prevent escaping.
- **CameraRig**: Mouse-driven parallax on camera position, smooth lerp, auto-fit FOV based on repo spread.
- **RoomEnv**: HDR environment lighting via `RoomEnvironment` PMREM for consistent metallic reflections.
- Falls back to non-WebGL GitHub activity graph image (`.sr-only` links for SEO).

## Interactivity rules

- `prefers-reduced-motion: reduce` → animations/reveals disabled, 3D renders one static frame, RepoUniverse sparkles disabled.
- Touch devices: no custom cursor, no 3D tilt (only caret + scan sweep on tap), RepoUniverse uses `pointermove` drag.
- Content and design are **original**; the PPL-licensed source design was not reused.
