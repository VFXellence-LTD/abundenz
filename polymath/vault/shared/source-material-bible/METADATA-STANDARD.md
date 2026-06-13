# Metadata Standard

This is the **canonical YAML frontmatter schema** for the Source Material Bible. Every entry file in folders 02–17 carries this frontmatter at the top. Consistent field names and value enums are what make the entire vault ingestible as a database (see [[DATABASE-READINESS]]).

**Rule:** Keep field names **exactly** as specified. Include every field relevant to the entry; omit only fields that are genuinely not applicable. Never rename a field or invent a synonym — downstream Notion / Airtable / Postgres / vector ingestion maps on exact field names.

---

## The schema

```yaml
---
id: <kebab-unique e.g. pd-lit-frankenstein>
type: <source-work | character | quote | archetype | art-movement | design-system | symbol | color-palette | visual-motif | category | remix-framework | prompt-template | design-recipe | legal-doc | sop>
title: <string>
creator: <author/artist/culture or "Unknown/Traditional">
year: <publication/origin year or "Ancient">
country: <origin/first-pub>
pd_status: <public-domain | openly-licensed | caution | restricted | na>
pd_basis: <short reason e.g. "US: published 1900, term expired" | "life+70 expired" | "CC0" | "ancient/folk">
verified: <true | false>
themes: [..]
symbols: [..]
archetypes: [..]
visual_motifs: [..]
emotional_tags: [..]
applications: [<subset of: pod, tshirt, poster, childrens-book, story, podcast, video, blog, social, merch, character, brand, ai-image, ai-video, ai-writing>]
risk_level: <safe | caution | avoid>
risk_notes: <the single most important field for legally-sensitive entries — what NOT to do>
remix_hooks: [..]
source_url: <verifiable source if any>
tags: [..]
related: ["[[other-entry]]", ..]
created: 2026-05-31
---
```

---

## Field definitions

### Identity & classification

| Field | Type | Definition |
|-------|------|------------|
| `id` | string (kebab-case, unique) | Stable primary key for the entry. Convention: `<domain>-<subtype>-<slug>`, e.g. `pd-lit-frankenstein`, `myth-greek-medusa`, `palette-art-deco-miami`. Never reuse an `id`; it is the join key across databases. |
| `type` | enum (single) | The structural kind of entry. One value only. See enum below. |
| `title` | string | Human-readable display name, e.g. `Frankenstein; or, The Modern Prometheus`. |
| `creator` | string | Author, artist, originating culture, or `Unknown/Traditional` for folk material. |
| `year` | string/number | Year of publication or origin. Use `Ancient` for pre-dateable myth/folk material. |
| `country` | string | Country of origin or first publication, e.g. `UK`, `US`, `Greece (ancient)`. |

### Legal status (defers to [[01-Legal-Guidelines]])

| Field | Type | Definition |
|-------|------|------------|
| `pd_status` | enum (single) | Public-domain / licensing status. See enum below. |
| `pd_basis` | string | The *reason* for the status — short and verifiable. E.g. `US: published 1900, term expired`, `life+70 expired`, `CC0`, `ancient/folk`. |
| `verified` | boolean | `true` if the legal status has been checked against a source; `false` if asserted but not yet confirmed. Drives the verification workflow (see [[DOC-STANDARDS]]). |
| `risk_level` | enum (single) | Operational traffic light for production teams. See enum below. |
| `risk_notes` | string | **The single most important field for legally-sensitive entries.** Plain-language statement of what must *not* be done — e.g. "Use the PD novel text only; the Universal bolt-neck monster design is a separate live copyright — never reproduce it." |

### Creative tagging (arrays)

| Field | Type | Definition |
|-------|------|------------|
| `themes` | list of strings | Conceptual subject matter, e.g. `[ambition, hubris, isolation]`. |
| `symbols` | list of strings | Symbolic content present in or associated with the entry, e.g. `[fire, lightning, the stitched body]`. |
| `archetypes` | list of strings | Character/narrative archetypes present, e.g. `[the creator, the outcast, the doppelganger]`. |
| `visual_motifs` | list of strings | Recurring visual elements, e.g. `[laboratory, electrical arcs, graveyard]`. |
| `emotional_tags` | list of strings | Affective register for matching to mood-driven products, e.g. `[dread, melancholy, awe]`. |
| `remix_hooks` | list of strings | Concrete angles for transformation into original work, e.g. `[gender-flip the creator, cozy-horror children's version, retro sci-fi poster]`. |
| `tags` | list of strings | Free-form keywords for search/filtering not covered by the structured arrays. |

### Application & linking

| Field | Type | Definition |
|-------|------|------------|
| `applications` | list of enums | Which product lines / pipelines this entry feeds. Subset of the applications enum below. |
| `source_url` | string (URL) | A verifiable source confirming the entry's facts/status (e.g. Project Gutenberg, Wikimedia, Library of Congress). Omit if none. |
| `related` | list of wikilinks | `[[other-entry]]` links to related entries — the graph edges of the vault. |
| `created` | date (YYYY-MM-DD) | Date the entry was created. |

