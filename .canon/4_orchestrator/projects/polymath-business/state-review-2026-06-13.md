# Polymath — Where We Left Off (State Review)

**Date:** 2026-06-13
**Purpose:** Pre-design state review before architecting a Canon-style governance vault + autonomous single-campaign engine for Polymath.
**Audience:** Boss (Robin Dutta) + design subagents.

---

## 1. Executive Recap

- **Five ecosystems, zero live.** Nothing is published, no revenue, no agent code built. Everything is spec/design only.
  - **Content / Signal (VFX Pipeline)** — Active build, Phase 0. DEEP spec. Owner recording not started.
  - **Viral / Surge (Tech/AI Tools)** — Active build, design phase. DEEP spec. Vertical locked (Tech/AI, confirmed 2026-05-14). Brand: Zrodinger / @zrodinger, parent brand Abundenz. 0 clips, 0 accounts.
  - **Content / Lullaby** — Design phase. Real spec (README + safeguards). Parked pending safeguards + Boss decision. Sub-vertical of Content.
  - **Products / Atelier** — Parked. Real specs (5 agents). Blocked until Content or Viral reaches Phase 2.
  - **Affiliate / Conduit** — Parked. Real specs (5 agents). Blocked until Content or Viral reaches Phase 2.
- **Build sequence:** Signal + Surge in parallel (Boss override 2026-05-13). All others parked. Month-9 checkpoint decides whether ONE parked ecosystem activates — gated behind the `polymath-pitfalls` skill.
- **BUILT vs SPECCED:**
  - **Specced (real, substantive):** All 13 Signal agents, both Signal workflows, Signal playbooks, Signal vertical brief (niche/personas/style/banned-topics/phase-0 plan). Surge viral-formula (13.6KB, effectively the combined spec for agents 01–08), 3 Surge workflows, 4 Surge playbooks, safeguards policy, accounts strategy, vertical research. Products (5 agents) and Affiliate (5 agents) full specs. 6 shared agents + shared workflows + compliance docs. Source Material Bible (sections 01–20).
  - **MISSING:** Surge individual agent files `01-source-scanner.md`–`09-rpm-tracker.md` were never created (only the architecture README + viral-formula exist). Lullaby `brief/` and all sub-dirs are empty. `packages/agents/` and `packages/types/` are empty. No working agent code anywhere.
- **Dashboard state:** Vite 8 + React 19 + TypeScript + Tailwind 4 + React Router 7 + Recharts. Working pages: Dashboard, Earnings, Transactions, Tax, Tools, Entity. Partial: Setup (Content real, Viral hardcoded stub, Products/Affiliate locked). Most complete: Launch page (Surge step templates, AI-generate, vault save). All runtime data is **localStorage only** — no backend, no SQLite in use (the `better-sqlite3` dep is wired to nothing).
- **Dev port is 5174**, not 5173 as documented in CLAUDE.md (vite.config.ts line 46) — CLAUDE.md is stale on this point.
- **Vault-write plugin** exists: dev-only Vite middleware intercepts `PUT /__vault/<filename>` and writes flat markdown to `vault/controller/launches/`. Guards against `..` / `/`, flat filenames only.
- **Git state:** Branch `develop`, up to date with `origin/develop`. Only 5 commits total — very young repo. Branches: `develop`, `main`.
- **Uncommitted work:** Modified `apps/dashboard/CLAUDE.md` + `vite.config.ts`. Untracked: `poly.bat`, two changelogs (2026-06-03, 2026-06-13), Jarvis toolkit article + 7 tool-eval files, and the entire new `vault/shared/source-material-bible/` Section 20 directory. `scripts/` is empty.
- **Dev governance layer exists:** `vault/dev/` mirrors Canon's `_canon` numbered structure (1_controller → 5_knowledge) but configured for the VFXellence-LTD GitHub org and Asana/GitHub Issues task tracking (not Jira). `DEV-CLAUDE.md` defines a 12-step lifecycle.
- **Source Material Bible is production-grade and DB-ready:** Sections 01–20, locked YAML frontmatter schema (METADATA-STANDARD.md), legal pre-clearance layer (Section 01 wins all conflicts), remix engine (Section 15) that can generate novel legally-cleared creative briefs on demand. This is the strongest reusable asset in the vault.

