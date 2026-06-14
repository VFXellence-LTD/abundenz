# Mission Control Client Implementation Plan (Plan 2 of 5)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build the React client surfaces of Mission Control on top of the live, already-tested Plan-1 API at `.canon/.mission-control/client/`. Add a test harness (vitest + RTL + jsdom — the client has none today). Ship five new operator surfaces wired to real `/api/*` endpoints: the **BOARD** (5 status columns, priority-tinted cards, ecosystem scope filter), the **INTAKE** surface (create campaign + child tasks, register brand/ecosystem, file an "improve Mission Control" infra task), the **► APPROVAL QUEUE ◄** (the doctrine-critical human gate — preview artifact + `contentJson`, Approve / Reject / Request-changes), the **CAMPAIGN CONTROL PANEL** (list campaigns, show agent-run status, a `Run` button that calls the Plan-3 session endpoint and degrades gracefully on 404), and an **AGENT/SESSION** placeholder board (full terminal lands in Plan 3). Add react-router routes for all new pages while keeping existing finance/setup/entity pages working.

**Architecture:** The client is Vite 8 + React 19 + Tailwind 4 + react-router-dom 7 + recharts, dev port **5174**, vite proxying `/api` -> `http://localhost:4500`. There is a single typed fetch wrapper `src/lib/api.ts` exposing `api.get/post/put/patch/del<T>(path, body)`. There is **no** extracted shadcn `components/ui/` library — `src/components/ui/` is empty; the codebase's "shadcn-style" convention is **inline Tailwind on the zinc palette** (`bg-zinc-900`, `border-zinc-800`, `text-zinc-100/500`, accent `emerald`/`orange`) plus `cn()` from `src/lib/utils.ts`. We therefore (a) mirror the **structure** of Halon CMC's Board (`D:\dev\halon-rdutta\_canon_factory\canon-instances\halon.canon\.mission-control\client\src\features\kanban\` — `KanbanBoard` → per-status `KanbanColumn` → priority-tinted `KanbanCard` with a status `<select>`), but (b) render it with the Polymath inline-zinc style and create two tiny local primitives (`Badge`, `ScrollColumn`) under `src/components/ui/` rather than importing Halon's. New feature code lives under `src/features/` (board, intake, approvals, campaigns, agents); pages compose features and are mounted in `App.tsx`. Server status changes are **PATCH `…/:id/status`** (not bare POST); the server enforces the gates (task can't reach `done` with a pending approval; approval terminal once approved/rejected; campaign needs `approvedBy` before `running`). On approve the server does **not** auto-transition the task — the Approval Queue performs the follow-up `PATCH /api/tasks/:id/status` itself (`done` on approve, `in-progress` on reject/changes-requested).

**Tech Stack:** React `^19.2.6`, react-dom `^19.2.6`, react-router-dom `^7.15.0`, lucide-react `^1.14.0`, `clsx` + `tailwind-merge` (via `cn`), Tailwind 4. New dev deps (this plan adds them): `vitest ^4.1.7`, `@testing-library/react ^16.x`, `@testing-library/jest-dom ^6.x`, `@testing-library/user-event ^14.x`, `jsdom ^25.x`, `@vitejs/plugin-react` (already present). TS: `module: esnext`, `moduleResolution: bundler`, `verbatimModuleSyntax: true`, `jsx: react-jsx`, `@/*` → `./src/*`. ESM throughout (`"type": "module"`). `noUnusedLocals`/`noUnusedParameters` are ON — every declared symbol must be used.

**Scope guardrails (DO NOT exceed):**
- Client surfaces only. No server route changes (Plan 1 owns the API; it is frozen for this plan).
- The `Run` button calls `POST /api/sessions/start` which **does not exist until Plan 3** — stub the call site, catch the 404/network error, surface a clear "Session engine not yet available (Plan 3)" state. Do NOT build the PTY/terminal — that is Plan 3.
- The engine that fills the approval queue is **Plan 4**. Plan 2 only **reads** approvals and renders whatever `contentJson` shape arrives (`script`, `hook`, `shotlist`, `caption`, `hashtags`, `safeguardReport`). Render defensively — any field may be absent.
- No new global state lib, no react-query — use the existing `useEffect` + `api` + local `useState` hook pattern (see `useTools.ts`).
- "Live-ish refresh" = `setInterval` polling (5 s) + manual refresh button. No WebSocket wiring in this plan.
- Do NOT touch the existing finance hooks (`useTransactions`, `useSetupProgress`, `useLaunchProgress`) or finance/tax/tools pages beyond adding nav links + routes.

---

## File map

All paths relative to `D:\VFXellence-LTD\.canon\.mission-control\client\` unless absolute.

```
client/
├── package.json                          # MODIFY — add vitest+RTL+jsdom devDeps, "test" script (Task 1)
├── vite.config.ts                        # MODIFY — add vitest `test` block (jsdom, setup, globals) (Task 1)
├── tsconfig.app.json                     # MODIFY — add "vitest/globals","@testing-library/jest-dom" to types (Task 1)
├── src/
│   ├── test/
│   │   └── setup.ts                      # NEW — import @testing-library/jest-dom; afterEach cleanup (Task 1)
│   ├── lib/
│   │   ├── api.ts                        # EXISTS — typed fetch wrapper (read-only; reused)
│   │   ├── utils.ts                      # EXISTS — cn(), formatDate (reused)
│   │   └── engine.ts                     # NEW — mission-control domain types + label/color maps (Task 2)
│   ├── components/ui/
│   │   ├── Badge.tsx                      # NEW — inline-zinc badge primitive (Task 2)
│   │   └── ScrollColumn.tsx              # NEW — scroll container primitive (Task 2)
│   ├── hooks/
│   │   ├── useTasks.ts                   # NEW — list/patch tasks (Task 3)
│   │   ├── useCampaigns.ts               # NEW — list/create/approve/patch campaigns (Task 6)
│   │   ├── useApprovals.ts               # NEW — list pending + decide (Task 5)
│   │   └── useAgentRuns.ts               # NEW — poll agent_runs (Task 6)
│   ├── features/
│   │   ├── board/
│   │   │   ├── Board.tsx                 # NEW — 5 columns, scope filter (Task 4)
│   │   │   ├── BoardColumn.tsx           # NEW (Task 3)
│   │   │   ├── TaskCard.tsx              # NEW — priority-tinted + status select (Task 3)
│   │   │   └── board.types.ts            # NEW — BOARD_COLUMNS, priority/status color maps (Task 2)
│   │   ├── intake/
│   │   │   ├── IntakeForm.tsx            # NEW — campaign / brand / infra-task tabs (Task 7)
│   │   │   └── intake.api.ts             # NEW — composite create helpers (Task 7)
│   │   ├── approvals/
│   │   │   ├── ApprovalQueue.tsx         # NEW — list pending (Task 5)
│   │   │   ├── ApprovalCard.tsx          # NEW — preview + decide buttons (Task 5)
│   │   │   └── ContentPreview.tsx        # NEW — renders contentJson defensively (Task 5)
│   │   ├── campaigns/
│   │   │   └── CampaignPanel.tsx         # NEW — list + Run button + run status (Task 6)
│   │   └── agents/
│   │       └── AgentBoard.tsx            # NEW — Plan-3 placeholder (Task 6)
│   ├── pages/
│   │   ├── BoardPage.tsx                 # NEW (Task 4)
│   │   ├── IntakePage.tsx                # NEW (Task 7)
│   │   ├── ApprovalsPage.tsx             # NEW (Task 5)
│   │   ├── CampaignsPage.tsx             # NEW (Task 6)
│   │   └── AgentsPage.tsx                # NEW (Task 6)
│   ├── components/Sidebar.tsx            # MODIFY — add Board/Intake/Approvals/Campaigns/Agents nav (Task 8)
│   └── App.tsx                           # MODIFY — add 5 routes; keep existing (Task 8)
└── src/**/*.test.tsx                     # NEW — colocated RTL tests per feature
```

Test files (colocated): `src/App.smoke.test.tsx` (Task 1), `src/features/board/TaskCard.test.tsx` + `Board.test.tsx` (Task 3,4), `src/features/approvals/{ContentPreview,ApprovalCard,ApprovalQueue}.test.tsx` (Task 5), `src/features/campaigns/CampaignPanel.test.tsx` (Task 6), `src/features/intake/IntakeForm.test.tsx` (Task 7), `src/App.routes.test.tsx` (Task 8).

### Shared domain types (mirror Plan-1 service output — camelCase)

These are the **exact** JSON shapes the live API returns; `src/lib/engine.ts` (Task 2) declares them once and every hook/feature imports from there.

```ts
export type TaskStatus = "backlog" | "todo" | "in-progress" | "blocked" | "in-review" | "done";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export interface Task {
  id: string; title: string; description?: string; type: string;
  ecosystemId: string; verticalId?: string; source: string; status: TaskStatus;
  priority: string; owner?: string; agentId?: string; parentId?: string;
  linkedIds?: string[]; campaignId?: string; contentType?: string; platform?: string;
  autonomyStage: number; checklist?: unknown; createdAt: string; updatedAt: string;
}
export type CampaignStatus = "planned" | "running" | "paused" | "review" | "done" | "killed";
export interface Campaign {
  id: string; name: string; ecosystemId: string; verticalId?: string;
  status: CampaignStatus; autonomyStage: number; targetCount: number;
  approvedBy?: string; approvedAt?: string; startedAt?: string; completedAt?: string;
  notes?: string; createdAt: string; updatedAt: string;
}
export type ApprovalStatus = "pending" | "approved" | "rejected" | "changes-requested";
export interface ApprovalContent {
  script?: string; hook?: string; shotlist?: string[] | string; caption?: string;
  hashtags?: string[] | string; safeguardReport?: string | Record<string, unknown>;
}
export interface Approval {
  id: string; taskId?: string; campaignId?: string; ecosystemId: string;
  contentType?: string; artifactPath?: string; previewUrl?: string;
  contentJson?: ApprovalContent; status: ApprovalStatus;
  reviewedBy?: string; reviewedAt?: string; reviewNotes?: string; createdAt: string;
}
export type AgentRunStatus = "queued" | "running" | "waiting" | "done" | "error" | "killed";
export interface AgentRun {
  id: string; campaignId?: string; taskId?: string; agentName?: string;
  claudeSessionId?: string; ptySessionId?: string; status: AgentRunStatus;
  cwd?: string; command?: string; startedAt?: string; completedAt?: string;
  outputJson?: unknown; error?: string;
}
```

### Live API contract used by this plan (verified against Plan-1 routes)

| Need | Method + path | Body | Returns |
|------|---------------|------|---------|
| List tasks (optionally scoped) | `GET /api/tasks?ecosystem=<id|all>` | — | `Task[]` |
| Create task | `POST /api/tasks` | `{ id, title, type, ecosystemId, ...optional }` | `201 Task` (409 if id exists) |
| Move task | `PATCH /api/tasks/:id/status` | `{ status }` | `Task` (409 if `done` + pending approval) |
| List campaigns | `GET /api/campaigns?ecosystem=<id|all>` | — | `Campaign[]` |
| Create campaign | `POST /api/campaigns` | `{ id, name, ecosystemId, verticalId?, targetCount?, notes? }` | `201 Campaign` |
| Approve campaign (gate) | `POST /api/campaigns/:id/approve` | `{ approvedBy }` | `Campaign` |
| Set campaign status | `PATCH /api/campaigns/:id/status` | `{ status }` | `Campaign` (409 if `running` without `approvedBy`) |
| List approvals (pending) | `GET /api/approvals?status=pending&ecosystem=<id|all>` | — | `Approval[]` |
| Decide approval | `PATCH /api/approvals/:id/status` | `{ status, reviewedBy, reviewNotes? }` | `Approval` (409 if terminal) |
| List agent runs | `GET /api/agent-runs` | — | `AgentRun[]` |
| Start session (Plan 3 — not yet live) | `POST /api/sessions/start` | `{ campaignId }` | **expect 404 now** → graceful stub |
| Register brand/ecosystem (intake) | `POST /api/setup` or `PUT /api/launch` | (see Task 7) | persisted setup record |

> **Deviation note vs. the verbal brief:** the brief said `POST /api/approvals/:id {status, reviewNotes}`. The **real** Plan-1 endpoint is `PATCH /api/approvals/:id/status {status, reviewedBy, reviewNotes}` and on approve the task is **not** auto-completed by the server. This plan targets the real endpoints and makes the Approval Queue do the follow-up task transition. Same for campaign approve (`POST /api/campaigns/:id/approve {approvedBy}`) and task move (`PATCH /api/tasks/:id/status`).

---

## Task 1 — Test harness: vitest + RTL + jsdom, one passing render test

**Model/effort:** sonnet, medium. **Worktree: yes** (`superpowers:using-git-worktrees`; branch `plan2/task1-test-harness`).

**Files:**
- Modify: `package.json`, `vite.config.ts`, `tsconfig.app.json`
- Create: `src/test/setup.ts`
- Test: `src/App.smoke.test.tsx`

Steps:

- [ ] **Add deps + script.** Edit `package.json`: add to `devDependencies` `"vitest": "^4.1.7"`, `"@testing-library/react": "^16.1.0"`, `"@testing-library/jest-dom": "^6.6.3"`, `"@testing-library/user-event": "^14.5.2"`, `"jsdom": "^25.0.1"`; add `"test": "vitest run"` and `"test:watch": "vitest"` to `scripts`. Run `pnpm install` in `client/`.

- [ ] **Wire vitest into vite.config.** Add a `test` block to the existing `defineConfig` (vitest reads vite config). Complete replacement of the `export default` call — keep `plugins`, `server`, `resolve` exactly as they are and append:
  ```ts
  // add at top:  /// <reference types="vitest/config" />
  // inside defineConfig({...}) after `resolve`:
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: true,
    },
  ```

- [ ] **Create `src/test/setup.ts`** (complete file):
  ```ts
  import "@testing-library/jest-dom";
  import { afterEach } from "vitest";
  import { cleanup } from "@testing-library/react";

  afterEach(() => {
    cleanup();
  });
  ```

- [ ] **Add test types to `tsconfig.app.json`:** change `"types": ["vite/client"]` → `"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]`.

