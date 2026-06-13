# Skill: Content Atomizer

```yaml
name: content-atomizer
description: Takes a single pillar content piece and defines the full derivative matrix — platform-specific formats, tone adaptations, scheduling cadence.
triggers:
  - "Repurpose this content"
  - "What can I make from this [article/video/transcript]?"
  - "Create a content calendar from this piece"
  - After any pillar content is published (Signal primary workflow trigger)
ecosystems: [signal, lullaby, conduit, surge]
```

---

## When to Use

Load when a pillar piece is complete and ready for distribution. One pillar → multiple derivative pieces across platforms. This multiplies reach without multiplying production time.

Primary user: Signal (YouTube video or long-form article as pillar)
Also applicable: Lullaby (episode as pillar), Conduit (review article as pillar), Surge (short-form viral content as pillar)

> **Note:** Surge uses its own atomization system (surge-formula) optimized for short-form viral loops. The content-atomizer skill can still inform the Surge script engine — particularly for derivative scheduling and platform-specific formatting rules — but Surge's primary workflow runs through surge-formula, not this skill.

---

## Derivative Matrix

One pillar piece generates up to 10 derivative pieces. Not all derivatives apply to every pillar — choose based on content type.

| # | Derivative | Format | Primary platform | Production effort |
|---|-----------|--------|-----------------|------------------|
| 1 | Short-form video clip | 60-90s vertical | YouTube Shorts, Instagram Reels, TikTok | Low (clip from existing footage) |
| 2 | X thread | 5-10 tweets | X (Twitter) | Low (extract key points) |
| 3 | LinkedIn post | 300-600 words | LinkedIn | Low-Medium (tone shift required) |
| 4 | Pinterest pin | Title + description + image | Pinterest | Low (keyword-optimized copy) |
| 5 | Instagram carousel | 5-8 slides | Instagram | Medium (visual design required) |
| 6 | Email newsletter | 400-800 words | beehiiv / ConvertKit | Medium (context and CTAs for subscribers) |
| 7 | Reddit post | Varies by subreddit | Reddit | Low-Medium (adapt to community norms) |
| 8 | Excerpt / quote card | Single insight + visual | All platforms | Low (pick most quotable line) |
| 9 | Blog post | 800-2000 words | Own blog / Medium | Medium-High (SEO-optimized expansion) |
| 10 | Podcast clip | Audio excerpt | Podcast feed, Spotify | Low (export from video audio) |

---

## Platform-Specific Rules

### YouTube Shorts

- **Length:** 30-90 seconds (optimal 45-60s)
- **Format:** 9:16 vertical, 1080×1920px
- **Hook:** First 2 seconds must create pattern interrupt — question, bold statement, or visual surprise
- **No intros:** Cut all preamble; start in the action or the insight
- **Captions:** Required (85% watched without sound)
- **Title:** 40-60 characters; start with primary keyword; NOT the YouTube video title

**What clips to select from a pillar video:**
- Standalone insight that works without prior context
- Surprising fact or counterintuitive claim
- Demonstration / visual moment (tool in action, before/after)
- Strong opinion with reasoning

---

### X (Twitter) Thread

- **Length:** 5-10 tweets; optimal 6-8
- **Tweet 1:** Hook tweet — makes a bold claim or poses a question. No "A thread on..." framing.
- **Tweet 2-7:** Supporting points, each self-contained. One idea per tweet.
- **Tweet 8:** Summary / takeaway. Add link to pillar in this tweet, not tweet 1.
- **Format:** Plain text preferred over images for threads. Short paragraphs (2-3 lines max).
- **Character limit:** 280 per tweet (X Blue subscribers can post longer; assume 280)
- **Tone:** Opinionated, direct, slightly provocative. Not a summary — an argument.

**X tone rules for Signal:**
- First person perspective throughout
- No hedging ("it seems like", "possibly", "might")
- Active voice
- Numerical specifics (not "a lot of studios" → "studios paying $2k/day")

---

### LinkedIn Post

