# Polymath Business Changelog

---

## 2026-06-23 — Codename sweep tier 3: surge→viral skill chain + scoping views→literal ids

- **Part A (commit `e201f1f`):** Renamed the `surge` skill chain to `viral`. `git mv`'d the 5 skill dirs (`surge-generate|continue|render|safeguard-check|publish` → `viral-*`) under `.canon/.claude/skills/polymath/`. Updated `session.service.ts` ALLOWED_SKILLS, `routes/sessions.ts` start command, `prompt.service.ts` seed prompt, and `terminal.ws.ts` comment to `/viral-*`. Renamed npm scripts `surge:run`/`surge:render` → `viral:run`/`viral:render` and `bin/surge-*.ts` → `bin/viral-*.ts` (with internal usage/error strings + agents package description). Updated all 5 SKILL.md bodies and the affected server tests (session.service, sessions.route, prompt.service, pty-ws.smoke, claude-sessions). Deliberately left `ELEVENLABS_SURGE_VOICE_ID`, `agentName: "surge-writer"`, the `@surge` handle fixture, and agents tmpdir prefixes untouched (out of scope). Server 120 pass/1 skip; agents 54 pass.
- **Part B (commit `c681dc6`):** Collapsed the `scoping.ts` CODENAME map to literal ecosystem ids (`content/viral/products/affiliate`), so scoped views are now `v_content/v_viral/v_products/v_affiliate_*`. Added a `LEGACY_VIEWS` list and `DROP VIEW IF EXISTS` for the 16 old `v_surge/v_signal/v_atelier/v_conduit_*` views, run on every `createScopedViews()` init (db.ts L230 in `migrate()`) so live DBs shed orphan views. Updated `scoping.test.ts` view-name assertions (+ added products/affiliate checks), the client `types/index.ts` taxonomy header comment, the `db.ts` DDL example comment, and the `SURGE-001`/`SIGNAL-1`/`SURGE-000` test fixtures in `engine-tables.test.ts` and `db.test.ts` → `VIRAL-*`/`CONTENT-*`. Full server suite green (120 pass/1 skip).
- **Pushed:** `7e5e541..c681dc6` → origin/develop.
- **Known remainder (judgment call, not changed):** Client test/UI fixture *display strings* still contain free-text "Surge" (e.g. campaign name `"Surge Tech Sprint"`, task title `"Render Surge clip draft"`) — these are human-readable sample values, not code identifiers/slugs/view-names; their `ecosystemId` is already `"viral"`. The `OPERATOR-MANUAL.html` view-name table still lists old `v_surge_*` names (human-facing doc prose, out of scope).

---

## 2026-06-23 — Content-engine framework integrated into viral ecosystem

