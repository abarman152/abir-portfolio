# Changelog

All notable changes to this project are documented here. This log is curated (not a raw `git log` dump) — see [`docs/standards/changelog-conventions.md`](docs/standards/changelog-conventions.md) for the rules that govern it. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); this project does not currently use semantic version tags, so entries are grouped by date.

## [Unreleased]

### Changed
- **Replaced WhatsApp (Twilio) and SMTP (Nodemailer) contact-form notifications with a Resend-based email system.** Full details in [`docs/releases/2026-notification-system-migration.md`](docs/releases/2026-notification-system-migration.md). Summary:
  - `ContactMessage` model gained `emailSent`, `emailSentAt`, `resendMessageId`, `notificationStatus`, `adminNotified`.
  - `NotificationSettings` dropped `whatsappEnabled`/`whatsappNumbers`, gained `notificationEmail`, `backupNotificationEmail`, `resendEnabled`, `resendFromEmail`, `resendReplyTo`, `autoReplyEnabled`.
  - Backend dependencies: removed `twilio`, `nodemailer`, `@types/nodemailer`; added `resend`.
  - Rewrote `backend/src/lib/notifications.ts` around the Resend SDK — admin notification email plus an optional auto-reply, HTML-escaped templates, DB status tracking per send attempt.
  - Admin notifications page rebuilt: removed the WhatsApp UI, added primary/backup notification email fields, Resend from/reply-to config, and an auto-reply toggle.
  - Backward compatible — no destructive migrations.
- Added accessibility attributes (`aria-label`, `role="alert"`) and anti-double-submit protection to the contact form.

### Fixed
- Dashboard analytics counts.

### Documentation
- Full enterprise-grade documentation audit and restructure: reorganized `docs/` into topic-based subdirectories, corrected drift between docs and code (Cloudinary, response envelope, port defaults, route groups), added ADRs, templates, standards, and health reports.

---

## 2026-05-06

- **fix:** Admin dashboard counts were broken; added admin password management (`POST /api/auth/change-password`).
- **feat:** Theme-aware transparent logo system — renders both light/dark logo variants and toggles visibility via CSS `[data-theme]` selectors to avoid flash/mismatch.
- **fix(seo):** Stabilized favicon URLs so Google Search re-indexes the correct icons.
- **fix:** Resolved empty homepage on cold backend start (added fetch timeouts and graceful fallbacks for Render free-tier cold starts).

## 2026-05-01

- **feat:** Contact message forwarding system with admin-controlled notification settings (superseded by the Resend migration above).
- **feat:** Admin-controlled skills system with `SkillCategory` CRUD.
- **feat:** Dynamic About section — profile, education, and skill groups all admin-editable.
- **feat:** Replaced mobile dropdown navigation with a slide-in drawer menu.
- **fix:** Rebranded "Abir.dev" → "Abir" across logo system, favicon metadata; resolved a hydration mismatch (React error #418) in the process.
- **fix:** Replaced all `toLocaleDateString` calls with deterministic UTC date formatters (avoids server/client hydration mismatches from locale/timezone differences).
- **fix:** Forced IPv4 for the (now-removed) SMTP transport to work around Render's lack of outbound IPv6 to Gmail.
- **fix:** Mobile navbar overflow and achievement gallery responsiveness.

## 2026-04-30

- **feat:** Achievements page and timeline.
- **feat:** Floating hero customization controls; background image switching per theme.
- Certification card image system switched to use badge images instead of certificate images.
- Default theme set to dark; various theme and card layout fixes.

## 2026-04-29

- **feat:** Full Research section — listing page, detail page, admin CRUD, database model, navigation entry.
- **feat:** Redesigned project detail pages as a case-study layout with Markdown support (overview/problem/result).
- **feat:** Premium animation system applied across the site (Framer Motion, scroll-triggered, hover states).
- **feat:** Certifications section added.
- **fix:** Guarded against undefined `techStack` and a dual-format API response on the projects page.
- **fix:** Extracted project detail interactive UI into a client component (server/client boundary correction).

## 2026-04-28

- **fix:** Resolved all TypeScript build errors blocking Render deployment.
- **fix:** CORS allowlist updated to permit both `www` and non-`www` origins.
- **feat:** Certifications added to the database seed script.
- Initial project sprint — base Next.js/Express/Prisma scaffold, hero/about/projects/skills sections, admin CRUD foundation.

---

## Notes on this log

- Commits before this changelog existed used inconsistent, sometimes non-descriptive messages (e.g. `update`, `fix`, `dep`). Where a commit's actual content couldn't be summarized meaningfully from its message alone, it was folded into the nearest related entry above rather than listed verbatim — see `git log` for the unfiltered history.
- Going forward, follow [Conventional Commits](https://www.conventionalcommits.org/)-style prefixes (`feat:`, `fix:`, `chore:`, `docs:`) as already used in the more recent history above, and add an entry here for every user-facing or architecturally significant change — see [`docs/templates/changelog-entry-template.md`](docs/templates/changelog-entry-template.md).
