---
type: report
title: Source Material Bible — Coverage & Cross-Link Audit
created: 2026-05-31
---

# Source Material Bible — Coverage & Cross-Link Audit

Generated 2026-05-31. This report audits the build state of the whole vault: how
many entries each section holds, which sections look thin against their intent,
the health of the wikilink graph, a rollup of the four section verification
audits, a consolidated list of every legally/ethically flagged item for Boss
review, and a recommended next intake.

**Headline numbers**

- **424 entries** across the 19 section folders.
- **473 total Markdown files** (468 inside section folders + 5 root foundation
  docs: `README`, `METADATA-STANDARD`, `DATABASE-READINESS`, `DOC-STANDARDS`,
  `MAP`).
- **45 infrastructure files** (19 README, 17 `_template`, 4 `_VERIFICATION`, plus
  the 5 root docs).
- **5,664 wikilinks** parsed; **817 do not resolve** to an existing file
  (Obsidian basename matching), spread over 283 distinct missing targets. A
  further 273 links are folder/section navigation (legitimate) and 24 are
  template placeholders (`<entry>` etc.).

---

## Per-section coverage

`Entry files` excludes README / `_template` / `_VERIFICATION`. `Total .md`
counts everything in the folder.

| Section | Entry files | Total .md | README? | `_template`? | `_VERIFICATION`? | Notes |
|---|---|---|---|---|---|---|
| 01-Legal-Guidelines | 7 | 9 | yes | yes | no | Doctrine hub; small by design. |
| 02-Public-Domain-Library | 20 | 23 | yes | yes | **yes** | Verified pass-with-fixes. Stale `related:` scheme (see links). |
| 03-Mythology | 67 | 73 | yes | yes | no | Largest narrative section; 5 sub-pantheon READMEs. |
| 04-Folklore | 18 | 20 | yes | yes | no | Solid. A few Arthurian links dangling. |
| 05-Literature | 16 | 18 | yes | yes | no | OK. Several intended sub-entries not yet written. |
| 06-Historical-Art | 15 | 17 | yes | yes | no | OK; many movement cross-links unresolved. |
| 07-Historical-Design | 18 | 20 | yes | yes | no | OK; recipe links to `design-system-*` targets that don't exist. |
| 08-Color-Palettes | 16 | 18 | yes | yes | no | OK; outbound links to motifs/myth that don't exist yet. |
| 09-Symbols | 86 | 88 | yes | yes | no | Largest section; rich sub-foldering. `_restricted/` warning files referenced but absent. |
| 10-Archetypes | 22 | 25 | yes | yes | **yes** | Verified pass-with-fixes; near-clean link graph. |
| 11-characters | 16 | 18 | yes | yes | no | Lowercase folder name (`11-characters`). Heavy stale-link load. |
| 12-Quotes | 10 | 13 | yes | yes | **yes** | Verified pass-with-fixes; **zero broken links** — cleanest section. |
| 13-Visual-Motifs | 14 | 16 | yes | yes | no | Slightly thin; a couple of unbuilt motif targets. |
| 14-Trending-Categories | 14 | 16 | yes | yes | no | Worst link hygiene (191 broken) — bare-number folder links `[[13]]`, `[[08]]`. |
| 15-Remix-Frameworks | 8 | 10 | yes | yes | no | At floor; example combo-links are illustrative, not entries. |
| 16-Prompt-Templates | **3** | 5 | yes | yes | no | **THIN — under-delivered (see flag).** |
| 17-Design-Recipes | 22 | 24 | yes | yes | no | Healthy; many recipes point at `07/typography` which doesn't exist. |
| 18-Yearly-Public-Domain-Updates | 7 | 8 | yes | **no** | no | Log section; no `_template`. Placeholder `<entry-file>` links. |
| 19-Trend-Dictionary | 45 | 47 | yes | **no** | **yes** | Verified; carries `ship_decision`. No `_template`. Clean links. |

**Grand totals: 424 entries · 468 section files · 473 files including root docs.**

---

## Spec-target check — thin sections

### 16-Prompt-Templates — UNDER-DELIVERED (priority)

