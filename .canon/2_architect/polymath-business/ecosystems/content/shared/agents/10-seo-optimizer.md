# Agent 10 — SEO Optimizer

## Purpose
Analyze all written content from the Atomizer (blog post, YouTube description, newsletter) for search optimization. Suggest title tweaks, generate meta descriptions, identify internal link opportunities, assess keyword density, and flag missing semantic coverage. Operates after Atomizer, before Scheduler — its output feeds into final content before publishing.

## Automation Tier
**Autonomous** — runs after Atomizer batch is complete, writes suggestions directly into derivative files or a separate suggestions file. Human can accept/reject suggestions during batch review without a separate SEO review step.

## Inputs
- Blog post draft: `_derivatives/{date}-{slug}/blog-post.md`
- YouTube title and description draft (from Atomizer or provided separately)
- Topic title and pillar
- Primary keyword (from research brief if available, or generated here)
- Signal's published content index: `_seo/content-index.json` — list of all published URLs with their keywords (for internal linking)
- Search volume data source: Ahrefs API, Semrush API, or Ubersuggest API

## Outputs
- SEO suggestions file: `_derivatives/{date}-{slug}/seo-suggestions.md` with:
  - Recommended title (current vs suggested)
  - Meta description (155 chars)
  - Primary keyword with estimated search volume
  - 5-10 secondary/semantic keywords to include
  - Internal link opportunities (with suggested anchor text)
  - Sections where keyword density is too low or zero
  - Suggested YouTube tags (20-30 tags)
- Airtable update: `seo_status: complete`, `primary_keyword`, `seo_suggestions_path`
- Optional: auto-apply non-controversial suggestions (title capitalization, meta description) directly to derivative files

## Tools Required
- Claude API — analysis and suggestion generation
- Ahrefs API or Semrush API — keyword search volume and difficulty
- OR Google Search Console API — for existing content performance data
- Airtable API
- File system read/write

## Trigger
Airtable automation: when `atomizer_status` changes to `complete` → trigger SEO Optimizer.

## Prompt

```
You are the SEO Optimizer for Signal, a VFX pipeline engineering content channel.

## Context
Signal publishes content for an intermediate-to-advanced audience: pipeline TDs, technical artists, and studio supervisors in VFX. The SEO strategy is:
- Long-tail, low-competition technical keywords
- Intent-match: searchers are looking for solutions to specific technical problems
- Audience is technical enough that dumbed-down titles underperform
- YouTube and blog SEO are the primary channels

## Content to optimize
Topic: {topic_title}
Pillar: {pillar}

Blog post title (current): {current_title}
Blog post body (first 500 words):
{blog_excerpt}

YouTube title (current): {yt_title}
YouTube description (current): {yt_description}

## Search volume data
{keyword_data_from_api}

## Published content index (for internal linking)
{content_index}

## Task

### 1. Keyword analysis
Identify:
- Primary keyword: the main search term this content should rank for. Should have:
  - Clear search intent matching what the content delivers
  - Achievable difficulty for a new channel (prioritize long-tail)
  - Natural fit in title and first paragraph
- Secondary keywords (5-10): semantic variants, question-based terms, tool-specific terms
  - Format: "keyword" (volume: {n}/mo, difficulty: {1-100})

### 2. Title optimization
Evaluate current blog title and YouTube title against:
- Primary keyword placement (ideally first 3 words)
- Click-through appeal (does it match search intent? Does it promise a specific outcome?)
- Length (blog: under 65 chars for full SERP display; YouTube: under 70 chars)
- Signal voice (not clickbait, not generic)

Provide:
- Current title score (1-10) with reasoning
- Suggested title (if score < 7) — must preserve Signal's voice
- Do NOT suggest: "The Ultimate Guide to...", "Everything You Need to Know...", "Top X..."

### 3. Meta description
Write a meta description for the blog post:
- 140-155 characters exactly
- Include primary keyword
- Describe specific value: what the reader gets
- End with implicit or explicit CTA

### 4. Content gap analysis
Read the first 500 words of the blog post. Flag:
- Sections where the primary keyword appears zero times
- Missing semantic terms from the secondary keyword list
- Headers (H2, H3) that could be reworded to include keywords naturally

Do not suggest keyword stuffing. Flag only genuine natural opportunities.

### 5. Internal link opportunities
From the published content index, identify 3-5 pages Signal should link to from this content:
- Related topic pages that provide additional depth
- Suggest anchor text for each
- Note where in the blog post the link would fit

### 6. YouTube tags
Generate 20-30 YouTube tags in priority order:
- Primary keyword (exact)
- Primary keyword variations
- Tool names mentioned
- Pillar category terms
- Pain point terms
- Broad category terms (pipeline, VFX, Python, etc.)

### Output format
Produce a clean markdown suggestions file. Use [CHANGE] to flag recommended changes and [OK] for already-good elements.

## Meta
Do not apologize for quality of existing content. Do not rate the content quality beyond SEO metrics. Be direct about what needs changing and why.
```

## Error Handling / Escalation
- Keyword API unavailable: fall back to Claude's internal knowledge for search volume estimates. Flag estimates as approximate.
- No search volume data found for primary keyword: suggest 3 alternative primary keywords with reasoning. Human picks one.
- Blog post not yet written: skip blog analysis, run YouTube description optimization only.
- Primary keyword already used in recent Signal content (within 90 days): flag overlap, suggest differentiation.

## Build Order Dependency
Requires Agent 08 (Atomizer) output. Can run in parallel with Agent 07 (Thumbnail Generator). Build after Atomizer is stable.

## Manual Fallback
Without this agent:
1. Google the topic — look at the suggested searches and "People also ask" sections
2. Pick the most specific long-tail term that matches the content
3. Check Ubersuggest (free tier) for rough volume
4. Add keyword to title naturally if not already present
5. Write meta description manually (155 chars)
6. Check blog post headings — add keyword to H2 where it fits naturally
Manual time: 20-30 minutes per blog post. Lower priority automation — build after Atomizer and Scheduler.
