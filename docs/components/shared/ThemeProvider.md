# Component: `ThemeProvider` (+ `useTheme` hook-like export)

**File:** `frontend/src/components/ThemeProvider.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
React Context provider synchronizing React state with the `[data-theme]` DOM attribute that the root layout's inline script and server-side fetch already set — see [`../../architecture/theme-architecture.md`](../../architecture/theme-architecture.md) for the full resolution flow this component participates in (as the final, React-state-syncing step).

> Note: `useTheme` is exported from this file and is the one piece of "hook-shaped" code in the frontend, but it is a plain Context consumer (`useContext(ThemeContext)`), not a custom stateful hook of the kind [`hooks/README.md`](../../hooks/README.md) describes as absent. It doesn't change that finding — this is standard React Context wiring, not evidence of a missing hooks layer being filled.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `children` | `React.ReactNode` | Yes | — | Everything rendered below the root layout |

## Variants
None — provides exactly one context value: `{ theme: 'light' | 'dark', toggleTheme: () => void }`.

## Composition
On mount, reads whatever `data-theme` the server + inline script already applied to `<html>`, syncing it into React state. If `localStorage` has no stored preference, additionally checks `window.matchMedia('(prefers-color-scheme:dark)')` and applies system preference — this is the one layer of the theme system that knows about system preference (neither the server fetch nor the inline script do). `toggleTheme()` flips the theme, writes to `localStorage`, and sets the DOM attribute directly (not waiting for a re-render).

## Accessibility
No ARIA implications directly; theme toggle buttons ([`Navbar`](./Navbar.md), [`AdminShell`](../admin/AdminShell.md)) are the actual interactive elements consuming this context.

## Performance
Runs its sync effect once on mount (`useEffect(..., [])`) — cheap, no re-renders beyond the initial sync and any subsequent `toggleTheme()` calls.

## Example

```tsx
// In root layout:
<ThemeProvider>{children}</ThemeProvider>

// In any client component below it:
const { theme, toggleTheme } = useTheme();
```

## Best Practices
Always read theme state via `useTheme()`, never by reading `document.documentElement.getAttribute('data-theme')` directly from a component — the latter bypasses React's render cycle and won't trigger a re-render when the theme changes.

## Usage Guidelines
Don't wrap `ThemeProvider` around only part of the tree — it must wrap everything below the root layout's `<body>`, since [`Navbar`](./Navbar.md), [`AdminShell`](../admin/AdminShell.md), and every section component that reads `useTheme()` need it available everywhere.

## Future Improvements
None tracked specifically — see [`../../architecture/state-management.md`](../../architecture/state-management.md) for why this is the one piece of genuinely global client state in the app.
