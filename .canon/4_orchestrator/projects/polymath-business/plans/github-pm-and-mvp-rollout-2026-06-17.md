# GitHub PM Standup + MC Polymath MVP Rollout

**Date:** 2026-06-17
**Status:** Draft — awaiting Boss review
**Domain:** Polymath (VFXellence) — Boss: Robin Dutta
**Repo:** monorepo `D:\VFXellence-LTD` — git remote `git@github.com:VFXellence-LTD/vfxellence.git` (PRIVATE, Issues enabled)
**Relates to / partially supersedes:** `canon-integration-plan-v2-2026-06-13.md` (the file-based VFX-NNN tracker scheme it locks in is *retired for dev work* by this plan) and the `2026-06-13-MASTER-implementation-roadmap.md` (this plan re-expresses Plans 5–6 remaining work + naming drift as GitHub Epics).

---

## Purpose

Two coupled decisions, both approved by Boss:

1. **Split tracking by domain.** Software development of the monorepo moves to **GitHub Issues + Projects v2** on `VFXellence-LTD/vfxellence`. Business operations (products, campaigns, content, streams, workflows) **stay in the Mission Control SQLite database**. The two trackers do **not** sync; a one-directional bridge lets Mission Control file a GitHub bug.
2. **Sequence the next moves as coordinated GitHub Epics** that converge on a working MVP of "MC Polymath" — intake → draft → approve → render (real MP4 via HyperFrames) → approve → publish (human-gated).

This document is the authoritative spec for both. Decisions below are approved; the implementation detail (exact `gh` invocations, workflow YAML, server/client code) is for the executing subagents to write against this spec.

---

## Domain split — who tracks what

Three planes, distinct jobs. The first defines *intent*; the other two track *execution* — one for code, one for business.

| Concern | Tracker | Identity scheme | Sync |
|---------|---------|-----------------|------|
| **Intent & governance (the "why/what")** — standards, ecosystem/brand specs, architecture, plans, knowledge, changelogs | **`.canon` vault** — Obsidian markdown, git-tracked in `vfxellence` | file paths + plan/doc names | **Source of truth.** Hand-authored; flows *downward* into both trackers. Only upward flow is deliberate knowledge capture (changelogs/gotchas), never automatic. |
| **Dev execution (the "how/when" of code)** — MC app, polymath engine/packages, governance tooling, infra chores, bugs | **GitHub** `VFXellence-LTD/vfxellence` — Issues + Projects v2 | native issue numbers `#NNN` | **Instantiated from `.canon` dev plans** (plan → Epic → sub-issues). Owns dev state. Shares git audit trail with vault (`Closes #NNN`). |
| **Business execution (the "how/when" of ops)** — products, campaigns, content, streams, workflows, go-live setup | **SQLite** — Mission Control, `server/db.ts` `tasks` table | in-DB ids (e.g. `GOLIVE-001`) | **Configured from `.canon` ecosystem/brand specs** (spec → operational rows). Owns business state. No write-back to vault. |
| **Bridge** — MC "Report bug" → GitHub issue | SQLite → GitHub only | creates a native `#NNN` | **One-directional, fire-and-forget. No state sync** (see Hard rule). |

### How the `.canon` workflow relates to the two trackers

`.canon` is the **planning/governance plane — a workflow, not a ticket tracker.** It answers *why* and *what*; the trackers answer *how* and *when*. The relationship is a deliberate, human-authored loop — **down** by promotion, **up** by knowledge capture — never an automatic sync.

**Down — promotion (an authoring act):**
- **Dev plans** authored in `.canon/4_orchestrator/projects/.../plans/` (like this doc) are **instantiated as GitHub Epics + sub-issues.** The Epic links back to the `.canon` spec for rationale; GitHub then owns execution state.
- **Business / ecosystem specs** in `.canon/2_architect/.../ecosystems/` + `.canon/1_controller/standards/` define the brands, verticals, and policies that **SQLite tracks operationally** (campaigns, content, go-live tasks).

