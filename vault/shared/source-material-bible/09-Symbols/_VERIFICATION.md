# 09-Symbols — Adversarial IP + Ethics Verification

- **Date:** 2026-05-31
- **Scope:** All 86 symbol entries in `09-Symbols/` plus `README.md` and `_template.md`
- **Auditor role:** Adversarial IP + ethics fact-checker
- **Verdict:** **PASS with fixes.** Entry content is accurate and conservatively flagged across all three hazard classes. One systemic structural defect found and remediated: the safety-critical `_restricted/` do-not-use layer was referenced everywhere but did not exist.

---

## Method

1. Globbed and read every `.md` entry; deep-read every risk-bearing entry across the three hazard classes (hate, trademark/treaty, sacred/living-faith) plus the section `README.md` and `_template.md`.
2. Web-verified the load-bearing legal and ADL facts:
   - **Olympic rings** — Ted Stevens Olympic & Amateur Sports Act (36 U.S.C. § 220506), enforceable without proof of confusion; 1981 Nairobi Treaty. Confirmed.
   - **Red Cross / Crescent / Crystal** — Geneva Conventions; criminal misdemeanor under 18 U.S.C. § 706 / § 706a (up to 6 months). Confirmed.
   - **ADL Hate Symbols Database** — Othala rune (Waffen-SS), SS bolts (doubled Sowilo), Algiz/"life rune" all confirmed as flagged; ADL "context" rule confirmed.
3. Applied default-to-caution: where the do-not-use safety layer was promised but missing, created it rather than leaving dangling.

## Hazards checked

### a. Hate / coded symbols — PASS
Every hate-adjacent entry is correctly `risk_level: avoid`/`caution` with accurate risk_notes:
- **Sowilo** (`avoid`) — flags doubled form = SS bolts, banned in DE/AT. Correct.
- **Algiz** (`avoid`) — flags Nazi "Lebensrune"/inverted "death rune". Correct.
- **Elder Futhark overview** (`caution`) — names Sowilo-doubled, Algiz, Tiwaz/Tyr, Othala, Wolfsangel; mandates ADL screening. Correct.
- **Fehu / Ansuz / Raidho** (`caution`) — low-risk individually but require whole-set ADL screening. Correct.
- **Pentagram** (`caution`) — inverted = Satanic reading flagged; plain star noted safe. Correct.
- **Cross** — flags hate-appropriated Celtic ring-cross variant. Correct.
- No entry casually recommends a symbol with an unflagged hate association. **No missing hate flags found.**

### b. Trademark / treaty-protected — PASS
- **Recycling symbol** (`safe`) — correctly PD (Anderson 1970, not held exclusive); correctly warns Green Dot / Der Grüne Punkt IS trademarked. Verified accurate.
- **Peace sign** (`safe`) — correctly intentionally-PD (Holtom/CND never trademarked). Verified accurate.
- **Laurel wreath** (`caution`) — correctly flags Olympic emblem / film-festival laurels / national seals. Correct.
- **Fleur-de-lis** (`safe`) — flags Saints/Scouts/hotel trademarks AND the colonial-Louisiana slavery-branding history. Exemplary.
- **Caduceus** (`safe`) — correctly distinguishes caduceus (commerce) vs Rod of Asclepius (medicine); warns against copying org logos. Correct.
- Olympic rings and Red Cross are correctly treated as do-not-use in the README cheat-sheet and were missing as `_restricted/` entries — **now created** (see fixes).

### c. Sacred / living-religion symbols — PASS
All living-faith entries carry explicit RESPECT notes, are application-restricted (most to editorial only), and contain NO merch-fodder framing:
- **Om** (`caution`) — most-sacred-in-Hinduism; explicit never-on-footwear/underwear/toilet/gag. Correct.
- **Cross** (`caution`) — respectful-faith-only, never mockery. Correct.
- **Star of David** (`caution`) — living Jewish identity, yellow-badge history, avoid-as-decoration. Correct.
- **Sri Yantra** (`caution`) — living Tantric worship object. Correct.
- **Hamsa, Yin-Yang, Evil Eye, Ankh** (`caution`) — respect notes present and proportionate. Correct.
- **Feather** (`caution`) — flags Native American eagle-feather/headdress appropriation AND US eagle-feather legal restriction. Correct.
- **Crescent moon** (`caution`) — correctly separates free plain crescent from the respect-bearing star-and-crescent.

---

## Fixes applied

### Critical: created the missing `_restricted/` do-not-use safety layer
The `README.md` and many entries' `risk_notes`/`related` fields reference `_restricted/` warning files, but **the folder did not exist** — the section's entire "recognize and reject" mechanism was a dangling promise. Created (facts web-verified):

1. `_restricted/hate-symbols-overview.md` — doctrine + ADL pointer + context rule + numeric-code note.
2. `_restricted/swastika-warning.md` — sacred-in-Asia vs Nazi-Hakenkreuz dual nature; never-commercial.
3. `_restricted/ss-runes-warning.md` — doubled Sowilo = banned SS bolts.
4. `_restricted/runes-hate-appropriation-warning.md` — Othala/Tiwaz/Algiz/Wolfsangel screening.
5. `_restricted/olympic-rings.md` — Ted Stevens Act + Nairobi Treaty; `risk_level: avoid`.
6. `_restricted/red-cross-emblem.md` — Geneva + 18 U.S.C. §706/706a criminal; `risk_level: avoid`; safe-alternative guidance.

### Created missing living-faith entry
7. `religious/star-and-crescent.md` — referenced by `crescent-moon` for the Islam/national respect note but did not exist. Created as `risk_level: caution` living-religion entry (editorial-only applications, respect note, no merch framing).

### Fixed broken in-scope risk-entry cross-link
8. `runes/fehu.md` — `related` pointed to non-existent `[[../animal-totems/bull]]` (no `bull.md`); repointed to existing `[[../astrological/taurus]]` (the bull) in both frontmatter and body.

---

## Flagged for Boss

1. **Other missing referenced folders/files (out of audited scope, structural).** Entries link to `mathematical/` (`infinity`, `atom`, `golden-ratio`), `signal-flags/`, and a section `[[_index]]` that **do not exist**. The README's category table promises them. These are dangling links in non-restricted entries (`recycling-symbol`, `ouroboros`, `platonic-solids`). Recommend either authoring those categories or removing the references. **Not a safety issue, but breaks navigation.**
2. **`_restricted/` stubs are minimal.** The six new warning files cover the do-not-use doctrine accurately, but Boss may want to expand them (numeric hate codes 14/88/1488, additional treaty marks, the Playboy-bunny / corporate-logo trademark examples cited in the README cheat-sheet) into full entries.
3. **No defects found in the 86 audited entries' risk flagging.** The authoring quality is uniformly high — every hate/treaty/sacred hazard was already correctly flagged with web-verifiable facts. The only true gap was the absent safety layer, now built.
