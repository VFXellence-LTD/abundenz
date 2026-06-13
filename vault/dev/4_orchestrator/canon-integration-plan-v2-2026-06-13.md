# Canon Integration Plan v2 — VFXellence / Polymath Autonomous-Campaign System

**Date:** 2026-06-13
**Author:** Orchestrator (for Boss — Robin Dutta)
**Status:** SUPERSEDES `canon-integration-plan-2026-06-13.md`

---

## What changed from v1 (and why this supersedes it)

The earlier plan put `.canon` **inside** polymath at `D:\VFXellence-LTD\polymath\.canon\`. That was wrong. It treated `.canon` as a per-repo governance folder when `.canon` is **domain-level** governance — the peer-beside-the-repos pattern Halon uses, where one `D:\dev\.canon` governs all of `ayon-workspace\addons\*`.

v2 corrects this to the firm Boss decisions:

| Topic | v1 (superseded) | v2 (this plan) |
|---|---|---|
| `.canon` location | inside polymath repo root | **`D:\VFXellence-LTD\.canon`** — domain root, already stamped 2026-06-05 |
| `.canon` scope | governs the polymath repo | governs **all** VFXellence streams (polymath, abundenz-site, future Zappz/AMJ) — analogue of Halon's one-canon-many-repos |
| Stamp action | stamp a fresh instance | **`.canon` already exists** — populate the empty slots, do not re-stamp |
| Control plane | `apps/mission-control` (new package in polymath) | **`.canon/.mission-control`** — the MOVED polymath dashboard, mirroring CMC's slot |
| Business vault | left in place at `polymath/vault/` | **MERGES into `.canon`** (5-paradigm layout per mapping report); `vault/dev/` also merges |
| polymath role | monorepo holding everything | **product/campaign dev streams** (`apps/`, `packages/`) — analogue of AYON addon repos |
| Engine driver | "plain in-process Node worker, defer PTY" | **SPAWNED CLAUDE CODE SESSION (PTY)** — mirror CMC's swarm driver |
| Brand isolation | `WHERE ecosystem_id = ?` at query layer | **scoping middleware + per-ecosystem VIEWS** (hard guard) |

Everything in v1 about the SQLite schema, the approval queue, and the milestone-1 "one approved Zrodinger draft" goal stays — it is re-homed onto the corrected topology below.

### Firm Boss decisions baked in (not relitigated)

- `.canon` lives at `D:\VFXellence-LTD\.canon` — DOMAIN-level governance for VFXellence/Abundenz; governs polymath's streams the way Halon's `.canon` governs ayon-workspace addon repos.
- `.canon/.mission-control` = the control-plane app = the MOVED polymath dashboard. Mirror CMC's structure/paradigms: Board + cards kept; **NO Triage** (solo operator, nothing to route between people); the CURRENT dashboard becomes the **intake surface** for initializing streams + improving Mission Control.
- `polymath/apps/` = polymath product/campaign dev streams (analogue of ayon addon repos).
- polymath's business `vault/` AND `vault/dev/` MERGE INTO `.canon` (5-paradigm layout, translated to polymath analogues per the mapping report).
- Issue tracking = SQLite (no Jira), cross-ecosystem, brand isolation via **SCOPING MIDDLEWARE + per-ecosystem VIEWS**.
- Engine driver = SPAWNED CLAUDE CODE SESSION (PTY), mirroring CMC's driver (the swarm path).
- MVP campaign = Surge/Zrodinger; PER-ASSET approval gate; first milestone = ONE approved clip DRAFT (no publish, no accounts); staged autonomy (publish always human).

---

## 1. Target structure

Two roots. `.canon` is the single governance + control plane for the whole VFXellence domain. `polymath` shrinks to a pure dev workspace of streams.

### 1a. `D:\VFXellence-LTD\.canon\` — governance + control plane

```
D:\VFXellence-LTD\.canon\
│
├── CLAUDE.md                       # governance hub (exists — Boss title, VFX-NNN tracker, C-A-N-O-N)
├── README.md                       # exists
│
├── 1_controller\                   # C — Rules, standards, profiles, workflows
│   ├── standards\
│   │   ├── no-go-rules.md                  # EXISTS (engineering)
│   │   ├── python-engineering.md           # EXISTS
│   │   ├── typescript-engineering.md       # EXISTS (canon's) — reconcile w/ vault/dev's
│   │   ├── testing-strategy.md             # EXISTS
│   │   ├── sentry-integration.md           # EXISTS
│   │   └── polymath-business\              # NEW sub-namespace (business governance)
│   │       ├── brand-isolation.md          ← vault/shared/brand-isolation/POLICY.md
│   │       ├── brand-naming.md             ← vault/shared/brand-naming.md
│   │       ├── controller-charter.md       ← vault/controller/README.md
│   │       ├── kill-switch-criteria.md     ← vault/controller/kill-switch-criteria.md
│   │       ├── no-go-rules-polymath.md     ← vault/dev/1_controller/standards/no-go-rules.md
│   │       ├── compliance\                 ← ecosystems/shared/compliance/* (FTC, AI-disclosure, tax, marketplace)
│   │       ├── safeguards\
│   │       │   ├── viral-surge.md          ← ecosystems/viral/safeguards/POLICY.md
│   │       │   └── lullaby-child-safety.md ← content/verticals/lullaby/safeguards/POLICY.md (non-negotiable)
│   │       └── source-material-legal\      ← source-material-bible/01-Legal-Guidelines/
│   │           └── restricted-symbols\     ← source-material-bible/09-Symbols/_restricted/
│   ├── profiles\
│   │   └── polymath\
│   │       ├── CLAUDE.md                    ← vault/dev/DEV-CLAUDE.md  (deploys to polymath/CLAUDE.md)
│   │       └── README.md                    ← vault/dev/README.md
│   └── workflows\                          # EXISTS (dev lifecycle, git, worktrees, subagent, e2e,
│                                           #   ralph-loop, security-sweep, token-efficiency, issue-tracking)
│
├── 2_architect\                    # A — Design: codebase docs + reusable patterns
│   ├── patterns\                           # EXISTS (agents/conduit-*, products/)
│   ├── zappz-marketplace\                  # EXISTS
│   ├── codebase\                           # NEW — machine-readable docs for the streams
│   │   ├── mission-control.md              ← (write after move)
│   │   ├── dashboard.md
│   │   ├── types.md
│   │   └── agents.md
│   └── polymath-business\                  # NEW sub-namespace (business architecture)
│       ├── ecosystems\
│       │   ├── content\   (README, PITCH, agents, workflows, playbooks, verticals/vfx-pipeline/brief)
│       │   ├── viral\     (README, PITCH, agents, workflows, playbooks, verticals/)
│       │   ├── products\  (README, agents, workflows)
│       │   ├── affiliate\ (README, agents, workflows)
│       │   └── apps\      (README)
│       ├── shared-agents\          ← ecosystems/shared/agents/
│       ├── shared-workflows\       ← ecosystems/shared/workflows/
│       ├── color-palettes\         ← source-material-bible/08-Color-Palettes/  (Boss to confirm home)
│       └── polymath-deployment.md  ← vault/shared/automation/deployment.md
│
├── 3_notes\                        # N — Scratch / inbox
│   ├── dedupe-passive-income-vs-polymath.md   # EXISTS
│   └── polymath-business\          # NEW
│       ├── references-inbox.md     ← references/_inbox.md
│       ├── surge-vertical-research.md ← ecosystems/viral/research/
│       └── app-ideas\              ← ecosystems/apps/ideas/
│
├── 4_orchestrator\                 # O — Active work tracking
│   ├── projects\
│   │   ├── in-progress\            # EXISTS (VFX-001)
│   │   ├── backlog\                # EXISTS (VFX-002 zappz, VFX-003 amj)
│   │   └── polymath-business\      # NEW
│   │       ├── ecosystem-dashboard.md     ← vault/controller/dashboard.md
│   │       ├── launches\                  ← vault/controller/launches/
│   │       ├── content-vfx-calendar.md    ← content/verticals/vfx-pipeline/calendar/
│   │       ├── viral-accounts.md          ← ecosystems/viral/accounts/
│   │       └── source-material-coverage.md ← source-material-bible/_COVERAGE-REPORT.md
│   └── changelogs\                 # EXISTS (2026-06-05) — merge polymath dev changelogs here
│
├── 5_knowledge\                    # N — Accumulated intelligence
│   ├── learning\
│   │   ├── canon-naming-model.md           # EXISTS
│   │   └── polymath-business\      # NEW
│   │       ├── articles\           ← references/articles/
│   │       ├── reels\              ← references/reels/
│   │       └── source-material-traps\ ← source-material-bible/05-Literature/traps/
│   └── reference\                          # EXISTS (entity-strategy, products/, growth-playbooks/)
│       └── polymath-business\      # NEW
│           ├── tool-stack.md       ← vault/shared/automation/tool-stack.md
│           ├── tools\              ← references/tools/ (30 tool evals)
│           ├── creators\           ← references/creators/
│           ├── prompts\            ← vault/shared/prompts/
│           └── source-material\    ← source-material-bible/{02..07,09 non-restricted}/
│
├── .claude\
│   └── skills\
│       └── polymath\               # NEW — runnable SKILL.md files (Canon convention: skills live here, not in paradigm folders)
│           ├── polymath-pitfalls\  ← vault/shared/skills/polymath-pitfalls/
│           ├── niche-locker\       ← vault/shared/skills/niche-locker/
│           ├── content-atomizer\   ← vault/shared/skills/content-atomizer/
│           └── review-miner\       ← vault/shared/skills/review-miner/
│
└── .mission-control\               # NEW — the MOVED polymath dashboard, CMC-mirrored control plane
    ├── client\                     # React 19 + Vite (absorbs polymath/apps/dashboard/src)
    │   └── src\  (pages, components, hooks, data, lib, types)
    ├── server\                     # Node + better-sqlite3 + ws + node-pty
    │   ├── index.ts                # API + WS on port 4500
    │   ├── config.ts               # DB path, CANON_PATH, VAULT_PATH, WORKSPACE_PATH
    │   ├── db.ts                   # schema init + migration runner
    │   ├── scoping.ts              # brand-isolation scoping middleware
    │   ├── routes\                 # issues, campaigns, approvals, agent-runs, sessions, vault, transactions, tools
    │   ├── ws\                     # sessions.ws.ts, terminal.ws.ts (PTY bridge — ported from CMC)
    │   └── services\               # db, pty, session, vault, prompt, claude-sessions, ai
    ├── package.json                # @vfxellence/mission-control
    ├── tsconfig.json
    └── .data\
        └── mission-control.db      # gitignored — single state home, all 5 ecosystems
```

**Naming note:** the report observes Halon CMC uses `.mission_control` (underscore). The firm Boss decision is `.mission-control` (hyphen). Use the hyphen; it's cosmetic and does not affect the port logic.

### 1b. `D:\VFXellence-LTD\polymath\` — what it retains after the merge

polymath collapses from "monorepo holding everything" to "dev workspace of streams" — the AYON-addon-repos analogue.

```
D:\VFXellence-LTD\polymath\
├── CLAUDE.md            # KEPT — but now DEPLOYED from .canon/1_controller/profiles/polymath/CLAUDE.md
├── README.md           # KEPT
├── apps\               # STREAMS (analogue of ayon addon repos)
│   └── dashboard\      # → MOVES OUT to .canon/.mission-control (see §2)
│                       #   future streams land here: apps/zappz, apps/amj, etc.
├── packages\
│   ├── types\          # KEPT — @polymath/types (shared types: ecosystems, transactions, tools)
│   └── agents\         # KEPT — the Surge engine lives here (§3 driver, §4 flow)
├── scripts\            # KEPT
└── vault\              # EMPTIED into .canon (§2). After merge: deleted, or left as a
                        #   one-line README pointer to D:\VFXellence-LTD\.canon. Boss to confirm.
```

**Net topology after migration:**

```
D:\VFXellence-LTD\
├── .canon\                 ← ALL governance + business knowledge + .mission-control (control plane)
├── polymath\               ← dev streams: apps/* + packages/* (engine in packages/agents)
└── abundenz-site\          ← future stream, also governed by .canon
```

This is the exact Halon shape: `D:\dev\.canon` + `D:\dev\ayon-workspace\addons\*`, with `.mission-control` sitting in the `.canon` slot CMC occupies.

---

## 2. Restructure / migration sequence (git-safe)

Ordered. Each step is reversible until the final deletions. The hard rule: **never break the running dashboard, never lose git history.**

### What must NOT break — and how

| Risk | Guard |
|---|---|
| Running dashboard dies mid-move | Move with the dev server **stopped**; verify `pnpm dev` (new path) boots before deleting the old path. Keep old path until green. |
| Git history of dashboard lost | The dashboard moves to a **different repo root** (`.canon` is its own git repo). Preserve history with `git -C <polymath> log` export OR accept a clean re-commit. **Decision flag — see §6 Q1.** `git mv` only preserves history *within one repo*; across repos it does not. |
| Vault content history lost | `polymath/vault/` IS tracked in the polymath repo. Moving it into `.canon` (separate repo) is a cross-repo move — same caveat. Most vault files are markdown; a clean copy + single "import" commit in `.canon` is acceptable if Boss does not need line-level vault history. **Flag Q1.** |
| Collision overwrites real content | Three known collisions: `4_orchestrator/changelogs/_template.md`, `4_orchestrator/projects/_template.md`, `1_controller/standards/no-go-rules.md`. Diff before copy; rename polymath's no-go-rules to `no-go-rules-polymath.md`. |
| Obsidian breaks (wikilinks) | The business vault uses `[[wikilinks]]`. After re-homing under `.canon/.../polymath-business/`, links break. Run a link-fix pass OR open `.canon` as the new Obsidian vault root. **Flag Q5.** |
| `CANON_PATH` mount wrong | `.mission-control` mounts `.canon` by absolute path. Set `CANON_PATH=D:/VFXellence-LTD/.canon` and `VAULT_PATH` to the merged `polymath-business` tree once. |

### Sequence

**Phase A — Stamp / populate `.canon` (it already exists; fill the gaps)**

`.canon` was stamped 2026-06-05 (VFX-001 done). It is NOT a skeleton. Do **not** re-stamp. Populate the empty slots the readers flagged:

1. Create `1_controller/profiles/polymath/` and move `vault/dev/DEV-CLAUDE.md` → `CLAUDE.md`, `vault/dev/README.md` → `README.md`. This becomes the **source** for the deployed `polymath/CLAUDE.md`.
2. Create `2_architect/codebase/` (stub `dashboard.md`, `types.md`, `agents.md`, `mission-control.md`).
3. Create the `polymath-business\` sub-namespaces under `1_controller/standards/`, `2_architect/`, `3_notes/`, `4_orchestrator/projects/`, `5_knowledge/learning/`, `5_knowledge/reference/`.
4. Create `.canon/.claude/skills/polymath/`.

**Phase B — Merge `vault/dev/` (already canon-patterned — direct merge)**

5. Diff `vault/dev/4_orchestrator/changelogs/_template.md` and `projects/_template.md` against `.canon`'s versions. If identical, skip; if different, keep `.canon`'s and discard polymath's (or rename).
6. Copy `vault/dev/4_orchestrator/changelogs/2026-06-03.md` + `2026-06-13.md` → `.canon/4_orchestrator/changelogs/` (date-prefix = no collision).
7. Copy `vault/dev/1_controller/standards/typescript-engineering.md` → reconcile with `.canon`'s existing `typescript-engineering.md` (compare; richer one wins). Copy `no-go-rules.md` → `.canon/1_controller/standards/polymath-business/no-go-rules-polymath.md` (renamed — avoids collision).
8. Copy `vault/dev/5_knowledge/reference/infrastructure.md` → `5_knowledge/reference/polymath-business/`.
9. Archive the two dev planning docs (`canon-integration-plan-2026-06-13.md` — now superseded; `state-review-2026-06-13.md`; and **this v2 doc** once approved) → `4_orchestrator/projects/polymath-business/`.

**Phase C — Merge business `vault/` (the large block — follow the mapping report)**

10. Execute the full mapping table (mapping report → §"Proposed Target Structure"). Group the copies by paradigm and run them in parallel subagents (one per top-level paradigm) since they are independent:
    - `1_controller/standards/polymath-business/` ← brand-isolation, brand-naming, controller-charter, kill-switch, compliance, safeguards, source-material-legal.
    - `2_architect/polymath-business/` ← ecosystems/, shared-agents/, shared-workflows/, deployment.
    - `3_notes/polymath-business/` ← references-inbox, research, app-ideas.
    - `4_orchestrator/projects/polymath-business/` ← dashboard, launches, calendars, accounts, coverage-report.
    - `5_knowledge/{learning,reference}/polymath-business/` ← articles, reels, traps, tool-stack, tools, creators, prompts, source-material corpus.
    - `.canon/.claude/skills/polymath/` ← the 4 SKILL.md skills.
11. Run the Obsidian wikilink-fix pass (or re-point Obsidian root to `.canon`).
12. Commit `.canon` as one "import polymath business vault" commit (per Q1 decision).

**Phase D — Move the dashboard → `.canon/.mission-control`**

13. Stop any running dev server.
14. Create `.canon/.mission-control/` with `client/` + `server/` skeleton.
15. Move `polymath/apps/dashboard/src/*` → `.canon/.mission-control/client/src/` (cross-repo copy + import commit, per Q1).
16. Carry `index.html`, `vite.config.ts`, `tsconfig*.json`, `components.json`, `public/`, `eslint.config.js` into `.mission-control/client/`.
17. `npm install` in `.mission-control`; boot the client alone (`vite`) to confirm it renders at `5173/5174` before touching the server.

**Phase E — Repoint `polymath/apps/` + deploy profile**

18. Remove `polymath/apps/dashboard/` (after §D is green). `apps/` is now empty, ready for future streams (`apps/zappz`, `apps/amj`).
19. Deploy `.canon/1_controller/profiles/polymath/CLAUDE.md` → `polymath/CLAUDE.md` (Halon profile-deployment pattern). polymath's CLAUDE.md is now canon-managed.
20. Update root `polymath/CLAUDE.md` routing table: "control plane → `D:/VFXellence-LTD/.canon/.mission-control`", "governance → `D:/VFXellence-LTD/.canon`", "engine → `packages/agents`".

**Phase F — Delete the husk (Boss gate)**

21. After everything green for one working session: delete `polymath/vault/` (or replace with a one-line pointer README). **Boss approval gate — do not hard-delete without it.**

### Monorepo or separate?

**Recommendation: keep polymath a monorepo (pnpm), make `.canon` its own git repo.** Reasons:
- `.canon` is domain-level and governs *multiple* future repos (abundenz-site, Zappz). It cannot live inside polymath without re-creating the v1 mistake.
- `.mission-control` lives in `.canon` and mounts `.canon` by absolute path — exactly how CMC mounts `D:\dev\.canon`.
- polymath stays one pnpm workspace for `apps/*` + `packages/*` — clean dependency graph for the streams + engine.
- Cross-repo moves cost git history (Q1) — the one real tax. Worth it for the correct topology.

---

## 3. Mission Control build (mirror CMC)

`.mission-control` is the polymath dashboard promoted into a CMC-shaped control plane: **Express(or Hono) + better-sqlite3 + WebSocket + React**, same ports, same PTY driver — Halon's Jira/AYON swapped for Polymath's ecosystems/campaigns/approval-queue/agent-runs. Keep CMC's reusable services verbatim (`PtyService`, `terminal.ws.ts`, `EmbeddedTerminal`, `VaultService`, `ai.service.ts`); drop `JiraService`, `SyncService` (Jira), and the entire Triage flow.

### 3a. SQLite schema (adapted from CMC's `db.service.ts`)

Single DB: `.mission-control/.data/mission-control.db`, WAL mode, foreign keys ON. `better-sqlite3` (already proven in CMC; synchronous, native, Node-only).

**`tasks`** — the generic Jira-replacement state machine (CMC's `tickets`, made ecosystem-aware):

```sql
CREATE TABLE tasks (
  id             TEXT PRIMARY KEY,         -- 'SURGE-001','SIG-042' (locally generated; replaces ENG-/TECHREQ-)
  title          TEXT NOT NULL,
  description    TEXT,
  type           TEXT NOT NULL DEFAULT 'task',   -- task|campaign|agent-run|content-piece|research|setup|infra
  ecosystem_id   TEXT,                     -- content|viral|products|affiliate|lullaby (replaces CMC 'source' ENG/TECHREQ/IT)
  vertical_id    TEXT,
  source         TEXT NOT NULL DEFAULT 'manual', -- manual|agent|import
  status         TEXT NOT NULL DEFAULT 'backlog',-- backlog|todo|in-progress|blocked|in-review|done
  priority       TEXT NOT NULL DEFAULT 'medium', -- critical|high|medium|low
  owner          TEXT,                     -- 'boss' | 'agent:<name>'
  agent_id       TEXT,
  parent_id      TEXT REFERENCES tasks(id),
  linked_ids     TEXT,                     -- JSON array (CMC's linked issues)
  campaign_id    TEXT REFERENCES campaigns(id),
  content_type   TEXT,                     -- clip|pillar|short|listing|email
  platform       TEXT,                     -- youtube|tiktok|instagram-reels|etsy
  autonomy_stage INTEGER DEFAULT 0,        -- 0 manual .. 3 bounded-auto
  checklist      TEXT,                     -- JSON [{tag,text,done}]  (CMC's checklist, verbatim shape)
  tracker_content TEXT,                    -- optional markdown mirror (CMC's tracker_content)
  claude_session_id TEXT,                  -- PTY-driver resume UUID (CMC's claude_session_id — KEEP)
  worktree_path  TEXT,                     -- engine worktree (CMC's worktree_path — KEEP)
  time_total_seconds INTEGER DEFAULT 0, time_running INTEGER DEFAULT 0, time_run_started TEXT, -- CMC time fields
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT, started_at TEXT, completed_at TEXT, synced_at TEXT
);
CREATE INDEX idx_tasks_status    ON tasks(status);
CREATE INDEX idx_tasks_ecosystem ON tasks(ecosystem_id);
CREATE INDEX idx_tasks_campaign  ON tasks(campaign_id);
```

**`campaigns`** — no CMC analogue; the unit a Surge run targets:

```sql
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY, name TEXT NOT NULL,
  ecosystem_id TEXT NOT NULL, vertical_id TEXT,
  status TEXT NOT NULL DEFAULT 'planned',  -- planned|running|paused|review|done|killed
  autonomy_stage INTEGER DEFAULT 0,
  target_count INTEGER,
  approved_by TEXT, approved_at TEXT,
  started_at TEXT, completed_at TEXT, notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT
);
```

**`approval_queue`** — the per-asset gate, first-class table (doctrine's hardest requirement):

```sql
CREATE TABLE approval_queue (
  id           TEXT PRIMARY KEY,
  task_id      TEXT REFERENCES tasks(id),
  campaign_id  TEXT REFERENCES campaigns(id),
  ecosystem_id TEXT NOT NULL,
  content_type TEXT,                       -- 'clip'
  artifact_path TEXT,                      -- local path to produced draft
  preview_url  TEXT,                       -- file:// or served preview
  content_json TEXT,                       -- script, metadata, safeguard report
  status       TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected|changes-requested
  reviewed_by  TEXT, reviewed_at TEXT, review_notes TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_approval_status ON approval_queue(status);
```

**`agent_runs`** — maps to CMC's session/run tracking; the row the PTY driver writes:

```sql
CREATE TABLE agent_runs (
  id TEXT PRIMARY KEY,
  campaign_id TEXT REFERENCES campaigns(id),
  task_id TEXT REFERENCES tasks(id),
  agent_name TEXT NOT NULL,                -- 'surge-engine'
  claude_session_id TEXT,                  -- PTY session UUID (ties to .claude/projects scan)
  pty_session_id TEXT,                     -- MC-internal session id
  status TEXT DEFAULT 'queued',            -- queued|running|waiting|done|error|killed
  cwd TEXT,                                -- engine working dir (packages/agents)
  command TEXT,                            -- the launched slash/claude command
  started_at TEXT, completed_at TEXT,
  output_json TEXT, error TEXT
);
```

**Ported from CMC near-verbatim:**
- `sync_log` — generic sync/run audit (drop Jira sync_type, keep for engine runs).
- `time_entries` — keep as-is (per-task timers).
- `pull_requests` — keep for future stream PRs (polymath apps); maps to CMC's GitHub-fanout. Nullable for now.

**Polymath-only tables (the financial/business layer from the existing dashboard, no CMC equivalent):** `transactions`, `tools`, `setup_progress`, `launch_progress`, `launch_data`, `brands`, `platform_accounts` — all in the same DB.

**State machines:**
```
tasks:     backlog -> todo -> in-progress <-> blocked -> in-review -> done
campaigns: planned -> running <-> paused -> review -> done   (-> killed via kill-switch)
```
Gate rules at transition:
- `in-progress -> in-review`: produce-checklist done; safeguards check passed.
- `in-review -> done`: matching `approval_queue.status='approved'`; Boss signed off.
- `done` is terminal — never reopen; create a new task.

### 3b. Board columns (translated from CMC, Triage dropped)

CMC's `BOARD_COLUMNS` = `backlog | todo | in-progress | in-review`. Triage (TECHREQ intake) is **dropped** — solo operator, no inbound human routing. Translation:

| CMC column | Polymath column | Meaning |
|---|---|---|
| `backlog` | `backlog` | campaign tasks not yet started; filterable by ecosystem |
| `todo` | `todo` | queued for the next engine run |
| `in-progress` | `in-progress` | engine running / draft being produced |
| `in-review` | `in-review` | draft in `approval_queue`, awaiting Boss verdict |
| `done` (Done tab) | `done` | approved (milestone-1 stops here as an approved draft) |
| `techreq` (Triage tab) | **removed** | no triage; intake handled by the intake surface instead |

Cards stay priority-tinted (critical=red, high=orange, medium=yellow, low=green) and carry a **Quick Start** button that launches the engine session directly from the card (CMC's `smartStart` analogue). Add an **ecosystem filter** (the brand-isolation scope selector) where CMC has the assignee filter — selecting an ecosystem flips the scoping middleware (§4).

### 3c. The "intake" surface (current dashboard repurposed)

CMC's Triage = inbound-from-humans queue. Polymath has no humans to route from, so the **current dashboard becomes the intake surface** with a different job: **initialize streams + improve Mission Control.** It is where Boss:
- registers a brand / ecosystem / vertical (writes `brands`, seeds `campaigns`);
- runs the guided setup checklist (existing `SetupPage`);
- creates a new campaign (the Launch wizard → `campaigns` + child `tasks` at `backlog`);
- files a "improve Mission Control" task (a `task` with `type='infra'`, `ecosystem_id=NULL`).

Existing dashboard pages → MC surfaces (carried in the move):

| Existing page | Becomes |
|---|---|
| `DashboardPage` | Ecosystem Status Board (health, revenue, today-actions) |
| `EntityPage` | Brand Registry + brand-isolation audit |
| `LaunchPage` | Campaign Launch wizard (intake) → `campaigns` + `tasks` |
| `ToolsPage` | Tool Registry + monthly burn |
| `Transactions/Earnings/Tax` | Financial layer (Polymath-only) |
| `SetupPage` | Guided setup checklist (intake) |

Surfaces to ADD (none exist today): **Campaign Control Panel**, **Approval Queue**, **Agent/Session Board** (CMC's SessionMonitor, reused), **Kill-Switch Monitor**, and the liftable **Vault Browser / Changelog / Search / Board** (CMC's, reading `tasks` not folders).

### 3d. PTY Claude-session ENGINE DRIVER (ported from CMC)

The firm decision: the Surge engine is **driven by a spawned Claude Code session over PTY**, mirroring CMC's swarm driver. Port the chain verbatim, swap Canon-specifics:

| CMC component | Port action |
|---|---|
| `pty.service.ts` (node-pty wrapper, 200KB scrollback, data/exit events) | **copy verbatim** |
| `terminal.ws.ts` (`/ws/terminal?sessionId=` bridge; new-PTY vs replay-scrollback; 800ms-then-write-command) | **copy verbatim** |
| `EmbeddedTerminal.tsx` (xterm.js + FitAddon + reconnect backoff) | **copy verbatim** |
| `session.service.ts` (lifecycle state machine running→waiting→completed, idle detect 8s) | copy; **swap the command allowlist** |
| `sessions.ws.ts` (`/ws` status + log broadcast) | copy verbatim |
| `claude-sessions.service.ts` (`~/.claude/projects/<encoded-cwd>/*.jsonl` scan → resume UUID) | copy; swap match-key from ticket-key to `task_id`/`campaign_id` |
| `prompt.service.ts` `buildCanonPrompt()` | replace with `buildSurgePrompt()` — reads vault surge-formula + Zrodinger spec + POLICY |

**Command allowlist (replaces CMC's Canon skills):**
```
CMC:      ['/start','/canon-workflow:continue','/document-feature','/make','/pr','/done','/release']  + '--resume {uuid}'
Polymath: ['/surge-generate','/surge-continue','/surge-safeguard-check']                              + '--resume {uuid}'
```
**`cwd` for the engine session:** `D:\VFXellence-LTD\polymath\packages\agents` (where the Surge engine lives) — the analogue of CMC opening a session in an addon repo's worktree. For isolation, each campaign run can get a polymath worktree (`worktree_path` column), exactly as CMC does per-ticket.

**Launch flow (CMC `handleSmartStart` analogue):**
```
Quick Start on a campaign card / Campaign Control Panel "Run"
  → POST /api/sessions/start { taskId|campaignId, cwd=packages/agents,
                               command='/surge-generate <campaignId>' }
  → sessionService.startSession() validates command against allowlist, creates agent_runs row (status=running)
  → client mounts EmbeddedTerminal(sessionId)
  → terminal.ws.ts spawns PTY (powershell), after 800ms writes:  claude "/surge-generate <id>"\r
  → engine session reads vault doctrine, produces draft, runs safeguard check,
    writes artifact to disk, INSERTs approval_queue(status=pending), task->in-review, then HALTS
  → on exit, claude-sessions.service scans for the session UUID → persists to agent_runs.claude_session_id for --resume
```

### 3e. Backend approach + ports

- **Standalone long-lived Node server** (Express like CMC, or Hono for a lighter footprint — either is fine; CMC's Express is the proven path and lets us copy its route/ws wiring directly). **Reject** the dev-only Vite `PUT /__vault/` plugin currently in `vite.config.ts`: it dies when Vite stops, can't serve prod, and can't host a WebSocket or a long-lived PTY.
- **Ports:** API + WS on **4500** (CMC uses 4400 for Halon — offset to avoid clashing if both run); Vite client on **5173/5174**; client `fetch`/WS proxied to 4500 in dev. Two WS endpoints, copied from CMC: `/ws` (status+log) and `/ws/terminal` (PTY I/O).
- **Scripts:** add to polymath root or run from `.canon/.mission-control`: `"mc": "concurrently \"tsx watch server/index.ts\" \"vite\""` (CMC's exact dev shape).
- **Config:** `server/config.ts` sets `CANON_PATH=D:/VFXellence-LTD/.canon`, `VAULT_PATH=<merged polymath-business tree>`, `WORKSPACE_PATH=D:/VFXellence-LTD/polymath`, `DB_PATH=.data/mission-control.db`.

---

## 4. Amalgamation + flow

Three layers, one corrected topology. Governance is the `.canon` paradigms; the state + control plane is `.mission-control`; the worker is the Surge engine in `packages/agents`.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  GOVERNANCE — D:\VFXellence-LTD\.canon  (rules + business knowledge = truth)    │
│                                                                                 │
│  1_controller  brand-isolation, safeguards (viral-surge, lullaby), kill-switch, │
│                compliance, no-go, profiles/polymath/CLAUDE.md                   │
│  2_architect   ecosystems/ specs, agent designs, surge playbooks, codebase docs │
│  3_notes       research, inbox, app-ideas                                       │
│  4_orchestrator changelogs, ecosystem-dashboard, launches, calendars            │
│  5_knowledge   surge-formula, source-material corpus, prompts, tool evals       │
│  .claude/skills/polymath  polymath-pitfalls, niche-locker, ...                  │
└───────────────▲───────────────────────────────────────────────┬────────────────┘
   reads: surge-formula, Zrodinger spec,    │                    │ writes back:
   POLICY/safeguards, doctrine, board mirror │                    │ changelog entries,
                                             │                    │ launch records
┌────────────────────────────────────────────┴────────────────────▼──────────────┐
│  MISSION CONTROL — .canon\.mission-control  (control plane + SQLite state)       │
│                                                                                  │
│  client (React, CMC-mirrored)        server (Express/Hono + better-sqlite3 + WS) │
│  ─ Intake surface (register/setup)   ─ /api/issues(tasks)  ─ /api/campaigns      │
│  ─ Board (backlog/todo/in-progress/  ─ /api/approvals      ─ /api/agent-runs     │
│      in-review/done — NO Triage)     ─ /api/sessions (PTY) ─ /api/vault          │
│  ─ Campaign Control Panel            ─ scoping.ts middleware + per-ecosystem VIEWS│
│  ─ ► APPROVAL QUEUE ◄ (per-asset)    ─ WS /ws (status/log) ─ WS /ws/terminal(PTY)│
│  ─ Agent/Session Board + EmbeddedTerminal (xterm.js)                             │
│  ─ Kill-Switch Monitor                                                           │
│                                                                                  │
│  SQLite .data\mission-control.db  = single state home, all 5 ecosystems          │
│  Brand isolation = scoping middleware sets ecosystem scope per request;          │
│    per-ecosystem VIEWS (v_surge_tasks, v_signal_tasks, ...) prevent cross-reads  │
└───────────────▲───────────────────────────────────────────────┬────────────────┘
  spawn PTY session / read campaign         │                    │ writes:
  config; poll approval verdict             │                    │ agent_runs rows,
                                            │                    │ approval_queue rows,
                                            │                    │ artifact_path, draft
┌────────────────────────────────────────────┴────────────────────▼──────────────┐
│  SURGE ENGINE — polymath\packages\agents  (runtime worker = spawned Claude sess) │
│                                                                                  │
│  Launched by MC's PTY driver:  claude "/surge-generate <campaignId>"             │
│  cwd = packages/agents (optionally a per-campaign worktree)                      │
│  reads surge-formula + Zrodinger spec + POLICY from .canon →                     │
│  generates clip DRAFT → runs safeguard check → writes artifact to disk →         │
│  INSERT approval_queue(status=pending), task->in-review → HALTS, waits for human │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Where the per-asset gate sits

Squarely at the **Mission Control ↔ Engine** boundary, materialised as the `approval_queue` table + the Approval Queue UI. The spawned engine session **never publishes**: it produces a draft, writes the artifact, inserts a `pending` row, advances the task to `in-review`, and exits. Publish is downstream of an explicit Boss `approved` verdict — and for milestone-1 there is no publish step at all. This honours the standing prohibition `=== NEVER PUBLISH CONTENT ON BEHALF OF BOSS ===`.

### backlog → running → review → done (across the three layers)

1. **Backlog** (Intake surface + governance): Boss creates a campaign in the Intake/Launch wizard → `campaigns` row `planned`, child `tasks` at `backlog`. Run doctrine (surge-formula, Zrodinger spec, POLICY) lives in `.canon`; MC reads it.
2. **Running** (Board → PTY driver → Engine): Boss hits **Quick Start** / Campaign Control Panel "Run" → `campaigns.status=running`, task → `in-progress`, `agent_runs` row created, MC spawns the Claude-session PTY in `packages/agents`. The engine reads `.canon` doctrine and generates the draft + safeguard report.
3. **Review** (Engine → MC → Boss): engine writes the artifact, inserts `approval_queue (pending)`, sets task → `in-review`, campaign → `review`. WS pushes it live to the Approval Queue. **Boss reviews each asset** and sets `approved` / `rejected` / `changes-requested`.
4. **Done** (MC + governance): on `approved`, task → `done` (milestone-1 stops here as an approved *draft*); MC writes a changelog entry to `.canon/4_orchestrator/changelogs/` and a launch record to `4_orchestrator/projects/polymath-business/launches/`. On `rejected`/`changes-requested`, task → back to `in-progress` with notes; the engine session is `--resume`d (using `agent_runs.claude_session_id`).

Autonomy staging governs how 2–3 fire: Stage 0 every step manual; Stage 1 engine drafts on request; Stage 2 engine drafts on schedule but still queues; Stage 3 bounded-auto generation — **publish stays a human verdict at every stage.**

---

## 5. MVP build order — "one approved Zrodinger clip draft"

Build only the **thin slice** of Mission Control needed to put one draft in front of Boss. Resist over-building — the 30-day-manual rule and `polymath-pitfalls` discipline apply: the first engine run can be Stage 0/1 (manual trigger), and most CMC surfaces (Kill-Switch Monitor, full financial layer, Vault Browser) are deferred. Milestone-1 needs **no social accounts and no publish path.**

**Phase 0 — Governance (populate `.canon`; do NOT re-stamp)**
1. Create `1_controller/profiles/polymath/` + move `DEV-CLAUDE.md`/`README.md` in (Phase A above).
2. Merge `vault/dev/` (Phase B). Defer the *full* business-vault merge (Phase C) if it blocks — milestone-1 only needs the Surge doctrine present:
3. Confirm `.canon` has the doctrine the engine reads: **surge-formula**, **viral-surge safeguards POLICY**, **Zrodinger vertical spec**. These come from `ecosystems/viral/...` in the merge; copy just those three first if the full merge is deferred. Author stubs if any is missing.

**Phase 1 — Move the dashboard + thin server**
4. Move dashboard → `.canon/.mission-control/client` (Phase D); confirm it renders.
5. Stand up `server/` (Express/Hono + better-sqlite3): `db.ts` creating ONLY `tasks`, `campaigns`, `approval_queue`, `agent_runs` (+ the financial tables already used by the dashboard hooks). Defer the rest.
6. Add `scoping.ts` middleware + a single per-ecosystem VIEW for Surge (`v_surge_tasks`) — enough to prove brand isolation; generalise later.
7. Migrate the dashboard's localStorage hooks (`useTransactions`, `useTools`, `useSetupProgress`, `useLaunchProgress`) to `fetch('/api/...')`. Pure plumbing, no UI rewrite.

**Phase 2 — Approval surface FIRST (the gate), then campaign run**
8. Build the **Approval Queue** UI + WS `/ws` live updates. Build it before the engine so the engine has a real target row to write into.
9. Build a minimal **Campaign Control Panel**: create a Surge/Zrodinger campaign (intake), show it on the Board, expose a **Quick Start** button.

**Phase 3 — PTY engine driver + Surge engine (Stage 0/1)**
10. Port the CMC PTY chain verbatim into `server/`: `pty.service.ts`, `terminal.ws.ts`, `sessions.ws.ts`, `session.service.ts` (swap allowlist to `/surge-generate`...), `claude-sessions.service.ts` (match on `campaignId`). Port `EmbeddedTerminal.tsx` into the client. Mount the Session Board.
11. In `packages/agents`, build the minimal Surge/Zrodinger draft generator invoked as the `/surge-generate` skill/command: read `.canon` surge-formula + Zrodinger spec → produce ONE clip draft (script + asset) → run the safeguard check against viral-surge POLICY.
12. Wire engine output to state: write artifact to disk, `INSERT approval_queue(status=pending)`, task → `in-review`. **Engine HALTS.** Triggered manually from the Campaign Control Panel (Stage 0/1).

**Phase 4 — Close the loop (review → done)**
13. Boss opens the Approval Queue, reviews the one draft, clicks **Approve**. Task → `done`, campaign → `review`/`done`. MC writes a changelog entry to `.canon/4_orchestrator/changelogs/`.
14. **Milestone complete:** one approved Zrodinger clip draft — tracked in SQLite, governed by `.canon`, produced by a spawned Claude-session engine, gated per-asset, approved by Boss — with no publish and no accounts.

**Explicitly deferred (do NOT build for milestone-1):** Kill-Switch Monitor, full source-material corpus merge, Vault Browser/Search, multi-ecosystem VIEWS beyond Surge, batch approval, GitHub PR fanout, the publish path, Stage 2/3 scheduling. These wait until one draft has been produced by hand-triggered run and reviewed — per the 30-day-manual discipline.

---

## 6. Open questions / risks for the Boss

1. **Cross-repo git history (the one real migration tax).** Moving `apps/dashboard` and `vault/` from the polymath repo into the separate `.canon` repo cannot preserve line-level git history (`git mv` only works within a repo). **Decision:** accept a clean "import" commit in `.canon` (lose granular history but keep the files), or stand up a `git filter-repo` history-graft (more effort)? Recommendation: clean import — the content matters, the old commit graph does not.

2. **Delete `polymath/vault/` or keep a pointer?** After the merge, the husk is dead weight, but Obsidian users may have muscle memory. **Decision:** hard-delete `polymath/vault/` post-verification, or leave a one-line README pointing at `.canon`? (Phase F gate.)

3. **Obsidian vault root after the merge.** The business vault uses `[[wikilinks]]`. Re-homing under `.canon/.../polymath-business/` breaks them unless we (a) run a link-fix pass, or (b) open `.canon` itself as the Obsidian root going forward. **Decision:** which? (b) is cleaner long-term and matches the "one governance vault" model.

4. **`.canon` as its own git repo + GitHub.** `.canon` will hold business knowledge, safeguards, and the control-plane app. **Decision:** does `.canon` get its own private repo under `VFXellence-LTD` (e.g. `vfxellence-canon`), and is it OK that source-material legal/safeguards live in version control? (Recommend yes, private.)

5. **`.mission-control` mixes money-data + ops-data + a PTY host in one process.** Financial tables (transactions/tax) share the DB and process with the campaign control plane and a shell-spawning PTY driver. Pragmatic (one server, shared types) but worth a conscious nod. **Decision:** confirm one unified `.mission-control` app, vs splitting Finances into a separate read-only surface.

6. **Brand isolation depth.** Firm decision is scoping middleware + per-ecosystem VIEWS. **Decision (confirm scope):** is one shared DB with VIEWS + middleware sufficient, or do you want separate DB files per ecosystem for a harder physical guard? (Recommend shared DB + VIEWS — simpler, and the middleware is the real enforcement point; separate files complicate cross-ecosystem controller reporting.)

7. **Surge engine command surface.** The PTY driver invokes `/surge-generate` etc. as Claude commands. **Decision:** are these implemented as Claude Code **skills** under `.canon/.claude/skills/polymath/`, or as plain CLI scripts in `packages/agents` that the session calls? (Recommend skills — they get the governance context automatically and match CMC's slash-command driver.)

8. **Port collision with live CMC.** If Halon CMC (4400) and `.mission-control` run simultaneously on the same machine, ports must not clash. Plan uses 4500 + 5174 for MC. **Decision:** confirm the offset, or is MC never run alongside CMC?

9. **Per-asset gate vs throughput (flagged for later, not now).** Per-asset approval is firm and correct for trust-building but caps volume at Boss's review bandwidth at Stage 2/3. **Decision (later):** at what stage, if ever, do low-risk asset classes get *batch* approval — or is per-asset absolute forever?

---

## 7. LOCKED DECISIONS (2026-06-13, post-review) — this section makes the spec final

All forks resolved by Boss. This spec is decision-complete; next artifact is the phased implementation plan.

### Locked

- **MVP campaign:** Surge / Zrodinger (Tech/AI, anonymous brand).
- **Approval gate:** PER-ASSET — Boss approves each draft before any publish; publish stays human at every autonomy stage.
- **State home:** dashboard SQLite backend (`better-sqlite3`), single DB, all 5 ecosystems.
- **First milestone:** ONE approved Zrodinger clip *draft* — no publish, no social accounts.
- **Autonomy ladder:** Stage 0 manual → 1 assisted → 2 supervised → 3 bounded-auto; publish never autonomous.
- **`.canon` location:** `D:\VFXellence-LTD\.canon` (domain-level; already stamped 2026-06-05 — populate, do not re-stamp).
- **Mission Control:** `.canon/.mission-control` = the moved dashboard, CMC-mirrored; Board minus Triage; current dashboard becomes the "intake" surface.
- **Vault merge:** polymath `vault/` + `vault/dev/` merge INTO `.canon` (5-paradigm layout).
- **polymath role:** dev workspace of streams (`apps/*` + `packages/agents` = Surge engine).
- **Brand isolation:** shared DB + scoping middleware + per-ecosystem SQL views.
- **Engine driver:** spawned Claude Code session over PTY (ported from CMC).
- **Sequencing:** FULL RESTRUCTURE FIRST, then build the Surge MVP. *(Conscious override of pitfalls #9/#14 MVP-first caution — logged below.)*
- **Repo topology:** ONE monorepo. Re-root the single git repo at `D:\VFXellence-LTD\` (move `polymath/.git` up); track `.canon/`, `polymath/`, `abundenz-site/`. All moves become in-repo `git mv` (history preserved).
- **Engine commands:** Claude Code skills under `.canon/.claude/skills/polymath/` (`/surge-generate`, `/surge-safeguard-check`).

### Adopted defaults (Boss may override)

- Obsidian vault root → reopen at `.canon`. `polymath/vault/` → one-line pointer (not hard-deleted) until verified.
- Finances (transactions/earnings/tax) stay inside the unified Mission Control app + DB.
- Ports: API/WS **4500**, client **5174** (offset from Halon CMC's 4400).

### Privacy gate (REQUIRES Boss confirmation before any commit)

Re-rooting git at `D:\VFXellence-LTD\` will, by default, start tracking `_personal/`, `archive/`, `.claude/`, `bin/`. **`.gitignore` MUST exclude `_personal/` and `archive/` (private/dead) before the first commit** — they must never reach the VFXellence-LTD GitHub org. Also ignore: `node_modules/`, `**/.data/` (SQLite), `**/.obsidian/`, build output, env/secret files.

### Pitfalls override log

- **Override:** Boss chose full-restructure-first over MVP-first (2026-06-13).
- **Pitfall flagged:** #9 over-engineered automation / #14 architecture-as-escape-from-execution — building the full governance + control-plane before one clip exists.
- **Mitigation:** the Surge MVP (one approved draft) is scoped tight and built immediately after the restructure; Mission Control surfaces beyond the thin slice (Kill-Switch Monitor, full source-material merge, Vault Browser, multi-ecosystem views, publish path, Stage 2/3) remain deferred per §5.

### Next step

Phased implementation plan (via writing-plans): restructure phases (git re-root + gitignore → populate `.canon` → merge vault → move dashboard → repoint) then Surge MVP phases (MC thin slice → approval queue → PTY engine driver → one approved draft), each phase with worktree isolation and per-task model/effort routing.
