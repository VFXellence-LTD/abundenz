# Agent 04 — Voice Recording

## Purpose
This is not an agent. This is the human stage. The owner records the pillar piece. This document exists to define the recording environment, file conventions, and handoff to Agent 05 (Transcriber).

## Automation Tier
**Human-core** — no AI substitution for primary recordings. The owner's real voice is the moat. AI voice clones are acceptable ONLY for: short patches (under 15 seconds), missed pickups on evergreen content, and translated derivatives. Never for primary content.

## Inputs
- Approved outline from Agent 03 (`_outlines/{date}-{slug}.md`)
- Recording environment ready (see setup below)

## Outputs
- Raw audio file: `_recordings/raw/{date}-{slug}-raw.mp3` or `.wav`
- Optional: raw screen capture (if screen share format): `_recordings/raw/{date}-{slug}-screen.mp4`
- Airtable Content Pipeline row update: `recording_status: complete`, `recording_date: {today}`

## Recording Environment Standards

### Audio setup
- Microphone: dynamic or condenser, within 8-12 inches, pop filter in place
- Room: acoustically treated or naturally deadened (not a reverberant room)
- Background: silent — no HVAC, fans, traffic if possible. If ambient noise unavoidable, consistent noise floor preferred over variable noise.
- Headphones: monitor during recording to catch quality issues immediately

### Software
- Audacity (free) or Hindenburg Journalist or Reaper — record at 44.1kHz, 24-bit minimum
- Screen share format: OBS or Camtasia for simultaneous screen + audio capture

### File naming convention
```
{YYYY-MM-DD}-{slug}-raw.{ext}
```
Example: `2025-05-08-ayon-naming-conventions-raw.mp3`

Slug comes from the outline filename. Match it exactly — downstream agents use this slug for all derivative filenames.

### During recording
- Keep the outline visible on a second monitor or printed
- Do not read verbatim — use bullet points as a map, speak naturally
- If you make a mistake: pause, breathe, pick up from the start of the sentence. Editors handle the rest.
- Record one complete pass before doing pickups — do not stop and restart section by section
- State the time at the start: "Recording {slug}, {date}, take 1" — helps the Transcriber timestamp correctly
- Leave 2 seconds of silence at start and end — needed for noise floor detection

### Quality check (before handing off)
- Listen to first 30 seconds — audio is clear, no clipping, no hum
- Check levels: peaks should be between -12dB and -6dB, no clipping (red)
- Confirm the recording caught the full session (not cut off)
- If catastrophic quality issue: re-record before handing off to Transcriber

## AI Voice Clone Policy

AI voice is acceptable ONLY for:
1. **Short patches** (under 15 seconds): words missed or mispronounced in otherwise clean recording
2. **Missed pickups** on evergreen content: if a section needs updating months later and re-recording is impractical
3. **Translated derivatives**: audio in other languages for international content (flagged as AI-translated in description)

AI voice is NEVER used for:
- Primary recordings
- Long sections (> 15 seconds)
- New content generation
- Any content without disclosure if AI voice was used in final output

## Trigger
Manual. Owner records after outline is approved. No scheduling automation.

## Handoff
After recording:
1. Move file to `_recordings/raw/{date}-{slug}-raw.mp3`
2. Update Airtable row: `recording_status = complete`
3. This triggers Agent 05 (Transcriber) via Airtable automation or webhook

## Time Estimate
- Prep (outline review + environment check): 5 min
- Recording (8-15 min pillar): 10-20 min (usually 1.2-1.5x final length including retakes)
- Quality check: 5 min
- **Total owner time: 20-30 minutes per pillar**
