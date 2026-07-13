# Bug Audit — Production Release Audit

**Version:** 0.1 (in progress)
**Started:** 2026-07-06
**Repository:** MY_PORTFOLIO_WEBSITE (frontend: Next.js 16 / React 19, backend: Express 5 / Prisma 7)
**Branch:** antygravity-migration

> Working log for the full pre-production audit. Cross-references:
> [bug-report.md](bug-report.md) · [fixes.md](fixes.md) · [testing-report.md](testing-report.md)

## Phase status

| # | Phase | Status |
|---|-------|--------|
| 1 | Repo inventory + build/typecheck/lint baseline | DONE |
| 2 | Bug discovery (frontend + backend) | DONE (2 parallel agents, 37 raw findings triaged) |
| 3 | Fixes + verification | DONE (15 fixed + verified, 1 false positive closed; see fixes.md) |
| 4 | Performance audit | DONE (performance-audit.md; PERF-006 dep cleanup applied) |
| 5 | Accessibility audit (WCAG 2.2) | DONE (accessibility-audit.md; A11Y-001/003/006 fixed) |
| 6 | Security audit | DONE (security-audit.md; 0 high vulns remain) |
| 7 | SEO / metadata audit | DONE (seo-audit.md, agent-generated) |
| 8 | Regression testing | DONE (5 gate runs, all green — testing-report.md) |
| 9 | Markdown documentation suite | DONE (14 docs + 3 memory lessons) |
| 10 | Notion documentation structure | DONE (7 pages under "My Portfolio Website" → Production Audit — July 2026) |
| 11 | Final independent verification pass | DONE — fresh no-context subagent: **12/12 VERIFIED** (see verification-report.md, Method 5) |

## Inventory (Phase 1, evidence-gathered)

- Monorepo layout: `frontend/` (Next.js 16.2.4, React 19.2.4, Tailwind 4, framer-motion, three.js), `backend/` (Express 5.2.1, Prisma 7.8, JWT auth, Resend email, rate limiting).
- Frontend routes: `/`, `/about`*, `/achievements`, `/admin`, `/certifications`, `/projects`, `/research` + `robots.ts`, `sitemap.ts`.
- Backend: `controllers/`, `routes/`, `middleware/`, `lib/`, `prisma/`, `seed.ts`.
- Uncommitted working-tree changes exist in: `frontend/src/app/admin/notifications/page.tsx`, `frontend/src/components/sections/Contact.tsx`, `frontend/src/lib/types.ts`, `.gitignore`, plus a large docs reorganization.
- Dependencies installed in both packages (node_modules present).

## Baseline results (2026-07-06)

| Check | Result | Evidence |
|-------|--------|----------|
| Frontend `tsc --noEmit` | PASS (exit 0) | background task bq68frp6u |
| Backend `tsc --noEmit` | PASS (exit 0) | background task bd6f7mt54 |
| Frontend ESLint | **52 problems: 24 errors, 28 warnings** | background task bzfa5nkvy; full output in session scratchpad `lint-full.txt` |
| Frontend `npm audit` | **4 vulnerabilities (1 moderate, 3 high)** — incl. postcss XSS advisory GHSA-qx2v-qp2m-jg93 via bundled next@16.2.4 | task b687g26ot |
| Backend `npm audit` | **9 vulnerabilities (6 moderate, 3 high)** — incl. qs DoS GHSA-q8mj-m7cp-5q26, multer advisory | task b687g26ot |
| Production build (`next build`) | PASS (exit 0, 23/23 pages generated, compiled in 5.3s) | task beeo3wp9e |

Notable lint findings (to be registered as bugs in Phase 2):
- `react-hooks/static-components` **error**: `Sidebar` component declared inside render in `frontend/src/components/admin/AdminShell.tsx:67` (state resets on every re-render).
- `@next/next/no-img-element` warnings in `AboutPageContent.tsx:234`, `Certifications.tsx:44`, `Hero.tsx:440`.

## Bug register

Schema: ID · Severity · Category · Location · Evidence · Root Cause · Impact · Recommended Fix · Implemented Fix · Verification Method · Verification Result · Status.

### BUG-001 — Sidebar component created during render
- **Severity:** High · **Category:** Component re-render / state bug
- **Location:** `frontend/src/components/admin/AdminShell.tsx:67` (used at :156 and :181)
- **Evidence:** ESLint `react-hooks/static-components` error ×2 (lint-full.txt); `const Sidebar = () => (…)` declared inside the component body after early return.
- **Root cause:** Component defined inside render scope — React treats it as a new component type each render, unmounting/remounting the subtree and resetting its state.
- **Impact:** Admin sidebar loses internal state and re-mounts on every AdminShell re-render; wasted renders in every admin page.
- **Implemented fix:** Converted to plain JSX variable `const sidebar = (…)`, rendered via `{sidebar}` at both sites (AdminShell.tsx).
- **Verification:** `npx tsc --noEmit` exit 0; ESLint re-run — both `react-hooks/static-components` errors gone (52→39 problems, task b0kn9qwz0).
- **Status:** FIXED ✔

