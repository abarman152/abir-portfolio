# Layout: Admin Layout

**File:** `frontend/src/app/admin/layout.tsx`

## Purpose
Sets the static `<title>` metadata for every route under `/admin/*`. That is its entire implementation.

```tsx
export const metadata: Metadata = { title: 'Admin | Abir Barman' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

## Scope
Every route under `frontend/src/app/admin/` — `/admin/login`, `/admin/dashboard`, and all 13 CRUD sections.

## Responsibilities
- Exports a static `metadata` object (`title: 'Admin | Abir Barman'`) applied to every admin route, since none of the admin pages export their own per-route metadata.
- Renders `children` inside a React Fragment — no wrapping element, no providers, no chrome.

## What it does NOT do
**This layout does not perform authentication or route protection of any kind.** It is a plain pass-through. Read this carefully if you're looking for where `/admin/*` access control lives — it is **not here**.

The actual guard is a `useEffect` inside [`AdminShell.tsx`](../components/admin/AdminShell.md), which every admin page (except `/admin/login`) renders itself:

```ts
useEffect(() => {
  const token = localStorage.getItem('admin_token');
  if (!token) router.replace('/admin/login');
  setMounted(true);
}, [router]);
```

Practical consequence: because this layout does nothing, and because there is no `middleware.ts` anywhere in the frontend, an unauthenticated visitor's browser does receive the initial HTML/JS for an admin page shell before the client-side redirect in `AdminShell` fires. Every actual data fetch remains independently JWT-gated server-side, so this is not a data leak — but the admin UI shell itself is not access-controlled at the routing/layout level. Full discussion: [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md) and [technical debt item #13](../appendices/technical-debt-register.md).

## Composition
No providers, no wrapping markup — `children` renders directly. `ThemeProvider` is already available from the root layout above it (see [`root-layout.md`](./root-layout.md)); this layout doesn't need to re-provide it.

## Data Fetching
None — this layout performs no fetches at all, server or client.

## Related
- [`../components/admin/AdminShell.md`](../components/admin/AdminShell.md) — where the real guard lives
- [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md)
- [`../pages/admin-login.md`](../pages/admin-login.md)
- [`root-layout.md`](./root-layout.md)