Only **3 entry files**. The spec wanted tested prompt scaffolds spanning
**image, writing, storytelling, podcast, brand, character, and merch**. Outbound
links in the section already reference scaffolds that were never written
(`shared/legal-preflight`, `ai-image/midjourney-pd-art-style`,
`brand-generation/brand-identity-generator`, `ai-image/sdxl-character-portrait`,
`ai-image/poster-composition`, `ai-image/flux-photoreal-scene`) — so the
intended structure is visible but mostly empty.

**Recommended top-up (write ~8–10 entries):**
- `ai-image/` — Midjourney PD-art-style, SDXL character portrait, FLUX photoreal
  scene, poster composition (4 files the section already links to).
- `writing/` — short-form copy + long-form article scaffold.
- `storytelling/` — children's-book page-spread prompt; narrative-beat prompt.
- `podcast/` — episode-outline + show-notes prompt.
- `brand/` — brand-identity generator (already linked).
- `character/` — PD-character reinterpretation prompt (wired to `risk_notes`).
- `merch/` — POD/t-shirt composition prompt.
- `shared/legal-preflight` — the pre-generation safety checklist five other
  templates already link to.

### Other sections at or near the floor

- **15-Remix-Frameworks (8)** — meets the stated 8 but is the second-smallest.
  Its dangling links (`greek-myth-x-sports`, `tarot-x-tech-startup`,
  `constellations-x-animals`, etc.) are illustrative combinations, not promised
  entries; no top-up strictly required, but converting 4–6 of the best example
  combos into real recipe entries would lift it clear of the floor.
- **13-Visual-Motifs (14)** — healthy but references `sacred-geometry-emblems`
  (7×) and `stamp-and-postmark` (6×) as if they were entries. **Recommend
  writing those two motif files** — they are clearly intended and already
  heavily cited.
- **01 (7)** and **18 (7)** are intentionally small (doctrine hub / annual log);
  no action.

No other section falls below the ~8-entry concern line.

---

## Verification rollup

Four sections carry a `_VERIFICATION.md`. All four returned **pass-with-fixes**.

