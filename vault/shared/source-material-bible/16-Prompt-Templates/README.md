# 16 — Prompt Templates: The Operational Bridge From Knowledge Base to Generation

This section is where the Source Material Bible stops being a library and starts being a factory. Sections 02–13 catalogue the **raw material** (public-domain works, myths, characters, art movements, palettes, symbols, motifs). Sections 14–15 tell you **what sells** and **how to combine** material into something ownable. This section — 16 — turns all of that into **fillable prompts that AI models can run today** to produce images, written copy, stories, podcast scripts, brands, characters, and print-on-demand product listings.

A prompt template here is not a one-off prompt. It is a **parameterised scaffold** whose slots are filled by entries from other Bible sections. The slot `[STYLE]` is not a free-text guess — it is "pull one `art-movement` from section 06," and the legal status of whatever you pull travels with it. That is the entire point: by sourcing every variable from the cleared catalogue, the prompt inherits the catalogue's legal safety.

---

## What lives here

| Family | Folder | What it generates | Pulls variables from |
|---|---|---|---|
| **AI Image** | `ai-image/` | Midjourney / SDXL / DALL·E / Flux prompts for art, posters, covers, merch graphics | 03, 04, 06, 08, 09, 11, 13 + composition/medium |
| **AI Writing** | `ai-writing/` | Blog posts, product descriptions, social captions, ad copy | 05, 12, 14, 15 |
| **AI Storytelling** | `ai-storytelling/` | Story seeds, children's-book scripts, narrative arcs | 03, 04, 05, 10, 11 |
| **Podcast** | `podcast/` | Episode outlines & scripts built on a PD work or myth | 03, 04, 05, 12 |
| **Brand Generation** | `brand-generation/` | Z-named brand/series identities (name + archetype + palette + voice) | 08, 10, 14 + Z-naming |
| **Character Generation** | `character-generation/` | Original, ownable characters built from PD substrate | 03, 04, 10, 11, 13 |
| **Merch / POD Generation** | `merch-pod/` | Full design brief → marketplace listing (title, tags, descriptions, mockup brief) | 08, 09, 13, 14, 15, 17 |
| **Shared** | `shared/` | Cross-cutting helpers: the slot-resolution protocol, model parameter cheat-sheet, negative-prompt library, legal pre-flight | all |

---

## The core idea: prompts reference Bible entries as variables

Every template has a **Slot Table**. Each slot names:

1. a **placeholder** (e.g. `[SUBJECT]`, `[STYLE]`, `[MOTIF]`, `[PALETTE]`),
2. the **source section** it must be filled from (e.g. "06-Historical-Art, one `art-movement`"),
3. and an **example fill** drawn from a real entry that exists in the vault today (e.g. `art-deco` → "elegant geometric symmetry, gold linework, sunburst forms").

When an AI agent runs a template, it:

1. Reads the Slot Table.
2. For each slot, opens the named section and selects an entry (by `id`).
3. Copies that entry's **legal status** (`pd_status`, `risk_level`, `risk_notes`) into a running **legal ledger** for this generation.
4. Substitutes each entry's descriptive payload into the placeholder.
5. Runs the assembled prompt through the model.
6. Refuses to emit anything whose ledger contains a `risk_level: avoid` element, and surfaces every `caution` note to the operator.

This is the **slot-resolution protocol**, specified in full in [[shared/slot-resolution-protocol]]. Read it before authoring or running any template.

---

## The legal contract (defers to [[01-Legal-Guidelines/README]])

A prompt is a recipe; the safety lives in the ingredients. Three rules govern everything in this folder:

1. **Every slot value carries its legal status.** If you fill `[CHARACTER]` with `pd-char-sherlock-holmes`, you also inherit that entry's `risk_notes` — and the Holmes trap (late stories still under US copyright until 2023→fully clear now, but the *Conan Doyle Estate trademark posture*) rides along. The template must echo that note in its output. See [[05-Literature/traps/sherlock-holmes-estate]].
2. **Copyright ≠ trademark ≠ likeness.** A template may instruct a model to render a PD character *from the source text description* but must **never** instruct it to reproduce a protected modern VISUAL design (the Universal bolt-neck Frankenstein, the MGM ruby slippers, a studio mascot) or a real person's likeness. Templates encode this as hard negative-prompt entries — see [[shared/negative-prompt-library]].
3. **When a slot's source is `caution`, the prompt still runs, but the constraint is printed alongside the output.** When a slot's source is `avoid`, the template halts. Conservative is correct: the safe failure mode for IP is "don't generate it."

Every template file ends with a **Legal Pre-Flight** block restating which sections it touches and what the operator must verify before publishing.

---

## How other sections use this one

- **17 — Design Recipes** consumes these templates as steps. A recipe like "Egyptian-deco enamel-pin series" will literally say *"run [[ai-image/midjourney-pd-art-style]] with `[SUBJECT]=myth-egyptian-anubis`, `[STYLE]=art-deco`, `[PALETTE]=palette-pharaohz-gold-lapis`."* The recipe is the menu; the template is the appliance.
- **15 — Remix Frameworks** feeds these templates. A remix's `remix_hooks` array drops straight into the `[CONCEPT]` and `[MOTIF]` slots. The [[15-Remix-Frameworks/remix-engine]] output object maps 1:1 onto the AI-image and brand templates.
- **An AI generation agent** treats this folder as its instruction set: pick a template by `applications` tag, resolve slots against the catalogue, run the legal pre-flight, emit.

---

## Section-specific conventions

