# Polymath Setup Wizard

Quick-start orientation for new Claude sessions or first-time vault exploration. Follow sequentially.

---

## Step 1: Understand What This Is

Polymath (`_passive_income`) is an Obsidian vault governing Robin Dutta's AI-driven passive income businesses. Five independent ecosystems, each with its own brand identity, agent pipeline, and revenue model. Not a git repo.

**Boss** = Robin Dutta. Final authority on everything.

---

## Step 2: Read Core Docs (in order)

| # | File | Why |
|---|------|-----|
| 1 | `CLAUDE.md` | Operating guide — rules, structure, prohibitions |
| 2 | `shared/brand-isolation/POLICY.md` | Most important policy — ecosystems never share identity |
| 3 | `shared/skills/polymath-pitfalls/SKILL.md` | 14 failure modes to check before any expansion |

---

## Step 3: Know the Ecosystems

| Ecosystem | Brand | Directory | Status | Description |
|-----------|-------|-----------|--------|-------------|
| Content | Signal | `ecosystems/content/` | Active build (Phase 0) | Authentic voice, VFX pipeline engineering, 13-agent pillar→derivative pipeline |
| Viral | Surge | `ecosystems/viral/` | Active build (Design) | Anonymous AI short-form content, multi-account, RPM-optimized, 9-agent clip factory |
| Products | Atelier | `ecosystems/products/` | Parked | AI-generated visual products (wall art, KDP, POD) |
| Affiliate | Conduit | `ecosystems/affiliate/` | Parked | Anonymous affiliate income (Pinterest + digital) |
| Lullaby | Lullaby | `ecosystems/content/verticals/lullaby/` | Design phase | Bedtime story narration for children |

**Active ecosystems:** Content (Signal) and Viral (Surge) build in parallel.
**Parked ecosystems:** Products (Atelier) and Affiliate (Conduit) — do not build.

---

## Step 4: Know the Rules

=== NEVER BLEND BRAND IDENTITIES ACROSS ECOSYSTEMS ===
=== NEVER PUBLISH CONTENT ON BEHALF OF BOSS ===
=== NEVER SKIP THE 30-DAY MANUAL RULE BEFORE AUTOMATING ===
=== NEVER USE OWNER'S VOICE OR IDENTITY IN SURGE CONTENT ===
=== NEVER WORK ON A PARKED ECOSYSTEM BEYOND R&D ===
=== LOAD polymath-pitfalls SKILL BEFORE ANY EXPANSION DECISION ===

---

## Step 5: Determine What Boss Wants

| If Boss asks about... | Go to... |
|-----------------------|----------|
| Signal content / VFX Pipeline | `ecosystems/content/` → check `brief/`, `agents/`, `calendar/` |
| Surge / viral content / clipping | `ecosystems/viral/` → check `safeguards/POLICY.md` first, then `shared/` |
| New tool or platform | Load `polymath-pitfalls` skill first, then `shared/automation/tool-stack.md` |
| Revenue / budget / status | `controller/dashboard.md` |
| Brand questions | `shared/brand-isolation/POLICY.md` |
| Research / trends | `ecosystems/shared/agents/research-analyst.md` |
| Lullaby / kids content | `ecosystems/content/verticals/lullaby/` → `safeguards/POLICY.md` FIRST |
| Adding an ecosystem | Load `polymath-pitfalls`. Check activation criteria in CLAUDE.md. |
| Products (Atelier) | PARKED. R&D only → `references/` |
| Affiliate (Conduit) | PARKED. R&D only → `references/` |
| Code / development | `dev/DEV-CLAUDE.md` — separate governance |

---

## Step 6: Shared Infrastructure

| Location | Contains | Used by |
|----------|---------|---------|
| `ecosystems/shared/agents/` | Trend Scanner, Research Analyst, Analytics, SEO, Image Gen, Scheduler | All ecosystems |
| `ecosystems/shared/compliance/` | FTC, tax, AI content disclosure, platform policies | All ecosystems |
| `ecosystems/shared/workflows/` | Revenue tracking, Pinterest pipeline, content→product flywheel | All ecosystems |
| `shared/skills/` | polymath-pitfalls, niche-locker, content-atomizer, review-miner | Decision support |
| `shared/prompts/` | Reusable prompt templates | All ecosystems |
| `shared/automation/` | Tool stack, deployment architecture | All ecosystems |

---

## Step 7: Key Files per Active Ecosystem

### Signal (Content)
| File | Purpose |
|------|---------|
| `ecosystems/content/README.md` | Overview, status, next actions |
| `ecosystems/content/verticals/vfx-pipeline/brief/niche.md` | Niche definition, audience personas, content pillars |
| `ecosystems/content/verticals/vfx-pipeline/brief/style-guide.md` | Voice, tone, visual identity |
| `ecosystems/content/shared/agents/README.md` | 13-agent pipeline architecture |
| `ecosystems/content/shared/workflows/pillar-to-spokes.md` | End-to-end production workflow |
| `ecosystems/content/verticals/vfx-pipeline/calendar/phase-0-plan.md` | 90-day launch plan |

### Surge (Viral)
| File | Purpose |
|------|---------|
| `ecosystems/viral/README.md` | Overview, status, vertical ideas |
| `ecosystems/viral/safeguards/POLICY.md` | Content standards — READ FIRST |
| `ecosystems/viral/shared/agents/README.md` | 9-agent pipeline architecture + JSON schema |
| `ecosystems/viral/shared/playbooks/surge-formula.md` | Retention optimization system |
| `ecosystems/viral/shared/workflows/clip-factory.md` | End-to-end clip production workflow |
| `ecosystems/viral/shared/playbooks/hook-library.md` | Hook templates by category |
| `ecosystems/viral/shared/playbooks/platform-rpm.md` | RPM rates and monetization |
| `ecosystems/viral/verticals/_template/README.md` | Template for new content verticals |

---

## Step 8: What Phase Are We In?

**Current state (as of 2026-05-13):**
- Nothing is live. Zero published content across all ecosystems.
- Signal: Phase 0 build. VFX Pipeline niche locked. Agents not yet built. First pillar not yet recorded.
- Surge: Design phase. Structure built. First vertical not yet selected by Boss. 30-day manual phase not started.
- Products + Affiliate: Parked. Directory structure exists. Do not build.
- Lullaby: Design phase. Safeguards defined. Do not build until Signal Phase 2.

**Next milestones:**
1. Boss selects first Surge vertical
2. Signal records first pillar content
3. Both ecosystems start publishing
4. 30-day manual validation before any automation

---

## Quick Reference

```
_passive_income/
├── CLAUDE.md              ← operating guide (START HERE)
├── SETUP.md               ← this file
├── README.md              ← human-readable overview
├── MAP.md                 ← visual directory map
├── controller/            ← oversight: dashboard, budget, kill-switches
├── ecosystems/
│   ├── content/           ← Signal (active build)
│   ├── viral/             ← Surge (active build)
│   ├── products/          ← Atelier (parked)
│   ├── affiliate/         ← Conduit (parked)
│   └── shared/            ← cross-ecosystem agents, workflows, compliance
├── shared/                ← governance: brand isolation, skills, prompts, tools
├── references/            ← R&D inbox
└── dev/                   ← code projects (separate governance)
```
