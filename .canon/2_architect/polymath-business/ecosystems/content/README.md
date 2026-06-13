# Ecosystem: Signal

The authentic-voice content business focused on VFX pipeline engineering.

## One-line thesis
One daily voice-recorded pillar asset, atomized by AI agents into 12-18 platform-native derivatives, monetized across seven stacked revenue streams.

## Core moat
The owner's real recorded voice. AI does production, distribution, and analysis; the owner does taste, narrative, and delivery. AI voice clone acceptable only for short patches and translated derivatives — never for primary content.

## Niche (locked)
**VFX pipeline engineering for small and mid-size studios that cannot afford a full pipeline department.**

Target audience: pipeline TDs, technical artists, studio supervisors, and ops managers at studios of 5-150 artists. Intermediate-to-advanced audience. Full niche brief: [[brief/niche]].

## Business model
- Pillar: 3 long-form pieces/week (8-15 min, voice-recorded, Mon/Wed/Fri)
- Spokes: 14-18 derivatives per pillar across 9 platforms
- Revenue: YouTube AdSense, affiliate marketing, sponsorships, paid newsletter, digital products, community membership, consulting funnel
- Owner time target: ~2 hours/day at launch, ~30 minutes/day at full automation

## Status
- **Current phase:** Phase 0 — build
- **Niche:** VFX pipeline engineering (locked — [[brief/niche]])
- **Active platforms:** none yet — launching Week 7 per [[calendar/phase-0-plan]]
- **Active monetization:** none yet — first product target Week 13
- **Agents operational:** none yet — Agent 01 (Trend Scout) builds Week 9
- **Content banked:** 0 of 5 target pre-launch pillars recorded

## Next actions (ordered)
1. Finalize brand name and register handles (Week 1)
2. Set up recording environment (Week 2)
3. Record first 5 pillar episodes (Weeks 3-4)
4. Set up blog + newsletter (Weeks 5-6)
5. Launch YouTube + newsletter simultaneously (Week 7)
6. Build Agent 01 (Trend Scout) (Week 9)

See [[calendar/phase-0-plan]] for full day-by-day plan.

## Files in this ecosystem

```
content/
├── README.md                  ← this file
│
├── brief/                     ← niche definition and content rules
│   ├── niche.md               ← niche statement, personas, content pillars, competitive landscape
│   ├── style-guide.md         ← voice, tone, visual identity, vocabulary rules
│   ├── banned-topics.md       ← what Signal never covers and why
│   └── audience-personas.md   ← detailed buyer personas with demographics and buying behavior
│
├── agents/                    ← 13 agent specifications (build in order from README)
│   ├── README.md              ← agent registry, build order, data flow diagram
│   ├── 01-trend-scout.md      ← daily VFX industry signal monitoring
│   ├── 02-topic-researcher.md ← deep research brief generation per topic
│   ├── 03-script-outliner.md  ← recording outline generation (human-in-loop)
│   ├── 04-voice-recording.md  ← human stage documentation and handoff protocol
│   ├── 05-transcriber.md      ← automated audio transcription (Whisper + Claude clean)
│   ├── 06-editor.md           ← automated audio editing (Auphonic + FFmpeg)
│   ├── 07-thumbnail-generator.md ← AI thumbnail concept + Canva composition (human picks)
│   ├── 08-atomizer.md         ← all derivative generation in one batch (human reviews)
│   ├── 09-scheduler.md        ← automated multi-platform scheduling + YouTube upload
│   ├── 10-seo-optimizer.md    ← keyword analysis and content optimization
│   ├── 11-engagement-monitor.md ← daily comment/mention monitoring and lead surfacing
│   ├── 12-analytics-reporter.md ← weekly analytics brief generation
│   └── 13-monetization-tracker.md ← monthly P&L across all revenue streams
│
├── workflows/                 ← multi-stage process documentation
│   ├── pillar-to-spokes.md    ← end-to-end atomization pipeline with timing and data flow
│   └── weekly-content-cycle.md ← weekly rhythm from Monday topic selection to Friday analytics
│
├── playbooks/                 ← runbooks for recurring operational tasks
│   ├── content-formats.md     ← format library: specs, lengths, examples for all 10 formats
│   ├── monetization-stack.md  ← all 7 revenue streams: mechanics, pricing, automation, timeline
│   └── product-catalog.md     ← 8 digital products: description, price, build effort, audience
│
├── calendar/                  ← time-phased plans
│   └── phase-0-plan.md        ← 90-day launch plan: week-by-week, deliverables, success metrics
│
├── assets/                    ← brand templates, thumbnails, audio (created during Phase 0)
└── analytics/                 ← weekly and monthly reports (populated when platforms are live)
```

## Revenue model summary

| Stream | Type | Phase 0 target |
|--------|------|---------------|
| YouTube AdSense | Passive | Unlock at Month 4-6 (1K subs threshold) |
| Affiliate marketing | Passive | First commission Month 2-4 |
| Sponsorships | Semi-active | First deal Month 6-12 |
| Paid newsletter | Passive | First subscriber Month 3-4 |
| Digital products | Passive | First sale Week 13 (Studio Audit Checklist) |
| Community membership | Semi-passive | Launch Month 6 |
| Consulting | Active | First inquiry Month 1-3 |

Full detail: [[playbooks/monetization-stack]]

## Content pillars (7)
1. Pipeline Architecture
2. Tool Deep Dives
3. Python for Pipeline
4. Workflow Optimization
5. DCC Integration
6. AI in the Pipeline
7. Studio Ops and Infrastructure

## Agent build sequence
```
Phase 0 (Weeks 9-13):  01 Scout → 05 Transcriber → 02 Researcher
Phase 1 (Weeks 13-18): 03 Outliner → 08 Atomizer → 09 Scheduler → 10 SEO
Phase 1 (Weeks 18-20): 06 Editor → 07 Thumbnails → 11 Engagement → 12 Analytics
After first revenue:   13 Monetization Tracker
```

## What goes here vs. what goes in `shared/`
- Niche-specific style guides, prompts, and agent specs → here
- General-purpose tools used by both ecosystems → `shared/tools/`
- Brand isolation rules → `shared/brand-isolation/`
- R&D inputs being evaluated → `references/`

## Brand isolation reminder
Signal does not reference, link to, or promote Atelier or Surge. Owner's expertise in Signal = pipeline engineering and technical education. No mention of generative AI art, Atelier products, Surge viral content, or creative work. Read `shared/brand-isolation/POLICY.md` before any cross-promotion temptation.

## When to revisit this README
- At each phase transition → update Status section and next actions
- When first agent ships → update agent operational status
- When first product sells → update monetization status
- At Day 90 → run Phase 0 metrics check, write Phase 1 plan
