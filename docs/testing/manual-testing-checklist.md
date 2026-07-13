# Manual Testing Checklist

Run this before merging anything non-trivial and before every production deploy — this is the only testing gate that exists today (see [`strategy.md`](./strategy.md)).

## Public site

- [ ] Home page loads with all sections populated (hero, about, projects, research, certifications, achievements, skills, stats, contact)
- [ ] Each list page (`/projects`, `/research`, `/certifications`, `/achievements`) loads and paginates correctly
- [ ] Each detail page (`/projects/[slug]`, etc.) renders Markdown content correctly (overview/problem/result)
- [ ] Contact form: submits successfully, shows success feedback, rejects invalid email, respects the 5/hour rate limit
- [ ] Theme toggle works and persists across a reload; no flash of wrong theme on load
- [ ] Dark and light theme both look correct on every page (check contrast, not just "it renders")
- [ ] Sitemap (`/sitemap.xml`) and `robots.txt` are reachable and correct

## Admin panel

- [ ] Login works with valid credentials, rejects invalid ones
- [ ] Unauthenticated visit to any `/admin/*` route redirects to `/admin/login`
- [ ] Dashboard counts match actual DB record counts
- [ ] For each CRUD section touched by your change: create, edit, delete, and (where applicable) toggle visibility/featured — verify the public site reflects the change
- [ ] Notification settings: "Send Test Email" actually delivers
- [ ] Change-password flow works and the new password is required on next login

## Cross-cutting

- [ ] `npm run lint` passes (frontend)
- [ ] `cd backend && npx tsc --noEmit` passes
- [ ] `cd frontend && npm run build` succeeds locally before pushing (catches build-only errors — see [`../development/troubleshooting.md`](../development/troubleshooting.md))
- [ ] No new console errors/warnings in the browser devtools on any touched page
- [ ] Mobile viewport check (navbar drawer, admin sidebar) — both have known responsive-design history (commit `c3af17e`)

## Related
- [`strategy.md`](./strategy.md)
- [`../development/troubleshooting.md`](../development/troubleshooting.md)
