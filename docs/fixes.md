# Implemented Fixes

**Version:** 1.0 · **Date:** 2026-07-06 · Cross-references: [bug-audit.md](bug-audit.md) · [testing-report.md](testing-report.md)

All fixes below were verified by re-running the affected check (evidence column). Verification tasks refer to session background-task IDs recorded in bug-audit.md.

| Bug | Fix | Files | Verification |
|-----|-----|-------|--------------|
| BUG-001 | Render-scoped `Sidebar` component converted to plain JSX variable (no more remount/state loss per render) | `frontend/src/components/admin/AdminShell.tsx` | ESLint: both `static-components` errors gone; tsc clean |
| BUG-003 | Footer contact anchor migrated to `next/link` (client navigation preserved incl. hash) | `frontend/src/components/Footer.tsx` | ESLint: `no-html-link-for-pages` gone |
| BUG-004 | Unescaped `"` escaped as `&ldquo;…&rdquo;` | `frontend/src/app/admin/about/page.tsx` | ESLint: 4 errors gone |
| BUG-005 | lucide `Image` icon aliased to `ImageIcon` (jsx-a11y false positive eliminated) | `admin/about/page.tsx`, `admin/settings/page.tsx` | ESLint: alt-text warnings gone |
| BUG-007 | Unused imports/vars removed or explicitly voided | `admin/about`, `projects/page.tsx`, `admin/settings` | ESLint: 4 warnings gone |
| BUG-008 | next upgraded 16.2.4 → 16.2.10 (fixes bundled postcss XSS advisory + high vulns) | `frontend/package.json` | `npm audit` re-run (see testing-report) |
| BUG-009 | `npm audit fix` applied (qs DoS et al.) | `backend/package-lock.json` | `npm audit` re-run |
| BUG-010 | api.ts base-URL fallback corrected 5000 → 5001 | `frontend/src/lib/api.ts` | grep: no `localhost:5000` remains |
| BUG-011 | Rate limiter (10/15min) added to `/auth/login` + `/auth/setup` | `backend/src/routes/auth.ts` | Backend tsc clean |
| BUG-012 | Email format + ≥8-char password validation on `/auth/setup` | `backend/src/routes/auth.ts` | Backend tsc clean |
| BUG-013 | Fail-fast env validation (`DATABASE_URL`, `JWT_SECRET`) + global JSON error handler (403 CORS / sanitized 500) | `backend/src/index.ts` | Backend tsc clean |
| BUG-014 | Contact form status timeouts tracked in ref + cleared on unmount | `frontend/src/components/sections/Contact.tsx` | Frontend tsc + build clean |
| BUG-015 | Dashboard error state + visible error banner (was `.catch(console.error)`) | `frontend/src/app/admin/dashboard/page.tsx` | Frontend tsc + build clean |
| BUG-016 | Scoped 401 intercept: clears token + redirects to login (admin pages only; skips `/auth` calls and the login page so credential errors still render inline) | `frontend/src/lib/api.ts` | Frontend tsc + build clean |
| BUG-018 | Added root `not-found.tsx`, `error.tsx`, `loading.tsx` (design-system tokens; skeleton, no spinner) | `frontend/src/app/` | Production build clean (`/_not-found` route generated) |

Closed without change:
- **BUG-017** — false positive: HomePageClient refetch effect already has `clearTimeout` cleanup and run-once guard; deliberate cold-start recovery (commit 10391af).

Full regression after batch (task bzv932qv4): frontend `tsc --noEmit` exit 0 · ESLint 39 problems (17 pre-existing `set-state-in-effect` errors — see technical-debt.md — no new issues) · `next build` exit 0, 23+ routes generated · backend `tsc --noEmit` exit 0.
