# Workflow: Story Factory — AI-Generated Narrative Pipeline

Generates original short-form content from AI-created stories. No external source material required — Claude generates the narrative, the pipeline handles everything else.

Primary use: horror stories, historical dramatizations, "impossible facts" compilations, motivational narratives.

---

## Overview

```
INPUT:  Genre + optional topic/constraints
OUTPUT: Published story clips across platforms
SOURCE: AI-generated (no copyright concerns, no sourcing friction)
```

---

## When to Use Story Factory vs. Clip Factory

| Clip Factory | Story Factory |
|-------------|---------------|
| Repurposes existing content | Generates original content |
| Needs a source URL/transcript | Needs only a genre and optional topic |
| Source quality varies | Consistent output quality |
| Copyright considerations | No copyright concerns (AI-generated) |
| Limited by available sources | Unlimited production capacity |

---

## Pipeline

### Step 1: Story Generation

Claude generates a complete short narrative based on genre rules.

**Prompt structure:**
```
Generate a [GENRE] story for a [DURATION]-second short-form video.

Genre: [scary|historical|impossible-facts|motivational|absurdist]
Topic constraint: [optional — "survival stories" or "ancient Rome" or "ocean facts"]
Tone: [STYLE from viral-formula.md style options]
Target audience: [vertical's audience description]

Requirements:
- Opening line must be a hook (see viral-formula.md hook templates)
- Story must escalate every 5-10 seconds
- Factual claims must be verifiable OR explicitly labeled as fiction
- Total word count: [DURATION * 2.5] words (approx 2.5 words/second for narration)
- End on payoff or cliffhanger (specify which)

Safeguards:
- No content violating viral/safeguards/POLICY.md
- Flag uncertain historical claims
- No real-person impersonation
```

### Step 2: Story Review + Scoring

Same as Clip Factory Stage 2-3 — score the generated story, optimize for retention.

### Steps 3-7: Standard Pipeline

Visual prompts → Voice synth → Assembly → Captions → Distribution. Identical to Clip Factory Stages 5-11.

---

## Genre Templates

### Horror/Scary Stories

```
- Setting: isolated, dark, confined spaces
- Structure: normalcy → creeping wrongness → escalation → revelation → aftermath
- Voice style: deadpan documentary or cinematic thriller
- Visual style: dark/moody atmosphere, VHS filters, analog horror
- Duration: 60-90 seconds
- Hook pattern: "This story sounds fake but isn't" / "Nobody can explain what happened"
- End pattern: unresolved — leaves the viewer unsettled
```

### Historical "Impossible" Facts

```
- Setting: real historical events, verified facts
- Structure: setup context → introduce the impossible element → escalate → payoff
- Voice style: fake-serious history or deadpan documentary
- Visual style: documentary montage, historical imagery (AI-generated)
- Duration: 60-90 seconds
- Hook pattern: "History accidentally created..." / "This is statistically impossible"
- End pattern: resolved — the payoff IS the impossible fact
- CONSTRAINT: all claims must be verifiable. Include source material in metadata.
```

### Motivational/Success

```
- Setting: real or plausible success stories
- Structure: obstacle → attempt → setback → breakthrough → lesson
- Voice style: hype/motivational
- Visual style: cinematic, bright, energetic
- Duration: 30-60 seconds
- Hook pattern: "[Person] went from [bad state] to [good state] in [time]"
- End pattern: call to action or inspirational close
- CONSTRAINT: no income guarantees. "Results not typical" framing required.
```

---

## Batch Story Generation

For daily production at scale:

```
Daily story batch:
  1. Generate 15-20 stories across active genres
  2. Score all stories (Segment Scorer)
  3. Select top 10 by composite score
  4. Run top 10 through Script Engine optimization
  5. Safeguard check (discard blocked, flag borderline)
  6. Pipeline remaining clips through visual → voice → assembly → distribute
```

---

## Episodic Content (Cliffhanger Series)

For stories too long for one clip, auto-split into episodes:

```
If story word count > [DURATION * 3] words:
  1. Split at natural tension points
  2. Each part ends on a cliffhanger
  3. Part 1 caption: "Part 1... follow for part 2"
  4. Release parts 24-48 hours apart
  5. Track which series drive the most follows (RPM Tracker)
```

Episodic content drives follows, which drives monetization eligibility. Prioritize series for new accounts that need to reach follower thresholds.
