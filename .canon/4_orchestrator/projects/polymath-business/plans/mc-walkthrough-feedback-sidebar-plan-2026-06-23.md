# MC Sidebar + Walkthrough + Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the Mission Control sidebar into grouped workflow sections, add a custom interactive walkthrough (auto first-visit + replay), and add an accumulating feedback capture that files items as GitHub issues (off by default, dry-run).

**Architecture:** Server gains a `feedback` service + route mirroring the existing `bug-report` bridge (env-gated `MC_FEEDBACK_ENABLED`, dry-run default, batch of items → `gh issue create`). Client gains two pure reducers (tour state, feedback list) unit-tested with vitest, wrapped by two React Context providers (`TourProvider`, `FeedbackProvider`), a `TourOverlay` (spotlight + tooltip driven off `data-tour-id` on sidebar nav items), and a `FeedbackPanel` (floating launcher + accumulating list). The sidebar is restructured from a flat array into labeled groups.

**Tech Stack:** React 19, React Router v7, Tailwind 4, Express, vitest, supertest, lucide-react. Hooks-only state (no Zustand/Redux). `gh` CLI for issue creation.

**Working dir:** `D:\VFXellence-LTD\.canon\.mission-control` (server in `server/`, client in `client/`).
**Repo:** `VFXellence-LTD/abundenz` (renamed 2026-06-23). Commit with `git -C "D:\VFXellence-LTD" ...`, no co-author lines.

---

## File Structure

**New (server):**
- `server/services/feedback.service.ts` — batch feedback → gh issues, env-gated dry-run.
- `server/routes/feedback.ts` — `POST /api/feedback` route, validates items.
- `server/test/feedback.route.test.ts` — route + service tests.

**New (client):**
- `client/src/tour/tourReducer.ts` — pure tour state reducer + `TourStep` type.
- `client/src/tour/tourReducer.test.ts` — reducer unit tests.
- `client/src/tour/tourSteps.ts` — ordered tour step definitions.
- `client/src/tour/TourProvider.tsx` — context, auto-launch, replay.
- `client/src/tour/TourOverlay.tsx` — spotlight + tooltip overlay.
- `client/src/feedback/feedbackReducer.ts` — pure feedback-list reducer + `FeedbackItem` type.
- `client/src/feedback/feedbackReducer.test.ts` — reducer unit tests.
- `client/src/feedback/FeedbackProvider.tsx` — context for accumulated items + panel open state.
- `client/src/feedback/FeedbackPanel.tsx` — floating launcher + accumulating panel + submit.

**Modify:**
- `server/index.ts` — register `/api/feedback` route.
- `server/services/bug-report.service.ts` — update repo target to `abundenz`.
- `server/test/bug-report.route.test.ts` — update dry-run URL expectation.
- `client/src/components/Sidebar.tsx` — grouped sections, `data-tour-id`, walkthrough replay button.
- `client/src/App.tsx` — wrap with `FeedbackProvider` + `TourProvider`, mount `TourOverlay` + `FeedbackPanel`.

---

## Task 1: Feedback service (server, dry-run + batch)

**Files:**
- Create: `server/services/feedback.service.ts`
- Test: `server/test/feedback.route.test.ts` (service-level tests added here; route tests in Task 2)

- [ ] **Step 1: Write the failing test**

Create `server/test/feedback.route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock node:child_process so execSync is never called in tests.
vi.mock("node:child_process", () => ({
  execSync: vi.fn(() => {
    throw new Error("execSync must not be called in tests");
  }),
}));

import { execSync } from "node:child_process";

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env["MC_FEEDBACK_ENABLED"];
});

afterEach(() => {
  delete process.env["MC_FEEDBACK_ENABLED"];
});

describe("FeedbackService — dry-run (MC_FEEDBACK_ENABLED unset)", () => {
  it("returns one dryRun result per item and never shells gh", async () => {
    const { FeedbackService } = await import("../services/feedback.service.js");
    const svc = new FeedbackService({});
    const out = await svc.createBatch([
      { text: "Sidebar should remember collapsed state" },
      { text: "Add dark/light toggle", area: "dashboard-client", severity: "low" },
    ]);
    expect(out.results).toHaveLength(2);
    expect(out.results.every((r) => r.dryRun === true)).toBe(true);
    expect(out.results[0].url).toBe("https://github.com/VFXellence-LTD/abundenz/issues/DRY-RUN");
    expect(execSync).not.toHaveBeenCalled();
  });

  it("derives a concise title from the first line, truncated at 80 chars", async () => {
    const { FeedbackService } = await import("../services/feedback.service.js");
    const svc = new FeedbackService({});
    const short = svc.titleFor("Fix the thing\nmore detail here");
    expect(short).toBe("Fix the thing");
    const long = svc.titleFor("x".repeat(120));
    expect(long.length).toBe(80);
    expect(long.endsWith("...")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\server; npx vitest run feedback.route`
Expected: FAIL — cannot find module `../services/feedback.service.js`.

- [ ] **Step 3: Write minimal implementation**

Create `server/services/feedback.service.ts`:

```ts
import { execSync } from "node:child_process";

export interface FeedbackItem {
  text: string;
  area?: string;
  severity?: string;
}

export interface FeedbackItemResult {
  url: string;
  dryRun: boolean;
}

export interface FeedbackBatchResult {
  results: FeedbackItemResult[];
}

const DRY_RUN_URL = "https://github.com/VFXellence-LTD/abundenz/issues/DRY-RUN";
const REPO = "VFXellence-LTD/abundenz";

export class FeedbackService {
  constructor(
    private env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
  ) {}

  /** Returns true when the feature is enabled (MC_FEEDBACK_ENABLED=true|1|yes). Default: off. */
  private isEnabled(): boolean {
    const val = this.env["MC_FEEDBACK_ENABLED"];
    return val === "true" || val === "1" || val === "yes";
  }

  /** Build a concise issue title from feedback text: first line, truncated to 80 chars. */
  titleFor(text: string): string {
    const firstLine = text.trim().split("\n")[0].trim();
    return firstLine.length > 80 ? firstLine.slice(0, 77) + "..." : firstLine;
  }

  private createOne(item: FeedbackItem): FeedbackItemResult {
    const title = this.titleFor(item.text);
    const severityLine = item.severity ? `**Severity:** ${item.severity}\n` : "";
    const areaLine = item.area ? `**Area:** ${item.area}\n` : "";
    const body = `${severityLine}${areaLine}${item.text.trim()}`.trim();

    if (!this.isEnabled()) {
      console.log(
        "[feedback] WOULD CREATE ISSUE",
        JSON.stringify({ title, body, labels: ["feedback", "enhancement"] }),
      );
      return { url: DRY_RUN_URL, dryRun: true };
    }

    const labelArgs = ["feedback", "enhancement"]
      .map((l) => `--label ${JSON.stringify(l)}`)
      .join(" ");

    const cmd = [
      "gh issue create",
      `--repo ${REPO}`,
      `--title ${JSON.stringify(title)}`,
      `--body ${JSON.stringify(body)}`,
      labelArgs,
    ].join(" ");

    const url = execSync(cmd, { encoding: "utf-8" }).trim();
    return { url, dryRun: false };
  }

  async createBatch(items: FeedbackItem[]): Promise<FeedbackBatchResult> {
    const results = items.map((item) => this.createOne(item));
    return { results };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\server; npx vitest run feedback.route`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/server/services/feedback.service.ts .canon/.mission-control/server/test/feedback.route.test.ts
git -C "D:\VFXellence-LTD" commit -m "Add MC feedback service with dry-run batch issue filing

- FeedbackService.createBatch maps items to gh issues, env-gated MC_FEEDBACK_ENABLED
- Dry-run default returns synthetic URLs, never shells gh
- titleFor derives concise issue title from first line"
```

---

## Task 2: Feedback route + registration (server)

**Files:**
- Create: `server/routes/feedback.ts`
- Modify: `server/index.ts` (add import + `app.use`)
- Test: `server/test/feedback.route.test.ts` (append HTTP tests)

- [ ] **Step 1: Write the failing test**

Append to `server/test/feedback.route.test.ts`:

```ts
import request from "supertest";
import { createApp } from "../index.js";
import { createDb, type Db } from "../db.js";
import { SessionService } from "../services/session.service.js";
import { AgentRunsService } from "../services/agentRuns.service.js";

let db: Db;
function makeApp() {
  db = createDb(":memory:");
  const sessions = new SessionService(new AgentRunsService(db));
  return createApp({ db, vaultLaunchesDir: "/tmp", sessions });
}
afterEach(() => { db?.close(); });

describe("POST /api/feedback — validation", () => {
  it("400 when items is missing", async () => {
    await request(makeApp()).post("/api/feedback").send({}).expect(400);
  });
  it("400 when items is empty array", async () => {
    await request(makeApp()).post("/api/feedback").send({ items: [] }).expect(400);
  });
  it("400 when no item has non-empty text", async () => {
    await request(makeApp()).post("/api/feedback").send({ items: [{ text: "   " }] }).expect(400);
  });
});

