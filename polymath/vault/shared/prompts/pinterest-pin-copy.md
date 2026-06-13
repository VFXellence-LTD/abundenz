# Prompt: Pinterest Pin Copy Generator

**Purpose:** Generate keyword-optimized pin titles and descriptions. Pinterest is the primary organic traffic driver for Conduit affiliate products and Atelier digital downloads.

**Used by:** Conduit (affiliate pins), Atelier (product listing pins), Signal (content distribution)

---

## Core Prompt

```
You are a Pinterest SEO specialist writing pin copy for {{ECOSYSTEM}}.

PRODUCT OR CONTENT: {{PRODUCT_OR_CONTENT_DESCRIPTION}}
PRIMARY KEYWORD: {{PRIMARY_KEYWORD}}
SECONDARY KEYWORDS: {{SECONDARY_KEYWORD_LIST}}
AFFILIATE LINK: {{URL_OR_"none"}}
BOARD: {{BOARD_NAME}}

Write:

## PIN TITLE (40-60 characters, 100 max)
- Start with primary keyword
- Specific and descriptive — not clever, not vague
- Pinterest is a search engine; write for search intent, not virality
- Example of bad title: "This changed everything for me ✨"
- Example of good title: "Minimalist Botanical Wall Art | Printable 8x10"

## PIN DESCRIPTION (full, 500 characters max)
Requirements:
- Primary keyword in first sentence
- Include 5-7 secondary keyword phrases naturally in body (not hashtags)
- One clear benefit or outcome statement
- If affiliate: include "This post contains affiliate links." at end
- If Conduit: include disclosure FIRST LINE if linking to affiliate product

First 150 characters (displayed without click — make these count):
[Draft the first 150 characters separately so they work as standalone]

Full description:
[Full 500-character version]

## BOARD ASSIGNMENT
Primary board: [most specific]
Secondary board (re-pin 48 hours later): [broader category]

## FTC DISCLOSURE (if affiliate)
Exact disclosure text to include:
"This pin contains affiliate links. I may earn a small commission if you purchase through my link, at no extra cost to you."
```

---

## Prompt: Batch Pin Generation (Atelier Product Launch)

When launching a new Atelier product, generate 5 pin variants for A/B testing and board variety:

```
You are a Pinterest SEO specialist generating 5 pin variants for a product launch.

PRODUCT: {{PRODUCT_NAME}}
PRODUCT TYPE: {{DIGITAL_DOWNLOAD / POD / PRINT}}
PRIMARY KEYWORD: {{PRIMARY_KEYWORD}}
SECONDARY KEYWORDS: {{LIST}}
PRODUCT URL: {{URL}}

Generate 5 pin variants. Each variant should:
- Target a different buyer intent or use case
- Use a different title framing
- Have slightly different description emphasis

Variant 1: Gift angle — who is this a gift for?
Variant 2: Problem/solution — what problem does this solve?
Variant 3: Aesthetic/style — emphasize visual appeal and style description
Variant 4: Occasion — tie to a specific use case or life moment
Variant 5: Feature-focused — lead with a specific feature or spec

For each variant provide:
- Title (40-60 characters)
- First 150 characters of description
- Full description (up to 500 characters)
- Suggested board

No affiliate disclosure needed for Atelier owned products.
```

---

## Pinterest SEO Rules (Do / Don't)

| Do | Don't |
|----|-------|
| Include primary keyword in first 3 words of title | Start with "Check out" or "I love" |
| Use specific descriptive language | Use generic terms (#wallart vs "minimalist botanical line art") |
| Write descriptions for search bots AND humans | Write descriptions only for visual appeal |
| Re-pin to multiple boards in sequence (specific first) | Pin to same board repeatedly |
| Include 5-7 keyword phrases in description | Stuff keywords awkwardly |
| Link to a real product or useful page | Link to homepage |
| Vertical image (2:3 ratio) | Horizontal or square images (lower reach) |
| High contrast text overlay if adding text | Small or low-contrast text (unreadable in feed) |

---

## Affiliate Pin Compliance (Conduit)

Pinterest allows affiliate links. FTC requires disclosure.

**Required disclosure placement:**
- In the description before the product description begins OR
- At end of description — not buried

**Compliant:**
> "Affiliate link: I earn commission on purchases at no cost to you. [Product description and pin copy...]"

**Compliant:**
> "[Pin copy here...] Note: this is an affiliate link."

**Non-compliant:**
> "[Pin copy...] #ad" (hashtag disclosure does not satisfy FTC for Pinterest)

**Non-compliant:**
> No disclosure at all on an affiliate link

---

## Seasonal Pin Calendar (Trigger Dates)

Schedule seasonal pins 2-3 weeks before the event peak. Pinterest traffic for seasonal content peaks BEFORE the holiday — users plan ahead.

| Event | Pin launch date | Peak traffic |
|-------|----------------|-------------|
| Valentine's Day (Feb 14) | Jan 22 | Feb 1-10 |
| Mother's Day (2nd Sunday May) | April 20 | May 1-7 |
| Back to School (Aug-Sep US) | July 15 | Aug 1-20 |
| Halloween (Oct 31) | Oct 1 | Oct 15-28 |
| Christmas/Holiday | Nov 1 | Nov 15 - Dec 15 |
| New Year | Dec 15 | Dec 26 - Jan 2 |
| Spring home decor | Feb 15 | Mar 1 - Apr 15 |

Atelier seasonal strategy: create product variants and new listings for top 3-4 seasons per year. Run seasonal pin campaigns 3 weeks prior.

---

## Image Specs Reminder

| Format | Dimensions | Notes |
|--------|-----------|-------|
| Standard pin | 1000×1500px (2:3) | Preferred; highest reach |
| Square pin | 1000×1000px (1:1) | Use for some product categories |
| Long pin (avoid) | 1000×2100px+ | Cropped in feed; avoid |
| Video pin | 9:16 vertical, up to 60s | Strong reach boost when used |

---

## Related Documents

- [[prompts/seo-optimizer]] — broader SEO framework including Pinterest section
- [[prompts/product-description]] — product-specific copy this pin drives traffic to
- [[skills/content-atomizer/SKILL]] — Pinterest pin is Derivative #4 in the atomizer matrix
