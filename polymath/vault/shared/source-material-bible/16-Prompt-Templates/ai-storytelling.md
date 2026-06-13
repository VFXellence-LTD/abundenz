---
id: prompt-ai-storytelling
type: prompt-template
title: AI Storytelling — Narrative Generation from Archetype + PD Source
applications: [story, ai-writing, podcast, brand]
model_targets: [gpt, claude]
tags: [prompt-template, ai-storytelling, narrative, archetype, mythology, folklore, literature, gpt, claude]
related: ["[[shared/slot-resolution-protocol]]", "[[01-Legal-Guidelines/README]]", "[[03-Mythology/README]]", "[[04-Folklore/README]]", "[[05-Literature/README]]", "[[10-Archetypes/README]]", "[[11-characters/README]]", "[[12-Quotes/README]]"]
created: 2026-05-31
---

# AI Storytelling — Narrative Generation from Archetype + PD Source

## Purpose

Generates complete story seeds, short narrative outlines, and scene-level drafts by combining an archetype from [[10-Archetypes]] with a public-domain source (myth, folklore, or literary work), then running that combination through a structured beat template. The output is an original story — not a retelling of the source — that inherits the thematic DNA of the PD material while producing new, ownable content. Resolve all slots per [[shared/slot-resolution-protocol]] before use; the legal status of every PD source slot rides along into the output.

## Slot Table

| Slot | Source section | Required? | What to put | Example fill (real entry) |
|---|---|---|---|---|
| `[ARCHETYPE]` | [[10-Archetypes]] | yes | The protagonist pattern — drives motivation, voice, arc | `archetype-sage` → "seeks truth and clarity; fears being deceived; shadow: hoards knowledge" |
| `[SOURCE]` | [[03-Mythology]], [[04-Folklore]], or [[05-Literature]] | yes | The PD work providing the world/myth substrate | `myth-greek-athena` → "wisdom goddess, strategic war, patronage of the just, the owl as symbol" |
| `[SECONDARY_ARCHETYPE]` | [[10-Archetypes]] | optional | Antagonist or mentor pattern | `archetype-ruler` → "controls, commands, demands order; shadow: tyranny" |
| `[SECONDARY_CHARACTER]` | [[11-characters]] | optional | A named PD character used as direct inspiration (not copy) | `pd-char-arthurian-characters` → "Merlin: wizard-mentor, keeper of secrets, sacrifices agency for the kingdom" |
| `[QUOTE]` | [[12-Quotes]] | optional | Epigraph or character line drawn from PD text | `quote-wisdom-collection Q01` → *"The unexamined life is not worth living."* |
| `[SETTING_TONE]` | inline | yes | Time, place, genre register | "near-future city / medieval forest / contemporary city with mythic undertow / surreal dreamscape" |
| `[FORMAT]` | inline | yes | Output format | "story seed (200 words) / short-story outline (8 beats) / opening scene (400 words) / children's-book structure (12 pages)" |
| `[ORIGINAL_CHARACTER_NAME]` | inline | yes | A new, original Z-named protagonist — NOT the PD character's name | "Aelyza / Velindra / Ozimahr" — follow Z-naming convention |

## Base Prompt (model-agnostic)

```
You are a story development assistant for an original work.

Protagonist pattern: [ARCHETYPE] — core motivation, core fear, shadow aspect.
World/myth substrate: [SOURCE] — use the themes, symbols, and emotional register of this PD source as substrate, but generate an original story that does not retell or reproduce it.
Antagonist/mentor pattern (if provided): [SECONDARY_ARCHETYPE].
Inspired by (do not copy): [SECONDARY_CHARACTER] — draw on the archetype function this character serves, not their specific PD plot or appearance.
Setting and tone: [SETTING_TONE].
Epigraph (optional): [QUOTE].
Original protagonist name: [ORIGINAL_CHARACTER_NAME] — this is NOT the PD character; it is an original creation who occupies a similar archetype role.

Generate in format: [FORMAT].

Beat structure to follow (adapt to format length):
1. ORDINARY WORLD — protagonist in their element; establish core desire and flaw.
2. CALL TO ADVENTURE — inciting disruption tied to [SOURCE] themes.
3. REFUSAL / ACCEPTANCE — internal conflict that reflects [ARCHETYPE] shadow.
4. CROSSING THE THRESHOLD — commitment to the journey.
5. TESTS & ALLIES — encounters shaped by [SOURCE] symbolic vocabulary.
6. ORDEAL — the midpoint crisis; confrontation with the shadow.
7. REVELATION — what the protagonist now understands that they could not see before.
8. RESOLUTION — the world changed, the protagonist changed, the theme landed.

Do not: reproduce copyrighted text verbatim; name the original PD character as if they are the protagonist; imply the story is an authorized continuation of any franchise.
```

