# Development Guide

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 18+ | LTS recommended |
| npm | 9+ | Comes with Node.js |
| PostgreSQL | 14+ | Or a Supabase project |
| Git | Any | — |

---

## Initial Setup

### 1. Clone the repository

```bash
git clone https://github.com/abarman152/MY_PORTFOLIO_WEBSITE.git
cd MY_PORTFOLIO_WEBSITE
```

### 2. Install all dependencies

```bash
npm run install:all
```

This installs `frontend/` and `backend/` dependencies in sequence.

### 3. Configure environment variables

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your database URL, JWT secret, Cloudinary URL
```

**Frontend:**
```bash
# Create frontend/.env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5001/api" > frontend/.env.local
```

See [environment-variables.md](../deployment/environment-variables.md) for all variable descriptions.

### 4. Set up the database

```bash
npm run db:push     # Sync Prisma schema to PostgreSQL
npm run db:seed     # Seed initial content and create admin account
```

Default admin credentials after seeding:

| Field | Value |
|---|---|
| Email | `admin@abirbarman.dev` |
| Password | `Admin@123` |

**Change these immediately after first login.**

### 5. Start development servers

Run each in a separate terminal:

```bash
# Terminal 1
npm run dev:frontend    # http://localhost:3000

# Terminal 2
npm run dev:backend     # http://localhost:5001
```

---

## Available Scripts

All scripts run from the **monorepo root**.

| Command | Description |
|---|---|
| `npm run dev:frontend` | Start Next.js dev server with hot reload |
| `npm run dev:backend` | Start Express server with tsx watch (hot reload) |
| `npm run install:all` | Install dependencies in both workspaces |
| `npm run build:frontend` | Production build of the Next.js app |
| `npm run db:push` | Push Prisma schema changes to PostgreSQL (dev only) |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio at http://localhost:5555 |

---

## Development Ports

| Service | Port |
|---|---|
| Frontend (Next.js) | 3000 |
| Backend (Express) | 5001 |
| Prisma Studio | 5555 |

---

## Project-Specific Workflows

### Adding a new content section

1. Add the model to `backend/prisma/schema.prisma`
2. Run `npm run db:push` to sync the schema
3. Create `backend/src/routes/<section>.ts` with CRUD endpoints
4. Mount the router in `backend/src/index.ts`
5. Add the TypeScript interface to `frontend/src/lib/types.ts`
6. Add API calls to the relevant admin page in `frontend/src/app/admin/<section>/`
7. Build the public-facing section component in `frontend/src/components/sections/`

### Updating Prisma schema

Always use `db:push` in development (not `migrate dev` unless you need a tracked migration):

```bash
# After editing backend/prisma/schema.prisma
npm run db:push
```

In production, use `prisma migrate deploy` — never `db push`.

### Uploading images

**There is no upload widget and no Cloudinary SDK integration in this codebase.** Every image field in the admin panel (avatar, project screenshots, certification badges, etc.) is a plain text input that accepts any HTTPS URL — `next.config.ts` allows `remotePatterns: [{ protocol: 'https', hostname: '**' }]`.

The recommended workflow (a convention, not an enforced one):
1. Upload the image manually to a free Cloudinary account (or any HTTPS image host).
2. Copy the resulting URL.
3. Paste it into the relevant admin form field.

If you use Cloudinary, apply transformation params yourself for optimized delivery:
```
https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_800/<public_id>
```

Building a real signed-upload integration (Cloudinary SDK, upload widget, or `next/image`-compatible loader) is tracked as a future enhancement — see [`architecture/future-architecture.md`](../architecture/future-architecture.md).

### Running the seed script

The seed script is idempotent — it checks for existing records before inserting.

```bash
npm run db:seed
```

To reset and re-seed entirely:
```bash
# Drop all tables (Supabase dashboard or psql), then:
npm run db:push
npm run db:seed
```

---

## TypeScript

Both workspaces use strict TypeScript.

- Frontend: `frontend/tsconfig.json` — Next.js default + strict mode
- Backend: `backend/tsconfig.json` — strict mode, `tsx` for runtime execution
- `any` is prohibited — all props, params, and returns must be typed
- Shared types live in `frontend/src/lib/types.ts` (frontend-side only; backend infers from Prisma)

---

## Code Conventions

- **No comments** unless the _why_ is non-obvious
- One component per file; filename matches the default export
- `"use client"` only on components that use browser APIs or event handlers
- CSS variables for all colors — never raw hex in component files
- All content comes from the database — never hardcode text in components

See [AGENTS.md](../../frontend/AGENTS.md) for the complete rulebook governing this codebase.
