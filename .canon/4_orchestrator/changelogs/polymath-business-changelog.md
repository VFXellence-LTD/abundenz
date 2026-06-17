# Polymath Business Changelog

---

## 2026-06-17 — Phase B Epic #1: Ecosystem naming drift fix

**Sub-issues closed:** #5 (apply), #7 (reseed + verify), #9 (regression-check)

- Removed phantom `apps` / `Forge` ecosystem from all client code: `EcosystemId` and `EcosystemCodename` unions in `types/index.ts`, the `ECOSYSTEMS` array entry in `data/ecosystems.ts`, `FORGE_STEPS` const and `apps: FORGE_STEPS` entry in `data/launch-templates.ts`, `{ id: "apps" }` scope entry in `features/board/Board.tsx`, `<option value="apps">` in `CampaignsPage.tsx` and `ApprovalsPage.tsx`, `"apps"` in `IntakeForm.tsx` ECO array, `apps:` color map entries in `EntityPage.tsx`, and hardcoded `ecosystemId: "apps"` in `features/intake/intake.api.ts` (reassigned to `"content"`).
- Removed phantom `apps` / `forge` from server: `EcosystemId` union and `apps: "forge"` CODENAME entry in `server/scoping.ts`; updated `ecosystem_id` column comment in `server/db.ts`.
- Dropped `{ code: "LUL", name: "Lullaby", ... }` from `ECOSYSTEM_LEGEND` in `data/taxonomy.ts` (Lullaby is a vertical under Surge, not an ecosystem). Also removed Lullaby from the ecosystem↔stream mapping comment blocks in `taxonomy.ts` and `ecosystems.ts`, and from the taxonomy hierarchy comment in `taxonomy.ts`.
- **Q7 resolved — reseed is a no-op:** Ecosystems are code-only static data (no `ecosystems` table in SQLite). The 4 real machine IDs (`content/viral/products/affiliate`) are unchanged; zero DB rows were keyed by `apps`. No migration or seed script needed.
- **Typecheck:** `tsc --noEmit` on client returned exit 0, zero errors. The `build` script reports one pre-existing unrelated error (`within` unused import in `PlatformHandlesEditor.test.tsx`) that predates this work.
- **Tests:** 34/34 client tests pass (12 test files, vitest 2.76s).
- **Orphaned DB views flagged for Boss (do not drop yet):** The live SQLite DB at `server/.data/mission-control.db` still contains `v_forge_tasks`, `v_forge_approval_queue`, `v_forge_transactions`, and `v_forge_agent_runs` — created by a prior `createScopedViews` call when `apps/forge` was still in the CODENAME map. These are SELECT-only views, harmless, and will not be re-created on fresh DB init. Dropping them is a separate Boss-gated DB operation.

---

## 2026-06-17 — Phase A: GitHub PM standup (scaffold + epics)

**Project:** VFXellence Dev — https://github.com/orgs/VFXellence-LTD/projects/2

### Label set created (17 labels)
type/epic, type/task, type/bug, type/chore, type/infra, type/docs, priority/critical, priority/high, priority/medium, priority/low, area/mission-control, area/server, area/dashboard-client, area/polymath-engine, area/governance, area/automation, blocked

### Issues created
- #1 Epic: Ecosystem naming drift fix (type/epic, area/dashboard-client, priority/medium)
- #3 Read canonical ecosystem names from vault and produce the rename map (type/task, area/dashboard-client) → child of #1
- #5 Apply ecosystem rename across the 4 dashboard files (type/task, area/dashboard-client) → child of #1
- #7 Reseed SQLite and verify dashboard renders canonical names (type/task, area/dashboard-client) → child of #1
- #9 Regression-check ecosystem-keyed features (type/task, area/dashboard-client) → child of #1
- #2 Epic: HyperFrames render integration (type/epic, area/polymath-engine, priority/high)
- #4 Install and verify HyperFrames runtime deps (type/infra, area/polymath-engine) → child of #2
- #6 Write HyperFrames tool-eval in 5_knowledge/reference/polymath-business/tools/ (type/docs, area/polymath-engine) → child of #2
- #8 Wire npx hyperframes into AssemblyAdapter behind the HYPERFRAMES_BIN env gate (type/task, area/polymath-engine) → child of #2
- #10 Add tests for the HyperFrames dry-run path (type/task, area/polymath-engine) → child of #2
- #11 Render one real MP4 of an approved @zrodinger draft (integration proof) (type/task, area/polymath-engine) → child of #2
- #12 Chore: INFRA-001 orphan-worktree cleanup (type/chore, area/automation, priority/low)
- #13 Fix server-side brand registration (type/infra, area/server, priority/medium)
- #14 Update stale CLAUDE.md routing tables (type/infra, area/governance, priority/medium)

