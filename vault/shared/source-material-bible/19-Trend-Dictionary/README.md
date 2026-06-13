# 19 — Trend Dictionary

The **Trend Dictionary** is the opposite axis of the rest of the Source Material Bible. Where sections 02–13 catalogue *old, settled, legally-clean* creative material (public-domain art, mythology, folklore, historical design), this section catalogues **modern, fast-moving viral language** — Gen Alpha / Gen Z slang, TikTok trend phrases, creator call-to-actions (CTAs), and memes-as-text — that VFXellence Ltd / Abundenz can exploit on print-on-demand (POD) the *moment* a phrase trends.

This is a living, ephemeral, high-velocity knowledge base. Entries here are expected to age fast. A phrase that is `rising` today may be `dead` in six weeks. That volatility is the entire point: the value is in **day-0 detection** and **fast, legally-and-ethically-gated production**.

---

## What this section is

A vetted dictionary of trending phrases, each scored through a **three-force production gate** before any design is generated. The forces are:

> **Modern Trend × Legal × Ethical**

These three forces guide AI generation the same way the creative Bible's influences (art movement × motif × palette × archetype) guide the *aesthetic* of a design. Here they guide *whether a phrase is allowed to become a product at all*, and only then *how* it should look.

A trending phrase becomes a POD design **only if it clears all three forces**:

1. **TREND** — Is it genuinely rising/hot right now? (Day-0 detection from trend APIs.) We track phrase, platform of origin, trajectory (rising / peaked / declining / evergreen-meme / dead), and audience.
2. **LEGAL** — Is it clear to print? Critically: **US copyright does not protect short phrases or slogans.** The real risk is **trademark** plus **copyrighted baggage** (characters, lyrics, quotes) and **right of publicity** (catchphrases tied to a person). See [[legal/trademark-clearance]].
3. **ETHICAL** — The Boss's brand-safety gate: the "12-year-old test," hate/dog-whistle screening, sexual-innuendo screening, and a punching-down/tragedy screen. See [[ethical/brand-safety-filter]].

The full rubric and decision flow lives in [[three-force-gate]].

---

## How this differs from `14-Trending-Categories`

These two sections sound similar but operate on completely different timescales and risk profiles. Do not confuse them.

| | **14 — Trending Categories** | **19 — Trend Dictionary** (this section) |
|---|---|---|
| **Subject** | Evergreen *creative domains* that consistently sell (cottagecore, dark academia, botanical, retro gaming, astrology) | Ephemeral *viral phrases* (slang, meme text, CTAs) |
| **Timescale** | Stable across years; slow drift | Days to weeks; built to expire |
| **Source** | Market analysis, seasonal demand, niche research | Live trend APIs, day-0 detection |
| **Legal profile** | Generally a *style*, not a protectable string | Specific *strings* with real trademark + baggage exposure |
| **Gate** | Market fit / saturation | Three-force gate (trend × legal × ethical) |
| **Failure mode** | Niche too crowded | Shipped a dead trend, or a trademark/character takedown |

`14` answers "what *genres* should we make art in?" `19` answers "what *exact words* are spiking right now, and are they safe to print today?"

---

## The day-0 competitive-speed thesis

POD on phrases is a **race**. The first wave of sellers to list a clean, trending phrase captures organic search and algorithmic lift *before the marketplace saturates*. Within days of a phrase peaking, thousands of near-identical listings flood Amazon Merch / Etsy / Redbubble, margins collapse, and trademark trolls start filing applications and firing takedowns.

The edge is therefore:

- **Detect on day 0** — before saturation (see [[day-0-pipeline]] and [[sources]]).
- **Clear the gate in minutes, not days** — automated trademark + ethical screening (see [[three-force-gate]]).
- **Generate immediately, spanning the creative Bible** — combine the trend phrase with an art movement / motif / palette / archetype so the output is *differentiated*, not another plain-text tee. This feeds [[../16-Prompt-Templates/README]] and [[../17-Design-Recipes/README]].

Speed without the gate is how sellers get account-banned. The gate without speed is how sellers miss the wave. This section operationalizes **both**.

---

## Folder structure

```
19-Trend-Dictionary/
├── README.md                         ← this file
├── three-force-gate.md               ← canonical scoring rubric + decision flow
├── day-0-pipeline.md                 ← daily ingest → gate → generate workflow
├── sources.md                        ← trend-detection sources + ToS/reliability notes
├── legal/
│   └── trademark-clearance.md        ← TM reframe, USPTO TESS SOP, platform takedown risk
├── ethical/
│   └── brand-safety-filter.md        ← 12-yo test, hate/dog-whistle/sexual/punching-down screens
├── dictionary/
│   └── trend-<phrase>.md             ← one vetted entry per phrase
└── _VERIFICATION.md                  ← web-check log + flagged phrases for Boss review
```

---

## How to use it

1. A phrase surfaces from the [[day-0-pipeline]] (or manually).
2. Run it through [[three-force-gate]] → produces `trend_status`, `legal_verdict`, `ethical_verdict`, and a final `ship_decision` of **GO / HOLD / NO**.
3. Write a dictionary entry with full YAML frontmatter (DB-ready) under `dictionary/`.
4. If **GO**, hand `design_hooks` + `remix_hooks` to [[../16-Prompt-Templates/README]] / [[../17-Design-Recipes/README]] to generate designs that pair the phrase with the creative Bible.
5. All IP doctrine defers to [[../01-Legal-Guidelines/README]].

---

## Hard rules

- **Unknown trademark status ≠ GO.** Unknown = at most `HOLD` (spot-check before mass production).
- **Copyrighted baggage = NO** even if the bare word is usable (the character/lyric/quote is not).
- **Sexual innuendo, hate/dog-whistle, punching-down = NO**, no matter how hot the trend.
- **A dead or cringe trend = NO** — shipping it is wasted spend.

> Cross-links: [[../01-Legal-Guidelines/README]] · [[../06-Historical-Art/README]] · [[../08-Color-Palettes/README]] · [[../10-Archetypes/README]] · [[../13-Visual-Motifs/README]] · [[../14-Trending-Categories/README]] · [[../16-Prompt-Templates/README]] · [[../17-Design-Recipes/README]]