- **viral-formula.md:** Added "Pre-Step: Angle Multiplication" — 1 topic × 5 fixed angles (`mistake | beginner_question | transformation | contrarian | step_by_step`) × 3 formats × 4 platforms = 30+ pieces from one idea. Includes worked @zrodinger quantum/science example showing all 5 angle variants.
- **first-hour-playbook.md (new):** Human post-publish SOP covering the three first-hour tactics: (a) seed a first comment, (b) reply to every comment immediately, (c) engage larger niche accounts. Explicitly states automation risks platform penalties — permanently manual task. Includes saves > shares > comments > likes hierarchy rationale.
- **clip-factory.md:** Added Stage 12 — First-Hour Human Engagement, pointing to first-hour-playbook.md. Clearly marked as a human step, post-publish, not automated.
- **platform-rpm.md:** Added "Engagement Signals That Matter" section — saves > shares > comments > likes as the primary data axis for deciding what to scale. Ties the angle set to save-optimized content design. States that saves/shares data — not taste — decides what scales.
- **hook-library.md:** Named "The Loop Principle" in Hook Construction Rules (open a loop, don't describe the topic; ≈2s gate). Added note that hook categories in this file are the source for `hook_tag` values in Module 2 `performance_signal`.
- **growth-operator-design-2026-06-21.md:** 2026-06-23 refinements — `performance_signal` gains `saves integer nullable` and `shares integer nullable`; `content_params` gains `optimize_for text` (rpm|saves|shares|reach, default saves, tension with RPM thesis noted); `hook_tag`/`style_tag` typed against hook-library.md categories; Module 4 `TopicPicker` documented as picking ONE topic and scheduling all 5 angle-variants into the approval queue; deferred `ClipDraft.angle` enum field (`mistake|beginner_question|transformation|contrarian|step_by_step`) noted as YAGNI until DraftGenerator is built. Data Model Summary table updated accordingly.

---

## 2026-06-21 — Module 1 routing-layer complete + ship-ready

- Module 1 (multi-account routing layer) COMPLETE + ship-ready — 5 TDD tasks: schema (platform_accounts routing fields + publish_log.account_id), CredentialResolver (per-account Buffer profileId, dry-run safe), RoutingService (pure; LRU sort, stagger, no-identical default cap 1, ecosystem scope), publish.service wiring + BufferDistributor profileId injection, route-level integration test. Commits 5783da5..4d25a2e. All gates intact: publish stays human-gated, dry-run by default, no-identical-cross-account default, RoutingService pure read-only. Full suites green (server 120 pass/1 skip; publish 16 pass).
- FOLLOW-UP (deferred, out of Module 1 scope): nothing writes `platform_accounts.last_posted_at` back after a publish — LRU rotation will not advance on real publishes until a later module/go-live step closes this writeback.

---

## 2026-06-21 — Module 1 routing-layer implementation plan written

- Module 1 routing-layer implementation plan written (5 tasks, TDD) for the multi-account routing layer: platform_accounts routing fields, publish_log.account_id, per-account credential resolver, pure RoutingService (rotation/stagger/slot limits), publish.service wiring. Buffer credential injection wired end-to-end (dry-run until go-live tokens).

---

## 2026-06-21 — Growth-operator design spec written

- Growth-operator design spec written to `4_orchestrator/projects/polymath-business/plans/growth-operator-design-2026-06-21.md` — covers 4 modules (multi-account routing layer, closed feedback loop, meta-ads amplification, pre-publish daily loop orchestrator), all gated off by default, `viral` / @zrodinger first with other ecosystems inheriting later. Awaiting Boss spec review before GitHub epics are filed.

---

## 2026-06-19 — Phase B INFRA-001: Orphan worktree cleanup (closes #12)

- **6 orphan directories removed** from disk (all outside the repo root at `D:\VFXellence-LTD\`):
  - `D:\VFXellence-LTD-mc-worktree` — stale gitfile pointer; worktree metadata already gone from `.git/worktrees/`
  - `D:\VFXellence-LTD-wt-plan2` — stale gitfile pointer (same)
  - `D:\VFXellence-LTD-wt-plan3` — stale gitfile pointer (same)
  - `D:\VFXellence-LTD-wt-plan4` — plain stale directory snapshot (no git), dated Jun 14
  - `D:\VFXellence-LTD-wt-plan5` — stale gitfile pointer (same)
  - `D:\VFXellence-LTD-wt-plan6` — plain stale directory snapshot (no git), dated Jun 14
- **Verification:** All 6 confirmed absent from disk post-deletion. `git worktree prune` run — no residual metadata. `git worktree list` shows main checkout only.
- **No dirs skipped** — all were confirmed clean (no uncommitted changes, no unpushed commits; worktree metadata had already been pruned from the main repo).
- **GitHub:** Issue #12 closed; VFXellence Dev board Status = Done.

---

## 2026-06-18 — Phase B Epic #2: Harden HyperFrames invocation (closes #2, #4, #6, #8, #10, #11)

- **Shell injection hardening:** Replaced `{ shell: true }` on both the `npx hyperframes render` call and the `ffmpeg` thumbnail call in `packages/agents/src/adapters/assembly.ts`.
- **Windows-safe pattern:** On Windows, `npx` is a `.cmd` shim that cannot be spawned with `execFile` directly (EINVAL). Correct injection-safe pattern: `execFile("cmd.exe", ["/c", "npx", ...args])` — args passed as argv array, never concatenated into a shell string. On POSIX: plain `execFile("npx", args)`.
- **Re-verified:** Real render re-run with hardened code; `zrodinger-proof-001.mp4` produced — 1080×1920, 32s, H.264 + AAC, isom/MP4, 2 streams. ffprobe probe_score 100.
- **Tests:** 54/54 passing (no test changes needed — tests mock execFile and don't assert shell option).
- **Epic closed:** All sub-issues (#4, #6, #8, #10, #11) and epic (#2) closed on VFXellence Dev board, Status = Done.

---

## 2026-06-18 — Phase B Epic #2: Real MP4 integration proof (sub-issue #11)

- **Draft:** Authored @zrodinger clip draft directly (stand-in for spawned Claude session) — AI-tools productivity tip: 3-tool stack (prompt library + image-to-caption pipeline + smart scheduler) recovering 8-12 hours/week, 30s narration, 4 shots
- **Voice:** STUB (ElevenLabs — no `ELEVENLABS_API_KEY`/`ELEVENLABS_SURGE_VOICE_ID`); replaced with silent MP3 placeholder via ffmpeg
- **Visual:** STUB (Higgsfield/Meta.ai — no `hf.exe`); replaced with 4 colored 1080×1920 PNG placeholders via ffmpeg
- **Assembly (HyperFrames):** REAL — `npx hyperframes@0.6.110 render` project-dir model, `HYPERFRAMES_ENABLED=true`
- **Windows shell fix:** `execFile('npx', ..., { shell: true })` added to `assembly.ts` — Windows requires `shell: true` because `npx` is a `.cmd` shim, not a bare executable; same fix applied to the ffmpeg thumbnail extraction call
- **Result:** PROVEN — `zrodinger-proof-001.mp4`, ffprobe: 1080×1920 portrait, duration 32s, video stream (H.264 High@L4.0, 30fps) + audio stream (AAC LC stereo, 48kHz); container isom/MP4; 2 streams confirmed
- **Output path:** `D:\VFXellence-LTD\polymath\proof-output\renders\zrodinger-proof-001\`
- **Remaining for full-real pipeline:** ElevenLabs API key + voice ID (voice stage); Higgsfield/Meta.ai CLI access (visual stage); spawned-Claude-session trigger wiring (draft stage)

---

## 2026-06-17 — Phase B Epic #2: HyperFrames tool-eval (sub-issue #6)

- Verified HyperFrames tool-eval written to `5_knowledge/reference/polymath-business/tools/hyperframes.md` (v0.6.110 CLI ground-truth, captured via `npx hyperframes@0.6.110`); most important finding: `render` takes a project **directory** (`[DIR]`), not an HTML file path, and has no `--thumbnail` flag — the adapter's current invocation (`["render", htmlPath, "--output", videoPath, "--thumbnail", thumbnailPath]`) is entirely wrong and must be replaced with a project-dir-based invocation + separate FFmpeg thumbnail extraction.

---

## 2026-06-17 — Phase B Epic #2: AssemblyAdapter wiring + dry-run tests (sub-issues #8 + #10)

### Sub-issue #8 — Wire `npx hyperframes@0.6.110` into AssemblyAdapter

File: `packages/agents/src/adapters/assembly.ts` — fully rewritten real render path.

- **Env gate renamed**: `HYPERFRAMES_BIN` → `HYPERFRAMES_ENABLED`. `HYPERFRAMES_ENABLED === "true"` enables real render; anything else (absent, "false") stays dry-run. Matches existing dry-run discipline (same pattern as `MC_BUG_REPORT_ENABLED`).
- **Version constant**: `const HYPERFRAMES_VERSION = "0.6.110"` declared at top of file.
- **Real render path — project-dir model**: creates `<outDir>/<slug>-hf-project/` with `assets/` subdir; copies voiceover + visual assets in with `copyFileSync` (Windows-safe, no symlinks).
- **Scaffold files written**: `hyperframes.json` (matches real scaffold schema/registry/paths), `meta.json` (id/name/createdAt).
- **Portrait composition**: `buildCompositionHtml()` (exported pure function) generates `index.html` at **1080×1920** portrait — correct `data-width`, `data-height`, `data-composition-id="main"`, `window.__timelines["main"]`, GSAP CDN, per-shot clip divs with cumulative `data-start` offsets from `draft.shotlist`, voiceover `<audio>` track.
- **Invocation corrected**: `execFile("npx", ["hyperframes@0.6.110", "render", projectDir, "-o", videoPath, "--quiet"], { cwd: projectDir })` — project DIR (not HTML path), no `--thumbnail` flag.
- **FFmpeg thumbnail**: `execFile("ffmpeg", ["-ss", "1", "-i", videoPath, "-vframes", "1", "-y", thumbnailPath])` — separate from hyperframes CLI.
- **Return contract preserved**: `{ videoPath, thumbnailPath, durationSec, step }` — unchanged for callers.
- **`HYPERFRAMES_BIN` fully purged** — only two references existed (both in `assembly.ts`); both replaced. No `.env.example` existed to update.

### Sub-issue #10 — Dry-run tests

File: `packages/agents/test/assembly.adapter.test.ts` — rewritten with 14 tests (all pass).

- Gate-off tests: `HYPERFRAMES_ENABLED` unset → dry-run; `HYPERFRAMES_ENABLED=false` → dry-run; explicit `available:false` → dry-run stub files.
- Cost-safety override: `forceDryRun:true` even with `available:true` → dry-run.
- No-spawn assertion: `vi.mock("node:child_process")` + `vi.spyOn(cp, "execFile")` — confirmed 0 calls in dry-run path.
- Composition HTML tests (via exported `buildCompositionHtml`): portrait 1080×1920 dimensions, `data-composition-id="main"`, `window.__timelines`, narration text from shotlist, cumulative `data-start` offsets, per-shot `data-duration`, GSAP CDN tag, empty-shotlist fallback.
- Input validation: empty shotlist → `durationSec` falls back to `voice.durationSec`.
- Full suite: 14/14 new + 40/40 existing = 54/54 passing.

### `hyperframes doctor` verdict — auth-free

- No HeyGen API key required for local render.
- FFmpeg present: `ffmpeg 8.0` at `C:\ProgramData\chocolatey\bin\ffmpeg.exe`.
- Chrome Headless Shell missing (standalone binary) — Chrome itself is installed at `C:\Program Files\Google\Chrome\Application\chrome.exe`.
- **Sub-issue #11 (real MP4 render) is NOT blocked on credentials.** It is blocked on Chrome Headless Shell — run `npx hyperframes browser ensure` to install it before attempting #11.

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
