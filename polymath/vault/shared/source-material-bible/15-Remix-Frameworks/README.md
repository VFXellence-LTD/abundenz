# 15 — Remix Frameworks: Method Docs for Combining Sources Into Novel Concepts

This section is the **generative engine** of the Polymath Source Material Bible. While most other sections catalogue *raw material* — public-domain literature, mythology, art movements, design systems, color palettes, symbols — this section catalogues *methods for combining that material* into new, ownable, legally-safe creative concepts.

A remix framework answers a single question: **"What do you get when you collide Source A with Category B?"** Each framework takes one source domain (e.g. Ancient Egypt, Medieval Knights, Victorian Ornament) and fuses it with one category or context (e.g. Space Travel, Skateboarding, Artificial Intelligence) to produce a repeatable recipe for generating concepts, visuals, stories, print-on-demand products, and brands.

## Why remixing is the safe-by-design strategy

The single most valuable property of a remix is that **the combination itself is original even when both ingredients are old.** Ancient Egyptian iconography is public domain. Outer-space imagery is public domain. But "Anubis as a deep-space psychopomp guiding souls between star systems" is a *new expression* — it is Polymath's to own. Remixing is how we turn free raw material into proprietary IP without ever touching anyone's live copyright, trademark, or likeness.

This is the legal backbone of the whole section, and it defers entirely to [[01-Legal-Guidelines/README]]:

- We remix **public-domain and openly-licensed sources only.** A framework never instructs the generator to reproduce a protected character, a studio's specific visual design, a logo, a mascot, or a real person's likeness.
- The *tension* (the unexpected pairing) is what creates originality. Two free ingredients + a novel synthesis = a defensible new work.
- Where a source domain has a famous *modern adaptation* that is protected (e.g. the Universal bolt-neck Frankenstein, the MGM ruby slippers, a specific superhero costume), each framework's `risk_notes` names the trap explicitly and routes the generator back to the public-domain substrate.
- Invented Polymath brand names follow the **Z-naming convention** (every coined brand incorporates a Z), keeping our names distinctive and trademark-clearable.

## How this section is used

### By human operators
Browse the framework files for inspiration, or use [[remix-engine]] to generate a brand-new pairing on demand. Each framework file is self-contained: it gives you concept rules, visual rules, story rules, POD rules, and brand rules for that specific collision, plus ready-to-use remix hooks and example outputs.

### By AI generation systems
This is the important one. **[[remix-engine]] is an AI-runnable algorithm.** Given any Source A and any Category B (or asked to pick them itself), the engine:

1. Pulls A from the relevant Bible section and confirms its legal status via [[01-Legal-Guidelines/decision-tree]].
2. Pulls B as a context/activity/medium.
3. Finds the **tension** (what clashes) and the **harmony** (what rhymes) between them.
4. Selects a **palette**, a **visual motif**, and an **archetype** that bind the two.
5. Emits a structured concept object (concept line, visual brief, story seed, POD product list, brand name) ready to feed an image / video / writing pipeline.

The individual framework files are *worked examples and presets* of that engine. They let the generator skip the derivation for the most valuable pairings and go straight to output.

## Section-specific conventions

- **Every entry is `type: remix-framework`** except [[remix-engine]] which is the meta-method (also tagged `remix-framework` but flagged `meta: true` in its body).
- **Source A is always legally cleared.** Each framework's frontmatter records the `pd_status` of its source domain and points at the relevant Bible section. If A is `caution`, the framework still works but its `risk_notes` carry the constraint.
- **Five generation lenses, always in this order:** Concept → Visual → Story → POD → Brand. This fixed order matches the downstream pipeline and lets the AI parse any framework file the same way.
- **Remix hooks are the payload.** The `remix_hooks` frontmatter array is the densest, most reusable part of each file — short, concrete, generator-ready phrases.
- **Tension before harmony.** A remix that has no friction is just a theme. Each framework names the productive clash first, because the clash is where the originality (and the legal safety) lives.
- **Applications are tagged for filtering.** The `applications` array lets a content planner pull, say, every framework that supports `childrens-book`, or every one that supports `ai-video`.

## The five generation lenses (what every framework file contains)

| Lens | Question it answers | Downstream consumer |
|---|---|---|
| **Concept generation** | What is the core idea, and what 10–20 concept seeds does this collision spawn? | Ideation, content planning |
| **Visual generation** | What does it *look* like — palette, motif, composition, render style? | AI image / poster / cover pipelines |
| **Story generation** | What narratives, characters, and arcs does it support? | Children's books, storytelling, podcasts, scripts |
| **POD generation** | What sellable products (tees, posters, mugs, stickers, books) come out of it, with slogan and layout angles? | Print-on-demand catalogues |
| **Brand generation** | What ownable Z-named brand/series identity wraps the whole thing? | Brand, series, channel naming |

## File index

| File | Source A | Category B | Notes |
|---|---|---|---|
| [[remix-engine]] | — | — | **META.** The universal formula. Runnable by AI to generate ANY remix. Start here. |
| [[ancient-egypt-x-space]] | Ancient Egypt | Space / Sci-Fi | Listed core remix |
| [[medieval-knight-x-skateboarding]] | Medieval Knights | Skateboarding / Street | Listed core remix |
| [[victorian-ornament-x-ai]] | Victorian Ornament | Artificial Intelligence | Listed core remix |
| [[ocean-creatures-x-music]] | Ocean Creatures | Music | Listed core remix |
| [[playground-x-mythology]] | Playground / Childhood | World Mythology | Listed core remix |
| [[norse-myth-x-cyberpunk]] | Norse Mythology | Cyberpunk | |
| [[botanical-x-geometry]] | Botanical Illustration | Sacred / Hard Geometry | |
| [[wild-west-x-deep-sea]] | Wild West / Frontier | Deep-Sea Exploration | |
| [[greek-myth-x-sports]] | Greek Mythology | Modern Sports | |
| [[alchemy-x-coffee]] | Alchemy / Hermeticism | Coffee Culture | |
| [[dinosaurs-x-art-deco]] | Dinosaurs / Paleo | Art Deco | |
| [[fairy-tales-x-noir]] | Fairy Tales | Film-Noir / Detective | |
| [[astronomy-x-folk-craft]] | Classical Astronomy | Folk / Quilt Craft | |
| [[insects-x-architecture]] | Insects / Entomology | Architecture / Blueprint | |
| [[japanese-ukiyo-e-x-skate-graphics]] | Ukiyo-e Woodblock | Modern Skate / Graffiti | |
| [[victorian-anatomy-x-flora]] | Victorian Anatomy Plates | Botanical / Floral | |
| [[constellations-x-animals]] | Star Constellations | Animal Kingdom | |
| [[medieval-bestiary-x-space-exploration]] | Medieval Bestiary | Space Exploration | |
| [[tarot-x-tech-startup]] | Tarot Arcana | Tech / Startup Culture | |
| [[folk-pattern-x-circuitry]] | Folk Textile Pattern | Electronic Circuitry | |
| [[mythic-birds-x-aviation]] | Mythic Birds | Aviation / Flight History | |
| [[gothic-cathedral-x-botany]] | Gothic Cathedral | Botany / Greenhouse | |
| [[ancient-maps-x-cosmos]] | Antique Cartography | Cosmos / Deep Space | |
| [[carnival-x-machinery]] | Carnival / Circus | Industrial Machinery | |
| [[_template]] | — | — | Copy-paste entry template with full frontmatter schema. |

---
*Part of the Polymath Source Material Bible. All frameworks defer to [[01-Legal-Guidelines/README]]. Operating guidance for VFXellence Ltd. Not legal advice.*
