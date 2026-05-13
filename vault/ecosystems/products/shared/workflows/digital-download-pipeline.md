# Atelier Workflow: Digital Download Pipeline

Status: PARKED — ready to execute when Atelier activates.

---

## Pipeline Overview

```
[01 Niche Researcher] → template/asset demand signal + keyword data
         ↓
[02 Design Generator] → product files (Canva templates, assets, bundles)
         ↓
[03 Listing Optimizer] → preview images + listing copy
         ↓
[HUMAN REVIEW GATE] → usability check, 5-10 min per product
         ↓
[04 Publisher] → Etsy listing + file upload; Gumroad product
         ↓
[05 Analytics] → sales, reviews, conversion tracking
```

---

## Phase 1: Niche Research

**Agent:** [[agents/01-niche-researcher]]

**Digital download sub-categories to target:**

| Category | Demand signal | Competition note |
|----------|--------------|-----------------|
| Social media templates (niche by industry) | High and growing | Saturated generically; niche by industry (real estate, yoga studio) wins |
| Resume/CV templates | Evergreen | Competitive; niche by profession differentiates |
| Wedding stationery | Seasonal + evergreen (always weddings) | AI illustration + editable Canva = strong combination |
| Canva pitch deck templates | Growing (B2B digital presence boom) | Less saturated than social media templates |
| Printable planners / inserts | Evergreen | Niche by audience (ADHD planner, homeschool planner) |
| Digital invitations | Seasonal events | Very competitive generically; niche by event type/aesthetic |
| Budget tracker templates | Evergreen | Popular personal finance niche |

**Research methodology for digital downloads:**
1. Search Etsy for "[niche] template" or "[niche] Canva"
2. Filter: digital downloads, sort by top customer reviews
3. Examine top 10 sellers: review count (< 200 = opportunity), price ($5-30 range), what's in the listing
4. Read the 1-star reviews — what's missing or frustrating buyers about existing products
5. That gap is the product spec

---

## Phase 2: Product Creation

**Agent:** [[agents/02-design-generator]]

### Canva Template Products

