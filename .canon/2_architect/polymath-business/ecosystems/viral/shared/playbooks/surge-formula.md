# Surge Formula — Retention-Optimized Content Repurposing System

The core content transformation engine for Surge. Takes source material (transcripts, stories, trending content, AI-generated narratives) and outputs retention-optimized short-form scripts with structured assets for downstream video generation.

This playbook operationalizes the full agent pipeline. Each step maps to one or more Surge agents.

---

## Pre-Step: Angle Multiplication

Before the pipeline runs, one decision eliminates the blank-page problem: **you don't need endless topic ideas — you need one topic run through the fixed angle set.**

The five angles are an exhaustive frame set. Every educational or informational topic can be entered from all five:

| Angle | Machine enum | Frame |
|-------|-------------|-------|
| The mistake people make with it | `mistake` | What everyone gets wrong |
| The question beginners are scared to ask | `beginner_question` | The thing nobody admits they don't understand |
| The transformation (before/after) | `transformation` | What changes when you actually do this right |
| A contrarian take on common advice | `contrarian` | Why the standard advice is wrong or incomplete |
| The step-by-step | `step_by_step` | Exactly how to do it, in order |

**The multiplication:** 1 topic × 5 angles × 3 formats (talking video, text post, carousel) × 4 platforms (TikTok, Reels, Shorts, X — minor tweaks each) = **30+ pieces from one idea.**

### Worked example — @zrodinger (viral), quantum/science topic: "quantum entanglement"

| Angle | Draft premise |
|-------|---------------|
| `mistake` | "Everyone describes entanglement as 'spooky action at a distance' — that framing is why nobody actually understands it." |
| `beginner_question` | "Is quantum entanglement just a coincidence between particles? (The answer is embarrassing for most physics explainers.)" |
| `transformation` | "Before: entanglement sounds like magic. After: it's a constraint on information — and once you see it that way, quantum computing stops being mystical." |
| `contrarian` | "Pop-science says entanglement lets you communicate faster than light. It doesn't. Here's why every viral explainer gets this wrong." |
| `step_by_step` | "How to actually understand quantum entanglement in 5 steps — without the word 'spooky.'" |

Each angle becomes an independent `TopicSpec` passed into the pipeline. The same source material (research, a transcript, a reference video) seeds all five drafts. Five drafts. One research session.

---

## Pipeline Overview

```
SOURCE → SCORE → SCRIPT → VISUALIZE → OPTIMIZE → ADAPT → PACKAGE
  01       02      03        04          03*       08      08
```

*Step 5 (Optimize) is a second pass through Agent 03.

---

## STEP 1 — SOURCE (Agent 01: Source Scanner)

### Input types

| Source type | Method | Example |
|-------------|--------|---------|
| Podcast/video transcript | Supadata MCP extraction | Viral YouTube video, podcast episode |
| RSS feed | Feed parser | News aggregators, niche blogs |
| Social media trend | Supadata + web search | Trending TikTok audio, Twitter/X topic |
| AI-generated story | Claude API | Scary story, historical narrative, fictional scenario |
| Public domain content | Web research | Wikipedia, Project Gutenberg, historical archives |
| Boss-supplied idea | Manual input | Topic, URL, or story concept dropped into pipeline |

### Processing

If input is audio/video:
- Extract transcript via Supadata MCP (metrics + transcript in one call)
- Clean formatting, preserve timestamps if available
- Flag speaker changes for multi-voice content

If input is text:
- Clean formatting, remove ads/navigation/boilerplate
- Preserve any structural markers (chapters, sections, timestamps)

If input is a topic/idea:
- Generate source material via Claude API
- For stories: generate complete narrative with beginning, escalation, climax, resolution
- For facts: research and compile verified claims with sources

