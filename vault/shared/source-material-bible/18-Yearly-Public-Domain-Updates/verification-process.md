---
id: yearly-pd-verification-process
type: sop
title: Public Domain Verification Process
applications: [pod, story, tshirt, poster, childrens-book, merch, character, brand, ai-image, ai-writing]
risk_level: caution
tags: [public-domain, verification, copyright, sources, renewal-records, sop]
related: ["[[../01-Legal-Guidelines/us-public-domain-cutoff]]", "[[../01-Legal-Guidelines/copyright-vs-trademark-vs-likeness]]", "[[../01-Legal-Guidelines/pd-source-vs-modern-adaptation]]", "[[intake-workflow]]", "[[categorization-process]]", "[[README]]"]
created: 2026-05-31
---

# Public Domain Verification Process

## Overview

This document defines the repeatable procedure for confirming that a candidate work is genuinely in the public domain before it is catalogued in this Bible or used in any VFXellence Ltd product. Verification is a required gate — no work proceeds to categorization, extraction, or commercial use without completing this process.

The legal framework is documented in [[../01-Legal-Guidelines/us-public-domain-cutoff]]. This process operationalizes that framework into a step-by-step checklist with specific authoritative sources.

**Conservative bias is the default.** When evidence is ambiguous, incomplete, or contradictory, the work is marked **caution** and referred for human review. It is never catalogued as safe on the basis of incomplete evidence.

---

## Authoritative Sources

Use only the following sources for verification. Do not rely on general web searches, AI-generated summaries, or secondary commentary for legal conclusions.

### Primary Sources (use first)

| Source | URL | Best For |
|---|---|---|
| U.S. Copyright Office — Copyright Records | `copyright.gov/records` | Registration and renewal records post-1978; online records vary by period |
| U.S. Copyright Office — Public Catalog | `cocatalog.loc.gov` | Searching copyright records from 1978 onward |
| Stanford Copyright Renewal Database | `collections.stanford.edu/copyrightrenewals` | Checking 1923–1963 renewal records — the most important tool for the 1931–1963 at-risk zone |
| Duke Law Center for the Study of the Public Domain — Public Domain Day | `law.duke.edu/cspd/publicdomainday` | Curated, expert-reviewed annual PD entrant lists |
| HathiTrust Digital Library | `hathitrust.org` | Full-text availability and bibliographic metadata; often indicates PD status |
| Project Gutenberg | `gutenberg.org` | Texts already reviewed for PD status; inclusion generally indicates PD (verify the edition) |

### Secondary Sources (use to supplement, not replace)

| Source | URL | Notes |
|---|---|---|
| Internet Archive | `archive.org` | Broad but inconsistent on legal status; confirm via primary source |
| Wikipedia — specific article copyright status sections | `wikipedia.org` | Useful for leads and summary context; not sufficient alone |
| LibriVox | `librivox.org` | Audio recordings of PD texts; their review process is reasonably robust |
| WorldCat | `worldcat.org` | Bibliographic records including earliest publication data |

---

## Verification Checklist

### Inputs Required
- Candidate work title, creator, and approximate publication year
- Source where candidate was identified (from [[intake-workflow]])

### Outputs Produced
- Verification status: **Confirmed PD** | **Caution** | **Not PD**
- Documentation of sources consulted and conclusions reached
- Specific notes on any trademark, right-of-publicity, or derivative-layer concerns
- Routing decision: proceed to [[categorization-process]] OR hold for human review OR exclude

---

### Step 1: Establish the Specific Expression Being Evaluated

Copyright attaches to specific expressions, not to abstract works or titles. Before checking anything else, identify exactly what you are evaluating.

1. Identify the **specific edition**: first edition, first US edition, a particular illustrated edition. The earliest US publication date is what controls.
2. Identify the **publication year in the United States** specifically. A work published in France in 1928 and first published in the US in 1932 uses the 1932 US publication date.
3. Identify the **medium**: prose text, illustration, musical composition, sound recording, film, photograph. Each medium can have its own copyright and they do not automatically clear together.
4. If the work is a **translation, edited edition, or annotated version**: the underlying original text may be PD while the specific translation or editorial additions are separately copyrighted. Treat as two distinct works. Only the original-language source text from a PD publication year is automatically clear.
5. Record: title, creator, medium, first US publication year, edition/version being evaluated.

