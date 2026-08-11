# Signal — Content Format Library

Format specifications for all Signal content types. Each format entry includes: platform specs, ideal length, posting frequency, and an example of how a topic adapts to the format.

Example topic used throughout: **"Naming conventions that break when you have 200 shots"**

---

## Format 01: Pillar Video (Long-Form)

**What it is:** The anchor content piece. Voice-recorded, talking head or screen share, delivered to YouTube as the primary platform.

**Platform:** YouTube (primary). Also repackaged as podcast audio.

**Ideal length:** 8-15 minutes
- 8 min: tight, single concept, no demos
- 12 min: concept + code walkthrough
- 15 min: concept + extended demo or comparison

**Technical specs:**
- Video: 1920x1080, 30fps minimum (60fps preferred for screen share)
- Audio: 44.1kHz, 24-bit, -16 LUFS normalized, MP3 320kbps export
- Thumbnail: 1280x720, JPG, < 2MB
- Captions: auto-generated via YouTube, manually reviewed for technical terms
- Chapters: added via YouTube description timestamps

**Posting frequency:** 3x/week (Mon/Wed/Fri recording, staggered release)

**YouTube description template:**
```
[150-word plain-English summary of the content]

In this video:
[00:00] Introduction
[01:30] [Section 1]
[04:15] [Section 2]
...

Links:
- [Any tools mentioned with official URLs]

📬 Newsletter: [url] — weekly deep dives
📝 Full write-up: [blog url]
```

**Example adaptation:**
- Title: "The naming convention that breaks at 200 shots (and what to do instead)"
- Format: Screen share — show a real folder structure, then walk through what breaks
- Hook: "I've seen this exact mistake at four different studios. It looks fine until you're six weeks into production."

---

## Format 02: YouTube Shorts

**What it is:** A self-contained 30-60 second technical tip, observation, or demonstration. Derived from the pillar but works standalone. Distributes via Shorts feed (different algorithm than long-form).

**Platform:** YouTube Shorts (primarily). Repurposed to Instagram Reels, TikTok if viable.

**Ideal length:** 30-60 seconds
- 30 sec: single sharp observation or tip
- 45 sec: tip + one example
- 60 sec: tip + example + where-to-learn-more hook

**Technical specs:**
- Video: 1080x1920 (vertical), 30fps
- Captions: burned-in preferred (Shorts audience watches without sound more often)
- No custom thumbnail (YouTube selects frame automatically for Shorts)

**Posting frequency:** 1 Short per day (3 Shorts per pillar, 9 per week at 3 pillars/week)

**Script structure:**
```
[Opening statement — no greeting] (5 sec)
[The insight or tip] (20-40 sec)
[One concrete example] (10-20 sec)
[Hook: "full breakdown in the video"] (5 sec)
```

**Example adaptation:**
- "Here's the naming convention mistake I see most often in small studios. Shot names with underscores work fine at 20 shots. At 200, your file system sorts them wrong, your scripts break, and your renders go to the wrong folder. Use hyphens. Full breakdown in the video."
- Duration: ~35 seconds

---

## Format 03: Blog Post

**What it is:** Long-form written version of the pillar, SEO-optimized for search. Not a transcript — a parallel written piece covering the same topic with different structure.

**Platform:** Ghost (self-hosted, own domain). Google indexes this.

**Ideal length:** 1800-2200 words

**Structure:**
1. Opening paragraph: state the problem or tension (no preamble)
2. H2 sections: 3-5 sections matching pillar structure
3. Code blocks: reproduce all code mentioned in video
4. Closing: summary + newsletter CTA

**Technical specs:**
- Markdown, published via Ghost API
- Featured image: thumbnail repurposed (1280x720)
- Meta description: 140-155 characters, includes primary keyword
- URL slug: `{keyword}-{year}` format (e.g., `/vfx-naming-conventions-2025`)
- Category: matching content pillar

**Posting frequency:** 3x/week (one per pillar, published same day as YouTube video)

**SEO approach:**
- One primary keyword per post, 1-2% density
- Long-tail technical terms preferred (low competition)
- Internal links to 2-3 related posts
- External links to official docs (opens in new tab)

**Example adaptation:**
- Title: "VFX Shot Naming Conventions That Don't Break in Production"
- Primary keyword: "vfx shot naming convention"
- Opening: "At some point in every studio's first year of production, someone creates a naming convention that makes sense at 10 shots and falls apart at 100. Here's how to build one that doesn't."

---

## Format 04: Newsletter Issue

**What it is:** A shorter, more opinionated take on the week's topic. Not a summary of the video — a parallel piece with a more personal angle. The newsletter is the highest-trust touchpoint.

