# Repository Audit Report

**Date:** 2026-07-03
**Branch audited:** `antygravity-migration`
**Scope:** Full frontend + backend repository, as the foundation for the documentation rebuild tracked in this `/docs` directory.

This is the point-in-time audit that this documentation set was built from. Individual docs elsewhere in `/docs` are the living, maintained reference — this report is a historical snapshot plus the raw findings that drove the [technical debt register](./technical-debt-register.md).

---

## 1. Folder structure

**Root:**
```
MY_PORTFOLIO_WEBSITE/
├── .gitignore
├── LICENSE
├── README.md
├── CHANGELOG.md        (added by this audit)
├── CONTRIBUTING.md     (added by this audit)
├── CODE_OF_CONDUCT.md  (added by this audit)
├── SECURITY.md         (added by this audit)
├── backend/
├── docs/
├── frontend/
└── package.json        (root workspace scripts)
```

Removed from the tracked root by this audit: `pr.txt` (superseded by `CHANGELOG.md`; left on disk for the user to delete). `Archive/` (legacy branding assets, untracked) was added to `.gitignore` rather than deleted, since it wasn't this audit's call to remove real files without the user's confirmation.

**backend/ (second level):**
```
backend/
├── .env / .env.example / .gitignore
├── dist/                 (compiled output, gitignored)
├── prisma/schema.prisma
├── prisma.config.ts
├── src/
│   ├── controllers/       (empty — dead scaffolding, unused)
│   ├── index.ts
│   ├── lib/ (notifications.ts, prisma.ts)
│   ├── middleware/ (auth.ts)
│   ├── prisma/             (empty — dead scaffolding, unused)
│   ├── routes/ (about, achievements, auth, categories, certifications, contact,
│   │            dashboard, hero, heroBadges, notificationSettings, projects,
│   │            research, settings, skills, social, stats — 16 files)
│   └── seed.ts
└── tsconfig.json
```

**frontend/ (second level):**
```
frontend/
├── .env.local / .gitignore
├── AGENTS.md, CLAUDE.md (pointer to AGENTS.md)
├── eslint.config.mjs, next-env.d.ts, next.config.ts, postcss.config.mjs
├── public/ (favicons, branding/logo-black.png, branding/logo-white.png, og-image.png)
├── src/
│   ├── app/                (see pages/ docs for full route list)
│   ├── components/
│   │   ├── Footer.tsx, HomePageClient.tsx, Navbar.tsx, ThemeLogo.tsx, ThemeProvider.tsx
│   │   ├── admin/ (AdminShell.tsx, AdminTable.tsx, Modal.tsx)
│   │   ├── sections/ (About, AboutPageContent, Achievements, Certifications, Contact,
│   │   │              Hero, Impact, Projects, Research, Skills, Stats — 11 files)
│   │   └── ui/ (PaperCard.tsx — only one primitive)
│   └── lib/ (api.ts, date.ts, types.ts)
└── vercel.json
```

## 2. Architecture

Next.js 16.2.4 App Router frontend, Express 5.2.1 REST backend, PostgreSQL via Prisma 7.8.0 (PrismaPg adapter, Supabase pgBouncer pooling). No GraphQL/tRPC — plain REST, frontend calling the backend via `NEXT_PUBLIC_API_URL`. Full detail in [`architecture/overview.md`](../architecture/overview.md).

`backend/src/controllers/` and `backend/src/prisma/` are empty directories — dead scaffolding not actually used; all logic lives in `routes/*.ts`.

## 3. Pages/routes

10 public routes (5 list pages, 5 with `[slug]` detail pages) + 15 admin routes. Full inventory in [`pages/`](../pages/). No route groups exist despite `AGENTS.md` describing one.

## 4. Components

~20 component files: 11 section components, 3 admin components, 1 UI primitive (`PaperCard`), 5 root-level standalone components. Full inventory in [`components/`](../components/).

## 5. Layouts

