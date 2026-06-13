# Pinterest + Affiliate Model

**Source:** Operator's reference research (multiple transcribed reels)
**Captured:** 2026-05-08
**Ecosystem fit:** conduit
**Status:** Applied — Conduit ecosystem incorporates this model

---

## The model

Find trending products on Amazon or other marketplaces. Create Pinterest pins with affiliate tracking links. When a pinner clicks through and purchases, earn a commission. Pinterest's long-content half-life means pins continue driving traffic for months or years after posting.

The basic version of this is straightforward. The profitable version requires a critical insight about commissions.

## The critical insight: physical vs digital commissions

Physical product commissions (Amazon Associates) are tiny:
- **Amazon Associates**: 2-3% on most categories, 4-10% on select categories
- At $50 average order value, that's $1-3 per sale
- Requires enormous traffic volume to generate meaningful income

High-ticket digital product commissions are entirely different:
- **Digital products** (courses, software, memberships): 30-75% commission rates
- At $97 average order value, that's $29-73 per sale
- Same traffic volume = 15-25x the revenue

**The Conduit thesis is built on this asymmetry.** Conduit does not promote commodity Amazon products at 2% commission. Conduit promotes digital products through networks like Digistore24, ClickBank, or similar at 30-75% commission.

## Execution requirements

1. **Niche selection**: Pick niches where digital products exist and buyers have real pain (health, money, relationships, productivity, skills)
2. **Product selection**: Use revenue intelligence tools (e.g., [[callodata]]) to find products that actually convert — not just high-commission products with no buyers
3. **Pinterest presence**: Business account, keyword-optimized boards, consistent posting cadence
4. **Pin strategy**: Rich Pins with clear visual hierarchy, keyword-rich descriptions, direct affiliate links
5. **FTC compliance**: Clear disclosure on all affiliate pins (non-negotiable — see Conduit kill-switch criteria)
6. **Landing page** (optional but improves conversion): A thin page between pin and offer that pre-sells and qualifies traffic

## Where it fits in polymath

Conduit is built around this model. The agent architecture (when built) handles product research, pin creation, scheduling, and analytics. See `ecosystems/conduit/` for the full ecosystem spec.

## Verdict

Applied. The Pinterest affiliate model is Conduit's core business thesis.
