---
id: yearly-pd-categorization-process
type: sop
title: Categorization Process — Routing Verified PD Works to Bible Sections
applications: [pod, story, tshirt, poster, childrens-book, merch, character, brand, ai-image, ai-writing]
risk_level: safe
tags: [public-domain, categorization, routing, workflow, sop, bible-sections]
related: ["[[../02-Public-Domain-Library/README]]", "[[../02-Public-Domain-Library/_template]]", "[[../03-Mythology/README]]", "[[../04-Folklore/README]]", "[[../05-Literature/README]]", "[[../11-characters/README]]", "[[verification-process]]", "[[intake-workflow]]", "[[README]]"]
created: 2026-05-31
---

# Categorization Process — Routing Verified Works to Bible Sections

## Overview

Once a work has been confirmed as public domain through [[verification-process]], it must be routed into the correct section(s) of this Bible and a catalogue entry must be created. This document defines the routing logic and the procedure for creating entries that follow the [[../02-Public-Domain-Library/_template]] standard.

Every verified work receives at minimum one entry in section 02 (Public Domain Library). Additional section entries or cross-links are created based on the work's content. Extraction processes (quotes, archetypes, symbols) are run in parallel and cross-linked into the primary entry.

---

## Routing Rules

### Primary Section Assignment

Each work belongs to exactly **one primary section**, which hosts the full catalogue entry created from the [[../02-Public-Domain-Library/_template]].

| Work Type | Primary Section | Notes |
|---|---|---|
| Novel, novella, short story, poem, play, essay | [[../05-Literature/README]] | Use medium-specific subfolder if present |
| Mythological text, epic, theological narrative | [[../03-Mythology/README]] | Must have clear mythological/religious source tradition |
| Folk tale, fairy tale, legend, fable | [[../04-Folklore/README]] | Compiled folk collections also go here |
| Visual artwork, illustration, painting, photograph | [[../06-Historical-Art/README]] | For works whose primary value is the visual image |
| Design artifact, decorative object, typeface, poster | [[../07-Historical-Design/README]] | Pattern, ornament, and applied design objects |
| Musical composition (sheet music / lyrics) | [[../05-Literature/README]] | Use a `music` subfolder or tag; note: recording rights are separate |
| Film, animation | [[../02-Public-Domain-Library/README]] | In the root 02 library; flag visual design carefully |
| Character (appearing across multiple works) | [[../11-characters/README]] | Create separate character entry if character has standalone value |

When a work could plausibly fit two categories (e.g., a mythological novel like *Ulysses* influenced by mythology but categorized as literature), assign to the category that best describes its primary creative form and add a cross-link to the secondary category.

### Secondary Section Cross-Links

In addition to the primary entry, add cross-link references in the following sections if the work qualifies:

| Condition | Add Cross-Link in |
|---|---|
| Work contains memorable quotable text | [[../12-Quotes/README]] — after running [[quote-extraction-process]] |
| Work contains distinct, reusable character archetypes | [[../10-Archetypes/README]] — after running [[archetype-extraction-process]] |
| Work contains notable symbols or repeating motifs | [[../09-Symbols/README]] — after running [[symbol-extraction-process]] |
| Work's visual style is period-specific and instructive | [[../13-Visual-Motifs/README]] |
| Work has strong POD or commercial angle | [[../14-Trending-Categories/README]] — flag for trend scoring |

---

## Entry Creation Procedure

### Inputs Required
- Verified work details: title, creator, year, medium, PD basis, sources consulted (from [[verification-process]])
- Trend priority score (from [[trend-analysis-process]] if already run, otherwise mark as unscored)
- Outputs from extraction processes (quotes, archetypes, symbols) if completed in parallel

### Outputs Produced
- One primary catalogue entry file created in the appropriate section
- Cross-link notes in secondary sections (may be stubs linking to the primary entry)
- `related` frontmatter field in the primary entry linking to extraction outputs

---

### Step 1: Identify the Primary Section

1. Determine the work's primary creative form using the routing table above.
2. Confirm the section folder exists. If it does not, flag for human review before creating new section structure.
3. Identify the correct subfolder within the section if subfolders exist (e.g., `greek-roman/` within Mythology, `egyptian/` within Mythology).

### Step 2: Name the Entry File

