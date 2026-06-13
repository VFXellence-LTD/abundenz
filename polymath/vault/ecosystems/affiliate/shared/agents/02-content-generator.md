# Agent 02 — Content Generator

Creates all content assets for Conduit. Operates in batch mode, producing a week's worth of content in a single run. Consumes product cards from [[01-product-scout]] and validated links from [[04-link-manager]].

---

## Responsibility

- Generate Pinterest pin images and copy (batch: 10–20 pins per product)
- Generate blog posts (1 post per product, 1500–2000 words)
- Generate supplementary short-form social copy (optional, Phase 2+)
- Use review-mined buyer language from product cards for all copy
- Never generate misleading claims, fake reviews, or prohibited content (see [[safeguards/compliance]])

---

## Input

A completed product card from Agent 01:
- Product name, ASIN/ID, category, niche
- Buying triggers, transformation phrases, objections, power words, hook
- Validated affiliate link from Agent 04

---

## Output

Per product, per run:
- 10–20 Pinterest pins (image + title + description per pin)
- 1 blog post (full HTML or Markdown)
- Optional: 5 short-form social captions (Phase 2)

All content deposited to a staging area (Google Drive folder or CMS draft status) for human review before Scheduler picks it up.

---

## Pinterest Pin Generation

### Pin Design Principles
- Vertical format: 1000 × 1500 px (2:3 ratio)
- Clean, uncluttered design
- Text overlay with single benefit or hook statement (max 8 words on image)
- Brand colour and font consistent across all pins in a niche
- No stock photos that look like stock photos — use product images or simple graphic designs
- No faces unless absolutely necessary

### Pin Variants per Product

For each product, generate 10–20 pins covering different angles:

| Variant | Angle | Description |
|---------|-------|-------------|
| A | Hook | Image + the one-sentence hook from product card |
| B | Top 3 benefits | "3 reasons [PRODUCT] is the best [CATEGORY] pick" |
| C | Problem/Solution | "Tired of [FEARED ALTERNATIVE]? There's a better way." |
| D | Transformation | A before/after framing using transformation phrases |
| E | Buyer quote | Pull a real review snippet (attributed as "buyer review") |
| F | Objection handling | Address the top objection directly |
| G | Use case 1 | Specific scenario where product shines |
| H | Use case 2 | Different specific scenario |
| I | Comparison | "[PRODUCT] vs. [generic alternative]" — position product |
| J | Gift angle | "[PRODUCT]: the [CATEGORY] gift they actually want" |

### Image Generation

**Option 1: Canva API**
Use Canva's template API. Create a base template per niche board. Inject: product image, text overlay, niche colour palette.

API flow:
```
POST /v1/designs
{
  "design_type_id": "custom",
  "width": 1000,
  "height": 1500
}
→ design_id

POST /v1/designs/{design_id}/pages/{page_id}/elements
→ inject product image URL, text elements

POST /v1/exports
{
  "design_id": "...",
  "format": "png"
}
→ download_url
```

**Option 2: DALL-E or Midjourney**
For lifestyle imagery. Use product name + styling prompt. Reserved for Phase 2 when budgets are confirmed.

**Option 3: Template + PIL/Pillow (cheapest)**
Pre-built static templates per niche. Python script fills in text overlays using PIL. Zero API cost. Less visually polished — acceptable for validation phase.

---

## Pin Copy Generation Prompt

For each pin variant, call Claude with:

```
You are writing Pinterest content for an affiliate product recommendation.

Product: [PRODUCT NAME]
Category: [CATEGORY]
Niche: [NICHE]
Affiliate disclosure: Required in description

Buyer insights (use this language):
- Buying triggers: [LIST FROM PRODUCT CARD]
- Transformation phrases: [LIST]
- Power words: [LIST]
- Hook: [HOOK FROM PRODUCT CARD]

Write a Pinterest pin for the "[VARIANT]" angle.

Output:
1. PIN TITLE (max 100 characters, keyword-first, benefit-driven)
2. PIN DESCRIPTION (max 500 characters):
   - Start with a relevant keyword phrase
   - State the core benefit in buyer language
   - Include 1–2 specific details
   - End with a clear call to action
   - Final line: "Affiliate link — I earn a small commission if you purchase."
3. IMAGE TEXT OVERLAY (max 8 words, punchy, benefit-first)

Tone: Direct, genuine, helpful. No hype, no exaggeration. Write as if recommending to a friend who asked.
Do not fabricate features or claims not supported by the buyer review data provided.
```

