---
id: yearly-pd-trend-analysis-process
type: sop
title: Trend Analysis Process — Commercial Prioritization of New PD Entrants
applications: [pod, tshirt, poster, merch, brand, ai-image]
risk_level: safe
tags: [public-domain, trend-analysis, commercial-priority, pod, nostalgia, sop, prioritization]
related: ["[[../14-Trending-Categories/README]]", "[[../19-Trend-Dictionary/README]]", "[[intake-workflow]]", "[[verification-process]]", "[[categorization-process]]", "[[../01-Legal-Guidelines/us-public-domain-cutoff]]", "[[README]]"]
created: 2026-05-31
---

# Trend Analysis Process — Commercial Prioritization of New PD Entrants

## Overview

Not all newly public-domain works are equally valuable for product development. This process provides a repeatable annual procedure for assessing the commercial opportunity represented by each year's new PD entrants, scoring them by priority, and ensuring that the highest-opportunity works receive full cataloguing treatment while lower-priority works receive lighter-touch inclusion.

The goal is to make informed decisions about where to invest development effort — full catalogue entry, design recipes, prompt templates, and active product development — versus where a brief reference entry is sufficient.

This process runs after [[verification-process]] confirms PD status for the candidate batch and typically in parallel with the extraction processes. Its outputs directly feed [[../14-Trending-Categories/README]] and inform depth of treatment across all extraction processes.

---

## Inputs Required

- Confirmed PD work list for the year (from [[intake-workflow]] Step 4 outputs)
- Access to search trend tools (Google Trends, Exploding Topics, or equivalent)
- Current awareness of entertainment and publishing release calendars
- Knowledge of VFXellence's active product categories and platform requirements

## Outputs Produced

- Priority score for each confirmed PD work: **High / Medium / Low**
- Rationale documentation for each score
- Updated intake log in [[intake-workflow]] noting priority assignments
- Entries created or updated in [[../14-Trending-Categories/README]] for High priority works
- Informed depth-of-treatment decisions for all downstream extraction processes

---

## Scoring Framework

Each confirmed PD work is scored on five commercial signals. Each signal scores 0–2 points. Total score out of 10 determines priority tier.

| Signal | 0 points | 1 point | 2 points |
|---|---|---|---|
| **Current search interest** | No detectable search volume | Moderate, steady interest | High or rising search interest |
| **Nostalgia cycle timing** | No evident nostalgia driver | Minor anniversary or passing reference | Major anniversary (50th, 100th, etc.) or prominent cultural moment |
| **Active adaptation pipeline** | No known adaptations in production | Announced but distant production | Film, TV, game, or stage adaptation actively in production or releasing this year |
| **POD product fit** | Poor fit (abstract, text-heavy, no visual hook) | Moderate fit (iconic but complex to render) | Strong fit (clear visual icon, quotable text, immediate design angle) |
| **Platform alignment** | Does not match any active VFXellence category | Matches secondary category | Matches primary active category |

**Priority tiers:**

| Score | Priority | Treatment |
|---|---|---|
| 8–10 | **High** | Full treatment: complete catalogue entry, design recipes, prompt templates, active product development, [[../14-Trending-Categories/README]] entry |
| 5–7 | **Medium** | Standard treatment: complete catalogue entry, extraction processes run, no immediate [[../14-Trending-Categories/README]] entry but flagged for monitoring |
| 3–4 | **Low** | Light treatment: brief catalogue entry, key metadata, no full extraction unless specific commercial trigger emerges |
| 0–2 | **Skip** | Brief note in intake log only; do not catalogue unless specifically requested |

---

## Procedure

### Step 1: Establish the Candidate List

Confirm the candidate list from [[intake-workflow]] Step 4: the set of works that have passed [[verification-process]] as Confirmed PD. This is the set to be scored.

### Step 2: Assess Current Search Interest

For each candidate work, assess current organic search and cultural interest using available tools.

1. **Google Trends** (`trends.google.com`): Search the work title and creator name. Look at:
   - 12-month trend line: stable, rising, or declining interest
   - 5-year trend line: cyclical spikes or sustained steady interest
   - Geographic concentration: is interest US-only or global?
   - Related queries: what adjacent searches are occurring?

2. **Exploding Topics or similar early-trend detection tools**: Check for rising interest not yet fully reflected in mainstream search data.

3. **Social media search** (Pinterest, Instagram, TikTok if accessible): Is the work's imagery or associated aesthetic actively circulating as content?

Score: 0 = negligible signals; 1 = moderate steady interest; 2 = high or clearly rising interest.

### Step 3: Assess Nostalgia Cycle Timing

Nostalgia cycles follow roughly 20–30 year intervals, meaning strong nostalgia tends to activate for cultural material from the period of the target audience's childhood or young adulthood. But for PD works, a more relevant signal is **publication anniversary**.

1. Calculate the work's publication anniversary for the current year (e.g., a work published in 1930 turns 96 in 2026 — not a round anniversary; a 1926 work turns 100 in 2026 — a significant centennial).
2. Check whether the author, creator, or character has a birth or death anniversary in the current year.
3. Note whether the period (1920s, 1930s) is currently in a nostalgia cycle in mainstream culture (fashion, aesthetics, film style, etc.). As of 2026, Art Deco, Jazz Age, and early Hollywood aesthetics have shown consistent commercial relevance.

Score: 0 = no anniversary or nostalgia signal; 1 = minor or indirect signal; 2 = centennial, sesquicentennial, or other major anniversary coinciding with active cultural nostalgia.

### Step 4: Assess Active Adaptation Pipeline

Works with active adaptations in film, television, games, or theater see a surge in commercial interest surrounding release. This is the single most powerful short-term commercial amplifier for PD works.

