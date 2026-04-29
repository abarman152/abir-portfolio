<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — AI Agent Rulebook

> This document is the authoritative rulebook for any AI agent working on this codebase.
> Read it in full before making any change. Violations of these rules produce low-quality,
> inconsistent, or broken output. These rules are not suggestions.

---

## 1. OVERVIEW

### 1.1 Project Purpose

This is the personal portfolio website of **Abir Barman** — Data Scientist & Full Stack Developer.
The site showcases projects, research, certifications, achievements, skills, and contact information.
It is designed to convey a premium, minimal, Apple-inspired aesthetic with full admin control over all content.

### 1.2 Role of AI Agents

AI agents assist in building and maintaining this codebase. They must:

- Write production-grade, scalable, and readable code
- Respect the separation between frontend, backend, and database layers
- Never introduce hardcoded content, inconsistent styles, or logic that belongs in a different layer
- Maintain the existing design system without deviation
- Leave the codebase cleaner than they found it

### 1.3 Key Principles

- **Scalable** — all content is stored in the database and fetched via API
- **Clean** — modular, readable code with no unnecessary complexity
- **Maintainable** — consistent conventions across the entire stack
- **Premium** — every UI detail reflects a high-quality, intentional design

---

## 2. ARCHITECTURE RULES

### 2.1 Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Next.js (App Router), TypeScript        |
| Backend   | Node.js, Express, TypeScript            |
| Database  | PostgreSQL via Supabase (Prisma ORM)    |
| Storage   | Cloudinary (images)                     |
| Deploy FE | Vercel                                  |
| Deploy BE | Render                                  |
| Deploy DB | Supabase                                |

### 2.2 Layer Separation

- The **frontend** is a presentation layer only. It fetches data from the backend API and renders it.
- The **backend** owns all business logic, validation, and database access.
- The **database** is the single source of truth for all content.
- These layers must never bleed into each other.

### 2.3 Communication

- All frontend ↔ backend communication uses REST API calls.
- The base API URL is stored in `NEXT_PUBLIC_API_URL` (frontend) and never hardcoded.
- API responses follow a consistent shape:
  ```json
  { "data": ..., "error": null }
  { "data": null, "error": "message" }
  ```

### 2.4 Routing

- Use dynamic segments (`[slug]`, `[id]`) for all entity-specific pages.
- No hardcoded paths in components or pages. Use constants or helper functions if a path is reused.
- Frontend routes mirror the API routes in intent (e.g., `/projects/[slug]` → `GET /api/projects/:slug`).

---

## 3. DATABASE RULES

### 3.1 No Hardcoded Content

Every piece of user-facing content — text, images, links, labels — must live in the database.
Never write static content into components, pages, or configuration files.

### 3.2 Schema Standards

Every model must follow these conventions:

| Field       | Type       | Purpose                              |
|-------------|------------|--------------------------------------|
| `id`        | `String` (cuid) | Primary key                    |
| `createdAt` | `DateTime` | Set on creation                      |
| `updatedAt` | `DateTime` | Auto-updated on every write          |
| `slug`      | `String` (unique) | URL-safe identifier (where applicable) |
| `order`     | `Int`      | Admin-controlled display order       |
| `visible`   | `Boolean`  | Admin-controlled visibility toggle   |
| `featured`  | `Boolean`  | Admin-controlled feature toggle      |

### 3.3 Migrations

- Never edit the Prisma schema without creating and running a migration.
- Never run `prisma db push` in production — use `prisma migrate deploy`.
- All schema changes must be backwards-compatible or include a migration plan.

### 3.4 Seeding

- The `seed.ts` file must remain runnable and idempotent (safe to run multiple times).
- Seed data must reflect the real schema — never use placeholder or lorem ipsum content.

---

## 4. BACKEND RULES

### 4.1 Folder Structure

```
backend/src/
  controllers/   # Request handlers — thin, delegate to services or Prisma
  routes/        # Express router definitions only — no logic
  middleware/    # Auth, validation, error handling
  lib/           # Shared utilities (prisma client, cloudinary, etc.)
  prisma/        # Prisma client instance
```

