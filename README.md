# Polymath

AI-driven passive income monorepo. Multiple independent business ecosystems under one entity, governed by brand isolation.

## Entity

**LLC**: VFXellence Ltd
**Parent Brand**: Abundenz (abundenz.com)
**Naming Convention**: All brands incorporate a Z (Zrodinger, Ateliez, etc.)

## Ecosystems

| Ecosystem | Codename | Brand | Status | Description |
|-----------|----------|-------|--------|-------------|
| **Viral** | Surge | Zrodinger | Active | Short-form video + affiliate (TikTok, YouTube Shorts, Instagram Reels) |
| **Content** | Signal | TBD | Active | Long-form expert content — VFX pipeline engineering |
| **Products** | Atelier | Ateliez | Parked | POD designs, digital products (Etsy, Printify, Redbubble) |
| **Affiliate** | Conduit | TBD | Parked | SEO + Pinterest affiliate traffic |
| **Apps** | Forge | TBD | Design | Cross-platform freemium apps (Windows, iOS, Android) |

## Monorepo Structure

```
polymath/
├── apps/
│   └── dashboard/          Vite + React command center (localhost:5173)
├── vault/                  Obsidian governance vault
│   ├── CLAUDE.md           Claude Code operating guide
│   ├── controller/         Oversight layer (budget, kill-switches)
│   ├── ecosystems/         Per-ecosystem docs, briefs, agents, workflows
│   │   ├── viral/          Surge — active build
│   │   ├── content/        Signal — foundation phase
│   │   ├── products/       Atelier — parked
│   │   ├── affiliate/      Conduit — parked
│   │   └── apps/           Forge — design phase
│   ├── shared/             Cross-ecosystem policies, tools, entity strategy
│   └── references/         R&D inbox (tools, articles, reels)
├── resources/              Brand assets (logos, banners)
├── CLAUDE.md               Root operating guide
└── package.json            pnpm workspace root
```

## Dashboard

```bash
cd apps/dashboard
pnpm install
pnpm dev
# → http://localhost:5173
```

Pages:
- **Dashboard** — ecosystem overview, today's actions
- **Launch** — step-by-step setup flows per ecosystem + vertical
- **Setup** — foundation checklists per ecosystem
- **Entity** — legal entity → brand → account registry
- **Earnings** — revenue tracking + charts
- **Transactions** — income/expense log
- **Tax Center** — estimated tax calculations
- **Tools** — active tool registry

## Key Principles

1. **Brand isolation** — ecosystems never cross-promote. Different names, domains, handles, payment processors.
2. **One build phase at a time** — don't split attention across ecosystems.
3. **Lowest resistance first** — Amazon Associates day 1, TikTok Shop at 1K followers.
4. **Manual before automating** — run workflow manually 30 days before building agents.
5. **Z-naming** — all brands incorporate Z replacing similar sounds.

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Dashboard**: Vite + React 19 + TypeScript + Tailwind CSS 4
- **Data**: localStorage (migrating to SQLite)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM 7
