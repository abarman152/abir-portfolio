# Utility: `api` / `authHeader`

**File:** `frontend/src/lib/api.ts`

## Purpose
A typed `fetch` wrapper used across the frontend for all backend API calls, plus a small helper for attaching the admin JWT to requests.

## Signature

```ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  get:    <T>(path: string, headers?: HeadersInit) => Promise<T>,
  post:   <T>(path: string, body: unknown, headers?: HeadersInit) => Promise<T>,
  put:    <T>(path: string, body: unknown, headers?: HeadersInit) => Promise<T>,
  patch:  <T>(path: string, body?: unknown, headers?: HeadersInit) => Promise<T>,
  delete: <T>(path: string, headers?: HeadersInit) => Promise<T>,
};

export function authHeader(token: string): HeadersInit;
```

## Parameters

| Param | Type | Description |
|---|---|---|
| `path` | `string` | Path appended to `BASE_URL`, e.g. `/hero`, `/projects/:slug` |
| `body` | `unknown` | JSON-serialized automatically (`JSON.stringify`) for `post`/`put`/`patch` |
| `headers` | `HeadersInit?` | Merged with the default `Content-Type: application/json`; typically the output of `authHeader(token)` |
| `token` (for `authHeader`) | `string` | The raw JWT, read by the caller from `localStorage.getItem('admin_token')` |

## Returns
Each method returns `Promise<T>` — the parsed JSON response body, typed by the caller's generic parameter. There is no runtime validation that the response actually matches `T`; the type is asserted, not checked.

## Usage Example

```ts
import { api, authHeader } from '@/lib/api';
import type { HeroContent } from '@/lib/types';

// Public GET
const hero = await api.get<HeroContent>('/hero');

// Authenticated PUT
const token = localStorage.getItem('admin_token') || '';
await api.put<HeroContent>('/hero', payload, authHeader(token));
```

## Edge Cases / Gotchas
- **Non-2xx responses throw `Error("API error: ${status}")`** — a generic message with no access to the response body's `{ error: "message" }` payload. Callers that want the backend's actual error text (e.g. `admin/notifications/page.tsx`'s `sendTest()`) cannot get it through this client as written; they only see the HTTP status.
- **`BASE_URL` fallback is `http://localhost:5000/api`** — this differs from the fallback used in ~15 other files across the frontend (`http://localhost:5001/api`, e.g. every page-level `fetch` in `app/*/page.tsx`). This is a confirmed inconsistency, not two intentional environments — see [technical debt item #7](../appendices/technical-debt-register.md).
- Not all frontend code goes through this client — most Server Component pages call `fetch()` directly with their own inline `API` constant rather than importing `api.get`, duplicating the base-URL-resolution logic (see [technical debt item #8](../appendices/technical-debt-register.md)). `api.ts` is used consistently by admin pages and the login page, less consistently elsewhere.
- No request timeout/abort logic here — timeouts (`AbortSignal.timeout(...)`) are added ad hoc by individual page-level `fetch` calls that bypass this client, not by `api.ts` itself.

## Related
- [`../architecture/overview.md`](../architecture/overview.md) — confirms responses are raw objects/arrays on success, `{ error: "message" }` on failure (no `{ data, error }` envelope)
- [`../pages/admin-crud-pages.md`](../pages/admin-crud-pages.md) — the primary consumer of this client
- [`../api/rest-api-reference.md`](../api/rest-api-reference.md)