### 4.2 Controllers

- Controllers handle HTTP req/res only. They call Prisma or helper functions; they do not contain query logic inline.
- Each controller function must be `async` and wrapped in a try/catch or use a global error handler.
- Return consistent response shapes (see §2.3).

### 4.3 Routes

- Route files only define paths and attach middleware/controllers. No logic.
- Group routes by resource: `projects.ts`, `skills.ts`, `contact.ts`, etc.
- Protect all admin mutation routes with the auth middleware.

### 4.4 Input Validation

- Validate all incoming request bodies before touching the database.
- Use Zod or inline validation — never trust `req.body` directly.
- Return a `400` with a clear error message for invalid input.

### 4.5 Environment Variables

- All secrets and configuration live in `.env`. Never hardcode them.
- Required variables: `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `PORT`
- Access via `process.env.VAR_NAME` with a fallback or startup check.

### 4.6 Error Handling

- Use a global Express error handler for unhandled errors.
- Never expose stack traces or internal error details to the client in production.
- Log errors server-side; send sanitized messages to the client.

### 4.7 Authentication

- Admin routes require a valid JWT. The middleware must verify and reject expired or malformed tokens.
- Tokens are issued on login and must include `exp` (expiry).
- Never store sensitive data (passwords in plaintext, tokens in DB without hashing) inappropriately.

---

## 5. FRONTEND RULES

### 5.1 Folder Structure

```
frontend/src/
  app/                  # Next.js App Router pages and layouts
    (public)/           # Public-facing routes
    admin/              # Admin panel routes
  components/
    sections/           # Full-page section components (Hero, Projects, etc.)
    admin/              # Admin-specific UI components
    ui/                 # Reusable primitives (Button, Card, Modal, etc.)
  lib/                  # API fetch helpers, utils, constants
```

### 5.2 Data Fetching

- All data comes from the backend API via `fetch` or a typed API helper in `lib/`.
- Server Components fetch data directly. Client Components use `useEffect` + state or SWR.
- Never import Prisma or any backend module into the frontend.
- Use the `NEXT_PUBLIC_API_URL` env variable as the base URL — never hardcode it.

### 5.3 Loading and Error States

Every data-fetching component must handle:

- **Loading** — show a skeleton or spinner, not a blank screen
- **Error** — show a user-friendly message, not a raw error object
- **Empty** — show a meaningful empty state, not nothing

### 5.4 Components

- Components must be small, focused, and reusable.
- Props must be typed with TypeScript interfaces — never use `any`.
- Avoid prop drilling more than two levels; use context or composition instead.
- `"use client"` only when the component uses browser APIs, event handlers, or hooks. Prefer Server Components.

### 5.5 No Hardcoding

- No static text content in components. All strings come from API data or typed constants.
- No static image URLs. All images are Cloudinary URLs fetched from the DB.
- No hardcoded nav links, section lists, or feature flags in component files.

---

## 6. UI/UX DESIGN SYSTEM

### 6.1 Visual Identity

- **Style:** Minimal, modern, Apple-inspired
- **Theme:** Dark background with subtle gradients; light text
- **Accent:** CSS variable `--accent` (default `#6366f1` — indigo)
- **Surface:** Cards and sections use `--surface` (slightly lighter than background)
- **Border:** Subtle `1px` borders using `--border` (low-opacity white or gray)

### 6.2 Typography

| Role       | Weight  | Size Guidance       |
|------------|---------|---------------------|
| Hero name  | 700–800 | Large, dominant     |
| Section h2 | 600–700 | Clear hierarchy     |
| Body text  | 400     | Readable, relaxed   |
| Caption    | 400     | Muted, smaller      |

- Use a single font family across the entire site (currently set in `globals.css`).
- Never mix font families without a deliberate decision.

### 6.3 Spacing

- Use Tailwind spacing utilities consistently (`gap-4`, `p-6`, `mb-8`, etc.).
- Sections must have generous vertical padding — content needs room to breathe.
- Cards must have consistent internal padding (`p-5` or `p-6`).

