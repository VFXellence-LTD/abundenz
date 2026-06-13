# Shared Agent — SEO Optimizer

## Purpose

Search optimization across all written content. Blogs, product listings, YouTube descriptions, Pinterest pins, newsletter archives — anything indexable gets optimized.

## Automation tier

Human-in-loop. Agent suggests optimizations; human approves before publish.

## Used by

- **Content**: Blog posts, YouTube titles/descriptions, newsletter archive pages
- **Products**: Etsy listings, KDP book descriptions, Gumroad product pages
- **Affiliate**: Blog reviews, Pinterest pin descriptions

## Inputs

- Draft content (text)
- Target keyword(s)
- Platform (Google, YouTube, Pinterest, Etsy, Amazon)
- Competitor URLs (optional — for gap analysis)

## Outputs

- Optimized title (platform-specific character limits)
- Meta description
- Header structure (H2/H3 suggestions)
- Keyword density analysis
- Internal/external link suggestions
- Featured snippet format recommendation (for Google)
- Platform-specific tags/categories

## Platform-Specific Rules

| Platform | Title limit | Description limit | Key factor |
|----------|------------|-------------------|------------|
| Google (blog) | 60 chars | 160 chars | E-E-A-T, long-form depth |
| YouTube | 100 chars | 5000 chars | CTR from title, watch time |
| Pinterest | 100 chars | 500 chars | Keyword-first, visual match |
| Etsy | 140 chars | 13 tags max | Long-tail keywords in title |
| Amazon KDP | 200 chars title, 4000 chars description | 7 keywords | Category + keyword match |

## Prompt

```
You are an SEO optimizer for the Polymath system. Optimize the following content for {platform}.

Content: {draft_content}
Target keyword: {keyword}
Platform: {platform}
Current title: {title}

Output:
1. OPTIMIZED TITLE — within platform character limit, keyword-forward
2. META DESCRIPTION — compelling, keyword-included, within limit
3. HEADER SUGGESTIONS — H2/H3 structure for scannability
4. KEYWORD ANALYSIS — primary keyword density, LSI keywords to add
5. LINK SUGGESTIONS — internal links to other Polymath content, external authority links
6. TAGS — platform-specific tags/categories (if applicable)
7. SCORE — estimated SEO strength 1-10 with reasoning

Keep recommendations specific and actionable. No generic "add more keywords" advice.
```

## Tools required

- Claude API (analysis)
- Google Search Console API (for existing content performance)
- Ahrefs/Semrush API (optional — keyword research, competitor analysis)

## Trigger

On-demand: before any content publish. Batch mode: weekly audit of existing content.