- [ ] **Write failing test** `src/App.smoke.test.tsx` (complete file):
  ```tsx
  import { render, screen } from "@testing-library/react";
  import { describe, it, expect } from "vitest";
  import App from "./App";

  describe("App", () => {
    it("renders the Polymath brand in the sidebar", () => {
      render(<App />);
      expect(screen.getByText("Polymath")).toBeInTheDocument();
    });
  });
  ```

- [ ] **Run, expect FAIL** (vitest not yet wired / dep missing). Cmd: `pnpm --filter polymath-dashboard test` (or in `client/`: `pnpm test`). Expected before deps land: `Cannot find module 'vitest'` or no test runner; after wiring with a typo it would show a red `App` suite. Capture the failing output.

- [ ] **Make it pass:** confirm all four edits above are saved; `App` already renders `<Sidebar/>` containing the text "Polymath". Re-run.

- [ ] **Run, expect PASS.** Cmd: `pnpm --filter polymath-dashboard test`. Expected: `Test Files 1 passed (1)` / `Tests 1 passed (1)`.

- [ ] **Commit.** `git -C D:\VFXellence-LTD add .canon/.mission-control/client && git -C D:\VFXellence-LTD commit -m "Add vitest + RTL + jsdom test harness to MC client

- Add vitest, @testing-library/react, jest-dom, user-event, jsdom devDeps
- Wire vitest jsdom test block into vite.config.ts with setup file
- Add src/test/setup.ts (jest-dom + afterEach cleanup)
- Add App smoke render test asserting the Polymath brand renders"`

---

## Task 2 — Domain types + primitives (engine.ts, Badge, ScrollColumn, board.types)

**Model/effort:** haiku, low (mechanical type/constant authoring). **Worktree: yes** (branch `plan2/task2-primitives`).

**Files:**
- Create: `src/lib/engine.ts`, `src/components/ui/Badge.tsx`, `src/components/ui/ScrollColumn.tsx`, `src/features/board/board.types.ts`
- Test: `src/components/ui/Badge.test.tsx`

Steps:

- [ ] **Create `src/lib/engine.ts`** — paste the full "Shared domain types" block above verbatim (all `export type`/`export interface` declarations). No logic, types only.

- [ ] **Create `src/features/board/board.types.ts`** (complete file):
  ```ts
  import type { TaskStatus } from "@/lib/engine";

  export interface BoardColumn { id: TaskStatus; label: string; }

  // NO Triage. Blocked is not a column (kept off-board like Halon).
  export const BOARD_COLUMNS: BoardColumn[] = [
    { id: "backlog", label: "Backlog" },
    { id: "todo", label: "To Do" },
    { id: "in-progress", label: "In Progress" },
    { id: "in-review", label: "In Review" },
    { id: "done", label: "Done" },
  ];

  // Statuses offered in the per-card status <select>.
  export const TRANSITION_OPTIONS: { value: TaskStatus; label: string }[] = [
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "in-review", label: "In Review" },
    { value: "done", label: "Done" },
  ];

  // Priority left-border tint (schema priorities: critical|high|medium|low; tolerate unknown).
  export const PRIORITY_BORDER: Record<string, string> = {
    critical: "border-l-red-500",
    high: "border-l-orange-500",
    medium: "border-l-yellow-500",
    low: "border-l-emerald-500",
  };
  export const PRIORITY_BG: Record<string, string> = {
    critical: "bg-red-950/30",
    high: "bg-orange-950/20",
    medium: "bg-yellow-950/10",
    low: "bg-emerald-950/10",
  };

  export const STATUS_ACCENT: Record<TaskStatus, string> = {
    backlog: "#6b7280",
    todo: "#c78052",
    "in-progress": "#299969",
    blocked: "#ef4444",
    "in-review": "#0d84a8",
    done: "#22c55e",
  };
  ```

- [ ] **Create `src/components/ui/Badge.tsx`** (complete file — inline-zinc, mirrors Halon Badge variants without importing it):
  ```tsx
  import type { ReactNode } from "react";
  import { cn } from "@/lib/utils";

  type Variant = "default" | "secondary" | "outline";

  const VARIANTS: Record<Variant, string> = {
    default: "bg-emerald-600 text-white border-transparent",
    secondary: "bg-zinc-800 text-zinc-300 border-transparent",
    outline: "bg-transparent text-zinc-400 border-zinc-700",
  };

  export function Badge({
    children,
    variant = "secondary",
    className,
  }: {
    children: ReactNode;
    variant?: Variant;
    className?: string;
  }) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded border px-1.5 py-0 text-xs font-medium leading-5",
          VARIANTS[variant],
          className,
        )}
      >
        {children}
      </span>
    );
  }
  ```

