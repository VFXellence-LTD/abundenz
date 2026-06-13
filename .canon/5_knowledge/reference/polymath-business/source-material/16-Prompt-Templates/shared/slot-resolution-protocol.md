---
id: prompt-shared-slot-resolution-protocol
type: sop
title: "Slot-Resolution Protocol — How Templates Reference Bible Entries as Variables"
creator: Polymath
year: 2026
country: na
pd_status: na
pd_basis: "Polymath-original operating procedure"
verified: true
themes: [generation, automation, legal-safety, prompt-engineering]
symbols: []
archetypes: []
visual_motifs: []
emotional_tags: []
applications: [ai-image, ai-video, ai-writing, brand, character, pod, story, podcast, blog, social]
risk_level: safe
risk_notes: "This is the safety mechanism for the whole section. The legal status of a generation is the UNION of the legal statuses of its resolved slots. If any slot resolves to risk_level: avoid, the generation must halt."
remix_hooks: []
source_url: ""
tags: [prompt-template, sop, slot-resolution, protocol]
related: ["[[16-Prompt-Templates/README]]", "[[shared/legal-preflight]]", "[[01-Legal-Guidelines/README]]", "[[METADATA-STANDARD]]"]
created: 2026-05-31
---

# Slot-Resolution Protocol

Read this first. Every template in section 16 is a scaffold whose `[SLOTS]` are filled by **entries from other Bible sections**, referenced by their `id`. This document defines the placeholder glossary, the algorithm for resolving a slot against the catalogue, and the legal ledger that travels with every generation.

---

## 1. The master placeholder glossary

Placeholders are **UPPERCASE in square brackets**. The same placeholder always means the same thing across every template file.

| Placeholder | Resolves from | Bible section | What it carries into the prompt |
|---|---|---|---|
| `[SUBJECT]` | a `source-work`, `character`, myth, or folk tale | 03, 04, 05, 11 | The thing depicted or written about, with its canonical visual/textual description |
| `[CHARACTER]` | a `character` | 11 (or 03/04 for mythic figures) | A reusable figure, rendered **from text description**, never a protected modern design |
| `[STYLE]` | an `art-movement` | 06 | The rendering style: brushwork, linework, era look |
| `[DESIGN]` | a `design-system` | 07 | Ornament/pattern logic: borders, scrollwork, lattice |
| `[MOTIF]` | a `symbol` or `visual-motif` | 09, 13 | A composable decorative element: skull, laurel, crescent |
| `[PALETTE]` | a `color-palette` | 08 | The named color system (hex values are uncopyrightable facts) |
| `[ARCHETYPE]` | an `archetype` | 10 | The narrative/character skeleton driving voice or arc |
| `[QUOTE]` | a `quote` | 12 | A verified PD/attributable line for typographic or copy use |
| `[CATEGORY]` | a `category` | 14 | The market niche the output targets |
| `[REMIX]` | a `remix-framework` | 15 | A source×context collision; supplies `[CONCEPT]` + `[MOTIF]` seeds |
| `[CONCEPT]` | inline or from `[REMIX]` | — | The one-line creative idea |
| `[COMPOSITION]` | inline | [[shared/model-parameter-cheatsheet]] | Framing, viewpoint, layout |
| `[MEDIUM]` | inline | — | Vector / oil / risograph / 3D / photoreal |
| `[MOOD]` | inline, often from entry `emotional_tags` | — | Emotional register |
| `[PARAMS]` | model cheat-sheet | [[shared/model-parameter-cheatsheet]] | Model-specific flags (`--ar`, weights, etc.) |

A slot left unfilled that is marked **optional** in a template's Slot Table is simply dropped from the prompt. A **required** slot left unfilled is an error — the template must not run.

---

## 2. The resolution algorithm (what an AI agent does)

```
For each [SLOT] in the template's Slot Table:
  1. Read the slot's "Source section".
  2. Select a candidate entry from that section (by id), per the operator's
     brief, the remix hook, or — if asked to choose — by matching the
     template's themes / emotional_tags.
  3. Open that entry. Record into the LEGAL LEDGER:
        id, pd_status, risk_level, risk_notes
  4. Extract the entry's descriptive payload:
        - for [STYLE]/[DESIGN]: the "look" sentence(s) from the entry body
        - for [SUBJECT]/[CHARACTER]: the text-based physical description
          (NOT any protected modern adaptation)
        - for [PALETTE]: the hex list / color names
        - for [MOTIF]: the motif name + form
  5. Substitute the payload into the [SLOT] placeholder.

After all slots resolved:
  6. Evaluate the LEGAL LEDGER (see §3).
  7. If clear → assemble final prompt, attach [PARAMS] from cheat-sheet, run.
  8. If caution → run, but PRINT every caution risk_notes with the output.
  9. If avoid → HALT. Do not generate. Report which slot blocked.
```

---

## 3. The legal ledger

The legal status of a generation is the **union** of the legal statuses of its resolved slots. Resolve to the **most restrictive** level present:

| Any slot is… | Ledger verdict | Action |
|---|---|---|
| all `safe` | **safe** | Generate freely. |
| at least one `caution` (none `avoid`) | **caution** | Generate, but surface every `caution` note to the operator alongside output. |
| at least one `avoid` | **avoid** | **Halt.** Do not generate. Report the blocking slot's `id` and `risk_notes`. |

This mirrors [[01-Legal-Guidelines/README]]: a work can be PD for copyright yet trademark- or likeness-restricted, so the slot that flags the trap dominates. Example — filling `[CHARACTER]` with `pd-char-frankensteins-monster` resolves to `risk_level: caution`: the novel text is PD, but the Universal bolt-neck design is a separate live copyright. The ledger therefore carries that caution into every prompt that uses it, and the prompt's negative block must exclude the film design (see [[shared/negative-prompt-library]]).

---

## 4. Worked resolution

**Template:** [[ai-image/midjourney-pd-art-style]]
**Operator brief:** "Athena in an Art Deco style, Egyptian gold palette."

| Slot | Selected `id` | Section | pd_status | risk_level | Payload used |
|---|---|---|---|---|---|
| `[SUBJECT]` | `myth-greek-athena` | 03 | public-domain | safe | "armored goddess of wisdom, crested helm, owl, spear, aegis" |
| `[STYLE]` | `art-greek-roman` | 06 | public-domain | safe | "classical proportion, idealized form, relief-sculpture clarity" |
| `[PALETTE]` | `palette-pharaohz-gold-lapis` | 08 | openly-licensed | safe | "burnished gold, deep lapis blue, alabaster, carnelian" |
| `[MOTIF]` | `motif-laurels-and-wreaths` | 13 | public-domain | safe | "laurel wreath framing" |

**Ledger verdict:** safe → generate freely.
**Assembled prompt:** see the worked examples in [[ai-image/midjourney-pd-art-style]].

---

## 5. Authoring rule for new templates

When you write a new template:
- Every slot in the Slot Table must name a **real Bible section**.
- Every worked example must use a **real entry `id`** that exists in the vault (verify against the section folder, do not invent IDs).
- The template's own `risk_notes` must point back here.

---
*Part of [[16-Prompt-Templates/README]]. Defers to [[01-Legal-Guidelines/README]] and [[METADATA-STANDARD]].*
