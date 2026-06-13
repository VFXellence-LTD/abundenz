---
id: quote-section-verification
type: verification-audit
title: Quote Repository — Adversarial IP / Copyright Verification
section: 12-Quotes
auditor: Adversarial IP / copyright fact-checker (subagent)
date: 2026-05-31
verdict: pass-with-fixes
related: ["[[README]]", "[[misattributed-avoid-list]]"]
---

# Quote Repository — Verification Audit (2026-05-31)

Adversarial IP / copyright / attribution audit of every file in
`12-Quotes/`. Goal was to **refute** claims, not rubber-stamp them. Errors
found were fixed in-place; residual uncertainties are flagged for Boss
review below.

## Method

1. Read all 12 files: `README.md`, `_template.md`, and the 10 content files
   (`wisdom`, `courage`, `love`, `nature`, `perseverance`, `humor`,
   `leadership`, `creativity`, `stoicism`, `misattributed-avoid-list`).
2. Applied settled doctrine:
   - US works published 1930-or-earlier are PD as of 2026 (95-yr term).
   - Copyright (text) != trademark (brand/character) != right-of-publicity
     (real person).
   - Translations/specific editions can be independently copyrighted even
     when the underlying ancient text is PD.
   - Misattributed "famous" quotes are common — verify source + year.
   - DEFAULT-TO-CAUTION: anything not positively confirmable is downgraded.
3. Spot-checked the riskiest/most-specific claims with live web search
   (exact dates, translator/edition copyright, fabricated-quote provenance,
   trademark status). Checks run:
   - FDR "fear itself" 1933 inaugural / §105 government-work PD status.
   - Voltaire "common sense is not so common" attribution.
   - Joanna Baillie "the brave man…" — play title, act, year.
   - Yeats "A Drinking Song" — collection + 1910 publication.
   - Edmund Burke "triumph of evil" — spurious-attribution status.
   - "Well-behaved women…" → Laurel Thatcher Ulrich (1976).
   - Semisonic "Closing Time" (1998) vs fake-Seneca attribution.
   - "Insanity is doing the same thing…" fake-Einstein provenance (1980s).
   - Einstein name trademark (Hebrew University of Jerusalem, Reg. 3591305).
   - Tao Te Ching Ch. 17 Witter Bynner translation date + copyright.
   - Patrick Henry / William Wirt 1817 record.
   - Andrew Marvell "To His Coy Mistress" composition/publication dates.
   - George Long Epictetus *Discourses* (1877) PD translation.
   - Twain "Clothes make the man" / *More Maxims of Mark* (1927) provenance.
   - Aubrey Stewart Seneca *Of a Happy Life* (Bohn, 1900) PD translation.

## Overall verdict: PASS-WITH-FIXES

This is an unusually well-constructed section. The core legal posture is
correct and conservative: it distinguishes copyright from trademark from
right-of-publicity; it correctly treats ancient texts as PD only via named
PD translations; it correctly flags the Crown-copyright KJV wrinkle for the
UK; it correctly treats fabricated/restricted quotes as a deny-list; and it
defaults to caution on contested lines. The verified-true PD entries that
were spot-checked all held up. Three defects were found and fixed; a short
list of items is flagged for Boss review (no fix applied, because the
existing treatment is defensible but could be tightened).

## Claims checked (high-risk sample)

| Claim | Result |
|---|---|
| FDR "fear itself" 1933 = PD US-gov work (§105) | HOLDS (defensible; see flag F1) |
| Voltaire "common sense is not so common" 1764 = verified | **REFUTED — fixed** (E3) |
| Baillie "the brave man…" *Basil* Act V (1798) | PARTIALLY REFUTED — title/act wrong, **fixed** (E1) |
| Yeats "A Drinking Song" 1910, US-PD | HOLDS |
| Burke "triumph of evil" = spurious | HOLDS (avoid-list correct) |
| "Well-behaved women" = Ulrich 1976, in copyright | HOLDS (avoid-list correct) |
| Semisonic "Closing Time" 1998 vs fake-Seneca | HOLDS (avoid-list correct) |
| "Insanity…" fake-Einstein, 1980s recovery lit | HOLDS (avoid-list correct) |
| Einstein name = HUJ trademark | HOLDS (Reg. 3591305) |
| Tao Te Ching Ch.17 Bynner "1937" translation | PARTIALLY REFUTED — year wrong (1944), **fixed** (E2) |
| Patrick Henry / Wirt 1817 | HOLDS |
| Marvell "To His Coy Mistress" c.1650 / pub. 1681 | HOLDS |
| George Long Epictetus *Discourses* 1877 PD | HOLDS |
| Twain "Clothes make the man" / *More Maxims* 1927 | HOLDS (PD; see flag F3) |
| Aubrey Stewart Seneca *Of a Happy Life* 1900 PD | HOLDS |

## Errors found and fixed in-place

**E1 — `courage.md` Q06 (Joanna Baillie), wrong title + act.**
Was attributed to "*Basil*, Act V (1798)." The verified source is
*Count Basil*, **Act III, Sc. 1** (1798). Year and author were correct.
Fixed the title and act citation. (Material in a repository whose rule is
"render the attribution exactly.")