- [ ] **Create `src/components/ui/ScrollColumn.tsx`** (complete file — replaces Halon's `ScrollArea`):
  ```tsx
  import type { ReactNode } from "react";
  import { cn } from "@/lib/utils";

  export function ScrollColumn({ children, className }: { children: ReactNode; className?: string }) {
    return (
      <div className={cn("overflow-y-auto", className)}>
        {children}
      </div>
    );
  }
  ```

- [ ] **Write failing test** `src/components/ui/Badge.test.tsx`:
  ```tsx
  import { render, screen } from "@testing-library/react";
  import { describe, it, expect } from "vitest";
  import { Badge } from "./Badge";

  describe("Badge", () => {
    it("renders children and applies the outline variant class", () => {
      render(<Badge variant="outline">manual</Badge>);
      const el = screen.getByText("manual");
      expect(el).toBeInTheDocument();
      expect(el.className).toContain("border-zinc-700");
    });
  });
  ```

- [ ] **Run, expect FAIL** first (before `Badge.tsx` exists). Cmd: `pnpm --filter polymath-dashboard test`. Expected: `Failed to resolve import "./Badge"`.

- [ ] **Run, expect PASS** once files saved. Cmd: `pnpm --filter polymath-dashboard test`. Expected: Badge suite green; smoke test still green.

- [ ] **Commit.** `git -C D:\VFXellence-LTD add .canon/.mission-control/client && git -C D:\VFXellence-LTD commit -m "Add MC client domain types and board primitives

- Add src/lib/engine.ts mirroring Plan-1 camelCase Task/Campaign/Approval/AgentRun
- Add board.types.ts (5 columns no Triage, priority tint + status accent maps)
- Add inline-zinc Badge and ScrollColumn ui primitives
- Test Badge renders children and variant class"`

---

## Task 3 — TaskCard + BoardColumn + useTasks hook

**Model/effort:** sonnet, medium. **Worktree: yes** (branch `plan2/task3-card-column`).

**Files:**
- Create: `src/hooks/useTasks.ts`, `src/features/board/TaskCard.tsx`, `src/features/board/BoardColumn.tsx`
- Test: `src/features/board/TaskCard.test.tsx`

Steps:

- [ ] **Create `src/hooks/useTasks.ts`** (complete file — mirrors `useTools.ts` pattern):
  ```ts
  import { useCallback, useEffect, useState } from "react";
  import { api } from "@/lib/api";
  import type { Task, TaskStatus } from "@/lib/engine";

  export function useTasks(ecosystem: string = "all") {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(() => {
      api
        .get<Task[]>(`/tasks?ecosystem=${encodeURIComponent(ecosystem)}`)
        .then((t) => {
          setTasks(t);
          setError(null);
        })
        .catch((e: Error) => setError(e.message));
    }, [ecosystem]);

    useEffect(() => {
      reload();
    }, [reload]);

    const move = useCallback(
      async (id: string, status: TaskStatus) => {
        // optimistic
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
        try {
          const updated = await api.patch<Task>(`/tasks/${id}/status`, { status });
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        } catch (e) {
          setError((e as Error).message); // e.g. 409: can't complete with pending approval
          reload(); // resync truth
        }
      },
      [reload],
    );

    return { tasks, error, reload, move };
  }
  ```

- [ ] **Create `src/features/board/TaskCard.tsx`** (complete file — Polymath inline-zinc rendering of Halon's KanbanCard):
  ```tsx
  import type { Task, TaskStatus } from "@/lib/engine";
  import { cn } from "@/lib/utils";
  import { Badge } from "@/components/ui/Badge";
  import { PRIORITY_BORDER, PRIORITY_BG, STATUS_ACCENT, TRANSITION_OPTIONS } from "./board.types";

  export function TaskCard({
    task,
    onMove,
  }: {
    task: Task;
    onMove?: (id: string, status: TaskStatus) => void;
  }) {
    const accent = STATUS_ACCENT[task.status] ?? "#6b7280";
    return (
      <div
        style={{ borderTopColor: accent }}
        className={cn(
          "group relative rounded-md border border-zinc-800 border-t-2 border-l-4 p-3 select-none transition-colors hover:bg-zinc-800/60",
          PRIORITY_BG[task.priority] ?? "bg-zinc-900",
          PRIORITY_BORDER[task.priority] ?? "border-l-zinc-600",
        )}
      >
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="truncate font-mono text-xs text-zinc-500">{task.id}</span>
          {task.claudeSessionId && (
            <span
              className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-emerald-500"
              title="Active session"
            />
          )}
          <div className="flex-1" />
          <Badge variant="outline">{task.ecosystemId}</Badge>
        </div>
        <p className="line-clamp-3 text-sm leading-snug text-zinc-200">{task.title}</p>
        <p className="mt-1.5 text-xs italic text-zinc-500">{task.owner ?? "Unassigned"}</p>
        {onMove && (
          <div className="mt-2 flex justify-end">
            <select
              aria-label={`Move ${task.id}`}
              value={task.status}
              onChange={(e) => onMove(task.id, e.target.value as TaskStatus)}
              className="cursor-pointer appearance-none rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300 transition-colors hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              style={{ color: accent }}
            >
              {TRANSITION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-zinc-900 text-zinc-200">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Note `claudeSessionId`** is not on the `Task` interface in `engine.ts` — add `claudeSessionId?: string;` to `Task` in `src/lib/engine.ts` (the schema has the column; Plan-1's service does not currently map it, so it will be `undefined`, which is fine — the pulse just never shows until Plan 1/3 maps it). This keeps the type honest.

- [ ] **Create `src/features/board/BoardColumn.tsx`** (complete file):
  ```tsx
  import type { Task, TaskStatus } from "@/lib/engine";
  import { Badge } from "@/components/ui/Badge";
  import { ScrollColumn } from "@/components/ui/ScrollColumn";
  import { STATUS_ACCENT } from "./board.types";
  import type { BoardColumn as Col } from "./board.types";
  import { TaskCard } from "./TaskCard";

  export function BoardColumn({
    column,
    tasks,
    onMove,
  }: {
    column: Col;
    tasks: Task[];
    onMove?: (id: string, status: TaskStatus) => void;
  }) {
    return (
      <div className="flex min-w-[220px] max-w-[320px] flex-1 flex-shrink-0 flex-col">
        <div className="flex items-center gap-2 px-2 pb-2">
          <h3 className="text-sm font-medium" style={{ color: STATUS_ACCENT[column.id] }}>
            {column.label}
          </h3>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>
        <div className="min-h-[60px] flex-1 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/40">
          <ScrollColumn className="max-h-[calc(100vh-180px)]">
            <div className="flex flex-col gap-2 p-2">
              {tasks.map((t) => (
                <TaskCard key={t.id} task={t} onMove={onMove} />
              ))}
              {tasks.length === 0 && (
                <p className="select-none py-8 text-center text-xs text-zinc-600">No tasks</p>
              )}
            </div>
          </ScrollColumn>
        </div>
      </div>
    );
  }
  ```

- [ ] **Write failing test** `src/features/board/TaskCard.test.tsx`:
  ```tsx
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { describe, it, expect, vi } from "vitest";
  import { TaskCard } from "./TaskCard";
  import type { Task } from "@/lib/engine";

  const base: Task = {
    id: "t_1", title: "Render Surge clip draft", type: "content",
    ecosystemId: "viral", source: "agent", status: "todo", priority: "high",
    autonomyStage: 0, createdAt: "2026-06-14T00:00:00Z", updatedAt: "2026-06-14T00:00:00Z",
  };

  describe("TaskCard", () => {
    it("shows title, id, ecosystem and a high-priority left border", () => {
      const { container } = render(<TaskCard task={base} />);
      expect(screen.getByText("Render Surge clip draft")).toBeInTheDocument();
      expect(screen.getByText("t_1")).toBeInTheDocument();
      expect(screen.getByText("viral")).toBeInTheDocument();
      expect(container.querySelector(".border-l-orange-500")).not.toBeNull();
    });

    it("calls onMove with the chosen status", async () => {
      const onMove = vi.fn();
      render(<TaskCard task={base} onMove={onMove} />);
      await userEvent.selectOptions(screen.getByLabelText("Move t_1"), "in-review");
      expect(onMove).toHaveBeenCalledWith("t_1", "in-review");
    });
  });
  ```

- [ ] **Run, expect FAIL.** Cmd: `pnpm --filter polymath-dashboard test src/features/board/TaskCard.test.tsx`. Expected: import-resolve failure (TaskCard absent) → then after creating files, green.

- [ ] **Run, expect PASS.** Cmd: `pnpm --filter polymath-dashboard test`. Expected: all suites green.

- [ ] **Commit.** `git -C D:\VFXellence-LTD add .canon/.mission-control/client && git -C D:\VFXellence-LTD commit -m "Add board TaskCard, BoardColumn and useTasks hook

- Add useTasks hook (GET /api/tasks, optimistic PATCH /:id/status, 409 resync)
- Add priority-tinted TaskCard with per-card status select
- Add BoardColumn with count badge and empty state
- Add claudeSessionId to Task type; test card render + onMove"`

---

## Task 4 — Board assembly + scope selector + BoardPage

**Model/effort:** sonnet, medium. **Worktree: yes** (branch `plan2/task4-board`).

**Files:**
- Create: `src/features/board/Board.tsx`, `src/pages/BoardPage.tsx`
- Test: `src/features/board/Board.test.tsx`

Steps:

- [ ] **Create `src/features/board/Board.tsx`** (complete file — mirrors Halon `KanbanBoard` grouping/structure, inline-zinc styling, with the ecosystem scope selector):
  ```tsx
  import { useMemo, useState } from "react";
  import { RefreshCw } from "lucide-react";
  import type { Task, TaskStatus } from "@/lib/engine";
  import { BOARD_COLUMNS } from "./board.types";
  import { BoardColumn } from "./BoardColumn";

  const SCOPES: { id: string; label: string }[] = [
    { id: "all", label: "All ecosystems" },
    { id: "content", label: "Content (Signal)" },
    { id: "viral", label: "Viral (Surge)" },
    { id: "products", label: "Products (Atelier)" },
    { id: "affiliate", label: "Affiliate (Conduit)" },
    { id: "apps", label: "Apps (Forge)" },
  ];

  export function Board({
    tasks,
    scope,
    onScopeChange,
    onMove,
    onRefresh,
    error,
  }: {
    tasks: Task[];
    scope: string;
    onScopeChange: (s: string) => void;
    onMove?: (id: string, status: TaskStatus) => void;
    onRefresh?: () => void;
    error?: string | null;
  }) {
    const [query, setQuery] = useState("");

    const byStatus = useMemo(() => {
      const q = query.trim().toLowerCase();
      const filtered = q
        ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
        : tasks;
      const map: Record<TaskStatus, Task[]> = {
        backlog: [], todo: [], "in-progress": [], blocked: [], "in-review": [], done: [],
      };
      for (const t of filtered) (map[t.status] ??= []).push(t);
      return map;
    }, [tasks, query]);

    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-4 pt-4">
          <select
            aria-label="Ecosystem scope"
            value={scope}
            onChange={(e) => onScopeChange(e.target.value)}
            className="cursor-pointer rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-300 hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {SCOPES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter tasks…"
            className="w-48 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <div className="flex-1" />
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          )}
        </div>
        {error && <p className="px-4 pt-2 text-xs text-red-400">{error}</p>}
        <div className="flex flex-1 gap-4 overflow-x-auto px-4 py-3">
          {BOARD_COLUMNS.map((col) => (
            <BoardColumn key={col.id} column={col} tasks={byStatus[col.id]} onMove={onMove} />
          ))}
        </div>
      </div>
    );
  }
  ```

- [ ] **Create `src/pages/BoardPage.tsx`** (complete file — wires `useTasks`, owns scope state, 5 s poll):
  ```tsx
  import { useEffect, useState } from "react";
  import { useTasks } from "@/hooks/useTasks";
  import { Board } from "@/features/board/Board";

  export function BoardPage() {
    const [scope, setScope] = useState("all");
    const { tasks, error, reload, move } = useTasks(scope);

    useEffect(() => {
      const id = setInterval(reload, 5000);
      return () => clearInterval(id);
    }, [reload]);

    return (
      <div className="-mx-6 -my-8 h-[calc(100vh-0px)]">
        <div className="px-2 pt-4">
          <h1 className="px-4 text-2xl font-bold text-zinc-100">Board</h1>
        </div>
        <Board
          tasks={tasks}
          scope={scope}
          onScopeChange={setScope}
          onMove={move}
          onRefresh={reload}
          error={error}
        />
      </div>
    );
  }
  ```

- [ ] **Write failing test** `src/features/board/Board.test.tsx` (pure render; no network — pass tasks as props):
  ```tsx
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { describe, it, expect, vi } from "vitest";
  import { Board } from "./Board";
  import type { Task } from "@/lib/engine";

  const mk = (id: string, status: Task["status"], title: string): Task => ({
    id, title, type: "content", ecosystemId: "viral", source: "agent",
    status, priority: "medium", autonomyStage: 0,
    createdAt: "2026-06-14T00:00:00Z", updatedAt: "2026-06-14T00:00:00Z",
  });

  describe("Board", () => {
    const tasks = [mk("t1", "todo", "Alpha"), mk("t2", "in-review", "Bravo"), mk("t3", "done", "Charlie")];

    it("renders the five columns and groups cards by status (no Triage column)", () => {
      render(<Board tasks={tasks} scope="all" onScopeChange={() => {}} />);
      for (const label of ["Backlog", "To Do", "In Progress", "In Review", "Done"]) {
        expect(screen.getByText(label)).toBeInTheDocument();
      }
      expect(screen.queryByText("Triage")).toBeNull();
      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    it("fires onScopeChange when the scope selector changes", async () => {
      const onScopeChange = vi.fn();
      render(<Board tasks={tasks} scope="all" onScopeChange={onScopeChange} />);
      await userEvent.selectOptions(screen.getByLabelText("Ecosystem scope"), "viral");
      expect(onScopeChange).toHaveBeenCalledWith("viral");
    });
  });
  ```

- [ ] **Run, expect FAIL** then PASS. Cmds: `pnpm --filter polymath-dashboard test src/features/board/Board.test.tsx` (FAIL: Board missing) → save files → `pnpm --filter polymath-dashboard test` (PASS, all green).

- [ ] **Commit.** `git -C D:\VFXellence-LTD add .canon/.mission-control/client && git -C D:\VFXellence-LTD commit -m "Add Board with ecosystem scope selector and BoardPage

- Add Board: groups tasks into 5 status columns (no Triage), scope + text filter
- Add BoardPage wiring useTasks(scope) with 5s polling refresh
- Test 5-column grouping, no Triage column, scope-change callback"`

---

## Task 5 — ► APPROVAL QUEUE ◄ (doctrine-critical human gate)

**Model/effort:** opus, high (the governance gate — correctness of the approve→task-done follow-up and defensive `contentJson` rendering matters most here). **Worktree: yes** (branch `plan2/task5-approvals`).

**Files:**
- Create: `src/hooks/useApprovals.ts`, `src/features/approvals/ContentPreview.tsx`, `src/features/approvals/ApprovalCard.tsx`, `src/features/approvals/ApprovalQueue.tsx`, `src/pages/ApprovalsPage.tsx`
- Test: `src/features/approvals/ContentPreview.test.tsx`, `src/features/approvals/ApprovalCard.test.tsx`, `src/features/approvals/ApprovalQueue.test.tsx`

Steps:

- [ ] **Create `src/hooks/useApprovals.ts`** (complete file — lists pending, and `decide()` performs BOTH the approval PATCH and the follow-up task transition that the server does NOT do for us):
  ```ts
  import { useCallback, useEffect, useState } from "react";
  import { api } from "@/lib/api";
  import type { Approval, ApprovalStatus, Task } from "@/lib/engine";

  const REVIEWER = "Robin Dutta";

  export function useApprovals(ecosystem: string = "all") {
    const [approvals, setApprovals] = useState<Approval[]>([]);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(() => {
      const eco = ecosystem === "all" ? "" : `&ecosystem=${encodeURIComponent(ecosystem)}`;
      api
        .get<Approval[]>(`/approvals?status=pending${eco}`)
        .then((a) => { setApprovals(a); setError(null); })
        .catch((e: Error) => setError(e.message));
    }, [ecosystem]);

    useEffect(() => { reload(); }, [reload]);

    const decide = useCallback(
      async (id: string, decision: ApprovalStatus, reviewNotes?: string) => {
        try {
          const updated = await api.patch<Approval>(`/approvals/${id}/status`, {
            status: decision,
            reviewedBy: REVIEWER,
            reviewNotes,
          });
          // Server gate: it does NOT move the task. We do.
          // approved -> task done ; rejected/changes-requested -> task back in-progress.
          if (updated.taskId) {
            const next = decision === "approved" ? "done" : "in-progress";
            await api.patch<Task>(`/tasks/${updated.taskId}/status`, { status: next }).catch(() => {});
          }
          setApprovals((prev) => prev.filter((a) => a.id !== id));
        } catch (e) {
          setError((e as Error).message); // e.g. 409 terminal
          reload();
        }
      },
      [reload],
    );

    return { approvals, error, reload, decide };
  }
  ```

- [ ] **Create `src/features/approvals/ContentPreview.tsx`** (complete file — renders every `contentJson` field that exists; tolerates string OR array for shotlist/hashtags; renders `safeguardReport` as string or JSON):
  ```tsx
  import type { ApprovalContent } from "@/lib/engine";

  function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</h4>
        <div className="text-sm text-zinc-300">{children}</div>
      </div>
    );
  }

  function asList(v: string[] | string | undefined): string[] {
    if (!v) return [];
    return Array.isArray(v) ? v : v.split("\n").map((s) => s.trim()).filter(Boolean);
  }

  export function ContentPreview({ content }: { content?: ApprovalContent }) {
    if (!content) return <p className="text-sm italic text-zinc-600">No content payload.</p>;
    const shots = asList(content.shotlist);
    const tags = asList(content.hashtags);
    const safeguard =
      typeof content.safeguardReport === "string"
        ? content.safeguardReport
        : content.safeguardReport
          ? JSON.stringify(content.safeguardReport, null, 2)
          : undefined;

    return (
      <div className="space-y-3">
        {content.hook && <Section label="Hook"><p className="font-medium">{content.hook}</p></Section>}
        {content.script && (
          <Section label="Script">
            <pre className="whitespace-pre-wrap rounded bg-zinc-950 p-2 text-xs leading-relaxed text-zinc-300">{content.script}</pre>
          </Section>
        )}
        {shots.length > 0 && (
          <Section label="Shotlist">
            <ol className="list-decimal space-y-0.5 pl-5">{shots.map((s, i) => <li key={i}>{s}</li>)}</ol>
          </Section>
        )}
        {content.caption && <Section label="Caption"><p>{content.caption}</p></Section>}
        {tags.length > 0 && (
          <Section label="Hashtags">
            <div className="flex flex-wrap gap-1">{tags.map((t, i) => <span key={i} className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-emerald-300">{t.startsWith("#") ? t : `#${t}`}</span>)}</div>
          </Section>
        )}
        {safeguard && (
          <Section label="Safeguard Report">
            <pre className="whitespace-pre-wrap rounded border border-yellow-700/40 bg-yellow-950/20 p-2 text-xs text-yellow-100">{safeguard}</pre>
          </Section>
        )}
      </div>
    );
  }
  ```

- [ ] **Create `src/features/approvals/ApprovalCard.tsx`** (complete file — preview + artifact path + 3 decision buttons; Request-changes/Reject open an inline notes field):
  ```tsx
  import { useState } from "react";
  import { Check, X, MessageSquare } from "lucide-react";
  import type { Approval, ApprovalStatus } from "@/lib/engine";
  import { Badge } from "@/components/ui/Badge";
  import { ContentPreview } from "./ContentPreview";

  export function ApprovalCard({
    approval,
    onDecide,
  }: {
    approval: Approval;
    onDecide: (id: string, decision: ApprovalStatus, notes?: string) => void;
  }) {
    const [notes, setNotes] = useState("");
    const [busy, setBusy] = useState(false);

    const decide = async (d: ApprovalStatus) => {
      setBusy(true);
      try {
        await onDecide(approval.id, d, notes.trim() || undefined);
      } finally {
        setBusy(false);
      }
    };

    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="default">{approval.ecosystemId}</Badge>
          {approval.contentType && <Badge variant="outline">{approval.contentType}</Badge>}
          <span className="font-mono text-xs text-zinc-600">{approval.id}</span>
          <div className="flex-1" />
          {approval.taskId && <span className="font-mono text-xs text-zinc-600">task {approval.taskId}</span>}
        </div>

        {approval.previewUrl && (
          <a href={approval.previewUrl} target="_blank" rel="noopener noreferrer" className="mb-3 block">
            <img src={approval.previewUrl} alt="preview" className="max-h-48 rounded border border-zinc-800" />
          </a>
        )}
        {approval.artifactPath && (
          <p className="mb-3 break-all font-mono text-xs text-zinc-500">{approval.artifactPath}</p>
        )}

        <ContentPreview content={approval.contentJson} />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Review notes (required for reject / request-changes)…"
          rows={2}
          className="mt-3 w-full resize-y rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
        />

        <div className="mt-3 flex gap-2">
          <button
            disabled={busy}
            onClick={() => decide("approved")}
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            <Check className="h-4 w-4" /> Approve
          </button>
          <button
            disabled={busy || !notes.trim()}
            onClick={() => decide("changes-requested")}
            className="flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
            title={notes.trim() ? "" : "Add review notes first"}
          >
            <MessageSquare className="h-4 w-4" /> Request changes
          </button>
          <button
            disabled={busy || !notes.trim()}
            onClick={() => decide("rejected")}
            className="flex items-center gap-1.5 rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            title={notes.trim() ? "" : "Add review notes first"}
          >
            <X className="h-4 w-4" /> Reject
          </button>
        </div>
      </div>
    );
  }
  ```

- [ ] **Create `src/features/approvals/ApprovalQueue.tsx`** (complete file — presentational list; takes data + decide from page):
  ```tsx
  import type { Approval, ApprovalStatus } from "@/lib/engine";
  import { ApprovalCard } from "./ApprovalCard";

  export function ApprovalQueue({
    approvals,
    onDecide,
    error,
  }: {
    approvals: Approval[];
    onDecide: (id: string, decision: ApprovalStatus, notes?: string) => void;
    error?: string | null;
  }) {
    return (
      <div className="space-y-4">
        {error && <p className="text-sm text-red-400">{error}</p>}
        {approvals.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-800 py-12 text-center text-sm text-zinc-600">
            No pending approvals. The queue is clear.
          </p>
        ) : (
          approvals.map((a) => <ApprovalCard key={a.id} approval={a} onDecide={onDecide} />)
        )}
      </div>
    );
  }
  ```

- [ ] **Create `src/pages/ApprovalsPage.tsx`** (complete file — scope state + 4 s poll, header marker `► APPROVAL QUEUE ◄`):
  ```tsx
  import { useEffect, useState } from "react";
  import { ShieldCheck } from "lucide-react";
  import { useApprovals } from "@/hooks/useApprovals";
  import { ApprovalQueue } from "@/features/approvals/ApprovalQueue";

  export function ApprovalsPage() {
    const [scope, setScope] = useState("all");
    const { approvals, error, reload, decide } = useApprovals(scope);

    useEffect(() => {
      const id = setInterval(reload, 4000);
      return () => clearInterval(id);
    }, [reload]);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-bold text-zinc-100">► Approval Queue ◄</h1>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-sm text-zinc-400">{approvals.length}</span>
          </div>
          <select
            aria-label="Ecosystem scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="cursor-pointer rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-300 hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All ecosystems</option>
            <option value="content">Content</option>
            <option value="viral">Viral</option>
            <option value="products">Products</option>
            <option value="affiliate">Affiliate</option>
            <option value="apps">Apps</option>
          </select>
        </div>
        <p className="text-sm text-zinc-500">
          Every agent draft halts here. Nothing publishes. Approve to mark the task done; reject or request changes to send it back.
        </p>
        <ApprovalQueue approvals={approvals} onDecide={decide} error={error} />
      </div>
    );
  }
  ```

- [ ] **Write failing tests.** `ContentPreview.test.tsx` — renders hook/script/shotlist(array)/caption/hashtags/safeguard; tolerates a string shotlist; omits absent fields:
  ```tsx
  import { render, screen } from "@testing-library/react";
  import { describe, it, expect } from "vitest";
  import { ContentPreview } from "./ContentPreview";

  describe("ContentPreview", () => {
    it("renders every present field and skips absent ones", () => {
      render(<ContentPreview content={{
        hook: "POV: your render farm just paid your rent",
        script: "Scene 1...",
        shotlist: ["wide", "close"],
        caption: "link in bio",
        hashtags: ["vfx", "#ai"],
        safeguardReport: "PASS: no claims, no minors, disclosed AI",
      }} />);
      expect(screen.getByText(/render farm/)).toBeInTheDocument();
      expect(screen.getByText("wide")).toBeInTheDocument();
      expect(screen.getByText("#vfx")).toBeInTheDocument();   // normalises leading #
      expect(screen.getByText("#ai")).toBeInTheDocument();
      expect(screen.getByText(/PASS: no claims/)).toBeInTheDocument();
      expect(screen.queryByText("Hashtags")).toBeInTheDocument();
    });

    it("accepts a newline string shotlist and an object safeguard report", () => {
      render(<ContentPreview content={{ shotlist: "a\nb", safeguardReport: { verdict: "pass" } }} />);
      expect(screen.getByText("a")).toBeInTheDocument();
      expect(screen.getByText("b")).toBeInTheDocument();
      expect(screen.getByText(/"verdict": "pass"/)).toBeInTheDocument();
    });

    it("shows a fallback when no content", () => {
      render(<ContentPreview />);
      expect(screen.getByText("No content payload.")).toBeInTheDocument();
    });
  });
  ```
  `ApprovalCard.test.tsx` — approve fires immediately; reject/changes are disabled until notes typed, then fire with notes:
  ```tsx
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { describe, it, expect, vi } from "vitest";
  import { ApprovalCard } from "./ApprovalCard";
  import type { Approval } from "@/lib/engine";

  const ap: Approval = {
    id: "aq_1", taskId: "t_1", ecosystemId: "viral", contentType: "clip",
    status: "pending", createdAt: "2026-06-14T00:00:00Z",
    contentJson: { hook: "h", script: "s" },
  };

  describe("ApprovalCard", () => {
    it("approves without notes", async () => {
      const onDecide = vi.fn();
      render(<ApprovalCard approval={ap} onDecide={onDecide} />);
      await userEvent.click(screen.getByRole("button", { name: /approve/i }));
      expect(onDecide).toHaveBeenCalledWith("aq_1", "approved", undefined);
    });

    it("gates reject behind review notes", async () => {
      const onDecide = vi.fn();
      render(<ApprovalCard approval={ap} onDecide={onDecide} />);
      const reject = screen.getByRole("button", { name: /reject/i });
      expect(reject).toBeDisabled();
      await userEvent.type(screen.getByPlaceholderText(/Review notes/i), "off-brand");
      expect(reject).toBeEnabled();
      await userEvent.click(reject);
      expect(onDecide).toHaveBeenCalledWith("aq_1", "rejected", "off-brand");
    });
  });
  ```
  `ApprovalQueue.test.tsx` — empty state + lists cards:
  ```tsx
  import { render, screen } from "@testing-library/react";
  import { describe, it, expect } from "vitest";
  import { ApprovalQueue } from "./ApprovalQueue";

  describe("ApprovalQueue", () => {
    it("shows the clear-queue message when empty", () => {
      render(<ApprovalQueue approvals={[]} onDecide={() => {}} />);
      expect(screen.getByText(/queue is clear/i)).toBeInTheDocument();
    });
  });
  ```

- [ ] **Run, expect FAIL** (components absent). Cmd: `pnpm --filter polymath-dashboard test src/features/approvals`. Then create files.

- [ ] **Run, expect PASS.** Cmd: `pnpm --filter polymath-dashboard test`. Expected: all approvals suites + prior suites green.

- [ ] **Commit.** `git -C D:\VFXellence-LTD add .canon/.mission-control/client && git -C D:\VFXellence-LTD commit -m "Add Approval Queue: human gate over agent drafts

