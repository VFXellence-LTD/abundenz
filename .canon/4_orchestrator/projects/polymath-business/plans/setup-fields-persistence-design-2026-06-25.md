# Design — Mission Control: Persistent Setup Fields

**Date:** 2026-06-25
**Domain:** VFXellence / Polymath
**App:** Mission Control (`.canon/.mission-control`)
**Status:** APPROVED (Boss, 2026-06-25)
**Branch:** `worktree-mc-walkthrough-feedback`

## Goal

Turn the Setup wizard from static instruction cards into a stateful data-collection flow: each step gains input **fields** that capture the operator's "pertinent info" (registered domain, brand email, channel URLs, social handles, etc.) and persist to the database. Step **completion** tracking already exists and stays as-is.

## Decisions (Boss, 2026-06-25)
- Completion is **independent** of fields — the existing manual toggle is kept; a step can be marked complete regardless of field values.
- Field values **autosave on blur** (debounced, optimistic), with a subtle "saved" indicator. No save button.
- **Content ecosystem only** for now (the only ecosystem with real steps). The field system is data-driven, so other ecosystems get fields later with no code change.

## What already exists (do not rebuild)
- `setup_progress (step_id TEXT PRIMARY KEY, done INTEGER)` + `GET /setup` + `POST /setup/toggle` + `useSetupProgress` hook drive completion and the "X/8 steps" bar. Unchanged by this work.
- `SetupStep` type: `{ id, ecosystemId, order, title, description, instructions, copyBlocks?, externalLinks? }` in `client/src/types/index.ts`.
- `SETUP_STEPS` flat array in `client/src/data/setup-steps.ts`; 8 Content steps: `domain, email, youtube, beehiiv, ghost, socials, first_episode, agent_01`.
- `SetupStep` component (`client/src/components/SetupStep.tsx`) renders an expandable card: instructions, copy blocks, external links. Field inputs go after the instructions block.
- DB driver `better-sqlite3`; tables created via `CREATE TABLE IF NOT EXISTS` in `db.ts migrate()`; additive `ALTER TABLE` migrations wrapped in try/catch.
- Pattern to mirror for read+write+persist: transactions route/service/hook triple, and the existing `SetupService`.

## Feature 1 — Field schema in data

`client/src/types/index.ts`:
```ts
export type SetupFieldType = "text" | "url" | "email" | "textarea";
export interface SetupField {
  key: string;          // unique within the step
  label: string;
  type: SetupFieldType;
  placeholder?: string;
}
```
Add `fields?: SetupField[]` to the `SetupStep` interface.

`client/src/data/setup-steps.ts` — add a `fields` array to each Content step:
- `domain`: `domain` (url) — "Registered domain"
- `email`: `address` (email) — "Brand email address"
- `youtube`: `channelUrl` (url) — "Channel URL"; `channelName` (text) — "Channel name"
- `beehiiv`: `newsletterUrl` (url) — "Newsletter URL"
- `ghost`: `blogUrl` (url) — "Blog URL"
- `socials`: `x` (text) — "X / Twitter handle"; `linkedin` (text); `tiktok` (text); `instagram` (text)
- `first_episode`: `url` (url) — "First post/episode URL"; `title` (text) — "Title"
- `agent_01`: `niche` (text) — "Niche / topic"; `sources` (textarea) — "Sources to monitor (comma-separated)"

## Feature 2 — Persistence (server)

`server/db.ts` — add in `migrate()`:
```sql
CREATE TABLE IF NOT EXISTS setup_data (
  ecosystem_id TEXT NOT NULL,
  step_id      TEXT NOT NULL,
  field_key    TEXT NOT NULL,
  value        TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (ecosystem_id, step_id, field_key)
);
```

`server/services/setup.service.ts` — add:
- `getData(ecosystemId: string): Record<string, Record<string, string>>` — rows for that ecosystem, shaped as `{ [stepId]: { [fieldKey]: value } }`.
- `setField(ecosystemId: string, stepId: string, fieldKey: string, value: string): void` — upsert (`INSERT ... ON CONFLICT(ecosystem_id, step_id, field_key) DO UPDATE SET value = excluded.value`).

`server/routes/setup.ts` — add (keep existing `/` and `/toggle`):
- `GET /setup/data/:ecosystemId` → `svc.getData(ecosystemId)`.
- `PUT /setup/data` → body `{ ecosystemId, stepId, fieldKey, value }`; validate all four are strings (`value` may be empty string); `svc.setField(...)`; respond `{ ok: true }`. 400 on missing/invalid keys.

## Feature 3 — Client wiring

`client/src/hooks/useSetupData.ts` (new):
- `useSetupData(ecosystemId)`: fetches `GET /setup/data/:ecosystemId` into `Record<stepId, Record<fieldKey, string>>` on mount / ecosystem change.
- `getFieldValue(stepId, fieldKey): string` — from local state (default "").
- `saveFieldValue(stepId, fieldKey, value)`: optimistic local update + `PUT /setup/data`. Debounced so rapid blur/typing coalesces.
- Returns a per-field save status enough to show a "saved" tick.

Debounce as a **pure helper** `client/src/lib/debounce.ts` (`debounce(fn, ms)`), unit-tested with fake timers — keeps the hook thin and the timing logic testable.

`client/src/components/SetupStep.tsx`:
- Accept the field-value getter/saver (via props from `SetupPage`/`SetupStepper`, mirroring how `onToggleComplete`/`isComplete` are already threaded).
- After the instructions `<p>`, render `step.fields` (if any) as labeled inputs (text/url/email → `<input>`, textarea → `<textarea>`), reusing the existing `inputCls` styling from `BugReportButton`/setup. Value = `getFieldValue(step.id, field.key)`; `onBlur` → `saveFieldValue`; show a subtle "saved ✓" indicator after a successful save.
- Completion circle and existing content unchanged.

`client/src/pages/SetupPage.tsx` / `SetupStepper.tsx`: instantiate `useSetupData("content")` and thread `getFieldValue`/`saveFieldValue` down to `SetupStep`, same way `useSetupProgress` is already threaded.

## Testing
- **Server** (vitest, mirror existing setup tests): `SetupService.setField` upserts a new row; a second `setField` on the same key overwrites; `getData` returns the nested shape for the right ecosystem and ignores other ecosystems. Route: `PUT /setup/data` 400s on missing keys, 200 + persists on valid body; `GET /setup/data/:ecosystemId` returns saved values.
- **Client**: `debounce` pure helper — coalesces calls, fires once after the window (fake timers). SetupStep field rendering + autosave verified in the browser (worktree dev server).

## Files
**New:** `server` — none new (extend service/route/db); `client/src/hooks/useSetupData.ts`, `client/src/lib/debounce.ts`, `client/src/lib/debounce.test.ts`, server test additions.
**Modify:** `server/db.ts`, `server/services/setup.service.ts`, `server/routes/setup.ts`, `client/src/types/index.ts`, `client/src/data/setup-steps.ts`, `client/src/components/SetupStep.tsx`, `client/src/components/SetupStepper.tsx`, `client/src/pages/SetupPage.tsx`.

## Out of scope (YAGNI)
- Field validation / required-field gating (completion is independent).
- Fields for Viral / Products / Affiliate (placeholder steps).
- Re-keying `setup_progress` per ecosystem (works fine content-only; revisit when other ecosystems get real steps).