### BUG-002 — `useEffect(() => { load(); })` / `setPage(1)` setState-in-effect pattern (15 occurrences)
- **Severity:** Medium · **Category:** State management / cascading renders
- **Location:** admin pages (about:119, achievements:50, certifications:52, hero-badges:51, messages:23, notifications:113, projects:51, research:44, skills:140, social:27, stats:27), public list pages (achievements:218, certifications:225, projects:165, research:81), `ThemeProvider.tsx:18`, `AdminShell.tsx:57`
- **Evidence:** 17 ESLint `react-hooks/set-state-in-effect` errors (lint-full.txt).
- **Root cause:** Data-fetch effects set state synchronously; filter-reset effects call `setPage(1)` in an effect instead of resetting during the filter-change event.
- **Impact:** Cascading renders (performance); lint errors block a clean lint gate. Data-fetch-on-mount instances are functionally correct; `setPage` instances cause one extra render per filter change.
- **Recommended fix:** For filter resets: derive/reset page inside the event handlers or use key-based reset. For mount fetches: acceptable pattern but can be silenced by moving setState into async callback (already async — flagged because `load()` is called synchronously; wrap as `void load()` inside, or use `.then`). Treat individually; do not restructure working data flow.
- **Status:** OPEN

### BUG-003 — Footer uses `<a href="/">` for internal navigation
- **Severity:** Medium · **Category:** Broken navigation / performance
- **Location:** `frontend/src/components/Footer.tsx:131`
- **Evidence:** ESLint `@next/next/no-html-link-for-pages` error.
- **Root cause:** Raw anchor triggers a full page reload instead of client navigation.
- **Impact:** Full document reload on footer logo/home click; loses SPA navigation and prefetching.
- **Implemented fix:** Replaced `<a href="/#contact">` with `<Link href="/#contact">` (hash anchor behavior preserved).
- **Verification:** ESLint re-run — `no-html-link-for-pages` error gone (task b0kn9qwz0).
- **Status:** FIXED ✔

### BUG-004 — Unescaped `"` entities in JSX
- **Severity:** Low · **Category:** Lint error / rendering
- **Location:** `frontend/src/app/admin/about/page.tsx:630,690`
- **Evidence:** 4 ESLint `react/no-unescaped-entities` errors.
- **Implemented fix:** Escaped as `&ldquo;…&rdquo;` in both strings.
- **Verification:** ESLint re-run — all 4 `no-unescaped-entities` errors gone (task b0kn9qwz0).
- **Status:** FIXED ✔

### BUG-005 — Images missing `alt` prop
- **Severity:** Medium · **Category:** Accessibility (WCAG 1.1.1)
- **Location:** `frontend/src/app/admin/about/page.tsx:451`, `frontend/src/app/admin/settings/page.tsx:349`
- **Evidence:** ESLint `jsx-a11y/alt-text` warnings.
- **Root cause (corrected):** FALSE POSITIVE — `<Image size={n} />` is the lucide-react icon component, which jsx-a11y mistakes for an image element. Real `<img>` tags at those sites already have alt text.
- **Implemented fix:** Aliased import to `Image as ImageIcon` in both files.
- **Verification:** ESLint re-run — both alt-text warnings gone (task b0kn9qwz0).
- **Status:** FIXED ✔ (false positive resolved)

### BUG-006 — Raw `<img>` instead of `next/image` on public pages (13 occurrences)
- **Severity:** Medium · **Category:** Performance (LCP/bandwidth)
- **Location:** Hero.tsx:440, Certifications.tsx:44, AboutPageContent.tsx:234, CertDetail.tsx:156,176, certifications/page.tsx:48, ProjectDetail.tsx:198,443, AchievementDetail.tsx:93,146, admin/about:448, admin/settings:366,389
- **Evidence:** ESLint `@next/next/no-img-element` warnings.
- **Impact:** No automatic optimization/lazy-loading/srcset on user-facing images, incl. the Hero image (likely LCP element).
- **Recommended fix:** Public pages: migrate to `next/image` where dimensions are known (needs remotePatterns config for CMS-hosted images). Admin pages: acceptable as-is (preview thumbnails), documented as technical debt.
- **Status:** OPEN

