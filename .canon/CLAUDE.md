# VFXellence .canon — Claude Code Operating Guide

Operating inside `.canon` — the VFXellence domain governance vault. A derived install of the base `_canon` pattern, tailored for VFXellence-LTD projects.

**Inherits from:** `D:/dev/.claude/CLAUDE.md` (global rules — git conventions, subagent strategy, model routing, knowledge capture, token efficiency). This file = VFXellence-specific hub. Workflow details in `1_controller/workflows/`.

---

## Boss

Robin Dutta — **Boss** in this domain. Final authority on all decisions, approvals, direction.

=== ALWAYS ADDRESS ROBIN AS BOSS IN THIS DOMAIN ===
=== NEVER PROCEED PAST A GATE WITHOUT BOSS'S APPROVAL ===

---

## The Naming Model

This vault is a `.canon` (dot prefix) = a **derived, project-tailored install**. The base factory source is `_canon` (underscore prefix) at `D:/dev/halon-rdutta/_canon/`.

**Universal vs tailored layer**: Every file in `1_controller/` is tagged with `layer: universal` or `layer: vfxellence` in frontmatter. Universal files can be regenerated from the base; tailored files are domain-specific.

**Factory vision**: The long-term goal is for `_canon` to become a factory that builds `.canon` installs for any project by swapping only the tailored layer. Keep this seam clean.

Full explanation: [[5_knowledge/learning/canon-naming-model]]

---

## Vault Structure (spells C-A-N-O-N)

```
.canon/
├── 1_controller/        # C - Rules, standards, profiles, workflows
│   ├── standards/       #     Engineering standards, no-go rules, testing, sentry
│   ├── profiles/        #     Managed CLAUDE.md per project (future)
│   └── workflows/       #     Atomic workflow procedures
├── 2_architect/         # A - System design, patterns
│   ├── patterns/        #     Reusable design patterns (agents, products)
│   └── zappz-marketplace/ # Zappz marketplace architecture stubs
├── 3_notes/             # N - Scratch space, raw ideas, inbox
├── 4_orchestrator/      # O - Active projects, changelogs
│   ├── projects/        #     Business planning documents (not an issue tracker)
│   └── changelogs/      #     Daily session summaries (YYYY-MM-DD.md)
├── 5_knowledge/         # N - Lessons learned, references, growth playbooks
│   ├── learning/        #     What we discovered (by topic)
│   └── reference/       #     Entity strategy, products, growth, servers
├── README.md
└── CLAUDE.md            #     This file (hub)
```

---

## Domain Routing

| Directory | Domain | Governance | Supervisor |
|-----------|--------|-----------|------------|
| `D:/VFXellence-LTD/.canon/` | Governance vault | This file | Boss |
| `D:/VFXellence-LTD/polymath/` | Business monorepo | `polymath/CLAUDE.md` | Boss |
| `D:/VFXellence-LTD/polymath/vault/` | Business vault | `polymath/vault/CLAUDE.md` | Boss |
| `D:/VFXellence-LTD/abundenz-site/` | Abundenz brand site (Astro) | `.claude/CLAUDE.md` | Boss |
| `D:/VFXellence-LTD/archive/_passive_income/` | Archived — read-only reference | — | Boss |
| Everything else under `D:/VFXellence-LTD/` | Default | This file | Boss |

=== VFXELLENCE AND HALON ARE INDEPENDENT DOMAINS — RULES DO NOT CROSS ===

---

## Issue Tracking

=== NO JIRA. NO ATLASSIAN. NEVER. ===

We are NOT adopting Atlassian. We replaced the home-grown file-based dev tracker with **GitHub-native PM** — the global toolchain already supports it (`gh` authed, `git -C`, PR workflow). Business ops stay in SQLite.

**Dev work** → **GitHub** `VFXellence-LTD/abundenz` — Issues + Projects v2. Project board: https://github.com/orgs/VFXellence-LTD/projects/2 ("VFXellence Dev"). Identity scheme: native issue numbers `#NNN`.

**Business ops** → **SQLite Mission Control** (`tasks` table in `server/db.ts`). Identity scheme: in-DB ids (e.g. `GOLIVE-001`).