| Section | Verdict | One-line summary |
|---|---|---|
| **02-Public-Domain-Library** | pass-with-fixes | Adversarial IP audit of 18 works; PD dates, quote provenance and translation traps all held up; 2 accuracy errors fixed in-place (Oz/Thompson copyright wording, Aesop "no act of kindness" relabelled as modern paraphrase); 3 items flagged for Boss. |
| **10-Archetypes** | pass-with-fixes | 22 archetypes, schema 100% compliant, target met; 1 IP leak fixed (Tolkien's Sam Gamgee → PD Sancho Panza) and 2 dangling alias links de-linked (`champion`, `muse`). |
| **12-Quotes** | pass-with-fixes | Adversarial attribution/copyright audit of 10 quote files; 3 defects fixed (Baillie title/act, Bynner Tao Te Ching date 1937→1944, Voltaire "common sense" downgraded to caution); 5 items flagged; cleanest link graph in the vault. |
| **19-Trend-Dictionary** | pass (gated) | 40 slang phrases web-verified through a three-force GO/HOLD/NO gate; 5 GO, 26 HOLD (need USPTO Class-25 spot-check), 9 NO (5 ethical, 4 legal). |

Sections **01, 03, 05, 09, 11** have **no** `_VERIFICATION.md` — the consolidated
list below pulls in their flagged items where they surface inside other sections'
audits (e.g. Peter Pan / Sherlock from 02 and 10), but a dedicated adversarial
pass on **01, 03, 05, 09, 11** is still outstanding and is recommended before
those sections feed production.

---

## FLAGGED-FOR-BOSS — consolidated review list

Every legally or ethically flagged item pulled from the four section audits into
one place. Phrase/work → flag → recommended action.

### Legal / copyright / trademark (from 02 and 12)

1. **Peter Pan — UK GOSH perpetual royalty** (02 / peter-pan, echoed in 10) →
   Great Ormond Street Hospital holds a perpetual UK royalty right on commercial
   stage/publication/broadcast even after copyright lapse; the entry's parenthetical
   expiry history is compressed. → **Confirm GOSH wording with §01/counsel before
   any UK commercial product ships.** Single most jurisdiction-specific obligation
   in the vault.
2. **"Faithful-scan / museum reproduction" reliance** (02 — great-wave, alice,
   grimms, aesops, peter-pan, raven, christmas-carol) → Bridgeman v. Corel is
   correctly cited, but a downstream generator could pull a watermarked museum/stock
   file asserting contractual or non-US database rights. → **Hard-require a confirmed
   CC0/PD source (Met Open Access, LoC, Wikimedia PD); never a generic image-search
   result.** Process control.
3. **Trademark "live registration" assertions without register citations** (02 —
   frankenstein, dracula, sherlock, wizard-of-oz, peter-pan/Tinker Bell, alice,
   christmas-carol) → flags are directionally right and conservative but cite no
   USPTO/EUIPO number; TM status is class-specific and drifts. → **Re-check the
   register before launching any branded line leaning on one of these names.**
4. **Sherlock Holmes — PD-as-of-2023, estate caution** (02 / 10) → all 60 stories
   now US-PD; the Conan Doyle estate has historically been litigious. → Usable;
   **keep the estate-caution note and avoid implying authorisation.**
5. **FDR "fear itself" as a clean §105 government work** (12 — courage Q08,
   leadership Q01–Q03) → defensible reading but never litigated to a clean holding.
   → **Soften "is in the public domain as a work of the US government" to "is
   generally treated as public domain…"** Low risk.
6. **JFK inaugural** (12 — leadership Q09) → already `caution`; right-of-publicity /
   false-endorsement risk correctly identified. → **Keep the "avoid on merch"
   instruction; no fix needed.**
7. **Twain "Clothes make the man" / *More Maxims of Mark* (1927)** (12 — humor Q02)
   → PD conclusion correct, but exact wording is Merle Johnson's 1927 compilation of
   a 1905 Twain passage, not strictly verbatim Twain. → **Add a one-line note;
   attribution-precision only, no rights problem.**
8. **Edison "genius is one percent inspiration"** (12 — perseverance Q18) →
   pre-1930 exact-wording provenance is fuzzy. → **Leave as caution; pin to a
   pre-1930 printed source before use.**
9. **Frost "Stopping by Woods"** (12 — nature Q18) → US-PD (1923) but NOT PD in
   life+70 jurisdictions until 2034. → **Keep `caution` + "restrict to US-market
   products"; retain as the 95-year window advances.**
10. **Voltaire "common sense is not so common"** (12 — wisdom Q22) → attribution
    contested (Voltaire was repeating a proverb; widely miscredited to Twain/Rogers).
    Already downgraded to `caution` / `pd_verified: false`. → **Present unattributed
    or as "attributed to Voltaire," never as a verbatim sourced quotation.**
11. **Protected-identity / deny-list roster** (12 — misattributed-avoid-list):
    **Einstein** (Hebrew University TM Reg. 3591305), **Tolkien**, **Picasso**,
    **Mandela**, **Monroe/ABG**; plus fabricated/restricted lines — Burke "triumph
    of evil," Ulrich "well-behaved women" (1976, in copyright), Semisonic "Closing
    Time" (1998, fake-Seneca), fake-Einstein "insanity" cluster. → **Keep all on the
    hard deny-list.**

### Ethical hard-NO (from 19-Trend-Dictionary)

12. **gooning, edging, gyat/gyatt** → sexual / objectifying. → **OFF-LIMITS, do not
    ship.**
13. **looksmaxxing, mogging** → incel / manosphere ("black pill") origin. →
    **OFF-LIMITS, do not ship.**

### Legal hard-NO (from 19-Trend-Dictionary)

14. **skibidi toilet** → copyrighted series + active IP litigation (Invisible
    Narratives v. Next Level); DMCA takedowns fired. → **AVOID.**
15. **brat / brat summer** → Charli XCX common-law TM + "brat green" trade dress;
    trend dead. → **AVOID.**
16. **very demure very mindful** → multiple disputed TM applications, contested
    ownership, dead trend. → **AVOID.**

### Trend phrases needing Boss sign-off before production (from 19)

17. **sigma** → manosphere origin; only the ironic rendering acceptable. → **Confirm
    tone.**
18. **mewing** → render only as the "stay silent" gag, never jaw/looksmaxxing
    framing. → **Confirm.**
19. **fanum tax** → drop the creator name "fanum"; ship only the generic food-tax gag
    if at all (declining). → **Confirm.**
20. **glaze** → confirm over-praise-only rendering, no innuendo. → **Confirm.**
21. **All 26 HOLD phrases** (no cap, cap, rizz, sigma, mewing, fanum tax, delulu,
    bussin, mid, NPC, aura, brainrot, crash out, glaze, it's giving, ate, slay, sus,
    ratio, drip, cooked, locked in, six seven, chat is this real, type beat, Ohio) →
    `trademark_status: unknown`. → **Require a USPTO TESS Class-25 spot-check +
    marketplace-saturation scan before any mass production; `unknown` is never
    auto-GO.**

**Total items on the FLAGGED-FOR-BOSS list: 21** (11 legal/copyright/TM,
2 ethical hard-NO clusters, 3 legal hard-NO, 4 trend sign-offs + 1 blanket HOLD
gate — counting the HOLD-gate line as one item).

---

## Cross-link audit

**817 broken wikilinks** (of 5,664 total) across **283 distinct missing targets**.
Most are not random rot — they cluster into a few systemic patterns. Worst
offenders grouped by source section:

| Source section | Broken | Worst targets (count) |
|---|---|---|
| 14-Trending-Categories | 191 | bare-number folder links `[[13]]`(33), `[[08]]`(32), `[[09]]`(32), `[[15]]`(32), `[[01]]`(19) |
| 02-Public-Domain-Library | 82 | stale-scheme `related:` → `01-Legal-Guidelines/translation-trap`(6), `07-Historical-Design/greek-classical`(4), `…/art-deco`(2), `…/ukiyo-e`(2) |
| 11-characters | 69 | `01-legal-doctrine`(33), `02-public-domain-literature`(31) — both old section slugs that no longer exist |
| 07-Historical-Design | 66 | `design-system-victorian-pattern`(8), `design-system-islamic-geometric`(6), `…-greek-roman-mosaic`(5), `…-art-deco-geometric`(5) — unbuilt design-system entries |
| 09-Symbols | 65 | `../_restricted/runes-hate-appropriation-warning`(16), `../mathematical/infinity`(6), `../_restricted/ss-runes-warning`(6) — missing `_restricted/` warning files + sub-symbol entries |
| 06-Historical-Art | 62 | `movement-timeline`(33), `art-nouveau`(5), `style-emulation-vs-copying`(4), `fauvism`/`expressionism`/`surrealism`(3 each) |
| 08-Color-Palettes | 61 | outbound to unbuilt `13-Visual-Motifs/*` and `03-Mythology/*` targets (1–3 each) |
| 17-Design-Recipes | 39 | `07-Historical-Design/typography`(33) + placeholder `14-Trending-Categories/<niche>` |
| 15-Remix-Frameworks | 35 | illustrative combo links (`greek-myth-x-sports`, `tarot-x-tech-startup`, …) — examples, not promised entries |
| 16-Prompt-Templates | 24 | links to the unwritten template files listed under the thin-section flag |
| 04-Folklore | 40 | `excalibur`(4), `../../10-Archetypes/the-shadow`(4 — no `shadow.md`), Arthurian sub-entries |
| 03-Mythology | 22 | `humbaba`(3), `ereshkigal`(3) — unwritten Mesopotamian entries; a few README-anchor links |
| 13-Visual-Motifs | 19 | `sacred-geometry-emblems`(7), `stamp-and-postmark`(6) — should be written (see thin flag) |
| 05-Literature | 14 | planned sub-entries (`a-princess-of-mars`, `tarzan-of-the-apes`, `war-and-peace`, `winnie-the-pooh`) |
| 18-Yearly-Public-Domain-Updates | 7 | template placeholders `<entry-file>` |
| root docs (METADATA/DOC/DATABASE/MAP) | ~13 | mostly illustrative example links (`the-hero`, `art-deco`, `wikilinks`) — intentional, not real entries |

### Three systemic root causes

1. **Stale section-numbering scheme (57 links).** The `02-Public-Domain-Library`
   entries and a few others were written against an earlier folder map and link to
   prefixes that no longer exist: `03-Characters-Archetypes/*`,
   `04-Themes-Symbols/*`, `05-Quotes-Text/*`, `11-Remix-Frameworks/*`,
   `12-Prompt-Design-Recipes/*`. Each points to a unique, never-created slug
   (`the-american-dream`, `gatsby-quotes`, `hubris`, …), so they cannot be
   auto-remapped — they need either new entries or removal. **Recommend a
   find-and-replace pass mapping old→new section numbers, then deletion of links
   whose target was never authored.**
2. **Bare-number / nav links (273 classified separately, plus ~135 bare-number
   misses concentrated in 14).** Links like `[[13]]`, `[[08]]`, `[[01]]` in
   14-Trending-Categories are meant as section jumps but don't resolve by basename.
   **Recommend rewriting to full folder names** (`[[13-Visual-Motifs]]`).
3. **Forward-references to unbuilt entries.** Many "broken" links are correct
   *intent* pointing at files that simply aren't written yet (`movement-timeline`,
   the `design-system-*` set, `_restricted/` warnings, Mesopotamian myths, the
   prompt-template tree). These convert from broken to valid as the backlog is
   filled — they are a **coverage signal, not link rot**.

