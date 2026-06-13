# 08 — Color Palettes

The **Color Palette Library** for the Source Material Bible. This section holds reusable, named, hex-defined color systems that any content ecosystem can pull from to keep visual output consistent, on-brand, and production-ready across print-on-demand (POD), posters, t-shirts, children's books, social graphics, AI image/video generation, and merch.

Every palette is its own file with full YAML frontmatter so the whole library is database-ready (Notion / Airtable / Postgres / vector ingestion). The hex values live in frontmatter as machine-readable arrays; the body explains how a human or an AI generator should actually *use* the colors.

---

## What lives here

Each entry is `type: color-palette` and includes:

- A **brandable name** — Z-styled where it's fun (the Abundenz signature; see `shared/brand-naming.md`). Palettes that are tied to a real historical/cultural source keep a descriptive name plus an optional Z-brand alias.
- A **hex array** in frontmatter (`hex_colors`) plus named **role mapping** (which color is primary / accent / background / text).
- **Palette structure** type: tri-tone, monochrome, duotone, analogous, complementary, or thematic.
- **Mood / emotional tags** so generators can match a palette to a feeling.
- **Section pairings** — which other Bible sections this palette was built to serve (e.g. Egyptian gold/lapis pairs with `03-Mythology`).
- **POD / print considerations** — CMYK gamut caveats, apparel contrast, ink-on-fabric warnings, accessibility/legibility notes.

---

## How other sections use this library

- **02 Public Domain Library / 05 Literature** — assign a palette to a public-domain work so derived posters, covers, and merch share a coherent look.
- **03 Mythology / 04 Folklore** — pantheon- and culture-themed palettes (Egyptian gold/lapis, Norse cold steel) give mythic ecosystems an instantly recognizable color identity.
- **06 Historical Art / 07 Historical Design** — movement palettes (Art Deco black/gold/teal, vintage muted) translate a design era into usable hex values.
- **13 Visual Motifs / 09 Symbols** — a motif or symbol set is rendered in a chosen palette to produce a finished asset.
- **16 Prompt Templates / 17 Design Recipes** — prompts reference a palette by `id` so AI generation stays color-consistent; recipes specify a palette + motif + layout combination.

A downstream system selects a palette by `id`, reads `hex_colors` and the role mapping, and feeds those values into a design tool, an AI image prompt, or a CSS/print pipeline.

---

## Conventions specific to this section

1. **Hex format** — uppercase, six-digit, hash-prefixed (`#1A2B3C`). No 3-digit shorthand, no alpha. Store as a YAML list under `hex_colors`.
2. **Role mapping** — the body always states which hex is `primary`, `secondary`, `accent(s)`, `background`, and `text`, so a generator knows the hierarchy, not just the swatches.
3. **Palette size** — 3 to 6 working colors. Monochrome/duotone entries may list tints/shades of the base.
4. **Color is not copyrightable.** Individual colors and short color combinations are **not** protected by copyright in the US. A palette of hex values is safe to define and reuse. (`pd_status: na` is correct for an abstract color system — there is no "work" to expire.)
5. **The caution is trademark, not copyright.** A specific color *as a brand identifier* can be trademarked in a specific commercial context (e.g. Tiffany robin's-egg blue for jewelry boxes, UPS brown for delivery, Cadbury/Milka purple for chocolate, Christian Louboutin red soles, T-Mobile/Deutsche Telekom magenta, Home Depot orange, Barbie pink in toys). Using a similar hex for *unrelated* products is generally fine; imitating a famous brand's signature color *in that brand's own category* is not. Each entry's `risk_notes` flags any color whose fame could invite a trademark problem in a specific category.
6. **Don't name a palette after a trademark.** Palette names avoid live brand names. "Tiffany blue", "Barbie pink", "Pantone 448C", etc. are referenced only as cautionary examples in `risk_notes`, never used as an entry title or sold as such.
7. **Pantone caveat.** The *Pantone* name and the Pantone Matching System are trademarked/licensed; specific PMS numbers and the Pantone color libraries are proprietary data. We define our palettes in open hex (and give CMYK guidance), and we do **not** label any palette with a Pantone number or the Pantone trademark.
8. **Print reality over screen beauty.** Every entry carries CMYK caveats — neon/electric RGB colors, pure cyans, and bright greens commonly shift dull when printed. Apparel notes cover contrast against light vs. dark garments and the "no white ink on white shirt" class of mistakes.

---

## Files in this section

- `README.md` — this file.
- `_template.md` — copy-paste entry template with full frontmatter + body headings.
- One `.md` file per palette (kebab-case). See the catalogue below.

### Catalogue

| File | Palette | Structure | Tied to |
|------|---------|-----------|---------|
| `pharaohz-gold-lapis.md` | Pharaohz Gold & Lapis | Thematic / complementary | 03 Mythology (Egyptian) |
| `valkyrz-cold-steel.md` | Valkyrz Cold Steel | Thematic / monochrome-cool | 03 Mythology (Norse) |
| `gatzby-deco.md` | Gatzby Deco (black/gold/teal) | Thematic / tri-tone | 06 Art, 07 Design (Art Deco) |
| `sepiaz-vintage.md` | Sepiaz Vintage Muted | Thematic / analogous-warm | 05 Literature, 07 Design |
| `streetwize-contrast.md` | Streetwize High-Contrast | Duotone / complementary | merch, streetwear |
| `dreamz-pastel.md` | Dreamz Pastel Nursery | Thematic / analogous-soft | 04 Folklore, children's books |
| `terrafolk-earthen.md` | Terrafolk Earthen | Thematic / earthy | 04 Folklore, 03 Mythology |
| `voltz-retro-neon.md` | Voltz Retro Neon | Thematic / triadic | retro-tech, video |
| `abyssz-oceanic.md` | Abyssz Oceanic | Analogous (cool) | 03 Mythology (sea), social |
| `verdanz-botanical.md` | Verdanz Botanical | Analogous (green) | botanical, children's |
| `monocrome-ink.md` | Monocrome Ink | Monochrome (grayscale) | print, line-art, POD |
| `crimzon-noir.md` | Crimzon Noir | Duotone (red/black) | horror, scary stories |
| `solaraz-sunset.md` | Solaraz Sunset | Analogous (warm gradient) | posters, social, AI-image |
| `frostz-winter.md` | Frostz Winter | Monochrome-cool / duotone | seasonal, holiday merch |
| `regaliz-jewel.md` | Regaliz Jewel Tones | Tri-tone (saturated) | premium products, brand |
| `bloomz-spring-pastel.md` | Bloomz Spring Pastel | Complementary-soft | seasonal, children's, social |

See `01-Legal-Guidelines` for the canonical legal doctrine this section follows.
