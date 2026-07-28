# Mission Control — Operator Manual

**Version:** June 2026  
**Scope:** Mission Control v1 — client, server, content production pipeline, multi-account routing  

---

## Table of Contents

1. [Overview](#1-overview)
2. [Getting Started](#2-getting-started)
3. [Dashboard Tour](#3-dashboard-tour)
4. [The Content Workflow](#4-the-content-workflow)
5. [Feature Reference](#5-feature-reference)
   - 5.1 Approval Queue
   - 5.2 content production pipeline
   - 5.3 Multi-Account Routing
   - 5.4 Bug Report → GitHub Bridge
   - 5.5 GitHub PM Integration
   - 5.6 Ecosystems & Brands
   - 5.7 Launch Runbook
6. [Safety Model & Gates](#6-safety-model--gates)
7. [Configuration](#7-configuration)
8. [Roadmap — Designed, Not Yet Built](#8-roadmap--designed-not-yet-built)
9. [Troubleshooting / FAQ](#9-troubleshooting--faq)

---

## 1. Overview

Mission Control is the operating dashboard for VFXellence Ltd's automated content business. It orchestrates content creation, agent execution, approval, and publishing across four income ecosystems: content, viral, products, and affiliate.

The system is built around one core principle: **autonomous up to the approval queue; human clicks publish and spend.** Agents can draft, render, and queue content without operator intervention. They cannot publish, spend money, or take irreversible action. Every outbound action — posting to a platform, running paid ads — requires an explicit human click through an approval screen.

### Architecture

Mission Control runs as three tiers:

| Tier | What it is | Port |
|------|-----------|------|
| **Client** | React/Vite single-page application | 5174 |
| **Server** | Express + SQLite + WebSocket | 4500 |
| **Engine** | `polymath/packages/` — shared agent and render logic | (library) |

The server persists state in a SQLite database at `server/.data/mission-control.db` (WAL mode). The client talks to the server over REST and WebSocket. The content production pipeline lives in the engine packages and is invoked by the server's session runner.

---

## 2. Getting Started

### Starting the System

Run both tiers from the `.mission-control` root:

```bash
# Install dependencies (first time only)
pnpm install

# Start server (port 4500)
pnpm --filter server dev

# Start client (port 5174) — in a separate terminal
pnpm --filter client dev
```

Then open `http://localhost:5174` in your browser.

If you prefer a single command, check the root `package.json` for a `dev:all` script — otherwise the two-terminal pattern above is reliable.

### First-Run Orientation Checklist

When you first open Mission Control, orient yourself with these checks:

- [ ] **Sidebar loads** — you should see 14 nav items from Dashboard down to Entity
- [ ] **Board shows tasks** — if blank, the server is not reachable or the DB is empty
- [ ] **Ecosystems status strip** (footer) — shows live/parked state for each ecosystem
- [ ] **Dry-run mode is active** — this is the default. No real posting will occur until credentials are configured (see Section 7). Treat everything as safe until you deliberately enable production credentials.
- [ ] **@zrodinger accounts do not exist yet** — the Entity page shows them as "active" but this is aspirational data in the client's static files. The real social accounts have not been created. See Section 5.6.

---

## 3. Dashboard Tour

The sidebar lists 14 screens in order. Below is what each does, what you can interact with, and its current operational status.

### 3.1 Dashboard (`/`)

**What you see:** An overview of the four ecosystems and a revenue chart.

**What you can do:** Nothing interactive — this is a read-only summary page.

**Status — Partial.** The ecosystem cards reflect static data. The RevenueChart uses hardcoded placeholder values and is not wired to the live transaction database. Even though transaction data exists in the backend, the chart does not read it. Do not use this chart to assess actual revenue.

---

### 3.2 Board (`/board`)

**What you see:** Task cards organized by status — backlog, todo, in-progress, blocked, in-review, done.

**What you can do:**
- Filter by ecosystem and scope
- Search tasks by keyword
- Change a task's status using the dropdown on each card
- Note: you cannot set a task to `done` if it has a pending approval linked to it — resolve the approval first

**Status — Live.** Polls the server every 5 seconds. Changes persist to the database immediately.

---

### 3.3 Intake (`/intake`)

**What you see:** A three-tab form for creating work.

**What you can do:**
- **Tab 1 — Create campaign + tasks:** Fill in campaign details and attach initial tasks. Submits to the campaigns and tasks APIs.
- **Tab 2 — Register brand:** Create a new brand record in the database.
- **Tab 3 — File infra task:** Log an infrastructure or housekeeping task.

**Status — Live.** All three submission paths write to the database.

---

### 3.4 Approvals (`/approvals`)

**What you see:** A queue of content waiting for human review.

**What you can do:**
- **Approve** — marks the item approved and advances the workflow
- **Request Changes** — requires you to enter review notes before submitting; sends the item back
- **Reject** — requires notes; terminal state, item will not proceed
- **Publish** — appears on approved items; triggers the actual publish action (POST /api/publish)

**Status — Live.** Polls every 4 seconds. Approve and Reject are terminal states — once set, they cannot be reversed through the UI. See Section 5.1 for the full approval lifecycle.

---

### 3.5 Campaigns (`/campaigns`)

**What you see:** A list of campaigns and an embedded terminal that streams live agent output.

**What you can do:**
- Click **Approve & Run** or **Run** to start an agent session for a campaign — this calls POST /api/sessions/start. The `approvedBy` field must be set; the server returns 409 if it is missing.
- Click **Stop** to halt a running session.

**Status — Live.** The terminal is a real PTY stream over WebSocket (`/ws/terminal?sessionId=`).

---

### 3.6 Agents (`/agents`)

**What you see:** A read-only list of past agent runs from the `agent_runs` table.

**What you can do:** View run history. No interactive controls.

**Status — Stub.** An explicit banner in the code states: "Live terminal streaming arrives in Plan 3." The list itself reads real data from the database, but there is no live terminal here. Real-time agent monitoring should be done from the Campaigns page (Section 3.5). This page will gain a live terminal in a future plan.

---

### 3.7 Sessions (`/sessions`)

**What you see:** Live session status, updated in real time over the `/ws` WebSocket channel.

**What you can do:**
- Watch sessions update as agents run
- Click **Stop** to send POST /api/sessions/:id/stop and terminate a session

**Status — Live.**

---

### 3.8 Setup (`/setup`, `/setup/:ecosystem`)

**What you see:** Per-ecosystem setup checklists to guide initial configuration.

**What you can do:**
- Navigate to a specific ecosystem's setup tab
- Content tab: 8 real steps with copy-paste code blocks and external links. Progress persists to the `setup_progress` table.
- Viral tab: Checkboxes render correctly but toggling them does nothing — the steps are not seeded in the database for the viral ecosystem.
- Products tab: Locked (parked ecosystem).
- Affiliate tab: Locked (parked ecosystem).

**Status — Partial.** Content setup is functional. Viral setup is visual only.

---

### 3.9 Launch Runbook (`/launch`, `/launch/:ecosystem/:vertical`)

**What you see:** An expandable step-by-step runbook for launching a new vertical. Defaults to the viral/tech runbook.

**What you can do:**
- Expand steps to read instructions
- Use AI-generated fields (calls Gemini → Claude Haiku → Groq in a fallback chain, depending on which API keys are configured)
- Copy generated data to clipboard
- Export the runbook state as JSON
- Save the completed runbook to the vault (POST /api/vault/launches/:filename — 2 MB cap, path-traversal guarded)

**Status — Live.** The viral/tech template has approximately 20 steps covering email setup, brand name generation, platform handle selection, affiliate setup, content scaffold, daily routine, and evaluation. See Section 5.7.

---

### 3.10 Earnings (`/earnings`)

**What you see:** An earnings overview with sparkline charts per stream.

**What you can do:**
- View aggregated earnings
- Open the Add Transaction modal to log income or expenses

**Status — Partial.** The transaction backend is live and writing to the database. The sparkline charts display hardcoded placeholder values — they are not wired to real transaction data.

---

### 3.11 Transactions (`/transactions`)

**What you see:** The full transaction ledger.

**What you can do:**
- Create, read, update, and delete transaction records
- Import a CSV file of transactions
- Export the ledger to CSV
- Filter and sort by date, ecosystem, type, and amount
- Edit records inline

**Status — Live.** This is the primary financial data entry and review screen. Use this rather than the Earnings page for accurate figures.

---

### 3.12 Tax Center (`/tax`)

**What you see:** Tax-relevant financial summaries.

**What you can do:**
- View year-to-date income and expense aggregation pulled from the transactions table
- Adjust an estimated tax rate with a slider to see estimated liability
- Track whether you have crossed the 1099 reporting threshold

**Status — Live.**

---

### 3.13 Tools (`/tools`)

**What you see:** A list of 14 tracked tools with their status and monthly cost.

**What you can do:**
- Change a tool's operational status using the dropdown on each entry

**Status — Live.** Current tracked tools include beehiiv, Ghost, YouTube Studio, OBS, n8n, Cloudflare, and Notion — all currently active at $0/month.

---

### 3.14 Entity (`/entity`)

**What you see:** VFXellence Ltd LLC's legal and account information — masked EIN, bank, phone, platform account limits, and three brand records.

**What you can do:** Read only. No editing controls.

**Status — Partial.** This screen reads from a static TypeScript file (`data/entity.ts`), not the database. The three brands shown are:
- **zrodinger** — assigned to the viral ecosystem, 8 platform accounts shown as "active"
- **ateliez** — assigned to products, 6 accounts shown as "not-started"
- **signal** — assigned to content, 7 accounts shown as "TBD"

**Important:** The @zrodinger accounts shown here as "active" do not exist in production. They have not been created on any platform. The governance vault marks them as `planned` with 0 followers. The entity.ts data is aspirational. See Section 5.6 for details.

---

## 4. The Content Workflow

This section describes the full end-to-end loop from creating work to publishing it.

### Step 1: Intake — Create the Campaign and Tasks

Navigate to **Intake** (`/intake`). In Tab 1, fill in:
- Campaign name and ecosystem
- Vertical
- Any initial tasks to create alongside the campaign

Submit the form. The campaign and tasks are written to the database. The campaign status starts as `planned`.

### Step 2: Board — Task Appears in Backlog

Switch to **Board** (`/board`). Your new tasks appear in the `backlog` column. Move them to `todo` when you are ready for an agent to work on them.

### Step 3: Campaigns — Start an Agent Session

Navigate to **Campaigns** (`/campaigns`). Find your campaign and click **Approve & Run** (if the campaign has been approved) or **Run**.

Before you click, verify that the `approvedBy` field is set on the campaign — the server will return a 409 error if it is missing, and the run will not start.

The server spawns an agent subprocess. The terminal embedded in the Campaigns page begins streaming PTY output from that agent over the `/ws/terminal?sessionId=` WebSocket channel. You are watching the agent work in real time.

The campaign status changes to `running`.

### Step 4: Artifact Production — The content production pipeline Runs

The agent processes its assigned tasks. When it produces a content artifact (a script, draft, or clip), it hands it to the content production pipeline in `packages/agents/src/`.

The pipeline runs three stages:
1. **Voice** — generates an audio track (ElevenLabs, or an mp3 placeholder if credentials are absent)
2. **Visual** — generates video frames (Higgsfield via hf.exe, or png placeholders)
3. **Assembly** — composes the final video (HyperFrames 0.6.110 via npx, or an mp4 placeholder)

If any capability is missing — no API key, no binary, `HYPERFRAMES_ENABLED` not set — that stage produces a placeholder file and the pipeline continues. It does not fail hard.

The content production pipeline only accepts `content_type=clip` with `status=approved`. Other types are rejected at the driver level.

### Step 5: First Approval Gate — Content Review

After the agent produces its artifact, the system creates a record in the `approval_queue` table with `status=pending`. The campaign does not proceed automatically.

Navigate to **Approvals** (`/approvals`). You will see the item in the queue with its content or preview.

You have three choices:

- **Approve** — the artifact moves forward to the render stage.
- **Request Changes** — you must enter review notes. The item is sent back to the agent. The task status cannot be set to `done` while this approval is pending.
- **Reject** — you must enter notes. The item is permanently stopped here. This is a terminal state.

### Step 6: Render Stage — HyperFrames Produces the MP4

Once you approve the first gate, the render driver runs the assembly stage — or produces a placeholder MP4 if `HYPERFRAMES_ENABLED` is not set to `true`.

After the render completes, the system creates a **second** approval record in the queue, this time with `content_type=video`. The pipeline halts here. It does not auto-publish.

### Step 7: Second Approval Gate — Video Review

You must review the rendered video before anything is published.

Return to **Approvals** and find the video approval item. Watch the rendered MP4. You have the same three choices as before.

Approving here unlocks the **Publish** button for this item.

### Step 8: Publish — Operator Clicks, System Routes

Click **Publish** on the approved video item. The system calls POST /api/publish.

What happens next:
1. **RoutingService** builds a posting plan — it selects active platform accounts, staggers same-platform posts by `stagger_hours` (default 4 hours), and assigns each post to an account.
2. The posting plan is handed to the distributor. In production, this routes through Buffer (BUFFER_TOKEN__VIRAL, etc.) or Postiz. If credentials are absent, the **DryRunDistributor** handles it — it logs that a post would occur but does not actually post anything.
3. The result is written to `publish_log`. The `dry_run` column defaults to `1`. If real posting occurs, it is set to `0`.

Until you configure real distributor credentials, every publish action is a safe dry run.

---

## 5. Feature Reference

### 5.1 Approval Queue

The `approval_queue` table tracks each item through these states:

| Status | Meaning |
|--------|---------|
| `pending` | Waiting for human review |
| `approved` | Operator approved; workflow continues |
| `changes-requested` | Operator returned with notes; task sent back |
| `rejected` | Operator rejected; workflow stopped permanently |

**Terminal states:** `approved` and `rejected` cannot be changed once set through the UI.

**Task lock:** A task cannot be moved to `done` status while it has an approval record in `pending` state. Resolve the approval first.

**The two-approval pattern:** Every content clip goes through the queue twice — once for the script/draft (content review) and once for the rendered video (video review). The second approval is created automatically after the render stage. You must click Publish yourself; the system never publishes automatically.

---

### 5.2 content production pipeline

The pipeline lives in `packages/agents/src/adapters/` and has three stages. All stages are fully implemented — this is not a stub.

**Stage 1 — Voice (`adapters/voice.ts`)**

Uses ElevenLabs eleven_turbo_v2_5. Requires `ELEVENLABS_API_KEY` and `ELEVENLABS_VIRAL_VOICE_ID` in the environment. If either is absent, produces an mp3 placeholder file and continues.

**Stage 2 — Visual (`adapters/visual.ts`)**

Uses Higgsfield via `hf.exe`. The binary path defaults to `D:\dev\sandbox\hf.exe` or can be overridden with `HF_PATH`. If the binary is not found, produces png placeholder images and continues.

**Stage 3 — Assembly (`adapters/assembly.ts`)**

Builds an HTML composition with `hyperframes.json` and `meta.json`, copies the voice and visual assets in, then runs `npx hyperframes@0.6.110 render <dir> -o <out> --quiet`. Gated on `HYPERFRAMES_ENABLED=true`. If the gate is off, produces an mp4 placeholder.

**Important note on HyperFrames version:** The machine-global HyperFrames installation is v0.5.7 (stale). The pipeline pins to `0.6.110` via the npx call to avoid the stale global. Do not install the global version for this use.

**Mode selection:** If `forceDryRun` is set, or if any capability is absent (no key, no binary, gate off), the whole pipeline runs in dry-run mode. It produces placeholder output files in the expected locations so downstream stages do not fail.

**Real output:** When all three capabilities are configured and `HYPERFRAMES_ENABLED=true`, the pipeline produces a real 1080×1920 MP4.

**Entry point:** The render driver (`renderDriver.ts`) only accepts `content_type=clip` with `status=approved`. It creates the second approval record after render completes and then stops — it does not invoke the publish path.

---

### 5.3 Multi-Account Routing

When an operator clicks Publish, `RoutingService.buildPlan()` computes a posting plan before any distributor is called.

**How accounts are selected:**

1. Load all platform accounts where `active=1`
2. Sort: accounts that have never posted first (null `last_posted_at`), then oldest `last_posted_at` first, then by `rotation_order`
3. Enforce `maxAccountsPerPlatform` (default 1) — no two entries in the same plan post identical content to the same platform from different accounts
4. For posts to the same platform, stagger `scheduledAt` by `stagger_hours` (default 4.0 hours)

The output is a `PostingPlan[]` of `{accountId, platform, scheduledAt, credentialRef}` objects. This is pure computation — no database writes happen during planning.

**Known gap — last_posted_at writeback:** The `last_posted_at` column exists in the `platform_accounts` table, but the service does not update it after a successful publish. This means the rotation algorithm will not advance across posts — the same account will always appear to have never posted (or to have the oldest post date). This is tracked and will be fixed before go-live.

---

### 5.4 Bug Report → GitHub Bridge

A **BugReportButton** in the sidebar footer opens a modal where you can log a bug. Fields: title, description, area (mission-control, server, dashboard-client, polymath-engine, governance, automation), severity.

Submitting calls POST /api/bug-report.

**Dry-run default:** If `MC_BUG_REPORT_ENABLED` is absent or not set to `true`, the server logs "WOULD CREATE ISSUE" and returns a synthetic issue URL. The client shows an amber banner confirming dry-run mode. No real GitHub issue is created.

**When enabled:** The server shells `gh issue create --repo VFXellence-LTD/abundenz --label type/bug --label area/<area>`. The `area` value is mapped to a label; unknown areas fall back to `area/mission-control`. The `gh` CLI must be authenticated and accessible on the server's PATH.

---

### 5.5 GitHub PM Integration

**What is live today:** The bug report bridge (Section 5.4) is the only live GitHub touchpoint. Three infrastructure tasks (INFRA-001/002/003) were migrated to GitHub issues #12, #13, and #14 on 2026-06-17.

**What is planned but not yet built:**

A full GitHub Projects v2 board with a label taxonomy, field definitions, and GitHub Actions workflows. This requires a `PROJECT_PAT` fine-grained secret and several workflow files that do not yet exist. Branch naming conventions and the CLAUDE.md retirement of VFX-NNN identifiers are also pending. These are documented in the roadmap (Section 8).

---

### 5.6 Ecosystems & Brands

Mission Control manages four ecosystems:

| Ecosystem | Status | Notes |
|-----------|--------|-------|
| **Content** | Active build | Setup steps fully seeded |
| **Viral** | Active build | @zrodinger brand; accounts not yet created |
| **Products** | Parked | Locked in Setup; no active campaigns |
| **Affiliate** | Parked | Locked in Setup; no active campaigns |

**@zrodinger — Viral Brand (Important)**

The active brand for the viral ecosystem is @zrodinger. The `data/entity.ts` file in the client lists 8 platform accounts for this brand (YouTube, TikTok, Instagram, and others) with status `active`. This is aspirational data.

In the governance vault, @zrodinger accounts are marked `planned` with 0 followers. None of these accounts have been created on any platform. The GOLIVE task sequence (Section 7) tracks the steps required before any viral publishing can begin.

When you see @zrodinger listed as "active" in the Entity page, read it as "target state", not "current state."

---

### 5.7 Launch Runbook

The Launch page (`/launch`) provides a guided runbook for launching a new vertical. The default runbook is `viral/tech`, which has approximately 20 steps:

1. Email setup
2. Brand name generation (AI-assisted)
3. Platform handle selection (6 platforms)
4. Affiliate account setup
5. Content scaffold generation
6. Daily routine definition
7. Evaluation criteria

**AI field generation:** Steps that have generatable fields call a client-side fallback chain: Gemini (VITE_GEMINI_API_KEY) → Claude Haiku (VITE_ANTHROPIC_API_KEY) → Groq (VITE_GROQ_API_KEY). If none are configured, AI generation is unavailable but steps can still be completed manually.

**Save to Vault:** Once a runbook is complete, the Save to Vault button posts the runbook as a markdown file to the server. The server writes it to the vault at the path you specify, capped at 2 MB, with path-traversal protection.

**Other templates:** There are 4 launch templates in `data/launch-templates.ts`. Only the viral/tech template is fully developed. Other ecosystem templates exist in skeleton form.

---

## 6. Safety Model & Gates

### The Doctrine

Mission Control is designed so that autonomous agents can do everything except publish and spend. Every outbound irreversible action requires an operator click. This is enforced at two levels:

1. **The approval queue** — content must pass two human reviews before the Publish button appears
2. **The distributor gate** — even after operator clicks Publish, the system routes to DryRunDistributor unless real credentials are explicitly configured

The `publish_log.dry_run` column defaults to `1`. A record with `dry_run=1` means nothing was actually posted to a platform, regardless of what the log entry says.

### Environment Gates

The following table shows every feature gate, the default behavior when the variable is absent, and what it enables when set:

| Variable | Default (absent) | What it enables |
|----------|-----------------|-----------------|
| `HYPERFRAMES_ENABLED=true` | MP4 placeholder file | Real 1080×1920 HyperFrames render |
| `ELEVENLABS_API_KEY` + `ELEVENLABS_VIRAL_VOICE_ID` | MP3 placeholder | Real ElevenLabs TTS audio |
| `HF_PATH` (or `D:\dev\sandbox\hf.exe` present) | PNG placeholders | Real Higgsfield visual generation |
| `BUFFER_TOKEN__VIRAL` (or other ecosystem suffix) | DryRunDistributor | Real Buffer posting for that ecosystem |
| `POSTIZ_API_KEY__<ECOSYSTEM>` + `POSTIZ_API_URL__<ECOSYSTEM>` | DryRunDistributor | Real Postiz posting for that ecosystem |
| `MC_BUG_REPORT_ENABLED=true` | Dry-run log only | Real GitHub issue creation |
| `VITE_GEMINI_API_KEY` | Skip Gemini, try next | Gemini for Launch field generation |
| `VITE_ANTHROPIC_API_KEY` | Skip Claude, try next | Claude Haiku for Launch field generation |
| `VITE_GROQ_API_KEY` | No AI generation | Groq for Launch field generation |
| `PORT` | 4500 | Server listen port |

### Important: Ecosystem-Suffixed Credentials

Buffer tokens must use the ecosystem-suffixed pattern: `BUFFER_TOKEN__VIRAL`, `BUFFER_TOKEN__CONTENT`, etc. A bare `BUFFER_TOKEN` variable (no suffix) is **rejected by design**. This is intentional brand isolation — credentials are scoped per ecosystem so a viral credential cannot be used to post from the content brand.

The same pattern applies to Postiz: `POSTIZ_API_KEY__VIRAL` and `POSTIZ_API_URL__VIRAL`, not bare `POSTIZ_API_KEY`.

---

## 7. Configuration

### Go-Live Sequence

Before real publishing can occur, complete this sequence:

**Step 1 — Create @zrodinger accounts**

The platform accounts do not exist yet. Create them on each target platform (YouTube, TikTok, Instagram, etc.). Record the handle, email, and any tracking IDs in the `platform_accounts` table, or update `data/entity.ts` to reflect reality. The GOLIVE-001 through GOLIVE-004 tasks in the database track this.

**Step 2 — Configure distributor credentials**

For each ecosystem you want to post from, set the corresponding environment variable on the server:

```
BUFFER_TOKEN__VIRAL=<your Buffer token for the viral brand>
BUFFER_TOKEN__CONTENT=<your Buffer token for the content brand>
```

Or for Postiz:
```
POSTIZ_API_KEY__VIRAL=<key>
POSTIZ_API_URL__VIRAL=<api url>
```

Set these in the server's environment (a `.env` file at `server/.env`, or in your process manager).

**Step 3 — Set per-account credential_ref**

Each row in `platform_accounts` has a `credential_ref` column. The routing service uses this to look up the specific credential for that account at publish time. Populate this for every account that should be able to post.

**Step 4 — Wire last_posted_at**

The rotation algorithm does not currently update `last_posted_at` after posting (known gap, Section 5.3). Until this is fixed, manually update this column if rotation accuracy matters for your go-live timeline.

**Step 5 — Enable the content production pipeline**

Set `HYPERFRAMES_ENABLED=true` and configure ElevenLabs and Higgsfield credentials if you want real rendered video. These can be enabled independently — the pipeline degrades gracefully and uses placeholders for any missing capability.

**Step 6 — Enable bug reporting (optional)**

Set `MC_BUG_REPORT_ENABLED=true` on the server and ensure the `gh` CLI is authenticated. Verify with a test report.

### AI Field Generation (client-side)

Add API keys to the client's environment (a `.env` file at `client/.env` or `client/.env.local`):

```
VITE_GEMINI_API_KEY=...
VITE_ANTHROPIC_API_KEY=...
VITE_GROQ_API_KEY=...
```

Only one is required — the chain falls back automatically. Gemini is tried first.

---

## 8. Roadmap — Designed, Not Yet Built

These features are designed and documented in the governance vault but not yet implemented. They are listed here so operators know what is coming and do not mistake absence for oversight.

### Module 2: Feedback Loop

Designed around a `performance_signal` table and `content_params` table. A `StrategyAdjuster` service would analyze signal data and propose parameter updates. Gated on `FEEDBACK_LOOP_ENABLED`. No code exists yet.

### Module 3: Meta-Ads

An `AdBuyer` service and `ad_campaigns` table. Gated on `ADS_ENABLED`. Every ad campaign requires explicit Boss approval before activation. No code exists yet.

### Module 4: Pre-Publish Daily Loop

A `LoopOrchestrator` that runs a daily pre-publish sequence, tracked in a `loop_run_log` table. Gated on `DAILY_LOOP_ENABLED`. No code exists yet.

### GitHub PM Phase A

A GitHub Projects v2 board with defined fields (Priority, Ecosystem, Sprint), a full label taxonomy, and GitHub Actions workflows for issue triage and project board automation. Requires a `PROJECT_PAT` fine-grained personal access token configured as a repository secret. Branch naming convention changes and CLAUDE.md updates are also part of this phase.

### Agent Board — Live Terminal Streaming

The Agents page (`/agents`) currently shows a static list of past agent runs. Live terminal streaming — equivalent to what the Campaigns page shows — is planned for this page in Plan 3.

### Chart Wiring

The RevenueChart on the Dashboard and the sparkline charts on the Earnings page are both hardcoded to placeholder values. Wiring them to the live transaction backend is a known outstanding item.

### last_posted_at Writeback

The `platform_accounts.last_posted_at` column exists and the rotation algorithm reads it. The distributor does not write it after posting. This will be fixed before full rotation-based multi-account posting is reliable.

---

## 9. Troubleshooting / FAQ

**Why does Publish appear to succeed but nothing actually posts?**

The most common cause is that distributor credentials are not configured. Without `BUFFER_TOKEN__<ECOSYSTEM>` or equivalent Postiz variables, every publish call routes to the DryRunDistributor, which logs the action without posting. Check `publish_log.dry_run` — if it is `1`, the post was a dry run. See Section 7, Step 2.

**Why is publish_log showing dry_run=1 for everything?**

The column defaults to `1`. It is only set to `0` when a real distributor (Buffer or Postiz) successfully executes the post. Until you configure real credentials, every entry will show `dry_run=1`. This is correct and expected behavior.

**How do I enable real posting?**

Set `BUFFER_TOKEN__VIRAL` (or the equivalent for your ecosystem) in the server environment. Then ensure every `platform_accounts` row has a `credential_ref` value pointing to the right credential. The ecosystem suffix is mandatory — a bare `BUFFER_TOKEN` variable will not work.

**Why is @zrodinger showing "active" in the Entity page but the accounts don't exist?**

The Entity page reads from a static TypeScript file (`data/entity.ts`) that was populated with target state, not actual state. The governance vault reflects reality: @zrodinger accounts are `planned` with 0 followers, and none have been created on any platform yet. Creating those accounts is the first step in the GOLIVE task sequence. See Section 5.6.

**Why does bare BUFFER_TOKEN not work?**

Rejected by design. The routing service expects per-ecosystem suffixed variables (`BUFFER_TOKEN__VIRAL`, `BUFFER_TOKEN__CONTENT`, etc.) to enforce brand isolation. Using a bare token would allow any ecosystem to post through any brand's credentials, which is not safe in a multi-brand setup.

**Why can't I set a task to done?**

The task has a linked approval record in `pending` state. The server prevents marking a task `done` while its approval is unresolved. Go to the Approvals page and either approve, reject, or request changes on the linked item, then return to the Board.

**The Agents page shows no terminal — is it broken?**

No. The Agents page is a known stub. It shows past agent run history but does not stream live output. The code has an explicit banner confirming this. For live terminal output, use the **Campaigns** page, which has a real PTY stream embedded in it.

**Viral Setup tab checkboxes don't save — why?**

The viral ecosystem's setup steps are not seeded in the `setup_steps` table. The checkboxes render based on client-side data but the toggle calls are no-ops because there are no database records to update. Only the Content setup tab has seeded steps. Seeding the viral steps is a pending task.

**RevenueChart shows zeros — is there no financial data?**

The chart is not wired to the transaction database. It uses hardcoded placeholder data regardless of what is in the `transactions` table. To view actual financial data, use the **Transactions** page (`/transactions`) or the **Tax Center** (`/tax`), both of which read live data.

**The server returns 409 when I try to start a campaign run.**

The `approvedBy` field is missing on the campaign. The server requires it before starting any agent session. Set the `approved_by` and `approved_at` fields on the campaign record (or use the approval workflow to populate them) before clicking Run or Approve & Run.

---

*End of Operator Manual*
