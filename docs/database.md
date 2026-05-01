# Database Schema Reference

Database: **PostgreSQL** via **Supabase**
ORM: **Prisma 7** with PrismaPg adapter (connection pooling via pgBouncer)
Schema file: `backend/prisma/schema.prisma`

---

## Conventions

Every model follows these field conventions:

| Field | Type | Note |
|---|---|---|
| `id` | `String` (cuid) | Primary key, auto-generated |
| `createdAt` | `DateTime` | Set on creation |
| `updatedAt` | `DateTime` | Auto-updated on every write (`@updatedAt`) |
| `slug` | `String` (unique) | URL-safe identifier, present on content models |
| `order` | `Int` | Admin-controlled display order |
| `visible` | `Boolean` | Admin-controlled visibility toggle |
| `featured` | `Boolean` | Admin-controlled feature flag |

---

## Models

### Admin

Stores the single admin account (one row). Password is bcrypt-hashed.

| Field | Type | Default |
|---|---|---|
| `id` | String (cuid) | auto |
| `email` | String (unique) | — |
| `password` | String | hashed |
| `createdAt` | DateTime | now() |

---

### HeroContent

Singleton — always one row. Stores the hero section data.

| Field | Type | Default |
|---|---|---|
| `id` | String (cuid) | auto |
| `name` | String | "Abir Barman" |
| `tagline` | String | "Data Scientist & Full Stack Developer" |
| `roles` | String[] | ["Data Scientist", "ML Engineer", ...] |
| `bio` | String | "" |
| `resumeUrl` | String | "" |
| `avatarUrl` | String | "" (Cloudinary URL) |
| `updatedAt` | DateTime | @updatedAt |

---

### HeroBadge

Floating badge labels displayed in the hero section.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `label` | String | — |
| `position` | String | "top-right" |
| `icon` | String | "" |
| `isActive` | Boolean | true |
| `order` | Int | 0 |
| `createdAt` | DateTime | now() |
| `updatedAt` | DateTime | @updatedAt |

---

### SocialLink

Social media profile links shown in the hero and footer.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `platform` | String | — |
| `url` | String | — |
| `username` | String | "" |
| `icon` | String | "" |
| `order` | Int | 0 |
| `visible` | Boolean | true |
| `createdAt` | DateTime | now() |

---

### Project

Portfolio project entries. Supports rich content with Markdown, gallery images, and case-study layout.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `slug` | String (unique) | — |
| `title` | String | — |
| `description` | String | — (short summary for cards) |
| `longDesc` | String | "" |
| `problem` | String | "" (Markdown) |
| `result` | String | "" (Markdown) |
| `techStack` | String[] | — |
| `imageUrl` | String | "" (Cloudinary) |
| `screenshots` | String[] | — (Cloudinary URLs) |
| `githubUrl` | String | "" |
| `liveUrl` | String | "" |
| `featured` | Boolean | false |
| `isPublished` | Boolean | true |
| `date` | String | "" |
| `order` | Int | 0 |
| `bannerImageUrl` | String | "" (Cloudinary) |
| `resultImages` | String[] | [] (Cloudinary URLs) |
| `overviewMd` | String | "" (Markdown) |
| `problemCharLimit` | Int | 0 |
| `resultCharLimit` | Int | 0 |
| `createdAt` | DateTime | now() |
| `updatedAt` | DateTime | @updatedAt |

---

### Research

Published research papers and academic work.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `slug` | String (unique) | — |
| `title` | String | — |
| `abstract` | String | "" |
| `overviewMd` | String | "" (Markdown) |
| `authors` | Json | [] — array of `{ name, role?, isPrimary? }` |
| `publishedAt` | DateTime | now() |
| `publisher` | String | "" |
| `publicationUrl` | String | "" |
| `googleScholarUrl` | String | "" |
| `tags` | String[] | [] |
| `featured` | Boolean | false |
| `order` | Int | 0 |
| `createdAt` | DateTime | now() |
| `updatedAt` | DateTime | @updatedAt |

---

### Certification

