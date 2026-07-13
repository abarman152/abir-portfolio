# Security

Start with [`../architecture/security-architecture.md`](../architecture/security-architecture.md) for the trust-boundary picture, then:

| Doc | Covers |
|---|---|
| [`authentication.md`](./authentication.md) | JWT mechanism, risks and their actual severity |
| [`authorization.md`](./authorization.md) | Single-role model, enforcement point |
| [`secrets-management.md`](./secrets-management.md) | Handling rules + the local `.env` credential exposure incident |
| [`headers-and-cors.md`](./headers-and-cors.md) | Response headers, CORS config, `helmet` recommendation |
| [`rate-limiting.md`](./rate-limiting.md) | Contact form (present) vs. login (missing — top priority gap) |
| [`dependency-security.md`](./dependency-security.md) | `npm audit`, Dependabot, unused-dependency risk |
| [`secure-coding-practices.md`](./secure-coding-practices.md) | Input validation, XSS, SQL injection, error handling |
| [`owasp-checklist.md`](./owasp-checklist.md) | Full OWASP Top 10 assessment |
| [`security-audit-checklist.md`](./security-audit-checklist.md) | Recurring manual audit checklist |

**If you only read one thing:** rate limiting is missing on the admin login endpoint — see [`rate-limiting.md`](./rate-limiting.md). This is the single highest-priority finding from the 2026-07 audit.
