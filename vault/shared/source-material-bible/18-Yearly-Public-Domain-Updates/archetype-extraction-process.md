---
id: yearly-pd-archetype-extraction-process
type: sop
title: Archetype Extraction Process — New PD Works into Sections 10 and 11
applications: [pod, story, character, brand, ai-writing, ai-image]
risk_level: safe
tags: [public-domain, archetypes, characters, extraction, section-10, section-11, sop]
related: ["[[../10-Archetypes/README]]", "[[../11-characters/README]]", "[[verification-process]]", "[[categorization-process]]", "[[../01-Legal-Guidelines/copyright-vs-trademark-vs-likeness]]", "[[README]]"]
created: 2026-05-31
---

# Archetype Extraction Process — New PD Works into Sections 10 and 11

## Overview

This document defines the repeatable procedure for identifying and cataloguing character archetypes and standalone character entries from newly confirmed public-domain works. It feeds two sections of the Bible:

- **[[../10-Archetypes/README]]** — Section 10 holds universal archetypal patterns (Hero, Trickster, Sage, etc.) and their cultural expressions. New PD works provide additional examples and expressions of existing archetypes.
- **[[../11-characters/README]]** — Section 11 holds entries for specific characters who have sufficient standalone commercial and creative value to warrant their own entry separate from the primary work entry.

This process is run after [[verification-process]] confirms PD status and typically in parallel with [[categorization-process]].

---

## Inputs Required

- Confirmed PD work details (title, creator, year, medium, verified PD basis)
- Access to plot summary, character descriptions, and textual content from PD edition
- Primary catalogue entry from [[categorization-process]] (or underway)
- Existing archetype entries in [[../10-Archetypes/README]] for cross-linking

## Outputs Produced

- Archetype examples/expressions added to relevant files in section 10
- New character entry file in [[../11-characters/README]] (for qualifying characters)
- Cross-links between primary catalogue entry, archetype files, and character entries

---

## Procedure

### Step 1: Map the Work's Characters to Existing Archetypes

Review the work's characters and identify which established archetypal roles they occupy. Use the archetype files in [[../10-Archetypes/README]] as the reference taxonomy. The primary archetypes catalogued in section 10 include:

- Hero, Warrior, Outlaw, Explorer
- Sage, Oracle, Teacher, Inventor
- Caregiver, Guardian, Ruler, Monarch
- Trickster, Jester, Everyman
- Lover, Dreamer, Innocent
- Creator, Craftsman, Merchant, Magician

For each significant character in the work:

1. Identify the primary archetype they embody most strongly.
2. Note any secondary archetypes or hybrid roles (e.g., a Hero who operates primarily through Trickster means).
3. Note how the character expresses or subverts the archetype — subversions and novel expressions are often the most commercially interesting angles.

### Step 2: Add the Character as an Example to the Archetype File

For each archetype match, add a brief example entry to the relevant archetype file in section 10. The format is:

```markdown
### <Character Name> — *<Work Title>* (<Year>), <Creator>

**Archetype expression:** <How this character embodies or subverts the archetype in 2–3 sentences. What makes their version of this role distinct or memorable?>

**Key trait for reuse:** <The single most commercially reusable attribute — a specific behavior, visual signature, catchphrase, or story beat>

**PD status:** Copyright clear as of <year>, published <publication year>. See [[../02-Public-Domain-Library/<entry-file>]] (or [[../05-Literature/<entry-file>]]).
**Trademark note:** <State explicitly if the character name or visual identity is trademarked. If no active trademark found, state that too.>
```

A single work may contribute examples to multiple archetype files. Add to each applicable file.

### Step 3: Evaluate Whether the Character Warrants a Standalone Section 11 Entry

Not every character from a new PD work needs its own file in section 11. Create a standalone entry when the character meets most of the following criteria:

- **Commercial recognition**: The character is culturally well-known enough that their name or associated imagery has standalone market value beyond the original work
- **Visual distinctiveness**: The character has a distinctive visual identity (described in the text or from PD-era illustration) that is reusable in design
- **Multi-work presence**: The character appears across multiple works, adaptations, or periods
- **Archetypal clarity**: The character is a strong, clear expression of an archetype that benefits from extended treatment

If the character does not meet these criteria, the archetype-file example entry from Step 2 is sufficient. Note in the primary catalogue entry that archetype links were added.

### Step 4: Create the Section 11 Character Entry (if warranted)

