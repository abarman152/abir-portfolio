# Notion Workspace Structure

The full hierarchy built under the existing "My Portfolio Website" Notion page as part of Phase 14, for reference from git (the workspace itself is the source of truth for project management — see [`../notion-vs-markdown.md`](../notion-vs-markdown.md)).

```
My Portfolio Website (root — Vision, Goals, section index)
│
├── 🗺️ Roadmap & Planning
│   ├── Roadmap (page — Now/Next/Later narrative)
│   ├── Milestones (database)
│   ├── Backlog (database — seeded with 7 real items from the audit)
│   ├── Sprint Planning (database)
│   └── Release Planning (database)
│
├── 🧱 Product & Architecture Index
│   ├── Architecture Index (page — summary, links to git docs)
│   ├── Documentation Index (page — mirrors docs/README.md)
│   ├── Features (database — seeded with 10 real features)
│   ├── Pages (database — seeded with 13 real routes)
│   └── Components (database — seeded with 18 real components)
│
├── 💡 Research & Ideas
│   ├── Research (database)
│   └── Ideas (database)
│
├── 📝 Meetings & Decisions
│   ├── Meeting Notes (database)
│   └── Decision Log (database)
│
├── 📊 Tracking
│   ├── Analytics (page — "none integrated yet" + recommendation)
│   ├── Risks (database — seeded with 4 real risks)
│   ├── Technical Debt (database — seeded with 10 real items, mirrors technical-debt-register.md)
│   └── Retrospectives (database)
│
├── 📚 Knowledge Base
│   ├── Resources (database)
│   ├── References (page)
│   └── Learning Notes (database)
│
└── 🗓️ Logs & Reviews
    ├── Daily Log (database)
    ├── Weekly Review (database)
    └── Monthly Review (database)
```

## Design rationale

The 29 items requested in the original brief (Project Overview, Vision, Goals, Architecture Index, Documentation Index, Roadmap, Sprint Planning, Kanban, Backlog, Milestones, Features, Pages, Components, Research, Ideas, Meeting Notes, Decision Log, Release Planning, Analytics, Risks, Technical Debt, Retrospectives, Resources, References, Learning Notes, Daily Log, Weekly Review, Monthly Review, Knowledge Base) were grouped into 7 second-level sections rather than left as 29 flat siblings of the root page — flat lists of that size are hard to navigate in Notion's sidebar. "Kanban" is implemented as a Status property (Backlog/Todo/In Progress/Done) on the Backlog database with board-view potential, rather than a separate database, since a Kanban board is a *view* of backlog items, not a distinct data source.

## What's seeded vs. what's a live template

- **Seeded with real data**: Backlog, Features, Pages, Components, Technical Debt, Risks — these reflect the actual 2026-07 audit findings, not placeholder rows.
- **Structural templates, not yet populated**: Milestones, Sprint Planning, Release Planning, Research, Ideas, Meeting Notes, Decision Log, Retrospectives, Resources, Learning Notes, Daily Log, Weekly Review, Monthly Review — these have real schemas but no rows yet, since populating them requires ongoing usage, not a one-time audit.

## Related
- [`../notion-vs-markdown.md`](../notion-vs-markdown.md)
- [`documentation-coverage-report.md`](./documentation-coverage-report.md)