### Sub-issue linking
Native GitHub sub-issues used successfully via `addSubIssue` GraphQL mutation with `-H "GraphQL-Features: sub_issues"` header. All 9 sub-issues linked natively — no task-list fallback needed.

B.1 sub-issues: #3, #5, #7, #9 → parent #1
B.2 sub-issues: #4, #6, #8, #10, #11 → parent #2

### Project fields set
All 14 issues added to "VFXellence Dev" project (number 2) with Status=Backlog, Priority, and Area set.

Field IDs:
- Status: PVTSSF_lADOEOe9Dc4Ba6_yzhVvH2Q (options: Backlog=216817d8, Todo=59343333, In Progress=5282892a, In Review=11b7dc8b, Done=fc556a1d)
- Priority: PVTSSF_lADOEOe9Dc4Ba6_yzhVvIUs (options: Critical=747611df, High=7e918131, Medium=6aaded3b, Low=e3f47fbc)
- Area: PVTSSF_lADOEOe9Dc4Ba6_yzhVvIaE (options: mission-control=3378c68c, server=d378743c, dashboard-client=168066d3, polymath-engine=14808ed7, governance=129a8f59, automation=c74e10b5)

### Phase A — docs (governance + playbook + plan refinement)

- **Plan doc domain-split improved** (`4_orchestrator/projects/polymath-business/plans/github-pm-and-mvp-rollout-2026-06-17.md`): replaced the domain-split table with richer "Concern / Tracker / Identity scheme / Sync" columns capturing the two-directional loop (down = promotion, up = knowledge capture). Rewrote the "How `.canon` relates to the two trackers" subsection to make the deliberate authoring loop explicit and add the "No automatic sync, either direction" rule.
- **`.canon/CLAUDE.md` Issue Tracking rewritten**: replaced `FILE-BASED TRACKER ONLY / VFX-NNN` section with GitHub-native PM (`#NNN` for dev, SQLite for ops). `VFX-NNN` retired for dev. Branch naming updated from `TYPE/VFX-NNN/DESC` to `type/NNN-description`. Directory-tree comment for `projects/` updated from "File-based issue tracker" to "Business planning documents". Consolidated rules updated (`ALL DEV BRANCHES`, `NO DEV BRANCHES WITHOUT A GITHUB ISSUE`, `ALL DEV ISSUES TRACKED IN GITHUB`). After-PR checklist updated to close via `gh issue close` / `Closes #NNN` instead of file moves.
- **New AI-facing reference: `5_knowledge/reference/polymath-business/github-pm-playbook.md`** — covers: epic creation, sub-issue decomposition, `addSubIssue` GraphQL gotcha (requires `-H "GraphQL-Features: sub_issues"`), Project v2 field mutation via GraphQL, branch naming convention, commit `Refs #NNN` pattern, PR `Closes #NNN` auto-close, label scheme, PAT requirement for Actions, full gotchas table, stale routing tables note (issue #14). **Caveman compression skipped** — `anthropic` SDK not installed in available Python envs and `claude.cmd` not resolvable by Python subprocess on Windows without `shell=True`. Playbook remains uncompressed; compress manually with `/caveman:compress` from an interactive session.

### Phase A — code (workflows + bridge + seed migration)

- Part 2: Add .github/workflows/add-to-project.yml and auto-status.yml — auto-triage new issues to Backlog and track PR lifecycle (In Progress → Done); both INERT until PROJECT_PAT secret is set (§6.2).
- Part 3: Add "Report bug → GitHub issue" bridge — POST /api/bug-report with dry-run gate (MC_BUG_REPORT_ENABLED), area→label map, 8 passing tests, BugReportButton modal in MC sidebar.
- Part 5: Purged INFRA-001/002/003 from SQLite tasks (migrated to GitHub #12/#13/#14); seed-chores.ts now carries idempotent DELETE guard scoped to those 3 ids.

**Status:** Phase A complete except §6.2 PROJECT_PAT secret (Boss-only) — until set, the two Actions workflows are committed but inert. PM playbook is written but not yet caveman-compressed.

### Gotchas / PM playbook notes
- `gh project create` returns no output on success — use `gh project list` to confirm creation and capture number/node ID
- `updateProjectV2Field` singleSelectOptions must be inlined in the GraphQL query body (not passed via `--field`/`-f` as a JSON array — the `--field` flag coerces to string and fails type validation)
- `addSubIssue` mutation requires the `-H "GraphQL-Features: sub_issues"` header; without it the mutation is unrecognised
- `gh project item-add` with `--format json` returns the item node ID directly parseable as `.id`
- Status field default options (Todo/In Progress/Done) are replaced entirely by `updateProjectV2Field` — provide all 5 desired options in one mutation, not incremental adds
- Project node ID prefix: `PVT_` for org projects; item IDs prefix: `PVTI_`; field IDs: `PVTF_` (text) or `PVTSSF_` (single-select)