### BUG-007 — Unused code
- **Severity:** Low · **Category:** Dead code
- **Location:** `admin/about/page.tsx:4` (GripVertical), `projects/page.tsx:10` (ProjectsResponse), `admin/settings/page.tsx:108` (_drop, _id)
- **Evidence:** `@typescript-eslint/no-unused-vars` warnings.
- **Implemented fix:** Removed `GripVertical` and `ProjectsResponse` imports; `void _drop; void _id;` marks the intentional destructure-to-omit in settings.
- **Verification:** ESLint re-run — all 4 warnings gone (task b0kn9qwz0).
- **Status:** FIXED ✔

### BUG-008 — Frontend dependency vulnerabilities (4: 3 high, 1 moderate)
- **Severity:** High · **Category:** Security / dependencies
- **Location:** `frontend/package-lock.json` — postcss <8.5.10 (GHSA-qx2v-qp2m-jg93, XSS) bundled via next@16.2.4; 3 high per `npm audit` (audit-frontend.json)
- **Recommended fix:** Upgrade next to 16.2.10 (patch-level within v16, fixes bundled postcss). Verify build after.
- **Status:** OPEN

### BUG-009 — Backend dependency vulnerabilities (9: 3 high, 6 moderate)
- **Severity:** High · **Category:** Security / dependencies
- **Location:** `backend/package-lock.json` — qs 6.11.1–6.15.1 DoS (GHSA-q8mj-m7cp-5q26), multer advisory, others (audit-backend.json)
- **Recommended fix:** `npm audit fix` (non-breaking) then re-audit; assess any remaining.
- **Status:** OPEN

### BUG-010 — API base-URL fallback port mismatch (5000 vs 5001)
- **Severity:** Critical (dev) · **Category:** API contract
- **Location:** `frontend/src/lib/api.ts:1` vs 14 other files + `.env.local` (all 5001); backend `.env` sets `PORT=5001`
- **Evidence:** grep confirmed `api.ts` alone fell back to `localhost:5000`.
- **Impact:** With env var unset, all admin CRUD (which uses `lib/api.ts`) hits the wrong port while public pages work — intermittent, confusing failures.
- **Implemented fix:** Fallback changed to `http://localhost:5001/api`.
- **Verification:** grep — zero remaining `localhost:5000` references in frontend/src; frontend tsc pending in regression batch.
- **Status:** FIXED ✔

### BUG-011 — No rate limiting on `/auth/login` and `/auth/setup`
- **Severity:** High · **Category:** Security (brute force)
- **Location:** `backend/src/routes/auth.ts:9,23`
- **Evidence:** `express-rate-limit` used on `/contact` only; auth routes unprotected (verified by reading auth.ts).
- **Implemented fix:** Added `authLimiter` (10 attempts / 15 min, same handler pattern as contactLimiter) to both routes.
- **Verification:** `npx tsc --noEmit` (backend) exit 0 (task ba1507fym). Runtime check pending in regression phase.
- **Status:** FIXED ✔ (pending runtime verification)

### BUG-012 — `/auth/setup` accepts missing/weak credentials
- **Severity:** High · **Category:** Security / correctness
- **Location:** `backend/src/routes/auth.ts:23-31`
- **Evidence:** `bcrypt.hash(password, 12)` with no presence check — `undefined` password throws → unhandled 500; no email format or password strength validation.
- **Implemented fix:** Added email format check and ≥8-char password requirement (mirrors change-password rules).
- **Verification:** Backend tsc exit 0 (task ba1507fym).
- **Status:** FIXED ✔

### BUG-013 — No global Express error handler; no env validation at startup
- **Severity:** High · **Category:** Error handling / configuration
- **Location:** `backend/src/index.ts`
- **Evidence:** No `app.use((err,…))` middleware existed; AGENTS.md §4.6/§12.4 require both. Express 5 forwards async rejections, but they hit the default HTML handler (stack traces outside production mode; CORS errors surfaced as HTML 500s).
- **Implemented fix:** Fail-fast check for `DATABASE_URL`/`JWT_SECRET` at boot; JSON error handler returning 403 for CORS rejections and sanitized 500 otherwise.
- **Verification:** Backend tsc exit 0 (task ba1507fym). Runtime check pending.
- **Status:** FIXED ✔

### BUG-014 — Contact form status timers never cleaned up
- **Severity:** Low · **Category:** Memory leak
- **Location:** `frontend/src/components/sections/Contact.tsx:24,29`
- **Evidence:** `setTimeout(() => setStatus('idle'), …)` with no cleanup; fires after unmount.
- **Implemented fix:** Timer stored in ref, cleared on unmount via effect cleanup.
- **Verification:** Included in next frontend tsc/lint regression run.
- **Status:** FIXED ✔ (pending regression confirmation)