**Platform:** Beehiiv (primary). Delivered via email.

**Ideal length:** 550-700 words

**Structure:**
1. Opening line: strong first sentence — grab attention immediately
2. Main argument or insight (200-250 words)
3. Specific example or observation (100-150 words)
4. The "so what" — practical takeaway (100-150 words)
5. Closing: link to full YouTube video + one-line CTA

**Character:** More personal and opinionated than the blog. Can include frustration, humor, or opinion not in the video. First-person throughout.

**Posting frequency:** 3x/week (one per pillar, sent Wednesday per release schedule)

**Free vs paid tiers:**
- Free: full newsletter, every issue
- Paid ($8/mo or $80/yr): additional monthly "deep dive" — long-form written breakdown, annotated code, Q&A digest from comments

**Example adaptation:**
- Subject line: "The naming convention argument you need to have before you start production"
- Opening: "No studio ever regrets the time they spent on naming conventions before a production starts. Every studio regrets the time they didn't."
- Angle: more opinionated than blog — "here's what I'd tell you if you asked me in person"

---

## Format 05: LinkedIn Post

**What it is:** A professional-tone post presenting the key insight from the pillar. Targets Persona 2 (Decider) and Persona 4 (Operator) — the management-layer audience that spends more time on LinkedIn.

**Platform:** LinkedIn

**Ideal length:** 200-300 words

**Structure:**
- Opening line: bold statement or observation (gets shown in preview — must work standalone)
- Body: argument or experience (150-200 words)
- Closing: link to full content + one-line CTA
- Hashtags: 2-3 maximum, placed at end or integrated naturally

**Tone:** Professional but direct. Not corporate. No hollow affirmations. No humble brag.

**Posting frequency:** 3x/week

**What to avoid:**
- "Excited to share..."
- "Thoughts?" at the end
- "In my experience, collaboration is key" — generic professional wisdom
- Self-congratulatory framing

**Example adaptation:**
- Opening: "Most VFX studio naming conventions are designed for the first 20 shots of a project."
- Body: "By shot 100, the folder sorts wrong. Scripts break. Render jobs go to the wrong path. This isn't a scripting problem — it's a design problem that baked in assumptions about project scale that nobody stated out loud..."
- Closing: "Full breakdown in the video. Link in comments."

---

## Format 06: X/Twitter Thread

**What it is:** A series of connected but independently-readable tweets covering the pillar's key insights. Optimized for technical content sharing on X.

**Platform:** X (Twitter)

**Ideal length:** 6-10 tweets

**Tweet constraints:**
- 280 characters max per tweet
- Tweet 1 must stand alone (used for quote-tweets, link shares)
- No "🧵 Thread incoming" — implicit
- Code snippets in code blocks where < 280 chars; link to GitHub gist for longer code
- 0-1 hashtags per tweet, only if genuinely relevant

**Structure:**
- Tweet 1: The main insight or tension — the standalone hook
- Tweets 2-8: One insight per tweet, each a complete thought
- Final tweet: Link to full content with 1-sentence context

**Posting frequency:** 3x/week

**Example adaptation:**
```
[Tweet 1] The naming convention that works for 20 shots will break at 200. Here's why.

[Tweet 2] Most studios use: ProjectName_ShotNumber_TaskType_Version
At 20 shots: fine. At 200: your file system sorts shot_10 before shot_2.

[Tweet 3] The sort problem isn't cosmetic. Automation scripts that process shots in sequence will process them out of order. Render submissions go to wrong paths.

[Tweet 4] Fix: zero-pad your shot numbers. SH010, SH020, SH030. Now file systems sort correctly.

[Tweet 5] Better fix: use a 4-digit sequence from the start. SH0010, SH0020. Gives you 9990 shots before you run out of namespace.

[Tweet 6] Best fix: separate the naming decision from the numbering decision. The name is human-readable. The number is machine-readable. Design for both independently.

[Tweet 7] Full breakdown of naming conventions that survive 200+ shots: [video link]
```

---

## Format 07: Instagram Carousel

**What it is:** A 5-8 slide visual post. More visual, shorter copy than blog. A teaser that drives to YouTube or blog. Tech audience on Instagram responds to code screenshots and workflow diagrams.

**Platform:** Instagram

**Ideal length:** 5-8 slides

**Slide specs:**
- 1080x1080 (square) or 1080x1350 (portrait — more screen real estate)
- Dark background (Signal visual identity)
- Text: large, readable, JetBrains Mono for code, Inter for body
- Code snippets: screenshot from IDE (dark theme)