**Up — knowledge capture (an authoring act):**
- On phase/epic completion, changelogs + gotchas are **hand-written back** into `.canon/4_orchestrator/changelogs/` and `5_knowledge/reference/...` (per the VAULT UPDATE block). This is the *only* upward flow — a deliberate act by Claude or Boss capturing outcomes as knowledge, **never a machine state-mirror.**

**Shared audit trail:** because the vault lives in the **same `vfxellence` git repo**, its history is captured in git and referenced from issues/PRs (`Closes #NNN`, commit refs) — governance edits and dev work share one trail.

**No automatic sync, either direction.** GitHub never writes to SQLite; SQLite never polls GitHub; neither writes machine-state into `.canon`. Every cross-plane move is a deliberate authoring act.

### Hard rule — no bidirectional sync

The bridge creates a GitHub issue from MC and returns the URL. After creation the two systems are independent — GitHub does not write back to SQLite, and SQLite does not poll GitHub.

---

## Part 1 — GitHub project management standup (Phase A)

This is the dev-tracking foundation. **It blocks every later phase** because the Phase B epics are tracked as GitHub issues.

### 1.1 Project v2 structure

- **Project:** "VFXellence Dev" (org-level Project v2 under the `VFXellence-LTD` org).
- **Views:** Board, Table, Roadmap.
- **Custom fields:**

  | Field | Type | Values |
  |-------|------|--------|
  | Status | single-select | Backlog, Todo, In Progress, In Review, Done |
  | Priority | single-select | Critical, High, Medium, Low |
  | Area | single-select | mission-control, server, dashboard-client, polymath-engine, governance, automation |
  | Iteration | iteration (optional) | (sprint cadence, optional — used only if Boss wants time-boxing) |

### 1.2 Issue hierarchy

- **Epic** = an issue labeled `type/epic` with **native GitHub sub-issues** (task / bug / chore / infra). Sub-issues roll up under the epic in the Projects v2 UI.
- Sub-issues are atomic — each is a single, independently mergeable unit of work.

### 1.3 Labels

| Group | Labels |
|-------|--------|
| `type/` | `type/epic`, `type/task`, `type/bug`, `type/chore`, `type/infra`, `type/docs` |
| `priority/` | `priority/critical`, `priority/high`, `priority/medium`, `priority/low` |
| `area/` | `area/mission-control`, `area/server`, `area/dashboard-client`, `area/polymath-engine`, `area/governance`, `area/automation` |
| status | `blocked` |

The repo currently has only GitHub default labels and **0 issues** — Phase A creates the full label set before any issue is filed.

### 1.4 IDs

- Dev work uses **native issue numbers** (`#NNN`).
- The `VFX-NNN` scheme is **retired for dev tracking** (see §4 governance — long-form business planning markdown may remain as *docs*, not as an issue tracker).

---

## Part 2 — Automations (GitHub Actions)

