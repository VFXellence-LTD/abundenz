# Polymath Growth-Operator Additions

**Date:** 2026-06-21
**Status:** Approved — four open questions resolved; ready for GitHub epic filing
**Domain:** Polymath (VFXellence) — Boss: Robin Dutta
**Scope:** `viral` / @zrodinger first; other ecosystems inherit after viral proves the machinery

---

## Purpose

The current MC Polymath pipeline ends at the human publish click. That loop is correct and intentional — but it leaves the system blind to what performs, unable to route content across multiple accounts, and unable to amplify top performers with paid spend. These four modules extend the system upward from the publish step without touching the publish gate itself.

The additions are:

1. **Multi-account routing layer** — promote `platform_accounts` to a full routing table so the system knows *where* to post (not just *that* to post), producing a posting plan the Boss clicks through.
2. **Closed feedback loop** — capture post performance and let it influence future draft generation parameters. Drafts improve; the Boss still approves every draft.
3. **Meta-ads amplification** — propose paid campaigns on top organic performers. Nothing spends without a Boss approval click.
4. **Pre-publish daily loop** — orchestrate the topic-pick → generate → render → enqueue cycle daily, stopping at the approval queue. No publish authority. No spend authority.

Each module is independently mergeable. Each ships off by default. Each has a dry-run mode that exercises the full code path without touching real APIs or spending real money.

---

## Note on Ecosystem Codenames (Retired)

Ecosystem codenames (Signal, Surge, Atelier, Conduit) are **retired** in favour of the four literal ecosystem names: `content`, `viral`, `products`, `affiliate`. The active brand under the `viral` ecosystem is **@zrodinger**. Legacy codenames may still appear in vault docs and dashboard code pending a future cleanup sweep — do not mint new uses.

---

## Doctrine Constraints Respected

Every module design is governed by the following hard rules. These are not open for negotiation in implementation.

**Publish stays human-gated forever.**
No scheduler, agent, cron job, WebSocket trigger, or loop orchestrator may call `/api/publish`. This rule was locked as an MVP acceptance criterion in `4_orchestrator/projects/polymath-business/plans/github-pm-and-mvp-rollout-2026-06-17.md` (Rollout & MVP sequencing → MVP acceptance). It is permanent. The growth-operator modules produce a posting *plan* for the Boss to execute, then stop.

**Dry-run by default.**
Every new capability that touches an external API must follow the env-gate pattern established in `packages/publish` and `assembly.ts`: if the required token/credential is absent, the system enters a named DryRun* mode that logs what it would do and returns a synthetic result. Missing token ⇒ dry-run; never fail-hard.

**Paid spend requires Boss approval — new spend gate.**
`GOLIVE-004` (Approve paid-tool spend) is the existing spend gate for tooling costs. Paid ad spend is a new and distinct category. It requires a new gate `ADS_ENABLED` AND per-campaign Boss approval in the Ad Approval Queue. These are additive constraints, not alternatives.

**30-day manual rule.**
Per `ecosystems/viral/.../agents/README.md`, new automated capabilities ship off by default and must be manually validated for 30 days before they can be considered stable. All three new feature gates (`DAILY_LOOP_ENABLED`, `FEEDBACK_LOOP_ENABLED`, `ADS_ENABLED`) honour this rule. They are off at deployment and are not flipped on without deliberate Boss action.

---

## Module 1 — Multi-Account Routing Layer

### What It Does

The current system treats each ecosystem as having one Buffer token. In practice, @zrodinger will have multiple platform accounts (e.g. TikTok @zrodinger, Instagram @zrodinger, YouTube Shorts @zrodinger), each with its own Buffer profile ID. This module promotes `platform_accounts` from a display-only registry to a live routing table so that when the Boss queues a publish, the system already knows the candidate accounts, their stagger rules, and their rotation order.

The module outputs a **Posting Plan**: a list of `(asset → account → scheduled_time)` tuples. The Boss reviews the plan, edits if needed, and clicks publish per entry. Routing only produces the plan — it does not execute it.

### Interface / Units

```
RoutingService
  input:  asset: ContentAsset, target_set: AccountTargetSet
  output: PostingPlan — list of { account_id, platform, scheduled_at }

  internal logic:
    1. Load active accounts for the asset's ecosystem from platform_accounts
    2. Sort by rotation_order, break ties by last_posted_at ASC (least-recently-posted first)
    3. Apply stagger_hours between consecutive same-platform posts
    4. Enforce no-identical-cross-account rule (same asset cannot post to two accounts on the same platform within stagger_hours)
    5. Return plan — no side effects, no writes
```

