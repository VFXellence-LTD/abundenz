# Polymath Dashboard — Claude Code Operating Guide

Web dashboard for the Polymath passive income system. Visualizes ecosystem health, revenue, cadence, tools, and setup progress.

## Governance

This repo is governed by **Canon** (`D:\VFXellence-LTD\_canon\CLAUDE.md`). Follow Canon workflow:
- Git worktrees for feature isolation
- Conventional commits
- Branch naming per Canon conventions
- Canon skills (`/start`, `/pr`, `/make`) when applicable

**Supervisor:** Maestro / Boss — Robin Dutta.

## Relationship to Polymath Vault

| | This repo (`polymath-dashboard`) | Polymath vault (`_passive_income`) |
|---|---|---|
| Type | Code (git repo) | Business governance (Obsidian vault, no git) |
| Location | `D:\VFXellence-LTD\polymath\apps\dashboard` | `D:\VFXellence-LTD\_passive_income` |
| What it does | Visualizes ecosystem data | Defines ecosystem structure, agents, policies |
| Data model | `src/types/index.ts` + `src/data/` | `controller/dashboard.md` + ecosystem READMEs |
| Updates when | Vault structure changes | Business decisions, new ecosystems, policy changes |

=== THE VAULT IS THE SOURCE OF TRUTH. THE DASHBOARD DISPLAYS IT. ===

When vault structure changes (new ecosystem, new revenue stream, new tool), the dashboard needs corresponding updates to types, data, and UI.

## Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite 8
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite`)
- **Charts:** Recharts
- **Routing:** React Router DOM 7
- **Storage:** better-sqlite3 (local SQLite)
- **Icons:** lucide-react
- **Utilities:** clsx, tailwind-merge, class-variance-authority, date-fns

## Architecture

```
src/
├── pages/               ← route-level views
│   ├── DashboardPage    ← ecosystem status, revenue summary, health
│   ├── SetupPage        ← guided setup wizard per ecosystem (/setup/:ecosystem)
│   ├── EarningsPage     ← revenue charts and breakdowns
│   ├── TransactionsPage ← income/expense log with filtering
│   ├── TaxCenterPage    ← quarterly tax estimates
│   └── ToolsPage        ← tool registry with cost tracking
├── components/          ← reusable UI
├── data/                ← static data (ecosystems, setup steps, tools)
├── hooks/               ← React hooks (useTransactions, useTools, useSetupProgress)
├── types/               ← TypeScript interfaces
└── lib/                 ← utilities
```

## Current Ecosystem Model (NEEDS UPDATE)

The dashboard currently knows about 3 ecosystems:
```typescript
type EcosystemId = "content" | "products" | "affiliate";
```

**Must be updated to match vault (5 ecosystems):**
```typescript
type EcosystemId = "content" | "viral" | "products" | "affiliate" | "lullaby";
```

### What needs adding:

| Feature | Status | Details |
|---------|--------|---------|
| Viral/Surge ecosystem | Missing | Add to types, data, setup wizard, dashboard cards |
| Lullaby ecosystem | Missing | Add as content sub-vertical or standalone ecosystem |
| Brand names | Missing | Signal, Surge, Atelier, Conduit, Lullaby — display alongside generic names |
| Surge control panel | Missing | Vertical registry, account matrix, RPM tracker, pipeline status, safeguard log |
| Surge revenue streams | Missing | TikTok Creator Rewards, YouTube Shorts, Instagram Reels, affiliate bio links |
| Research intelligence page | Missing | Top opportunities, trend feed, scoring |
| Agent infrastructure page | Missing | Agent build status, 30-day manual tracker |
| Brand isolation audit | Missing | Cross-ecosystem link checks |
| Kill-switch monitor | Missing | Threshold tracking per ecosystem |
| Setup wizard for Surge | Missing | Steps: select vertical, create accounts, manual clip production, track RPM |

### Data model reference (from vault)

Vault's `controller/dashboard.md` defines 13 sections. Each maps to a dashboard UI component:

1. Ecosystem Status Board → `DashboardPage`
2. Surge Control Panel → NEW page needed
3. Signal Control Panel → NEW page needed
4. Research Intelligence → NEW page needed
5. Agent Infrastructure → NEW section on Tools or new page
6. Revenue Consolidated → `EarningsPage`
7. Posting Cadence → `DashboardPage` or new section
8. Owner Time Budget → `DashboardPage`
9. Tool Spend → `ToolsPage`
10. Kill-Switch Monitor → `DashboardPage` alerts
11. Brand Isolation Audit → NEW section
12. Decision Queue → `DashboardPage` or new page
13. Monday Brief → Export/template feature

## GitHub

**Org:** VFXellence-LTD
**Repo:** Not yet created — initialize git, push to org when ready.

## Task Tracking

**Asana** (personal projects, not Jira). Token in env var via `@roychri/mcp-server-asana`.

## Dev Commands

```bash
npm run dev      # Start dev server at localhost:5173
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```
