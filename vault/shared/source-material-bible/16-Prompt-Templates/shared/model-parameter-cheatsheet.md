---
id: prompt-shared-model-parameter-cheatsheet
type: sop
title: "Model Parameter Cheat-Sheet — Midjourney, SDXL, DALL·E 3, Flux"
creator: Polymath
year: 2026
country: na
pd_status: na
pd_basis: "Polymath-original reference compiled from public model documentation"
verified: true
themes: [prompt-engineering, ai-image, parameters]
symbols: []
archetypes: []
visual_motifs: []
emotional_tags: []
applications: [ai-image, poster, pod, tshirt, childrens-book, merch]
risk_level: safe
risk_notes: "Reference only. Parameter syntax changes between model versions; treat values as starting points and verify against the model's current docs."
remix_hooks: []
source_url: ""
tags: [prompt-template, sop, parameters, midjourney, sdxl, dalle, flux]
related: ["[[16-Prompt-Templates/README]]", "[[shared/slot-resolution-protocol]]", "[[shared/negative-prompt-library]]"]
created: 2026-05-31
---

# Model Parameter Cheat-Sheet

The `[PARAMS]` slot resolves here. This is the per-model translation layer: the same model-agnostic base prompt, finished with the right flags for the engine you are running.

---

## Aspect ratio by product

Set the canvas to the product first. This drives `--ar` (Midjourney) or width×height (SDXL/Flux).

| Product | Ratio | MJ `--ar` | SDXL px (≈) |
|---|---|---|---|
| T-shirt front graphic | 4:5 / square | `--ar 4:5` | 1024×1280 |
| Poster (portrait) | 2:3 | `--ar 2:3` | 1024×1536 |
| Poster (ISO A) | √2 ≈ 5:7 | `--ar 5:7` | 1024×1434 |
| Children's-book spread | 2:1 (landscape) | `--ar 2:1` | 1536×768 |
| Children's-book page | 4:5 | `--ar 4:5` | 1024×1280 |
| Book / album cover | 1:1 or 2:3 | `--ar 1:1` | 1024×1024 |
| Instagram post | 1:1 / 4:5 | `--ar 1:1` | 1024×1024 |
| Instagram story / reel cover | 9:16 | `--ar 9:16` | 768×1366 |
| YouTube thumbnail | 16:9 | `--ar 16:9` | 1366×768 |
| Sticker / pin | 1:1 | `--ar 1:1` | 1024×1024 |
| Seamless repeat tile | 1:1 (tileable) | `--ar 1:1 --tile` | 1024×1024 |

---

## Midjourney (v6+)

| Flag | What it does | Typical |
|---|---|---|
| `--ar W:H` | Aspect ratio | per product table |
| `--stylize N` (0–1000) | How hard MJ applies its aesthetic | 100 (literal) – 250 (balanced) – 600 (painterly) |
| `--chaos N` (0–100) | Variation across the 4-grid | 0–20 for product consistency |
| `--weird N` (0–3000) | Off-beat aesthetics | 0 unless deliberately strange |
| `--no X` | Negative — exclude X | see [[shared/negative-prompt-library]] |
| `--tile` | Seamless repeating pattern | for surface/merch patterns |
| `--style raw` | Less MJ "opinion", more literal | for design control |
| `--seed N` | Reproducibility | lock for series consistency |

- **Prompt shape:** `subject + style + motif + palette + composition, medium, mood --params`. Put the most important nouns first; MJ front-weights.
- **Image weight / refs:** use `--sref <seed>` to hold a style across a series; never `--sref` to a copyrighted artist's living style or a protected character image.

---

## SDXL (ComfyUI / Automatic1111 / Fooocus)

- **Weighting:** `(token:1.3)` boosts, `(token:0.7)` reduces. Keep boosts ≤1.4 to avoid artifacts.
- **Negative prompt** is a separate field — paste the IP-safety block from [[shared/negative-prompt-library]] plus quality negatives (`lowres, jpeg artifacts, extra fingers, watermark, signature, text`).
- **Steps:** 25–40. **CFG:** 5–8 (lower = more creative, higher = more literal). **Sampler:** DPM++ 2M Karras for general; Euler a for illustration.
- **Refiner:** base model 0.0–0.8, refiner 0.8–1.0 for crisp edges on merch art.
- **Prompt shape:** comma-separated tag clusters, most important first: `subject tokens, (style:1.2), motif tokens, palette tokens, composition, medium, mood`.

## DALL·E 3 (ChatGPT / API)

- **Natural language, not tags.** Write a fluent descriptive sentence; DALL·E 3 rewrites short prompts, so be explicit to keep control.
- **No weighting syntax, no negative field.** Express exclusions in prose: "with no text and no lettering."
- **Say the palette in words:** "a limited palette of burnished gold, deep lapis blue, and alabaster."
- **For flat/print art:** ask for "flat vector illustration, clean shapes, solid colors, no gradients, plain background."
- **Sizes:** 1024×1024, 1024×1792 (portrait), 1792×1024 (landscape).

## Flux (Flux.1 dev / pro / schnell)

- **Strong prompt adherence + native text rendering** — best engine when the design includes legible words (slogans, titles).
- **Natural language with structure.** Mix a fluent scene description with explicit style/medium clauses.
- **Guidance scale:** dev ≈ 3.5; lower for photoreal, higher for graphic. **Steps:** dev 28–50, schnell 4.
- **For typography:** put the exact words in quotes: `the words "MEMENTO MORI" in clean serif capitals`.
- **No `--ar`;** set width/height. Use product table px.

---

## Cross-model parameter map (one base, four finishes)

| Need | MJ | SDXL | DALL·E 3 | Flux |
|---|---|---|---|---|
| Aspect ratio | `--ar 2:3` | 1024×1536 | size: 1024×1792 | w1024 h1536 |
| More literal | `--style raw --stylize 80` | CFG 8 | "exactly as described" | guidance 5 |
| Exclude an element | `--no text` | negative field | "no text" in prose | "no text" clause |
| Series consistency | `--seed` / `--sref` | fixed seed | reuse description | fixed seed |
| Legible words | weak — avoid | weak — avoid | moderate | **strongest** |

---
*Part of [[16-Prompt-Templates/README]]. Pair with [[shared/negative-prompt-library]].*
