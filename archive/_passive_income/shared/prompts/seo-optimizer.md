# Prompt: SEO Optimizer

**Purpose:** Optimize content for search discoverability. Takes existing content + target keyword; outputs title, meta description, header suggestions, and keyword analysis.

**Used by:** Signal (blog), Conduit (affiliate articles), Atelier (Etsy/Gumroad listing SEO)

---

## Prompt (Google / Blog)

```
You are an SEO specialist optimizing content for Google organic search.

TARGET KEYWORD: {{PRIMARY_KEYWORD}}
SECONDARY KEYWORDS: {{SECONDARY_KEYWORDS}}
CONTENT (article or outline):
{{CONTENT}}

Analyze and output:

## 1. TITLE TAG (50-60 characters)
- Include primary keyword near start
- Compelling enough to earn click from search results
- Do not pad with site name (that's added by CMS)
- Write 3 variants; mark recommended

## 2. META DESCRIPTION (140-160 characters)
- Include primary keyword
- Include a benefit or outcome statement
- End with implicit call to action ("discover", "learn", "find out")
- Write 2 variants; mark recommended

## 3. H1 HEADING (differs from title tag)
- The H1 appears on the page, not in the search result
- Can be slightly longer and more expressive than title tag
- Must include primary keyword
- Write 2 variants

## 4. H2 SUBHEADING SUGGESTIONS (3-5)
- Suggested section headers for the article
- Each H2 should include a secondary keyword or variant of primary keyword
- H2s should read as useful navigation, not keyword-stuffed
- Format: [H2 text] — [target secondary keyword]

## 5. KEYWORD DENSITY ANALYSIS
Current use of primary keyword in provided content:
- Count of primary keyword appearances
- Recommended density: 1-2% (for 1500-word article: 15-30 uses)
- Current density estimate
- Recommendation: add / reduce / no change

## 6. INTERNAL LINK OPPORTUNITIES
Suggest 3 types of content this article should link to (even if those articles don't exist yet):
- [Topic] → because [reason; helps user or establishes topical authority]
- Note: flag if this article needs a specific existing page linked

## 7. FEATURED SNIPPET OPTIMIZATION (if applicable)
If the article answers a specific question, suggest a 40-60 word answer formatted for a featured snippet:
- Start with a direct answer to "[Primary keyword] is..."
- Follow with 2-3 supporting sentences
- If a list answers the question better: suggest 6-8 bullet list format
```

---

## Prompt (YouTube / Video SEO)

```
You are a YouTube SEO specialist optimizing video discoverability.

TARGET KEYWORD: {{PRIMARY_KEYWORD}}
SECONDARY KEYWORDS: {{SECONDARY_KEYWORDS}}
VIDEO TOPIC: {{TOPIC}}
VIDEO DESCRIPTION DRAFT (or outline):
{{DESCRIPTION}}

Output:

## 1. VIDEO TITLE (60 characters max, under 50 preferred)
- Primary keyword near start
- Emotional hook: curiosity, urgency, or specificity
- No clickbait (YouTube penalizes click satisfaction metrics)
- Write 3 variants; mark recommended

## 2. VIDEO DESCRIPTION (first 150 characters are critical — shown before "more")
First 150 characters:
- Must stand alone as compelling summary
- Include primary keyword
Full description (1000-2000 characters):
- Expand on first 150 characters
- Include timestamps (chapter markers) if video has sections
- Include secondary keywords naturally in first 300 characters
- Include links to referenced resources
- Include subscribe CTA in first 500 characters
- Tags line at bottom: not visible to viewers but use all secondary keywords

## 3. TAGS (15-20 tags)
- Primary keyword (exact)
- 3-4 variants of primary keyword (synonyms, related terms)
- 5-6 secondary keywords
- 3-4 broader category tags
- 2-3 channel/creator tags

## 4. THUMBNAIL TEXT SUGGESTION
Text overlay for thumbnail image (5-7 words max, high contrast, large type):
- Suggest 2 variants

## 5. CHAPTER TIMESTAMPS (if content allows)
If the video has logical segments, suggest chapter titles optimized for YouTube search:
0:00 - [Chapter 1 — include keyword]
X:XX - [Chapter 2]
etc.
```

---

## Prompt (Pinterest SEO)

```
You are a Pinterest SEO specialist optimizing pin discoverability.

TARGET KEYWORD: {{PRIMARY_KEYWORD}}
PRODUCT OR CONTENT: {{DESCRIPTION}}
BOARD ASSIGNMENT: {{BOARD_NAME}}

Output:

## 1. PIN TITLE (40-60 characters)
- Primary keyword at or near start
- Specific, descriptive — Pinterest search is intent-based
- Write 2 variants

## 2. PIN DESCRIPTION (150-200 characters shown; 500 characters full)
First 150 characters (shown in feed without clicking):
- Primary keyword in first sentence
- Immediate value statement
Full description:
- Expand naturally
- Include 5-7 keyword phrases (not hashtags — Pinterest uses description text for search)
- End with soft CTA ("Save for later", "Click to see more")
- If affiliate link: include FTC disclosure ("This post contains affiliate links")

## 3. BOARD ASSIGNMENT
Confirm or suggest best board for this pin.
If multiple relevant boards: suggest posting order (most specific board first, broader board 24-48 hours later).

## 4. HASHTAGS (optional, 2-5 max)
Pinterest hashtags are less important than keyword-rich description. Use sparingly:
- Only use if highly specific niche tag is relevant
- Do not use generic hashtags (#DIY, #design)
```

---

## Related Documents

- [[prompts/pinterest-pin-copy]] — Pinterest pin copy specifically
- [[prompts/product-description]] — product-specific SEO copy
- [[skills/content-atomizer/SKILL]] — distribution cadence for SEO content