### Fixes applied this pass (13 links, unambiguous only)

- `02-Public-Domain-Library/{aesops-fables, alice-in-wonderland, norse-mythology}.md`
  — `[[03-Characters-Archetypes/the-trickster]]` → `[[10-Archetypes/trickster]]`.
- 10 folklore fairy-tale files — dropped the non-existent `the-` prefix on
  archetype/symbol links: `[[…/10-Archetypes/the-innocent]]` → `…/innocent`,
  `the-trickster` → `trickster`, `the-lover` → `lover`,
  `[[…/09-Symbols/the-rose]]` → `…/rose`.

All other broken links were left in place and reported — their correct target is
either ambiguous, never authored, or illustrative example text (e.g. `[[the-hero]]`
inside `DOC-STANDARDS.md`).

---

## Recommended next intake

### Top public-domain works to catalogue next (already cited but not written)

- **Mythology (03):** `humbaba`, `ereshkigal` and the rest of the Mesopotamian
  pantheon — already linked from existing myth entries.
- **Symbols (09):** the `_restricted/` warning files (`runes-hate-appropriation-warning`,
  `ss-runes-warning`, `olympic-rings`) — these are *safety* entries and should be
  prioritised; plus `mathematical/infinity` and the animal/botanical sub-symbols.
- **Historical Art / Design (06/07):** `movement-timeline`, `art-nouveau`,
  `fauvism`, `expressionism`, `surrealism`, and the `design-system-*` set
  (victorian-pattern, islamic-geometric, greek-roman-mosaic, art-deco-geometric,
  william-morris-textiles, damask) — all heavily cited by recipes.
