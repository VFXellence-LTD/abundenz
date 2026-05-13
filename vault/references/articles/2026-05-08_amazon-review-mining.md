# Amazon Review Mining

**Source:** Operator's reference research (transcribed reel)
**Captured:** 2026-05-08
**Ecosystem fit:** conduit | atelier | shared/skills
**Status:** Applied — being built as shared skill

---

## The technique

Use AI to analyze 3-5 pages of 5-star Amazon reviews for a product in your niche. Extract the top buying motivations — the specific language, emotional triggers, and specific outcomes buyers describe. Use those exact phrases and angles in marketing copy.

The insight: buyers' own words are the most persuasive copy you can write. They describe the product in terms of the outcomes they experienced, not the features they purchased.

**Process:**
1. Navigate to a product page in your target niche
2. Sort reviews by "Top rated" or "Most recent"
3. Read or scrape 3-5 pages of 5-star reviews
4. Feed to Claude: "Extract the top 5-10 buying motivations from these reviews. Quote directly where possible. Group by emotional theme."
5. Use the extracted motivations as Pinterest pin headlines, affiliate landing page copy, and product description angles

## Where it fits in polymath

- **Shared skill (`shared/skills/review-miner/`)**: Being implemented by another agent. The technique is niche-agnostic — applies to any product Conduit promotes or any Atelier listing being optimized.
- **Conduit agent 01 (Product Research)**: Review mining feeds product selection and pin copy generation. If reviews are weak or thin, the product likely won't convert.
- **Atelier listing optimization**: Same technique applied to competitor listings on Etsy, Gumroad, or Payhip when Atelier activates.

## Why it works

5-star reviewers are self-selected buyers who got what they wanted. They describe the product's value in the emotional language that convinced other buyers. AI-generated copy that doesn't match this language sounds generic; copy built from review mining sounds like it was written by the buyer's peer.

## Verdict

Applied — being built as shared skill. See `shared/skills/review-miner/` (in progress by another agent).
