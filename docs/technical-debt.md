# Technical Debt Register

**Version:** 1.0 · **Date:** 2026-07-06
Cross-references: [bug-audit.md](bug-audit.md) · [known-issues.md](known-issues.md) · [security-audit.md](security-audit.md) · [performance-audit.md](performance-audit.md)

Items deliberately **not** fixed in this audit — either because the current behavior is functionally correct and restructuring working code carries more risk than value, or because the fix warrants its own scoped pass.

| ID | Area | Debt | Why deferred | Suggested payoff |
|----|------|------|--------------|------------------|
| TD-01 | Frontend hooks | 17 ESLint `react-hooks/set-state-in-effect` errors: `load()` on mount (11 admin pages, ThemeProvider, AdminShell) and `setPage(1)` filter resets (4 public list pages) | Functionally correct, standard patterns; proper fix restructures 15+ data flows (event-driven resets / data-layer refactor). New rule from eslint-plugin-react-hooks v6 era | When adopting React Compiler or a fetch library (SWR), restructure per page |
| TD-02 | Images | 13 raw `<img>` usages (PERF-001/002); no `images.remotePatterns` config yet | `next/image` migration touches visual layout on every page — needs its own verified pass | Dedicated PR: config remotePatterns for Cloudinary, migrate public images, visually verify |
| TD-03 | API validation | Admin CRUD routes trust `req.body` into Prisma (SEC-001; AGENTS.md §4.4 violation) | Authenticated single-admin surface; whitelist schema per model is a sizable, testable change | Add Zod schemas per resource, starting with projects |
| TD-04 | API client | `NEXT_PUBLIC_API_URL \|\| 'http://localhost:5001/api'` fallback duplicated in ~15 files (drift caused BUG-010) | Mechanical consolidation touches many files; low urgency now that values agree | Export `API_BASE` from `lib/api.ts` and import everywhere |
| TD-05 | Error contract | `msg.includes('401')` error parsing in admin settings (BUG-024) | Works with current `api.ts` error format (`API error: 401`) | Attach `status` to thrown errors in `lib/api.ts`, branch on it |
| TD-06 | Backend consistency | Pagination defaults differ (9 vs 200); non-functional `admin` query params in projects/research routes | Harmless; behavior matches current frontend usage | Shared pagination constants; remove dead params after confirming admin UI never sends them |
| TD-07 | Deployment | `start` script chains `db push && seed && serve` — AGENTS.md §3.3 says never `db push` in production | Changing the deploy pipeline needs a Render-side verification the audit can't run | Switch to `prisma migrate deploy`; make seed idempotent-only on empty DB |
| TD-08 | Auth UX | Admin auth check is client-side only (localStorage in AdminShell effect) — brief UI flash pre-redirect; server middleware would be stronger | 401 intercept (BUG-016) now covers the security-relevant gap; middleware move is architectural | Next.js middleware + httpOnly cookie session in a future iteration |
| TD-09 | List pages | Fully client-rendered list pages (PERF-003) | Interactive filtering works; server-shell refactor is a redesign | Consider during a Next.js cache-components adoption pass |
| TD-10 | Seed | Hardcoded `Admin@123` default + credential console.log (SEC-004) | Seed is dev-oriented; touching prod seed flow couples with TD-07 | Env-driven initial credentials; drop the log line |
