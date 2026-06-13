# Ecosystem: Atelier

The AI-generated visual product business. **Stub only — do not build until Signal reaches Phase 2.**

## One-line thesis
High-volume AI-generated visual products (art prints, digital downloads, templates, POD goods) sold across marketplaces, with selection and listing automated by AI agents. Differentiated by niche selection and throughput, not authorship.

## Core moat
Speed and niche selection. The owner is invisible. The brand is the products.

## Why this is different from Signal

| | Signal | Atelier |
|---|---|---|
| Owner visibility | High (voice, name, taste) | Zero (anonymous brand) |
| Differentiation | Authentic perspective | Niche match + volume |
| Trust signal | Person | Product reviews + listing quality |
| Time investment | Daily voice recording | Batch sessions, mostly automated |
| Audience | Listeners/viewers | Buyers (one-shot transactions) |
| Failure mode | Algorithm change | Marketplace policy change |

These businesses must not blend. See `shared/brand-isolation/POLICY.md`.

## Business model summary (provisional, to be validated)

**Possible product lines** (pick 1-2 max for v1, not all of them):
- Wall art / printable digital downloads (Etsy)
- Print-on-demand physical (Printful, Printify, Society6, Redbubble, Displate)
- Stock asset libraries (Adobe Stock, Shutterstock — though contributor terms have tightened on AI)
- Templates and design assets (Canva creator, Creative Market)
- Coloring books, journals, low-content books (Amazon KDP — verify current AI policy)
- Pattern packs, textures, mockups (Creative Market, direct sales)

**Revenue model:** transactional, per-product. No subscriptions in v1.

**Channels:** marketplace presence (Etsy, KDP, etc.) + own Shopify storefront for higher-margin items + Pinterest as primary traffic driver (organic, NOT paid).

## Status

- **Current phase:** PARKED — do not build
- **Activation criterion:** Signal must be in Phase 2 (per Operation Signal §1.1) AND owner has explicitly decided this is the next ecosystem to activate
- **Activation review date:** earliest month 9 from Signal launch
- **Note:** Viral/Surge is now active as the second ecosystem. Atelier activation may shift depending on how Surge performs and whether the operator has bandwidth for a third ecosystem.

## Why parked

Most operators die from splitting attention, not from lack of opportunity. Building a second ecosystem before the first is generating reliable income and runs on <30 min/day owner time will starve both ecosystems. Signal in Phase 2 is the earliest signal that the owner has bandwidth.

Additionally: the AI-art-selling space has serious open questions (marketplace AI policies, commodity pricing pressure, attribution rules) that are worth letting evolve another 6-9 months before committing.

## When activated, the build sequence is:

1. **Niche lock** — same matrix as Signal §2.1, applied to product niches (e.g., not "wall art" but "minimalist line-art for new parents' nurseries")
2. **Marketplace policy audit** — current rules at Etsy, KDP, Printful, etc. on AI-generated content disclosure and acceptance
3. **Generation pipeline** — Midjourney/Ideogram + upscaler + automated listing prep (mockups, descriptions, tags)
4. **Listing agent** — generates titles, descriptions, tags optimized for chosen marketplace's search
5. **Pinterest agent** — primary traffic driver, schedules pins for each listing
6. **Order/customer triage** — for any product type involving fulfillment questions

Detailed agent specs are deferred until activation — writing them now is premature optimization given how fast this space changes.

## Files in this ecosystem (mostly empty, by design)

```
atelier/
├── README.md          ← this file
├── brief/             ← niche brief, marketplace decision, generation aesthetic guide (empty)
├── agents/            ← agent specs (empty until activation)
├── workflows/         ← (empty)
├── playbooks/         ← (empty)
├── assets/            ← (empty)
├── calendar/          ← (empty)
└── analytics/         ← (empty)
```

## R&D in the meantime

While parked, the `references/` folder accumulates research that will inform Atelier when activated:
- Reels and creator workflows demonstrating AI-art-selling pipelines
- Tool evaluations (Midjourney vs Ideogram vs Flux for product art, etc.)
- Marketplace policy tracking
- Any "AI Art Sellers" community content (e.g., the Skool community already filed in references)

This R&D is allowed and useful. Building the system itself is not, until activation criteria are met.

## Brand isolation reminder

Atelier never mentions Signal or Surge. Atelier does not use the owner's voice, face, name, or any identifier traceable to the Signal or Surge brands. The owner does not appear in Atelier marketing. Read `shared/brand-isolation/POLICY.md`.