### Step 2: Apply the Basic Cutoff Test

Consult [[../01-Legal-Guidelines/us-public-domain-cutoff]] for the exact rule. For 2026:

- If first US publication year ≤ 1930 → **passes initial cutoff test**, continue to Step 3
- If first US publication year is 1931–1977 → **goes to renewal check** (Step 4)
- If first US publication year is 1978 or later → **Not PD** (life+70 or work-for-hire 95/120 terms; exclude unless specific exception applies)
- If a **sound recording** → **do not use the publication cutoff**; apply MMA schedule separately (Step 5)

### Step 3: Confirm the Publication Year (for pre-1931 works)

Even if a candidate passes the cutoff test on its face, confirm the publication year through at least one primary source.

1. Check **HathiTrust or WorldCat** for bibliographic records confirming the earliest US publication year.
2. Check the **copyright.gov public catalog** or physical records if the publication is close to the cutoff boundary.
3. If the work was published **within 2–3 years of the cutoff**, apply extra scrutiny. A 1930 US publication is PD as of 2026; a 1931 US publication is not yet PD. Confirm the year is not ambiguous.

If the publication year is confirmed as ≤ 1930 and the work is not a sound recording: **mark as Confirmed PD for copyright**. Proceed to Step 6 (trademark and right-of-publicity checks).

### Step 4: Run a Renewal Check (for 1923–1963 works only)

Works published in the US between 1923 and 1963 required **copyright renewal** to maintain protection. Works in this range that were **not renewed** entered the public domain when the initial term expired, even if they were published after the basic cutoff year.

> This step applies to the **1931–1963 zone** — works not yet free under the 95-year rule but potentially free due to non-renewal. This is the most legally complex zone and requires the highest care.

1. Check the **Stanford Copyright Renewal Database** at `collections.stanford.edu/copyrightrenewals`. Search by title and author.
2. Cross-check against the **HathiTrust copyright status field**, which often reflects renewal research.
3. Check the **U.S. Copyright Office renewal records** directly if available for the period in question.
4. If **no renewal record is found**: this is evidence the work may have lapsed into the public domain, but non-renewal records are incomplete and negative results are not conclusive. Flag as **Caution** and note that a lawyer or specialist should confirm before commercial use.
5. If a **renewal record is found**: the work is **still protected**. Mark as Not PD, exclude from catalogue.
6. If records are **ambiguous or unavailable**: mark as Caution; refer for human review.

### Step 5: Sound Recording Check (separate process)

Sound recordings do not follow the 95-year publication rule. They follow the Music Modernization Act timeline.

1. For recordings **fixed before 1923**: entered PD on January 1, 2022.
2. For recordings **fixed 1923–1946**: enters PD 100 years after publication (1923 recording → PD January 1, 2024; 1924 → 2025; 1925 → 2026; etc.).
3. For recordings **fixed 1947–1956**: enters PD 110 years after publication.
4. For recordings **fixed 1957 or later**: enters PD 120 years after publication.
5. Note: the **musical composition** and the **sound recording** are separate copyrights. A 1920 song composition is PD; a 1952 recording of that same song may not be PD until 2062 (110-year term). Both must clear independently.
6. If the recording's PD status under the above schedule is confirmed: mark as Confirmed PD for copyright. If not: mark as Not PD or Caution.

### Step 6: Trademark Check

Copyright expiry does not extinguish trademarks. A work can be copyright-free while the title, character name, or associated imagery remains actively trademarked. This is especially common for:
- Characters with ongoing commercial licensing programs (cartoon characters, literary characters adapted into film franchises)
- Works whose title has become a brand identifier
- Logos and emblems embedded in older works