---

## 2. Asset Map for an Autonomous Single-Campaign Engine

### Reusable building blocks (exist today)

**Specs / doctrine (the "brain"):**
- **Surge viral-formula.md** (13.6KB) — full 7-step transformation system (Source → Score → Script → Visual → Voice → Assemble → Caption → Distribute → Track) with JSON schemas, scoring dimensions, script rules, style/visual options, platform adaptation matrix. **This is the de-facto pipeline spec for an MVP engine.**
- **Surge workflows** — `clip-factory.md` (stage map, parallel execution, 4 input variants, daily targets, batch schedule, error handling), `story-factory.md`, `trend-surf.md`.
- **Surge playbooks** — `hook-library.md` (Tech/AI-specific Zrodinger hooks), `platform-rpm.md` (RPM by platform/niche), `title-formula.md`.
- **Surge safeguards POLICY.md** — 7 hard bans + quality floor + FTC + escalation. Mandatory gate for any clip before distribution.
- **Surge vertical README + research** — brand (Zrodinger), monetization bands (Impulse/Recurring/Premium), production pipeline (free tools), source material list, vertical scoring matrix.
- **Signal:** 13 fully-specced agents, 2 workflows, 3 playbooks, full vertical brief. Reusable if Signal is chosen, but Signal's moat is owner's real voice (less automatable).

**Agents (specs only, no code):**
- 13 Signal agent specs, 5 Products specs, 5 Affiliate specs, 6 shared agent specs. **All are markdown specs — none are executable. `packages/agents/` is empty.**
- Surge agents 01–09 exist **only as an architecture README + viral-formula** — individual implementation specs were never written.

**Content / source material (the "raw fuel"):**
- **Source Material Bible (sections 01–20)** — legally pre-cleared, machine-readable, DB-ingestible creative primitives. Locked frontmatter schema. Section 14 (Trending Categories) = demand signal; 08/09/13 = palette/symbol/motif; 02–05 = legal-cleared sources; 15 (Remix Engine) = on-demand novel collisions; 01 = legal filter that wins all conflicts. **Primary engine for Products/POD; strong secondary feed for Surge scripts (mythology, folklore, trending categories, quotes, archetypes).** Less central to Signal (owner-voice moat).

**References / tooling layer (the "hands"):**
- **JARVIS toolkit capture** (`articles/2026-06-13_build-your-own-jarvis-toolkit.md`) — maps 11-row toolkit to Polymath architecture slots. Validates the controller-layer design: Claude Code core runtime + MCP connectors. Key mappings: Buffer/Postiz MCP → Scheduler; Meta dev token → Analytics; Routines/`/schedule` → controller scheduling primitive; vault markdown → knowledge base (already in place).
- **Tool evals (consistent schema, verdicts):** `elevenlabs.md` (in use — Surge Voice step 5; blocked from Signal/Lullaby by voice-authenticity doctrine), `buffer.md` (park — 30-day rule + brand-isolation risk), `postiz.md` (park — self-host kills cross-account fingerprinting risk for Surge), `claude-for-chrome.md` / `playwright-mcp.md` (controller browser automation, evaluating), `gmail-mcp.md` / `meta-ads-connector.md` / `revenuecat.md` (park). Earlier captures cover video-gen and monetization tools.

**Dashboard scaffolding (the "console" — partial):**
- Launch page (Surge step templates, AI-generate buttons, vault save, JSON export, localStorage field capture).
- Entity page (Zrodinger fully populated, platform account-limit tracker).
- Tools page (registry + monthly burn calc), Transactions/Earnings/Tax (revenue tracking shell, flat-zero data).
- Vault-write plugin (`PUT /__vault/`) — primitive for engine output persistence.

