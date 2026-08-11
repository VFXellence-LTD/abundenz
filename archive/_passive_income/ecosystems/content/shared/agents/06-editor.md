# Agent 06 — Editor

## Purpose
Take the raw audio recording and produce broadcast-ready edited audio: silence trimmed, filler words removed, levels normalized, intro/outro music added. For video format, produce a rough-cut edit with screen capture synchronized to audio. This is automation-first; the human does not need to touch an audio editor.

## Automation Tier
**Autonomous** — tool-driven (Auphonic or Descript API). Runs after transcript is complete. Human only reviews if confidence check fails. The editor's output feeds directly to Atomizer (Agent 08) and thumbnail generation (Agent 07).

## Inputs
- Raw audio: `_recordings/raw/{date}-{slug}-raw.mp3`
- Clean transcript: `_transcripts/{date}-{slug}-clean.txt` (timestamped — used for edit guidance)
- Confidence report: `_transcripts/{date}-{slug}-confidence.json` (flags problem sections)
- Optional: raw screen capture: `_recordings/raw/{date}-{slug}-screen.mp4`
- Intro/outro audio files: `/assets/audio/signal-intro.mp3`, `/assets/audio/signal-outro.mp3`
- Edit profile: `/assets/audio/auphonic-profile.json` (noise reduction, loudness normalization settings)

## Outputs
- Edited audio: `_recordings/edited/{date}-{slug}-edited.mp3`
  - Normalized to -16 LUFS (podcast standard)
  - Noise reduction applied
  - Silence trimmed (>1.5 sec replaced with 0.8 sec pause)
  - Filler word segments removed using transcript timestamps
  - Intro/outro appended
- Edit log: `_recordings/edited/{date}-{slug}-edit-log.json`
  - List of removed segments with timestamps
  - Before/after duration
  - Issues flagged during processing
- Optional: rough-cut video: `_recordings/edited/{date}-{slug}-rough.mp4`
- Airtable update: `edit_status: complete`, `edited_audio_path: {path}`, `final_duration_min: {n}`

## Tools Required
- Auphonic API — primary audio processing (noise reduction, loudness normalization, silence removal)
  - OR Descript API — if edit-by-transcript is preferred
  - OR Adobe Podcast API (beta) — alternative
- FFmpeg — audio manipulation, intro/outro splicing, format conversion
- Python script — orchestration, edit log generation, Airtable update
- Airtable API

## Trigger
Airtable automation: when `transcript_status` changes to `complete` → trigger edit job.

## Edit Sequence

```
1. Input validation
   - Confirm raw audio file exists and is > 30 seconds
   - Confirm transcript exists and is linked

2. Auphonic processing pass
   - Apply noise reduction profile
   - Normalize to -16 LUFS
   - Reduce silence to 0.8 sec max

3. Filler word removal (transcript-guided)
   - Load confidence report — skip removal in low-confidence segments (safer to leave than to remove wrong thing)
   - For each flagged filler word timestamp in transcript: apply 50ms fade-out, remove segment, apply 50ms fade-in on next segment
   - Log each removal with timestamp

4. Intro/outro splice (FFmpeg)
   - Prepend signal-intro.mp3 (cross-fade 0.5 sec)
   - Append signal-outro.mp3 (cross-fade 0.5 sec)

5. Final loudness check
   - Run loudnorm filter: confirm -16 LUFS ± 1
   - Check peak: no clips (> -1dBTP)

6. Export
   - MP3 320kbps for YouTube/podcast
   - WAV 44.1kHz 24-bit for archival

7. Video sync (if screen capture exists)
   - Align audio to screen capture using FFmpeg
   - Produce rough-cut MP4 (audio replaced with edited audio, video untouched)
   - Note: this is a rough cut — no title cards, no graphics, just sync
```

## Prompt (Edit Review Summary)

```
You are reviewing the edit log for a Signal podcast episode.

## Edit summary
Original duration: {original_duration}
Edited duration: {edited_duration}
Segments removed: {n}
Filler words removed: {n}
Silence reduced: {n} instances

## Flagged issues
{issues_from_edit_log}

## Task
Write a 3-5 sentence edit summary for the human. Include:
1. Final duration
2. Quality assessment (clean, acceptable, needs manual attention?)
3. Any specific timestamps the human should listen to before approving
4. Whether the recording is ready to proceed to Atomizer

Format as a brief digest message, not a report.
```

## Error Handling / Escalation
- Auphonic API failure: retry 2x, then fall back to local FFmpeg-only processing (no AI noise reduction). Note in log.
- Audio clipping detected: flag for human. Do not process clipped audio — it cannot be recovered. Request re-record.
- Duration after editing < 6 minutes: flag to human — recording may be too short for pillar format. Suggest options: re-record, or publish as Short/clip format instead.
- Duration > 25 minutes: flag to human — may need to split into two episodes.
- Sync failure (video): log error, produce audio-only output. Human can resync video manually if needed.

## Build Order Dependency
Requires Agent 05 (Transcriber) output. Build order: Transcriber → Editor.

## Manual Fallback
Without this agent:
1. Upload audio to Auphonic.com manually
2. Apply preset: noise reduction + loudness normalization
3. Download processed audio
4. In Audacity: manually remove long silences and obvious filler word sections
5. Splice intro/outro with Audacity or FFmpeg:
   ```
   ffmpeg -i intro.mp3 -i recording.mp3 -i outro.mp3 -filter_complex '[0][1][2]concat=n=3:v=0:a=1' output.mp3
   ```
6. Save to `_recordings/edited/` with correct naming convention
Total manual time: 30-60 minutes per episode.
