---
id: prompt-merch-pod-generation
type: prompt-template
title: Merch / POD Generation — Design Brief to Marketplace Listing
applications: [merch, pod, ai-image, brand]
model_targets: [midjourney, sdxl, flux, dalle, gpt, claude]
tags: [prompt-template, merch, pod, design-brief, listing, marketplace, etsy, redbubble, design-recipe, trend, gpt, claude, midjourney, sdxl, flux]
related: ["[[shared/slot-resolution-protocol]]", "[[shared/model-parameter-cheatsheet]]", "[[shared/negative-prompt-library]]", "[[01-Legal-Guidelines/README]]", "[[08-Color-Palettes/README]]", "[[13-Visual-Motifs/README]]", "[[17-Design-Recipes/README]]", "[[19-Trend-Dictionary/README]]"]
created: 2026-05-31
---

# Merch / POD Generation — Design Brief to Marketplace Listing

## Purpose

Runs the full pipeline from a design input (a [[17-Design-Recipes]] recipe or a [[19-Trend-Dictionary]] GO/HOLD phrase) through to a complete, publishable marketplace output: AI image prompt, product title, tag string (Etsy / Redbubble format), and product description. Every creative element inherits the legal status of the Bible entries it draws on. A design built on a `caution` recipe or trend phrase carries those caveats into the listing — the template surfaces them explicitly so the operator can make an informed publish decision. Run [[shared/slot-resolution-protocol]] and [[shared/legal-preflight]] before publishing.

## Slot Table

| Slot | Source section | Required? | What to put | Example fill (real entry) |
|---|---|---|---|---|
| `[RECIPE]` | [[17-Design-Recipes]] | one of `[RECIPE]` or `[TREND]` required | A complete design recipe (supplies formula, palette, motif, and product type) | `recipe-pharaoh-cosmos-tee` → "Egyptian symbol + Anubis/falcon + Pharaohz Gold & Lapis + art-deco caps + wisdom quote" |
| `[TREND]` | [[19-Trend-Dictionary]] (GO or HOLD phrases only) | one of `[RECIPE]` or `[TREND]` required | A trend phrase to anchor the design concept | `trend-slay` → "slay = excel/look amazing; dragon-slayer literal pun differentiator; empowerment merch" |
| `[PALETTE]` | [[08-Color-Palettes]] | yes (or inherited from recipe) | Color system for image and listing | `palette-pharaohz-gold-lapis` → lapis blue, pharaoh gold, faience teal, papyrus cream |
| `[MOTIF]` | [[13-Visual-Motifs]] | optional (or inherited from recipe) | Decorative element for image | `motif-retro-sunbursts` → centered radiating rays |
| `[PRODUCT_TYPE]` | inline | yes | The physical product | "unisex t-shirt / 18×24 art poster / 11oz mug / sticker sheet / tote bag" |
| `[STYLE]` | [[06-Historical-Art]] | optional | Art-movement style for image generation | `art-greek-roman` → classical illustration |
| `[MOOD]` | inline | optional | Emotional register of the image | "awe-inspiring and cosmic / playful and punchy / cerebral and cool" |
| `[KEYWORDS]` | inline | yes | Search-intent terms for the listing | "egyptian mythology tee, ancient god shirt, mythology merch" |
| `[MARKETPLACE]` | inline | yes | Target platform (affects title length and tag count) | "Etsy / Redbubble / Merch by Amazon / Society6" |

## Platform Listing Formats

| Platform | Title max | Tags | Description |
|---|---|---|---|
| Etsy | 140 chars | 13 tags, each ≤20 chars | 100–160 words recommended |
| Redbubble | 50 chars | up to 15 tags | 100 words |
| Merch by Amazon | 60 chars | brand + 2 keywords in fields | 2000-char description (use 150 words) |
| Society6 | 50 chars | 15 tags | 100–130 words |

## Base Prompt — Image Generation Step