- **Literature (05):** `a-princess-of-mars` and `tarzan-of-the-apes` (Burroughs —
  note the live trademarks flagged elsewhere), `war-and-peace`, `winnie-the-pooh`
  (US 1926 text now PD — coordinate with the existing Disney-design trap entry).
- **Visual Motifs (13):** `sacred-geometry-emblems`, `stamp-and-postmark`.
- **Prompt Templates (16):** the full 8–10 file build-out listed in the thin-section
  flag (this is the highest-leverage intake).

### Prep the Jan 1 2027 PD class (US works published 1931)

On **January 1 2027**, US works first published in **1931** enter the public
domain (95-year term). Stage these now in `18-Yearly-Public-Domain-Updates` so the
catalogue can flip them to `public-domain` on the date:

- **Literature:** *The Glass Key* (Dashiell Hammett); *The Good Earth* (Pearl S.
  Buck); William Faulkner's *Sanctuary*; Kahlil Gibran's later work.
- **Film/visual (text/character vs design caution applies):** *Dracula* (1931
  Universal — Lugosi) and *Frankenstein* (1931 Universal — Karloff) films enter PD,
  but **only the 1931 film works themselves**; the underlying novels are already PD,
  and the **bolt-neck / Lugosi-cape visual designs remain trademark/design-sensitive**
  — flag hard in the update entry. *City Lights* (Chaplin) and *M* (Fritz Lang, DE —
  check jurisdiction) also 1931.
