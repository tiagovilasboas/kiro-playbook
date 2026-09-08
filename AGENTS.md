# AGENTS.md

Harness-agnostic source of truth for coding agents (Cursor, Copilot, Claude Code, Kiro, and others).
Humans: follow [CONTRIBUTING.md](CONTRIBUTING.md).

## What this repo is

A **Kiro playbook for a support squad**: curated steerings, skills, and hooks as a **team starting point** for agentic IDE configs.

The Cogna / N3 voice is **intentional**. Artifacts are real N3/support-style examples (issue flow, incident triage, platform conventions) — not a pretend personal-only showcase and not a universal recipe. Adapt them; do not sanitize the team voice in hygiene PRs.

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
- Preserve existing steerings, skills, hooks, prompts, and README voice unless the change is a dedicated content PR.
- Treat N3/support examples as team context, not production credentials.

## Don't

- Do not invent MCP secrets, tokens, or host credentials.
- Do not rewrite team-specific steerings or erase Cogna/N3 voice in hygiene PRs.
- Do not treat this playbook as a one-size-fits-all recipe, or as a personal-only kit.
- Do not merge your own PRs; a human reviews.

## Hygiene vs content

Hygiene PRs may add `LICENSE`, `AGENTS.md`, and `.github` templates only. Artifact edits belong in a dedicated content PR that follows CONTRIBUTING.md.
