---
layer: universal
name: token-efficiency
description: Caveman compression targets and subagent report mode. Skip human-facing docs.
---

# Token Efficiency (`/caveman`)

Caveman compression principle in `D:/dev/.claude/CLAUDE.md`. This doc covers VFXellence-specific targets.

## Targets (Compress)

- `.canon/CLAUDE.md` — the operating hub
- `.canon/1_controller/standards/*.md` — engineering rules
- `.canon/1_controller/profiles/**/*.md` — project profiles
- `.canon/1_controller/workflows/*.md` — workflow procedures
- `.canon/2_architect/**/*.md` — system design docs
- `.canon/5_knowledge/learning/*.md` — lessons for future Claude
- `.canon/5_knowledge/reference/*.md` — machine-readable references

## Skip (Human-Facing)

- All `README.md` files
- `4_orchestrator/changelogs/*.md` — Boss reviews these
- `4_orchestrator/projects/**/*.md` — Boss monitors these
- `_template.md` files
- `3_notes/**` — scratch / R&D
- Any doc intended for Boss's direct reading

## Subagent Reports

For subagents doing verbose exploration whose output feeds back into main context (not shown to Boss):

> Respond in caveman mode — drop articles, filler, pleasantries, hedging. Fragments OK. Preserve code, paths, URLs, technical terms exactly.

Skip for subagents whose output goes to Boss (PR descriptions, changelogs, issue trackers).

## Policy

- `/caveman:caveman-commit` disabled by .canon policy
- `/caveman:caveman-review` OK for internal-only review, not Boss-facing output

## Related

- [[1_controller/workflows/development-lifecycle]] — step 18 (COMPRESS)