### Output
```json
{
  "source_id": "",
  "source_type": "transcript|story|trend|idea",
  "source_url": "",
  "content": "",
  "timestamps": [],
  "speaker_labels": [],
  "metadata": {
    "original_views": 0,
    "original_engagement": 0,
    "source_platform": ""
  }
}
```

---

## STEP 2 — SCORE (Agent 02: Segment Scorer)

Analyze source material and identify segments with the highest short-form potential.

### Scoring dimensions

| Dimension | Weight | What to look for |
|-----------|--------|-----------------|
| Hook strength | 25% | Can the segment open with a statement that creates instant curiosity? |
| Emotional volatility | 20% | Does the segment trigger surprise, shock, awe, fear, laughter, or outrage? |
| Pacing density | 15% | How much happens per second? High information density = high retention. |
| Virality potential | 15% | Would someone share this? Does it trigger "wait, what?" or "you need to see this"? |
| Clipability | 10% | Does the segment work standalone without context? |
| Novelty | 10% | Is this something the viewer hasn't heard before? |
| Controversy tolerance | 5% | Can this be posted without triggering platform flags? (higher = safer) |

### Trigger signals (scan for these in source material)

- Extreme survival stories
- Absurd luck or coincidence
- Emotional shock / betrayal
- Escalating danger
- Irony and dramatic irony
- Impossible statistics
- Unexpected reveals / plot twists
- Dark humor (within safeguard bounds)
- "Wait, what?" moments
- Counterintuitive facts
- David vs. Goliath dynamics
- Satisfying justice / karma
- Mystery and unresolved questions

### Output
```json
{
  "segments": [
    {
      "segment_id": "",
      "start_timestamp": "",
      "end_timestamp": "",
      "text": "",
      "scores": {
        "hook_strength": 0,
        "emotional_volatility": 0,
        "pacing_density": 0,
        "virality_potential": 0,
        "clipability": 0,
        "novelty": 0,
        "controversy_tolerance": 0,
        "composite_score": 0
      },
      "recommended_style": "",
      "summary": ""
    }
  ]
}
```

---

## STEP 3 — SCRIPT (Agent 03: Script Engine)

Rewrite selected segments into retention-optimized short-form narration.

### Structural rules

1. **First 1-2 sentences = the hook.** If the viewer doesn't stay past second 2, nothing else matters.
2. **Remove all filler.** No "so basically," no "the thing is," no preamble.
3. **Compress exposition aggressively.** 30 seconds of context in the source = 5 seconds in the script.
4. **Escalate pacing every 5-10 seconds.** Each beat is faster or more intense than the last.
5. **Short sentences.** Favor punchy rhythm. 5-12 words per sentence when possible.
6. **Tension loops.** Open questions that pull the viewer forward: "But that wasn't the worst part."
7. **End on payoff or escalation.** Either resolve the tension (satisfying) or leave it unresolved (drives comments + rewatches).
8. **No dead air.** Every second must deliver information, emotion, or tension.

### Style options

| Style | Voice | Best for |
|-------|-------|----------|
| Deadpan documentary | Calm, factual, understated delivery with horrifying content | True stories, historical events |
| Ultra-dramatic | Intense, urgent, cinematic narration | Survival stories, danger, action |
| Gen Z irony | Detached, slightly amused, self-aware | Absurd facts, internet culture |
| Cinematic thriller | Low, deliberate, tension-building | Mystery, crime, conspiracy-adjacent |
| Absurdist comedy | Bemused, incredulous, dry humor | Weird facts, strange history |
| Fake-serious history | Overly formal narration of ridiculous events | Historical absurdity |
| Hype/motivational | Energetic, inspirational, fast-paced | Success stories, life hacks |

### Hook templates