`CredentialResolver` — thin adapter that maps `credential_ref` (a string key) to the actual Buffer `profileId` for a given account. Lives in `server/services/credentials.ts`. Dry-run: if credential is absent, logs `[DRY-RUN] Would resolve credential for <account_id>` and returns a synthetic profile ID.

`publish.service` is extended to call `RoutingService` before building the Buffer payload, joining `platform_accounts` to resolve the correct `profileId` per account. The existing publish click pathway is unchanged — it now receives a plan rather than a single target.

### Data Additions

`platform_accounts` table extended with new columns:

| New Column | Type | Purpose |
|---|---|---|
| `active` | boolean | Whether this account is eligible for routing |
| `rotation_order` | integer | Lower = earlier in rotation |
| `last_posted_at` | timestamp nullable | Updated on each real publish |
| `stagger_hours` | real | Minimum hours between posts to this account |
| `credential_ref` | text | Key into the credential store (env var name or vault ref) |

`publish_log` table extended with `account_id text` column (FK to `platform_accounts.id`). Existing rows: `account_id` nullable/null for backward compatibility.

### Gate

No new feature gate — routing is part of the existing publish flow. It becomes active when `platform_accounts` has rows with `active = true`. Until then, behaviour is identical to today (single-account, existing logic).

Dry-run applies at the `CredentialResolver` level: absent credential ⇒ synthetic profile ID, log-only.

### Tests

- `RoutingService` unit tests: rotation ordering (least-recently-posted wins), stagger constraint enforcement, no-identical-cross-account rule, empty account set returns empty plan.
- `CredentialResolver` unit tests: present credential resolves correctly; absent credential returns synthetic ID without throwing; dry-run log emitted.
- `publish.service` integration test: with two active accounts, the posting plan includes two entries; `publish_log` rows carry `account_id`.
- Mirror existing vitest patterns in `server/test/`.

---

## Module 2 — Closed Feedback Loop

### What It Does

After posts go live, their performance (views, RPM, engagement) determines what content the system should generate next. Without a feedback loop, the system generates drafts in a vacuum. With it, the StrategyAdjuster reads performance signals and updates the generation parameters — hook style, tone, length, pacing — used by the intake/generation pipeline for *future drafts only*. Every param change is logged with rationale. The Boss can inspect the Strategy view and override any change.

The loop is: **performance → content_params → better drafts → approval queue → (human) publish**. The Boss's approval click remains the only gate before anything reaches an audience.

Gate `FEEDBACK_LOOP_ENABLED` (off): when on, the StrategyAdjuster runs on a schedule and updates `content_params`. When off, `content_params` remain frozen at their last manually set values.

### Interface / Units

```
PerformanceStore
  write: upsert_signal(post_id, account_id, platform, views, rpm, engagement, hook_tag, style_tag, captured_at)
  read:  get_signals(ecosystem_id, since, limit) → PerformanceSignal[]
  read:  get_top_performers(ecosystem_id, window_days, min_views) → PerformanceSignal[]

StrategyAdjuster
  input:  PerformanceSignal[] for an ecosystem
  output: ContentParams — versioned record {hook_weights, style_weights, tone, length_seconds_target}
  side effect: appends a ContentParamsRevision to content_params table (who=system, why=rationale string, when=now)
  constraint: only runs when FEEDBACK_LOOP_ENABLED=true
  constraint: updates generation params for FUTURE DRAFTS only — no retroactive effect on queued items
```

`StrategyView` — new read-only view in Mission Control showing the current `content_params` for each ecosystem, the revision history (who changed what and why), and a Boss override button that creates a new revision with `who=boss`.

Performance signals are populated by a lightweight post-import job: after each publish, a background task fetches platform metrics for published posts via the relevant API and writes to `performance_signal`. This job is also gated by `FEEDBACK_LOOP_ENABLED` — if off, signals accumulate only if manually imported.

### Data Additions

`performance_signal` table (new):

| Column | Type | Notes |
|---|---|---|
| `id` | text PK | uuid |
| `post_id` | text | references publish_log |
| `account_id` | text | references platform_accounts |
| `platform` | text | tiktok / instagram / youtube / etc |
| `views` | integer | |
| `rpm` | real | revenue per mille (nullable) |
| `engagement` | real | engagement rate 0–1 |
| `hook_tag` | text | the hook category used in this post |
| `style_tag` | text | the visual/edit style used |
| `captured_at` | timestamp | when the metric was fetched |

