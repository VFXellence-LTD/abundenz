# Persistent Setup Fields Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add data-driven input fields to the Content setup steps that autosave their values to a new `setup_data` table, so the Setup wizard captures the operator's pertinent info; completion tracking is unchanged.

**Architecture:** Server gains a `setup_data` table plus `SetupService.getData`/`setField` and two routes (`GET /setup/data/:ecosystemId`, `PUT /setup/data`), mirroring the existing setup service/route pattern. Client gets a pure `debounce` helper, a `useSetupData` hook (optimistic + debounced autosave on blur), a `SetupField` schema on step data, and field inputs rendered inside the existing `SetupStep` card.

**Tech Stack:** React 19, React Router v7, Express, better-sqlite3, vitest, supertest, Tailwind 4.

**Working dir:** worktree `D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback`. MC at `.canon\.mission-control`. Commit with `git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" ...`. NO `Co-Authored-By` lines.

---

## File Structure

**New:**
- `server/test/setup.route.test.ts` — service + route tests (none exist today).
- `client/src/lib/debounce.ts` + `client/src/lib/debounce.test.ts` — pure debounce helper.
- `client/src/hooks/useSetupData.ts` — field-value fetch + optimistic debounced save.

**Modify:**
- `server/db.ts` — add `setup_data` table in `migrate()`.
- `server/services/setup.service.ts` — add `SetupData` type + `getData`/`setField`.
- `server/routes/setup.ts` — add `GET /data/:ecosystemId` + `PUT /data`.
- `client/src/types/index.ts` — add `SetupField`/`SetupFieldType`, add `fields?` to `SetupStep`.
- `client/src/data/setup-steps.ts` — add `fields` to the 8 Content steps.
- `client/src/components/SetupStep.tsx` — render fields + autosave on blur.
- `client/src/components/SetupStepper.tsx` — thread field getter/saver through.
- `client/src/pages/SetupPage.tsx` — instantiate `useSetupData("content")`, pass to content stepper.

---

## Task 1: setup_data table + SetupService field methods

**Files:**
- Modify: `server/db.ts` (migrate block, after the `setup_progress` table ~line 143)
- Modify: `server/services/setup.service.ts`
- Test: `server/test/setup.route.test.ts`

- [ ] **Step 1: Write the failing test**

Create `server/test/setup.route.test.ts`:

```ts
import { describe, it, expect, afterEach } from "vitest";
import { createDb, type Db } from "../db.js";

let db: Db;
afterEach(() => { db?.close(); });

describe("SetupService — field data", () => {
  it("setField inserts; getData returns nested {stepId:{fieldKey:value}}", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "abundenz.com");
    svc.setField("content", "email", "address", "hi@abundenz.com");
    expect(svc.getData("content")).toEqual({
      domain: { domain: "abundenz.com" },
      email: { address: "hi@abundenz.com" },
    });
  });

  it("setField overwrites an existing value", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "old.com");
    svc.setField("content", "domain", "domain", "new.com");
    expect(svc.getData("content").domain.domain).toBe("new.com");
  });

  it("getData scopes to the requested ecosystem", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "c.com");
    svc.setField("viral", "v1", "handle", "@x");
    expect(svc.getData("content")).toEqual({ domain: { domain: "c.com" } });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\server; npx vitest run setup.route`
Expected: FAIL — `svc.setField is not a function` (and no `setup_data` table).

- [ ] **Step 3: Add the table**

In `server/db.ts`, inside the `migrate()` SQL `exec(...)` string, immediately after the `setup_progress` CREATE TABLE block, add:

```sql
      CREATE TABLE IF NOT EXISTS setup_data (
        ecosystem_id TEXT NOT NULL,
        step_id TEXT NOT NULL,
        field_key TEXT NOT NULL,
        value TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (ecosystem_id, step_id, field_key)
      );
```

- [ ] **Step 4: Add the service methods**

In `server/services/setup.service.ts`, add the type after the existing `SetupProgress` type:

```ts
export type SetupData = Record<string, Record<string, string>>;
```

And add these two methods inside the `SetupService` class (after `toggle`):

