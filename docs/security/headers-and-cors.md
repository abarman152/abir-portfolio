# Headers & CORS

## Backend response headers

`backend/src/index.ts` sets on every `/api` response:
```
Cache-Control: no-store
Pragma: no-cache
Expires: 0
```
This prevents any intermediary (CDN, browser cache, proxy) from serving stale dynamic data — appropriate given content can change at any time via the admin panel (see [`../architecture/cms-flow.md`](../architecture/cms-flow.md)).

There are currently **no other security headers** set by the backend (no `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Strict-Transport-Security`, or `Content-Security-Policy`). Express does not set these by default without a package like `helmet`, which is not currently a dependency.

## Frontend headers

`frontend/vercel.json` sets long-lived cache headers for static assets (favicons, `og-image.png`) only — no security headers configured there either. Next.js's own defaults apply otherwise.

## CORS

Configured via the `cors` package in `backend/src/index.ts`:
- Allowlist built from `FRONTEND_URL` (comma-separated) — not a wildcard.
- `credentials: true` — enabled ahead of a possible future cookie-based auth migration (see [`../architecture/future-architecture.md`](../architecture/future-architecture.md)); not currently exploited since no cookies are set today.
- Both `www` and non-`www` origins are explicitly allowed (fixed in commit `9ffba00`).

## Recommended additions (not yet implemented)

Adding `helmet` to the backend would set several of the missing headers with minimal effort:
```ts
import helmet from 'helmet';
app.use(helmet());
```
This is a low-effort, no-downside addition — tracked in [`../roadmap/future-documentation-roadmap.md`](../roadmap/future-documentation-roadmap.md) and [`../architecture/future-architecture.md`](../architecture/future-architecture.md).

## Related
- [`../architecture/security-architecture.md`](../architecture/security-architecture.md)
- [`owasp-checklist.md`](./owasp-checklist.md)