`content_params` table (new — versioned):

| Column | Type | Notes |
|---|---|---|
| `id` | text PK | uuid |
| `ecosystem_id` | text | FK content/viral/products/affiliate |
| `version` | integer | monotonically increasing per ecosystem |
| `hook_weights` | text | JSON object hook_tag → weight |
| `style_weights` | text | JSON object style_tag → weight |
| `tone` | text | e.g. educational / energetic / calm |
| `length_seconds_target` | integer | target video length |
| `created_by` | text | "system" or "boss" |
| `rationale` | text | plain-text explanation of why this version was created |
| `created_at` | timestamp | |

The active `content_params` for an ecosystem is the row with the highest `version` for that `ecosystem_id`.

### Gate

`FEEDBACK_LOOP_ENABLED` (environment variable, default absent/off).

When off: `StrategyAdjuster` does not run; `content_params` are not auto-updated; performance signal ingestion is manual-import only; the Strategy view is read-only with no system revisions.

When on: `StrategyAdjuster` runs after each signal ingestion batch; `content_params` may be auto-updated; every auto-update is logged with rationale; Boss override always available.

### Tests

- `StrategyAdjuster` unit tests: given a set of signals with varying hook/style tags, output `content_params` weights correctly reflect performance distribution; rationale string is non-empty; version increments correctly.
- Gate-off test: `FEEDBACK_LOOP_ENABLED` unset → `StrategyAdjuster.run()` exits immediately without writing to `content_params`.
- `PerformanceStore` unit tests: upsert idempotency (same post_id + platform + captured_at = update, not duplicate), `get_top_performers` filters by window and threshold correctly.
- Boss-override test: calling the override endpoint creates a new revision with `created_by = "boss"` and does not change the `version` sequence logic.
- Mirror existing vitest patterns in `server/test/` and `packages/*`.

---

## Module 3 — Meta-Ads on Top Performers

### What It Does

When organic posts are performing well, the highest-ROI next action is paid amplification of the exact content that already proved itself. This module reads top-performing published posts, proposes ad campaigns (post, account, budget, audience), and surfaces them in an Ad Approval Queue. The Boss approves or rejects each proposal. Nothing spends without that approval click.

Ad buy is fully abstracted behind an `AdBuyer` adapter. In dry-run mode (absent gate or token), the adapter logs `[DRY-RUN] WOULD CREATE CAMPAIGN` with a synthetic campaign ID and never calls any ad platform API.

### Interface / Units

```
AdProposer
  input:  top_performers: PerformanceSignal[], platform_accounts: PlatformAccount[]
  output: AdProposal[] — list of {post_id, account_id, platform, budget_usd, audience_spec, rationale}
  constraint: read-only — no writes, no spend

AdBuyer (interface)
  method: create_campaign(proposal: AdProposal) → AdCampaignResult
  implementations:
    - MetaAdBuyer — real Meta Ads API call (requires ADS_ENABLED=true + valid token)
    - DryRunAdBuyer — logs "WOULD CREATE CAMPAIGN", returns synthetic campaign id, no API call

AdApprovalQueue (server route + MC view)
  GET  /api/ad-proposals       — list proposals in status=proposed
  POST /api/ad-proposals/:id/approve  — Boss approves → triggers AdBuyer.create_campaign()
  POST /api/ad-proposals/:id/reject   — Boss rejects → status=rejected, no spend

```

The `AdProposer` runs after each `PerformanceStore` update (or on a manual trigger). It produces proposals; it does not act on them. Proposals sit in the queue until the Boss acts.

Ad results (campaign ID, spend to date, reach, link clicks) are fetched periodically and written back to `ad_campaigns`. These results also feed back into `performance_signal` (`hook_tag`, `style_tag`, `views` from ad reach) so the feedback loop accounts for paid distribution.

### Data Additions

`ad_campaigns` table (new):

| Column | Type | Notes |
|---|---|---|
| `id` | text PK | uuid |
| `post_id` | text | references publish_log |
| `account_id` | text | references platform_accounts |
| `platform` | text | meta / tiktok_ads / etc |
| `budget_usd` | real | proposed spend |
| `audience_spec` | text | JSON — targeting parameters |
| `status` | text | proposed / approved / running / paused / done / rejected |
| `dry_run` | boolean | true if AdBuyer was DryRunAdBuyer at approval time |
| `campaign_id_external` | text nullable | platform's campaign ID (absent in dry-run) |
| `spend_actual_usd` | real nullable | actual spend fetched from platform |
| `created_at` | timestamp | |
| `approved_at` | timestamp nullable | |
| `rationale` | text | why AdProposer recommended this post |

