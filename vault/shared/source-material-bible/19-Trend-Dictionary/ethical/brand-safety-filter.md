# Ethical — Brand-Safety Filter

> The Boss's gate. A phrase can be legally clear and still be a hard **NO** here. This screen protects the VFXellence Ltd / Abundenz brand from cringe, hate, smut, and cruelty. When a screen is ambiguous, escalate to the Boss; default to `off-limits`, never to `clean`.

A phrase is **off-limits** if **ANY** of the following four screens trips. They are independent — one failure is enough.

---

## Screen 1 — The 12-year-old test (cringe / dead-trend screen)

> **Imagine the exact phrase, rendered on a tee, shown to a switched-on, internet-fluent 12-year-old in the target audience. Their honest, unguarded reaction is the verdict.**

This screen protects against two expensive mistakes: (a) shipping something that's *trying too hard* and reads as a brand pretending to be young, and (b) shipping a **dead trend** after the wave has passed.

**PASS** — genuine amusement, recognition, or approval: *"that's actually funny / that's so real / I'd wear that."*

**FAIL** — any of:
- **Cringe / try-hard** — *"that's so cringe,"* the "fellow kids" effect, marketing-speak cosplaying youth slang.
- **Dated** — *"nobody says that anymore."* A `declining` or `dead` `trend_status` almost always fails here. Slang has a short half-life; a phrase that peaked months ago is a liability.
- **Mismatched audience** — funny to adults *about* kids, but not funny *to* the kids who'd buy it (or vice-versa).

**Calibration:** judge against the entry's `audience`, not a generic adult. "Six seven" is hilarious to a Gen Alpha 12-year-old and baffling to a 40-year-old — it **passes** because the audience is Gen Alpha.

`twelve_yo_test` ∈ {`pass`, `fail`}. A `fail` → `ethical_verdict: off-limits` → `ship_decision: NO`.

---

## Screen 2 — Racism / hate / dog-whistle screen

A phrase is off-limits if it has a **racist, hateful, or discriminatory connotation OR origin** — including phrases that look innocent but are **coded** hate symbols.

**Check both surface meaning and origin/coded meaning:**

1. **Overt** — slurs, explicitly discriminatory or supremacist content. Obvious `off-limits`.
2. **Coded / dog-whistle** — the dangerous category, because it slips past naive review. Some **numbers and innocuous-looking phrases are coded hate symbols.** Screen every numeric or oddly-specific phrase against:
   - The **ADL Hate Symbols Database** (`adl.org/hate-symbols`) — the authoritative reference for coded numbers, acronyms, and symbols.
   - Known coded numbers, e.g. **14 / 1488 / 88 / 18 / 23 / 311** and similar — these are established white-supremacist numeric codes. **Any phrase resolving to one of these is `off-limits` regardless of trend heat.**
   - Coded acronyms and "echo"-style markers.
3. **Origin** — a phrase born in a hate/extremist community, even if its surface use looks benign, is `caution` at minimum and usually `off-limits`. (Compare the *manosphere/incel* origin concern in Screen 4's adjacency.)

> **Numeric phrases get extra scrutiny.** Before clearing any number-based trend (e.g. a "6 7" style phrase), explicitly confirm the number is *not* in the ADL coded list and that its viral meaning is the benign one. Document the check in the entry.

Verdict: any hate/coded-hate hit → `off-limits`. Suspicious-but-unconfirmed origin → `caution` + Boss review.

---

## Screen 3 — Sexual innuendo / double-entendre screen

A phrase is off-limits if its **current slang usage** is sexual, even if a literal/older reading is innocent. Slang meaning, not dictionary meaning, governs.

**Confirmed off-limits in current usage:**
- **"gooning" / "gooner"** — refers to prolonged compulsive masturbation. Sexual. → `off-limits`.
- **"edging"** — sexual orgasm-control practice in current slang usage. → `off-limits`.
- **"gyat" / "gyatt"** — exclamation about a large backside / sexual attraction to a body. Body/sexual-objectification connotation. → `off-limits` (at best `caution`, but the dominant meaning is sexual).

**Method:** for any phrase, check its **dominant current connotation** on Urban Dictionary / Know Your Meme / recent press. If the phrase is *primarily* used sexually or its humor depends on a sexual double-entendre, it's `off-limits` for a brand-safe POD line — regardless of how a charitable reading might spin it.

> A phrase that has *both* a clean and a sexual usage defaults to `caution` only if the clean usage clearly dominates and the design context forecloses the sexual read; otherwise `off-limits`.

---

## Screen 4 — Punching-down / tragedy screen

A phrase is off-limits if it **punches down** or is **derived from someone's victimization**:

- **Mocking tragedy** — phrases born from disasters, deaths, or real-world suffering used as a punchline.
- **Mocking disability** — ableist phrasing or memes that target disabled people.
- **Derived from victimization** — phrases that originate in someone being harassed, doxxed, exploited, or harmed (including memes built on a real person's worst moment without consent).
- **Identifiable-person cruelty** — a meme that exists to ridicule a specific real, non-public, or vulnerable individual.

Adjacent flag (origin-based): phrases from **incel / manosphere / "black pill"** communities — e.g. **"looksmaxxing," "mogging"** — carry a connotation of appearance-based dominance and an extremist-adjacent origin. These are at minimum `caution` (conservative rendering, Boss review) and tip to `off-limits` if the design leans into the dominance/black-pill framing.

Verdict: any punching-down hit → `off-limits`.

---

## Ethical verdict mapping

- `clean` — passes the 12-yo test **and** clears Screens 2, 3, 4 with no flags.
- `caution` — borderline: ambiguous origin, mild edge, audience-dependent humor, or a clean-dominant-but-not-spotless phrase. Allowed only with **conservative rendering + Boss sign-off**.
- `off-limits` — fails the 12-yo test, OR trips any of Screens 2/3/4. **Hard NO**, no matter how hot the trend.

---

## "How to screen a new phrase in 60 seconds" — worked checklist

Run top to bottom. **Stop and mark `off-limits` the moment any screen trips.**

1. **(0–10s) 12-yo test.** Picture it on a tee in front of the target-age kid. Funny/cool, or cringe/dead? Cringe or dead → **STOP, off-limits.**
2. **(10–20s) Numeric/coded check.** Is it a number or oddly specific string? Cross-check the ADL Hate Symbols Database + known coded numbers (14/88/1488/etc.). Hit → **STOP, off-limits.**
3. **(20–35s) Sexual check.** Pull up Urban Dictionary / Know Your Meme. Is the *dominant current* meaning sexual or a sexual double-entendre (goon/edge/gyat family)? Yes → **STOP, off-limits.**
4. **(35–45s) Origin check.** Where was it born? Hate/extremist/incel/manosphere community? Hate → `off-limits`. Manosphere/incel-adjacent → `caution` + Boss.
5. **(45–55s) Punching-down check.** Does it mock tragedy/disability or come from someone's victimization? Yes → **STOP, off-limits.**
6. **(55–60s) Verdict.** No screen tripped and 12-yo test passed → `clean`. Any borderline residue → `caution` + Boss. Otherwise `off-limits`.

> Record the result as `ethical_verdict` + `twelve_yo_test` in the entry, with one line of reasoning. Document numeric/coded checks explicitly — that's the screen most likely to be skipped and most damaging to miss.

> See also: [[../three-force-gate]] · [[../legal/trademark-clearance]] · [[../../01-Legal-Guidelines/README]]
