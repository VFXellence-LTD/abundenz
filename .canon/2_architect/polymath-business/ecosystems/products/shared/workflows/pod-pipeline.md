# Atelier Workflow: Print-on-Demand Pipeline

Status: PARKED — ready to execute when Atelier activates.

---

## Pipeline Overview

```
[01 Niche Researcher] → trending design category + target audience
         ↓
[02 Design Generator] → product artwork at POD specs
         ↓
[03 Listing Optimizer] → mockup images + listing copy
         ↓
[HUMAN REVIEW GATE] → quality check + IP scan, 5-10 min per batch
         ↓
[04 Publisher] → upload to Printful; connect to Etsy/Shopify listing
         ↓
[05 Analytics] → sales, margin, conversion tracking
```

---

## Phase 1: Niche Research

**Agent:** [[agents/01-niche-researcher]]

**POD niche criteria:**
- Specific audience identity (not "nature lovers" — "beekeepers who brew mead")
- Design type that plays to AI strengths (illustration, text integration, patterns)
- Avoid: sports teams, political figures, branded characters, anything with IP risk
- Target: hobbies, professions, lifestyle identities, specific humor sub-cultures

**Trend signals to monitor:**
- Etsy trending tags (Etsy provides a trending searches page)
- Redbubble trending tags
- Google Trends — spike in niche-adjacent searches
- Reddit — r/crafts, r/funny, niche hobby subreddits — what phrases and in-jokes are current

**POD competition assessment:**
- Search Etsy for exact niche phrase (e.g., "beekeeper shirt gift")
- Count listings returned (Etsy shows total count)
- Examine top 10 shops — how many reviews do the top sellers have?
- < 1000 total listings + top sellers < 200 reviews = opportunity
- > 5000 listings + generic designs dominating = saturated, need deeper sub-niche

---

## Phase 2: Design Generation

**Agent:** [[agents/02-design-generator]]

### Design Specifications by Product

**T-shirts (Printful DTG):**
- Print area: 12×16in (standard chest print)
- File: 4500×5400px (15×18in at 300dpi — includes bleed around 12×16 print area)
- Format: PNG with transparent background
- Color: sRGB
- Avoid: very light colors on white shirt (disappear in print); very dark designs on dark shirts

**Hoodies:**
- Same specs as t-shirts — Printful uses same file

**Mugs (Printful 11oz and 15oz):**
- Printful 11oz: 2700×1122px
- Printful 15oz: 2700×1122px (same template, different product)
- Wrap-around prints: 2700×1122px
- Format: PNG, sRGB

**Tote bags (Printful):**
- Print area: 10×12in
- File: 3000×3600px at 300dpi
- Format: PNG transparent

**Phone cases (Printful):**
- Varies by model — Printful provides template downloads per SKU
- Design at 300dpi for the specific model's print area

**Posters and art prints (Printful):**
- 12×18in: 3600×5400px
- 18×24in: 5400×7200px
- 24×36in: 7200×10800px
- Format: JPEG (Printful accepts JPEG for prints), sRGB

**Canvas prints:**
- Same resolution as posters
- Printful adds 1.5in wrap around design — design should have safe margins or intentional wrap content

---

### Design Style Guide (POD)

POD designs fall into three categories. Match Midjourney/Ideogram approach accordingly:

**1. Slogan + simple graphic:**
- Primary tool: Ideogram (best text rendering + graphic integration)
- Prompt: `T-shirt graphic design, [SIMPLE ILLUSTRATION], text "[EXACT SLOGAN]", clean bold typography, high contrast, [STYLE], white background --ar 1:1`
- Test readability: slogan must be legible at 200px wide (thumbnail)

**2. Illustration-only:**
- Primary tool: Midjourney
- Prompt: `[SUBJECT] illustration, graphic tee art style, clean vector-like lines, limited color palette [COLORS], white background, high contrast, bold outlines, suitable for DTG printing --ar 1:1 --style raw --v 6`
- No text in Midjourney if possible; add text in Canva after

**3. Pattern / all-over print:**
- Primary tool: Midjourney --tile
- Prompt: `Seamless repeating pattern, [MOTIF], [COLOR PALETTE], surface design, flat illustration style, coordinated elements --ar 1:1 --tile --v 6`
- Verify tiling in Photoshop before use
- Printful AOP (all-over-print): different per product — check Printful template for positioning

---

### Design Batch Production

For each niche brief:
1. Generate 30 raw variations across 3-4 concept directions
2. Cut to 15 after initial quality review
3. Upscale via Real-ESRGAN (standard model for photos/complex art; anime model for flat illustration)
4. Final cut to 8-10 designs for mockup generation
5. Human review selects final 5-8 for listing

---

## Phase 3: Mockup Creation

**Agent:** [[agents/03-listing-optimizer]]

**Mockup types required per POD product:**

| Product | Primary mockup | Secondary mockups |
|---------|---------------|-------------------|
| T-shirt | Lifestyle (person wearing, natural outdoor setting) | Flat lay on wood, close-up detail |
| Mug | On desk with laptop/books, hand holding | Product only with solid background |
| Tote | Person carrying, casual context | Flat on surface |
| Poster | Framed on wall in styled room | Product only (white background) |

