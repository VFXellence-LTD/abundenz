# Mission Control SQLite Server Implementation Plan (Plan 1 of 5)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Stand up a long-lived Node + Express 5 + better-sqlite3 server on PORT 4500 beside the existing dashboard client at `.canon/.mission-control/server/`, backed by ONE SQLite DB. It exposes `/api/*` routes, enforces brand/ecosystem-isolation via scoping middleware + per-ecosystem SQL views, seeds the financial tables from the static `INITIAL_TOOLS`, and migrates the 4 existing dashboard hooks from `localStorage` to `fetch` **without changing their return shapes**. WebSocket is stubbed only. A `concurrently` dev script boots server + client together.

**Architecture:** Mirrors Halon Canon Mission Control (CMC) at `D:\dev\halon-rdutta\_canon_factory\canon-instances\halon.canon\.mission-control\server\`. Patterns reused verbatim: `Database` ctor with `WAL` + `foreign_keys` pragmas, `migrate()` via `CREATE TABLE IF NOT EXISTS` + try/catch `ALTER`, `getDb()` singleton + `createDb()` for tests, route-factory `createXRouter(serviceDeps)` mounted at `/api/x` in `index.ts`, thin handlers delegating to service classes, error shape `{ error }` with 400/404/500. We do NOT copy any Jira/AYON specifics. Two-process dev: `tsx watch server/index.ts` (4500) + `vite` (5174); vite proxies `/api` -> 4500.

**Tech Stack:** Express `^5.2.1`, better-sqlite3 `^12.9.0` (already in client/package.json; native binding must be approved/rebuilt), `ws ^8.20.1` (stub only), `cors ^2.8.6`, `dotenv ^17.4.2`; dev: `tsx ^4.22.3`, `concurrently ^9.x`, `vitest ^4.1.7`, `typescript ~6.0.2`, `@types/{express,better-sqlite3,cors,node,ws}`, `supertest ^7.x` + `@types/supertest` for route tests. ESM (`"type": "module"`), `module: ESNext`, `moduleResolution: bundler`, `target: ES2022`, `strict: true`.

**Scope guardrails (DO NOT exceed):**
- Build the SQLite server + wire the existing client to it. Nothing else.
- PTY engine driver = Plan 3. Approval Queue UI = Plan 2. The actual engine = Plan 4.
- WebSocket here is a **stub** (accept upgrade on `/ws`, no event wiring). Full WS = later plans.
- The `tasks`/`campaigns`/`approval_queue`/`agent_runs` tables and their CRUD + status-transition rules ARE in scope (the engine-facing schema must exist now), but no engine consumes them yet.
- `brands` + `platform_accounts` (EntityPage backing) are the LAST task and may be deferred without blocking the plan's goal.

---

## File map

All paths relative to `D:\VFXellence-LTD\.canon\.mission-control\` unless absolute.

```
.mission-control/
├── package.json                 # NEW — root workspace holder; concurrently dev script (Task 11)
├── tsconfig.json                # NEW — base TS config shared by server (Task 1)
├── tsconfig.server.json         # NEW — server build config (Task 1)
├── vitest.config.ts             # NEW — vitest node env (Task 1)
├── client/                      # EXISTS — polymath-dashboard (Vite 8 + React 19), port 5174
│   ├── vite.config.ts           # MODIFY — add server.proxy /api; rewire vaultWritePlugin (Task 10)
│   └── src/
│       ├── lib/api.ts           # NEW — fetch helper (Task 10)
│       └── hooks/
│           ├── useTransactions.ts   # MODIFY — localStorage -> fetch (Task 10)
│           ├── useTools.ts          # MODIFY (Task 10)
│           ├── useSetupProgress.ts  # MODIFY (Task 10)
│           └── useLaunchProgress.ts # MODIFY (Task 10)
└── server/                      # NEW — this plan
    ├── package.json             # NEW — server deps + scripts (Task 1)
    ├── config.ts                # NEW — PORT 4500, DB_PATH, CANON_PATH, VAULT_PATH (Task 9)
    ├── db.ts                    # NEW — Database, pragmas, migrate(), getDb/createDb (Task 2)
    ├── scoping.ts               # NEW — ecosystem scope middleware + per-eco views (Task 3)
    ├── index.ts                 # NEW — createApp(deps) + startServer() + WS stub (Task 9)
    ├── .data/                   # gitignored (**/.data/, *.db) — DB lives here at runtime
    ├── services/
    │   ├── transactions.service.ts  # Task 4
    │   ├── tools.service.ts         # Task 5
    │   ├── setup.service.ts         # Task 6
    │   ├── launch.service.ts        # Task 7
    │   ├── tasks.service.ts         # Task 8
    │   ├── campaigns.service.ts     # Task 8
    │   ├── approvals.service.ts     # Task 8
    │   ├── agentRuns.service.ts     # Task 8
    │   ├── vault.service.ts         # Task 9 (POST /api/vault/launches/:filename)
    │   └── entity.service.ts        # Task 12 (optional)
    ├── routes/
    │   ├── transactions.ts          # Task 4
    │   ├── tools.ts                 # Task 5
    │   ├── setup.ts                 # Task 6
    │   ├── launch.ts                # Task 7
    │   ├── tasks.ts                 # Task 8
    │   ├── campaigns.ts             # Task 8
    │   ├── approvals.ts             # Task 8
    │   ├── agentRuns.ts             # Task 8
    │   ├── vault.ts                 # Task 9
    │   └── entity.ts                # Task 12 (optional)
    ├── ws/
    │   └── stub.ws.ts               # Task 9 — WebSocketServer noServer, accept-only
    ├── seed.ts                      # Task 5 — INITIAL_TOOLS seed (shared with client data)
    └── test/
        ├── db.test.ts               # Task 2
        ├── scoping.test.ts          # Task 3
        ├── transactions.test.ts     # Task 4
        ├── tools.test.ts            # Task 5
        ├── setup.test.ts            # Task 6
        ├── launch.test.ts           # Task 7
        ├── engine-tables.test.ts    # Task 8
        ├── index.test.ts            # Task 9
        └── entity.test.ts           # Task 12 (optional)
```

**Type-contract rule (enforced in Self-Review):** SQLite columns ↔ client TS interfaces ↔ API JSON must agree. The API serializes `snake_case` DB columns to the `camelCase` field names the client types use. Each service owns a `rowToX()` mapper; the column ↔ field mapping table lives in Task 4/5/6/7 and is cross-checked in the Self-Review.

---

## Task 1 — Scaffold server package, tsconfig, vitest, approve better-sqlite3 build

**Model/effort:** haiku, low (mechanical scaffolding).
**Worktree:** yes — `superpowers:using-git-worktrees`, branch `plan1/task1-scaffold`.

**Files:**
- Create: `.mission-control/server/package.json`
- Create: `.mission-control/tsconfig.json`
- Create: `.mission-control/tsconfig.server.json`
- Create: `.mission-control/vitest.config.ts`
- Create: `.mission-control/server/test/smoke.test.ts` (throwaway, deleted at task end)
- Create: `.mission-control/server/.data/.gitkeep`

### Steps

- [ ] **Write the smoke test first (proves vitest runs).** Create `.mission-control/server/test/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("toolchain smoke", () => {
  it("runs vitest under tsx/esm", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Create `server/package.json`:**
```json
{
  "name": "polymath-mc-server",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch index.ts",
    "build": "tsc -p ../tsconfig.server.json",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "better-sqlite3": "^12.9.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "ws": "^8.20.1"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.13",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^24.12.3",
    "@types/supertest": "^6.0.3",
    "@types/ws": "^8.18.1",
    "supertest": "^7.1.1",
    "tsx": "^4.22.3",
    "typescript": "~6.0.2",
    "vitest": "^4.1.7"
  }
}
```

- [ ] **Create `tsconfig.json` (base):**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "sourceMap": true
  }
}
```

- [ ] **Create `tsconfig.server.json`:**
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "server/dist",
    "rootDir": "server",
    "types": ["node"]
  },
  "include": ["server/**/*"],
  "exclude": ["server/dist", "server/.data", "server/test/**"]
}
```

- [ ] **Create `vitest.config.ts`:**
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["server/test/**/*.test.ts"],
    globals: false,
  },
});
```

- [ ] **Install deps from the server dir (pnpm).** Run from `.mission-control/server`:
```
pnpm install
```
  Expect: lockfile written, `node_modules` created. better-sqlite3 likely lands UNBUILT (pnpm defers native build scripts).

- [ ] **Approve + rebuild the better-sqlite3 native binding (REQUIRED — binding was deferred).** From `.mission-control/server`:
```
pnpm approve-builds
```
  In the interactive list select `better-sqlite3` (and `cpu-features`/`ssh2` if shown — they are transitive, only better-sqlite3 matters). Then force the rebuild deterministically:
```
pnpm rebuild better-sqlite3
```
  If `approve-builds` is non-interactive in CI/agent context, instead add to `server/package.json` a `pnpm.onlyBuiltDependencies` array `["better-sqlite3"]` at the `.mission-control` root `package.json` (created Task 11) and re-run `pnpm rebuild better-sqlite3`. Verify the binding loads:
```
node -e "const D=require('better-sqlite3'); const db=new D(':memory:'); db.pragma('journal_mode=WAL'); console.log('ok', db.pragma('journal_mode'));"
```
  Expect stdout: `ok [ { journal_mode: 'wal' } ]` (or `ok wal`). If this throws `Could not locate the bindings file` the rebuild did NOT take — do not proceed; fix the build first.

- [ ] **Run the smoke test — expect PASS** (toolchain proven). From `.mission-control/server`:
```
pnpm test
```
  Expected output: `Test Files 1 passed (1)` / `Tests 1 passed (1)`.

- [ ] **Delete the throwaway smoke test** (`server/test/smoke.test.ts`) so it doesn't linger.

- [ ] **Confirm DB dir is gitignored** (already true at root: `**/.data/`, `*.db`, `*.db-shm`, `*.db-wal`). No new gitignore needed. Add `server/.data/.gitkeep` so the dir exists but its DB contents stay ignored.

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server/package.json .canon/.mission-control/tsconfig.json .canon/.mission-control/tsconfig.server.json .canon/.mission-control/vitest.config.ts .canon/.mission-control/server/.data/.gitkeep
git -C D:\VFXellence-LTD commit -m "Scaffold Mission Control server package and toolchain

- Add server/package.json with Express 5, better-sqlite3, tsx, vitest
- Add base tsconfig.json and tsconfig.server.json (ESM, ES2022, strict)
- Add vitest.config.ts (node env, server/test glob)
- Approve and rebuild better-sqlite3 native binding
- Add gitignored server/.data/ for the runtime DB"
```

---

## Task 2 — `db.ts`: schema + migration (round-trip test)

**Model/effort:** opus, high (full schema authoring — the state-machine core; correctness is load-bearing).
**Worktree:** yes — branch `plan1/task2-db`.

**Files:**
- Create: `.mission-control/server/db.ts`
- Test: `.mission-control/server/test/db.test.ts`

### Steps

- [ ] **Write failing test first.** Create `server/test/db.test.ts`:
```ts
import { describe, it, expect, afterEach } from "vitest";
import { createDb, type Db } from "../db.js";

let db: Db | undefined;
afterEach(() => db?.close());

describe("db schema + migration", () => {
  it("enables WAL and foreign_keys", () => {
    db = createDb(":memory:");
    expect(String(db.raw.pragma("foreign_keys", { simple: true }))).toBe("1");
    // :memory: reports 'memory' for journal_mode; a file DB reports 'wal'
    const jm = String(db.raw.pragma("journal_mode", { simple: true }));
    expect(["wal", "memory"]).toContain(jm);
  });

  it("creates all 11 core tables", () => {
    db = createDb(":memory:");
    const names = db.raw
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all()
      .map((r: any) => r.name);
    for (const t of [
      "tasks", "campaigns", "approval_queue", "agent_runs",
      "transactions", "tools", "setup_progress",
      "launch_state", "launch_data", "brands", "platform_accounts",
    ]) {
      expect(names).toContain(t);
    }
  });

  it("round-trips a task row with FK + JSON columns", () => {
    db = createDb(":memory:");
    db.raw
      .prepare(
        `INSERT INTO tasks (id, title, type, ecosystem_id, source, status, priority, linked_ids, checklist, autonomy_stage)
         VALUES (@id, @title, @type, @ecosystem_id, @source, @status, @priority, @linked_ids, @checklist, @autonomy_stage)`,
      )
      .run({
        id: "SURGE-001",
        title: "First clip",
        type: "content-piece",
        ecosystem_id: "viral",
        source: "agent",
        status: "todo",
        priority: "high",
        linked_ids: JSON.stringify(["SURGE-000"]),
        checklist: JSON.stringify([{ label: "draft", done: false }]),
        autonomy_stage: 1,
      });
    const row: any = db.raw.prepare("SELECT * FROM tasks WHERE id=?").get("SURGE-001");
    expect(row.ecosystem_id).toBe("viral");
    expect(JSON.parse(row.linked_ids)).toEqual(["SURGE-000"]);
    expect(row.autonomy_stage).toBe(1);
  });

  it("enforces foreign_keys on approval_queue.task_id", () => {
    db = createDb(":memory:");
    expect(() =>
      db!.raw
        .prepare(
          `INSERT INTO approval_queue (id, task_id, ecosystem_id, status, created_at)
           VALUES ('AQ-1', 'NOPE-999', 'viral', 'pending', '2026-06-13T00:00:00Z')`,
        )
        .run(),
    ).toThrow(/FOREIGN KEY/i);
  });

  it("migrate() is idempotent (safe to call twice)", () => {
    db = createDb(":memory:");
    expect(() => db!.migrate()).not.toThrow();
  });

  it("seeds nothing on its own (seeding is Task 5's job)", () => {
    db = createDb(":memory:");
    const count: any = db.raw.prepare("SELECT COUNT(*) c FROM tools").get();
    expect(count.c).toBe(0);
  });
});
```

- [ ] **Run it — expect FAIL** (module not found). From `.mission-control/server`:
```
pnpm test -- db.test
```
  Expected: `Error: Failed to resolve import "../db.js"` / `Cannot find module`.

