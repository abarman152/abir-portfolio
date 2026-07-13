# Lesson: Duplicated fallback constants drift

**What happened:** `frontend/src/lib/api.ts` fell back to `http://localhost:5000/api` while 14 other frontend files and `.env.local` used port 5001 (the backend's actual configured port). Admin CRUD (which routes through `lib/api.ts`) would hit the wrong port whenever `NEXT_PUBLIC_API_URL` was unset, while public pages worked — a confusing, intermittent failure mode.

**Why it mattered:** The same fallback expression `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:PORT/api'` is duplicated across ~15 files, so a single edit can silently diverge from the rest.

**How it was solved:** Standardized the api.ts fallback to 5001 and verified with grep that no `localhost:5000` reference remains in frontend/src. Longer term (technical debt): import one shared constant instead of repeating the literal.