- Add useApprovals: PATCH /approvals/:id/status then follow-up task transition
  (approved -> task done, reject/changes -> task in-progress) since server won't
- Add ContentPreview rendering hook/script/shotlist/caption/hashtags/safeguard defensively
- Add ApprovalCard (artifact preview + decision buttons, notes-gated reject/changes)
- Add ApprovalQueue list + ApprovalsPage with 4s polling
- Test defensive content rendering, approve flow, notes-gated reject"`

---

## Task 6 — Campaign Control Panel + agent-run status + Run button (Plan-3 stub) + Agents placeholder

**Model/effort:** opus, high (cross-plan seam: the `Run` button calls the not-yet-existent Plan-3 endpoint and must degrade gracefully; campaign approve→run gate ordering). **Worktree: yes** (branch `plan2/task6-campaigns`).

**Files:**
- Create: `src/hooks/useCampaigns.ts`, `src/hooks/useAgentRuns.ts`, `src/features/campaigns/CampaignPanel.tsx`, `src/features/agents/AgentBoard.tsx`, `src/pages/CampaignsPage.tsx`, `src/pages/AgentsPage.tsx`
- Test: `src/features/campaigns/CampaignPanel.test.tsx`

Steps:

- [ ] **Create `src/hooks/useCampaigns.ts`** (complete file):
  ```ts
  import { useCallback, useEffect, useState } from "react";
  import { api } from "@/lib/api";
  import type { Campaign, CampaignStatus } from "@/lib/engine";

  const APPROVER = "Robin Dutta";

  export function useCampaigns(ecosystem: string = "all") {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(() => {
      api
        .get<Campaign[]>(`/campaigns?ecosystem=${encodeURIComponent(ecosystem)}`)
        .then((c) => { setCampaigns(c); setError(null); })
        .catch((e: Error) => setError(e.message));
    }, [ecosystem]);

    useEffect(() => { reload(); }, [reload]);

    const approve = useCallback(async (id: string) => {
      const c = await api.post<Campaign>(`/campaigns/${id}/approve`, { approvedBy: APPROVER });
      setCampaigns((prev) => prev.map((x) => (x.id === id ? c : x)));
      return c;
    }, []);

    const setStatus = useCallback(async (id: string, status: CampaignStatus) => {
      try {
        const c = await api.patch<Campaign>(`/campaigns/${id}/status`, { status });
        setCampaigns((prev) => prev.map((x) => (x.id === id ? c : x)));
      } catch (e) {
        setError((e as Error).message);
        reload();
      }
    }, [reload]);

    return { campaigns, error, reload, approve, setStatus };
  }
  ```

