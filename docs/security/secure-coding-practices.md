# Secure Coding Practices

## Input validation

Manual (regex + length checks) in route handlers, e.g. `backend/src/routes/contact.ts` caps `name` at 100 chars, `subject` at 200, `message` at 5000, and validates email format with a regex. `zod` is a frontend-only dependency today — see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #4 for the case to add it server-side.

## XSS mitigation

- `backend/src/lib/notifications.ts` implements a manual `escapeHtml()` function used when interpolating user-submitted contact-form content into HTML email templates — correct and necessary since Resend emails are raw HTML.
- Markdown fields (`overviewMd`, `problem`, `result`, `abstract`) are rendered via `react-markdown` + `remark-gfm` on the public site. `react-markdown` does not render raw HTML by default (unlike `dangerouslySetInnerHTML` approaches), which is the main XSS defense for this path — but this project has not added an explicit sanitization library (e.g. `rehype-sanitize`) on top, so treat this as "safe by library default," not "actively hardened," if Markdown content source ever becomes less trusted than "only the site owner via the admin panel."

## SQL injection

Not applicable in the traditional sense — all database access goes through Prisma's query builder (parameterized under the hood), with zero raw SQL (`$queryRaw`/`$executeRaw`) found anywhere in `backend/src`.

## Secrets in code

No hardcoded secrets found in source during the audit (see [`secrets-management.md`](./secrets-management.md) for the local-`.env`-file finding, which is a different category — an exposed real credential in a config file, not a hardcoded one in source).

## Error handling

Errors are generally caught and returned as `{ error: "message" }` with an appropriate status code, not leaked as raw stack traces to the client — confirmed across the route files read during the audit. Backend console logging of errors (for developer visibility) is separate from what's returned to the client.

## Related
- [`../standards/comment-standards.md`](../standards/comment-standards.md)
- [`owasp-checklist.md`](./owasp-checklist.md)
