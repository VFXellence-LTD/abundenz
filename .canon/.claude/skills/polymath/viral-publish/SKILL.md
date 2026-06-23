---
name: viral-publish
description: Documents the human-gated publish flow for the Viral ecosystem social distribution.
trigger: when Boss asks to publish a clip, go live, distribute to social, or asks about publishing status
halt: Boss-clicked button only
---

# Viral Publish Skill

## Stage: HALT (Boss-gated)

**HALT. Publish is a Boss-clicked button only. Claude never auto-publishes, never creates accounts, never enters or stores credentials.**

## What this covers

Publishing a rendered, Boss-approved video clip from the Viral ecosystem to social platforms (TikTok, YouTube, Instagram) via the Mission Control Approval Queue.

## Gate (enforced server-side)

POST /api/publish is accepted ONLY when:
- `approval_queue.content_type = 'video'` (rendered artifact, not script draft)
- `approval_queue.status = 'approved'` (Boss explicitly approved)

Any other state → 409 Conflict. No exceptions.

## Dry-run default

Without per-brand credentials configured (`BUFFER_TOKEN__VIRAL`, `POSTIZ_API_KEY__VIRAL` + `POSTIZ_API_URL__VIRAL`), every publish call runs through `DryRunDistributor`:
- Logs: `[publish] WOULD PUBLISH to <platform>: <caption>`
- Returns `{ status: "skipped", dryRun: true }`
- No network call, zero spend, no real post

The dashboard shows a prominent **DRY RUN — not actually posted** banner.

## Workflow (dry-run to live)

1. Boss approves a rendered video in the Approval Queue
2. Boss clicks the **Publish** button on the card
3. Server POSTs /api/publish, runs through distributor (dry-run if no creds)
4. Dashboard shows result per platform + dry-run banner if applicable
5. Task status → `published`

See GO-LIVE-HANDOFF.md for the steps to go from dry-run to live distribution.

## Doctrine reminders

- NEVER autonomous: no scheduler, cron, agent, or WS event may trigger /api/publish
- Per-asset: one click per approval, no bulk publish
- Brand isolation: Viral credentials are separate from Content
- FTC disclosure required on affiliate ecosystem captions before publish is allowed
