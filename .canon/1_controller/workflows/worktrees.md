---
layer: universal
name: worktrees
description: Git worktree isolation rules — mandatory for all code work. Covers creation, naming, base branch sync, subagent patterns, cleanup.
---

# Git Worktrees

Mandatory branching workflow for all code work — orchestrator and subagents alike.

=== ALL CODE WORK MUST HAPPEN IN WORKTREES — NEVER IN PRIMARY CHECKOUT ===

Primary checkout may contain Boss's uncommitted work, local experimental commits, or in-progress changes. Branching or committing in it risks contaminating feature branches.

## When to Use

- **All issue work** — every VFX-NNN issue gets a worktree, no exceptions
- **Feature dev** — isolate from main checkout
- **Parallel work** — multiple branches simultaneously
- **Subagent isolation** — agents cannot corrupt primary checkout
- **PR prep** — build + test in clean worktree
- **Ralph loop iterations** — each iteration against clean worktree

## Conventions

Worktrees live in `.worktrees/` adjacent to the repo, named by branch:

```bash
# Always fetch before creating
git -C D:/VFXellence-LTD/polymath fetch origin

# New branch from origin/develop
git -C D:/VFXellence-LTD/polymath worktree add \
  -b feature/VFX-042/amj_csv_parser .worktrees/VFX-042-amj-csv-parser origin/develop

# Existing branch
git -C D:/VFXellence-LTD/polymath worktree add \
  .worktrees/VFX-001-canon-port feature/VFX-001/canon_vault_port

# List / clean up
git -C D:/VFXellence-LTD/polymath worktree list
git worktree remove .worktrees/VFX-042-amj-csv-parser
```

- `.worktrees/` must be in repo `.gitignore`
- Subagents with `isolation: "worktree"` — Claude Code handles automatically

## Staying Current with Base Branch

=== KEEP WORKTREE BRANCHES CURRENT WITH develop AT LOGICAL POINTS ===

| Checkpoint | When | Rationale |
|------------|------|-----------|
| **Resume** | Returning after >1 day idle | Catches upstream drift |
| **Pre-test** | Before E2E / build | Validates against current upstream |
| **Pre-PR** | Mandatory before PR | PR diff = only branch's changes |
| **On conflict signal** | CI red, upstream change, dependency merged | Explicit trigger |

```bash
git -C <worktree-path> fetch origin
git -C <worktree-path> merge origin/develop --no-ff -m "Merge develop into <branch>"
```

=== NEVER REBASE PUSHED WORKTREE BRANCH — USE MERGE ===
Rebase rewrites history Boss may have pulled.

=== ON MERGE CONFLICT, STOP AND SURFACE TO BOSS IF NON-TRIVIAL ===
Trivial = import order, lockfile, whitespace. Non-trivial = logic overlap, renamed APIs, schema drift.

## Subagent Pattern

```python
Agent(
    description="Implement feature X",
    prompt="...",
    isolation="worktree"
)
```

Agent gets own branch + working copy. Changes returned as branch name to review, test, merge.

=== ALWAYS CLEAN UP WORKTREES AFTER PR MERGE ===

## Related

- [[1_controller/workflows/git-conventions]] — branch naming for worktrees
- [[1_controller/workflows/subagent-strategy]] — when to use worktree isolation
- [[1_controller/workflows/development-lifecycle]] — where worktrees fit in lifecycle
