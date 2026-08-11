# Atelier: Product Niche Selection Guide

Status: PARKED — use when activated. Plans complete and ready to execute.

---

## Niche Evaluation Matrix

Score each candidate niche 1-5 on six criteria. Total max = 30.

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Market size | 1x | Monthly search volume + active buyers on target marketplace |
| Competition density | 1x | Number of competing listings; saturation of AI-generated content specifically |
| AI policy risk | 1x | Platform acceptance of AI content; disclosure requirements; ban risk |
| Production difficulty | 1x | Time and cost to generate one saleable unit at quality threshold |
| Margin | 1x | Net revenue after platform fees, COGS (if POD), and production cost |
| Evergreen demand | 1x | Year-round demand vs. seasonal spike only |

**Scoring rubric:**

| Score | Market size | Competition density | AI policy risk | Production difficulty | Margin | Evergreen demand |
|-------|-------------|---------------------|----------------|-----------------------|--------|------------------|
| 5 | 100k+ monthly searches, active buyer pool | Few sellers, low AI saturation | Fully accepted, no disclosure | <5 min per unit, free tools | >70% net margin | Year-round flat demand |
| 4 | 50-100k searches | Moderate sellers, some AI present | Accepted with standard disclosure | 5-15 min per unit, cheap tools | 50-70% net margin | Slight seasonality, >9 months |
| 3 | 20-50k searches | Crowded but differentiation possible | Allowed, murky policy, watch quarterly | 15-30 min per unit | 35-50% net margin | 6-9 months peak |
| 2 | 5-20k searches | Heavily saturated or AI-banned sellers | Requires heavy disclosure, restricted categories | 30-60 min per unit | 20-35% net margin | 4-6 months peak |
| 1 | <5k searches | Commodity race to bottom | Active bans or legal exposure | >60 min per unit, expensive tools | <20% net margin | Short seasonal window only |

**Decision thresholds:**
- Score ≥ 28 → lock the niche, begin production
- Score 20-27 → run a 30-unit test batch, track for 60 days before scaling
- Score < 20 → reject; document why for future reference

---

## Priority Niches to Evaluate at Activation

### 1. Wall Art / Digital Prints

**Channels:** Etsy (primary), own Shopify (secondary)

**Sub-niches to evaluate first:**
- Minimalist line art (botanical, figure, architecture)
- Abstract geometric (black/white, muted palette, color blocking)
- Botanical illustration (vintage scientific style, modern flat)
- Nursery art (animals, alphabet, name prints — custom variant)
- Motivational typography (short phrase, clean font, limited palette)

**Example top sellers (Etsy):**
- Minimalist face line art: 10k+ sales at $3-8 per instant download
- Botanical set of 3: 5k+ sales at $5-12 per set
- Abstract watercolor: 3k+ sales at $4-9

**AI generation approach:**
- Midjourney or Flux for illustration style work
- Ideogram for typography-heavy compositions
- Generate 20 variations per concept, curate top 5, upscale via Real-ESRGAN
- Output: 24×36in 300dpi TIFF + 16×20in fallback

**Marketplace policies:** Etsy requires disclosure of AI use in listing. No blanket ban. Some categories (custom portraits with human likeness) have stricter rules — avoid.

**Margin analysis:**
- Etsy listing fee: $0.20/listing
- Etsy transaction fee: 6.5% of sale price
- Etsy payment processing: 3% + $0.25
- Production cost: effectively $0 (digital file)
- At $6 sale price: ~$5.37 net (~89% gross, ~82% net after listing amortized over 100 sales)
- At $4 sale price: ~$3.51 net (~88% gross)

**Preliminary score estimate:** 22-26 (test batch recommended)

---

### 2. KDP Low-Content Books

**Channel:** Amazon KDP (primary)

**Sub-niches to evaluate first:**
- Niche-specific journals (gratitude, sobriety tracker, anxiety, ADHD daily planner)
- Coloring books (adult: botanical, mandala; kids: animals, vehicles, holidays)
- Activity books (word search, sudoku, crossword — specific themes: for seniors, kids by age)
- Puzzle books (logic grids, cryptograms)
- Lined notebooks (niche cover design: hobbies, professions, fandoms without IP)