- **Length:** 300-600 words (1200 characters minimum for "see more" to trigger)
- **Format:** Plain text; line breaks every 1-3 sentences for mobile readability
- **Hook line:** First 2 lines visible before "see more" — must compel the click
- **Structure:** Hook → Context → Insight → Implication → CTA (soft: "What's your experience with X?")
- **Tone:** Professional but not corporate. Personal story angle works well. First person.
- **No promotional language:** LinkedIn audience is professional; avoid "buy my course" energy in organic posts
- **Hashtags:** 3-5 max, at end, relevant to niche not generic (#content, #business = useless)

**LinkedIn vs X tone difference:**
- X: "Studios are hiring the wrong people to build pipelines. Here's why."
- LinkedIn: "After 10 years building VFX pipelines, I've noticed a pattern in what separates studios that scale from ones that constantly fight fires."

Same idea. Different register.

---

### Pinterest Pin

- **Pin title:** 40-60 characters, primary keyword near start
- **Pin description:** 150-300 characters (visible), 500 characters total. Keyword-dense, not keyword-stuffed. Natural sentence structure.
- **Image:** 1000×1500px (2:3 ratio) — the dominant format on Pinterest
- **Text overlay on image:** Title or key insight; large, high-contrast text; readable at thumbnail
- **Tone:** Helpful, informational, aspirational — Pinterest is a search/discovery engine, not a social network. Write as if answering "how do I [topic]?" or "what is [topic]?"

**Board assignment:**
- Every pin goes on the most-specific-relevant board first
- Also pin to a broader topic board after 24 hours
- For Conduit: pin to affiliate-product-specific board

---

### Instagram Carousel

- **Slides:** 5-8 (optimal 7)
- **Dimensions:** 1080×1080px (square) or 1080×1350px (4:5 portrait — better reach)
- **Slide 1:** Hook / title — what will the reader learn?
- **Slides 2-6:** One point per slide. Minimal text (10-15 words max per slide). Visual-first.
- **Slide 7:** Summary / CTA — "Save this for later" or "Follow for more [topic]"
- **Caption:** 150-200 words. Expand on slide content. Include hashtags (10-20 for discovery).
- **Format:** JPEG or PNG; consistent visual style across all slides

---

### Email Newsletter

- **Length:** 400-800 words (Signal subscribers opted in for depth; longer is fine if valuable)
- **Format:** Plain text or minimal HTML; avoid heavy graphics in email body (deliverability)
- **Subject line:** 40-60 characters; test curiosity vs. clarity framing
- **Preview text:** 85-100 characters; appears after subject line in inbox
- **Structure:** Personal opener (1-2 sentences) → Pillar insight summary (3-4 paragraphs) → Link to full piece → CTA (reply, share, or product)
- **Tone:** More conversational than public content. Subscribers are "insiders." Acknowledge them as such.

---

### Reddit Post

- **Subreddit first:** Match content to the right subreddit before writing
- **Title:** Must match subreddit culture; avoid promotional framing. Question format often works. "Has anyone solved [problem]?" or "Here's how I approached [topic]"
- **Format:** Long-form text post (not link post) performs better for trust
- **No self-promotion in body:** First post in a subreddit should be pure value. Links come later in comments, if at all.
- **Tone:** Humble, community-member voice. NOT brand voice.

**Subreddits by ecosystem:**
- Signal (VFX pipeline): r/vfx, r/Maya, r/Houdini, r/computergraphics, r/Python
- Conduit: niche-specific subreddits for products being promoted
- Lullaby: r/beyondthebump, r/parenting, r/toddlers

---

## Scheduling Cadence

When to post each derivative relative to pillar publish date:

| Derivative | When to post |
|-----------|-------------|
| Pillar (YouTube/blog) | Day 0 |
| X thread | Day 0 (same day, within 2 hours of pillar) |
| Email newsletter | Day 0 (same day; email list first-look framing) |
| Quote card | Day 1 (24 hours after pillar) |
| Instagram carousel | Day 2-3 |
| LinkedIn post | Day 3-4 (midweek performs best: Tue-Thu) |
| Pinterest pin | Day 3-5 (Pinterest content lives long; exact timing less critical) |
| YouTube Short (clip 1) | Day 7 (1 week after pillar to not cannibalize) |
| YouTube Short (clip 2) | Day 14 |
| Reddit post | Day 7-14 (wait until you've contributed elsewhere in subreddit first) |
| Blog post (expansion) | Day 14-30 (SEO timing; give YouTube a head start) |

---

## How to Run

Paste this into Claude with your pillar content:

```
Using the Content Atomizer skill, create a derivative plan for this pillar:

ECOSYSTEM: [Signal / Lullaby / Conduit]
PILLAR TYPE: [YouTube video / blog post / podcast episode / newsletter]
PILLAR TITLE: [title]
PILLAR SUMMARY OR TRANSCRIPT:
[paste content or summary]

AVAILABLE PLATFORMS: [list which platforms are active for this ecosystem]

For each applicable derivative:
1. Write the actual derivative content (X thread, LinkedIn post, pin description, etc.)
2. Specify the exact platform specs (dimensions, character limits met)
3. Suggest the post date relative to pillar publish (Day 0, 3, 7, etc.)
4. Flag any derivatives that require visual design (carousel slides, pin image)

Do not write derivatives for platforms not in the AVAILABLE PLATFORMS list.
```

---

## Visual Requirements by Platform

| Platform | Derivative | Dimensions | Format | Tool |
|----------|-----------|-----------|--------|------|
| YouTube | Short clip | 9:16, 1080×1920 | MP4 H.264 | CapCut, DaVinci Resolve |
| Instagram | Carousel slide | 1:1 1080×1080 or 4:5 1080×1350 | JPEG/PNG | Canva |
| Pinterest | Pin image | 2:3 1000×1500 | JPEG/PNG | Canva |
| X | Quote card | 1:1 1200×1200 | JPEG/PNG | Canva |
| LinkedIn | No image required | — | Text post | — |
| Email | No images | — | Plain text | beehiiv composer |

---

## Related Documents

- [[prompts/content-repurposer]] — Claude prompt for repurposing long-form content
- [[prompts/pinterest-pin-copy]] — Pinterest-specific copy generation
- [[skills/niche-locker/SKILL]] — evaluate niche before building content strategy
