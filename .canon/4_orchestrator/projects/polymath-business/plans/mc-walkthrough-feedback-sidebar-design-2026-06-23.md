# Design — Mission Control: Sidebar Reorg + Interactive Walkthrough + Feedback Capture

**Date:** 2026-06-23
**Domain:** VFXellence / Polymath
**App:** Mission Control client (`D:\VFXellence-LTD\.canon\.mission-control`)
**Status:** APPROVED (Boss, 2026-06-23)

## Goal

Make Mission Control self-explanatory and easier to operate:

1. **Sidebar** reorganized into logical workflow order with grouped, labeled sections.
2. **Interactive walkthrough** that explains each major view in workflow order — auto-runs on first visit, replayable on demand.
3. **Feedback capture** that accumulates improvement notes during a session and, when the user is done, files them as GitHub issues (off by default, dry-run).

## Constraints / doctrine

- Dependency-light, hand-rolled UI (Tailwind 4, React Router v7, hooks-only state — no Zustand/Redux, no component library). New work matches that style.
- Tour engine is **custom** (spotlight overlay + anchored tooltip), not a library. driver.js is the fallback only if custom proves fiddly.
- Feedback filing is **off by default** behind `MC_FEEDBACK_ENABLED`; unset → dry-run (returns synthetic URLs, files nothing). Mirrors the existing `bug-report` bridge exactly.
- Publish / ad-spend human-gating doctrine untouched. This feature touches no publishing path.

## Feature 1 — Sidebar grouped sections

Edit `client/src/components/Sidebar.tsx`. Replace the flat `NAV_ITEMS` array with a grouped structure rendered with section headers (uppercase, `text-xs`, `zinc-500`).

| Section | Items (in order) | Routes (unchanged) |
|---------|------------------|--------------------|
| **Overview** | Dashboard | `/` |
| **Build** | Setup, Launch, Intake | `/setup/content`, `/launch/viral/tech`, `/intake` |
| **Operate** | Campaigns, Agents, Sessions, Approvals, Board | `/campaigns`, `/agents`, `/sessions`, `/approvals`, `/board` |
| **Money** | Earnings, Transactions, Tax Center | `/earnings`, `/transactions`, `/tax` |
| **Admin** | Tools, Entity | `/tools`, `/entity` |

- Approvals stays in **Operate** (Boss decision 2026-06-23).
- Each nav item gets a stable `data-tour-id` attribute for tour anchoring (e.g. `data-tour-id="nav-setup"`).
- Route paths, icons (lucide-react), and `NavLink` active-state logic are unchanged.
- Replay "Walkthrough" button lives in the sidebar footer (see Feature 2).

## Feature 2 — Interactive walkthrough (custom tour)

### State
`TourProvider` (React Context, mounted at app root in `App.tsx`) holds:
```
{ active: boolean, stepIndex: number, steps: TourStep[] , start(), next(), back(), skip(), finish() }
```
A small pure reducer drives `stepIndex` transitions (unit-testable in isolation).

### Steps
`client/src/tour/tourSteps.ts` exports an ordered array:
```ts
type TourStep = {
  targetId: string;     // matches a data-tour-id on the page/sidebar
  title: string;
  body: string;
  route?: string;       // navigate here before highlighting
};
```
Steps walk the views in the same logical order as the sidebar: Dashboard → Setup → Launch → Intake → Campaigns → Agents → Sessions → Approvals → Board → Earnings → Transactions → Tax Center → (handoff to feedback). A step with `route` navigates first (React Router `useNavigate`), then highlights its target once mounted.

### Overlay
`client/src/tour/TourOverlay.tsx`:
- Dimmed full-screen backdrop with a spotlight cutout positioned over the current target via `getBoundingClientRect()` (recomputed on resize/scroll/step change).
- Anchored tooltip card: title, body, `Back` / `Next` / `Skip`, and `N / total` progress.
- Styled to match zinc/emerald theme; reuses the fixed-overlay pattern from `BugReportButton.tsx`.

### Launch / replay
- Auto-launch on first visit: `localStorage` flag `mc_tour_seen`. Absent → `start()` on mount. Set on `finish()` or `skip()`.
- "Walkthrough" replay button in the sidebar footer calls `start()` anytime (ignores the flag).
- Final tour step hands off to the feedback panel (opens it).

## Feature 3 — Feedback capture (accumulate → file as issues)

### State
`FeedbackProvider` (React Context) holds an in-session list:
```ts
type FeedbackItem = { text: string; area?: string; severity?: string };
```
Plus `add(item)`, `remove(idx)`, `clear()`, `submitAll()`, `panelOpen`, `openPanel()`, `closePanel()`.

### UI
`client/src/feedback/FeedbackPanel.tsx` — floating panel, sibling to the existing `BugReportButton`:
- Textarea (+ optional area/severity selects, reusing `BugReportButton` input styles) to add an item to the running list.
- Renders the accumulated list with per-item remove.
- "Submit all" button; "Done"/close.

### Submit path
On **Submit all**, POST the batch to a new server endpoint:
- `POST /api/feedback` — body `{ items: FeedbackItem[] }`.
- `server/routes/feedback.ts` + `server/services/feedback.service.ts` mirror `bug-report.{ts,service.ts}`.
- Service validates each item (non-empty `text`), maps to `gh issue create --repo VFXellence-LTD/abundenz --title ... --body ... --label feedback --label enhancement`, looping per item.
- **Env gate `MC_FEEDBACK_ENABLED`** (true/1/yes). Unset/false → dry-run: returns one synthetic `{ url, dryRun: true }` per item, creates nothing.
- Returns `{ results: { url: string; dryRun: boolean }[] }`.

> Note: the `gh` repo target is `VFXellence-LTD/abundenz` (repo renamed from `vfxellence` 2026-06-23). Confirm the `bug-report` service's hardcoded repo is updated to match as part of this work.

Client shows result URLs (or dry-run notice), then `clear()`s the list on success.

### Integration
Feedback accumulates independently of the tour; the tour's final step simply opens the panel. Both providers wrap the app in `App.tsx`.

## Files

**New**
- `client/src/tour/TourProvider.tsx`
- `client/src/tour/TourOverlay.tsx`
- `client/src/tour/tourSteps.ts`
- `client/src/feedback/FeedbackProvider.tsx`
- `client/src/feedback/FeedbackPanel.tsx`
- `server/routes/feedback.ts`
- `server/services/feedback.service.ts`

**Edit**
- `client/src/components/Sidebar.tsx` — grouped sections + `data-tour-id` + replay button
- `client/src/App.tsx` — wrap with `TourProvider` + `FeedbackProvider`
- page components — add `data-tour-id` anchors where the tour needs them
- `server/index.ts` — register `/api/feedback` route
- `server/services/bug-report.service.ts` — update repo target to `abundenz` (renamed)

## Testing

- **Server** (`server`, vitest): `feedback.service` — validation (empty text rejected), dry-run path (no `gh` call, synthetic URLs), batch loop, label mapping. Mirror existing `bug-report` tests. Target: existing suite stays green (was 120 passed / 1 skipped) + new feedback tests.
- **Client**: tour step-reducer transitions (next/back/skip/bounds) and feedback accumulation logic (add/remove/clear) as pure-unit tests.

## Out of scope (YAGNI v1)

- Persisting feedback across page reload (in-session only).
- Tour analytics / completion tracking beyond the `mc_tour_seen` flag.
- Editing already-submitted feedback.
- Vault-file feedback sink (GitHub issues only, per Boss decision).
