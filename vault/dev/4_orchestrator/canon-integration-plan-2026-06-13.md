# Canon Integration Plan — Polymath

**Date:** 2026-06-13
**Author:** Orchestrator (for Boss — Robin Dutta)
**Status:** Proposal for Boss approval before any stamping or scaffolding

---

## Firm Boss decisions (do not relitigate)

These are settled. Everything below is built around them.

- **MVP campaign:** Surge / Zrodinger.
- **Human-approval gate:** PER-ASSET — Boss approves each clip before publish.
- **State home:** dashboard SQLite backend (not localStorage, not vault markdown).
- **First milestone:** the engine produces ONE approved Zrodinger clip **DRAFT** — no publish, no social accounts needed.
- **Autonomy is staged:** Stage 0 manual -> Stage 1 assisted -> Stage 2 supervised -> Stage 3 bounded-auto. **Publish always stays human**, at every stage.
- **Directive:** STAMP a new `_canon` instance from `D:\dev\halon-rdutta\_canon_factory`; AMALGAMATE polymath with Mission Control; DROP Jira; use SQLite for issue tracking across all 5 ecosystems.

---

## 1. Stamp plan — instancing `_canon` for Polymath

### Target location

```
D:\VFXellence-LTD\polymath\.canon\
```

Top-level of the monorepo, sibling to `apps/`, `packages/`, `vault/`. This mirrors how Halon's `.canon` sits at the workspace root and lets the future Mission Control mount it by an absolute `CANON_PATH` exactly the way CMC does today.

### Source