**`VFX-NNN` is retired for dev tracking.** Long-form business planning documents may remain as docs under `4_orchestrator/projects/` (e.g. this plan) — they are *documents*, not an issue tracker. No new `VFX-NNN` ids are minted going forward.

Full PM workflow: [[1_controller/workflows/issue-tracking]] (to be updated to reflect GitHub-native flow)

---

## Brand Isolation + Z-Naming

=== BRAND ISOLATION IS NON-NEGOTIABLE — READ THE POLICY BEFORE ANY ECOSYSTEM WORK ===

Brand isolation policy (canonical): `D:/VFXellence-LTD/polymath/vault/shared/brand-isolation/POLICY.md`

Z-naming convention (canonical): `D:/VFXellence-LTD/polymath/vault/shared/brand-naming.md`

Key rules:
- All Abundenz sub-brands incorporate a **z** in the name (Z-naming convention)
- Each ecosystem maintains completely separate brand identity — no cross-promotion, ever
- Apps marketplace brand: PROVISIONAL ("AbundenzAppz / Zappz") — **Boss must confirm final name**
- Every new brand name assignment requires Boss approval

---

## Workflow Reference

| Workflow | What it covers |
|----------|---------------|
| [[1_controller/workflows/development-lifecycle]] | Full ticket-to-merge lifecycle (no Jira) |
| [[1_controller/workflows/issue-tracking]] | File-based issue tracker (replaces Jira) |
| [[1_controller/workflows/git-conventions]] | Branch naming (`type/NNN-description`), commit format |
| [[1_controller/workflows/worktrees]] | Mandatory worktree isolation |
| [[1_controller/workflows/subagent-strategy]] | Subagent dispatch, model routing, knowledge gathering |
| [[1_controller/workflows/e2e-testing]] | Lint → type → test → build gate |
| [[1_controller/workflows/ralph-loop]] | Iterative self-referential dev loop |
| [[1_controller/workflows/security-sweep]] | Pre-push secrets gate |
| [[1_controller/workflows/token-efficiency]] | Caveman compression targets |

### Consolidated Rules

**Lifecycle:**
- `=== ALL DEVELOPMENT FOLLOWS development-lifecycle.md ===`
- `=== ALL DEV ISSUES TRACKED IN GITHUB (VFXellence-LTD/abundenz) ===`

**Git** ([[1_controller/workflows/git-conventions]]):
- `=== ALL DEV BRANCHES FOLLOW FORMAT: type/NNN-description (e.g. feat/123-add-hyperframes) ===`
- `=== ALWAYS FETCH BEFORE CREATING BRANCH ===`
- `=== NO DEV BRANCHES WITHOUT A GITHUB ISSUE ===`

**Worktrees** ([[1_controller/workflows/worktrees]]):
- `=== ALL CODE WORK MUST HAPPEN IN WORKTREES — NEVER IN PRIMARY CHECKOUT ===`
- `=== KEEP WORKTREE BRANCHES CURRENT WITH develop AT LOGICAL POINTS ===`
- `=== NEVER REBASE PUSHED WORKTREE BRANCH — USE MERGE ===`
- `=== ON MERGE CONFLICT, STOP AND SURFACE TO BOSS IF NON-TRIVIAL ===`

**Subagents** ([[1_controller/workflows/subagent-strategy]]):
- `=== ALWAYS GATHER CODEBASE KNOWLEDGE BEFORE SPAWNING CODE AGENTS ===`
- `=== USE WORKTREE ISOLATION FOR ANY AGENT THAT WRITES CODE ===`
- `=== EVERY CODE TASK GETS A GITHUB ISSUE ===`
- `=== RECORD TIMESTAMPS IN THE CHANGELOG ===`

**Testing** ([[1_controller/workflows/e2e-testing]]):
- `=== ALL TESTS MUST PASS BEFORE CREATING PR ===`
- `=== ALL PRS MUST BE REVIEWED BY BOSS BEFORE MERGE ===`

**Security** ([[1_controller/workflows/security-sweep]]):
- `=== NEVER PUSH TO GITHUB WITHOUT RUNNING /security-sweep FIRST ===`

**Knowledge:**
- `=== ALWAYS CHECK .canon KNOWLEDGE BEFORE WRITING CODE ===`
- `=== CAPTURE LESSONS IN 5_knowledge/learning/ IMMEDIATELY — DO NOT WAIT ===`

