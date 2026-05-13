# Workflow: Pillar to Spokes — End-to-End Atomization Pipeline

The complete workflow from a voice recording to 12-18 platform-native derivatives, ready to publish.

---

## Overview

```
INPUT: Voice recording (raw MP3/WAV)
OUTPUT: 12-18 approved, scheduled derivatives across 9 platforms
TOTAL HUMAN TIME: ~35 minutes (recording) + ~8 minutes (review/approvals)
TOTAL ELAPSED TIME: ~3-4 hours (agent processing time)
```

---

## Stage Map

| Stage | Agent | Human? | Input | Output | Human Time | AI Time |
|-------|-------|--------|-------|--------|-----------|---------|
| 1 | Voice Recording | **YES** | Approved outline | Raw audio file | 20-30 min | — |
| 2 | Transcription | Agent 05 | Raw audio | Timestamped transcript | — | 10-15 min |
| 3 | Audio Editing | Agent 06 | Raw audio + transcript | Edited audio | — | 5-10 min |
| 4 | Thumbnail Gen | Agent 07 | Topic + transcript | 5 thumbnail options | 2 min (pick) | 5-10 min |
| 5 | Atomization | Agent 08 | Edited audio + transcript | 8 derivative drafts | 5-10 min (review) | 10-20 min |
| 6 | SEO Optimization | Agent 10 | Derivative drafts | SEO suggestions | — | 5 min |
| 7 | Scheduling | Agent 09 | Approved derivatives + thumbnail | Scheduled posts | — | 2-5 min |

**Total human time per pillar: 27-42 minutes**
**Target: 30 minutes average**

---

## Detailed Step-by-Step

### Step 1: Voice Recording (Human — Agent 04)

**Who:** Owner
**What:** Record the pillar piece from the approved outline
**Time:** 20-30 minutes (prep + recording + quick check)

Prerequisites:
- Outline approved in Airtable (status: `outline_approved`)
- Recording environment ready (mic, quiet room, DAW open)
- Outline visible on second monitor or printed

Actions:
1. Review outline — spend 2 minutes reading it, not more
2. Open DAW (Audacity, Reaper, or Hindenburg)
3. Record: speak from outline, not verbatim from a script
4. State at recording start: "Recording {slug}, {date}, take 1"
5. Complete full pass before stopping — do not section-record
6. Quick quality check: listen to 30-second sample, check levels
7. Export to: `_recordings/raw/{YYYY-MM-DD}-{slug}-raw.mp3`
8. Update Airtable: `recording_status = complete`

**Gate:** This stage gates everything. Nothing downstream starts until file is saved and Airtable updated.

---

### Step 2: Transcription (Agent 05 — Autonomous)

**Who:** Agent 05 (Transcriber)
**Trigger:** Airtable `recording_status` changes to `complete`
**Time:** 10-15 minutes (Whisper processing + clean pass)

Agent actions:
1. Downloads raw audio from file path in Airtable
2. Submits to Whisper API with VFX vocabulary hint list
3. Receives timestamped transcript
4. Runs Claude clean pass: removes filler words, corrects technical terms, flags low-confidence segments
5. Saves: `_transcripts/{date}-{slug}-raw.txt` and `_transcripts/{date}-{slug}-clean.txt`
6. Updates Airtable: `transcript_status = complete`
7. Triggers Step 3 and Step 5 (they can run in parallel)

**No human action required.**

---

### Step 3: Audio Editing (Agent 06 — Autonomous)

**Who:** Agent 06 (Editor)
**Trigger:** Airtable `transcript_status` changes to `complete`
**Time:** 5-10 minutes (Auphonic processing + FFmpeg ops)

Agent actions:
1. Downloads raw audio
2. Submits to Auphonic API with Signal processing profile:
   - Noise reduction
   - Normalization to -16 LUFS
   - Silence reduction (> 1.5 sec → 0.8 sec)