Professional credentials and course completions.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `slug` | String? (unique) | null |
| `title` | String | — |
| `issuer` | String | — |
| `issueDate` | DateTime | — |
| `expiryDate` | DateTime? | null |
| `credentialId` | String | "" |
| `credentialUrl` | String | "" |
| `imageUrl` | String | "" (Cloudinary) |
| `badgeImageUrl` | String | "" (Cloudinary) |
| `category` | String | "General" |
| `description` | String | "" |
| `overviewMd` | String | "" (Markdown) |
| `skills` | String[] | [] |
| `tags` | String[] | [] |
| `featured` | Boolean | false |
| `visible` | Boolean | true |
| `order` | Int | 0 |
| `createdAt` | DateTime | now() |
| `updatedAt` | DateTime | @updatedAt |

---

### Achievement

Awards, honors, and notable milestones.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `slug` | String? (unique) | null |
| `title` | String | — |
| `description` | String | "" |
| `overviewMd` | String | "" (Markdown) |
| `date` | DateTime | — |
| `issuer` | String | "" |
| `imageUrl` | String | "" (Cloudinary) |
| `badgeIcon` | String | "" |
| `images` | String[] | [] (Cloudinary URLs) |
| `category` | String | "Award" |
| `tags` | String[] | [] |
| `featured` | Boolean | false |
| `visible` | Boolean | true |
| `order` | Int | 0 |
| `createdAt` | DateTime | now() |
| `updatedAt` | DateTime | @updatedAt |

---

### Skill

Individual skill entries for the skills section.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `name` | String | — |
| `level` | Int | 80 (0–100) |
| `category` | String | — |
| `icon` | String | "" |
| `order` | Int | 0 |

---

### Stat

Animated impact counter entries (e.g., "50+ Projects").

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `label` | String | — |
| `value` | Int | 0 |
| `suffix` | String | "" (e.g., "+", "%") |
| `icon` | String | "" |
| `order` | Int | 0 |

---

### ContactMessage

Inbound messages from the public contact form.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `name` | String | — |
| `email` | String | — |
| `subject` | String | — |
| `message` | String | — |
| `read` | Boolean | false |
| `createdAt` | DateTime | now() |

---

### SiteSettings

Singleton — one row. Global site configuration.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `defaultTheme` | String | "dark" |
| `accentColor` | String | "#6366f1" |
| `metaTitle` | String | "Abir Barman \| Data Scientist" |
| `metaDesc` | String | — |
| `ogImageUrl` | String | "" |
| `heroConfig` | Json | `{ backgroundType, backgroundValue, profileImage, themeImages, overlayStyle, linkedMode }` |

**heroConfig shape:**
```json
{
  "backgroundType": "gradient" | "image",
  "backgroundValue": "",
  "profileImage": "",
  "themeImages": { "light": "", "dark": "" },
  "overlayStyle": "",
  "linkedMode": true
}
```

---

### AboutProfile

Singleton — one row. Stores the about page profile data.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `name` | String | "Abir Barman" |
| `title` | String | "Data Analytics Professional" |
| `subtitle` | String | — |
| `summary` | String | "" |
| `phone` | String | — |
| `email` | String | — |
| `linkedinUrl` | String | — |
| `githubUrl` | String | "" |
| `leetcodeUrl` | String | "" |
| `codechefUrl` | String | "" |
| `location` | String | "Bangladesh" |
| `primaryPhoto` | String | "" (Cloudinary) |
| `secondaryPhoto` | String | "" (Cloudinary) |
| `showSummary` | Boolean | true |
| `showEducation` | Boolean | true |
| `showAchievements` | Boolean | true |
| `showSkills` | Boolean | true |
| `updatedAt` | DateTime | @updatedAt |

---

### Education

Education history entries for the about page.

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `degree` | String | — |
| `institution` | String | — |
| `location` | String | "" |
| `startDate` | String | — |
| `endDate` | String | "Present" |
| `description` | String | "" |
| `order` | Int | 0 |
| `visible` | Boolean | true |
| `createdAt` | DateTime | now() |
| `updatedAt` | DateTime | @updatedAt |

---

### AboutSkillGroup

Grouped skill tags for the about page (separate from the main Skills section).

| Field | Type | Default |
|---|---|---|
| `id` | String | auto |
| `category` | String | — |
| `skills` | String[] | — |
| `order` | Int | 0 |
| `visible` | Boolean | true |

---

## Database Operations

```bash
# Push schema changes to the database (development only)
npm run db:push

# Run migrations in production
cd backend && npx prisma migrate deploy

# Open Prisma Studio GUI
npm run db:studio

# Seed initial data
npm run db:seed
```

The seed script (`backend/src/seed.ts`) is idempotent — safe to run multiple times without creating duplicates.
