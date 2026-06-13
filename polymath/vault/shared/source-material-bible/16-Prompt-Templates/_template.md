---
id: prompt-<family>-<slug>
type: prompt-template
title: "<Human-readable template name>"
creator: Polymath
year: 2026
country: na
pd_status: na
pd_basis: "Polymath-original prompt method; legal weight lives in the resolved slot values, not the template"
verified: true
themes: [<what kinds of concepts this template is for>]
symbols: []
archetypes: [<archetypes this template commonly invokes, if any>]
visual_motifs: [<motifs this template commonly invokes, if any>]
emotional_tags: [<target mood register>]
applications: [<subset of: pod, tshirt, poster, childrens-book, story, podcast, video, blog, social, merch, character, brand, ai-image, ai-video, ai-writing>]
risk_level: safe
risk_notes: "The template is safe; the OUTPUT is only as safe as the slot values. Resolve every slot per [[shared/slot-resolution-protocol]] and run [[shared/legal-preflight]] before publishing. Never instruct a model to reproduce a protected modern visual design or a real person's likeness."
remix_hooks: [<angles this template enables>]
source_url: ""
tags: [prompt-template, <model tags e.g. midjourney, sdxl, dalle, flux>, <family>]
related: ["[[shared/slot-resolution-protocol]]", "[[01-Legal-Guidelines/README]]"]
created: 2026-05-31
---

# <Template Name>

## Purpose
One or two sentences: what this template produces, for which product lines, and which Bible sections it draws on.

## Slot Table
The contract. Each slot resolves to an entry `id` from the named section. See [[shared/slot-resolution-protocol]] for the master glossary.

| Slot | Source section | Required? | What to put | Example fill (real entry) |
|---|---|---|---|---|
| `[SUBJECT]` | 03 / 04 / 05 / 11 | yes | The thing being depicted/written | `myth-greek-athena` → "armored goddess of wisdom, owl, spear" |
| `[STYLE]` | 06 | yes | One art-movement | `art-deco` → "geometric symmetry, gold linework" |
| `[MOTIF]` | 09 / 13 | optional | A composable decorative element | `motif-laurels-and-wreaths` |
| `[PALETTE]` | 08 | optional | One color system | `palette-pharaohz-gold-lapis` |
| `[COMPOSITION]` | inline | yes | Framing/layout (free, from cheat-sheet) | "centered, symmetrical, full-body" |
| `[MEDIUM]` | inline | yes | Render medium | "vector illustration / oil painting / risograph" |
| `[MOOD]` | inline | optional | Emotional register | "reverent, mythic, luminous" |
| `[PARAMS]` | [[shared/model-parameter-cheatsheet]] | model-specific | Model flags | "--ar 2:3 --stylize 250" |

## Base Prompt (model-agnostic)
```
<the assembled prompt string with [SLOTS] inline>
```

## Model Notes
- **Midjourney:** …
- **SDXL / ComfyUI / Automatic1111:** …
- **DALL·E 3:** …
- **Flux:** …

## Worked Examples
At least 2–3, each using REAL entry IDs that exist in the vault. Each example shows: the filled slots, the final prompt string, and the legal note inherited from the slots.

### Example 1 — <name>
**Slots:** `[SUBJECT]=…` `[STYLE]=…` `[PALETTE]=…`
**Prompt:**
```
…
```
**Legal note (inherited):** …

## Legal Pre-Flight
Sections this template touches: …. Before publishing, run [[shared/legal-preflight]] and confirm: no protected modern design reproduced; no real likeness; every `caution` slot's `risk_notes` reviewed; no `avoid` slot present.

---
*Part of [[16-Prompt-Templates/README]]. Resolve slots per [[shared/slot-resolution-protocol]]. Defers to [[01-Legal-Guidelines/README]].*