- [ ] **Create `src/hooks/useAgentRuns.ts`** (complete file — global poll, indexable by campaign):
  ```ts
  import { useCallback, useEffect, useState } from "react";
  import { api } from "@/lib/api";
  import type { AgentRun } from "@/lib/engine";

  export function useAgentRuns(pollMs = 5000) {
    const [runs, setRuns] = useState<AgentRun[]>([]);

    const reload = useCallback(() => {
      api.get<AgentRun[]>("/agent-runs").then(setRuns).catch(() => {});
    }, []);

    useEffect(() => {
      reload();
      const id = setInterval(reload, pollMs);
      return () => clearInterval(id);
    }, [reload, pollMs]);

    return { runs, reload };
  }
  ```

- [ ] **Create `src/features/campaigns/CampaignPanel.tsx`** (complete file — the Run button calls `POST /api/sessions/start` and handles 404 by surfacing a "Plan 3" banner; approve gate before run):
  ```tsx
  import { useState } from "react";
  import { Play, Check, AlertTriangle } from "lucide-react";
  import { api } from "@/lib/api";
  import type { Campaign, AgentRun } from "@/lib/engine";
  import { Badge } from "@/components/ui/Badge";

  const RUN_STATUS_COLOR: Record<string, string> = {
    queued: "text-zinc-400", running: "text-emerald-400", waiting: "text-amber-400",
    done: "text-zinc-500", error: "text-red-400", killed: "text-red-500",
  };

  export function CampaignPanel({
    campaigns,
    runs,
    onApprove,
    error,
  }: {
    campaigns: Campaign[];
    runs: AgentRun[];
    onApprove: (id: string) => Promise<Campaign>;
    error?: string | null;
  }) {
    const [notice, setNotice] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);

    const runFor = (cid: string) => runs.find((r) => r.campaignId === cid);

    const run = async (c: Campaign) => {
      setBusyId(c.id);
      setNotice(null);
      try {
        if (!c.approvedBy) {
          await onApprove(c.id); // gate: must be approved before running
        }
        // Plan-3 endpoint. Not live yet — expect 404 and degrade gracefully.
        await api.post<{ sessionId: string }>("/sessions/start", { campaignId: c.id });
        setNotice(`Session start requested for ${c.name}.`);
      } catch (e) {
        const msg = (e as Error).message;
        if (msg.includes("404") || msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("failed to fetch")) {
          setNotice("Session engine not yet available (lands in Plan 3). Campaign approved and ready.");
        } else {
          setNotice(msg);
        }
      } finally {
        setBusyId(null);
      }
    };

    return (
      <div className="space-y-4">
        {error && <p className="text-sm text-red-400">{error}</p>}
        {notice && (
          <div className="flex items-center gap-2 rounded border border-amber-700/40 bg-amber-950/20 px-3 py-2 text-sm text-amber-200">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {notice}
          </div>
        )}
        {campaigns.length === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-800 py-12 text-center text-sm text-zinc-600">
            No campaigns yet. Create one from Intake.
          </p>
        )}
        {campaigns.map((c) => {
          const r = runFor(c.id);
          return (
            <div key={c.id} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-zinc-100">{c.name}</p>
                  <Badge variant="outline">{c.ecosystemId}</Badge>
                  <Badge variant="secondary">{c.status}</Badge>
                  {c.approvedBy && <Badge variant="default"><Check className="mr-0.5 h-3 w-3" /> approved</Badge>}
                </div>
                <p className="mt-0.5 font-mono text-xs text-zinc-600">{c.id} · target {c.targetCount}</p>
                {r && (
                  <p className={`mt-1 text-xs ${RUN_STATUS_COLOR[r.status] ?? "text-zinc-400"}`}>
                    run: {r.status}{r.error ? ` — ${r.error}` : ""}
                  </p>
                )}
              </div>
              <button
                disabled={busyId === c.id || c.status === "running"}
                onClick={() => run(c)}
                className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                <Play className="h-4 w-4" /> {c.approvedBy ? "Run" : "Approve & Run"}
              </button>
            </div>
          );
        })}
      </div>
    );
  }
  ```

