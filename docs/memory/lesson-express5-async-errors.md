# Lesson: Express 5 forwards async rejections — the gap was the missing handler

**What happened:** A discovery agent flagged "unhandled async errors in 13+ routes will crash the server (Express 5 does NOT catch async errors)" as CRITICAL. This is incorrect for Express 5: rejected promises in route handlers are automatically forwarded to error-handling middleware.

**Why it mattered:** Acting on the wrong root cause would have meant wrapping ~20 route handlers in try/catch — large churn on working code. The actual defect was narrower: `index.ts` had **no global error-handler middleware**, so forwarded errors hit Express's default HTML handler (leaking stack traces outside production mode, and surfacing CORS rejections as HTML 500s).

**How it was solved:** Verified Express 5 semantics against index.ts, then added a single JSON error handler (403 for CORS errors, sanitized 500 otherwise) plus fail-fast env validation. Backend tsc verified clean. Lesson: verify subagent claims against framework semantics before bulk-editing.
