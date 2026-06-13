# Polymath — Monorepo Operating Guide

Monorepo for Robin Dutta's AI-driven passive income system. Three layers: governance vault (in .canon), apps (dev streams), packages (shared engine code).

> **Governance + control plane live in `D:\VFXellence-LTD\.canon` (see `1_controller/profiles/polymath/`).**

## Structure

```
polymath/
├── apps/               → Dev stream workspaces (currently empty — dashboard relocated)
├── packages/
│   ├── types/          → Shared TypeScript types (ecosystems, transactions, tools)
│   └── agents/         → Agent engine implementations
├── scripts/            → CLI automation, deployment configs
└── CLAUDE.md           → this file

D:\VFXellence-LTD\.canon\
├── .mission-control/
│   └── client/         → Vite + React dashboard (localhost:5174) — PRIMARY CLIENT APP
└── 1_controller/
    └── profiles/
        └── polymath/   → Business governance vault (ecosystem specs, policies, playbooks)
```

## Governance

**Inherits from:** `D:\dev\.claude\CLAUDE.md` (global rules — supervisor identity, git conventions, subagent model routing, knowledge capture, token efficiency).

Polymath **independent domain** from Canon. Canon-specific rules (Jira integration, branch naming with ENG tickets, `/start`/`/pr`/`/make` skills, AYON addon workflows) do NOT apply here.

**Supervisor:** Boss — Robin Dutta.

### What applies from global
- Git worktrees for feature isolation (code changes)
- Commit message format (imperative mood, bullets)
- Subagent model routing (opus/sonnet/haiku)
- `git -C` over `cd &&`
- No co-authorship lines
- Knowledge capture + changelog discipline
- Caveman compression for AI-facing docs

## Layer Rules

| Layer | Contains | Git tracked | Governed by |
|-------|---------|-------------|-------------|
| `D:\VFXellence-LTD\.canon\1_controller\profiles\polymath\` | Ecosystem specs, agent designs, policies, safeguards, playbooks | Yes (content files) | `.canon/CLAUDE.md` |
| `D:\VFXellence-LTD\.canon\.mission-control\client\` | Vite + React dashboard (localhost:5174) | Yes | `.canon/.mission-control/client/CLAUDE.md` + global |
| `packages/` | Shared TypeScript types, agent engine code | Yes | Global |
| `apps/` | Dev stream workspaces (empty — future vertical dev) | Yes | Global |
| `scripts/` | CLI tools, automation | Yes | Global |

### Governance vault rules
- Vault content = Obsidian markdown — no code execution
- `.obsidian/` local state excluded from git (workspace, graph, cache)
- Vault = SOURCE OF TRUTH for business structure
- Vault changes (new ecosystem, tool, policy) → dashboard may need corresponding code update

### Code-specific rules
- All code follows global conventions (conventional commits, worktrees)
- Dashboard changes go through PR workflow
- Agent code uses global subagent strategy (opus planning, sonnet implementation)

## Routing

| Boss says... | Work in... |
|-------------|-----------|
| "Update the dashboard" | `.canon/.mission-control/client/` — control plane client |
| Anything about ecosystem structure, agents, policies | `.canon/1_controller/profiles/polymath/` — governance vault |
| "Add a new vertical" | `.canon/1_controller/profiles/polymath/ecosystems/viral/verticals/` — then update dashboard data |
| "Track revenue" or "show earnings" | `.canon/.mission-control/client/` — code feature |
| "Build agent X" | `packages/agents/` — engine layer |
| "Research [topic]" | `.canon/1_controller/profiles/polymath/references/` or run Research Analyst prompt |

## Ecosystems (5)

| Ecosystem | Brand | Vault path | Dashboard ID | Status |
|-----------|-------|-----------|-------------|--------|
| Content | Signal | `vault/ecosystems/content/` | `content` | Active build |
| Viral | Surge | `vault/ecosystems/viral/` | `viral` | Active build |
| Products | Atelier | `vault/ecosystems/products/` | `products` | Parked |
| Affiliate | Conduit | `vault/ecosystems/affiliate/` | `affiliate` | Parked |
| Lullaby | Lullaby | `vault/ecosystems/content/verticals/lullaby/` | `lullaby` | Design |

## Dev Commands

```bash
# Dashboard (now at .canon/.mission-control/client)
pnpm -C "D:\VFXellence-LTD\.canon\.mission-control\client" install   # Install deps
pnpm -C "D:\VFXellence-LTD\.canon\.mission-control\client" dev       # Start at localhost:5174
pnpm -C "D:\VFXellence-LTD\.canon\.mission-control\client" build     # Build

# Polymath packages (future)
pnpm install                              # Install workspace packages
pnpm --filter @polymath/types build       # Build shared types
pnpm --filter @polymath/agents build      # Build agent engine
```

## GitHub

**Org:** VFXellence-LTD
**Repo:** `polymath` (to be created)