# Source Material Bible

A legally-safe creative reference knowledge base for **VFXellence Ltd**'s content ecosystems. This vault is the single source of truth for every public-domain, openly-licensed, and remix-ready creative input that feeds Polymath's production lines: print-on-demand (POD), t-shirts, posters, children's books, storytelling, podcasts, video, blog, social media, merchandise, and AI image / video / writing generation.

It is built to be **database-ready**: every entry carries consistent YAML frontmatter so the whole vault can be ingested into Notion, Airtable, Postgres, or a vector store for retrieval-augmented generation (RAG) without re-tagging by hand.

---

## What this Bible is

- A curated library of source material — myths, folklore, literature, art movements, design systems, color palettes, symbols, archetypes, characters, quotes, and visual motifs — chosen and annotated for **commercial reuse safety**.
- A set of **frameworks and templates** that turn raw source material into shippable products (remix frameworks, prompt templates, design recipes).
- A **legal safety layer** that records, for every single item, whether it is safe to use, with what caveats, and what must never be done with it.
- A **living system** updated each January as new works enter the public domain.

## Who and what it serves

| Consumer | How it uses the Bible |
|----------|----------------------|
| **POD / t-shirt / poster pipelines** | Pull safe motifs, palettes, and quotes; check `risk_level` before printing. |
| **Children's books & storytelling** | Source PD characters, archetypes, and folk tales with clear reuse notes. |
| **Podcasts / video / blog / social** | Mine themes, quotes, and narrative hooks; cite verifiable sources. |
| **Viral content engines** | Match `themes` / `emotional_tags` / `visual_motifs` to trending categories. |
| **Polymath apps & automations** | Query the vault as a database via frontmatter fields. |
| **AI generation (image / video / writing)** | Feed prompt templates and design recipes; respect `risk_notes` to avoid restricted designs. |

---

## The 18 folders

| # | Folder | Role / rationale |
|---|--------|------------------|
| 01 | [[01-Legal-Guidelines]] | Canonical legal doctrine — PD cutoffs, copyright vs trademark vs publicity, the conservative rule. Every other section defers to this. |
| 02 | [[02-Public-Domain-Library]] | The master catalog of cleared public-domain source works, cross-cutting all media and eras. |
| 03 | [[03-Mythology]] | World mythologies (Greek, Norse, Egyptian, etc.) — ancient, free, and endlessly remixable narrative fuel. |
| 04 | [[04-Folklore]] | Fairy tales, legends, and folk traditions — communal stories with deep emotional and visual hooks. |
| 05 | [[05-Literature]] | Public-domain literary works and their texts — novels, poems, plays cleared for adaptation and quotation. |
| 06 | [[06-Historical-Art]] | Art movements and specific PD artworks — visual reference and style donors for image generation. |
| 07 | [[07-Historical-Design]] | Design systems and decorative styles (Art Deco, Bauhaus, etc.) — layout, ornament, and typographic DNA. |
| 08 | [[08-Color-Palettes]] | Reusable color systems tied to eras, movements, and moods — drop-in palettes for any product. |
| 09 | [[09-Symbols]] | Iconography and symbolic vocabulary — meaning-dense marks for logos, motifs, and storytelling shorthand. |
| 10 | [[10-Archetypes]] | Universal character and narrative archetypes — the structural skeleton behind every story and brand. |
| 11 | [[11-Characters]] | Specific reusable characters (PD and Polymath-original) with reuse status and design caveats. |
| 12 | [[12-Quotes]] | Public-domain and attributable quotations — typographic product fuel with verified provenance. |
| 13 | [[13-Visual-Motifs]] | Recurring visual elements (skulls, moons, botanicals) — composable building blocks for designs. |
| 14 | [[14-Trending-Categories]] | Market-facing niches and trends — connects source material to what actually sells. |
| 15 | [[15-Remix-Frameworks]] | Repeatable methods for transforming source material into original, defensible work. |
| 16 | [[16-Prompt-Templates]] | Tested AI prompt scaffolds for image, video, and writing generation, wired to the metadata schema. |
| 17 | [[17-Design-Recipes]] | Step-by-step production formulas combining sources, palettes, motifs, and prompts into finished products. |
| 18 | [[18-Yearly-Public-Domain-Updates]] | Annual log of newly-public-domain works — keeps the library current every January 1. |
| 20 | [[20-Controversial-Sources]] | Rights and brand-safety guide for sensitive-but-revenue-generating material: sacred texts (translation-rights trap, KJV-only rule), US government works (§ 105 free text vs. §§ 701/713 restricted seals), political content (right-of-publicity, trademark, platform-policy risk), comedian quotes (mostly avoid), and niche operating playbooks (faith, patriotic, political). |

---

## Safety doctrine (summary)

The full, authoritative rules live in **[[01-Legal-Guidelines]]** — read it before using anything commercially. In brief:

- **As of 2026**, US works published in **1930 or earlier are public domain**. The window advances one year every January 1 (1929 entered PD Jan 1 2025; 1930 entered Jan 1 2026). Post-1977 works: life of author + 70 years.
- **Copyright ≠ trademark ≠ right of publicity.** A work can be PD for its text yet still protected as a brand (e.g. Mickey Mouse) or a real person's likeness.
- **A PD text does not free a later visual design.** The *Frankenstein* novel is PD; Universal's bolt-neck monster design is not. The *Oz* books are PD; MGM's ruby slippers are not.
- **Translations, critical editions, annotations, specific fonts, and 20th-century artworks** can carry their own fresh copyright over old material.
- **When in doubt, don't.** Uncertain status is recorded as `pd_status: caution` (or `restricted`) with `risk_level: caution`/`avoid` and an explicit `risk_notes`. The safe failure mode for IP is "don't use it."

Every entry encodes this in its frontmatter via `pd_status`, `pd_basis`, `verified`, `risk_level`, and `risk_notes`.

---

## How to use this with AI (quickstart)

1. **Find source material.** Browse [[02-Public-Domain-Library]] or a themed folder (03–13). Confirm `pd_status` is `public-domain` or `openly-licensed` and `risk_level` is `safe`.
2. **Read the `risk_notes`.** This is the most important field for any legally-sensitive entry — it tells you what *not* to do (e.g. "use the PD text, never the Universal film design").
3. **Pick a remix framework.** Open [[15-Remix-Frameworks]] to choose a transformation method that produces original, defensible work.
4. **Grab a prompt template.** [[16-Prompt-Templates]] holds AI-ready scaffolds for image, video, and writing. They reference `themes`, `visual_motifs`, `color_palettes`, and `emotional_tags` directly.
5. **Follow a design recipe.** [[17-Design-Recipes]] chains a source + palette + motif + prompt into a finished, production-ready output for a specific product line.
6. **Check it sells.** Match against [[14-Trending-Categories]] before committing production time.
7. **Stay current.** Each January, review [[18-Yearly-Public-Domain-Updates]] for newly-cleared material.

When feeding the vault to an LLM or RAG system, ingest the frontmatter as structured metadata and the body as the document chunk — see [[DATABASE-READINESS]].

---

## Foundation documents

- [[METADATA-STANDARD]] — the canonical YAML frontmatter schema, every field defined with enums and examples.
- [[DATABASE-READINESS]] — how this markdown maps to Obsidian / Notion / Airtable / Postgres / vector stores, plus RAG chunking strategy.
- [[DOC-STANDARDS]] — file naming, required frontmatter, wikilink conventions, entry templates, and verification-flag rules.
- [[MAP]] — a visual tree of the entire Bible.

---

## Status

Coverage report: [[_COVERAGE-REPORT]] · Full entry index: [[INDEX]]
