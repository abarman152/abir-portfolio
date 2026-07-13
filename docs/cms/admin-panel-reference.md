# Admin Panel

The admin panel is a protected CMS for managing all portfolio content. It lives at `/admin` on the frontend.

**Production URL:** https://abirbarman.com/admin

---

## Access

1. Navigate to `/admin/login`.
2. Enter admin email and password.
3. A JWT is stored in `localStorage` and attached to all subsequent API calls.
4. The session persists until the token expires (7 days) or you clear localStorage.

Unauthenticated requests to `/admin/*` routes are redirected to `/admin/login`.

---

## Dashboard

The admin dashboard at `/admin/dashboard` provides an overview of:
- Total counts for projects, research papers, certifications, achievements
- Unread contact messages
- Quick links to all management sections

---

## Content Sections

### Hero (`/admin/hero-badges`)

Manage the hero section content:
- Name, tagline, animated roles, bio
- Resume URL, avatar image (Cloudinary URL)
- Floating badge labels (label, icon, position, active state)

---

### Social Links (`/admin/social`)

Manage social media profile links:
- Platform name, URL, username, icon
- Visibility toggle, display order

---

### Projects (`/admin/projects`)

Full CRUD for portfolio projects.

**Key fields:**
- Title, slug (auto or manual), short description
- Tech stack tags
- Problem statement (Markdown), result (Markdown), overview (Markdown)
- Cover image, banner image, screenshots gallery, result images
- GitHub URL, live demo URL
- Featured flag, published flag, display order
- Character limits for problem and result fields

The project detail page renders a case-study layout: banner → title/stack → overview → problem → result → gallery → links.

---

### Research (`/admin/research`)

Manage published research papers.

**Key fields:**
- Title, slug, abstract, full overview (Markdown)
- Authors (JSON array: `[{ name, role, isPrimary }]`)
- Published date, publisher/journal
- Publication URL, Google Scholar URL
- Tags, featured flag, display order

---

### Certifications (`/admin/certifications`)

Manage professional credentials.

**Key fields:**
- Title, issuer, issue date, expiry date
- Credential ID, credential verification URL
- Badge image, certificate image (Cloudinary)
- Category, description, overview (Markdown)
- Skills array, tags, featured flag, visibility toggle, display order

---

### Achievements (`/admin/achievements`)

Manage awards, honors, and milestones.

**Key fields:**
- Title, slug, description, overview (Markdown)
- Date, issuing organization
- Category, badge icon, images (gallery)
- Tags, featured flag, visibility toggle, display order

---

### Skills (`/admin/skills`)

Manage the skills section entries.

**Key fields:**
- Name, category, proficiency level (0–100), icon, display order

---

### Stats (`/admin/stats`)

Manage animated impact counter entries.

**Key fields:**
- Label, numeric value, suffix (e.g., "+", "%"), icon, display order

---

### About (`/admin/about`)

Three sub-sections:

**Profile:** Name, title, subtitle, summary, contact info (phone, email, location), social URLs, photos, section visibility toggles.

**Education:** Degree, institution, location, start/end dates, description, visibility, order.

**Skill Groups:** Grouped skill tag lists for the about page (separate from the main skills section).

---

### Contact Messages (`/admin/messages`)

View inbound messages from the public contact form:
- Read/unread status
- Mark as read, delete
- Message details: name, email, subject, message, timestamp

---

### Settings (`/admin/settings`)

Site-wide configuration:

| Setting | Description |
|---|---|
| Default theme | `dark` or `light` — applied server-side to prevent flash |
| Accent color | CSS variable `--accent` (hex, e.g., `#6366f1`) |
| Meta title | `<title>` tag for all public pages |
| Meta description | `<meta name="description">` |
| OG image URL | Open Graph image for social sharing |
| Hero config | Background type (gradient/image), background value, profile image, per-theme images, overlay style, linked mode |

---

## Security Notes

- All admin API routes reject requests without a valid, non-expired JWT.
- The token is verified on every request by the `authenticate` middleware (`backend/src/middleware/auth.ts`).
- There is no public registration — the admin account is created via the seed script or `POST /api/auth/setup` (only works when no admin exists).
- Never share the admin JWT or store it in an insecure location.
