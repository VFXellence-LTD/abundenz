# Workflow: Clip Factory — End-to-End Viral Content Pipeline

The primary production workflow. Takes source material (any type) through the full Surge pipeline to published clips across platforms.

---

## Overview

```
INPUT:  Source material (URL, transcript, topic, story idea)
OUTPUT: Published clips on TikTok, YouTube Shorts, Instagram Reels (+ metrics tracking)
HUMAN TIME: ~5 min/clip (review) during manual phase; ~0 at steady state
AI TIME: ~3-8 min per clip (generation + assembly)
```

---

## Stage Map

| Stage | Agent | Human? | Input | Output | Time |
|-------|-------|--------|-------|--------|------|
| 1 | Source | 01 Source Scanner | URL/topic/feed | source_material.json | 1-2 min |
| 2 | Score | 02 Segment Scorer | source_material | scored_segments.json | 30 sec |
| 3 | Script | 03 Script Engine | top segment | script.json | 1-2 min |
| 4 | Safeguard check | 03 (inline) | script | pass/flag/block | instant |
| 5 | Visuals | 04 Visual Prompter | script | visual_prompts.json | 1 min |
| 6 | Voice | 05 Voice Synth | script | voiceover.mp3 | 30-60 sec |
| 7 | Assets | 04 (generation) | visual_prompts | images/videos in assets/ | 2-5 min |
| 8 | Assembly | 06 Video Assembler | voice + assets | raw_video.mp4 | 1-2 min |
| 9 | Captions | 07 Caption Renderer | raw_video + script | final_video.mp4 | 30 sec |
| 10 | Distribute | 08 Distributor | final_video + metadata | post IDs per platform | 1-2 min |
| 11 | Track | 09 RPM Tracker | post IDs | metrics.json (ongoing) | ongoing |

**Total pipeline time per clip: ~8-15 minutes (automated)**

---

## Parallel Execution

Not all stages are sequential:

```
Stage 1 (Source) — must complete first
        │
Stage 2 (Score) — depends on Stage 1
        │
Stage 3 (Script) — depends on Stage 2
        │
Stage 4 (Safeguard) — inline with Stage 3
        │
   ┌────┴────┐
   │         │
Stage 5   Stage 6
(Visuals) (Voice)   ← RUN IN PARALLEL
   │         │
   └────┬────┘
        │
Stage 7 (Asset Generation) — depends on Stage 5
        │
Stage 8 (Assembly) — depends on Stages 6 + 7
        │
Stage 9 (Captions) — depends on Stage 8
        │
Stage 10 (Distribute) — depends on Stage 9
        │
Stage 11 (Track) — ongoing after Stage 10
```

---

## Input Variants

### Variant A: URL-based (content repurposing)

Boss drops a URL to a viral video, podcast, or article.

```
1. Supadata extracts transcript + metrics from URL
2. Segment Scorer identifies best clip-worthy moments
3. Script Engine rewrites top segment for retention
4. Pipeline continues from Step 4
```

### Variant B: Topic-based (trend surfing)

Source Scanner identifies a trending topic.

```
1. Claude generates a narrative/script about the topic
2. Segment Scorer rates the generated content
3. Script Engine optimizes for retention
4. Pipeline continues from Step 4
```

### Variant C: Story-based (AI-generated)

AI generates original content (scary stories, historical narratives, etc.).

```
1. Claude generates full story based on vertical's content rules
2. Segment Scorer identifies the highest-retention segment
3. Script Engine compresses to 60-90 seconds
4. Pipeline continues from Step 4
```

### Variant D: Manual input

Boss writes or dictates a script idea directly.

```
1. Skip Source Scanner and Segment Scorer
2. Script Engine optimizes the provided script for retention
3. Pipeline continues from Step 4
```

---

## Daily Production Target

| Phase | Clips/day | Accounts | Method |
|-------|-----------|----------|--------|
| Manual (Days 1-30) | 2-3 | 1-2 | Manual tool-by-tool |
| Semi-auto (Days 31-60) | 5-8 | 3-4 | Script + voice automated, manual assembly |
| Automated (Days 61-90) | 10-15 | 6+ | Full pipeline automated |
| Scale (Days 90+) | 20-30 | 10+ | Multiple verticals, batch processing |

---

## Batch Processing

At scale, the pipeline processes multiple clips in parallel:

```
Morning batch (06:00):
  - Source Scanner runs overnight, queues top 10 sources
  - All 10 sources processed through Score → Script → Safeguard
  - Flagged content held for human review
  - Passing content enters Visual + Voice generation

Midday batch (12:00):
  - Assembly + Captions for morning batch
  - Distribution scheduled for optimal posting times per platform

Evening batch (18:00):
  - RPM Tracker collects metrics from today's posts
  - Source Scanner queues next day's trending content
  - Weekly digest prepared (Friday only)
```

---

## Error Handling

| Error | Action |
|-------|--------|
| Source transcript extraction fails | Skip source, log error, try next in queue |
| Segment score too low (composite < 40/100) | Skip source — not worth producing |
| Safeguard flags content | Hold for human review. If blocked, discard. |
| Voice synthesis has artifacts | Regenerate with different voice settings. If persistent, flag for manual review. |
| Visual generation produces artifacts | Regenerate affected frames. Swap to different AI tool if needed. |
| Assembly fails | Log error with inputs. Retry once. If persistent, flag for investigation. |
| Platform posting fails | Retry with exponential backoff. If auth error, alert human. |
| Account temporarily restricted | Pause posting to that account. Continue with other accounts. Alert human. |

---

## File System Structure (One Day's Output)

```
_clips/
  2026-05-13-horror-the-man-who-survived/
    source_material.json
    scored_segments.json
    script.json
    visual_prompts.json
    voiceover.mp3
    assets/
      line-01.mp4
      line-02.png
      ...
    raw_video.mp4
    final_video.mp4
    distribution.json
    metrics.json

  2026-05-13-history-impossible-statistics/
    ...

  2026-05-13-facts-nobody-noticed/
    ...
```

---

## Quality Gates

| Gate | Check | Action on failure |
|------|-------|-------------------|
| Segment score | Composite score > 40/100 | Discard source |
| Safeguard check | No hard ban violations | Block: discard. Flag: human review. |
| Script quality | Hook in first 2 sentences, no dead zones > 3 sec | Rewrite pass |
| Audio quality | No artifacts, normalized volume, natural pacing | Regenerate |
| Visual quality | No extra fingers, no text gibberish, 1080p+ | Regenerate affected frames |
| Caption sync | Captions aligned within 200ms of speech | Resync |
| Final review | Random sample weekly by human | Adjust pipeline parameters |
