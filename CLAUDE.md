# Polymath — Monorepo Operating Guide

Monorepo for Robin Dutta's AI-driven passive income system. Three layers: vault (business governance), apps (web tools), packages (shared code).

## Structure

```
polymath/
├── vault/              → Obsidian vault — business governance, ecosystem specs, policies
├── apps/
│   └── dashboard/      → Vite + React dashboard (localhost:5173)
├── packages/
│   ├── types/          → Shared TypeScript types (ecosystems, transactions, tools)
│   └── agents/         → Agent implementations (future)
├── scripts/            → CLI automation, deployment configs
└── CLAUDE.md           → this file
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
| `vault/` | Ecosystem specs, agent designs, policies, safeguards, playbooks | Yes (content files) | `vault/CLAUDE.md` (Polymath rules) |
| `apps/dashboard/` | React web dashboard | Yes | `apps/dashboard/CLAUDE.md` + global |
| `packages/` | Shared TypeScript types, agent code | Yes | Global |
| `scripts/` | CLI tools, automation | Yes | Global |

### Vault-specific rules
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
| "Update the dashboard" | `apps/dashboard/` — Canon workflow |
| Anything about ecosystem structure, agents, policies | `vault/` — Polymath rules |
| "Add a new vertical" | `vault/ecosystems/viral/verticals/` — then update dashboard data |
| "Track revenue" or "show earnings" | `apps/dashboard/` — code feature |
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