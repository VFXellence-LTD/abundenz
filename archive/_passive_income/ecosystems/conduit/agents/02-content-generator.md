# Agent 02: Content Generator

Autonomous content generation for TikTok, Pinterest, and other platforms. Produces scripts, captions, and rendered videos at scale.

## Input Specification

### Product List (JSON)
```json
{
  "products": [
    {
      "name": "AI Writing Assistant",
      "price": "$49/month",
      "key_features": ["Real-time suggestions", "AI-powered", "Plagiarism checker"],
      "benefit": "Write 10x faster with AI",
      "affiliate_url": "https://amazon.com/...",
      "affiliate_program": "Amazon Associates",
      "commission": "10%",
      "category": "SaaS / Writing Tools",
      "hashtags": ["AIWriting", "ProductivityApps", "WritingTools"]
    }
  ]
}
```

### Content Calendar Template
```
Week: 5
Products to promote: AI Writing, Spelling Checker, Autocomplete Tool
Content types: Unboxing, Comparison, Tutorial, Trending Sound
Priority: All 3-5 posts/day (TikTok cold start phase)
```

## Output Specification

### TikTok Script (JSON)
```json
{
  "product": "AI Writing Assistant",
  "platform": "tiktok",
  "format": "15-60s vertical",
  "hook": "I tested 5 AI writing tools... this one's the best",
  "hook_visual": "Text overlay: '5 AI Writing Tools Tested'",
  "demo": [
    {
      "second": "1-3",
      "action": "Text overlay hook appears",
      "script": "This tool just changed how I write",
      "audio": "Trending sound (check Discover tab)"
    },
    {
      "second": "4-20",
      "action": "Show AI tool interface, type prompt, watch it generate",
      "script": "Watch it rewrite my paragraph in 2 seconds",
      "audio": "Trending sound continues"
    },
    {
      "second": "21-30",
      "action": "Show before/after text comparison",
      "script": "See the difference? Reads way better.",
      "audio": "Sound out, text overlay only"
    },
    {
      "second": "31-45",
      "action": "Closing shot, CTA overlay",
      "script": "Check pinned comment for link",
      "audio": "Trending sound outro"
    }
  ],
  "caption": "I tested 5 AI writing tools and this one's the best... 🚀\n\nPros:\n✓ Real-time suggestions\n✓ AI-powered rewriting\n✓ Plagiarism check\n\nCons:\n✗ Monthly cost ($49)\n\nLink in pinned comment #ad #AIWriting #ProductivityApps #WritingTools #BestAITools #AITools #SoftwareReview",
  "hashtags": ["#ad", "#AIWriting", "#ProductivityApps", "#WritingTools", "#BestAITools", "#AITools", "#SoftwareReview", "#TechReview", "#ProductReview"],
  "cta": "Check pinned comment for link",
  "affiliate_link": "https://amazon.com/...",
  "video_specs": {
    "duration": "45s",
    "dimensions": "1080x1920",
    "format": "MP4",
    "framerate": "30fps",
    "bitrate": "4000kbps"
  }
}
```

### Pinterest Pin (JSON)
```json
{
  "product": "AI Writing Assistant",
  "platform": "pinterest",
  "pin_type": "Static",
  "dimensions": "1000x1500px",
  "design": "Product image + headline + benefit + logo",
  "headline": "5 Best AI Writing Tools for 2025 (Free & Paid)",
  "description": "Tested 5 AI writing tools. This one's the best for [use case]. Real-time suggestions, plagiarism check, 10x faster writing. See the full comparison & affiliate links below. #ad",
  "seo_keywords": ["AI writing tools", "best writing software", "productivity apps", "AI productivity"],
  "board": "Writing Tools & Productivity",
  "affiliate_link": "https://amazon.com/...",
  "hashtags": ["#AIWriting", "#WritingTools", "#ProductivityApps"]
}
```

## Content Generation Workflow

### Phase 1: Script Generation (Claude)
**Input**: Product list (JSON)
**Process**:
1. Parse product (name, benefit, key features, affiliate URL)
2. Generate 3 hook variations:
   - Curiosity hook: "I tested X... here's what happened"
   - Value hook: "This saved me 5 hours/week"
   - Trend hook: "This AI tool is insane" (use trending sound)
3. Generate demo script (what will be shown on screen)
4. Generate CTA script (how to get product)
5. Select trending hashtags (check TikTok Discover tab daily)

**Output**: Structured JSON scripts (as above)

### Phase 2: Captions & Hashtags (Claude)
**Input**: Product + script
**Process**:
1. Generate caption (150-300 chars for optimal CTR)
2. Extract key benefits (pros/cons format for scannability)
3. Add 2-3 trending hashtags (from Discover tab)
4. Add 3-5 niche hashtags (product category, product name)
5. Add 3-5 long-tail hashtags (specific searches)
6. Include #ad (FTC compliance)
7. Include affiliate link or CTA ("link in bio", "pinned comment")

**Output**: Caption string + hashtag list

### Phase 3: Video Generation (Higgsfield / AI video tools)
**Input**: Script JSON
**Process**:
1. Render video using Higgsfield CLI or Keyvello:
   ```bash
   higgsfield-cli generate \
     --script-json script.json \
     --product-name "AI Writing Assistant" \
     --output video.mp4 \
     --quality high
   ```
