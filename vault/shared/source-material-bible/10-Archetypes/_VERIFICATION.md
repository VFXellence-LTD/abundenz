# Section 10 — Archetypes: QC Verification

**Date:** 2026-05-31
**Reviewer:** QC pass (Source Material Bible, creative/reference tier)
**Scope:** All entry files in `10-Archetypes/` against [[METADATA-STANDARD]] and the section spec (reconcile requested set + classic Jungian/brand 12 into 18–24 archetypes, one file each, `type: archetype`).

---

## What was checked

1. **Read every file** in `10-Archetypes/` — 22 archetype entries plus `README.md` and `_template.md`.
2. **Frontmatter schema** — every entry validated against the canonical field set in [[METADATA-STANDARD]] (all 22 required fields present, exact field names, correct enums).
3. **Numeric target** — counted archetypes against the spec's 18–24 range.
4. **Wikilinks** — checked intra-section archetype links resolve to real files and cross-section links (`08`, `09`, `11`, `13`, `15`, `16`, `03`, `04`, `05`, `07`, `01`) point to existing sibling section folders.
5. **IP risk** — scanned all prose and example lists for copyrighted characters, living celebrities, trademarks, and studio-specific designs presented as things to emulate.

---

## Results

### (a) Frontmatter — PASS
Programmatic check across all 22 entries: **0 schema problems.**
- Every required field present (`id`, `type`, `title`, `creator`, `year`, `country`, `pd_status`, `pd_basis`, `verified`, `themes`, `symbols`, `archetypes`, `visual_motifs`, `emotional_tags`, `applications`, `risk_level`, `risk_notes`, `remix_hooks`, `source_url`, `tags`, `related`, `created`).
- Constant fields correct on every entry: `type: archetype`, `pd_status: na`, `risk_level: safe`, `verified: true`, `created: 2026-05-31`.
- Field names match METADATA-STANDARD exactly (no renames/synonyms — ingestion-safe).
- `applications` values are all within the enum; entries correctly omit `childrens-book` where age-inappropriate (e.g. `warrior`, `outlaw`, `ruler`, `monarch`).

### (b) Numeric target — PASS
**22 archetypes**, each in its own kebab-case file, within the **18–24** target.

Reconciled set: hero, warrior, explorer, sage, teacher, magician, outlaw, ruler, creator, inventor, craftsman, lover, jester, trickster, caregiver, guardian, innocent, everyman, merchant, dreamer, monarch, oracle.

The reconciliation correctly unifies the requested set (Explorer, Inventor, Warrior, Rebel→Outlaw, Teacher, Sage, Dreamer, Trickster, Monarch, Craftsman, Guardian, Merchant) with the classic Jungian/brand 12 (Innocent, Everyman, Hero, Outlaw, Magician, Lover, Jester, Caregiver, Ruler, Creator, Sage, Explorer): true duplicates merged (Explorer, Sage, Outlaw/Rebel, Ruler/Monarch), genuinely distinct facets kept separate (Sage vs Teacher; Hero vs Warrior; Creator vs Inventor vs Craftsman; Jester vs Trickster; Caregiver vs Guardian), and Merchant + Dreamer + Oracle added to fill gaps. README documents the full reconciliation table. Every required body section is present per entry (description, core values, motivations, shadow, visual motifs, colors, symbols, story uses, design uses, remix opportunities, example PD characters, related archetypes).

### (c) Wikilinks — PASS (after fixes)
- All cross-section links target real sibling folders (verified `08-Color-Palettes`, `09-Symbols`, `11-characters`, `13-Visual-Motifs`, `15-Remix-Frameworks`, `16-Prompt-Templates`, `03-Mythology`, `04-Folklore`, `05-Literature`, `07-Historical-Design`, `01-Legal-Guidelines` all exist).
- Intra-section archetype links: **0 dangling** after fixes (see below). Aliases that are NOT separate files (Champion, Muse, Seeker, etc.) are no longer rendered as wikilinks.

### (d) IP risk — 1 found and fixed
The section is built on the correct premise (archetypes are abstract patterns = safe; risk lives only in example characters). Example-character lists are handled carefully throughout — PD source named, studio design flagged (`CAUTION — avoid Disney/MGM/Universal design`), and litigious marks flagged `AVOID` (Zorro, Tarzan, John Carter). README's naming of Aragorn/Gandalf/Yoda is correct legal *education* (naming protected characters to teach that the pattern, not the character, is free).

**One genuine leak found:** `everyman.md` Description listed **Sam Gamgee** (Tolkien, *The Lord of the Rings* 1954–55) as a positive everyman exemplar to emulate, alongside PD figures and with no caution. Tolkien's works are under live copyright (author d. 1973; life+70 ≈ protected to 2043) and heavily trademarked — modelling a generated "Everyman" on him is an accidental IP risk. **Fixed:** replaced with **Sancho Panza** (*Don Quixote*, 1605/1615, firmly PD) — the canonical loyal-everyman companion.

---

## Fixes applied (3)

| File | Issue | Fix |
|------|-------|-----|
| `everyman.md` | IP risk — copyrighted Tolkien character ("Sam Gamgee") used as everyman exemplar in Description prose | Replaced with PD "Sancho Panza" (*Don Quixote*) |
| `hero.md` | Dangling wikilink `[[champion]]` (Champion is a Hero *alias*, not a file — per README convention) | Rewrote to "the Champion aspect of the Hero is an alias, not a separate entry" (link removed) |
| `creator.md` | Dangling wikilink `[[muse]]` (Muse is not one of the 22 archetypes) | De-linked to plain "muse-like" descriptor |

---

## Residual flags

None blocking. Notes for awareness:
- **Cross-section example-character filenames** (e.g. `[[11-characters]]` + `captain-nemo.md`, `oz-characters.md`, `sherlock-holmes.md`) reference entries in section 11 that were not in scope for this pass. Each carries the correct inline risk note here; confirm the matching `11-characters/` entries exist and carry the stated guardrails when section 11 is QC'd.
- **Sherlock Holmes** is correctly flagged "PD as of 2023, estate caution" — accurate as of this date.
- **Peter Pan** correctly flagged "PD US; CAUTION — UK GOSH" (Great Ormond Street Hospital's perpetual UK royalty right) — accurate.
- Disney/MGM/Universal-design cautions throughout are correct and should be preserved verbatim.

**Verdict:** pass-with-fixes — schema fully compliant, 22/18–24 target met, links resolve, one IP leak corrected.
