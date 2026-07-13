# Component: `Modal`

**File:** `frontend/src/components/admin/Modal.tsx`
**Type:** Client Component (`'use client'`)

Also exports: `FormField` (labeled form-field wrapper) and `inputCss` (shared inline-style object for text inputs), both used across admin CRUD forms.

## Purpose
The shared create/edit dialog used by every list-style admin CRUD page — a centered panel with a header, form body (`children`), and Cancel/Save footer.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `open` | `boolean` | Yes | — | Controls mount/unmount via `AnimatePresence` |
| `onClose` | `() => void` | Yes | — | Called on backdrop click or the header's close (X) button, and on "Cancel" |
| `title` | `string` | Yes | — | Modal header text |
| `children` | `React.ReactNode` | Yes | — | Form fields, typically wrapped in `FormField` |
| `onSubmit` | `(e: React.FormEvent) => void` | Yes | — | Form's `onSubmit` handler — the modal wraps `children` in a real `<form>` |
| `submitLabel` | `string` | No | `'Save'` | Submit button text |
| `loading` | `boolean` | No | `undefined` | Disables the submit button and shows "Saving…" while `true` |

## Variants
None — one modal layout, shared by every admin page that needs create/edit.

## Composition
`FormField({ label, required, children })` — a small wrapper rendering a `<label>` above `children`, with a red `*` if `required`. `inputCss` — a shared `React.CSSProperties` object most admin forms spread onto their `<input>`/`<textarea>`/`<select>` elements for visual consistency without a shared CSS class.

## Accessibility
The form's inputs get real `<label>` elements via `FormField` — this is the main mechanism keeping admin forms compliant with the labeling convention (contrasted with the public-site filter inputs, which are often placeholder-only). The modal itself does not implement a JS focus trap or `Escape`-to-close listener — closing only happens via backdrop click or the explicit close/cancel buttons, which is a gap relative to `AGENTS.md` §8.4's stated intent ("Modals must trap focus and close on `Escape` or backdrop click").

## Performance
`AnimatePresence` mounts/unmounts the whole modal tree (not just toggling visibility), so form state inside `children` resets whenever the modal closes and reopens — callers must not assume any input state case survives a close/reopen cycle unless they manage that state outside the modal's children.

## Example

```tsx
<Modal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  title={editing ? 'Edit Project' : 'New Project'}
  onSubmit={handleSubmit}
  loading={saving}
>
  <FormField label="Title" required>
    <input style={inputCss} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
  </FormField>
</Modal>
```

## Best Practices
Use `FormField` + `inputCss` for every field in a new admin form to match the established visual/accessibility convention, rather than hand-rolling label/input markup.

## Usage Guidelines
Don't rely on `Escape` closing the modal — it currently doesn't. Don't assume child form state persists across a close → reopen cycle without external state management.

## Future Improvements
Adding `Escape`-to-close and a JS focus trap would close the gap against `AGENTS.md` §8.4's stated modal requirements; not currently tracked as a numbered debt item.
