# Polymath — Claude Code Operating Guide

Operating inside **Polymath** (`_passive_income`), governance vault for Robin Dutta's AI-driven passive income system. Polymath = Obsidian vault, not git repo. Controls Claude Code across all ecosystem work.

---

## Boss

**Boss** = human supervisor — Robin Dutta. Final authority on all decisions, approvals, direction. Same person as Canon's Maestro — different hat, different title.

### Rules of Engagement

=== ALWAYS ADDRESS BOSS BY NAME ===

=== NEVER PROCEED PAST A GATE WITHOUT BOSS'S APPROVAL ===
Gates: ecosystem activation, niche lock, first publish, brand identity decisions, tool adoption costing >$0/mo, any Lullaby recording decision involving a child.

=== WHEN IN DOUBT ASK BOSS ===
No guessing intent. No assuming scope. Surface the question.

---

## Effort Routing

Dynamically select model effort level based on what Boss is asking. Don't burn max tokens on simple lookups; don't underthink strategic decisions.

| Boss is asking for... | Effort | Why |
|----------------------|--------|-----|
| Quick fact lookup, file location, status check | **Low** | Answer is in a file. Read and reply. |
| Edit a single doc, update a table, fix a typo | **Low** | Mechanical work, no judgment needed. |
| Write a new agent spec, playbook, or workflow | **Medium** | Structured output from known patterns. |
| Research a topic, evaluate a tool, score a niche | **Medium-High** | Requires synthesis across multiple sources. |
| Brainstorm content ideas, suggest verticals | **Medium** | Creative but bounded by existing frameworks. |
| Design a new ecosystem, refactor vault structure | **High** | Architectural decisions with cross-cutting impact. |
| Strategic planning, build sequence changes, expansion decisions | **Max** | Load polymath-pitfalls, think deeply, surface tradeoffs. |
| Safeguard review, brand isolation audit, kill-switch evaluation | **Max** | Errors here cause real harm. No shortcuts. |
| Multiple ecosystems in one request, cross-cutting changes | **Max** | Coordination complexity requires full reasoning. |

### Subagent model routing (when spawning agents)

| Task type | Model | Rationale |
|-----------|-------|-----------|
| Read files, search, explore codebase | **haiku** | Fast, cheap, read-only |
| Write a single doc from clear spec | **sonnet** | Good structured output, cost-effective |
| Audit/review across multiple files | **sonnet** | Needs breadth but patterns are mechanical |
| Plan architecture, design systems, evaluate tradeoffs | **opus** | Needs deep reasoning |
| Creative strategy, niche evaluation, retention analysis | **opus** | Judgment-heavy, no formula |
| Batch mechanical edits (rename, add rows, update counts) | **haiku** | Pattern application, no creativity |

### Auto-escalation triggers

Escalate to higher effort when:
- Boss says "think about this," "deep dive," "be thorough," "max effort"
- Request touches 3+ ecosystems simultaneously
- Request involves money, legal, or child safety
- Request contradicts existing doctrine (may need override reasoning)
- Request is ambiguous and wrong interpretation would waste significant work

De-escalate when:
- Boss says "quick," "just," "fast," "simple"
- Request is a single-file update
- Answer is clearly in one document
- Request is a repeat of a previous pattern

---

## Vault Structure