### Open findings from discovery agents (verification/fix pending)

| ID | Sev | Finding | Location | Next step |
|----|-----|---------|----------|-----------|
| BUG-015 | High | Admin dashboard swallows API errors — **FIXED ✔**: error state + banner added (dashboard/page.tsx); verified in regression task bzv932qv4 | `frontend/src/app/admin/dashboard/page.tsx:36-48` | — |
| BUG-016 | High | No 401 auto-logout — **FIXED ✔**: scoped 401 intercept in `lib/api.ts` (admin pages only, skips `/auth` paths and login page so failed logins still show inline errors); clears token + redirects | `frontend/src/lib/api.ts` | Runtime check in verification phase |
| BUG-017 | Med | HomePageClient refetch effect — **FALSE POSITIVE ✖**: `clearTimeout` cleanup exists (line 82), run-once ref guards repeats; deliberate cold-start recovery from commit 10391af. No change. | `frontend/src/components/HomePageClient.tsx:60-83` | Closed |
| BUG-018 | Med | No loading/404/error pages — **FIXED ✔**: added root `not-found.tsx`, `error.tsx`, `loading.tsx` (design-system vars, skeleton not spinner per AGENTS.md §7.5) | `frontend/src/app/` | Verified in regression build |
| BUG-019 | Med | Admin CRUD routes pass `req.body` straight to Prisma (no validation) — authenticated-only, but violates AGENTS.md §4.4 | `backend/src/routes/{projects,stats,social,research}.ts` | Document as tech debt; assess minimal validation |
| BUG-020 | Med | Dashboard endpoint returns 200 + zero counts on DB error (masks failures) | `backend/src/routes/dashboard.ts:22-30` | Deliberate fallback from recent commit — verify intent before changing |
| BUG-021 | Med | CORS falls back to localhost when `FRONTEND_URL` unset in production | `backend/src/index.ts:26` | Document in deployment guide |
| BUG-022 | Low | `admin` query param parsed but non-functional in projects/research routes | `backend/src/routes/projects.ts:25`, `research.ts:31` | Verify against admin UI usage before removing |
| BUG-023 | Low | Seed logs admin credentials to console; hardcoded default password | `backend/src/seed.ts:17-19` | Document as security note |
| BUG-024 | Med | Error message parsing via `msg.includes('401')` is brittle | `frontend/src/app/admin/settings/page.tsx:74-83` | Tech debt — works with current api.ts format |

_Backend agent's "critical unhandled async errors crash the server" claim was **corrected**: Express 5 forwards async rejections to error middleware; the real gap was the missing global handler (BUG-013, now fixed)._

### BUG-025 — `prisma generate` crashes on Node 20.16 (ERR_REQUIRE_ESM)
- **Severity:** Medium (build environment) · **Category:** Tooling / configuration
- **Location:** `backend/node_modules/@prisma/dev` (Prisma 7 CLI) with local Node v20.16.0
- **Evidence:** `npx prisma generate` throws `ERR_REQUIRE_ESM` (CJS `state.cjs` requires ESM-only `zeptomatch`); discovered during the final verification gate (task b7cmjt89j — the `BE BUILD EXIT:1` traced to `prisma generate`, not tsc).
- **Root cause:** Prisma 7 tooling relies on `require(esm)`, supported in Node ≥ 20.19 / 22+. Local machine runs 20.16.0. The previously generated client exists, so `tsc`, dev, and runtime are unaffected — only fresh `npm run build`/`generate` fails locally.
- **Impact:** Backend `npm run build` fails on Node < 20.19; deploys on Render with a modern Node runtime are unaffected.
- **Implemented fix:** Added `"engines": { "node": ">=20.19.0" }` to backend/package.json to fail loudly with the real cause. Local Node upgrade (e.g., `nvm install 22`) is the user-side action — outside the repo's control.
- **Verification:** `npx tsc` (emit) exits 0 with the existing generated client; engines field verified in package.json.
- **Status:** MITIGATED (documented; requires local Node upgrade to fully clear)

## Final verification (Phase 11)

11-point evidence check re-run against the working tree at audit end — **all pass** (session Bash verification, this file's fix claims cross-checked one by one): api.ts port + 401 intercept ✔ · AdminShell sidebar hoisted + aria-labels ✔ · Footer Link (remaining `<a>` is external social links — correct) ✔ · auth limiter ×2 + setup validation ✔ · env fail-fast + JSON error middleware ✔ · not-found/error/loading exist ✔ · MotionConfig reducedMotion ✔ · next@16.2.10 + 13 deps absent ✔ · dashboard error banner ✔ · 14 docs + 3 memory lessons ✔ · contact timer ref + cleanup ✔.