### Gates

Two independent gates, both must be true for real spend:

1. `ADS_ENABLED` (environment variable, default absent/off) — master switch for the ads module. When off, `AdProposer` still runs and populates the queue (useful for reviewing proposals without committing), but `AdBuyer` is always `DryRunAdBuyer` regardless of tokens.
2. Per-campaign Boss approval (the Approve button in the Ad Approval Queue) — required even when `ADS_ENABLED=true`. Approval is not automatic.

Absent either gate: `DryRunAdBuyer` is used. The approval click in dry-run mode still exercises the full approval pathway but calls `DryRunAdBuyer`, resulting in a synthetic campaign ID and a `dry_run=true` row in `ad_campaigns`.

This extends `GOLIVE-004` (Approve paid-tool spend) — ad spend is a new category under that gate, not a replacement.

### Tests

- `AdProposer` unit tests: given N top performers, output N proposals with non-empty `rationale`; `budget_usd` > 0; audience_spec is valid JSON.
- `DryRunAdBuyer` test: `create_campaign()` returns synthetic ID, never makes HTTP call, logs the WOULD-CREATE message.
- Gate-off test: `ADS_ENABLED` absent → approval endpoint calls `DryRunAdBuyer`, `dry_run=true` in resulting row.
- Gate-on without approval test: confirming proposals cannot execute without the Boss approval step (pending proposals stay in `proposed` status indefinitely).
- Ad-results-to-signal test: result ingestion writes a `performance_signal` row with `hook_tag` and `style_tag` populated from the source post.
- Mirror existing vitest patterns in `server/test/`.

---

## Module 4 — Pre-Publish Daily Loop

### What It Does

The four preceding modules handle routing, feedback, and amplification. The daily loop is the orchestration layer that drives the *generation* side: each day, pick a topic, generate a draft, render it, and enqueue it for approval. It stops at the queue — it has no publish authority and no spend authority by design.

Gate `DAILY_LOOP_ENABLED` (off): when on, the loop runs once per day. When off, all stages run only on manual trigger.

### Interface / Units

```
LoopOrchestrator
  runs: topic_pick → generate → render → enqueue
  HARD STOPS: cannot call /api/publish; cannot call AdBuyer; cannot approve ad proposals
  constraint: DAILY_LOOP_ENABLED=true to run automatically; off = manual trigger only

  stages:
    1. TopicPicker — reads StrategyAdjuster's current content_params, picks a topic from the
       backlog or generates one. Output: TopicSpec {title, hook_tag, style_tag, platform_targets}.
    2. DraftGenerator — spawns a Claude generation call with the TopicSpec + current content_params.
       Output: DraftContent {script, shotlist, metadata}.
    3. RenderJob — invokes AssemblyAdapter (existing) to produce a render. Dry-run if
       HYPERFRAMES_ENABLED absent. Output: RenderResult {videoPath, thumbnailPath, durationSec}.
    4. Enqueuer — writes a row to approval_queue with status=pending_review. Stops here.

  error handling: any stage failure → loop stops, writes a LoopRunLog row with
  status=failed, stage=<failing_stage>, error=<message>. Does NOT retry automatically.
```

`LoopRunLog` — lightweight audit table: `id`, `ecosystem_id`, `run_at`, `status` (completed/failed/skipped), `stage_reached`, `draft_id_created`, `error_text`.

Toggle UI in Mission Control: a switch in the MC settings panel that sets `DAILY_LOOP_ENABLED` (or its in-DB equivalent) for the relevant ecosystem. Visual indicator of last run status (completed/failed/skipped) and timestamp.

### Gate

`DAILY_LOOP_ENABLED` (environment variable OR in-DB toggle per ecosystem, default off).

The loop has **no publish authority**. Even if accidentally misconfigured, it cannot reach `/api/publish` — the Enqueuer is the final stage, and it only writes to `approval_queue`. Structural impossibility, not just a gate.

### Tests