```
Design brief:
- Recipe / concept: [RECIPE or TREND-derived concept].
- Formula (if recipe): [formula from recipe entry, e.g. "[Symbol] + [Animal] + [Palette] + [Type] + [Quote]"].
- Product type and output dimensions: [PRODUCT_TYPE] — see [[shared/model-parameter-cheatsheet]] for aspect ratios per product.
- Color palette: [PALETTE] — hex values and roles.
- Decorative motif: [MOTIF].
- Art style: [STYLE].
- Mood: [MOOD].
- Negative (mandatory): [from [[shared/negative-prompt-library]]] + no franchise design, no real person likeness, no logo, no watermark, no protected symbol arrangement.

Generate: AI image prompt for [target model] formatted for [PRODUCT_TYPE] dimensions.
```

## Base Prompt — Listing Generation Step

```
You are a marketplace listing specialist. Generate a complete listing for [MARKETPLACE] for the following product.

Product: [PRODUCT_TYPE].
Design concept: [1-2 sentence design description derived from [RECIPE] or [TREND]].
Palette: [PALETTE name and mood descriptor].
Target buyer: [describe using archetype register from the recipe's archetype field].
Keywords to work in: [KEYWORDS].
Listing format requirements: [MARKETPLACE-specific format from table above].

Deliver:
1. TITLE: under [title max for marketplace] characters; lead with most searchable noun, then style/mood, then occasion.
2. TAGS: [tag count for marketplace] tags, each under [char limit] characters; mix short head terms and 3+ word long-tail phrases.
3. DESCRIPTION: [word count for marketplace] words; hook sentence, 2–3 sentences about design/feel, 1 sentence on physical specs (leave [SPECS] as a placeholder), 1 sentence on gift suitability.

Restrictions: no trademark terms, no celebrity names, no copyrighted franchise titles, no false claims of authenticity or exclusivity.
```

## Worked Examples

### Example 1 — Recipe Input: Pharaoh-Cosmos Tee (Full Pipeline)

**Slots:**
- `[RECIPE]` = `recipe-pharaoh-cosmos-tee` → Egyptian Symbol + Falcon/Jackal + Pharaohz Gold & Lapis + Art-Deco/Geometric Caps + Wisdom Quote
- `[PALETTE]` = `palette-pharaohz-gold-lapis` (inherited from recipe)
- `[MOTIF]` = star-chart hieroglyphs (specified in recipe `visual_motifs`)
- `[PRODUCT_TYPE]` = "unisex t-shirt, standard POD dimensions"
- `[STYLE]` = geometric / art-deco illustration, Egyptian-inspired
- `[MOOD]` = "awe-inspiring, cosmic, ancient, regal"
- `[KEYWORDS]` = "egyptian mythology shirt, ancient god tee, anubis shirt, mythology merch, space pharaoh"
- `[MARKETPLACE]` = "Etsy"

**Step 1 — Image prompt (Midjourney):**
```
Anubis-headed figure in a space suit rendered in Egyptian art-deco geometric style, haloed golden sun-disc helmet, ankh staff, hieroglyphs reinterpreted as a star-chart in the background, lapis-lazuli blue ground #1A3A6B, pharaoh gold details #D4AF37, faience teal #0E7C7B accent, art-deco geometric panel borders, cosmic starfield behind, centered symmetrical composition, high-contrast graphic illustration suitable for apparel print, black void outside panel, bold and awe-inspiring --ar 1:1 --stylize 300 --v 6 --no NASA logo, Marvel, Moon Knight suit, specific game character, photorealistic, watermark, text, logo
```

**Step 2 — Etsy listing:**

*Title (138 chars):*
```
Egyptian Mythology T-Shirt | Anubis Space Pharaoh Graphic Tee | Ancient God Cosmos Unisex Shirt
```

*Tags (13):*
```
egyptian mythology tee, anubis shirt, space pharaoh, ancient god graphic, mythology merch, cosmic egypt tee, art deco graphic, lapis gold print, esoteric gift, history lover shirt, unisex graphic tee, celestial mythology, afterlife art
```

