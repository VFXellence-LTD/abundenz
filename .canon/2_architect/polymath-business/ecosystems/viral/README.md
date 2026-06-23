# Ecosystem: Surge

High-volume AI-generated short-form content, distributed across anonymous accounts, optimized for RPM and platform monetization.

## One-line thesis

AI-sourced stories, trends, and clips — rewritten for maximum retention, voiced by AI, assembled into short-form video, and distributed across multiple anonymous accounts on TikTok, YouTube Shorts, Instagram Reels, and emerging platforms.

## Core moat

Speed + scale + AI toolchain + multi-account distribution. No personal identity. No single point of brand failure. Content is disposable and replaceable; the pipeline is the asset.

## Key difference from Signal

| Axis | Signal (Content) | Surge (Viral) |
|------|-------------------|----------------|
| Voice | Owner's real voice (moat) | AI-generated voice (scale) |
| Identity | Personal brand, real name | Fully anonymous, multi-account |
| Depth | 8-15 min deep dives | 30-90 sec retention-optimized clips |
| Content source | Owner expertise + recording | AI-generated + trend-surfing + public domain |
| Revenue model | Ads + products + consulting | RPM + creator funds + affiliate + lead gen |
| Audience | Niche professionals | Mass-market entertainment/education |
| Quality bar | Deep, authoritative, technical | Entertaining, retentive, high-stimulation |
| Accounts | 1 brand per platform | Multiple brands/accounts per platform |
| Owner time | 30 min/day recording | Near-zero at steady state |

## Business model

### Revenue streams

| Stream | Mechanism | Revenue estimate |
|--------|-----------|-----------------|
| TikTok Creator Rewards | RPM on 1-min+ videos ($0.50-1.00 CPM) | Primary — scales with volume |
| YouTube Shorts Fund | RPM on Shorts monetization | Secondary — lower RPM, larger audience |
| Instagram Reels bonuses | Platform bonus programs (availability varies) | Tertiary — opportunistic |
| Affiliate links in bio | Product recommendations in niche verticals | Supplemental |
| Lead gen → email → products | Free value → list → digital product sales | Long-tail |
| Brand deals | Sponsored content once accounts hit 100K+ followers | Phase 2+ |

### Unit economics

```
1 clip = ~$0.50-2.00 per 1K views (platform-dependent)
Target: 10 clips/day across 6 accounts = 60 posts/day
At 10K avg views per post = 600K daily views
At $0.75 avg CPM = $450/day = ~$13,500/month

Conservative (1K avg views): $45/day = ~$1,350/month
Optimistic (50K avg views): $2,250/day = ~$67,500/month
```

These are rough — actual RPM varies wildly by niche, platform, and content quality. First milestone: validate RPM in one vertical before scaling.

## Content verticals

Verticals are content niches, each with its own account(s) and brand identity. New verticals added under `verticals/` using the `_template/` structure.

**Starter verticals (Boss to confirm):**

| Vertical | Content type | Source material |
|----------|-------------|-----------------|
| (TBD) | Boss to define first vertical | — |

Verticals will be added as Robin passes content generation ideas. Each vertical gets:
- Own brand name and visual identity
- Own accounts per platform
- Own content rules and tone
- Own RPM tracking
- `kid-friendly` flag (true/false) — triggers additional safeguards per `safeguards/POLICY.md §1`

**Vertical ideas from research (parking lot):**

*Adult/general audience:*
- Scary/horror stories (AI-generated narrative + voiceover + gameplay/visual background)
- Historical "impossible facts" (public domain stories rewritten for retention)
- Tech/AI news clips (trending topic → rapid content)
- Motivational/educational shorts (quotes, insights, life hacks)
- Niche explainers (science, psychology, economics — simplified for mass audience)
- TDIH — This Day In History (daily historical events, evergreen format)
- Combined — remix 2 trending topics into one clip

*Kid-friendly (under-13 safe):*
- Fun facts / "did you know?" (animals, space, nature, records — bright, energetic, educational)
- Science experiments / satisfying visuals (slime, magnets, chain reactions — safe, no dangerous replication)
- Storytime / fairy tales (AI-narrated short stories, illustrated with AI visuals)
- Animal clips (cute/funny/amazing animal content — AI narration over sourced or generated footage)
- Riddles and puzzles (interactive engagement, "can you guess?" format)

