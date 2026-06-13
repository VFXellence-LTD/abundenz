# 17 — Design Recipes: Production Formulas That Turn Source Material Into Finished Products

This section is the **assembly line** of the Polymath Source Material Bible. Where [[15-Remix-Frameworks/README]] tells you *what to collide* and [[16-Prompt-Templates/README]] tells you *how to phrase a generation*, a design recipe tells you **exactly which Bible entries to combine, in which slots, to ship a specific product on a specific surface.**

A design recipe is a named, reusable formula. The master pattern is:

> **[Historical Symbol] + [Animal] + [Color Palette] + [Typography Style] + [Quote] = finished POD concept**

Not every recipe fills all five slots, and several add or swap slots (a palette can be replaced by a visual motif, a quote by a tagline, an animal by a deity), but the principle is constant: **a recipe is a slot pattern bound to real catalogue entries, a target product, a target market category, and a ready-to-run AI prompt.**

The point is repeatability. Once a recipe exists, an operator or an AI agent can run it dozens of times — swap the animal, swap the quote, swap the palette — and reliably produce on-brand, legally-clean, market-aligned designs without re-deciding the formula each time.

---

## Why recipes exist (the problem they solve)

The rest of the Bible is a pantry: 200+ public-domain symbols, palettes, motifs, characters, quotes, and frameworks. A pantry is not a meal. Faced with that much raw material, both humans and AI agents tend to either freeze or produce incoherent mash-ups. A recipe removes that paralysis by pre-deciding the *combination logic*:

