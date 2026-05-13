# Polymath — Monorepo Operating Guide

Monorepo for Robin Dutta's AI-driven passive income system. Three layers: vault (business governance), apps (web tools), packages (shared code).

## Structure

```
polymath/
├── vault/              ← Obsidian vault — business governance, ecosystem specs, policies
├── apps/
│   └── dashboard/      ← Vite + React dashboard (localhost:5173)
├── packages/
│   ├── types/          ← Shared TypeScript types (ecosystems, transactions, tools)
│   └── agents/         ← Agent implementations (future)
├── scripts/            ← CLI automation, deployment configs
└── CLAUDE.md           ← this file
```

## Governance

This repo is governed by **Canon** (`D:\dev\_canon\CLAUDE.md`). Canon workflow:
- Git worktrees for feature isolation (code changes)
- Conventional commits, branch naming per Canon conventions
- Canon skills (`/start`, `/pr`, `/make`) when applicable

**Supervisor:** Boss / Maestro — Robin Dutta.

## Layer Rules

| Layer | Contains | Git tracked | Governed by |
|-------|---------|-------------|-------------|
| `vault/` | Ecosystem specs, agent designs, policies, safeguards, playbooks | Yes (content files) | `vault/CLAUDE.md` (Polymath rules) |
| `apps/dashboard/` | React web dashboard | Yes | `apps/dashboard/CLAUDE.md` + Canon |
| `packages/` | Shared TypeScript types, agent code | Yes | Canon |
| `scripts/` | CLI tools, automation | Yes | Canon |

### Vault-specific rules
- Vault content is Obsidian markdown — no code execution
- `.obsidian/` local state excluded from git (workspace, graph, cache)
- Vault is the SOURCE OF TRUTH for business structure
- When vault changes (new ecosystem, new tool, new policy) → dashboard may need corresponding code update

### Code-specific rules
- All code follows Canon conventions (TypeScript, conventional commits, worktrees)
- Dashboard changes go through PR workflow
- Agent code uses Canon's subagent strategy (opus for planning, sonnet for implementation)

## Routing

| Boss says... | Work in... |
|-------------|-----------|
| "Update the dashboard" | `apps/dashboard/` — Canon workflow |
| Anything about ecosystem structure, agents, policies | `vault/` — Polymath rules |
| "Add a new vertical" | `vault/ecosystems/viral/verticals/` — then update dashboard data |
| "Track revenue" or "show earnings" | `apps/dashboard/` — code the feature |
| "Build agent X" | `packages/agents/` — Canon workflow |
| "Research [topic]" | `vault/references/` or run Research Analyst prompt |

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
pnpm install                    # Install all workspace dependencies
pnpm dev                        # Start dashboard at localhost:5173
pnpm build                      # Build dashboard
pnpm --filter dashboard dev     # Explicit: dashboard only
pnpm --filter @polymath/types build  # Build shared types (future)
```

## GitHub

**Org:** VFXellence-LTD
**Repo:** `polymath` (to be created)
