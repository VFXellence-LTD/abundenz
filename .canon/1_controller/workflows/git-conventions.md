---
layer: universal
name: git-conventions
description: VFXellence git rules — branch naming, commit format, security. AYON/addon versioning stripped. Global git rules (git -C, no co-authorship) in D:/dev/.claude/CLAUDE.md.
---

# Git Conventions

Global git rules (`git -C`, commit format, no co-authorship lines) live in `D:/dev/.claude/CLAUDE.md`. This doc covers VFXellence-specific additions.

=== USE STANDARD GIT COMMANDS FOR COMMITS ===

## Branch Naming

=== ALL BRANCHES FOLLOW FORMAT: TYPE/TICKET-ID/DESCRIPTION_SUMMARY ===

```
<branch_type>/<ticket_id>/<description_summary>
```

| Branch Type | When |
|-------------|------|
| `feature` | New functionality |
| `bugfix` | Bug fixes |
| `refactor` | Code restructuring |
| `docs` | Documentation only |
| `chore` | Build, CI, tooling |

- `ticket_id` = VFX-NNN (or per-app prefix if established)
- `description_summary` = short snake_case
- Base all branches off `origin/develop` (or `origin/main` if no develop branch)

=== ALWAYS FETCH BEFORE CREATING BRANCH ===
=== NO BRANCHES WITHOUT AN ISSUE TRACKER FILE (VFX-NNN) ===

```bash
git -C <repo-path> fetch origin
git -C <repo-path> checkout -b feature/VFX-042/amj_csv_parser origin/develop
```

## Commit Message Format

From global CLAUDE.md — imperative mood, under 72 chars first line, bullets for changes:

```
Add CSV parser for AMJ taste profile engine

- Parse Spotify export CSV into normalized track records
- Validate required fields, raise on missing data
- Write unit tests for edge cases (empty file, malformed rows)
```

No `Co-Authored-By` lines. Robin = author.

## Version Tagging

No `+label` versioning (that is an AYON addon pattern). Use standard semver:

- `v1.0.0` — releases
- `v1.0.0-alpha.1`, `v1.0.0-beta.2` — pre-releases

Tag releases after Boss review and merge.

## Security

=== RUN /security-sweep BEFORE FIRST PUSH TO ANY NEW REMOTE ===

See [[1_controller/workflows/security-sweep]].

## Package Output

Projects using build scripts: output artifacts to a consistent `/dist` or `/packages` directory at repo root. Do not commit build artifacts; add to `.gitignore`.

## Related

- [[1_controller/workflows/worktrees]] — where branches live
- [[1_controller/workflows/development-lifecycle]] — when branching happens
- [[1_controller/workflows/security-sweep]] — pre-push gate
