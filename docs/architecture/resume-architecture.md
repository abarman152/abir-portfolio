# Resume System Architecture

## Single source of truth

```
┌────────────────────────────────────────────────────────────┐
│  PostgreSQL (Supabase)                                     │
│  HeroContent.resumeUrl · resumePreviewUrl · updatedAt      │
└──────────────────────────┬─────────────────────────────────┘
                           │ Prisma
┌──────────────────────────▼─────────────────────────────────┐
│  Express backend                                           │
│  GET /api/hero            (public read)                    │
│  PUT /api/hero            (auth; validates resumeUrl       │
│                            is http(s) or empty → 400)     │
└──────┬───────────────────────────────┬─────────────────────┘
       │ server-side fetch             │ client fetch (cached)
┌──────▼──────────────┐        ┌───────▼─────────────────────┐
│  Home page (RSC)    │        │  lib/resume.ts              │
│  page.tsx           │        │  useResume() hook           │
│   └─ Hero section   │        │   └─ /resume page           │
│      (props)        │        │      (ResumeClient)         │
└─────────────────────┘        └─────────────────────────────┘
       ▲                                ▲
       │ renders resumeUrl              │ navigates only — no fetch
       │ via shared helpers             │
┌──────┴────────────────────────────────┴─────────────────────┐
│  Navbar: <Link href="/resume"> (desktop + mobile drawer)    │
└─────────────────────────────────────────────────────────────┘
```

## Module boundaries
- **`frontend/src/lib/resume.ts`** is the only place that knows *how* to validate, transform, and fetch resume URLs. Pure helpers (`isValidResumeUrl`, `resumeDownloadUrl`, `isLikelyEmbeddablePreview`, `previewUrlHint`) plus one hook (`useResume`).
- **No Resume Context** — deliberately. The navbar doesn't need data (it navigates), the Hero gets props from the home page's existing server fetch, and only `/resume` fetches client-side. A context/provider would add an app-wide subscription for a single consumer.
- **No new API endpoint** — `HeroContent` already carried `resumeUrl`; reusing `GET /api/hero` keeps admin, hero, and resume page trivially consistent.

## Caching & request strategy
| Consumer | Requests |
|---|---|
| Navbar | 0 — pure navigation |
| Hero | 0 client-side — server data via home page `Promise.all` |
| `/resume` | 1 per session — `useResume()` module-level cache + in-flight promise deduplication (StrictMode double-effects share one request) |

`retry()` clears nothing but re-runs the effect; on success the cache repopulates. The cache is per-page-load (module state), so a hard refresh always refetches — admin URL changes propagate on next load without any invalidation machinery.

## Validation layers
1. **Admin form** (`/admin/settings`): inline error + blocked save on invalid URL; "Open resume ↗" link when valid.
2. **Backend** (`PUT /api/hero`): rejects non-http(s), non-empty `resumeUrl` with 400 — protects against non-UI writes.
3. **Render-time** (`isValidResumeUrl`): public UI treats anything invalid as missing, so bad data can never produce a broken link.

## Download semantics
Cross-origin anchors ignore the `download` attribute, so `resumeDownloadUrl()` injects Cloudinary's `fl_attachment` transformation (`…/upload/fl_attachment/…`) for Cloudinary-hosted files. Other hosts open in a new tab (`target="_blank"` fallback on the same anchor).

## Related
- [`../features/resume-system.md`](../features/resume-system.md)
- [`../development/resume-flow.md`](../development/resume-flow.md)
- [`routing-architecture.md`](./routing-architecture.md)