Root layout (fonts, FOUC-prevention theme script, `ThemeProvider`), admin layout (metadata only, no auth gating), and `template.tsx` (page-transition animation wrapper). Full detail in [`layouts/`](../layouts/).

## 6. Features

Contact form, Resend-based admin email notifications, admin password management, theme-aware transparent logo system, SEO/favicon setup, custom CMS content model, dashboard analytics, Markdown-based rich content fields. Full detail in [`features/`](../features/). React Three Fiber/Three.js dependencies are present but **unused** — no importing component exists anywhere.

## 7. Hooks

**None exist.** No custom hooks directory or files. All stateful logic is inlined per-component. Documented as a gap in [`hooks/README.md`](../hooks/README.md) and tracked as debt item #9 in the [technical debt register](./technical-debt-register.md).

## 8. Utilities/lib

`frontend/src/lib/`: `api.ts` (typed fetch wrapper), `types.ts` (all shared interfaces), `date.ts` (deterministic UTC date formatting). `backend/src/lib/`: `prisma.ts` (client singleton), `notifications.ts` (Resend email + HTML templates + manual `escapeHtml()`). Full detail in [`utilities/`](../utilities/).

## 9. Types

Centralized in `frontend/src/lib/types.ts` (296 lines). Hand-maintained and duplicates the Prisma schema rather than being generated from it — drift risk. Backend has no shared types file or DTO/Zod validation layer.

## 10. Constants/config