```
Category: Impossibility
- "This is statistically impossible."
- "Nobody can explain how this happened."
- "Scientists still don't understand this."

Category: Survival
- "This [person] survived something that should have killed them [N] times."
- "They had a 0.01% chance of survival."
- "[Event] that was supposed to kill everyone on board."

Category: Revelation
- "This story sounds fake but isn't."
- "History accidentally created [superlative]."
- "No one noticed for [time period]."
- "This changes everything you thought about [topic]."

Category: Escalation
- "And then it got worse."
- "But that wasn't even the craziest part."
- "What happened next made [authority] call an emergency meeting."

Category: Direct challenge
- "You've been lied to about [topic]."
- "Everything you know about [topic] is wrong."
- "[Number]% of people get this wrong."
```

### Emphasis markers

Use these in the script to guide voice synthesis and caption styling:

| Marker | Meaning | Caption effect |
|--------|---------|---------------|
| `**word**` | Strong emphasis | Bold, larger font, color accent |
| `[PAUSE 0.5]` | Half-second pause | Blank screen or hold frame |
| `[PAUSE 1.0]` | One-second pause | Hold frame, tension build |
| `{escalate}` | Increase pacing | Faster cuts in video |
| `{drop}` | Slow down suddenly | Longer hold, dramatic effect |
| `[SFX: type]` | Sound effect cue | Bass drop, whoosh, impact |

### Output
```json
{
  "script": {
    "style": "",
    "total_duration_seconds": 0,
    "hook": "",
    "lines": [
      {
        "line_number": 1,
        "text": "",
        "duration_seconds": 0,
        "emphasis": "none|moderate|strong",
        "pause_after_seconds": 0,
        "emotional_intensity": 0,
        "pacing": "normal|fast|slow",
        "sfx_cue": ""
      }
    ]
  }
}
```

---

## STEP 4 — VISUALIZE (Agent 04: Visual Prompter)

Generate AI image/video prompts for each script line.

### Per-line generation

For each line in the script, produce:
- **Visual prompt**: Descriptive prompt for AI image or video generation
- **B-roll description**: What should appear on screen
- **Camera motion**: zoom, pan, static, rapid cuts
- **Subtitle emphasis**: How captions should appear for this line
- **Duration**: How long this visual holds

### Visual style options

| Style | Best for | Tools |
|-------|----------|-------|
| Realistic cinematic | True stories, documentaries | Runway, Kling, Veo |
| VHS / retro | Historical content, nostalgia | HyperFrames filters |
| Overstimulating TikTok edit | Gen Z audience, comedy | CapCut effects |
| Documentary montage | Multi-event stories | Stock + AI compositing |
| Low-poly surreal | Abstract concepts, sci-fi | Higgsfield, Meta.ai |
| Infographic chaos | Statistics, facts, comparisons | HyperFrames templates |
| Dark/moody atmosphere | Horror, thriller, mystery | Runway, dark color grade |
| Gameplay background | Story narration overlays | Non-copyright gameplay footage |

### Output
```json
{
  "visuals": [
    {
      "line_number": 1,
      "visual_prompt": "",
      "camera_motion": "static|zoom_in|zoom_out|pan_left|pan_right|rapid_cut",
      "subtitle_style": "default|bold_red|impact_white|glow|typewriter",
      "duration_seconds": 0,
      "tool": "meta.ai|higgsfield|runway|kling|stock|gameplay",
      "broll_description": ""
    }
  ]
}
```

---

## STEP 5 — OPTIMIZE (Agent 03: Script Engine, second pass)

Re-analyze the generated script for retention weaknesses.

### Check for

- **Dead zones**: Any 3+ second stretch without new information or emotion
- **Pacing drops**: Sudden deceleration without dramatic purpose
- **Weak transitions**: "And then" connectors that don't pull forward
- **Missing curiosity loops**: Sections where the viewer has no open question
- **Low emotional variance**: Monotone intensity for 10+ seconds
- **Missing pattern interrupts**: Over 15 seconds without a cut, tone shift, or new element

### Auto-fix patterns