- Full loop dry-run test: `DAILY_LOOP_ENABLED=true`, `HYPERFRAMES_ENABLED` absent → loop runs all 4 stages, produces a `pending_review` approval queue row, dry-run render, zero calls to `/api/publish`.
- Stage-failure test: mock `DraftGenerator` to throw → loop stops, `LoopRunLog` row has `status=failed, stage=generate`.
- Gate-off test: `DAILY_LOOP_ENABLED` absent → `LoopOrchestrator.runDaily()` exits immediately, writes `status=skipped` to `LoopRunLog`.
- No-publish assertion: spy on `publish.service.publish()` across all loop test cases → call count always 0.
- Mirror existing vitest patterns in `packages/*` and `server/test/`.

---

## Data Model Additions Summary

| Table | Change | Columns Added / New |
|---|---|---|
| `platform_accounts` | Extended | `active`, `rotation_order`, `last_posted_at`, `stagger_hours`, `credential_ref` |
| `publish_log` | Extended | `account_id` (nullable, FK to platform_accounts) |
| `performance_signal` | New | `id`, `post_id`, `account_id`, `platform`, `views`, `rpm`, `engagement`, `hook_tag`, `style_tag`, `captured_at` |
| `content_params` | New | `id`, `ecosystem_id`, `version`, `hook_weights`, `style_weights`, `tone`, `length_seconds_target`, `created_by`, `rationale`, `created_at` |
| `ad_campaigns` | New | `id`, `post_id`, `account_id`, `platform`, `budget_usd`, `audience_spec`, `status`, `dry_run`, `campaign_id_external`, `spend_actual_usd`, `created_at`, `approved_at`, `rationale` |
| `loop_run_log` | New | `id`, `ecosystem_id`, `run_at`, `status`, `stage_reached`, `draft_id_created`, `error_text` |

All new tables created via the existing `server/db.ts` migration pattern. Column additions to existing tables: use `ALTER TABLE ... ADD COLUMN` with safe defaults (nullable or boolean false) so existing rows are not invalidated.

---

## Build Sequencing — Approach A (Foundation-First, Layered)

Dependencies run in one direction: later modules read data that earlier modules write. Each module is independently mergeable at the end of its sequence step.

### Step 1 — Routing Layer (unblocks everything)

Implement Module 1. Extend `platform_accounts` schema, implement `RoutingService` and `CredentialResolver`, extend `publish.service`, add `account_id` to `publish_log`. Tests passing.

**Why first:** `performance_signal`, `ad_campaigns`, and the daily loop all reference `account_id`. Without the routing table having real data and FK targets, later modules have nothing to join against. This is the foundation.

### Step 2 — Feedback Loop (reads routing + performance)

Implement Module 2. Add `performance_signal` and `content_params` tables, implement `PerformanceStore` and `StrategyAdjuster`, add the Strategy view to Mission Control. Tests passing. Gate `FEEDBACK_LOOP_ENABLED` off.

**Dependency on Step 1:** `performance_signal` references `account_id` from `platform_accounts`. `StrategyAdjuster` uses `content_params` to influence draft generation, which means the `LoopOrchestrator` (Step 4) can pick those up.

### Step 3 — Meta-Ads (reads top performers + account data)

Implement Module 3. Add `ad_campaigns` table, implement `AdProposer` and `AdBuyer` adapter (DryRun first, real adapter behind `ADS_ENABLED`), add Ad Approval Queue to Mission Control. Tests passing. Gates `ADS_ENABLED` off, per-campaign approval required.

**Dependency on Steps 1–2:** `AdProposer` reads `performance_signal` (Step 2) to identify top performers and joins against `platform_accounts` (Step 1) to select the correct account for the campaign.

### Step 4 — Loop Orchestrator (wraps the pre-publish pipeline)

Implement Module 4. Implement `LoopOrchestrator` with its four stages, `LoopRunLog` table, and Mission Control toggle UI. Tests passing. Gate `DAILY_LOOP_ENABLED` off.

**Dependency on Steps 1–3:** `TopicPicker` reads `content_params` (Step 2). The `Enqueuer` writes to `approval_queue` which already exists. The loop structurally cannot reach publish or ad spend — those code paths live in separate services with their own gates.

### Parallel work permitted within each step

Module 1 routing and Module 1 credential resolution can be developed in parallel branches. Module 2 schema work and Module 2 StrategyAdjuster logic can be developed in parallel. Merge order within a step: schema migrations → services → routes → UI.

---

## Gating Summary

