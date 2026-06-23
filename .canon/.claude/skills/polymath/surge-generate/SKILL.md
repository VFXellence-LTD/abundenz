# Skill: Surge Generate

```yaml
name: surge-generate
description: Generate ONE script-level Zrodinger (tech/AI-tools) viral clip DRAFT, safeguard-check it, write the artifact, record a pending approval, move the task to in-review, then HALT. No video render, no voiceover, no publishing, no social accounts.
triggers:
  - "/surge-generate <campaignId>"
  - Spawned by Mission Control session start for a Surge campaign
ecosystems: [surge]
arguments:
  - campaignId (required): the campaign this draft belongs to
```

---

## Scope (READ FIRST — non-negotiable)

- Produce exactly ONE clip draft at SCRIPT LEVEL: `{hook, script, shotlist, caption, hashtags, sourceRefs}`. NO `.mp4`, NO voiceover, NO image/video generation, NO CapCut. Those are later autonomy stages — not this skill.
- NEVER publish. NEVER log into or touch any social account. The skill ends at "pending approval + task in-review".
- BRAND ISOLATION: Surge is anonymous. Use only the `zrodinger` sub-brand (Abundenz parent). Never reference the operator, "Robin", VFXellence, Halon, Polymath, or any other ecosystem in the draft text.
- The safeguard check is a HARD GATE handled by the supporting TS. A blocked draft is still written + recorded for human review — you do NOT discard it and you do NOT try to "fix and republish".

## Inputs to load (read-only doctrine)

You run with `cwd = D:\VFXellence-LTD\polymath\packages\agents`. Read these before writing anything:

1. `D:\VFXellence-LTD\.canon\2_architect\polymath-business\ecosystems\viral\shared\playbooks\viral-formula.md` — the SCRIPT step rules (hook first, no filler, escalate pacing, short sentences, end on payoff).
2. `D:\VFXellence-LTD\.canon\2_architect\polymath-business\ecosystems\viral\verticals\tech\README.md` — the Zrodinger vertical spec (tone "informed insider", no face, dark UI, content formats, hook patterns, source material). This is the vertical you write for.
3. `D:\VFXellence-LTD\.canon\2_architect\polymath-business\ecosystems\viral\shared\playbooks\hook-library.md` — pull from the "Tech / AI Tools (Zrodinger-specific)" hooks.
4. `D:\VFXellence-LTD\.canon\2_architect\polymath-business\ecosystems\viral\shared\playbooks\title-formula.md` — apply [NUMBER][ADJECTIVE][TOPIC][ENFORCEMENT] + the "you" rule to the caption/title angle.
5. `D:\VFXellence-LTD\.canon\1_controller\standards\polymath-business\safeguards\viral-surge.md` — the POLICY. Internalize the 7 hard bans, quality floor, FTC + AI disclosure. Write so the draft passes.

## Procedure

1. **Resolve the campaign.** Call `GET http://localhost:4500/api/campaigns?ecosystem=viral`, find the row whose `id` matches `<campaignId>`. Capture its `verticalId` and the associated task id (the campaign's task; if absent, query `GET /api/tasks?ecosystem=viral` for the in-progress Surge task tied to this campaign). You need `taskId` and `campaignId` for the recording step. If you cannot resolve them, STOP and report — do not invent ids.
2. **Pick a topic.** From the Zrodinger source-material types (Product Hunt / HN / TikTok Shop trending) choose ONE concrete tool/comparison. Keep it real and current; if you are not certain a claim is true, mark its sourceRef `confidence: "unverified"` and use qualifying language ("reportedly", "the listing claims").
3. **Generate the draft** as a `ClipDraft` object (the shape is defined in `src/types.ts`):
   - `brand`: `"zrodinger"`.
   - `hook`: one line, < 15 words, a Zrodinger-specific hook. Never an anti-pattern ("Hey guys", "So today", "In this video").
   - `script`: ~30-45s of narration, 50-180 words. Hook first, no filler, short punchy sentences, one curiosity loop, end on payoff. Include an AI disclosure cue and (if it pushes an affiliate CTA) an FTC-safe disclosure.
   - `shotlist`: 3-8 entries, each `{line, visual (on-screen description only), narration, durationSeconds}`. Dark UI / screen-recording style, no face.
   - `caption`: platform caption built with the title formula; MUST include an AI-generated disclosure; include an FTC disclosure (e.g. "#ad" / "includes paid links") if any affiliate/sign-up CTA is present.
   - `hashtags`: 3-5, tech/AI-tools niche + 1 trending.
   - `sourceRefs`: at least one `{label, url?, confidence}`.
   - `safeguardReport`: leave `null` — the TS fills it.
4. **Write the draft to a temp json**, e.g. `./.tmp-draft.json` in the package dir (use the Write tool).
5. **Invoke the driver** (this does safeguard → write artifact → record approval → PATCH task → halt):
   ```
   pnpm -C D:\VFXellence-LTD\polymath\packages\agents run surge:run -- --draft ./.tmp-draft.json --task <taskId> --campaign <campaignId> --slug <kebab-topic>
   ```
6. **Read the printed JSON result.** Report to the operator (one line): the safeguard verdict (PASS/BLOCKED + flag count), the `artifactPath`, the `approvalId`, and that the task is now `in-review`.
7. **HALT. No publish, no social accounts, no render.**

## Dry-run verification (how to confirm the skill is correct without an LLM)

Hand-author a sample `ClipDraft` json and run step 5 against a running MC server (or the mocked tests). Expect: a `draft.json` + `draft.md` under `packages/agents/drafts/`, a new `pending` row from `GET /api/approvals?status=pending&ecosystem=viral` whose `contentJson.safeguardReport` is present, and the task at `in-review`. A deliberately weak hook ("Hey guys") must produce a `BLOCKED-`-prefixed dir AND still appear as a pending approval with `pass:false` — proving the gate logs rather than drops.

## Related

- `src/driver.ts` / `bin/surge-run.ts` — the tested engine this skill drives
- `surge-safeguard-check` skill — standalone re-check of a draft
- `surge-continue` skill — resume / re-run after changes-requested