---

## How to Use .canon

### Before Starting Work

1. Read [[1_controller/standards/no-go-rules]] — absolute violations
2. Read relevant standard (`python-engineering` or `typescript-engineering`)
3. Check `4_orchestrator/projects/in-progress/` and `blocked/` for active work
4. Check `5_knowledge/learning/` for relevant lessons
5. Check `2_architect/` for system design context

### During Development

- **Python**: 88-char lines, double quotes, 4-space indent, Python 3.11+, ruff
- **TypeScript**: strict mode, explicit types, functional components (React), pnpm
- **Priority**: Working code > Readability > Scalability > Elegance
- **Logging**: `logging.getLogger(__name__)` (Python), structured logger (TS), never `print()`
- **Testing**: Integration > contracts > golden files > smoke > unit

=== NO HIDDEN GLOBAL STATE === NO SILENT FAILURES === NO QUADRATIC OPERATIONS ===

### Session Discipline

1. Create/append `4_orchestrator/changelogs/YYYY-MM-DD.md` at start of work
2. Update issue file status and timestamps
3. Update changelog incrementally — not just at session end
4. Capture lessons to `5_knowledge/learning/` as work happens
5. Use background subagents for changelog/tracker writes

### After PR Approved

1. Update `2_architect/` docs if new areas explored
2. Capture remaining gotchas in `5_knowledge/learning/`
3. Finalize changelog with outcomes + next steps
4. `/caveman:compress` AI-facing docs
5. Close the GitHub issue (`gh issue close #NNN`) or let `Closes #NNN` in the PR auto-close it
6. Update project field Status → Done in "VFXellence Dev" board if not auto-updated
7. Clean up worktree

### When Editing .canon Files

- Pre-approved write access to all `.md` under `D:/VFXellence-LTD/.canon/`
- Maintain `[[wikilinks]]` between documents
- Keep `README.md` updated if adding new sections
- Use numbered folder prefixes: `1_controller`, `2_architect`, `3_notes`, `4_orchestrator`, `5_knowledge`
- Tag new files with `layer: universal` or `layer: vfxellence` in frontmatter

---

## Projects Context

### Active Projects

| Project | Location | CLAUDE.md |
|---------|----------|-----------|
| polymath monorepo | `D:/VFXellence-LTD/polymath/` | `polymath/CLAUDE.md` |
| polymath vault | `D:/VFXellence-LTD/polymath/vault/` | `polymath/vault/CLAUDE.md` |
| abundenz-site | `D:/VFXellence-LTD/abundenz-site/` | `.claude/CLAUDE.md` |
| AMJ app | `D:/VFXellence-LTD/polymath/apps/amj/` (planned) | — |

### Sibling Vault

The **polymath vault** (`D:/VFXellence-LTD/polymath/vault/`) is the business/content operations vault — ecosystems, brand strategy, source material. It is NOT part of `.canon`. Do not absorb or duplicate its content here. Reference via paths or wikilinks.

---

## Cross-Linking Convention

=== ALWAYS CROSS-LINK RELATED FILES WITH WIKILINKS ===

Use Obsidian `[[wikilinks]]` from vault root:

```markdown
[[1_controller/standards/no-go-rules]]
[[1_controller/workflows/worktrees]]
[[5_knowledge/learning/canon-naming-model]]
```

For files outside the vault, use absolute paths:
```markdown
D:/VFXellence-LTD/polymath/vault/shared/brand-isolation/POLICY.md
```

---

## .canon-Specific Prohibitions

=== NEVER INITIALIZE GIT IN THIS VAULT ===
=== NEVER CREATE FILES OUTSIDE NUMBERED FOLDER STRUCTURE ===
=== NEVER WRITE CODEBASE DOCS WITHOUT VERIFYING AGAINST ACTUAL SOURCE CODE ===
=== NEVER STORE SECRETS, CREDENTIALS, OR API KEYS IN THIS VAULT ===
=== NEVER DUPLICATE INFORMATION THAT EXISTS IN STANDARDS — LINK INSTEAD ===
=== NEVER ABSORB POLYMATH VAULT CONTENT — REFERENCE IT ===