**Workflow:**
1. Plan template structure (what slides/pages, what design elements)
2. Use Midjourney or Flux for any illustrative elements (icons, backgrounds, accent graphics)
3. Build template in Canva Pro:
   - Create all slides/pages
   - Set fonts (stick to Canva's built-in fonts — buyer must have access)
   - Use only Canva-included elements OR custom elements uploaded to the template
   - Add instructional text on Page 1: "Click to edit text / Replace images with your own"
4. Share via Canva link (Template link, not Edit link — Template creates a copy for buyer)
5. Export PDF preview (not the editable Canva link — preview only)

**Font rule:** ONLY use Canva built-in fonts. If buyer doesn't have access to a custom font, the template breaks for them. This is the #1 complaint in template seller 1-star reviews.

**Element rule:** ONLY use Canva elements, Canva stock photos, or elements you upload into the template itself. Do not reference external elements or premium Canva assets the buyer may not have.

**Template structure per product type:**

*Social media template pack (30 templates):*
- 10 feed posts (1:1, 1080×1080px)
- 10 stories (9:16, 1080×1920px)
- 10 carousels (1:1 per slide, 5-slide deck × 2 designs)
- Each template: branded color palette, font system, placeholder text/image spots

*Resume template:*
- 1 main resume page (A4 or Letter size, 2480×3508px / 2550×3300px)
- 1 cover letter page (matching design)
- Optional: reference page (nice-to-have, increases perceived value)
- Deliver: PDF (editable Canva link) + additional PDF/Word version if possible

*Pitch deck template (16 slides):*
- Title slide
- Problem / Solution slides (2)
- Product/Service slides (3)
- Market size slide
- Business model slide
- Traction / Social proof slide
- Team slide
- Financial projections slide
- Ask slide
- Thank you / contact slide
- Blank slide (template for buyer to add more)

---

### Wedding Stationery

**Workflow:**
1. Design illustration elements via Midjourney (botanical, floral, venue sketch style)
2. Build in Canva with customizable text fields
3. Suite includes: invitation, RSVP card, details card, menu, place card, thank you card
4. Deliver: Canva template link for each card + flattened PDF preview

**Canva prompts for wedding illustrations:**
```
Watercolor botanical illustration, [FLOWER/FOLIAGE TYPE], soft muted palette [COLORS], transparent background, wedding stationery element, fine art style --ar 1:1 --style raw --v 6
```

**File spec:**
- Cards: 5×7in (standard invitation) at 300dpi = 1500×2100px in Canva
- RSVP: 4×6in at 300dpi = 1200×1800px
- Menu: 4×9in or 5×7in

---

### Printable Planners and Inserts

**Workflow:**
1. Design layout (journal lines, habit tracker grids, calendar grids) — this is layout work, not illustration
2. Use AI for decorative header illustrations and cover design only
3. Build in Canva (Letter 8.5×11in is standard for US; A4 for international)
4. Deliver: PDF for home printing; include both Letter and A4 sizes

**Standard planner inserts compatible with:**
- A5 binder (half-letter): 5.5×8.5in
- Half-letter / personal size: 5.5×8.5in
- A4: 8.27×11.69in
- Letter: 8.5×11in (most common US)

---

## File Format Requirements

**Digital download delivery formats by product:**

| Product | Primary format | Secondary format | Notes |
|---------|---------------|-----------------|-------|
| Canva templates | Canva template link (share link) | PDF preview | Canva link = permanent; buyer gets editable copy |
| Social media templates | Canva link | PNG (non-editable preview) | |
| Printable planners | PDF (Letter + A4) | — | 300dpi, print-ready |
| Resume templates | Canva link | DOCX (if possible) | |
| Wall art prints | JPEG + PDF | PNG (for transparent bg versions) | 300dpi; include multiple sizes |
| Wedding stationery | Canva link | PDF preview | One link per card type |
| Pattern/texture packs | JPEG + PNG | — | 300dpi minimum; seamless PNG |
| Social media asset packs | PNG (each asset individual) | ZIP bundle | sRGB, standard platform dimensions |

**Deliver as ZIP on Etsy:** Bundle all files into a single ZIP. Etsy's maximum file size per listing is 20MB. For larger bundles, use a link to Google Drive or Dropbox included in a PDF instruction sheet.

---

## Preview Image Specs

Preview images are the product photos for digital downloads. This is the most important design work in the pipeline.

**Preview image set (minimum 5 for Etsy):**

1. **Hero mockup** — product displayed in lifestyle context (laptop with template open, planner on desk with coffee, phone with social media templates visible)
2. **Multi-page spread** — show 3-5 pages/templates laid out to show full scope of product
3. **Close-up detail** — zoom in on one feature that's hard to see in hero shot
4. **Customization example** — show the template with placeholder text replaced by real content (shows buyer what the end result looks like)
5. **What's included** — text-based graphic listing everything in the bundle (files, sizes, formats)

**Preview image dimensions:**
- Etsy: 2000×2000px minimum, 3000×3000px preferred (square or 4:3)
- Must look good as thumbnail (100×100px) and full view

**Mockup tools for digital products:**
- Canva (show template on laptop/tablet screen)
- Placeit (device mockups — laptop, tablet, phone)
- Create flat lays in Canva: products printed, arranged on desk surface with props

---

## Bundling Strategies

Higher-priced bundles convert better than individual items per many Etsy sellers' reports:

**Bundle strategy 1: Same product, all sizes**
- Resume template: A4 + US Letter in one download
- Planner: A4 + US Letter + A5 in one download
- Price: slight premium over single size (~20% more)

**Bundle strategy 2: Complete suite**
- Wedding stationery: all 6 card types together ($25-40)
- Social media kit: feed + stories + carousels + highlights covers ($20-35)
- Price: 2-3× the cost of one component

**Bundle strategy 3: Niche pack**
- "Real estate agent social media templates — 30 designs"
- "Yoga instructor Instagram content pack — 50 templates"
- Bundle by use case = clearer buyer intent = higher conversion

---

## Phase 3: Listing Optimization

**Agent:** [[agents/03-listing-optimizer]]

**Digital download listing specifics:**

**Title formula:**
`[Product Type] | [Niche Descriptor] | [Platform/Use Case] | [Key Feature]`

Examples:
- `Canva Resume Template | Minimalist ATS-Friendly | Creative Industries | 2-Page CV + Cover Letter`
- `Social Media Templates | Real Estate Agent | Instagram + Stories | 30 Editable Designs`
- `Wedding Invitation Suite | Botanical Watercolor | Editable Canva Template | Printable`

**Description must include:**
- What's in the download (exact file count, formats, sizes)
- How to use it (brief step-by-step: 1. Click template link 2. Edit in Canva 3. Download)
- Technical requirements (Canva Free vs. Pro, software needed)
- AI disclosure: "Design elements created with AI image generation tools."
- Refund policy note ("Due to digital nature, no refunds after download")
- Customer support note ("Questions? Message me within 48 hours")

**Tags (13 for Etsy):**
Etsy uses tags as search terms. Optimal tags for digital downloads:
- Product type + niche (2-3 word phrases)
- Use case + platform
- Aesthetic descriptors
- Audience identity
- Occasion/timing tags

---

## Phase 4: Human Review Gate

Before publishing:

- [ ] Open Canva template link — does it work? Does it create a proper copy when opened?
- [ ] Edit one text field — is it easy to use? Would a non-designer manage it?
- [ ] All fonts are Canva-built-in (no premium fonts buyer would need to purchase)
- [ ] ZIP file opens correctly and contains all listed files
- [ ] Preview images show product clearly, professionally
- [ ] Pricing makes sense for the bundle contents

---

## Phase 5: Publishing

**Agent:** [[agents/04-publisher]]

**Etsy digital listing setup:**
- Item type: "A finished product" → "Digital download"
- Upload files: ZIP bundle (or PDF with download links if over 20MB)
- Etsy delivers files to buyer automatically on purchase
- No shipping setup required

**Gumroad product setup:**
- Create product, upload files
- Set price
- Canva template: deliver the Canva link inside a PDF instruction sheet (upload that PDF as the Gumroad product file)
- Enable "Pay what you want" option? Optional — only for products where you want community building; not recommended for Atelier (anonymous, transactional)

---

## Phase 6: Analytics

**Agent:** [[agents/05-analytics]]

**Digital download-specific metrics:**
- Conversion rate is the primary metric (Etsy: Visits → Orders)
- Download complaints (1-star reviews about "file doesn't work") = delivery problem; check ZIP integrity
- "Doesn't match description" complaints = preview image is misleading
- Repeat buyers: rare for templates (buyer has it); focus on new customers

**Revision cycle:**
- Month 1: monitor conversion rate
- Month 2: if conversion < 1%, A/B test hero mockup image
- Month 3: if still underperforming, test price change or add bonus templates to increase perceived value
- Month 6: if product has < 5 sales, kill and replace with better niche

---

## Related Documents

- [[agents/01-niche-researcher]] — digital download niche scanning
- [[agents/02-design-generator]] — Canva template and asset creation
- [[agents/03-listing-optimizer]] — preview images and listing copy
- [[agents/04-publisher]] — Etsy and Gumroad upload
- [[agents/05-analytics]] — conversion and revenue tracking
- [[brief/marketplace-policies]] — Etsy, Creative Market, Gumroad AI policies
- [[brief/product-niches]] — digital download niche evaluation