Follow the existing naming convention in the target section. The general pattern is:

```
<kebab-title>.md
```

For example: `the-great-gatsby.md`, `sherlock-holmes-early-canon.md`. Check existing entries in the target section to match local convention.

### Step 3: Populate the Frontmatter

Use the [[../02-Public-Domain-Library/_template]] frontmatter fields exactly. The critical fields are:

- `id`: Use the pattern `pd-<medium>-<kebab-title>` (e.g., `pd-novel-the-great-gatsby`)
- `type`: `source-work`
- `pd_status`: `public-domain` (for confirmed works)
- `pd_basis`: Write a plain-language statement — e.g., "US: published 1930, 95-year term expired as of January 1, 2026"
- `verified`: `true`
- `risk_level`: Use `safe` only if trademark and right-of-publicity checks were both clear. Use `caution` if any trademark concern was found.
- `risk_notes`: **This is the most important field.** Name the specific restricted adaptations, active trademarks, restricted visual designs, or caution areas. Do not leave blank if any concern was found.

### Step 4: Write the Body

Follow the template section headings in order:
1. Overview — factual description, PD basis, most important legal caveat
2. Themes — reusable thematic elements
3. Symbols — recurring symbolic imagery
4. Character archetypes — roles and their archetype names; note if the visual design is restricted separately
5. Visual motifs — generatable imagery descriptions for AI image prompts
6. Reusable concepts — ideas and structures (uncopyrightable)
7. Inspirational quotes — from PD edition only; note edition provenance
8. Design opportunities
9. Story opportunities
10. POD opportunities
11. Risks — copyright layers, adaptation traps, trademarks, right of publicity
12. Notes — edition recommendations, source URL, cross-links, intake year

For the **Risks** section, always explicitly name:
- The specific film/animation/stage adaptations whose visual designs are NOT free (e.g., a Disney adaptation, a specific studio version)
- Any live character trademarks
- Any modern editions whose translations or illustrations are separately protected

### Step 5: Populate Related Links

In the `related` frontmatter field, include wikilinks to:
- The primary section README
- Any cross-linked secondary sections
- Any extraction output entries (quotes, archetypes, symbols) created from this work
- The `[[../01-Legal-Guidelines/pd-source-vs-modern-adaptation]]` doc if the work has significant adaptation trap risk

### Step 6: Create Secondary Cross-Links

For each secondary section that applies, either:
- Add a brief reference entry in the secondary section linking back to the primary entry, OR
- Simply note the cross-link in the primary entry's `related` field and in the secondary section's README or `_VERIFICATION.md` index if one exists

Do not duplicate full content in secondary sections. The primary entry holds the canonical record; secondary sections hold cross-references.

### Step 7: Note Intake Provenance

In the entry's **Notes** section, record:
- `Intake year: YYYY` — the year this work entered the Bible through section 18
- The source(s) used for verification
- Any open questions or items that were marked caution during verification and later resolved

This creates an audit trail linking back to the [[intake-workflow]] log.

---

## Routing Decision Tree (Quick Reference)

```
Is the work verified PD? 
  → NO: Stop. Do not catalogue. Return to [[verification-process]].
  → YES: continue

Primary creative form?
  → Fiction / poetry / drama / essays  →  [[../05-Literature/README]]
  → Mythology / epic / religious text   →  [[../03-Mythology/README]]
  → Folk tale / fable / legend          →  [[../04-Folklore/README]]
  → Visual artwork / illustration       →  [[../06-Historical-Art/README]]
  → Design / decorative object          →  [[../07-Historical-Design/README]]
  → Film / animation                    →  [[../02-Public-Domain-Library/README]]
  → Character (standalone value)        →  [[../11-characters/README]]

Also route to (if applicable):
  → Quotable text present?              →  [[quote-extraction-process]] → [[../12-Quotes/README]]
  → Character archetypes present?       →  [[archetype-extraction-process]] → [[../10-Archetypes/README]]
  → Symbols / motifs present?           →  [[symbol-extraction-process]] → [[../09-Symbols/README]]
  → Commercial priority high?           →  [[trend-analysis-process]] → [[../14-Trending-Categories/README]]
```

---
*Part of the Polymath Source Material Bible — Section 18 Yearly Public Domain Updates. Not legal advice.*
