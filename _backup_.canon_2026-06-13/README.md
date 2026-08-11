# VFXellence .canon

Governance and meta-layer vault for the VFXellence-LTD domain. Analogous to a `_canon` base install but derived and tailored for this domain.

## What this is

`.canon` (dot prefix) = a **derived, project-tailored canon install**, generated from the base `_canon` factory pattern at `D:/dev/halon-rdutta/_canon/`. It governs Claude Code behavior, project tracking, standards, and knowledge across all VFXellence projects.

## What this is NOT

- Not the polymath business vault (`D:/VFXellence-LTD/polymath/vault/`) — that governs content ops and ecosystem strategy. This governs the engineering/dev layer above it.
- Not a git repository — do not run `git init` here.

## Vault Structure (spells C-A-N-O-N)

```
.canon/
├── 1_controller/        # C - Rules, standards, profiles, workflows
│   ├── standards/       #     Engineering, no-go rules, testing, sentry
│   ├── profiles/        #     Managed CLAUDE.md per project
│   └── workflows/       #     Atomic workflow procedures
├── 2_architect/         # A - System design, patterns, codebase docs
│   ├── patterns/        #     Reusable design patterns (agents, products)
│   └── zappz-marketplace/ #   Zappz marketplace architecture stubs
├── 3_notes/             # N - Scratch space, raw ideas, inbox
├── 4_orchestrator/      # O - Active projects, changelogs
│   ├── projects/        #     File-based issue tracker (VFX-NNN)
│   └── changelogs/      #     Daily session summaries (YYYY-MM-DD.md)
├── 5_knowledge/         # N - Lessons learned, external references
│   ├── learning/        #     What we discovered (by topic)
│   └── reference/       #     Platform strategies, product specs, entity info
├── README.md            #     This file
└── CLAUDE.md            #     The hub — read this before all work
```

## Supervisor

Robin Dutta — **Boss** in this domain. Final authority on all decisions.

## Active Projects

See `4_orchestrator/projects/` and the hub CLAUDE.md for full project status.

## Related Vaults

- **Polymath vault**: `D:/VFXellence-LTD/polymath/vault/` — business/content operations
- **Base canon**: `D:/dev/halon-rdutta/_canon/` — the factory source for universal standards
