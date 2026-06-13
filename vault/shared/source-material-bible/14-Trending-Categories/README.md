# 14 — Trending Creative Categories

This section is the **demand-and-positioning layer** of the Source Material Bible. Where other sections catalogue *what* exists (public-domain works, characters, symbols, art movements, color palettes, visual motifs), this section catalogues **the audience-facing categories that people actually search, buy, and follow** — the niches a print-on-demand store, a children's-book series, a podcast, or an AI-image pipeline can be built around.

Every other section answers "is this safe and what does it look like?" This section answers **"who wants it, why, and how saturated is the market?"**

## What a "category" is here

A category is a recurring theme of audience interest with its own buyer psychology, aesthetic vocabulary, and commercial track record — e.g. *Mythology*, *Cottagecore*, *Astrology/Cosmic*. It is not a single work or character; it is a **content territory**. Each category file tells an AI generator or a human operator:

1. **Description** — what the category covers and its scope/boundaries.
2. **Why it resonates** — the audience psychology and emotional drivers (the buyer's actual motivation).
3. **Design / story / POD opportunities** — concrete product and content angles.
4. **Visual motifs** — links into [[13]] (Visual Motifs) for the look.
5. **Symbols** — links into [[09]] (Symbols) for meaning-carrying iconography.
6. **Palette pairings** — links into [[08]] (Color Palettes) for the right color story.
7. **Remix combinations** — links into [[15]] (Remix Frameworks) for high-value mash-ups.
8. **Evergreen-vs-trend rating** — how durable the demand is.
9. **Saturation / competition note** — how crowded the market is and where the open lanes are.

## How other sections / AI generation use this

- **AI image / video / writing pipelines** read a category file to assemble a complete creative brief: pull the `visual_motifs`, `symbols`, `palette` pairings, and `remix_hooks` into a prompt without re-deriving them. The category is the *entry point*; sections 08/09/13/15 are the *parts bin*.
- **Product strategy** uses `evergreen_vs_trend` and the saturation note to decide where to invest (evergreen = build a durable catalogue; trend = move fast, expect decay).
- **Legal layer ([[01]])** still governs every asset a category pulls in. A category itself is an *idea* and not copyrightable, so category files are `pd_status: na` / `risk_level: safe` — **but** the moment a category leans on a specific named property (a franchise, a living person, a branded aesthetic), the `risk_notes` field flags it and the conservative rule from [[01]] applies. Categories are described in terms of **generic, ownable building blocks**, never franchise IP.

## Section-specific conventions

- **`type: category`** on every entry.
- **`pd_status: na`** and **`risk_level: safe`** are the default, because a theme/genre is not ownable. The danger is always in the *execution* (e.g. "steampunk" is safe; copying a specific film's prop design is not). Each file's `risk_notes` carries the execution warning.
- **`evergreen_vs_trend`** is a custom field (values: `evergreen`, `evergreen-leaning`, `balanced`, `trend-leaning`, `trend`) plus a 1–5 durability note in the body.
- **`saturation`** is a custom field (values: `low`, `moderate`, `high`, `very-high`) with the open-lane analysis in the body.
- Cross-links use Obsidian `[[wikilinks]]`. Section links use the bare section number (e.g. `[[13]]`) per the bible-wide convention; intra-section links use the entry filename (e.g. `[[mythology]]`).
- Prose is normal professional English. The frontmatter is the database layer.

## Entry index

**Core 20 (from spec):**
mythology · fantasy · space-exploration · nature · wildlife · ancient-civilizations · medieval · musical-instruments · sports · playgrounds · religion-spirituality · retro-technology · steampunk · ocean-life · survival-adventure · transportation · science-discovery · folk-traditions · architecture · food-culinary

**Emerging / evergreen (6):**
cottagecore · dark-academia · affirmations-mental-health · pet-parent · astrology-cosmic · retro-gaming-pixel

Total: **26 category entries** + this README + `_template.md`.

## Related sections

- [[08]] — Color Palettes (palette pairings)
- [[09]] — Symbols (meaning-carrying iconography)
- [[13]] — Visual Motifs (the look/texture vocabulary)
- [[15]] — Remix Frameworks (category mash-up engine)
- [[01]] — Legal Guidelines (governs every asset a category pulls in)
- [[07]] — Historical Design (feeds Retro Technology, Architecture, Medieval, Ancient Civilizations)
- [[11]] — Characters (original characters that can headline a category line)
