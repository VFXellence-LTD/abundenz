---
id: pd-library-verification
type: audit-report
section: "02 — Public Domain Library (Public Domain Work Framework)"
audit_date: 2026-05-31
auditor: adversarial IP / copyright fact-checker (subagent)
verdict: pass-with-fixes
files_audited: 20
entries_audited: 18
errors_fixed: 2
flagged_for_boss: 3
---

# Verification Report — 02 Public Domain Library

**Date:** 2026-05-31
**Scope:** every file in `02-Public-Domain-Library/` (README, _template, 18 work entries, this report).
**Posture:** adversarial — attempt to *refute* each PD / copyright / trademark / likeness / quote-attribution claim; default to caution where a claim cannot be positively confirmed.

## Method

1. Read all 20 pre-existing files in full (README, _template, 18 entries).
2. Extracted every load-bearing legal claim: PD-entry dates, character-vs-design distinctions, translation/edition traps, quote attributions, trademark/publicity flags.
3. Spot-checked the riskiest / most-specific claims with WebSearch (exact dates, "entered PD in year X", verbatim quote sourcing, specific edition copyright status).
4. Applied settled-law doctrine where search was inconclusive: US pre-1931 published works are PD as of 2026 (95-yr term); copyright ≠ trademark ≠ right-of-publicity; PD text does not free a later film/Disney visual design; translations / annotated editions / specific recordings / fonts carry independent copyright; ancient/folk underlying stories are free but specific modern retellings are not.
5. Fixed clear errors in-place with Edit. Flagged anything not positively confirmable.

## Claims checked via WebSearch (all CONFIRMED accurate)

| Claim | Entry | Result |
|---|---|---|
| All 60 Conan Doyle Holmes stories US PD as of Jan 1 2023; final 10 entered PD 2019–2023 | sherlock-holmes-early-canon | CONFIRMED (Case-Book 1927 → PD 2023; magazine versions 1921–27 rolled in 2019–23) |
| "We learn from failure, not from success!" is genuinely Van Helsing in Stoker | dracula | CONFIRMED (Dracula, Ch. 10 — not an adaptation-only line) |
| "I ought to be thy Adam, but I am rather the fallen angel" verbatim | frankenstein | CONFIRMED (Frankenstein, Ch. 10) |
| Edith Hamilton's *Mythology* (1942) is still copyrighted | greek-mythology | CONFIRMED (copyright renewed 1969; PD ~Jan 1 2038) |
| Great Wave c. 1831; Met Open Access CC0; Bridgeman v. Corel = no new US copyright on faithful 2D repro | the-great-wave | CONFIRMED (Met dates ca. 1830–32; Open Access CC0) |
| Cugat "Celestial Eyes" 1925 cover is PD and a separate work from the novel | the-great-gatsby | CONFIRMED |
| Nutcracker lineage: Hoffmann 1816 → Dumas père 1844 → Tchaikovsky 1892 | the-nutcracker | CONFIRMED (exact chain correct) |
| "I could easily forgive his pride, if he had not mortified mine" = Elizabeth Bennet | pride-and-prejudice | CONFIRMED |
| Gatsby PD Jan 1 2021 (1925 + 95) | the-great-gatsby | CONFIRMED (consistent with doctrine) |
| "No act of kindness…" is a MODERN paraphrase, not the traditional moral | aesops-fables | CONFIRMED — and corrected in-place (see below) |
| All 14 L. Frank Baum Oz books are PD; Ruth Plumly Thompson continuations are mixed/rolling | wizard-of-oz | CONFIRMED — entry phrasing corrected in-place (see below) |

## Errors found and FIXED in-place

1. **`wizard-of-oz.md` — Risks → Copyright.** Original read "Later Oz *books* by Baum through 1930 are PD; post-1930 Oz books … may still be restricted." Imprecise: Baum died 1919 and his final Oz book was *Glinda of Oz* (1920) — there are no "post-1930 Baum Oz books," and **all 14 of his Oz titles are now US PD.** The real live-copyright risk is **Ruth Plumly Thompson's** continuations, several of which (notably her 1930–1934 titles) remained under copyright and enter PD on a rolling basis through 2030. Rewrote the line to state all Baum Oz is PD and to sharpen the Thompson caution. (Net effect: more accurate AND more conservative.)

