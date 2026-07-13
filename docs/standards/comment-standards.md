# Comment Standards

This applies to comments **in code**, not in Markdown docs (Markdown has no equivalent concept — prose either explains something or it doesn't).

## The rule

Default to **no comments**. Only write one when the *why* is genuinely non-obvious to a competent reader of the code — a hidden constraint, a workaround for a specific external bug, a subtle invariant, or behavior that would surprise someone. Never write a comment that restates what the code already says.

This matches the existing convention in `frontend/AGENTS.md` and the audited codebase itself: a full grep of `frontend/src` and `backend/src` during the 2026-07 audit found **zero** `TODO`/`FIXME`/`HACK` comments and very few comments overall — the codebase already follows this rule closely. Keep it that way.

### Bad (restates the code)

```ts
// increment the counter
counter++;

// loop through all projects
projects.forEach(p => { ... });
```

### Good (explains a non-obvious why)

```ts
// Render's free tier has no outbound IPv6 route to Gmail's SMTP servers —
// force IPv4 or delivery silently times out. See commit 05c41cf.
const transport = nodemailer.createTransport({ host, family: 4 });
```

```ts
// setImmediate: don't block the HTTP response on email delivery —
// the contact form should feel instant even if Resend is slow/down.
setImmediate(() => sendContactNotifications(message));
```

## What never gets a comment

- Type annotations and interface fields — the type itself is the documentation (see [`utilities/types-reference.md`](../utilities/types-reference.md) for how shared types are documented at a higher level instead).
- Standard framework patterns (`'use client'` directives, `useEffect` cleanup) — these are self-explanatory to anyone who knows Next.js/React; don't explain the framework, only the exception to expected framework behavior.
- Commented-out code. Delete it — git history is the undo button, not a comment block. (The audit found no commented-out code blocks in this repo; keep it that way.)

## Docstrings

This project does not use JSDoc/TSDoc block comments on functions. If a function's behavior genuinely needs explanation beyond its name and types, that's a signal it should either be renamed/simplified, or documented at the feature/utility level in `/docs` (see [`utilities/`](../utilities/)) rather than inline — inline docstrings drift from the code silently in a way that a single canonical doc entry, reviewed as part of the standard review process, does not.
