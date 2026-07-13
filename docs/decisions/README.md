# Decision Log

A running log of smaller, easily-revisited decisions that don't warrant a full ADR — see [`../standards/architecture-documentation-rules.md`](../standards/architecture-documentation-rules.md) for the line between this and [`../adr/`](../adr/). Format: [`../templates/decision-log-entry-template.md`](../templates/decision-log-entry-template.md).

This is the **code/architecture-adjacent** decision log, kept in git because it's tightly coupled to specific technical choices worth having next to the code. Day-to-day project-management decisions belong in Notion's Decision Log database instead — see [`../notion-vs-markdown.md`](../notion-vs-markdown.md).

---

### 2026-07-03 — Consolidate documentation standards into 8 files instead of 16+ single-topic files

**Decision:** Cover all 16 requested documentation-standards topics (style guide, naming conventions, Mermaid standards, etc.) across 8 consolidated files rather than one file per topic.
**Because:** Several requested topics (e.g., naming conventions + folder conventions + writing guidelines) are small enough that a dedicated file each would fragment closely-related guidance a reader needs together.
**Alternatives briefly considered:** One file per exact requested topic (16+ files) — rejected as unnecessary fragmentation for topics under a page each.
**Reversible?** Yes — split further any time a consolidated file grows unwieldy.

### 2026-07-03 — Keep `docs/database/schema-reference.md`'s existing `(Cloudinary)` field annotations as-is

**Decision:** Did not rewrite every `imageUrl` field's `"" (Cloudinary)` annotation in the database schema reference, even though Cloudinary isn't actually SDK-integrated.
**Because:** The annotation describes the *intended convention* for what the field holds (a Cloudinary-style URL), which remains true even though there's no SDK enforcing it — this is different from the deployment/architecture docs, which previously stated Cloudinary as an *integrated service*, which was false and has been corrected.
**Reversible?** Yes — trivial to reword if this distinction proves confusing in practice.

### 2026-07-03 — Did not build `render.yaml` or other deployment IaC as part of this documentation project

**Decision:** Documented the lack of deployment IaC as a gap ([`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)) rather than creating it.
**Because:** This was a documentation-audit project, not an infrastructure change — writing IaC that hasn't been tested against the real Render service risks shipping something wrong and undocumented-as-wrong.
**Reversible?** Yes — a natural next follow-up task, not deferred out of avoidance.