- **Which ingredients pair well** (a gold-and-lapis palette belongs with an Egyptian symbol, not a synthwave grid).
- **Which surface they suit** (a four-color halftone illustration prints beautifully on a poster and badly on a dark heather tee).
- **Which market wants them** (an ouroboros + stoic quote sells into the philosophy/stoicism niche, not the kids' apparel niche).
- **What the AI prompt should literally say** to produce that result on the first or second try.

Recipes are the layer that makes the Bible *operational* rather than merely *referential*.

---

## What every recipe contains

Each recipe file (`type: design-recipe`) holds:

1. **The formula** — a named slot pattern, e.g. `[PD Symbol] + [Real Animal, line-art] + [Palette] + [Typography] + [PD Quote]`.
2. **The slots, defined** — what each slot accepts, and which Bible section it draws from.
3. **A worked example** — every slot filled with a **real catalogue entry** (with its `id` and a wikilink), proving the formula resolves to a shippable concept.
4. **Target product** — tee / poster / mug / book-cover / sticker / tote / etc., with surface-specific notes (color space, contrast, bleed, print method).
5. **Target market category** — a wikilink into [[14-Trending-Categories/README]], so the operator knows who buys it.
6. **An example AI-image prompt** — a complete, copy-paste prompt aligned to the [[16-Prompt-Templates/shared/slot-resolution-protocol]], including the negative/avoid clause that enforces the recipe's legal guardrails.
7. **Swap table** — how to re-run the recipe with different ingredients to spin a whole product series from one formula.
8. **Legal guardrails** — inherited from each ingredient's `risk_notes`, surfaced as a single "never do this" line.

---

## The slot vocabulary

Recipes draw their slots from these sections. Keep the slot names consistent — downstream automation maps on them.

| Slot | Draws from | Example entries |
|------|-----------|-----------------|
| **Historical Symbol** | [[09-Symbols/README]] | [[ouroboros]] · [[crescent-moon]] · [[fire]] · [[sun]] · [[eight-pointed-star]] |
| **Animal** | [[13-Visual-Motifs/motifs/line-art-animals]], [[14-Trending-Categories/wildlife]] | lion · wolf · owl · whale · stag · moth |
| **Color Palette** | [[08-Color-Palettes/README]] | [[pharaohz-gold-lapis]] · [[voltz-retro-neon]] · [[crimzon-noir]] · [[verdanz-botanical]] |
| **Typography Style** | [[07-Historical-Design/typography]] | art-deco display · victorian slab · blackletter · grotesque sans · hand-script |
| **Quote** | [[12-Quotes/README]] | [[courage]] · [[wisdom]] · [[nature]] · [[perseverance]] |
| **Character** *(optional swap)* | [[11-Characters/README]] | [[sherlock-holmes]] · [[dracula]] · [[alice-wonderland]] |
| **Visual Motif** *(optional, often replaces palette role)* | [[13-Visual-Motifs/README]] | [[retro-sunbursts]] · [[laurels-and-wreaths]] · [[badges-and-crests]] |
| **Remix Lens** *(optional macro-slot)* | [[15-Remix-Frameworks/README]] | [[ancient-egypt-x-space]] · [[ocean-creatures-x-music]] |

---

## How this section is used

### By a human operator
1. Pick a target product and/or a target [[14-Trending-Categories/README]] niche.
2. Open the matching recipe (use the index below or the per-product grouping).
3. Read the worked example, then use the **swap table** to choose your specific ingredients.
4. Copy the AI-image prompt, substitute your chosen slot values, generate, and refine.
5. Check the **legal guardrails** line before sending to production.

### By an AI generation agent
A recipe is machine-runnable. Given a recipe `id`, an agent:
1. Loads the recipe's slot pattern.
2. Resolves each slot to a concrete Bible entry — either the ones in the worked example or operator-supplied swaps — and **reads each entry's `risk_notes`** via [[01-Legal-Guidelines/decision-tree]].
3. Assembles the prompt using the [[16-Prompt-Templates/shared/slot-resolution-protocol]] and the [[16-Prompt-Templates/shared/model-parameter-cheatsheet]].
4. Appends the merged avoid-clause built from every ingredient's `risk_notes`.
5. Emits the finished prompt (and, downstream, the image), plus the product surface spec and the target category tag.

Because every slot points at a frontmatter-tagged entry, an agent can also **discover** valid combinations by matching `themes` / `emotional_tags` / `applications` across sections — the recipes here are curated exemplars, not the only legal combinations.

---

## Section conventions

- **Files:** one recipe per file is preferred for the headline formulas; thematically tight clusters may group up to ~10 short recipe variants in one file (e.g. a "starter pack" of five sticker recipes). Each catalogued recipe still carries its own frontmatter block.
- **Frontmatter:** `type: design-recipe`, full schema per [[METADATA-STANDARD]]. `pd_status` reflects the *most restrictive* ingredient (if any slot is `caution`, the recipe is at least `caution`).
- **`risk_level` / `risk_notes`:** a recipe **inherits the strictest** `risk_level` of its ingredients. If a recipe uses [[sherlock-holmes]] (`caution`), the recipe is `caution` and its `risk_notes` repeats the trademark/likeness trap.
- **Worked examples use real entries only.** Every slot in a worked example links to an actual file in sections 06–16 with its real `id`. No invented sources.
- **Prompts are complete.** Each AI-image prompt is copy-paste runnable and ends with an explicit avoid-clause. Prompts target a generic, modern diffusion model; tune parameters via [[16-Prompt-Templates/shared/model-parameter-cheatsheet]].
- **Cross-link heavily.** Every ingredient, product surface, and category is a wikilink. The recipe is a *hub* in the vault graph.
- **Z-naming:** any Polymath brand/series name coined inside a recipe incorporates a **Z** (e.g. "Stoikz", "Lunaza", "Mythoz").

---

## Recipe index

Recipes are grouped by their dominant surface and theme. All are listed in [[recipe-index]].

| Group | File | Headline products | Categories |
|-------|------|-------------------|------------|
| Master formula & method | [[master-formula]] | all | all |
| Egyptian / cosmic | [[pharaoh-cosmos-tee]] | tee, poster | mythology, space |
| Stoic / philosophy | [[stoic-owl-poster]] | poster, mug | wisdom, stoicism |
| Synthwave / retro-tech | [[synthwave-wolf-tee]] | tee, sticker | retro-tech, synthwave |
| Botanical / cottagecore | [[botanical-moth-totebag]] | tote, sticker, card | nature, cottagecore |
| Gothic / horror | [[gothic-raven-poster]] | poster, tee | horror, gothic |
| Celestial / witchy | [[lunar-moth-sticker]] | sticker, mug, card | celestial, witchy |
| Nautical / oceanic | [[oceanic-whale-mug]] | mug, poster | ocean, wildlife |
| Heraldic / vintage badge | [[heraldic-stag-tee]] | tee, patch, sticker | outdoors, vintage |
| Children's animal alphabet | [[childrens-animal-bookcover]] | book-cover, poster | kids, education |
| Detective / Victorian | [[victorian-detective-tee]] | tee, poster | detective, victorian |
| Alchemical / occult | [[alchemy-elements-sticker-pack]] | sticker pack | occult, esoteric |
| Athletic / motivational | [[athletic-lion-tee]] | tee, poster | sports, motivation |
| Art Deco / luxe | [[deco-sunburst-poster]] | poster, card | art-deco, luxury |
| Folk / harvest | [[folk-harvest-totebag]] | tote, tea-towel | folk, cottagecore |
| Wonderland / surreal | [[wonderland-teacup-mug]] | mug, sticker | surreal, whimsy |
| Multi-recipe starter packs | [[sticker-starter-pack]] | sticker (×6) | mixed |
| Multi-recipe starter packs | [[mug-starter-pack]] | mug (×6) | mixed |
| Multi-recipe starter packs | [[poster-starter-pack]] | poster (×6) | mixed |
| Multi-recipe starter packs | [[tee-starter-pack]] | tee (×6) | mixed |
| Multi-recipe starter packs | [[bookcover-starter-pack]] | book-cover (×5) | mixed |

---

## Related foundation documents

- [[README]] — Bible overview
- [[METADATA-STANDARD]] — frontmatter schema
- [[01-Legal-Guidelines/README]] — the legal doctrine every recipe obeys
- [[15-Remix-Frameworks/README]] — the collision logic recipes build on
- [[16-Prompt-Templates/README]] — the prompt scaffolds recipes invoke
- [[14-Trending-Categories/README]] — the market each recipe targets
- [[_template]] — copy-paste recipe template
