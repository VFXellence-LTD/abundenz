# Agent 05 — Transcriber

## Purpose
Take the raw audio file from Stage 04 and produce a clean, timestamped transcript. The transcript is the source document for the Atomizer (Agent 08) and for the Editor (Agent 06). Accuracy on technical terminology is critical — pipeline vocabulary must be preserved correctly.

## Automation Tier
**Autonomous** — triggered when new raw audio file appears in `_recordings/raw/`. Runs without human input. Output reviewed as part of Atomizer review (not as a standalone step).

## Inputs
- Raw audio file: `_recordings/raw/{date}-{slug}-raw.mp3`
- Vocabulary hint list: `/shared/pipeline-vocab.txt` — proper nouns and technical terms to improve transcription accuracy (Ayon, ShotGrid, ftrack, Deadline, Tractor, Nuke, Houdini, etc.)

## Outputs
- Timestamped raw transcript: `_transcripts/{date}-{slug}-raw.txt`
  Format: `[HH:MM:SS] text`
- Clean transcript (filler words removed, obvious errors corrected): `_transcripts/{date}-{slug}-clean.txt`
- Confidence report: `_transcripts/{date}-{slug}-confidence.json`
  - Low-confidence segments flagged with timestamps for human review
  - Technical terms that may have been misspelled
- Airtable Content Pipeline update: `transcript_status: complete`, `transcript_path: {path}`

## Tools Required
- Whisper API (OpenAI) — primary transcription engine, best technical vocabulary handling
- OR AssemblyAI — alternative if Whisper quality insufficient on VFX terminology
- Claude API — post-processing: clean transcript, flag low-confidence segments, apply vocabulary hints
- Airtable API
- File system read/write

## Trigger
Airtable automation: when `recording_status` changes to `complete` on a Content Pipeline row → trigger transcription job.

OR: File system watcher on `_recordings/raw/` for new files.

## Prompt (Post-Processing Clean Pass)

```
You are the transcript cleaner for Signal, a VFX pipeline engineering content channel.

You have a raw transcript from Whisper with timestamps. Your job is to:

1. **Clean the transcript** — remove filler words (um, uh, like [when used as filler], you know), fix obvious run-on sentences, preserve natural speech patterns
2. **Correct technical terminology** — apply the vocabulary list below. Any word that sounds like a term in this list should be corrected to its proper form.
3. **Flag low-confidence segments** — mark any segment where the transcription feels uncertain (wrong word, missing context, garbled) with [REVIEW NEEDED: {timestamp}]
4. **Preserve meaning** — do not rephrase, add, or remove content. Clean only.

## Vocabulary list
{pipeline_vocab_list}

## Raw transcript
{raw_transcript}

## Output
Produce two outputs:

**1. Clean transcript** (full text, no timestamps in body, timestamps only at paragraph breaks):
[00:00:00]
{paragraph 1 — first section of speech}

[00:02:30]
{paragraph 2}
...

**2. Confidence notes** (JSON array):
[
  {"timestamp": "00:03:15", "issue": "term unclear — sounds like 'nuke' but may be 'Nuke' (compositor)", "suggested": "Nuke"},
  {"timestamp": "00:05:40", "issue": "sentence incomplete — recording may have cut off", "suggested": "REVIEW NEEDED"}
]
```

## Error Handling / Escalation
- Audio file not found: log error, notify human via Slack webhook. Do not proceed.
- Whisper API failure: retry 2x, then fall back to AssemblyAI. Log which service was used.
- Transcript confidence < 85% overall (Whisper confidence metric): flag entire transcript for human review before proceeding to Atomizer.
- Technical term mis-transcription detected (known term in vocab list transcribed incorrectly): auto-correct in clean transcript, log the correction.
- Audio contains non-English segments: transcribe, mark language, do not attempt translation here. Translation Agent (future) handles this.

## Build Order Dependency
None — builds standalone. The Atomizer (Agent 08) depends on this agent's output, so Transcriber must be built before Atomizer.

## Manual Fallback
Without this agent:
1. Upload audio to Whisper via OpenAI Playground or otter.ai
2. Download transcript
3. Read through and manually correct technical terminology (15-20 min)
4. Save as `{date}-{slug}-clean.txt` in `_transcripts/`
5. Proceed to outlining or Atomizer manually
