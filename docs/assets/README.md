# Assets Inventory

Static assets live in `frontend/public/`, not under this docs directory — this page is a reference inventory, not asset storage (see [`../standards/markdown-and-diagram-standard.md`](../standards/markdown-and-diagram-standard.md) for where doc-authored images/diagrams belong instead).

## Inventory

| Asset | Location | Purpose |
|---|---|---|
| Favicons (16/32/apple-touch/android-chrome) | `frontend/public/*.png`, `favicon.ico` | Browser/OS icons — stabilized for Google Search indexing per commit `57c58f8` |
| `og-image.png` | `frontend/public/og-image.png` | Open Graph social share image, 1200×630 |
| `site.webmanifest` | `frontend/public/site.webmanifest` | PWA manifest |
| `branding/logo-black.png`, `branding/logo-white.png` | `frontend/public/branding/` | The two variants rendered simultaneously by `ThemeLogo` — see [`../architecture/theme-architecture.md`](../architecture/theme-architecture.md) |

## Untracked legacy assets

An `Archive/` directory exists at the repo root (gitignored, not part of the build) containing pre-rebrand logo/favicon variants. See [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #19 — recommended for local deletion once confirmed unneeded, not migrated here.

## Content images (projects, research, etc.)

Not stored as repo assets at all — every content image is an admin-entered HTTPS URL. See [`../features/image-handling-convention.md`](../features/image-handling-convention.md).
