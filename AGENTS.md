# AGENTS.md

Harness-agnostic source of truth for coding agents (Cursor, Copilot, Claude Code, Kiro, and others).
Humans: follow [CONTRIBUTING.md](CONTRIBUTING.md).

## What this repo is

A **Kiro playbook**: curated steerings, skills, and hooks as a **starting point** for agentic IDE configs.

Artifacts here reflect a **support / N3-style** stack as **examples** (issue flow, incident triage, language and platform conventions). They are not a universal recipe. Adapt them to your context.

## Layout

```
steerings/          context steerings (Markdown)
skills/             natural-language skills
hooks/              agent hooks (`hooks/dev/`)
docs/               guides and `docs/prompts/` (paste-into-chat flows)
bin/install.mjs     installer (preserves existing local files)
manifest.json       install map (source → destination)
tests/              installer tests (`node:test`)
```

## Commands

From `package.json`:

```bash
npm test
node bin/install.mjs
node bin/install.mjs --dry-run
node bin/install.mjs --update
```

Equivalent scripts: `npm run dry-run`, `npm run install-kiro`.

## Do

- Open a pull request. Do **not** commit directly to `main`.
- Keep the installer and `npm test` green.
- Preserve existing steerings, skills, hooks, and prompts unless the change is a dedicated content PR.
- Treat support / N3 examples as illustrations, not production credentials.

## Don't

- Do not invent MCP secrets, tokens, or host credentials.
- Do not rewrite team-specific steerings in hygiene or scaffolding PRs.
- Do not treat this playbook as a one-size-fits-all recipe for every squad or IDE.
- Do not merge your own PRs; a human reviews.

## Hygiene vs content

Hygiene PRs may add `LICENSE`, `AGENTS.md`, and `.github` templates only. Artifact edits belong in a dedicated content PR that follows CONTRIBUTING.md.
