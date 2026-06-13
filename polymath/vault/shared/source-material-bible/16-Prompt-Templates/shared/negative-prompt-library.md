---
id: prompt-shared-negative-prompt-library
type: sop
title: "Negative-Prompt Library — Quality Negatives + the IP-Safety Blocklist"
creator: Polymath
year: 2026
country: na
pd_status: na
pd_basis: "Polymath-original reference"
verified: true
themes: [legal-safety, prompt-engineering, quality-control]
symbols: []
archetypes: []
visual_motifs: []
emotional_tags: []
applications: [ai-image, ai-video, poster, pod, tshirt, childrens-book, merch]
risk_level: safe
risk_notes: "The IP-Safety Blocklist is the most important part of this file. It is the negative-prompt expression of the legal doctrine: never reproduce a protected modern visual design, a logo/mascot, or a real person's likeness — even when the underlying source is public-domain."
remix_hooks: []
source_url: ""
tags: [prompt-template, sop, negative-prompt, legal-safety]
related: ["[[16-Prompt-Templates/README]]", "[[shared/slot-resolution-protocol]]", "[[shared/legal-preflight]]", "[[01-Legal-Guidelines/README]]"]
created: 2026-05-31
---

# Negative-Prompt Library

Reusable negative-prompt blocks. Two kinds: **quality negatives** (clean up the image) and the **IP-Safety Blocklist** (keep the image legally clean). For models with a negative field (SDXL), paste directly. For Midjourney, convert each term to `--no term`. For DALL·E 3 / Flux, express in prose ("with no … and no …").

---

## A. Quality negatives (general)

```
lowres, blurry, jpeg artifacts, oversaturated, deep-fried, watermark,
signature, autograph, username, frame border (unintended), cropped,
out of frame, duplicate, mutated, extra limbs, extra fingers, fused fingers,
malformed hands, malformed face, asymmetrical eyes, text (unintended),
gibberish text, busy background (unintended), muddy colors
```

## B. Quality negatives — flat / vector / print art

```
3d render, photorealistic, gradient mesh, drop shadow, bevel, photographic
texture, noise, grain, soft focus, realistic skin pores
```
(Use when the brief calls for clean flat shapes — t-shirt graphics, stickers, children's-book vector.)

## C. Quality negatives — children's-book friendly

```
scary, frightening, gore, blood, violence, weapons (graphic), realistic horror,
sharp teeth (menacing), dark disturbing imagery, uncanny faces, text
```

---

## D. THE IP-SAFETY BLOCKLIST (mandatory on every commercial generation)

This block encodes the legal doctrine from [[01-Legal-Guidelines/README]] as a negative prompt. **Always include it on anything destined for sale.** It blocks the most common ways a PD-sourced image accidentally drifts into a live copyright, trademark, or likeness.

```
logo, brand logo, trademark, registered mascot, corporate character,
movie still, film screenshot, specific film costume, studio character design,
Disney style, Pixar style, Marvel style, DC style, named living artist style,
celebrity face, real person likeness, recognizable public figure,
modern franchise character, video-game character, anime franchise character,
sports team logo, product packaging, copyrighted poster reproduction
```

### Trap-specific add-ons (append when the matching slot is used)

These come straight from the section's character/literature traps. When a slot resolves to one of these entries, append its line.

| When `[CHARACTER]`/`[SUBJECT]` resolves to… | Append to negative | Why |
|---|---|---|
| `pd-char-frankensteins-monster` | `flat-top head, neck bolts, green skin, Universal monster, Karloff makeup` | The novel is PD; the bolt-neck design is Universal's live copyright. See [[11-characters/frankensteins-monster]]. |
| `pd-char-oz-characters` | `ruby slippers, MGM costume, 1939 film design` | Baum's books say **silver** shoes; ruby slippers are MGM's. See [[METADATA-STANDARD]] restricted example. |
| `pd-char-sherlock-holmes` | `deerstalker-as-trademark posture, modern BBC/film likeness, specific actor face` | Text PD; render generically, avoid any specific screen actor. See [[05-Literature/traps/sherlock-holmes-estate]]. |
| `pd-char-peter-pan` | `Disney Peter Pan design, specific film costume` | Disney's design and the GOSH situation. See [[05-Literature/traps/peter-pan-gosh-royalty]]. |
| `pd-char-tinker-bell` | `Disney Tinker Bell design, specific film fairy` | Same Peter Pan trap family. |
| `pd-char-dracula` | `Bela Lugosi likeness, specific film Dracula costume, Universal cape design` | Stoker's novel is PD; specific film portrayals are not. |
| any winnie-the-pooh use | `Disney Pooh design, red shirt Pooh` | 1926 book PD; Disney's red-shirt design is not. See [[05-Literature/traps/winnie-the-pooh-vs-disney]]. |
| any Tarzan / John Carter use | `ERB Inc. trademark elements` | PD text, **live trademarks**. See [[05-Literature/traps/tarzan-john-carter-trademarks]]. |

---

## How the templates use this

Every AI-image template's Slot Table includes an implicit `[NEGATIVE]` that always contains **Block D**, plus Block A (quality) by default, plus B or C depending on medium, plus any trap-specific add-on triggered by the resolved `[CHARACTER]`/`[SUBJECT]`. The [[shared/slot-resolution-protocol]] inserts the trap add-on automatically when the ledger flags it.

---
*Part of [[16-Prompt-Templates/README]]. Defers to [[01-Legal-Guidelines/README]].*
