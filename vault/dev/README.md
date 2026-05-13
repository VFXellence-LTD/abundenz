# Polymath Development Layer

Canon-style development governance for Polymath's code projects. Mirrors `_canon` structure but configured for VFXellence-LTD GitHub org + Asana task tracking.

## Relationship to Polymath vault

```
_passive_income/
├── CLAUDE.md           ← business governance (ecosystems, brand isolation, etc.)
├── ecosystems/         ← business operations
├── shared/             ← business policies
├── references/         ← business R&D
├── controller/         ← business oversight
└── dev/                ← THIS: code development governance
    ├── DEV-CLAUDE.md   ← development operating guide
    ├── 1_controller/   ← coding standards, project profiles
    ├── 2_architect/    ← codebase docs, design patterns
    ├── 3_notes/        ← dev scratch space
    ├── 4_orchestrator/ ← active projects, changelogs
    └── 5_knowledge/    ← dev lessons, reference
```

The business vault tells Claude WHAT to build. The dev layer tells Claude HOW to build it.

## GitHub Organization

**VFXellence-LTD** — `https://github.com/VFXellence-LTD`
- All Polymath code repos live here
- Personal project, not Halon — no Canon git conventions apply
- CI/CD via GitHub Actions

## Task Tracking

**Asana** (replaces Jira from Canon workflow)
- Account: vfxellence@gmail.com
- MCP server: `@roychri/mcp-server-asana`
- Token stored as env var `ASANA_ACCESS_TOKEN` (never in files)

## Repos (planned)

| Repo | Purpose | Status |
|------|---------|--------|
| `polymath-dashboard` | React/TS tracking portal + earnings dashboard | Planned |
| `polymath-agents` | Claude Code skills + agent automation configs | Planned |
| `polymath-infra` | Make.com/n8n configs, deployment scripts | Planned |
