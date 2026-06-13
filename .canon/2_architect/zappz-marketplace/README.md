# Zappz Marketplace — Architecture Hub

**Status**: Early planning. Architecture spec in progress (see [[4_orchestrator/projects/backlog/VFX-002-zappz-marketplace-architecture]]).

**Name**: PROVISIONAL — "AbundenzAppz / Zappz". Boss must confirm final brand name before any public-facing work.

---

## What Is Zappz

The AbundenzAppz marketplace (working name: Zappz) is the platform layer that hosts VFXellence consumer apps. It sits above individual apps (like AMJ) and provides shared infrastructure: auth, billing, discovery, and the storefront.

Zappz is part of the Abundenz brand family. The "z" in the name follows the [[5_knowledge/reference/z-naming-reference|Z-naming convention]] (confirm at `D:/VFXellence-LTD/polymath/vault/shared/brand-naming.md`).

---

## Locked Architecture Decisions

| Decision | Choice | Status |
|----------|--------|--------|
| Architecture pattern | Modular monolith | Locked |
| Monetization | Marketplace-level freemium (ad-supported + premium) | Locked |
| Backend stack | TypeScript + Node.js | Locked |
| AI orchestration | Claude API via `packages/ai-engine` | Locked |
| Auth/billing layer | `packages/core` | Locked (provider TBD) |
| Database (prod) | Postgres | Locked |

---

## Planned Monorepo Structure

```
polymath/ (or future zappz-monorepo/)
  packages/
    core/         # auth, billing, shared utilities
    ai-engine/    # Claude API orchestration
    types/        # shared TypeScript types
  apps/
    marketplace/  # Zappz shell / storefront
    amj/          # A Musical Journey
    [future apps]
```

---

## Files in This Section

- `README.md` — this overview
- `monetization.md` — monetization model detail (ad-supported + premium, marketplace-level)

---

## Related Issues

- [[4_orchestrator/projects/backlog/VFX-002-zappz-marketplace-architecture]] — architecture spec issue
- [[4_orchestrator/projects/backlog/VFX-003-amj-analysis-engine-mvp]] — first app on the platform
