# 06 — Historical Art Movements

This section catalogues the major historical art movements as **design inspiration** for VFXellence Ltd's content ecosystems. Each movement is a reusable visual language — a defined set of shapes, palettes, textures, compositions, and motifs that can be emulated to give a product a recognizable look (an "Art Deco poster," a "Ukiyo-e t-shirt," a "Bauhaus brand system") without copying any single protected artwork.

Every other section that generates visuals — [[16-Prompt-Templates/README]], [[17-Design-Recipes/README]], [[13-Visual-Motifs/README]], [[08-Color-Palettes/README]] — draws on this section for the *style vocabulary* it feeds into prompts. This section defers to [[01-Legal-Guidelines/README]] for all rights determinations.

## The one rule that governs this entire section

**You can freely emulate a STYLE. You cannot copy a specific WORK that is still in copyright.**

A *style* — pointillist dots, Cubist faceting, Deco sunbursts, Ukiyo-e flat color with bold outlines — is not protected by copyright. Copyright protects a *particular expression* (this exact painting, this exact composition), not a general manner of working. So generating "a portrait in the style of Cubism" is safe; reproducing Picasso's *Les Demoiselles d'Avignon* is not.

This split matters most for the **20th-century movements**. For pre-1900 movements (Prehistoric through Post-Impressionism, Ukiyo-e, early Symbolism), the specific famous works are almost always public domain because their copyright terms have long expired. For 20th-century movements (Fauvism, Cubism, Futurism, Expressionism, Dada, Surrealism, Bauhaus, Art Deco, Constructivism, Abstract Expressionism, Pop Art), **the style is still free to emulate but many specific works and artists remain in copyright**, and several estates (Picasso, Matisse, Dalí, Magritte, Warhol, Lichtenstein, Mondrian/Mondrian's heirs, Kandinsky, the Bauhaus archive) are actively litigious. Emulate the movement; never reproduce a named work or a signature one-off composition.

See [[01-Legal-Guidelines/pd-source-vs-modern-adaptation]] and [[01-Legal-Guidelines/us-public-domain-cutoff]] for the underlying mechanics.

## How this section is used

### By human operators
Pick a movement file. Read its **Visual Vocabulary**, **Palette**, **Shapes & Textures**, and **Key Motifs** to brief an illustrator or to write an AI prompt. Read its **Rights Note** before publishing anything that leans on the movement, especially the 20th-century ones.

### By AI generation systems
Each movement entry is a structured style pack. A prompt pipeline reads the frontmatter (`visual_motifs`, `themes`, `emotional_tags`, `applications`) and the **Modern Remix Opportunities** section to assemble a generation prompt, then reads `risk_level` / `risk_notes` to decide whether the resulting image is safe to publish. The hard machine rule: **a prompt may name a movement/style; a prompt must never name a still-in-copyright artist or reproduce a specific titled work.** When a prompt would name a living-or-recent artist's signature work, the pipeline downgrades to `risk_level: avoid`.

## Three-tier rights model for art movements

| Tier | Movements | Status of specific works | What you can do |
|---|---|---|---|
| **Tier 1 — PD era** | Prehistoric, Egyptian, Greek/Roman, Byzantine, Medieval/Illuminated, Gothic, Renaissance, Baroque, Rococo, Neoclassical, Romanticism, Realism, Impressionism, Post-Impressionism, Symbolism (19thC), Ukiyo-e, Art Nouveau, Arts & Crafts | Famous works generally public domain (artists died >70 yrs ago / published pre-1930). | Emulate the style **and** reference/recreate specific famous works that are confirmed PD. Mind photo-reproduction and museum-image terms. |
| **Tier 2 — mixed** | Fauvism, Futurism, Constructivism, Expressionism, Dada | Some works PD, many still in copyright (artists died after 1955). | Emulate the style freely. Treat specific named works as `caution` unless confirmed PD. |
| **Tier 3 — live copyright + litigious estates** | Cubism, Surrealism, Bauhaus, Art Deco (specific designers), Abstract Expressionism, Pop Art | Most signature works still in copyright; estates enforce aggressively. | Emulate the style only. **Never** reproduce a named work or a signature one-off (e.g. a Campbell's Soup can, a melting clock, a Mondrian grid sold as "a Mondrian"). |

## Section-specific conventions

- **One file per movement**, kebab-case (`art-deco.md`, `ukiyo-e.md`).
- **`type: art-movement`** on every entry.
- **`pd_status` describes the STYLE, not individual works.** The style itself is never copyrightable, so `pd_status` reflects whether the movement's *representative works* are generally PD: `public-domain` for Tier 1, `caution` for Tier 2/3. The `risk_notes` field always carries the operative warning.
- **`verified: true`** only where the era's PD status is settled by plain term expiry (pre-1900 movements). 20th-century movements stay `verified: false` because the conclusion is work-specific.
- Two non-movement support files round out the section: [[movement-timeline]] (chronological index + tier map) and [[style-emulation-vs-copying]] (the canonical do/don't for prompts).

## File index

| File | Era | Tier | Notes |
|---|---|---|---|
| [[prehistoric]] | c.40,000–3,000 BCE | 1 | Cave painting, petroglyphs |
| [[egyptian]] | c.3,000–300 BCE | 1 | Profile convention, hieroglyphic order |
| [[greek-roman]] | c.800 BCE–400 CE | 1 | Classical proportion, fresco, mosaic |
| [[byzantine]] | c.330–1450 | 1 | Gold-ground icons, mosaic |
| [[medieval-illuminated]] | c.500–1500 | 1 | Manuscript illumination, marginalia |
| [[gothic]] | c.1140–1500 | 1 | Pointed arch, stained glass, tracery |
| [[renaissance]] | c.1400–1600 | 1 | Linear perspective, sfumato, balance |
| [[baroque]] | c.1600–1750 | 1 | Drama, chiaroscuro, movement |
| [[rococo]] | c.1720–1780 | 1 | Pastel, asymmetry, ornament |
| [[neoclassical]] | c.1760–1850 | 1 | Restraint, line, antiquity |
| [[romanticism]] | c.1800–1850 | 1 | Sublime, emotion, nature |
| [[realism]] | c.1840–1880 | 1 | Ordinary life, unidealized |
| [[impressionism]] | c.1860–1890 | 1 | Broken color, light, plein air |
| [[post-impressionism]] | c.1885–1905 | 1 | Structure, symbolic color |
| [[symbolism]] | c.1880–1910 | 1/2 | Dream, myth, decadence |
| [[ukiyo-e]] | c.1660–1900 | 1 | Woodblock, flat color, bold outline |
| [[art-nouveau]] | c.1890–1910 | 1 | Whiplash line, organic, floral |
| [[arts-and-crafts]] | c.1860–1910 | 1 | Honest craft, pattern, nature |
| [[fauvism]] | c.1904–1910 | 2 | Wild non-natural color |
| [[cubism]] | c.1907–1925 | 3 | Faceting, multiple viewpoints |
| [[futurism]] | c.1909–1930 | 2 | Speed, motion lines, dynamism |
| [[expressionism]] | c.1905–1930 | 2 | Distortion, raw emotion |
| [[dada]] | c.1916–1924 | 2/3 | Collage, anti-art, absurd |
| [[surrealism]] | c.1924–1950 | 3 | Dream logic, impossible juxtaposition |
| [[bauhaus]] | c.1919–1933 | 3 | Geometry, primary color, function |
| [[art-deco]] | c.1920–1939 | 3 | Sunburst, chevron, luxury geometry |
| [[constructivism]] | c.1915–1935 | 2 | Diagonal, photomontage, agitprop |
| [[abstract-expressionism]] | c.1943–1965 | 3 | Gesture, field, scale |
| [[pop-art]] | c.1956–1970 | 3 | Mass media, commercial imagery |
| [[movement-timeline]] | — | — | Chronological index + tier map |
| [[style-emulation-vs-copying]] | — | — | Canonical do/don't for prompts |

---
*Part of the Polymath Source Material Bible — Section 06 Historical Art Movements. Style is free to emulate; specific copyrighted works are not. Defers to Section 01 for all rights calls. Not legal advice.*
