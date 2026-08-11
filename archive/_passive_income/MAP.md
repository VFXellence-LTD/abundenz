# Polymath — Visual Map

```
_passive_income/                       ← D:\dev\_passive_income (Obsidian vault)
│
├── CLAUDE.md                          ← Claude Code operating guide
├── README.md                          ← human-readable overview
├── MAP.md                             ← this file
│
├── controller/                        ← oversight layer (not orchestration)
│   ├── README.md
│   ├── kill-switch-criteria.md       ← shutdown conditions, decided in advance
│   ├── budget.md                      ← (created month 1)
│   ├── escalation-log.md              ← (created month 1)
│   └── weekly-brief-template.md       ← (created when 2nd ecosystem launches)
│
├── ecosystems/
│   │
│   ├── signal/                        ← AUTHENTIC-VOICE CONTENT (active build)
│   │   ├── README.md                  ← Operation Signal, Phase 0 → 4
│   │   ├── brief/                     ← niche brief, style guide, banned topics
│   │   ├── agents/                    ← 13 sub-agents (Trend → Analytics)
│   │   ├── workflows/                 ← multi-agent pipelines
│   │   ├── playbooks/                 ← runbooks
│   │   ├── assets/                    ← brand templates
│   │   ├── calendar/                  ← posting schedule
│   │   └── analytics/                 ← weekly briefs
│   │
│   ├── viral/                         ← HIGH-VOLUME AI SHORT-FORM (active build — Surge)
│   │   ├── README.md                  ← ecosystem overview + thesis
│   │   ├── PITCH.md                   ← business case
│   │   ├── safeguards/
│   │   │   └── POLICY.md              ← READ FIRST. Content standards.
│   │   ├── shared/
│   │   │   ├── agents/                ← 9 agents (source→score→script→visual→voice→assemble→caption→distribute→track)
│   │   │   ├── workflows/             ← clip-factory, story-factory, trend-surf
│   │   │   └── playbooks/             ← surge-formula, hook-library, platform-rpm
│   │   ├── verticals/                 ← content niches (each gets own anonymous brand)
│   │   │   └── _template/             ← template for new verticals
│   │   └── accounts/                  ← multi-account strategy + management
│   │
│   ├── atelier/                       ← AI-VISUAL-PRODUCT (parked)
│   │   ├── README.md                  ← parked until Signal Phase 2
│   │   └── ...                        ← all empty
│   │
│   ├── lullaby/                       ← BEDTIME STORY NARRATION (design phase)
│   │   ├── README.md                  ← Format A + Format B; activation rules
│   │   ├── safeguards/
│   │   │   └── POLICY.md              ← READ FIRST. Child + IP rules.
│   │   ├── brief/                     ← (empty)
│   │   ├── agents/                    ← (empty)
│   │   └── ...                        ← all empty
│   │
│   └── conduit/                       ← ANONYMOUS AFFILIATE (parked)
│       ├── README.md                  ← Pinterest + digital affiliate model
│       ├── brief/                     ← niche selection, product criteria
│       ├── agents/                    ← (empty until activation)
│       └── ...                        ← all empty
│
├── shared/                            ← used by all ecosystems / controller
│   ├── tools/                         ← active tool registry
│   ├── prompts/                       ← reusable utility prompts
│   ├── brand-isolation/
│   │   └── POLICY.md                  ← inter-ecosystem rules
│   └── skills/
│       └── polymath-pitfalls/
│           └── SKILL.md               ← decision-support skill, prevents recurring failures
│
└── references/                        ← R&D inbox (feeds all ecosystems)
    ├── README.md
    ├── _TEMPLATE.md
    ├── _inbox.md                      ← raw drop-zone
    ├── reels/
    ├── videos/
    ├── articles/
    ├── threads/
    ├── tools/                         ← candidates, not yet adopted
    ├── creators/
    └── papers/
```

## Reading order for a new visitor

1. `CLAUDE.md` — Claude Code operating guide (how this vault is governed)
2. `README.md` — what this is and why multiple ecosystems
3. `shared/brand-isolation/POLICY.md` — the rules that make multi-ecosystem viable
4. `shared/skills/polymath-pitfalls/SKILL.md` — the failure modes to watch for
5. `controller/README.md` — what the oversight layer does
6. `ecosystems/signal/README.md` — the active business
7. `ecosystems/lullaby/README.md` + `lullaby/safeguards/POLICY.md` — for any work involving the kids ecosystem
8. `ecosystems/viral/README.md` + `viral/safeguards/POLICY.md` — the active AI viral content business (Surge)
9. `ecosystems/atelier/README.md` — the parked AI-visual-product business
10. `ecosystems/conduit/README.md` — the parked anonymous affiliate business
10. `references/README.md` — how R&D flows in

## Reading order for the operator (you)

- **Daily:** `ecosystems/signal/calendar/` + whatever agent you're working with
- **Weekly:** `controller/` Monday brief
- **Monthly:** `references/` synthesis pass + re-read kill-switch criteria
- **Quarterly:** re-read brand isolation policy. Re-read Operation Signal §1.1 to confirm phase. Re-read Lullaby safeguards if that ecosystem is or could be active. Re-read Conduit kill-switch criteria.
- **Whenever excited about expansion:** load `polymath-pitfalls` skill before deciding