3. Downloads processed audio
4. Filler word removal via FFmpeg (guided by transcript timestamps)
5. Splices intro/outro:
   ```bash
   ffmpeg -i signal-intro.mp3 -i processed.mp3 -i signal-outro.mp3 \
     -filter_complex '[0][1][2]concat=n=3:v=0:a=1' \
     output-edited.mp3
   ```
6. Loudness check: confirms -16 LUFS ± 1, no clipping
7. Saves: `_recordings/edited/{date}-{slug}-edited.mp3`
8. Updates Airtable: `edit_status = complete`, `final_duration_min = {n}`

**No human action required unless quality flag is raised.**

---

### Step 4: Thumbnail Generation (Agent 07 — Human-in-loop)

**Who:** Agent 07 → Human selection
**Trigger:** Can start in parallel with Step 3 (both trigger from `transcript_status = complete`)
**Time:** 5-10 min (AI generation) + 2 min (human picks)

Agent actions:
1. Extracts 3-5 strongest hook lines from transcript via Claude
2. Calls Claude to generate 5 thumbnail concepts
3. For each concept: calls Ideogram API or Midjourney API for visual element
4. Renders final compositions via Canva API
5. Saves options: `_thumbnails/{date}-{slug}-option-{1-5}.jpg`
6. Sends human notification: "5 thumbnail options ready for {topic}" with image previews

Human action (2 minutes):
1. Receive notification with image previews
2. Select preferred option OR request one variation ("option 3 but with the terminal output instead of code block")
3. Confirm selection in Airtable: `thumbnail_selected = option-3`

Agent finalizes:
1. Saves selected as: `_thumbnails/{date}-{slug}-selected.jpg`
2. Updates Airtable: `thumbnail_status = selected`

---

### Step 5: Atomization (Agent 08 — Human-in-loop)

**Who:** Agent 08 → Human review
**Trigger:** Can run in parallel with Steps 3 and 4 — starts from `transcript_status = complete`
**Time:** 10-20 min (Claude generation) + 5-10 min (human review)

Agent actions:
1. Loads clean transcript + outline structure
2. Runs 8 generation prompts (one per derivative) sequentially:
   - Blog post (1800-2200 words)
   - Newsletter (550-700 words)
   - YouTube Shorts scripts (3-5 scripts)
   - LinkedIn post (200-300 words)
   - X/Twitter thread (6-10 tweets)
   - Instagram carousel copy (5-8 slides)
   - Pinterest pin descriptions (3-5 pins)
   - Reddit post
3. Generates batch summary
4. Saves all to: `_derivatives/{date}-{slug}/`
5. Sends human notification: "Derivative batch ready for review: {topic}"

Human review (5-10 minutes):
1. Read batch summary first
2. Scan each derivative:
   - Blog post: check opening paragraph and section structure
   - Newsletter: check voice and opinion angle
   - X thread: check tweet 1 standalone quality
   - LinkedIn: check tone
   - Shorts scripts: check if each one works standalone
   - Instagram/Pinterest: quick scan
   - Reddit: check that it doesn't feel promotional
3. Edit inline if needed (directly in the markdown files)
4. Mark status: `batch_status = approved` in Airtable

**Gate:** Step 6 (SEO) and Step 7 (Scheduling) both wait for `batch_status = approved`.

---

### Step 6: SEO Optimization (Agent 10 — Autonomous)

**Who:** Agent 10 (SEO Optimizer)
**Trigger:** `batch_status = approved`
**Time:** 5 minutes

Agent actions:
1. Analyzes blog post draft for keyword usage
2. Checks search volume API for primary + secondary keyword estimates
3. Generates suggestions file: `_derivatives/{date}-{slug}/seo-suggestions.md`
4. Auto-applies unambiguous suggestions (meta description, tag addition)
5. Flags for human if title change is recommended
6. Updates Airtable: `seo_status = complete`

Human action (optional — 1-2 min if title change flagged):
- Accept or reject recommended title change

---

### Step 7: Scheduling (Agent 09 — Autonomous)

