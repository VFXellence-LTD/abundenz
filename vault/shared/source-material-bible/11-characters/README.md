# 11 — Characters: Public Domain Character Library

This is the **highest IP-risk section** of the Source Material Bible. It exists to teach, by example, exactly where the legal line sits when you reuse a famous fictional character in commercial creative work (POD, t-shirts, posters, children's books, story, podcast, video, blog, social, merch, brand, AI image/video/writing).

The single most important idea in this whole section:

> **A character can be public domain for COPYRIGHT (the original text/expression) while the modern, famous-looking VERSION of that character is still RESTRICTED — by a newer copyright (a specific film/illustration design), by trademark (a live brand identity), or by both.**

You are almost always allowed to draw on the *original author's text version* of an old character. You are almost never allowed to copy the *Disney / Universal / MGM / studio design* that made that character iconic. This section maps that gap for each character so a downstream human or AI generator never blunders across it.

## How this section is used

- **By other sections.** Sections that build remix frameworks, prompt templates, design recipes, and POD product specs link into these entries to confirm a character is usable and to copy the exact `risk_notes` guardrails. Treat the `risk_level` and `risk_notes` fields here as authoritative; do not override them downstream.
- **By AI generation.** When an AI image/writing prompt wants to invoke a character, it must read that character's entry first and obey `risk_notes`. The `safe-use guidance` and `remix_hooks` are written so a generator can describe a character *from the original text* without reproducing a protected studio design. Where the entry says "avoid," the generator must refuse or substitute an original Z-named character.
- **By legal review.** Every entry is deliberately conservative. When in doubt, an entry is marked `caution` or `avoid` rather than `safe`. The correct failure mode for IP is "don't use it."

## Section conventions

- One character (or tightly-bound character cluster, e.g. *Oz* designs) per file, kebab-case filename.
- Every file carries the canonical YAML frontmatter schema (see `_template.md`). Field names are EXACT for downstream Notion/Airtable/Postgres/vector ingestion — do not rename.
- **Copyright cutoff used throughout (as of 2026):** works first published in the US in **1930 or earlier are public domain**. The cutoff advances one calendar year every January 1 (1929 entered PD Jan 1 2025; 1930 entered Jan 1 2026). Post-1977 works: life of author + 70 years.
- Three separate legal regimes are tracked independently per entry:
  - **Copyright** — protects the specific expression (a text, a drawing, a film). Expires.
  - **Trademark** — protects a brand/character identity used in commerce. Can last forever if maintained.
  - **Right of publicity** — protects a real person's name/likeness. Not relevant to most fictional characters, but flagged where a real performer's look is involved.
- **Disputed/flagged characters** (Zorro, Tarzan, John Carter, Sherlock Holmes estate behaviour, Peter Pan/GOSH) get an explicit FLAG and are pushed to `caution` or `avoid` even where a pure copyright analysis might say otherwise. Active, litigious rights-holders are a business risk independent of who is technically correct.
- Invented Polymath brand/character names follow the **Z-naming convention** (must incorporate a Z). The public-domain characters catalogued here are NOT Polymath inventions — they keep their historical names; Z-naming applies only to original characters we create to *replace* a restricted one.

## The core decision flow (applies to every entry)

```
Is the ORIGINAL TEXT/EXPRESSION of this character public domain?
  NO  → restricted. Do not use the character. (Or use only a generic archetype.)
  YES → Is there a famous LATER design (film still, studio illustration, costume)?
          YES → that specific design is its OWN copyright — treat as RESTRICTED.
                Describe the character ONLY from the public-domain text.
        Is the character name / silhouette a LIVE TRADEMARK or brand?
          YES → using it in commerce (especially as branding) risks trademark claims —
                mark caution/avoid even if copyright has expired.
        Is the rights-holder known to be litigious?
          YES → push one risk tier more conservative.
  → Final: only "safe" when text is PD, no protected design is being copied,
    and no live trademark/estate aggression applies.
```

## Files in this section

- `README.md` — this file.
- `_template.md` — copy-paste entry template (full frontmatter + body headings).
- One `.md` per character / character cluster (see catalogue below).

### Catalogue

| File | Character | pd_status | risk_level |
|------|-----------|-----------|------------|
| `sherlock-holmes.md` | Sherlock Holmes | public-domain (full, 2023) | caution (estate) |
| `dracula.md` | Count Dracula | public-domain | caution |
| `frankensteins-monster.md` | Frankenstein's Monster | public-domain (text) | caution (Universal design) |
| `alice-wonderland.md` | Alice / Mad Hatter / Cheshire Cat | public-domain | caution (Disney design) |
| `peter-pan.md` | Peter Pan | public-domain (US) | caution (UK GOSH) |
| `tinker-bell.md` | Tinker Bell | public-domain (character) | caution (Disney design) |
| `oz-characters.md` | Dorothy / Scarecrow / Tin Man / Cowardly Lion / etc. | public-domain (books) | avoid (MGM designs) |
| `robin-hood.md` | Robin Hood | public-domain | safe |
| `arthurian-characters.md` | King Arthur / Merlin / Lancelot / Guinevere | public-domain | safe |
| `pinocchio.md` | Pinocchio | public-domain (Collodi) | caution (Disney design) |
| `snow-white.md` | Snow White | public-domain (Grimm) | caution (Disney design) |
| `cinderella.md` | Cinderella | public-domain (Grimm/Perrault) | caution (Disney design) |
| `jekyll-and-hyde.md` | Dr Jekyll & Mr Hyde | public-domain | safe |
| `captain-nemo.md` | Captain Nemo | public-domain | safe |
| `phileas-fogg.md` | Phileas Fogg | public-domain | safe |
| `long-john-silver.md` | Long John Silver | public-domain | safe |

> **NOT YET WRITTEN — DO NOT TREAT AS COVERED.** The rows below are *planned* entries whose files do not exist in this folder as of 2026-05-31. Downstream sections and AI generators MUST NOT assume a guardrail exists for these characters. Until a real entry is written, treat each as **avoid** (especially the three FLAGGED, actively-litigated/trademarked properties — Zorro, Tarzan, John Carter — where a live ERB/Zorro LLC trademark regime overrides any copyright-PD reading). Verify independently before any use.

| File (PLANNED — MISSING) | Character | provisional pd_status | provisional risk_level |
|------|-----------|-----------|------------|
| `tom-sawyer-huck-finn.md` *(missing)* | Tom Sawyer & Huckleberry Finn | public-domain | caution |
| `anne-of-green-gables.md` *(missing)* | Anne Shirley | public-domain | caution (trademark) |
| `popeye.md` *(missing)* | Popeye | public-domain (1929 strip entered PD Jan 1 2025) | avoid until written (design/trademark — King Features) |
| `buck-rogers.md` *(missing)* | Buck Rogers | public-domain (1928–29) | avoid until written (trademark) |
| `zorro.md` *(missing)* | Zorro | caution/disputed | avoid (FLAG: Zorro LLC trademark) |
| `tarzan.md` *(missing)* | Tarzan | caution/mixed | avoid (FLAG: live ERB Inc. trademark) |
| `john-carter.md` *(missing)* | John Carter of Mars | caution/mixed | avoid (FLAG: live ERB Inc. trademark) |

## Related sections

- `[[01-legal-doctrine]]` — canonical legal rules this section enforces.
- `[[02-public-domain-literature]]` — the source works these characters come from.
- `[[10-remix-frameworks]]` — how to legally transform a PD character into original IP.
- `[[brand-naming]]` — Z-naming convention for original replacement characters.
