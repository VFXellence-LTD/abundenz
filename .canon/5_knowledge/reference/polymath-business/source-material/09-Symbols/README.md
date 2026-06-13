# 09-Symbols — Symbol Library

This section is the Source Material Bible's reference catalogue of **symbols** — discrete graphic marks, glyphs, and emblems with established meaning that designers, writers, and AI generation pipelines can draw on across every Polymath / VFXellence content ecosystem (POD, t-shirts, posters, children's books, storytelling, podcasts, video, blog, social, merch, and AI image/video/writing).

A "symbol" here is narrower than a "visual motif" (section 08) or an "art movement" (section 07). A symbol is a single, recognizable unit of meaning — a pentagram, an ankh, an Elder Futhark rune, a caduceus, an anchor — that carries cultural, spiritual, or functional significance and can be deployed as an icon, a repeating pattern element, a tattoo-style graphic, or a narrative shorthand.

## What's in here

Symbols are catalogued by category. Each category lives in its own subfolder:

| Subfolder | Category | Example entries |
|-----------|----------|-----------------|
| `celestial/` | Sun, moon, stars, planets, comets | sun, crescent-moon, eight-pointed-star |
| `elemental/` | Classical four/five elements | fire, water, air, earth |
| `alchemical/` | Alchemical and planetary-metal glyphs | alchemy-sulfur, alchemy-mercury, ouroboros |
| `astrological/` | Zodiac signs and astrological glyphs | aries, leo, scorpio |
| `sacred-geometry/` | Geometric/spiritual forms | flower-of-life, vesica-piscis, sri-yantra |
| `runes/` | Elder Futhark runic alphabet | fehu, ansuz, algiz |
| `hieroglyphs/` | Egyptian hieroglyphs and emblems | ankh, eye-of-horus, scarab |
| `religious/` | Religious / living-faith symbols (RESPECT) | cross, om, hamsa, yin-yang |
| `nautical/` | Sea-faring and tattoo-tradition marks | anchor, compass-rose, ships-wheel |
| `heraldic/` | Heraldic charges and ordinaries | fleur-de-lis, lion-rampant, chevron |
| `botanical/` | Plant symbols with coded meaning | rose, oak-leaf, lotus, laurel-wreath |
| `animal-totems/` | Animals as symbolic totems | wolf, raven, phoenix, bear |
| `mathematical/` | Math/science glyphs | infinity, atom, pi, golden-ratio |
| `signal-flags/` | International maritime signal flags | flag-alpha, flag-oscar |
| `_restricted/` | **DO NOT USE / use-with-care** flagged symbols | swastika-warning, ss-runes-warning, olympic-rings, red-cross-emblem |

The catalogue index is in [[_index]] and every entry follows [[_template]].

## How other sections and AI generation use this section

- **Section 08 (Visual Motifs)** references symbols as building blocks of larger compositions ("a poster built on a [[compass-rose]] motif").
- **Section 11 (Characters)** uses symbols as heraldry, sigils, tattoos, and iconography for invented Polymath characters.
- **Section 10 (Color Palettes)** and **Section 07 (Historical Design)** pair symbols with period-correct palettes and movements.
- **AI image/video prompts** lift the `visual description` and `remix_hooks` fields directly into generation prompts. The `emotional_tags` feed mood/style conditioning.
- **AI writing / storytelling** uses the `meaning`, `origin`, and `themes` fields as narrative shorthand and worldbuilding texture.
- **Database ingestion** (Notion / Airtable / Postgres / vector store) reads the YAML frontmatter. Field names are fixed by the bible's shared metadata standard — do not rename them.

## Section-specific conventions

1. **One symbol = one file.** Kebab-case filename, frontmatter `id` prefixed by category (e.g. `sym-celestial-sun`, `sym-rune-fehu`).
2. **Symbols are mostly very old (ancient/folk) and therefore PD by age** — but the *specific stylized rendering* you commission or generate is its own new copyright/asset. The frontmatter `pd_status` describes the **abstract symbol/idea**, never a particular artwork. A specific famous logo or treaty emblem is a different matter (see below).
3. **Three independent legal hazards** are tracked per the bible's doctrine (see [[../01-Legal-Guidelines/copyright-vs-trademark-vs-publicity]] when available; doctrine summarized in this section's `_restricted/` files):
   - **Copyright** — the abstract symbol is almost always PD; a *specific drawn version* (a 20th-c. artwork, a font glyph file, a corporate logo) can be protected.
   - **Trademark** — a symbol used as a brand identifier can be a live trademark forever (Olympic rings, Red Cross emblem, Apple's apple, the Playboy bunny). PD-by-age does **not** clear trademark.
   - **Statute / treaty** — a few symbols are protected by specific law independent of copyright/trademark: the Red Cross / Red Crescent / Red Crystal (Geneva Conventions + national criminal statutes), the Olympic rings (Olympic/Amateur Sports Acts and the Nairobi Treaty), national flags and government seals in some jurisdictions.
4. **Hate symbols** are NEVER used commercially, even when ancient and benign in origin (the swastika is the canonical example). The `_restricted/` subfolder documents the do-not-use set and references the [ADL Hate Symbols Database](https://www.adl.org/resources/hate-symbols/search) as the authoritative reference. These entries exist so the pipeline can *recognize and reject* them, not deploy them.
5. **Living-religion symbols** (cross, Om, Star of David, Khanda, hamsa, etc.) are PD as marks but carry an obligatory **RESPECT note**: use with cultural sensitivity, never mock sacred meaning, never slap a sacred symbol on a frivolous gag product, and be especially careful selling sacred symbols of a culture you do not belong to. These are `risk_level: caution` by default.
6. **Conservative default.** When status is genuinely uncertain, the entry is `pd_status: caution` (or `restricted`), `risk_level: caution`/`avoid`, with the reason spelled out in `risk_notes`. The safe failure mode for IP is "don't use it."

## Quick legal cheat-sheet (memorize)

| Want to use... | Copyright? | Trademark? | Statute/treaty? | Verdict |
|----------------|-----------|-----------|-----------------|---------|
| A pentagram, ankh, sun, anchor (abstract) | PD (ancient) | none | none | **Safe** — design your own rendering |
| The Olympic rings | n/a | yes (USOPC) | yes (Olympic Acts, Nairobi Treaty) | **Avoid** |
| Red Cross on white | n/a | restricted | yes (Geneva + 18 U.S.C. §706) | **Avoid** |
| The recycling "chasing arrows" | PD (dedicated to public 1970) | no | no | **Safe** |
| The peace sign (CND) | PD (released by designer) | no | no | **Safe** |
| The swastika | PD (ancient) | n/a | banned in some countries | **Avoid commercially** (hate association) |
| A real corporate logo | maybe | yes | maybe | **Avoid** unless licensed |

When in doubt, ask the Boss and default to **avoid**.
