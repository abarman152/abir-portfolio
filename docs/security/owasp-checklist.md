# OWASP Top 10 Checklist (2021 list, applied to this app)

| # | Category | Status | Notes |
|---|---|---|---|
| A01 | Broken Access Control | ⚠️ Partial | Server-side mutation endpoints are properly JWT-gated. Client-side-only route guard on `/admin/*` is a secondary gap. No RBAC needed (single admin role). See [`authorization.md`](./authorization.md). |
| A02 | Cryptographic Failures | ✅ OK | Passwords bcrypt-hashed (cost 12). JWT signed with a secret (ensure it's genuinely random/64-char — see [`../deployment/environment-variables.md`](../deployment/environment-variables.md)). HTTPS enforced by both Vercel and Render by default. |
| A03 | Injection | ✅ OK | All DB access via Prisma (parameterized). No raw SQL found. See [`secure-coding-practices.md`](./secure-coding-practices.md). |
| A04 | Insecure Design | ⚠️ Partial | No rate limiting on login is a design-level gap, not just a missing feature — see [`rate-limiting.md`](./rate-limiting.md). |
| A05 | Security Misconfiguration | ⚠️ Partial | No `helmet`/security headers configured — see [`headers-and-cors.md`](./headers-and-cors.md). Permissive `next.config.ts` `remotePatterns: **` is a deliberate tradeoff (see [`../architecture/overview.md`](../architecture/overview.md)), not a misconfiguration, but worth being aware of. |
| A06 | Vulnerable and Outdated Components | ❓ Unaudited | No automated dependency scanning configured — see [`dependency-security.md`](./dependency-security.md). Run `npm audit` manually until Dependabot/CI is set up. |
| A07 | Identification and Authentication Failures | ⚠️ Partial | No rate limiting/lockout on login (see A04). Token expiry (7 days) with no revocation list is a secondary concern. See [`authentication.md`](./authentication.md). |
| A08 | Software and Data Integrity Failures | ✅ OK | No use of `eval`/dynamic code loading/unsigned auto-updates found. Dependencies installed via standard `npm` with lockfiles committed. |
| A09 | Security Logging and Monitoring Failures | ❌ Gap | No structured logging, no error tracking service, no uptime monitoring. See [`../deployment/rollback-monitoring-logging.md`](../deployment/rollback-monitoring-logging.md). |
| A10 | Server-Side Request Forgery (SSRF) | ⚠️ Minor | `next.config.ts` allows `next/image` to fetch from any HTTPS hostname (`remotePatterns: **`) — since image URLs are admin-entered (not visitor-submitted), this is low-risk in practice, but worth knowing it's not restricted to a Cloudinary-only allowlist. |

## Legend
✅ OK — no known issue · ⚠️ Partial — known, tracked gap with existing mitigation · ❌ Gap — no mitigation in place · ❓ Unaudited — not checked

## Related
- [`security-audit-checklist.md`](./security-audit-checklist.md) — process for re-running this checklist
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)
