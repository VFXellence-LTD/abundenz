# Session Handoff — Polymath: GitHub PM standup, growth-operator Module 1, content-engine framework, full codename sweep

## Where it started
Boss asked to improve a "Domain split — who tracks what" table (how the `.canon` workflow relates to GitHub PM + business ops) in the GitHub-PM-and-MVP-rollout plan. That expanded into executing the whole plan and the subsequent growth work for the Polymath (VFXellence) business. Domain: VFXellence, repo `D:\VFXellence-LTD` (remote `VFXellence-LTD/vfxellence`), branch `develop`. Hard doctrine throughout: publish stays human-gated forever; dry-run by default; literal ecosystem terms (content/viral/products/affiliate), @zrodinger under `viral`.

## Decisions locked + what shipped
- **Domain-split table + ".canon workflow" prose** rewritten in `D:\VFXellence-LTD\.canon\4_orchestrator\projects\polymath-business\plans\github-pm-and-mvp-rollout-2026-06-17.md`.
- **Phase A — GitHub PM standup** (all shipped): org Project v2 "VFXellence Dev" #2 (https://github.com/orgs/VFXellence-LTD/projects/2); 17 labels; 14 issues (epics #1/#2 + native sub-issues + chores #12/#13/#14); 2 Actions workflows at `D:\VFXellence-LTD\.github\workflows\add-to-project.yml` + `auto-status.yml` (INERT until `PROJECT_PAT` secret set); MC bug-report bridge (`server/routes/bug-report.ts`, `services/bug-report.service.ts`, client `BugReportButton.tsx`, gated by `MC_BUG_REPORT_ENABLED`); `.canon/CLAUDE.md` Issue-Tracking rewrite (VFX-NNN retired → GitHub `#NNN`); PM playbook at `D:\VFXellence-LTD\.canon\5_knowledge\reference\polymath-business\github-pm-playbook.md`. `gh` token gained `project` scope (Boss ran `gh auth refresh -s project`).
- **Phase B (all 3 epics closed + board Done):** #1 ecosystem naming (removed phantom `apps`/`Forge`, lullaby→vertical); #2 HyperFrames render (real 1080×1920 MP4 proven via ffprobe; adapter wired with injection-safe `cmd.exe /c npx` argv, `HYPERFRAMES_ENABLED` gate, FFmpeg thumbnail); #12 orphan-worktree cleanup.
- **Growth-operator design** at `…\plans\growth-operator-design-2026-06-21.md` (APPROVED): 4 modules — (1) multi-account routing, (2) closed feedback loop, (3) meta-ads, (4) pre-publish daily loop. Autonomy only up to the approval queue; publish + ad spend human-gated; every capability off-by-default + dry-run.
- **Module 1 (multi-account routing layer) BUILT + reviewed SHIP-READY** — 5 TDD tasks per `…\plans\growth-operator-routing-plan-2026-06-21.md`: `platform_accounts` routing cols (`active`/`rotation_order`/`last_posted_at`/`stagger_hours`/`credential_ref`) + `publish_log.account_id`; `CredentialResolver` (`server/services/credentials.ts`); `RoutingService` (pure, LRU sort + stagger + no-identical default cap 1, `server/services/routing.service.ts`); `publish.service.ts` wiring + `BufferDistributor` profileId injection. Publish stays manual `/api/publish`.
- **Content-engine framework folded in:** angle multiplication (in `viral-formula.md`), new `first-hour-playbook.md` (human post-publish SOP), `platform-rpm.md` "Engagement Signals That Matter" (saves>shares>comments>likes), `hook-library.md` "Loop Principle". Module 2 design enriched: `performance_signal` +`saves`/`shares`, `content_params` +`optimize_for` (default `saves`, RPM-tension flagged), TopicPicker schedules 5 angle-variants, `ClipDraft.angle` deferred.
- **Operator manual:** `D:\VFXellence-LTD\.canon\.mission-control\OPERATOR-MANUAL.md` (+ `.html`).
- **Full codename sweep COMPLETE** (surge→viral, signal→content, atelier→products, conduit→affiliate): files renamed (viral-formula, viral-safeguards, plan4-viral-engine, products-*, affiliate-*, viral-research) + all code identifiers (skill chain renamed atomically: `viral-generate/continue/render/safeguard-check/publish` skills + ALLOWED_SKILLS + `bin/viral-*.ts` + `viral:run`/`viral:render` npm scripts; scoping CODENAME map → `v_content/v_viral/v_products/v_affiliate_*` views with 16-view `DROP VIEW IF EXISTS` migration; `ELEVENLABS_VIRAL_VOICE_ID`; `buildViralPrompt`). Residual codename mentions are by-design only (frozen planning docs, governance prose, `LEGACY_VIEWS` drop-list, arbitrary test strings).
- **2 memories captured** at `D:\dev\.claude\projects\D--VFXellence-LTD\memory\`: `ecosystem-literal-naming.md` (literal terms, codenames deprecated), `auto-push-develop-ok.md` (auto-push develop authorized — the direct-push security flags are noise for this solo repo).

## Key files for next session
- Plan first: `D:\VFXellence-LTD\.canon\4_orchestrator\projects\polymath-business\plans\growth-operator-design-2026-06-21.md` — Modules 2/3/4 spec (Module 2 is the next build).
- `D:\VFXellence-LTD\.canon\4_orchestrator\projects\polymath-business\plans\growth-operator-routing-plan-2026-06-21.md` — Module 1 TDD plan (done; the template for how Module 2 should be planned/built).
- Changelog touched: `D:\VFXellence-LTD\.canon\4_orchestrator\changelogs\polymath-business-changelog.md`.
- Code likely touched next (Module 2): `D:\VFXellence-LTD\.canon\.mission-control\server\db.ts` (schema — add `performance_signal`, `content_params`), `server/services/routing.service.ts` + `publish.service.ts` (Module 1, for reference), `D:\VFXellence-LTD\polymath\packages\agents\src\` (StrategyAdjuster / generation params).
- Manual: `D:\VFXellence-LTD\.canon\.mission-control\OPERATOR-MANUAL.md`.
- Memory index: `D:\dev\.claude\projects\D--VFXellence-LTD\memory\MEMORY.md`.

## Running state
- Background processes: none.
- Dev servers / ports: none running this session. (If needed: MC server `pnpm --dir server dev` → :4500; client → :5174, from `D:\VFXellence-LTD\.canon\.mission-control`.)
- Open worktrees / branches: on `develop`; orphan worktrees deleted (#12); no open worktrees.

## Verification — how to confirm things still work
- `npx vitest run` from `D:\VFXellence-LTD\.canon\.mission-control\server` — expect **120 passed / 1 skipped**.
- `npx vitest run` from `D:\VFXellence-LTD\polymath\packages\agents` — expect **54 passed**.
- `git -C "D:\VFXellence-LTD" status` — clean, on `develop`, pushed to origin (last commits were the codename-sweep stragglers: env var + agentName + OPERATOR-MANUAL.html).
- `gh auth status` — token has `project` scope.

## Deferred + open questions
- Deferred: **Modules 2, 3, 4 not built** (designed only). `ClipDraft.angle` field — add when angle-generation is built (YAGNI now). `last_posted_at` writeback after publish — needed so live LRU rotation advances (not in Module 1 scope). Doc-BODY codename prose + display sample strings ("Surge Tech Sprint" placeholder) — names/identifiers swept, body prose intentionally not.
- Open (Boss action): **`PROJECT_PAT`** — create fine-grained PAT (project write) → repo secret on `VFXellence-LTD/vfxellence` to activate the 2 Actions workflows (Phase A §6.2). **GOLIVE-001..004** — social accounts, Buffer/Postiz tokens, env vars (incl. the now-renamed `ELEVENLABS_VIRAL_VOICE_ID`), paid-tool spend approval.
- Open question: confirm Module 2 is the next build vs another priority.

## Pick up here
Build **Module 2 (closed feedback loop)** — now enriched with saves/shares signals + angle-variant scheduling — via subagent-driven TDD against `growth-operator-design-2026-06-21.md` (mirror the Module 1 plan→build→review flow). Alternative: have Boss set `PROJECT_PAT` to wake the GitHub Actions automations.