**E2 — `leadership.md` Q14 (Tao Te Ching Ch.17 / Witter Bynner), wrong year.**
Two places stated the popular wording derives from the "1937 Witter Bynner
rendering." Bynner's translation, *The Way of Life According to Laotzu*,
was published **1944**, not 1937. Fixed both occurrences and noted the US
copyright runs ~95 years (through ~2039). The substantive conclusion —
"use the PD Legge (1891) wording, not Bynner" — was and remains correct;
the 1944 date makes the in-copyright conclusion more certain, not less.

**E3 — `wisdom.md` Q22 (Voltaire "Common sense is not so common"),
overconfident attribution downgraded.**
Was `pd_verified: true`, `risk_level: safe`, no caveat, attributed flatly
to Voltaire, *Dictionnaire philosophique* (1764). Copyright is genuinely a
non-issue (Voltaire d. 1778). BUT the **attribution is contested**: in the
"Sens commun" article Voltaire prefaced the remark as something "people say
sometimes" — i.e. he was repeating a proverb, not coining it — and no exact
source for the pithy "Le sens commun n'est pas si commun" has ever been
located. The same line is widely miscredited to Twain and Will Rogers.
Per default-to-caution, downgraded to `pd_verified: false`,
`risk_level: caution`, with an honest `risk_notes` instructing the pipeline
to present it unattributed or as "attributed to Voltaire," never as a
verbatim sourced quotation.

## Items flagged for Boss review (no fix applied)

**F1 — FDR "fear itself" as a clean §105 government work (`courage.md` Q08;
`leadership.md` Q01–Q03, header note).** The section states as flat fact
that a sitting President's official address is PD under 17 U.S.C. §105.
This is the widely-accepted and defensible reading, and the entries already
carry the cautious note "confirm phrasing against the official transcript."
However, §105 strictly covers works prepared by US-government *officers or
employees* as part of official duties; the question of whether a
speechwriter-drafted presidential address is unambiguously a §105 work has
never been litigated to a clean holding. The conservative practical
conclusion (Lincoln/FDR official addresses are usable; pairing a *living-era*
president's name/likeness with merch is the real risk) is sound. **Flag:**
consider softening "is in the public domain as a work of the US government"
to "is generally treated as public domain as a US-government work" for
strict accuracy. Low risk.

**F2 — JFK inaugural (`leadership.md` Q09).** Already correctly marked
`caution` and the right-of-publicity / false-endorsement risk is correctly
identified. No change needed; flagged only so the Boss is aware the section
deliberately leaves a defensible-but-not-risk-free line on the board behind
a clear conservative "avoid on merch" instruction.

**F3 — Twain "Clothes make the man" / *More Maxims of Mark* (`humor.md` Q02).**
Marked `pd_verified: true`. The PD conclusion is correct (1927 publication
is now PD by 95-yr term as of 2023; the underlying Twain sentiment traces to
his 1905 "The Czar's Soliloquy"). However the exact maxim wording was
compiled/paraphrased by Merle Johnson in the 1927 privately-printed edition,
so it is not strictly verbatim Twain. **Flag:** consider adding a one-line
note that the wording is Johnson's 1927 compilation of a 1905 Twain passage.
PD conclusion stands; this is an attribution-precision nicety, not a rights
problem.

**F4 — "Genius is one percent inspiration" Edison (`perseverance.md` Q18).**
Already correctly `caution` with instruction to pin to a pre-1930 printed
source. No fix; the entry's own hedging is appropriate. Provenance of the
exact ratio wording pre-1930 is genuinely fuzzy — leave as caution.

**F5 — Frost "Stopping by Woods" (`nature.md` Q18) jurisdiction split.**
Correctly handled: US-PD (1923 publication) but NOT PD in life+70
jurisdictions until 2034, and the entry is marked `caution` with a
"restrict to US-market products" instruction. No fix. Flagged only to
confirm the section's jurisdiction-awareness is doing real work here and the
same discipline should be retained as the 95-year window advances each year.

## Notes on what was checked and held up well

- The **stoicism translation-copyright discipline** is the strongest part of
  the section: it correctly excludes Gregory Hays (2002), Robin Campbell
  (1969 Penguin), and Witter Bynner, and correctly names PD translators
  (George Long 1862/1877, Elizabeth Carter 1758, P. E. Matheson 1916,
  Aubrey Stewart 1900, Gummere Loeb 1917–25). Spot-checks of George Long's
  Epictetus (1877) and Aubrey Stewart's Seneca (1900) both confirmed PD.
- The **KJV Crown-copyright** caveat (`wisdom.md` Q23) and the deliberate
  pivot to the ASV 1901 (Q24) for UK-safe Bible text is correct and unusually
  sophisticated.
- The **avoid-list** (Sections A–G) is accurate on every entry spot-checked:
  Burke, Ulrich/"well-behaved women," Semisonic/"Closing Time," the
  fake-Einstein cluster, and the protected-identity roster (Einstein/HUJ
  trademark, Tolkien, Picasso, Mandela, Monroe/ABG) all check out.

---
*Audit by adversarial IP fact-checker. Conservative bias applied. Not legal
advice — the Boss / counsel makes final rights calls.*