### What is MISSING (must be built or decided)

- **Executable agent code.** Every agent is a markdown spec. `packages/agents/` and `packages/types/` are empty. No runtime.
- **Surge agent implementation specs 01–09** — never written (only README + viral-formula).
- **Durable storage.** localStorage is single-browser ephemeral. No server-side store, no append-only logs, no multi-record history. SQLite dep unused. A campaign engine needs durable records (a Vite plugin exposing SQLite, or a Hono+SQLite localhost backend).
- **Job/task/queue data model.** No concept of "a campaign run", "a scheduled task", "a queue item", or "an execution log". `LaunchStep` is a checklist item, not a runnable unit of work.
- **Agent identity model.** No types for agent name/version/capability/status/last-run/schedule/error. Shared `Agent`, `Campaign`, `RunLog`, `JobStatus`, `AgentOutput` types must be defined in `packages/types/` first.
- **Control-plane UI:** Campaign Control Panel, Agent Registry/Status Board, Surge Control Panel, Kill-Switch Monitor, Brand Isolation Audit, Decision Queue/Monday Brief. None exist.
- **Swarm controls:** run/stop/pause, streaming output viewer, scheduling UI (no cron data model), output-artifact review/approve/discard, multi-agent dependency-graph visualization.
- **Brand accounts.** Zero exist. For a Surge MVP this is the literal Day-1 blocker — TikTok/YouTube/Instagram @zrodinger + affiliate program signups.
- **Approval/queue surface.** No structured human-approval gate UI exists anywhere (doctrine requires one before any publish).

---

## 3. The .canon Pattern to Mirror

`.canon` uses a numbered-folder mnemonic (C-A-N-O-N): `1_controller / 2_architect / 3_notes / 4_orchestrator / 5_knowledge`. Concrete patterns worth copying for a Polymath autonomous-campaign governance vault:

1. **Numbered-folder mnemonic as cognitive map.** Number prefixes force stable sort order and the structure is memorable. Polymath analog: order folders so they reflect information flow (rules → active work → captured learning), e.g. `1_doctrine / 2_campaigns / 3_notes / 4_ops / 5_intel`.

2. **Hard doctrine vs. procedural workflow separation.** `1_controller/standards/` = timeless laws ("never do X"); `1_controller/workflows/` = step-by-step procedures ("when starting a campaign, do steps 1–N"). Polymath: `doctrine/` for immutable campaign laws + `workflows/` for atomic launch-sequence / content-cadence / revenue-review procedures. Use the Obsidian Skills pattern (YAML frontmatter + wikilinks, self-contained atomic docs) so each is independently linkable and machine-readable.

3. **Status-folder-as-state-machine.** `4_orchestrator/projects/` uses subfolders as states (`backlog → todo → in-progress → blocked → in-review → done`). A file's location IS its status — move the file, no field to update, no external tool required. Polymath: campaign briefs / content pieces / agent tasks follow `backlog → planned → running → review → done`.

4. **Daily changelog as machine-readable standup feed.** `4_orchestrator/changelogs/YYYY-MM-DD.md` with `## TICKET-ID — description` headers so an AI can extract per-item progress. Polymath: `## CAMPAIGN-ID — description` sections → automated weekly revenue/performance summaries with no database. (Polymath already has this pattern partially in `vault/dev/4_orchestrator/changelogs/`.)

5. **Separated durable knowledge from session notes.** `5_knowledge/learning/` (permanent, topic-keyed gotchas) is deliberately distinct from `3_notes/` (raw inbox) and from changelogs (session-specific). Polymath: `5_intel/learning/` for durable campaign insights (e.g. "thumbnail CTR drops after 3 similar covers") vs `3_notes/` brainstorms vs `4_ops/changelogs/` session work.

