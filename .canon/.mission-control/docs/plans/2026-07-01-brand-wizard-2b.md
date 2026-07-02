# Brand-centric Wizard — PR 2b (Wizard Rewiring) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or a Workflow pipeline. Checkbox steps, TDD throughout.

**Goal:** Rewire the content wizard steps onto real `platform_accounts` (channel steps), derive per-brand completion, map the email step to `Brand.email`, and give non-content ecosystems a generic "Add channel" surface. Built on PR 2a's foundation (merged).

**Architecture:** Introduce step `kind` metadata (`channel` | `freetext`) + a `channelSpec` mapping each channel step's fields to platform-account fields. Extract a presentational `StepShell` (card header + instructions + links + a fields slot) shared by the existing `SetupStep` (setup_data-bound) and a new `ChannelStep` (account-bound). A pure `setup-completion` helper derives completion. `SetupPage` wires the brand's accounts, `updateBrand` for email, and a non-content `AddChannel` surface.

**Tech Stack:** React 19 + TS, React Router v7, Tailwind 4, lucide-react icons, Vitest + @testing-library/react. Client `@/` import alias.

**Issue:** #18 (completes slice 2). **Spec:** `docs/specs/2026-07-01-brand-centric-wizard-design.md` (PR 2b section). **Base:** develop @ PR-2a-merged.

**Working dir:** client cmds from `.canon/.mission-control/client`. Paths below relative to `.canon/.mission-control/`. Git: `git -C "<worktree-root>"` where `<worktree-root>` = `D:\VFXellence-LTD\.claude\worktrees\feat+18-brand-wizard-2b`.

---

## File Structure

- Modify `client/src/types/index.ts` — add `kind`, `channelSpec`, `writesToBrand` to `SetupStep` + supporting types.
- Modify `client/src/data/setup-steps.ts` — annotate content steps.
- Create `client/src/components/StepShell.tsx` — shared presentational card (extracted from SetupStep).
- Modify `client/src/components/SetupStep.tsx` — render via `StepShell` (behavior unchanged).
- Create `client/src/components/ChannelStep.tsx` (+ `.test.tsx`) — account-bound step.
- Create `client/src/lib/setup-completion.ts` (+ `.test.ts`) — pure completion derivation.
- Create `client/src/components/AddChannel.tsx` (+ `.test.tsx`) — non-content generic channel add.
- Modify `client/src/components/SetupStepper.tsx` — route channel vs freetext steps; forward account props.
- Modify `client/src/pages/SetupPage.tsx` — wire accounts, email→Brand, derived completion, non-content surface.

---

## Task 1: Step metadata types + annotations

**Files:** Modify `client/src/types/index.ts`, `client/src/data/setup-steps.ts`. Test: `client/src/data/setup-steps.test.ts` (new).

- [ ] **Step 1: Write failing data test** — `client/src/data/setup-steps.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { SETUP_STEPS } from "./setup-steps";

const byId = (id: string) => SETUP_STEPS.find((s) => s.id === id)!;

describe("SETUP_STEPS channel annotations", () => {
  it("channel steps carry a channelSpec; freetext steps do not", () => {
    expect(byId("youtube").kind).toBe("channel");
    expect(byId("beehiiv").kind).toBe("channel");
    expect(byId("ghost").kind).toBe("channel");
    expect(byId("socials").kind).toBe("channel");
    expect(byId("domain").kind).toBe("freetext");
    expect(byId("first_episode").kind).toBe("freetext");
    expect(byId("agent_01").kind).toBe("freetext");
  });

  it("email is a freetext step that writes to Brand.email", () => {
    expect(byId("email").kind).toBe("freetext");
    expect(byId("email").writesToBrand).toBe("email");
  });

  it("youtube maps channelUrl->url and channelName->handle on the youtube platform", () => {
    const spec = byId("youtube").channelSpec!;
    expect(spec).toHaveLength(1);
    expect(spec[0].platform).toBe("youtube");
    expect(spec[0].fields).toEqual([
      { fieldKey: "channelUrl", accountField: "url" },
      { fieldKey: "channelName", accountField: "handle" },
    ]);
  });

  it("socials expands to four platform accounts, each field->handle", () => {
    const spec = byId("socials").channelSpec!;
    expect(spec.map((s) => s.platform)).toEqual(["x", "linkedin", "tiktok", "instagram"]);
    for (const s of spec) {
      expect(s.fields).toHaveLength(1);
      expect(s.fields[0].accountField).toBe("handle");
    }
  });
});
```

