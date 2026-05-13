# Atelier Workflow: KDP Book Publishing Pipeline

Status: PARKED — ready to execute when Atelier activates.

---

## Pipeline Overview

```
[01 Niche Researcher] → underserved KDP category + keyword data
         ↓
[02 Design Generator] → interior pages + cover artwork
         ↓
[03 Listing Optimizer] → title, subtitle, description, keywords, categories
         ↓
[HUMAN REVIEW GATE] → quality check, 5-10 min per title
         ↓
[04 Publisher] → KDP upload (semi-manual; see Publisher notes)
         ↓
[05 Analytics] → daily sales/BSR tracking, monthly P&L
```

---

## Phase 1: Niche Research

**Agent:** [[agents/01-niche-researcher]]

**Goal:** Find a specific KDP sub-niche where:
- Top 3 results BSR < 100,000 (a book at BSR 100k sells ~1-3 copies/day)
- Top competitors have < 100 reviews
- No dominant brand owns the space
- Keyword monthly search volume > 1,000 (use Publisher Rocket or AMZScout)

**Market Gaps method (primary approach):**

1. Start with an audience identity (e.g., "nurses", "new parents", "sobriety community")
2. Combine with an activity (e.g., "daily planner", "gratitude journal", "coloring book")
3. Add an aesthetic or specificity layer (e.g., "watercolor botanical", "for 100-day milestone", "for left-handed people")
4. Search Amazon for that exact phrase
5. Examine BSR and review count of first 5 results
6. If gap confirmed: research keyword volume and proceed

**Data to collect per opportunity:**
- Primary keyword + monthly search volume
- Top 5 competitor ASINs + their BSR + review count
- Estimated monthly sales for top competitor (use Publisher Rocket lookup or estimate from BSR table)
- Suggested price point (from competitor analysis)
- Trim size most common in category
- Page count most common in category

---

## Phase 2: Interior Design

**Agent:** [[agents/02-design-generator]]

**Product types and specs:**

### Journals / Planners

Interior structure (example: 90-day sobriety tracker):
- Page 1: Introduction / how to use this journal
- Pages 2-91: Daily spread (date field, mood check, 3 gratitude prompts, 3 accomplishments, evening reflection, water intake tracker)
- Pages 92-93: Milestone celebration pages (day 30, 60, 90)
- Pages 94-96: Notes / free writing space
- Page 97: Back matter / about

**Layout tool:** Canva or Adobe InDesign (Canva for speed)

**Interior PDF specs:**
- Trim size: 6×9in is standard for journals (1800×2700px at 300dpi)
- Other common sizes: 5×8in, 7×10in, 8.5×11in
- Page count: 100-120 pages minimum for journals (less feels thin)
- Color: black & white interior (print cost ~$0.10/page for B&W vs ~$0.65/page color)
- Bleed: 0.125in on all sides if using background elements
- Margins: 0.5in outside, 0.75in inside (gutter), 0.75in top, 0.75in bottom

**AI generation for interior elements:**
```
Midjourney prompt for decorative journal page element:
"Minimal botanical line drawing, single fern frond, fine black lines, white background, suitable for journal page header, clean simple --ar 6:1 --style raw --v 6"
```

Generate 10-15 header/footer elements per interior theme. Use across pages for visual consistency.

### Coloring Books

**Prompt template:**
```
Coloring book page, intricate [SUBJECT] illustration, black outline only, white background, no gray fills or shading, detailed line art, suitable for adult coloring book, clean lines --ar 8.5:11 --v 6
```

**Interior specs:**
- Trim size: 8.5×11in (most common for adult coloring books)
- Page count: 50 pages minimum, 100 pages for premium price point
- Single-sided only (coloring bleeds through most paper; KDP standard paper is thin)
- Enforce white background — no gray areas in generated images (re-prompt if needed)
- Every page must be a distinct illustration (not the same prompt repeated)

**Coloring book AI generation workflow:**
1. Generate 60 images (expecting 30% pass quality review)
2. Review: reject images with gray fills, blurry lines, or text artifacts
3. Keep 40-50 for a 50-page book (some pages = chapter headers or quote pages)
4. Upscale via Real-ESRGAN anime model (preserves crisp line art)
5. Convert to PDF via ImageMagick

### Activity Books (Word Search, Puzzles)

**Word search generation:** Do not use AI image tools — use a word search generator script.

```python
# Simple word search generator (Python)
# Install: pip install word-search-generator
from word_search_generator import WordSearch
from word_search_generator.config import level

ws = WordSearch("cat, dog, bird, fish, hamster, rabbit, turtle, snake", level=2)
ws.save(path="word_search_page.pdf", format="PDF")
```

**Sudoku generation:**
```python
# Install: pip install py-sudoku
from sudoku import Sudoku
puzzle = Sudoku(3).difficulty(0.5)  # 0.0 = hardest, 1.0 = easiest
puzzle.show()  # Render and save to PDF
```

For activity books, batch-generate 100 puzzles, select 50-80 for interior.

---

## Phase 3: Cover Design

**Agent:** [[agents/02-design-generator]]

**Cover specs (KDP):**
- KDP provides exact cover template based on page count and trim size
- Download template from KDP cover template download tool
- Front cover: most important — must be clear at thumbnail size (200px wide)
- Spine: text must fit; spine width = page count × 0.002252in (B&W paper)
- Back cover: short description, barcode space (KDP adds barcode automatically)

