# Setup Wizard Auto-Expand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Setup steps render expanded by default with an Expand/Collapse-all toggle, so the operator never manually uncollapses steps and can tab through all fields by keyboard.

**Architecture:** Lift expansion out of each `SetupStep`'s local `useState` into the `SetupStepper`, driven by a pure `expansionReducer` (default all-expanded). `SetupStep` becomes controlled via `expanded` + `onToggleExpand` props. A toolbar button dispatches expand/collapse-all. All fields render → native Tab order.

**Tech Stack:** React 19, vitest, Tailwind 4, lucide-react.

**Working dir:** worktree `D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand`, MC at `.canon\.mission-control`. Commit with `git -C "D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand" ...`. NO `Co-Authored-By` lines.

---

## File Structure
**New:** `client/src/components/setupExpansion.ts` + `client/src/components/setupExpansion.test.ts`.
**Modify:** `client/src/components/SetupStep.tsx` (controlled expand), `client/src/components/SetupStepper.tsx` (reducer + toggle-all + thread props).

---

## Task 1: Pure expansion reducer (TDD)

**Files:**
- Create: `client/src/components/setupExpansion.ts`
- Test: `client/src/components/setupExpansion.test.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/components/setupExpansion.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { initExpansion, expansionReducer } from "./setupExpansion";

describe("setupExpansion", () => {
  it("initExpansion sets every step expanded", () => {
    expect(initExpansion(["a", "b"])).toEqual({ a: true, b: true });
  });
  it("TOGGLE flips one step, leaves others", () => {
    const s = initExpansion(["a", "b"]);
    expect(expansionReducer(s, { type: "TOGGLE", stepId: "a" })).toEqual({ a: false, b: true });
  });
  it("TOGGLE on an unknown id treats it as expanded, then collapses it", () => {
    expect(expansionReducer({}, { type: "TOGGLE", stepId: "x" })).toEqual({ x: false });
  });
  it("COLLAPSE_ALL sets all listed ids false", () => {
    expect(expansionReducer({ a: true, b: true }, { type: "COLLAPSE_ALL", stepIds: ["a", "b"] })).toEqual({ a: false, b: false });
  });
  it("EXPAND_ALL sets all listed ids true", () => {
    expect(expansionReducer({ a: false, b: false }, { type: "EXPAND_ALL", stepIds: ["a", "b"] })).toEqual({ a: true, b: true });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand\.canon\.mission-control\client; npx vitest run setupExpansion`
Expected: FAIL — cannot find `./setupExpansion`.

- [ ] **Step 3: Write minimal implementation**

Create `client/src/components/setupExpansion.ts`:

```ts
export type ExpansionState = Record<string, boolean>;

export type ExpansionAction =
  | { type: "TOGGLE"; stepId: string }
  | { type: "EXPAND_ALL"; stepIds: string[] }
  | { type: "COLLAPSE_ALL"; stepIds: string[] };

export function initExpansion(stepIds: string[]): ExpansionState {
  const out: ExpansionState = {};
  for (const id of stepIds) out[id] = true;
  return out;
}

export function expansionReducer(state: ExpansionState, action: ExpansionAction): ExpansionState {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, [action.stepId]: !(state[action.stepId] ?? true) };
    case "EXPAND_ALL": {
      const next = { ...state };
      for (const id of action.stepIds) next[id] = true;
      return next;
    }
    case "COLLAPSE_ALL": {
      const next = { ...state };
      for (const id of action.stepIds) next[id] = false;
      return next;
    }
    default:
      return state;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand\.canon\.mission-control\client; npx vitest run setupExpansion`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git -C "D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand" add .canon/.mission-control/client/src/components/setupExpansion.ts .canon/.mission-control/client/src/components/setupExpansion.test.ts