- [ ] **Create `src/features/agents/AgentBoard.tsx`** (complete file — Plan-3 placeholder; shows live runs read-only, terminal stubbed):
  ```tsx
  import { Terminal } from "lucide-react";
  import type { AgentRun } from "@/lib/engine";
  import { Badge } from "@/components/ui/Badge";

  export function AgentBoard({ runs }: { runs: AgentRun[] }) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-500">
          <Terminal className="h-4 w-4" />
          Live terminal streaming arrives in Plan 3. This is a read-only run list.
        </div>
        {runs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-800 py-12 text-center text-sm text-zinc-600">
            No agent runs yet.
          </p>
        ) : (
          runs.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
              <Badge variant="secondary">{r.status}</Badge>
              <span className="truncate text-sm text-zinc-300">{r.agentName ?? r.command ?? r.id}</span>
              <div className="flex-1" />
              {r.campaignId && <span className="font-mono text-xs text-zinc-600">{r.campaignId}</span>}
            </div>
          ))
        )}
      </div>
    );
  }
  ```

- [ ] **Create `src/pages/CampaignsPage.tsx`** (complete file):
  ```tsx
  import { useEffect, useState } from "react";
  import { useCampaigns } from "@/hooks/useCampaigns";
  import { useAgentRuns } from "@/hooks/useAgentRuns";
  import { CampaignPanel } from "@/features/campaigns/CampaignPanel";

  export function CampaignsPage() {
    const [scope, setScope] = useState("all");
    const { campaigns, error, reload, approve } = useCampaigns(scope);
    const { runs } = useAgentRuns();

    useEffect(() => {
      const id = setInterval(reload, 5000);
      return () => clearInterval(id);
    }, [reload]);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-100">Campaign Control</h1>
          <select
            aria-label="Ecosystem scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="cursor-pointer rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-300 hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All ecosystems</option>
            <option value="content">Content</option>
            <option value="viral">Viral</option>
            <option value="products">Products</option>
            <option value="affiliate">Affiliate</option>
            <option value="apps">Apps</option>
          </select>
        </div>
        <CampaignPanel campaigns={campaigns} runs={runs} onApprove={approve} error={error} />
      </div>
    );
  }
  ```

- [ ] **Create `src/pages/AgentsPage.tsx`** (complete file):
  ```tsx
  import { useAgentRuns } from "@/hooks/useAgentRuns";
  import { AgentBoard } from "@/features/agents/AgentBoard";

  export function AgentsPage() {
    const { runs } = useAgentRuns();
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-100">Agents &amp; Sessions</h1>
        <AgentBoard runs={runs} />
      </div>
    );
  }
  ```