**The Market Gaps approach (priority method):**
KDP success is NOT about picking broad categories. It is about finding underserved intersections of:
- Audience identity (e.g., "left-handed nurses")
- Activity type (e.g., "daily planner")
- Visual aesthetic (e.g., "watercolor floral")

**Data sources for gap finding:**
1. AMZScout or Publisher Rocket: BSR data, keyword monthly search volume, competition
2. Amazon search: type category + keyword, examine BSR of top results (<100k BSR = viable)
3. Look for: top 3 results all have <100 reviews, no dominant brand, price $6-15

**Example underserved niches (as of early 2025, verify before activation):**
- Sobriety milestone tracker journals (specific milestone counts)
- ADHD-specific daily planners with time-blocking layouts
- Grief journals for specific loss types (pet loss, pregnancy loss)
- Niche coloring: vintage fishing illustrations, historical maps, architectural line drawings

**AI generation approach:**
- Interior pages: Midjourney for illustration content (coloring pages), Claude for puzzle generation logic, Python for word search grid generation
- Cover: Midjourney or Flux + Canva for text/title overlay
- Output format: PDF interior at 8.5×11in 300dpi (standard KDP trim), PDF cover at KDP-calculated size

**KDP AI disclosure requirements:**
- As of 2025: must disclose AI-generated images in content upload form
- Text content: no disclosure currently required for AI-assisted text
- KDP reserves right to remove content that violates quality standards
- Duplicate content risk: do not generate near-identical interiors across multiple listings

**Margin analysis:**
- 60-page journal at $7.99: royalty ~$2.34 (print cost ~$2.15 for 6×9 B&W)
- 100-page coloring book at $9.99 (8.5×11 B&W): royalty ~$2.05 (print cost ~$4.45)
- 120-page coloring book at $12.99 (8.5×11 B&W): royalty ~$3.30 (print cost ~$4.45)
- Coloring books need higher page count and price to get decent royalty — target $12.99+

**Preliminary score estimate:** 24-27 (test batch with 3-5 titles)

---

### 3. Print-on-Demand (POD)

**Channels:** Printful + Etsy (primary), Printify + Redbubble (secondary)

**Sub-niches to evaluate first:**
- Profession-specific apparel (nurse humor, teacher sayings, engineer jokes — avoid overused phrases)
- Hobby niche (specific hobbies: beekeeping, fermentation, amateur radio, foraging)
- Pet breed niche (specific breed art — not generic "I love dogs")
- Aesthetic-based home goods (mugs, tote bags with minimalist patterns, not slogans)

**Example top sellers:**
- Niche profession shirt: "Pharmacist Mode: Dispensing Wisdom" style at $22-28
- Specific hobby graphic tee at $24-32
- Minimalist botanical tote at $18-25

**AI generation approach:**
- Ideogram for text-integrated designs (best for slogan + graphic combos)
- Midjourney for illustration-only designs (pet art, botanical, abstract)
- Flux for photorealistic textures and patterns
- Design dimensions: 4500×5400px 300dpi for Printful DTG print area (15×18in)
- Color mode: sRGB; convert from CMYK where needed

**Marketplace policies:**
- Redbubble: allows AI art, requires disclosure tag in listing, has quality review
- Society6: allows AI art with disclosure
- Printful: no restriction on AI-generated source art
- Etsy: requires AI disclosure in listing description

**Margin analysis (Printful + Etsy):**
- Unisex t-shirt (Bella+Canvas 3001): Printful cost ~$14.95
- Sale price $26.99: gross ~$12.04 before Etsy fees
- After Etsy fees (~10%): net ~$10.30 per shirt (~38% net margin)
- Mug: Printful cost ~$7.49, sale price $18.99: net ~$9.27 after fees (~49%)
- Tote bag: Printful cost ~$10.49, sale price $22.99: net ~$10.22 after fees (~44%)