- [ ] **Step 2: Run — expect FAIL.** `npx vitest run src/data/setup-steps.test.ts`

- [ ] **Step 3: Extend the `SetupStep` type** — in `client/src/types/index.ts`, add supporting types and fields (all optional → non-breaking):

```typescript
export type AccountFieldTarget = "url" | "handle" | "email";

export interface ChannelAccountSpec {
  platform: string;
  fields: { fieldKey: string; accountField: AccountFieldTarget }[];
}
```

And add to the existing `SetupStep` interface (after `fields?`):

```typescript
  kind?: "channel" | "freetext";      // default "freetext" when absent
  channelSpec?: ChannelAccountSpec[]; // present iff kind === "channel"; one entry per platform account
  writesToBrand?: "email";            // freetext step whose value maps to Brand.email
```

- [ ] **Step 4: Annotate `setup-steps.ts`** — add `kind` (+ `channelSpec` / `writesToBrand`) to each step. Exact annotations:

- `domain`: add `kind: "freetext",`
- `email`: add `kind: "freetext",` and `writesToBrand: "email",`
- `youtube`: add
  ```typescript
    kind: "channel",
    channelSpec: [
      { platform: "youtube", fields: [
        { fieldKey: "channelUrl", accountField: "url" },
        { fieldKey: "channelName", accountField: "handle" },
      ] },
    ],
  ```
- `beehiiv`: add
  ```typescript
    kind: "channel",
    channelSpec: [{ platform: "beehiiv", fields: [{ fieldKey: "newsletterUrl", accountField: "url" }] }],
  ```
- `ghost`: add
  ```typescript
    kind: "channel",
    channelSpec: [{ platform: "ghost", fields: [{ fieldKey: "blogUrl", accountField: "url" }] }],
  ```
- `socials`: add
  ```typescript
    kind: "channel",
    channelSpec: [
      { platform: "x", fields: [{ fieldKey: "x", accountField: "handle" }] },
      { platform: "linkedin", fields: [{ fieldKey: "linkedin", accountField: "handle" }] },
      { platform: "tiktok", fields: [{ fieldKey: "tiktok", accountField: "handle" }] },
      { platform: "instagram", fields: [{ fieldKey: "instagram", accountField: "handle" }] },
    ],
  ```
- `first_episode`: add `kind: "freetext",`
- `agent_01`: add `kind: "freetext",`

(Leave all existing fields/titles/instructions/links intact. The `channelSpec` platforms match `CONTENT_SEED_PLATFORMS` from 2a exactly.)

- [ ] **Step 5: Run — expect PASS.** `npx vitest run src/data/setup-steps.test.ts` + `npm run build` clean.

