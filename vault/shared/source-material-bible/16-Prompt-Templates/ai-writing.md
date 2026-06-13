---
id: prompt-ai-writing
type: prompt-template
title: AI Writing — Copy, Descriptions, Listings, and Blog Intros
applications: [ai-writing, story, podcast, brand]
model_targets: [gpt, claude]
tags: [prompt-template, ai-writing, copywriting, product-description, listing, blog, social, gpt, claude]
related: ["[[shared/slot-resolution-protocol]]", "[[01-Legal-Guidelines/README]]", "[[05-Literature/README]]", "[[10-Archetypes/README]]", "[[12-Quotes/README]]", "[[14-Trending-Categories/README]]", "[[15-Remix-Frameworks/README]]"]
created: 2026-05-31
---

# AI Writing — Copy, Descriptions, Listings, and Blog Intros

## Purpose

Generates short written copy for four distinct product-line use cases: (1) social captions, (2) marketplace product descriptions, (3) listing titles and tag strings, and (4) SEO blog introductions. Every template draws its thematic and tonal vocabulary from Bible entries — archetypes from [[10-Archetypes]], verified quotes from [[12-Quotes]], and category framing from [[14-Trending-Categories]] — so every output is grounded in cleared source material and a consistent creative voice. Resolve all slots per [[shared/slot-resolution-protocol]] before use.

## Slot Table (shared across all four sub-templates)

| Slot | Source section | Required? | What to put | Example fill (real entry) |
|---|---|---|---|---|
| `[THEME]` | [[14-Trending-Categories]] or [[03-Mythology]] or [[05-Literature]] | yes | The subject/topic the copy is about | `myth-greek-athena` → "wisdom, strategy, the scholar-warrior, the patron of civilization" |
| `[ARCHETYPE]` | [[10-Archetypes]] | yes | Voice and character filter for the copy | `archetype-sage` → "authoritative, contemplative, clarity-seeking; promises insight" |
| `[QUOTE]` | [[12-Quotes]] (one verified PD quote) | optional | Anchor line or opening hook | `quote-wisdom-collection Q01` → *"The unexamined life is not worth living."* — Socrates (PD, verified) |
| `[PRODUCT]` | inline | yes | The specific item being described or promoted | "art-print poster / enamel pin / hoodie / sticker pack" |
| `[TONE]` | inline | yes | Register and voice direction | "confident and minimalist / warm and storytelling / witty and punchy" |
| `[CTA]` | inline | optional | Call-to-action type | "shop now / pin it / read more / explore the collection" |
| `[KEYWORDS]` | inline | SEO contexts only | Keyword targets for search optimization | "stoic wisdom poster, philosophy wall art, greek mythology print" |
| `[TAGS]` | inline | listing contexts only | Comma-separated Etsy/Redbubble tags (max 13 for Etsy) | up to 13 tags, each under 20 chars |

## Sub-Template A: Social Caption

### Base Prompt

```
Write a social media caption for [PRODUCT].
Theme: [THEME].
Voice: [ARCHETYPE] — [TONE].
Open with [QUOTE] if applicable, or a short original hook in that register.
Length: under 150 characters for a punchy version; under 280 characters for an expanded version.
End with [CTA].
Avoid: brand names, copyright characters, claims of endorsement.
Platform variants: provide one for Instagram (emoji OK), one for X (no emoji, terse), one for Pinterest (descriptive, search-friendly).
```

## Sub-Template B: Product Description

### Base Prompt

```
Write a marketplace product description for [PRODUCT].
Theme and imagery: [THEME].
Archetype voice: [ARCHETYPE] — [TONE].
Structure: one-sentence hook, two to three sentences about the design/feel, one sentence on physical specs/materials (leave [SPECS] as a placeholder for the seller to fill), one sentence on why it makes a good gift or conversation piece.
Include [QUOTE] as a pull quote if the product displays it; if so, render the attribution exactly.
Word count: 60–90 words.
Do not: use celebrity names, protected franchise references, claims of authenticity, empty superlatives.
```

## Sub-Template C: Listing Title + Tags

### Base Prompt

```
Generate a marketplace listing title and tag set for [PRODUCT].
Theme: [THEME].
Target buyer: [ARCHETYPE voice persona — who buys this?].
Title format: lead with the most searchable noun phrase, then style descriptor, then occasion (if applicable). Under 140 characters total.
Tags: generate 13 Etsy-style tags. Prioritize: [KEYWORDS]. Include at least two long-tail phrases (3+ words). Each tag under 20 characters. Separate by commas.
Avoid: trademark terms, celebrity names, copyrighted property titles.
```

## Sub-Template D: Blog Introduction

### Base Prompt

```
Write a 100–120 word SEO blog introduction for an article titled [ARTICLE TITLE].
Topic: [THEME].
Hook: open with [QUOTE] (if supplied) as a block quote, or a surprising factual statement drawn from [THEME].
Paragraph two: establish what the reader will learn and why it matters to them, filtered through [ARCHETYPE] voice.
End with an implicit or explicit bridge sentence into the article body.
Target keywords to work in naturally: [KEYWORDS].
Tone: [TONE].
Do not: pad with vague generalities, use "In today's world," or cite Wikipedia.
```

## Worked Examples