1. Search the **USPTO Trademark Electronic Search System (TESS)** at `tmsearch.uspto.gov` for the character name, title, and any prominent associated terms.
2. Search relevant **international trademark databases** for the destination markets where products will be sold.
3. Review [[../01-Legal-Guidelines/copyright-vs-trademark-vs-likeness]] for the distinction between copyright and trademark clearance.
4. If an **active trademark** is found covering the relevant class (typically Class 25 for apparel, Class 16 for paper/print, Class 41 for entertainment): mark as **Caution — trademark active**. Do not proceed without human review and a considered use determination.
5. If no active trademark is found: record result; proceed.

### Step 7: Right-of-Publicity Check

If the work involves the likeness, name, or persona of a real person, right-of-publicity laws may restrict use independently of copyright status. Historical figures generally present lower risk, but this should be explicitly checked for any work featuring identifiable real people.

1. Confirm whether the work depicts or names real individuals.
2. If yes, consult [[../01-Legal-Guidelines/copyright-vs-trademark-vs-likeness]] for the right-of-publicity analysis.
3. Right of publicity survives the creator's death in most US states and may persist for decades. Mark as Caution if a living person or recently deceased person with active estate management is involved.

### Step 8: Derivative Layer Check

Confirm that the specific edition, translation, or version being used does not carry its own independent copyright.

1. If the candidate is the **original-language first edition** published in the PD year: no derivative layer concern.
2. If the candidate is a **translation**: check when the translation was published. Only translations published in the PD year or earlier are PD. A 1975 translation of a 1900 novel is itself a 1975 copyright and not PD.
3. If the candidate includes **new illustrations, forewords, editorial notes**: those additions are independently copyrighted to their creators and publication date. Only the underlying original text is PD.
4. See [[../01-Legal-Guidelines/pd-source-vs-modern-adaptation]] for detailed guidance.

### Step 9: Record the Verdict

Document the verification result:

```
Work: [Title, Creator, Year, Medium]
Sources consulted: [list]
Step 2 — Cutoff test: [pass / fail / renewal zone / sound recording]
Step 3 — Year confirmed: [yes / no / ambiguous]
Step 4 — Renewal check (if applicable): [not renewed / renewed / ambiguous]
Step 5 — Sound recording check (if applicable): [PD date / not PD / ambiguous]
Step 6 — Trademark check: [clear / active trademark found: describe / not checked]
Step 7 — Right of publicity: [not applicable / clear / caution: describe]
Step 8 — Derivative layers: [original edition — clear / derivative layers: describe]

VERDICT: Confirmed PD | Caution | Not PD
Routing: proceed to [[categorization-process]] | hold for human review | exclude
Notes: [any open questions or caveats]
```

---

## Interpreting Results

| Verdict | Meaning | Next Action |
|---|---|---|
| **Confirmed PD** | All checks passed; no active trademark or right-of-publicity concerns; original edition confirmed | Route to [[categorization-process]] and applicable extraction processes |
| **Caution** | One or more checks were ambiguous, a trademark was found, or evidence was incomplete | Hold; flag for human legal review; do not catalogue or use commercially until cleared |
| **Not PD** | Still under copyright, or a sound recording not yet expired, or a renewed work | Exclude from catalogue; document reason to avoid re-evaluating in future |

---

## Common Traps and How to Avoid Them

**Trap: Assuming the work title is the same as the character name.** A character name may be trademarked even if the work is PD. "Tarzan" and "Zorro" are classic examples — the stories entered PD while the character marks remained active. Always run the trademark check.

**Trap: Using a modern critical edition.** Academic and popular editions of old works routinely add new introductions, footnotes, and annotations that are independently copyrighted. Use only the original-language source text from a PD-year edition, or a pre-1931 edition confirmed by bibliographic record.

**Trap: Assuming a foreign-language work is PD in the US.** A French novel published in Paris in 1928 may or may not have been published in the US in 1928. Confirm the US publication date, because the US copyright clock runs from US publication for pre-1978 works.

**Trap: Treating PD as permanent.** PD status in one country does not confer PD status in other countries. For international sales, always check destination-market terms. See [[../01-Legal-Guidelines/us-public-domain-cutoff]] on international jurisdiction.

---
*Part of the Polymath Source Material Bible — Section 18 Yearly Public Domain Updates. Not legal advice.*
