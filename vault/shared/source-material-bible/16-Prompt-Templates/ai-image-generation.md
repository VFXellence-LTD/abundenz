---
id: prompt-ai-image-generation
type: prompt-template
title: AI Image Generation — Universal PD Art Style Template
applications: [ai-image, merch, pod, poster, brand]
model_targets: [midjourney, sdxl, flux, dalle]
tags: [prompt-template, ai-image, midjourney, sdxl, flux, dalle, art-style, character, mythology, motif, palette]
related: ["[[shared/slot-resolution-protocol]]", "[[shared/model-parameter-cheatsheet]]", "[[shared/negative-prompt-library]]", "[[01-Legal-Guidelines/README]]", "[[06-Historical-Art/README]]", "[[08-Color-Palettes/README]]", "[[11-characters/README]]", "[[13-Visual-Motifs/README]]"]
created: 2026-05-31
---

# AI Image Generation — Universal PD Art Style Template

## Purpose

Generates a single image prompt for any AI image model by combining a subject (from [[11-characters]] or [[03-Mythology]]), a historical art-movement style (from [[06-Historical-Art]]), a decorative motif (from [[13-Visual-Motifs]]), a color palette (from [[08-Color-Palettes]]), composition framing, medium, and model-specific parameters. The assembled prompt inherits the legal status of every slot it draws from. Run the [[shared/slot-resolution-protocol]] before use; run [[shared/legal-preflight]] before publishing.

## Slot Table

| Slot | Source section | Required? | What to put | Example fill (real entry) |
|---|---|---|---|---|
| `[SUBJECT]` | [[11-characters]] or [[03-Mythology]] or [[04-Folklore]] | yes | The primary depicted figure or scene | `myth-greek-athena` → "armored goddess of wisdom, crested helmet, owl companion, spear and shield" |
| `[STYLE]` | [[06-Historical-Art]] (one `art-movement`) | yes | The visual art tradition to render in | `art-greek-roman` → "classical marble sculpture, contrapposto, idealized anatomy, white stone" |
| `[MOTIF]` | [[13-Visual-Motifs]] | optional | A composable decorative frame or background element | `motif-laurels-and-wreaths` → "twin laurel branches arcing around the central figure, leafy garland border" |
| `[PALETTE]` | [[08-Color-Palettes]] (one entry) | optional | The color system governing the output | `palette-pharaohz-gold-lapis` → "deep lapis-lazuli blue #1A3A6B, pharaoh gold #D4AF37, faience teal accent, papyrus cream background" |
| `[COMPOSITION]` | [[shared/model-parameter-cheatsheet]] or inline | yes | Framing, layout, crop | "centered symmetrical full-body portrait, low horizon, temple backdrop" |
| `[MEDIUM]` | inline | yes | Render medium / surface texture | "oil painting on canvas / vector illustration / marble bas-relief / risograph print" |
| `[MOOD]` | inline | optional | Emotional register and lighting | "reverent, golden-hour backlighting, mythic gravitas" |
| `[NEGATIVE]` | [[shared/negative-prompt-library]] | yes | Things to exclude | "modern superhero costume, photorealism, NSFW, logo, watermark, text" |
| `[PARAMS]` | [[shared/model-parameter-cheatsheet]] | model-specific | Model flags appended after prompt | `--ar 2:3 --stylize 300 --v 6` |

## Base Prompt (model-agnostic)

```
[SUBJECT], depicted in the style of [STYLE], [MEDIUM],
framed by [MOTIF], rendered in [PALETTE] colors,
[COMPOSITION], [MOOD].
No [NEGATIVE].
```

### Expanded base (for complex subjects)

```
A [MEDIUM] depiction of [SUBJECT].
Visual style: [STYLE] — describe style's defining features here.
Composition: [COMPOSITION].
Color: [PALETTE] — list hex values or descriptors.
Decorative elements: [MOTIF].
Lighting and mood: [MOOD].
Exclude from image: [NEGATIVE].
```

## Model Notes

**Midjourney (v6+):** Append all flags at end. Keep prompt under ~60 words before flags. Midjourney responds best to comma-separated style descriptors; list art-movement adjectives first, then subject, then medium. Use `--no` for negatives rather than embedding them in the main string.

```
[SUBJECT], [STYLE adjectives], [MEDIUM], [MOTIF], [PALETTE descriptors], [COMPOSITION], [MOOD] --ar [ratio] --stylize [150-500] --v 6 --no [NEGATIVE list]
```

