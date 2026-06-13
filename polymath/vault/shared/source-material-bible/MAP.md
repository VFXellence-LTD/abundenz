# Map of the Source Material Bible

A visual tree of the whole vault: the foundation documents at the root, the 18 numbered section folders, and the role each plays. For the indexed list of individual entries, see [[INDEX]]; for coverage and verification status, see [[_COVERAGE-REPORT]].

---

## Root

```
source-material-bible/
├── README.md              ← master index, who/what it serves, safety summary, AI quickstart
├── METADATA-STANDARD.md   ← canonical YAML frontmatter schema (the DB contract)
├── DATABASE-READINESS.md  ← markdown → Notion/Airtable/Postgres/vector/RAG mapping
├── DOC-STANDARDS.md       ← naming, frontmatter, wikilinks, verification rules
├── MAP.md                 ← this file
├── INDEX.md               ← full entry index (written by synthesis pass)
└── _COVERAGE-REPORT.md    ← coverage + verification roll-up (written by synthesis pass)
```

---

## The 18 section folders

```
source-material-bible/
│
├── 01-Legal-Guidelines/            ▣ DOCTRINE
│     The canonical legal rulebook. PD cutoffs, copyright vs trademark vs
│     right-of-publicity, the conservative "when in doubt, don't" rule.
│     Every other folder defers here. Read first.
│
├── 02-Public-Domain-Library/       ◆ MASTER CATALOG
│     The cleared, cross-media catalog of public-domain source works.
│     The hub that themed folders (03–13) feed into and link from.
│
│   ── SOURCE MATERIAL (the raw inputs) ──
│
├── 03-Mythology/                   ◇ NARRATIVE FUEL
│     World mythologies — Greek, Norse, Egyptian, etc. Ancient & free.
│
├── 04-Folklore/                    ◇ NARRATIVE FUEL
│     Fairy tales, legends, folk traditions. Communal, emotionally rich.
│
├── 05-Literature/                  ◇ TEXT SOURCES
│     PD novels, poems, plays — cleared for adaptation and quotation.
│
├── 06-Historical-Art/              ◈ VISUAL SOURCES
│     Art movements & specific PD artworks — style donors for images.
│
├── 07-Historical-Design/           ◈ VISUAL SOURCES
│     Design systems & decorative styles — Art Deco, Bauhaus, ornament.
│
├── 08-Color-Palettes/              ◈ VISUAL SOURCES
│     Reusable color systems tied to eras, movements, and moods.
│
├── 09-Symbols/                     ◈ VISUAL SOURCES
│     Iconography & symbolic vocabulary — meaning-dense marks.
│
├── 10-Archetypes/                  ◇ STRUCTURE
│     Universal character & narrative archetypes — story skeletons.
│
├── 11-Characters/                  ◇ STRUCTURE
│     Specific reusable characters (PD + Polymath-original) w/ caveats.
│
├── 12-Quotes/                      ◇ TEXT SOURCES
│     PD & attributable quotations with verified provenance.
│
├── 13-Visual-Motifs/               ◈ VISUAL SOURCES
│     Recurring elements — skulls, moons, botanicals — composable parts.
│
│   ── APPLICATION LAYER (turning inputs into products) ──
│
├── 14-Trending-Categories/         ▲ MARKET
│     Market niches & trends — connects source material to what sells.
│
├── 15-Remix-Frameworks/            ▲ METHOD
│     Repeatable transformation methods → original, defensible work.
│
├── 16-Prompt-Templates/            ▲ AI TOOLING
│     Tested prompt scaffolds for AI image / video / writing.
│
├── 17-Design-Recipes/              ▲ PRODUCTION
│     Step-by-step formulas: source + palette + motif + prompt → product.
│
│   ── MAINTENANCE ──
│
├── 18-Yearly-Public-Domain-Updates/ ⟳ UPKEEP
│     Annual log of newly-public-domain works. Reviewed every January 1.
│
│   ── RISK & CONTROVERSY ──
│
└── 20-Controversial-Sources/        ⚠ RISK GUIDE
      Rights and brand-safety guide for politically, religiously, and culturally
      sensitive material with revenue potential: sacred texts (KJV-only rule,
      translation-rights trap), US government works (§ 105 free text vs.
      §§ 701/713 restricted seals), political content (right-of-publicity,
      trademark traps, platform-policy risk), comedian quotes (mostly avoid),
      and niche operating playbooks (faith, patriotic, political).
      Subfolders: sacred-texts/ · government-works/ · political-content/ · brand-safety/
```

---

## How the layers connect

```
        ┌─────────────────────────────────────────────┐
        │  01-Legal-Guidelines  (doctrine — governs    │
        │  the pd_status / risk_level of everything)    │
        └───────────────────────┬─────────────────────┘
                                 │ governs
                                 ▼
   ┌──────────────────────────────────────────────────────┐
   │  SOURCE MATERIAL                                       │
   │  03 Mythology · 04 Folklore · 05 Literature ·          │
   │  06 Historical-Art · 07 Historical-Design ·            │
   │  08 Color-Palettes · 09 Symbols · 10 Archetypes ·      │
   │  11 Characters · 12 Quotes · 13 Visual-Motifs          │
   │            (all cataloged in 02 Public-Domain-Library) │
   └───────────────────────┬──────────────────────────────┘
                            │ feeds
                            ▼
   ┌──────────────────────────────────────────────────────┐
   │  APPLICATION LAYER                                     │
   │  15 Remix-Frameworks  →  16 Prompt-Templates  →        │
   │  17 Design-Recipes        (validated against           │
   │                            14 Trending-Categories)     │
   └───────────────────────┬──────────────────────────────┘
                            │ produces
                            ▼
   ┌──────────────────────────────────────────────────────┐
   │  PRODUCTS                                              │
   │  POD · t-shirts · posters · children's books ·         │
   │  stories · podcasts · video · blog · social · merch    │
   │  (via AI image / video / writing pipelines)            │
   └──────────────────────────────────────────────────────┘
                            ▲
                            │ refreshed each Jan 1 by
   ┌──────────────────────────────────────────────────────┐
   │  18 Yearly-Public-Domain-Updates                       │
   └──────────────────────────────────────────────────────┘
```

**Reading the legend:**
- ▣ Doctrine — the rules everything obeys.
- ◆ Master catalog — the central hub.
- ◇ Narrative / structure / text sources — the story-side inputs.
- ◈ Visual sources — the image-side inputs.
- ▲ Application layer — methods, prompts, recipes, market fit.
- ⟳ Upkeep — keeps the library current.

---

## Within each section folder

Every section folder (02–17) follows the same internal shape (see [[DOC-STANDARDS]]):

```
<NN-Section>/
├── README.md          (optional) section landing page / overview
├── _template.md       entry skeleton for this section's type
├── _VERIFICATION.md   verification ledger for entries in this folder
├── <entry-slug>.md    one entry per file, kebab-case
├── <entry-slug>.md
└── ...
```

---

See [[README]] for the overview, [[METADATA-STANDARD]] for the schema, [[DATABASE-READINESS]] for ingestion, and [[DOC-STANDARDS]] for the writing rules.
