# Surge — Agent Pipeline Architecture

9 agents that turn trending content and AI-generated stories into retention-optimized short-form video, distributed across multiple anonymous accounts.

---

## Automation Tiers

| Tier | Definition |
|------|-----------|
| **Autonomous** | Runs without human input. Human reviews output in weekly digest. |
| **Human-in-loop** | Agent produces output. Human approves, edits, or rejects before pipeline continues. |
| **Human-triggered** | Human initiates the run (feeds a URL, a topic, or a story idea). Agent handles everything after. |

---

## Agent Registry

| # | Agent | Tier | Trigger | Purpose |
|---|-------|------|---------|---------|
| 01 | Source Scanner | Autonomous | Scheduled (daily) or on-demand | Find trending topics, viral content, story source material |
| 02 | Segment Scorer | Autonomous | On new source material | Score segments for hook strength, emotional volatility, virality potential |
| 03 | Script Engine | Autonomous | On scored segments | Rewrite selected segments into retention-optimized scripts |
| 04 | Visual Prompter | Autonomous | On approved script | Generate AI image/video prompts for each script line |
| 05 | Voice Synth | Autonomous | On approved script | Generate AI voiceover from script |
| 06 | Video Assembler | Autonomous | On voice + visuals ready | Compose final video from voice, visuals, B-roll, effects |
| 07 | Caption Renderer | Autonomous | On assembled video | Generate and burn-in retention-optimized subtitles |
| 08 | Distributor | Autonomous | On captioned video | Post to multiple accounts across multiple platforms |
| 09 | RPM Tracker | Autonomous | Ongoing (daily) | Track views, RPM, revenue per account/vertical/platform |

---

## Data Flow

```
                          [Source Material]
                                │
                    ┌───────────┴───────────┐
                    │                       │
            [Trend Feed]              [Manual Input]
            (Supadata, web)           (Boss drops URL/idea)
                    │                       │
                    └───────────┬───────────┘
                                │
                    [01 Source Scanner]
                    Outputs: source_material.json
                    (transcript, metadata, source URL)
                                │
                    [02 Segment Scorer]
                    Outputs: scored_segments.json
                    (segments ranked by virality score)
                                │
                    [03 Script Engine]
                    Outputs: script.json
                    (retention-optimized narration + scene breakdown)
                                │
               ┌────────────────┼────────────────┐
               │                │                │
    [04 Visual Prompter]  [05 Voice Synth]      │
    Outputs:              Outputs:               │
    visual_prompts.json   voiceover.mp3          │
    (per-line prompts)    (AI narration)         │
               │                │                │
               └────────┬───────┘                │
                        │                        │
              [06 Video Assembler]               │
              Inputs: visuals + voice + B-roll   │
              Outputs: raw_video.mp4             │
                        │                        │
              [07 Caption Renderer]              │
              Inputs: raw_video + script         │
              Outputs: final_video.mp4           │
                        │                        │
              [08 Distributor]                   │
              Inputs: final_video + metadata     │
              Outputs: post_ids per platform     │
                        │                        │
              [09 RPM Tracker] ◄────────────────┘
              Inputs: post_ids + platform APIs
              Outputs: revenue_report.json
```

---

## Tool Stack

| Tool | Used by | Purpose |
|------|---------|---------|
| Claude API (claude-sonnet-4-6) | 01, 02, 03, 04, 07 | Script generation, scoring, caption writing |
| Supadata MCP | 01 | Extract transcripts + metrics from viral social content |
| HyperFrames | 06, 07 | HTML → video rendering, caption burn-in, motion graphics |
| Higgsfield CLI | 04, 06 | AI image/video generation |
| Meta.ai | 04, 06 | Free image + 5-sec video generation |
| ElevenLabs | 05 | AI voiceover (multiple voice options) |
| ArcAds | 05, 06 | AI UGC generation (research: github.com/krusemediallc/arcads-claude-code) |
| CapCut (API or manual) | 06, 07 | Video editing, auto-captions, effects |
| Runway / Kling / Veo | 04, 06 | AI video generation for B-roll and visuals |
| Make.com / n8n | All | Workflow orchestration |
| Airtable | All | Central data store for pipeline state |

---

## Build Order

=== 30-DAY MANUAL RULE: Do not build agents before running the pipeline manually for 30 days ===

