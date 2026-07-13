# Component: `AdminTable`

**File:** `frontend/src/components/admin/AdminTable.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Generic data-table component used by most list-style admin CRUD pages — renders rows with per-column custom render functions, plus edit/delete icon buttons and an "Add New" button.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | Yes | — | Page heading, shown above the table with an item count |
| `data` | `T[]` (`T extends { id: string }`) | Yes | — | Rows to render |
| `columns` | `Column<T>[]` (`{ key, label, render? }`) | Yes | — | Column definitions; `render(row)` overrides the default `String(row[key])` rendering |
| `onAdd` | `() => void` | Yes | — | Called when "Add New" is clicked — typically opens a [`Modal`](./Modal.md) in create mode |
| `onEdit` | `(item: T) => void` | Yes | — | Called with the row's data when its edit (pencil) icon is clicked |
| `onDelete` | `(id: string) => void` | Yes | — | Called with the row's `id` after the browser's native `confirm()` dialog is accepted |
| `loading` | `boolean` | No | `undefined` (falsy) | Shows `"Loading..."` text in place of the table body |

## Variants
None — a single table layout, generic over `T`. Empty state ("No items yet...") shown when `data.length === 0` and not loading.

## Composition
Pure presentational/generic component — no data fetching of its own. Callers (the ~13 admin CRUD pages, see [`../../pages/admin-crud-pages.md`](../../pages/admin-crud-pages.md)) own all state and pass it in.

## Accessibility
Table uses semantic `<table>`/`<thead>`/`<tbody>` markup. Edit/delete buttons are icon-only with no `aria-label` — a screen reader will announce them only by their icon's implicit role, which is a gap (contradicts the general labeling convention followed elsewhere, e.g. [`Contact`](../sections/Contact.md)'s `aria-label`-equipped submit button).

## Performance
No virtualization or pagination built in — every row in `data` renders via `.map()`. Each row has a Framer Motion fade-in staggered by `i * 0.04`s, which becomes a very small stagger delay for tables with many rows (effectively imperceptible past ~20 rows) rather than a a real performance concern at current content volumes.

## Example

```tsx
<AdminTable<Project>
  title="Projects"
  data={projects}
  columns={[
    { key: 'title', label: 'Title' },
    { key: 'featured', label: 'Featured', render: (p) => (p.featured ? 'Yes' : 'No') },
  ]}
  onAdd={() => openModal()}
  onEdit={(p) => openModal(p)}
  onDelete={(id) => deleteProject(id)}
  loading={loading}
/>
```

## Best Practices
- Keep `columns` to a handful of high-signal fields — the table has no column-hiding/responsive-collapse behavior beyond horizontal scroll (`overflowX: 'auto'`) on narrow viewports.
- Use `render` for any field needing formatting (dates, booleans, truncated text) rather than pre-formatting the row data itself, so `data` stays a plain typed array.

## Usage Guidelines
- Delete confirmation is a native `confirm()` browser dialog, not a custom modal — don't expect a styled confirmation step; it's a blocking OS-level dialog.
- Don't use this for singleton-style admin pages (about, settings, notifications) — those pages render custom form layouts instead, since there's no list to tabulate. See [`../../pages/admin-crud-pages.md`](../../pages/admin-crud-pages.md).

## Future Improvements
Icon-only edit/delete buttons could use `aria-label` for better screen-reader support — noted in [`../../appendices/audit-report.md`](../../appendices/audit-report.md) item 21 as a general admin-panel accessibility gap.
