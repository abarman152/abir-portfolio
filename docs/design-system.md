# Design System

The portfolio uses a CSS custom property (variable) system for all design tokens. All tokens are defined in `frontend/src/app/globals.css`. Components must use these variables — never raw hex values.

---

## Visual Identity

| Attribute | Value |
|---|---|
| Style | Minimal, modern, Apple-inspired |
| Default theme | Dark |
| Background | Dark background with subtle gradients |
| Text | Light on dark |
| Accent | `--accent` (default `#6366f1` — indigo) |
| Font | Inter (body) + JetBrains Mono (code) |

---

## CSS Variables

| Variable | Role |
|---|---|
| `--accent` | Primary interactive color, links, CTAs |
| `--surface` | Card and section background (slightly lighter than bg) |
| `--border` | Subtle 1px border (low-opacity white or gray) |
| `--foreground` | Primary text |
| `--muted-foreground` | Secondary/caption text |
| `--background` | Page background |
| `--destructive` | Destructive actions (delete, error states) |
| `--font-inter` | Inter variable font |
| `--font-mono` | JetBrains Mono variable font |

The `defaultTheme` and `accentColor` are stored in `SiteSettings` and applied server-side on the `<html>` element to prevent flash of unstyled content.

---

## Typography

| Role | Weight | Notes |
|---|---|---|
| Hero name | 700–800 | Large, dominant |
| Section headings (`h2`) | 600–700 | Clear hierarchy |
| Body text | 400 | Readable, relaxed line height |
| Caption / muted | 400 | Smaller, `--muted-foreground` |
| Code | 400 | JetBrains Mono |

- Single font family across the site (Inter)
- Never mix font families without deliberate intent

---

## Theming

The site supports `dark` and `light` themes via `data-theme` attribute on `<html>`.

**Theme resolution priority (highest to lowest):**
1. `localStorage` value set by the user (via theme toggle)
2. `defaultTheme` from `SiteSettings` (server-side, prevents flash)
3. `:root` CSS default (dark)

The inline `<script>` in `app/layout.tsx` runs before paint to apply the stored `localStorage` value, overriding the server-set default if needed.

---

## Spacing

- Tailwind utility classes (`gap-4`, `p-6`, `mb-8`, etc.) — no custom spacing values
- Sections: generous vertical padding (`py-16` to `py-24`)
- Cards: consistent internal padding (`p-5` or `p-6`)

---

## Components

### Cards

- Full card surface is clickable
- Consistent `border-radius`, subtle `1px border`, `--surface` background
- Hover: subtle `scale(1.02)` + soft box-shadow glow

### Buttons

| State | Behavior |
|---|---|
| Default | Clear label, sufficient contrast |
| Hover | Visible color/brightness change |
| Active | Slight scale-down or press feedback |
| Disabled | `opacity-50`, `cursor-not-allowed` |
| Loading | Spinner replacing icon or label |

### Forms

- Every input has a visible label
- Validation errors appear inline below the relevant field
- Submit button disabled during in-flight requests
- Success/error feedback after submission

### Modals

- Focus is trapped inside
- Closes on `Escape` or backdrop click
- Destructive actions require a confirmation step

---

## Animation

### Principles

- Purposeful — guides attention or provides feedback, not decoration
- Minimal and subtle — nothing bouncy or distracting
- Respects `prefers-reduced-motion`

### Timing

| Purpose | Duration |
|---|---|
| Hover effects | 150–200ms |
| State transitions | 200–300ms |
| Page/section entry | 300–500ms |

Never exceed 500ms for a single animation. Never chain animations totalling more than 800ms.

### Scroll animations

- Pattern: `opacity: 0 → 1` + `translateY(12px) → 0`
- Implementation: Framer Motion `whileInView` with `once: true`
- Child stagger: max `0.08s` per item

### Hover effects

| Element | Effect |
|---|---|
| Cards | `scale(1.02)` + shadow glow |
| Buttons | Background color shift + brightness |
| Links | Underline slide or color fade |

### Forbidden patterns

- No spinning loaders on content (use skeletons)
- No bounce or elastic easing
- No parallax effects
- No auto-playing carousels

---

## Images

All images are served from **Cloudinary** with transformation URLs.

Standard transformations:
- `f_auto` — automatic format selection (WebP, AVIF, etc.)
- `q_auto` — automatic quality optimization
- `w_800,c_fill` — resized and cropped to fit

Next.js `<Image>` component is used with correct `width`, `height`, and `sizes` props for CLS prevention and lazy loading.