```
Manual phase (Days 1-30):
  - Boss selects first vertical
  - Manually find sources, write scripts, generate voice, assemble video, post
  - Track RPM and retention manually in spreadsheet
  - Learn what works before automating

Automation Phase 1 (Days 31-60):
  03 Script Engine → highest-leverage automation (most time saved)
  05 Voice Synth → second-highest leverage
  01 Source Scanner → daily trend feed

Automation Phase 2 (Days 61-90):
  02 Segment Scorer → quality scoring
  04 Visual Prompter → visual generation
  06 Video Assembler → composition

Automation Phase 3 (Days 91-120):
  07 Caption Renderer → subtitle automation
  08 Distributor → multi-platform posting
  09 RPM Tracker → revenue tracking
```

---

## Output File Structure (One Clip)

```
_clips/
  {YYYY-MM-DD}-{vertical}-{slug}/
    source_material.json       ← 01 Source Scanner output
    scored_segments.json       ← 02 Segment Scorer output
    script.json                ← 03 Script Engine output
    visual_prompts.json        ← 04 Visual Prompter output
    voiceover.mp3              ← 05 Voice Synth output
    assets/                    ← generated images/videos for each line
    raw_video.mp4              ← 06 Video Assembler output
    final_video.mp4            ← 07 Caption Renderer output
    distribution.json          ← 08 Distributor output (post IDs, URLs)
    metrics.json               ← 09 RPM Tracker (updated daily)
```

---

## JSON Output Schema

Standard output format for the full pipeline. Used by downstream automation and the RPM tracker.

```json
{
  "clip_id": "2026-05-13-horror-the-man-who-survived",
  "vertical": "horror-stories",
  "title": "",
  "hook": "",
  "duration_seconds": 0,
  "script": [
    {
      "line_number": 1,
      "text": "",
      "duration_seconds": 0,
      "emphasis": "",
      "pause_after": false,
      "emotional_intensity": 0
    }
  ],
  "visual_prompts": [
    {
      "line_number": 1,
      "prompt": "",
      "camera_motion": "",
      "duration_seconds": 0,
      "tool": "meta.ai|higgsfield|runway"
    }
  ],
  "subtitle_data": [
    {
      "start_ms": 0,
      "end_ms": 0,
      "text": "",
      "style": "default|bold|emphasis|impact"
    }
  ],
  "voiceover": {
    "voice_id": "",
    "service": "elevenlabs|meta.ai",
    "file_path": ""
  },
  "thumbnail_text": [],
  "viral_titles": [],
  "music_style": "",
  "platform_variants": {
    "tiktok": { "duration": 0, "hashtags": [], "description": "" },
    "youtube_shorts": { "duration": 0, "title": "", "description": "" },
    "instagram_reels": { "duration": 0, "caption": "", "hashtags": [] }
  },
  "metadata": {
    "virality_score": 0,
    "emotional_intensity": 0,
    "hook_strength": 0,
    "pacing_density": 0,
    "retention_estimate": 0,
    "controversy_level": 0,
    "safeguard_check": "pass|flag|block"
  }
}
```

---

## Quality Gates

| Gate | When | Who | What happens if not met |
|------|------|-----|------------------------|
| Safeguard check | After script generation | Agent 03 (auto) | Content flagged → human review or discard |
| Quality floor check | After script + visual | Agent 03 + 04 (auto) | Below quality floor → script rewrite or discard |
| Audio quality check | After voice synth | Agent 05 (auto) | Glitches/artifacts → regenerate |
| Visual quality check | After assembly | Agent 06 (auto) | AI artifacts → regenerate affected frames |
| Caption accuracy | After caption render | Agent 07 (auto) | Misaligned/inaccurate → resync |
| Weekly batch review | Weekly | Human | Review random sample of week's output for quality/safeguards |

---

## Relationship to Signal Pipeline

Surge and Signal share zero content. Brand isolation is absolute. Shared infrastructure only:
- Supadata MCP (both use for research — different purposes)
- HyperFrames (both use for video — different brands)
- Claude API (both use for generation — different prompts)
- Trend Scanner (ecosystems/shared/agents/trend-scanner.md) — provides input to both ecosystems

The trend scanner is shared infrastructure, not shared content. It surfaces what's trending; each ecosystem decides independently what to do with that information.