```
_passive_income/
├── CLAUDE.md              ← this file (operating guide)
├── README.md              ← human-readable overview
├── MAP.md                 ← visual directory map
├── controller/            ← oversight layer (budget, schedule, kill-switches)
├── ecosystems/
│   ├── shared/            ← global agents, workflows, compliance used by 2+ ecosystems
│   │   ├── agents/        ← analytics, seo-optimizer, image-generator, scheduler
│   │   ├── workflows/     ← revenue-tracking, pinterest-pipeline, content-to-product flywheel
│   │   ├── platforms/     ← platform configs shared across ecosystems
│   │   └── compliance/    ← FTC disclosure, tax categories, platform policies
│   ├── content/           ← voice-driven content businesses
│   │   ├── shared/        ← agents/workflows shared across content verticals
│   │   ├── verticals/     ← independent content niches
│   │   │   ├── vfx-pipeline/  ← primary niche (active build)
│   │   │   └── lullaby/       ← bedtime stories (design phase)
│   │   └── platforms/     ← youtube, tiktok, newsletter, podcast, blog
│   ├── viral/             ← high-volume AI-generated short-form content (Surge)
│   │   ├── shared/        ← agents/workflows/playbooks for viral pipeline
│   │   │   ├── agents/    ← 9 agents (source→score→script→visual→voice→assemble→caption→distribute→track)
│   │   │   ├── workflows/ ← clip-factory, story-factory, trend-surf
│   │   │   └── playbooks/ ← surge-formula, hook-library, platform-rpm
│   │   ├── safeguards/    ← content standards (READ FIRST)
│   │   ├── verticals/     ← content niches (each gets own anonymous brand + accounts)
│   │   └── accounts/      ← multi-account management
│   ├── products/          ← AI-generated products sold on marketplaces
│   │   ├── shared/        ← agents/workflows shared across product platforms
│   │   └── platforms/     ← etsy, shopify, kdp, gumroad, redbubble, creative-market
│   └── affiliate/         ← automated affiliate income
│       ├── shared/        ← agents/workflows shared across affiliate networks
│       └── networks/      ← amazon, clickbank, pinterest, digistore24
├── shared/                ← vault-level governance (policies, skills, tools, prompts)
│   ├── brand-isolation/   ← POLICY.md — the most important shared doc
│   ├── tools/             ← active tool registry
│   ├── prompts/           ← reusable utility prompts
│   ├── skills/            ← decision-support skills
│   └── automation/        ← tool stack, deployment architecture
└── references/            ← R&D inbox feeding all ecosystems
```

### Shared hierarchy (what goes where)

| Location | Scope | Examples |
|----------|-------|---------|
| `shared/` (vault root) | Governance, policies, skills | Brand isolation, polymath-pitfalls, niche-locker |
| `ecosystems/shared/` | Operational systems used by 2+ ecosystems | Analytics agent, SEO optimizer, Pinterest pipeline |
| `ecosystems/content/shared/` | Content ecosystem only | Atomizer agent, content calendar |
| `ecosystems/viral/shared/` | Viral ecosystem only | Script engine, clip factory, surge formula |
| `ecosystems/products/shared/` | Products ecosystem only | Design generator, listing optimizer |
| `ecosystems/affiliate/shared/` | Affiliate ecosystem only | Product scout, link manager |

---

## Core Doctrine

### The Three Laws

1. **No shared identity between ecosystems.** Different brands, domains, handles, payment processors. See [[shared/brand-isolation/POLICY]].
2. **Content and Viral ecosystems may build in parallel.** Other ecosystems require Content Phase 2 before activation. Boss override: 2026-05-13.
3. **The child's wellbeing overrides all business logic.** Lullaby safeguards are non-negotiable. See [[ecosystems/content/verticals/lullaby/safeguards/POLICY]].

### Priority Stack

Working code → Working content → Working monetization → Elegance

Publish before perfecting. Iterate on live content. A mediocre video that ships beats a perfect script in a drawer.

### Build Sequence (Revised 2026-05-13 — Boss Override)

```
Active now:   Content (VFX Pipeline) + Viral (Surge) build in parallel.
              Content = authentic voice, deep technical content.
              Viral = AI-generated short-form, anonymous, RPM-optimized.
              These serve different audiences with different tools — parallel build is viable.

Month 9:      Checkpoint — are Content AND Viral each generating revenue?
               YES → choose ONE additional ecosystem (Products or Affiliate) to begin
               NO  → fix underperforming ecosystem, do not expand further

Products + Affiliate remain parked until at least one active ecosystem reaches Phase 2.
```

=== CONTENT AND VIRAL MAY BUILD IN PARALLEL (Boss override 2026-05-13) ===
=== ALL OTHER ECOSYSTEMS REMAIN PARKED UNTIL PHASE 2 CRITERIA MET ===

---

## Ecosystem Status Tracking

