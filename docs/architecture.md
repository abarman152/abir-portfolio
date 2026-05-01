# Architecture

## Overview

This project is a full-stack monorepo with three distinct layers that communicate only through defined interfaces.

```
Browser
  └── Next.js Frontend (Vercel)
        └── REST API calls
              └── Express Backend (Render)
                    └── Prisma ORM
                          └── PostgreSQL (Supabase)

Media assets: Cloudinary (object storage + CDN)
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
| 3D Rendering | React Three Fiber + Drei | 9.x / 10.x | — |
| Forms | React Hook Form + Zod | 7.x / 4.x | — |
| Backend | Express | 5.x | Render |
| Backend Language | TypeScript (tsx) | 5.x / 6.x | — |
| ORM | Prisma | 7.x | — |
| Database | PostgreSQL | — | Supabase |
| Media Storage | Cloudinary | — | Cloudinary |
| Auth | JWT (jsonwebtoken) | 9.x | — |

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

```
POST /api/auth/login
  { email, password }
    └── bcrypt.compare(password, hash)
          └── jwt.sign({ adminId }, JWT_SECRET, { expiresIn: '7d' })
                └── { token }

Subsequent admin requests:
  Authorization: Bearer <token>
    └── authenticate middleware
          └── jwt.verify(token, JWT_SECRET)
                └── req.adminId = decoded.adminId
                      └── next()
```

Token is stored client-side in `localStorage` by the admin panel. All admin API calls attach it via `authHeader(token)` from `src/lib/api.ts`.

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