No dedicated `constants.ts` or `config/` directory. Configuration is spread across `next.config.ts` (permissive `remotePatterns: **`), `vercel.json` (cache headers only), and ~15 files with duplicated hardcoded API URL fallbacks (inconsistent port defaults — see debt item #7).

## 11. CMS

Custom-built — not a third-party headless CMS. Bespoke Express + Prisma admin API paired with a hand-built React admin UI. Full detail in [`cms/admin-panel-reference.md`](../cms/admin-panel-reference.md).

## 12. Admin panel

JWT auth (7-day expiry, bcrypt-hashed passwords), token in `localStorage`, guard implemented in `AdminShell.tsx` (client-side only, no `middleware.ts`). Manages 13 content sections. Full detail in [`cms/admin-panel-reference.md`](../cms/admin-panel-reference.md) and [`security/authentication.md`](../security/authentication.md).

## 13. APIs

~19 route files, ~70 endpoints total. Full reference in [`api/rest-api-reference.md`](../api/rest-api-reference.md).

## 14. Data flow

Admin writes → Express (JWT-protected) → Prisma → PostgreSQL. Public pages are Server Components fetching from the API per-request (mostly uncached). Homepage double-fetches (server + client) — see debt item #11. Contact form dispatches Resend emails asynchronously via `setImmediate`, non-blocking.

## 15. Routing

Static + `[slug]` dynamic routes. No `middleware.ts` anywhere — admin route protection is client-side only (see debt item #13).

## 16. Theme/styling

Tailwind CSS 4, CSS custom properties for dual dark/light theming, resolution priority `localStorage > system preference > DB default`. Theme-aware logo system renders both logo variants and CSS-toggles visibility to avoid flash. Full detail in [`design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md).

## 17. Assets

Favicons, OG image, and two logo variants under `frontend/public/`. An untracked `Archive/` directory at repo root holds legacy pre-rebrand branding assets — added to `.gitignore`, recommended for deletion by the user. `next.config.ts` allows any HTTPS image host.

## 18. SEO/metadata

Root metadata export (OG, Twitter card, full icon set), `robots.ts`, dynamic `sitemap.ts` (1hr revalidate, graceful fallback on fetch failure). `generateMetadata()` confirmed present on all 4 dynamic detail pages. No JSON-LD structured data found anywhere.

## 19. Performance

`next/image` used, `next/font/google` with `display: swap`. No `next/dynamic` code-splitting anywhere despite heavy unused 3D dependencies. Homepage double-fetch noted above. Full detail in [`performance/`](../performance/).

## 20. Security

JWT auth, bcrypt (cost 12), rate limiting only on `/api/contact` (not on login — debt item #12), CORS allowlist via `FRONTEND_URL`, `Cache-Control: no-store` on all API responses, manual (non-Zod) input validation, manual `escapeHtml()` for email XSS mitigation. **A live Supabase database password was found pasted into `backend/.env`** — gitignored, but flagged for credential rotation regardless (debt item #20). Full detail in [`security/`](../security/).

## 21. Accessibility

Not deeply audited. Positive signal: `Contact.tsx` has `aria-label`/`role="alert"`. Gaps observed: admin `Toggle` lacks `aria-pressed`/`role="switch"`; admin inputs generally lack `htmlFor`/`id` association, contradicting `AGENTS.md` §8.3.

## 22. Analytics

None integrated — no Vercel Analytics, GA, or any analytics package found.

## 23. Deployment

No Dockerfile, no `docker-compose`, no `.github/workflows`. `vercel.json` is headers-only. Intended split topology (Vercel + Render + Supabase) is documented but no `render.yaml` or other IaC exists — Render config is dashboard-only. `backend/package.json`'s `start` script pushes schema and reseeds on every boot (debt item #15).

## 24. Environment variables

Full reference in [`deployment/environment-variables.md`](../deployment/environment-variables.md). Notable: `CLOUDINARY_URL` is documented but unused by any code (debt item #1); `PORT` defaults are inconsistent across files (debt item #7); frontend has no `.env.example`.

## 25. Scripts

Root, frontend, and backend `package.json` scripts fully inventoried in [`development/setup-and-workflow.md`](../development/setup-and-workflow.md).

## 26. Dependencies

Key frontend deps: Next 16, React 19, Prisma client (unexpectedly present in frontend — debt item #5), Framer Motion, unused React Three Fiber/Drei/Three, React Hook Form + Zod, `react-markdown`/`remark-gfm`, Tailwind 4, unused `next-themes` and `axios`. Key backend deps: Express 5, Prisma 7 + `pg`, `bcryptjs`, `jsonwebtoken`, `cors`, `express-rate-limit`, unused `express-validator` and `multer`, `resend`.

## 27. Build system

Next.js's own bundler for frontend; `tsc` (production) / `tsx` (dev) for backend, no bundler, ships raw compiled JS. No monorepo tool — two independent npm projects orchestrated by root `package.json` scripts.

## 28. CI/CD

None found. No GitHub Actions, no other CI config. Deployment is presumably manual/git-push-triggered via Vercel's and Render's own Git integrations.

## 29. Technical debt

See the full [technical debt register](./technical-debt-register.md) — 20 items ranked by severity, including the two flagged as security-relevant (no rate limiting on login; a live DB credential found in a local `.env` file).

## 30. Existing documentation (pre-audit)

The repository already had a mature `docs/` directory (8 files, ~1,500 lines) plus a detailed `frontend/AGENTS.md` governance document, before this audit. That existing documentation was **reorganized and corrected** rather than replaced — see the [documentation index](../README.md) for the new structure and the [technical debt register](./technical-debt-register.md) for what was fixed.

## 31. Root file inventory (pre-audit)

`.gitignore`, `LICENSE`, `README.md`, `package.json`, `pr.txt` (stray PR description), `docs/` (8 files), `Archive/` (untracked legacy assets). Restructured per item 18–19 in the technical debt register.

---

## Open items requiring direct user judgment (not resolved by this audit)

1. **Rotate the Supabase database password** — a live credential was found in `backend/.env`. See debt item #20.
2. **`Archive/` disposition** — the directory is now gitignored so it can't be accidentally committed, but it still exists on disk. Delete it locally once you've confirmed you don't need the legacy branding files (`pr.txt` was in the same category and has already been deleted, since its content was fully preserved in `CHANGELOG.md`/`docs/releases/`).
3. **Decide whether to build real Cloudinary integration or formally drop it** — currently it's neither built nor removed from `.env.example`.
4. **Decide on the JWT storage tradeoff** (`localStorage` vs httpOnly cookie + CSRF) — a real architecture decision, not a quick fix.