2. Add captions/overlays (via CapCut or Higgsfield template)
3. Add trending sound (download from TikTok, overlay in video)
4. Final render (1080x1920, 30fps, 4000kbps)

**Output**: MP4 video file + caption JSON

## Script Templates

### Template 1: Unboxing (Cold Start Phase)
```
HOOK (1-3s):
  Visual: Text overlay "Unboxing [Product]"
  Script: "I just got this AI tool... let's see if it's worth it"
  Audio: Trending sound (high energy)

DEMO (15-30s):
  Visual: Show product packaging, open it, show interface
  Script: "First thing... [impressive first feature]. Look at this..."
  Audio: Trending sound continues

REVIEW (5-10s):
  Visual: Product in use, close-up of key feature
  Script: "This is actually insane. [Specific benefit]. Saves me [time/money]."
  Audio: Sound fades

CTA (2-3s):
  Visual: Text overlay "Link in bio"
  Script: "Check pinned comment for the link"
  Audio: Short outro music
```

### Template 2: Comparison (Growth Phase)
```
HOOK (1-3s):
  Visual: Text "AI Writing Tool A vs Tool B"
  Script: "I tested 2 AI writing tools... this one's better"
  Audio: Trending sound

COMPARISON (20-30s):
  Visual: Split screen, show same task on both tools
  Script: "Here's Tool A... here's Tool B... Tool B won because [reason]"
  Audio: Sound continues

WINNER (5s):
  Visual: Highlight winning product, show CTA
  Script: "If you write a lot, Tool B is the way to go"
  Audio: Sound out

CTA (2s):
  Visual: "Link in pinned comment"
  Script: "Get the tool"
  Audio: Outro
```

### Template 3: Tutorial (Engagement Phase)
```
HOOK (1-3s):
  Visual: "How to write 10x faster"
  Script: "This AI tool will save you 5 hours/week"
  Audio: Trending sound

TUTORIAL (30-40s):
  Visual: Screen recording of tool, clear steps
  Script: "Step 1... Step 2... Look at the output... [benefit]"
  Audio: Calm, clear sound (or voiceover)

RESULT (5s):
  Visual: Final output, impressive before/after
  Script: "I saved 2 hours writing this essay"
  Audio: Sound continues

CTA (2s):
  Visual: "Link in pinned comment"
  Script: "Try it yourself"
  Audio: Outro
```

### Template 4: Trending Sound (Viral Attempt)
```
HOOK (1-3s):
  Visual: Use trending sound's iconic visual (dance, meme, etc.)
  Script: Apply product angle to trending meme
  Audio: Trending sound (from this week's Discover)

TWIST (15-20s):
  Visual: Introduce product in meme context
  Script: "Wait, you can use AI to [benefit]?"
  Audio: Trending sound, builds to peak

REACTION (10s):
  Visual: Your reaction to product's ability
  Script: "This is crazy... it just [feature]"
  Audio: Trending sound outro

CTA (3s):
  Visual: Product call-out with link
  Script: "Check it out"
  Audio: Outro
```

## Batch Processing (Weekly)

**Automation goal**: Generate 35+ videos in 4 hours (7 videos/hour)

### Workflow
```
Monday evening:
1. Identify top 5-7 products for the week (Agent 01 recommendations)
2. Generate scripts (Claude API, batch mode)
3. Generate captions (Claude API)
4. Render videos (Higgsfield overnight batch)
5. Upload to Agent 03 scheduling queue

Wednesday evening:
6. Generate 20+ videos for Week 2 (same process)
7. Queue for Thursday-Friday posting
```

### Tools & Costs

| Tool | Purpose | Cost | Scalability |
|------|---------|------|---|
| Claude API | Script generation | ~$10/week | Unlimited |
| Higgsfield CLI | Video rendering | $200-500/month | 100s/day |
| Keyvello | Backup video generation | $30-100/month | 10s/day |
| CapCut Desktop | Caption overlays | Free | Unlimited |
| TikTok API | Publish + metrics | Free | 5-10k posts/day |

## Quality Assurance

Before video reaches Agent 03 (Scheduler), verify:

| Check | Criteria | Fix |
|-------|----------|-----|
| Hook | First 3 sec engaging? | Rewrite script, re-render |
| Video quality | 1080x1920, <287MB, clear audio? | Re-render with higher bitrate |
| Caption | <300 chars, 2-3 trending hashtags, #ad present? | Rewrite caption |
| Affiliate link | Present in pinned comment CTA? | Add to caption |
| Compliance | #ad visible, no misleading claims? | Add #ad, revise script |
| Audio | Trending sound? Clear enough? | Swap for different trending sound |

## Output Queue Format

Final output to Agent 03:
```
videos/
├── tiktok/
│   ├── day_1/
│   │   ├── 08_00_product_a_unboxing.mp4
│   │   ├── 08_00_product_a_unboxing.json (caption + metadata)
│   │   ├── 13_00_product_b_demo.mp4
│   │   └── 13_00_product_b_demo.json
│   ├── day_2/
│   └── ...
└── pinterest/
    ├── ai_writing_tools.png
    ├── ai_writing_tools.json (caption + design metadata)
    └── ...
```

Each `.json` file contains:
- Caption
- Hashtags
- Affiliate link
- Platform (TikTok / Pinterest)
- Posting time (for Agent 03 scheduler)