- **Every entry is `type: prompt-template`.** `pd_status: na` and `risk_level: safe` for the *template itself* (a template is Polymath-original method); the legal weight lives in the resolved slot values, surfaced in `risk_notes` as a pointer to the slot-resolution protocol.
- **Slot placeholders are UPPERCASE in square brackets:** `[SUBJECT]`, `[STYLE]`, `[MOTIF]`, `[PALETTE]`, `[COMPOSITION]`, `[MEDIUM]`, `[MOOD]`, `[PARAMS]`. The same placeholder always means the same thing across files (see [[shared/slot-resolution-protocol]] for the master glossary).
- **Each placeholder names its source section.** No free-floating creativity in a slot — it resolves to a Bible `id`. This is what keeps generation auditable.
- **Every template carries 2–3 worked examples that use REAL entry IDs** that exist in the vault today. Examples are copy-paste-runnable.
- **Model-agnostic body + model-specific notes.** The base prompt works on any text-to-image or text model; a "Model Notes" block adds Midjourney `--ar/--stylize`, SDXL weighting, DALL·E phrasing, and Flux guidance where they differ.
- **Z-naming for anything invented.** Brand, series, and character names coined by a template follow the Z convention (incorporate a Z) for distinctiveness and trademark-clearability — see [[brand-generation/brand-identity-generator]].
- **Output is structured.** Where a template produces something downstream-consumable (a listing, a brand object, a story bible), it emits a labelled block, not prose, so 17-Design-Recipes and the database can parse it.

---

## File index

### Root-level templates (this folder — the operational set)

These seven files are the complete, ready-to-run template library. Each is a standalone fillable document with a Slot Table, a base prompt, model-specific notes, and 2–3 worked examples using real Bible entry IDs. Start here for any generation task.

| File | Generates | Pulls from |
|---|---|---|
| [[ai-image-generation]] | AI image prompt for any model (Midjourney, SDXL, Flux, DALL·E): subject + style + motif + palette + composition | 03, 06, 08, 11, 13 |
| [[ai-writing]] | Social captions, product descriptions, listing titles/tags, SEO blog intros | 05, 10, 12, 14, 17 |
| [[ai-storytelling]] | Story seeds, short-story outlines, children's-book structures using archetype + PD source + beat template | 03, 04, 05, 10, 11, 12 |
| [[podcast]] | Podcast episode outline + script from a PD myth or literary work (solo or two-voice) | 03, 04, 05, 10, 12 |
| [[brand-generation]] | Z-named brand identity: name candidates, logo concept, voice guide, tagline | 08, 09, 10, 13, 14 |
| [[character-generation]] | Original ownable character (visual + backstory) from archetype + PD substrate; never reproduces a protected design or real likeness | 03, 09, 10, 11, 13 |
| [[merch-pod-generation]] | Full pipeline from a [[17-Design-Recipes]] recipe or [[19-Trend-Dictionary]] GO phrase → image prompt + title + tags + description | 08, 12, 13, 17, 19 |

### How these seven templates relate to each other

A typical product-line workflow chains them in order:

1. **ai-image-generation** → creates the visual.
2. **ai-writing** → writes the listing copy around it.
3. **merch-pod-generation** → bundles both into a publish-ready listing.
4. **brand-generation** → coins the series name and voice that unify multiple products.
5. **character-generation** → builds a mascot/character to anchor the brand.
6. **ai-storytelling** → generates narrative content (social, children's book, editorial) seeded by the same character and PD substrate.
7. **podcast** → produces episode content about the same source material, driving traffic back to the product line.

### Shared infrastructure (`shared/`)
| File | Purpose |
|---|---|
| [[shared/slot-resolution-protocol]] | **Read first.** The master glossary of placeholders, the resolve-against-Bible algorithm, the legal ledger. |
| [[shared/model-parameter-cheatsheet]] | Per-model parameter reference (Midjourney, SDXL, DALL·E 3, Flux) + aspect ratios per product. |
| [[shared/negative-prompt-library]] | Reusable negative prompts, including the hard IP-safety blocklist. |
| [[shared/legal-preflight]] | The pre-publish checklist every generation must pass. |

### Planned sub-family files (not yet built — tracked in `_template.md`)

The original section spec called for per-model sub-files in `ai-image/`, `ai-writing/`, `ai-storytelling/`, `podcast/`, `brand-generation/`, `character-generation/`, and `merch-pod/` subfolders. Those sub-files add additional model-specific depth beyond what the root templates cover. The root templates are the operational priority and are now complete. Sub-family expansion is backlogged.

| Planned file | Status |
|---|---|
| `ai-image/midjourney-pd-art-style` | Backlogged — root template covers this |
| `ai-image/sdxl-character-portrait` | Backlogged |
| `ai-image/poster-composition` | Backlogged |
| `ai-image/flux-photoreal-scene` | Backlogged |
| `ai-image/dalle-childrens-illustration` | Backlogged |
| `ai-image/seamless-pattern-tile` | Backlogged |
| `ai-writing/blog-post-from-source` | Backlogged — root template covers this |
| `ai-writing/social-caption-pack` | Backlogged |
| `ai-writing/product-description` | Backlogged |
| `ai-storytelling/archetype-story-seed` | Backlogged — root template covers this |
| `ai-storytelling/childrens-book-script` | Backlogged |
| `podcast/episode-from-pd-work` | Backlogged — root template covers this |
| `brand-generation/brand-identity-generator` | Backlogged — root template covers this |
| `character-generation/character-builder` | Backlogged — root template covers this |
| `merch-pod/design-brief-to-listing` | Backlogged — root template covers this |

---
*Part of the Polymath Source Material Bible. All templates defer to [[01-Legal-Guidelines/README]] and resolve their slots per [[shared/slot-resolution-protocol]]. Operating guidance for VFXellence Ltd. Not legal advice.*
