# Workflow: Trend Surf — Rapid Trending Content Pipeline

Monitors social media trends in real-time and generates content that rides the wave. Speed is the moat — first to post on a trending topic captures disproportionate views.

---

## Overview

```
INPUT:  Trending topic detected by Source Scanner or shared Trend Scanner
OUTPUT: Published clip within 2-4 hours of trend detection
SPEED TARGET: Trend detected → clip published in under 4 hours
```

---

## When to Use

- Breaking news or viral moment in a vertical's niche
- Trending audio on TikTok that fits a vertical
- Viral meme format that can be adapted
- Emerging hashtag gaining velocity

---

## Pipeline (Accelerated)

Standard Clip Factory pipeline with shortcuts for speed:

| Stage | Adaptation for speed |
|-------|---------------------|
| Source | Skip Supadata — use topic description directly |
| Score | Skip — trend itself is the validation |
| Script | Generate directly from topic, no segment selection |
| Visuals | Use simple/fast generation: Meta.ai images, stock, gameplay |
| Voice | Use fastest ElevenLabs voice (Turbo model) |
| Assembly | Use template-based assembly (pre-built visual templates) |
| Captions | Auto-captions via CapCut (fastest path) |
| Distribution | Post immediately — no batch scheduling |

**Target: 2 hours from trend detection to published clip.**

---

## Trend Detection Sources

| Source | Method | Latency |
|--------|--------|---------|
| TikTok trending | Supadata MCP | Near real-time |
| Twitter/X trending | Web search | Near real-time |
| Google Trends | Google Trends API | 4-24 hour delay |
| Reddit rising posts | Reddit API | 1-4 hour delay |
| YouTube trending | YouTube Data API | 4-12 hour delay |
| News aggregators | RSS feeds | Varies |

The shared Trend Scanner agent (`ecosystems/shared/agents/trend-scanner.md`) monitors these sources and pushes alerts when a trend matches a Surge vertical's niche keywords.

---

## Trend Evaluation (Quick Score)

Before producing content, quick-check:

| Question | Required answer |
|----------|----------------|
| Does this trend match an active vertical? | Yes |
| Can we produce content in under 4 hours? | Yes |
| Does content pass safeguard check? | Yes |
| Is the trend still rising (not peaked)? | Yes — check velocity |
| Will this content still be relevant in 24 hours? | Ideally yes, but acceptable if no (rides the spike) |

If any answer is no, skip the trend.

---

## Pre-Built Templates

For maximum speed, maintain pre-built visual templates per vertical:

```
_templates/
  horror/
    dark-background-narration.json    ← voice + dark imagery + bold captions
    vhs-filter-overlay.json           ← voice + VHS filter + gameplay
  history/
    documentary-montage.json          ← voice + AI historical images + clean captions
  facts/
    infographic-scroll.json           ← voice + text-heavy slides + impact font
```

Templates define: visual style, caption style, transition type, music mood. Script Engine fills in the content; Video Assembler applies the template.
