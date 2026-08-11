# Skill: Review Miner

```yaml
name: review-miner
description: Extract and analyze product reviews to identify buying motivations, objections, and marketing angles. Outputs a structured brief for listing copy and content.
triggers:
  - "Mine reviews for [product/URL]"
  - "Analyze reviews for [product category]"
  - "What are buyers saying about [product]?"
  - Before writing listing copy for any Atelier product
  - Before writing affiliate content for any Conduit product
  - Before creating Signal content covering a specific tool or product
ecosystems: [atelier, conduit, signal, surge, lullaby]
```

---

## When to Use

Run before writing any product-related copy. Buyer language in reviews is the best source of:
- Exact phrases buyers use to describe their problem (use these verbatim in copy)
- The real reason people buy (often different from what sellers assume)
- Objections that kill sales (address them preemptively in listing copy)
- Gaps the current product has (what the next product should fix)

---

## Inputs

- Product URL (Amazon, Etsy, or any product page with reviews)
- Review count target: pull minimum 20 five-star and 20 one-star reviews
- Context: what are you using this analysis for? (listing copy, affiliate copy, content angle)

---

## Outputs

`review_analysis_[product-slug].md` with:

1. Top 5 buying motivations (why people love this)
2. Top 5 objections / disappointments (why people don't buy or are unhappy)
3. Exact buyer language snippets (direct quotes useful for copy)
4. Recommended marketing angles (2-3 based on analysis)
5. Copy snippets (ready to use in listing or affiliate content)

---

## Data Collection

**For Amazon products:**

Option A (manual): Go to product page → click reviews → filter by 5 stars → copy 20 reviews; repeat for 1 star.

Option B (automated): Use Playwright or a scraper to collect review text:
```javascript
// Playwright snippet — collect review text
const reviews = await page.$$eval('[data-hook="review-body"] span', 
  elements => elements.map(el => el.textContent.trim())
);
```

Option C (API): Amazon Product Advertising API does not expose review text. Use Rainforest API ($49+/mo) or similar for programmatic access.

**For Etsy products:**

- Etsy reviews are on product page — scrape via Playwright or Etsy API (reviews endpoint if available)
- Filter: 5-star and 1-star; aim for 20 of each

---

## Review Analysis Prompt

This is the core prompt. Paste into Claude with collected review text.

```
You are a direct-response copywriter analyzing customer reviews to build a marketing brief.

PRODUCT: {{PRODUCT_NAME}}
PRODUCT CATEGORY: {{CATEGORY}}
USAGE CONTEXT: {{LISTING_COPY / AFFILIATE_COPY / CONTENT_ANGLE}}

FIVE-STAR REVIEWS ({{COUNT}} reviews):
{{FIVE_STAR_REVIEW_TEXT}}

ONE-STAR REVIEWS ({{COUNT}} reviews):
{{ONE_STAR_REVIEW_TEXT}}

Analyze these reviews and output the following:

## 1. TOP BUYING MOTIVATIONS
List the top 5 reasons people buy and love this product.
For each:
- Motivation statement (what they're really buying)
- Frequency (how many reviews mention this — approximate %)
- Direct quote that best expresses this motivation

## 2. TOP OBJECTIONS AND DISAPPOINTMENTS
List the top 5 complaints or reasons for dissatisfaction.
For each:
- Objection statement
- Frequency (approximate %)
- Direct quote that best expresses this complaint
- Copy implication (how to preemptively address this in listing copy)

## 3. BUYER LANGUAGE (VERBATIM PHRASES)
List 10 exact phrases buyers use that a copywriter could borrow.
These should be specific, vivid phrases — not generic ("great product") but specific ("finally stopped the morning chaos").

## 4. RECOMMENDED MARKETING ANGLES
Based on the motivations and objections, suggest 3 marketing angles:
- Angle 1: Pain-focused (leads with the problem)
- Angle 2: Outcome-focused (leads with transformation)
- Angle 3: Differentiation-focused (leads with what this has that competitors lack)

For each angle: headline (10-12 words), one-sentence opening line for listing or ad copy.

## 5. COPY SNIPPETS (READY TO USE)
Write 3 short copy blocks (2-3 sentences each) that could be used in:
- Etsy listing description opening paragraph
- Affiliate email or blog paragraph
- Social media caption (under 150 words)

Use buyer language from the reviews. Do not invent claims not supported by reviews.
```

---

## Example Output

**Product:** Adult coloring book, botanical theme, Amazon bestseller

**Top Buying Motivations:**
1. Stress relief / mindfulness (68% of 5-star reviews) — "First time I've been able to turn my brain off in months"
2. Quality of line art (52%) — "Lines are crisp and don't bleed through"
3. Gift purchase — well-received (44%) — "She cried when she opened it, in a good way"
4. Level of detail — challenging but achievable (38%) — "Complex enough to keep me engaged for hours"
5. Paper quality (29%) — "Thick enough for markers without bleed-through"

**Top Objections:**
1. Too few pages for price (22% of 1-star) — Copy implication: prominently state page count; consider increasing
2. Designs too similar / repetitive (18%) — Copy implication: emphasize variety in preview images
3. Binding falls apart (14%) — Copy implication: if this is KDP issue, switch to spiral binding or coil-bound alternative
4. Colors bleed through (11%) — Copy implication: explicitly state paper weight and marker compatibility
5. Arrived damaged (9%) — Not a product issue; fulfillment/packaging concern

**Recommended Angles:**
- Pain: "Your brain won't stop. This will."
- Outcome: "100 pages of detail fine enough to keep you focused for hours — without looking at your phone once."
- Differentiation: "72 designs across 6 botanical themes, printed on 90gsm paper that handles markers and colored pencils."

---

## Using the Output

**For Atelier listing copy:**
- Open the listing optimizer with the review analysis brief as context
- Use exact buyer language in the description
- Address top 2-3 objections preemptively ("120gsm paper, no bleed-through with alcohol markers")
- Lead with top motivation in opening line

**For Conduit affiliate copy:**
- Open with pain angle from the analysis
- Use buyer language in the product endorsement paragraph
- Address objections as reassurances ("The one complaint about similar books is paper quality — this one uses 90gsm, so yes, your Copics are fine")

**For Signal content:**
- Top buying motivations reveal what the audience actually cares about
- Objections reveal what existing solutions don't deliver → content angle opportunity
- Buyer language is vocabulary research — these are the words the audience uses

---

## Batch Review Mining

For Atelier niche validation (before committing to production):

1. Find top 5 sellers in target niche
2. Mine reviews for all 5
3. Aggregate: what patterns appear across multiple products?
4. Gaps that appear in multiple products' 1-star reviews = product opportunity

Run review analysis prompt for each product separately, then run a synthesis:

```
Here are review analyses for 5 products in [NICHE]:
{{ANALYSIS_1}} {{ANALYSIS_2}} {{ANALYSIS_3}} {{ANALYSIS_4}} {{ANALYSIS_5}}

Identify:
1. Shared top motivations (appear in 3+ of 5 analyses) — these are the real reasons people buy in this niche
2. Shared top complaints (appear in 3+ of 5) — these are systematic category failures; address all of them in a new product
3. Any complaint unique to 1-2 products — potential product-specific weakness; competitor vulnerability
4. Vocabulary patterns — what words and phrases appear repeatedly across all 5? These are the niche's native language.

Output a single "niche brief" summarizing what a new product in this category must deliver.
```

---

## Related Documents

- [[prompts/review-analysis]] — the standalone prompt for review analysis (same core prompt, usable without this skill context)
- [[skills/niche-locker/SKILL]] — review mining informs pain intensity score
- [[ecosystems/atelier/agents/03-listing-optimizer]] — uses review analysis output for copy