- [ ] **Implement `server/db.ts`.** Complete file:
```ts
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export interface Db {
  raw: Database.Database;
  migrate(): void;
  close(): void;
}

/**
 * Mirrors CMC db.service: WAL + foreign_keys pragmas, CREATE TABLE IF NOT EXISTS,
 * additive ALTER guarded by try/catch (SQLite has no IF NOT EXISTS on ADD COLUMN).
 */
class MissionControlDb implements Db {
  readonly raw: Database.Database;

  constructor(dbPath: string) {
    if (dbPath !== ":memory:") {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    this.raw = new Database(dbPath);
    this.raw.pragma("journal_mode = WAL");
    this.raw.pragma("foreign_keys = ON");
    this.migrate();
  }

  migrate(): void {
    this.raw.exec(`
      -- ===== Engine-facing state machine (the Jira replacement) =====
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        ecosystem_id TEXT NOT NULL,
        vertical_id TEXT,
        status TEXT NOT NULL DEFAULT 'planned',      -- planned|running|paused|review|done|killed
        autonomy_stage INTEGER DEFAULT 0,
        target_count INTEGER DEFAULT 1,
        approved_by TEXT,
        approved_at TEXT,
        started_at TEXT,
        completed_at TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,                          -- e.g. 'SURGE-001'
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,                           -- task|campaign|agent-run|content-piece|research|setup|infra
        ecosystem_id TEXT NOT NULL,                   -- content|viral|products|affiliate|apps
        vertical_id TEXT,
        source TEXT NOT NULL DEFAULT 'manual',        -- manual|agent|import
        status TEXT NOT NULL DEFAULT 'backlog',       -- backlog|todo|in-progress|blocked|in-review|done
        priority TEXT NOT NULL DEFAULT 'medium',      -- critical|high|medium|low
        owner TEXT,
        agent_id TEXT,
        parent_id TEXT,
        linked_ids TEXT,                              -- JSON array
        campaign_id TEXT,
        content_type TEXT,
        platform TEXT,
        autonomy_stage INTEGER DEFAULT 0,             -- 0-3
        checklist TEXT,                               -- JSON
        tracker_content TEXT,
        claude_session_id TEXT,
        worktree_path TEXT,
        time_total_seconds INTEGER DEFAULT 0,
        time_running INTEGER DEFAULT 0,
        time_run_started TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (parent_id) REFERENCES tasks(id),
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
      );

      CREATE TABLE IF NOT EXISTS approval_queue (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        campaign_id TEXT,
        ecosystem_id TEXT NOT NULL,
        content_type TEXT,
        artifact_path TEXT,
        preview_url TEXT,
        content_json TEXT,                            -- JSON payload of the draft
        status TEXT NOT NULL DEFAULT 'pending',       -- pending|approved|rejected|changes-requested
        reviewed_by TEXT,
        reviewed_at TEXT,
        review_notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id),
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
      );

      CREATE TABLE IF NOT EXISTS agent_runs (
        id TEXT PRIMARY KEY,
        campaign_id TEXT,
        task_id TEXT,
        agent_name TEXT,
        claude_session_id TEXT,
        pty_session_id TEXT,
        status TEXT NOT NULL DEFAULT 'queued',        -- queued|running|waiting|done|error|killed
        cwd TEXT,
        command TEXT,
        started_at TEXT,
        completed_at TEXT,
        output_json TEXT,
        error TEXT,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      );

      -- ===== Financial / business tables (back the existing dashboard hooks) =====
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        amount REAL NOT NULL,
        ecosystem_id TEXT NOT NULL,
        stream TEXT NOT NULL,
        vertical TEXT,
        band TEXT,
        listing_id TEXT,
        description TEXT NOT NULL,
        type TEXT NOT NULL                            -- income|expense
      );

      CREATE TABLE IF NOT EXISTS tools (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cost_per_month REAL NOT NULL DEFAULT 0,
        ecosystems TEXT NOT NULL,                     -- JSON array of EcosystemId
        status TEXT NOT NULL DEFAULT 'candidate',     -- active|candidate|rejected
        url TEXT,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS setup_progress (
        step_id TEXT PRIMARY KEY,
        done INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS launch_state (
        vertical_key TEXT NOT NULL,                   -- '${ecosystemId}:${verticalId}'
        step_id TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (vertical_key, step_id)
      );

      CREATE TABLE IF NOT EXISTS launch_data (
        vertical_key TEXT NOT NULL,
        field_key TEXT NOT NULL,                      -- '${stepId}.${fieldKey}'
        value TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (vertical_key, field_key)
      );

      -- ===== Entity registry (EntityPage) =====
      CREATE TABLE IF NOT EXISTS brands (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        ecosystem_id TEXT NOT NULL,
        email TEXT NOT NULL DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS platform_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_id TEXT,                                -- NULL => shared/LLC-level account
        platform TEXT NOT NULL,
        handle TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        tracking_id TEXT,
        status TEXT NOT NULL DEFAULT 'not-started',   -- active|pending|not-started
        notes TEXT,
        url TEXT,
        max_accounts TEXT,
        FOREIGN KEY (brand_id) REFERENCES brands(id)
      );

      -- ===== Indexes =====
      CREATE INDEX IF NOT EXISTS idx_tasks_status      ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_ecosystem   ON tasks(ecosystem_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_campaign    ON tasks(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_approval_status   ON approval_queue(status);
      CREATE INDEX IF NOT EXISTS idx_txn_ecosystem     ON transactions(ecosystem_id);
      CREATE INDEX IF NOT EXISTS idx_agentruns_status  ON agent_runs(status);
    `);

    // Additive migrations for already-existing DBs (no IF NOT EXISTS on ADD COLUMN).
    const additive: Array<[string, string, string]> = [
      // [table, column, type] — append future columns here, never reorder.
      ["tasks", "agent_id", "TEXT"],
    ];
    for (const [table, col, type] of additive) {
      try {
        this.raw.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
      } catch {
        /* column already exists — safe to ignore */
      }
    }
  }

  close(): void {
    this.raw.close();
  }
}

let _instance: MissionControlDb | undefined;

/** Process-wide singleton. Pass dbPath only on first call. */
export function getDb(dbPath: string): Db {
  if (!_instance) _instance = new MissionControlDb(dbPath);
  return _instance;
}

/** Fresh isolated instance — use createDb(':memory:') in tests. */
export function createDb(dbPath: string): Db {
  return new MissionControlDb(dbPath);
}
```

- [ ] **Run it — expect PASS.**
```
pnpm test -- db.test
```
  Expected: `Tests 6 passed (6)`.

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server/db.ts .canon/.mission-control/server/test/db.test.ts
git -C D:\VFXellence-LTD commit -m "Add Mission Control SQLite schema and migration

- Add db.ts with WAL + foreign_keys pragmas and idempotent migrate()
- Create state-machine tables: tasks, campaigns, approval_queue, agent_runs
- Create financial tables: transactions, tools, setup_progress, launch_state, launch_data
- Create entity tables: brands, platform_accounts; add indexes
- Add getDb singleton and createDb test factory; cover with round-trip + FK tests"
```

---

## Task 3 — `scoping.ts`: ecosystem-scope middleware + per-ecosystem views (isolation test)

**Model/effort:** opus, high (security-relevant isolation boundary).
**Worktree:** yes — branch `plan1/task3-scoping`.

**Files:**
- Create: `.mission-control/server/scoping.ts`
- Test: `.mission-control/server/test/scoping.test.ts`

### Concept

- Per-ecosystem SQL VIEWS are created at migrate time for ecosystem-scoped tables (`tasks`, `approval_queue`, `transactions`, `agent_runs`): e.g. `v_surge_tasks AS SELECT * FROM tasks WHERE ecosystem_id='viral'`. Surge = viral. Views give a read path that *structurally cannot* return another ecosystem's rows.
- Express middleware reads an `X-Ecosystem` request header (or `?ecosystem=` query) and attaches `req.scope = { ecosystemId, crossEcosystem }` to the request. `crossEcosystem` is true ONLY when a controller explicitly opts in via the `allowCrossEcosystem` route flag (default false).
- Services that are ecosystem-scoped accept the scope and add `WHERE ecosystem_id = ?` to every read/write unless `crossEcosystem` is set. The test proves a scoped read can't see another ecosystem's row.

### Steps

- [ ] **Write failing test first.** Create `server/test/scoping.test.ts`:
```ts
import { describe, it, expect, afterEach } from "vitest";
import { createDb, type Db } from "../db.js";
import { createScopedViews, scopedSelect, ECOSYSTEM_VIEW } from "../scoping.js";

let db: Db | undefined;
afterEach(() => db?.close());

function seedTwoEcosystems(d: Db) {
  const ins = d.raw.prepare(
    `INSERT INTO tasks (id,title,type,ecosystem_id,source,status,priority,created_at,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
  );
  ins.run("VIRAL-1", "viral one", "task", "viral", "manual", "todo", "high", "t", "t");
  ins.run("CONTENT-1", "content one", "task", "content", "manual", "todo", "high", "t", "t");
}

describe("ecosystem scoping", () => {
  it("creates per-ecosystem views", () => {
    db = createDb(":memory:");
    createScopedViews(db.raw);
    const views = db.raw
      .prepare("SELECT name FROM sqlite_master WHERE type='view'")
      .all()
      .map((r: any) => r.name);
    expect(views).toContain("v_surge_tasks");      // viral
    expect(views).toContain("v_signal_tasks");     // content
    expect(views).toContain("v_surge_approval_queue");
  });

  it("a scoped view cannot read another ecosystem's rows", () => {
    db = createDb(":memory:");
    createScopedViews(db.raw);
    seedTwoEcosystems(db);
    const surge: any[] = db.raw.prepare(`SELECT * FROM ${ECOSYSTEM_VIEW("viral", "tasks")}`).all();
    expect(surge.map((r) => r.id)).toEqual(["VIRAL-1"]);
    expect(surge.find((r) => r.id === "CONTENT-1")).toBeUndefined();
  });

  it("scopedSelect injects WHERE ecosystem_id and blocks leakage", () => {
    db = createDb(":memory:");
    createScopedViews(db.raw);
    seedTwoEcosystems(db);
    const rows = scopedSelect(db.raw, "tasks", { ecosystemId: "viral", crossEcosystem: false });
    expect(rows.map((r: any) => r.id)).toEqual(["VIRAL-1"]);
  });

  it("crossEcosystem=true bypasses the filter (explicit override only)", () => {
    db = createDb(":memory:");
    createScopedViews(db.raw);
    seedTwoEcosystems(db);
    const rows = scopedSelect(db.raw, "tasks", { ecosystemId: "viral", crossEcosystem: true });
    expect(rows.map((r: any) => r.id).sort()).toEqual(["CONTENT-1", "VIRAL-1"]);
  });
});
```

- [ ] **Run it — expect FAIL** (`Cannot find module ../scoping.js`).
```
pnpm test -- scoping.test
```

- [ ] **Implement `server/scoping.ts`.** Complete file:
```ts
import type Database from "better-sqlite3";
import type { Request, Response, NextFunction } from "express";

export type EcosystemId = "content" | "viral" | "products" | "affiliate" | "apps";

export interface Scope {
  ecosystemId: EcosystemId;
  crossEcosystem: boolean;
}

/** Codename per ecosystem — view names read better as the brand (Surge = viral). */
const CODENAME: Record<EcosystemId, string> = {
  content: "signal",
  viral: "surge",
  products: "atelier",
  affiliate: "conduit",
  apps: "forge",
};

/** Tables that carry ecosystem_id and therefore get per-ecosystem views. */
const SCOPED_TABLES = ["tasks", "approval_queue", "transactions", "agent_runs"] as const;
type ScopedTable = (typeof SCOPED_TABLES)[number];

const VALID_ECOSYSTEMS = Object.keys(CODENAME) as EcosystemId[];

/** View name for an (ecosystem, table) pair, e.g. v_surge_tasks. */
export function ECOSYSTEM_VIEW(eco: EcosystemId, table: ScopedTable): string {
  return `v_${CODENAME[eco]}_${table}`;
}

/** Create one read-only view per (ecosystem, scoped table). Idempotent. */
export function createScopedViews(raw: Database.Database): void {
  for (const eco of VALID_ECOSYSTEMS) {
    for (const table of SCOPED_TABLES) {
      const view = ECOSYSTEM_VIEW(eco, table);
      raw.exec(
        `CREATE VIEW IF NOT EXISTS ${view} AS SELECT * FROM ${table} WHERE ecosystem_id = '${eco}'`,
      );
    }
  }
}

/**
 * Scoped SELECT * helper. With crossEcosystem=false (default) it reads from the
 * per-ecosystem view (structurally cannot leak). With crossEcosystem=true it reads
 * the base table — only controllers that pass allowCrossEcosystem reach this branch.
 */
export function scopedSelect(
  raw: Database.Database,
  table: ScopedTable,
  scope: Scope,
): unknown[] {
  if (scope.crossEcosystem) {
    return raw.prepare(`SELECT * FROM ${table}`).all();
  }
  return raw.prepare(`SELECT * FROM ${ECOSYSTEM_VIEW(scope.ecosystemId, table)}`).all();
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      scope?: Scope;
    }
  }
}

/**
 * Middleware factory. Reads X-Ecosystem header / ?ecosystem= and attaches req.scope.
 * allowCrossEcosystem must be opted into per route; absent => scoped.
 * Defaults to 'content' if the request omits an ecosystem and cross is not allowed.
 */
export function ecosystemScope(opts: { allowCrossEcosystem?: boolean } = {}) {
  const allowCross = opts.allowCrossEcosystem ?? false;
  return (req: Request, res: Response, next: NextFunction): void => {
    const raw =
      (req.header("x-ecosystem") || (req.query["ecosystem"] as string | undefined) || "")
        .toLowerCase();
    const crossRequested = raw === "*" || raw === "all";

    if (crossRequested) {
      if (!allowCross) {
        res.status(400).json({ error: "Cross-ecosystem access not allowed on this route" });
        return;
      }
      req.scope = { ecosystemId: "content", crossEcosystem: true };
      next();
      return;
    }

    const eco = (raw || "content") as EcosystemId;
    if (!VALID_ECOSYSTEMS.includes(eco)) {
      res.status(400).json({ error: `Unknown ecosystem: ${raw}` });
      return;
    }
    req.scope = { ecosystemId: eco, crossEcosystem: false };
    next();
  };
}
```

- [ ] **Wire view creation into the DB.** In `server/db.ts`, import and call `createScopedViews` at the end of `migrate()` (views depend on tables existing). Add near the top:
```ts
import { createScopedViews } from "./scoping.js";
```
  and at the END of `migrate()` (after the additive ALTER loop):
```ts
    createScopedViews(this.raw);
```
  Re-run Task 2's db test to confirm no regression:
```
pnpm test -- db.test
```
  Expected: still `6 passed`.

- [ ] **Run scoping test — expect PASS.**
```
pnpm test -- scoping.test
```
  Expected: `Tests 4 passed (4)`.

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server/scoping.ts .canon/.mission-control/server/db.ts .canon/.mission-control/server/test/scoping.test.ts
git -C D:\VFXellence-LTD commit -m "Add ecosystem-isolation scoping and per-ecosystem views

- Add scoping.ts: ecosystemScope middleware, per-ecosystem SQL views, scopedSelect
- Create v_<codename>_<table> views at migrate time for scoped tables
- Default routes to scoped reads; cross-ecosystem requires explicit opt-in
- Prove with test that a scoped read cannot see another ecosystem's rows"
```

---

## Task 4 — Transactions route + service (TDD)

**Model/effort:** sonnet, high (integration: CRUD + JSON mapping; first end-to-end route).
**Worktree:** yes — branch `plan1/task4-transactions`.

**Column ↔ field map (transactions):** `id↔id`, `date↔date`, `amount↔amount`, `ecosystem_id↔ecosystemId`, `stream↔stream`, `vertical↔vertical`, `band↔band`, `listing_id↔listingId`, `description↔description`, `type↔type`. Client `interface Transaction` and `NewTransaction` (no `id`) are the contract.

**Files:**
- Create: `.mission-control/server/services/transactions.service.ts`
- Create: `.mission-control/server/routes/transactions.ts`
- Test: `.mission-control/server/test/transactions.test.ts`

### Steps

- [ ] **Write failing test first.** Create `server/test/transactions.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createTransactionsRouter } from "../routes/transactions.js";

let db: Db;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/transactions", createTransactionsRouter(db));
});
afterEach(() => db.close());

const NEW = {
  date: "2026-06-13",
  amount: 250.5,
  ecosystemId: "viral",
  stream: "rpm",
  description: "YouTube RPM",
  type: "income",
};

describe("transactions API", () => {
  it("GET returns [] initially", async () => {
    const res = await request(app).get("/api/transactions");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST creates and returns the row with a generated id (camelCase)", async () => {
    const res = await request(app).post("/api/transactions").send(NEW);
    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^txn_/);
    expect(res.body.ecosystemId).toBe("viral");
    expect(res.body.amount).toBe(250.5);
    expect(res.body).not.toHaveProperty("ecosystem_id");
  });

  it("POST then GET round-trips (newest first)", async () => {
    await request(app).post("/api/transactions").send(NEW);
    await request(app).post("/api/transactions").send({ ...NEW, description: "second" });
    const res = await request(app).get("/api/transactions");
    expect(res.body).toHaveLength(2);
    expect(res.body[0].description).toBe("second"); // newest first
  });

  it("PUT updates a partial field", async () => {
    const created = await request(app).post("/api/transactions").send(NEW);
    const id = created.body.id;
    const res = await request(app).put(`/api/transactions/${id}`).send({ amount: 999 });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(999);
    expect(res.body.description).toBe("YouTube RPM");
  });

  it("DELETE removes a row", async () => {
    const created = await request(app).post("/api/transactions").send(NEW);
    const del = await request(app).delete(`/api/transactions/${created.body.id}`);
    expect(del.status).toBe(200);
    const res = await request(app).get("/api/transactions");
    expect(res.body).toEqual([]);
  });

  it("POST validates required fields -> 400", async () => {
    const res = await request(app).post("/api/transactions").send({ amount: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("PUT on missing id -> 404", async () => {
    const res = await request(app).put("/api/transactions/nope").send({ amount: 1 });
    expect(res.status).toBe(404);
  });

  it("POST /import bulk-inserts", async () => {
    const res = await request(app).post("/api/transactions/import").send([NEW, { ...NEW, description: "b" }]);
    expect(res.status).toBe(201);
    expect(res.body).toHaveLength(2);
  });
});
```

- [ ] **Run it — expect FAIL** (`Cannot find module ../routes/transactions.js`).
```
pnpm test -- transactions.test
```

- [ ] **Implement `server/services/transactions.service.ts`.** Complete file:
```ts
import type { Db } from "../db.js";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  ecosystemId: string;
  stream: string;
  vertical?: string;
  band?: string;
  listingId?: string;
  description: string;
  type: "income" | "expense";
}
export type NewTransaction = Omit<Transaction, "id">;

interface Row {
  id: string;
  date: string;
  amount: number;
  ecosystem_id: string;
  stream: string;
  vertical: string | null;
  band: string | null;
  listing_id: string | null;
  description: string;
  type: string;
}

function rowToTransaction(r: Row): Transaction {
  return {
    id: r.id,
    date: r.date,
    amount: r.amount,
    ecosystemId: r.ecosystem_id,
    stream: r.stream,
    vertical: r.vertical ?? undefined,
    band: r.band ?? undefined,
    listingId: r.listing_id ?? undefined,
    description: r.description,
    type: r.type as Transaction["type"],
  };
}

function genId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class TransactionsService {
  constructor(private db: Db) {}

  list(): Transaction[] {
    const rows = this.db.raw
      .prepare("SELECT * FROM transactions ORDER BY rowid DESC")
      .all() as Row[];
    return rows.map(rowToTransaction);
  }

  get(id: string): Transaction | undefined {
    const r = this.db.raw.prepare("SELECT * FROM transactions WHERE id=?").get(id) as Row | undefined;
    return r ? rowToTransaction(r) : undefined;
  }

  create(data: NewTransaction): Transaction {
    const id = genId();
    this.db.raw
      .prepare(
        `INSERT INTO transactions (id,date,amount,ecosystem_id,stream,vertical,band,listing_id,description,type)
         VALUES (@id,@date,@amount,@ecosystem_id,@stream,@vertical,@band,@listing_id,@description,@type)`,
      )
      .run({
        id,
        date: data.date,
        amount: data.amount,
        ecosystem_id: data.ecosystemId,
        stream: data.stream,
        vertical: data.vertical ?? null,
        band: data.band ?? null,
        listing_id: data.listingId ?? null,
        description: data.description,
        type: data.type,
      });
    return this.get(id)!;
  }

  importMany(items: NewTransaction[]): Transaction[] {
    const tx = this.db.raw.transaction((rows: NewTransaction[]) =>
      rows.map((row) => this.create(row)),
    );
    return tx(items);
  }

  update(id: string, patch: Partial<NewTransaction>): Transaction | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...patch };
    this.db.raw
      .prepare(
        `UPDATE transactions SET date=@date, amount=@amount, ecosystem_id=@ecosystem_id,
           stream=@stream, vertical=@vertical, band=@band, listing_id=@listing_id,
           description=@description, type=@type WHERE id=@id`,
      )
      .run({
        id,
        date: merged.date,
        amount: merged.amount,
        ecosystem_id: merged.ecosystemId,
        stream: merged.stream,
        vertical: merged.vertical ?? null,
        band: merged.band ?? null,
        listing_id: merged.listingId ?? null,
        description: merged.description,
        type: merged.type,
      });
    return this.get(id);
  }

  remove(id: string): boolean {
    const info = this.db.raw.prepare("DELETE FROM transactions WHERE id=?").run(id);
    return info.changes > 0;
  }
}
```

- [ ] **Implement `server/routes/transactions.ts`.** Complete file:
```ts
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { TransactionsService, type NewTransaction } from "../services/transactions.service.js";

const REQUIRED: (keyof NewTransaction)[] = ["date", "amount", "ecosystemId", "stream", "description", "type"];

export function createTransactionsRouter(db: Db): Router {
  const router = Router();
  const svc = new TransactionsService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json(svc.list());
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/", (req: Request, res: Response) => {
    const body = req.body as Partial<NewTransaction>;
    const missing = REQUIRED.filter((k) => body[k] === undefined || body[k] === null || body[k] === "");
    if (missing.length) {
      res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
      return;
    }
    try {
      res.status(201).json(svc.create(body as NewTransaction));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/import", (req: Request, res: Response) => {
    const body = req.body;
    if (!Array.isArray(body)) {
      res.status(400).json({ error: "Body must be an array of transactions" });
      return;
    }
    try {
      res.status(201).json(svc.importMany(body as NewTransaction[]));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.put("/:id", (req: Request, res: Response) => {
    const updated = svc.update(String(req.params["id"]), req.body as Partial<NewTransaction>);
    if (!updated) {
      res.status(404).json({ error: `Transaction not found: ${req.params["id"]}` });
      return;
    }
    res.json(updated);
  });

  router.delete("/:id", (req: Request, res: Response) => {
    const ok = svc.remove(String(req.params["id"]));
    if (!ok) {
      res.status(404).json({ error: `Transaction not found: ${req.params["id"]}` });
      return;
    }
    res.json({ ok: true });
  });

  return router;
}
```

- [ ] **Run it — expect PASS.**
```
pnpm test -- transactions.test
```
  Expected: `Tests 8 passed (8)`.

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server/services/transactions.service.ts .canon/.mission-control/server/routes/transactions.ts .canon/.mission-control/server/test/transactions.test.ts
git -C D:\VFXellence-LTD commit -m "Add transactions API route and service

- Add TransactionsService CRUD with snake_case<->camelCase row mapper
- Add /api/transactions GET/POST/PUT/DELETE + POST /import bulk insert
- Generate txn_ ids matching the client; validate required fields -> 400
- Cover with supertest round-trip, update, delete, validation tests"
```

---

## Task 5 — Tools route + seed from INITIAL_TOOLS

**Model/effort:** sonnet, high (integration + seed-on-empty logic).
**Worktree:** yes — branch `plan1/task5-tools`.

**Column ↔ field map (tools):** `id↔id`, `name↔name`, `cost_per_month↔costPerMonth`, `ecosystems↔ecosystems` (JSON array), `status↔status`, `url↔url`, `notes↔notes`. Contract: client `interface Tool`. Hook return: `{ tools, activeTools, monthlyBurn, updateToolStatus, toolsByEcosystem }` — `activeTools`/`monthlyBurn`/`toolsByEcosystem` are derived **client-side** from `tools`, so the server only needs to serve+update `tools`.

**Files:**
- Create: `.mission-control/server/seed.ts`
- Create: `.mission-control/server/services/tools.service.ts`
- Create: `.mission-control/server/routes/tools.ts`
- Test: `.mission-control/server/test/tools.test.ts`

### Steps

- [ ] **Write failing test first.** Create `server/test/tools.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createToolsRouter } from "../routes/tools.js";
import { seedTools } from "../seed.js";

let db: Db;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/tools", createToolsRouter(db));
});
afterEach(() => db.close());

describe("tools API + seed", () => {
  it("seeds INITIAL_TOOLS only when the table is empty", () => {
    seedTools(db);
    const first = (db.raw.prepare("SELECT COUNT(*) c FROM tools").get() as any).c;
    expect(first).toBeGreaterThan(10);
    seedTools(db); // second call must not duplicate
    const second = (db.raw.prepare("SELECT COUNT(*) c FROM tools").get() as any).c;
    expect(second).toBe(first);
  });

  it("GET returns seeded tools with ecosystems as a JSON array", async () => {
    seedTools(db);
    const res = await request(app).get("/api/tools");
    expect(res.status).toBe(200);
    const beehiiv = res.body.find((t: any) => t.id === "beehiiv");
    expect(beehiiv.costPerMonth).toBe(0);
    expect(Array.isArray(beehiiv.ecosystems)).toBe(true);
    expect(beehiiv.ecosystems).toContain("content");
    expect(beehiiv).not.toHaveProperty("cost_per_month");
  });

  it("PUT /:id/status updates status", async () => {
    seedTools(db);
    const res = await request(app).put("/api/tools/riverside/status").send({ status: "active" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("active");
  });

  it("PUT /:id/status with bad status -> 400", async () => {
    seedTools(db);
    const res = await request(app).put("/api/tools/riverside/status").send({ status: "bogus" });
    expect(res.status).toBe(400);
  });

  it("PUT status on missing tool -> 404", async () => {
    seedTools(db);
    const res = await request(app).put("/api/tools/nope/status").send({ status: "active" });
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Run it — expect FAIL.**
```
pnpm test -- tools.test
```

- [ ] **Implement `server/seed.ts`** (INITIAL_TOOLS embedded verbatim from `client/src/data/tools.ts` — kept in sync; the Self-Review checks parity). Complete file:
```ts
import type { Db } from "./db.js";

interface SeedTool {
  id: string;
  name: string;
  costPerMonth: number;
  ecosystems: string[];
  status: "active" | "candidate" | "rejected";
  url?: string;
  notes?: string;
}

/** Verbatim mirror of client/src/data/tools.ts INITIAL_TOOLS. Keep in sync. */
export const INITIAL_TOOLS: SeedTool[] = [
  { id: "beehiiv", name: "beehiiv", costPerMonth: 0, ecosystems: ["content"], status: "active", url: "https://www.beehiiv.com", notes: "Free tier — up to 2,500 subscribers" },
  { id: "ghost", name: "Ghost.org", costPerMonth: 0, ecosystems: ["content"], status: "active", url: "https://ghost.org", notes: "Self-hosted on Railway — $0/mo" },
  { id: "youtube_studio", name: "YouTube Studio", costPerMonth: 0, ecosystems: ["content"], status: "active", url: "https://studio.youtube.com", notes: "Free — monetization unlocked at 1,000 subs" },
  { id: "obs", name: "OBS Studio", costPerMonth: 0, ecosystems: ["content"], status: "active", url: "https://obsproject.com", notes: "Free, open-source recording + streaming" },
  { id: "n8n", name: "n8n", costPerMonth: 0, ecosystems: ["content", "affiliate"], status: "active", url: "https://n8n.io", notes: "Self-hosted — $0/mo for automation workflows" },
  { id: "cloudflare", name: "Cloudflare", costPerMonth: 0, ecosystems: ["content", "products", "affiliate"], status: "active", url: "https://cloudflare.com", notes: "DNS, email routing, pages — free tier" },
  { id: "riverside", name: "Riverside.fm", costPerMonth: 15, ecosystems: ["content"], status: "candidate", url: "https://riverside.fm", notes: "Remote recording with local quality — evaluating" },
  { id: "descript", name: "Descript", costPerMonth: 12, ecosystems: ["content"], status: "candidate", url: "https://www.descript.com", notes: "AI video editing — evaluating vs. manual Premiere" },
  { id: "gumroad", name: "Gumroad", costPerMonth: 0, ecosystems: ["products"], status: "candidate", url: "https://gumroad.com", notes: "10% + payment fees — considering for digital products" },
  { id: "lemon_squeezy", name: "Lemon Squeezy", costPerMonth: 0, ecosystems: ["products"], status: "candidate", url: "https://lemonsqueezy.com", notes: "5% + payment fees — Merchant of Record, handles VAT" },
  { id: "ahrefs", name: "Ahrefs", costPerMonth: 99, ecosystems: ["content", "affiliate"], status: "rejected", url: "https://ahrefs.com", notes: "Too expensive for Phase 0 — revisit at 10k/mo revenue" },
  { id: "notion", name: "Notion", costPerMonth: 0, ecosystems: ["content", "products", "affiliate"], status: "active", url: "https://notion.so", notes: "Free tier — content calendar, CRM, notes" },
  { id: "stripe", name: "Stripe", costPerMonth: 0, ecosystems: ["products"], status: "candidate", url: "https://stripe.com", notes: "2.9% + 30¢ per transaction — direct payments" },
  { id: "make", name: "Make.com", costPerMonth: 0, ecosystems: ["content", "affiliate"], status: "candidate", url: "https://make.com", notes: "Free tier — 1,000 ops/mo. Alternative to n8n" },
];

/** Insert INITIAL_TOOLS only if the tools table is empty. Idempotent. */
export function seedTools(db: Db): void {
  const count = (db.raw.prepare("SELECT COUNT(*) c FROM tools").get() as { c: number }).c;
  if (count > 0) return;
  const ins = db.raw.prepare(
    `INSERT INTO tools (id,name,cost_per_month,ecosystems,status,url,notes)
     VALUES (@id,@name,@cost_per_month,@ecosystems,@status,@url,@notes)`,
  );
  const tx = db.raw.transaction((tools: SeedTool[]) => {
    for (const t of tools) {
      ins.run({
        id: t.id,
        name: t.name,
        cost_per_month: t.costPerMonth,
        ecosystems: JSON.stringify(t.ecosystems),
        status: t.status,
        url: t.url ?? null,
        notes: t.notes ?? null,
      });
    }
  });
  tx(INITIAL_TOOLS);
}
```

- [ ] **Implement `server/services/tools.service.ts`.** Complete file:
```ts
import type { Db } from "../db.js";

export type ToolStatus = "active" | "candidate" | "rejected";
export interface Tool {
  id: string;
  name: string;
  costPerMonth: number;
  ecosystems: string[];
  status: ToolStatus;
  url?: string;
  notes?: string;
}
export const TOOL_STATUSES: ToolStatus[] = ["active", "candidate", "rejected"];

interface Row {
  id: string;
  name: string;
  cost_per_month: number;
  ecosystems: string;
  status: string;
  url: string | null;
  notes: string | null;
}

function rowToTool(r: Row): Tool {
  return {
    id: r.id,
    name: r.name,
    costPerMonth: r.cost_per_month,
    ecosystems: JSON.parse(r.ecosystems) as string[],
    status: r.status as ToolStatus,
    url: r.url ?? undefined,
    notes: r.notes ?? undefined,
  };
}

export class ToolsService {
  constructor(private db: Db) {}

  list(): Tool[] {
    return (this.db.raw.prepare("SELECT * FROM tools ORDER BY name").all() as Row[]).map(rowToTool);
  }

  get(id: string): Tool | undefined {
    const r = this.db.raw.prepare("SELECT * FROM tools WHERE id=?").get(id) as Row | undefined;
    return r ? rowToTool(r) : undefined;
  }

  updateStatus(id: string, status: ToolStatus): Tool | undefined {
    const info = this.db.raw.prepare("UPDATE tools SET status=? WHERE id=?").run(status, id);
    if (info.changes === 0) return undefined;
    return this.get(id);
  }
}
```

- [ ] **Implement `server/routes/tools.ts`.** Complete file:
```ts
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { ToolsService, TOOL_STATUSES, type ToolStatus } from "../services/tools.service.js";
import { seedTools } from "../seed.js";

export function createToolsRouter(db: Db): Router {
  const router = Router();
  seedTools(db); // seed on mount if empty
  const svc = new ToolsService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json(svc.list());
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.put("/:id/status", (req: Request, res: Response) => {
    const status = (req.body as { status?: string }).status;
    if (!status || !TOOL_STATUSES.includes(status as ToolStatus)) {
      res.status(400).json({ error: `status must be one of: ${TOOL_STATUSES.join(", ")}` });
      return;
    }
    const updated = svc.updateStatus(String(req.params["id"]), status as ToolStatus);
    if (!updated) {
      res.status(404).json({ error: `Tool not found: ${req.params["id"]}` });
      return;
    }
    res.json(updated);
  });

  return router;
}
```

- [ ] **Run it — expect PASS.**
```
pnpm test -- tools.test
```
  Expected: `Tests 5 passed (5)`.

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server/seed.ts .canon/.mission-control/server/services/tools.service.ts .canon/.mission-control/server/routes/tools.ts .canon/.mission-control/server/test/tools.test.ts
git -C D:\VFXellence-LTD commit -m "Add tools API route, service, and seed

- Add seed.ts mirroring client INITIAL_TOOLS; seed only when table empty
- Add ToolsService list/get/updateStatus with JSON ecosystems mapping
- Add /api/tools GET and PUT /:id/status with status validation
- Cover with supertest: idempotent seed, JSON array shape, status update/404/400"
```

---

## Task 6 — Setup progress route + service

**Model/effort:** haiku, low (flat key/value map — mechanical).
**Worktree:** yes — branch `plan1/task6-setup`.

**Contract:** `setup_progress(step_id PK, done INT)`. Client `SetupProgress = { [stepId]: boolean }`. The hook return `{ progress, toggleStep, isComplete, completedCount, getEcosystemProgress }` — only `progress` (the map) and `toggleStep` touch the server; the rest are client-side derivations. API serves the flat map and a toggle.

**Files:**
- Create: `.mission-control/server/services/setup.service.ts`
- Create: `.mission-control/server/routes/setup.ts`
- Test: `.mission-control/server/test/setup.test.ts`

### Steps

- [ ] **Write failing test first.** Create `server/test/setup.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createSetupRouter } from "../routes/setup.js";

let db: Db;
let app: express.Express;
beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/setup", createSetupRouter(db));
});
afterEach(() => db.close());

describe("setup progress API", () => {
  it("GET returns an empty map initially", async () => {
    const res = await request(app).get("/api/setup");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
  });

  it("POST /toggle flips a step true then false", async () => {
    const on = await request(app).post("/api/setup/toggle").send({ stepId: "s1" });
    expect(on.status).toBe(200);
    expect(on.body).toEqual({ s1: true });
    const off = await request(app).post("/api/setup/toggle").send({ stepId: "s1" });
    expect(off.body).toEqual({ s1: false });
  });

  it("GET reflects persisted booleans", async () => {
    await request(app).post("/api/setup/toggle").send({ stepId: "s1" });
    await request(app).post("/api/setup/toggle").send({ stepId: "s2" });
    const res = await request(app).get("/api/setup");
    expect(res.body).toEqual({ s1: true, s2: true });
  });

  it("POST /toggle without stepId -> 400", async () => {
    const res = await request(app).post("/api/setup/toggle").send({});
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Run it — expect FAIL.**
```
pnpm test -- setup.test
```

- [ ] **Implement `server/services/setup.service.ts`.** Complete file:
```ts
import type { Db } from "../db.js";

export type SetupProgress = Record<string, boolean>;

export class SetupService {
  constructor(private db: Db) {}

  getProgress(): SetupProgress {
    const rows = this.db.raw.prepare("SELECT step_id, done FROM setup_progress").all() as Array<{
      step_id: string;
      done: number;
    }>;
    const out: SetupProgress = {};
    for (const r of rows) out[r.step_id] = r.done === 1;
    return out;
  }

  toggle(stepId: string): SetupProgress {
    const current = this.db.raw
      .prepare("SELECT done FROM setup_progress WHERE step_id=?")
      .get(stepId) as { done: number } | undefined;
    const next = current?.done === 1 ? 0 : 1;
    this.db.raw
      .prepare(
        `INSERT INTO setup_progress (step_id, done) VALUES (?, ?)
         ON CONFLICT(step_id) DO UPDATE SET done=excluded.done`,
      )
      .run(stepId, next);
    return this.getProgress();
  }
}
```

- [ ] **Implement `server/routes/setup.ts`.** Complete file:
```ts
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { SetupService } from "../services/setup.service.js";

export function createSetupRouter(db: Db): Router {
  const router = Router();
  const svc = new SetupService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json(svc.getProgress());
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/toggle", (req: Request, res: Response) => {
    const stepId = (req.body as { stepId?: string }).stepId;
    if (!stepId || typeof stepId !== "string") {
      res.status(400).json({ error: "Missing required field: stepId" });
      return;
    }
    try {
      res.json(svc.toggle(stepId));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  return router;
}
```

- [ ] **Run it — expect PASS.**
```
pnpm test -- setup.test
```
  Expected: `Tests 4 passed (4)`.

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server/services/setup.service.ts .canon/.mission-control/server/routes/setup.ts .canon/.mission-control/server/test/setup.test.ts
git -C D:\VFXellence-LTD commit -m "Add setup progress API route and service

- Add SetupService over flat setup_progress(step_id, done) map
- Add /api/setup GET (map) and POST /toggle (upsert flip)
- Cover with supertest: empty map, toggle on/off, persistence, 400"
```

---

## Task 7 — Launch progress route + service

**Model/effort:** sonnet, high (two composite-key tables; key-format contract).
**Worktree:** yes — branch `plan1/task7-launch`.

**Contract:** `launch_state(vertical_key, step_id, done, PK(vertical_key,step_id))` and `launch_data(vertical_key, field_key, value, PK(vertical_key,field_key))`. `verticalKey = ${ecosystemId}:${verticalId}`; `fieldKey = ${stepId}.${fieldKey}`. The hook keeps nested-object shape client-side (`{ [verticalKey]: { [stepId]: bool } }` and `{ [verticalKey]: { [fieldKey]: string } }`). The API serves two flat blobs the client reconstructs into the nested maps it already uses; `exportData`/`exportMarkdown` stay client-side.

**Files:**
- Create: `.mission-control/server/services/launch.service.ts`
- Create: `.mission-control/server/routes/launch.ts`
- Test: `.mission-control/server/test/launch.test.ts`

### Steps

- [ ] **Write failing test first.** Create `server/test/launch.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createLaunchRouter } from "../routes/launch.js";

let db: Db;
let app: express.Express;
beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/launch", createLaunchRouter(db));
});
afterEach(() => db.close());

describe("launch progress API", () => {
  it("GET returns empty progress + data blobs", async () => {
    const res = await request(app).get("/api/launch");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ progress: {}, data: {} });
  });

  it("POST /toggle flips a (verticalKey, stepId) step", async () => {
    const res = await request(app)
      .post("/api/launch/toggle")
      .send({ verticalKey: "viral:zrodinger", stepId: "s1" });
    expect(res.status).toBe(200);
    expect(res.body.progress["viral:zrodinger"].s1).toBe(true);
  });

  it("PUT /field sets a value at (verticalKey, fieldKey)", async () => {
    const res = await request(app)
      .put("/api/launch/field")
      .send({ verticalKey: "viral:zrodinger", fieldKey: "s1.handle", value: "@surge" });
    expect(res.status).toBe(200);
    expect(res.body.data["viral:zrodinger"]["s1.handle"]).toBe("@surge");
  });

  it("GET reconstructs nested maps from both tables", async () => {
    await request(app).post("/api/launch/toggle").send({ verticalKey: "viral:zrodinger", stepId: "s1" });
    await request(app).put("/api/launch/field").send({ verticalKey: "viral:zrodinger", fieldKey: "s1.handle", value: "@surge" });
    const res = await request(app).get("/api/launch");
    expect(res.body.progress["viral:zrodinger"].s1).toBe(true);
    expect(res.body.data["viral:zrodinger"]["s1.handle"]).toBe("@surge");
  });

  it("POST /toggle missing keys -> 400", async () => {
    const res = await request(app).post("/api/launch/toggle").send({ stepId: "s1" });
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Run it — expect FAIL.**
```
pnpm test -- launch.test
```

- [ ] **Implement `server/services/launch.service.ts`.** Complete file:
```ts
import type { Db } from "../db.js";

export interface LaunchState {
  [verticalKey: string]: { [stepId: string]: boolean };
}
export interface LaunchData {
  [verticalKey: string]: { [fieldKey: string]: string };
}

export class LaunchService {
  constructor(private db: Db) {}

  getState(): LaunchState {
    const rows = this.db.raw
      .prepare("SELECT vertical_key, step_id, done FROM launch_state")
      .all() as Array<{ vertical_key: string; step_id: string; done: number }>;
    const out: LaunchState = {};
    for (const r of rows) {
      (out[r.vertical_key] ??= {})[r.step_id] = r.done === 1;
    }
    return out;
  }

  getData(): LaunchData {
    const rows = this.db.raw
      .prepare("SELECT vertical_key, field_key, value FROM launch_data")
      .all() as Array<{ vertical_key: string; field_key: string; value: string }>;
    const out: LaunchData = {};
    for (const r of rows) {
      (out[r.vertical_key] ??= {})[r.field_key] = r.value;
    }
    return out;
  }

  toggleStep(verticalKey: string, stepId: string): LaunchState {
    const cur = this.db.raw
      .prepare("SELECT done FROM launch_state WHERE vertical_key=? AND step_id=?")
      .get(verticalKey, stepId) as { done: number } | undefined;
    const next = cur?.done === 1 ? 0 : 1;
    this.db.raw
      .prepare(
        `INSERT INTO launch_state (vertical_key, step_id, done) VALUES (?,?,?)
         ON CONFLICT(vertical_key, step_id) DO UPDATE SET done=excluded.done`,
      )
      .run(verticalKey, stepId, next);
    return this.getState();
  }

  setField(verticalKey: string, fieldKey: string, value: string): LaunchData {
    this.db.raw
      .prepare(
        `INSERT INTO launch_data (vertical_key, field_key, value) VALUES (?,?,?)
         ON CONFLICT(vertical_key, field_key) DO UPDATE SET value=excluded.value`,
      )
      .run(verticalKey, fieldKey, value);
    return this.getData();
  }
}
```

- [ ] **Implement `server/routes/launch.ts`.** Complete file:
```ts
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { LaunchService } from "../services/launch.service.js";

export function createLaunchRouter(db: Db): Router {
  const router = Router();
  const svc = new LaunchService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json({ progress: svc.getState(), data: svc.getData() });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/toggle", (req: Request, res: Response) => {
    const { verticalKey, stepId } = req.body as { verticalKey?: string; stepId?: string };
    if (!verticalKey || !stepId) {
      res.status(400).json({ error: "Missing required fields: verticalKey, stepId" });
      return;
    }
    try {
      res.json({ progress: svc.toggleStep(verticalKey, stepId), data: svc.getData() });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.put("/field", (req: Request, res: Response) => {
    const { verticalKey, fieldKey, value } = req.body as {
      verticalKey?: string;
      fieldKey?: string;
      value?: string;
    };
    if (!verticalKey || !fieldKey) {
      res.status(400).json({ error: "Missing required fields: verticalKey, fieldKey" });
      return;
    }
    try {
      res.json({ progress: svc.getState(), data: svc.setField(verticalKey, fieldKey, value ?? "") });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  return router;
}
```

- [ ] **Run it — expect PASS.**
```
pnpm test -- launch.test
```
  Expected: `Tests 5 passed (5)`.

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server/services/launch.service.ts .canon/.mission-control/server/routes/launch.ts .canon/.mission-control/server/test/launch.test.ts
git -C D:\VFXellence-LTD commit -m "Add launch progress API route and service

- Add LaunchService over launch_state and launch_data composite-key tables
- Reconstruct nested verticalKey/stepId and verticalKey/fieldKey maps for client
- Add /api/launch GET, POST /toggle, PUT /field with key validation
- Cover with supertest: empty blobs, toggle, field set, reconstruction, 400"
```

---

## Task 8 — Engine-facing tables: tasks, campaigns, approvals, agent-runs (CRUD + status transitions + gate rules)

**Model/effort:** opus, high (the state machine + the per-asset approval gate — the heart of the MVP).
**Worktree:** yes — branch `plan1/task8-engine-tables`.

**Gate rules to enforce (this plan):**
1. `approval_queue.status` transitions: `pending -> approved | rejected | changes-requested`. Once `approved` or `rejected`, status is terminal (409 on re-transition). `reviewed_by`/`reviewed_at` set automatically on any non-pending transition.
2. A `campaign` cannot move to `running` unless `approved_by` is set (autonomy gate). `planned -> running` requires approval; otherwise 409.
3. `tasks` status transitions are free-form within the enum (engine drives them later) BUT moving a task to `done` while it has a `pending` approval row returns 409 (can't finish unreviewed work).
4. All four tables are ecosystem-scoped via `ecosystem_id`; list endpoints accept `?ecosystem=` and default to scoped reads. Cross-ecosystem list requires `?ecosystem=*` AND the route opts into `allowCrossEcosystem`.

**Files:**
- Create: `.mission-control/server/services/tasks.service.ts`
- Create: `.mission-control/server/services/campaigns.service.ts`
- Create: `.mission-control/server/services/approvals.service.ts`
- Create: `.mission-control/server/services/agentRuns.service.ts`
- Create: `.mission-control/server/routes/tasks.ts`
- Create: `.mission-control/server/routes/campaigns.ts`
- Create: `.mission-control/server/routes/approvals.ts`
- Create: `.mission-control/server/routes/agentRuns.ts`
- Test: `.mission-control/server/test/engine-tables.test.ts`

> This is the largest task; treat each sub-bullet group (tasks, then campaigns, then approvals, then agent-runs) as its own micro write-fail-impl-pass cycle, committing once at the end. Keep a single test file with describe-blocks per table.

### Steps

- [ ] **Write failing test first** (one file, four describe blocks). Create `server/test/engine-tables.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createTasksRouter } from "../routes/tasks.js";
import { createCampaignsRouter } from "../routes/campaigns.js";
import { createApprovalsRouter } from "../routes/approvals.js";
import { createAgentRunsRouter } from "../routes/agentRuns.js";

let db: Db;
let app: express.Express;
beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/tasks", createTasksRouter(db));
  app.use("/api/campaigns", createCampaignsRouter(db));
  app.use("/api/approvals", createApprovalsRouter(db));
  app.use("/api/agent-runs", createAgentRunsRouter(db));
});
afterEach(() => db.close());

const TASK = { id: "SURGE-001", title: "First Zrodinger clip", type: "content-piece", ecosystemId: "viral", source: "agent", priority: "high" };

describe("tasks", () => {
  it("POST creates a task in backlog by default", async () => {
    const res = await request(app).post("/api/tasks").send(TASK);
    expect(res.status).toBe(201);
    expect(res.body.id).toBe("SURGE-001");
    expect(res.body.status).toBe("backlog");
    expect(res.body.ecosystemId).toBe("viral");
  });

  it("GET scoped to viral excludes content tasks", async () => {
    await request(app).post("/api/tasks").send(TASK);
    await request(app).post("/api/tasks").send({ ...TASK, id: "SIGNAL-1", ecosystemId: "content" });
    const res = await request(app).get("/api/tasks?ecosystem=viral");
    expect(res.body.map((t: any) => t.id)).toEqual(["SURGE-001"]);
  });

  it("PATCH transitions status", async () => {
    await request(app).post("/api/tasks").send(TASK);
    const res = await request(app).patch("/api/tasks/SURGE-001/status").send({ status: "in-progress" });
    expect(res.body.status).toBe("in-progress");
  });

  it("cannot mark done while a pending approval exists -> 409", async () => {
    await request(app).post("/api/tasks").send(TASK);
    await request(app).post("/api/approvals").send({ taskId: "SURGE-001", ecosystemId: "viral", contentType: "clip" });
    const res = await request(app).patch("/api/tasks/SURGE-001/status").send({ status: "done" });
    expect(res.status).toBe(409);
  });
});

describe("campaigns", () => {
  it("POST creates a planned campaign", async () => {
    const res = await request(app).post("/api/campaigns").send({ id: "CAMP-1", name: "Zrodinger launch", ecosystemId: "viral" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("planned");
  });

  it("cannot run without approval -> 409", async () => {
    await request(app).post("/api/campaigns").send({ id: "CAMP-1", name: "x", ecosystemId: "viral" });
    const res = await request(app).patch("/api/campaigns/CAMP-1/status").send({ status: "running" });
    expect(res.status).toBe(409);
  });

  it("can run after approval", async () => {
    await request(app).post("/api/campaigns").send({ id: "CAMP-1", name: "x", ecosystemId: "viral" });
    await request(app).post("/api/campaigns/CAMP-1/approve").send({ approvedBy: "Robin" });
    const res = await request(app).patch("/api/campaigns/CAMP-1/status").send({ status: "running" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("running");
  });
});

describe("approval_queue (the per-asset gate)", () => {
  beforeEach(async () => {
    await request(app).post("/api/tasks").send(TASK);
  });

  it("POST creates a pending approval", async () => {
    const res = await request(app).post("/api/approvals").send({ taskId: "SURGE-001", ecosystemId: "viral", contentType: "clip", artifactPath: "/drafts/zrod-001.mp4" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
  });

  it("GET ?status=pending lists the gate queue", async () => {
    await request(app).post("/api/approvals").send({ taskId: "SURGE-001", ecosystemId: "viral", contentType: "clip" });
    const res = await request(app).get("/api/approvals?status=pending");
    expect(res.body).toHaveLength(1);
  });

  it("PATCH approve sets reviewer + timestamp", async () => {
    const created = await request(app).post("/api/approvals").send({ taskId: "SURGE-001", ecosystemId: "viral", contentType: "clip" });
    const res = await request(app).patch(`/api/approvals/${created.body.id}/status`).send({ status: "approved", reviewedBy: "Robin" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("approved");
    expect(res.body.reviewedBy).toBe("Robin");
    expect(res.body.reviewedAt).toBeTruthy();
  });

  it("approved is terminal -> re-transition 409", async () => {
    const created = await request(app).post("/api/approvals").send({ taskId: "SURGE-001", ecosystemId: "viral", contentType: "clip" });
    await request(app).patch(`/api/approvals/${created.body.id}/status`).send({ status: "approved", reviewedBy: "Robin" });
    const res = await request(app).patch(`/api/approvals/${created.body.id}/status`).send({ status: "rejected", reviewedBy: "Robin" });
    expect(res.status).toBe(409);
  });
});

describe("agent_runs", () => {
  it("POST creates a queued run; PATCH advances status", async () => {
    const created = await request(app).post("/api/agent-runs").send({ id: "RUN-1", taskId: null, agentName: "surge-writer", ecosystemId: "viral" });
    expect(created.status).toBe(201);
    expect(created.body.status).toBe("queued");
    const res = await request(app).patch("/api/agent-runs/RUN-1/status").send({ status: "running" });
    expect(res.body.status).toBe("running");
  });
});
```

- [ ] **Run it — expect FAIL** (routers not found).
```
pnpm test -- engine-tables.test
```

- [ ] **Implement `server/services/tasks.service.ts`.** Complete file:
```ts
import type { Db } from "../db.js";

export type TaskStatus = "backlog" | "todo" | "in-progress" | "blocked" | "in-review" | "done";
export const TASK_STATUSES: TaskStatus[] = ["backlog", "todo", "in-progress", "blocked", "in-review", "done"];

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: string;
  ecosystemId: string;
  verticalId?: string;
  source: string;
  status: TaskStatus;
  priority: string;
  owner?: string;
  agentId?: string;
  parentId?: string;
  linkedIds?: string[];
  campaignId?: string;
  contentType?: string;
  platform?: string;
  autonomyStage: number;
  checklist?: unknown;
  createdAt: string;
  updatedAt: string;
}

interface Row {
  id: string; title: string; description: string | null; type: string;
  ecosystem_id: string; vertical_id: string | null; source: string;
  status: string; priority: string; owner: string | null; agent_id: string | null;
  parent_id: string | null; linked_ids: string | null; campaign_id: string | null;
  content_type: string | null; platform: string | null; autonomy_stage: number;
  checklist: string | null; created_at: string; updated_at: string;
}

function rowToTask(r: Row): Task {
  return {
    id: r.id, title: r.title, description: r.description ?? undefined, type: r.type,
    ecosystemId: r.ecosystem_id, verticalId: r.vertical_id ?? undefined, source: r.source,
    status: r.status as TaskStatus, priority: r.priority, owner: r.owner ?? undefined,
    agentId: r.agent_id ?? undefined, parentId: r.parent_id ?? undefined,
    linkedIds: r.linked_ids ? (JSON.parse(r.linked_ids) as string[]) : undefined,
    campaignId: r.campaign_id ?? undefined, contentType: r.content_type ?? undefined,
    platform: r.platform ?? undefined, autonomyStage: r.autonomy_stage,
    checklist: r.checklist ? JSON.parse(r.checklist) : undefined,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export class TasksService {
  constructor(private db: Db) {}

  list(ecosystemId?: string): Task[] {
    const rows = ecosystemId
      ? (this.db.raw.prepare("SELECT * FROM tasks WHERE ecosystem_id=? ORDER BY created_at DESC").all(ecosystemId) as Row[])
      : (this.db.raw.prepare("SELECT * FROM tasks ORDER BY created_at DESC").all() as Row[]);
    return rows.map(rowToTask);
  }

  get(id: string): Task | undefined {
    const r = this.db.raw.prepare("SELECT * FROM tasks WHERE id=?").get(id) as Row | undefined;
    return r ? rowToTask(r) : undefined;
  }

  create(data: Partial<Task> & { id: string; title: string; type: string; ecosystemId: string }): Task {
    const now = new Date().toISOString();
    this.db.raw
      .prepare(
        `INSERT INTO tasks (id,title,description,type,ecosystem_id,vertical_id,source,status,priority,
           owner,agent_id,parent_id,linked_ids,campaign_id,content_type,platform,autonomy_stage,checklist,
           created_at,updated_at)
         VALUES (@id,@title,@description,@type,@ecosystem_id,@vertical_id,@source,@status,@priority,
           @owner,@agent_id,@parent_id,@linked_ids,@campaign_id,@content_type,@platform,@autonomy_stage,@checklist,
           @created_at,@updated_at)`,
      )
      .run({
        id: data.id, title: data.title, description: data.description ?? null, type: data.type,
        ecosystem_id: data.ecosystemId, vertical_id: data.verticalId ?? null,
        source: data.source ?? "manual", status: data.status ?? "backlog",
        priority: data.priority ?? "medium", owner: data.owner ?? null, agent_id: data.agentId ?? null,
        parent_id: data.parentId ?? null, linked_ids: data.linkedIds ? JSON.stringify(data.linkedIds) : null,
        campaign_id: data.campaignId ?? null, content_type: data.contentType ?? null,
        platform: data.platform ?? null, autonomy_stage: data.autonomyStage ?? 0,
        checklist: data.checklist ? JSON.stringify(data.checklist) : null,
        created_at: now, updated_at: now,
      });
    return this.get(data.id)!;
  }

  hasPendingApproval(taskId: string): boolean {
    const r = this.db.raw
      .prepare("SELECT COUNT(*) c FROM approval_queue WHERE task_id=? AND status='pending'")
      .get(taskId) as { c: number };
    return r.c > 0;
  }

  setStatus(id: string, status: TaskStatus): Task | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    this.db.raw
      .prepare("UPDATE tasks SET status=?, updated_at=? WHERE id=?")
      .run(status, new Date().toISOString(), id);
    return this.get(id);
  }
}
```

- [ ] **Implement `server/services/campaigns.service.ts`.** Complete file:
```ts
import type { Db } from "../db.js";

export type CampaignStatus = "planned" | "running" | "paused" | "review" | "done" | "killed";
export const CAMPAIGN_STATUSES: CampaignStatus[] = ["planned", "running", "paused", "review", "done", "killed"];

export interface Campaign {
  id: string; name: string; ecosystemId: string; verticalId?: string;
  status: CampaignStatus; autonomyStage: number; targetCount: number;
  approvedBy?: string; approvedAt?: string; startedAt?: string; completedAt?: string;
  notes?: string; createdAt: string; updatedAt: string;
}

interface Row {
  id: string; name: string; ecosystem_id: string; vertical_id: string | null;
  status: string; autonomy_stage: number; target_count: number;
  approved_by: string | null; approved_at: string | null; started_at: string | null;
  completed_at: string | null; notes: string | null; created_at: string; updated_at: string;
}

function rowToCampaign(r: Row): Campaign {
  return {
    id: r.id, name: r.name, ecosystemId: r.ecosystem_id, verticalId: r.vertical_id ?? undefined,
    status: r.status as CampaignStatus, autonomyStage: r.autonomy_stage, targetCount: r.target_count,
    approvedBy: r.approved_by ?? undefined, approvedAt: r.approved_at ?? undefined,
    startedAt: r.started_at ?? undefined, completedAt: r.completed_at ?? undefined,
    notes: r.notes ?? undefined, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export class CampaignsService {
  constructor(private db: Db) {}

  list(ecosystemId?: string): Campaign[] {
    const rows = ecosystemId
      ? (this.db.raw.prepare("SELECT * FROM campaigns WHERE ecosystem_id=? ORDER BY created_at DESC").all(ecosystemId) as Row[])
      : (this.db.raw.prepare("SELECT * FROM campaigns ORDER BY created_at DESC").all() as Row[]);
    return rows.map(rowToCampaign);
  }

  get(id: string): Campaign | undefined {
    const r = this.db.raw.prepare("SELECT * FROM campaigns WHERE id=?").get(id) as Row | undefined;
    return r ? rowToCampaign(r) : undefined;
  }

  create(data: { id: string; name: string; ecosystemId: string; verticalId?: string; targetCount?: number; notes?: string }): Campaign {
    const now = new Date().toISOString();
    this.db.raw
      .prepare(
        `INSERT INTO campaigns (id,name,ecosystem_id,vertical_id,status,autonomy_stage,target_count,notes,created_at,updated_at)
         VALUES (@id,@name,@ecosystem_id,@vertical_id,'planned',0,@target_count,@notes,@created_at,@updated_at)`,
      )
      .run({
        id: data.id, name: data.name, ecosystem_id: data.ecosystemId,
        vertical_id: data.verticalId ?? null, target_count: data.targetCount ?? 1,
        notes: data.notes ?? null, created_at: now, updated_at: now,
      });
    return this.get(data.id)!;
  }

  approve(id: string, approvedBy: string): Campaign | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    this.db.raw
      .prepare("UPDATE campaigns SET approved_by=?, approved_at=?, updated_at=? WHERE id=?")
      .run(approvedBy, new Date().toISOString(), new Date().toISOString(), id);
    return this.get(id);
  }

  /** Returns { campaign } on success or { error: 'gate' } when running without approval. */
  setStatus(id: string, status: CampaignStatus): { campaign?: Campaign; gate?: boolean; missing?: boolean } {
    const existing = this.get(id);
    if (!existing) return { missing: true };
    if (status === "running" && !existing.approvedBy) {
      return { gate: true };
    }
    const now = new Date().toISOString();
    const startedAt = status === "running" && !existing.startedAt ? now : existing.startedAt ?? null;
    const completedAt = status === "done" ? now : existing.completedAt ?? null;
    this.db.raw
      .prepare("UPDATE campaigns SET status=?, started_at=?, completed_at=?, updated_at=? WHERE id=?")
      .run(status, startedAt, completedAt, now, id);
    return { campaign: this.get(id) };
  }
}
```

- [ ] **Implement `server/services/approvals.service.ts`.** Complete file:
```ts
import type { Db } from "../db.js";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "changes-requested";
export const APPROVAL_STATUSES: ApprovalStatus[] = ["pending", "approved", "rejected", "changes-requested"];
const TERMINAL: ApprovalStatus[] = ["approved", "rejected"];

export interface Approval {
  id: string; taskId?: string; campaignId?: string; ecosystemId: string;
  contentType?: string; artifactPath?: string; previewUrl?: string; contentJson?: unknown;
  status: ApprovalStatus; reviewedBy?: string; reviewedAt?: string; reviewNotes?: string;
  createdAt: string;
}

interface Row {
  id: string; task_id: string | null; campaign_id: string | null; ecosystem_id: string;
  content_type: string | null; artifact_path: string | null; preview_url: string | null;
  content_json: string | null; status: string; reviewed_by: string | null;
  reviewed_at: string | null; review_notes: string | null; created_at: string;
}

function rowToApproval(r: Row): Approval {
  return {
    id: r.id, taskId: r.task_id ?? undefined, campaignId: r.campaign_id ?? undefined,
    ecosystemId: r.ecosystem_id, contentType: r.content_type ?? undefined,
    artifactPath: r.artifact_path ?? undefined, previewUrl: r.preview_url ?? undefined,
    contentJson: r.content_json ? JSON.parse(r.content_json) : undefined,
    status: r.status as ApprovalStatus, reviewedBy: r.reviewed_by ?? undefined,
    reviewedAt: r.reviewed_at ?? undefined, reviewNotes: r.review_notes ?? undefined,
    createdAt: r.created_at,
  };
}

function genId(): string {
  return `aq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class ApprovalsService {
  constructor(private db: Db) {}

  list(opts: { ecosystemId?: string; status?: string } = {}): Approval[] {
    const clauses: string[] = [];
    const params: unknown[] = [];
    if (opts.ecosystemId) { clauses.push("ecosystem_id=?"); params.push(opts.ecosystemId); }
    if (opts.status) { clauses.push("status=?"); params.push(opts.status); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = this.db.raw.prepare(`SELECT * FROM approval_queue ${where} ORDER BY created_at DESC`).all(...params) as Row[];
    return rows.map(rowToApproval);
  }

  get(id: string): Approval | undefined {
    const r = this.db.raw.prepare("SELECT * FROM approval_queue WHERE id=?").get(id) as Row | undefined;
    return r ? rowToApproval(r) : undefined;
  }

  create(data: { taskId?: string; campaignId?: string; ecosystemId: string; contentType?: string; artifactPath?: string; previewUrl?: string; contentJson?: unknown }): Approval {
    const id = genId();
    this.db.raw
      .prepare(
        `INSERT INTO approval_queue (id,task_id,campaign_id,ecosystem_id,content_type,artifact_path,preview_url,content_json,status,created_at)
         VALUES (@id,@task_id,@campaign_id,@ecosystem_id,@content_type,@artifact_path,@preview_url,@content_json,'pending',@created_at)`,
      )
      .run({
        id, task_id: data.taskId ?? null, campaign_id: data.campaignId ?? null,
        ecosystem_id: data.ecosystemId, content_type: data.contentType ?? null,
        artifact_path: data.artifactPath ?? null, preview_url: data.previewUrl ?? null,
        content_json: data.contentJson !== undefined ? JSON.stringify(data.contentJson) : null,
        created_at: new Date().toISOString(),
      });
    return this.get(id)!;
  }

  /** Transition with gate: terminal statuses cannot be re-transitioned. */
  setStatus(id: string, status: ApprovalStatus, reviewedBy?: string, reviewNotes?: string): { approval?: Approval; terminal?: boolean; missing?: boolean } {
    const existing = this.get(id);
    if (!existing) return { missing: true };
    if (TERMINAL.includes(existing.status)) return { terminal: true };
    const reviewedAt = status === "pending" ? null : new Date().toISOString();
    this.db.raw
      .prepare("UPDATE approval_queue SET status=?, reviewed_by=?, reviewed_at=?, review_notes=? WHERE id=?")
      .run(status, reviewedBy ?? null, reviewedAt, reviewNotes ?? null, id);
    return { approval: this.get(id) };
  }
}
```

- [ ] **Implement `server/services/agentRuns.service.ts`.** Complete file:
```ts
import type { Db } from "../db.js";

export type AgentRunStatus = "queued" | "running" | "waiting" | "done" | "error" | "killed";
export const AGENT_RUN_STATUSES: AgentRunStatus[] = ["queued", "running", "waiting", "done", "error", "killed"];

export interface AgentRun {
  id: string; campaignId?: string; taskId?: string; agentName?: string;
  claudeSessionId?: string; ptySessionId?: string; status: AgentRunStatus;
  cwd?: string; command?: string; startedAt?: string; completedAt?: string;
  outputJson?: unknown; error?: string; ecosystemId?: string;
}

interface Row {
  id: string; campaign_id: string | null; task_id: string | null; agent_name: string | null;
  claude_session_id: string | null; pty_session_id: string | null; status: string;
  cwd: string | null; command: string | null; started_at: string | null;
  completed_at: string | null; output_json: string | null; error: string | null;
}

function rowToRun(r: Row): AgentRun {
  return {
    id: r.id, campaignId: r.campaign_id ?? undefined, taskId: r.task_id ?? undefined,
    agentName: r.agent_name ?? undefined, claudeSessionId: r.claude_session_id ?? undefined,
    ptySessionId: r.pty_session_id ?? undefined, status: r.status as AgentRunStatus,
    cwd: r.cwd ?? undefined, command: r.command ?? undefined, startedAt: r.started_at ?? undefined,
    completedAt: r.completed_at ?? undefined,
    outputJson: r.output_json ? JSON.parse(r.output_json) : undefined, error: r.error ?? undefined,
  };
}

export class AgentRunsService {
  constructor(private db: Db) {}

  list(): AgentRun[] {
    return (this.db.raw.prepare("SELECT * FROM agent_runs ORDER BY rowid DESC").all() as Row[]).map(rowToRun);
  }

  get(id: string): AgentRun | undefined {
    const r = this.db.raw.prepare("SELECT * FROM agent_runs WHERE id=?").get(id) as Row | undefined;
    return r ? rowToRun(r) : undefined;
  }

  create(data: { id: string; campaignId?: string; taskId?: string | null; agentName?: string; cwd?: string; command?: string }): AgentRun {
    this.db.raw
      .prepare(
        `INSERT INTO agent_runs (id,campaign_id,task_id,agent_name,status,cwd,command)
         VALUES (@id,@campaign_id,@task_id,@agent_name,'queued',@cwd,@command)`,
      )
      .run({
        id: data.id, campaign_id: data.campaignId ?? null, task_id: data.taskId ?? null,
        agent_name: data.agentName ?? null, cwd: data.cwd ?? null, command: data.command ?? null,
      });
    return this.get(data.id)!;
  }

  setStatus(id: string, status: AgentRunStatus): AgentRun | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    const now = new Date().toISOString();
    const startedAt = status === "running" && !existing.startedAt ? now : existing.startedAt ?? null;
    const completedAt = ["done", "error", "killed"].includes(status) ? now : existing.completedAt ?? null;
    this.db.raw
      .prepare("UPDATE agent_runs SET status=?, started_at=?, completed_at=? WHERE id=?")
      .run(status, startedAt, completedAt, id);
    return this.get(id);
  }
}
```

- [ ] **Implement the four route files.** `server/routes/tasks.ts`:
```ts
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { TasksService, TASK_STATUSES, type TaskStatus } from "../services/tasks.service.js";

export function createTasksRouter(db: Db): Router {
  const router = Router();
  const svc = new TasksService(db);

  router.get("/", (req: Request, res: Response) => {
    const eco = req.query["ecosystem"] as string | undefined;
    res.json(svc.list(eco === "*" || eco === "all" ? undefined : eco));
  });

  router.post("/", (req: Request, res: Response) => {
    const b = req.body as { id?: string; title?: string; type?: string; ecosystemId?: string };
    if (!b.id || !b.title || !b.type || !b.ecosystemId) {
      res.status(400).json({ error: "Missing required fields: id, title, type, ecosystemId" });
      return;
    }
    if (svc.get(b.id)) {
      res.status(409).json({ error: `Task already exists: ${b.id}` });
      return;
    }
    res.status(201).json(svc.create(b as { id: string; title: string; type: string; ecosystemId: string }));
  });

  router.patch("/:id/status", (req: Request, res: Response) => {
    const id = String(req.params["id"]);
    const status = (req.body as { status?: string }).status;
    if (!status || !TASK_STATUSES.includes(status as TaskStatus)) {
      res.status(400).json({ error: `status must be one of: ${TASK_STATUSES.join(", ")}` });
      return;
    }
    if (!svc.get(id)) { res.status(404).json({ error: `Task not found: ${id}` }); return; }
    if (status === "done" && svc.hasPendingApproval(id)) {
      res.status(409).json({ error: "Cannot complete task with a pending approval" });
      return;
    }
    res.json(svc.setStatus(id, status as TaskStatus));
  });

  return router;
}
```
  `server/routes/campaigns.ts`:
```ts
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { CampaignsService, CAMPAIGN_STATUSES, type CampaignStatus } from "../services/campaigns.service.js";

export function createCampaignsRouter(db: Db): Router {
  const router = Router();
  const svc = new CampaignsService(db);

  router.get("/", (req: Request, res: Response) => {
    const eco = req.query["ecosystem"] as string | undefined;
    res.json(svc.list(eco === "*" || eco === "all" ? undefined : eco));
  });

  router.post("/", (req: Request, res: Response) => {
    const b = req.body as { id?: string; name?: string; ecosystemId?: string };
    if (!b.id || !b.name || !b.ecosystemId) {
      res.status(400).json({ error: "Missing required fields: id, name, ecosystemId" });
      return;
    }
    if (svc.get(b.id)) { res.status(409).json({ error: `Campaign already exists: ${b.id}` }); return; }
    res.status(201).json(svc.create(b as { id: string; name: string; ecosystemId: string }));
  });

  router.post("/:id/approve", (req: Request, res: Response) => {
    const approvedBy = (req.body as { approvedBy?: string }).approvedBy;
    if (!approvedBy) { res.status(400).json({ error: "Missing required field: approvedBy" }); return; }
    const updated = svc.approve(String(req.params["id"]), approvedBy);
    if (!updated) { res.status(404).json({ error: "Campaign not found" }); return; }
    res.json(updated);
  });

  router.patch("/:id/status", (req: Request, res: Response) => {
    const status = (req.body as { status?: string }).status;
    if (!status || !CAMPAIGN_STATUSES.includes(status as CampaignStatus)) {
      res.status(400).json({ error: `status must be one of: ${CAMPAIGN_STATUSES.join(", ")}` });
      return;
    }
    const result = svc.setStatus(String(req.params["id"]), status as CampaignStatus);
    if (result.missing) { res.status(404).json({ error: "Campaign not found" }); return; }
    if (result.gate) { res.status(409).json({ error: "Campaign must be approved before running" }); return; }
    res.json(result.campaign);
  });

  return router;
}
```
  `server/routes/approvals.ts`:
```ts
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { ApprovalsService, APPROVAL_STATUSES, type ApprovalStatus } from "../services/approvals.service.js";

export function createApprovalsRouter(db: Db): Router {
  const router = Router();
  const svc = new ApprovalsService(db);

  router.get("/", (req: Request, res: Response) => {
    const eco = req.query["ecosystem"] as string | undefined;
    res.json(svc.list({
      ecosystemId: eco === "*" || eco === "all" ? undefined : eco,
      status: req.query["status"] as string | undefined,
    }));
  });

  router.post("/", (req: Request, res: Response) => {
    const b = req.body as { ecosystemId?: string };
    if (!b.ecosystemId) { res.status(400).json({ error: "Missing required field: ecosystemId" }); return; }
    res.status(201).json(svc.create(b as { ecosystemId: string }));
  });

  router.patch("/:id/status", (req: Request, res: Response) => {
    const { status, reviewedBy, reviewNotes } = req.body as { status?: string; reviewedBy?: string; reviewNotes?: string };
    if (!status || !APPROVAL_STATUSES.includes(status as ApprovalStatus)) {
      res.status(400).json({ error: `status must be one of: ${APPROVAL_STATUSES.join(", ")}` });
      return;
    }
    const result = svc.setStatus(String(req.params["id"]), status as ApprovalStatus, reviewedBy, reviewNotes);
    if (result.missing) { res.status(404).json({ error: "Approval not found" }); return; }
    if (result.terminal) { res.status(409).json({ error: "Approval is already in a terminal state" }); return; }
    res.json(result.approval);
  });

  return router;
}
```
  `server/routes/agentRuns.ts`:
```ts
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { AgentRunsService, AGENT_RUN_STATUSES, type AgentRunStatus } from "../services/agentRuns.service.js";

export function createAgentRunsRouter(db: Db): Router {
  const router = Router();
  const svc = new AgentRunsService(db);

  router.get("/", (_req: Request, res: Response) => res.json(svc.list()));

  router.post("/", (req: Request, res: Response) => {
    const b = req.body as { id?: string };
    if (!b.id) { res.status(400).json({ error: "Missing required field: id" }); return; }
    if (svc.get(b.id)) { res.status(409).json({ error: `Agent run already exists: ${b.id}` }); return; }
    res.status(201).json(svc.create(b as { id: string }));
  });

  router.patch("/:id/status", (req: Request, res: Response) => {
    const status = (req.body as { status?: string }).status;
    if (!status || !AGENT_RUN_STATUSES.includes(status as AgentRunStatus)) {
      res.status(400).json({ error: `status must be one of: ${AGENT_RUN_STATUSES.join(", ")}` });
      return;
    }
    const updated = svc.setStatus(String(req.params["id"]), status as AgentRunStatus);
    if (!updated) { res.status(404).json({ error: "Agent run not found" }); return; }
    res.json(updated);
  });

  return router;
}
```

- [ ] **Run it — expect PASS.**
```
pnpm test -- engine-tables.test
```
  Expected: all describe blocks green (`Tests 12 passed (12)`).

- [ ] **Run the full suite to confirm no cross-task regressions.**
```
pnpm test
```
  Expected: every prior test file still passes.

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server/services/tasks.service.ts .canon/.mission-control/server/services/campaigns.service.ts .canon/.mission-control/server/services/approvals.service.ts .canon/.mission-control/server/services/agentRuns.service.ts .canon/.mission-control/server/routes/tasks.ts .canon/.mission-control/server/routes/campaigns.ts .canon/.mission-control/server/routes/approvals.ts .canon/.mission-control/server/routes/agentRuns.ts .canon/.mission-control/server/test/engine-tables.test.ts
git -C D:\VFXellence-LTD commit -m "Add engine-facing tables: tasks, campaigns, approvals, agent runs

- Add CRUD + status-transition services for the state machine
- Enforce gate rules: campaign needs approval to run; approvals terminal once decided
- Block task -> done while a pending approval exists
- Scope task/campaign/approval lists by ?ecosystem; cover all rules with supertest"
```

---

## Task 9 — Server `index.ts` wiring, `config.ts`, vault route, WS stub

**Model/effort:** sonnet, high (composition root + boot).
**Worktree:** yes — branch `plan1/task9-index`.

**Files:**
- Create: `.mission-control/server/config.ts`
- Create: `.mission-control/server/services/vault.service.ts`
- Create: `.mission-control/server/routes/vault.ts`
- Create: `.mission-control/server/ws/stub.ws.ts`
- Create: `.mission-control/server/index.ts`
- Test: `.mission-control/server/test/index.test.ts`

### Steps

- [ ] **Write failing test first.** Create `server/test/index.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createDb, type Db } from "../db.js";
import { createApp } from "../index.js";

let db: Db;
let tmpVault: string;
beforeEach(() => {
  db = createDb(":memory:");
  tmpVault = fs.mkdtempSync(path.join(os.tmpdir(), "mc-vault-"));
});
afterEach(() => {
  db.close();
  fs.rmSync(tmpVault, { recursive: true, force: true });
});

describe("createApp wiring", () => {
  it("GET /api/health -> ok", async () => {
    const app = createApp({ db, vaultLaunchesDir: tmpVault });
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("mounts all routers", async () => {
    const app = createApp({ db, vaultLaunchesDir: tmpVault });
    for (const p of ["/api/transactions", "/api/tools", "/api/setup", "/api/launch", "/api/tasks", "/api/campaigns", "/api/approvals", "/api/agent-runs"]) {
      const res = await request(app).get(p);
      expect(res.status).toBeLessThan(500);
    }
  });

  it("POST /api/vault/launches/:filename writes the file", async () => {
    const app = createApp({ db, vaultLaunchesDir: tmpVault });
    const res = await request(app)
      .post("/api/vault/launches/zrodinger.md")
      .set("Content-Type", "text/plain")
      .send("# Launch\n");
    expect(res.status).toBe(200);
    expect(fs.readFileSync(path.join(tmpVault, "zrodinger.md"), "utf-8")).toBe("# Launch\n");
  });

  it("rejects path traversal in vault filename -> 400", async () => {
    const app = createApp({ db, vaultLaunchesDir: tmpVault });
    const res = await request(app).post("/api/vault/launches/..%2Fevil.md").send("x");
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Run it — expect FAIL.**
```
pnpm test -- index.test
```

- [ ] **Implement `server/config.ts`.** Complete file:
```ts
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function envInt(key: string, def: number): number {
  const v = process.env[key];
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isNaN(n) ? def : n;
}
function env(key: string, def: string): string {
  return process.env[key] ?? def;
}

// server/ -> .mission-control/ -> .canon/ -> VFXellence-LTD/
const MC_ROOT = path.resolve(__dirname, "..");           // .mission-control/
const CANON_ROOT = path.resolve(MC_ROOT, "..");          // .canon/
const REPO_ROOT = path.resolve(CANON_ROOT, "..");        // VFXellence-LTD/

export const config = {
  port: envInt("PORT", 4500),
  dbPath: env("DB_PATH", path.join(MC_ROOT, "server", ".data", "mission-control.db")),
  canonPath: env("CANON_PATH", CANON_ROOT),
  vaultPath: env("VAULT_PATH", path.join(REPO_ROOT, "polymath", "vault")),
  vaultLaunchesDir: env(
    "VAULT_LAUNCHES_DIR",
    path.join(REPO_ROOT, "polymath", "vault", "controller", "launches"),
  ),
};

export type Config = typeof config;
```
> Note: the existing client `vaultWritePlugin` resolves launches to `../../vault/controller/launches` relative to the client dir (`.mission-control/client`), i.e. `.canon/vault/controller/launches`. **Decision flagged for Boss:** confirm whether launches live under `.canon/vault/...` (client's current relative path) or `polymath/vault/...` (CLAUDE.md's stated vault home). `config.vaultLaunchesDir` is env-overridable so this can be fixed without code change. Default above assumes `polymath/vault`; if Boss confirms `.canon/vault`, change the default. This does not block the task (test uses a tmp dir).

- [ ] **Implement `server/services/vault.service.ts`.** Complete file:
```ts
import fs from "node:fs";
import path from "node:path";

export class VaultService {
  constructor(private launchesDir: string) {}

  /** Write a launch markdown file. Rejects traversal / nested paths. */
  writeLaunch(filename: string, content: string): { ok: true; path: string } {
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      throw new Error("Invalid filename");
    }
    fs.mkdirSync(this.launchesDir, { recursive: true });
    const filepath = path.join(this.launchesDir, filename);
    fs.writeFileSync(filepath, content, "utf-8");
    return { ok: true, path: filepath };
  }
}
```

- [ ] **Implement `server/routes/vault.ts`.** Complete file (note: accepts text body, so the router adds its own raw/text parser):
```ts
import { Router, type Request, type Response } from "express";
import express from "express";
import { VaultService } from "../services/vault.service.js";

export function createVaultRouter(vaultService: VaultService): Router {
  const router = Router();

  // Accept text/* and application/octet-stream bodies as raw markdown.
  router.use(express.text({ type: ["text/*", "application/octet-stream"], limit: "2mb" }));

  router.post("/launches/:filename", (req: Request, res: Response) => {
    const filename = decodeURIComponent(String(req.params["filename"]));
    const content = typeof req.body === "string" ? req.body : "";
    try {
      const result = vaultService.writeLaunch(filename, content);
      res.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      res.status(msg === "Invalid filename" ? 400 : 500).json({ error: msg });
    }
  });

  return router;
}
```

- [ ] **Implement `server/ws/stub.ws.ts`.** Complete file (accept-only stub; full WS deferred):
```ts
import { WebSocketServer } from "ws";
import type { Server } from "node:http";

/**
 * STUB ONLY (Plan 1). Accepts upgrades on /ws and holds the connection open.
 * No event wiring — full WebSocket broadcast lands in a later plan.
 */
export function setupWebSocketStub(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });
  wss.on("connection", () => {
    /* intentionally empty — stub */
  });
  httpServer.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    if (url.pathname === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
    } else {
      socket.destroy();
    }
  });
  return wss;
}
```

- [ ] **Implement `server/index.ts`.** Complete file:
```ts
import express, { type Express } from "express";
import cors from "cors";
import http from "node:http";
import { config } from "./config.js";
import { getDb, type Db } from "./db.js";
import { createTransactionsRouter } from "./routes/transactions.js";
import { createToolsRouter } from "./routes/tools.js";
import { createSetupRouter } from "./routes/setup.js";
import { createLaunchRouter } from "./routes/launch.js";
import { createTasksRouter } from "./routes/tasks.js";
import { createCampaignsRouter } from "./routes/campaigns.js";
import { createApprovalsRouter } from "./routes/approvals.js";
import { createAgentRunsRouter } from "./routes/agentRuns.js";
import { createVaultRouter } from "./routes/vault.js";
import { VaultService } from "./services/vault.service.js";
import { setupWebSocketStub } from "./ws/stub.ws.js";

export interface AppDeps {
  db: Db;
  vaultLaunchesDir: string;
}

export function createApp(deps: AppDeps): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/transactions", createTransactionsRouter(deps.db));
  app.use("/api/tools", createToolsRouter(deps.db));
  app.use("/api/setup", createSetupRouter(deps.db));
  app.use("/api/launch", createLaunchRouter(deps.db));
  app.use("/api/tasks", createTasksRouter(deps.db));
  app.use("/api/campaigns", createCampaignsRouter(deps.db));
  app.use("/api/approvals", createApprovalsRouter(deps.db));
  app.use("/api/agent-runs", createAgentRunsRouter(deps.db));
  app.use("/api/vault", createVaultRouter(new VaultService(deps.vaultLaunchesDir)));

  return app;
}

export async function startServer(): Promise<void> {
  const db = getDb(config.dbPath);
  const app = createApp({ db, vaultLaunchesDir: config.vaultLaunchesDir });
  const httpServer = http.createServer(app);
  setupWebSocketStub(httpServer); // stub only

  httpServer.listen(config.port, () => {
    console.log(`Polymath Mission Control server running on port ${config.port}`);
    console.log(`DB: ${config.dbPath}`);
  });

  const shutdown = () => {
    db.close();
    httpServer.close(() => process.exit(0));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

// Start only when run directly (not when imported by tests).
const entry = process.argv[1] ?? "";
if (entry.endsWith("index.ts") || entry.endsWith("index.js")) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}
```

- [ ] **Run it — expect PASS.**
```
pnpm test -- index.test
```
  Expected: `Tests 4 passed (4)`.

- [ ] **Smoke-boot the real server** (uses the file DB + real config). From `.mission-control/server`:
```
node --import tsx index.ts
```
  Expect stdout `Polymath Mission Control server running on port 4500`. In another shell verify:
```
curl http://localhost:4500/api/health
curl http://localhost:4500/api/tools
```
  First returns `{"status":"ok",...}`; second returns the seeded tools JSON. Then stop the process (Ctrl+C).

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server/config.ts .canon/.mission-control/server/services/vault.service.ts .canon/.mission-control/server/routes/vault.ts .canon/.mission-control/server/ws/stub.ws.ts .canon/.mission-control/server/index.ts .canon/.mission-control/server/test/index.test.ts
git -C D:\VFXellence-LTD commit -m "Wire Mission Control server index, config, vault route, WS stub

- Add config.ts (PORT 4500, DB_PATH, CANON/VAULT paths, env-overridable)
- Add createApp(deps) mounting all 8 API routers + /api/health
- Add /api/vault/launches/:filename write route with traversal guard
- Add accept-only WebSocket stub on /ws (full WS deferred to later plan)
- Add startServer() with file DB, singleton, graceful shutdown"
```

---

## Task 10 — Migrate the 4 client hooks to fetch + vite proxy + vaultWrite rewire

**Model/effort:** sonnet, high (client integration; return-shape preservation is the contract).
**Worktree:** yes — branch `plan1/task10-client`.

**Async migration pattern (apply to all 4 hooks):**
- Keep the SAME `useState` local store the component reads (`transactions`, `tools`, etc.) — return shapes are byte-for-byte identical.
- On mount, `useEffect(() => { fetch(GET).then(setState) }, [])` does the initial load (replacing `loadFromStorage`).
- Mutators become **optimistic**: update local state immediately (so call-sites stay synchronous from the component's view), then fire the matching `fetch` in the background; on fetch failure, log and (optionally) re-fetch to resync. This preserves the existing synchronous call-site ergonomics.
- A tiny `src/lib/api.ts` wraps fetch + JSON + base path `/api` (proxied by vite to 4500). No component changes required.

**Files:**
- Create: `.mission-control/client/src/lib/api.ts`
- Modify: `.mission-control/client/src/hooks/useTransactions.ts`
- Modify: `.mission-control/client/src/hooks/useTools.ts`
- Modify: `.mission-control/client/src/hooks/useSetupProgress.ts`
- Modify: `.mission-control/client/src/hooks/useLaunchProgress.ts`
- Modify: `.mission-control/client/vite.config.ts`
- Test: (manual boot-both verification in Task 11; hooks verified by type-check + runtime). Add a lightweight vitest for `api.ts` is optional — client has no vitest configured, so keep client verification to `tsc -b` + browser smoke.

> **Verification for this task** is `tsc -b` (type-check proves return shapes still satisfy every call-site) plus the boot-both browser smoke in Task 11. Do NOT add a client test runner in this plan.

### Steps

- [ ] **Create `client/src/lib/api.ts`.** Complete file:
```ts
const BASE = "/api";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => fetch(`${BASE}${path}`).then((r) => handle<T>(r)),
  post: <T>(path: string, body: unknown) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  put: <T>(path: string, body: unknown) =>
    fetch(`${BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  patch: <T>(path: string, body: unknown) =>
    fetch(`${BASE}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  del: <T>(path: string) => fetch(`${BASE}${path}`, { method: "DELETE" }).then((r) => handle<T>(r)),
};
```

- [ ] **Rewrite `client/src/hooks/useTransactions.ts`** (same return shape; fetch-backed, optimistic). Complete file:
```ts
import { useState, useCallback, useEffect } from "react";
import type { Transaction, TransactionType, EcosystemId, StreamId } from "@/types";
import { api } from "@/lib/api";

export interface NewTransaction {
  date: string;
  amount: number;
  ecosystemId: EcosystemId;
  stream: StreamId;
  description: string;
  type: TransactionType;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get<Transaction[]>("/transactions").then(setTransactions).catch(console.error);
  }, []);

  const addTransaction = useCallback((data: NewTransaction) => {
    api
      .post<Transaction>("/transactions", data)
      .then((created) => setTransactions((prev) => [created, ...prev]))
      .catch(console.error);
  }, []);

  const updateTransaction = useCallback((id: string, data: Partial<NewTransaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    api.put<Transaction>(`/transactions/${id}`, data).catch(console.error);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    api.del(`/transactions/${id}`).catch(console.error);
  }, []);

  const importTransactions = useCallback((incoming: NewTransaction[]) => {
    api
      .post<Transaction[]>("/transactions/import", incoming)
      .then((created) => setTransactions((prev) => [...created, ...prev]))
      .catch(console.error);
  }, []);

  const exportCSV = useCallback(() => {
    const headers = ["date", "ecosystem", "stream", "description", "amount", "type"];
    const rows = transactions.map((t) => [
      t.date,
      t.ecosystemId,
      t.stream,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      t.type,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `polymath-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [transactions]);

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    importTransactions,
    exportCSV,
    totalIncome,
    totalExpenses,
    netProfit,
  };
}
```

- [ ] **Rewrite `client/src/hooks/useTools.ts`** (same return shape). Complete file:
```ts
import { useState, useCallback, useEffect } from "react";
import type { Tool, ToolStatus, EcosystemId } from "@/types";
import { api } from "@/lib/api";

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    api.get<Tool[]>("/tools").then(setTools).catch(console.error);
  }, []);

  const updateToolStatus = useCallback((id: string, status: ToolStatus) => {
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    api.put<Tool>(`/tools/${id}/status`, { status }).catch(console.error);
  }, []);

  const activeTools = tools.filter((t) => t.status === "active");
  const monthlyBurn = activeTools.reduce((sum, t) => sum + t.costPerMonth, 0);

  const toolsByEcosystem = useCallback(
    (ecosystemId: EcosystemId) => tools.filter((t) => t.ecosystems.includes(ecosystemId)),
    [tools],
  );

  return { tools, activeTools, monthlyBurn, updateToolStatus, toolsByEcosystem };
}
```

- [ ] **Rewrite `client/src/hooks/useSetupProgress.ts`** (same return shape). Complete file:
```ts
import { useState, useCallback, useEffect } from "react";
import type { SetupProgress, EcosystemId } from "@/types";
import { api } from "@/lib/api";

export function useSetupProgress() {
  const [progress, setProgress] = useState<SetupProgress>({});

  useEffect(() => {
    api.get<SetupProgress>("/setup").then(setProgress).catch(console.error);
  }, []);

  const toggleStep = useCallback((stepId: string) => {
    setProgress((prev) => ({ ...prev, [stepId]: !prev[stepId] })); // optimistic
    api.post<SetupProgress>("/setup/toggle", { stepId }).then(setProgress).catch(console.error);
  }, []);

  const isComplete = useCallback((stepId: string) => !!progress[stepId], [progress]);

  const completedCount = useCallback(
    (stepIds: string[]) => stepIds.filter((id) => progress[id]).length,
    [progress],
  );

  const getEcosystemProgress = useCallback(
    (_ecosystemId: EcosystemId, stepIds: string[]) => {
      const total = stepIds.length;
      const completed = stepIds.filter((id) => progress[id]).length;
      return { total, completed, percent: total > 0 ? (completed / total) * 100 : 0 };
    },
    [progress],
  );

  return { progress, toggleStep, isComplete, completedCount, getEcosystemProgress };
}
```

- [ ] **Rewrite `client/src/hooks/useLaunchProgress.ts`** (same return shape; server stores flat composite keys, client keeps nested maps). Complete file:
```ts
import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";

interface LaunchState {
  [verticalKey: string]: { [stepId: string]: boolean };
}
interface LaunchData {
  [verticalKey: string]: { [fieldKey: string]: string };
}
interface LaunchPayload {
  progress: LaunchState;
  data: LaunchData;
}

export function useLaunchProgress() {
  const [state, setState] = useState<LaunchState>({});
  const [data, setData] = useState<LaunchData>({});

  useEffect(() => {
    api
      .get<LaunchPayload>("/launch")
      .then((p) => {
        setState(p.progress ?? {});
        setData(p.data ?? {});
      })
      .catch(console.error);
  }, []);

  const getVerticalKey = (ecosystemId: string, verticalId: string) => `${ecosystemId}:${verticalId}`;

  const isComplete = useCallback(
    (ecosystemId: string, verticalId: string, stepId: string) =>
      state[getVerticalKey(ecosystemId, verticalId)]?.[stepId] ?? false,
    [state],
  );

  const toggleStep = useCallback((ecosystemId: string, verticalId: string, stepId: string) => {
    const key = getVerticalKey(ecosystemId, verticalId);
    setState((prev) => {
      const vs = prev[key] ?? {};
      return { ...prev, [key]: { ...vs, [stepId]: !vs[stepId] } };
    });
    api.post<LaunchPayload>("/launch/toggle", { verticalKey: key, stepId })
      .then((p) => setState(p.progress ?? {}))
      .catch(console.error);
  }, []);

  const getProgress = useCallback(
    (ecosystemId: string, verticalId: string, stepIds: string[]) => {
      const vs = state[getVerticalKey(ecosystemId, verticalId)] ?? {};
      const completed = stepIds.filter((id) => vs[id]).length;
      return {
        completed,
        total: stepIds.length,
        percent: stepIds.length > 0 ? Math.round((completed / stepIds.length) * 100) : 0,
      };
    },
    [state],
  );

  const getFieldValue = useCallback(
    (ecosystemId: string, verticalId: string, stepId: string, fieldKey: string) =>
      data[getVerticalKey(ecosystemId, verticalId)]?.[`${stepId}.${fieldKey}`] ?? "",
    [data],
  );

  const setFieldValue = useCallback(
    (ecosystemId: string, verticalId: string, stepId: string, fieldKey: string, value: string) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      const compositeKey = `${stepId}.${fieldKey}`;
      setData((prev) => ({ ...prev, [key]: { ...(prev[key] ?? {}), [compositeKey]: value } }));
      api.put<LaunchPayload>("/launch/field", { verticalKey: key, fieldKey: compositeKey, value })
        .then((p) => setData(p.data ?? {}))
        .catch(console.error);
    },
    [],
  );

  const getAllData = useCallback(
    (ecosystemId: string, verticalId: string) => data[getVerticalKey(ecosystemId, verticalId)] ?? {},
    [data],
  );

  const exportData = useCallback(
    (ecosystemId: string, verticalId: string) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      return {
        ecosystem: ecosystemId,
        vertical: verticalId,
        progress: state[key] ?? {},
        data: data[key] ?? {},
        exportedAt: new Date().toISOString(),
      };
    },
    [state, data],
  );

  const exportMarkdown = useCallback(
    (
      ecosystemId: string,
      verticalId: string,
      steps: { id: string; title: string; fields?: { key: string; label: string; sensitive?: boolean }[] }[],
    ) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      const vs = state[key] ?? {};
      const vd = data[key] ?? {};
      const lines: string[] = [
        `# Launch Data — ${ecosystemId} / ${verticalId}`,
        "",
        `**Exported:** ${new Date().toISOString().slice(0, 10)}`,
        "",
        "---",
        "",
      ];
      for (const step of steps) {
        lines.push(`## [${vs[step.id] ? "x" : " "}] ${step.title}`, "");
        if (step.fields) {
          for (const field of step.fields) {
            const value = vd[`${step.id}.${field.key}`] ?? "";
            lines.push(field.sensitive ? `- **${field.label}:** [REDACTED]` : `- **${field.label}:** ${value || "(not set)"}`);
          }
          lines.push("");
        }
      }
      return lines.join("\n");
    },
    [state, data],
  );

  return {
    isComplete,
    toggleStep,
    getProgress,
    getFieldValue,
    setFieldValue,
    getAllData,
    exportData,
    exportMarkdown,
  };
}
```

- [ ] **Rewire `client/vite.config.ts`** — add `/api` proxy to 4500 and change `vaultWritePlugin` to proxy `PUT /__vault/*` to `POST /api/vault/launches/:filename` instead of writing disk directly. Replace the whole file:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import type { Plugin } from 'vite'

const SERVER_ORIGIN = 'http://localhost:4500'

// Proxy the legacy PUT /__vault/<filename> calls to the server's vault route.
function vaultWritePlugin(): Plugin {
  return {
    name: 'vault-write-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/__vault/') || req.method !== 'PUT') {
          return next()
        }
        const filename = decodeURIComponent(req.url.replace('/__vault/', ''))
        if (filename.includes('..') || filename.includes('/')) {
          res.statusCode = 400
          res.end('Invalid filename')
          return
        }
        const chunks: Buffer[] = []
        req.on('data', (chunk: Buffer) => chunks.push(chunk))
        req.on('end', () => {
          const content = Buffer.concat(chunks).toString('utf-8')
          fetch(`${SERVER_ORIGIN}/api/vault/launches/${encodeURIComponent(filename)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: content,
          })
            .then(async (r) => {
              res.statusCode = r.status
              res.end(await r.text())
            })
            .catch((err) => {
              res.statusCode = 502
              res.end(String(err))
            })
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), vaultWritePlugin()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: SERVER_ORIGIN,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Type-check the client — expect PASS** (proves no call-site broke). From `.mission-control/client`:
```
pnpm install
pnpm exec tsc -b
```
  Expected: no errors. (If `@/lib/api` resolution fails, confirm the `@` alias and that `src/lib/api.ts` exists.)

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/client/src/lib/api.ts .canon/.mission-control/client/src/hooks/useTransactions.ts .canon/.mission-control/client/src/hooks/useTools.ts .canon/.mission-control/client/src/hooks/useSetupProgress.ts .canon/.mission-control/client/src/hooks/useLaunchProgress.ts .canon/.mission-control/client/vite.config.ts
git -C D:\VFXellence-LTD commit -m "Migrate dashboard hooks from localStorage to server fetch

- Add src/lib/api.ts fetch wrapper over /api (vite-proxied to 4500)
- Convert useTransactions/useTools/useSetupProgress/useLaunchProgress to fetch
- Preserve exact hook return shapes; load on mount, optimistic mutators
- Add vite /api proxy; rewire vaultWritePlugin to POST /api/vault/launches"
```

---

## Task 11 — `concurrently` dev script + boot-both verification

**Model/effort:** sonnet, medium (dev orchestration + end-to-end manual smoke).
**Worktree:** yes — branch `plan1/task11-concurrently`.

**Files:**
- Create: `.mission-control/package.json` (root holder for the combined dev script + pnpm build-approval config)

### Steps

- [ ] **Create `.mission-control/package.json`.** Complete file:
```json
{
  "name": "polymath-mission-control",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "concurrently -n server,client -c blue,magenta \"pnpm --dir server dev\" \"pnpm --dir client dev\"",
    "dev:server": "pnpm --dir server dev",
    "dev:client": "pnpm --dir client dev",
    "test": "pnpm --dir server test",
    "build": "pnpm --dir server build && pnpm --dir client build"
  },
  "devDependencies": {
    "concurrently": "^9.1.0"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["better-sqlite3"]
  }
}
```
> `pnpm.onlyBuiltDependencies` makes the better-sqlite3 native build non-interactive on fresh installs (complements Task 1's `approve-builds`).

- [ ] **Install the root dev dep.** From `.mission-control`:
```
pnpm install
```

- [ ] **Boot both processes.** From `.mission-control`:
```
pnpm dev
```
  Expect two colored streams: `server` prints `...running on port 4500`; `client` prints the Vite `Local: http://localhost:5174/` line.

- [ ] **Boot-both verification (manual smoke).** With both running:
  1. `curl http://localhost:4500/api/health` -> `{"status":"ok",...}`.
  2. Open `http://localhost:5174` in a browser. The Tools page must render the seeded tools (proves client -> vite proxy -> server -> SQLite path works).
  3. On the Transactions page, add a transaction; confirm it appears, then reload the page — it must persist (proves it round-trips to SQLite, not localStorage).
  4. Confirm `.canon/.mission-control/server/.data/mission-control.db` now exists on disk.
  5. Stop with Ctrl+C; both processes exit.

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/package.json
git -C D:\VFXellence-LTD commit -m "Add combined dev script booting server and client together

- Add .mission-control/package.json with concurrently dev script
- Run server (4500) and client (5174) in one command
- Pin better-sqlite3 in pnpm.onlyBuiltDependencies for non-interactive installs"
```

---

## Task 12 (optional / last) — brands + platform_accounts for EntityPage

**Model/effort:** sonnet, high (only if it doesn't bloat the milestone; defer freely).
**Worktree:** yes — branch `plan1/task12-entity`.

**Contract:** client `interface Brand { id; name; ecosystemId; email; accounts: PlatformAccount[] }`, `interface PlatformAccount { platform; handle; email; trackingId?; status; notes?; url?; maxAccounts? }`, `interface Entity { llc; ein; bank; phone; parentBrand; domain; brands: Brand[]; sharedAccounts: PlatformAccount[] }`. The server assembles the nested `Entity` from `brands` + `platform_accounts` (brand_id NULL => shared). The static entity header fields (`llc`/`ein`/etc.) come from `client/src/data/entity.ts` and are NOT persisted in this plan — only `brands` + `accounts` move to SQLite. EntityPage currently reads a static `ENTITY` import; this task adds a `/api/entity` GET returning the assembled `Entity` and (if time) seeds brands/accounts from `entity.ts`. **EntityPage itself is NOT rewired in this plan** unless trivial — surface that as a follow-up. Keep the table + endpoint; defer the page swap.

**Files:**
- Create: `.mission-control/server/services/entity.service.ts`
- Create: `.mission-control/server/routes/entity.ts`
- Test: `.mission-control/server/test/entity.test.ts`
- Modify: `.mission-control/server/index.ts` (mount `/api/entity`)

### Steps

- [ ] **Write failing test first.** Create `server/test/entity.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createEntityRouter } from "../routes/entity.js";

let db: Db;
let app: express.Express;
beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/entity", createEntityRouter(db));
});
afterEach(() => db.close());

describe("entity API", () => {
  it("GET returns brands + sharedAccounts assembled", async () => {
    db.raw.prepare("INSERT INTO brands (id,name,ecosystem_id,email) VALUES ('surge','Surge','viral','s@x.com')").run();
    db.raw.prepare("INSERT INTO platform_accounts (brand_id,platform,handle,status) VALUES ('surge','tiktok','@surge','active')").run();
    db.raw.prepare("INSERT INTO platform_accounts (brand_id,platform,handle,status) VALUES (NULL,'stripe','llc','pending')").run();
    const res = await request(app).get("/api/entity");
    expect(res.status).toBe(200);
    const surge = res.body.brands.find((b: any) => b.id === "surge");
    expect(surge.accounts[0].platform).toBe("tiktok");
    expect(surge.accounts[0].trackingId).toBeUndefined();
    expect(res.body.sharedAccounts).toHaveLength(1);
    expect(res.body.sharedAccounts[0].platform).toBe("stripe");
  });

  it("POST /brands creates a brand", async () => {
    const res = await request(app).post("/api/entity/brands").send({ id: "signal", name: "Signal", ecosystemId: "content", email: "s@x.com" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe("signal");
  });
});
```

- [ ] **Run it — expect FAIL.**
```
pnpm test -- entity.test
```

- [ ] **Implement `server/services/entity.service.ts`.** Complete file:
```ts
import type { Db } from "../db.js";

export interface PlatformAccount {
  platform: string; handle: string; email: string; trackingId?: string;
  status: "active" | "pending" | "not-started"; notes?: string; url?: string; maxAccounts?: string;
}
export interface Brand {
  id: string; name: string; ecosystemId: string; email: string; accounts: PlatformAccount[];
}
export interface EntityPayload {
  brands: Brand[]; sharedAccounts: PlatformAccount[];
}

interface AccRow {
  id: number; brand_id: string | null; platform: string; handle: string; email: string;
  tracking_id: string | null; status: string; notes: string | null; url: string | null; max_accounts: string | null;
}

function rowToAccount(r: AccRow): PlatformAccount {
  return {
    platform: r.platform, handle: r.handle, email: r.email,
    trackingId: r.tracking_id ?? undefined, status: r.status as PlatformAccount["status"],
    notes: r.notes ?? undefined, url: r.url ?? undefined, maxAccounts: r.max_accounts ?? undefined,
  };
}

export class EntityService {
  constructor(private db: Db) {}

  getEntity(): EntityPayload {
    const brandRows = this.db.raw.prepare("SELECT * FROM brands ORDER BY name").all() as Array<{
      id: string; name: string; ecosystem_id: string; email: string;
    }>;
    const accs = this.db.raw.prepare("SELECT * FROM platform_accounts").all() as AccRow[];
    const brands: Brand[] = brandRows.map((b) => ({
      id: b.id, name: b.name, ecosystemId: b.ecosystem_id, email: b.email,
      accounts: accs.filter((a) => a.brand_id === b.id).map(rowToAccount),
    }));
    const sharedAccounts = accs.filter((a) => a.brand_id === null).map(rowToAccount);
    return { brands, sharedAccounts };
  }

  createBrand(data: { id: string; name: string; ecosystemId: string; email?: string }): Brand {
    this.db.raw
      .prepare("INSERT INTO brands (id,name,ecosystem_id,email) VALUES (?,?,?,?)")
      .run(data.id, data.name, data.ecosystemId, data.email ?? "");
    return { id: data.id, name: data.name, ecosystemId: data.ecosystemId, email: data.email ?? "", accounts: [] };
  }
}
```

- [ ] **Implement `server/routes/entity.ts`.** Complete file:
```ts
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { EntityService } from "../services/entity.service.js";

export function createEntityRouter(db: Db): Router {
  const router = Router();
  const svc = new EntityService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json(svc.getEntity());
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/brands", (req: Request, res: Response) => {
    const b = req.body as { id?: string; name?: string; ecosystemId?: string; email?: string };
    if (!b.id || !b.name || !b.ecosystemId) {
      res.status(400).json({ error: "Missing required fields: id, name, ecosystemId" });
      return;
    }
    try {
      res.status(201).json(svc.createBrand(b as { id: string; name: string; ecosystemId: string }));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  return router;
}
```

- [ ] **Mount in `server/index.ts`.** Add import and mount line in `createApp`:
```ts
import { createEntityRouter } from "./routes/entity.js";
// ...inside createApp, after the other app.use(...) lines:
  app.use("/api/entity", createEntityRouter(deps.db));
```
  Re-run the index test to confirm no regression:
```
pnpm test -- index.test
```

- [ ] **Run it — expect PASS.**
```
pnpm test -- entity.test
```
  Expected: `Tests 2 passed (2)`.

- [ ] **Commit.**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server/services/entity.service.ts .canon/.mission-control/server/routes/entity.ts .canon/.mission-control/server/test/entity.test.ts .canon/.mission-control/server/index.ts
git -C D:\VFXellence-LTD commit -m "Add entity API backing EntityPage (brands + platform accounts)

- Add EntityService assembling nested Entity from brands + platform_accounts
- brand_id NULL => shared account; map columns to client interfaces
- Add /api/entity GET and POST /brands; mount in index
- EntityPage rewire deferred to a follow-up (static header fields remain in entity.ts)"
```

---

## Vault update (append to every work-subagent brief)

After each task's commit, the executing subagent updates:
- **Changelog:** `D:\VFXellence-LTD\.canon\4_orchestrator\changelogs\<today>.md` — one bullet per task (what shipped, test count, commit hash).
- **Project tracker:** `D:\VFXellence-LTD\.canon\4_orchestrator\projects\polymath-business\` — mark the task checkbox done; note any deviation or flagged decision (e.g., the vault launches path question from Task 9).
Keep structured detail in these files, not in the main chat.

---

## Self-Review

### Spec coverage (every required element present?)
- [x] Standalone server at `.canon/.mission-control/server/` beside `client/` — Task 1, 9.
- [x] Node + Express 5 + better-sqlite3 on PORT 4500 — config.ts (Task 9), package.json (Task 1).
- [x] `pnpm approve-builds` / rebuild for the deferred native binding — Task 1 (early) + Task 11 `onlyBuiltDependencies`.
- [x] One SQLite DB, WAL + foreign_keys ON, migrate = CREATE TABLE IF NOT EXISTS + try/catch ALTER — Task 2.
- [x] All required tables: tasks, campaigns, approval_queue, agent_runs, transactions, tools, setup_progress, launch_state, launch_data, brands, platform_accounts — Task 2 (+ entity in Task 12).
- [x] Indexes on tasks(status, ecosystem_id, campaign_id), approval_queue(status), transactions(ecosystem_id) — Task 2.
- [x] Brand-isolation scoping middleware + per-ecosystem SQL views; test proving a scoped query can't read another ecosystem — Task 3.
- [x] Cross-ecosystem only via explicit controller override flag — `allowCrossEcosystem` (Task 3), `?ecosystem=*` opt-in (Task 8).
- [x] Seed financial tables from INITIAL_TOOLS on first run if empty — Task 5 (`seedTools`, idempotent).
- [x] 4 hooks migrated localStorage -> fetch, return shapes preserved — Task 10 (each return object cross-checked field-by-field against the captured originals).
- [x] Hooks become async via initial load + optimistic local state — documented + implemented in Task 10.
- [x] vite `server.proxy` `/api` -> 4500 — Task 10.
- [x] vaultWritePlugin rewired from disk write -> proxy to `POST /api/vault/launches/:filename` — Task 10 + route in Task 9.
- [x] WebSocket stubbed only — Task 9 (`stub.ws.ts`, accept-only).
- [x] `concurrently` dev script booting server + client — Task 11.
- [x] DB file at `server/.data/mission-control.db`, gitignored (`**/.data/`, `*.db` confirmed present) — Task 1, 9.
- [x] tsconfig.server.json, config.ts (PORT, DB_PATH, CANON_PATH, VAULT_PATH), db.ts, scoping.ts, routes/, services/ — Tasks 1, 2, 3, 9.
- [x] CMC patterns mirrored (Database ctor, pragmas, getDb/createDb, createXRouter factory, thin handlers + service classes, `{error}` 400/404/500) — Tasks 2–9. No Jira/AYON specifics copied.
- [x] brands + platform_accounts as the LAST task, deferrable — Task 12.

### No placeholders
Every code step contains complete TypeScript/JSON — no `// TODO`, no `...`, no stubbed function bodies (the WS stub is intentionally empty by spec). All paths are absolute in git commands and exact-relative in file headers. All commands are concrete with expected output.

