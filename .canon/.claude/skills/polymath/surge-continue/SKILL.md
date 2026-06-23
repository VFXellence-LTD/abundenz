# Skill: Surge Continue

```yaml
name: surge-continue
description: Resume a Surge campaign after a reviewer requested changes or rejected the prior draft. Reads the review notes, generates a fresh script-level draft addressing them, records a new pending approval, moves the task back to in-review, then HALTS. No publish, no accounts.
triggers:
  - "/surge-continue <campaignId>"
  - Resuming after an approval was rejected / changes-requested (task back at in-progress)
ecosystems: [surge]
```

---

## Scope

- Same hard scope as `/surge-generate`: script-level draft only, no render/voiceover/visual gen, NEVER publish, NEVER touch accounts, Surge brand isolation. The only difference is this run is informed by the prior review notes.

## Inputs

- Same doctrine set as `/surge-generate` (viral-formula, Zrodinger spec, hook-library, title-formula, viral-surge policy).
- The prior decision: `GET http://localhost:4500/api/approvals?ecosystem=viral` — find the most recent terminal (`rejected` / `changes-requested`) row for this campaign and read its `reviewNotes` and `contentJson`.

## Procedure

1. Resolve `<campaignId>` → `campaignId` + `taskId` (as in `/surge-generate`).
2. Fetch the prior approval's `reviewNotes`. If none found, fall back to behaving exactly like `/surge-generate`.
3. Generate a FRESH `ClipDraft` that explicitly addresses the notes (e.g. stronger hook, add FTC disclosure, swap the tool). Do not reuse a blocked draft verbatim.
4. Write it to `./.tmp-draft.json` and invoke the SAME driver:
   ```
   pnpm -C D:\VFXellence-LTD\polymath\packages\agents run surge:run -- --draft ./.tmp-draft.json --task <taskId> --campaign <campaignId> --slug <kebab-topic>
   ```
5. Report the new safeguard verdict, `artifactPath`, `approvalId`, and that the task is back at `in-review`. HALT. No publish, no social accounts, no render.

## Dry-run verification

Given a campaign whose last approval is `changes-requested` with note "hook too weak, add #ad", a run should produce a new draft.json with a stronger hook and an FTC disclosure in the caption, a new pending approval, and the task at `in-review` — without ever publishing.

## Related

- `surge-generate` — the first-pass loop this mirrors
- `src/driver.ts` — shared engine