**Who:** Agent 09 (Scheduler)
**Trigger:** `batch_status = approved` + `thumbnail_status = selected` + `seo_status = complete`
**Time:** 2-5 minutes

Agent actions:
1. Determines optimal posting schedule per platform (see [[agents/09-scheduler]] posting schedule)
2. For YouTube: uploads video with metadata via YouTube Data API, schedules for Tuesday 14:00 UTC
3. For blog: publishes via Ghost API, scheduled for Tuesday 08:00 UTC
4. For LinkedIn, X, Instagram, Pinterest: queues via Buffer/Publer API
5. For newsletter: schedules via Beehiiv API for Wednesday 13:00 UTC
6. For Reddit: queues for Monday 15:00 UTC (next week if recording was Mon-Fri)
7. Updates all Airtable derivative rows: `scheduled_time = {timestamp}`, `scheduler_status = scheduled`
8. Sends confirmation digest to human

**End of pipeline for this pillar.**

---

## Parallel Execution Map

Not all stages are sequential. This is what can run concurrently:

```
Step 1 (Recording) — sequential, must complete first
│
Step 2 (Transcription) — triggered by Step 1
│
├── Step 3 (Editing) — triggered by Step 2
├── Step 4 (Thumbnails) — triggered by Step 2 (runs in parallel with Step 3)
└── Step 5 (Atomization) — triggered by Step 2 (runs in parallel with Steps 3 and 4)
         │
         └── HUMAN REVIEW GATE
                    │
         ┌──────────┴──────────┐
    Step 6 (SEO)          Step 7 (Scheduler — waits for Step 6 + thumbnail selection)
```

Total elapsed time from recording upload to scheduled: approximately 3-4 hours with parallel processing.

---

## Derivative Count by Format

A single pillar produces:

| Derivative | Count | Platform |
|------------|-------|---------|
| Long-form video | 1 | YouTube |
| Shorts | 3-5 | YouTube Shorts |
| Podcast episode | 1 | RSS (auto from edited audio) |
| Blog post | 1 | Ghost (own domain) |
| Newsletter issue | 1 | Beehiiv |
| LinkedIn post | 1 | LinkedIn |
| X/Twitter thread | 1 | X |
| Instagram carousel | 1 | Instagram |
| Pinterest pins | 3-5 | Pinterest |
| Reddit post | 1 | Reddit |
| **TOTAL** | **14-18** | 9 platforms |

---

## File System Structure (One Pillar)

```
_recordings/
  raw/
    2025-05-08-ayon-naming-conventions-raw.mp3
  edited/
    2025-05-08-ayon-naming-conventions-edited.mp3

_transcripts/
  2025-05-08-ayon-naming-conventions-raw.txt
  2025-05-08-ayon-naming-conventions-clean.txt
  2025-05-08-ayon-naming-conventions-confidence.json

_outlines/
  2025-05-08-ayon-naming-conventions.md

_thumbnails/
  2025-05-08-ayon-naming-conventions-option-1.jpg
  2025-05-08-ayon-naming-conventions-option-2.jpg
  ...
  2025-05-08-ayon-naming-conventions-selected.jpg

_derivatives/
  2025-05-08-ayon-naming-conventions/
    blog-post.md
    newsletter.md
    shorts-scripts.md
    linkedin-post.md
    x-thread.md
    instagram-carousel.md
    pinterest-pins.md
    reddit-post.md
    atomizer-summary.md
    seo-suggestions.md
```

---

## Quality Gates Summary

| Gate | When | Who | What happens if not met |
|------|------|-----|------------------------|
| Outline approval | Before recording | Human | Recording does not start |
| Transcript quality | After transcription | Agent (auto-check) | Flag to human if < 85% confidence |
| Thumbnail selection | After AI generation | Human | Scheduler holds until selected |
| Batch approval | After Atomizer | Human | Nothing schedules |
| SEO title recommendation | After SEO optimizer | Human (optional) | Uses current title if ignored |