### 6.4 Color Usage

- Use CSS variables defined in `globals.css` — never write raw hex values in components.
- Muted text uses `text-muted-foreground` or equivalent.
- Accent/interactive elements use `--accent`.
- Destructive actions use `--destructive`.

---

## 7. ANIMATION GUIDELINES

### 7.1 Principles

- Animations must be **purposeful** — they guide attention or provide feedback, not decoration.
- All animations must be **minimal and subtle** — nothing flashy, bouncy, or distracting.
- Respect `prefers-reduced-motion` — wrap all animations in the appropriate media query or Framer Motion config.

### 7.2 Transition Speeds

| Purpose             | Duration    |
|---------------------|-------------|
| Hover effects       | 150–200ms   |
| State transitions   | 200–300ms   |
| Page/section entry  | 300–500ms   |

Never exceed 500ms for any single animation. Never chain animations that total more than 800ms.

### 7.3 Hover Effects

- Cards: subtle `scale(1.02)` + soft box-shadow glow
- Buttons: background color shift + slight brightness increase
- Links: underline slide or color fade

### 7.4 Scroll Animations

- Section entry: `opacity: 0 → 1` + `translateY(12px) → 0`
- Use Framer Motion `whileInView` with `once: true` to avoid re-triggering
- Stagger child animations by no more than `0.08s` per item

### 7.5 Forbidden Patterns

- No spinning loaders on content (use skeletons instead)
- No bounce or elastic easing
- No parallax effects
- No auto-playing carousels

---

## 8. COMPONENT DESIGN RULES

### 8.1 Cards

- The entire card surface must be clickable (wrap with `<Link>` or add `onClick` to the container).
- Cards must have: consistent `border-radius`, subtle `border`, background using `--surface`, and a hover state.
- Never put critical actions (delete, edit) as the primary click target on a public-facing card.

### 8.2 Buttons

| State    | Requirement                              |
|----------|------------------------------------------|
| Default  | Clear label, proper contrast             |
| Hover    | Visible color/brightness change          |
| Active   | Slight scale-down or press feedback      |
| Disabled | `opacity-50`, `cursor-not-allowed`       |
| Loading  | Spinner replacing icon or label          |

### 8.3 Forms

- Every input must have a visible label (no placeholder-only inputs).
- Show validation errors inline below the relevant field.
- Disable the submit button while a request is in flight.
- Show a success or error toast/message after submission.

### 8.4 Modals

- Modals must trap focus and close on `Escape` or backdrop click.
- Destructive modal actions (delete) must require a confirmation step.
- Never open a modal on page load.

---

## 9. PROJECT PAGE RULES

### 9.1 Required Fields

Every project record must support all of the following:

| Field           | Type       | Notes                                       |
|-----------------|------------|---------------------------------------------|
| `title`         | String     | Project name                                |
| `slug`          | String     | URL-safe unique identifier                  |
| `description`   | String     | Short summary for cards                     |
| `techStack`     | String[]   | Array of technology names                   |
| `overviewMd`    | String     | Full overview in Markdown                   |
| `problem`       | String     | Problem statement in Markdown               |
| `result`        | String     | Results/outcome in Markdown                 |
| `imageUrl`      | String     | Cover image (Cloudinary URL)                |
| `bannerImageUrl`| String     | Hero banner image (Cloudinary URL)          |
| `screenshots`   | String[]   | Gallery images (Cloudinary URLs)            |
| `resultImages`  | String[]   | Result section images (Cloudinary URLs)     |
| `githubUrl`     | String     | Optional GitHub link                        |
| `liveUrl`       | String     | Optional live demo link                     |
| `featured`      | Boolean    | Admin-controlled feature flag               |
| `isPublished`   | Boolean    | Visibility toggle                           |
| `order`         | Int        | Display order                               |

### 9.2 Markdown Rendering

