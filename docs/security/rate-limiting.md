# Rate Limiting

## Current state

`express-rate-limit` is applied to exactly one route: `POST /api/contact` — 5 requests per hour per IP. This is appropriate for a public contact form (prevents spam/abuse of the Resend email quota).

**No other route has rate limiting**, including `POST /api/auth/login` — see [`authentication.md`](./authentication.md). This is the single highest-priority security gap surfaced by the 2026-07 audit ([technical debt item #12](../appendices/technical-debt-register.md), rated Medium–High).

## Recommended fix

Apply `express-rate-limit` to the login route, e.g.:

```ts
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  message: { error: 'Too many login attempts, please try again later.' },
});

router.post('/login', loginLimiter, async (req, res) => { /* ... */ });
```

Consider pairing this with a per-account (not just per-IP) lockout counter if brute-force protection needs to be stronger than IP-based limiting alone (an attacker distributing attempts across IPs would bypass IP-only limiting) — this is a reasonable v2 improvement, not required for the initial fix.

## Related
- [`authentication.md`](./authentication.md)
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #12
