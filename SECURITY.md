# Security Policy

## Reporting a Vulnerability

This is a single-maintainer personal portfolio project. If you find a security issue (auth bypass, injection, exposed secrets, XSS, etc.), please report it privately rather than opening a public issue:

- Open a [GitHub private security advisory](../../security/advisories/new) on this repository, **or**
- Contact the maintainer directly through the contact details on [abirbarman.com](https://abirbarman.com).

Please include steps to reproduce and the potential impact. You'll get an acknowledgment as soon as possible; there is no formal SLA since this is not a commercially supported product, but real vulnerabilities will be prioritized.

## Supported Versions

There is a single deployed version (whatever is on `main` in production). There is no LTS/backport policy — fixes land on `main` and deploy automatically.

## Scope

In scope: the `frontend/` (Next.js) and `backend/` (Express/Prisma) applications in this repository, and their production deployment (Vercel + Render + Supabase).

Out of scope: third-party services themselves (Vercel, Render, Supabase, Resend) — report those issues to the respective vendor.

## Known Security Posture

For full detail see [`docs/security/`](docs/security/). Summary as of the last audit:

- **Authentication**: JWT (7-day expiry), bcrypt-hashed passwords. Token is stored in `localStorage`, not an httpOnly cookie — see [`docs/security/authentication.md`](docs/security/authentication.md) for the tradeoff discussion.
- **Rate limiting**: only applied to `POST /api/contact` (5 req/hour/IP). The admin login endpoint (`POST /api/auth/login`) has **no rate limiting** — treat this as a known gap, not a false sense of security. A strong `JWT_SECRET` and a strong admin password are your main mitigations until this is added.
- **Route protection**: `/admin/*` is guarded client-side only (no `middleware.ts`). Every underlying data mutation is still enforced server-side via JWT verification, but the admin page shell itself is not access-controlled at the edge.
- **Secrets**: never commit `.env`/`.env.local`. If a database connection string or API key is ever exposed (including via local file, screenshot, or terminal paste), rotate it immediately — see [`docs/deployment/environment-variables.md`](docs/deployment/environment-variables.md).
- **Default credentials**: the seed script creates a default admin account (see [`docs/development/setup-and-workflow.md`](docs/development/setup-and-workflow.md)). **Change the password immediately after first login in any real deployment.**

## Dependency Security

Run `npm audit` in both `frontend/` and `backend/` periodically. There is no automated dependency-scanning CI configured yet — see [`docs/appendices/technical-debt-register.md`](docs/appendices/technical-debt-register.md).