**SDXL / ComfyUI / Automatic1111:** Use weighted token syntax for key elements. Split into positive and negative prompts. Keep critical style tokens near the front. Apply LoRA for specific art movements if available.

```
Positive: (STYLE keywords:1.3), [SUBJECT], [MEDIUM], (MOTIF:0.9), [PALETTE], [COMPOSITION], [MOOD]
Negative: [NEGATIVE], lowres, bad anatomy, blurry
```

**DALL·E 3:** Write as natural English sentences. DALL·E 3 follows structured prose more reliably than keyword lists. Do not use Midjourney-style flags.

```
Create a [MEDIUM] illustration of [SUBJECT] in the style of [STYLE]. [COMPOSITION]. [MOOD]. Use a palette of [PALETTE]. Decorate with [MOTIF]. Do not include [NEGATIVE].
```

**Flux (dev / schnell):** Flux responds to detailed natural-language descriptions. Be explicit about colors using hex or descriptive names. Flux handles long, precise prompts well and rarely needs weighting syntax.

```
[SUBJECT]. Style: [STYLE] with these defining characteristics: [list]. Medium: [MEDIUM]. Layout: [COMPOSITION]. Colors: [PALETTE — be specific]. Decorative motif: [MOTIF]. Atmosphere: [MOOD]. Avoid: [NEGATIVE].
```

## Worked Examples

### Example 1 — Athena in Classical Style with Pharaoh Palette

**Slots resolved:**
- `[SUBJECT]` = `myth-greek-athena` → "Athena, goddess of wisdom and strategy: full-body, crested Corinthian helmet, aegis breastplate, owl perched on her raised forearm, olive branch in the other hand"
- `[STYLE]` = `art-greek-roman` → "Classical Greek marble sculpture, idealized contrapposto stance, serene proportioned face, draped fabric in deep parallel folds, temple column background"
- `[MOTIF]` = `motif-laurels-and-wreaths` → "twin laurel branches arcing around the composition, full wreath framing at the base"
- `[PALETTE]` = `palette-pharaohz-gold-lapis` → "deep lapis-lazuli blue (#1A3A6B) ground, pharaoh gold (#D4AF37) on borders and symbol details, faience teal (#0E7C7B) accent, papyrus cream (#F2E6C9) for the marble figure"
- `[COMPOSITION]` = "centered, symmetrical, full-body portrait, low-angle heroic perspective"
- `[MEDIUM]` = "digital oil painting, museum-quality finish"
- `[MOOD]` = "reverent, golden-hour backlighting, mythic gravitas"

**Midjourney prompt:**
```
Athena goddess of wisdom, crested Corinthian helmet, aegis, owl on forearm, olive branch, classical Greek marble style, idealized contrapposto, draped robes, laurel wreath border, lapis-lazuli blue and pharaoh gold palette, papyrus cream figure, centered full-body portrait, low-angle, museum-quality digital oil painting, reverent golden-hour backlighting, mythic gravitas --ar 2:3 --stylize 300 --v 6 --no modern superhero, logo, watermark, text, NSFW
```

**Flux prompt:**
```
Athena, the ancient Greek goddess of wisdom and strategy. She stands in classical contrapposto, wearing a crested Corinthian helmet and an aegis breastplate. An owl perches on her raised left forearm; she holds an olive branch in her right hand. Style: Classical Greek marble sculpture — idealized, serene facial features, deeply folded drapery rendered in smooth polished stone. Medium: digital oil painting with museum-quality finish. Layout: centered symmetrical full-body portrait, slight low angle, Doric columns receding in the background. Colors: deep lapis-lazuli blue (#1A3A6B) background, pharaoh gold (#D4AF37) on helmet crest, border details, and symbol accents; faience teal (#0E7C7B) in the aegis; papyrus cream (#F2E6C9) for the marble figure itself. Decorative motif: twin laurel branches arcing around the composition, forming a wreath frame at the base. Atmosphere: reverent, golden-hour backlighting from the upper left, mythic gravitas. Avoid: modern superhero costume, copyright characters, watermark, text overlay, NSFW.
```

**Legal note (inherited from slots):** `myth-greek-athena` risk_level: **safe** (ancient myth, no copyright). `art-greek-roman` risk_level: **safe** (style and ancient works public domain; do not lift a modern photograph of a statue). `motif-laurels-and-wreaths` risk_level: **caution** — avoid UN emblem arrangement. `palette-pharaohz-gold-lapis` risk_level: **safe**.

---

### Example 2 — Sherlock Holmes Iconography in Baroque Style (Monocrome)