**Mockup tools:**
- Printful Mockup Generator (free, built into Printful dashboard): upload design, select product, generate lifestyle photo mockups — best for POD accuracy since it uses the actual Printful product
- Placeit ($16/mo): larger selection of lifestyle scenes, non-Printful product contexts
- Smartmockups ($15-29/mo): similar to Placeit

**Minimum mockups per Etsy listing:** 5 images (Etsy allows 10)

Recommended set:
1. Primary lifestyle mockup (person using/wearing)
2. Secondary lifestyle mockup (different context/setting)
3. Flat product shot (clean, white or neutral background)
4. Detail/close-up of design area
5. Design-only preview (artwork on white background — shows what the actual design looks like)

---

## POD Provider Comparison

| Provider | Integration | Base cost | Shipping speed | Print quality | API |
|----------|-------------|-----------|---------------|--------------|-----|
| Printful | Etsy, Shopify, WooCommerce | Higher base cost | 2-7 days US | Consistent, premium | Yes |
| Printify | Etsy, Shopify, WooCommerce | Lower base cost, varies by printer | 3-10 days US | Varies by printer choice | Yes |
| Redbubble | Native marketplace | Artist sets markup on base | 5-14 days | Consistent | Limited |
| Society6 | Native marketplace | ~10% artist commission | 5-14 days | Good | Limited |
| Gooten | Shopify, WooCommerce | Competitive | 3-8 days US | Good | Yes |

**Recommendation for Atelier at activation:**
- Start with Printful + Etsy — Printful integration is seamless, quality is consistent, customer support is reliable
- Add Redbubble as secondary (zero fulfillment work; just upload designs)
- Evaluate Printify at month 3 if margin pressure requires lower COGS

---

## Margin Analysis

**T-shirt (Bella+Canvas 3001, Printful + Etsy):**

| | Amount |
|---|--------|
| Sale price | $26.99 |
| Printful t-shirt cost | $14.95 |
| Etsy transaction fee (6.5%) | $1.75 |
| Etsy payment processing (3% + $0.25) | $1.06 |
| Etsy listing fee (amortized 100 sales) | $0.002 |
| **Net profit** | **$9.23** |
| **Net margin** | **34%** |

**Mug (11oz, Printful + Etsy):**

| | Amount |
|---|--------|
| Sale price | $18.99 |
| Printful mug cost | $7.49 |
| Etsy fees (total) | $1.87 |
| **Net profit** | **$9.63** |
| **Net margin** | **51%** |

**Tote bag (Printful + Etsy):**

| | Amount |
|---|--------|
| Sale price | $22.99 |
| Printful tote cost | $10.49 |
| Etsy fees (total) | $2.26 |
| **Net profit** | **$10.24** |
| **Net margin** | **45%** |

**Redbubble (t-shirt, 20% artist margin):**

| | Amount |
|---|--------|
| Sale price (Redbubble sets base) | ~$26-32 |
| Artist markup (20% of base price) | ~$3.50-5.00 |
| Redbubble handles rest | — |
| **Net profit** | **~$3.50-5.00** |
| **Net margin** | **~15-20%** |

Redbubble margins are low. Use as volume/exposure channel, not primary revenue driver.

---

## Phase 4: Human Review Gate

Before publishing to Etsy/Printful:

- [ ] Design quality: would you wear/buy this?
- [ ] Text legible at thumbnail size (if design includes text)
- [ ] No IP infringement: does design resemble any brand logo, sports team, copyrighted character?
- [ ] No political figures or public persons (even in parody context — high risk)
- [ ] AI disclosure ready to add to listing description
- [ ] Mockup images look professional and in-context
- [ ] Pricing makes sense (margin ≥ 30%)

---

## Phase 5: Publishing

**Agent:** [[agents/04-publisher]]

**Printful + Etsy connection:**
1. In Printful: connect Etsy store (OAuth)
2. Create Printful product: upload design, set product type (t-shirt, mug, etc.), select sizes/variants
3. Printful auto-generates an Etsy listing draft
4. Edit the Etsy draft: apply listing optimizer copy (title, description, tags)
5. Add additional mockup images beyond Printful's default set
6. Set price
7. Publish

**Redbubble publishing:**
- Upload design PNG to Redbubble
- Enter title, description, tags
- Select product types to enable (t-shirts, stickers, mugs, etc. — enable all viable products)
- Set markup percentage (20-25% is standard competitive range)
- Publish

---

## Phase 6: Analytics

**Agent:** [[agents/05-analytics]]

**POD-specific signals:**
- Conversion rate is the key metric (Etsy impressions → clicks → orders)
- High impressions + low clicks: title/primary image problem
- High clicks + low orders: description, pricing, or additional image problem
- High refund rate (>3%): quality issue, size guide issue, or design-reality mismatch

**Iteration approach:**
- Winning design (>2% conversion): create 5 variations (different colors, different product types)
- Losing design (>200 impressions, <0.5% conversion, 30 days): update primary image, then title; if no improvement in 30 days, kill

---

## Related Documents

- [[agents/01-niche-researcher]] — POD niche identification
- [[agents/02-design-generator]] — POD design specs and prompts
- [[agents/03-listing-optimizer]] — POD copy and mockups
- [[agents/04-publisher]] — Printful + Etsy publish steps
- [[agents/05-analytics]] — POD performance tracking
- [[brief/marketplace-policies]] — Redbubble and Etsy AI policies