If Step 3 determined a standalone character entry is warranted, create a new file in [[../11-characters/README]].

**File name:** `<kebab-character-name>.md` (e.g., `tarzan.md`, `zorro.md`, `phileas-fogg.md`)

**Critical legal fields to complete carefully:**

- `pd_status`: `public-domain` for the textual character as originally described; flag separately if any visual design has independent copyright
- `risk_notes`: This is the most important field. Name explicitly:
  - Any active trademarks on the character name (search USPTO TESS)
  - Any specific visual designs from later adaptations (film, animation, stage) that are NOT PD
  - Any right-of-publicity issues if based on a real person
  - The specific edition/work whose expression is PD, and what later expressions are NOT

**Body sections for a character entry:**

1. **Character Overview** — who the character is, the work(s) they appear in, PD basis stated plainly
2. **Archetype** — primary and secondary archetype roles; cross-link to section 10 files
3. **Canonical PD Appearance** — the specific text/edition that is PD; what that expression includes (physical description, personality, characteristic behaviors)
4. **What Is NOT Free** — explicit list of restricted adaptations (Disney, film studios, later trademark owners). Name the specific adaptations by title and year.
5. **Visual Motifs from PD Source** — described imagery from the PD text that an AI image prompt can use; these must be text-derived, not derived from any film or animation design
6. **Commercial Angles** — POD, character illustration, story use cases
7. **Trademark Status** — result of USPTO and relevant international trademark search; date of search
8. **Cross-Links** — links to primary work entry, archetype entries, any related characters

### Step 5: Check Trademark Status for All Character Entries

For every character being entered into section 11, a trademark check is mandatory before the entry is marked as ready for commercial use. This step mirrors Step 6 of [[verification-process]] but applied specifically to the character identity.

1. Search **USPTO TESS** for the character name in relevant trademark classes (Class 25 apparel, Class 16 paper/printing, Class 41 entertainment, Class 28 toys/games).
2. Search for the character name combined with common product phrases.
3. Record: trademark found / not found, owner if found, classes covered, expiry date if applicable.
4. If a trademark is active: set `risk_level: caution` in the entry frontmatter. Do not set `risk_level: safe` for any character with an active trademark.
5. Note: trademark rights can be renewed indefinitely and have no connection to copyright expiry. A character whose copyright has expired can be aggressively trademark-protected. See [[../01-Legal-Guidelines/copyright-vs-trademark-vs-likeness]].

### Step 6: Update Cross-Links

After creating or updating archetype and character entries:

1. In the **primary catalogue entry** (from [[categorization-process]]), add wikilinks to:
   - Each archetype file that received an example from this work
   - The character entry file if one was created

2. In the **archetype file**, confirm the cross-link back to the primary entry is present.

3. In the **character entry**, confirm cross-links to the primary work entry and to all relevant archetype files.

---

## Quality Standards

Every archetype addition or character entry must satisfy all of the following:

- [ ] Character mapped to primary archetype using section 10 taxonomy
- [ ] Archetype file(s) updated with example entry
- [ ] Standalone entry decision documented (warranted / not warranted)
- [ ] If standalone entry: trademark check completed and result recorded
- [ ] `risk_notes` field names specific restricted adaptations explicitly (not vague)
- [ ] Visual motifs described from PD text only — no film/animation design elements
- [ ] Cross-links created in all directions (primary entry → archetypes → character entry)

---

## Common Traps

**Trap: Describing a character's appearance based on a well-known film version.** The film adaptation's character design is typically separately copyrighted and often trademark-protected. Describe the character's appearance using only the PD text's own descriptions. If the text is not visually specific, the safe option is to describe the character's archetype, behavior, and symbolic role — not a specific physical appearance borrowed from a film.

**Trap: Assuming a character is fully free because the original work is PD.** "Tarzan" as a textual archetype (a man raised by apes in the jungle) is explorable. The specific Tarzan character name and many associated visual elements are trademarked by the Edgar Rice Burroughs estate. The copyright and trademark situations are entirely separate. Always run Step 5.

**Trap: Conflating archetype with character.** The Hero archetype is ancient and uncopyrightable. A specific Hero character from a specific PD work is PD. A specific Hero character from a modern copyrighted work is not. The section 10 archetype files hold the universal pattern; section 11 holds specific PD characters. Do not blend these.

---
*Part of the Polymath Source Material Bible — Section 18 Yearly Public Domain Updates. Not legal advice.*
