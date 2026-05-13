# Polymath

> `D:\dev\_passive_income` — Obsidian vault governing AI-driven passive income businesses.

The brain of the business. Multi-ecosystem AI automation system designed to diversify income streams across **independent business models** that should not share an audience, voice, or brand.

**For the Claude Code operating guide, see `CLAUDE.md`.** This README is the human-readable overview.

## Mental model

```
_passive_income/
├── CLAUDE.md          ← Claude Code operating guide (analogous to _canon/CLAUDE.md)
├── README.md          ← this file
├── MAP.md             ← visual directory map
├── controller/        ← oversight layer (budget, schedule, analytics across all ecosystems)
├── ecosystems/
│   ├── signal/        ← authentic-voice content business (Operation Signal)
│   ├── viral/         ← high-volume AI short-form content (Surge — anonymous, RPM-optimized)
│   ├── atelier/       ← AI-generated visual product business (commodity volume)
│   ├── lullaby/       ← bedtime story narration business (kids audience)
│   └── conduit/       ← anonymous affiliate income (Pinterest + digital products)
├── shared/
│   ├── tools/         ← active tool registry
│   ├── prompts/       ← reusable utility prompts
│   ├── brand-isolation/   ← inter-ecosystem rules
│   └── skills/        ← decision-support skills (e.g., polymath-pitfalls)
└── references/        ← R&D inbox feeding all ecosystems
```

The controller is **oversight, not orchestration**. Each ecosystem has its own internal orchestrator and its own agents. The controller watches budget burn, posting cadence, and revenue across all of them, and surfaces decisions that need human attention. It does not move content between ecosystems — that's forbidden by the brand isolation policy (see `shared/brand-isolation/`).

## Why multiple ecosystems instead of one

Signal, Atelier, and Lullaby have **incompatible core theses** and serve **different audiences**:

| Axis | Signal | Surge | Atelier | Lullaby | Conduit |
|---|---|---|---|---|---|
| Moat | Real human voice | Pipeline speed + scale | Volume + speed | Voice + warmth for kids | Product selection + anonymity |
| Audience | Adults, niche-specific | Mass-market entertainment | Buyers (anonymous) | Parents + kids | Buyers (anonymous) |
| Differentiation | Taste, narrative | Retention optimization + volume | Throughput | Trustable for child use | Curation, no personal brand |
| Failure if blended | Audience betrayed | Signal credibility destroyed | Volume diluted | IP/safety nightmare | Anonymity destroyed |
| Platform risk | Algorithm change | Creator fund policy change | Marketplace policy | Kids-content regulation | Pinterest policy / FTC |

Running them as one brand poisons all four. Running them as fully separate businesses with no shared identity diversifies platform risk *and* business-model risk while letting the controller handle shared infrastructure.

## Why diversify at all

If 100% of revenue depends on one platform's algorithm + one content thesis, a single policy change can take everything to zero. The four ecosystems fail for different reasons:
- Signal fails if YouTube/TikTok demonetize, audience taste shifts, or burnout hits.
- Surge fails if creator fund payouts drop, platforms restrict AI content, or algorithms penalize volume accounts.
- Atelier fails if Etsy/POD platforms tighten AI rules, or commodity AI art prices collapse.
- Lullaby fails if kids-content regulation tightens or the family dynamic changes.
- Conduit fails if Pinterest restricts affiliate links or the primary affiliate network terminates the account.

These are **uncorrelated risks**. That is the entire reason to run them in parallel.

## Hard rules

1. **No shared identity.** Different brand names, different domains, different social handles, different payment processors where practical. Documented in `shared/brand-isolation/POLICY.md`.
2. **No cross-promotion between ecosystems.** Signal does not link to Atelier products. Atelier does not mention Signal.
3. **Each ecosystem has its own kill switch.** If one starts hurting the other (reputational risk, time drain, brand bleed), it can be shut down independently without touching the other.
4. **The controller never edits ecosystem content.** It can pause posting, freeze budget, or escalate to you. It does not write or publish.
5. **One ecosystem at full strength before adding a second.** Atelier does not begin until Signal is reliably in Phase 2 (Operation Signal §1.1). This rule exists because most operators die from splitting attention, not from lack of opportunity.

## Build sequence

- **Active now:** Signal + Surge build in parallel (Boss override 2026-05-13). Signal = authentic voice, deep technical content. Surge = AI-generated short-form, anonymous, RPM-optimized. These serve different audiences with different tools.
- **Atelier, Lullaby, Conduit** remain parked until at least one active ecosystem reaches Phase 2.
- **Month 9 checkpoint:** Are Signal AND Surge each generating revenue? If yes, choose ONE additional ecosystem. If no, fix the underperformer.
- **Choosing the third ecosystem:** Conduit has the lowest personal-time overhead. Lullaby has the strongest comparative advantage but heaviest legal overhead. Atelier has lower personal involvement but requires creative setup.
- **Months 10-15:** Third ecosystem ramps. Signal + Surge continue. All other ecosystems stay parked.

Revised rule: Content (Signal) and Viral (Surge) may build in parallel because they share zero audience overlap and have fundamentally different production pipelines. All other expansion follows the original gating logic.

## Where things live

- **Wondering where to put a tool reference?** `references/tools/` if it's a candidate; `shared/tools/` once an ecosystem actually uses it; the ecosystem's own `agents/` if it's wired into a specific agent.
- **Wondering where to put a workflow idea?** `references/` until it has a real role; then either `ecosystems/{name}/workflows/` or, if both ecosystems will use it, `shared/prompts/`.
- **Wondering where to put a creator you're tracking?** `references/creators/` always. They feed both ecosystems' R&D.

## Relationship to Canon

This vault mirrors `_canon` (`D:\dev\_canon`) — same governance pattern, different domain. Canon controls code dev; Polymath controls business ops. See `CLAUDE.md` for the formal relationship and boundaries.