*Description:*
```
Where the afterlife meets the cosmos.

This unisex graphic tee puts an Anubis-headed figure in full Egyptian-deco regalia against a lapis-blue starfield, hieroglyphs redrawn as a constellation map in pharaoh gold. It is ancient mythology, outer space, and bold geometric line-art — all on a single shirt.

Premium cotton blend, [SPECS]. Printed with archival-quality inks that hold up to washing.

Perfect for the mythology obsessive, the space nerd, or anyone who thinks the ancients were already thinking about the stars.
```

**Legal note:** `recipe-pharaoh-cosmos-tee` risk_level: **safe**. Egyptian iconography is ancient PD. `palette-pharaohz-gold-lapis` risk_level: **safe**. Hard negatives applied: no NASA logo, no Moon Knight, no specific game design. Do not use "Stargate," "Marvel," or any franchise name in the listing.

---

### Example 2 — Trend Input: `trend-slay` + Bible Influences → Dragon-Slayer Punster Tee

**Slots:**
- `[TREND]` = `trend-slay` → ship_decision: HOLD (operator must spot-check TM before publishing); the literal dragon/sword pun differentiates from saturated plain-text market
- `[PALETTE]` = `palette-regaliz-jewel` → plum, emerald, cobalt, gold accent — "glam palette" as noted in trend's remix_hooks
- `[MOTIF]` = `motif-badges-and-crests` → heraldic crest framing
- `[PRODUCT_TYPE]` = "unisex t-shirt"
- `[STYLE]` = `art-greek-roman` + heraldic illustration fusion → classical-crest graphic style
- `[MOOD]` = "bold, empowering, a little cheeky"
- `[KEYWORDS]` = "slay tshirt, dragon slayer graphic, empowerment tee, fantasy shirt, heraldic tee"
- `[MARKETPLACE]` = "Redbubble"

**Step 1 — Image prompt (Flux):**
```
Heraldic crest emblem featuring a warrior silhouette mid-leap over a defeated dragon, set inside a classic badge/shield frame with ornate jewel-tone borders. Palette: plum #4B1248 shield, emerald #0F5C4A dragon, cobalt #1B3A8C banner, gold accent #C9A227 crest details. Bold empowerment graphic illustration, clean linework, flat heraldic style, the word SLAY in large embossed gold caps on a banner ribbon below the crest. Design suitable for t-shirt print, centered composition, print-ready, high contrast. Avoid: any specific real-world coat of arms, recognizable franchise character, real person likeness, copyright symbol, logo, watermark.
```

**Step 2 — Redbubble listing:**

*Title (48 chars):*
```
Slay Dragon Heraldic Crest Graphic Tee
```

*Tags (15):*
```
slay tee, dragon slayer, heraldic crest, fantasy shirt, empowerment tee, bold graphic, jewel tones, medieval style, warrior shirt, fantasy gift, slaying it, badge graphic, gothic aesthetic, unisex shirt, crest design
```

*Description:*
```
Here for those who slay — literally.

A full heraldic crest featuring a warrior leaping over a dragon, rendered in jewel-tone plum and gold on a classic badge frame. Bold, slightly absurd, entirely intentional. The word SLAY on the ribbon banner is not subtle, and that is the point.

[SPECS]. Available in a range of colors and styles.

For the dragon-slayer in everyone's group chat.
```

**Legal note:** `trend-slay` ship_decision: **HOLD** — operator must run TM spot-check on Class 25 (apparel) for "SLAY" before listing. The term itself has no copyright; risk is from possible existing marks on the bare word in apparel. The dragon-slayer literal pun design differentiates meaningfully from saturated plain-text "SLAY" shirts. `palette-regaliz-jewel` risk_level: **safe**. `motif-badges-and-crests` risk_level: **caution** (avoid replicating any real nation's or institution's coat of arms — this design uses an invented crest, safe). Apply [[shared/legal-preflight]] before publishing.

---

### Example 3 — Recipe Input: Art Deco Sunburst Poster + Wisdom Quote

