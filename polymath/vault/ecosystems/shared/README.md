# Ecosystems — Shared Systems

Global agents, workflows, platform configs, and compliance rules used across multiple ecosystems. Lives here to avoid duplication — each ecosystem imports from shared rather than maintaining its own copy.

## What goes here vs. ecosystem-level shared/

| Location | Scope | Example |
|----------|-------|---------|
| `ecosystems/shared/` | Used by 2+ ecosystems | Analytics agent, Pinterest strategy, SEO optimizer, trend scanner |
| `ecosystems/content/shared/` | Content ecosystem only | Atomizer agent, content calendar workflow |
| `ecosystems/viral/shared/` | Viral ecosystem only | Script engine, clip factory, surge formula |
| `ecosystems/products/shared/` | Products ecosystem only | Design generator, listing optimizer |
| `ecosystems/affiliate/shared/` | Affiliate ecosystem only | Product scout, link manager |

## What goes here vs. vault-root shared/

| Location | Scope | Example |
|----------|-------|---------|
| `_passive_income/shared/` | Governance, policies, skills | Brand isolation, polymath-pitfalls, niche-locker |
| `ecosystems/shared/` | Operational systems | Agents, workflows, platform configs, compliance |

Rule: if it governs decision-making, it lives at vault root. If it does work, it lives here.

## Directory

```
shared/
├── agents/              ← agents shared across ecosystems
│   ├── analytics.md     ← revenue/performance tracking (all ecosystems)
│   ├── seo-optimizer.md ← search optimization (content blog, product listings, affiliate blog)
│   ├── image-generator.md ← thumbnails, product designs, pins (all ecosystems)
│   ├── scheduler.md     ← cross-platform posting/publishing (all ecosystems)
│   ├── trend-scanner.md ← cross-ecosystem trend detection (feeds Content + Viral)
│   └── research-analyst.md ← deep research intelligence: niches, formats, products, opportunities (feeds ALL ecosystems)
├── workflows/
│   ├── revenue-tracking.md     ← transaction logging, P&L, tax categorization
│   ├── pinterest-pipeline.md   ← Pinterest used by all 3 ecosystems differently
│   └── content-to-product.md   ← how content authority feeds product/affiliate sales
├── platforms/
│   ├── pinterest.md     ← shared Pinterest strategy (traffic, pins, SEO)
│   ├── youtube.md       ← primarily Content, could serve Products (tutorials)
│   ├── instagram.md     ← Content + Products promotion
│   └── tiktok.md        ← Content primarily, Products promotion secondary
└── compliance/
    ├── ftc-disclosure.md      ← affiliate + sponsored content disclosure rules
    ├── tax-categories.md      ← income categorization per ecosystem for Schedule C
    ├── platform-policies.md   ← AI content policies across all marketplaces
    └── ai-content-disclosure.md ← per-platform AI-generated content labeling (critical for Viral/Surge)
```
