---
id: prompt-character-generation
type: prompt-template
title: Character Generation — Original Ownable Character from PD Substrate
applications: [character, ai-image, story, brand, merch, pod]
model_targets: [gpt, claude, midjourney, sdxl, flux]
tags: [prompt-template, character, character-design, archetype, mythology, symbols, motifs, gpt, claude, midjourney, sdxl, flux]
related: ["[[shared/slot-resolution-protocol]]", "[[shared/negative-prompt-library]]", "[[01-Legal-Guidelines/README]]", "[[03-Mythology/README]]", "[[09-Symbols/README]]", "[[10-Archetypes/README]]", "[[11-characters/README]]", "[[13-Visual-Motifs/README]]"]
created: 2026-05-31
---

# Character Generation — Original Ownable Character from PD Substrate

## Purpose

Generates an original, trademark-clear character — visual design description, backstory, and voice — by drawing on the thematic and symbolic DNA of public-domain sources (myths, archetypes, symbols, motifs) without reproducing any specific copyrighted or trademarked character design or a real person's likeness. The output character is new and ownable by Polymath; the PD source supplies only the conceptual substrate.

Every slot in this template is chosen to ensure the generated character is original. The template explicitly blocks the routes that create IP problems: no franchise visual designs, no real-person likeness, no copy of a protected modern illustration style. These are encoded as hard negative-prompt entries in [[shared/negative-prompt-library]] and echoed in the Legal Pre-Flight block below. Defer to [[01-Legal-Guidelines/README]] for all edge cases.

## Slot Table

| Slot | Source section | Required? | What to put | Example fill (real entry) |
|---|---|---|---|---|
| `[ARCHETYPE]` | [[10-Archetypes]] | yes | The character's core personality pattern | `archetype-sage` → "seeks truth; fears deception; shadow: hoards knowledge" |
| `[PD_SUBSTRATE]` | [[03-Mythology]], [[04-Folklore]], or [[11-characters]] | yes | PD source the character draws thematic DNA from — NOT a copy | `myth-greek-athena` → "wisdom-and-strategy goddess, owl, aegis, patron of craft and civilization" |
| `[SYMBOLS]` | [[09-Symbols]] | optional | 1–2 symbols the character carries or is associated with | `astrological/owl-symbol` → "wisdom, night-sight, the liminal between seen and unseen" |
| `[MOTIF]` | [[13-Visual-Motifs]] | optional | A visual motif that shapes the character's design or costume | `motif-constellation-maps` → "faint star-map lines on cloak or skin; the characters' knowledge is mapped on them" |
| `[PALETTE]` | [[08-Color-Palettes]] | optional | The character's color identity | `palette-pharaohz-gold-lapis` → "lapis deep blue, pharaoh gold, papyrus cream" |
| `[CHARACTER_NAME]` | inline | yes | A new Z-named original character — never the PD source's name | "Aelyza / Velindra / Ozimahr" |
| `[SPECIES_FORM]` | inline | yes | Human / anthropomorphic animal / elemental / fantasy being | "human woman in her 60s / fox-headed anthropomorphic figure / stone elemental" |
| `[ERA_SETTING]` | inline | yes | Time and world setting for the visual design | "ancient Mediterranean fantasy / near-future city / timeless/placeless mythic realm" |
| `[FORMAT]` | inline | yes | Output format | "visual design description + backstory (400 words) / character sheet / AI image prompt only" |
| `[NEGATIVE]` | [[shared/negative-prompt-library]] + inline | yes | Hard exclusions | "no recognizable franchise character, no real person's likeness, no modern studio design" |

## Hard Rules (encoded from [[01-Legal-Guidelines/README]])

The following are non-negotiable and must appear in every generation request:

