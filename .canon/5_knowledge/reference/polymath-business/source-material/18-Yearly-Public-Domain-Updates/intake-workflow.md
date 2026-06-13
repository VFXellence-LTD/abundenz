---
id: yearly-pd-intake-workflow
type: sop
title: Annual Public Domain Intake Workflow
applications: [pod, story, tshirt, poster, childrens-book, merch, character, brand, ai-image, ai-writing]
risk_level: caution
tags: [public-domain, annual-update, intake, workflow, january, sop]
related: ["[[../01-Legal-Guidelines/us-public-domain-cutoff]]", "[[verification-process]]", "[[categorization-process]]", "[[trend-analysis-process]]", "[[README]]"]
created: 2026-05-31
---

# Annual Public Domain Intake Workflow

## Overview

This document is the master January operating procedure for identifying and beginning to process works that newly enter the US public domain each year. It is designed to be executed by an AI agent under human review. All outputs feed downstream processes documented elsewhere in this section.

The foundational legal rule is in [[../01-Legal-Guidelines/us-public-domain-cutoff]]: US works published in a given year enter the public domain 95 years later, on January 1. As of 2026, the current PD threshold is **works published in 1930 or earlier**.

> **Important:** Do not rely on memory or prior-year notes for specific title verification. Always consult authoritative sources each year. The processes in [[verification-process]] govern how to confirm individual works.

---

## Upcoming Public Domain Classes

The following table projects the next several years of US public domain expansions. Use this for forward planning, partnership targeting, and trend-analysis scheduling.

| Effective Date | Works Entering PD | Target Publication Year |
|---|---|---|
| **January 1, 2026** (current) | US works published in 1930 | **1930** |
| January 1, 2027 | US works published in 1931 | **1931** |
| January 1, 2028 | US works published in 1932 | **1932** |
| January 1, 2029 | US works published in 1933 | **1933** |
| January 1, 2030 | US works published in 1934 | **1934** |
| January 1, 2031 | US works published in 1935 | **1935** |

For any given year, the formula is: **`target_publication_year = current_year − 95`**.

---

## Recent Notable Entrants for Context

The following are illustrative examples of notable works or characters that have recently entered or are known to be approaching the public domain. They are included to orient the workflow in concrete terms. **They are not guaranteed to be fully clear for all uses — always run the full [[verification-process]] before cataloguing any specific work.**

- **January 1, 2024:** "Steamboat Willie" (1928 Mickey Mouse short) entered the US public domain, freeing the *specific visual design* of Mickey Mouse as depicted in that film. Note: later Mickey designs remain copyrighted, and the character name is trademarked. This was widely covered and demonstrates how a single film's PD status does not free a character broadly.
- **January 1, 2025:** Works published in 1929, including Popeye the Sailor's earliest 1929 newspaper strip appearance (Thimble Theatre, E.C. Segar, January 1929). Again, the *character name and brand* remain trademarked. The specific 1929 visual expression cleared.
- **January 1, 2026:** Works published in 1930. This includes a wide range of literature, illustration, and music from a commercially fertile decade. Specific titles should be identified and verified via the process below.

These examples illustrate two key points: (1) character names and brand identities very frequently survive copyright expiry as trademarks, and (2) significant media attention accompanies major PD expansions — tracking that attention is part of the [[trend-analysis-process]].

---

## Intake Procedure

### Inputs Required
- Current calendar year (determines target publication year)
- Access to authoritative PD source lists (see [[verification-process]])
- Access to [[trend-analysis-process]] outputs for priority scoring
- Write access to sections 02–13 of this Bible

### Outputs Produced
- A shortlist of candidate works to verify, with priority scores
- Individual entries routed to downstream processes: [[verification-process]], [[categorization-process]], [[quote-extraction-process]], [[archetype-extraction-process]], [[symbol-extraction-process]]
- A summary intake log appended to this document's `## Intake Log` section below (or linked file)

---

### Step 1: Compute the Target Year

1. Confirm the current calendar year.
2. Compute: `target_year = current_year − 95`.
3. Record the target year. All works identified in this intake must have been **first published in the United States in `target_year`**.
4. Note: if a work was published in a foreign country first but published in the US in `target_year`, it qualifies. If published first in the US but only distributed internationally in `target_year`, confirm US publication date specifically.

### Step 2: Gather Candidate Works

Consult the following sources to build an initial candidate list. Do not rely on a single source — cross-reference at least two.