**Slots resolved:**
- `[SUBJECT]` = `pd-char-sherlock-holmes` → "silhouetted consulting detective: deerstalker cap, inverness cape, calabash pipe, magnifying glass, gaslit Victorian London fogscape behind him" (use iconography; do NOT include the name "Sherlock Holmes" in product branding — see risk_notes)
- `[STYLE]` = `baroque` → "dramatic chiaroscuro lighting, extreme light-dark contrast, theatrical shadows, rich detailed textures"
- `[MOTIF]` = `motif-vintage-engraving-anatomical` → "fine cross-hatched engraving texture overlaid"
- `[PALETTE]` = `palette-monocrome-ink` → "near-black ink (#1A1A1A), warm off-white (#F5F0E8), mid-grey, single amber highlight"
- `[COMPOSITION]` = "three-quarter portrait, figure slightly left of center, fog receding to the right"
- `[MEDIUM]` = "Victorian woodblock engraving style, high contrast"
- `[MOOD]` = "cerebral, mysterious, suspenseful"

**Midjourney prompt:**
```
Victorian detective silhouette, deerstalker cap, inverness cape, calabash pipe, magnifying glass, gaslit London fog, baroque chiaroscuro, dramatic shadow and light, vintage engraving cross-hatch texture, near-black and off-white ink palette, amber highlight, three-quarter portrait, high-contrast woodblock style, cerebral mysterious atmosphere --ar 3:4 --stylize 250 --v 6 --no color, Sherlock Holmes branding, modern clothing, logo, watermark
```

**Legal note (inherited):** `pd-char-sherlock-holmes` risk_level: **caution** — copyright clear since 2023, but Conan Doyle Estate is litigious and "SHERLOCK HOLMES" is a registered trademark. Use iconography and Z-named character for any branded product. Do NOT copy BBC/RDJ designs. `baroque` risk_level: **safe**. See [[shared/negative-prompt-library]] for the IP-safety blocklist.

---

### Example 3 — Norse Odin in Symbolist Style with Valkyrz Palette (Poster)

**Slots resolved:**
- `[SUBJECT]` = `myth-norse-odin` → "one-eyed bearded elder in a broad-brimmed hat and traveling cloak, two ravens on his shoulders, spear Gungnir, two wolves at his feet"
- `[STYLE]` = `symbolism` → "Symbolist painting style: dreamlike, allegorical, rich surface detail, otherworldly atmosphere, figures as symbols more than portraits"
- `[MOTIF]` = `motif-constellation-maps` → "faint star-map constellation overlay in the background, dotted celestial lines"
- `[PALETTE]` = `palette-valkyrz-cold-steel` → "cold steel blue-grey, midnight near-black, silver-white highlights, muted amber accent"
- `[COMPOSITION]` = "full-bleed vertical poster, figure occupying lower two-thirds, constellation sky filling the upper third"
- `[MEDIUM]` = "oil on canvas, painterly thick impasto"
- `[MOOD]` = "grim, relentless, sacrificial, mysteriously wise"

**Midjourney prompt:**
```
Odin the Norse all-father, one-eyed bearded wanderer, broad-brimmed hat, traveling cloak, two ravens on his shoulders, spear Gungnir, two wolves at feet, symbolist dreamlike painting style, allegorical atmosphere, constellation star-map sky background, cold steel blue-grey and midnight black palette, silver highlights, muted amber accent, full-bleed vertical poster, painterly thick impasto oil on canvas, grim relentlessly wise mood --ar 2:3 --stylize 400 --v 6 --no Marvel's Odin, Anthony Hopkins likeness, modern clothing, comic-book style, watermark, logo
```

**Legal note (inherited):** `myth-norse-odin` risk_level: **caution** — mythological Odin is PD; avoid Marvel's Odin (Anthony Hopkins), God of War Ragnarök, and rune arrangements associated with hate groups. `symbolism` risk_level: **safe** (movement PD). `motif-constellation-maps` risk_level: **safe**.

## Legal Pre-Flight

Sections this template touches: 03-Mythology, 04-Folklore, 05-Literature, 06-Historical-Art, 08-Color-Palettes, 09-Symbols, 11-characters, 13-Visual-Motifs. Before publishing, run [[shared/legal-preflight]] and confirm: no protected modern design reproduced; no real person's likeness; no `avoid` slot present; every `caution` slot's `risk_notes` reviewed and acknowledged; product branding does not use any trademarked name pulled from a character entry.

---
*Part of [[16-Prompt-Templates/README]]. Resolve slots per [[shared/slot-resolution-protocol]]. Defers to [[01-Legal-Guidelines/README]].*
