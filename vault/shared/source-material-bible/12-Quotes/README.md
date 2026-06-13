# 12 — Quotes: Verified Public-Domain Quote Repository

This is the quote repository of the Polymath **Source Material Bible**. It holds a curated, legally-vetted, correctly-attributed collection of quotations that VFXellence Ltd can safely overlay on products, drop into stories and scripts, read aloud in podcasts, and feed to AI generation pipelines — without copyright risk and without the reputational damage of repeating a fake quote.

Every quote in this section is traceable to a **specific public-domain work and year**, or to a **public-domain author** (one who died more than 70 years ago, i.e. on or before 1955 for the life+70 rule, with the work itself also pre-1930 where US publication date governs). Proverbs and traditional sayings are included only when they are genuinely old, anonymous, and folk in origin.

This section **defers to [[01-Legal-Guidelines/README]]** for all rights questions. If anything here conflicts with the legal section, the legal section wins.

## What this section is for

A quote is one of the cheapest, highest-leverage pieces of content a media business can make. A single line of public-domain text can become a poster, a t-shirt, a mug, the opening of a children's book, the cold open of a podcast, an Instagram carousel, a blog pull-quote, or the seed of an AI-generated illustration. Because the text is short and the source is old, the production cost is near zero and the legal exposure — *if the quote is genuinely public domain and correctly attributed* — is near zero too.

The two ways this goes wrong, both of which this section is designed to prevent:

1. **Using a copyrighted quote.** Modern, living, or recently-deceased authors hold copyright in their words. A motivational line from a 1990s self-help book or a still-living author is **copyrighted text**, even if it is one sentence, even if it is "everywhere on the internet." Putting it on merch is infringement.
2. **Misattributing a quote.** A vast number of quotes circulating online are **fabricated or wrongly attributed** — the fake Einstein, fake Twain, fake Gandhi, fake Buddha, fake Marilyn Monroe lines. Selling a product with a famous name under words that person never wrote is both an accuracy failure and, where the named person's persona is involved, a potential right-of-publicity / false-endorsement problem. It also destroys brand trust the moment a customer fact-checks it.

This repository solves both: it contains **only verified-PD, correctly-attributed quotes**, and it carries an explicit **commonly-misattributed AVOID list** so the pipeline can actively reject the famous fakes.

## How it is used

### By other sections of the Bible
- [[05-Literature/README]] and [[03-Mythology/README]] supply many of the source works these quotes are drawn from; quote entries cross-link back to the relevant source-work entry where one exists.
- [[10-Archetypes/README]] and [[13-Visual-Motifs/README]] borrow `theme_tags` and `emotional_tags` from quotes to pair text with imagery (e.g. a `courage` quote over a `lion` motif).
- [[16-Prompt-Templates/README]] and [[17-Design-Recipes/README]] consume quotes as drop-in text layers, reading the `applications` field to know which channels a quote suits.

### By AI generation systems
The pipeline treats this repository as a **safe text source of truth**. Given a brief ("make a stoic-themed poster set", "write a courage-themed children's-book opening", "find a love quote for a Valentine's social post"), the generator:
1. Filters quote entries by `theme_tags` / `emotional_tags`.
2. Filters by `applications` to match the target channel.
3. Uses **only** entries with `pd_verified: true` and `risk_level: safe`.
4. Renders the quote with its attribution exactly as stored in `attribution` (author + work + year).
5. **Never** pulls a quote from outside this repository for a commercial product, and **never** uses anything on the [[misattributed-avoid-list]].

## Section-specific conventions

- **Frontmatter uses the canonical Bible schema** (see [[../01-Legal-Guidelines/_template]]) **plus quote-specific fields** carried in the body and in these extra keys, kept exact for DB ingestion:
  - `quote_text` — the exact wording.
  - `attribution` — display-ready attribution string: `Author, *Work* (Year)`.
  - `source` — the specific work the quote comes from.
  - `author` — the author (also the canonical `creator` field).
  - `year` — date of the source work.
  - `pd_verified` — boolean; mirrors `verified`. A quote ships only when this is `true`.
  - `theme_tags` — topical tags (wisdom, courage, love, etc.).
  - `emotional_tags` — the feeling the quote evokes.
  - `applications` — subset of `design`, `story`, `podcast`, `social` (and the broader Bible application tags where relevant).
- **One file per collection, multiple quotes per file.** Unlike sections where each entry is its own file, quotes are short, so each **themed collection** is a single file holding many quote entries under headings. Each quote inside a collection still carries its own attribution and verification note. The collection file's frontmatter describes the collection as a whole (`type: quote`).
- **Attribution is mandatory and exact.** No quote is stored without author + work + year. If a quote cannot be tied to a specific work, it does not go in a themed collection — at most it is recorded on the AVOID list as a known fake.
- **Conservative bias.** Where a quote's PD status or attribution is even slightly uncertain, it is excluded, or marked `pd_verified: false` and `risk_level: caution` with the reason in `risk_notes`. Twain is included only for works published in 1930 or earlier (Twain died 1910, so all his works are PD, but we still cite by work and year). Living or recently-deceased authors are excluded entirely.
- **Translations matter.** Stoic authors (Marcus Aurelius, Seneca, Epictetus) wrote in Greek/Latin; the *original text* is PD, but a *specific modern English translation* can be independently copyrighted. We therefore quote from **public-domain translations** (e.g. George Long's Marcus Aurelius, 1862; the Loeb/old public-domain Seneca and Epictetus translations) and note the translator and translation year. See `risk_notes` on the stoicism collection.

## File index

| File | What it holds |
|---|---|
| [[_template]] | Copy-paste template for a quote collection file and for an individual quote block. |
| [[wisdom]] | Wisdom, insight, knowledge, the examined life. |
| [[courage]] | Courage, fear, daring, facing adversity. |
| [[love]] | Love, the heart, devotion, longing. |
| [[nature]] | Nature, the wild, seasons, the outdoors. |
| [[perseverance]] | Persistence, endurance, never giving up. |
| [[humor]] | Wit, satire, comic observation (heavy on Twain, Wilde, Austen). |
| [[leadership]] | Leadership, governance, responsibility, the public good. |
| [[creativity]] | Imagination, art, making, originality. |
| [[stoicism]] | Stoic philosophy — Marcus Aurelius, Seneca, Epictetus (PD translations). |
| [[misattributed-avoid-list]] | The famous fake / wrongly-attributed quotes the pipeline must reject. |

## Quick safety summary for the pipeline

- Use a quote **only** if it lives in one of the themed collection files above **and** its block says `pd_verified: true`.
- Render the attribution **exactly** as written.
- **Reject** anything on [[misattributed-avoid-list]].
- **Reject** any quote from a living author, a post-1930 work, or any source you cannot name — even if a human pasted it in.

---
*Part of the Polymath Source Material Bible — Section 12 Quotes. Operating guidance for VFXellence Ltd. Not legal advice.*
