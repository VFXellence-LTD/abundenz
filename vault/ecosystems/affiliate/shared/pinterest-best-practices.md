# Pinterest Best Practices

Platform-specific tactics for Conduit. Distilled from what works for product-recommendation content on Pinterest. Read alongside [[workflows/pinterest-growth]].

---

## Pin Design

### Dimensions and Format
- **Optimal size**: 1000 × 1500 px (2:3 ratio)
- **Minimum**: 600 × 900 px
- **Never**: Square or landscape — Pinterest demotes these in feed
- **File format**: JPEG for photos, PNG for graphics with text
- **File size**: Under 10MB

### What Performs for Affiliate Product Pins

**Visual hierarchy** (from top to bottom):
1. Eye-catching headline or hook (large text, top third of pin)
2. Product image or lifestyle context image (centre)
3. Brief supporting text (optional, small font)
4. Brand mark / URL (bottom, subtle)

**Colour strategy**:
- Use warm colours (reds, oranges) for CTA elements — Pinterest research shows warmer palettes drive more clicks
- Light backgrounds outperform dark backgrounds for product pins
- High contrast between text and background — accessibility and legibility
- Consistent colour palette per board/niche (brand recognition across pins)

**Typography**:
- Max 2 fonts per pin
- Headline font: bold, legible at small sizes (Pinterest thumbnails are small)
- Body font: clean, sans-serif
- Text overlay must be readable on mobile — test at 1/4 scale

**Common mistakes to avoid**:
- Too much text — if someone needs to read a paragraph to understand the pin, it won't stop the scroll
- Generic stock photos — lifestyle imagery with vague woman-in-kitchen or man-at-desk aesthetics are ignored
- No clear focal point — pin should have one visual element that draws the eye
- Small product image surrounded by too much blank space
- Low contrast text (white text on light background, etc.)

### Pin Design Templates

Create templates at activation, one per niche. Each template has:
- Fixed brand colour palette for the niche
- Logo/brand mark placement (bottom corner)
- Text overlay zone (top or bottom, never centre-over-product)
- Image placeholder zone
- Variant A–J slots (different layout for each content angle)

Store templates in [[assets/]] after creation.

---

## Pin Description Writing

### Formula

```
[PRIMARY KEYWORD PHRASE] — [CORE BENEFIT IN BUYER LANGUAGE]

[1–2 specific supporting details from product card]

[CALL TO ACTION] → [LINK]

*Affiliate link — I earn a small commission if you buy, at no extra cost to you.*
```

### Examples

**Home office niche — desk converter product:**
```
Adjustable standing desk converter — the fastest way to stop sitting all day at your home office.

Switches from seated to standing in 5 seconds flat. No assembly, no tools. Takes any desk from 28" to 60" wide.

See current price and reviews →

*Affiliate link — small commission earned if you purchase, no extra cost to you.*
```

**Pet products niche — automatic cat feeder:**
```
Best automatic cat feeder 2025 — finally stop worrying about leaving your cat home alone.

Holds 4.5L of dry food, programmable for up to 6 meals/day. App-controlled. The cat-owner upgrade that actually makes a difference.

Check price on Amazon →

*Affiliate link — I earn a small commission at no extra cost to you.*
```

### Writing Rules

- **Keyword first**: Open with the primary search keyword phrase. Pinterest indexes the first part of the description most heavily.
- **Buyer language**: Use words from the product card's power words list, not product spec language
- **One CTA**: Do not give buyers multiple actions. One link, one action.
- **Disclosure last**: FTC disclosure is required. Put it at the end to not interrupt the flow.
- **Character limit**: Descriptions display truncated after ~100 characters in feed. Key information goes in the first sentence.
- **Avoid**: "Click here", "Check this out", "Amazing product" — generic filler that doesn't drive clicks

### Description Variation

Scheduler needs description variation across pins for the same product (to avoid duplicate content flags). Content Generator produces 10–20 variants per product. Each variant should have:
- Different opening keyword phrase (different angle on the same product)
- Different specific detail highlighted
- Same structure (keyword → benefit → detail → CTA → disclosure)

---

## Optimal Posting Times

| Time (EST) | Day | Engagement Level |
|-----------|-----|-----------------|
| 8–11 AM | Saturday | High |
| 8–11 PM | Saturday | High |
| 8–11 PM | Sunday | High |
| 2–4 PM | Monday–Thursday | Medium |
| 9 PM | Monday–Thursday | Medium |
| 5 PM | Friday | Medium |

**General principle**: US-centric afternoon and evening windows. Pinterest users are often browsing during breaks or evening leisure time.

**Avoid**: 1–5 AM EST (any day). Low engagement and wastes posting budget.

These are starting points. After 60 days of posting, check your own account's Pinterest Analytics under "Audience" → "When your audience is on Pinterest". Adjust to your actual audience's active times.

---

## Hashtag Strategy

**Current guidance (verify at activation)**:

