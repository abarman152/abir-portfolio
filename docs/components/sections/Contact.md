# Component: `Contact`

**File:** `frontend/src/components/sections/Contact.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Homepage contact section: static contact-info panel (email/phone/location/response-time) plus the public contact form. See [`../../features/contact-form.md`](../../features/contact-form.md) for the full feature-level writeup (submission flow, backend validation, email notification dispatch) — this doc covers the component itself.

## Props
None — this component takes no props; it manages its own form state and posts directly to the API.

## Variants
Submit button changes color/label/icon by `status` (`'idle' | 'loading' | 'success' | 'error'`): default accent color + "Send Message", green + checkmark on success, red + alert icon on error, with a 3-dot bounce animation while `loading`.

## Composition
Self-contained — no child components beyond `lucide-react` icons. Calls `api.post('/contact', form)` from [`api-client.md`](../../utilities/api-client.md) directly.

## Accessibility
Submit button has `aria-label="Send contact message"`. Error message renders with `role="alert"`. All four fields (`name`, `email`, `subject`, `message`) have visible `<label>` elements — this form follows the labeling convention correctly (unlike some public-site filter inputs elsewhere).

## Performance
A `useRef` guard (`submitting.current`) prevents double-submission from rapid double-clicks, independent of the `status === 'loading'` state check on the button's `disabled` attribute — belt-and-suspenders against duplicate submissions.

## Example

```tsx
<Contact />
```

## Best Practices
- This component is self-fetching/self-contained by design — don't try to lift its form state to a parent; there's no prop interface for that.

## Usage Guidelines
- Don't render this component more than once per page — it targets `id="contact"` for anchor-link scrolling (`/#contact` links from [`Navbar`](../shared/Navbar.md) and [`Footer`](../shared/Footer.md) both assume a single instance on the homepage).

## Future Improvements
See [`../../features/contact-form.md`](../../features/contact-form.md) for known limitations (no CAPTCHA, no client-side rate-limit awareness beyond the double-click guard).
