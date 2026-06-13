# Verification — 11-characters (Public Domain Character Library)

- **Date:** 2026-05-31
- **Auditor role:** Adversarial IP / copyright fact-checker (attempt to REFUTE, default to caution)
- **Scope:** Every `.md` in `shared/source-material-bible/11-characters/`
- **Doctrine applied:** US works published 1930-or-earlier are PD as of 2026 (95-yr term, advances yearly). COPYRIGHT (expression) ≠ TRADEMARK (brand, can last forever) ≠ RIGHT OF PUBLICITY. A PD *literary character* does NOT free a later studio *visual design* — that design is its own copyright.

## Method

1. Globbed + read all 18 files (16 entries + `README.md` + `_template.md`).
2. Spot-checked the riskiest, most-specific claims with WebSearch (US, June 2026):
   - Sherlock Holmes — *Klinger v. Conan Doyle Estate* (7th Cir. 2014) + *Enola Holmes* (2020) + Case-Book PD timeline.
   - Popeye — 1929 Thimble Theatre strip PD date + King Features trademark.
   - Snow White seven-dwarf names — copyright vs trademark basis + expiry.
   - Wizard of Oz ruby slippers — Warner Bros copyright vs "RUBY SLIPPERS" word-mark scope.
   - Tarzan / John Carter — live Edgar Rice Burroughs, Inc. trademark enforcement (Dynamite 2012).
   - Peter Pan — GOSH perpetual royalty, CDPA 1988 Schedule 6, UK-only scope.
3. Fixed clear errors in-place; flagged what needs Boss review.

## Verdict: PASS WITH FIXES

The 16 existing entries are well-researched, conservative, and apply the copyright-vs-design distinction correctly. No entry was found to *under*-state risk on its own character (no "safe" that should be "avoid"). The defects were (a) a few imprecise legal-basis statements (trademark asserted where copyright is the real lever) and (b) a **structural** README defect: the catalogue advertises 7 entries — including the 3 highest-risk FLAGGED characters — that **do not exist as files**.

## Claims checked & CONFIRMED (no change needed)

- **Sherlock Holmes** — Full canon PD in US since Jan 1 2023 (Case-Book 1927 + 95yr). *Klinger* (2014) confirmed Holmes/Watson PD for pre-1923 elements and called the Estate's licensing pressure "a form of extortion." Estate litigiousness (Enola Holmes 2020) real. Entry's `caution` rating and "don't brand a product 'Sherlock Holmes®'" guidance correct. CONFIRMED.
- **Frankenstein / Dracula** — Jack Pierce/Karloff (Universal 1931) and Lugosi (Universal 1931 + *Lugosi v. Universal* publicity) designs restricted; Shelley/Stoker text PD. CONFIRMED, exemplary.
- **Peter Pan** — US PD (1904 play / 1911 novel). UK GOSH perpetual royalty under CDPA 1988 Schedule 6 is real, UK-only, statutory (not normal copyright), covers public performance/commercial publication/communication to public. CONFIRMED precisely.
- **Tarzan / John Carter (FLAG)** — Original books PD, but ERB Inc. holds and *actively enforces* live trademarks (Tarzan®, John Carter®, Barsoom®, etc.); sued Dynamite Comics 2012 over PD-based comics, settled 2014. `avoid` FLAG fully justified. CONFIRMED.
- **Popeye** — 1929 debut strip entered US PD Jan 1 2025; later elements + King Features trademark still live. README row accurate.

## Errors found & FIXED in-place

1. **`snow-white.md` — dwarf-names legal basis overstated as trademark.**
   - Was: dwarf names "are a Disney invention **and trademark**… protected by Disney copyright **and** trademark."
   - Reality: the names-as-a-set are protected primarily by **COPYRIGHT** in the 1937 film, expiring **Jan 1 2033**; Disney also holds merch trademark registrations, but copyright is the load-bearing restriction.
   - Fix: rewrote the body bullet + frontmatter `risk_notes` to state copyright-first basis and the 2033 expiry. Practical guidance ("don't use the names") unchanged — still correct.

2. **`oz-characters.md` — ruby slippers "copyright AND trademark" imprecise.**
   - Was: ruby slippers "protected by copyright **and trademark**."
   - Reality: the *visual design* is **copyright** (Warner Bros., ~Jan 1 2035 expiry, 95yr from 1939). "RUBY SLIPPERS" is a registered **word mark** (Turner/Warner, US/UK/EU/NZ) that protects the *phrase*, NOT the visual image.
   - Fix: split the two regimes explicitly and added expiry date. "Use silver shoes / don't depict ruby" guidance unchanged — still correct & conservative.

3. **`README.md` — catalogue advertises 7 NONEXISTENT entry files (structural, highest-impact fix).**
   - The catalogue listed `tom-sawyer-huck-finn.md`, `anne-of-green-gables.md`, `popeye.md`, `buck-rogers.md`, `zorro.md`, `tarzan.md`, `john-carter.md`. **None exist in the folder.**
   - Risk: README says downstream sections "treat the `risk_level` and `risk_notes` fields here as authoritative." A consumer (human or AI) would believe a guardrail exists for **Zorro, Tarzan, John Carter** — the three actively-trademarked/litigated FLAG characters — when there is NO entry and NO guardrail. That is exactly the blunder this section exists to prevent.
   - Fix: split the catalogue; moved the 7 missing rows under a bold **"NOT YET WRITTEN — DO NOT TREAT AS COVERED"** warning instructing downstream to treat all 7 as **avoid** until a real entry is written, with the live-trademark regimes (Zorro LLC; ERB Inc.) named.

## Still FLAGGED for Boss review

1. **Write the 3 FLAG entries before any downstream use of those characters.** `zorro.md`, `tarzan.md`, `john-carter.md` are the highest-risk characters in the whole section (live, enforced trademarks over PD source). They have no file. README now warns, but the entries should be authored. **Recommend: author these next, all `avoid`.**
2. **Write or delete the other 4 planned rows** (`tom-sawyer-huck-finn`, `anne-of-green-gables`, `popeye`, `buck-rogers`). Anne of Green Gables especially carries a live trademark regime (Anne of Green Gables Licensing Authority / Province of PEI) and should not be `caution`-with-no-entry. Currently flagged `avoid until written`.
3. **`verified: true` on every frontmatter is too strong.** All 16 entries claim `verified: true`, but only the items spot-checked here were independently verified. Recommend either (a) downgrade un-spot-checked entries to `verified: false` pending review, or (b) treat this `_VERIFICATION.md` as the verification record and note its date/scope in each entry.
4. **Expiry dates are moving targets.** Snow White design → 2033; ruby slippers → ~2034–2035; these were added where checked but other entries don't carry expiry dates. Low priority; the "work from the PD text, never the studio design" rule is date-independent and remains the safe default.

## Bottom line

The library's core teaching — PD literary character vs RESTRICTED modern studio design — is sound and consistently applied across all 16 existing entries. Two legal-basis imprecisions corrected (no change to practical guidance, which was already conservative). The one genuinely dangerous defect was the README advertising guardrails that don't exist for the three most litigious characters; that is now explicitly flagged as missing/avoid. No entry needed a risk-level downgrade on its own merits.