---

## Blog Post Generation

Blog posts serve Google SEO traffic. Target: 1500–2000 words, structured for a buying-intent search query.

### Blog Post Structure

```
[H1] Best [PRODUCT CATEGORY] in [YEAR]: [Top Pick] and What to Look For

[Affiliate disclosure block — see safeguards/compliance]

[Introduction — 150 words]
What problem does the buyer have? Acknowledge it. State what this post will help them decide.

[H2] Our Top Pick: [PRODUCT NAME]
[200 words] — lead with the hook, use transformation phrases, state 3 top benefits.
[CTA button: affiliate link]

[H2] Why We Recommend It
[300 words] — expand on top 3 buying triggers from review mining.

[H2] What Buyers Are Saying
[200 words] — paraphrase real buyer language (do not fabricate). Credit as "buyer reviews from Amazon".

[H2] Common Concerns Addressed
[200 words] — address top 2–3 objections from review mining. Be honest.

[H2] How It Compares
[300 words] — compare to the generic alternative or next best option. Keep it factual.

[H2] Who Is This For?
[150 words] — describe the specific buyer persona who will love this product.

[H2] Who Should Look Elsewhere
[150 words] — honestly describe who might not be served by this product.

[H2] Final Verdict
[100 words] — clear recommendation. Affiliate link.

[Affiliate disclosure reminder at bottom]
```

### Blog Post Generation Prompt

```
You are writing a long-form affiliate product review article. This will be published on a product recommendation blog.

Product: [PRODUCT NAME]
Category: [CATEGORY]  
Target keyword: [PRIMARY KEYWORD] (e.g. "best home office chair under $300")
Word count target: 1500–2000 words
Affiliate link: [LINK] (to be placed at top recommendation CTA and final verdict)

Buyer insights (base all claims on this data — do not fabricate):
- Buying triggers: [LIST]
- Feared alternatives: [LIST]
- Transformation phrases: [LIST]
- Objections: [LIST]
- Power words: [LIST]
- Hook: [HOOK]

Follow this structure:
[PASTE STRUCTURE FROM ABOVE]

Rules:
- All product claims must be derivable from the buyer review data provided
- Do not make health claims, income claims, or superlative claims without specific evidence
- Include affiliate disclosure as first element after H1 and as final element before close
- Disclosure text: "Disclosure: This article contains affiliate links. If you purchase through these links, I earn a small commission at no additional cost to you."
- Write naturally — avoid listicle padding. Each section should add genuine value.
- Target keyword should appear in H1, first paragraph, one subheading, and naturally 3–5 times in body.
```

---

## Short-Form Social Copy (Phase 2)

For supplementary traffic from Instagram or TikTok. Generate 5 captions per product:

```
You are writing short social media captions for a product recommendation.

Product: [PRODUCT NAME]
Platform: [Instagram / TikTok]
Buyer insights: [BUYING TRIGGERS, POWER WORDS, HOOK]

Write 5 captions, each 100–200 characters including hashtags.
Each must end with: "Link in bio. [Affiliate]"
Vary the angle: hook, benefit, transformation, use case, question.
No fabricated claims. No hype language.
```

---

## Content Staging and Handoff

All generated content goes to a staging folder before posting:

```
/staging/
  /pending-review/
    [YYYY-MM-DD]/
      pins/
        [product-slug]-variant-A.png
        [product-slug]-variant-A.txt   ← title + description
        [product-slug]-variant-B.png
        ...
      blog/
        [product-slug].md
  /approved/
    [content approved in weekly review]
  /rejected/
    [content flagged in weekly review]
```

Scheduler picks only from `/approved/`. Human review occurs weekly (approx 15 minutes) to scan `/pending-review/` and move items.

---

## Content Rules (Hard Stops)

The generator must refuse to produce content that:
- Makes claims not grounded in the product card data
- Claims the writer has personally tested the product
- Uses fake buyer testimonials (fabricated quotes attributed to named individuals)
- Promotes products in anti-niches (see [[brief/niche-selection]])
- Omits FTC affiliate disclosure
- Makes income claims ("this product helped me make $10K/month")
- Makes disease or health cure claims

---

## Failure Handling

| Failure | Action |
|---------|--------|
| Claude API unavailable | Queue products for generation, retry in 2 hours |
| Canva API returns error | Fall back to template + PIL for images |
| Product card missing required fields | Skip product, log error, flag for Scout to complete |
| Generated content flagged by internal filter | Route to rejected folder, log reason |
