---
id: legal-copyright-trademark-likeness
type: legal-doc
title: Copyright vs Trademark vs Right of Publicity — Three Independent Regimes
creator: VFXellence Ltd / Polymath
year: 2026
country: na
pd_status: na
pd_basis: "guidance document"
verified: true
themes: [legal, rights, copyright, trademark, publicity, content-safety]
symbols: []
archetypes: []
visual_motifs: []
emotional_tags: [clarity, caution]
applications: [pod, tshirt, poster, childrens-book, story, podcast, video, blog, social, merch, character, brand, ai-image, ai-video, ai-writing]
risk_level: safe
risk_notes: "The most common fatal error is assuming 'public domain' means 'free for everything.' It only ever means free for COPYRIGHT. Always check trademark and publicity separately."
remix_hooks: []
source_url: "https://www.copyright.gov/"
tags: [legal-guidelines, copyright, trademark, right-of-publicity, steamboat-willie]
related: ["[[README]]", "[[pd-source-vs-modern-adaptation]]", "[[us-public-domain-cutoff]]", "[[do-not-use]]", "[[use-with-caution]]", "[[decision-tree]]"]
created: 2026-05-31
---

# Copyright vs Trademark vs Right of Publicity

> Three different laws can each lock up the same thing. "Public domain" only ever unlocks **one** of them: copyright. You must clear all three before you publish.

## Summary

When you look at a character, image, name, or person and ask "can I use this?", you are really asking three separate questions, governed by three separate bodies of law. A work can pass one test and fail another. The classic disaster is treating a copyright clearance as if it cleared everything.

| Regime | Protects | Lasts | Expires? | Example of what it locks |
|---|---|---|---|---|
| **Copyright** | The *expression* — the specific text, drawing, photo, recording, film | Life + 70 (modern) or 95 yrs from publication (pre-1978 US) | **Yes** | The exact words of a novel; a specific illustration; a film's footage |
| **Trademark** | A *brand identity used in commerce* — a name, logo, mascot, distinctive look | As long as it is used and defended (renewable forever) | **No (effectively never)** | The name "MICKEY MOUSE"; the Disney logo; the modern Mickey character as a brand |
| **Right of publicity** | A *real, identifiable person's* name, likeness, voice, persona | Lifetime + (in many US states) 20–100 years after death | Sometimes, varies by state/country | A photo of a celebrity; a sound-alike voice; a recognizable likeness |

The three are **independent and cumulative**. To use something safely and commercially you must be clear on **all three at once**. Clearing copyright alone is necessary but not sufficient.

## Regime 1 — Copyright (the expression)

Copyright protects a *fixed creative expression*: the precise words an author wrote, the exact lines an illustrator drew, the specific frames a film captured, the particular performance a recording captured. It does **not** protect ideas, facts, titles, short phrases, character *names*, plots in the abstract, or general styles.

Copyright is the regime that **expires**. Once it expires, the expression enters the public domain and anyone may copy, adapt, sell, and remix it freely. See [[us-public-domain-cutoff]] for exactly when that happens.

Key trap: when a copyright expires, **only that specific expression** is freed. A later, separately-created expression of the same underlying material (a new translation, a new illustration, a film adaptation, a specific costume design) has its **own** copyright. The 1818 text of *Frankenstein* is public domain; Universal Pictures' 1931 flat-headed, neck-bolt monster design is a separate, still-protected work. See [[pd-source-vs-modern-adaptation]].

## Regime 2 — Trademark (the brand identity)

Trademark protects identifiers that tell consumers *who is the commercial source* of a product: brand names, logos, mascots, slogans, and distinctive product looks ("trade dress"). A trademark **does not expire** by the passage of time — it lasts as long as the owner keeps using it in commerce and defending it.

This is why a character can be in the public domain for copyright yet still be a live trademark. If a company continuously uses a character as a brand identifier (on packaging, as a corporate mascot, in marketing), that character functions as a trademark independent of any copyright. Using it in a way that suggests **endorsement, affiliation, or commercial source** is trademark infringement even if the underlying drawing's copyright has lapsed.

