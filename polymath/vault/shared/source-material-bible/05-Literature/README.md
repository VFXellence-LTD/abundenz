# 05 — Literature: Public Domain Literary Source Material

This is the **dated-cutoff-sensitive catalogue** of the Polymath Source Material Bible. It holds the literary works — novels, plays, poems, stories, characters, and lines — that VFXellence Ltd's content ecosystems can draw on across print-on-demand, t-shirts, posters, children's books, written storytelling, podcasts, video, blog, social, merch, and AI-generated image / video / writing.

Literature is the single richest seam of safe, reusable creative material on the planet — but it is also the seam where the most expensive mistakes hide. A novel can be public domain in its original text and still wrapped in live trademarks, perpetual royalties, copyrighted translations, or restricted film designs. This section catalogues the works **and flags the traps**, so a human or an AI pipeline can tell the difference before publishing.

## Relationship to Section 01 (Legal Guidelines)

This section **defers entirely** to [[01-Legal-Guidelines/README]]. Section 01 is canonical for all rights questions; if anything here conflicts with section 01, section 01 wins. In particular:

- The moving public-domain cutoff line is defined in [[01-Legal-Guidelines/us-public-domain-cutoff]].
- The copyright / trademark / right-of-publicity distinction is defined in [[01-Legal-Guidelines/copyright-vs-trademark-vs-likeness]].
- The "public-domain text does not free a modern visual design" rule is in [[01-Legal-Guidelines/pd-source-vs-modern-adaptation]].
- The executable safe / caution / avoid policy is [[01-Legal-Guidelines/decision-tree]].

## The dated cutoff (read this before trusting any entry)

As of **2026**, US works **published in 1930 or earlier are public domain** (95-year term; 1929 entered the public domain on 1 January 2025, 1930 on 1 January 2026). The line advances one calendar year every 1 January. Works first published in the US in **1931 are still under copyright until 1 January 2027**, 1932 until 2028, and so on.

This is why this section is "dated-cutoff-sensitive": several entries here sit right on the edge (e.g. anything from the late 1920s and 1930s), and a handful are explicitly *not yet free* and are catalogued only so the pipeline knows to wait. Section 18 tracks the annual rollover; see [[18-Yearly-Public-Domain-Updates/README]].

Post-1977 works follow **life of the author + 70 years**. A few entries here flag works whose original text is old but whose author died recently enough that a specific later edition or the work as a whole may still be restricted in some jurisdictions.

## The five recurring trap patterns

Every entry's `risk_notes` field is written against these five patterns. They are the heart of why this section exists.

1. **Live trademark over public-domain text.** The *story* is free; the *brand identity* is not. Tarzan and John Carter are the textbook cases — early novels are public domain in the US, but "TARZAN" and "JOHN CARTER" are live registered trademarks owned by Edgar Rice Burroughs, Inc., and the estate polices commercial use of the names and marketing.
2. **Perpetual or special-statute royalties.** *Peter Pan* in the UK carries a perpetual right to royalties granted by statute to Great Ormond Street Hospital (GOSH). The US text is public domain; UK commercial exploitation can still owe GOSH.
3. **Public-domain book vs. restricted later adaptation.** *Winnie-the-Pooh*: A. A. Milne's 1926 book entered the US public domain on 1 January 2022, so the original Ernest Shepard-illustrated Pooh is usable — but Disney's redesigned Pooh (red shirt, modern proportions) is a separate live copyright and trademark. The same pattern governs Dracula (Stoker text free; Universal's 1931 Lugosi look restricted) and the Wizard of Oz (Baum's books free; MGM ruby slippers restricted).
4. **Litigious estates over already-free works.** Sherlock Holmes: the entire Arthur Conan Doyle canon is public domain in the US (the last stories, *The Case-Book*, entered the public domain on 1 January 2023). The Conan Doyle Estate nonetheless litigated for years over claimed traits, and is historically aggressive. The text is free; expect noise.
5. **Old underlying work, new copyrighted layer.** A 2018 Emily Wilson translation of Homer's *Odyssey* is under copyright even though the Greek original is ancient. Critical editions, scholarly annotations, modern introductions, specific font files, and specific 20th-century cover artworks each carry their own copyright independent of the public-domain underlying text. Always use an old, out-of-copyright edition or translation.

## How AI generation systems should use this section

A downstream prompt or generation pipeline should treat each entry as a record:

- Read `pd_status` and `risk_level` to decide whether the work may be used at all.
- Read `risk_notes` **before** generating — it states the single most important thing *not* to do (e.g. "use the text, never the Disney design"; "avoid the name TARZAN as a brand").
- Pull `themes`, `symbols`, `archetypes`, `visual_motifs`, and `emotional_tags` as creative seed material.
- Use `remix_hooks` as ready-made angles for products.
- Prefer drawing **characters, themes, plots, public-domain quotes, and original-edition imagery** — never a specific later studio's visual design, never a brand name, never a recent translation.

When an entry is `caution` or `restricted`, the safe move is to use the underlying public-domain story while deliberately *avoiding* the named restricted layer. When status is genuinely uncertain, treat it as `caution` and escalate.

## Section-specific conventions

- **One file per work / character / quote**, kebab-case `.md`, sorted into the era/genre subfolders below.
- **`pd_basis` always names the mechanism**, not just a verdict: publication year + the rule (e.g. "US: published 1897, 95-yr term expired 1973-ish; PD since well before 1930 cutoff line").
- **`verified: true` only for settled cases.** An English-language work plainly published before the cutoff with no live-trademark or estate complication is `verified: true`. Anything depending on trademark scope, fair use, jurisdiction, or a moving date stays `verified: false`.
- **Country matters.** US public-domain status is the default lens, but several entries flag divergent UK / EU status (Peter Pan, anything by an author who died fewer than 70 years ago).
- **Traps get their own cross-reference folder.** The `traps/` subfolder holds dedicated trap entries (Sherlock, Peter Pan, Pooh, Tarzan/John Carter, translations, critical editions) that other sections and the pipeline can link to directly.

## Subfolder index

| Subfolder | Era / genre | Examples |
|---|---|---|
| `ancient-classical/` | Antiquity through Rome | Homer, Aesop, Ovid, Sophocles, Virgil |
| `medieval/` | ~500–1500 | Beowulf, Dante, Chaucer, Arthurian romance, *1001 Nights* |
| `renaissance-shakespeare/` | 1500–1650 | Shakespeare, Marlowe, *Don Quixote*, Milton |
| `18-19th-novels/` | 1700–1900 | Austen, Dickens, the Brontës, Twain, Melville, Tolstoy |
| `gothic-horror/` | Gothic & horror | *Frankenstein*, *Dracula*, *Jekyll and Hyde*, Poe, Lovecraft (partial) |
| `early-scifi/` | Early science fiction | Verne, Wells, Shelley, Burroughs (with trap notes) |
| `poetry/` | Verse | Shakespeare's sonnets, Whitman, Dickinson, Blake, Poe |
| `childrens-classics/` | Children's literature | *Alice*, *Oz*, *Pooh*, *Pinocchio*, *The Jungle Book*, *Peter Pan* (with trap notes) |
| `detective-fiction/` | Mystery & detective | Sherlock Holmes, Poe's Dupin, *The Moonstone* |
| `traps/` | Dedicated trap dossiers | Sherlock estate, GOSH/Peter Pan, Pooh-vs-Disney, Tarzan/John Carter marks, translations, critical editions |

---
*Part of the Polymath Source Material Bible — Section 05 Literature. Defers to Section 01 for all rights questions. Not legal advice.*