| Ecosystem | Status | Phase | Activation Criterion |
|-----------|--------|-------|---------------------|
| Content (VFX Pipeline) | Active build | Phase 0 | — |
| Viral (Surge) | Active build | Design phase | Boss activated 2026-05-13 |
| Content (Lullaby) | Design phase | — | Content Phase 2 + safeguards resolved + Boss decision |
| Products | Parked | — | Content or Viral Phase 2 + Boss decision |
| Affiliate | Parked | — | Content or Viral Phase 2 + Boss decision |

=== UPDATE ECOSYSTEM STATUS WHEN PHASE TRANSITIONS OCCUR ===

---

## Polymath-Pitfalls Skill

=== ALWAYS LOAD `polymath-pitfalls` BEFORE ANY EXPANSION DECISION ===

Expansion = adding a tool, starting an ecosystem, adding a platform/vertical/network, adopting a monetization stream, changing build sequence. The skill at [[shared/skills/polymath-pitfalls/SKILL]] surfaces 14 failure modes.

If Boss is excited about adding something, that excitement is a signal to slow down.

---

## Working with Ecosystems

### Content (Active — VFX Pipeline vertical)

**Thesis**: One daily voice-recorded pillar → 12-18 AI-atomized derivatives → seven revenue streams.
**Moat**: Owner's real voice. AI does production/distribution; owner does taste/narrative/delivery.
**Docs**: [[ecosystems/content/README]]

#### Content Work Lifecycle

```
1. UNDERSTAND   What does Boss want to build/change?
2. CHECK BRIEF  Read ecosystems/content/verticals/vfx-pipeline/brief/ for niche, style, constraints
3. CHECK PHASE  What phase is the vertical in?
4. PITFALL-CHECK Load polymath-pitfalls if adding scope
5. DRAFT        Produce the deliverable (agent spec, workflow, playbook, content plan)
6. REVIEW       Present to Boss. Do not publish or finalize without approval.
7. DOCUMENT     Update relevant files
```

#### Content verticals

- **VFX Pipeline** (active) — practical pipeline engineering for small/mid studios. [[ecosystems/content/verticals/vfx-pipeline/brief/niche]]
- **Lullaby** (design phase) — bedtime story narration. Safeguards at [[ecosystems/content/verticals/lullaby/safeguards/POLICY]].

New verticals added as directories under `ecosystems/content/verticals/`. Each gets its own brief, calendar, and playbooks.

#### Content Agent Pipeline

13 sub-agents in `ecosystems/content/shared/agents/`. Built incrementally — do not build Agent N+1 until Agent N has run manually for 30 days.

=== DO NOT AUTOMATE WHAT HASN'T BEEN DONE MANUALLY FOR 30 DAYS ===

### Viral (Active — Surge)

**Thesis**: AI-sourced content → retention-optimized scripts → AI voice + visuals → short-form video → distributed across anonymous accounts on TikTok, YouTube Shorts, Instagram Reels.
**Moat**: Pipeline speed + scale + multi-account distribution. No personal identity.
**Docs**: [[ecosystems/viral/README]]

#### Viral Work Lifecycle

```
1. UNDERSTAND   What vertical/content type does Boss want?
2. CHECK SAFEGUARDS  Read ecosystems/viral/safeguards/POLICY.md (always)
3. PITFALL-CHECK     Load polymath-pitfalls if adding scope
4. DRAFT             Produce deliverable (vertical brief, agent spec, workflow, content)
5. REVIEW            Present to Boss. Do not publish without approval.
6. DOCUMENT          Update relevant files
```

#### Viral verticals

New verticals added as directories under `ecosystems/viral/verticals/`. Each gets its own brand identity, accounts, content rules, and RPM tracking. Use `_template/` to create new verticals.

=== BOSS SELECTS FIRST VERTICAL BEFORE ANY CONTENT PRODUCTION ===

#### Viral Agent Pipeline

9 agents in `ecosystems/viral/shared/agents/`. Source → Score → Script → Visual → Voice → Assemble → Caption → Distribute → Track.

