# Agent 03: Listing Optimizer

**Role:** Create marketplace-ready listings from design files. Takes curated designs from Design Generator; outputs complete listing packages (copy, mockups, tags, pricing) ready for human review then Publisher.

---

## Inputs

- Design files from [[02-design-generator]] (curated + upscaled)
- Niche brief from [[01-niche-researcher]] (keywords, target marketplace, competitor analysis)
- Marketplace target (Etsy / KDP / Redbubble / Gumroad)

---

## Outputs

Per listing, a `listing_package/` directory:

```
listing_package/PRODUCT-SLUG/
├── listing.json        ← structured data for Publisher (title, desc, tags, price, category)
├── mockups/            ← 5-8 product mockup images
├── source_files/       ← download files for digital products (or design file for POD)
└── review_notes.txt    ← any flags for human reviewer
```

---

## Tasks

1. SEO title generation (marketplace-specific)
2. Description / product copy
3. Tag / keyword list
4. Mockup image creation
5. Pricing recommendation
6. A/B title variants (2 variants per listing for testing)

---

## Etsy Listing Copy Prompt

```
You are an Etsy SEO specialist writing a listing for a digital product.

Product: {{PRODUCT_DESCRIPTION}}
Primary keyword: {{PRIMARY_KEYWORD}}
Secondary keywords: {{SECONDARY_KEYWORDS_LIST}}
Competitor titles for reference: {{COMPETITOR_TITLES}}

Write:

1. TITLE (max 140 characters)
   - Start with primary keyword
   - Include 2-3 secondary keywords naturally
   - Include product type (digital download, wall art, printable, etc.)
   - No ALL CAPS
   - Format: [Primary Keyword] [Product Type] | [Secondary Keyword] | [Additional Descriptor]

2. DESCRIPTION (400-600 words)
   - Open with primary keyword in first sentence
   - Benefits first (what this does for the buyer), then specs
   - Include: file formats, resolution, what sizes are included, how to download
   - Include AI disclosure: "This design was created with AI image generation tools."
   - Close with secondary keywords in natural language
   - Line breaks every 3-4 sentences (Etsy renders plain text)
   - No markdown in description (Etsy strips formatting)

3. TAGS (13 tags, max 20 characters each)
   - Each tag is a keyword phrase (2-3 words is better than 1 word)
   - Include: primary keyword, secondary keywords, product type variants, aesthetic descriptors, use case
   - No repetition of words used in title (Etsy already uses title for search)

4. A/B TITLE VARIANT
   - Same keywords, different word order and framing
   - Test this against the primary title after 30 days

Output as JSON:
{
  "title_primary": "",
  "title_ab_variant": "",
  "description": "",
  "tags": ["", "", "", "", "", "", "", "", "", "", "", "", ""]
}
```

---

## KDP Listing Copy Prompt

```
You are an Amazon KDP publishing specialist writing metadata for a low-content book.

Book concept: {{BOOK_CONCEPT}}
Target niche: {{NICHE}}
Primary keyword: {{PRIMARY_KDP_KEYWORD}}
BSR target category: {{CATEGORY}}
Competitor titles with BSR data: {{COMPETITOR_DATA}}

Write:

1. TITLE (max 200 characters total including subtitle)
   - Primary keyword must appear in title OR subtitle
   - Title: specific, benefit-oriented, memorable
   - Subtitle: keyword-rich, descriptive, includes page count/format if relevant

2. DESCRIPTION (max 4000 characters)
   - First 400 characters appear without "see more" click — make them count
   - Open with who this book is for and what problem it solves
   - List 5-7 bullet points of what's inside (page count, layout description, specific features)
   - Include keywords naturally throughout
   - Close with a call to action ("Scroll up and click Add to Cart")
   - No HTML (KDP strips it in some views)

3. KEYWORDS (7 keyword phrases, max 50 characters each)
   - Long-tail phrases buyers actually search
   - Don't repeat words used in title/subtitle
   - Target: buyer intent phrases, not category names
   - Include: audience descriptors, use-case, aesthetic

4. CATEGORIES (2 browse nodes)
   - Suggest the 2 most specific applicable BISAC/Amazon categories
   - Lower competition sub-categories preferred over high-competition parent categories

Output as JSON:
{
  "title": "",
  "subtitle": "",
  "description": "",
  "keywords": ["", "", "", "", "", "", ""],
  "category_1": "",
  "category_2": ""
}
```

