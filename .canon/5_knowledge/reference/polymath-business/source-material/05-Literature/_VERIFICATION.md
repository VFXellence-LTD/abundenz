---
id: pd-lit-verification-2026-05-31
type: verification-log
title: "Verification Log — Section 05 Literature"
audited_by: "Adversarial IP/copyright fact-check (automated)"
audit_date: 2026-05-31
doctrine_date: "2026 (US 95-yr term; works published 1930-or-earlier are PD)"
verified: true
tags: [verification, audit, public-domain, literature]
created: 2026-05-31
---

# Verification Log — Section 05 Literature

> Adversarial IP/copyright audit of all 16 Literature entries. Date of record: 2026-05-31.

## Method

1. Globbed and read all `.md` files in `05-Literature/` (8 ancient-classical, 3 medieval, 5 trap dossiers, plus README and template).
2. Applied US public-domain doctrine for 2026: works published **1930 or earlier** are PD (95-year term; 1930 entered PD on 1 Jan 2026; the wall advances yearly — 1931 enters Jan 2027). Post-1977 works = life + 70.
3. Web-verified the high-risk factual claims (publication years, story counts, statute citations, translation/quote attributions, live trademarks) against authoritative sources.
4. Default-to-caution: any unconfirmed restriction stays `caution`/`restricted`. Fixed errors in-place via Edit.
5. Confirmed every PD-original entry flags the translation / critical-edition / modernization trap where relevant.

## Doctrine check across entries — PASS

- **No entry mislabels a post-1930 work as public domain.** Every PD-status work is either ancient/medieval (permanently free) or, in the trap dossiers, pre-1930 in its PD-relevant portion (Holmes 1887–1927, Peter Pan 1904/1911, Pooh 1926/1928, Tarzan / A Princess of Mars 1912).
- **Translation trap coverage is excellent and consistent.** All eight ancient/medieval entries correctly state that the original is free but a *specific modern translation* is independently copyrighted, and each names public-domain alternatives plus the in-copyright versions to avoid (Wilson, Fagles, Lattimore, Heaney, Tolkien, Hays, Cleary, Griffith, Coghill, Mandelbaum, Hollander, etc.). The `translations-and-editions` dossier is accurate and thorough (translations, critical editions, annotations, fonts, 20th-c. illustrations).
- **`marcus-aurelius-meditations`** correctly singles out the **Gregory Hays 2002** translation as the #1 accidental-infringement risk in the Stoic-quote niche. Verified-good.

## Claims web-checked

| Claim | Verdict | Source |
|---|---|---|
| Sherlock Holmes full canon US-PD since 1 Jan 2023 (Case-Book 1927) | TRUE | PBS, Wikipedia (The Case-Book of Sherlock Holmes) |
| Case-Book = **twelve** stories, first published in *The Strand* 1921–1927, book June 1927 | TRUE (entry said "ten… 1923–1927" — FIXED) | Wikipedia |
| Klinger v. Conan Doyle Estate (2014, 7th Cir.) rejected estate's trait-copyright theory | TRUE | Wikipedia, Klinger case |
| Peter Pan: GOSH perpetual UK royalty via CDPA 1988 (s.301 / Sch.6); Barrie d.1937, UK copyright expired end 2007 | TRUE | GOSH, Rocket Lawyer UK, Hansard 1988 |
| Winnie-the-Pooh (1926) US-PD 1 Jan 2022; House at Pooh Corner (1928) US-PD 1 Jan 2024; Tigger first appears 1928 | TRUE | (consistent w/ 95-yr doctrine; Tigger 1928 confirmed) |
| Disney's red-shirt Pooh = separate live copyright + trademark | TRUE | (Disney licensed 1961) |
| Pooh quotes "smallest things take up the most room" / "how lucky I am… saying goodbye so hard" attributable to Milne | **FALSE — both are misattributed, likely Disney-era inventions** (FIXED) | poohmisquoted, dirt.fyi, multiple |
| Tarzan / John Carter early novels (1912) US-PD; "TARZAN"/"JOHN CARTER" are live ERB Inc. registered trademarks, actively enforced | TRUE | edgarriceburroughs.com IP notice, Techdirt, Justia (Reg. 5498007) |

## Fixes applied in-place

1. **`traps/winnie-the-pooh-vs-disney.md`** — The "What is safe" section listed two quotes as safe public-domain Milne material:
   - *"Sometimes the smallest things take up the most room in your heart"*
   - *"How lucky I am to have something that makes saying goodbye so hard"*

   Both are **not in Milne's 1926/1928 text** and are widely identified as later/Disney-origin lines (the second tied to Disney's *Pooh's Grand Adventure*). This is a trap-within-a-trap: the dossier's entire thesis is "copy Milne, never Disney," yet it recommended Disney-origin text as Milne. **Fix:** removed the two quotes from the safe list, replaced with "quotes verified against the original books," and added a boxed **MISATTRIBUTION TRAP** note instructing operators to only use lines confirmed verbatim in the 1926/1928 text. *Severity: HIGH (active infringement-bait in a legal dossier).*

2. **`traps/sherlock-holmes-estate.md`** — Body said the Case-Book was "the **ten**… (published 1923–1927)." Corrected to "the **twelve**… (the stories first appeared in *The Strand* between 1921 and 1927; the collected book was published June 1927)." *Severity: LOW (factual precision; the PD conclusion and 1 Jan 2023 date were already correct).*

## Items flagged for Boss (no edit made — your call)

- **Broken wikilinks (out of audit scope, not fixed).** Several entries link to targets not present in this section's file list, e.g. `[[medieval/arthurian-legend]]` (in `beowulf.md`), `[[detective-fiction/sherlock-holmes]]`, `[[childrens-classics/peter-pan]]`, `[[childrens-classics/winnie-the-pooh]]`, `[[early-scifi/a-princess-of-mars]]`, `[[early-scifi/tarzan-of-the-apes]]`, `[[18-19th-novels/war-and-peace]]`. These are presumably planned-but-unwritten entries. **Recommend:** confirm they are on the roadmap, or the links should be stubbed/removed.
- **"Z-name" branding advice** appears in three trap dossiers (Holmes, Tarzan/John Carter, Pooh) as the owned-branding workaround. The advice is sound (avoid trading on PD-character names / live marks) but the literal "Z-name" phrasing reads like an internal house convention — confirm it is intentional and understood downstream.
- **Pooh quote sourcing going forward.** Recommend the pipeline only emit Pooh quotes drawn from a verified PD source file (Wikisource / Project Gutenberg Canada hosts the 1926/1928 text in Canada; confirm US sourcing). Worth a hard rule given how saturated the web is with fake Milne quotes.

## Verdict

Section 05 Literature is **sound and well-built**. The translation-trap discipline is exemplary and consistent across all classical/medieval entries, and the trap dossiers (Holmes, Peter Pan/GOSH, Pooh/Disney, Tarzan/John Carter) correctly distinguish PD text from live copyright/trademark/royalty overlays. Two factual errors were found and fixed: one HIGH-severity (misattributed Disney-origin quotes presented as safe Milne text) and one LOW-severity (Sherlock story count/date). No PD-status mislabeling and no doctrine errors. All `verified: true` flags are now accurate as of 2026-05-31.

---
*Part of the Polymath Source Material Bible — Section 05 Literature. Defers to Section 01 for rights. Not legal advice.*