**Slide structure:**
- Slide 1: Cover — bold statement or question, 3-8 words
- Slides 2-6: One insight per slide (20-40 words + visual)
- Last slide: CTA — "Full breakdown on YouTube. Link in bio."

**Posting frequency:** 3x/week (offset from YouTube day by 1 day)

**Example adaptation:**
```
Slide 1: "Your naming convention is broken. You just don't know it yet."
Slide 2: [code screenshot] "SH10 sorts before SH2. File systems don't do numeric sort."
Slide 3: "Zero-padding fixes sorting: SH010, SH020..."
Slide 4: "But shot 10 vs shot 010 in your tracker? Now your database and file system disagree."
Slide 5: "The fix isn't clever padding. It's designing the human and machine namespaces separately."
Slide 6: "Full breakdown: link in bio."
```

---

## Format 08: Pinterest Pin

**What it is:** A vertical image with text overlay linking to the blog post. Pinterest is a long-tail search engine — pins drive traffic to blog posts months after creation. Low effort, evergreen value.

**Platform:** Pinterest

**Pin specs:**
- 1000x1500 pixels (2:3 ratio)
- Text overlay: title + brief description
- Dark background with Signal visual style
- Link: to blog post URL

**Ideal length:** 3-5 pins per pillar (different visual treatments of same content)

**Description:** 100-500 characters, includes primary keyword naturally

**Posting frequency:** 3-5 pins per pillar, spread across Fri-Sat (Pinterest's peak discovery window)

**Example adaptation:**
- Pin 1: "VFX shot naming conventions — why they break at 200 shots and how to fix it" → blog post link
- Pin 2: Code screenshot of the zero-padding fix with description "Python snippet for zero-padded VFX shot naming" → blog post link
- Pin 3: Diagram showing human vs machine namespace design → blog post link

---

## Format 09: Reddit Post

**What it is:** A community-native post that contributes a discussion point, experience, or question to the relevant subreddit. Not a promotion — a genuine community contribution that happens to reference Signal content where appropriate.

**Platform:** r/vfx, r/pipeline, r/houdini (context-dependent)

**Ideal length:** 150-300 words body

**Framing options:**
1. "I noticed this at multiple studios" — observation-as-discussion
2. "We solved this problem, here's what we did" — case study
3. "Curious if others have hit this" — genuine question
4. "For anyone who's set up X, here's what took me longest" — help-post format

**Content link policy:** Include only if the post genuinely warrants a "I wrote this up in detail here" reference. Do not post a Reddit summary whose only purpose is to drive to YouTube.

**Posting frequency:** 1 per pillar, posted Monday (allows the week's Reddit discussion to build)

**Example adaptation:**
- Title: "What naming convention actually survives 200+ shots? (not a poll — sharing what worked for us)"
- Body: describe the problem, describe what they tried, describe what worked, mention that they did a detailed breakdown "for anyone who wants to see the specific code"
- Tone: peer-to-peer, not promotional

---

## Format 10: Podcast (Audio Repackage)

**What it is:** The edited audio of the pillar video, published to RSS as an audio-only podcast. Zero extra production work — the audio already exists.

**Platform:** RSS → Apple Podcasts, Spotify, Google Podcasts

**Hosting:** Buzzsprout, Transistor, or Podbean

**Posting frequency:** Same cadence as YouTube (3x/week)

**Show notes:** Auto-generated from newsletter issue (same content, podcast framing)

**Advantage:** Captures the audience that prefers audio (commuters, gym, background listening). Same content, different consumption mode.

**Setup:** Configure RSS feed on hosting platform, submit to Apple Podcasts and Spotify once. After that, all episodes auto-publish when audio is uploaded.

---

## Format Priority Order (Build Sequence)

When resources are limited, produce formats in this priority order:

| Priority | Format | Rationale |
|----------|--------|-----------|
| 1 | Pillar Video | Core product. Everything else is derivative. |
| 2 | Blog Post | Long-term SEO value. Compounds. |
| 3 | Newsletter | Highest-trust touchpoint. Builds list. |
| 4 | X Thread | Fast to produce, technical audience on X |
| 5 | YouTube Shorts | Algorithm boost, reach audience who won't watch 12-min videos |
| 6 | LinkedIn Post | Reaches Persona 2 + 4 |
| 7 | Instagram Carousel | Visual audience, good for reach |
| 8 | Podcast | Zero extra work once audio editing is done |
| 9 | Pinterest Pins | Long-tail SEO value, evergreen |
| 10 | Reddit Post | Community presence, requires care |