**Cover generation workflow:**
1. Generate 10 cover background illustrations via Midjourney
2. Select top 2
3. Import into Canva; apply KDP cover template as guide layer
4. Add title, subtitle, author name using Canva typography
5. Export as high-resolution PDF (flatten all layers)
6. Verify: title readable at thumbnail size (resize Canva preview to 200px wide and check)

**Cover AI prompt template:**
```
Book cover background illustration, [SUBJECT/THEME], [COLOR PALETTE], [STYLE: watercolor/botanical/geometric/minimalist], no text, book cover composition, hero image with space at top for title text, clean professional publishing quality --ar 6:9 --v 6
```

---

## Phase 4: Listing Optimization

**Agent:** [[agents/03-listing-optimizer]]

**KDP-specific outputs:**
- Title (primary keyword must appear in title or subtitle)
- Subtitle (keyword-rich, 50-100 characters)
- Description (4000 char max, HTML optional but stripped in some views)
- 7 keyword strings (50 char max each; do not repeat title/subtitle words)
- 2 BISAC categories (choose the most specific available sub-category)
- Suggested price ($7.99-$14.99 for most low-content; adjust per competitor analysis)

**KDP keyword strategy:**
- Keywords 1-3: high-volume head terms (verify with Publisher Rocket)
- Keywords 4-5: long-tail buyer-intent phrases ("gifts for nurses who love yoga")
- Keywords 6-7: audience/occasion descriptors ("christmas gift planner", "birthday journal for women")
- None should repeat words already in title or subtitle

---

## Human Review Gate

Before KDP upload, owner reviews:

- [ ] Interior PDF: open and check 5 random pages — do layouts look professional?
- [ ] Cover: is title readable at thumbnail size? Does it look like a real published book?
- [ ] No AI artifacts (distorted text, weird limbs, melted faces in any illustration)
- [ ] Page count is correct (as specified in listing copy)
- [ ] AI disclosure checked: confirm AI-generated images disclosure will be checked at upload
- [ ] Pricing makes sense (check KDP royalty calculator — verify net royalty is acceptable)

Approve → proceed to Publisher upload
Reject → return to Design Generator with specific notes

---

## Phase 5: KDP Upload (Semi-Manual)

**Agent:** [[agents/04-publisher]] (prepares package; owner executes upload)

**Upload checklist:**
1. Log in to kdp.amazon.com
2. Create new paperback title
3. Enter: title, subtitle, author (pen name — use consistent pen name per niche or per shop)
4. Language: English
5. Series info: skip unless part of a series
6. Edition number: skip
7. ISBN: use KDP-assigned free ISBN
8. Publication date: today
9. Upload interior PDF
10. Upload cover PDF
11. Content disclosure: check AI-generated images if applicable
12. Territory: Worldwide
13. Distribution channels: Amazon + Expanded Distribution (recommended)
14. Pricing: set per listing optimizer recommendation; verify royalty in calculator
15. Submit for review (typically 72 hours to approval)

**Pen name strategy:**
- Use a consistent pen name within each niche (e.g., "M. Harper" for wellness journals, "River Studio" for coloring books)
- Do not use a real person's name
- Pen name is not Atelier branding; it's a marketplace shelf identity within KDP

---

## Phase 6: Analytics and Iteration

**Agent:** [[agents/05-analytics]]

**KDP-specific tracking:**
- BSR (Best Sellers Rank) — check weekly; fluctuates daily but trend matters
- KENP (Kindle Edition Normalized Pages) read — only relevant if enrolled in KDP Select
- Sales by day — KDP reports lag by 24-48 hours
- Royalty rate — verify net royalty per sale matches expected (70% on $2.99-$9.99; 35% outside that range in US; 35% on Expanded Distribution)

**Iteration signals:**
- BSR < 100,000 within 30 days: book is selling; create 2-3 variations in same niche
- BSR > 500,000 after 60 days: review and optimize listing; if no improvement in 30 more days, kill
- Price testing: try ±$1 on price after 30 days if conversion low

---

## Trim Sizes Reference

| Format | Trim Size | Use Case |
|--------|-----------|----------|
| Standard journal | 6×9in | Journals, planners, dot grid notebooks |
| Compact | 5×8in | Pocket journals, smaller planners |
| Large | 7×10in | Workbooks, planners with more space |
| Letter | 8.5×11in | Coloring books, activity books, workbooks |
| Square | 8×8in | Photo books, art journals |

---

## Pricing Strategy for KDP

| Price | Royalty rate (US) | Typical for |
|-------|-----------------|------------|
| $2.99-$9.99 | 70% | Short journals, basic coloring books |
| $10-$14.99 | 70% or 35% | Premium journals, large coloring books |
| <$2.99 | 35% | Loss leader; not recommended |

**Print cost reference (US, B&W standard paper):**
- 6×9in, 100 pages: ~$2.15
- 6×9in, 200 pages: ~$3.65
- 8.5×11in, 100 pages: ~$3.65
- 8.5×11in, 200 pages: ~$6.15

Net royalty = (price × royalty %) - print cost

Example: $9.99 coloring book (8.5×11, 100 pages): (9.99 × 0.70) - 3.65 = **$3.34 per sale**

---

## Related Documents

- [[agents/01-niche-researcher]] — KDP market gap scanning
- [[agents/02-design-generator]] — interior and cover generation
- [[agents/03-listing-optimizer]] — KDP metadata and copy
- [[agents/04-publisher]] — upload package preparation
- [[agents/05-analytics]] — BSR and royalty tracking
- [[brief/marketplace-policies]] — KDP AI disclosure requirements
- [[brief/product-niches]] — KDP niche evaluation