**Preliminary score estimate:** 19-23 (competitive; niche selection critical)

---

### 4. Digital Downloads: Templates and Assets

**Channels:** Etsy (primary), Gumroad (secondary), Creative Market (tertiary)

**Sub-niches to evaluate first:**
- Social media templates (Instagram story sets, carousel templates — niche by industry: real estate, wellness coach, restaurant)
- Resume/CV templates (specific professions: creative fields, tech, hospitality)
- Wedding stationery (invitation suites, save-the-dates, menus — AI-generated illustration + Canva editable)
- Canva templates (business card, pitch deck, media kit)
- Planner inserts (printable, compatible with standard binders)

**AI generation approach:**
- Canva API or manual Canva: build template frameworks
- Midjourney: illustrative elements (florals, borders, icons)
- Claude: generate placeholder copy, instructions, examples
- Output: Canva template share link (for Canva templates), PDF + PNG preview (for printables), PPTX (for deck templates)

**Marketplace policies:**
- Etsy: AI disclosure required; templates themselves are legitimate product
- Creative Market: has explicit AI content policy — check at activation (was restrictive as of late 2024)
- Gumroad: no AI restriction as of 2025

**Margin analysis:**
- Social media template pack (30 templates) at $15: effectively 100% margin less fees
- Etsy fees ~10.7%: net ~$13.40 per sale
- High volume potential: one template pack can sell 100s of times with zero additional cost

**Preliminary score estimate:** 24-28 (strong margin, policy risk is manageable on Etsy/Gumroad)

---

### 5. Stock Assets: Textures, Patterns, Mockups

**Channel:** Creative Market (primary), Gumroad, own site

**Sub-niches to evaluate first:**
- Seamless pattern packs (surface design for POD, fabric, stationery)
- Texture overlays (paper, grunge, grain, watercolor wash)
- Device mockups (phone, tablet, laptop flat lays)
- Branding mockups (logo on mug, packaging, tote)

**AI generation approach:**
- Midjourney or Flux: seamless texture generation
- Stability AI or Flux: pattern generation with tiling capability
- Photoshop automation or ComfyUI: batch process tiling verification
- Output: JPEG + PNG at 5000×5000px minimum; include seamless tile verification

**Marketplace policies:**
- Adobe Stock: restricted AI-generated content as of mid-2024 (contributor accounts suspended for AI art) — HIGH RISK, likely avoid
- Shutterstock: similar restrictions — HIGH RISK, likely avoid
- Creative Market: nuanced; some AI-assisted content allowed if creator adds substantial value — verify at activation
- Gumroad: no restriction

**Margin analysis:**
- Pattern pack (25 seamless patterns) at $19: effectively 100% margin less fees
- Creative Market takes 40% commission: net $11.40 per sale
- Gumroad takes 10% + payment processing: net ~$16.50 per sale

**Preliminary score estimate:** 17-22 (platform risk pulls score down; Adobe/Shutterstock likely off-table)

---

## Niche Prioritization Summary

When activated, evaluate in this order:

1. **Digital downloads (templates)** — highest margin, manageable policy risk on Etsy/Gumroad
2. **KDP low-content books** — scalable, Amazon traffic is free, volume game works
3. **Wall art prints** — well-understood market, low risk, proven AI-generated product category
4. **POD** — viable but niche selection is make-or-break; lower margin than digital
5. **Stock assets** — hold; platform risk too high until Creative Market/Shutterstock policies clarify

Pick maximum 2 niches for v1. Do not spread across all 5.

---

## Related Documents

- [[agents/01-niche-researcher]] — automated niche scanning
- [[brief/marketplace-policies]] — current platform rules
- [[workflows/kdp-pipeline]] — KDP end-to-end workflow
- [[workflows/pod-pipeline]] — POD end-to-end workflow
- [[workflows/digital-download-pipeline]] — digital download workflow
- [[../../shared/skills/niche-locker/SKILL]] — weighted scoring tool