```ts
  getData(ecosystemId: string): SetupData {
    const rows = this.db.raw
      .prepare("SELECT step_id, field_key, value FROM setup_data WHERE ecosystem_id=?")
      .all(ecosystemId) as Array<{ step_id: string; field_key: string; value: string }>;
    const out: SetupData = {};
    for (const r of rows) {
      (out[r.step_id] ??= {})[r.field_key] = r.value;
    }
    return out;
  }

  setField(ecosystemId: string, stepId: string, fieldKey: string, value: string): void {
    this.db.raw
      .prepare(
        `INSERT INTO setup_data (ecosystem_id, step_id, field_key, value) VALUES (?, ?, ?, ?)
         ON CONFLICT(ecosystem_id, step_id, field_key) DO UPDATE SET value=excluded.value`,
      )
      .run(ecosystemId, stepId, fieldKey, value);
  }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\server; npx vitest run setup.route`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" add .canon/.mission-control/server/db.ts .canon/.mission-control/server/services/setup.service.ts .canon/.mission-control/server/test/setup.route.test.ts
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" commit -m "Add setup_data table and SetupService field get/set"
```

---

## Task 2: Setup field routes

**Files:**
- Modify: `server/routes/setup.ts`
- Test: `server/test/setup.route.test.ts` (append HTTP tests)

- [ ] **Step 1: Write the failing test**

Append to `server/test/setup.route.test.ts`:

```ts
import request from "supertest";
import { createApp } from "../index.js";
import { SessionService } from "../services/session.service.js";
import { AgentRunsService } from "../services/agentRuns.service.js";

function makeApp() {
  db = createDb(":memory:");
  const sessions = new SessionService(new AgentRunsService(db));
  return createApp({ db, vaultLaunchesDir: "/tmp", sessions });
}