- All Markdown fields (`overviewMd`, `problem`, `result`) must be rendered with a proper Markdown renderer (e.g., `react-markdown` with `rehype-raw` and `remark-gfm`).
- Apply prose styling (`@tailwindcss/typography` or equivalent custom CSS) to Markdown output.
- Never render raw Markdown strings as plain text.

### 9.3 Image Gallery

- Screenshots must render in a responsive grid.
- Clicking any image opens a full-screen lightbox with navigation (prev/next).
- Images must use Cloudinary transformations for optimal sizing (see §11).
- Always include `alt` text derived from the project title.

### 9.4 Project Detail Layout

The project detail page follows a case-study layout:

1. Banner image (full-width)
2. Title, date, tech stack badges
3. Overview section (Markdown)
4. Problem section (Markdown)
5. Result section (Markdown + result images)
6. Screenshot gallery
7. Links (GitHub, Live Demo)

Do not reorder or remove these sections.

---

## 10. ADMIN PANEL RULES

### 10.1 Full CRUD

The admin panel provides Create, Read, Update, and Delete for every data model:
- Hero content, Social links, Projects, Research papers, Certifications, Achievements, Skills, Stats, About profile, Education, Site settings, Contact messages

### 10.2 No UI Hardcoding

- Admin forms must derive their fields from the data model — never hardcode field lists in the UI.
- Field labels must be human-readable (e.g., "Tech Stack" not "techStack").

### 10.3 Admin-Controlled Fields

Agents must ensure the following controls exist in every relevant admin form:

| Control          | Models it applies to                        |
|------------------|---------------------------------------------|
| `featured` toggle| Projects, Research, Certifications, Achievements |
| `visible` toggle | Social links, Skills, Certifications, Achievements, About sections |
| `order` input    | Projects, Skills, Stats, Social links, Achievements, Education |
| Char limit field | Projects (`problemCharLimit`, `resultCharLimit`) |
| Markdown input   | Projects (`overviewMd`, `problem`, `result`) |

### 10.4 Form Quality

- Use controlled inputs with real-time character count where char limits apply.
- Validate on submit — highlight invalid fields.
- Auto-save drafts where feasible; always confirm before discarding unsaved changes.
- Markdown fields must have a live preview toggle.

### 10.5 Admin Security

- All admin routes (`/admin/*`) must redirect unauthenticated users to the login page.
- Admin API routes must reject requests without a valid JWT.
- Never expose admin routes in the public navigation.

---

## 11. PERFORMANCE RULES

### 11.1 Images

- All images are served from Cloudinary. Always use Cloudinary transformation URLs — never raw upload URLs.
- Standard transformations: `f_auto,q_auto` (format and quality auto-selection).
- For cover images: `w_800,c_fill` or similar. For thumbnails: `w_400,c_fill`.
- Use Next.js `<Image>` component with correct `width`, `height`, and `sizes` props.

### 11.2 Lazy Loading

- Sections below the fold must use `loading="lazy"` on images.
- Use `IntersectionObserver` or Framer Motion `whileInView` for triggering section animations rather than loading all animations on mount.

### 11.3 Rendering Strategy

- Public pages use Server Components and `fetch` with appropriate caching (`revalidate`).
- Admin pages can use Client Components with client-side fetching.
- Avoid `use client` at the page level — push it down to the smallest component that needs it.

### 11.4 Re-renders

- Do not call `setState` inside `useEffect` without a dependency array that prevents infinite loops.
- Memoize expensive computations with `useMemo`. Stabilize callbacks passed to child components with `useCallback`.
- Do not fetch data inside loops or `map` calls.

---

## 12. SECURITY RULES

### 12.1 Authentication

- Admin login issues a signed JWT stored in an `httpOnly` cookie or secure localStorage — not in a plain cookie.
- Verify the JWT on every protected backend route before processing the request.
- Implement token expiry and handle refresh or re-login gracefully on the frontend.

### 12.2 Input Sanitization

- Sanitize all user-generated content before storing or rendering it.
- For Markdown rendering, use a sanitizer (e.g., `dompurify`) to strip malicious HTML if `rehype-raw` is enabled.
- Never use `dangerouslySetInnerHTML` with unsanitized user input.