The line that matters: trademark stops you from using something **as a brand / source identifier**, or in a way **likely to confuse consumers** about who made or endorsed the product. It generally does **not** stop you from using a public-domain expression *as expressive content* in a way that doesn't create source confusion. That distinction is subtle and fact-specific — when commerce and brand-association are involved, default to caution.

## Regime 3 — Right of publicity (the real person)

Right of publicity protects a real, identifiable individual's commercial interest in their own **name, likeness, voice, signature, and persona**. It is a *person* right, not a *work* right, so copyright public-domain status is irrelevant to it. A 1925 photograph might be public domain as a photo (copyright expired) while the depicted living person's likeness is still protected by their right of publicity.

It applies hardest to **commercial use** (selling merch, using a face in advertising, implying endorsement). It is weaker for genuinely newsworthy, biographical, or transformative artistic use — but those exceptions are narrow and vary wildly by state and country. For commercial products: **assume any recognizable real person is off-limits without a license or release.** See [[do-not-use]] (celebrity likenesses) and [[use-with-caution]] (right of publicity).

## The canonical example: Steamboat Willie Mickey

This single example shows all three regimes acting on one character at once.

- **Steamboat Willie (1928 short film):** Its US copyright expired and the film entered the public domain on **January 1, 2024** (95 years after its 1928 publication). The specific Mickey Mouse *as he appears in that 1928 cartoon* — the rubber-hose, black-and-white, pie-eyed early design — is therefore free of **copyright**. You may copy, screen, and adapt the 1928 film and that specific early depiction.
- **Modern Mickey Mouse:** The full-color, white-gloved, modern Mickey is a **later, separately copyrighted** design. It is still protected. Using modern Mickey is copyright infringement. See [[pd-source-vs-modern-adaptation]].
- **Trademark:** "MICKEY MOUSE" and the Mickey character are **live Disney trademarks**, used continuously as brand identifiers. Even with the 1928 design, using Mickey in a way that implies Disney endorsement, or as a brand/source identifier on merchandise, is **trademark infringement** regardless of copyright. Disney has stated it will enforce its trademarks against uses that confuse consumers about source.

So: the 1928 Mickey is copyright-free **but trademark-restricted**. You can use the 1928 footage and early design as expressive content, but you cannot use Mickey to brand your product, imply Disney is behind it, or use the modern design at all. This is exactly why "public domain" is not a green light. **For Polymath, modern-brand characters like Mickey stay in the `avoid` bucket** because the trademark exposure outweighs the narrow copyright opening.

## How an AI should apply this

Given any candidate source, run **three checks**, not one:

1. **Copyright check** — Is the specific expression you want to use out of copyright? (Old enough, or openly licensed?) If no → `avoid` unless licensed.
2. **Trademark check** — Is the name/character/logo a live commercial brand identifier? Will your use imply source, endorsement, or affiliation? If yes → `caution` or `avoid`.
3. **Publicity check** — Does it depict a real, identifiable person? If yes and the use is commercial → `caution` or `avoid` without a release.

A candidate is **`safe`** only when it passes all three. If it fails *any* one, the verdict is at best `caution`, and `avoid` whenever a live brand or a real person is involved in a commercial context. See [[decision-tree]].

## Examples

- **SAFE:** Grimm's fairy tale text (1812, copyright expired; no trademark; no real person) → `safe` for retelling, illustrating, merch.
- **CAUTION:** The name "James Bond" (character originated in 1953 novels — still in copyright; also a live film-franchise trademark) → `avoid`.
- **CAUTION→AVOID:** 1928 Steamboat Willie Mickey (copyright expired, trademark live) → `avoid` for commercial merch because of trademark/source-confusion exposure.
- **AVOID:** A photorealistic portrait of a living celebrity on a t-shirt (right of publicity, regardless of who took the photo) → `avoid`.

## Related

- [[us-public-domain-cutoff]] — when copyright actually expires
- [[pd-source-vs-modern-adaptation]] — why PD text ≠ PD design
- [[safe-to-use]] / [[use-with-caution]] / [[do-not-use]] — the three buckets
- [[decision-tree]] — the executable flow

---
*Part of the Polymath Source Material Bible — Section 01 Legal Guidelines. Not legal advice.*
