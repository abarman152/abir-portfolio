# Security Audit

**Version:** 1.0 · **Date:** 2026-07-06 · Static analysis + dependency audit
Cross-references: [bug-audit.md](bug-audit.md) · [fixes.md](fixes.md) · [deployment/environment-variables.md](deployment/environment-variables.md)

## Executive summary

The security posture is appropriate for a single-admin portfolio CMS. Auth uses bcrypt (cost 12) + JWT with 7-day expiry; Prisma parameterizes all queries; the contact form is rate-limited; CORS is origin-checked. This audit fixed the significant gaps: brute-forceable auth endpoints (now rate-limited), an unvalidated `/auth/setup` endpoint (now validated), missing global error handling (stack-trace leak risk, now sanitized JSON), missing env fail-fast checks, and 12 dependency vulnerabilities including 6 high (now 2 moderate frontend / 4 low-moderate backend, none high). Remaining items are hardening opportunities, not blockers.

## Fixed during audit

| Item | Was | Now | Ref |
|------|-----|-----|-----|
| Auth brute force | `/auth/login`, `/auth/setup` unlimited attempts | 10 attempts / 15 min / IP | BUG-011 |
| Setup validation | `bcrypt.hash(undefined)` → 500; any email/password accepted | Email format + ≥8-char password enforced | BUG-012 |
| Error handling | No global handler; Express default HTML errors (stack traces outside prod mode) | Sanitized JSON 500; CORS rejections → 403 JSON | BUG-013 |
| Env validation | `process.env.JWT_SECRET!` assumed present | Fail-fast at boot for `DATABASE_URL`, `JWT_SECRET` | BUG-013 |
| Dependencies | FE: 4 vulns (3 high, incl. postcss XSS via next); BE: 9 (3 high, incl. qs DoS) | FE: 2 moderate (dev-chain); BE: 4 (1 low, 3 moderate); **0 high anywhere**; next 16.2.4→16.2.10; unused axios (6 high advisories) removed entirely | BUG-008/009, PERF-006 |
| Expired-session UX | Expired JWT left admin UI up; API calls failed silently | 401 intercept clears token + redirects to login (scoped to admin pages) | BUG-016 |

## Verified sound (no change needed)

- **Password storage:** bcryptjs, salt rounds 12 (`auth.ts`, `change-password`).
- **JWT:** signed with `JWT_SECRET`, `expiresIn: '7d'`; `jwt.verify` enforces expiry; malformed tokens → 401.
- **Injection:** all DB access via Prisma (parameterized). No raw SQL, no `dangerouslySetInnerHTML` with user input (theme script is a static string).
- **Admin route protection:** mutation routes use `authenticate` middleware (spot-checked projects/stats/social/research/contact/settings).
- **Contact spam:** per-IP limiter, 5/hour.
- **Email templates:** HTML-escaped in `lib/notifications.ts` (per discovery agent verification).
- **Secrets:** `.env` gitignored; no secrets found in source.
- **CSRF:** JWT is sent via `Authorization` header (not cookies), which is not auto-attached cross-site — standard CSRF vectors don't apply.

## Open findings (documented, not blocking)

| ID | Sev | Finding | Recommendation |
|----|-----|---------|----------------|
| SEC-001 | Med | Admin CRUD routes pass `req.body` directly to Prisma (`create({ data: req.body })`) — authenticated-only, but unexpected fields can be written (mass assignment) | Add per-model field whitelisting or Zod schemas (AGENTS.md §4.4); tracked in technical-debt.md |
| SEC-002 | Med | `FRONTEND_URL` unset in production silently allows only `localhost:3000` (breaks prod rather than opening it — fail-safe but confusing) | Document required env in hosting guide; optionally fail-fast in production |
| SEC-003 | Low | JWT in `localStorage` (XSS-readable) rather than httpOnly cookie | Acceptable per AGENTS.md §12.1 ("secure localStorage" allowed); revisit if XSS surface grows |
| SEC-004 | Low | Seed script logs default admin credentials (`Admin@123`) to console | Remove the log line; force password change on first login (future) |
| SEC-005 | Low | No security headers middleware (helmet): missing X-Content-Type-Options, X-Frame-Options on API | Low value for a JSON API consumed by a separate frontend; frontend headers are Vercel-managed. Optional: add helmet |
| SEC-006 | Low | `/notification-settings/test` (authenticated) can send emails without its own rate limit | Add limiter if abuse observed |
| SEC-007 | Info | 2 moderate FE vulns are in dev-only chains (js-yaml etc. via tooling); 4 BE low/moderate need `--force` (breaking) to clear | Re-check on next dependency refresh; not runtime-exposed |

## Verification

- `npm audit` re-run both packages after fixes (session tasks bm0ty7phl, bj5n26vp3): high-severity count is zero.
- Backend `tsc --noEmit` clean after all auth/index changes (task ba1507fym).
- Runtime smoke of rate limiter + error handler queued in release-readiness.md.
