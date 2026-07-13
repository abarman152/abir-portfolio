# Contributing

This is a personal portfolio project, but it's structured and documented so it can be read, run, and extended like any open-source project. Contributions (bug fixes, doc corrections, accessibility improvements) are welcome via pull request.

## Before you start

Read [`docs/development/setup-and-workflow.md`](docs/development/setup-and-workflow.md) for local setup, and [`frontend/AGENTS.md`](frontend/AGENTS.md) for the full coding rulebook this codebase follows (architecture boundaries, styling rules, "do not do" list). Both AI agents and human contributors are expected to follow it.

## Workflow

1. Fork or branch from `main`.
2. Make your change. Keep PRs focused — one concern per PR.
3. Follow the existing code conventions: no unnecessary comments, one component per file, CSS variables (never raw hex), all content sourced from the database (never hardcoded).
4. Update relevant docs under `docs/` if your change affects architecture, an API endpoint, an environment variable, or a page/feature/component's documented behavior. Undocumented changes to documented surfaces will be asked for in review.
5. Run `npm run lint` (frontend) before opening a PR — there is no backend linter configured yet.
6. Open a PR against `main` with a clear description of what changed and why.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. See [`CHANGELOG.md`](CHANGELOG.md) for examples from this project's own history.

## Branch strategy

`main` is the deployed production branch (Vercel/Render auto-deploy on push). Do work on a feature branch and open a PR rather than committing directly to `main`.

## Reporting bugs / requesting features

Open a GitHub issue using the templates in [`docs/templates/`](docs/templates/) (`bug-report-template.md`, `issue-report-template.md`).

## Code of Conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). Participation implies agreement to it.

## Security issues

Do not open a public issue for a security vulnerability — see [`SECURITY.md`](SECURITY.md) for how to report privately.
