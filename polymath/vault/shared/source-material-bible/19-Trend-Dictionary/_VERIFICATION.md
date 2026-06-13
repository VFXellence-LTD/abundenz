# _VERIFICATION — Section 19 Trend Dictionary

Date: 2026-05-31. This log records the web-verification done on seed phrases, what was found, and which phrases were flagged `off-limits` / `avoid` / `caution` or need Boss review.

> Method: WebSearch (loaded via ToolSearch) used to verify (a) trademark status / disputes, (b) copyrighted baggage, (c) ethical issues (origin, coded-hate, sexual usage). Where a phrase wasn't individually queried, it was reasoned conservatively and marked `trademark_status: unknown` + `legal_verdict: caution` per the gate's default-to-caution rule.

---

## Phrases explicitly web-checked (with findings)

| Phrase | Key web finding | Resulting flag |
|---|---|---|
| **skibidi toilet** | Copyrighted animated series (DaFuq!?Boom!); **active IP-ownership litigation** (Invisible Narratives v. Next Level); DMCA takedowns fired. | `copyright_baggage` + `disputed` TM → **legal_verdict: avoid → NO** |
| **brat / brat summer** | Charli XCX album; common-law trademark on "brat"; "brat green" trade-dress; legal commentary flags POD use as infringing. | `disputed` TM + publicity → **avoid → NO** |
| **very demure very mindful** | Multiple competing TM applications (Jefferson Bates et al.); creator Jools Lebron did not pre-file; contested ownership; trend already dead. | `disputed` TM + publicity + dead → **avoid + 12-yo fail → NO** |
| **six seven (6 7)** | Origin = Skrilla "Doot Doot (6 7)" + NBA edits; **nonsensical** Gen Alpha meme; Dictionary.com 2025 Word of the Year. **Confirmed 6/7 is NOT an ADL coded hate number.** | clean ethical; TM unknown → **caution → HOLD** |
| **gooning** | Dominant meaning = prolonged compulsive masturbation (fetish origin). | sexual → **off-limits → NO** |
| **edging** | Sexual orgasm-control practice; dominant slang meaning sexual. | sexual → **off-limits → NO** |
| **gyat / gyatt** | Exclamation at an attractive body/backside; sexual-objectification connotation. | sexual → **off-limits → NO** |
| **looksmaxxing** | Coined on incel forums (PUAHate/Sluthate/Lookism); tied to "black pill" ideology; "sexual market value" framing. | manosphere origin → **off-limits → NO** |
| **mogging** | Same incel/black-pill lexicon; appearance-based dominance. | manosphere origin → **off-limits → NO** |
| **mewing** | Jaw technique → now a benign "staying silent" meme, but adjacent to looksmaxxing cluster. | clean usage, origin adjacency → **caution → HOLD** |
| **rizz / sigma / fanum tax** | rizz = charisma (Oxford WOTY 2023, popularized not owned by Kai Cenat); sigma = manosphere term reclaimed ironically; fanum tax tied to creator Fanum. | rizz caution/clean; sigma caution (origin); fanum tax caution (publicity) → all **HOLD** |
| **only in Ohio / Ohio** | Affectionate absurdist meme (weird/cringe); state-as-bit, not person/group; place-name TM noise. | clean ethical; place-name TM noise → **caution → HOLD** |
| **smash that like button / like and subscribe / hit the bell** | Generic descriptive YouTube CTAs in use since ~2012; no single owner; ubiquitous/parodied. | **clear → GO** |

## Phrases reasoned conservatively (not individually queried; default-to-caution)

These were assessed from established knowledge of their meaning/origin and marked `trademark_status: unknown` + `legal_verdict: caution` (HOLD) unless an ethical screen tripped:

- **no cap, cap, mid, NPC, aura/aura points, brainrot, crash out, glaze, it's giving, ate, slay, sus, ratio, drip, cooked, locked in, chat is this real, type beat** — all generic/AAVE/online slang with no copyright on the bare phrase; each requires a USPTO TESS Class-25 spot-check before mass production → **HOLD**.
- **link in bio, comment below** — generic CTAs, treated as `clear` → **GO** alongside the other CTAs.
- Special caution notes captured in-entry: **NPC** (avoid Wojak art + group-dehumanizing use), **sus** (avoid Among Us character art), **drip** (elevated apparel-brand TM-collision risk), **glaze** (faint sexual-origin undertone; render only the over-praise reading), **type beat** (never pair with a real artist's name).

---

## Flagged OFF-LIMITS (ethical hard NO)

- **gooning** — sexual
- **edging** — sexual
- **gyat** — sexual/objectifying
- **looksmaxxing** — incel/manosphere origin
- **mogging** — incel/manosphere origin

## Flagged AVOID (legal hard NO)

- **skibidi toilet** — copyrighted series/characters + active litigation
- **brat** — common-law TM + trade dress (Charli XCX)
- **brat summer** — same brand exposure + dead trend
- **very demure very mindful** — disputed TM + publicity + dead trend

---

## Phrases needing Boss review before production

- **sigma** — manosphere origin; only the *ironic* rendering is acceptable. Confirm tone.
- **mewing** — render only as the "silence" gag, never jaw/looksmaxxing framing.
- **fanum tax** — drop the "fanum" creator name; ship only the generic food-tax gag if at all (declining).
- **glaze** — confirm over-praise-only rendering, no innuendo.
- **All HOLD phrases** — require a USPTO TESS Class-25 spot-check (and marketplace saturation scan) before any mass production; `unknown` TM is never auto-GO.

---

## Outcome counts

- **Dictionary entries written:** 40
- **GO:** 5 (smash that like button, like and subscribe, hit the bell, link in bio, comment below — generic CTAs; clear legal + clean ethical)
- **HOLD:** 26 (no cap, cap, rizz, sigma, mewing, fanum tax, delulu, bussin, mid, NPC, aura, brainrot, crash out, glaze, it's giving, ate, slay, sus, ratio, drip, cooked, locked in, six seven, chat is this real, type beat, Ohio) — *promising but pending TM spot-check / Boss review*
- **NO:** 9 (gyat, gooning, edging, looksmaxxing, mogging — ethical off-limits; skibidi toilet, brat, brat summer, very demure very mindful — legal avoid)

> Note: HOLD count reflects the many phrases that share the same posture (trend OK, ethical clean/caution, legal `unknown`→caution). The gate is deliberately conservative: only generic, owner-less CTAs reach `GO` without a manual spot-check.

> See: [[three-force-gate]] · [[legal/trademark-clearance]] · [[ethical/brand-safety-filter]] · [[../01-Legal-Guidelines/README]]