1. The generated character must be visually distinct from any named protected character. Do not describe a character who looks like a specific modern film, game, or comic character.
2. Do not instruct the model to render a real person's likeness, even partially.
3. The PD substrate (myth, archetype, literary character) supplies only thematic DNA — motivation, symbolic vocabulary, emotional register. It does not supply a copy of the source's appearance as depicted in any modern adaptation.
4. The character's name must be original (Z-naming convention).
5. If `[PD_SUBSTRATE]` entry has `risk_level: caution`, the character design must be demonstrably different from the famous associated visual (e.g. for Holmes: no deerstalker + pipe + inverness if creating a named character brand — use different iconography, or shift era/species).

## Base Prompt — Visual Design + Backstory (model-agnostic)

```
You are a character designer for an original IP property. Generate a new, ownable character.

Archetype substrate: [ARCHETYPE] — use this pattern's core motivation, fears, shadow, and visual motifs as the character's inner life. Do NOT copy any named fictional character.
PD thematic source: [PD_SUBSTRATE] — draw on its symbolic vocabulary (symbols, settings, themes) for this character's world and visual language. Do NOT reproduce the source's iconic modern visual design.
Symbol(s): [SYMBOLS] — incorporate these into the character's design or story.
Visual motif: [MOTIF] — texture, pattern, or compositional element in the design.
Color identity: [PALETTE].
Character name: [CHARACTER_NAME].
Species/form: [SPECIES_FORM].
Era/setting: [ERA_SETTING].

Deliver in format: [FORMAT].

For the visual design description, be specific enough for an AI image model to generate consistently:
- Body and proportions
- Clothing, armor, or covering — style, material, color, notable details
- Accessories, weapons, carried objects
- Facial features and expression
- Distinctive mark (scar, tattoo, symbol, eye color, etc.) that makes the character visually identifiable at a glance
- Overall silhouette in one sentence

For the backstory:
- Origin: where did they come from and what did it cost them?
- Core drive: what do they want and what are they willing to sacrifice for it?
- Shadow: what is the version of them that fails?
- World: one paragraph on the setting this character inhabits.

Negative (hard exclusion): [NEGATIVE].
```

## Base Prompt — AI Image Only

```
An original [SPECIES_FORM] character named [CHARACTER_NAME] in [ERA_SETTING] setting.
[ARCHETYPE] personality expressed through posture and expression.
Visual design: [PALETTE colors], [MOTIF applied to costume/environment], [SYMBOLS as character accessories or motifs].
[Specific clothing and accessory description from design step above].
Style: [pull from [[06-Historical-Art]] or specify: "editorial illustration / concept art / oil painting"].
Composition: [from [[shared/model-parameter-cheatsheet]]].
Mood: [inline].
Negative: no recognizable franchise character design, no real person's likeness, no modern studio-specific costume, no logo, no watermark. [NEGATIVE].
```

## Worked Examples

### Example 1 — Sage/Athena Substrate: Original Wisdom Figure (Full Character)

**Slots:**
- `[ARCHETYPE]` = `archetype-sage`
- `[PD_SUBSTRATE]` = `myth-greek-athena` → wisdom, strategy, the owl, the aegis-shield, patron of crafts and just war
- `[SYMBOLS]` = owl (wisdom, night-sight)
- `[MOTIF]` = `motif-constellation-maps` → faint star-map lines
- `[PALETTE]` = `palette-pharaohz-gold-lapis`
- `[CHARACTER_NAME]` = "Aelyza"
- `[SPECIES_FORM]` = "human woman, apparent age mid-40s"
- `[ERA_SETTING]` = "ancient Mediterranean fantasy, desert-and-sea world"
- `[FORMAT]` = "visual design description + backstory, 400 words"

**Full character brief:**