## Worked Examples

### Example 1 — Sage Protagonist, Athena Substrate: Short Story Outline

**Slots:**
- `[ARCHETYPE]` = `archetype-sage`
- `[SOURCE]` = `myth-greek-athena`
- `[SECONDARY_ARCHETYPE]` = `archetype-ruler`
- `[SETTING_TONE]` = "contemporary city with mythic undertow, slightly magical-realist"
- `[FORMAT]` = "short-story outline, 8 beats, 300 words"
- `[ORIGINAL_CHARACTER_NAME]` = "Aelyz"
- `[QUOTE]` = `quote-wisdom-collection Q01` → *"The unexamined life is not worth living."*

**Full prompt to model:**
```
You are a story development assistant for an original work.

Protagonist pattern: The Sage (archetype-sage) — seeks truth and clarity; fears being deceived or ignorant; shadow: hoards knowledge as superiority, retreats into analysis and refuses to act.

World/myth substrate: Athena (myth-greek-athena) — use the thematic register of the wisdom-and-strategy goddess: the owl as sight in darkness, the shield that transforms (the aegis), the idea that wisdom without action fails the city.

Antagonist pattern: The Ruler (archetype-ruler) — demands order and obedience; shadow: tyranny, crushing the thing it claims to protect.

Setting: contemporary city with mythic undertow — a slightly magical-realist present-day metropolis where symbols occasionally manifest literally.

Original protagonist name: Aelyz. She is NOT Athena; she is an original character who occupies the wise-strategist role.

Epigraph: "The unexamined life is not worth living." — Socrates (public domain, Jowett translation).

Generate: short-story outline, 8 beats, approximately 300 words.
```

**Output (as generated):**
> **Outline: "The Weight of the Owl"**
>
> *"The unexamined life is not worth living." — Socrates*
>
> 1. **ORDINARY WORLD.** Aelyz, municipal archivist in a city where old symbols occasionally appear in the margins of new documents, lives by analysis. She knows everything about the city's past and has used that knowledge to stay safely uninvolved.
> 2. **CALL.** The owl she has kept since childhood begins delivering small objects: a cracked lens, a torn court document, a key to a building that shouldn't exist.
> 3. **REFUSAL.** She catalogs the objects, classifies the phenomenon, and declines to act. This is her shadow: knowledge as a substitute for commitment.
> 4. **THRESHOLD.** The building the key opens contains evidence that the city administrator — a Ruler-archetype figure — has been falsifying the archive Aelyz maintains. Her entire professional existence is built on manipulated records.
> 5. **TESTS.** She tries to expose the falsification through proper channels; each is blocked. The Ruler controls the systems of order. The city's patterns — its street names, its institutional symbols — begin echoing the mythic substrate: shields, owls, olive branches appearing in unexpected places.
> 6. **ORDEAL.** Aelyz is given the choice to suppress what she found, keep her position, and remain safe. Her shadow whispers: *just document it for later.* The owl drops the cracked lens at her feet for the second time.
> 7. **REVELATION.** The owl sees in darkness not because it hoards light, but because it commits to looking. Wisdom that never lands changes nothing.
> 8. **RESOLUTION.** Aelyz publishes the falsified records to the public network — not through a system the Ruler controls. She loses the archive position. The city begins to correct its own records.

**Legal note:** `myth-greek-athena` risk_level: **safe** (ancient myth). `archetype-sage` and `archetype-ruler` risk_level: **safe** (ideas, not copyrightable). `quote-wisdom-collection Q01` is `pd_verified: true`. Protagonist Aelyz is entirely original; the story does not reproduce Athena's myth and does not invoke any modern franchise.

---

### Example 2 — Hero Protagonist, Arthurian Substrate: Children's Book Structure