describe("POST /api/feedback — dry-run", () => {
  it("returns 200 with one dryRun result per valid item", async () => {
    const res = await request(makeApp())
      .post("/api/feedback")
      .send({ items: [{ text: "Idea one" }, { text: "Idea two", area: "server" }, { text: "  " }] })
      .expect(200);
    expect(res.body.results).toHaveLength(2);
    expect(res.body.results[0].dryRun).toBe(true);
    expect(execSync).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\server; npx vitest run feedback.route`
Expected: FAIL — `/api/feedback` returns 404 (route not registered).

- [ ] **Step 3: Write minimal implementation**

Create `server/routes/feedback.ts`:

```ts
import { Router, type Request, type Response } from "express";
import { FeedbackService, type FeedbackItem } from "../services/feedback.service.js";

export function createFeedbackRouter(): Router {
  const router = Router();
  const svc = new FeedbackService();

  router.post("/", async (req: Request, res: Response) => {
    const { items } = req.body as { items?: FeedbackItem[] };
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Missing required field: items (non-empty array)" });
      return;
    }
    const valid = items
      .filter((i) => i && typeof i.text === "string" && i.text.trim())
      .map((i) => ({ text: i.text.trim(), area: i.area, severity: i.severity }));
    if (valid.length === 0) {
      res.status(400).json({ error: "No feedback items with non-empty text" });
      return;
    }
    const result = await svc.createBatch(valid);
    res.json(result);
  });

  return router;
}
```

Modify `server/index.ts` — add import after the bug-report import (line 17):

```ts
import { createFeedbackRouter } from "./routes/feedback.js";
```

And register it after the bug-report route (line 54):

```ts
  app.use("/api/feedback", createFeedbackRouter());
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\server; npx vitest run feedback.route`
Expected: PASS (all feedback tests).

- [ ] **Step 5: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/server/routes/feedback.ts .canon/.mission-control/server/index.ts .canon/.mission-control/server/test/feedback.route.test.ts
git -C "D:\VFXellence-LTD" commit -m "Add POST /api/feedback route with item validation

- createFeedbackRouter validates non-empty items, filters blank text
- Register /api/feedback in createApp"
```

---

## Task 3: Update bug-report repo target to renamed abundenz repo

**Files:**
- Modify: `server/services/bug-report.service.ts:23` and `:74`
- Modify: `server/test/bug-report.route.test.ts:68`

- [ ] **Step 1: Update the dry-run URL expectation in the existing test first**

In `server/test/bug-report.route.test.ts`, change line 68 from:

```ts
    expect(res.body.url).toBe("https://github.com/VFXellence-LTD/vfxellence/issues/DRY-RUN");
```

to:

```ts
    expect(res.body.url).toBe("https://github.com/VFXellence-LTD/abundenz/issues/DRY-RUN");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\server; npx vitest run bug-report`
Expected: FAIL — service still returns the old `vfxellence` URL.

- [ ] **Step 3: Update the service**

In `server/services/bug-report.service.ts`, change line 23:

```ts
const DRY_RUN_URL = "https://github.com/VFXellence-LTD/abundenz/issues/DRY-RUN";
```

And in the live `cmd` array (line 74), change:

```ts
      `--repo VFXellence-LTD/abundenz`,
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\server; npx vitest run bug-report`
Expected: PASS.

- [ ] **Step 5: Run the full server suite to confirm no regressions**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\server; npx vitest run`
Expected: previous baseline (120 passed / 1 skipped) plus the new feedback tests, all green.

- [ ] **Step 6: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/server/services/bug-report.service.ts .canon/.mission-control/server/test/bug-report.route.test.ts
git -C "D:\VFXellence-LTD" commit -m "Point bug-report issue target at renamed abundenz repo"
```

---

## Task 4: Tour reducer (client, pure logic, TDD)

**Files:**
- Create: `client/src/tour/tourReducer.ts`
- Test: `client/src/tour/tourReducer.test.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/tour/tourReducer.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { tourReducer, initialTourState } from "./tourReducer";

const TOTAL = 3;
const r = (s: typeof initialTourState, a: Parameters<typeof tourReducer>[1]) => tourReducer(s, a, TOTAL);

describe("tourReducer", () => {
  it("START activates at step 0", () => {
    expect(r(initialTourState, { type: "START" })).toEqual({ active: true, stepIndex: 0 });
  });
  it("NEXT advances the step index", () => {
    expect(r({ active: true, stepIndex: 0 }, { type: "NEXT" })).toEqual({ active: true, stepIndex: 1 });
  });
  it("NEXT past the last step deactivates", () => {
    expect(r({ active: true, stepIndex: TOTAL - 1 }, { type: "NEXT" })).toEqual({ active: false, stepIndex: 0 });
  });
  it("BACK clamps at 0", () => {
    expect(r({ active: true, stepIndex: 0 }, { type: "BACK" })).toEqual({ active: true, stepIndex: 0 });
  });
  it("SKIP deactivates", () => {
    expect(r({ active: true, stepIndex: 2 }, { type: "SKIP" })).toEqual({ active: false, stepIndex: 0 });
  });
  it("NEXT is a no-op when inactive", () => {
    expect(r({ active: false, stepIndex: 0 }, { type: "NEXT" })).toEqual({ active: false, stepIndex: 0 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx vitest run tourReducer`
Expected: FAIL — cannot find `./tourReducer`.

- [ ] **Step 3: Write minimal implementation**

Create `client/src/tour/tourReducer.ts`:

```ts
export interface TourStep {
  targetId: string;
  title: string;
  body: string;
  route?: string;
}

export interface TourState {
  active: boolean;
  stepIndex: number;
}

export type TourAction =
  | { type: "START" }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SKIP" }
  | { type: "FINISH" };

export const initialTourState: TourState = { active: false, stepIndex: 0 };

export function tourReducer(state: TourState, action: TourAction, totalSteps: number): TourState {
  switch (action.type) {
    case "START":
      return { active: true, stepIndex: 0 };
    case "NEXT": {
      if (!state.active) return state;
      const next = state.stepIndex + 1;
      if (next >= totalSteps) return { active: false, stepIndex: 0 };
      return { active: true, stepIndex: next };
    }
    case "BACK":
      if (!state.active) return state;
      return { active: true, stepIndex: Math.max(0, state.stepIndex - 1) };
    case "SKIP":
    case "FINISH":
      return { active: false, stepIndex: 0 };
    default:
      return state;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx vitest run tourReducer`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/client/src/tour/tourReducer.ts .canon/.mission-control/client/src/tour/tourReducer.test.ts
git -C "D:\VFXellence-LTD" commit -m "Add pure tour state reducer with tests"
```

---

## Task 5: Feedback reducer (client, pure logic, TDD)

**Files:**
- Create: `client/src/feedback/feedbackReducer.ts`
- Test: `client/src/feedback/feedbackReducer.test.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/feedback/feedbackReducer.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { feedbackReducer } from "./feedbackReducer";

describe("feedbackReducer", () => {
  it("ADD appends a trimmed item", () => {
    const out = feedbackReducer([], { type: "ADD", item: { text: "  hello  " } });
    expect(out).toEqual([{ text: "hello" }]);
  });
  it("ADD ignores blank text", () => {
    expect(feedbackReducer([], { type: "ADD", item: { text: "   " } })).toEqual([]);
  });
  it("ADD preserves area and severity", () => {
    const out = feedbackReducer([], { type: "ADD", item: { text: "x", area: "server", severity: "low" } });
    expect(out).toEqual([{ text: "x", area: "server", severity: "low" }]);
  });
  it("REMOVE drops the item at the given index", () => {
    const start = [{ text: "a" }, { text: "b" }, { text: "c" }];
    expect(feedbackReducer(start, { type: "REMOVE", index: 1 })).toEqual([{ text: "a" }, { text: "c" }]);
  });
  it("CLEAR empties the list", () => {
    expect(feedbackReducer([{ text: "a" }], { type: "CLEAR" })).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx vitest run feedbackReducer`
Expected: FAIL — cannot find `./feedbackReducer`.

- [ ] **Step 3: Write minimal implementation**

Create `client/src/feedback/feedbackReducer.ts`:

```ts
export interface FeedbackItem {
  text: string;
  area?: string;
  severity?: string;
}

export type FeedbackAction =
  | { type: "ADD"; item: FeedbackItem }
  | { type: "REMOVE"; index: number }
  | { type: "CLEAR" };

export function feedbackReducer(state: FeedbackItem[], action: FeedbackAction): FeedbackItem[] {
  switch (action.type) {
    case "ADD":
      if (!action.item.text.trim()) return state;
      return [...state, { ...action.item, text: action.item.text.trim() }];
    case "REMOVE":
      return state.filter((_, i) => i !== action.index);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx vitest run feedbackReducer`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/client/src/feedback/feedbackReducer.ts .canon/.mission-control/client/src/feedback/feedbackReducer.test.ts
git -C "D:\VFXellence-LTD" commit -m "Add pure feedback-list reducer with tests"
```

---

## Task 6: Tour steps + provider (client)

**Files:**
- Create: `client/src/tour/tourSteps.ts`
- Create: `client/src/tour/TourProvider.tsx`

- [ ] **Step 1: Create the tour steps**

Create `client/src/tour/tourSteps.ts`:

```ts
import type { TourStep } from "@/tour/tourReducer";

// Each step navigates to `route`, then highlights the sidebar nav item with the
// matching data-tour-id. Order mirrors the sidebar workflow grouping.
export const TOUR_STEPS: TourStep[] = [
  { targetId: "nav-dashboard", route: "/", title: "Dashboard", body: "Your bird's-eye view — ecosystem status, revenue, and what to do today." },
  { targetId: "nav-setup", route: "/setup/content", title: "Setup", body: "Onboard an ecosystem: register domains and stand up accounts. Start here." },
  { targetId: "nav-launch", route: "/launch/viral/tech", title: "Launch", body: "Launch a vertical — checklists, templates, and artifacts for going live." },
  { targetId: "nav-intake", route: "/intake", title: "Intake", body: "Spin up campaigns, register brands, and file improvement requests." },
  { targetId: "nav-campaigns", route: "/campaigns", title: "Campaigns", body: "Control panel for running campaigns and their agent activity." },
  { targetId: "nav-agents", route: "/agents", title: "Agents", body: "Watch active agent runs working your ecosystems." },
  { targetId: "nav-sessions", route: "/sessions", title: "Sessions", body: "Live terminal sessions for agents — full visibility into what's running." },
  { targetId: "nav-approvals", route: "/approvals", title: "Approvals", body: "The human gate. Nothing publishes without your approval here." },
  { targetId: "nav-board", route: "/board", title: "Board", body: "Kanban task board across all ecosystems." },
  { targetId: "nav-earnings", route: "/earnings", title: "Earnings", body: "Revenue stats and trends per ecosystem." },
  { targetId: "nav-transactions", route: "/transactions", title: "Transactions", body: "Every income and expense, filterable by ecosystem." },
  { targetId: "nav-tax", route: "/tax", title: "Tax Center", body: "Tax estimates and compliance info." },
  { targetId: "nav-tools", route: "/tools", title: "Tools & Entity", body: "Utilities and your business entity details. That's the tour — got ideas to improve Mission Control? Add them next." },
];
```

- [ ] **Step 2: Create the provider**

Create `client/src/tour/TourProvider.tsx`:

```tsx
import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from "react";
import { tourReducer, initialTourState, type TourStep, type TourState, type TourAction } from "@/tour/tourReducer";
import { TOUR_STEPS } from "@/tour/tourSteps";

interface TourContextValue {
  active: boolean;
  stepIndex: number;
  steps: TourStep[];
  start: () => void;
  next: () => void;
  back: () => void;
  skip: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);
const SEEN_KEY = "mc_tour_seen";

export function TourProvider({ children }: { children: ReactNode }) {
  const steps = TOUR_STEPS;
  const [state, dispatch] = useReducer(
    (s: TourState, a: TourAction) => tourReducer(s, a, steps.length),
    initialTourState,
  );

  const start = useCallback(() => {
    localStorage.setItem(SEEN_KEY, "1");
    dispatch({ type: "START" });
  }, []);
  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const back = useCallback(() => dispatch({ type: "BACK" }), []);
  const skip = useCallback(() => dispatch({ type: "SKIP" }), []);

  // Auto-launch on first visit only.
  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) start();
  }, [start]);

  return (
    <TourContext.Provider value={{ active: state.active, stepIndex: state.stepIndex, steps, start, next, back, skip }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}
```

- [ ] **Step 3: Type-check passes**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx tsc -b`
Expected: no errors (note: `next`/`back`/`skip` are wired to the overlay in Task 8; unused-symbol warnings are acceptable until then since they are exported via context).

- [ ] **Step 4: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/client/src/tour/tourSteps.ts .canon/.mission-control/client/src/tour/TourProvider.tsx
git -C "D:\VFXellence-LTD" commit -m "Add tour steps and TourProvider with first-visit auto-launch"
```

---

## Task 7: Feedback provider (client)

**Files:**
- Create: `client/src/feedback/FeedbackProvider.tsx`

- [ ] **Step 1: Create the provider**

Create `client/src/feedback/FeedbackProvider.tsx`:

```tsx
import { createContext, useContext, useReducer, useState, useCallback, type ReactNode } from "react";
import { feedbackReducer, type FeedbackItem } from "@/feedback/feedbackReducer";

interface FeedbackContextValue {
  items: FeedbackItem[];
  panelOpen: boolean;
  add: (item: FeedbackItem) => void;
  remove: (index: number) => void;
  clear: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(feedbackReducer, []);
  const [panelOpen, setPanelOpen] = useState(false);

  const add = useCallback((item: FeedbackItem) => dispatch({ type: "ADD", item }), []);
  const remove = useCallback((index: number) => dispatch({ type: "REMOVE", index }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  return (
    <FeedbackContext.Provider value={{ items, panelOpen, add, remove, clear, openPanel, closePanel }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}
```

- [ ] **Step 2: Type-check passes**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/client/src/feedback/FeedbackProvider.tsx
git -C "D:\VFXellence-LTD" commit -m "Add FeedbackProvider context for accumulated items"
```

---

## Task 8: Tour overlay (client)

**Files:**
- Create: `client/src/tour/TourOverlay.tsx`

Depends on `useTour` (Task 6) and `useFeedback` (Task 7).

- [ ] **Step 1: Create the overlay**

Create `client/src/tour/TourOverlay.tsx`:

```tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTour } from "@/tour/TourProvider";
import { useFeedback } from "@/feedback/FeedbackProvider";

export function TourOverlay() {
  const { active, stepIndex, steps, next, back, skip } = useTour();
  const { openPanel } = useFeedback();
  const navigate = useNavigate();
  const location = useLocation();
  const [rect, setRect] = useState<DOMRect | null>(null);

  const step = active ? steps[stepIndex] : null;

  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(`[data-tour-id="${step.targetId}"]`);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [step]);

  // Navigate to the step's route if needed, then locate its target (retry across frames).
  useEffect(() => {
    if (!step) return;
    if (step.route && location.pathname !== step.route) {
      navigate(step.route);
      return; // effect re-runs once pathname updates
    }
    let tries = 0;
    let raf = 0;
    const tick = () => {
      const el = document.querySelector(`[data-tour-id="${step.targetId}"]`);
      if (el) setRect(el.getBoundingClientRect());
      else if (tries++ < 30) raf = requestAnimationFrame(tick);
      else setRect(null);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [step, location.pathname, navigate]);

  // Keep the spotlight aligned on resize/scroll.
  useEffect(() => {
    if (!active) return;
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [active, measure]);

  if (!active || !step) return null;

  const isLast = stepIndex === steps.length - 1;
  const handleNext = () => {
    if (isLast) openPanel();
    next();
  };

  const pad = 8;
  const tooltipTop = rect
    ? Math.min(rect.bottom + pad, window.innerHeight - 220)
    : window.innerHeight / 2 - 100;
  const tooltipLeft = rect
    ? Math.min(rect.left, window.innerWidth - 340)
    : window.innerWidth / 2 - 160;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Spotlight cutout (or full dim if target not found yet) */}
      {rect ? (
        <div
          className="absolute rounded-md"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.72)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/70" />
      )}

      {/* Tooltip card */}
      <div
        className="absolute pointer-events-auto w-80 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4"
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">{step.title}</h3>
          <span className="text-xs text-zinc-600">{stepIndex + 1}/{steps.length}</span>
        </div>
        <p className="mb-3 text-sm text-zinc-400">{step.body}</p>
        <div className="flex items-center justify-between">
          <button onClick={skip} className="text-xs text-zinc-600 hover:text-zinc-400">Skip</button>
          <div className="flex gap-2">
            {stepIndex > 0 && (
              <button onClick={back} className="rounded-md px-3 py-1 text-sm text-zinc-400 hover:text-zinc-200">
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500"
            >
              {isLast ? "Finish & give feedback" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check passes**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/client/src/tour/TourOverlay.tsx
git -C "D:\VFXellence-LTD" commit -m "Add TourOverlay with spotlight, navigation, and feedback handoff"
```

---

## Task 9: Feedback panel (client)

**Files:**
- Create: `client/src/feedback/FeedbackPanel.tsx`

- [ ] **Step 1: Create the panel**

Create `client/src/feedback/FeedbackPanel.tsx`:

```tsx
import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { useFeedback } from "@/feedback/FeedbackProvider";

interface FeedbackItemResult { url: string; dryRun: boolean; }
interface FeedbackBatchResponse { results: FeedbackItemResult[]; }

export function FeedbackPanel() {
  const { items, panelOpen, add, remove, clear, openPanel, closePanel } = useFeedback();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<FeedbackItemResult[] | null>(null);

  const inputCls =
    "w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";

  function handleAdd() {
    if (!text.trim()) return;
    add({ text: text.trim() });
    setText("");
    setResults(null);
  }

  async function handleSubmitAll() {
    if (items.length === 0) return;
    setBusy(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `${res.status} ${res.statusText}`);
      }
      const data = (await res.json()) as FeedbackBatchResponse;
      setResults(data.results);
      clear();
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={openPanel}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-emerald-500"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Feedback{items.length > 0 ? ` (${items.length})` : ""}
      </button>

      {panelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => { if (e.target === e.currentTarget) closePanel(); }}
        >
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-100">Improve Mission Control</h2>
              <button onClick={closePanel} className="text-lg leading-none text-zinc-600 hover:text-zinc-300" aria-label="Close">×</button>
            </div>
            <div className="space-y-3 px-5 py-4">
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
                  placeholder="What would make this better?"
                  autoFocus
                />
                <button
                  onClick={handleAdd}
                  disabled={!text.trim()}
                  className="rounded-md bg-zinc-700 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-600 disabled:opacity-50"
                >
                  Add
                </button>
              </div>

              {items.length > 0 ? (
                <ul className="max-h-60 space-y-1.5 overflow-y-auto">
                  {items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2 rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
                      <span className="flex-1 text-sm text-zinc-300">{it.text}</span>
                      <button onClick={() => remove(i)} className="text-sm text-zinc-600 hover:text-red-400" aria-label="Remove">×</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-600">No feedback yet. Add items above; they accumulate until you submit.</p>
              )}

              {results && (
                <div className="space-y-2">
                  {results.some((r) => r.dryRun) && (
                    <div className="rounded border border-amber-500 bg-amber-950 px-3 py-2 text-sm font-semibold text-amber-300">
                      DRY RUN — issues not actually filed (enable MC_FEEDBACK_ENABLED)
                    </div>
                  )}
                  <p className="text-sm text-zinc-300">{results.length} item(s) processed:</p>
                  <ul className="space-y-1">
                    {results.map((r, i) => (
                      <li key={i}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="block truncate text-sm text-blue-400 hover:underline">{r.url}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button onClick={closePanel} className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300">Done</button>
                <button
                  onClick={handleSubmitAll}
                  disabled={busy || items.length === 0}
                  className="rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {busy ? "Filing…" : `Submit all${items.length ? ` (${items.length})` : ""}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Type-check passes**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx tsc -b`
Expected: no errors. (If `MessageSquarePlus` is not exported by the installed lucide-react, substitute `MessageCircle`.)

- [ ] **Step 3: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/client/src/feedback/FeedbackPanel.tsx
git -C "D:\VFXellence-LTD" commit -m "Add FeedbackPanel floating launcher with accumulating list and batch submit"
```

---

## Task 10: Regroup sidebar + add tour anchors and replay button

**Files:**
- Modify: `client/src/components/Sidebar.tsx`

- [ ] **Step 1: Replace the nav structure, render, and footer**

Replace the entire contents of `client/src/components/Sidebar.tsx` with:

```tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  DollarSign,
  Receipt,
  Calculator,
  Wrench,
  Rocket,
  Building2,
  KanbanSquare,
  Inbox,
  ShieldCheck,
  Megaphone,
  Terminal,
  TerminalSquare,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ECOSYSTEMS } from "@/data/ecosystems";
import { BugReportButton } from "@/components/BugReportButton";
import { useTour } from "@/tour/TourProvider";

const NAV_GROUPS = [
  {
    section: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, end: true, tourId: "nav-dashboard" }],
  },
  {
    section: "Build",
    items: [
      { to: "/setup/content", label: "Setup", icon: ListChecks, end: false, tourId: "nav-setup" },
      { to: "/launch/viral/tech", label: "Launch", icon: Rocket, end: false, tourId: "nav-launch" },
      { to: "/intake", label: "Intake", icon: Inbox, end: false, tourId: "nav-intake" },
    ],
  },
  {
    section: "Operate",
    items: [
      { to: "/campaigns", label: "Campaigns", icon: Megaphone, end: false, tourId: "nav-campaigns" },
      { to: "/agents", label: "Agents", icon: Terminal, end: false, tourId: "nav-agents" },
      { to: "/sessions", label: "Sessions", icon: TerminalSquare, end: false, tourId: "nav-sessions" },
      { to: "/approvals", label: "Approvals", icon: ShieldCheck, end: false, tourId: "nav-approvals" },
      { to: "/board", label: "Board", icon: KanbanSquare, end: false, tourId: "nav-board" },
    ],
  },
  {
    section: "Money",
    items: [
      { to: "/earnings", label: "Earnings", icon: DollarSign, end: false, tourId: "nav-earnings" },
      { to: "/transactions", label: "Transactions", icon: Receipt, end: false, tourId: "nav-transactions" },
      { to: "/tax", label: "Tax Center", icon: Calculator, end: false, tourId: "nav-tax" },
    ],
  },
  {
    section: "Admin",
    items: [
      { to: "/tools", label: "Tools", icon: Wrench, end: false, tourId: "nav-tools" },
      { to: "/entity", label: "Entity", icon: Building2, end: false, tourId: "nav-entity" },
    ],
  },
];

export function Sidebar() {
  const { start } = useTour();

  return (
    <aside className="w-60 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Polymath</p>
            <p className="text-xs text-zinc-600">Command Center</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.section} className="space-y-0.5">
            <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-zinc-600">
              {group.section}
            </p>
            {group.items.map(({ to, label, icon: Icon, end, tourId }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                data-tour-id={tourId}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900",
                  )
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Ecosystem status */}
      <div className="px-5 py-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-600 mb-2 uppercase tracking-wider font-medium">
          Ecosystems
        </p>
        <div className="space-y-1.5">
          {ECOSYSTEMS.map((eco) => (
            <div key={eco.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  eco.status === "Active" ? eco.dotColor : "bg-zinc-700",
                )}
              />
              <span className="text-xs text-zinc-500">{eco.name}</span>
              <span className="ml-auto text-xs text-zinc-700">{eco.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Walkthrough + bug report */}
      <div className="px-3 pb-3 border-t border-zinc-800 pt-2 space-y-1">
        <button
          onClick={start}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900 transition-colors"
        >
          <Compass className="w-3.5 h-3.5 flex-shrink-0" />
          Walkthrough
        </button>
        <BugReportButton />
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Type-check passes**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx tsc -b`
Expected: no errors. (If `Compass` is not exported by the installed lucide-react, substitute `HelpCircle`.)

- [ ] **Step 3: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/client/src/components/Sidebar.tsx
git -C "D:\VFXellence-LTD" commit -m "Regroup sidebar into workflow sections with tour anchors and replay button"
```

---

## Task 11: Wire providers into App

**Files:**
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Wrap the app with providers and mount overlay + panel**

Replace the entire contents of `client/src/App.tsx` with:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { TourProvider } from "@/tour/TourProvider";
import { TourOverlay } from "@/tour/TourOverlay";
import { FeedbackProvider } from "@/feedback/FeedbackProvider";
import { FeedbackPanel } from "@/feedback/FeedbackPanel";
import { DashboardPage } from "@/pages/DashboardPage";
import { SetupPage } from "@/pages/SetupPage";
import { EarningsPage } from "@/pages/EarningsPage";
import { TransactionsPage } from "@/pages/TransactionsPage";
import { TaxCenterPage } from "@/pages/TaxCenterPage";
import { ToolsPage } from "@/pages/ToolsPage";
import { LaunchPage } from "@/pages/LaunchPage";
import { EntityPage } from "@/pages/EntityPage";
import { BoardPage } from "@/pages/BoardPage";
import { IntakePage } from "@/pages/IntakePage";
import { ApprovalsPage } from "@/pages/ApprovalsPage";
import { CampaignsPage } from "@/pages/CampaignsPage";
import { AgentsPage } from "@/pages/AgentsPage";
import SessionsPage from "@/pages/SessionsPage";

export default function App() {
  return (
    <BrowserRouter>
      <FeedbackProvider>
        <TourProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/intake" element={<IntakePage />} />
              <Route path="/approvals" element={<ApprovalsPage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/setup" element={<Navigate to="/setup/content" replace />} />
              <Route path="/setup/:ecosystem" element={<SetupPage />} />
              <Route path="/launch" element={<Navigate to="/launch/viral/tech" replace />} />
              <Route path="/launch/:ecosystem/:vertical" element={<LaunchPage />} />
              <Route path="/earnings" element={<EarningsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/tax" element={<TaxCenterPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/entity" element={<EntityPage />} />
            </Routes>
          </Layout>
          <TourOverlay />
          <FeedbackPanel />
        </TourProvider>
      </FeedbackProvider>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Full client type-check + build**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx tsc -b; npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Run the client test suite**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx vitest run`
Expected: PASS — tourReducer (6) + feedbackReducer (5) tests green.

- [ ] **Step 4: Commit**

```bash
git -C "D:\VFXellence-LTD" add .canon/.mission-control/client/src/App.tsx
git -C "D:\VFXellence-LTD" commit -m "Wire TourProvider/FeedbackProvider and mount overlay + feedback panel"
```

---

## Task 12: Manual verification in browser + full-suite confirmation

The MC dev server runs at client `:5174`, server `:4500` (start with `pnpm dev` from `D:\VFXellence-LTD\.canon\.mission-control` if not already running).

- [ ] **Step 1: Server suite green**

Run: `cd D:\VFXellence-LTD\.canon\.mission-control\server; npx vitest run`
Expected: 120 passed / 1 skipped baseline + new feedback tests, all green.

- [ ] **Step 2: Sidebar grouping**

Load `http://localhost:5174/`. Confirm the sidebar shows five labeled sections in order: Overview, Build (Setup, Launch, Intake), Operate (Campaigns, Agents, Sessions, Approvals, Board), Money (Earnings, Transactions, Tax Center), Admin (Tools, Entity). Confirm a "Walkthrough" button and "Report bug" button in the footer.

- [ ] **Step 2b: First-visit auto-launch**

In DevTools console run `localStorage.removeItem("mc_tour_seen")`, then reload. Expected: tour auto-starts at the Dashboard step with a spotlight on the Dashboard nav item and a tooltip showing "1/13".

- [ ] **Step 3: Tour navigation**

Click Next through the steps. Confirm each step navigates the main view to the matching route and moves the spotlight to the matching nav item. Confirm Back works and Skip closes the tour. On the final step the button reads "Finish & give feedback"; clicking it closes the tour and opens the feedback panel.

- [ ] **Step 4: Feedback accumulation + dry-run submit**

Open the feedback panel (floating "Feedback" button, bottom-right). Add 2-3 items; confirm the count badge increments and items list. Click "Submit all". Expected: an amber "DRY RUN" banner and 2-3 synthetic `…/abundenz/issues/DRY-RUN` URLs; the accumulated list clears. Confirm no GitHub issues were actually created (`MC_FEEDBACK_ENABLED` is unset).

- [ ] **Step 5: Replay**

Click the sidebar "Walkthrough" button. Expected: tour restarts from step 1 regardless of the `mc_tour_seen` flag.

- [ ] **Step 6: Final state**

Run: `git -C "D:\VFXellence-LTD" status`
Expected: clean working tree (all task commits landed). If `pnpm dev` rewrote `server-boot.log`, leave it unstaged.

- [ ] **Step 7: Update changelog**

Append an entry to `D:\VFXellence-LTD\.canon\4_orchestrator\changelogs\polymath-business-changelog.md` summarizing: sidebar regroup, interactive walkthrough (auto + replay), feedback capture → GitHub issues (dry-run default). Commit:

```bash
git -C "D:\VFXellence-LTD" add .canon/4_orchestrator/changelogs/polymath-business-changelog.md
git -C "D:\VFXellence-LTD" commit -m "Log MC sidebar/walkthrough/feedback work in changelog"
```

---

## Verification Summary

- Server: `npx vitest run` in `server/` — baseline + new feedback tests green.
- Client: `npx vitest run` in `client/` — tourReducer + feedbackReducer tests green; `npm run build` succeeds.
- Browser: sidebar grouped in workflow order; tour auto-launches first visit and replays on demand; feedback accumulates and files as dry-run issues.
- Doctrine intact: feedback filing off by default (`MC_FEEDBACK_ENABLED`); no publishing path touched.

## Notes for the implementer

- The client has `vitest`, `@testing-library/*`, and `jsdom` installed but **no vitest config and no existing test files**. The two reducer test suites are **pure logic** (no DOM), so they run under vitest's default node environment without extra config. Do not add jsdom-dependent component tests in this plan — UI is verified manually in the browser (Task 12).
- All tour anchors live on the **sidebar nav items** (always mounted), so no page-component edits are needed for the tour to find its targets.
- lucide-react icon names (`Compass`, `MessageSquarePlus`) are standard; if the installed version lacks either, the steps note fallbacks (`HelpCircle`, `MessageCircle`).
