# Zappz Monetization Model

**Status**: PROVISIONAL — model locked, Zappz brand name pending Boss confirmation.

---

## Model: Marketplace-Level Freemium

Monetization operates at the marketplace level, not per app. This is a deliberate architectural decision.

### Why Not Per-App Pricing

Per-app pricing creates friction:
- Users must evaluate and pay for each app separately
- Revenue is fragmented and harder to grow predictably
- Paywalls on individual apps reduce discovery and trial

### The Freemium Structure

| Tier | Access | Revenue |
|------|--------|---------|
| Free | All apps, with ads | Ad revenue |
| Premium | All apps, no ads, enhanced features | Subscription revenue |

**Free tier**: Full access to all marketplace apps. Sustains experience with non-intrusive display/native advertising. No per-feature paywalls.

**Premium tier**: One subscription unlocks all apps ad-free plus premium features (deeper AI queries, higher rate limits, export formats, etc.). Price TBD — Boss confirms.

### Why This Model

- Low friction entry (free tier, try everything)
- Single recurring revenue stream (premium subscription)
- Ad revenue floor from free users
- Premium upsell driven by value experienced in free tier
- Scales naturally as more apps join the marketplace

---

## Implementation Notes

- Ad layer: likely Google AdSense or a programmatic network. TBD.
- Subscription billing: Stripe (via `packages/core` billing module).
- Free/premium gating: feature flags per user tier, checked in `packages/core/auth`.
- Ad-free detection: premium users receive `tier: "premium"` in auth token; app layer checks this to suppress ad components.

---

## Open Questions

- Final premium subscription price
- Ad network selection
- Whether any features are premium-only vs just ad-free
- Refund / trial period policy

---

## Related

- [[2_architect/zappz-marketplace/README]] — marketplace overview
- [[4_orchestrator/projects/backlog/VFX-002-zappz-marketplace-architecture]] — full architecture spec issue
