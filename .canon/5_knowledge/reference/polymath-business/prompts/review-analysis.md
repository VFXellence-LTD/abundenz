# Prompt: Review Analysis

**Purpose:** Analyze a batch of product reviews to extract buying motivations, objections, buyer language, and marketing copy angles.

**Used by:** Atelier (listing copy optimization), Conduit (affiliate content and ad copy), Signal (product mention copy)

**Note:** This is the core prompt used by the [[skills/review-miner/SKILL]] skill. Use the skill for the full workflow including data collection. Use this prompt directly if you've already gathered review text.

---

## Core Prompt

```
You are a direct-response copywriter analyzing customer reviews to build a marketing brief.

PRODUCT NAME: {{PRODUCT_NAME}}
PRODUCT CATEGORY: {{CATEGORY}}
MARKETPLACE: {{Amazon / Etsy / Other}}
USAGE CONTEXT: {{listing copy / affiliate copy / content angle / niche validation}}

FIVE-STAR REVIEWS ({{COUNT}}):
{{PASTE 5-STAR REVIEW TEXT}}

ONE-STAR REVIEWS ({{COUNT}}):
{{PASTE 1-STAR REVIEW TEXT}}

---

Analyze and output the following:

## 1. TOP BUYING MOTIVATIONS (5)

List the top 5 reasons people love this product.

For each:
**Motivation:** [What they're really buying — the outcome, not the feature]
**Frequency:** Approximately {{X}}% of positive reviews mention this
**Best quote:** "[Direct verbatim quote from a review that best captures this motivation]"

---

## 2. TOP OBJECTIONS AND DISAPPOINTMENTS (5)

List the top 5 complaints or sources of dissatisfaction.

For each:
**Objection:** [What disappointed them]
**Frequency:** Approximately {{X}}% of negative reviews mention this
**Best quote:** "[Direct verbatim quote]"
**Copy implication:** [One sentence: how a seller should address this preemptively in listing copy]

---

## 3. BUYER LANGUAGE (10 verbatim phrases)

Exact phrases buyers used that are unusually specific, vivid, or memorable. These are phrases a copywriter could borrow.

Skip generic praise ("great product", "exactly as described"). Find:
- Phrases that name the specific problem ("I'd been searching for something that didn't look cheesy")
- Outcome statements ("my desk finally looks like an adult lives here")
- Surprise expressions ("I didn't expect it to work this well")
- Identity statements ("perfect for someone like me who...")

List each phrase with the context it came from (5-star or 1-star).

---

## 4. MARKETING ANGLES (3)

Based on the analysis, suggest 3 distinct marketing angles:

**Angle A — Pain-focused:**
Leads with the problem the buyer had before this product.
Headline (10-12 words): "..."
Opening line: "..."

**Angle B — Outcome-focused:**
Leads with the transformation or result.
Headline (10-12 words): "..."
Opening line: "..."

**Angle C — Differentiation-focused:**
Leads with what this product has that competitors don't (or what competitors consistently fail at, based on 1-star reviews of those products).
Headline (10-12 words): "..."
Opening line: "..."

---

## 5. READY-TO-USE COPY BLOCKS (3)

Write 3 copy blocks using buyer language from the reviews. Each is 2-4 sentences.

**Copy Block 1 — Etsy listing opening paragraph:**
[Write as if opening the product description. Use buyer language. Do not claim benefits not evidenced in reviews.]

**Copy Block 2 — Affiliate email or blog paragraph:**
[Recommendation framing. 3-4 sentences. Use buyer language. Honest about what it is.]

**Copy Block 3 — Social media caption (under 150 words):**
[Could be Pinterest pin description, Instagram caption, X post. Platform-agnostic copy.]

---

## 6. CATEGORY GAPS (if this is a niche validation analysis)

Only include this section if usage context is "niche validation".

Based on the 1-star reviews and stated disappointments, what does a BETTER product in this category need to deliver?

List 3-5 specific product requirements implied by the reviews:
- [Requirement]: because {{X}}% of buyers complained about [ISSUE]
```

---

## Batch Analysis Prompt (Niche Validation — Multiple Products)

Use when mining reviews across multiple products to validate an entire niche:

```
You are validating a product niche by analyzing reviews across multiple competing products.

NICHE: {{NICHE_NAME}}
MARKETPLACE: {{Amazon / Etsy}}

PRODUCT 1: {{NAME}}
Five-star reviews: {{TEXT}}
One-star reviews: {{TEXT}}

PRODUCT 2: {{NAME}}
Five-star reviews: {{TEXT}}
One-star reviews: {{TEXT}}

[REPEAT FOR EACH PRODUCT — up to 5]

---

Synthesize across all products:

## SHARED BUYING MOTIVATIONS (appear in 3+ of the products)
These are the real reasons people buy in this niche — consistent across sellers.

## SYSTEMATIC CATEGORY FAILURES (complaints in 3+ of the products)
These are not one seller's failures — they are category-wide weaknesses.
A new product that addresses these is differentiated from the start.

## COMPETITOR-SPECIFIC WEAKNESSES (unique to 1-2 products)
These are vulnerabilities in specific competitors. Useful for positioning.

## NATIVE VOCABULARY OF THIS NICHE
Words and phrases buyers actually use when talking about this product category.
These are the SEO terms and copy language for any product in this space.

## PRODUCT SPEC REQUIREMENTS
What must a new product in this category deliver to avoid the most common complaints?
Minimum 5 specific requirements, each supported by evidence from the reviews.

## NICHE VALIDATION SUMMARY
Based on this analysis:
- Is there a real buying problem that existing products fail to fully solve? (YES / PARTIALLY / NO)
- Is the buyer language specific and vivid? (indicator of high pain intensity)
- What would a category-defining product in this niche deliver that no current top seller does?
```

---

## Output Usage Guide

**For Atelier [[ecosystems/atelier/agents/03-listing-optimizer]]:**
- Feed the "Top Buying Motivations" and "Buyer Language" into the listing copy prompt
- Use "Copy Block 1" as starting point for Etsy description opening
- Use "Objections" to write preemptive reassurances in listing description and FAQ

**For Conduit affiliate copy:**
- Use "Angle A" (pain-focused) as the article or email opening
- Use "Copy Block 2" as the product recommendation paragraph
- Address top 2 objections as "potential downsides" in a balanced review format (builds trust)

**For Signal content:**
- Buyer language reveals what words the audience uses — write content with these terms for organic search
- Category gaps are content opportunities ("Why most [products] in this category disappoint, and what to look for instead")

---

## Related Documents

- [[skills/review-miner/SKILL]] — full workflow including data collection
- [[prompts/product-description]] — applies analysis output to listing copy
- [[ecosystems/atelier/agents/03-listing-optimizer]] — automated listing workflow using this analysis