1. **Duke Law Center for the Study of the Public Domain — Public Domain Day post**: Published annually in early January at `law.duke.edu/cspd/publicdomainday`. This is the most curated, legally-reviewed annual summary and should be the first stop.
2. **Wikipedia "Public Domain Day" article for the current year**: A crowd-sourced list of notable entrants, useful for breadth. Not sufficient alone — verify each title through [[verification-process]].
3. **HathiTrust Digital Library search**: Filter by publication year. A good source for locating actual full texts.
4. **Project Gutenberg new additions**: PG adds newly-PD texts each January. Their list reflects works they have added, which implies PD status has been reviewed.
5. **Internet Archive "Public Domain" collections**: Useful for breadth, especially for film and audio.
6. **Library of Congress and copyright.gov**: For formal registration records.

For each candidate identified, record:
- Title
- Creator(s)
- Year and country of first publication
- Medium (novel, film, illustration, song composition, recording, etc.)
- Source where found
- Initial notes on trademark or right-of-publicity concerns

Aim to produce a list of 20–50 candidates before filtering. Breadth at this stage is more valuable than precision — verification comes next.

### Step 3: Apply a Commercial Relevance Filter

Before investing in full verification, apply a quick commercial filter to prioritize the candidate list. This is a rough pass — use [[trend-analysis-process]] for rigorous scoring.

Ask of each candidate:
- Does the work have recognizable characters, imagery, or quotes that translate to POD products?
- Is there evidence of current cultural interest (search trends, anniversaries, adaptations in production)?
- Does the subject matter align with any of VFXellence's active product categories?

Score each candidate: **High / Medium / Low / Skip**. Set aside Skip candidates. Proceed with High and Medium; hold Low for a secondary pass if capacity allows.

### Step 4: Route to Verification

For each High and Medium candidate, initiate [[verification-process]]. Do not proceed to cataloguing or extraction until verification is complete. Verification may result in one of three outcomes:

- **Confirmed PD:** proceed to [[categorization-process]]
- **Caution — requires further research:** hold, flag for human review, do not catalogue
- **Not PD / restricted:** remove from candidate list, note reason

### Step 5: Route Verified Works to Extraction Processes

Once a work is confirmed as public domain, route it to the applicable extraction processes in parallel:

| If the work contains… | Route to… |
|---|---|
| Quotable text | [[quote-extraction-process]] |
| Distinct character archetypes | [[archetype-extraction-process]] |
| Recurring symbols or visual motifs | [[symbol-extraction-process]] |
| (All works) | [[categorization-process]] — determines primary Bible section |

### Step 6: Run Trend Analysis

After the initial batch of verified works is assembled, run [[trend-analysis-process]] to determine commercial priority ordering. This informs which entries get full treatment (complete 02-Library entry, design recipes, prompt templates) versus brief catalogue inclusion.

### Step 7: Record the Intake Log

Append a summary entry to the intake log below:

```
## YYYY Intake Log

- **Date completed:** YYYY-MM-DD
- **Target publication year:** YYYY−95
- **Candidates identified:** N
- **Verified PD:** N
- **Caution (pending review):** N
- **Excluded (not PD / restricted):** N
- **Notable entries:** [list 3–5 highest priority confirmed works]
- **Flagged for human review:** [list works marked caution]
- **Downstream actions initiated:** categorization / quote extraction / archetype / symbol / trend
```

---

## Intake Log

*(Append annual entries here as the workflow is executed each year.)*

### 2026 Intake Log

- **Date completed:** Pending — workflow to be executed January 2026
- **Target publication year:** 1930
- **Status:** Process established; first execution pending

---

## Traps to Avoid

The following mistakes are common and must be explicitly guarded against during intake:

1. **Assuming broad character freedom from a single PD work.** A character's earliest appearance clearing copyright does not free the character globally — trademark survives, and later visual designs remain protected. Flag every character with a live commercial brand for trademark review.
2. **Confusing "old" with "published in the US."** A foreign work published abroad first may have different US status. Confirm US publication year specifically.
3. **Trusting Wikipedia alone.** Wikipedia's PD Day lists are useful for leads, not for legal conclusions. Every specific title requires the [[verification-process]].
4. **Treating a PD composition as clearing the recording.** Sound recordings follow the Music Modernization Act schedule, not the 95-year publication rule. A 1930 song composition may be PD; the specific recording of it may not be. Keep these separate.
5. **Using a modern edition or translation.** The original 1930 text is PD; a 1985 translation of that text is not. Always identify the specific edition and its publication year.

---
*Part of the Polymath Source Material Bible — Section 18 Yearly Public Domain Updates. Not legal advice.*