*Visual design:*
Aelyza is a tall, lean woman in her mid-forties with deep brown skin and close-cropped silver hair — greyed early, not from age but from a specific event in her past she does not discuss. Her eyes are amber-gold, slightly too reflective in low light. She wears a sleeveless indigo-dyed linen robe (lapis-deep blue, #1A3A6B) belted with a wide hammered-gold band (pharaoh gold, #D4AF37) at the hip. Over her left shoulder she carries a half-cloak in papyrus cream that is marked, on its inner face, with minute constellation-map stitching in gold thread — a record of every sky she has observed. On her right forearm: a bronze vambrace in the shape of an open owl wing, the feather-tips articulated so they click softly when she gestures. She carries no weapon. Her silhouette is deliberate and still — a person who has learned that the observer who does not move sees the most.

*Backstory:*
Aelyza was a cartographer of the sky for a city-state that no longer exists. When the city fell — through decisions she warned against and was overruled on — she walked out and kept walking. She has spent fifteen years since then traveling the archipelago, recording astronomical patterns that do not match the official star-tables maintained by the surviving powers. She knows something the authorities have suppressed. She is not yet certain what to do with it.

Her core drive is precision: she believes that almost every human catastrophe is the result of someone refusing to look at what was actually there. Her fear is that she is that person — that somewhere in her data she has already made the error she is trying to prevent.

Her shadow is the Sage's characteristic failure: she can see the shape of a problem with crystalline clarity and still watch it happen, because acting feels like contaminating the observation.

*AI image prompt (Midjourney):*
```
Aelyza, original character, tall lean woman mid-40s, deep brown skin, silver close-cropped hair, amber-gold reflective eyes, indigo-lapis linen robe #1A3A6B, hammered gold belt #D4AF37, papyrus cream cloak with inner constellation-map gold stitching, owl-wing bronze vambrace on right forearm, deliberate still posture, ancient Mediterranean fantasy setting, oil painting concept art, dramatic golden-hour sidelight, single point of focus, mythic gravitas --ar 2:3 --stylize 350 --v 6 --no recognizable franchise character, real person likeness, modern superhero, logo, watermark
```

**Legal note:** `myth-greek-athena` risk_level: **safe**. Aelyza is visually original — she does not wear a crested helmet, does not carry a shield, and does not resemble any specific modern Athena design (God of War, Percy Jackson, Smite). Owl vambrace references the classical symbol, not a franchise design. `palette-pharaohz-gold-lapis` risk_level: **safe**. `motif-constellation-maps` risk_level: **safe**.

---

### Example 2 — Hero/Arthurian Substrate: Original Knight (Concept Art, Children's Content)

**Slots:**
- `[ARCHETYPE]` = `archetype-hero`
- `[PD_SUBSTRATE]` = `pd-char-arthurian-characters` → chivalry, the quest, the sword as earned-not-given, knightly service
- `[SYMBOLS]` = none specified
- `[MOTIF]` = `motif-badges-and-crests` → original heraldic device, not a real coat of arms
- `[PALETTE]` = `palette-regaliz-jewel` → jewel-tone tri-tone: plum, emerald, cobalt, gold accent
- `[CHARACTER_NAME]` = "Zoren"
- `[SPECIES_FORM]` = "human boy, age approximately 12"
- `[ERA_SETTING]` = "fairy-tale medieval, friendly and bright for age 5–8 illustration"
- `[FORMAT]` = "visual design description + AI image prompt"

**Visual design:**
Zoren is a slight twelve-year-old boy with warm golden-brown skin, dark curly hair that escapes from under a too-large kettle helm, and an expression that reads — simultaneously — as determined and slightly over his head. He wears a cobalt-blue tabard (Regaliz cobalt, #1B3A8C) over a leather jack, with a plum-colored cloak (plum #4B1248) fastened at the collar by a brass clasp shaped like an open hand. His heraldic device — not a real coat of arms; an original design — is a silver stag mid-leap on a cobalt field. He carries a short sword on his left hip that is clearly too large for him, and a small leather notebook tucked into his belt. His silhouette reads: small kid, real determination, slightly absurd equipment scale.

**AI image prompt (DALL·E 3):**
```
Create a children's book illustration of Zoren, a twelve-year-old boy in friendly fairy-tale medieval armor. He has warm golden-brown skin and dark curly hair escaping from a too-large kettle helmet. He wears a cobalt-blue tabard with a silver stag heraldic device over a leather jack, a plum cloak, brass clasp. He carries a short sword slightly too large for him and a leather notebook at his belt. Bright, cheerful illustration style with jewel-tone colors — cobalt, plum, emerald, gold accents. Soft rounded linework suitable for a children's picture book. He stands at the edge of a dark forest, looking determined and slightly nervous. No text, no logos, no recognizable franchise character.
```

**Legal note:** `pd-char-arthurian-characters` risk_level: **safe** (medieval legend, all PD). Zoren is visually original — he does not wear any Disney *Sword in the Stone* design elements and is not Arthur. The original heraldic device (silver stag, invented) is not a real coat of arms. `palette-regaliz-jewel` risk_level: **safe**.

---

### Example 3 — Explorer/Odin Substrate: Anthropomorphic Raven Figure

**Slots:**
- `[ARCHETYPE]` = `archetype-explorer` (seeker pattern)
- `[PD_SUBSTRATE]` = `myth-norse-odin` → the ravens Huginn and Muninn, sacrifice-for-knowledge, the wanderer
- `[SYMBOLS]` = raven (memory, thought, the world-observer)
- `[MOTIF]` = `motif-geometric-backdrops` → angular Norse-adjacent geometric patterning
- `[PALETTE]` = `palette-valkyrz-cold-steel`
- `[CHARACTER_NAME]` = "Munivraz"
- `[SPECIES_FORM]` = "anthropomorphic raven, gender-neutral, adult"
- `[ERA_SETTING]` = "timeless mythic realm, used for stickers and enamel pins"
- `[FORMAT]` = "visual design description + AI image prompt"
- `[NEGATIVE]` = "no Marvel designs, no God of War, no Assassin's Creed, no extremist rune symbols"

**Visual design:**
Munivraz is an anthropomorphic raven figure: human-proportioned body, glossy blue-black feathers, a sharp beak, and ink-dark eyes that hold a faint iridescent gleam. They wear a long-coat in cold-steel grey (Valkyrz cold steel palette) with angular geometric trim at the cuffs and collar in silver-white. Their wings fold behind them like a cape. They carry a small brass-clasp journal and a worn compass. The silhouette is lean, cloaked, watchful — a figure who has seen every horizon and is already calculating the next one.

**AI image prompt (SDXL):**
```
Positive: (anthropomorphic raven character:1.3), human-proportioned body, glossy blue-black feathers, sharp beak, iridescent ink-dark eyes, cold-steel grey longcoat with angular silver geometric trim, wings folded like a cape, carries a brass-clasp journal and compass, timeless mythic setting, (Norse-geometric backdrop:0.9), Valkyrz cold steel palette, enamel-pin concept art style, clean linework, flat-design-adjacent illustration, centered portrait composition
Negative: Marvel designs, God of War, Assassin's Creed, extremist symbols, Valknut (avoid in isolation), real person likeness, low quality, blurry, watermark, text, logo
```

**Legal note:** `myth-norse-odin` risk_level: **caution**. Munivraz draws on Huginn/Muninn thematically but is visually original (anthropomorphic raven, not Odin). The Valknut and certain runes have been co-opted by extremist groups — do not use them in the design. `palette-valkyrz-cold-steel` risk_level: **safe**. No modern adaptation designs reproduced.

## Legal Pre-Flight

Sections this template touches: 03-Mythology, 04-Folklore, 09-Symbols, 10-Archetypes, 11-characters, 13-Visual-Motifs. Before publishing: confirm character is visually distinct from any named protected franchise character; confirm no real person's likeness is present; confirm the character name (Z-name) is original and not an existing trademark; check `[PD_SUBSTRATE]` entry's `risk_notes` for specific visual design warnings; confirm [[shared/negative-prompt-library]] IP-safety blocklist was applied; run [[shared/legal-preflight]]. Copyright in the generated character image belongs to the operator (check model-specific terms of service).

---
*Part of [[16-Prompt-Templates/README]]. Resolve slots per [[shared/slot-resolution-protocol]]. Defers to [[01-Legal-Guidelines/README]].*
