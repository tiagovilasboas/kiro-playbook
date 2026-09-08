## Why

<!-- What gap does this close? One or two sentences. -->

## What

<!-- Files and artifacts touched. -->

## How to verify

```bash
npm test
node bin/install.mjs --dry-run
```

## Checklist

- [ ] Targets `main` via a pull request (no direct push)
- [ ] `npm test` passes
- [ ] Existing steerings, skills, hooks, and prompts are unchanged unless this is a dedicated content PR
- [ ] No invented MCP secrets or credentials
- [ ] Hygiene PRs do not rewrite team-specific artifacts
