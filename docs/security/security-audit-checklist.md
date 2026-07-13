# Security Audit Checklist

Run this manually before a major release, and at least quarterly otherwise (no automated tooling runs this today — see [`../deployment/ci-cd.md`](../deployment/ci-cd.md)).

## Secrets
- [ ] No `.env`/`.env.local` files are tracked in git (`git ls-files | grep .env` should return only `.env.example`)
- [ ] No secret values appear in code, commit messages, or comments
- [ ] `JWT_SECRET`, `DATABASE_URL`/`DIRECT_URL`, `RESEND_API_KEY` are all set via environment variables, not hardcoded
- [ ] No connection strings or credentials pasted into local `.env` files beyond the intended key/value pairs (see [`secrets-management.md`](./secrets-management.md) for why this matters even for gitignored files)

## Authentication & Authorization
- [ ] Login endpoint has rate limiting (currently missing — see [`rate-limiting.md`](./rate-limiting.md))
- [ ] All mutating routes require valid JWT (spot-check against [`../api/rest-api-reference.md`](../api/rest-api-reference.md))
- [ ] Default seed admin password has been changed in any real deployment

## Dependencies
- [ ] `npm audit` run in both `frontend/` and `backend/`, high/critical findings triaged
- [ ] No newly-added dependency is unused (grep for its import before merging)

## Headers & Transport
- [ ] HTTPS enforced on both Vercel and Render (default, verify not overridden)
- [ ] CORS allowlist (`FRONTEND_URL`) reflects only intended origins

## Data Handling
- [ ] Markdown-rendered fields (`overviewMd`, etc.) still only accept input from the trusted admin panel — if this ever becomes user-submitted content, revisit [`secure-coding-practices.md`](./secure-coding-practices.md)'s sanitization note
- [ ] Contact form rate limit (5/hr/IP) still in place and effective

## Documentation
- [ ] [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) reflects the current state — close out resolved items, add new ones found during this audit pass

## Related
- [`owasp-checklist.md`](./owasp-checklist.md)
- [`../standards/review-and-maintenance-process.md`](../standards/review-and-maintenance-process.md)
