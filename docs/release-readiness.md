# Release Readiness

**Version:** 1.0 · **Date:** 2026-07-06
Cross-references: [bug-report.md](bug-report.md) · [known-issues.md](known-issues.md) · [verification-report.md](verification-report.md) · [deployment/hosting-guide.md](deployment/hosting-guide.md)

## Verdict

**READY, conditional on the pre-launch runtime checklist below.** All critical and high-severity findings are fixed and verified; the repository builds cleanly (frontend + backend); zero high-severity dependency vulnerabilities remain; open items are documented medium/low issues with plans.

## Release gates (static — all green)

- [x] Frontend `tsc --noEmit` — exit 0
- [x] Frontend production build (`next build`, Turbopack) — exit 0, all routes generated
- [x] Backend `tsc --noEmit` — exit 0
- [x] No critical/high bugs open (see bug-report.md totals)
- [x] `npm audit`: 0 high/critical in both packages
- [x] Error states: root 404 / error / loading pages exist
- [x] Auth endpoints rate-limited and validated
- [x] Env fail-fast at backend boot
- [x] Audit documentation complete + cross-referenced

## Pre-launch runtime checklist

Executed live on 2026-07-06 (local backend on :5001, frontend prod server `next start` on :3300):

1. [x] Backend boots; `/api/health` → `{"status":"ok",…}`. (Fail-fast code path verified by review; not boot-tested with env removed.)
2. [x] **Rate limiter verified live:** 10 bad logins → 401 each; attempt 11 → **429** `{"error":"Too many attempts. Please try again in 15 minutes."}`. `/auth/setup` shares the limiter (verified).
3. [x] **Global error handler verified live:** disallowed `Origin: https://evil.example.com` → **403** `{"error":"Origin not allowed"}` (previously an HTML 500). Unknown API route → 404.
4. [x] **Frontend prod server verified live:** `/` → 200 with title "Abir — Data Scientist"; `/this-page-does-not-exist` → **404 rendering the new custom "Page not found" page**; `/projects` → 200; `/sitemap.xml` + `/robots.txt` → 200.
5. [x] **Contrast measured (KI-03 resolved to a finding):** `--text` 17.7:1 ✓, `--text-2` 4.83 (light) / 7.55 (dark) ✓ — but `--text-3` **2.54:1 both themes = WCAG AA FAIL** (A11Y-004 CONFIRMED). Compliant candidates that stay muted: light `#6e7683` (4.58:1), dark `#7d8896` (5.33:1). Token change alters site aesthetics — left as an owner decision.
6. [ ] 401 browser redirect flow (BUG-016) — code-verified; needs a browser session to observe.
7. [ ] Contact form end-to-end — deliberately skipped (would send a real email via Resend).
8. [ ] Lighthouse LCP/CLS/INP baseline + axe pass + keyboard walkthrough — needs a browser; run before deploy.
9. [ ] Deployment env vars per [deployment/environment-variables.md](deployment/environment-variables.md); note TD-07 (`db push` in start script) before first prod deploy.

## Risk assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Cold-start empty homepage (Render free tier) | Med | Low | Existing client-side refetch recovery (verified logic, commit 10391af) |
| Unoptimized hero image hurts mobile LCP | High | Med | TD-02 migration pass; interim `fetchpriority` hint |
| Mass-assignment via admin CRUD (compromised token scenario) | Low | Med | SEC-001/TD-03 Zod pass |
| `db push` on production boot | Low | High | TD-07: switch to `migrate deploy` before schema evolves |

## Maintenance recommendations

Monthly `npm audit` + `npx skills check`; quarterly dependency refresh; add Playwright smoke suite (testing-report.md recommendation); consolidate API base URL (TD-04) at next refactor touchpoint.
