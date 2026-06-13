---
id: yearly-pd-quote-extraction-process
type: sop
title: Quote Extraction Process — Verified PD Works into Section 12
applications: [pod, tshirt, poster, story, blog, social, ai-writing]
risk_level: caution
tags: [public-domain, quotes, extraction, section-12, sop, attribution]
related: ["[[../12-Quotes/README]]", "[[../01-Legal-Guidelines/us-public-domain-cutoff]]", "[[../01-Legal-Guidelines/pd-source-vs-modern-adaptation]]", "[[verification-process]]", "[[categorization-process]]", "[[README]]"]
created: 2026-05-31
---

# Quote Extraction Process — Verified PD Works into Section 12

## Overview

This document defines the repeatable procedure for extracting quotable text from newly confirmed public-domain works and adding verified quotes to [[../12-Quotes/README]]. It is intended to be run in parallel with or immediately after [[categorization-process]] for any work that contains commercially viable, quotable text.

The section 12 library is used directly in product development — quote typography prints, poster text, tee-shirt copy, social media posts, and AI writing prompts. The quality and accuracy of attribution in this library has direct commercial consequences. A misattributed or non-PD quote used on a product creates legal exposure and brand damage.

**Conservative standard:** Only quotes that can be traced to a specific PD edition of the work are eligible for section 12. Unverified, possibly-modernized, or widely-misattributed quotes are placed on the [[../12-Quotes/misattributed-avoid-list]] or excluded entirely.

---

## Inputs Required

- Confirmed PD work (verified through [[verification-process]])
- Access to the original-language PD edition text (via HathiTrust, Project Gutenberg, or equivalent)
- Knowledge of the work's primary language and any relevant translation considerations
- The primary catalogue entry created through [[categorization-process]] (for cross-linking)

## Outputs Produced

- One or more verified quote records added to the appropriate thematic file in [[../12-Quotes/README]]
- Cross-links from the primary catalogue entry to the relevant quote file(s)
- Any misattributed or suspect quotes added to [[../12-Quotes/misattributed-avoid-list]] with explanation

---

## Procedure

### Step 1: Obtain the PD Edition Text

1. Locate the original-language text in a confirmed PD edition. Acceptable sources:
   - **Project Gutenberg** — indicates PD status reviewed; note which edition is used
   - **HathiTrust** — full-text scans of historical editions; confirm the specific edition date
   - **Internet Archive** — useful but double-check edition date
   - **Standard Books** (standardebooks.org) — carefully proofed PD editions
2. Record the specific edition: title, publication year, publisher, edition number if relevant. This is the provenance of every quote you extract.
3. Do **not** use:
   - Modern critical editions (copyrighted editorial apparatus may contaminate text)
   - Audiobooks or spoken recordings (transcription errors common, and recordings may have their own copyright)
   - Secondhand quote aggregator sites (Goodreads, BrainyQuote, AZQuotes) as primary sources — verify quotes against the actual text before using

### Step 2: Identify Candidate Quotes

Read through the text (or a reliable summary of it) to identify candidate quotes. A good quote for section 12 is:

- **Memorable and self-contained** — intelligible without the surrounding context
- **Commercially viable** — suitable for typography on a product; strong visual or emotional resonance
- **Attributable clearly** — can be attributed to a specific speaker, narrator, or author within the work
- **Thematically aligned** with one of the existing thematic files in section 12 (wisdom, courage, love, perseverance, humor, leadership, creativity, nature, stoicism) or a new theme that warrants a file

Aim for 3–10 high-quality candidates per work rather than exhaustive extraction. Quality over volume.

### Step 3: Verify Each Quote Against the Source Text

This step is non-negotiable. Do not assume a quote is accurate because it appears in multiple places online.

1. Locate the exact passage in the PD edition text.
2. Confirm the exact wording. Even minor paraphrasing disqualifies a quote as a "direct quote" — it can still be used with appropriate framing, but must be labelled as paraphrase or interpretation, not quotation.
3. Confirm the speaker or narrator. If the quote is dialogue, attribute it to the character, not the author. If it is narration or a first-person account, attribute to the narrator and/or author as appropriate.
4. Record the chapter, section, or page reference from the PD edition so the quote can be re-located and re-verified later.

### Step 4: Check for Misattribution Risk

Before writing the quote into section 12, assess whether it is commonly misattributed in popular culture.

