---
inclusion: always
---

# Kiro Artifact Conventions

## Hook files

Hooks MUST use the `.json` extension to be recognized by Kiro.

- Correct: `~/.kiro/hooks/my-hook.json`
- Wrong: `~/.kiro/hooks/my-hook.kiro.hook` (will be silently ignored by Kiro)

### Required hook structure

```json
{
  "name": "Hook display name",
  "description": "What this hook does",
  "version": "1",
  "enabled": true,
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "..."
  }
}
```

### Valid `when.type` values

| Value | Trigger |
|-------|---------|
| `userTriggered` | Manual — appears in the Kiro hooks menu |
| `fileEdited` | On file save (requires `filePattern`) |
| `preTaskExecution` | Before a spec task starts |
| `postTaskExecution` | After a spec task completes |
| `promptSubmit` | On every chat message sent |
| `agentStop` | When the agent finishes a response |

### Paths

| Artifact | Path | Extension |
|----------|------|-----------|
| Hook | `~/.kiro/hooks/` | `.json` |
| Steering | `~/.kiro/steering/` | `.md` |
| Skill | `~/.kiro/skills/<name>/` | `SKILL.md` |

## Steering files

Steerings MUST include frontmatter with `inclusion`:

```markdown
---
inclusion: always
---
```

Valid values: `always` (auto-loaded) or `manual` (loaded on demand).

## When creating new artifacts

1. **Hooks MUST be created via the `createHook` tool** — never by writing `.json` files manually to `~/.kiro/hooks/`. Files written directly to the folder are not registered by Kiro and will not appear in the UI.
2. Always use English for hook names, steering file names, and skill names.
3. Steering files must be created at `~/.kiro/steering/[name].md` with the correct `inclusion` frontmatter.
4. Skills must be created at `~/.kiro/skills/[name]/SKILL.md`.