- [ ] **Step 6: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/client/src/types/index.ts .canon/.mission-control/client/src/data/setup-steps.ts .canon/.mission-control/client/src/data/setup-steps.test.ts
git -C "<worktree-root>" commit -m "Annotate setup steps with channel/freetext kind and account mapping"
```

---

## Task 2: Extract StepShell (shared card) from SetupStep

**Files:** Create `client/src/components/StepShell.tsx`. Modify `client/src/components/SetupStep.tsx`. (No behavior change — existing rendering preserved. The existing client suite is the regression guard.)

- [ ] **Step 1: Create `StepShell.tsx`** — the presentational card shell, field content injected via `children`:

```typescript
import { ChevronDown, ChevronRight, Check, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/CopyButton";
import type { SetupStep as SetupStepType } from "@/types";

interface StepShellProps {
  step: SetupStepType;
  isComplete: boolean;
  onToggleComplete: () => void;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  children?: ReactNode; // field inputs (setup_data or account-bound)
}

export function StepShell({ step, isComplete, onToggleComplete, index, expanded, onToggleExpand, children }: StepShellProps) {
  return (
    <div className={cn("border rounded-lg transition-colors", isComplete ? "border-zinc-700 bg-zinc-900/50" : "border-zinc-800 bg-zinc-900")}>
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={onToggleComplete}
          className={cn(
            "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
            isComplete ? "bg-emerald-500 border-emerald-500 text-white" : "border-zinc-600 text-zinc-500 hover:border-zinc-400"
          )}
        >
          {isComplete ? <Check className="w-3.5 h-3.5" /> : <span>{index + 1}</span>}
        </button>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium", isComplete ? "text-zinc-500 line-through" : "text-zinc-200")}>{step.title}</p>
          {!expanded && <p className="text-xs text-zinc-500 mt-0.5 truncate">{step.description}</p>}
        </div>
        <button onClick={onToggleExpand} className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-4 ml-10 space-y-4">
          <p className="text-sm text-zinc-400 leading-relaxed">{step.instructions}</p>

          {children}

          {step.copyBlocks && step.copyBlocks.length > 0 && (
            <div className="space-y-3">
              {step.copyBlocks.map((block, i) => (
                <div key={i} className="rounded-md bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
                    <span className="text-xs font-medium text-zinc-400">{block.label}</span>
                    <CopyButton text={block.content} />
                  </div>
                  <pre className="text-xs text-zinc-300 p-3 whitespace-pre-wrap leading-relaxed font-mono">{block.content}</pre>
                </div>
              ))}
            </div>
          )}

          {step.externalLinks && step.externalLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {step.externalLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 transition-colors">
                  {link.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `SetupStep.tsx`** to use `StepShell`, keeping the exact setup_data field-rendering as its `children`:

```typescript
import { cn } from "@/lib/utils";
import { StepShell } from "@/components/StepShell";
import type { SetupStep as SetupStepType } from "@/types";

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

export function SetupStep({ step, isComplete, onToggleComplete, index, expanded, onToggleExpand, getFieldValue, saveFieldValue, setLocal, isSaved }: SetupStepProps) {
  return (
    <StepShell step={step} isComplete={isComplete} onToggleComplete={onToggleComplete} index={index} expanded={expanded} onToggleExpand={onToggleExpand}>
      {step.fields && step.fields.length > 0 && getFieldValue && saveFieldValue && setLocal && (
        <div className="space-y-3">
          {step.fields.map((field) => {
            const inputCls = "w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";
            return (
              <div key={field.key}>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs text-zinc-500">{field.label}</label>
                  {isSaved?.(step.id, field.key) && <span className="text-xs text-emerald-500">saved ✓</span>}
                </div>
                {field.type === "textarea" ? (
                  <textarea rows={2} className={cn(inputCls, "resize-y")} value={getFieldValue(step.id, field.key)} placeholder={field.placeholder}
                    onChange={(e) => setLocal(step.id, field.key, e.target.value)} onBlur={(e) => saveFieldValue(step.id, field.key, e.target.value)} />
                ) : (
                  <input type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"} className={inputCls}
                    value={getFieldValue(step.id, field.key)} placeholder={field.placeholder}
                    onChange={(e) => setLocal(step.id, field.key, e.target.value)} onBlur={(e) => saveFieldValue(step.id, field.key, e.target.value)} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </StepShell>
  );
}
```

- [ ] **Step 3: Verify no regression.** From `client/`: `npx vitest run` → existing suite still green; `npm run build` clean. (SetupStep renders identically; StepShell is a pure extraction.)

- [ ] **Step 4: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/client/src/components/StepShell.tsx .canon/.mission-control/client/src/components/SetupStep.tsx
git -C "<worktree-root>" commit -m "Extract StepShell presentational card shared by step components"
```

---

## Task 3: Completion helper (pure)

**Files:** Create `client/src/lib/setup-completion.ts` + `client/src/lib/setup-completion.test.ts`.

Pure functions deriving per-step completion. Channel step complete = every account in its `channelSpec` exists and is `status:"active"`. Email step complete = brand email non-empty. Other freetext steps use the explicit progress toggle (passed in).

- [ ] **Step 1: Write failing test** — `client/src/lib/setup-completion.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { isStepComplete } from "./setup-completion";
import type { SetupStep, PlatformAccount } from "@/types";

const acct = (platform: string, status: PlatformAccount["status"]): PlatformAccount => ({ platform, handle: "", email: "", status });

const youtubeStep = { id: "youtube", kind: "channel", channelSpec: [{ platform: "youtube", fields: [{ fieldKey: "channelUrl", accountField: "url" }] }] } as unknown as SetupStep;
const socialsStep = { id: "socials", kind: "channel", channelSpec: [
  { platform: "x", fields: [{ fieldKey: "x", accountField: "handle" }] },
  { platform: "linkedin", fields: [{ fieldKey: "linkedin", accountField: "handle" }] },
] } as unknown as SetupStep;
const emailStep = { id: "email", kind: "freetext", writesToBrand: "email" } as unknown as SetupStep;
const domainStep = { id: "domain", kind: "freetext" } as unknown as SetupStep;

describe("isStepComplete", () => {
  it("channel step complete when its account is active", () => {
    expect(isStepComplete(youtubeStep, { accounts: [acct("youtube", "active")], progress: {}, brandEmail: "" })).toBe(true);
    expect(isStepComplete(youtubeStep, { accounts: [acct("youtube", "not-started")], progress: {}, brandEmail: "" })).toBe(false);
    expect(isStepComplete(youtubeStep, { accounts: [], progress: {}, brandEmail: "" })).toBe(false);
  });

  it("socials complete only when ALL its accounts are active", () => {
    expect(isStepComplete(socialsStep, { accounts: [acct("x", "active"), acct("linkedin", "active")], progress: {}, brandEmail: "" })).toBe(true);
    expect(isStepComplete(socialsStep, { accounts: [acct("x", "active"), acct("linkedin", "not-started")], progress: {}, brandEmail: "" })).toBe(false);
  });

  it("email step complete when brand email is non-empty", () => {
    expect(isStepComplete(emailStep, { accounts: [], progress: {}, brandEmail: "hi@abundenz.com" })).toBe(true);
    expect(isStepComplete(emailStep, { accounts: [], progress: {}, brandEmail: "" })).toBe(false);
  });

  it("other freetext steps follow the explicit progress toggle", () => {
    expect(isStepComplete(domainStep, { accounts: [], progress: { domain: true }, brandEmail: "" })).toBe(true);
    expect(isStepComplete(domainStep, { accounts: [], progress: {}, brandEmail: "" })).toBe(false);
  });
});
```

- [ ] **Step 2: Run — expect FAIL.** `npx vitest run src/lib/setup-completion.test.ts`

- [ ] **Step 3: Implement** — `client/src/lib/setup-completion.ts`

```typescript
import type { SetupStep, PlatformAccount, SetupProgress } from "@/types";

export interface CompletionContext {
  accounts: PlatformAccount[];
  progress: SetupProgress;
  brandEmail: string;
}

export function isStepComplete(step: SetupStep, ctx: CompletionContext): boolean {
  if (step.kind === "channel" && step.channelSpec) {
    return step.channelSpec.every((spec) => {
      const acct = ctx.accounts.find((a) => a.platform === spec.platform);
      return acct?.status === "active";
    });
  }
  if (step.writesToBrand === "email") {
    return ctx.brandEmail.trim().length > 0;
  }
  return !!ctx.progress[step.id];
}
```

- [ ] **Step 4: Run — expect PASS.** `npx vitest run src/lib/setup-completion.test.ts`

- [ ] **Step 5: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/client/src/lib/setup-completion.ts .canon/.mission-control/client/src/lib/setup-completion.test.ts
git -C "<worktree-root>" commit -m "Add pure per-brand step-completion helper"
```

---

## Task 4: ChannelStep component

**Files:** Create `client/src/components/ChannelStep.tsx` + `client/src/components/ChannelStep.test.tsx`.

Account-bound step: renders each `channelSpec` account's mapped fields, editing an account field via `updateAccount(id, { <accountField>: value, status: "active" })` on blur. The completion control flips all the step's accounts between `active` and `not-started`. Uses `StepShell` for the card.

**Props:**
```typescript
interface ChannelStepProps {
  step: SetupStep;                 // kind === "channel", has channelSpec
  accounts: PlatformAccount[];     // the active brand's accounts
  updateAccount: (id: number, data: Partial<{ url: string; handle: string; email: string; status: PlatformAccount["status"] }>) => void;
  isComplete: boolean;             // derived by parent via isStepComplete
  onToggleComplete: () => void;    // parent flips the step's accounts' status
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
}
```

- [ ] **Step 1: Write failing test** — `client/src/components/ChannelStep.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChannelStep } from "./ChannelStep";
import type { SetupStep, PlatformAccount } from "@/types";

const youtubeStep = {
  id: "youtube", ecosystemId: "content", order: 3, title: "Create YouTube Channel", description: "", instructions: "",
  kind: "channel",
  channelSpec: [{ platform: "youtube", fields: [
    { fieldKey: "channelUrl", accountField: "url" },
    { fieldKey: "channelName", accountField: "handle" },
  ] }],
  fields: [
    { key: "channelUrl", label: "Channel URL", type: "url" },
    { key: "channelName", label: "Channel name", type: "text" },
  ],
} as unknown as SetupStep;

const ytAccount: PlatformAccount = { id: 5, platform: "youtube", handle: "", email: "", status: "not-started", url: "" };

function base(overrides = {}) {
  return {
    step: youtubeStep, accounts: [ytAccount], updateAccount: vi.fn(),
    isComplete: false, onToggleComplete: vi.fn(), index: 2, expanded: true, onToggleExpand: vi.fn(),
    ...overrides,
  };
}

describe("ChannelStep", () => {
  it("renders each mapped field bound to the account", () => {
    render(<ChannelStep {...base()} />);
    expect(screen.getByLabelText(/Channel URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Channel name/i)).toBeInTheDocument();
  });

  it("editing a field updates the account with the mapped field + status active", () => {
    const updateAccount = vi.fn();
    render(<ChannelStep {...base({ updateAccount })} />);
    fireEvent.blur(screen.getByLabelText(/Channel URL/i), { target: { value: "https://youtube.com/@z" } });
    expect(updateAccount).toHaveBeenCalledWith(5, { url: "https://youtube.com/@z", status: "active" });
  });

  it("shows a hint and does not render inputs when the account is missing (not seeded)", () => {
    render(<ChannelStep {...base({ accounts: [] })} />);
    expect(screen.queryByLabelText(/Channel URL/i)).not.toBeInTheDocument();
    expect(screen.getByText(/not seeded|no account/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL.** `npx vitest run src/components/ChannelStep.test.tsx`

- [ ] **Step 3: Implement** — `client/src/components/ChannelStep.tsx`

```typescript
import { StepShell } from "@/components/StepShell";
import type { SetupStep, PlatformAccount, AccountFieldTarget } from "@/types";

interface ChannelStepProps {
  step: SetupStep;
  accounts: PlatformAccount[];
  updateAccount: (id: number, data: Partial<Record<AccountFieldTarget, string> & { status: PlatformAccount["status"] }>) => void;
  isComplete: boolean;
  onToggleComplete: () => void;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
}

const inputCls =
  "w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";

export function ChannelStep({ step, accounts, updateAccount, isComplete, onToggleComplete, index, expanded, onToggleExpand }: ChannelStepProps) {
  const specs = step.channelSpec ?? [];
  const labelFor = (fieldKey: string) => step.fields?.find((f) => f.key === fieldKey)?.label ?? fieldKey;
  const placeholderFor = (fieldKey: string) => step.fields?.find((f) => f.key === fieldKey)?.placeholder;

  return (
    <StepShell step={step} isComplete={isComplete} onToggleComplete={onToggleComplete} index={index} expanded={expanded} onToggleExpand={onToggleExpand}>
      <div className="space-y-4">
        {specs.map((spec) => {
          const acct = accounts.find((a) => a.platform === spec.platform);
          if (!acct || acct.id === undefined) {
            return (
              <p key={spec.platform} className="text-xs text-zinc-500">
                No account for <span className="text-zinc-400">{spec.platform}</span> yet — it is seeded when the brand is created.
              </p>
            );
          }
          return (
            <div key={spec.platform} className="space-y-3">
              {specs.length > 1 && <p className="text-xs font-medium text-zinc-400">{spec.platform}</p>}
              {spec.fields.map((f) => (
                <div key={f.fieldKey}>
                  <label htmlFor={`${step.id}-${spec.platform}-${f.fieldKey}`} className="mb-1 block text-xs text-zinc-500">
                    {labelFor(f.fieldKey)}
                  </label>
                  <input
                    id={`${step.id}-${spec.platform}-${f.fieldKey}`}
                    aria-label={labelFor(f.fieldKey)}
                    className={inputCls}
                    defaultValue={(acct[f.accountField] as string | undefined) ?? ""}
                    placeholder={placeholderFor(f.fieldKey)}
                    onBlur={(e) => updateAccount(acct.id!, { [f.accountField]: e.target.value, status: "active" })}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}
```

(Uses `defaultValue` + `onBlur` — uncontrolled, mirroring the account's persisted value without needing local state; the optimistic `updateAccount` keeps the store in sync. `acct[f.accountField]` reads `url`/`handle`/`email` off the account.)

- [ ] **Step 4: Run — expect PASS.** `npx vitest run src/components/ChannelStep.test.tsx`

- [ ] **Step 5: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/client/src/components/ChannelStep.tsx .canon/.mission-control/client/src/components/ChannelStep.test.tsx
git -C "<worktree-root>" commit -m "Add ChannelStep binding wizard fields to platform accounts"
```

---

## Task 5: AddChannel component (non-content ecosystems)

**Files:** Create `client/src/components/AddChannel.tsx` + `client/src/components/AddChannel.test.tsx`.

A brand's account list + a form to add an arbitrary channel. Presentational + controlled: parent passes `accounts`, `onAdd(platform, handle)`, `onRemove(id)`.

- [ ] **Step 1: Write failing test** — `client/src/components/AddChannel.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddChannel } from "./AddChannel";
import type { PlatformAccount } from "@/types";

const accts: PlatformAccount[] = [{ id: 1, platform: "tiktok", handle: "@z", email: "", status: "active" }];

describe("AddChannel", () => {
  it("lists existing accounts", () => {
    render(<AddChannel accounts={accts} onAdd={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText(/tiktok/i)).toBeInTheDocument();
    expect(screen.getByText(/@z/)).toBeInTheDocument();
  });

  it("calls onAdd with platform + handle, and requires a platform", () => {
    const onAdd = vi.fn();
    render(<AddChannel accounts={[]} onAdd={onAdd} onRemove={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /add channel/i }));
    expect(onAdd).not.toHaveBeenCalled(); // platform required
    fireEvent.change(screen.getByLabelText(/platform/i), { target: { value: "threads" } });
    fireEvent.change(screen.getByLabelText(/handle/i), { target: { value: "@zz" } });
    fireEvent.click(screen.getByRole("button", { name: /add channel/i }));
    expect(onAdd).toHaveBeenCalledWith("threads", "@zz");
  });

  it("calls onRemove for an account", () => {
    const onRemove = vi.fn();
    render(<AddChannel accounts={accts} onAdd={vi.fn()} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
```

- [ ] **Step 2: Run — expect FAIL.** `npx vitest run src/components/AddChannel.test.tsx`

- [ ] **Step 3: Implement** — `client/src/components/AddChannel.tsx`

```typescript
import { useState } from "react";
import type { PlatformAccount } from "@/types";

interface AddChannelProps {
  accounts: PlatformAccount[];
  onAdd: (platform: string, handle: string) => void;
  onRemove: (id: number) => void;
}

const inputCls = "rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";

export function AddChannel({ accounts, onAdd, onRemove }: AddChannelProps) {
  const [platform, setPlatform] = useState("");
  const [handle, setHandle] = useState("");

  const add = () => {
    const p = platform.trim();
    if (!p) return;
    onAdd(p, handle.trim());
    setPlatform("");
    setHandle("");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
      <div className="space-y-2">
        {accounts.length === 0 && <p className="text-sm text-zinc-500">No channels yet.</p>}
        {accounts.map((a) => (
          <div key={a.id ?? a.platform} className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
            <span className="text-sm text-zinc-300">
              <span className="font-medium">{a.platform}</span>
              {a.handle && <span className="text-zinc-500"> · {a.handle}</span>}
            </span>
            {a.id !== undefined && (
              <button type="button" onClick={() => onRemove(a.id!)} className="text-xs text-zinc-500 hover:text-red-400">Remove</button>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="add-platform" className="text-xs text-zinc-500">Platform</label>
          <input id="add-platform" aria-label="Platform" className={inputCls} value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="tiktok" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="add-handle" className="text-xs text-zinc-500">Handle</label>
          <input id="add-handle" aria-label="Handle" className={inputCls} value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourbrand" />
        </div>
        <button type="button" onClick={add} className="border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 rounded hover:bg-zinc-700">
          Add channel
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run — expect PASS.** `npx vitest run src/components/AddChannel.test.tsx`

- [ ] **Step 5: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/client/src/components/AddChannel.tsx .canon/.mission-control/client/src/components/AddChannel.test.tsx
git -C "<worktree-root>" commit -m "Add AddChannel surface for non-content ecosystems"
```

---

## Task 6: SetupStepper routing + SetupPage integration

**Files:** Modify `client/src/components/SetupStepper.tsx`, `client/src/pages/SetupPage.tsx`.

Route channel steps to `ChannelStep`, freetext to `SetupStep`; wire the brand's accounts, email→`Brand.email`, derived completion, and the non-content `AddChannel` surface.

- [ ] **Step 1: SetupStepper — accept + forward account props, route by kind**

Add to `SetupStepperProps` (alongside the existing field-data props): 
```typescript
  accounts?: import("@/types").PlatformAccount[];
  updateAccount?: (id: number, data: Partial<{ url: string; handle: string; email: string; status: import("@/types").PlatformAccount["status"] }>) => void;
  isStepDone?: (step: import("@/types").SetupStep) => boolean;      // derived completion (overrides isComplete when provided)
  onToggleChannel?: (step: import("@/types").SetupStep) => void;    // channel step completion toggle
```
In the (non-locked) map over sorted steps, branch:
- If `step.kind === "channel"` and `accounts` + `updateAccount` provided → render `<ChannelStep step accounts updateAccount isComplete={isStepDone ? isStepDone(step) : isComplete(step.id)} onToggleComplete={() => onToggleChannel?.(step)} index expanded onToggleExpand />`.
- Else render the existing `<SetupStep .../>`, but when `isStepDone` is provided use it for `isComplete` (so the email step reflects Brand.email). Keep passing the field-data props.

Import `ChannelStep`. Preserve the locked-skeleton path unchanged.

- [ ] **Step 2: SetupPage — wire accounts, email, completion, non-content surface**

In `SetupPage` (post-2a), expand the `usePlatformAccounts` + `useBrands` usage:

```typescript
  const { brands, addBrand, updateBrand } = useBrands();
  const { accounts, addAccount, updateAccount, deleteAccount } = usePlatformAccounts(activeBrandId ?? undefined);
  const activeBrand = ecoBrands.find((b) => b.id === activeBrandId) ?? null;
```

Add completion context + helpers (import `isStepComplete` from `@/lib/setup-completion`, `PlatformAccount` type):

```typescript
  const completionCtx = { accounts, progress: {} as SetupProgress, brandEmail: activeBrand?.email ?? "" };
  // progress map from useSetupProgress for freetext toggles:
  const { progress, toggleStep, getEcosystemProgress } = useSetupProgress(activeBrandId ?? undefined);
  const ctx = { accounts, progress, brandEmail: activeBrand?.email ?? "" };
  const isStepDone = (step: SetupStep) => isStepComplete(step, ctx);

  const toggleChannel = (step: SetupStep) => {
    const specs = step.channelSpec ?? [];
    const allActive = specs.every((s) => accounts.find((a) => a.platform === s.platform)?.status === "active");
    const nextStatus = allActive ? "not-started" : "active";
    for (const s of specs) {
      const acct = accounts.find((a) => a.platform === s.platform);
      if (acct?.id !== undefined) updateAccount(acct.id, { status: nextStatus });
    }
  };
```

(Replace the earlier `useSetupProgress` destructure line with the one above — keep a single call.)

Email step special-case: since the `email` step is freetext with `writesToBrand`, its input must write to `Brand.email` rather than setup_data. Simplest wiring within the existing SetupStep field flow: intercept in the `saveFieldValue` passed to the stepper — wrap it so that saving the `email` step's `address` field calls `updateBrand(activeBrandId, { email: value })` instead of the setup_data persister. Provide a wrapped saver:

```typescript
  const saveField = (stepId: string, fieldKey: string, value: string) => {
    if (stepId === "email" && fieldKey === "address" && activeBrandId) {
      updateBrand(activeBrandId, { email: value });
      return;
    }
    saveFieldValue(stepId, fieldKey, value);
  };
  const getField = (stepId: string, fieldKey: string) => {
    if (stepId === "email" && fieldKey === "address") return activeBrand?.email ?? "";
    return getFieldValue(stepId, fieldKey);
  };
```

Pass `getField`/`saveField` (instead of the raw hook fns) + `setLocal`/`isSaved` + `accounts`/`updateAccount`/`isStepDone`/`onToggleChannel={toggleChannel}` to the **content** `<SetupStepper>`. Update the content progress bar to count via `isStepDone`:

```typescript
  const contentCompleted = contentSteps.filter((s) => isStepDone(s)).length;
  // use contentCompleted / contentSteps.length for the bar (replace getEcosystemProgress usage for content)
```

- [ ] **Step 3: Non-content ecosystems — replace placeholder steppers with AddChannel**

For the `viral`/`products`/`affiliate` blocks (when `activeBrandId` set), replace the placeholder `<SetupStepper>` with:

```tsx
          <AddChannel
            accounts={accounts}
            onAdd={(platform, handle) => addAccount({ brandId: activeBrandId!, platform, handle, status: "active" })}
            onRemove={(id) => deleteAccount(id)}
          />
```

Keep each block's existing progress/header card. Import `AddChannel`. (The `VIRAL_PLACEHOLDER`/`PRODUCTS_PLACEHOLDER`/`AFFILIATE_PLACEHOLDER` consts + their `SetupStepper` usages are removed; if a lint "unused var" results, delete the now-unused consts.)

- [ ] **Step 4: Verify build + full client suite**

From `client/`: `npm run build` → clean. `npx vitest run` → all existing + new tests (setup-steps, setup-completion, ChannelStep, AddChannel) pass.

- [ ] **Step 5: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/client/src/components/SetupStepper.tsx .canon/.mission-control/client/src/pages/SetupPage.tsx
git -C "<worktree-root>" commit -m "Route channel vs freetext steps and wire brand accounts into SetupPage"
```

---

## Final verification (2b)

- [ ] Client: from `client/`, `npx vitest run` — existing suite + new tests (setup-steps, setup-completion, ChannelStep, AddChannel) all green; `npm run build` clean.
- [ ] Server: from `server/`, `npx vitest run` — untouched by 2b, still green (sanity).
- [ ] Manual sanity (optional): `pnpm dev`; on `/setup/content` create "Zrodinger" → 7 channels seed; fill YouTube URL → account activates + step checks; on `/setup/viral` add a custom channel.

## Notes for the implementer

- Client uses `@/` alias. Functional components, explicit types (strict TS).
- ChannelStep uses uncontrolled `defaultValue`+`onBlur`; the optimistic `updateAccount` from `usePlatformAccounts` keeps the store current. Do NOT convert to controlled unless a test requires it.
- Do NOT touch server code, `entity.ts`, or `EntityPage.tsx` (slice 3). Do NOT change the 2a components' public APIs beyond what Task 6 adds to `SetupStepper`.
- StepShell is a pure extraction — SetupStep must render identically (existing suite is the guard).
- `<worktree-root>` = `D:\VFXellence-LTD\.claude\worktrees\feat+18-brand-wizard-2b`.