| Problem | Fix |
|---------|-----|
| Dead zone | Cut or compress. Add a micro-revelation. |
| Pacing drop | Shorten sentences. Add escalation phrase. |
| Weak transition | Replace with tension connector: "But here's where it gets insane." |
| No curiosity loop | Insert open question: "And nobody knew what was coming next." |
| Low emotional variance | Add a beat shift: humor after tension, quiet after chaos. |
| No pattern interrupt | Insert SFX cue, visual style change, or pacing shift. |

### Target metrics

| Metric | Target |
|--------|--------|
| Estimated retention | > 75% average view duration |
| Hook retention (first 3 sec) | > 90% |
| Average cut interval | < 2.5 seconds |
| Emotional spike frequency | Every 8-15 seconds |
| Open curiosity loops | At least 1 active at all times after hook |

---

## STEP 6 — PLATFORM ADAPTATION (Agent 08: Distributor)

Generate platform-specific variants from the master script.

### Adaptation matrix

| Platform | Duration | Format | Captions | CTA | Hashtags |
|----------|----------|--------|----------|-----|----------|
| TikTok | 60-90 sec (1+ min for RPM) | 9:16, 1080x1920 | Burned-in, bold | Follow + comment | 3-5 niche + trending |
| YouTube Shorts | 30-60 sec | 9:16, 1080x1920 | Burned-in | Subscribe | 3-5 in description |
| Instagram Reels | 30-90 sec | 9:16, 1080x1920 | Burned-in | Save + share | 10-15 in caption |
| X Video | 30-60 sec | 16:9 or 9:16 | Burned-in | Repost | 1-2 max |

### Platform-specific rules

**TikTok (primary revenue):**
- Must be 1+ minute for Creator Rewards RPM
- Front-load the hook — TikTok swipe-away happens in first 1-2 seconds
- Use trending audio when possible (even if just 1 second at start)
- Comment-bait phrasing in description ("What would you do?")

**YouTube Shorts:**
- Can be shorter (30 sec) — YouTube pays on ads, not just duration
- Subscribe CTA at end — YouTube rewards subscriber conversion
- Use keywords in title for Shorts search

**Instagram Reels:**
- Save/share CTAs drive reach on Instagram's algorithm
- Hashtag volume matters more here than other platforms
- Caption under the video should tell a micro-story (not just a description)

---

## STEP 7 — PACKAGE (Agent 08: Distributor)

Final output assembly.

### Deliverables per clip

1. Clean narration script (markdown)
2. Timestamped edit plan (JSON)
3. AI video/image prompts per line (JSON)
4. Subtitle file (.srt or .vtt)
5. Thumbnail title ideas (3-5 options)
6. Viral title variants per platform (3-5 per platform)
7. Description text per platform
8. Hashtag suggestions per platform
9. Audio mood / music style suggestion
10. Master JSON export (full pipeline output)

All written to `_clips/{date}-{vertical}-{slug}/`.

---

## Safeguard Integration

Every script passes through the safeguard check (see `safeguards/POLICY.md`) at two points:

1. **After segment scoring** (Step 2) — source material flagged if it contains banned content
2. **After script generation** (Step 3) — generated script checked against content quality floor and hard bans

Flags:
- `pass` — content clears all safeguards
- `flag` — content is borderline, needs human review
- `block` — content violates a hard ban, auto-discarded

---

## Constraints

- Do not hallucinate historical facts unless content is explicitly labeled fiction
- Flag uncertain claims with qualifying language
- Preserve core narrative meaning during retention optimization
- Avoid copyright-sensitive direct quoting beyond fair use
- Optimize for engagement over completeness — a 60-sec clip can't cover everything
- Prioritize clarity and emotional momentum over information density

---

## Related Documents

- [[agents/README]] — full agent pipeline architecture
- [[../safeguards/POLICY]] — content standards (read first)
- [[hook-library]] — expanded hook templates by category
- [[platform-rpm]] — RPM rates and optimization strategies
- [[../../shared/agents/trend-scanner]] — shared trend detection agent