describe("/api/setup/data routes", () => {
  it("PUT /setup/data 400 on missing fields", async () => {
    await request(makeApp()).put("/api/setup/data").send({ ecosystemId: "content" }).expect(400);
  });

  it("PUT then GET round-trips a field value", async () => {
    const app = makeApp();
    await request(app).put("/api/setup/data")
      .send({ ecosystemId: "content", stepId: "domain", fieldKey: "domain", value: "abundenz.com" })
      .expect(200);
    const res = await request(app).get("/api/setup/data/content").expect(200);
    expect(res.body).toEqual({ domain: { domain: "abundenz.com" } });
  });

  it("PUT accepts an empty-string value", async () => {
    await request(makeApp()).put("/api/setup/data")
      .send({ ecosystemId: "content", stepId: "domain", fieldKey: "domain", value: "" })
      .expect(200);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\server; npx vitest run setup.route`
Expected: FAIL — `/api/setup/data` returns 404 (routes not defined).

- [ ] **Step 3: Add the routes**

In `server/routes/setup.ts`, add these two routes inside `createSetupRouter`, after the existing `POST /toggle` route and before `return router;`:

```ts
  router.get("/data/:ecosystemId", (req: Request, res: Response) => {
    try {
      res.json(svc.getData(req.params.ecosystemId));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.put("/data", (req: Request, res: Response) => {
    const { ecosystemId, stepId, fieldKey, value } = req.body as {
      ecosystemId?: string; stepId?: string; fieldKey?: string; value?: string;
    };
    if (
      typeof ecosystemId !== "string" || !ecosystemId ||
      typeof stepId !== "string" || !stepId ||
      typeof fieldKey !== "string" || !fieldKey ||
      typeof value !== "string"
    ) {
      res.status(400).json({ error: "Missing/invalid fields: ecosystemId, stepId, fieldKey, value" });
      return;
    }
    try {
      svc.setField(ecosystemId, stepId, fieldKey, value);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });
```

(The `/api/setup` router is already registered in `server/index.ts` — no change there.)

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\server; npx vitest run setup.route`
Expected: PASS (all setup tests).

- [ ] **Step 5: Run full server suite**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\server; npx vitest run`
Expected: prior baseline (126 passed / 1 skipped after the feedback feature) plus the new setup tests, all green.

- [ ] **Step 6: Commit**

```bash
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" add .canon/.mission-control/server/routes/setup.ts .canon/.mission-control/server/test/setup.route.test.ts
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" commit -m "Add GET/PUT /api/setup/data routes for field persistence"
```

---

## Task 3: Pure debounce helper (client, TDD)

**Files:**
- Create: `client/src/lib/debounce.ts`
- Test: `client/src/lib/debounce.test.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/lib/debounce.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./debounce";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("debounce", () => {
  it("fires once after the window, with the latest args", () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d("a"); d("b"); d("c");
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
  });

  it("fires again for a new call after the window elapses", () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d("x");
    vi.advanceTimersByTime(100);
    d("y");
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\client; npx vitest run debounce`
Expected: FAIL — cannot find `./debounce`.

- [ ] **Step 3: Write minimal implementation**

Create `client/src/lib/debounce.ts`:

```ts
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  ms: number,
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\client; npx vitest run debounce`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" add .canon/.mission-control/client/src/lib/debounce.ts .canon/.mission-control/client/src/lib/debounce.test.ts
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" commit -m "Add pure debounce helper with tests"
```

---

## Task 4: SetupField type + Content step fields

**Files:**
- Modify: `client/src/types/index.ts`
- Modify: `client/src/data/setup-steps.ts`

- [ ] **Step 1: Add the types**

In `client/src/types/index.ts`, add near the `SetupStep` interface (around line 131):

```ts
export type SetupFieldType = "text" | "url" | "email" | "textarea";

export interface SetupField {
  key: string;
  label: string;
  type: SetupFieldType;
  placeholder?: string;
}
```

And add this property to the existing `SetupStep` interface (alongside `copyBlocks?` / `externalLinks?`):

```ts
  fields?: SetupField[];
```

- [ ] **Step 2: Add `fields` to each Content step**

In `client/src/data/setup-steps.ts`, add a `fields:` property to each of the 8 Content step objects (locate each by its `id`). Insert the matching array below:

`id: "domain"`:
```ts
    fields: [{ key: "domain", label: "Registered domain", type: "url", placeholder: "yourbrand.com" }],
```
`id: "email"`:
```ts
    fields: [{ key: "address", label: "Brand email address", type: "email", placeholder: "you@yourbrand.com" }],
```
`id: "youtube"`:
```ts
    fields: [
      { key: "channelUrl", label: "Channel URL", type: "url", placeholder: "https://youtube.com/@yourchannel" },
      { key: "channelName", label: "Channel name", type: "text" },
    ],
```
`id: "beehiiv"`:
```ts
    fields: [{ key: "newsletterUrl", label: "Newsletter URL", type: "url", placeholder: "https://yourbrand.beehiiv.com" }],
```
`id: "ghost"`:
```ts
    fields: [{ key: "blogUrl", label: "Blog URL", type: "url", placeholder: "https://blog.yourbrand.com" }],
```
`id: "socials"`:
```ts
    fields: [
      { key: "x", label: "X / Twitter handle", type: "text", placeholder: "@yourbrand" },
      { key: "linkedin", label: "LinkedIn", type: "text" },
      { key: "tiktok", label: "TikTok handle", type: "text", placeholder: "@yourbrand" },
      { key: "instagram", label: "Instagram handle", type: "text", placeholder: "@yourbrand" },
    ],
```
`id: "first_episode"`:
```ts
    fields: [
      { key: "url", label: "First post/episode URL", type: "url" },
      { key: "title", label: "Title", type: "text" },
    ],
```
`id: "agent_01"`:
```ts
    fields: [
      { key: "niche", label: "Niche / topic", type: "text" },
      { key: "sources", label: "Sources to monitor (comma-separated)", type: "textarea", placeholder: "r/yourniche, a news site, a forum…" },
    ],
```

- [ ] **Step 3: Type-check**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\client; npx tsc -b`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" add .canon/.mission-control/client/src/types/index.ts .canon/.mission-control/client/src/data/setup-steps.ts
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" commit -m "Add SetupField schema and field definitions for Content steps"
```

---

## Task 5: useSetupData hook

**Files:**
- Create: `client/src/hooks/useSetupData.ts`

- [ ] **Step 1: Create the hook**

Create `client/src/hooks/useSetupData.ts`:

```ts
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { debounce } from "@/lib/debounce";
import type { EcosystemId } from "@/types";

type DataMap = Record<string, Record<string, string>>;

export function useSetupData(ecosystemId: EcosystemId) {
  const [data, setData] = useState<DataMap>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const persistersRef = useRef<Record<string, (value: string) => void>>({});

  useEffect(() => {
    let alive = true;
    persistersRef.current = {};
    api
      .get<DataMap>(`/setup/data/${ecosystemId}`)
      .then((d) => { if (alive) setData(d); })
      .catch(console.error);
    return () => { alive = false; };
  }, [ecosystemId]);

  const getPersister = useCallback(
    (stepId: string, fieldKey: string) => {
      const k = `${stepId}.${fieldKey}`;
      if (!persistersRef.current[k]) {
        persistersRef.current[k] = debounce((value: string) => {
          api
            .put(`/setup/data`, { ecosystemId, stepId, fieldKey, value })
            .then(() => setSaved((s) => ({ ...s, [k]: true })))
            .catch(console.error);
        }, 500);
      }
      return persistersRef.current[k];
    },
    [ecosystemId],
  );

  const getFieldValue = useCallback(
    (stepId: string, fieldKey: string) => data[stepId]?.[fieldKey] ?? "",
    [data],
  );

  const saveFieldValue = useCallback(
    (stepId: string, fieldKey: string, value: string) => {
      const k = `${stepId}.${fieldKey}`;
      setData((prev) => ({ ...prev, [stepId]: { ...prev[stepId], [fieldKey]: value } }));
      setSaved((s) => ({ ...s, [k]: false }));
      getPersister(stepId, fieldKey)(value);
    },
    [getPersister],
  );

  const isSaved = useCallback(
    (stepId: string, fieldKey: string) => !!saved[`${stepId}.${fieldKey}`],
    [saved],
  );

  return { getFieldValue, saveFieldValue, isSaved };
}
```

- [ ] **Step 2: Type-check**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\client; npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" add .canon/.mission-control/client/src/hooks/useSetupData.ts
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" commit -m "Add useSetupData hook with optimistic debounced autosave"
```

---

## Task 6: Render fields in SetupStep + thread through stepper and page

**Files:**
- Modify: `client/src/components/SetupStep.tsx`
- Modify: `client/src/components/SetupStepper.tsx`
- Modify: `client/src/pages/SetupPage.tsx`

- [ ] **Step 1: Add field rendering to SetupStep**

In `client/src/components/SetupStep.tsx`:

Update the props interface to add three optional callbacks:

```ts
interface SetupStepProps {
  step: SetupStepType;
  isComplete: boolean;
  onToggleComplete: () => void;
  index: number;
  getFieldValue?: (stepId: string, fieldKey: string) => string;
  saveFieldValue?: (stepId: string, fieldKey: string, value: string) => void;
  isSaved?: (stepId: string, fieldKey: string) => boolean;
}
```

Update the component signature destructuring to include them:

```ts
export function SetupStep({ step, isComplete, onToggleComplete, index, getFieldValue, saveFieldValue, isSaved }: SetupStepProps) {
  const [expanded, setExpanded] = useState(false);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const fieldValue = (key: string) => localValues[key] ?? getFieldValue?.(step.id, key) ?? "";
```

Inside the expanded block, immediately after the instructions paragraph (`<p ...>{step.instructions}</p>`) and before the `copyBlocks` block, add:

```tsx
          {step.fields && step.fields.length > 0 && getFieldValue && saveFieldValue && (
            <div className="space-y-3">
              {step.fields.map((field) => {
                const inputCls =
                  "w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";
                return (
                  <div key={field.key}>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-xs text-zinc-500">{field.label}</label>
                      {isSaved?.(step.id, field.key) && (
                        <span className="text-xs text-emerald-500">saved ✓</span>
                      )}
                    </div>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={2}
                        className={cn(inputCls, "resize-y")}
                        value={fieldValue(field.key)}
                        placeholder={field.placeholder}
                        onChange={(e) => setLocalValues((p) => ({ ...p, [field.key]: e.target.value }))}
                        onBlur={(e) => saveFieldValue(step.id, field.key, e.target.value)}
                      />
                    ) : (
                      <input
                        type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
                        className={inputCls}
                        value={fieldValue(field.key)}
                        placeholder={field.placeholder}
                        onChange={(e) => setLocalValues((p) => ({ ...p, [field.key]: e.target.value }))}
                        onBlur={(e) => saveFieldValue(step.id, field.key, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
```

- [ ] **Step 2: Thread callbacks through SetupStepper**

In `client/src/components/SetupStepper.tsx`, add the three optional props to `SetupStepperProps`:

```ts
  getFieldValue?: (stepId: string, fieldKey: string) => string;
  saveFieldValue?: (stepId: string, fieldKey: string, value: string) => void;
  isSaved?: (stepId: string, fieldKey: string) => boolean;
```

Destructure them in the component signature, and pass them to `<SetupStep>` in the non-locked render path:

```tsx
          <SetupStep
            key={step.id}
            step={step}
            isComplete={isComplete(step.id)}
            onToggleComplete={() => onToggleStep(step.id)}
            index={i}
            getFieldValue={getFieldValue}
            saveFieldValue={saveFieldValue}
            isSaved={isSaved}
          />
```

(The locked render path stays unchanged — placeholder ecosystems have no fields.)

- [ ] **Step 3: Wire the hook into SetupPage**

In `client/src/pages/SetupPage.tsx`:

Add the import:

```ts
import { useSetupData } from "@/hooks/useSetupData";
```

Inside the component, after the `useSetupProgress` line, add:

```ts
  const { getFieldValue, saveFieldValue, isSaved } = useSetupData("content");
```

Pass them to the **content** ecosystem's `<SetupStepper>` only:

```tsx
          <SetupStepper
            steps={contentSteps}
            isComplete={isComplete}
            onToggleStep={toggleStep}
            locked={false}
            getFieldValue={getFieldValue}
            saveFieldValue={saveFieldValue}
            isSaved={isSaved}
          />
```

- [ ] **Step 4: Type-check + build + test**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\client; npx tsc -b; npm run build; npx vitest run`
Expected: build succeeds; client tests green (existing reducer/debounce suites).

- [ ] **Step 5: Commit**

```bash
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" add .canon/.mission-control/client/src/components/SetupStep.tsx .canon/.mission-control/client/src/components/SetupStepper.tsx .canon/.mission-control/client/src/pages/SetupPage.tsx
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" commit -m "Render autosaving setup fields and wire useSetupData into Content wizard"
```

---

## Task 7: Verify in browser + changelog

The MC dev server runs from `.canon\.mission-control` via `pnpm dev` (server :4500, client :5174).

- [ ] **Step 1: Server suite green**

Run: `cd D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\.mission-control\server; npx vitest run`
Expected: all green including new setup tests.

- [ ] **Step 2: Browser check**

Load `http://localhost:5174/setup/content`. Expand a step (e.g. "Register Domain"). Confirm a labeled input appears under the instructions. Type a value, click elsewhere (blur). Confirm a "saved ✓" appears. Reload the page, re-expand the step, confirm the value persisted. Confirm the completion circle still toggles independently.

- [ ] **Step 3: Update changelog**

Append an entry to `D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback\.canon\4_orchestrator\changelogs\polymath-business-changelog.md` (2026-06-25) summarizing: persistent setup fields (setup_data table, GET/PUT /setup/data, useSetupData debounced autosave, SetupField schema on Content steps). Commit:

```bash
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" add .canon/4_orchestrator/changelogs/polymath-business-changelog.md
git -C "D:\VFXellence-LTD\.claude\worktrees\mc-walkthrough-feedback" commit -m "Log persistent setup fields work in changelog"
```

---

## Verification Summary

- Server: `npx vitest run` in `server/` — baseline + new setup field tests green.
- Client: `npx vitest run` in `client/` — debounce + prior reducer suites green; `npm run build` succeeds.
- Browser: field inputs render in Content steps, autosave on blur, persist across reload; completion toggle unaffected.

## Notes for the implementer

- The client has no jsdom vitest config; `debounce` tests are pure (fake timers, no DOM) and run under vitest's default node environment. Do not add component tests here — fields are verified in the browser (Task 7).
- `createDb(":memory:")` runs `migrate()`, so `setup_data` exists in tests.
- Field inputs are controlled with a local-state overlay (`localValues`) that falls back to the server value, so typing is responsive and autosave only fires on blur (per the approved design).