2. **`aesops-fables.md` — Inspirational quotes.** "No act of kindness, no matter how small, is ever wasted" was labelled "(traditional)", implying a verbatim PD translation. It is a **20th-century paraphrase/summation**; the traditional moral of *The Lion and the Mouse* is "Little friends may prove great friends." Relabelled it as a modern paraphrase. Practical IP risk is negligible (a short proverb summarising an ancient idea is not protectable), but the Bible's own rule is not to present modern phrasings as verbatim PD text.

## Items FLAGGED for Boss review (not errors — judgment calls / external dependencies)

1. **Peter Pan UK GOSH perpetual royalty (peter-pan.md).** The entry's core claim is correct: under CDPA 1988 Schedule 6, Great Ormond Street Hospital holds a *perpetual right to royalties* on commercial UK stage performance / publication / broadcast, even though ordinary copyright has lapsed. The entry's parenthetical "(Barrie d.1937, +70 = end of 2007; an earlier expiry/revival applied)" compresses a genuinely messy history (the work first lapsed end of 1987, was revived by the 1995 EU-harmonisation term extension, then lapsed again end of 2007). The bottom line in the file (US = clean PD; UK commercial use = budget for the GOSH royalty) is sound. **Recommend Boss confirm the GOSH royalty wording with section 01 / counsel before any UK commercial product ships** — it is the single most jurisdiction-specific obligation in the whole section.

2. **"Faithful-scan / museum reproduction" reliance (the-great-wave.md, alice, grimms, aesops, peter-pan, raven, a-christmas-carol — every entry recommending a "PD illustration" or "PD scan").** The entries correctly cite Bridgeman v. Corel (no new US copyright on a faithful photo of a 2-D PD work) and correctly warn that other jurisdictions differ. This is accurate US law but is the most likely place for a *downstream generator* to slip — e.g. pulling a watermarked museum/stock file that asserts contractual (not copyright) restrictions, or a non-US database right. **Recommend the pipeline hard-require a confirmed CC0/PD source (Met Open Access, LoC, Wikimedia PD) and never a generic image-search result.** This is a process control, not a factual error in the entries.

3. **Trademark "live registration" assertions stated without register citations (frankenstein, dracula, sherlock, wizard-of-oz, peter-pan/Tinker Bell, alice/"Disney's Alice", a-christmas-carol).** The entries flag live entertainment/merchandise-class trademarks and (for Tinker Bell) Disney mascot status. These flags are directionally correct and appropriately conservative, but none cite a specific USPTO/EUIPO registration number, and trademark status is class-specific and changes over time. The conservative framing ("avoid implying affiliation") is the right instruction regardless. **No fix needed; flagging so the Boss knows the trademark layer is asserted on reasonable belief, not on a pulled register record** — worth a periodic re-check before launching any branded line that leans on one of these names.

## Cross-cutting assessment

- **Date arithmetic:** every "entered PD in year X" claim checked is internally consistent with the 95-year rule (Gatsby 1925→2021, Sherlock Case-Book 1927→2023, etc.). No off-by-one errors found.
- **Doctrine discipline:** the copyright-vs-trademark-vs-publicity separation is applied consistently; the "PD text ≠ free film design" rule is flagged in every entry that has a famous adaptation (Frankenstein/Universal, Oz/MGM, Dracula/Lugosi, Alice & Grimm/Disney, Peter Pan/Disney, Norse & Greek myth/Marvel & Disney & game designs).
- **Translation trap:** correctly applied to Odyssey, Iliad, Grimm, both mythologies, Shakespeare (as the analogous *editorial* copyright). Modern translators named (Wilson, Fagles, Fitzgerald, Lattimore, Hamilton, Gaiman, Miller, Riordan) are all genuinely in-copyright.
- **Quote provenance:** every verbatim quote spot-checked traces to the PD source text; the two paraphrase cases (Alice "any road"; Aesop "no act of kindness") were already hedged or are now relabelled.

## Verdict

**PASS WITH FIXES.** The section is conservative, doctrinally sound, and accurate on the high-risk specifics. Two minor accuracy issues corrected in-place; three items flagged for Boss awareness (one jurisdictional-wording confirmation, two process controls). No claim in the section was found to be dangerously wrong, and no `risk_level: safe` entry was found to be over-confident.

Related: [[02-Public-Domain-Library/README]] · [[01-Legal-Guidelines/README]]
