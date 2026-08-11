# Agent 08 — Atomizer

## Purpose
The core content automation engine. Takes the edited pillar piece and clean transcript, and generates ALL platform-native derivatives in one pass: blog post, newsletter issue, YouTube Shorts scripts, LinkedIn post, X/Twitter thread, Instagram carousel copy, Pinterest pin descriptions, and Reddit post. Human reviews the full batch before any piece is scheduled.

## Automation Tier
**Human-in-loop** — agent generates all derivatives in one batch. Human reviews the full set, edits individual pieces as needed, approves the batch. Approval triggers Scheduler (Agent 09).

## Inputs
- Clean transcript: `_transcripts/{date}-{slug}-clean.txt`
- Edited audio path: `_recordings/edited/{date}-{slug}-edited.mp3`
- Topic title, pillar, target audience
- Outline (for section structure reference): `_outlines/{date}-{slug}.md`
- SEO target keywords (from Agent 10, if available; otherwise Atomizer generates them)
- Platform-specific style guides: `/shared/platform-guides/{platform}.md`
- Signal content pillars and banned topics: [[brief/niche]], [[brief/banned-topics]]

## Outputs
For each derivative, written to `_derivatives/{date}-{slug}/`:
- `blog-post.md` — 1800-2200 words, SEO-optimized long-form
- `newsletter.md` — 550-700 words, personal/opinionated
- `shorts-scripts.md` — 3-5 short-form scripts (30-60 sec each)
- `linkedin-post.md` — 200-300 words, professional
- `x-thread.md` — 6-10 tweets
- `instagram-carousel.md` — 5-8 slide scripts with copy
- `pinterest-pins.md` — 3-5 pin descriptions
- `reddit-post.md` — community-native, no self-promo feel
- `atomizer-summary.md` — batch summary for human review

Airtable update: one derivative row per output, all linked to parent Content Pipeline row.

## Tools Required
- Claude API (claude-sonnet-4-6) — all content generation
- Airtable API — derivative record creation
- File system write access
- Notification system — batch ready alert to human

## Trigger
Airtable automation: when `edit_status` changes to `complete` on Content Pipeline row → trigger Atomizer.

## Prompt Architecture

The Atomizer runs a series of focused generation prompts, not one mega-prompt. Each derivative gets its own call with shared context injected.

### Shared Context Block (injected into every derivative prompt)

```
## Content identity
Channel: Signal — VFX pipeline engineering for small/mid studios
Audience: pipeline TDs, technical artists, studio supervisors (intermediate-advanced)
Voice: authoritative, conversational, opinionated, production-grounded, no hype
Banned content: beginner tutorials, AI art generation, career advice for newcomers, vendor-sponsored tone

## Source content
Topic: {topic_title}
Pillar: {pillar}
Clean transcript:
---
{transcript}
---
```

---

### Derivative 1 — Blog Post

```
{shared_context}

## Task: Blog Post

Write a 1800-2200 word SEO-optimized blog post based on the transcript.

### Requirements
- Title: Use the main keyword naturally. Under 65 characters. Not clickbait.
- Meta description: 140-155 characters. Summarize value proposition.
- Structure: H2 sections matching transcript structure. H3 subsections where needed.
- Opening paragraph: State the problem or tension immediately. No "In this article..." preamble.
- Code blocks: Reproduce any code mentioned in transcript. Use appropriate syntax highlighting (```python, ```bash, etc.)
- Internal links: Include 2-3 [INTERNAL LINK: {topic}] placeholders for related Signal content
- External links: Link to official docs when referencing tools. Anchor text = descriptive (not "click here")
- Closing paragraph: Summarize main takeaway. One sentence CTA to newsletter or YouTube.
- Word count: 1800-2200 words

### SEO targets
Primary keyword: {primary_keyword}
Secondary keywords: {secondary_keywords}
Keyword density: 1-2% for primary keyword — do not stuff

### Format
Produce clean markdown. No HTML. Code blocks with language specifiers.
```

---

### Derivative 2 — Newsletter

```
{shared_context}

## Task: Newsletter Issue

Write a 550-700 word newsletter issue for Signal's email list.

### Newsletter character
- More personal and opinionated than the blog post
- First-person throughout
- Can include a brief "what I noticed" or "this week's thing that annoyed me" angle
- Not a summary of the pillar video — a parallel take on the same topic with additional opinion
- Ends with a link to the full video/post

### Structure
1. Opening line (1-2 sentences — grab attention immediately)
2. The main insight or argument (200-250 words)
3. A specific example or observation (100-150 words)
4. The "so what" — practical takeaway (100-150 words)
5. Closing: link to full content + one sentence CTA

### Tone notes
- Conversational, direct, occasionally sardonic
- No "This week on Signal..." opener — start with content immediately
- Avoid summarizing the video — if they wanted a summary they'd watch it

### Word count: 550-700 words
```

---

### Derivative 3 — YouTube Shorts Scripts

```
{shared_context}

## Task: YouTube Shorts Scripts

Generate 3-5 standalone short-form scripts from this content. Each should be 30-60 seconds when read aloud.

### What makes a good Short for Signal
- One specific technical tip, observation, or insight per Short
- Starts with a direct statement or question — not "hey, check this out"
- Shows code or terminal output if possible (note in script where to cut to code)
- Ends with a single sentence hook to the main video
- Does NOT require watching the main video to understand — standalone value

### Format for each Short
**Short #{n}**
**Topic:** one-line description
**Duration estimate:** X seconds
**Script:**
{spoken script — note [CUT TO: code/screen] for visual cuts}
**Hook to main:** "{hook line}"

### Extract the most self-contained insights from the transcript — facts, recommendations, warnings, or demonstrations that stand alone without full context.
```

