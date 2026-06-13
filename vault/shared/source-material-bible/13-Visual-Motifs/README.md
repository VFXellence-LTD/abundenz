# 13 — Visual Motif Library

## What this section is

The **Visual Motif Library** catalogues reusable *compositional motifs* — the recurring graphic structures that sit between raw symbols (a single skull, a single laurel leaf) and a finished layout (a complete poster, a t-shirt graphic, a book cover). A motif is a **pattern of arrangement**, not a subject. A laurel wreath is a motif; what you place inside it (a quote, a monogram, a skull) comes from other sections.

Think of motifs as the **grammar of design**: they tell you *how* elements relate spatially, what visual vocabulary repeats, and what mood the structure itself communicates before any content is added.

This library is deliberately **content-agnostic and source-agnostic**. Every motif here is a *generic compositional convention* in the public domain as an idea or technique — you cannot copyright "a badge shape" or "a sunburst." That makes this one of the safest sections in the Bible. The risk almost never lives in the motif; it lives in what you fill it with (a trademarked logo inside a badge, a copyrighted character inside a tarot frame). See [Legal stance](#legal-stance) below.

## How other sections use this

```
SYMBOLS (sec 06/07)  →  what goes inside the motif (skull, key, moth, anchor)
PALETTES (sec 11)    →  what colors the motif wears
ART MOVEMENTS (sec 09) → the period styling layered onto the motif
  ↓
VISUAL MOTIFS (this section) → the compositional container / arrangement
  ↓
DESIGN RECIPES (sec 14) → motif + symbol + palette + type, assembled into a named layout
  ↓
PROMPT TEMPLATES (sec 15) → the AI phrasing that generates the assembled piece
```

A design recipe typically reads: **"`[symbol]` rendered in `[art-movement]` style, arranged as a `[visual-motif]`, in `[palette]`, for `[application]`."** This section supplies the third slot.

## How AI generation uses this

Every entry contains an **AI Prompt Phrasing** block — the exact descriptive language that reliably evokes the motif in image models (Midjourney, SDXL, DALL·E, Flux, Ideogram). These phrases are the load-bearing payload of this section. They are written to be:

- **Composable** — drop them into a recipe alongside subject + style + palette tokens.
- **Model-agnostic** — plain descriptive English, no model-specific weights or `::` syntax baked in (those belong in section 15 prompt templates).
- **Disambiguating** — they steer the model toward the *structure* (e.g. "circular emblem with banner ribbon below") and away from accidental subject matter.

A generation agent should: pick a motif → lift its `ai_prompt_phrasing` → fuse with subject, style, palette → optionally append the motif's negative-prompt hints.

## Section-specific conventions

1. **One file per motif.** Each lives in `motifs/<kebab-name>.md` with full frontmatter (`type: visual-motif`).
2. **`visual_motifs` frontmatter field** carries the canonical motif keywords so downstream queries can match a recipe to a motif file.
3. **`pairs_with`** lists the *categories* and *palette families* a motif harmonizes with — this is the wiring other sections read to auto-suggest combinations.
4. **`applications`** uses the shared controlled vocabulary (pod, tshirt, poster, childrens-book, story, podcast, video, blog, social, merch, character, brand, ai-image, ai-video, ai-writing).
5. **"Where it shines"** is a required body heading — it states the surfaces (apparel / poster / book-cover / packaging / social) where the motif performs best and where it struggles.
6. Bodies use Obsidian `[[wikilinks]]` to related motifs and (when those sections exist) to symbols, palettes, and recipes.

## Legal stance

=== A COMPOSITIONAL MOTIF IS AN UNPROTECTABLE IDEA — THE RISK IS THE CONTENT YOU PUT IN IT ===

- **Layouts, arrangements, and graphic conventions are not copyrightable.** A badge shape, a laurel arc, a ribbon banner, a halftone texture, a sunburst — these are ideas/techniques, free for all. All motifs here are `pd_status: public-domain` *as compositional conventions*.
- **The trap is the fill.** A badge is safe; a badge containing the Harley-Davidson bar-and-shield, the Starbucks siren, or a sports-team crest is trademark infringement. A tarot frame is safe; the same frame wrapping the Rider–Waite–Smith *card artwork* is fine (that deck is PD in most markets) but wrapping a modern published deck's art is not. Every entry's `risk_notes` flags the specific fill-traps for that motif.
- **Specific famous *instances* can be protected even when the motif is generic.** The motif "monogram repeat pattern" is free; the *Louis Vuitton monogram* is a registered trademark. The motif "interlocking-rings emblem" is free; the *Olympic rings* are protected by special statute. Entries name these landmines explicitly.
- **Style ≠ specific work.** "Vintage botanical engraving style" is a technique and PD; tracing a specific in-copyright botanical illustration is not. "Constellation map" as a motif is PD; copying a specific modern star-chart's exact artistic rendering can infringe that rendering.

When in doubt the entry sets `risk_level: caution` and spells out the safe path in `risk_notes`. Conservative is correct.

## Index of motifs (17)

| # | Motif | File | Primary surfaces |
|---|-------|------|------------------|
| 01 | Badges & Crests | [[motifs/badges-and-crests]] | apparel, brand, merch |
| 02 | Laurels & Wreaths | [[motifs/laurels-and-wreaths]] | poster, apparel, brand |
| 03 | Banners & Ribbons | [[motifs/banners-and-ribbons]] | apparel, poster, social |
| 04 | Frames & Borders | [[motifs/frames-and-borders]] | poster, book-cover, social |
| 05 | Mandalas | [[motifs/mandalas]] | poster, apparel, coloring-book |
| 06 | Line-Art Animals | [[motifs/line-art-animals]] | apparel, poster, merch |
| 07 | Geometric Backdrops | [[motifs/geometric-backdrops]] | poster, social, brand |
| 08 | Vintage-Label Layouts | [[motifs/vintage-label-layouts]] | packaging, poster, merch |
| 09 | Halftone & Risograph Textures | [[motifs/halftone-and-risograph-textures]] | poster, apparel, social |
| 10 | Retro Sunbursts | [[motifs/retro-sunbursts]] | apparel, poster, packaging |
| 11 | Botanical Line-Drawings | [[motifs/botanical-line-drawings]] | book-cover, apparel, stationery |
| 12 | Constellation Maps | [[motifs/constellation-maps]] | poster, apparel, book-cover |
| 13 | Vintage-Engraving / Anatomical Style | [[motifs/vintage-engraving-anatomical]] | apparel, poster, book-cover |
| 14 | Tarot-Card Framing | [[motifs/tarot-card-framing]] | poster, apparel, book-cover |
| 15 | Stamp & Postmark | [[motifs/stamp-and-postmark]] | merch, social, packaging |
| 16 | Blueprint / Schematic | [[motifs/blueprint-schematic]] | poster, apparel, brand |
| 17 | Geometric Sacred / Linework Emblems | [[motifs/sacred-geometry-emblems]] | apparel, poster, brand |

See [[_template]] for the entry schema.
