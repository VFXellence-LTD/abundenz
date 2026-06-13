---
id: yearly-pd-symbol-extraction-process
type: sop
title: Symbol and Motif Extraction Process — New PD Works into Sections 09 and 13
applications: [pod, tshirt, poster, ai-image, ai-video, brand, merch]
risk_level: safe
tags: [public-domain, symbols, motifs, extraction, section-09, section-13, sop, visual-motifs]
related: ["[[../09-Symbols/README]]", "[[../13-Visual-Motifs/README]]", "[[verification-process]]", "[[categorization-process]]", "[[../01-Legal-Guidelines/pd-source-vs-modern-adaptation]]", "[[README]]"]
created: 2026-05-31
---

# Symbol and Motif Extraction Process — New PD Works into Sections 09 and 13

## Overview

This document defines the repeatable procedure for identifying and cataloguing symbols, recurring motifs, and visually generatable imagery from newly confirmed public-domain works. It feeds two sections of the Bible:

- **[[../09-Symbols/README]]** — Section 09 holds symbolic elements with cultural, emotional, or thematic meaning. New PD works can provide additional examples and expressions of existing symbols, or surface new symbol categories.
- **[[../13-Visual-Motifs/README]]** — Section 13 holds visual motifs as described imagery that can be used directly in AI image generation prompts, design briefs, and art direction.

This process is run after [[verification-process]] confirms PD status and typically in parallel with [[categorization-process]], [[quote-extraction-process]], and [[archetype-extraction-process]].

---

## The Key Distinction: Symbols vs. Visual Motifs

These two sections serve different purposes and require different extraction logic.

**Section 09 — Symbols:** A symbol is a sign or image that carries layered meaning beyond its literal appearance. The rose as love and impermanence. The skull as mortality. The labyrinth as inner journey. Symbols are abstract, cross-cultural, and emotionally resonant. Section 09 entries describe the symbol's meaning system and its expressions across works and traditions.

**Section 13 — Visual Motifs:** A visual motif is a specific, describable, generatable image or compositional pattern. "A solitary figure standing at the edge of a cliff in dense fog." "An oil lamp casting orange light across a stone cell." "A vine growing through the broken window of an abandoned manor." These are concrete enough to pass directly to an AI image generation prompt. They are drawn from text descriptions, period illustration, and documented artistic conventions.

A single work often contributes to both: the lamp in the stone cell is a visual motif (section 13) and an expression of the "light in darkness" or "knowledge" symbol (section 09).

---

## Inputs Required

- Confirmed PD work details (title, creator, year, medium, verified PD basis)
- Access to the PD edition text and/or PD-era illustrations of the work
- Primary catalogue entry from [[categorization-process]] (or in progress)
- Existing symbol entries in [[../09-Symbols/README]] for cross-linking

## Outputs Produced

- New examples or expressions added to existing symbol files in section 09
- New visual motif entries added to [[../13-Visual-Motifs/README]]
- Cross-links from the primary catalogue entry to symbol and motif entries

---

## Procedure

### Step 1: Read for Symbolic Resonance

Review the work with attention to recurring images, objects, settings, or actions that carry meaning beyond their literal function. Ask:

- What objects, animals, or natural phenomena appear repeatedly or at emotionally significant moments?
- What locations carry an atmosphere or weight that goes beyond setting (a specific house, a forest, a threshold)?
- What actions are performed ritually or with apparent significance (a journey, a descent, a transformation)?
- What contrasts are used to create meaning (light/dark, above/below, inside/outside, order/chaos)?

Map these candidates to existing symbol categories in [[../09-Symbols/README]] where possible. Note any candidates that do not fit existing categories.

### Step 2: Check Against Existing Symbol Library

Before creating any new entries, check whether a symbol is already catalogued in section 09.

1. Read the section 09 index or README to review existing symbol files.
2. For each candidate symbol, determine:
   - **Existing symbol, new expression:** Add the new work as an example expression to the existing file
   - **New symbol category:** Flag for human review before creating a new symbol file; new symbol categories should be broad enough to be reused across multiple works

If adding an expression to an existing symbol file, use this format:

```markdown
### <Character Name or Scene> — *<Work Title>* (<Year>)

<2–3 sentences describing how this work expresses the symbol. What specific form does the symbol take? What emotional or thematic weight does it carry in the context of this work?>

**Visual expression:** <A single sentence describing the concrete visual image associated with this symbol in the work — generatable as an AI prompt component>
**Cross-reference:** [[../02-Public-Domain-Library/<entry-file>]] (or [[../05-Literature/<entry-file>]])
```

### Step 3: Extract Visual Motifs

A visual motif is extracted by finding the most generatable, concrete imagery in the work — scenes, objects, environments, and compositions that are:

- **Specific enough to generate:** Contains enough detail (light quality, mood, setting, objects) to serve as a useful prompt component
- **Culturally legible:** Evokes a recognizable aesthetic or emotional register
- **Period-accurate to the PD era:** Reflects the visual conventions of the 1920s–1930s or earlier (or whatever era produced the work), making it valuable for period-aesthetic AI image generation
- **Text-derived, not film-derived:** All imagery must come from the PD text or confirmed PD-era illustration, not from any film, animation, or modern adaptation

For each visual motif candidate:

1. Transcribe or paraphrase the relevant textual description from the PD edition.
2. Write a distilled, generatable prompt-ready description of the visual motif.
3. Note the period aesthetic (Art Deco, Victorian, Edwardian, 1920s American, etc.) to which this motif belongs.
4. Identify the emotional register (melancholy, wonder, dread, warmth, grandeur, etc.).

### Step 4: Write the Visual Motif Entry

Create or update the relevant file in [[../13-Visual-Motifs/README]]. If section 13 is organized by aesthetic period, subject category, or emotional register, file the entry in the appropriate location.

**Visual motif entry format:**

```markdown
## <Short Descriptive Name> — *<Work Title>* (<Year>)

**Description:** <A concrete, sensory description of the visual scene or object. Enough detail to generate an image. Avoid vague descriptors like "beautiful" or "interesting" — use specific nouns, light qualities, colors, textures, spatial relationships.>

**Example prompt component:** "<A condensed, AI-generation-ready version of the above — typically one sentence in present tense or noun-phrase form. E.g., 'A fog-shrouded stone bridge over a black river at night, gas lamps casting amber pools on the cobblestones.'>"

**Period aesthetic:** <Victorian / Edwardian / 1920s American / Art Deco / etc.>
**Emotional register:** <Melancholy / Wonder / Dread / Warmth / Grandeur / etc.>
**Source:** Text description from <title>, <PD edition year>. Chapter/section reference.
**Symbols expressed:** [[../09-Symbols/<symbol-file>]] (list related symbol files)
**Cross-reference:** [[../02-Public-Domain-Library/<entry-file>]] (or appropriate primary entry)
```

### Step 5: Verify Imagery Is Not Derived from a Film or Animation Design

This is the critical legal check specific to this process. A visual motif is only free for commercial use if it is derived from the PD text's own descriptions or from confirmed PD-era illustration — not from any film or adaptation design.

1. For each visual motif, confirm the description comes from the PD edition text or from a confirmed PD illustration (published in the PD year or earlier).
2. If the imagery is iconic primarily because of a specific film or animation adaptation (e.g., a character's signature costume from a film): this is the film's intellectual property, not the PD text's. Do not extract it as a usable visual motif. Note it in the primary catalogue entry's **Risks** section as a restricted visual element.
3. Describe visual motifs at the level of scene composition, atmosphere, and object — not at the level of a specific character's copyrighted costume or design.
4. See [[../01-Legal-Guidelines/pd-source-vs-modern-adaptation]] for the governing principle.

### Step 6: Update Cross-Links

After adding to sections 09 and 13:

1. In the **primary catalogue entry**, add wikilinks to:
   - Each symbol file that received a new expression from this work
   - Each visual motif entry created from this work

2. In the **symbol files**, confirm cross-links back to the primary entry are present.

3. In the **visual motif entries**, confirm cross-links to the primary work entry and to related symbol files are present.

---

## Quality Standards

Every symbol addition or visual motif entry must satisfy all of the following:

- [ ] Symbol mapped to existing section 09 taxonomy or flagged for new category review
- [ ] Visual motif described using concrete, generatable language
- [ ] Imagery verified as text-derived or PD-illustration-derived (not film-derived)
- [ ] Period aesthetic and emotional register identified
- [ ] Prompt-ready component written
- [ ] Source reference included (work, edition, chapter/section)
- [ ] Cross-links created in all directions

---

## Common Traps

**Trap: Describing a costume or character appearance that originates from a film, not the text.** Sherlock Holmes's deerstalker cap and calabash pipe are inventions of the Strand Magazine illustrators and later theatrical tradition — they appear nowhere in Doyle's text. Describing the "classic Holmes look" as a reusable visual motif references an illustration tradition, some of which may be PD, but the deerstalker is now also a trademarked brand element. Trace every visual claim to its actual textual or illustrative source.

**Trap: Being too vague to be generatable.** "A dark and atmospheric interior" is not a useful visual motif. "A low-ceilinged Victorian study lit by a single gas lamp, bookshelves floor to ceiling, a leather armchair angled toward the fire, papers strewn across an oak writing desk" is a usable prompt component. Specificity is the value.

**Trap: Conflating a symbol with a visual motif.** The concept of "the labyrinth" as a symbol of inner journey is a section 09 entry. "Stone walls carved with geometric spirals, torch-lit, with a dark passage visible at the far end" is a section 13 visual motif. Extract each to the correct section.

---
*Part of the Polymath Source Material Bible — Section 18 Yearly Public Domain Updates. Not legal advice.*
