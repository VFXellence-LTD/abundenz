# Skill: Surge Render

```yaml
name: surge-render
description: Render an APPROVED Zrodinger (tech/AI-tools) clip draft into an mp4 + thumbnail via the adapter pipeline, record a SECOND pending approval (content_type='video'), then HALT. No publish, no social accounts.
triggers:
  - "/surge-render <approvalId>"
  - Spawned by Mission Control session start after a clip approval
ecosystems: [surge]
arguments:
  - approvalId (required): the approval_queue id of the approved content_type='clip' row
```

---

## Scope (READ FIRST — non-negotiable)

- Runs ONLY on an already-`approved` `content_type='clip'` row. Never renders an unapproved or rejected draft.
- NEVER publish. NEVER log into or touch any social account. The skill ends at "second pending video approval + HALT".
- BRAND ISOLATION: Surge is anonymous. AI voice = anonymous Surge voice id (`ELEVENLABS_SURGE_VOICE_ID`), never the operator's voice. No owner identity in rendered artifacts or approval rows.
- **Paid-tool doctrine:** The real ElevenLabs TTS path costs money. **Boss must approve spend before the real path runs.** Default is dry-run (free stub) — this is what runs without `ELEVENLABS_API_KEY`. Higgsfield / Meta.ai / HyperFrames are free but external; absence triggers dry-run stubs.
- Output: a `RenderedClip` artifact (videoPath .mp4 + thumbnailPath .png) and a new `pending` `approval_queue` row with `content_type='video'`. Plan 6 consumes that row for final human-gated publish.

## Procedure

1. **Confirm the approval.** Call `GET http://localhost:4500/api/approvals/<approvalId>`. Verify `status='approved'` and `content_type='clip'`. If either fails — STOP and report; do not render.
2. **Run the render driver:**
   ```
   pnpm -C D:\VFXellence-LTD\polymath\packages\agents run surge:render -- --approval <approvalId> --api http://localhost:4500/api [--force-dry-run]
   ```
   Add `--force-dry-run` unless Boss has explicitly approved ElevenLabs spend AND `ELEVENLABS_API_KEY` is set.
3. **Read the printed JSON result.** It contains: `{ halted, approvalId (the new video approval id), videoPath, dryRun }`.
4. **Report one line to the operator:** the new video approvalId, the videoPath, dryRun flag, and that a second pending approval has been recorded.
5. **HALT after render. No publish. Human approves the rendered video before publish.**

## Dry-run verification

Run against a running MC server with an approved clip approval id. Expect: a new `content_type='video'` pending row in `GET /api/approvals?status=pending`, a stub mp4 at `packages/agents/artifacts/<campaign>/<slug>.mp4`, and `dryRun:true` in the printed result.

## Related

- `src/renderDriver.ts` / `bin/surge-render.ts` — the tested engine this skill drives
- `surge-generate` skill — produces the approved clip this skill consumes
- `GET /api/artifacts/:id` — the route ContentPreview uses to serve the rendered video for review