---

## Redbubble / POD Listing Copy Prompt

```
You are writing product listing copy for a print-on-demand store.

Product: {{DESIGN_DESCRIPTION}}
Niche: {{NICHE}}
Target audience: {{AUDIENCE}}
Primary keyword: {{PRIMARY_KEYWORD}}

Write:

1. TITLE (max 60 characters for Redbubble)
   - Primary keyword at start
   - Specific, descriptive
   - Include product category (t-shirt / sticker / mug) if character budget allows

2. DESCRIPTION (100-200 words)
   - Who is this for? Lead with the audience
   - What does it say/show? One sentence
   - Where/when to wear it? (casual, gift occasion)
   - Include AI tag disclosure line: "Created with AI design tools | AI art"
   - Include 5-8 keyword phrases naturally

3. TAGS (15 tags for Redbubble)
   - Include: niche terms, audience terms, aesthetic terms, occasion/gift terms, product type terms
   - Include: "ai-art", "ai-generated" (required disclosure tags)

Output as JSON:
{
  "title": "",
  "description": "",
  "tags": []
}
```

---

## Mockup Creation

For each listing, create 5-8 mockup images showing product in context.

**Tools:**
- Placeit (subscription) — large library of lifestyle mockups, room scenes
- Smartmockups (subscription) — similar to Placeit
- Canva Pro — device and product mockups for digital products
- Printful mockup generator (free, for POD) — access via Printful dashboard or API
- Manual Photoshop action — for custom scenes (advanced)

**Mockup requirements per marketplace:**

| Marketplace | Image count | Minimum resolution | Formats |
|-------------|-------------|-------------------|---------|
| Etsy | 1-10 images | 2000px shortest side | JPEG, PNG |
| KDP | 1 cover image | 2560×1600px | JPEG or TIFF |
| Redbubble | 1 main image | Product template fills | PNG |

**Mockup types to include for wall art listings (Etsy):**
1. Product flat (white background, product only) — image 1
2. Room scene: living room or bedroom wall — image 2
3. Room scene: home office — image 3
4. Size comparison (show product in frame on wall with furniture for scale) — image 4
5. Detail/close-up crop — image 5

---

## Pricing Recommendation Logic

```
For each listing:

1. Pull top 20 competitors in same niche + product type
2. Calculate: median price, 25th percentile, 75th percentile
3. Set price at:
   - New shop (0-25 reviews): 25th percentile - 10% (undercut to get early sales)
   - Established shop (25-100 reviews): median
   - Top-of-niche shop (100+ reviews): 75th percentile
4. For KDP: verify royalty at chosen price against print cost using KDP royalty calculator
5. For POD: verify margin ≥ 30% after Printful + marketplace fees
6. Output: recommended price + calculated margin
```

---

## A/B Title Testing

Track 2 title variants per listing (where Etsy allows):
- Variant A: primary title (keyword-first)
- Variant B: benefit-first variant ("Perfect for [audience]" framing)

After 30 days: which gets more clicks (Etsy stats). Retire underperformer, keep winner.

---

## Review Flags (sent to human reviewer)

Automatically flag listings for additional human attention:
- Design contains text (check for spelling errors)
- Design contains any human face or likeness
- Design is in a category with complex AI disclosure rules
- Pricing model shows margin <25% after all fees
- Competitor analysis shows category has <3 top sellers (new category — may be opportunity or dead market)

---

## Related Documents

- [[02-design-generator]] — provides design files
- [[04-publisher]] — receives approved listing packages
- [[../../shared/prompts/product-description]] — core listing copy prompts
- [[../../shared/prompts/seo-optimizer]] — SEO optimization layer
- [[../../shared/skills/review-miner/SKILL]] — mine competitor reviews for copy angles
