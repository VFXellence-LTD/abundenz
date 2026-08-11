# Session Handoff — Polymath MC: shipped 3 features + auto-expand; mid-brainstorm on brand-centric multi-account Setup (GitHub-tracked)

## Where it started
Resumed from prior handoff, then Boss drove a series of Mission Control (MC) features. Repo was renamed `vfxellence` → `abundenz` (remote updated). Domain: VFXellence/Polymath, governance in `D:\VFXellence-LTD\.canon`, code in `.canon\.mission-control`. Working branch: `develop` (local == origin == `8b3e113`). Caveman mode active.

## Decisions locked + what shipped (all merged to develop + pushed)
- **Sidebar regroup + interactive walkthrough + feedback capture** — grouped nav sections; custom auto-launch/replay tour; accumulating feedback → GitHub issues (env-gated `MC_FEEDBACK_ENABLED`, dry-run default). Reviewed+fixed (shell-injection→execFileSync, panel state).
- **Niche-agnostic copy sweep** — removed all VFX/pipeline framing from MC copy; `vfx-pipeline`→`primary` vertical; example domain→`yourbrand.com`. (Boss: VFX is a vertical later, not platform identity.)
- **Persistent setup fields** — `setup_data` table + `GET/PUT /api/setup/data`, `useSetupData` debounced autosave-on-blur, `SetupField` schema on Content steps. Completion independent of fields.
- **Setup wizard auto-expand** (last shipped, `8b3e113`) — all steps expanded by default + Expand/Collapse-all + keyboard tab-through; expansion lifted into `SetupStepper` via pure `expansionReducer`; `SetupStep` now controlled.
- **CURRENT WORK (not started, design phase): Brand-centric multi-account Setup.** Boss flagged the Setup wizard ignores the multi-account/brand-isolation (umbrella) architecture. Decisions LOCKED this session: (1) **brand-centric** structure; (2) **persist to the real `brands` + `platform_accounts` tables** (Module 1 routing model), not `setup_data`; (3) **build the data + API layer FIRST** (slice 1, no wizard UI yet). Canonical model = umbrella (`abundenz.com` + per-brand subdomain/email alias, transparent ownership; superseded old separate-domains isolation 2026-06-25). Z-naming: every brand name has a "z" (Zrodinger active).
- **Tracking switched to GitHub-native** (Boss directive): use `.canon` GitHub lifecycle (issue → `type/NNN-description` branch → PR → Boss review), NOT Jira/canon-workflow `/start` skills. Playbook: `D:\VFXellence-LTD\.canon\5_knowledge\reference\polymath-business\github-pm-playbook.md` (note: playbook says repo `vfxellence`, actual is `abundenz`).

## Key files for next session
- Brainstorm decisions above are the spec source — **no spec/plan file written yet for the brand-centric work.**
- `D:\VFXellence-LTD\.canon\5_knowledge\reference\polymath-business\github-pm-playbook.md` — exact gh issue/branch/PR conventions; Project v2 field IDs; `addSubIssue` needs `-H "GraphQL-Features: sub_issues"`; **dry-run discipline: confirm GitHub writes before executing**.
- `D:\VFXellence-LTD\.canon\.mission-control\server\db.ts` — `brands` (id,name,ecosystem_id,email) + `platform_accounts` (brand_id, platform, handle, email, tracking_id, status, notes, url, max_accounts, active, rotation_order, last_posted_at, stagger_hours, credential_ref) tables already exist.
- `D:\VFXellence-LTD\.canon\.mission-control\client\src\types\index.ts` — has `Brand`/`PlatformAccount`/`Entity` types (PlatformAccount lacks DB routing fields — extend it).
- `D:\VFXellence-LTD\.canon\.mission-control\client\src\data\entity.ts` + `pages\EntityPage.tsx` — Entity page reads HARDCODED brands/accounts, not the DB (rewire deferred to slice 3).
- `D:\VFXellence-LTD\.canon\.mission-control\server\routes\transactions.ts` + `services\transactions.service.ts` + `client\src\hooks\useTransactions.ts` — the CRUD route/service/hook pattern to MIRROR for slice 1.
- Changelog: `D:\VFXellence-LTD\.canon\4_orchestrator\changelogs\polymath-business-changelog.md` (updated through auto-expand).

## Running state
- Background processes: none (all dev servers stopped via TaskStop; lingering worktree node procs killed).
- Dev servers / ports: none. (To run: `pnpm dev` from `D:\VFXellence-LTD\.canon\.mission-control` → server :4500, client :5174. Windows leaves orphan node holding :4500/:5174 after stop — kill via `Get-NetTCPConnection -LocalPort 4500,5174,5175 | Stop-Process`.)
- Open worktrees / branches: none (both feature worktrees merged + removed; only main checkout on `develop`). NOTE: `git config worktree.baseRef head` is set but does NOT take effect — `EnterWorktree` still branches from `origin/main` (a83f0e7), so after creating a worktree, `git reset --hard develop` inside it.

## Verification — how to confirm things still work
- `git -C "D:\VFXellence-LTD" rev-parse develop origin/develop` — both `8b3e113`, in sync.
- `cd D:\VFXellence-LTD\.canon\.mission-control\server; npx vitest run` — expect 132 passed / 1 skipped.
- `cd D:\VFXellence-LTD\.canon\.mission-control\client; npx vitest run` — expect 52 passed; `npm run build` clean.
- `gh issue list -R VFXellence-LTD/abundenz --state all` — last issue is #14 (next new issue = #15).
- `gh auth status` — account rhdutta, scopes include `repo`,`project`.

## Deferred + open questions
- Deferred (later slices of the brand work): **Slice 2** brand-centric wizard UI; **Slice 3** Entity-page DB rewire + seed `entity.ts`→DB + fix wizard's domain step (says "register yourbrand.com" — contradicts umbrella subdomain decision).
- Deferred: `PROJECT_PAT` repo secret still unset → the 2 GitHub Actions PM workflows (`add-to-project.yml`, `auto-status.yml`) remain inert. GOLIVE-001..004 (social accounts, Buffer/Postiz tokens, spend approval) still open Boss actions.
- **OPEN — awaiting Boss confirmation (the exact point work paused):** I proposed creating an **epic** ("Brand-centric multi-account Setup (umbrella model)", `type/epic, area/mission-control, priority/high`) + **sub-issue #1** ("Slice 1: Brand & account data/API foundation", `type/task, area/server, priority/high`, linked under epic) + add both to Project #2. Boss invoked session-handoff instead of confirming. Per playbook dry-run discipline, these GitHub writes need Boss's explicit yes.

## Pick up here
Get Boss's confirmation to create the epic + sub-issue #1 (+ Project #2 items) per the proposal above; on yes, run the gh writes, then `git fetch` + branch `feat/<sub#>-brand-account-api`, create worktree (reset to develop), and brainstorm→spec→plan→subagent-build slice 1 (BrandsService + PlatformAccountsService CRUD + routes + tests; client PlatformAccount type extension + useBrands/usePlatformAccounts hooks). PR with `Closes #<sub>` for Boss review — no direct-merge this time.