Kid-friendly verticals follow stricter safeguards (no violence, no profanity, no horror, COPPA-aware). See `safeguards/POLICY.md §1`. RPM may be lower on YouTube "Made for Kids" — compensate with volume and family co-viewing audience.

## Agent pipeline

9 agents, fully autonomous at steady state. See [[shared/agents/README]] for complete pipeline architecture.

```
[01 Source Scanner] → [02 Segment Scorer] → [03 Script Engine] → [04 Visual Prompter]
                                                                          │
                                                                    ┌─────┴─────┐
                                                              [05 Voice Synth]  │
                                                                    │           │
                                                              [06 Video Assembler]
                                                                    │
                                                              [07 Caption Renderer]
                                                                    │
                                                              [08 Distributor]
                                                                    │
                                                              [09 RPM Tracker]
```

## Tools

| Tool | Purpose | Cost |
|------|---------|------|
| Claude API | Script generation, segment analysis, retention optimization | Usage-based |
| Supadata MCP | Transcript + metrics extraction from viral content | Installed |
| HyperFrames | HTML → video rendering, captions, motion graphics | Installed (npm) |
| Higgsfield CLI | AI image/video generation | Installed |
| Meta.ai | Free image + 5-sec video generation | Free |
| ElevenLabs | AI voiceover | Free tier → $5-22/mo |
| ArcAds | AI UGC generation | TBD (github.com/krusemediallc/arcads-claude-code) |
| CapCut | Video editing, auto-captions | $8/mo (Pro) |
| Runway / Kling / Veo | AI video generation for B-roll | $12-28/mo |

## Status

- **Current phase:** Design phase — structure built, no verticals active
- **Active verticals:** none — awaiting Boss's first vertical selection
- **Active accounts:** none
- **Agents operational:** none — 30-day manual rule applies
- **Content published:** 0

## Build sequence

```
Step 1: Boss selects first vertical and content type
Step 2: Manual production — create 10 clips by hand using tools
Step 3: Track RPM and retention metrics for 30 days
Step 4: Build Agent 01 (Source Scanner) and 03 (Script Engine)
Step 5: Gradually automate remaining agents
Step 6: Add second vertical only after first is RPM-validated
```

=== 30-DAY MANUAL RULE APPLIES — DO NOT BUILD AGENTS BEFORE MANUAL VALIDATION ===

## Files in this ecosystem

```
viral/
├── README.md                     ← this file
├── PITCH.md                      ← business case
├── safeguards/
│   └── POLICY.md                 ← content standards (READ FIRST)
├── shared/
│   ├── agents/
│   │   ├── README.md             ← pipeline architecture + data flow
│   │   ├── 01-source-scanner.md  ← trend/content sourcing
│   │   ├── 02-segment-scorer.md  ← virality scoring + segment selection
│   │   ├── 03-script-engine.md   ← retention-optimized rewriting
│   │   ├── 04-visual-prompter.md ← AI image/video prompt generation
│   │   ├── 05-voice-synth.md     ← AI voiceover generation
│   │   ├── 06-video-assembler.md ← asset composition into final video
│   │   ├── 07-caption-renderer.md ← subtitle generation + burn-in
│   │   ├── 08-distributor.md     ← multi-account, multi-platform posting
│   │   └── 09-rpm-tracker.md     ← revenue per mille tracking + optimization
│   ├── workflows/
│   │   ├── clip-factory.md       ← source → clip → distribute (main pipeline)
│   │   ├── story-factory.md      ← AI story → narration → video pipeline
│   │   └── trend-surf.md         ← trending topic → rapid content pipeline
│   └── playbooks/
│       ├── viral-formula.md      ← retention optimization system (adapted from brainrot pipeline)
│       ├── hook-library.md       ← proven hook templates by category
│       └── platform-rpm.md       ← RPM rates + optimization per platform
├── verticals/
│   └── _template/
│       └── README.md             ← template for new content verticals
└── accounts/
    └── README.md                 ← multi-account strategy + management
```

## Brand isolation reminder

Surge is fully anonymous. No personal identity. No connection to Signal, Atelier, Lullaby, or Conduit. Each vertical within Surge gets its own brand name. The owner does not appear in any Surge content — voice, face, or name. Read `shared/brand-isolation/POLICY.md`.

## When to revisit this README

- When first vertical is selected → update vertical table
- When first 30-day manual run completes → update build sequence status
- When first agent ships → update agent operational status
- At each vertical addition → update vertical inventory
- Monthly → update RPM estimates with real data