### 12.3 API Protection

- Rate-limit the contact form endpoint to prevent spam.
- Never return database IDs or internal implementation details in public API responses unless required.
- Use HTTPS everywhere. Never allow plain HTTP in production.

### 12.4 Environment Secrets

- Never commit `.env` files.
- Never log environment variable values.
- Validate that all required env variables are present at startup — fail fast if any are missing.

---

## 13. CODE STYLE

### 13.1 General

- TypeScript everywhere — no `any`, no untyped props, no implicit `any` from loose inference.
- Prefer `const` over `let`. Never use `var`.
- Destructure objects and arrays when it improves readability.
- Keep functions small and single-purpose. If a function exceeds ~40 lines, split it.

### 13.2 Naming Conventions

| Thing              | Convention              | Example                        |
|--------------------|-------------------------|--------------------------------|
| Components         | PascalCase              | `ProjectCard.tsx`              |
| Functions/vars     | camelCase               | `fetchProjects`                |
| Types/Interfaces   | PascalCase              | `ProjectResponse`              |
| Constants          | SCREAMING_SNAKE_CASE    | `MAX_CHAR_LIMIT`               |
| API route files    | camelCase               | `projects.ts`                  |
| DB model fields    | camelCase (Prisma)      | `bannerImageUrl`               |
| CSS variables      | kebab-case              | `--accent-color`               |

### 13.3 Comments

- Write no comments by default. Code should be self-explaining through naming.
- Add a comment only when the **why** is non-obvious: a hidden constraint, a workaround, a subtle invariant.
- Never write comments that describe **what** the code does — that is what code is for.

### 13.4 File Organization

- One component per file. File name matches the default export name.
- Group related files by feature, not by type (e.g., `projects/` folder over a flat `components/` dump).
- Keep `lib/` files focused — one concern per file (`api.ts`, `cloudinary.ts`, `utils.ts`).

### 13.5 Imports

- Use absolute imports (configured via `tsconfig.json` paths) over relative `../../` chains.
- Barrel exports (`index.ts`) are acceptable for component directories but must be kept up to date.

---

## 14. DO NOT DO

These are hard prohibitions. Violating any of these requires immediate correction:

- **Do NOT hardcode data** — no static text, URLs, lists, or counts in components or pages
- **Do NOT mix layers** — no Prisma in the frontend; no rendering logic in the backend
- **Do NOT use inconsistent styles** — no raw hex colors, no one-off font sizes, no inline styles unless unavoidable
- **Do NOT break the design system** — all UI must use the existing CSS variables and Tailwind config
- **Do NOT skip loading/error states** — every async operation must handle all three states
- **Do NOT commit secrets** — no API keys, tokens, or passwords in source files
- **Do NOT use `any`** — TypeScript must be used strictly
- **Do NOT add unnecessary dependencies** — every new package must be justified
- **Do NOT create files for planning or analysis** — work from conversation context, not intermediate documents
- **Do NOT add features beyond what is asked** — implement exactly what is requested, cleanly

---

## 15. QUICK REFERENCE — FILE MAP

```
MY_PORTFOLIO_WEBSITE/
  frontend/
    src/
      app/                     # Next.js pages (App Router)
        page.tsx               # Home page
        projects/[slug]/       # Project detail
        about/                 # About page
        admin/                 # Admin panel (protected)
      components/
        sections/              # Hero, Projects, Skills, etc.
        admin/                 # AdminShell, AdminTable, Modal
      lib/                     # API helpers, utils
    AGENTS.md                  # This file
    CLAUDE.md                  # Points to AGENTS.md

  backend/
    src/
      controllers/             # Request handlers per resource
      routes/                  # Express route definitions
      middleware/              # Auth, error handling
      lib/                     # Prisma client, Cloudinary config
    prisma/
      schema.prisma            # Single source of truth for DB shape
      seed.ts                  # Idempotent seed script
```

---

*Last updated: 2026-04-29. This document takes precedence over any conflicting inline comment or README section.*
