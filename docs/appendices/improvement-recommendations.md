# Improvement Recommendations

Ranked by impact-to-effort ratio, combining code and documentation recommendations from across this project.

## Do first (high impact, low effort)

1. **Add rate limiting to `POST /api/auth/login`.** Single highest-priority security fix. See [`../security/rate-limiting.md`](../security/rate-limiting.md).
2. **Rotate the Supabase database password.** A live credential was found pasted into a local `.env` file. See [`../security/secrets-management.md`](../security/secrets-management.md). This requires the project owner to act — it isn't something documentation can resolve.
3. **Add `helmet` to the backend.** One line, closes several OWASP header gaps. See [`../security/headers-and-cors.md`](../security/headers-and-cors.md).
4. **Enable GitHub Dependabot.** Zero code change, catches vulnerable dependencies. See [`../security/dependency-security.md`](../security/dependency-security.md).
5. **Remove confirmed-unused dependencies** (`three`, `@react-three/fiber`, `@react-three/drei`, `next-themes`, `axios`, `express-validator`, `multer`). See [`../appendices/technical-debt-register.md`](./technical-debt-register.md) item #6.

## Do next (real value, moderate effort)

6. **Fix the homepage double-fetch.** See [`../architecture/rendering-strategy.md`](../architecture/rendering-strategy.md).
7. **Add the minimal CI workflow** proposed in [`../deployment/ci-cd.md`](../deployment/ci-cd.md) — unblocks catching lint/type errors at PR time and is a prerequisite for several other recommendations (automated link checking, future test running).
8. **Decide the Cloudinary question** (build real integration vs. formally drop it from `.env.example`) — currently in an ambiguous middle state that's now at least accurately documented, but still worth resolving.
9. **Resolve the `Impact.tsx` dead code** — either wire it in or delete it.
10. **Extract the shared `ProjectCard` component** currently duplicated three ways.

## Longer-term / needs a real decision first

11. **Write ADR 0004** once the JWT-storage question (ADR 0003) is actually revisited, rather than leaving it in "accepted, tracked for revisit" limbo indefinitely.
12. **Add `eslint-plugin-jsx-a11y`** and address the specific accessibility gaps found (admin `Toggle` missing `aria-pressed`, inputs missing `htmlFor`/`id`).
13. **Confirm Supabase Point-in-Time Recovery is actually enabled** — currently documented as available but not verified enabled.
14. **Add Vercel Analytics** — lowest-effort real analytics option given the existing Vercel hosting.

## Documentation-specific recommendations

15. Wire the broken-link checker into CI once #7 lands.
16. Add real screenshots once the UI is stable (see [`../roadmap/future-documentation-roadmap.md`](../roadmap/future-documentation-roadmap.md)).
17. Get a second, independent read-through of [`audit-report.md`](./audit-report.md) and [`technical-debt-register.md`](./technical-debt-register.md) — see [`documentation-quality-report.md`](./documentation-quality-report.md)'s "known quality limitations."

## Related
- [`../architecture/future-architecture.md`](../architecture/future-architecture.md) — the same items with full architectural context
- [`technical-debt-register.md`](./technical-debt-register.md)
- Notion → Roadmap & Planning → Backlog (same items, tracked for execution)