=== 30-DAY MANUAL RULE APPLIES — RUN PIPELINE BY HAND BEFORE BUILDING AGENTS ===
=== ALL SURGE CONTENT IS ANONYMOUS — NO PERSONAL IDENTITY ===

### Products (Parked)

**Thesis**: AI-generated products sold at volume — wall art, KDP books, POD, digital downloads, templates.
**Moat**: Speed + niche selection. Anonymous brand.
**Docs**: [[ecosystems/products/README]]

=== DO NOT BUILD PRODUCTS INFRASTRUCTURE UNTIL ACTIVATION CRITERIA MET ===

Platforms organized under `ecosystems/products/platforms/` — each marketplace (Etsy, Shopify, KDP, Gumroad, Redbubble) gets its own directory for configs, listing specs, and analytics.

### Affiliate (Parked)

**Thesis**: Fully automated affiliate income via AI-generated content driving traffic to affiliate offers. Anonymous brand.
**Docs**: [[ecosystems/affiliate/README]]

=== DO NOT BUILD AFFILIATE INFRASTRUCTURE UNTIL ACTIVATION CRITERIA MET ===

Networks organized under `ecosystems/affiliate/networks/` — each network (Amazon, Clickbank, Pinterest, Digistore24) gets its own directory.

**Key constraints when Affiliate activates:**
1. Full anonymity — no personal identity in any Affiliate property
2. FTC disclosure on every piece of content with affiliate links (see [[ecosystems/shared/compliance/ftc-disclosure]])
3. Separate payment processor from Content and Products
4. 30-day manual rule applies

=== NEVER CONNECT AFFILIATE TO ANY PERSONAL IDENTITY ===

---

## Global Shared Systems

Operational agents and workflows used by 2+ ecosystems live in `ecosystems/shared/`.

### Shared Agents
- **Analytics Reporter** — weekly revenue/performance consolidation across all ecosystems
- **SEO Optimizer** — search optimization for all written content (blogs, listings, descriptions)
- **Image Generator** — routes to cheapest AI model (Higgsfield CLI default), handles all visual needs
- **Scheduler** — cross-platform posting at optimal times
- **Trend Scanner** — cross-ecosystem trend detection feeding Content (topic ideas) and Viral (content sources)
- **Research Analyst** — deep research intelligence: discovers niches, viral formats, products, audience opportunities. Weekly digest + on-demand. Feeds ALL ecosystems.

### Shared Workflows
- **Revenue Tracking** — transaction logging, P&L, tax categorization for dashboard
- **Pinterest Pipeline** — shared Pinterest strategy (all 3 ecosystems use Pinterest differently)
- **Content → Product Flywheel** — private data flows between ecosystems (no public cross-promotion)

### Compliance
- **FTC Disclosure** — templates per platform, rules per ecosystem
- **Tax Categories** — Schedule C classification, quarterly estimate workflow
- **Platform Policies** — AI content rules across marketplaces
- **AI Content Disclosure** — per-platform AI-generated content labeling requirements (critical for Viral/Surge)

---

## Controller

The oversight layer. Watches all ecosystems, surfaces decisions, manages shared budget and risk. **Does not orchestrate or publish.** Only outputs: dashboards, alerts, pause commands.

**Docs**: [[controller/README]]

### Controller Responsibilities

1. **Budget oversight** — aggregate spend, alert at 80%, hard-pause API agents at 100%
2. **Cadence health** — posting cadence vs calendar, owner time-per-day
3. **Kill-switch monitoring** — conditions in [[controller/kill-switch-criteria]]. Alerts only — Boss decides.
4. **Cross-ecosystem analytics** — Monday brief (when 2+ ecosystems active)
5. **Brand isolation enforcement** — weekly check for cross-linking violations

=== START MANUAL. AUTOMATE THE SLOWEST STEP. ===

---

## Kill-Switch Protocol

Explicit shutdown criteria decided in advance, before emotional attachment. See [[controller/kill-switch-criteria]] for full conditions.

### Decision Protocol (when a condition fires)

1. **24-hour cooling period** — do not act same day
2. **Confirm data** — platform analytics lag and lie
3. **Consult criteria** — is this the predicted scenario or something else?
4. **Decide and document** — write reason in `controller/escalation-log.md`
5. **If shutdown: announce honestly** — audiences forgive shutdowns, not ghosting

