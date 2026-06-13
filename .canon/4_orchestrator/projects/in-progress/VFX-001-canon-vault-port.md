---
id: VFX-001
title: Build .canon governance vault for VFXellence domain
status: in-progress
created: 2026-06-05
project: .canon
priority: high
depends_on: []
---

# VFX-001: Build .canon Governance Vault

## Goal

Establish `D:/VFXellence-LTD/.canon/` as the derived, project-tailored governance vault for the VFXellence domain — analogous to how `D:/dev/halon-rdutta/_canon/` governs the Halon pipeline workspace. This vault governs Claude Code behavior across all VFXellence projects (polymath, abundenz-site, future Zappz apps).

## Context

### The Naming Model (architectural north star)

- `_canon` (underscore) = a **base/factory** canon — the source repo (Halon's at `D:/dev/halon-rdutta/_canon/`).
- `.canon` (dot) = a **derived install** — generated/adapted from the base for a specific domain.
- Future vision: `_canon` becomes a ".canon factory" that builds tailored installs for any project by swapping only the tailored layer, preserving the universal layer.

This vault was built keeping that separation explicit: every file is tagged `layer: universal` or `layer: vfxellence` in frontmatter.

### What Was Built (this session — 2026-06-05)

**Source read**: `D:/dev/halon-rdutta/_canon/` (all CLAUDE.md, standards, workflows, profiles, README)
**Brand doctrine**: `D:/VFXellence-LTD/polymath/vault/shared/brand-isolation/POLICY.md` + `brand-naming.md`
**Source for salvage**: `D:/VFXellence-LTD/archive/_passive_income/`

**Decisions locked in this build:**

1. **No Jira.** File-based issue tracker only. `4_orchestrator/projects/` with status folders, VFX-NNN IDs.
2. **Supervisor = Boss** (not "Maestro" — that is Halon-only).
3. **Z-naming convention** for Abundenz sub-brands (brand-naming.md incorporated by reference).
4. **Brand isolation policy** incorporated by reference (polymath vault is canonical source).
5. **Apps marketplace**: provisionally called AbundenzAppz / "Zappz" — **Boss must confirm final name**.
6. **TS/Node/React stack** for web projects (polymath monorepo pattern; typescript-engineering.md stub written).
7. **`_passive_income` archived** at `D:/VFXellence-LTD/archive/_passive_income/` — NOT deleted. Boss approves deletion separately.
8. **Polymath vault NOT absorbed** — referenced via paths, not duplicated.

### Stripped from Halon Base (not ported)

- `jira-integration.md` — Jira/Atlassian entirely absent
- `upstream-policy.md` — AYON/Ynput fork policy irrelevant
- Addon versioning (`+label` AYON pattern)
- Maya/DCC/AYON/Halon pipeline references
- Claude-docs addon docs pattern
- "Maestro" title throughout

### Universal vs Tailored Layer

Files tagged `layer: universal` are the factory base — a future `_canon` factory could regenerate them for any new domain install. Files tagged `layer: vfxellence` are domain-specific and would be swapped.

## Tasks

- [x] Read all source docs (halon canon, brand policy, passive income archive)
- [x] Create C-A-N-O-N directory skeleton
- [x] Port and adapt universal standards (no-go-rules, python-engineering, testing-strategy, sentry-integration)
- [x] Write TypeScript/React standards stub (vfxellence layer)
- [x] Port and adapt universal workflows (worktrees, subagent-strategy, e2e-testing, token-efficiency, ralph-loop, security-sweep, development-lifecycle, git-conventions)
- [x] Write issue-tracking workflow (replaces jira-integration)
- [x] Create issue tracker scaffold (template, README, status folders)
- [x] Create handoff tickets (VFX-001, VFX-002, VFX-003)
- [x] Salvage archive/_passive_income content
- [x] Write dedupe note (3_notes/)
- [x] Write .canon CLAUDE.md hub
- [x] Write vault README
- [x] Write 2_architect stubs (zappz-marketplace)
- [x] Write 5_knowledge/learning/canon-naming-model.md
- [x] Update D:/VFXellence-LTD/.claude/CLAUDE.md
- [x] Write 2026-06-05 changelog

## Acceptance Criteria

- [x] All C-A-N-O-N directories exist and are populated
- [x] No Jira references anywhere in vault
- [x] No "Maestro" anywhere (Boss throughout)
- [x] No Halon/AYON/DCC references
- [x] Universal vs tailored layer distinction maintained
- [x] 3 handoff tickets created with locked decisions
- [x] Salvage performed, dedupe note written
- [x] VFXellence .claude/CLAUDE.md updated

## Notes

- `_passive_income` found archived at `D:/VFXellence-LTD/archive/_passive_income/` (not at `D:/VFXellence-LTD/_passive_income/` as task described — source moved to archive already). Salvage performed from archive location.
- Polymath vault exists at `D:/VFXellence-LTD/polymath/vault/` — confirmed path is correct.
- `polymath/dev/1_controller/standards/` was not found (polymath does not have a dev/standards folder yet). TypeScript stub written from scratch in `.canon/1_controller/standards/typescript-engineering.md`.
- The `.claude/CLAUDE.md` routing table references `D:\VFXellence-LTD\_passive_income\` — that path is now archived. Updated in this session to reflect archived status.

## Time Log

| Timestamp (UTC) | Event |
|-----------------|-------|
| 2026-06-05 ~14:00 | Started |
| 2026-06-05 ~18:00 | Build complete (in-progress, pending Boss review) |
