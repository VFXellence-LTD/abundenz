# Conduit

**Thesis**: Fully automated affiliate income through AI-generated content driving traffic to affiliate offers, operating under an anonymous brand with zero personal involvement.

**Status**: PARKED — activation criteria: Signal in Phase 2 + Boss decision. Note: Viral/Surge is now active as the second ecosystem, so Conduit activation depends on operator bandwidth after both Signal and Surge are stable.

---

## What Conduit Is

Conduit is an anonymous affiliate marketing system. It finds products people are already searching for, creates content recommending those products, places that content where buyers search (Pinterest, Google), and earns commissions when buyers click through and purchase. No products are created, no inventory held, no fulfillment managed.

The operator's identity is not connected to Conduit. Different brand name, different domain, different social handles, different payment processor. No crossover with Signal, Surge, Atelier, or Lullaby.

## Core Moat

- **Automation speed**: Content produced by AI at volume no human team can match on a small budget
- **Niche selectivity**: Analytical approach to niche selection beats gut-feel operators
- **No personal brand required**: Conduit does not sell trust in a person. Buyers arrive via search, find a recommendation, click through. They never "follow" Conduit. This removes the biggest bottleneck in content businesses.
- **Horizontal scaling**: Add niches by duplicating the pipeline. Kill underperformers. Compound on winners.

## What Conduit Is Not

- Not a personal brand. The operator's face, voice, name, and professional identity are absent.
- Not Signal. Signal sells trust built through authentic expertise. Conduit sells search-optimized product recommendations. Blending them destroys Signal's core value.
- Not a product business. No inventory, no fulfillment, no support.

## Audience

People searching for product recommendations — "best home office chair under $300", "top AI writing tools 2025", "honest review of [product]". They arrive through Pinterest or Google, read or view the recommendation, click the affiliate link, and buy on the merchant's site. They do not follow Conduit as a brand.

## Business Model

```
Pinterest pin or blog post
    → Buyer searches for product recommendation
    → Finds Conduit content
    → Clicks affiliate link
    → Buys on merchant site
    → Conduit earns commission
```

Revenue depends entirely on:
1. Traffic volume (impressions → clicks)
2. Click-through rate (relevant content, compelling presentation)
3. Conversion rate (product quality, merchant landing page)
4. Commission rate (platform and product type)

## Commission Rates by Type

| Type | Platform | Typical Commission | Notes |
|------|----------|-------------------|-------|
| Physical products | Amazon Associates | 1–10% | High trust, low rate |
| Digital products | Clickbank, Digistore24 | 30–75% | High rate, more variable quality |
| SaaS / software | Direct programs | 20–40% recurring | Requires product research |
| High-ticket digital | Clickbank, direct | $150–$500/sale | Low volume, high value |

**Strategic direction**: Start with Amazon for traffic learning and conversion data. Pivot toward digital products (Clickbank, Digistore24) as understanding of buyer intent improves. High-ticket digital is the long-term target.

## Why This Might Work

- Extremely low overhead (AI tools, hosting, affiliate fees — under $200/month to operate)
- Highly automatable: content creation, posting, link management all scriptable
- Uncorrelated with Signal risks (no platform dependency, no personal brand vulnerability)
- Proven model: millions of affiliate sites exist; the automation layer is the edge
- No expertise required to start: Amazon bestseller lists + review mining provide all the content angles needed

## Why This Might Fail

- **Platform policy changes**: Pinterest or Google can reduce affiliate link reach overnight
- **Affiliate program TOS changes**: Amazon has changed terms multiple times; Clickbank purges low-quality affiliates periodically
- **Algorithm shifts**: Pinterest and Google SEO rewards can disappear with algorithm updates
- **Content saturation**: If every niche is AI-content-flooded, differentiation erodes
- **Mitigation**: Diversify across multiple niches and multiple platforms; never depend on one traffic source

## Brand Isolation (Non-Negotiable)

Conduit operates as a completely separate entity:

- Different brand name (not connected to Signal, Surge, Atelier, Lullaby, or operator's real name)
- Different domain
- Different social handles across all platforms
- Different payment processor / bank account
- Different email address for affiliate program registrations
- No content cross-linking between Conduit and any other Polymath ecosystem

Violation of brand isolation damages Signal's authenticity and potentially creates legal exposure.

See [[safeguards/compliance]] for legal and platform compliance requirements.

## Build Sequence (When Activated)

### Phase 0 — Foundation (Weeks 1–2)
- Register brand name, purchase domain
- Set up Pinterest business account, claim website
- Set up blog (WordPress or Ghost on cheap hosting)
- Join Amazon Associates, Clickbank, Digistore24
- Set up separate payment processor and bank account
- Configure Make.com/n8n automation workspace
- Deploy Agent 01 (Product Scout) and Agent 04 (Link Manager)

### Phase 1 — Content Seeding (Weeks 3–6)
- Select 3 initial niches using [[brief/niche-selection]] matrix
- Deploy Agent 02 (Content Generator)
- Produce 60 pins and 6 blog posts per niche (batch generation)
- Deploy Agent 03 (Scheduler) at 5 pins/day cadence
- Deploy Agent 05 (Analytics) tracking baseline

### Phase 2 — Optimization (Months 2–3)
- Analyse CTR by niche, pin design, product type
- Kill niches scoring below 0.5% CTR at 500 impressions
- Double pin velocity on winning niches (ramp to 15–25/day)
- Begin Clickbank/Digistore24 product testing alongside Amazon
- Weekly batch review cycle active (~30 min/week human time)

### Phase 3 — Scale
- Expand winning niches to 3–5 boards each
- Launch Pinterest paid promotion on proven organic content
- Introduce SEO blog content for Google traffic
- Add high-ticket digital products to content mix
- Target: $500+/month net before increasing ad spend

## File Tree

```
ecosystems/conduit/
├── README.md                      ← this file
├── brief/
│   ├── niche-selection.md         ← niche evaluation framework
│   └── compliance.md              ← legal and platform rules
├── agents/
│   ├── README.md                  ← agent overview and build order
│   ├── 01-product-scout.md        ← finds and scores products
│   ├── 02-content-generator.md    ← creates pins, posts, blog content
│   ├── 03-scheduler.md            ← posts content on schedule
│   ├── 04-link-manager.md         ← manages and monitors affiliate links
│   └── 05-analytics.md            ← tracks performance and ROI
├── workflows/
│   ├── affiliate-pipeline.md      ← end-to-end automation flow
│   └── pinterest-growth.md        ← Pinterest-specific growth strategy
├── playbooks/
│   ├── affiliate-networks.md      ← network comparison and joining guide
│   └── pinterest-best-practices.md ← platform-specific tactics
├── safeguards/
│   └── compliance.md              ← hard rules, disclosure templates
├── assets/                        ← pin templates, brand kit (when activated)
├── calendar/                      ← seasonal content calendar (when activated)
└── analytics/                     ← performance data exports (when activated)
```