1. Search the quote text in the **Quote Investigator database** (`quoteinvestigator.com`) — this is the most reliable resource for tracking misattribution.
2. If the Quote Investigator (or equivalent research) shows the quote is commonly attributed to someone other than the actual source, note this explicitly in the entry and add a disambiguation note.
3. If a quote is commonly attributed to this author but **cannot be traced** to the actual PD text, place it on [[../12-Quotes/misattributed-avoid-list]] rather than in a thematic file. Do not use commercially until provenance is confirmed.

### Step 5: Check Translation Status

If the original work is not in English, or if you are working from a specific English translation:

1. Identify the translator and the translation's publication year.
2. If the translation was published in the US in 1930 or earlier (for 2026): the translation is PD and may be quoted directly.
3. If the translation was published after 1930 (in 2026 terms): the translation is **separately copyrighted** and cannot be quoted verbatim from that translation. Options:
   - Use a confirmed PD translation (published in the PD year or earlier)
   - Quote the original-language text (if that is PD) and provide a fresh paraphrase — do not present the paraphrase as a direct quote
   - Commission an original new translation
4. Document which translation was used and its publication year in every quote entry.

### Step 6: Write the Quote Entry

Each quote is recorded in the appropriate thematic file in [[../12-Quotes/README]] (wisdom.md, courage.md, love.md, etc.). If no suitable thematic file exists for the quote's tone, either assign it to the nearest thematic file or flag for human review to determine if a new file is warranted.

**Quote entry format:**

```markdown
> "<Exact verbatim quote from PD edition text.>" — <Speaker/Narrator>, *<Full Title>* (<publication year>)

**Source:** <Creator full name>, *<Title>* (<PD edition year>), <publisher if known>. Accessed via <HathiTrust/Gutenberg/etc.>. Chapter/section: <reference>.
**Translation note:** <Original language and translator if applicable; state which translation was used and its PD basis.>
**Misattribution note:** <Only if applicable — note alternate attributions circulating online and confirm correct attribution.>
**Themes:** [[../12-Quotes/wisdom]], [[../12-Quotes/courage]] (list all applicable thematic files)
**Commercial uses:** typography print, poster, social quote card, tee-shirt text
**Cross-reference:** [[../05-Literature/<primary-entry-filename>]] (or appropriate section)
```

### Step 7: Update the Primary Catalogue Entry

In the primary catalogue entry created through [[categorization-process]], add a cross-link to the thematic quote file(s) where entries for this work now appear. This ensures the catalogue entry points to all extracted outputs.

### Step 8: Add to Misattribution List if Necessary

If during research any quote was found to be misattributed, widely paraphrased, or of uncertain origin, add a record to [[../12-Quotes/misattributed-avoid-list]]:

```markdown
### <Misquote / paraphrase>
**Commonly attributed to:** <Wrong attribution circulating online>
**Actual source or lack thereof:** <What Quote Investigator or primary research found>
**Correct version (if one exists):** <Actual text from actual source, if traceable>
**Status:** Do not use as a direct quote from <wrong author>; investigate before commercial use
```

---

## Quality Standards

Every quote entered into section 12 must satisfy all of the following:

- [ ] Traced to a specific PD-edition text (not a secondhand source)
- [ ] Exact wording verified against the source
- [ ] Speaker/author attribution confirmed
- [ ] Chapter or section reference recorded
- [ ] Translation provenance documented (if applicable)
- [ ] Misattribution check completed via Quote Investigator or equivalent
- [ ] Thematic file assignment made
- [ ] Cross-link created from primary catalogue entry

---

## Common Traps

**Trap: Quoting a famous "translation" that is actually modern.** Many beloved English versions of foreign-language classics — Dostoevsky, Dante, Homer — are 20th or 21st century translations. The original is PD; the beloved English translation is not. Verify the translation year every time.

**Trap: Accepting quotes from aggregator sites.** BrainyQuote, Goodreads, and similar sites aggregate quotes without consistent verification and frequently contain errors, paraphrases, or entirely fabricated attributions. They are leads, not sources. Always trace back to the original text.

**Trap: Attributing a character's speech to the author.** When a character in a novel says something memorable, it is a character quote, not an author quote. "Sherlock Holmes said…" not "Arthur Conan Doyle said…". Misattribution of this type is common online and commercially damaging.

---
*Part of the Polymath Source Material Bible — Section 18 Yearly Public Domain Updates. Not legal advice.*
