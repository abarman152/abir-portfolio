# Environment Variables

---

## Backend — `backend/.env`

Copy `backend/.env.example` to `backend/.env` and fill in all values before starting the server.

```bash
cp backend/.env.example backend/.env
```

### Database (Supabase)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Supabase pooler URL (port 6543, pgBouncer). Used at runtime. |
| `DIRECT_URL` | Yes | Supabase direct URL (port 5432). Used for `prisma db push` and migrations. |

**Supabase pooler URL format:**
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Direct URL format:**
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

> `DATABASE_URL` must include `?pgbouncer=true&connection_limit=1` for PrismaPg adapter compatibility.

---

### Authentication

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | Yes | Random 64-character string. Used to sign and verify admin JWTs. |

Generate a secret:
```bash
openssl rand -base64 64
```

---

### Server

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | 5000 (code default in `backend/src/index.ts`) | Port the Express server listens on |
| `NODE_ENV` | No | development | Set to `production` on Render |

> **Known inconsistency:** `backend/.env.example` documents a default of `5001`, `backend/src/index.ts` actually defaults to `5000`, and every frontend page's fallback URL defaults to `http://localhost:5001/api` except `frontend/src/lib/api.ts`, which defaults to port `5000`. Always set `PORT` and `NEXT_PUBLIC_API_URL` explicitly rather than relying on these mismatched defaults. Tracked in [`appendices/technical-debt-register.md`](../appendices/technical-debt-register.md).

---

### CORS

| Variable | Required | Default | Description |
|---|---|---|---|
| `FRONTEND_URL` | Yes | http://localhost:3000 | Comma-separated list of allowed origins |

Production value: `https://abirbarman.com`

---

### Media (Cloudinary) — documented but not actually wired up

| Variable | Required | Description |
|---|---|---|
| `CLOUDINARY_URL` | **No — not read anywhere in code** | Listed in `.env.example` but there is no `cloudinary` package dependency and no code that reads this variable. |

This variable is **aspirational**: image fields across the admin panel are plain text inputs accepting any HTTPS URL, and the placeholder text merely *suggests* a Cloudinary-shaped URL as a convention. If you want real Cloudinary integration (signed uploads, transformations enforced server-side), it needs to be built — see [`architecture/future-architecture.md`](../architecture/future-architecture.md). Until then, you can safely omit this variable or leave `.env.example`'s entry as a documented convention only.

---

### Complete `.env` example

```env
# Database
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Auth
JWT_SECRET="replace-with-64-char-random-string"

# Server
PORT=5001
NODE_ENV="development"

# CORS (production: https://abirbarman.com)
FRONTEND_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
```

---

## Frontend — `frontend/.env.local`

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | http://localhost:5001/api | Full base URL of the backend API |

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Production value: `https://<your-render-app>.onrender.com/api`

> This variable is embedded at build time. If you change it, you must rebuild the Next.js app.

---

## Security Notes

- Never commit `.env` or `.env.local` to git. Both are listed in `.gitignore`.
- Never log environment variable values, even in development.
- Rotate `JWT_SECRET` immediately if it is ever exposed — all existing tokens will be invalidated.
- If you do eventually wire up real Cloudinary (or any) API credentials, keep them server-side only — never expose them via a `NEXT_PUBLIC_*` variable.
- **If a `DATABASE_URL`/`DIRECT_URL` connection string (with password) is ever pasted into a terminal, log file, chat, or screenshot, rotate the database password immediately** even if `.env` itself is gitignored — local files can leak through channels other than git.
