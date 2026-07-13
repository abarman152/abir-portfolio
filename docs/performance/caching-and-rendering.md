# Caching

Full rendering-strategy detail (including the homepage double-fetch issue) lives in [`../architecture/rendering-strategy.md`](../architecture/rendering-strategy.md) — this doc is the caching-specific summary.

## What's cached

| Layer | Cached? | Detail |
|---|---|---|
| Most public pages | No | Per-request SSR fetch, no `revalidate` set — always fresh, at the cost of latency scaling with traffic |
| Site settings (theme, meta) | Yes | `revalidate: 300` (5 min) |
| `sitemap.ts` | Yes | `revalidate: 3600` (1 hr), with a 5s fetch timeout and graceful empty-array fallback |
| API responses (backend) | Explicitly disabled | `Cache-Control: no-store`, `Pragma: no-cache`, `Expires: 0` set on every `/api` response — see [`../security/headers-and-cors.md`](../security/headers-and-cors.md) |
| Static assets (favicons, OG image) | Yes | Long cache headers in `frontend/vercel.json` |

## Why almost nothing is cached

All content is admin-editable at any time with no cache-invalidation trigger wired to admin saves (no `revalidatePath`/`revalidateTag` call anywhere) — see [`../architecture/cms-flow.md`](../architecture/cms-flow.md). The safe default without that wiring is "don't cache, always fetch fresh," which is what's implemented (with the two explicit revalidate-window exceptions above, both accepted staleness tradeoffs for content that changes rarely).

## If this needs to scale

Add `revalidatePath('/')`-style calls (or ISR with on-demand revalidation) triggered from the admin save handlers for each resource — this would let public pages use a much longer `revalidate` window (or none at all, fully static, revalidated on demand) without risking stale content after an edit. This is a real, well-scoped future improvement — see [`../architecture/future-architecture.md`](../architecture/future-architecture.md).

## Related
- [`../architecture/rendering-strategy.md`](../architecture/rendering-strategy.md)
- [`../architecture/cms-flow.md`](../architecture/cms-flow.md)