### Type consistency (SQLite columns ↔ client TS interfaces ↔ API JSON)
- **Transaction:** DB `ecosystem_id/listing_id` ↔ API/client `ecosystemId/listingId`; `amount REAL` ↔ `number`; `type` enum `income|expense` matches client `TransactionType`. `NewTransaction` (no id) matches the POST body. ✔ (Task 4 mapper + Task 10 hook).
- **Tool:** DB `cost_per_month/ecosystems(JSON)` ↔ `costPerMonth: number / ecosystems: EcosystemId[]`; `status` enum matches `ToolStatus`. Derived `activeTools/monthlyBurn/toolsByEcosystem` stay client-side over the same `tools` array — shape unchanged. ✔ (Tasks 5, 10).
- **SetupProgress:** DB `setup_progress(step_id, done INT)` ↔ client `{ [stepId]: boolean }` (done 0/1 ↔ bool in service). ✔ (Tasks 6, 10).
- **Launch:** DB composite-key tables ↔ client nested maps; `verticalKey=${eco}:${vert}`, `fieldKey=${step}.${field}` honored on both sides. Server returns `{progress, data}`; hook reconstructs. `exportData/exportMarkdown` unchanged. ✔ (Tasks 7, 10).
- **Task/Campaign/Approval/AgentRun:** every snake_case column has a camelCase mapper field; enums match the spec verbatim; gate rules return 409. ✔ (Task 8).
- **Brand/PlatformAccount/Entity:** mappers produce exactly the client interface fields (`trackingId`, `maxAccounts`, etc.); `brand_id NULL => sharedAccounts`. ✔ (Task 12).

