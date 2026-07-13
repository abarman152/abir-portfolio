# Audit Change Log

**Version:** 1.1 · **Date:** 2026-07-13 · Branch: `antygravity-migration`
Repository-level release history lives in [/CHANGELOG.md](../CHANGELOG.md); this file logs changes made by agent sessions.

## 2026-07-13 — Centralized Resume System

### Frontend
- `src/lib/resume.ts` — **new** shared resume module: `isValidResumeUrl`, `resumeDownloadUrl` (Cloudinary `fl_attachment`), `isEmbeddableResume`, cached `useResume()` hook with in-flight deduplication.
- `src/app/resume/page.tsx`, `src/app/resume/ResumeClient.tsx` — **new** `/resume` page (metadata export; loading / error+retry / missing / populated states; PDF preview iframe; Download + Open-in-tab actions; last-updated metadata; responsive `.resume-grid`).
- `src/components/Navbar.tsx` — dead `href="#"` Resume anchors (desktop + mobile drawer) → `<Link href="/resume">` with `aria-label`, active state (`aria-current="page"`), drawer auto-close.
- `src/components/sections/Hero.tsx` — Resume CTA gated by `isValidResumeUrl`, href through `resumeDownloadUrl` + `download` attribute; `aria-label` added.
- `src/app/admin/settings/page.tsx` — Resume URL field: inline validation (blocks save), placeholder, "Open resume ↗" preview link, `aria-invalid`/`aria-describedby`.
- `src/lib/types.ts` — `HeroContent.updatedAt?` added (already in Prisma schema).
- `src/app/sitemap.ts` — `/resume` static route added.

### Backend
- `src/routes/hero.ts` — `PUT /api/hero` rejects non-empty, non-http(s) `resumeUrl` with 400.

### Documentation
`docs/features/resume-system.md`, `docs/pages/resume-page.md`, `docs/components/resume-button.md`, `docs/architecture/resume-architecture.md`, `docs/development/resume-flow.md` — **new**.

### Verified
`tsc --noEmit` (frontend + backend) clean; `next build` passes with `/resume` in route table; lint at pre-existing baseline (no new issues); runtime-verified in browser: all four page states, navbar navigation + active state, mobile drawer link, single deduplicated `/api/hero` request per load, retry recovery, mobile 375px layout.

---

## 2026-07-06 — Production-readiness audit

## Source changes

### Frontend
- `src/components/admin/AdminShell.tsx` — Sidebar hoisted from render scope to JSX variable (BUG-001); `aria-label` on hamburger + theme-toggle buttons (A11Y-003).
- `src/components/Footer.tsx` — contact anchor `<a>` → `next/link` (BUG-003).
- `src/app/admin/about/page.tsx` — lucide `Image`→`ImageIcon` alias, `GripVertical` removed, quotes escaped (BUG-004/005/007).
- `src/app/admin/settings/page.tsx` — `Image`→`ImageIcon`, unused destructure voided (BUG-005/007).
- `src/app/projects/page.tsx` — unused `ProjectsResponse` import removed (BUG-007).
- `src/lib/api.ts` — fallback port 5000→5001 (BUG-010); scoped 401 intercept with token clear + login redirect (BUG-016).
- `src/app/admin/dashboard/page.tsx` — error state + banner (BUG-015).
- `src/components/sections/Contact.tsx` — status timers ref'd + cleaned up (BUG-014); `aria-live` on submit button (A11Y-006).
- `src/components/ThemeProvider.tsx` — `MotionConfig reducedMotion="user"` wrapper (A11Y-001).
- `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/loading.tsx` — **new** (BUG-018).
- `package.json` — next 16.2.4→16.2.10, eslint-config-next aligned; **removed 13 unused deps**: axios, @prisma/client, react-hook-form, @hookform/resolvers, zod, three, @types/three, @react-three/fiber, @react-three/drei, class-variance-authority, tailwind-merge, clsx, next-themes (BUG-008, PERF-006).

### Backend
- `src/index.ts` — fail-fast env validation (DATABASE_URL, JWT_SECRET); global JSON error handler (403 CORS / sanitized 500) (BUG-013).
- `src/routes/auth.ts` — `authLimiter` (10/15min) on login + setup; setup email/password validation (BUG-011/012).
- `package-lock.json` — `npm audit fix` applied (BUG-009).

## Documentation added
`docs/bug-audit.md`, `bug-report.md`, `fixes.md`, `performance-audit.md`, `security-audit.md`, `accessibility-audit.md`, `seo-audit.md` (agent-generated), `testing-report.md`, `known-issues.md`, `technical-debt.md`, `verification-report.md`, `change-log.md` (this file), `release-readiness.md`, `post-audit-summary.md`, `docs/memory/` (3 lessons).

## Not changed (deliberately)
See [technical-debt.md](technical-debt.md) — notably the 17 `set-state-in-effect` patterns, raw `<img>` migration, and admin CRUD input validation.