---

## Enumerations

### `type` (choose one)

`source-work` · `character` · `quote` · `archetype` · `art-movement` · `design-system` · `symbol` · `color-palette` · `visual-motif` · `category` · `remix-framework` · `prompt-template` · `design-recipe` · `legal-doc` · `sop`

### `pd_status` (choose one)

| Value | Meaning |
|-------|---------|
| `public-domain` | Copyright has expired or never applied; free to use commercially (subject to `risk_notes`). |
| `openly-licensed` | Under an explicit open license (CC0, CC-BY, etc.); free to use *per the license terms*. |
| `caution` | Status uncertain, or PD text but with restricted derivatives nearby. Proceed only after reading `risk_notes`. |
| `restricted` | Known to be under live copyright, trademark, or publicity rights. Do not use the protected element. |
| `na` | Not applicable (e.g. a Polymath-original framework, SOP, or invented character). |

### `risk_level` (choose one)

| Value | Meaning |
|-------|---------|
| `safe` | Clear to use commercially as described in the body. |
| `caution` | Usable but with specific constraints — read `risk_notes` first. |
| `avoid` | Do not use the restricted element; entry exists for reference/awareness. |

### `applications` (choose any subset)

`pod` · `tshirt` · `poster` · `childrens-book` · `story` · `podcast` · `video` · `blog` · `social` · `merch` · `character` · `brand` · `ai-image` · `ai-video` · `ai-writing`

---

## Worked examples

### A public-domain source work (literature)

```yaml
---
id: pd-lit-frankenstein
type: source-work
title: "Frankenstein; or, The Modern Prometheus"
creator: Mary Shelley
year: 1818
country: UK
pd_status: public-domain
pd_basis: "Published 1818; author d. 1851; life+70 and US term long expired"
verified: true
themes: [ambition, hubris, creation, isolation, responsibility]
symbols: [fire, lightning, the stitched body]
archetypes: [the creator, the outcast, the doppelganger]
visual_motifs: [laboratory, electrical arcs, graveyard, arctic waste]
emotional_tags: [dread, melancholy, awe, pity]
applications: [story, childrens-book, poster, ai-writing, ai-image, podcast]
risk_level: caution
risk_notes: "The 1818 novel text is fully PD. The iconic flat-headed, bolt-necked green monster is Universal Pictures' 1931 film design and is a SEPARATE live copyright/trademark — never reproduce it. Design an original creature from the text description instead."
remix_hooks: [gender-flip the creator, cozy-horror childrens version, retro sci-fi poster, epistolary podcast]
source_url: "https://www.gutenberg.org/ebooks/84"
tags: [gothic, sci-fi, horror, romantic-era]
related: ["[[the-creator]]", "[[prometheus]]", "[[gothic-horror-palette]]"]
created: 2026-05-31
---
```

### An openly-licensed / CC0 entry (color palette)

```yaml
---
id: palette-art-deco-miami
type: color-palette
title: "Art Deco Miami"
creator: Polymath (derived from era references)
year: 2026
country: na
pd_status: openly-licensed
pd_basis: "Color values are uncopyrightable facts; palette compiled by Polymath, released CC0"
verified: true
themes: [glamour, geometry, coastal, jazz-age]
symbols: []
archetypes: []
visual_motifs: [sunbursts, chevrons, pastel gradients]
emotional_tags: [optimism, elegance, nostalgia]
applications: [poster, pod, tshirt, ai-image, brand]
risk_level: safe
risk_notes: "Color values themselves are not copyrightable. Do not copy a specific copyrighted artwork's exact composition; use the palette as a starting point only."
remix_hooks: [pair with chevron motif, use for travel-poster series]
source_url: ""
tags: [palette, deco, pastel]
related: ["[[art-deco]]", "[[chevron]]"]
created: 2026-05-31
---
```

### A restricted-for-awareness entry

```yaml
---
id: ref-restricted-mgear-ruby-slippers
type: visual-motif
title: "Ruby Slippers (MGM design)"
creator: MGM / Adrian (costume design)
year: 1939
country: US
pd_status: restricted
pd_basis: "Specific 1939 film costume design under live copyright; 'Wizard of Oz' marks are trademarked"
verified: true
themes: [home, journey, magic]
symbols: [ruby slippers]
archetypes: []
visual_motifs: [sparkling red shoes]
emotional_tags: [longing, wonder]
applications: []
risk_level: avoid
risk_notes: "The L. Frank Baum Oz BOOKS (1900–1920) are PD, but the books describe SILVER shoes. The ruby slippers are MGM's 1939 film invention and remain restricted. Use silver shoes / original designs only."
remix_hooks: []
source_url: ""
tags: [oz, caution-reference]
related: ["[[wonderful-wizard-of-oz]]", "[[01-Legal-Guidelines]]"]
created: 2026-05-31
---
```

---

See [[DOC-STANDARDS]] for how these fields interact with the verification workflow and [[DATABASE-READINESS]] for the field-to-column mapping.