git -C "D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand" commit -m "Add pure setup expansion reducer with tests"
```

---

## Task 2: Make SetupStep controlled

**Files:**
- Modify: `client/src/components/SetupStep.tsx`

- [ ] **Step 1: Replace local state with controlled props**

In `client/src/components/SetupStep.tsx`:

Remove the React import line (the only use of `useState` is being removed):
```ts
import { useState } from "react";
```
Delete that line entirely.

Add `expanded` + `onToggleExpand` to the props interface:
```ts
interface SetupStepProps {
  step: SetupStepType;
  isComplete: boolean;
  onToggleComplete: () => void;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  getFieldValue?: (stepId: string, fieldKey: string) => string;
  saveFieldValue?: (stepId: string, fieldKey: string, value: string) => void;
  setLocal?: (stepId: string, fieldKey: string, value: string) => void;
  isSaved?: (stepId: string, fieldKey: string) => boolean;
}
```

Update the destructure and remove the `useState` line:
```ts
export function SetupStep({ step, isComplete, onToggleComplete, index, expanded, onToggleExpand, getFieldValue, saveFieldValue, setLocal, isSaved }: SetupStepProps) {
```
(Delete the line `const [expanded, setExpanded] = useState(false);`.)

Change the chevron button's handler from `onClick={() => setExpanded(!expanded)}` to:
```tsx
        <button
          onClick={onToggleExpand}
          className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
```
(Everything else — the completion circle, title, `{!expanded && ...}` description, the `{expanded && (...)}` body with fields/copyBlocks/links — stays exactly as-is.)

- [ ] **Step 2: Type-check**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand\.canon\.mission-control\client; npx tsc -b`
Expected: ERROR — `SetupStepper` doesn't yet pass `expanded`/`onToggleExpand` (fixed in Task 3). This is expected; proceed to Task 3 before committing.

- [ ] **Step 3: (No commit yet — Task 3 completes the compile.)**

---

## Task 3: SetupStepper owns expansion + toggle-all

**Files:**
- Modify: `client/src/components/SetupStepper.tsx`

- [ ] **Step 1: Replace the component**

Replace the entire contents of `client/src/components/SetupStepper.tsx` with:

```tsx
import { useReducer } from "react";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { SetupStep } from "@/components/SetupStep";
import { initExpansion, expansionReducer } from "@/components/setupExpansion";
import type { SetupStep as SetupStepType } from "@/types";

interface SetupStepperProps {
  steps: SetupStepType[];
  isComplete: (stepId: string) => boolean;
  onToggleStep: (stepId: string) => void;
  locked?: boolean;
  lockedLabel?: string;
  getFieldValue?: (stepId: string, fieldKey: string) => string;
  saveFieldValue?: (stepId: string, fieldKey: string, value: string) => void;
  setLocal?: (stepId: string, fieldKey: string, value: string) => void;
  isSaved?: (stepId: string, fieldKey: string) => boolean;
}

export function SetupStepper({
  steps,
  isComplete,
  onToggleStep,
  locked = false,
  lockedLabel = "Parked",
  getFieldValue,
  saveFieldValue,
  setLocal,
  isSaved,
}: SetupStepperProps) {
  // Hooks must run unconditionally, before the locked early-return.
  const stepIds = steps.map((s) => s.id);
  const [expansion, dispatch] = useReducer(expansionReducer, stepIds, initExpansion);

  if (locked) {
    return (
      <div className="relative">
        <div className="opacity-30 pointer-events-none space-y-3">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="border border-zinc-800 bg-zinc-900 rounded-lg p-4 flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-full border-2 border-zinc-600 flex items-center justify-center text-xs font-bold text-zinc-500">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{step.title}</p>
                <p className="text-xs text-zinc-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-zinc-900/95 border border-zinc-700 rounded-xl px-6 py-4 text-center shadow-2xl">
            <p className="text-sm font-semibold text-zinc-300">{lockedLabel}</p>
            <p className="text-xs text-zinc-500 mt-1">Complete Content foundation first</p>
          </div>
        </div>
      </div>
    );
  }

  const anyCollapsed = stepIds.some((id) => !(expansion[id] ?? true));

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={() =>
            dispatch({ type: anyCollapsed ? "EXPAND_ALL" : "COLLAPSE_ALL", stepIds })
          }
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
        >
          {anyCollapsed ? (
            <>
              <ChevronsUpDown className="w-3.5 h-3.5" />
              Expand all
            </>
          ) : (
            <>
              <ChevronsDownUp className="w-3.5 h-3.5" />
              Collapse all
            </>
          )}
        </button>
      </div>

      {steps
        .sort((a, b) => a.order - b.order)
        .map((step, i) => (
          <SetupStep
            key={step.id}
            step={step}
            isComplete={isComplete(step.id)}
            onToggleComplete={() => onToggleStep(step.id)}
            index={i}
            expanded={expansion[step.id] ?? true}
            onToggleExpand={() => dispatch({ type: "TOGGLE", stepId: step.id })}
            getFieldValue={getFieldValue}
            saveFieldValue={saveFieldValue}
            setLocal={setLocal}
            isSaved={isSaved}
          />
        ))}
    </div>
  );
}
```

- [ ] **Step 2: Type-check + build + test**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand\.canon\.mission-control\client; npx tsc -b; npm run build; npx vitest run`
Expected: tsc clean (SetupStep now receives `expanded`/`onToggleExpand`), build succeeds, all tests green (47 prior + 5 new expansion = 52).
(If `ChevronsUpDown`/`ChevronsDownUp` are not exported by the installed lucide-react, substitute `Maximize2`/`Minimize2`.)

- [ ] **Step 3: Commit (Task 2 + Task 3 together — they compile as a unit)**

```bash
git -C "D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand" add .canon/.mission-control/client/src/components/SetupStep.tsx .canon/.mission-control/client/src/components/SetupStepper.tsx
git -C "D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand" commit -m "Expand setup steps by default with controlled state and expand/collapse-all"
```

---

## Task 4: Verify in browser + changelog

The MC dev server runs from `.canon\.mission-control` via `pnpm dev` (server :4500, client :5174).

- [ ] **Step 1: Browser check**

Load `http://localhost:5174/setup/content`. Confirm: all Content steps are **expanded on load** (fields visible without clicking). Click into the first field, press **Tab repeatedly** — focus walks field → field down the wizard. Click **Collapse all** → all collapse; **Expand all** → all expand. An individual chevron still toggles one step.

- [ ] **Step 2: Update changelog**

Append a 2026-06-30 entry to `D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand\.canon\4_orchestrator\changelogs\polymath-business-changelog.md` (match the existing `## YYYY-MM-DD — Title` / bullets / `---` format): Setup wizard now expands all steps by default with an Expand/Collapse-all toggle and full keyboard tab-through; expansion lifted into SetupStepper via a pure `expansionReducer`; `SetupStep` is now controlled. Commit:

```bash
git -C "D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand" add .canon/4_orchestrator/changelogs/polymath-business-changelog.md
git -C "D:\VFXellence-LTD\.claude\worktrees\setup-autoexpand" commit -m "Log setup wizard auto-expand work in changelog"
```

---

## Verification Summary
- Client: `npx vitest run` — 52 tests green (47 prior + 5 expansion); `npm run build` succeeds.
- Browser: all steps open on load, Tab walks all fields, Expand/Collapse-all + per-step chevron work.

## Notes for the implementer
- Rules of hooks: `useReducer` is called at the top of `SetupStepper`, before the `if (locked)` early return — keep it there.
- `useReducer(expansionReducer, stepIds, initExpansion)` uses lazy init; Content steps are static so re-init isn't a concern.
- No server, hook, data, or page changes — purely the two components + the pure helper.
