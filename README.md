# Abir Barman — Portfolio

Personal portfolio website for **Abir Barman**, Data Scientist & ML Engineer. Built as a full-stack monorepo with a Next.js frontend, Express/Prisma backend, and a custom admin panel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Framer Motion |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL via Prisma ORM (PrismaPg adapter) |
| Styling | CSS custom properties (design token system) |
| Auth | JWT (admin panel only) |

---

## Project Structure

```
MY_PORTFOLIO_WEBSITE/
├── frontend/          # Next.js app (public site + admin panel)
│   └── src/
│       ├── app/
│       │   ├── page.tsx          # Public portfolio (SSR)
│       │   └── admin/            # Protected admin pages
│       ├── components/
│       │   ├── sections/         # Hero, About, Projects, Research…
│       │   └── admin/            # AdminShell, AdminTable, Modal
│       └── lib/
│           ├── types.ts          # Shared TypeScript interfaces
│           └── api.ts            # Typed fetch wrapper
└── backend/           # Express REST API
    ├── src/
    │   ├── routes/               # certifications, research, projects…
    │   ├── middleware/auth.ts    # JWT authentication
    │   └── seed.ts               # Initial database seed
    └── prisma/
        └── schema.prisma         # Database schema
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

**Backend** — copy and fill in `backend/.env.example`:

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
npm run db:push    # sync Prisma schema → PostgreSQL
npm run db:seed    # seed initial data + admin account
```

Default admin credentials (change after first login):
- Email: `admin@abirbarman.dev`
- Password: `Admin@123`

### 4. Run in development

```bash
# In two separate terminals:
npm run dev:frontend    # http://localhost:3000
npm run dev:backend     # http://localhost:5001
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev:frontend` | Start Next.js dev server |
| `npm run dev:backend` | Start Express dev server with hot reload |
| `npm run install:all` | Install all dependencies (frontend + backend) |
| `npm run build:frontend` | Production build of the Next.js app |
| `npm run db:push` | Push Prisma schema changes to the database |
| `npm run db:seed` | Seed the database with initial data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

---

## Admin Panel

The admin panel lives at `/admin` on the frontend. It requires JWT authentication.

Manage: Hero content · Social links · Projects · Research papers · Certifications · Achievements · Skills · Stats · Contact messages · Site settings

---

## Sections

| Section | Description |
|---|---|
| Hero | Name, roles, bio, social links, CTAs |
| About | Story, tech stack, expertise pillars |
| Projects | Filterable project cards with live/GitHub links |
| Skills | Categorised skill tags (Data Science · ML · MLOps) |
| Research | Published papers with authors, journal, tags |
| Certifications | Credentials with category filter, tags, descriptions |
| Achievements | Timeline with featured items, descriptions, tags |
| Contact | Contact form + email/phone/location info |

---

## License

MIT — see [LICENSE](./LICENSE)
