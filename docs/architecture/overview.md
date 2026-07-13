# Architecture

> See [`/docs/appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) for a full list of known code/docs discrepancies. This document has been corrected against the actual codebase as of the 2026-07 documentation audit.

## Overview

This project is a full-stack monorepo with three distinct layers that communicate only through defined interfaces.

```
Browser
  └── Next.js Frontend (Vercel)
        └── REST API calls
              └── Express Backend (Render)
                    └── Prisma ORM
                          └── PostgreSQL (Supabase)

Media: any HTTPS image URL (next.config.ts allows all hostnames).
Cloudinary is a *suggested convention* for hosting those images — see note below.
```

---

## Stack

| Layer | Technology | Version | Hosting |
|---|---|---|---|
| Frontend | Next.js App Router | 16.x | Vercel |
| UI Library | React | 19.x | — |
| Language | TypeScript | 5.x | — |
| Styling | Tailwind CSS | 4.x | — |
| Animation | Framer Motion | 12.x | — |
| Forms | React Hook Form + Zod | 7.x / 4.x | — |
| Backend | Express | 5.x | Render |
| Backend Language | TypeScript (tsx) | 5.x / 6.x | — |
| ORM | Prisma | 7.x | — |
| Database | PostgreSQL | — | Supabase |
| Auth | JWT (jsonwebtoken) | 9.x | — |

> **Not part of the real stack, despite being listed as dependencies:** `@react-three/fiber`, `@react-three/drei`, `three` (no importing component exists anywhere in `frontend/src`), `next-themes` (superseded by the hand-rolled `ThemeProvider.tsx`), `axios` (superseded by native `fetch` in `lib/api.ts`), backend's `express-validator` and `multer` (no route uses them). Treat these as removal candidates, not architecture.
>
> **Media storage is not actually Cloudinary-integrated.** There is no Cloudinary SDK, upload widget, or `cloudinary` package anywhere in the code. Admin image fields are plain text inputs that accept *any* URL — the placeholder text just suggests the Cloudinary URL format as a convention. `next.config.ts` allows `remotePatterns: [{ protocol: 'https', hostname: '**' }]`, i.e. any HTTPS host works. Document this as "bring your own image URL, Cloudinary suggested," not as a wired-up storage layer.

---

## Layer Boundaries

### Frontend (Next.js)
- Presentation layer only — renders data fetched from the backend API.
- Server Components fetch data on the server using `fetch()` with `next.revalidate`.
- Client Components use `useEffect` + local state for interactive sections (admin forms, filters).
- Never imports Prisma, backend modules, or database drivers.
- All API calls go through `src/lib/api.ts` — a typed fetch wrapper.

### Backend (Express)
- Owns all business logic, input validation, and database access.
- Route files define paths and attach middleware only — no query logic inline.
- All mutations require a valid JWT via the `authenticate` middleware.
- Returns consistent JSON shapes: `{ ...data }` on success, `{ error: "message" }` on failure.

### Database (PostgreSQL via Prisma)
- Single source of truth for all content.
- Schema defined in `backend/prisma/schema.prisma`.
- The Prisma client is instantiated once in `backend/src/lib/prisma.ts` and imported across routes.
- Uses the PrismaPg adapter for connection pooling via Supabase's pgBouncer.

---

## Monorepo Layout

```
MY_PORTFOLIO_WEBSITE/
├── package.json              # Root workspace scripts
├── frontend/                 # Next.js 16 application
│   ├── src/
│   │   ├── app/              # App Router pages and layouts
│   │   │   ├── page.tsx      # Home page (SSR)
│   │   │   ├── about/        # About page
│   │   │   ├── projects/     # Projects listing + [slug] detail
│   │   │   ├── research/     # Research listing + [slug] detail
│   │   │   ├── certifications/ # Certifications listing + [slug] detail
│   │   │   ├── achievements/ # Achievements listing + [slug] detail
│   │   │   └── admin/        # Protected CMS (login, dashboard, CRUD)
│   │   ├── components/
│   │   │   ├── sections/     # Full-page section components
│   │   │   ├── admin/        # AdminShell, AdminTable, Modal
│   │   │   └── ui/           # Reusable primitives
│   │   └── lib/
│   │       ├── api.ts        # Typed fetch wrapper + authHeader helper
│   │       └── types.ts      # Shared TypeScript interfaces
│   └── package.json
└── backend/
    ├── src/
    │   ├── index.ts          # Express app entry point + CORS + route mounting
    │   ├── lib/
    │   │   └── prisma.ts     # Prisma client singleton
    │   ├── middleware/
    │   │   └── auth.ts       # JWT verify middleware
    │   ├── routes/           # One file per resource (see API reference)
    │   └── seed.ts           # Idempotent database seed script
    ├── prisma/
    │   └── schema.prisma     # All database models
    └── package.json
```

---

## Authentication Flow

Moved to its own document with full sequence diagrams: [`authentication-flow.md`](./authentication-flow.md). Summary: JWT-based, 7-day expiry, token in `localStorage`, route protection is client-side only (no `middleware.ts`).

---

## Rendering Strategy

| Page | Strategy | Revalidation |
|---|---|---|
| Home (`/`) | Server Component (SSR) | Per-request |
| About (`/about`) | Server Component (SSR) | Per-request |
| Project detail (`/projects/[slug]`) | Server Component (SSR) | Per-request |
| Research detail (`/research/[slug]`) | Server Component (SSR) | Per-request |
| Certification detail (`/certifications/[slug]`) | Server Component (SSR) | Per-request |
| Achievement detail (`/achievements/[slug]`) | Server Component (SSR) | Per-request |
| Site settings (theme, meta) | Server Component | `revalidate: 300` (5 min) |
| Admin panel | Client Components | On-demand |

---

## CORS Policy

The backend allows origins defined in the `FRONTEND_URL` environment variable (comma-separated list).

```
Development:  http://localhost:3000
Production:   https://abirbarman.com
```

Credentials are enabled (`credentials: true`) to support future cookie-based auth upgrades.

---

## Related Architecture Docs

This overview is the entry point; each topic below has its own deep-dive doc with Mermaid diagrams:

| Doc | Covers |
|---|---|
| [`folder-architecture.md`](./folder-architecture.md) | Annotated folder structure, including the dead `controllers/`/`prisma/` scaffolding |
| [`routing-architecture.md`](./routing-architecture.md) | Full route table, no route groups, no `middleware.ts` |
| [`component-hierarchy.md`](./component-hierarchy.md) | How components compose, public site and admin panel |
| [`rendering-strategy.md`](./rendering-strategy.md) | SSR/revalidation table and the homepage double-fetch issue |
| [`state-management.md`](./state-management.md) | Why there's no Redux/Zustand, and what state actually exists |
| [`theme-architecture.md`](./theme-architecture.md) | Dark/light resolution, FOUC prevention, theme-aware logo |
| [`animation-architecture.md`](./animation-architecture.md) | Framer Motion conventions and where animation lives |
| [`authentication-flow.md`](./authentication-flow.md) | Login sequence, JWT verification, client-side-only route guard |
| [`cms-flow.md`](./cms-flow.md) | Content authoring → API → DB → public site |
| [`research-management-flow.md`](./research-management-flow.md) | Research content type end-to-end as a worked example |
| [`deployment-architecture.md`](./deployment-architecture.md) | Vercel + Render + Supabase topology |
| [`performance-architecture.md`](./performance-architecture.md) | Architecture-level performance characteristics |
| [`security-architecture.md`](./security-architecture.md) | Security posture at the architecture level |
| [`future-architecture.md`](./future-architecture.md) | Every open architectural decision and planned improvement |