**Slots:**
- `[ARCHETYPE]` = `archetype-hero`
- `[SOURCE]` = `pd-char-arthurian-characters` → Arthurian legend substrate (Malory, fully PD)
- `[SECONDARY_CHARACTER]` = `pd-char-arthurian-characters` → Merlin as wizard-mentor archetype function
- `[SETTING_TONE]` = "forest-and-castle, fairy-tale register, age 5–8"
- `[FORMAT]` = "children's book structure, 12 pages"
- `[ORIGINAL_CHARACTER_NAME]` = "Zoren"

**Full prompt to model:**
```
Protagonist pattern: The Hero (archetype-hero) — a child who proves their worth by facing something larger than themselves; shadow: impulsive, overestimates ability.

World/myth substrate: Arthurian legend (pd-char-arthurian-characters, Malory/Tennyson, fully public domain) — use chivalry, the quest, the magical forest, the wise mentor, and the sword as earned-not-given motifs.

Inspired by (do not copy): Merlin — draw on the wizard-mentor archetype function: a figure who guides but does not act for the hero. Do not reproduce T.H. White's specific characterization.

Setting: forest-and-castle fairy-tale world, age 5–8 reading level.

Original protagonist: Zoren, a young stable-hand, NOT King Arthur.

Generate: children's book structure, 12 pages, brief beat per page, suggested illustration note.
```

**Outline (abbreviated):**
> Pages 1–2: Zoren tends the horses in a kingdom where no one has earned the right to ride the great silver horse. Page 3: A strange old crow speaks. Pages 4–5: The forest quest begins — Zoren must find what the kingdom lost. Pages 6–7: Two tests, both failed the first time. Pages 8–9: The mentor (a wandering old glassblower) refuses to solve the problem; only shows Zoren what they already carry. Pages 10–11: The silver horse chooses Zoren — not because Zoren is strongest, but because Zoren stopped pretending to be. Page 12: Home, changed.

**Legal note:** `pd-char-arthurian-characters` risk_level: **safe** (medieval legend, Malory 1485, all PD). Do NOT copy T.H. White's *The Once and Future King* characterizations (still in copyright) or Disney's *The Sword in the Stone* (1963) designs. Zoren is original.

---

### Example 3 — Explorer Protagonist, Norse Odin Substrate: Story Seed

**Slots:**
- `[ARCHETYPE]` = `archetype-explorer` (uses the Explorer pattern — pull from [[10-Archetypes/explorer]])
- `[SOURCE]` = `myth-norse-odin` → sacrifice-for-wisdom, the seeker who gives an eye
- `[SETTING_TONE]` = "dark adult fantasy, mythic weight, literary register"
- `[FORMAT]` = "story seed, 200 words"
- `[ORIGINAL_CHARACTER_NAME]` = "Vedroz"

**Story seed output prompt:**
```
Protagonist: Explorer archetype — driven to see beyond the edge of the known, defined by the need to discover, shadow: addiction to seeking, inability to stop and live with what has been found.

Source substrate: Odin (myth-norse-odin) — sacrifice-for-wisdom motif: knowledge has a price; what you give up permanently changes what you can see. Use the raven/eye/world-tree thematic cluster.

Setting: dark adult fantasy with mythic weight.

Original protagonist: Vedroz, a cartographer. NOT Odin.

Generate: story seed, 200 words.
```

**Legal note:** `myth-norse-odin` risk_level: **caution** — mythological Odin is PD; avoid any modern design (Marvel, God of War, Vikings TV). Do not use Odin-associated rune arrangements that have been appropriated by hate groups. Vedroz is original.

## Legal Pre-Flight

Sections this template touches: 03-Mythology, 04-Folklore, 05-Literature, 10-Archetypes, 11-characters, 12-Quotes. Before publishing: verify every `[SOURCE]` entry is tagged `pd_status: public-domain`; confirm no verbatim reproduction of source text without attribution; ensure protagonist is an original character using a Z-name, not the PD character's name; check `[SECONDARY_CHARACTER]` entry's `risk_notes` for any estate or trademark concern; run [[shared/legal-preflight]].

---
*Part of [[16-Prompt-Templates/README]]. Resolve slots per [[shared/slot-resolution-protocol]]. Defers to [[01-Legal-Guidelines/README]].*