- [ ] **Write failing test** `src/features/campaigns/CampaignPanel.test.tsx` (mock `@/lib/api` so the Run button's `POST /sessions/start` returns a 404-style error → expect the graceful banner):
  ```tsx
  import { render, screen, waitFor } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { describe, it, expect, vi } from "vitest";
  import { CampaignPanel } from "./CampaignPanel";
  import type { Campaign } from "@/lib/engine";

  vi.mock("@/lib/api", () => ({
    api: { post: vi.fn(() => Promise.reject(new Error("404 Not Found"))) },
  }));

  const c: Campaign = {
    id: "c_1", name: "Surge Tech Sprint", ecosystemId: "viral", status: "planned",
    autonomyStage: 0, targetCount: 5, approvedBy: "Robin Dutta",
    createdAt: "2026-06-14T00:00:00Z", updatedAt: "2026-06-14T00:00:00Z",
  };

  describe("CampaignPanel", () => {
    it("degrades gracefully when the Plan-3 session endpoint 404s", async () => {
      render(<CampaignPanel campaigns={[c]} runs={[]} onApprove={vi.fn(() => Promise.resolve(c))} />);
      await userEvent.click(screen.getByRole("button", { name: /run/i }));
      await waitFor(() =>
        expect(screen.getByText(/not yet available \(lands in Plan 3\)/i)).toBeInTheDocument(),
      );
    });

    it("shows the run status when an agent run exists for the campaign", () => {
      render(
        <CampaignPanel
          campaigns={[c]}
          runs={[{ id: "r1", campaignId: "c_1", status: "running" }]}
          onApprove={vi.fn(() => Promise.resolve(c))}
        />,
      );
      expect(screen.getByText(/run: running/)).toBeInTheDocument();
    });
  });
  ```

- [ ] **Run, expect FAIL** then PASS. Cmds: `pnpm --filter polymath-dashboard test src/features/campaigns/CampaignPanel.test.tsx` (FAIL: missing) → create files → `pnpm --filter polymath-dashboard test` (PASS, all green).

- [ ] **Commit.** `git -C D:\VFXellence-LTD add .canon/.mission-control/client && git -C D:\VFXellence-LTD commit -m "Add Campaign Control Panel, agent-run status and Plan-3 Run stub

- Add useCampaigns (list/approve/setStatus) and useAgentRuns (5s poll)
- Add CampaignPanel: approve-then-run gate, POST /sessions/start with graceful
  404 handling (Plan 3 not yet live), inline run-status from agent_runs
- Add AgentBoard read-only placeholder (full terminal = Plan 3) + pages
- Test 404 graceful degradation and run-status rendering"`

---

## Task 7 — INTAKE surface (campaign + child tasks, brand/ecosystem, infra task)

**Model/effort:** opus, high (composite multi-write flows: campaign + N child tasks atomically-ish, id generation, brand registration via setup, self-improvement infra task). **Worktree: yes** (branch `plan2/task7-intake`).

**Files:**
- Create: `src/features/intake/intake.api.ts`, `src/features/intake/IntakeForm.tsx`, `src/pages/IntakePage.tsx`
- Test: `src/features/intake/IntakeForm.test.tsx`

Steps:

- [ ] **Create `src/features/intake/intake.api.ts`** (complete file — three composite creators; ids are slug+timestamp so POST never 409s):
  ```ts
  import { api } from "@/lib/api";
  import type { Campaign, Task } from "@/lib/engine";

  const slug = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "item";
  const stamp = () => Date.now().toString(36);

  export interface NewCampaignInput {
    name: string;
    ecosystemId: string;
    verticalId?: string;
    targetCount: number;
    notes?: string;
  }

  /** Create a campaign, then one child task per target unit (status backlog). */
  export async function createCampaignWithTasks(input: NewCampaignInput): Promise<{ campaign: Campaign; tasks: Task[] }> {
    const id = `cmp_${slug(input.name)}_${stamp()}`;
    const campaign = await api.post<Campaign>("/campaigns", {
      id,
      name: input.name,
      ecosystemId: input.ecosystemId,
      verticalId: input.verticalId,
      targetCount: input.targetCount,
      notes: input.notes,
    });
    const tasks: Task[] = [];
    for (let i = 1; i <= input.targetCount; i++) {
      const t = await api.post<Task>("/tasks", {
        id: `tsk_${id}_${i}`,
        title: `${input.name} — unit ${i}`,
        type: "content",
        ecosystemId: input.ecosystemId,
        verticalId: input.verticalId,
        campaignId: id,
        contentType: "clip",
        priority: "medium",
        source: "intake",
      });
      tasks.push(t);
    }
    return { campaign, tasks };
  }

  export interface NewBrandInput {
    name: string;
    ecosystemId: string;
    email: string;
  }

  /** Register a brand/ecosystem. Persists via the setup record store (POST /api/setup). */
  export async function registerBrand(input: NewBrandInput): Promise<void> {
    await api.post<unknown>("/setup", {
      id: `brand_${slug(input.name)}_${stamp()}`,
      kind: "brand",
      ecosystemId: input.ecosystemId,
      name: input.name,
      email: input.email,
    });
  }

  /** File a self-improvement infra task against the apps ecosystem. */
  export async function fileInfraTask(title: string, description: string): Promise<Task> {
    return api.post<Task>("/tasks", {
      id: `tsk_infra_${slug(title)}_${stamp()}`,
      title: `[MC] ${title}`,
      description,
      type: "infra",
      ecosystemId: "apps",
      priority: "medium",
      source: "intake",
    });
  }
  ```

  > **Seam check for the implementer:** confirm against Plan 1's `setup.ts` route what `POST /api/setup` accepts. If the live route is keyed differently (e.g. progress-only), fall back to the vault write `saveToVault('brand-<slug>.md', …)` already used by `LaunchPage`. The brand-registration write is the one place this plan touches a less-pinned endpoint — verify before implementing, do NOT guess the body silently.

- [ ] **Create `src/features/intake/IntakeForm.tsx`** (complete file — three tabs: Campaign / Brand / Improve MC; controlled fields; success + error states):
  ```tsx
  import { useState } from "react";
  import { cn } from "@/lib/utils";
  import { createCampaignWithTasks, registerBrand, fileInfraTask } from "./intake.api";

  type Tab = "campaign" | "brand" | "infra";
  const ECO = ["content", "viral", "products", "affiliate", "apps"];

  export function IntakeForm() {
    const [tab, setTab] = useState<Tab>("campaign");
    const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
    const [busy, setBusy] = useState(false);

    // campaign fields
    const [cName, setCName] = useState("");
    const [cEco, setCEco] = useState("viral");
    const [cVert, setCVert] = useState("");
    const [cTarget, setCTarget] = useState(3);
    // brand fields
    const [bName, setBName] = useState("");
    const [bEco, setBEco] = useState("viral");
    const [bEmail, setBEmail] = useState("");
    // infra fields
    const [iTitle, setITitle] = useState("");
    const [iDesc, setIDesc] = useState("");

    const wrap = async (fn: () => Promise<void>, ok: string) => {
      setBusy(true);
      setMsg(null);
      try {
        await fn();
        setMsg({ kind: "ok", text: ok });
      } catch (e) {
        setMsg({ kind: "err", text: (e as Error).message });
      } finally {
        setBusy(false);
      }
    };

    const submitCampaign = () =>
      wrap(async () => {
        const { tasks } = await createCampaignWithTasks({
          name: cName, ecosystemId: cEco, verticalId: cVert || undefined, targetCount: cTarget,
        });
        setCName(""); setCVert("");
        setMsg(null);
        return void tasks;
      }, `Campaign created with ${cTarget} task(s).`);

    const submitBrand = () =>
      wrap(async () => {
        await registerBrand({ name: bName, ecosystemId: bEco, email: bEmail });
        setBName(""); setBEmail("");
      }, "Brand registered.");

    const submitInfra = () =>
      wrap(async () => {
        await fileInfraTask(iTitle, iDesc);
        setITitle(""); setIDesc("");
      }, "Infra task filed against Apps.");

    const input = "w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500";
    const label = "mb-1 block text-xs text-zinc-500";
    const tabBtn = (t: Tab, txt: string) => (
      <button
        key={t}
        onClick={() => { setTab(t); setMsg(null); }}
        className={cn(
          "rounded px-4 py-1.5 text-sm font-medium transition-colors",
          tab === t ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300",
        )}
      >
        {txt}
      </button>
    );

    return (
      <div className="space-y-5">
        <div className="flex w-fit gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          {tabBtn("campaign", "New Campaign")}
          {tabBtn("brand", "Register Brand")}
          {tabBtn("infra", "Improve Mission Control")}
        </div>

        {msg && (
          <p className={cn("text-sm", msg.kind === "ok" ? "text-emerald-400" : "text-red-400")}>{msg.text}</p>
        )}

        {tab === "campaign" && (
          <div className="max-w-lg space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div><label className={label}>Campaign name</label><input className={input} value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Surge Tech Sprint" /></div>
            <div className="flex gap-3">
              <div className="flex-1"><label className={label}>Ecosystem</label>
                <select className={input} value={cEco} onChange={(e) => setCEco(e.target.value)}>{ECO.map((x) => <option key={x} value={x}>{x}</option>)}</select>
              </div>
              <div className="flex-1"><label className={label}>Vertical (optional)</label><input className={input} value={cVert} onChange={(e) => setCVert(e.target.value)} placeholder="tech" /></div>
              <div className="w-28"><label className={label}>Targets</label><input type="number" min={1} max={50} className={input} value={cTarget} onChange={(e) => setCTarget(Math.max(1, Number(e.target.value) || 1))} /></div>
            </div>
            <button disabled={busy || !cName.trim()} onClick={submitCampaign} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">Create campaign + tasks</button>
          </div>
        )}

        {tab === "brand" && (
          <div className="max-w-lg space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div><label className={label}>Brand name</label><input className={input} value={bName} onChange={(e) => setBName(e.target.value)} placeholder="Anon brand" /></div>
            <div className="flex gap-3">
              <div className="flex-1"><label className={label}>Ecosystem</label>
                <select className={input} value={bEco} onChange={(e) => setBEco(e.target.value)}>{ECO.map((x) => <option key={x} value={x}>{x}</option>)}</select>
              </div>
              <div className="flex-1"><label className={label}>Email</label><input className={input} value={bEmail} onChange={(e) => setBEmail(e.target.value)} placeholder="brand@example.com" /></div>
            </div>
            <button disabled={busy || !bName.trim()} onClick={submitBrand} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">Register brand</button>
          </div>
        )}

        {tab === "infra" && (
          <div className="max-w-lg space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div><label className={label}>What should Mission Control do better?</label><input className={input} value={iTitle} onChange={(e) => setITitle(e.target.value)} placeholder="Add bulk-approve to the queue" /></div>
            <div><label className={label}>Detail</label><textarea rows={3} className={cn(input, "resize-y")} value={iDesc} onChange={(e) => setIDesc(e.target.value)} placeholder="Why and rough shape…" /></div>
            <button disabled={busy || !iTitle.trim()} onClick={submitInfra} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">File infra task</button>
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Create `src/pages/IntakePage.tsx`** (complete file):
  ```tsx
  import { Inbox } from "lucide-react";
  import { IntakeForm } from "@/features/intake/IntakeForm";

  export function IntakePage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-emerald-400" />
          <h1 className="text-2xl font-bold text-zinc-100">Intake</h1>
        </div>
        <p className="text-sm text-zinc-500">Spin up a campaign with its tasks, register a brand, or file an improvement to Mission Control itself.</p>
        <IntakeForm />
      </div>
    );
  }
  ```

- [ ] **Write failing test** `src/features/intake/IntakeForm.test.tsx` (mock `./intake.api`; assert tab switch + campaign submit calls `createCampaignWithTasks` with the typed values and shows success):
  ```tsx
  import { render, screen, waitFor } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { describe, it, expect, vi } from "vitest";
  import { IntakeForm } from "./IntakeForm";

  const createCampaignWithTasks = vi.fn(() => Promise.resolve({ campaign: {}, tasks: [{}, {}, {}] }));
  const fileInfraTask = vi.fn(() => Promise.resolve({}));
  vi.mock("./intake.api", () => ({
    createCampaignWithTasks: (...a: unknown[]) => createCampaignWithTasks(...a),
    registerBrand: vi.fn(() => Promise.resolve()),
    fileInfraTask: (...a: unknown[]) => fileInfraTask(...a),
  }));

  describe("IntakeForm", () => {
    it("creates a campaign with the entered name, ecosystem and target count", async () => {
      render(<IntakeForm />);
      await userEvent.type(screen.getByPlaceholderText("Surge Tech Sprint"), "Surge Tech Sprint");
      await userEvent.click(screen.getByRole("button", { name: /create campaign/i }));
      await waitFor(() =>
        expect(createCampaignWithTasks).toHaveBeenCalledWith(
          expect.objectContaining({ name: "Surge Tech Sprint", ecosystemId: "viral", targetCount: 3 }),
        ),
      );
      expect(screen.getByText(/Campaign created with 3 task/i)).toBeInTheDocument();
    });

    it("files an infra task from the Improve Mission Control tab", async () => {
      render(<IntakeForm />);
      await userEvent.click(screen.getByRole("button", { name: /improve mission control/i }));
      await userEvent.type(screen.getByPlaceholderText(/Add bulk-approve/i), "Add bulk approve");
      await userEvent.click(screen.getByRole("button", { name: /file infra task/i }));
      await waitFor(() => expect(fileInfraTask).toHaveBeenCalled());
      expect(screen.getByText(/Infra task filed against Apps/i)).toBeInTheDocument();
    });
  });
  ```

- [ ] **Run, expect FAIL** then PASS. Cmds: `pnpm --filter polymath-dashboard test src/features/intake/IntakeForm.test.tsx` (FAIL: missing) → create files → `pnpm --filter polymath-dashboard test` (PASS).

- [ ] **Commit.** `git -C D:\VFXellence-LTD add .canon/.mission-control/client && git -C D:\VFXellence-LTD commit -m "Add Intake surface: campaign+tasks, brand register, infra task