### Example 1 — Athena Wisdom Poster: Social Caption Pack

**Slots:**
- `[PRODUCT]` = "Art-print poster featuring Athena, an owl, and a Socrates quote"
- `[THEME]` = `myth-greek-athena` → wisdom, strategy, the scholar-warrior
- `[ARCHETYPE]` = `archetype-sage` → authoritative, clarity-seeking
- `[QUOTE]` = `quote-wisdom-collection Q01` → *"The unexamined life is not worth living."* — Socrates
- `[TONE]` = "confident and minimalist"
- `[CTA]` = "Shop the collection"

**Output — Instagram:**
```
"The unexamined life is not worth living." — Socrates

Some walls deserve better than decoration. 🦉
Shop the collection → link in bio
```

**Output — X:**
```
Athena didn't carry the owl for aesthetics.
"The unexamined life is not worth living." — Socrates
New print. Link in bio.
```

**Output — Pinterest:**
```
Athena wisdom poster — Greek mythology art print featuring Socrates quote. 
Minimalist philosophy wall art for home office, study, or gift. Shop the collection.
```

**Legal note:** Quote `Q01` is `pd_verified: true`; attribution rendered exactly per [[12-Quotes/wisdom]] instructions. Athena is ancient myth, `risk_level: safe`. Do not invoke God of War or Percy Jackson branding.

---

### Example 2 — Victorian Detective Tee: Product Description + Listing Title

**Slots:**
- `[PRODUCT]` = "Unisex graphic tee, detective iconography (deerstalker, pipe, magnifying glass)"
- `[THEME]` = Victorian detective aesthetic, cerebral mystery; uses design from [[17-Design-Recipes/victorian-detective-tee]] (`recipe-victorian-detective-tee`)
- `[ARCHETYPE]` = `archetype-sage` + detective variant → cerebral, authoritative, cool
- `[TONE]` = "witty and punchy"
- `[KEYWORDS]` = "detective shirt, mystery lover gift, victorian style tee, cerebral fashion"

**Product description:**
```
The game is afoot — and now your wardrobe knows it.

This unisex tee puts the classic consulting-detective toolkit front and center: deerstalker, calabash pipe, magnifying glass, all rendered in crisp Victorian engraving line art on a deep charcoal ground. It's the shirt for the person in the room who already worked out the ending.

Premium cotton blend, [SPECS]. Ships in 3–5 business days.
The perfect gift for the mystery reader, the podcast obsessive, or anyone who trusts deduction over luck.
```

**Listing title:**
```
Victorian Detective Graphic Tee | Mystery Lover Shirt | Deerstalker Pipe Magnifying Glass | Unisex
```

**Tags:**
```
detective shirt, mystery lover gift, victorian tee, cerebral fashion, gothic style tee, book lover shirt, noir aesthetic, magnifying glass art, unisex graphic tee, philosophy shirt, deduction print, literary gift, dark academia
```

**Legal note:** [[17-Design-Recipes/victorian-detective-tee]] (`recipe-victorian-detective-tee`) is `risk_level: caution`. Do NOT use "Sherlock Holmes" in the listing title or tags — trademark risk. Use detective iconography and Z-named character only. See [[11-characters/sherlock-holmes]] `risk_notes`.

---

### Example 3 — Wisdom Quote Poster: Blog Introduction

**Slots:**
- `[ARTICLE TITLE]` = "Why Stoic Wisdom Still Sells: The Enduring Appeal of Philosophy Wall Art"
- `[THEME]` = Stoic wisdom, the examined life, quote-poster category
- `[ARCHETYPE]` = `archetype-sage`
- `[QUOTE]` = `quote-wisdom-collection Q01` → *"The unexamined life is not worth living."*
- `[TONE]` = "confident, authoritative, accessible"
- `[KEYWORDS]` = "stoic wisdom poster, philosophy wall art, greek philosophy print"

**Output:**
```
> "The unexamined life is not worth living." — Socrates, *Apology* (c. 399 BCE)

Some words refuse to age. This one has been on walls — carved in stone, inked on scrolls, printed on posters — for two and a half thousand years. In 2026 it is also one of the top-performing phrases in the philosophy wall-art category on every major print-on-demand marketplace.

In this article you will learn why stoic wisdom posters continue to outsell trend-driven designs, how to source quotes that are genuinely in the public domain (and avoid the misattribution landmines that torpedo listings), and which Greek philosophy prints are resonating most with buyers right now.
```

**Legal note:** Quote verified PD per [[12-Quotes/wisdom]]. `archetype-sage` is `risk_level: safe`. No trademarked terms in the copy.

## Legal Pre-Flight

Sections this template touches: 05-Literature, 10-Archetypes, 12-Quotes, 14-Trending-Categories. Before publishing, run [[shared/legal-preflight]] and confirm: all quotes used are tagged `pd_verified: true` in [[12-Quotes]]; attribution lines rendered exactly; no trademarked brand or character name used in listing title or tags; no celebrity name or real likeness referenced. For any `caution` slot, acknowledge the specific `risk_notes` from that entry in the production log.

---
*Part of [[16-Prompt-Templates/README]]. Resolve slots per [[shared/slot-resolution-protocol]]. Defers to [[01-Legal-Guidelines/README]].*