1. Search entertainment news and production tracking databases (Variety, Hollywood Reporter, IMDb production listings, Deadline) for announced or in-production adaptations of the candidate work or its characters.
2. Note release year if known. Proximity to current year is the key factor — a release this year or next year scores higher than a distant project.
3. Note: the adaptation itself is under copyright; you are only assessing the associated interest in the PD source material. The PD source becomes commercially more valuable when an adaptation is in the public conversation.

Score: 0 = no known adaptations; 1 = announced but not imminent; 2 = currently in production or releasing this year/next.

### Step 5: Assess POD Product Fit

Public domain status is commercially useful only if the work translates into concrete product designs. Assess how directly the work maps to POD products.

Questions to ask:

- Does the work have a visually iconic character, object, or scene that can be rendered as a graphic design? (e.g., a distinctive silhouette, a memorable scene composition, an iconic object)
- Does it have quotable text that works as standalone typography? (feeds section 12 / tee-shirt and poster text)
- Is the visual aesthetic period-specific and currently on-trend? (Art Deco, vintage illustration, Jazz Age, etc.)
- Can the work's imagery be described precisely enough to generate usable AI image outputs?
- Is the subject matter broadly appealing or does it require niche cultural literacy?

Score: 0 = poor translation to product (e.g., an abstract philosophical essay with no visual imagery); 1 = moderate fit requiring significant creative interpretation; 2 = strong fit with clear, direct product angles.

### Step 6: Assess Platform Alignment

Review VFXellence's current active product categories and platform focus. This will change year to year based on business strategy.

1. Does the work fit a category the business is currently actively producing for? (e.g., if literary quote apparel is a primary category and the work is quotable, score 2; if children's illustration is active and the work is a children's story, score 2)
2. Does the work fit a secondary or experimental category the business is exploring?
3. Is the work completely outside current focus?

Score: 0 = outside focus; 1 = secondary or exploratory category; 2 = primary active category.

### Step 7: Calculate Total Score and Assign Priority Tier

Sum the five scores (maximum 10). Assign the priority tier from the scoring framework table above.

Record:

```
Work: [Title, Creator, Year]
Search interest: [score] — [brief rationale]
Nostalgia cycle: [score] — [brief rationale]
Adaptation pipeline: [score] — [brief rationale]
POD product fit: [score] — [brief rationale]
Platform alignment: [score] — [brief rationale]
Total: [X/10]
Priority tier: High / Medium / Low / Skip
Treatment decision: [full / standard / light / intake-note-only]
```

### Step 8: Update Downstream Processes

Based on priority assignment:

**High priority works:**
- Run all extraction processes at full depth
- Create complete primary catalogue entry following [[categorization-process]]
- Create a new entry in [[../14-Trending-Categories/README]] noting the commercial signals
- Flag for active product development consideration
- Revisit mid-year if adaptation releases or other triggers occur

**Medium priority works:**
- Run extraction processes at standard depth
- Create complete primary catalogue entry
- Note in [[../14-Trending-Categories/README]] as a "watchlist" entry rather than featured
- Re-score the following year to assess whether signals have strengthened

**Low priority works:**
- Create brief catalogue entry (title, creator, year, PD basis, primary themes, basic risk notes)
- Skip full extraction processes unless a specific commercial trigger emerges
- Note in intake log as catalogued but not prioritized

**Skip works:**
- Record in intake log with reason for skip
- Do not create catalogue entries

### Step 9: Schedule Mid-Year Review for Tracked Works

Set a mid-year checkpoint (July) to reassess High and Medium priority works for:
- Actual adaptation releases and associated commercial interest spikes
- Trend data that was not yet visible at the January scoring
- Product performance data for any designs already released using this year's new PD material

Adjust priority scores and treatment accordingly.

---

## Commercial Pattern Recognition

Beyond individual work scoring, look for broader commercial patterns across the year's new entrants as a cohort.

### Questions to ask at the cohort level:

1. **Dominant aesthetic period:** What visual style characterizes most of the cohort? (For 1930-published works: late Art Deco, early Depression-era Americana, pre-Code Hollywood). Is that aesthetic currently in market demand?

2. **Genre concentration:** Are multiple works in the cohort from a single genre (crime fiction, science fiction, adventure, literary realism)? Concentration can signal an opportunity to develop a cohesive product line rather than isolated one-off designs.

3. **Geographic origin patterns:** Are significant works from a specific cultural tradition entering PD this year? (e.g., a cluster of important Latin American, European, or Asian works). Does this suggest a specific market opportunity?

4. **Character and IP cluster:** Are multiple works featuring the same character, universe, or creator entering PD simultaneously? (e.g., a second wave of Agatha Christie early works, additional Wodehouse novels). Clusters enable product lines with brand coherence.

Document cohort-level observations in [[../14-Trending-Categories/README]] as a yearly intake summary, separate from individual work entries.

---

## Common Traps

**Trap: Conflating adaptation interest with PD freedom.** A highly anticipated film adaptation signals commercial opportunity but does not affect the PD work's legal status. Assess the two independently: verify the PD status through [[verification-process]] first, then assess commercial opportunity here. Never let commercial excitement shortcut verification.

**Trap: Over-weighting nostalgia for obscure works.** The nostalgia cycle applies to works that were part of mass popular culture when the target audience was young. An obscure 1930 experimental novel may be technically PD but has no nostalgia mass. Score search interest honestly rather than assuming the PD entry implies audience recognition.

**Trap: Assuming medium-priority works are not worth tracking.** Medium priority today can become high priority quickly if an adaptation is announced or a trend shifts. The mid-year review exists specifically to catch these movements. Maintain the watchlist actively.

---
*Part of the Polymath Source Material Bible — Section 18 Yearly Public Domain Updates. Not legal advice.*