Pinterest hashtags have reduced in algorithmic importance since ~2022. Pinterest now relies more on keyword analysis of the full description, image metadata, and board context than hashtag matching.

**Conservative approach**:
- Include 2–5 highly relevant hashtags at the end of each description
- Use category-level hashtags (#homeoffice, #kitchengadgets) not product-specific (#aircooledfryer)
- Do not use trending hashtags irrelevant to the product (trend-jacking is penalised on Pinterest)
- Do not use 20+ hashtags (looks like spam)

**If Pinterest reduces hashtag support further**: Remove hashtags from templates. The keyword-optimised description carries more weight.

---

## Analytics Interpretation

### Metrics That Matter for Conduit

| Metric | What It Tells You | Target |
|--------|------------------|--------|
| Outbound clicks | How many people clicked your affiliate link | Primary KPI |
| Outbound CTR | Click rate — quality of pin for driving traffic | ≥ 0.5% |
| Impressions | How many times pin was shown | Volume signal (not a success metric alone) |
| Saves | People bookmarking pin for later | Secondary signal — saved pins can drive delayed clicks |

### Metrics to Ignore (for Conduit's purposes)

| Metric | Why It Doesn't Matter |
|--------|----------------------|
| Followers | Conduit doesn't need followers — buyers arrive via search |
| Total engagement (likes, comments) | Pinterest doesn't have meaningful comment culture; engagement ≠ revenue |
| Closeups | People zooming into the pin image — curiosity, not click intent |
| Profile visits | Interesting but not monetisable signal for Conduit |

### Interpreting Outbound CTR

| CTR | Interpretation | Action |
|-----|---------------|--------|
| < 0.3% | Pin is not compelling or niche has no buyer intent | Rework design and copy; if persistent, kill niche |
| 0.3–0.5% | Below target but has signal | A/B test with different design variants |
| 0.5–1.0% | Solid performance | Maintain, produce more content in this category |
| 1.0–2.0% | Strong performer | Consider promoting with paid budget |
| > 2.0% | Exceptional | Immediately replicate the angle across 5 more pins |

---

## Common Mistakes

### Content Mistakes

**Too-thin content**: Pins that are just product images with prices. Pinterest users ignore these because every merchant does this. Conduit's edge is buyer-language copy drawn from real reviews.

**Fabricated lifestyle context**: Generic stock-photo imagery that screams "affiliate content". Use product images (Amazon provides them; manufacturers often have press kits) combined with simple, clean graphic design.

**Missing disclosure**: Every pin with an affiliate link needs disclosure in the description. No exceptions. See [[safeguards/compliance]].

**Keyword stuffing in descriptions**: "best home office chair home office desk chair ergonomic home office chair" — this reads as spam and Pinterest may suppress it.

### Account Mistakes

**Rapid pin deletion**: Deleting many pins in a short window is a spam signal. Only delete pins that clearly violate guidelines — do not mass-delete underperformers (just let them fade naturally).

**Buying followers or repins**: Inauthentic engagement is detected and results in account suspension.

**Posting identical content to multiple boards simultaneously**: A unique image posted to 3 boards on the same day is fine. The same image with identical description posted to 3 boards on the same day is a spam signal.

**Switching niches abruptly**: Posting home office content for 2 months then suddenly posting baby products confuses Pinterest's topic model for your account. Either start new boards for new niches, or transition gradually.

### Technical Mistakes

**Broken links**: If an affiliate link resolves to a 404, Pinterest may detect this and reduce distribution. Link Manager's daily checks prevent this.

**Slow landing page**: If the Conduit blog loads slowly, Pinterest's offsite signals may penalise distribution. Blog performance matters.

**Mobile-illegible pins**: Most Pinterest traffic is mobile. If your pin text is too small to read on a phone, CTR suffers. Test every template at mobile size before using.

---

## A/B Testing Framework

Once steady-state posting is established (after week 8), run structured A/B tests:

**What to test**:
1. Headline style (question vs. statement vs. list: "3 reasons...")
2. Image type (product-only vs. lifestyle context vs. graphic design)
3. Colour palette variant (warm vs. cool for same niche)
4. CTA language ("See on Amazon" vs. "Check current price" vs. "Find yours here")

**How to test**:
- Create 2 pin variants for the same product with one variable changed
- Post both in the same week (different days)
- Compare outbound CTR at 14 days
- Winning variant becomes the template; loser is retired

**Record tests** in [[analytics/]] with dates, variables tested, and results.

---

## Board Maintenance

**Monthly board check**:
- [ ] All boards have ≥ 20 pins (thin boards have lower authority)
- [ ] Board cover image is clean and relevant
- [ ] Board description still uses primary keyword naturally
- [ ] No pins in the board with broken affiliate links (check via Link Manager)

**Quarterly board audit**:
- Review impressions per board
- Kill boards with <50 monthly impressions after 6 months — consolidate content into surviving boards
- Consider creating sub-boards for top-performing niches (e.g. "Home Office Chairs" as a sub-board of "Home Office Setup")
