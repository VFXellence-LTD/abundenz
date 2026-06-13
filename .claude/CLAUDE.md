# VFXellence-LTD — Claude Code Operating Guide

Personal workspace for Robin Dutta's VFXellence-LTD projects. Inherits shared infrastructure from `D:\dev\.claude\CLAUDE.md` (global rules, git conventions, subagent strategy, token efficiency).

**Governance hub**: `D:\VFXellence-LTD\.canon\CLAUDE.md` — the VFXellence `.canon` vault governs standards, workflows, issue tracking, and knowledge for all VFXellence projects. Read it before starting any substantive work in this domain.

---

## Human Supervisor

Robin Dutta — **Boss** in this domain. Final authority all decisions, approvals, direction.

=== ALWAYS ADDRESS ROBIN AS BOSS IN THIS DOMAIN ===

---

## Domain Routing

| Directory | Domain | Governance | Supervisor title |
|-----------|--------|-----------|-----------------|
| `D:\VFXellence-LTD\.canon\` | Governance vault (.canon) | `D:\VFXellence-LTD\.canon\CLAUDE.md` | Boss |
| `D:\VFXellence-LTD\polymath\` | AI-driven business monorepo | `D:\VFXellence-LTD\polymath\CLAUDE.md` | Boss |
| `D:\VFXellence-LTD\polymath\vault\` | Business governance vault | `D:\VFXellence-LTD\polymath\vault\CLAUDE.md` | Boss |
| `D:\VFXellence-LTD\polymath\apps\dashboard\` | Polymath dashboard app | `D:\VFXellence-LTD\polymath\apps\dashboard\CLAUDE.md` | Boss |
| `D:\VFXellence-LTD\abundenz-site\` | Abundenz brand site (Astro) | `.canon/CLAUDE.md` + this file | Boss |
| `D:\VFXellence-LTD\archive\_passive_income\` | Archived — read-only reference (moved from root) | — | Boss |
| Everything else under `D:\VFXellence-LTD\` | Default | `.canon/CLAUDE.md` + this file | Boss |

=== VFXELLENCE AND HALON ARE INDEPENDENT DOMAINS — RULES DO NOT CROSS ===

> Note: `_passive_income` was previously at `D:\VFXellence-LTD\_passive_income\`. It has been moved to `D:\VFXellence-LTD\archive\_passive_income\`. Content has been salvaged to `.canon`. Deletion of archive pending Boss approval.

---

## Shared Infrastructure

- **Skills, plugins, hooks**: Inherited from `D:\dev\.claude` (user-level config via `~/.claude`)
- **MCP servers**: Shared via `D:\dev\.claude\mcp.json`
- **Git conventions**: Follow global CLAUDE.md rules (no co-authorship, imperative mood, `git -C` not `cd && git`)
- **Subagent strategy**: Follow global CLAUDE.md dispatch patterns and model routing
- **Token efficiency**: `/caveman:compress` on AI-facing docs

---

## Projects

### polymath/ — AI-Driven Passive Income Monorepo (pnpm)

**Git remote:** `github.com/VFXellence-LTD/polymath`
**Node:** `>=20` | **Package manager:** pnpm
**Workspace packages:**
- `apps/dashboard` (`polymath-dashboard`) — Vite 8 + React 19 + TypeScript + Tailwind CSS 4 + Recharts + SQLite. Dev server: `localhost:5173`.
- `packages/types` (`@polymath/types`) — Shared TypeScript types (ecosystems, transactions, tools).
- `packages/agents` — Agent implementations (future).

**Root scripts:**
```
pnpm dev      → pnpm --filter dashboard dev   (dashboard at localhost:5173)
pnpm build    → pnpm --filter dashboard build
pnpm lint     → pnpm --filter dashboard lint
```

**Dashboard scripts (run from apps/dashboard or via filter):**
```
npm run dev      → vite dev server
npm run build    → tsc -b && vite build
npm run lint     → eslint .
npm run preview  → preview production build
```

**Key governance files:**
- Monorepo rules: `polymath/CLAUDE.md`
- Business vault rules: `polymath/vault/CLAUDE.md`
- Dashboard rules: `polymath/apps/dashboard/CLAUDE.md`
- Task tracking: Asana (not Jira)

**5 Ecosystems:** Content/Signal (active), Viral/Surge (active), Products/Atelier (parked), Affiliate/Conduit (parked), Lullaby (design phase).

---

### abundenz-site/ — Abundenz Brand Site (Astro)

**Git remote:** TBD (`github.com/VFXellence-LTD/abundenz-site`)
**Node:** `>=22.12.0` | **Package manager:** npm
**Framework:** Astro `^6.3.8` (static site)

**Scripts:**
```
npm run dev      → astro dev (dev server)
npm run build    → astro build
npm run preview  → astro preview
npm run astro    → astro CLI
```

---

### _passive_income/ — Archived

Archived passive income projects. No active development. Read-only reference only.

---

## GitHub Organization

All repos push to `github.com/VFXellence-LTD/`

---

## Quick Start

### Polymath (from monorepo root)

```bash
cd D:\VFXellence-LTD\polymath
pnpm install
pnpm dev
```

### Polymath Dashboard (direct, in apps/dashboard)

```bash
cd D:\VFXellence-LTD\polymath\apps\dashboard
npm install
npm run dev
```

### Abundenz Site

```bash
cd D:\VFXellence-LTD\abundenz-site
npm install
npm run dev
```

---

## Development

Same local machine as Halon work. Lint, format, test locally. No remote studio dependency for personal projects.
