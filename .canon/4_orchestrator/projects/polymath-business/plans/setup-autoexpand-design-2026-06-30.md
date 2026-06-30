# Design — Setup Wizard Auto-Expand + Tab-Through

**Date:** 2026-06-30
**Domain:** VFXellence / Polymath
**App:** Mission Control (`.canon/.mission-control`)
**Status:** APPROVED (Boss, 2026-06-30)
**Branch:** `worktree-setup-autoexpand`

## Goal

Stop forcing the operator to manually uncollapse every Setup step. Steps render **expanded by default** so all fields are visible and the operator can fill the wizard by **keyboard tab-through** (field → field → next step) with no mouse. Add an Expand/Collapse-all toggle; manual per-step toggle still works.

## Decisions (Boss, 2026-06-30)
- **Expand all by default** (not the "incomplete-open / done-collapsed" variant). Every content step is open on load.
- Completion does NOT drive collapse — expansion is independent of done-state.
- Must support **keyboard tab-through**: because all steps render their inputs, Tab walks field → field down the wizard. No `tabindex` hacks.

## Current state
- `SetupStep` (`client/src/components/SetupStep.tsx`) owns expansion via `const [expanded, setExpanded] = useState(false)` — defaults collapsed. This is the friction.
- `SetupStepper` (`client/src/components/SetupStepper.tsx`) maps steps → `SetupStep` (non-locked path) or static rows (locked path).
- `SetupPage` passes `contentSteps` + field/completion callbacks to the Content `SetupStepper`. Locked placeholders (Viral/Products/Affiliate) use the locked render path (no expand, no fields).

## Design

### Pure expansion state (new, testable)
`client/src/components/setupExpansion.ts`:
```ts
export type ExpansionState = Record<string, boolean>; // stepId -> expanded

export type ExpansionAction =
  | { type: "TOGGLE"; stepId: string }
  | { type: "EXPAND_ALL"; stepIds: string[] }
  | { type: "COLLAPSE_ALL"; stepIds: string[] };

export function initExpansion(stepIds: string[]): ExpansionState; // every id -> true
export function expansionReducer(state: ExpansionState, action: ExpansionAction): ExpansionState;
```
- `initExpansion`: all steps expanded.
- `TOGGLE`: flip one step.
- `EXPAND_ALL` / `COLLAPSE_ALL`: set every listed id true / false.

### SetupStepper (owns expansion)
- `useReducer(expansionReducer, steps.map(s => s.id), initExpansion)` in the non-locked path.
- Render an **"Expand all / Collapse all"** button above the steps (label reflects whether any step is currently collapsed). Dispatches `EXPAND_ALL` / `COLLAPSE_ALL` with the current step ids.
- Pass `expanded={state[step.id] ?? true}` and `onToggleExpand={() => dispatch({ type: "TOGGLE", stepId: step.id })}` to each `SetupStep`.
- Locked path unchanged.

### SetupStep (becomes controlled)
- Remove the local `useState` for `expanded`.
- New props: `expanded: boolean`, `onToggleExpand: () => void`. The chevron button calls `onToggleExpand`. Everything else (completion circle, fields, copy blocks, links) unchanged.

### SetupPage
- No change — `SetupStepper`'s external props are unchanged; expansion is internal to the stepper.

### Tab-through
- With all steps expanded, every field `<input>`/`<textarea>` is in the DOM in source order, so Tab moves field → field down the wizard natively. No `tabindex` attributes added. Completed steps are NOT collapsed (expand-all default), so their fields remain tabbable too.

## Testing
- **Unit:** `setupExpansion.test.ts` — `initExpansion` returns all-true; `TOGGLE` flips one and leaves others; `EXPAND_ALL`/`COLLAPSE_ALL` set all. Pure, no DOM.
- **Browser:** load `/setup/content` → all steps expanded on load; Tab from the first field walks through every field in order; Collapse-all collapses all, Expand-all restores; individual chevron still toggles.

## Files
**New:** `client/src/components/setupExpansion.ts`, `client/src/components/setupExpansion.test.ts`.
**Modify:** `client/src/components/SetupStep.tsx` (controlled expanded), `client/src/components/SetupStepper.tsx` (reducer + toggle-all + thread props).

## Out of scope (YAGNI)
- Auto-collapse on completion (Boss chose expand-all).
- Persisting expansion state across reloads (purely session UI).
- Changing the locked placeholder steppers.
- Automating the underlying setup *actions* (domain registration etc.) — this is purely the expand/tab UX.
