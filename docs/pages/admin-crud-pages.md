# Pages: Admin CRUD Sections (consolidated)

This single doc covers the shared pattern across all ~13 admin content-management pages, rather than duplicating near-identical structure 13 times. For the specific fields/business rules of each section, see [`../cms/admin-panel-reference.md`](../cms/admin-panel-reference.md), which is already thorough on a per-section basis.

## Pages covered

| Route | File | Backend resource |
|---|---|---|
| `/admin/about` | `frontend/src/app/admin/about/page.tsx` | `/api/about/*` (profile, education, skills) |
| `/admin/achievements` | `frontend/src/app/admin/achievements/page.tsx` | `/api/achievements` |
| `/admin/certifications` | `frontend/src/app/admin/certifications/page.tsx` | `/api/certifications` |
| `/admin/hero-badges` | `frontend/src/app/admin/hero-badges/page.tsx` | `/api/hero`, `/api/hero-badges` |
| `/admin/messages` | `frontend/src/app/admin/messages/page.tsx` | `/api/contact` |
| `/admin/notifications` | `frontend/src/app/admin/notifications/page.tsx` | `/api/notification-settings` |
| `/admin/projects` | `frontend/src/app/admin/projects/page.tsx` | `/api/projects` |
| `/admin/research` | `frontend/src/app/admin/research/page.tsx` | `/api/research` |
| `/admin/settings` | `frontend/src/app/admin/settings/page.tsx` | `/api/settings` |
| `/admin/skills` | `frontend/src/app/admin/skills/page.tsx` | `/api/skills`, `/api/categories` |
| `/admin/social` | `frontend/src/app/admin/social/page.tsx` | `/api/social` |
| `/admin/stats` | `frontend/src/app/admin/stats/page.tsx` | `/api/stats` |

`/admin/dashboard` and `/admin/login` are documented separately ([`admin-dashboard.md`](./admin-dashboard.md), [`admin-login.md`](./admin-login.md)) since they don't follow this CRUD pattern.

## Purpose
Each page provides full CRUD (or singleton edit, for `about`/`settings`/`hero-badges`/`notifications`) for one content model, gated behind admin auth.

## Route
All routes are flat under `/admin/*`, no nested dynamic segments — every admin page manages its own list state and opens a modal for create/edit rather than navigating to a `[id]` route.

## SEO & Metadata
Not applicable — admin pages are excluded from `sitemap.ts` and inherit the static `admin/layout.tsx` title only.

## Layout
Every page in this group is wrapped in [`AdminShell`](../components/admin/AdminShell.md), which supplies the sidebar nav and the client-side auth guard (see [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md)).

## Shared pattern

### 1. Data loading
Every page follows the same shape, independently re-implemented per file (no shared hook — see [`hooks/README.md`](../hooks/README.md) and [technical debt item #9](../appendices/technical-debt-register.md)):

```ts
function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';
}

const [data, setData] = useState<T[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  api.get<T[]>('/resource', authHeader(getToken()))
    .then(setData)
    .catch(...)
    .finally(() => setLoading(false));
}, []);
```

### 2. List rendering
Most list-style pages (projects, research, certifications, achievements, skills, stats, social, hero-badges) render their data through [`AdminTable`](../components/admin/AdminTable.md) — a generic `<T extends { id: string }>` component that takes `columns`, `onAdd`, `onEdit`, `onDelete`. Singleton-style pages (about, settings, notifications) render a custom form layout instead, since there's no list to tabulate.

### 3. Create/edit modal
List-style pages open [`Modal`](../components/admin/Modal.md) (with its `FormField`/`inputCss` helpers) for both create and edit, reusing one form component keyed by whether an `id` is present in the form state.

### 4. Save/toast pattern
Every page implements its own save handler and its own toast/feedback state — there is no shared `useToast()` hook. The pattern (seen verbatim in `notifications/page.tsx` and repeated with minor variation elsewhere):

```ts
type ToastState = { type: 'success' | 'error'; msg: string } | null;
const [toast, setToast] = useState<ToastState>(null);
const showToast = (type, msg) => {
  setToast({ type, msg });
  setTimeout(() => setToast(null), 3500);
};
```

Save requests go through `api.put`/`api.post` with `authHeader(getToken())`, and either call `showToast('success', ...)` on resolve or catch and `showToast('error', ...)`.

### 5. Delete confirmation
`AdminTable`'s delete button uses a native `confirm('Delete this item?')` browser dialog — not a custom confirmation modal — before calling `onDelete(id)`.

### 6. Inline-style convention
Every admin page in this group is styled with inline `style={{ }}` objects almost exclusively (CSS variables like `var(--accent)`, `var(--bg-2)` for theme values), not Tailwind utility classes. This is the opposite convention from the public-facing pages, which mix Tailwind with CSS variables. This is a real inconsistency, not a deliberate two-tier design system — see [technical debt item #10](../appendices/technical-debt-register.md).

## Components Used
[`AdminShell`](../components/admin/AdminShell.md), [`AdminTable`](../components/admin/AdminTable.md), [`Modal`](../components/admin/Modal.md) (list-style pages); custom inline forms (singleton-style pages: about, settings, notifications, hero-badges).

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md). This is the single largest concentration of duplicated stateful logic in the codebase (load/save/toast/array-add-remove, repeated ~13 times).

## Data Sources
See the per-route table above and [`../api/rest-api-reference.md`](../api/rest-api-reference.md) for exact endpoints. All mutation endpoints require `[AUTH]` (JWT via `authHeader()`).

## Loading States
Typically a simple `"Loading..."` string inside `AdminTable`, or a `Loader2` spin icon on singleton-style pages (see `notifications/page.tsx`) — no skeleton screens in the admin panel.

## Error States
Inconsistent across pages: some show a toast on fetch failure, others only `console.error` and leave the page in an empty/loading-forever-looking state. Not standardized — a direct consequence of not having a shared data-fetching hook.

## Accessibility
Toggle switches (e.g. `Toggle`/`HighlightToggle` components seen in `notifications`/`skills`) are custom `<button>`-based switches without `role="switch"` or `aria-pressed` — a confirmed accessibility gap noted in [`appendices/audit-report.md`](../appendices/audit-report.md) item 21. Most inputs do have visible `<label>` elements via the shared `FormField` helper in `Modal.tsx`, unlike some public-site filter inputs.

## Performance
No pagination on most admin list views — pages typically fetch the "all" variant of an endpoint (e.g. `/certifications/all`, `/achievements/all`) in one call and render every row via `AdminTable`. Fine at current content volume; would need attention if content volume grew substantially.

## Related Pages
- [`admin-dashboard.md`](./admin-dashboard.md), [`admin-login.md`](./admin-login.md)
- [`../cms/admin-panel-reference.md`](../cms/admin-panel-reference.md) — per-section field reference
- [`../components/admin/AdminShell.md`](../components/admin/AdminShell.md), [`../components/admin/AdminTable.md`](../components/admin/AdminTable.md), [`../components/admin/Modal.md`](../components/admin/Modal.md)
- [`../features/admin-password-management.md`](../features/admin-password-management.md)
- [`../features/notification-system.md`](../features/notification-system.md) — the `/admin/notifications` page specifically
