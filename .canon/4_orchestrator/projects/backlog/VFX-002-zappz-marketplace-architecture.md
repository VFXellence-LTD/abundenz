---
id: VFX-002
title: Zappz marketplace architecture specification
status: backlog
created: 2026-06-05
project: zappz
priority: high
depends_on: []
---

# VFX-002: Zappz Marketplace Architecture

## Goal

Define and document the architecture for the AbundenzAppz / "Zappz" apps marketplace — the platform that will host VFXellence apps (starting with AMJ, potentially others). Produce a spec sufficient to begin implementation.

## Context

### Name — PROVISIONAL

The marketplace is provisionally called **AbundenzAppz / "Zappz"**. This name has NOT been confirmed by Boss. The Abundenz parent brand is established; the apps marketplace brand name follows Z-naming convention.

**Boss must confirm the final Zappz brand name before any public-facing assets are created.**

### Locked Decisions (from AMJ/Zappz session handoff)

1. **Monetization model**: Marketplace-level, not per-app.
   - Default: **ad-supported + premium** (freemium marketplace subscription).
   - Premium subscription unlocks all apps; free tier has ads.
   - Per-app pricing is explicitly not the default (too much friction, fragments revenue).

2. **Architecture pattern**: **Modular monolith**.
   - Single deployable monorepo. Clear module boundaries. Not microservices.
   - Enables fast iteration at current scale; clear seams for future extraction if needed.

3. **Monorepo structure** (planned):
   ```
   packages/
     core/         # auth, billing, shared utilities
     ai-engine/    # Claude orchestration layer
   apps/
     marketplace/  # Zappz marketplace shell
     amj/          # A Musical Journey app
   ```

4. **Backend**: TypeScript + Node.js (aligned with polymath monorepo stack).

5. **AI layer**: Claude API for orchestration. Packages in `packages/ai-engine`.

6. **Auth + billing**: `packages/core`. Auth provider TBD (Clerk, Auth.js, or custom). Billing via Stripe.

### Open Questions

- Final Zappz marketplace brand name (Boss confirms)
- Auth provider selection
- Hosting / deployment target
- Database: likely Postgres (production path from AMJ's SQLite MVP)
- When does marketplace get built vs just AMJ app hosted independently?

## Tasks

- [ ] Boss confirms Zappz name
- [ ] Define auth provider and justify
- [ ] Define hosting/deployment architecture
- [ ] Write ADR (architectural decision record) for modular-monolith vs microservices
- [ ] Scaffold monorepo structure
- [ ] Define `packages/core` API surface (auth, billing interfaces)
- [ ] Define `packages/ai-engine` API surface
- [ ] Write architecture doc in `2_architect/zappz-marketplace/`

## Acceptance Criteria

- [ ] Architecture doc written and Boss-approved
- [ ] Zappz name confirmed
- [ ] Monorepo scaffold exists
- [ ] ADRs for key decisions written

## Notes

See `2_architect/zappz-marketplace/README.md` and `2_architect/zappz-marketplace/monetization.md` for current stubs.

## Time Log

| Timestamp (UTC) | Event |
|-----------------|-------|
| 2026-06-05 | Created from session handoff |