---

### Derivative 4 — LinkedIn Post

```
{shared_context}

## Task: LinkedIn Post

Write a 200-300 word LinkedIn post.

### LinkedIn tone for Signal
- Professional but not corporate — real opinion, not brand voice
- Technical enough to signal expertise without being impenetrable
- First-person throughout
- No "Excited to share..." opener
- No hashtag spam at the end (2-3 relevant hashtags maximum, integrated naturally OR at end)

### Structure
Opening line (bold insight or observation — 1 sentence)
Body: the argument or experience (150-200 words)
Closing: link to full content + direct CTA

### Avoid
- Humble bragging
- Engagement bait questions ("What do YOU think?")
- Generic professional wisdom ("In my experience, collaboration is key")
- More than 3 hashtags
```

---

### Derivative 5 — X/Twitter Thread

```
{shared_context}

## Task: X/Twitter Thread

Write a 6-10 tweet thread.

### Thread structure
Tweet 1: The hook — state the main insight or tension. Must stand alone. Use this as the "quote tweet" standalone.
Tweets 2-8: One point per tweet. Each tweet a complete thought. No tweet is context-dependent on the previous.
Final tweet: CTA — link to full content

### Tweet constraints
- Max 280 characters per tweet
- No hashtag spam — 0-1 hashtag per tweet, only if genuinely relevant
- Technical content: can include short code snippets in code blocks
- No "🧵 thread incoming" opener — that's implicit
- No numbering like "1/" — readers know it's a thread

### Format
[tweet 1]
---
[tweet 2]
---
...
[final tweet — CTA with link placeholder: {video_url}]
```

---

### Derivative 6 — Instagram Carousel

```
{shared_context}

## Task: Instagram Carousel

Write copy for a 5-8 slide carousel.

### Carousel format for Signal
- Slide 1: Cover — bold statement or question. Max 8 words. This is the hook.
- Slides 2-6 (or 2-7): One insight per slide. Clean copy, 20-40 words per slide. Technical but visual — these are paired with code screenshots or diagrams.
- Last slide: CTA — "Full breakdown on YouTube. Link in bio."

### For each slide, provide
**Slide #{n}:**
**Heading:** (bold text, 3-8 words)
**Body:** (20-40 words of copy)
**Visual note:** (what to show on screen — code, diagram, screenshot, text only)

### Notes
- Instagram audience is more visual — copy is shorter here than blog
- Carousel is a teaser — drives to YouTube, not a standalone education piece
- Keep technical depth — but explain less, show more
```

---

### Derivative 7 — Pinterest Pins

```
{shared_context}

## Task: Pinterest Pin Descriptions

Write 3-5 Pinterest pin descriptions.

### Pinterest for Signal
- VFX/tech niche on Pinterest is small but drives long-tail blog traffic
- Pins link to the blog post
- Descriptions are SEO text — include primary and secondary keywords naturally
- Vertical image (1000x1500) — describe the visual concept for each pin

### For each pin
**Pin #{n}:**
**Title:** (max 100 chars — include primary keyword)
**Description:** (max 500 chars — include keywords, describe the value, link destination)
**Visual concept:** (what would the pin image show?)
```

---

### Derivative 8 — Reddit Post

```
{shared_context}

## Task: Reddit Post

Write a Reddit post for r/vfx or r/pipeline.

### Reddit rules for Signal
- Community-first — the post contributes a discussion point, not a content promotion
- Self-promotional feel = immediate downvotes. The content link (if included) must be contextually justified.
- "I made this thing" framing only if the content genuinely solves a problem the community discusses
- Preferred approach: post the insight as a discussion ("we switched from X to Y and here's what we found — curious if others have had the same experience")
- Content link: optional, include only if it provides depth that can't fit in text. Frame as "I did a full breakdown here" not "watch my video."

### Post structure
**Target subreddit:** r/vfx or r/pipeline (specify which fits better)
**Title:** (question or statement — not a headline. Subreddit titles perform better as discussions)
**Body:** (the insight, experience, or question — 150-300 words)
**Content link:** (include if justified — as "for context, here's the full breakdown:" not as a promo)
```

---

## Atomizer Batch Summary Prompt

After all derivatives are generated:

```
You have generated 8 platform-specific derivatives for the Signal content pipeline. Produce a brief batch summary for human review.

For each derivative, note:
1. Whether you had enough transcript content to produce quality output
2. Any derivatives that feel weak and why
3. Any section where you made an editorial choice the human should review

Keep this summary under 200 words. Flag issues clearly. The human will skim this before reviewing the full batch.
```

## Error Handling / Escalation
- Transcript under 1000 words: flag to human — may not have enough content for full derivative set. Offer to skip low-value derivatives (Pinterest, Instagram) and focus on high-value (blog, newsletter, X thread).
- Individual derivative generation failure: retry once, then generate a stub with [DRAFT INCOMPLETE] flag. Do not block the batch.
- Claude API timeout: save partial batch, flag what's complete vs incomplete. Human can trigger re-run for failed derivatives.
- Banned content detected in transcript: flag with timestamp. Do not generate derivatives for that section.

## Build Order Dependency
Requires Agent 05 (Transcriber) output. Can run in parallel with Agent 07 (Thumbnail Generator). Most complex agent — build this fourth, after Transcriber and Topic Researcher are stable.

## Manual Fallback
Without this agent: write each derivative manually. Priority order:
1. Blog post (30-45 min, highest SEO value)
2. Newsletter (15-20 min)
3. X thread (10 min)
4. LinkedIn post (5 min)
5. Everything else (15-20 min total)
Total manual time: 75-90 minutes per pillar. Agent target: under 5 minutes human review time.