### Risks / decisions flagged for the reviewer
1. **Vault launches path ambiguity (Task 9).** Client's current `vaultWritePlugin` resolves to `.canon/vault/controller/launches`; CLAUDE.md says the vault lives at `polymath/vault/`. `config.vaultLaunchesDir` is env-overridable and the plan flags this for Boss to confirm; default assumes `polymath/vault`. Non-blocking (tests use tmp dirs) but must be reconciled before the vaultWrite path is trusted in dev.
2. **better-sqlite3 native build (Task 1).** If `pnpm approve-builds` is non-interactive in an agent shell, the `onlyBuiltDependencies` config (Task 11) + `pnpm rebuild` is the deterministic fallback. The verification `node -e` one-liner is the gate — do not proceed past Task 1 if the binding doesn't load.
3. **Client has no test runner.** Hook migration is verified by `tsc -b` (return-shape contract) + the Task 11 browser smoke, not unit tests. Acceptable for this plan; a client vitest setup is a candidate for a later plan if hook logic grows.
4. **Optimistic mutators swallow server errors to `console.error`.** Matches "preserve sync call-site ergonomics" but means a failed write won't surface in UI. Fine for single-user local dev; revisit when the Approval Queue UI (Plan 2) needs hard consistency.
5. **Scoping is enforced at the service/route layer, not by a global middleware on every route.** The financial routes (transactions) are single-user and currently unscoped on read (they return all rows); the engine tables enforce `?ecosystem=`. The per-ecosystem VIEWS + `scopedSelect` exist and are tested, but wiring every read through them is deferred where the dashboard expects all-ecosystem aggregates (e.g. total burn across ecosystems). Flagged so the reviewer knows isolation is proven at the primitive level and applied where the engine needs it, not blanket-applied.
6. **Express 5 routing:** `req.params` access uses bracket notation (`req.params["id"]`) to satisfy `noUncheckedIndexedAccess`-style strictness and Express 5's typing; confirmed against CMC patterns.
