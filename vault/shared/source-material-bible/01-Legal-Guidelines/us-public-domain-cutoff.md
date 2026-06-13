---
id: legal-us-public-domain-cutoff
type: legal-doc
title: US Public Domain Cutoff — Exact Mechanics (2026)
creator: VFXellence Ltd / Polymath
year: 2026
country: US
pd_status: na
pd_basis: "guidance document"
verified: true
themes: [legal, copyright, public-domain, term-expiry]
symbols: []
archetypes: []
visual_motifs: []
emotional_tags: [clarity, precision]
applications: [pod, tshirt, poster, childrens-book, story, podcast, video, blog, social, merch, character, brand, ai-image, ai-video, ai-writing]
risk_level: safe
risk_notes: "The cutoff MOVES every January 1. A correct answer in 2026 (1930-and-earlier is PD) becomes wrong in 2027 (1931-and-earlier). Always recompute against the current year. Non-US markets have DIFFERENT terms — clear to US AND the destination market."
remix_hooks: []
source_url: "https://www.copyright.gov/help/faq/faq-duration.html"
tags: [legal-guidelines, public-domain, copyright-term, cutoff, 95-years, life-plus-70]
related: ["[[README]]", "[[copyright-vs-trademark-vs-likeness]]", "[[safe-to-use]]", "[[pd-source-vs-modern-adaptation]]", "[[decision-tree]]"]
created: 2026-05-31
---

# US Public Domain Cutoff — Exact Mechanics

> As of 2026: a work **published in the US in 1930 or earlier** is in the public domain. This line advances **one calendar year every January 1.**

## Summary

For our day-to-day work the rule that matters most is the **pre-1978 publication rule**: works published in the United States get a copyright term of **95 years from the year of publication**, after which they enter the public domain on the **next January 1**.

- 1929 works → entered PD on **January 1, 2025**
- 1930 works → entered PD on **January 1, 2026**
- 1931 works → will enter PD on **January 1, 2027**
- …and so on, one year forward every New Year's Day.

So **in 2026, the safe public-domain line is "published 1930 or earlier."** Always recompute: the current-year cutoff is `current_year − 95`.

## The full rules by category

Copyright duration depends on **when** and **how** a work was created/published. The practical buckets:

### 1. Published in the US, 1929 and earlier — Public Domain (always, now)
The 95-year term has fully run. These are in the public domain. (1929 entered Jan 1 2025; everything before it earlier still.)

### 2. Published in the US, 1930 — Public Domain as of January 1, 2026
1930 + 95 = 2025; the term expired end of 2025, so PD from **January 1, 2026**. This is the **newest** year currently free.

### 3. Published in the US, 1931–1977 — Still protected (term running)
These get 95 years from publication and have **not** yet expired. Example: a 1940 work is protected until **January 1, 2036**. (This bucket once had renewal complications — works published 1923–1963 needed renewal to keep copyright, and many lapsed — but determining lapse requires checking renewal records and is fact-specific. Treat anything 1931–1977 as **protected / caution** unless a specific renewal lapse is verified.)

### 4. Created/published 1978 or later — Life of the author + 70 years
The modern term. For a single known author, copyright lasts the **author's life plus 70 years**. For works of corporate authorship, anonymous, or pseudonymous works ("works made for hire"), the term is **95 years from publication or 120 years from creation, whichever is shorter.** Almost nothing in this bucket is public domain yet.

### 5. Unpublished works
Unpublished works also generally run **life + 70** (or 120 years from creation for anonymous/corporate). An old *manuscript* that was never published can still be under copyright even if written long ago. Do not assume "old = free" for unpublished material.

### 6. Sound recordings (special, harsher rules)
Sound recordings have their **own** copyright separate from the musical composition, and historically followed different rules. Under the Music Modernization Act, **pre-1923 recordings entered the public domain on January 1, 2022**, and recordings from 1923 onward enter the PD on a staggered schedule (older recordings get roughly a 100-year term). The recorded *performance* and the underlying *composition* are two separate copyrights — both must be clear. **Treat any recorded audio as caution** unless the specific recording's PD status is verified; the composition being old does **not** free the recording.

## The moving line — recompute every year

Because the term is "95 years from publication," the PD frontier moves forward one year every January 1. **Do not hard-code "1930."** The correct general rule is:

> A US work is (term-)public-domain if **`year_published ≤ current_year − 95`** (and it is not in the still-protected 1931–1977 renewal-dependent zone, and copyright in fact expired rather than was renewed).

| If today is in… | Newest PD publication year |
|---|---|
| 2025 | 1929 |
| **2026** | **1930** |
| 2027 | 1931 |
| 2028 | 1932 |

## International — operate to US AND destination market

Public-domain status is **territorial**. Other countries use different terms, most commonly **life of the author + 70 years** (EU, UK), but some use **life + 50**, **life + 60**, **life + 80**, or **life + 100** (Mexico). A work can be PD in the US but still protected in Europe, or vice versa.

For Polymath, which sells into multiple markets:

> Clear a work for the **US** *and* for **each destination market** you sell into. If you cannot clear all relevant markets, geo-restrict the product or treat it as `caution`/`avoid`.

A common gap: a US work by an author who died recently might be PD in the US (published pre-1931) but still protected in life+70 countries if the author died after 1955. And a foreign work PD abroad might still be protected in the US. **Two separate clocks.**

## What this does NOT clear

Copyright expiry is **only** the copyright regime. It says nothing about trademark or right of publicity. A PD-by-copyright work can still be trademark- or likeness-restricted. See [[copyright-vs-trademark-vs-likeness]]. And expiry frees only the **specific old expression**, not later adaptations of the same material — see [[pd-source-vs-modern-adaptation]].

## How an AI should apply this

1. Find the **publication year** and **country** of the *specific expression* (edition, illustration, recording — not the abstract work).
2. If US and `year ≤ current_year − 95` and not in the 1931–1977 renewal-dependent zone → copyright-clear → continue to trademark/publicity checks.
3. If US and `1931 ≤ year ≤ 1977` → `caution` (renewal-dependent; verify).
4. If `year ≥ 1978` → almost always `avoid` (life+70 or 95/120; rarely expired).
5. If a **sound recording** → `caution` unless the specific recording's PD date is verified.
6. If selling internationally → repeat the check for each destination market's term.
7. Pass the result to [[copyright-vs-trademark-vs-likeness]] checks before declaring `safe`.

## Examples

- **SAFE:** A novel published in New York in **1900** — copyright term long expired → copyright-clear (still check trademark/publicity).
- **SAFE (new for 2026):** A book first published in the US in **1930** — entered PD Jan 1 2026.
- **CAUTION:** A book published in the US in **1955** — protected until 2051 → `avoid`/`caution`.
- **CAUTION:** A **1921 jazz recording** — the *composition* may be PD but verify the *recording*'s status (pre-1923 recordings became PD in 2022, so this is likely clear, but confirm the year and that it is the original recording, not a remaster).
- **AVOID:** Any work first published **1978 or later** by a living or recently-deceased author.

## Related

- [[copyright-vs-trademark-vs-likeness]] — the other two regimes copyright expiry does not touch
- [[pd-source-vs-modern-adaptation]] — expiry frees only the old expression
- [[safe-to-use]] — what becomes usable once a work is PD
- [[decision-tree]] — the executable flow

---
*Part of the Polymath Source Material Bible — Section 01 Legal Guidelines. Not legal advice.*