`D:\dev\halon-rdutta\_canon_factory\_canon\` — copy `1_controller/`, `2_architect/`, `3_notes/`, `4_orchestrator/`, `5_knowledge/`, `CLAUDE.md`, `README.md`, and `.claude/settings.local.json`. Exclude `.git/`, `.claude/skills/` (the canon-init stamping skill, not needed in the instance), `ui/`, `instance/`, `.gitignore`.

### Placeholder substitution table (Polymath values)

| Placeholder | Polymath value |
|---|---|
| `{{INSTANCE_NAME}}` | `polymath.canon` |
| `{{CANON_PATH}}` | `D:/VFXellence-LTD/polymath/.canon` |
| `{{WORKSPACE_PATH}}` | `D:/VFXellence-LTD/polymath` |
| `{{WORKSPACE_NAME}}` | `polymath` |
| `{{SUPERVISOR_NAME}}` | `Robin Dutta` |
| `{{SUPERVISOR_TITLE}}` | `Boss` |
| `{{SUPERVISOR_EMAIL}}` | `rdutta@halon.com` |
| `{{SUPERVISOR_GIT_USER}}` | `rhdutta` |
| `{{STUDIO_NAME}}` | `VFXellence` |
| `{{STUDIO_ORG_NAME}}` | `VFXellence-LTD` |
| `{{STUDIO_PREFIX}}` | *(empty)* |
| `{{TEAM_NAME}}` / `{{TEAM_NAME_SLUG}}` | *(empty)* |
| `{{GITHUB_ORG_SSH}}` | `git@github.com:VFXellence-LTD/` |
| `{{GITHUB_ORG_URL}}` | `github.com/VFXellence-LTD/` |
| `{{MAIN_ADDON_SLUG}}` | `dashboard` |
| `{{DEV_SERVER_URL}}` | `localhost:5173` |
| `{{PROD_SERVER_URL}}` / `_ALT` | *(TBD — leave blank)* |
| `{{TECH_STACK}}` | `TypeScript, React 19, Vite 8, SQLite, pnpm` |
| `{{DCC_LIST}}` | *(remove field)* |
| `{{PROJECT_KEY}}` / `{{IT_PROJECT_KEY}}` / `{{TECHREQ_KEY}}` | *(omit — no Jira)* |
| All Jira custom-field IDs | *(omit — no Jira)* |
| `{{SENTRY_DSN}}` | *(blank for now)* |
| `{{PROJECT_NAME}}` | `polymath` |
| `{{PROJECT_DESCRIPTION}}` | `AI-driven passive-income business monorepo (5 ecosystems)` |

### Jira teardown (MODULE_JIRA = false)

- **Delete** `1_controller/workflows/jira-integration.md`.
- **Strip** all Jira sections from `CLAUDE.md`, `README.md`, `development-lifecycle.md`, `git-conventions.md`, `subagent-strategy.md`, `_template.md` (per the reader-report inventory): `NO BRANCHES WITHOUT JIRA TICKET` -> `NO BRANCHES WITHOUT TASK REFERENCE`; remove Atlassian-plugin / ADF / transition rules; remove `techreq/` status folder; branch format `TYPE/TICKET-ID/DESC` -> `TYPE/short-description`.
- **Replace** `1_controller/standards/engineering.md` (Python/AYON) with a TypeScript/React standard. Note: a stronger draft already exists at `vault/dev/1_controller/profiles/typescript-engineering.md` — migrate it in.
- **Delete** `2_architect/patterns/ayon-plugin-spec.md` (AYON-specific).
- Issue tracking is now **SQLite-backed** (see Section 2), not a folder-as-state filesystem. The `4_orchestrator/projects/*` folders are retained only as an optional human-readable mirror / changelog anchor, not as the source of truth.

### Reconciliation with the existing `vault/dev/` layer — **RECOMMENDATION: MERGE, then retire `vault/dev/`**

`vault/dev/` is already a hand-built proto-canon for the code domain (identical numbered-folder layout, real content in `1_controller/standards/` and `4_orchestrator/changelogs/`, a richer-than-template `DEV-CLAUDE.md`). It does **not** conflict with the stamped instance — it *is* the same layer, built before the factory governed Polymath. It is missing the `hooks/`, `workflows/`, `settings/`, and profile-managed-CLAUDE.md layers the factory provides.

Decisive recommendation:

1. **Stamp** the fresh instance at `D:\VFXellence-LTD\polymath\.canon\`.
2. **Migrate the real files** out of `vault/dev/` into the stamped instance:
   - `vault/dev/1_controller/profiles/typescript-engineering.md` -> `.canon/1_controller/standards/engineering.md`
   - `vault/dev/1_controller/standards/*` (real docs) -> `.canon/1_controller/standards/`
   - `vault/dev/4_orchestrator/changelogs/2026-06-03.md`, `2026-06-13.md` -> `.canon/4_orchestrator/changelogs/`
   - the richer `DEV-CLAUDE.md` content -> reconciled into the stamped `.canon/CLAUDE.md` (keep the VFXellence-LTD/no-Jira/semver customisations).
3. **Retire `vault/dev/`** after migration — replace its `DEV-CLAUDE.md` with a one-line pointer to `D:\VFXellence-LTD\polymath\.canon\` and stop writing there. (Do not hard-delete until Boss confirms the migration is clean.)

Rationale: two parallel code-governance layers is exactly the hand-rolling the factory is meant to end. `.canon/` becomes the single code-domain governance home; `vault/` stays the **business** governance layer (ecosystems, policies, agent specs). Two layers, clear split — not three.

> Note: the reader briefly floated `vault/.canon/`. Rejected — burying `.canon` inside the Obsidian business vault muddies the business-vs-code split and complicates the Mission Control `CANON_PATH` mount. Root-level `.canon/` is cleaner.

---

## 2. Mission Control plan

### What Mission Control becomes

The Polymath dashboard is promoted into **Polymath Mission Control**: a local-first Express(or Hono)+SQLite+WebSocket+React control plane, architected like Canon's CMC, but with Halon's Jira/AYON/pipeline integrations swapped for Polymath's ecosystems / campaigns / approval-queue / agent-runs. The existing dashboard pages are kept and become surfaces of the larger control plane.

### Where it lives — **RECOMMENDATION: new workspace package**

```
D:\VFXellence-LTD\polymath\apps\mission-control\
├── client/              # React 19 + Vite — absorbs current apps/dashboard/src
│   └── src/
├── server/              # Node + better-sqlite3
│   ├── index.ts         # API server, port 4500
│   ├── config.ts        # DB path, CANON_PATH, vault path
│   ├── db.ts            # schema init + migration runner
│   ├── routes/          # issues, campaigns, approvals, agent-runs, transactions, tools, vault, projects
│   └── services/
├── package.json         # @polymath/mission-control
└── tsconfig.json
```

The existing `apps/dashboard` financial/setup/entity pages migrate in as a `/finances`-style sub-section. The only real migration surface is **four hooks** — `useTransactions`, `useTools`, `useSetupProgress`, `useLaunchProgress` — each swaps `localStorage.*` for `fetch('/api/<resource>')`. No page component needs rewriting.

Root script: `"mc": "pnpm --filter @polymath/mission-control dev"`.

### Existing pages -> Mission Control surfaces

| Existing page | Becomes |
|---|---|
| `DashboardPage` | Ecosystem Status Board (health, revenue, today-actions) |
| `EntityPage` | Brand Registry + Account-Limit / Brand-Isolation audit |
| `LaunchPage` | Campaign Launch wizard (feeds `campaigns` + `tasks`) |
| `ToolsPage` | Tool Registry + monthly burn |
| `Transactions/Earnings/Tax` | Financial layer (Polymath-only, no CMC equivalent) |
| `SetupPage` | Guided setup checklist |

### Surfaces to ADD (nothing exists today)

- **Campaign Control Panel** — run / pause / queue the Surge engine; show current run + pipeline status.
- **Approval Queue** — the hardest doctrine requirement: per-asset items awaiting Boss approve/reject before publish.
- **Agent Status Board** — per-agent last-run / last-error / schedule / autonomy stage.
- **Kill-Switch Monitor** — budget burn vs cap, cadence health, threshold alerts.
- **Vault Browser / Changelog / Search / Kanban** — liftable directly from CMC; Kanban reads the `tasks` table (not folders).

### SQLite issue schema (replaces Jira)

Single DB file, gitignored, owned by the app: `apps/mission-control/.data/polymath.db`. `better-sqlite3` (synchronous, native, fast, already in `package.json`) — **not** `sql.js` (Polymath's server is Node-only; no WASM tax).

Core state-machine table (the Jira replacement), distilled from CMC's `db.service.ts`:

```sql
CREATE TABLE tasks (
  id            TEXT PRIMARY KEY,        -- 'SURGE-001', 'SIG-042' (locally generated)
  title         TEXT NOT NULL,
  description   TEXT,
  type          TEXT NOT NULL DEFAULT 'task',
                                         -- task|campaign|agent-run|content-piece|research|setup|decision|infra
  ecosystem_id  TEXT,                    -- content|viral|products|affiliate|lullaby (NULL = cross-cutting)
  vertical_id   TEXT,
  source        TEXT NOT NULL DEFAULT 'manual',   -- manual|agent|import
  status        TEXT NOT NULL DEFAULT 'backlog',
                                         -- backlog|planned|todo|in-progress|blocked|in-review|done
  priority      TEXT NOT NULL DEFAULT 'medium',   -- critical|high|medium|low
  owner         TEXT,                    -- 'boss' | 'agent:<name>'
  agent_id      TEXT,
  parent_id     TEXT REFERENCES tasks(id),
  linked_ids    TEXT,                    -- JSON array
  campaign_id   TEXT REFERENCES campaigns(id),
  content_type  TEXT,                    -- clip|pillar|short|listing|email
  platform      TEXT,                    -- youtube|tiktok|instagram-reels|etsy
  autonomy_stage INTEGER DEFAULT 0,      -- 0 manual .. 3 bounded-auto
  checklist     TEXT,                    -- JSON [{tag,text,done}]
  tracker_content TEXT,                  -- optional markdown mirror
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT, started_at TEXT, completed_at TEXT, synced_at TEXT,
  time_total_seconds INTEGER DEFAULT 0, time_running INTEGER DEFAULT 0, time_run_started TEXT,
  sprint        TEXT, team TEXT
);
CREATE INDEX idx_tasks_status    ON tasks(status);
CREATE INDEX idx_tasks_ecosystem ON tasks(ecosystem_id);
CREATE INDEX idx_tasks_campaign  ON tasks(campaign_id);
```

```sql
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY, name TEXT NOT NULL,
  ecosystem_id TEXT NOT NULL, vertical_id TEXT,
  status TEXT NOT NULL DEFAULT 'planned',   -- planned|running|paused|review|done|killed
  autonomy_stage INTEGER DEFAULT 0,
  target_count INTEGER,
  approved_by TEXT, approved_at TEXT,       -- human-approval gate
  started_at TEXT, completed_at TEXT, notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT
);
```

```sql
-- THE per-asset approval gate — first-class table, the doctrine's hardest requirement
CREATE TABLE approval_queue (
  id           TEXT PRIMARY KEY,
  task_id      TEXT REFERENCES tasks(id),
  campaign_id  TEXT REFERENCES campaigns(id),
  ecosystem_id TEXT NOT NULL,
  content_type TEXT,                        -- 'clip'
  artifact_path TEXT,                       -- local path to the produced draft
  preview_url  TEXT,                        -- local file:// or served preview
  content_json TEXT,                        -- script, metadata, safeguard report
  status       TEXT NOT NULL DEFAULT 'pending',   -- pending|approved|rejected|changes-requested
  reviewed_by  TEXT, reviewed_at TEXT, review_notes TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_approval_status ON approval_queue(status);
```

```sql
CREATE TABLE agent_runs (
  id TEXT PRIMARY KEY,
  campaign_id TEXT REFERENCES campaigns(id),
  task_id TEXT REFERENCES tasks(id),
  agent_name TEXT NOT NULL,
  status TEXT DEFAULT 'queued',             -- queued|running|done|error|killed
  started_at TEXT, completed_at TEXT,
  output_json TEXT, error TEXT
);
```

Supporting tables, ported near-verbatim from CMC: `task_releases` (per-platform publish lifecycle; `pr_state` enum repurposed `none|draft|approved|published`), `task_deployments` (`approved` boolean gate), `pull_requests`, `time_entries`, `sync_log`, plus `checklist_templates`. Financial/business tables (`transactions`, `tools`, `setup_progress`, `launch_progress`, `launch_data`, `brands`, `platform_accounts`) live in the same DB.

**State machine:**

```
tasks:     backlog -> planned -> todo -> in-progress <-> blocked -> in-review -> done
campaigns: planned -> running <-> paused -> review -> done   (-> killed via kill-switch)
```

Gate rules enforced at transition:
- `in-progress -> in-review`: all `Produce` checklist items done; safeguards check passed.
- `in-review -> done`: `approval_queue.status = 'approved'` for the asset; Boss signed off.
- `done` is terminal/idempotent — never reopen; create a new task.

Brand isolation: every ecosystem query filters `WHERE ecosystem_id = ?` and never JOINs across ecosystems without an explicit controller-level override flag.

### Backend approach — **RECOMMENDATION: standalone Node + better-sqlite3 server (Hono), NOT the Vite plugin**

Use a real long-lived server (Hono preferred over Express for a lighter, modern, type-friendly footprint on Node; Express is the proven CMC choice and equally acceptable). Reject the Vite-plugin-endpoint approach:

- The existing `PUT /__vault/` Vite plugin is dev-only middleware — it dies when Vite isn't running, can't serve production, and is rebuilt on every HMR reload.
- SQLite needs a persistent process: connection reuse across requests, survives HMR, runs headless when the engine works overnight.
- A standalone server also hosts the WebSocket channel (live approval-queue + agent-run updates) and the future PTY/agent-driver surface — neither fits a Vite plugin.

Vite (client) on `5173`/`5174`, API server on `4500`, WS on the same server. Client `fetch` proxied to `4500` in dev.

---

## 3. Amalgamation map — three layers

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  GOVERNANCE VAULT (rules / source of truth)                                    │
│                                                                                │
│  D:\...\polymath\.canon\         ← stamped code-domain governance (workflows,  │
│      1_controller .. 5_knowledge   standards, hooks, profiles, CLAUDE.md)      │
│  D:\...\polymath\vault\          ← business governance (ecosystem specs,        │
│      ecosystems/ controller/       POLICY.md, safeguards, agent designs,        │
│      references/                   surge-formula, brand registry)               │
└───────────────▲───────────────────────────────────────────────┬───────────────┘
                │ read (file tree, search, changelog,             │ writes back:
                │ Kanban mirror, doctrine/POLICY lookups)         │ changelog entries,
                │                                                 │ launch records
┌───────────────┴─────────────────────────────────────────────────────────────┐
│  MISSION CONTROL  (control plane + state)                                      │
│  apps\mission-control\                                                         │
│                                                                                │
│   client (React)            server (Hono/Express + better-sqlite3 + WS)        │
│   ─ Ecosystem Status        ─ /api/campaigns   ─ /api/issues(tasks)            │
│   ─ Campaign Control Panel  ─ /api/approvals   ─ /api/agent-runs               │
│   ─ ► APPROVAL QUEUE ◄      ─ /api/vault       ─ /api/transactions             │
│   ─ Agent Status Board      ─ WS: live run + approval updates                  │
│   ─ Kill-Switch Monitor                                                        │
│                                                                                │
│   SQLite (.data\polymath.db) = single state home for all 5 ecosystems          │
└───────────────▲───────────────────────────────────────────────┬───────────────┘
                │ enqueue run / read campaign config              │ writes:
                │ poll approval verdict                           │ agent_runs rows,
                │                                                 │ approval_queue rows,
                │                                                 │ artifact_path
┌───────────────┴─────────────────────────────────────────────────────────────┐
│  SURGE GENERATION ENGINE  (runtime worker)                                     │
│  packages\agents\  (engine for Surge/Zrodinger)                                │
│                                                                                │
│   reads surge-formula + POLICY.md from vault → generates clip draft →          │
│   runs safeguards check → writes draft artifact to disk →                      │
│   creates approval_queue row (status=pending) → STOPS. Waits for human.        │
└────────────────────────────────────────────────────────────────────────────┘
```

### Where the per-asset approval gate sits

Squarely at the **Mission Control <-> Engine** boundary, materialised as the `approval_queue` table and the Approval Queue UI. The engine never publishes. It produces a draft, writes the artifact, inserts a `pending` row, and halts. Publish is downstream of an explicit Boss `approved` verdict — and for the first milestone there is no publish step at all.

### Campaign / issue flow (backlog -> running -> review -> done) across the three layers

1. **Backlog (MC + vault):** Boss creates a campaign in the Campaign Control Panel -> `campaigns` row `status=planned`, child `tasks` rows `status=backlog`. Doctrine for the run (surge-formula, POLICY) lives in the **vault**; MC reads it.
2. **Running (MC -> Engine):** Boss starts the campaign -> `campaigns.status=running`, task -> `in-progress`. MC enqueues an `agent_runs` row. The **Engine** picks it up, reads vault doctrine, generates the draft, runs safeguards.
3. **Review (Engine -> MC -> Boss):** Engine writes the artifact, inserts `approval_queue (status=pending)`, sets task -> `in-review`, campaign -> `review`. WS pushes it to the Approval Queue. **Boss reviews each asset** and sets `approved` / `rejected` / `changes-requested`.
4. **Done (MC + vault):** On `approved` (milestone-1 stops here as an approved *draft*), task -> `done`, and MC writes a changelog entry to `.canon/4_orchestrator/changelogs/` and/or a launch record to `vault/`. Rejected -> task back to `in-progress` with review notes; the engine reruns. Later stages add the actual publish step downstream of `approved`.

Autonomy staging governs how steps 2-3 fire: Stage 0 every step is manual; Stage 1 the engine drafts on request; Stage 2 the engine drafts on schedule but still queues for approval; Stage 3 bounded-auto generation — **publish remains a human verdict at every stage.**

---

## 4. MVP build order — "one approved Zrodinger clip draft"

Sequenced by sub-system. Milestone-1 deliberately needs **no social accounts and no publish path.**

**Phase 0 — Governance (stamp + reconcile)**
1. Stamp `.canon` at `D:\VFXellence-LTD\polymath\.canon\` from the factory with the Section-1 placeholder table; apply Jira teardown.
2. Migrate real `vault/dev/` files into `.canon`; replace `DEV-CLAUDE.md` with a pointer; leave business `vault/` untouched.
3. Confirm `vault/` has the Surge doctrine the engine will read: `surge-formula`, `POLICY.md`/safeguards, Zrodinger vertical spec. Author stubs if missing.

**Phase 1 — Control plane + state (scaffold MC)**
4. Create `apps/mission-control/` package (client absorbs `apps/dashboard/src`; server is Node + better-sqlite3 + Hono).
5. Implement `server/db.ts`: schema init + migration runner for `tasks`, `campaigns`, `approval_queue`, `agent_runs`, plus financial/business tables.
6. Build the read/write routes: `/api/issues`, `/api/campaigns`, `/api/approvals`, `/api/agent-runs`.
7. Migrate the four localStorage hooks to `fetch('/api/...')`. (Pure plumbing; no UI change.)

**Phase 2 — Approval surface (the gate first)**
8. Build the **Approval Queue** UI + WS live updates. This is the doctrine-critical surface — build it before the engine so the engine has a real target to write into.
9. Build the **Campaign Control Panel** (create / start a campaign; show run status) reading `campaigns` + `agent_runs`.

**Phase 3 — Engine (runtime, Stage 0/1)**
10. In `packages/agents/`, build the minimal Surge/Zrodinger draft generator: read vault `surge-formula` + Zrodinger spec -> produce ONE clip draft (script + asset) -> run the safeguards check against `POLICY.md`.
11. Wire engine output to state: write the artifact to disk, insert an `approval_queue` row `status=pending`, advance task -> `in-review`. Engine HALTS here. Stage 0/1 only — triggered manually from the Campaign Control Panel.

**Phase 4 — Close the loop (review -> done)**
12. Boss opens the Approval Queue, reviews the one draft, clicks **Approve**. Task -> `done`, campaign -> `review`/`done`. MC writes a changelog entry to `.canon/4_orchestrator/changelogs/`.
13. **Milestone complete:** one approved Zrodinger clip draft, fully tracked in SQLite, governed by the vault, produced by the engine, approved by Boss — with no publish and no accounts.

Sub-system coverage: governance (Phase 0), control-plane (Phase 1-2), state (Phase 1), engine (Phase 3), runtime/loop (Phase 4).

---

## 5. Open questions / risks for the Boss

1. **Factory carries Jira assumptions throughout.** The stamp is not clean find-replace — Jira logic is woven into lifecycle, git-conventions, subagent-strategy, and the engineering standard (which is Python/AYON, not TS/React). Risk: residual Halon/Jira/ENG- leakage. **Decision needed:** OK to do a manual post-stamp grep-and-purge pass (Halon, rdutta-as-Maestro, halon.atlassian, ENG-, AYON, Maya/Deadline) and replace `engineering.md` wholesale?

2. **`vault/dev` vs stamped `.canon` overlap.** Recommendation is MERGE-then-retire `vault/dev`. **Decision needed:** confirm the merge direction (real files flow `vault/dev` -> `.canon`) and that `vault/dev` is deprecated to a pointer, not kept as a live third layer.

3. **Issue tracking abandons folder-as-state for a DB.** Canon's whole model is "the folder IS the status." Polymath replaces that with a SQLite `status` column. Upside: queryable, multi-ecosystem, WS-live. Downside: lose the plain-markdown-in-git audit trail and Obsidian-native browsing of tickets. **Decision needed:** is the optional `tracker_content` markdown mirror worth maintaining, or is SQLite-only acceptable for the issue layer (changelogs stay in markdown regardless)?

4. **SQLite engine choice locks the server to Node.** `better-sqlite3` is native and Node-only (chosen over `sql.js`/WASM for speed and because it's already a dependency). That is correct for a localhost control plane, but it means no browser-embedded DB and no trivial static-host deploy. **Decision needed:** confirm Mission Control is and stays a **local-first server app** (run on Boss's machine), not something to host statically later.

5. **Brand isolation in a shared DB.** All 5 ecosystems share one `polymath.db`. Isolation is enforced only at the query layer (`WHERE ecosystem_id = ?`). A buggy JOIN or a missing filter could cross-contaminate brands (e.g. leak Surge data into a Signal view, or link accounts that must stay separate). **Decision needed:** is query-layer isolation sufficient, or do you want a harder guard (per-ecosystem views, a mandatory scoping middleware, or even separate DB files per ecosystem)?

6. **Per-asset gate vs throughput.** Per-asset approval is firm and correct for trust-building, but it caps volume at Boss's review bandwidth. At Stage 2/3 with batches, the queue could pile up. **Decision needed (not now, flag for later):** at what autonomy stage, if ever, do we allow *batch* approval of low-risk asset classes — or does per-asset stay absolute forever?

7. **Mission Control naming / scope creep.** Folding the financial tracker (Transactions, Earnings, Tax) into the same app as the campaign control plane mixes money-data and operational-data concerns in one process and one DB. It is the pragmatic path (shared types, one server) but worth a conscious nod. **Decision needed:** confirm one unified Mission Control app is wanted, vs keeping Finances a separate surface.

8. **Engine driver mechanism is unspecified.** Phase 3 says "the engine generates a clip" but not *how* it is driven — a Node worker invoked by the server, a spawned Claude Code session (CMC-style PTY), or a standalone script. **Decision needed:** for milestone-1, is a plain in-process Node worker acceptable, deferring the Claude-session/PTY driver to a later stage?