**Slots:**
- `[RECIPE]` = `recipe-deco-sunburst-poster` → Sunburst/Geometric Symbol + Optional Deco Animal + Gatzby Deco + Art-Deco Display Type + Glamour Quote
- `[PALETTE]` = `palette-gatzby-deco` (inherited from recipe)
- `[MOTIF]` = `motif-retro-sunbursts` (inherited from recipe)
- `[PRODUCT_TYPE]` = "18×24 art poster"
- `[STYLE]` = Art Deco geometric illustration
- `[MOOD]` = "glamorous, elegant, boldly geometric, nostalgic-optimist"
- `[KEYWORDS]` = "art deco poster, gold sunburst print, vintage wall art, 1920s style poster, geometric art print"
- `[MARKETPLACE]` = "Etsy"
- Quote to include: `quote-wisdom-collection Q01` — *"The unexamined life is not worth living."* — Socrates (PD, Jowett trans.)

**Step 1 — Image prompt (Midjourney):**
```
Art Deco sunburst poster, centered geometric gold sunburst radiating 24 equal rays on near-black lacquer ground #0B0B0B, a stylized peacock in deco line-art at the center circle, deco gold #C9A227, teal #0E6E6E accent geometric bands at top and bottom, ivory #F4EFE6 typeface: "THE UNEXAMINED LIFE IS NOT WORTH LIVING" in all-caps art deco geometric display type, "— Socrates" attribution in smaller caps below, poster layout 18:24 proportions, bilateral symmetry, clean vector illustration quality, print-ready, no gradients --ar 3:4 --stylize 250 --v 6 --no photography, photorealism, Gatsby film imagery, modern corporate design, logo, watermark
```

**Step 2 — Etsy listing:**

*Title (139 chars):*
```
Art Deco Sunburst Philosophy Poster | Socrates Quote Wall Art | Gold Geometric Print | 18x24 Vintage Style
```

*Tags (13):*
```
art deco poster, gold sunburst print, philosophy wall art, socrates quote, vintage wall art, 1920s style print, geometric art print, wisdom poster, gold and black print, home office art, stoic decor, quote poster, minimalist wall art
```

*Description:*
```
Glamour meets philosophy.

A bold Art Deco sunburst in pharaoh gold and peacock teal frames Socrates' most enduring line in geometric display caps: "The unexamined life is not worth living." Bilateral symmetry, lacquer-black ground, deco craftsmanship — the visual language of the Golden Age in service of the oldest idea.

Museum-quality paper, [SPECS]. Ships rolled in a protective tube.

A striking gift for the reader, the thinker, or anyone whose walls deserve better than a motivational cloud.
```

**Legal note:** `recipe-deco-sunburst-poster` risk_level: **caution** — Art Deco style PD; do NOT brand as "Gatsby." `quote-wisdom-collection Q01` is `pd_verified: true`; attribution rendered exactly per [[12-Quotes/wisdom]]. `palette-gatzby-deco` risk_level: **caution** — see palette `risk_notes`: market by color/style description, never by invoking the Gatsby film. Do not use "Gatsby" in any listing field. `motif-retro-sunbursts` risk_level: **caution** — generic centered sunburst is safe; avoid the 16-ray imperial Japanese arrangement.

## Legal Pre-Flight

Sections this template touches: 08-Color-Palettes, 13-Visual-Motifs, 17-Design-Recipes, 19-Trend-Dictionary. Before publishing: confirm `[RECIPE]` risk_level and apply all its `risk_notes` (especially "do not brand as X" warnings); confirm any `[TREND]` slot has ship_decision: GO or HOLD-with-TM-check, never AVOID; confirm all quotes from [[12-Quotes]] are `pd_verified: true` and attribution is exact; confirm no trademark term appears in the listing title, tags, or description; run [[shared/legal-preflight]].

---
*Part of [[16-Prompt-Templates/README]]. Resolve slots per [[shared/slot-resolution-protocol]]. Defers to [[01-Legal-Guidelines/README]].*
