# Secrets Management

## What counts as a secret here

`JWT_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `RESEND_API_KEY`. See [`../deployment/environment-variables.md`](../deployment/environment-variables.md) for the full variable reference — this doc is the handling policy.

## Rules

1. Never commit `.env`/`.env.local` — both are gitignored (`backend/.gitignore` and root `.gitignore` respectively). `backend/.env.example` is intentionally the one `.env*` file that IS committed, as a template with placeholder values only.
2. Never log secret values, even in development.
3. Backend-only secrets never get a `NEXT_PUBLIC_` prefix and never leave the Express process — the frontend only ever holds `NEXT_PUBLIC_API_URL`, which is not a secret.
4. Rotate `JWT_SECRET` immediately if ever exposed — this invalidates all existing tokens (acceptable; the affected party can just log in again).

## Incident on record: local `.env` credential exposure (2026-07 audit)

During the 2026-07 documentation audit, `backend/.env` was found to contain, appended after the normal `KEY=value` lines, what appears to be a pasted terminal transcript including a **live Supabase Postgres connection string with a plaintext password**. The file itself is gitignored and never reached the remote repository — but this is exactly the kind of exposure that doesn't require a git leak to matter: local files can leak via screen shares, backups, AI coding assistant context windows, or accidental `cat`/copy-paste into another tool.

**Action required (not resolved by this documentation project — this needs a human to actually do it):**
1. Rotate the Supabase database password from the Supabase dashboard.
2. Update `DATABASE_URL`/`DIRECT_URL` in `backend/.env` (local) and in Render's environment variable settings (production) to the new credential.
3. Clean up `backend/.env` so it contains only the intended key/value pairs — remove the extraneous pasted content.

This is tracked as [technical debt item #20](../appendices/technical-debt-register.md) (marked High severity) and was flagged directly to the project owner at the time it was found.

## Related
- [`../deployment/environment-variables.md`](../deployment/environment-variables.md)
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)