6. **Subagent vault-update block baked into governance.** CLAUDE.md carries a copy-paste "VAULT UPDATES (mandatory)" block appended to every subagent brief (update tracker, append changelog, write learning if gotcha). Polymath: equivalent block covering campaign-tracker check-in, daily changelog append, intel capture — included verbatim in every agent brief so documentation is part of the work, not a skipped follow-up.

7. **Profile deployment (source of truth in vault, deployed out).** `1_controller/profiles/` holds canonical CLAUDE.md + settings for external projects; the vault owns the source, workspace copies are deployments. Polymath: `1_doctrine/profiles/` holds the authoritative CLAUDE.md for `apps/dashboard`, preventing drift between vault rules and code-project rules.

**Bonus — factory/snapshot split:** `_canon_factory` is a stamp factory (the 5-folder skeleton as a reusable template; named instances stamped + git-snapshot'd). The live vault is not a git repo; the factory repo is the git backup. Worth copying only if Polymath ever needs versioned vault snapshots or multi-instance cloning.

---

## 4. Doctrine Tensions the Design MUST Reconcile

Every hard rule that collides with "100% autonomous revenue generation," each stated as a one-line tension:

- **30-day manual rule** (`NEVER SKIP THE 30-DAY MANUAL RULE BEFORE AUTOMATING`) — Nothing can be automated until the process has run manually for 30 consecutive days, and every pipeline is currently at 0/30, so a fully autonomous engine cannot legally run on day one.
- **NEVER PUBLISH WITHOUT APPROVAL** (`NEVER PUBLISH CONTENT ON BEHALF OF BOSS`, first publish is an explicit gate) — Autonomy must stop short of the publish action; the engine can produce/queue/prepare but a human must approve before anything goes live, permanently.
- **No tool adoption before validated demand** (`DO NOT ADOPT TOOLS BEFORE VALIDATED DEMAND EXISTS`, `NEVER ADOPT A PAID TOOL WITHOUT BOSS'S APPROVAL`) — The engine cannot self-provision new APIs/services to expand capability; tool onboarding is gated on proven demand + explicit Boss approval.
- **Brand isolation** (`NEVER BLEND BRAND IDENTITIES ACROSS ECOSYSTEMS`, `NEVER CONNECT AFFILIATE TO ANY PERSONAL IDENTITY`) — A single shared engine must structurally guarantee zero data/asset cross-contamination between brands even while sharing tooling (Claude API, scheduler), and the controller is the only place brands may co-exist (private infra only).
- **Voice authenticity** (`NEVER USE OWNER'S VOICE OR IDENTITY IN SURGE CONTENT`; Signal/Lullaby moat is the owner's real voice) — The engine must structurally prevent owner voice/name/image from entering Surge/Conduit outputs, while Signal/Lullaby's value depends on real owner voice that an autonomous pipeline cannot synthesize without destroying the moat.
- **Parked-ecosystem rule** (`NEVER WORK ON A PARKED ECOSYSTEM BEYOND R&D IN REFERENCES`) — The engine may not operate Products/Affiliate (or any parked target) beyond references-level R&D until the Month-9 expansion gate (routed through `polymath-pitfalls`) is cleared by the Boss.
- **Kill-switch is human-only** (`kill-switch monitoring — alerts only, Boss decides; never auto-shutdown`) — The engine may detect threshold conditions and fire alerts but can never autonomously pause or shut down an ecosystem; shutdown decisions carry a 24-hour cooling period and Boss sign-off.
- **Controller is read-only re content** (`Controller... NEVER publishes, edits content, or routes assets`) — The oversight layer of the engine must be strictly read-only with respect to content; it produces dashboards/alerts/pause-commands only.
- **Budget hard-pause** (alert 80% / $169, hard-pause 100% / $211/mo) — The engine must enforce an automatic API-agent pause at the spend cap, which directly bounds how much "autonomous" generation can occur.
- **Safeguards hard gate (Surge)** (`NEVER POST SURGE CONTENT THAT VIOLATES SAFEGUARDS POLICY`) — Every clip must pass `ecosystems/viral/safeguards/POLICY.md` before progressing to distribution; blocked content is logged (not silently auto-discarded).
- **Child-safety + secrets** (`NEVER PUT CHILD'S PERSONAL DATA INTO AI TOOLS`, `NEVER STORE SECRETS/CREDENTIALS/API KEYS IN THIS VAULT`) — Any Lullaby automation is hard-blocked from child data, and the engine's credential handling must live outside the vault entirely.

---

## 5. Top Open Decisions (Boss must resolve before a spec can be written)

1. **Which single campaign/ecosystem is the MVP — and why?**
   Recommendation surfaced by the readers: **Surge / Zrodinger (Tech/AI Tools)**. It is the only target whose vertical is locked AND fully specced (viral-formula + workflows + playbooks + safeguards), its production pipeline needs no GPU/automation and runs ~40 min/video on free tools, and it is the natural home for the Source Material Bible feeds. It is also doctrine-compatible with autonomy (anonymous brand — no owner-voice conflict that blocks Signal/Lullaby). **Decision: confirm Surge as MVP, or pick Signal/another and accept its constraints.**

2. **Where does the human-approval gate sit?**
   Doctrine forbids autonomous publishing forever. **Decision: is the gate at "approve each piece before publish" (per-asset), "approve a batch/day's queue", or "approve the pipeline config once, then trust it within bounds"?** This single choice defines how "autonomous" the engine can ever be.

3. **What task-management tool runs campaigns and agent tasks?**
   Options surfaced: Canon's file-move state-machine in the vault (`backlog → running → review → done`, no external tool), GitHub Issues/Projects (already the `vault/dev` convention), Asana (named in CLAUDE.md), or a new dashboard-native queue backed by SQLite. **Decision: which is the source of truth for campaign/run state, and does it live in vault, dashboard, or an external tracker?**

4. **How is autonomy earned and staged?**
   The 30-day manual rule blocks all automation at 0/30 today. **Decision: define the explicit ladder — e.g. Stage 0 manual (run by hand, log to tracker) → Stage 1 assisted (engine drafts, human approves each) → Stage 2 supervised (engine queues a day's batch, human approves batch) → Stage 3 bounded-autonomous (engine runs within budget/safeguard limits, human approves publish only). What concrete metric promotes a pipeline from one stage to the next?**

5. **What is the storage/runtime architecture for the engine?**
   localStorage cannot hold campaign runs, logs, or queues; SQLite dep is unused; there is no backend. **Decision: Vite-plugin-exposed SQLite, a Hono+SQLite localhost server, Electron-style local server, or pure-vault-markdown (Canon-style file state)? And where do `Agent` / `Campaign` / `RunLog` types live — `packages/types/`?**

6. **Build the new Canon-style governance vault as a new top-level structure or extend the existing `vault/dev/` layer?**
   `vault/dev/` already mirrors Canon's numbered structure for code governance. **Decision: does the autonomous-campaign governance vault reuse/extend `vault/dev/`, or stand up a parallel `1_doctrine…5_intel` campaign vault alongside the business vault? Who owns campaign doctrine vs. the existing controller/ docs?**

7. **How does brand isolation get enforced at the engine architecture level for the MVP?**
   Shared tooling is permitted but brand outputs must never touch. **Decision: one engine instance per brand (hard separation), or one engine with enforced per-brand data partitions + a brand-isolation audit gate? And which scheduler — Buffer (no official MCP, fingerprinting risk) vs self-hosted Postiz — given Surge's anonymous multi-account model?**

8. **What is the minimum first deliverable — and is account creation in scope?**
   The actual Day-1 blocker for a Surge MVP is that zero brand accounts exist. **Decision: is the first milestone "engine produces an approved draft of one Zrodinger clip" (no accounts needed), or "one clip published end-to-end" (requires the Boss to create @zrodinger accounts + affiliate signups first)? This sets whether the engine spec must include a distribution path on day one or defer it.**