- Add intake.api composite creators (campaign + N child tasks, brand, infra)
- Add IntakeForm with Campaign/Brand/Improve-MC tabs and success/error states
- Add IntakePage; file 'improve MC' tasks against the apps ecosystem
- Test campaign create call shape and infra-task filing"`

---

## Task 8 — Routes + nav wiring (keep existing pages working) + routing smoke test

**Model/effort:** sonnet, medium. **Worktree: yes** (branch `plan2/task8-routes`).

**Files:**
- Modify: `src/App.tsx`, `src/components/Sidebar.tsx`
- Test: `src/App.routes.test.tsx`

Steps:

- [ ] **Edit `src/App.tsx`** — add five routes, keep all existing. New imports + routes:
  ```tsx
  import { BoardPage } from "@/pages/BoardPage";
  import { IntakePage } from "@/pages/IntakePage";
  import { ApprovalsPage } from "@/pages/ApprovalsPage";
  import { CampaignsPage } from "@/pages/CampaignsPage";
  import { AgentsPage } from "@/pages/AgentsPage";
  ```
  Add inside `<Routes>` (before the existing finance routes is fine):
  ```tsx
  <Route path="/board" element={<BoardPage />} />
  <Route path="/intake" element={<IntakePage />} />
  <Route path="/approvals" element={<ApprovalsPage />} />
  <Route path="/campaigns" element={<CampaignsPage />} />
  <Route path="/agents" element={<AgentsPage />} />
  ```
  Do NOT remove `/`, `/setup/:ecosystem`, `/launch/:ecosystem/:vertical`, `/earnings`, `/transactions`, `/tax`, `/tools`, `/entity`.

- [ ] **Edit `src/components/Sidebar.tsx`** — add nav entries above the finance group. New icons in the import: `KanbanSquare, Inbox, ShieldCheck, Megaphone, Terminal`. Prepend to `NAV_ITEMS`:
  ```tsx
  { to: "/board", label: "Board", icon: KanbanSquare, end: false },
  { to: "/intake", label: "Intake", icon: Inbox, end: false },
  { to: "/approvals", label: "Approvals", icon: ShieldCheck, end: false },
  { to: "/campaigns", label: "Campaigns", icon: Megaphone, end: false },
  { to: "/agents", label: "Agents", icon: Terminal, end: false },
  ```
  (Keep `{ to: "/", label: "Dashboard", … end: true }` first.)

- [ ] **Write failing test** `src/App.routes.test.tsx` (uses `MemoryRouter` to mount specific routes; mocks `@/lib/api` so pages don't hit the network on mount):
  ```tsx
  import { render, screen } from "@testing-library/react";
  import { MemoryRouter, Routes, Route } from "react-router-dom";
  import { describe, it, expect, vi } from "vitest";
  import { Layout } from "@/components/Layout";
  import { ApprovalsPage } from "@/pages/ApprovalsPage";
  import { IntakePage } from "@/pages/IntakePage";

  vi.mock("@/lib/api", () => ({
    api: {
      get: vi.fn(() => Promise.resolve([])),
      post: vi.fn(() => Promise.resolve({})),
      patch: vi.fn(() => Promise.resolve({})),
    },
  }));

  function renderAt(path: string, element: React.ReactNode) {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Layout>
          <Routes>
            <Route path={path} element={element} />
          </Routes>
        </Layout>
      </MemoryRouter>,
    );
  }

  describe("new MC routes", () => {
    it("renders the Approval Queue page with sidebar nav present", () => {
      renderAt("/approvals", <ApprovalsPage />);
      expect(screen.getByText("► Approval Queue ◄")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /board/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /approvals/i })).toBeInTheDocument();
    });

    it("renders the Intake page", () => {
      renderAt("/intake", <IntakePage />);
      expect(screen.getByRole("button", { name: /register brand/i })).toBeInTheDocument();
    });
  });
  ```
  > Note: `App` itself wraps `BrowserRouter`, so this test composes `Layout` + a `MemoryRouter` directly rather than importing `App` (you cannot nest routers). The Task-1 `App.smoke.test.tsx` still covers the real `App` tree.

- [ ] **Run, expect FAIL** then PASS. Cmds: `pnpm --filter polymath-dashboard test src/App.routes.test.tsx` (FAIL: sidebar links / page text missing before edits) → apply edits → `pnpm --filter polymath-dashboard test` (PASS, all suites).

- [ ] **Full suite + lint gate.** Cmds: `pnpm --filter polymath-dashboard test` (all green) and `pnpm --filter polymath-dashboard lint` (0 errors — watch `noUnusedLocals`). Capture both outputs.

- [ ] **Commit.** `git -C D:\VFXellence-LTD add .canon/.mission-control/client && git -C D:\VFXellence-LTD commit -m "Wire MC routes and sidebar nav for the five new surfaces

- Add /board /intake /approvals /campaigns /agents routes in App.tsx
- Add Board/Intake/Approvals/Campaigns/Agents to the sidebar nav
- Keep all existing finance/setup/launch/entity routes intact
- Test new routes render and nav links are present"`

---

## VAULT UPDATE (perform as part of Task 8, before final commit)

- [ ] Append a dated entry to `D:\VFXellence-LTD\polymath\vault\dev\4_orchestrator\changelogs\2026-06-14.md` (create if absent): note Plan 2 delivered (test harness, Board, Intake, Approval Queue, Campaign Panel, Agents placeholder, routes), the endpoint-deviation decisions (PATCH `/:id/status`, client-side task follow-up on approve, `POST /sessions/start` 404 stub for Plan 3), and any seam to verify in Plan 3 (`/sessions/start` body `{campaignId}`) / Plan 1 (`POST /api/setup` brand body shape).
- [ ] If the brand-registration endpoint had to fall back to vault write, record that decision so Plan 3/4 agree.

---

## Self-Review

**Spec coverage (7 required deliverables):**
1. **Test infra** — Task 1 adds vitest + RTL + jsdom + setup file + a passing `App` render smoke test. ✔
2. **BOARD** — Task 2–4: 5 columns `backlog | todo | in-progress | in-review | done`, **no Triage** (asserted absent in `Board.test.tsx`); cards from `GET /api/tasks` grouped by status; priority tint via `PRIORITY_BORDER/BG`; ecosystem **scope selector** drives `useTasks(scope)` → `?ecosystem=`. Structure mirrors Halon `KanbanBoard → KanbanColumn → KanbanCard` (status `<select>` per card), restyled to Polymath inline-zinc. ✔
3. **INTAKE** — Task 7: create campaign → `POST /api/campaigns` + N child `POST /api/tasks`; register brand/ecosystem; file an "improve Mission Control" infra task (apps ecosystem). Repurposes the Launch/Setup tabbed pattern. ✔
4. **APPROVAL QUEUE** — Task 5: lists `GET /api/approvals?status=pending`, renders artifact preview + `contentJson` (script/hook/shotlist/caption/hashtags/safeguardReport, defensively), Approve / Reject / Request-changes → `PATCH /api/approvals/:id/status`, with the **client-side task follow-up** (approve→done, reject/changes→in-progress) the server omits; 4 s poll = live-ish. ✔
5. **CAMPAIGN CONTROL** — Task 6: lists `/api/campaigns`, shows run status from `/api/agent-runs`, `Run` button → `POST /api/sessions/start {campaignId}` with **graceful 404 handling** so Plan 2 ships before Plan 3. ✔
6. **AGENT/SESSION placeholder** — Task 6 `AgentBoard` (read-only runs; terminal banner deferring to Plan 3). ✔
7. **Routes** — Task 8 adds 5 routes + nav; explicitly preserves existing finance/setup/entity routes (smoke test guards). ✔

**No placeholders:** every code step ships a complete file or a complete, paste-ready edit (no `…`/TODO in implementation code). The only intentional stubs are product-correct: the Plan-3 session endpoint call and the Agents terminal — both required by the brief to be stubs.

**Type consistency with schema/API:** `src/lib/engine.ts` mirrors the Plan-1 services' camelCase output exactly (`Task`/`Campaign`/`Approval`/`AgentRun`), including enum unions (`TaskStatus` has `blocked` even though it's off-board; `ApprovalStatus` includes `changes-requested`; `CampaignStatus` full set). Status-change calls use the **real** endpoints (`PATCH …/:id/status`, `POST /campaigns/:id/approve`), and the brief↔reality deviations are called out in the API table and the VAULT UPDATE. `claudeSessionId` added to `Task` to keep the active-session pulse type-honest. `noUnusedLocals`/`noUnusedParameters` respected (Task 8 lint gate). The one under-pinned seam — `POST /api/setup` brand body — is flagged for verification rather than assumed.

**Independence:** Plan 2 builds and tests entirely against the live Plan-1 API; the only forward dependency (`/sessions/start`) is stubbed with graceful failure, so the plan ships standalone.