- **Music/comics:** 1931 compositions and strips — run each through the
  translation/edition and trademark checks before clearing.

**Action:** draft a `2027-additions` stub in section 18 now, pre-tagging each
candidate `pd_status: caution` with a "flips public-domain 2027-01-01" note, and
schedule the verification sweep for late December 2026.

---

Related: [[README]] · [[INDEX]] · [[MAP]] · [[01-Legal-Guidelines]] ·
[[02-Public-Domain-Library/_VERIFICATION]] · [[10-Archetypes/_VERIFICATION]] ·
[[12-Quotes/_VERIFICATION]] · [[19-Trend-Dictionary/_VERIFICATION]]

---

## Gap-Closure Round — 2026-06-01

The original build workflow died overnight before writing section 18 and before running synthesis or the IP-verification pass on the high-risk sections. Closed manually:

### Built / completed
- **18-Yearly-Public-Domain-Updates** — was empty; now 8 SOP files (intake, verification, categorization, quote/archetype/symbol extraction, trend analysis).
- **16-Prompt-Templates** — was 3 files; now 10 (7 templates: ai-image, ai-writing, ai-storytelling, podcast, brand, character, merch-pod). Worked examples wired to real entry ids across 9 sections.

### IP / ethics verification (was never run by the dead workflow)
- **11-characters** — pass-with-fixes. Snow White dwarf names mislabeled trademark → corrected to 1937-film copyright (expires 2033). Oz ruby-slippers copyright-vs-wordmark split. README advertised 7 phantom entries incl. highest-risk Zorro/Tarzan/John Carter as "covered" → re-flagged avoid/not-written.
- **05-Literature** — pass-with-fixes. Removed 2 misattributed "Milne" quotes (actually Disney-era inventions) from the Pooh dossier. Fixed Sherlock Case-Book count (12, not 10).
- **09-Symbols** — pass-with-fixes. Content flags accurate (ADL/Geneva/Olympic law web-verified) but the referenced `_restricted/` do-not-use layer did not exist → created 6 warnings (swastika, SS-runes, rune appropriation, Olympic rings, Red Cross=criminal, hate-symbols overview) + missing Islam star-and-crescent entry.

### Updated totals
438 entries / 485 section files + 7 root docs = **492 files**.

### Still outstanding (for Boss / next session)
1. **Author 3 phantom high-risk character entries**: Zorro, Tarzan, John Carter (live trademarks; currently avoid).
2. **Resolve other phantom rows** in 11-characters README (Tom Sawyer, Anne of Green Gables [live PEI trademark], Popeye, Buck Rogers) — write or delete.
3. **01-Legal-Guidelines and 03-Mythology** have no `_VERIFICATION.md` yet (lower risk: 01 = supplied doctrine, 03 = ancient material with modern-adaptation flags already noted).
4. **`verified: true` overclaim** on un-spot-checked entries — treat each `_VERIFICATION.md` as the authoritative record, not the frontmatter flag.
5. **Broken wikilinks (~817)** — mostly forward-references to unbuilt entries + mechanical nav in 14/02. Coverage signal, not rot. Worst clusters: 14-Trending-Categories bare-number nav (191), 02 stale numbering (57).
6. **Expand 09 `_restricted/`** with numeric hate codes (14/88) and corporate-logo trademark examples.
7. **INDEX.md** is from the first synthesis pass — slightly stale for 09/16 (regenerate on demand).
