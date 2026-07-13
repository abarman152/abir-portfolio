# Performance Audit

**Version:** 1.0 · **Date:** 2026-07-06 · Static code analysis (no runtime profiling in this pass)
Cross-references: [bug-audit.md](bug-audit.md) · [fixes.md](fixes.md) · [technical-debt.md](technical-debt.md)

## Executive summary

The site is architecturally sound for performance: public list pages are statically prerendered with 5-minute revalidation, detail pages are server-rendered with 60s fetch revalidation, and fonts use `next/font` (self-hosted, no render-blocking font CSS). The two significant costs are (1) raw `<img>` tags on all user-facing images — no srcset, no automatic format optimization, no priority hints for the LCP hero image — and (2) admin/list pages shipped as full client components. During this audit 13 unused dependencies (including the entire three.js stack and axios) were removed from package.json, eliminating dead install weight and 6 high-severity advisories.

## Findings

| ID | Sev | Location | Evidence | Impact | Recommendation |
|----|-----|----------|----------|--------|----------------|
| PERF-001 | High | `Hero.tsx:440` | Raw `<img>` for hero/profile image | Likely LCP element: no preload/priority, no responsive sizes, no AVIF/WebP negotiation | Migrate to `next/image` with `priority` + Cloudinary remotePatterns; or add `fetchpriority="high"` + explicit dimensions as minimal fix |
| PERF-002 | Med | 12 further raw `<img>` sites (Certifications.tsx:44, AboutPageContent.tsx:234, CertDetail, ProjectDetail, AchievementDetail, certifications/page.tsx, admin pages) | ESLint `no-img-element` warnings | Unoptimized bandwidth, no lazy-loading guarantees below the fold | Public pages: `next/image`; admin previews: acceptable as-is (documented in technical-debt.md) |
| PERF-003 | Med | `app/{projects,research,achievements,certifications}/page.tsx` | Entire list pages are `'use client'` with client-side fetch + filter state | Full hydration cost for content that could be server-rendered; data fetched after JS loads (slower first content) | Working as designed for interactivity; a server-component shell with client filter islands would reduce JS — recorded as debt, not a required change |
| PERF-004 | Low | Same list pages | `useEffect(() => setPage(1), [filters])` causes one extra render per filter change (ESLint `set-state-in-effect` ×4) | Minor INP cost; imperceptible at this data size | Reset page inside filter event handlers if these pages grow |
| PERF-005 | Low | `Footer.tsx`, list cards | Inline-style hover via `onMouseEnter` mutating `style` | Style recalculation per event; bypasses CSS fast path | CSS `:hover` classes when convenient; not a blocker |
| PERF-006 | Info (fixed) | `frontend/package.json` | three, @react-three/fiber, @react-three/drei, @prisma/client, axios, react-hook-form, zod + 6 more had **zero imports** | Dead install weight; axios alone carried 6 high advisories. Tree-shaking kept them out of the bundle, so runtime was unaffected | **REMOVED in this audit** (verified zero references incl. dynamic imports/config before uninstall; build re-verified) |
| PERF-007 | Pass | `app/layout.tsx:3` | `Inter` + `JetBrains_Mono` via `next/font/google` with CSS variables | Self-hosted, subset, no layout-shifting font swap flash | None |
| PERF-008 | Pass | Build output | 18 static routes (revalidate 5m), 5 dynamic with `fetch revalidate: 60` + `AbortSignal.timeout(5000)` | Good caching posture; cold-backend recovery handled client-side (HomePageClient) | None |
| PERF-009 | Pass | `backend/src/index.ts:39-44` | API sends `Cache-Control: no-store` while frontend uses Next's fetch cache (`revalidate`) | Coherent: Next caches at the framework layer; CDN/proxy caching of the API is correctly disabled for a CMS-backed site | None |

## Safe-optimization shortlist (zero behavioral risk)

1. **Done:** remove unused dependencies (PERF-006).
2. Add `width`/`height` (or aspect-ratio CSS) to the hero `<img>` to prevent CLS, and `fetchpriority="high"` — no visual change.
3. Add `loading="lazy"` to below-fold raw `<img>` tags (Certifications, detail galleries) if not already present.
4. `next/image` migration for public images — requires `images.remotePatterns` for Cloudinary in next.config; recommended but verify rendering afterwards (medium risk, deferred to a dedicated pass).

## Core Web Vitals assessment (static reasoning)

- **LCP:** dominated by hero image (PERF-001) on `/`; static pages elsewhere should be fast.
- **CLS:** main risks are undimensioned images (PERF-002) and client-mounted admin shell (`mounted` gate renders null first — admin only, not user-facing).
- **INP:** low risk; animations are framer-motion transforms; PERF-004/005 are minor.

Runtime Lighthouse/Web Vitals measurement is recommended post-deploy and recorded in release-readiness.md as a follow-up.
