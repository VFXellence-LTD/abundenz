# Skill: Niche Locker

```yaml
name: niche-locker
description: Evaluate a candidate niche against a weighted scoring matrix. Outputs a lock/test/reject decision with scored evidence.
triggers:
  - "Should we pursue [niche]?"
  - "Evaluate this niche"
  - "Score this opportunity"
  - "Is [topic/product] worth building?"
  - Before committing production resources to any new niche in any ecosystem
ecosystems: [atelier, signal, lullaby, conduit, surge]
```

---

## When to Use

Load this skill before committing to any niche across any Polymath ecosystem. A niche "feels good" is not sufficient. Run the matrix.

Use cases:
- Atelier: new product category evaluation
- Signal: new content angle or sub-topic to cover
- Lullaby: new story theme or age group
- Conduit: new affiliate product category
- Surge: new viral niche evaluation (weight RPM potential, AI automation compatibility, and short-form suitability heavily — a niche that scores well for long-form may score poorly for Surge if it cannot be condensed into sub-60-second hooks)

---

## The Matrix

Score each criterion 1-5. Total max = 30.

| # | Criterion | What it measures |
|---|-----------|-----------------|
| 1 | Market size | Buyer pool and search demand |
| 2 | Pain intensity | How much does the audience need this? |
| 3 | Competition quality | Can you realistically compete? |
| 4 | Monetization potential | Revenue ceiling per customer |
| 5 | Content automability | How much of production can be automated? |
| 6 | Audience affluence | Can buyers afford the product? |
| 7 | Platform risk | What happens if the main channel changes rules? |

---

## Scoring Rubric

### 1. Market size

| Score | Definition |
|-------|-----------|
| 5 | 100k+ monthly searches for primary keyword; large active buyer pool on target marketplace |
| 4 | 50-100k monthly searches; consistent buyer activity |
| 3 | 20-50k monthly searches; moderate but real market |
| 2 | 5-20k monthly searches; niche audience |
| 1 | <5k monthly searches; micro-niche or declining |

### 2. Pain intensity

| Score | Definition |
|-------|-----------|
| 5 | Buyers actively searching for solution; reviews of existing products express strong frustration with status quo |
| 4 | Clear unmet need; buyers articulate what's missing in 1-star reviews |
| 3 | Nice-to-have problem; buyers want it but current solutions are adequate |
| 2 | Mild preference; buyers would choose this if shown it but don't actively seek it |
| 1 | No evident pain; purely impulse or aspirational purchase |

### 3. Competition quality

| Score | Definition |
|-------|-----------|
| 5 | Top sellers are weak: <100 reviews, generic designs, poor listing optimization |
| 4 | Moderate competition; top sellers have 100-300 reviews but clear differentiation paths exist |
| 3 | Crowded; top sellers have 300-1000 reviews; requires strong niche positioning to stand out |
| 2 | Saturated; dominated by established brands or shops with 1000+ reviews |
| 1 | Owned market; single dominant player controls >50% of visible listings |

### 4. Monetization potential

| Score | Definition |
|-------|-----------|
| 5 | >$30 average order value OR recurring purchase potential OR high lifetime value |
| 4 | $15-30 average order; repeat purchase possible (e.g., seasonal, series) |
| 3 | $8-15 average order; single purchase likely |
| 2 | $4-8 average order; very high volume required for meaningful revenue |
| 1 | <$4 average order; commodity pricing, margin-destroying |

### 5. Content automability

| Score | Definition |
|-------|-----------|
| 5 | Entire production pipeline automatable with AI; zero specialized skill required |
| 4 | >80% automatable; minor human curation step only |
| 3 | 50-80% automatable; meaningful human input required for quality |
| 2 | 20-50% automatable; significant human skill or time investment per unit |
| 1 | <20% automatable; requires sustained specialist effort |

### 6. Audience affluence

| Score | Definition |
|-------|-----------|
| 5 | High-income audience willing to pay premium; price insensitive within reason |
| 4 | Middle-income; appreciates quality and will pay fair price without heavy promotion |
| 3 | Mixed income; price-sensitive segment is significant |
| 2 | Budget-conscious audience; heavy competition on price |
| 1 | Audience actively seeks free alternatives; will not pay |

### 7. Platform risk

| Score | Definition |
|-------|-----------|
| 5 | Multi-platform viable; no single platform dependency; own distribution possible |
| 4 | 2-3 viable platforms; primary platform has stable, clear policies |
| 3 | Primarily 1 platform; platform policies are stable but could change |
| 2 | Platform has recent policy uncertainty in this category; precedent of content removal |
| 1 | Platform actively restricting this content category; ban risk within 12 months |

---

## Decision Thresholds

| Total score | Decision | Action |
|-------------|----------|--------|
| ≥ 28 | LOCK | Commit; begin full production pipeline |
| 22-27 | TEST | Produce 20-30 units / 4-6 pieces of content; review after 60 days |
| 16-21 | WATCH | Document; re-evaluate in 90 days; conditions may improve |
| < 16 | REJECT | Log reason; do not revisit unless fundamental conditions change |

---

## How to Run

Paste this into Claude with your candidate niche:

```
Using the Niche Locker skill, evaluate this niche: [NICHE DESCRIPTION]

Target ecosystem: [Atelier / Signal / Lullaby / Conduit]
Target marketplace(s): [Etsy / KDP / Redbubble / YouTube / etc.]
Available evidence: [paste keyword data, competitor data, any research you have]

Score each of the 7 criteria 1-5 with a one-sentence justification.
Total the score.
State decision: LOCK / TEST / WATCH / REJECT.
Flag any criteria where you have low confidence due to missing data.
Recommend what data would change the score most.
```

---

## Example: "VFX Pipeline Engineering" scored for Signal ecosystem

Niche: Educational content about Python scripting and pipeline development for VFX studios

Target ecosystem: Signal
Target marketplace: YouTube (primary), blog/newsletter (secondary)

| Criterion | Score | Justification |
|-----------|-------|---------------|
| Market size | 2 | Highly specialized audience; estimated <10k monthly searches for core terms; VFX is a small industry globally |
| Pain intensity | 5 | Pipeline TDs and technical artists have extremely high pain; bad tools cost studios thousands per day; very few good free resources exist |
| Competition quality | 5 | Almost no dedicated VFX pipeline YouTube channels; existing content is scattered, outdated, or academic |
| Monetization potential | 5 | Audience earns $80-200k+/year; willing to pay for courses, tools, consulting; high LTV |
| Content automability | 1 | Content requires deep specialist expertise; cannot be automated; Signal founder IS the expert |
| Audience affluence | 5 | Technical artists and pipeline TDs are well-compensated; studios pay for good tooling |
| Platform risk | 4 | YouTube has stable policies for educational content; risk is algorithm changes not bans |

**Total: 27 — TEST**

*Note: The low automability score (1) is not a flaw for Signal — Signal is the authentic-voice ecosystem where the expert does the work. The matrix is correctly identifying that this is not a commodity content play, which is appropriate for Signal.*

*Platform risk would drop to 3 if the only channel were YouTube; building email list + blog mitigates this.*

---

## Related Documents

- [[ecosystems/atelier/brief/product-niches]] — Atelier niche evaluations
- [[ecosystems/signal/brief/content-strategy]] — Signal niche decisions
- [[skills/review-miner/SKILL]] — gather evidence for pain intensity score