| Gate | Default | What it controls | Who can enable |
|---|---|---|---|
| *(none — routing is always-on once accounts exist)* | active=false on all accounts | Routing produces no plan if no active accounts | Boss adds accounts |
| `FEEDBACK_LOOP_ENABLED` | off | StrategyAdjuster auto-runs; signal ingestion auto-runs | Boss (env or in-DB toggle) |
| `ADS_ENABLED` | off | AdBuyer uses real API; proposals can spend | Boss (env only) |
| Per-campaign Boss approval | required | Individual ad campaign spend | Boss (Approval Queue click) |
| `DAILY_LOOP_ENABLED` | off | LoopOrchestrator runs daily automatically | Boss (MC toggle) |
| `/api/publish` | human-gated, unchanged | Actual posting to platforms | Boss (publish button) — permanent |

No gate combination can result in autonomous posting or autonomous ad spend. The publish gate and the ad spend gate are independent and both require affirmative human action.

---

## Testing Strategy

Each module ships with its own test file following the vitest patterns in `server/test/*.test.ts` and `packages/*/test/*.test.ts`.

**Coverage targets per module:**

- **Module 1:** rotation correctness (at least 3 accounts, verify ordering after last_posted_at update), stagger enforcement (two posts within stagger window → second is pushed out), credential dry-run path.
- **Module 2:** StrategyAdjuster math (given known signal distribution, output weights match expected ratios within tolerance), version increment, gate-off early exit, Boss override creates correct revision.
- **Module 3:** `DryRunAdBuyer` never makes HTTP calls (spy on fetch/axios), proposals generated from top performers match input, `dry_run=true` flag set when gate off, approval without `ADS_ENABLED` uses dry-run buyer.
- **Module 4:** no-publish assertion across all loop test cases (spy on publish.service), stage-failure isolation, gate-off skipped status written to `LoopRunLog`.

**Shared invariant tests** (run across all modules): no test case should result in a call to `/api/publish` with a real payload; no test case should call a real ad API without `ADS_ENABLED=true` AND a test flag overriding the dry-run buyer.

---

## Open Questions / Risks

### Resolved decisions

1. **Module 2 signal ingestion** ✓ Decided: manual/stub ingestion for v1. Real platform-API performance pull (TikTok Business API, Meta Graph API, etc.) is deferred to a later step — the routing layer is not blocked on credential acquisition. The feedback loop accumulates signals via manual import in the initial release of Module 2.

2. **Module 3 AdBuyer scope** ✓ Decided: Meta only for v1. The `AdBuyer` adapter interface is designed to allow other ad platforms (TikTok Ads, YouTube Ads, etc.) to be added later without rearchitecting the module.

3. **`content_params` seed** ✓ Decided: a seed script writes sensible defaults (equal hook/style weights, `length_seconds_target=30`) when no rows exist for an ecosystem. Boss overrides via the Strategy view UI at any time.

4. **Daily loop dedup** ✓ Decided: idempotent per day + ecosystem — `LoopOrchestrator.runDaily()` skips (writes `status=skipped` to `LoopRunLog`) if a `status=completed` run already exists for today's date + ecosystem. No second draft is produced on server restart.

### Open risks

5. **Stagger hours unit.** `stagger_hours` is stored as a real number. Confirm whether fractional hours (e.g. 0.5 = 30 minutes) are needed, or whether integer hours are sufficient. This affects the schema comment and the RoutingService comparison logic.

6. **Legacy codename cleanup timing.** The brand-naming doc (`1_controller/standards/polymath-business/brand-naming.md`) still uses codenames as column headers in several tables (Signal, Surge, Atelier, Conduit). A future cleanup sweep should update these to literal ecosystem names. This design doc uses literal names throughout. The cleanup is deferred — confirm Boss wants to track it as a GitHub governance issue.

---

## Deferred / YAGNI

- **Viral text stream (Threads / X for @zrodinger):** the text publishing pipeline for short-form written content is deferred to backlog. The routing and loop machinery built here will accommodate it, but the text-specific generation and formatting steps are out of scope for this spec.
- **Other ecosystems inheriting the machinery:** `content`, `products`, `affiliate` will inherit all four modules after the `viral` / @zrodinger cycle proves the design. No ecosystem-specific modifications are anticipated — the schema and service interfaces are ecosystem-agnostic from the start.
- **Automated performance report emails / Slack notifications:** signal capture is internal only. External notification on top performers is deferred.
- **Budget pacing / spend cap automation:** the initial Module 3 implementation proposes a fixed `budget_usd` per campaign. Automated pacing (e.g. pause campaign when daily spend exceeds threshold) is deferred to backlog.
