# 07 — Historical Design Systems

This section catalogues the decorative vocabularies, pattern systems, typographic traditions, heraldic conventions, illuminated-manuscript borders, and vintage advertising/packaging styles that humanity has used to ornament objects, pages, walls, and brands for thousands of years. It is the visual-language wing of the Source Material Bible: where other sections give us *what* to depict (characters, myths, public-domain works), this section gives us *how to dress it* — the surface grammar of ornament, repeat, lettering, and layout.

## Why this section exists

Polymath ships into many surfaces — print-on-demand apparel, posters, children's books, merch, blog and social graphics, and AI-generated image/video/writing. Every one of those surfaces benefits from a coherent decorative vocabulary that is:

1. **Legally safe** — the *styles* here (an Art Deco sunburst, a Greek key border, a William Morris-style foliate repeat) are not copyrightable as abstract design languages. Ornamental grammar is centuries-old common property. What we flag carefully is the difference between *style* (free to emulate) and *specific protected assets* (a particular 20th-century artwork, a licensed font *file*, a living brand's trademarked logo).
2. **Reusable across sections** — a character from [[11-characters]] or a myth from the public-domain library can be rendered "in the style of" any system here. A children's book can adopt an illuminated-border frame; a podcast cover can borrow Art Deco geometry; a t-shirt can run a Celtic knot.
3. **AI-promptable** — each entry distills a system into concrete shapes, motifs, textures, and palette guidance an image model can act on, plus `remix_hooks` that suggest fresh combinations.

## How other sections / AI generation use this

- **As a "render style" layer.** Pick a subject from another section, then apply a system here: *"the Frankenstein creature rendered as a William Morris foliate woodcut"* or *"a Norse rune set framed in Celtic knotwork."*
- **As standalone design product.** Many of these systems are *themselves* sellable as patterns, borders, monograms, and seamless repeats (POD all-over print, gift wrap, phone cases, journals).
- **As a prompt vocabulary bank.** The `visual_motifs`, `symbols`, and body "Visual Vocabulary / Shapes / Textures / Palette" headings are written to be lifted directly into image-generation prompts.
- **As a legal gate.** Before generating "vintage" or "branded-looking" work, AI agents should consult the `risk_notes` field. Several entries (Art Deco specific posters, blackletter Nazi associations, specific font files, brand-evocative packaging) carry caution flags.

## Section-specific conventions

- **Style vs. asset.** We repeat one rule throughout: *a design style is free; a specific design is not.* "Art Deco" cannot be owned; a 1925 poster by a named artist who died in 1968 is in copyright until ~2039. Emulate the style; never reproduce the specific work.
- **Fonts: emulate the look, license the file.** Typography entries describe how to *evoke* a lettering tradition. They explicitly warn that the historical *style* (blackletter, inscriptional Roman, woodtype Western) is free, but any specific *font file/software* you use to set type is licensed by its foundry. Use openly-licensed faces (SIL OFL, public-domain revivals) or commission lettering. This is the single most common trap in this section.
- **Culturally-sensitive systems.** Aztec/Maya, Celtic, Islamic geometric, and paisley/South-Asian systems are living cultural heritage, not just "free clip art." `pd_status` may be `public-domain` for the historical motifs, but `risk_notes` flags appropriation/sacred-use concerns and steers toward respectful, generalized use.
- **One system per file**, with frontmatter + a fixed body structure (Defining Features, Visual Vocabulary, Shapes, Textures, Palette(s), Modern Remix, Legal & Risk, Related).
- **Subfolders** group by family: `ornamentation/`, `pattern-systems/`, `typography/`, `heraldry/`, `illuminated-borders/`, `vintage-advertising/`.

## Contents

### Ornamentation (`ornamentation/`)
Acanthus, arabesque, Greek key (meander), fleur-de-lis, paisley, damask, rinceau/scrollwork, egg-and-dart, palmette/anthemion, guilloche, strapwork, grotesque/grotteschi, rocaille (Rococo shell).

### Pattern Systems (`pattern-systems/`)
Islamic geometric, Celtic knotwork, Aztec/Maya, William Morris textiles, Victorian pattern, Art Deco geometric, toile de Jouy, chinoiserie, Greek/Roman mosaic, Japanese family-crest & wave (seigaiha) systems.

### Typography Influences (`typography/`)
Blackletter, Roman inscriptional (Trajan), Art Nouveau lettering, woodtype/Western display, Bauhaus geometric, Victorian/Tuscan ornamental, uncial/insular, copperplate/Spencerian script.

### Heraldry (`heraldry/`)
The heraldic system — tinctures, ordinaries, charges, division of the field, and the rules of blazon.

### Illuminated Borders (`illuminated-borders/`)
Medieval illuminated manuscript borders, decorated initials/versals, and marginalia/drollery.

### Vintage Advertising & Packaging (`vintage-advertising/`)
Victorian trade cards & chromolithography, early-20th-c. advertising layout, vintage label/packaging design, and the public-domain pictorial ornament tradition (Dover-style cuts, fleurons/printers' flowers).

## A note on `verified`

`verified: true` is set where the historical facts (a designer's death date, a movement's dates, a motif's antiquity) are well-established and uncontroversial. Where a precise public-domain calculation depends on a specific artist or edition, the entry stays `caution` and the body explains the line to walk.

See [[01-Legal-Guidelines/README]] for the canonical copyright/trademark/publicity doctrine this section follows.