Workflows live in **`D:\VFXellence-LTD\.github\workflows\`** (this directory does **not yet exist** — Phase A creates it).

| Workflow | Trigger | Effect |
|----------|---------|--------|
| `add-to-project.yml` | issue opened | add issue to "VFXellence Dev" project, set Status = Backlog |
| `auto-status.yml` | PR opened referencing an issue | set linked issue Status = In Progress |
| `auto-status.yml` | PR merged / issue closed | set linked issue Status = Done |

### 2.1 PAT requirement (gotcha)

The default `GITHUB_TOKEN` **cannot write org-level Projects v2.** Both workflows must authenticate with a **fine-grained PAT** stored as repo secret **`PROJECT_PAT`** with project write permission. This is a **Boss-run setup step** (see §6 setup gate) — Claude cannot create PATs or set secrets requiring interactive auth.

---

## Part 3 — Mission Control bug-report bridge

A button in the MC shell lets Boss file a dev bug straight into GitHub without leaving the dashboard.

### 3.1 Client

- Button in the MC shell → modal with fields: **title, description, area, severity**.
- On submit, POST to the server endpoint; show the returned GitHub issue URL on success.

### 3.2 Server

- `POST /api/bug-report` → shells out to:
  `gh issue create --repo VFXellence-LTD/vfxellence ...` with labels `type/bug` + `area/*` (mapped from the modal's area field), title and body from the payload.
- Returns the created issue URL to the client.

### 3.3 Gating + tests

- Gated behind env **`MC_BUG_REPORT_ENABLED`** (default **off** ⇒ **dry-run**: validate + log "WOULD CREATE ISSUE", return a synthetic URL, do **not** shell `gh`). This mirrors the existing publish/render dry-run discipline (see Plan 6 §Doctrine, `BUFFER_TOKEN` absence ⇒ dry-run).
- **Tests required** for the dry-run path, written in the app's existing test style (`server/test/*.test.ts`, vitest + supertest-style against the Express app). At minimum: dry-run returns synthetic URL and never invokes `gh`; payload validation (400 on missing title); area→label mapping.

**Touched files (target):**

```
.canon/.mission-control/server/routes/bug-report.ts      # NEW — POST /api/bug-report
.canon/.mission-control/server/services/bug-report.service.ts # NEW — gh shell + dry-run
.canon/.mission-control/server/index.ts                  # EXTEND — mount router
.canon/.mission-control/server/test/bug-report.*.test.ts # NEW — dry-run path tests
.canon/.mission-control/client/src/...                   # NEW — bug-report button + modal (place in MC shell)
```

---

## Part 4 — Claude Code PM workflow + governance rewrite

### 4.1 Rewrite `.canon/CLAUDE.md` "Issue Tracking" section

The governance file `D:\VFXellence-LTD\.canon\CLAUDE.md` currently states (lines ~69–75):

> `## Issue Tracking (No Jira)` … `=== NO JIRA. NO ATLASSIAN. FILE-BASED TRACKER ONLY. ===` … `ID scheme: VFX-NNN`

This must be rewritten to:

- **Dev work** → GitHub `VFXellence-LTD/vfxellence` Issues + Projects v2 (native `#NNN`).
- **Business ops** → SQLite Mission Control (`tasks` table).
- **`VFX-NNN` retired for dev.** Business *long-form planning docs* may remain as documents under `4_orchestrator/projects/` (this plan is one), but they are **not an issue tracker**.
- The branch-naming convention `TYPE/VFX-NNN/DESCRIPTION` (lines ~107, ~122) updates to reference GitHub issue numbers for dev branches (e.g. `feat/123-add-hyperframes`).
- The directory-tree comment at ~line 43 (`projects/ # File-based issue tracker (VFX-NNN)`) updates accordingly.

> The "NO JIRA / NO ATLASSIAN" stance is **unchanged and still correct** — we are not adopting Atlassian. We are replacing the *home-grown file-based* dev tracker with GitHub-native PM, which the global toolchain already supports (`gh` authed, `git -C`, PR workflow).

### 4.2 Add a Claude PM playbook

New reference doc under `.canon/5_knowledge/reference/polymath-business/` (e.g. `github-pm-playbook.md`) defining how Claude:

- **Creates an epic:** `gh issue create` with `type/epic`, area + priority labels; body lists planned sub-issues.
- **Decomposes into sub-issues:** one atomic issue per unit; links each as a native sub-issue of the epic.
- **Sets Project fields via `gh`:** add issue to project, set Status / Priority / Area (Projects v2 field mutations via `gh project` / GraphQL).
- **References issues in commits:** `#NNN` in commit bodies.
- **Auto-closes via PRs:** `Closes #NNN` in the PR description.
- Notes the **dry-run-by-default** discipline carried over from the publish/render layers.

Run `/caveman:compress` on the playbook after writing (AI-facing doc).

### 4.3 Stale routing tables (was INFRA-003)

Note in the playbook (and fix as part of governance phase) that these still reference the old `polymath/vault/*` + `apps/dashboard` layout and need updating to the `.canon` + `.mission-control` layout:

- `D:\VFXellence-LTD\.claude\CLAUDE.md`
- `D:\dev\.claude\CLAUDE.md`

This is the work formerly tracked as MC chore **INFRA-003** ("Update stale CLAUDE.md routing tables").

---

## Part 5 — Migration of existing chores

The MC seed script `server/scripts/seed-chores.ts` currently seeds 7 chores. Migration rules:

| Seeded id | Title | Destination | Action |
|-----------|-------|-------------|--------|
| `INFRA-001` | Delete orphan git worktree dirs | **GitHub issue** (`type/chore`/`type/infra`, `area/automation`) | move to GitHub; **remove from SQLite seed** |
| `INFRA-002` | Fix server-side brand registration | **GitHub issue** (`type/infra`, `area/server`) | move to GitHub; **remove from SQLite seed** |
| `INFRA-003` | Update stale CLAUDE.md routing tables | **GitHub issue** (`type/infra`, `area/governance`) | move to GitHub; **remove from SQLite seed** |
| `GOLIVE-001` | Create @zrodinger social accounts | **stay in SQLite** (business go-live) | keep |
| `GOLIVE-002` | Connect Buffer/Postiz / obtain tokens | **stay in SQLite** | keep |
| `GOLIVE-003` | Set Mission Control env vars | **stay in SQLite** | keep |
| `GOLIVE-004` | Approve paid-tool spend | **stay in SQLite** | keep |

> Note on actual seed content: `INFRA-002` as currently seeded is "Fix server-side brand registration" (a server feature), not a pure infra chore — it is still **dev work** and so still moves to GitHub. The brief's framing of INFRA-002 as a generic infra chore should defer to this actual content.

**Seed file change:** `seed-chores.ts` drops the three `INFRA-*` entries; SQLite is **business-only** after this. Keep the four `GOLIVE-*` entries. Reseed.

**Also seed as GitHub issues** (open dev threads not yet in any tracker, captured from current project state):

- **HyperFrames render wiring** — the open dev thread to replace the dry-run render stub (becomes the Phase B HyperFrames epic, §B.2).
- **Ecosystem naming drift** — canonical-name reconciliation in dashboard code (becomes the Phase B naming epic, §B.1).
- **Orphan-worktree cleanup** — same as `INFRA-001` (the migrated chore *is* this thread; do not double-file).

---

## Part 6 — Setup gate (Boss runs — interactive, Claude cannot)

These steps require interactive auth / credential creation and are **Boss-only**. Phase A code work proceeds in parallel, but the Actions automations (§2) and any `gh project` field mutations are inert until these land.

1. `gh auth refresh -s project` — the current `gh` token (user `rhdutta`) has scopes `admin:public_key, gist, read:org, repo` but **lacks `project`**, required for Projects v2 reads/writes.
2. Create a **fine-grained PAT** with project write permission → add it as repo secret **`PROJECT_PAT`** on `VFXellence-LTD/vfxellence`.

---

## Rollout & MVP sequencing

Boss wants the next moves planned as coordinated GitHub Epics converging on a working MVP of **MC Polymath**. Phased and dependency-ordered:

### Phase A — Stand up GitHub PM

Everything in **Parts 1–6** above. **Blocks everything else.** Until labels, the project, the bridge, and the governance rewrite exist, Phase B epics have nowhere to live. The Boss setup gate (§6) runs in parallel and must complete before the Actions automations are functional.

**Acceptance:** "VFXellence Dev" project exists with the field/label scheme; `add-to-project.yml` + `auto-status.yml` committed and (after the setup gate) functioning; MC bug-report button files a dry-run issue with tests green; `.canon/CLAUDE.md` Issue Tracking section rewritten; PM playbook written; the three `INFRA-*` chores migrated to GitHub and removed from the SQLite seed.

### Phase B — Coordinated Epics toward MVP

Each becomes a GitHub **Epic** (`type/epic`) with atomic sub-issues, **executed by low-effort coordinated subagents** (model: Light tier), **worktree isolation for every code-writing agent** (per global doctrine).

| Epic | Area | Size | Depends on |
|------|------|------|------------|
| B.1 Ecosystem naming drift fix | `area/dashboard-client` | small (clear scope, code fix) | A |
| B.2 HyperFrames render integration | `area/polymath-engine` | large (deps + real CLI + tool eval) | A |
| B.3 INFRA-001 orphan-worktree cleanup | `area/automation` | quick | A |

#### B.1 — Epic: Ecosystem naming drift fix

The dashboard code carries **stale ecosystem labels** (e.g. Signal / Atelier / Conduit / Forge). The **vault is the source of truth** for canonical names — **not** the code's stale labels.

- **Canonical source:** `.canon/1_controller/standards/polymath-business/brand-naming.md` + `.canon/2_architect/polymath-business/ecosystems/` (contains `affiliate/`, `content/`, `products/`, `viral/`). Active vertical brand is **@zrodinger** (Viral / Surge).
- **Find-replace across dashboard code** to match canonical names:
  - `.canon/.mission-control/client/src/data/ecosystems.ts`
  - `.canon/.mission-control/client/src/data/launch-templates.ts`
  - `.canon/.mission-control/client/src/types/index.ts` (the `EcosystemCodename` type)
  - `.canon/.mission-control/client/src/data/entity.ts`
- **Reseed** after the rename so SQLite ecosystem ids/names match.
- Sub-issues: (1) read canonical names from vault and produce the rename map; (2) apply rename in the four files; (3) reseed + verify dashboard renders canonical names; (4) regression-check ecosystem-keyed features.

#### B.2 — Epic: HyperFrames render integration

Replace the **dry-run `AssemblyAdapter` stub** (env `HYPERFRAMES_BIN`) in the render pipeline with real **`npx hyperframes`**.

- Tool: `github.com/heygen-com/hyperframes`. CLI supports `init` / `preview` / `render`; supports voice + visual + assembly + audio mixing.
- **Runtime deps to install:** Node 22 + FFmpeg + headless Chrome / Puppeteer.
- **Capture a verified tool-eval** in `.canon/5_knowledge/reference/polymath-business/tools/` (e.g. `hyperframes.md`) following the existing tool-eval format used for `buffer.md` / `postiz.md`.
- **Dry-run discipline preserved:** absence of `HYPERFRAMES_BIN` (or a `HYPERFRAMES_ENABLED=off` gate) ⇒ dry-run, never fail-hard — consistent with the publish layer.
- Sub-issues: (1) install + verify runtime deps (FFmpeg, headless Chrome/Puppeteer, Node 22); (2) write the HyperFrames tool-eval; (3) wire `npx hyperframes` into the AssemblyAdapter behind the env gate; (4) tests for the dry-run path; (5) one real MP4 render of an approved @zrodinger draft as the integration proof.

#### B.3 — Epic/chore: INFRA-001 orphan-worktree cleanup

Delete orphan git worktree dirs left outside the repo:

- `D:\VFXellence-LTD-mc-worktree`
- `D:\VFXellence-LTD-wt-plan2` … `D:\VFXellence-LTD-wt-plan6`

These are outside the repo (disk only); the MC sandbox blocked auto-delete. Quick chore — single sub-issue. (This is the same thread as migrated chore `INFRA-001`.)

### MVP acceptance — "working MVP of MC Polymath"

The end-to-end loop is real when, for one **@zrodinger** (Viral / Surge) item:

1. **Intake** — campaign/clip request entered in Mission Control.
2. **Draft** — a spawned Claude session generates a safeguard-checked draft, surfaced in the Approval Queue.
3. **Approve (draft)** — Boss approves the draft in the queue.
4. **Render** — the render pipeline produces a **real MP4 via HyperFrames** (not a dry-run stub), attached as a `content_type='video'` approval.
5. **Approve (render)** — Boss approves the rendered video.
6. **Publish** — **human-gated**: Boss clicks Publish per asset (dry-run until go-live creds set; never autonomous).

Plus:

- The dashboard shows **correct canonical ecosystem names** (B.1 done).
- All **dev work is tracked in GitHub** (Phase A done); business ops remain in SQLite.

**Publishing stays human-gated forever.** No scheduler, agent, cron, or WS event ever triggers `/api/publish` (carried from Plan 6 doctrine). The MVP proves the loop end-to-end with publish in dry-run; going live is a separate Boss-gated step (`GOLIVE-001..004`).

### Execution model

- **Coordinated subagents on low-effort (Light tier) models** for the Phase B epics — scope is well-defined enough that planning overhead is low.
- **Worktree isolation** for every code-writing agent (global doctrine; protects the main checkout, allows parallel epics without conflict).
- Each epic's **sub-issues are atomic** — independently plannable, mergeable, and closable via `Closes #NNN`.
- B.1 and B.3 can run in parallel (independent areas); B.2 is the long pole and gates the MVP render step.

---

## Open questions / risks

1. **PAT scope choice.** Fine-grained PAT vs classic PAT for `PROJECT_PAT`. Fine-grained is preferred (least-privilege, project write only) but org-level Projects v2 sometimes need the PAT to be org-approved. Boss to confirm the org allows fine-grained PATs for Projects, else fall back to a classic PAT with `project` scope.
2. **Is business-planning markdown fully retired?** This plan keeps long-form business planning docs (like this one) under `4_orchestrator/projects/` as *documents*, while retiring `VFX-NNN` as a *dev issue scheme*. Confirm Boss agrees business docs are NOT promoted back into an issue-tracking role (i.e. no VFX-NNN ids minted going forward, even for business).
3. **GitHub Actions org-Projects permission gotcha.** `add-to-project.yml` / `auto-status.yml` will silently no-op (or 403) if `PROJECT_PAT` is missing/under-scoped, since the default `GITHUB_TOKEN` cannot write org Projects v2. Need a smoke test after the setup gate: open a throwaway issue and confirm it lands in the project at Status=Backlog.
4. **Bridge one-directionality.** Confirm Boss is content that a GitHub issue closed via the bridge never reflects back into MC (by design). If MC ever needs to show "this bug is fixed", that's a future read-only poll, explicitly out of scope here.
5. **HyperFrames runtime footprint.** FFmpeg + headless Chrome/Puppeteer on the dev machine — confirm install is acceptable and the `heygen-com/hyperframes` CLI surface (`init`/`preview`/`render`) matches what the AssemblyAdapter expects before committing to the wiring. Tool-eval (B.2 sub-issue 2) de-risks this before code.
6. **Iteration field.** Optional in the project schema — confirm whether Boss wants sprint/iteration time-boxing now or leaves it unused.
7. **Reseed coordination (B.1).** Renaming ecosystem ids and reseeding must not orphan existing `tasks` / `approval_queue` rows keyed by old ecosystem ids. The rename sub-issue must include a data-migration check or run against a fresh DB.

---

## VAULT UPDATE (append to executing-subagent briefs)

On completing each phase/epic, append to a changelog under
`D:\VFXellence-LTD\.canon\4_orchestrator\changelogs\` (or the project's active changelog): one bullet per sub-issue — GitHub issue/PR `#NNN`, what shipped, tests, commit hash. Update this plan's status when Phase A lands. Capture any gotcha (PAT scope, Projects v2 GraphQL field mutation quirks, HyperFrames CLI drift, FFmpeg/Puppeteer install notes) into the relevant `5_knowledge/reference/polymath-business/tools/` eval or the PM playbook.