=== A SHUTDOWN OF ONE ECOSYSTEM DOES NOT AUTO-SHUTDOWN THE OTHER ===

---

## Brand Isolation

The most important shared policy. Full doc: [[shared/brand-isolation/POLICY]]

| Rule | Summary |
|------|---------|
| Names | Different brand names per ecosystem, no visual similarity |
| Domains | Different domains, no subdomain sharing |
| Social | Different handles, different bios |
| Payment | Different Stripe accounts (or separated) |
| Email | Different public-facing contact emails |
| LLC | Separate entities when revenue >~$30k/yr |
| Cross-promo | **Never.** Content ↔ Products ↔ Affiliate = forbidden |
| Ownership | Don't hide it; don't advertise it |
| Controller | Only place all ecosystems appear together (private) |

=== OPERATIONS CAN BE SHARED; BRAND CANNOT ===

---

## References & R&D

All research flows through `references/`. See [[references/README]] for full workflow.

```
CAPTURE (5 sec):  Drop link in references/_inbox.md with one-line context
PROCESS (weekly):  Move to subfolder using _TEMPLATE.md. Delete if not actionable.
SYNTHESIZE (monthly): Promote useful items into ecosystem playbooks
```

=== DO NOT ADOPT TOOLS BEFORE VALIDATED DEMAND EXISTS ===

---

## Voice Authenticity Rules

=== THE OWNER'S REAL VOICE IS THE MOAT ===

| Use Case | Allowed? |
|----------|----------|
| Pillar content narration (Content) | Owner voice ONLY |
| Short patches / missed pickups (Content) | AI voice clone OK |
| Translated derivatives of evergreen content (Content) | AI voice clone OK |
| AI avatar for organic content (Content) | NO |
| AI avatar for paid ads (Phase 3+) | Under separate brand only |
| Lullaby narration | Owner voice ONLY, no AI |
| Surge/Viral content narration | AI voice ONLY — owner voice never appears in Surge |

---

## Installed Tools

| Tool | Type | Location | Used by |
|------|------|----------|---------|
| Higgsfield CLI | AI video/image gen | `D:\dev\sandbox\hf.exe` | ecosystems/shared/agents/image-generator, Viral (visuals) |
| HyperFrames | HTML→video renderer | global npm | Content (shorts, captions), Viral (video assembly, captions) |
| Supadata | Social media transcript MCP | MCP server | Content (trend research), Viral (source scanning, viral analysis) |
| Meta.ai | Free AI image + 5-sec video gen | Web | Viral (visual prompts, B-roll) |
| ElevenLabs | AI voiceover | API | Viral (voice synthesis) |
| ArcAds | AI UGC generation | github.com/krusemediallc/arcads-claude-code | Viral (UGC-style content — research status) |

---

## Relationship to Canon

Polymath and Canon are sibling vaults. Same human (Robin Dutta) — called "Maestro" in Canon, "Boss" in Polymath.

| | Canon (`_canon`) | Polymath (`_passive_income`) |
|---|---|---|
| Domain | Software engineering | AI-driven businesses |
| Primary workspace | `ayon-workspace` | Ecosystems (Content, Viral, Products, Affiliate) |
| Deliverables | Code, PRs, packages | Content, brands, revenue streams |
| Git | Yes (addon repos) | Yes (polymath monorepo — vault + dashboard + agents) |
| Supervisor | Maestro | Boss |

=== CANON RULES DO NOT APPLY TO POLYMATH (and vice versa) ===

---

## Polymath-Specific Prohibitions

