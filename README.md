<div align="center">

# Abir Barman — Portfolio

**Data Scientist · ML Engineer**

[![Live Site](https://img.shields.io/badge/Live%20Site-abirbarman.com-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white)](https://abirbarman.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](./LICENSE)

A full-stack personal portfolio built as a monorepo — Next.js 16 frontend with server-side rendering, Express 5 REST API, PostgreSQL via Prisma ORM, and a protected admin panel for content management.

**[abirbarman.com](https://abirbarman.com)**

</div>

---

## Tech Stack

| Layer | Technology |
|---|---|
| ![Next.js](https://img.shields.io/badge/-Next.js%2016-black?logo=next.js) | App Router, React 19, SSR, TypeScript |
| ![React](https://img.shields.io/badge/-React%2019-61DAFB?logo=react&logoColor=black) | Framer Motion, React Hook Form, Zod |
| ![Three.js](https://img.shields.io/badge/-Three.js-black?logo=three.js) | React Three Fiber, Drei — 3D scene rendering |
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) | Express 5, TypeScript, tsx hot-reload |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white) | Prisma ORM 7, PrismaPg adapter |
| ![Tailwind](https://img.shields.io/badge/-Tailwind%20CSS%204-06B6D4?logo=tailwindcss&logoColor=white) | CSS custom properties, design token system |
| ![JWT](https://img.shields.io/badge/-JWT%20Auth-FB015B?logo=jsonwebtokens&logoColor=white) | Admin panel authentication only |

---

## Project Structure

```
MY_PORTFOLIO_WEBSITE/
├── frontend/                       # Next.js 16 application
│   └── src/
│       ├── app/
│       │   ├── page.tsx            # Portfolio home (SSR)
│       │   ├── about/              # About page
│       │   ├── projects/[slug]/    # Dynamic project detail pages
│       │   ├── research/[slug]/    # Dynamic research detail pages
│       │   ├── certifications/     # Certifications listing + detail
│       │   ├── achievements/       # Achievements timeline
│       │   └── admin/              # Protected CMS (login, dashboard, CRUD)
│       ├── components/
│       │   ├── sections/           # Hero, About, Projects, Skills, Research,
│       │   │                       # Certifications, Achievements, Stats, Contact
│       │   ├── admin/              # AdminShell, AdminTable, Modal
│       │   └── ui/                 # Reusable UI primitives (PaperCard, …)
│       └── lib/
│           ├── types.ts            # Shared TypeScript interfaces
│           └── api.ts              # Typed fetch wrapper
│
└── backend/                        # Express 5 REST API
    ├── src/
    │   ├── routes/                 # certifications, research, projects,
    │   │                           # achievements, skills, stats, messages, …
    │   ├── middleware/
    │   │   └── auth.ts             # JWT verification middleware
    │   └── seed.ts                 # Initial database seed script
    └── prisma/
        └── schema.prisma           # Database models & relations
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL instance (local or hosted)
- npm

### 1. Clone and install dependencies

```bash
git clone https://github.com/abarman152/MY_PORTFOLIO_WEBSITE.git
cd MY_PORTFOLIO_WEBSITE
npm run install:all
```

### 2. Configure environment variables

**Backend** — copy and populate `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
JWT_SECRET="your-secret-key"
PORT=5001
```

**Frontend** — create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 3. Set up the database

```bash
npm run db:push     # sync Prisma schema to PostgreSQL
npm run db:seed     # seed initial content + default admin account
```

Default admin credentials — **change these immediately after first login**:

| Field | Value |
|---|---|
| Email | `admin@abirbarman.dev` |
| Password | `Admin@123` |

### 4. Start development servers

Run each in a separate terminal:

```bash
npm run dev:frontend    # http://localhost:3000
npm run dev:backend     # http://localhost:5001
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev:frontend` | Start Next.js development server |
| `npm run dev:backend` | Start Express API with tsx hot-reload |
| `npm run install:all` | Install all workspace dependencies |
| `npm run build:frontend` | Production build of the Next.js app |
| `npm run db:push` | Push Prisma schema changes to the database |
| `npm run db:seed` | Seed the database with initial data |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## Portfolio Sections

| Section | Description |
|---|---|
| **Hero** | Name, animated role titles, bio, social links, CTAs |
| **About** | Background story, tech stack, expertise pillars |
| **Projects** | Filterable cards with live demo and GitHub links |
| **Skills** | Categorised skill tags — Data Science, ML, MLOps, Dev |
| **Research** | Published papers with authors, journal, abstract, tags |
| **Certifications** | Credentials with category filter, tags, descriptions |
| **Achievements** | Timeline with featured items, descriptions, tags |
| **Stats** | Animated impact counters |
| **Contact** | Contact form + email, phone, location info |

---

## Admin Panel

The CMS lives at `/admin` and is protected by JWT authentication. It provides full CRUD control over every section of the site.

**Managed content:** Hero · Social Links · Projects · Research Papers · Certifications · Achievements · Skills · Stats · Contact Messages · Site Settings

---

## License

MIT — see [LICENSE](./LICENSE)

---

<div align="center">

Designed and built by [Abir Barman](https://abirbarman.com)

</div>
