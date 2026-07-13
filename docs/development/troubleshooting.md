# Troubleshooting & Debugging

## Common local issues

| Symptom | Likely cause | Fix |
|---|---|---|
| Frontend can't reach the API locally | Port mismatch — `backend/.env.example` documents `PORT=5001` default but `backend/src/index.ts` code-defaults to `5000`, and `frontend/src/lib/api.ts` also code-defaults to `5000` while most pages default to `5001` | Set `PORT` in `backend/.env` and `NEXT_PUBLIC_API_URL` in `frontend/.env.local` explicitly — don't rely on either default. See [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #7. |
| Homepage renders empty/partial on first load | Backend not running yet, or (in production) a Render cold start | Locally: start the backend first. In production: this is expected on Render's free tier after inactivity — the app has fetch timeouts + graceful fallbacks (commit `10391af`), so it should recover on a refresh a few seconds later. |
| Admin panel redirects to login unexpectedly | JWT expired (7-day expiry) or `localStorage` was cleared | Log in again. If this happens immediately after logging in, check `JWT_SECRET` matches between what signed the token and what's verifying it (e.g., backend restarted with a different `.env`). |
| `npm run db:push` fails to connect | Using `DATABASE_URL` (pooler, port 6543) for an operation that needs `DIRECT_URL` (port 5432) | `db push`/migrations need the direct connection — see [`../deployment/environment-variables.md`](../deployment/environment-variables.md). |
| TypeScript build fails on Render but not locally | Type errors that only surface in a clean build (stale `.next`/`dist` locally masking them) | Run `cd backend && npm run build` (or the frontend equivalent) locally before pushing, matching commit `de77c03`'s original fix for this exact issue. |
| Contact form submits but no email arrives | `RESEND_API_KEY`/`RESEND_FROM_EMAIL` not set, or notification email not configured in `/admin/notifications` | Check both the env vars and the admin-configured recipient — email dispatch is fire-and-forget (`setImmediate`), so the form will still show success even if the email fails silently server-side. Check `ContactMessage.notificationStatus` in the DB (via Prisma Studio) for the actual delivery outcome. |

## Debugging tips specific to this stack

- **Backend logs**: `tsx watch src/index.ts` in dev prints to stdout directly — no structured logger is configured (see [`../deployment/hosting-guide.md`](../deployment/hosting-guide.md) for where Render surfaces these in production).
- **Prisma Studio** (`npm run db:studio`) is the fastest way to inspect actual DB state without writing a query — especially useful for checking `ContactMessage.notificationStatus`/`emailSent` after a contact form test.
- **Hydration mismatches**: this project has hit React error #418 (hydration mismatch) before, from `toLocaleDateString()` producing different output server vs. client due to locale/timezone — fixed by switching to the deterministic UTC formatters in `frontend/src/lib/date.ts` (commit `ea8e318`). If you see a new hydration warning, check for a similar server/client-divergent computation (`Date.now()`, `Math.random()`, locale-dependent formatting) before assuming it's something else.

## Related
- [`setup-and-workflow.md`](./setup-and-workflow.md)
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)