=== NEVER PUBLISH CONTENT ON BEHALF OF BOSS ===
=== NEVER ADOPT A PAID TOOL WITHOUT BOSS'S APPROVAL ===
=== NEVER WORK ON A PARKED ECOSYSTEM BEYOND R&D IN REFERENCES ===
=== NEVER BLEND BRAND IDENTITIES ACROSS ECOSYSTEMS ===
=== NEVER PUT CHILD'S PERSONAL DATA INTO AI TOOLS ===
=== NEVER SKIP THE 30-DAY MANUAL RULE BEFORE AUTOMATING ===
=== NEVER STORE SECRETS, CREDENTIALS, OR API KEYS IN THIS VAULT ===
=== NEVER CONNECT AFFILIATE TO ANY PERSONAL IDENTITY ===
=== NEVER USE OWNER'S VOICE OR IDENTITY IN SURGE CONTENT ===
=== NEVER POST SURGE CONTENT THAT VIOLATES SAFEGUARDS POLICY ===

---

## Skills

| Skill | Location | Purpose |
|-------|----------|---------|
| `polymath-pitfalls` | `shared/skills/polymath-pitfalls/SKILL.md` | Surfaces 14 failure modes before expansion |
| `niche-locker` | `shared/skills/niche-locker/SKILL.md` | Niche evaluation matrix with scoring |
| `content-atomizer` | `shared/skills/content-atomizer/SKILL.md` | Pillar → derivative matrix |
| `review-miner` | `shared/skills/review-miner/SKILL.md` | Extract buying motivations from reviews |

---

## Development Layer — Polymath Monorepo

All code lives in the same git repo as this vault: `D:\dev\polymath`

```
polymath/                    ← git repo root
├── vault/                   ← THIS VAULT (Obsidian opens this as root)
├── apps/dashboard/          ← Vite + React dashboard
├── packages/types/          ← Shared TypeScript types
├── packages/agents/         ← Agent implementations (future)
└── scripts/                 ← CLI automation
```

- **GitHub**: [VFXellence-LTD](https://github.com/VFXellence-LTD) organization — repo: `polymath`
- **Task tracking**: Asana (not Jira — personal project, not Halon)
- **MCP**: `@roychri/mcp-server-asana` (token in env var, never in files)
- **Workflow**: Canon-style — git worktrees, conventional commits, Canon skills (`/start`, `/pr`, `/make`)

=== FOR CODE WORK, FOLLOW ROOT CLAUDE.md (`D:\dev\polymath\CLAUDE.md`) + CANON ===
=== FOR BUSINESS/VAULT WORK, FOLLOW THIS FILE ===
=== WHEN BOSS SAYS "UPDATE THE DASHBOARD" → WORK IN `apps/dashboard/` ===

### Dashboard

**Location:** `apps/dashboard/` (in this monorepo)
**Stack:** Vite + React 19 + TypeScript + Tailwind CSS 4 + Recharts + SQLite
**URL:** `http://localhost:5173`
**Pages:** Dashboard, Setup Wizard (`/setup/:ecosystem`), Earnings, Transactions, Tax Center, Tools
**CLAUDE.md:** `apps/dashboard/CLAUDE.md`

The web dashboard visualizes what this vault governs. When ecosystem structure changes here, the dashboard needs corresponding code updates.

**Current state:** Dashboard knows about Content, Products, Affiliate. Needs update for Viral/Surge, Lullaby, brand names, Surge control panel, research intelligence feed.

---

## Context for Claude

- **Operator**: Robin Dutta (Pipeline TD at Halon Studios by day; polymath operator by night)
- **Build phase**: Content Phase 0 + Viral design phase — nothing is live yet
- **Active ecosystems**: Content (VFX Pipeline vertical), Viral (Surge — awaiting first vertical selection)
- **Ecosystems**: Content (active), Viral (active), Products (parked), Affiliate (parked)
- **Content verticals**: VFX Pipeline (active build), Lullaby (design phase)
- **Viral verticals**: None yet — Boss to select first vertical
- **GitHub org**: VFXellence-LTD (personal, not Halon)
- **Task tracking**: Asana (personal, not Jira)
- **Time budget**: Limited — full-time job comes first. Polymath work happens in margins.
- **Comparative advantages**: Real voice talent, engineering discipline (from Canon), taste/curation instinct, VFX production experience
- **Risk profile**: Conservative. Would rather miss an opportunity than blow up what's working.
- **Family context**: Has a daughter (relevant to Lullaby vertical). Daughter's wellbeing is non-negotiable.
