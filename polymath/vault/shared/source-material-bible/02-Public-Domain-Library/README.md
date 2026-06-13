# 02 — Public Domain Library

The **Public Domain Work Framework** for the VFXellence Source Material Bible. This section defines *how* we catalogue any public-domain (PD) creative work — of any medium — so that it becomes a reusable, legally-safe, machine-readable creative asset for every Polymath content ecosystem (POD, t-shirts, posters, children's books, storytelling, podcasts, video, blog, social, merch, and AI image/video/writing generation).

This is the **engine room** of the Bible. Sections downstream consume what lives here.

---

## What this section is

A public-domain *work* is the atomic unit of safe creative reuse. A single novel, fable collection, epic, painting, or folk tale becomes one catalogue entry. Each entry strips the work down into reusable creative primitives — themes, symbols, character archetypes, visual motifs, quotes, and concepts — and attaches a **conservative legal verdict** so a downstream generator (human or AI) never has to re-research whether a thing is safe to use.

Crucially, this section is **medium-agnostic**. Literature dominates the seed set because PD literature is the richest and best-documented, but the same template catalogues PD paintings, sculptures, musical scores, photographs, films, folk traditions, and mythologies.

The section contains three kinds of files:

1. **README.md** (this file) — purpose, usage, conventions.
2. **_template.md** — the canonical copy-paste entry template. Every new PD work entry starts as a copy of this.
3. **Entry files** — one `.md` per catalogued work (`frankenstein.md`, `dracula.md`, …), each with full YAML frontmatter and the standard body sections.

---

## How other sections use this

| Section | What it pulls from here |
|---|---|
| **03 — Characters & Archetypes** | The `archetypes` and "Character archetypes" body section of each entry seed the archetype catalogue. A character like Sherlock Holmes or Captain Ahab is lifted out into its own character entry, back-linked here. |
| **04 — Themes, Symbols & Motifs** | The `themes`, `symbols`, and `visual_motifs` fields feed the cross-work thematic index. |
| **05 — Quotes & Text** | The "Inspirational quotes" body section supplies verified PD quotes (with the translation/edition caveat applied). |
| **11 — Remix & Combination Frameworks** | The `remix_hooks` field and "Design / Story opportunities" sections feed mashup and recombination recipes. |
| **12 — Prompt & Design Recipes** | "POD opportunities", "Design opportunities", and `applications` feed concrete prompt templates and product recipes. |
| **18 — Yearly Intake (Jan 1 PD additions)** | New works entering the public domain each January 1 are catalogued here first using this template, then propagate outward. |

When an **AI generation pipeline** needs source material, it queries this library by `themes`, `emotional_tags`, `applications`, and `risk_level`, then reads `risk_notes` before producing anything. **`risk_level: safe` + `pd_status: public-domain` is the green light. Anything else requires reading `risk_notes` first.**

---

## The single most important rule

> **The text/expression of a work being public domain does NOT make every later adaptation of it free.**

A PD novel does not grant rights to a later film studio's *visual design* of its characters. The Frankenstein *text* (Shelley, 1818) is PD; Universal's 1931 flat-headed, neck-bolt Monster design is a live copyright/trademark. The *Wizard of Oz* book (Baum, 1900) is PD; MGM's 1939 ruby slippers are restricted. Every literary entry that has a famous film adaptation **must** flag this in `risk_notes`. See [[02-Public-Domain-Library/_template]] and section [[01-Legal-Guidelines/README]] for the full doctrine.

---

## Legal doctrine (summary — section 01 is canonical)

- **US copyright cutoff as of 2026:** works published in the US in **1930 or earlier are public domain** (95-year term). 1929 entered PD on Jan 1 2025; 1930 entered Jan 1 2026. The line advances one calendar year every Jan 1.
- **Copyright ≠ Trademark ≠ Right of Publicity.** A work can be PD for copyright yet still be trademark-restricted (a live brand/character identity) or likeness-restricted (a real person). All three are checked separately.
- **Adaptations are independent works.** Translations, critical/annotated editions, specific 20th-century cover art, specific film designs, and specific font files carry their own fresh copyright even when the underlying work is ancient.
- **Ancient & folk material** (mythology, fables, fairy tales as traditional stories) has no copyright in the underlying story — but any *specific modern retelling, translation, or illustration* does. Catalogue the tradition as PD; flag the editions.
- **When uncertain → be conservative.** Set `pd_status: caution` (or `restricted`), `risk_level: caution`/`avoid`, and explain exactly what to avoid in `risk_notes`. The safe failure mode for IP is "don't use it."

---

## Section-specific conventions

- **One work = one file.** Collections that function as a single PD unit (Grimms' Fairy Tales, Aesop's Fables) get one entry; individual breakout characters/tales may later get their own entries in section 03/04 and back-link here.
- **`pd_status` reflects the *underlying work*, not its adaptations.** The body's "Risks" section and the `risk_notes` field carry the adaptation warnings.
- **`verified: true`** only when the publication year and PD basis have been confirmed against a citable source (Project Gutenberg date, first-edition record, etc.). Default `false` until checked.
- **Quotes** are stored only from the original-language PD text or a confirmed PD translation. Modern translations are copyrighted — flag them and prefer translating afresh or using a pre-1930 translation.
- **Z-naming** applies only to brands/characters Polymath *invents* on top of this material — never to the PD source itself. (A Polymath original wizard inspired by Oz might be "Zephyrion"; Dorothy stays Dorothy only if used as the PD text character, not the MGM design.)
- Filenames are kebab-case; keep this folder named exactly `02-Public-Domain-Library`.

---

## Quick-start: cataloguing a new PD work

1. Confirm the publication year and that it is **1930 or earlier (US)** — or that it is ancient/folk.
2. Copy `_template.md` to `<work-name>.md`.
3. Fill the frontmatter. Set `verified: false` until you confirm the date against a source; set it `true` once confirmed.
4. Decompose the work into themes, symbols, archetypes, motifs, quotes, concepts.
5. **Check for famous adaptations** (film, Disney, stage) and write the warning into `risk_notes` + the Risks body section.
6. Add `remix_hooks` and the opportunity sections (Design / Story / POD).
7. Cross-link with `[[wikilinks]]` to sections 03, 04, 05, 11, 12.

Related: [[02-Public-Domain-Library/_template]] · [[01-Legal-Guidelines/README]]
