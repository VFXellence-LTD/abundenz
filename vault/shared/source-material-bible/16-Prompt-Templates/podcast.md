---
id: prompt-podcast
type: prompt-template
title: Podcast Episode Generation — PD Work or Myth to Episode Outline + Script
applications: [podcast, story, ai-writing]
model_targets: [gpt, claude]
tags: [prompt-template, podcast, episode, outline, script, mythology, literature, folklore, gpt, claude]
related: ["[[shared/slot-resolution-protocol]]", "[[01-Legal-Guidelines/README]]", "[[03-Mythology/README]]", "[[04-Folklore/README]]", "[[05-Literature/README]]", "[[10-Archetypes/README]]", "[[12-Quotes/README]]"]
created: 2026-05-31
---

# Podcast Episode Generation — PD Work or Myth to Episode Outline + Script

## Purpose

Generates a complete podcast episode — intro hook, segment outline, segment scripts, and an outro — built on a single public-domain source (myth, folklore entry, or literary work). The PD work supplies the episode's raw material: its story, its characters, its quotes, and its ideas. The template structures that material into an engaging modern podcast format while keeping every element legally audited. Run all slots through [[shared/slot-resolution-protocol]] before recording or publishing.

## Slot Table

| Slot | Source section | Required? | What to put | Example fill (real entry) |
|---|---|---|---|---|
| `[SOURCE]` | [[03-Mythology]], [[04-Folklore]], or [[05-Literature]] | yes | The PD work the episode is about | `myth-norse-odin` → "sacrifice-for-wisdom, the hanging on the World Tree, the Ravens Huginn and Muninn" |
| `[EPISODE_ANGLE]` | [[10-Archetypes]] or inline | yes | The interpretive lens / argument of the episode | "What does the Sage who sacrifices for knowledge have to teach us about curiosity's cost?" |
| `[HOOK_QUOTE]` | [[12-Quotes]] (PD, verified) | optional | Epigraph line read cold in the first 10 seconds | `quote-wisdom-collection Q01` → *"The unexamined life is not worth living."* — Socrates |
| `[SHOW_FORMAT]` | inline | yes | Solo monologue / co-host / interview-style scripted | "solo narrative monologue / scripted two-voice discussion / intro+segments+outro" |
| `[EPISODE_LENGTH]` | inline | yes | Target runtime in minutes | "20 min / 45 min / 10 min short-form" |
| `[TONE]` | inline | yes | Show's voice | "intellectual and accessible / warm storytelling / deadpan and punchy / curious and slightly irreverent" |
| `[CTA]` | inline | optional | Outro action | "follow the show / join the newsletter / buy the related product / leave a review" |
| `[SEGMENT_COUNT]` | inline | yes | Number of main content segments (excl. intro/outro) | 3 / 4 / 5 |

## Base Prompt (model-agnostic)

```
You are a podcast script writer producing an episode for [SHOW_FORMAT] format.

Source material: [SOURCE] — public domain, legal to use fully. Draw on its narrative, characters, symbols, and language without restriction, but present it through the lens of [EPISODE_ANGLE] for a modern audience.

Episode angle / argument: [EPISODE_ANGLE].

Opening hook quote (read cold, before music fades): [HOOK_QUOTE]. If no quote provided, write a 1-sentence hook that encapsulates [EPISODE_ANGLE].

Tone: [TONE].

Target length: [EPISODE_LENGTH].

Segment count: [SEGMENT_COUNT] segments plus intro and outro.

Structure to follow:
INTRO (60–90 seconds): Hook quote → brief scene-setting → promise of what the listener will understand by the end.
SEGMENT 1: Introduce [SOURCE] — who, what, when, the core myth or story. Keep accessible; assume the listener knows nothing.
SEGMENT 2: The key theme — deep dive into [EPISODE_ANGLE] using details and imagery drawn directly from [SOURCE].
SEGMENT 3: The modern resonance — how does [EPISODE_ANGLE] speak to a contemporary audience? (Add more segments as needed.)
OUTRO (60 seconds): Restate the central insight. Land the [HOOK_QUOTE] again if used, or echo its theme. [CTA].

Deliver: full outline with time allocations, then a full script draft for the intro and at least one full segment. Mark [HOST] for host lines. Mark [QUOTE] for any verbatim PD text read aloud — always attribute in-script.
```

## Worked Examples

### Example 1 — Odin and the Cost of Wisdom (Norse Mythology, 20-min Solo Episode)

**Slots:**
- `[SOURCE]` = `myth-norse-odin` → sacrifice-for-wisdom, the hanging on Yggdrasil, the single eye given to Mimir's well, the ravens Huginn (Thought) and Muninn (Memory)
- `[EPISODE_ANGLE]` = "The archetype of the Seeker who permanently pays for what they want to know — and what that says about curiosity, obsession, and the price of understanding"
- `[HOOK_QUOTE]` = none (write original hook)
- `[SHOW_FORMAT]` = "solo narrative monologue"
- `[EPISODE_LENGTH]` = "20 min"
- `[TONE]` = "intellectual and accessible, slightly mythic in register"
- `[CTA]` = "follow and leave a review"
- `[SEGMENT_COUNT]` = 3

**Full prompt to model:**
```
Write a 20-minute solo podcast episode outline and full intro script.

Source: Odin (myth-norse-odin). Public domain: Norse Eddas (Prose Edda by Snorri Sturluson, c.1220; Poetic Edda, c.1270 — both fully PD). Key material: Odin hanging on the World Tree Yggdrasil for nine days to receive the runes; giving his left eye to Mimir's well for a drink of cosmic wisdom; sending the ravens Huginn (Thought) and Muninn (Memory) into the world each day and fearing one day they won't return.

Episode angle: The Seeker who permanently pays for what they want to know — what does the myth of Odin's sacrifices reveal about the psychology of the knowledge obsessive?

Tone: intellectual and accessible, slightly mythic in register — like Radiolab meets a Norse campfire.

Format: solo narrative monologue, 20 min.

Structure:
- INTRO (90 sec): Original cold hook + promise.
- SEGMENT 1 (5 min): Who is Odin? Introduce the mythology for a listener who has never heard it. Draw on the Eddas.
- SEGMENT 2 (8 min): The three sacrifices (eye, hanging, the ravens' daily risk) — deep dive on each. What does the myth say about what knowledge costs?
- SEGMENT 3 (5 min): Modern resonance — the Odin pattern in scientists, artists, and obsessives who sacrifice ordinary life for the thing they need to understand.
- OUTRO (90 sec): Land the theme. CTA: follow and leave a review.

Deliver: full outline with time allocations, then full script for the intro and Segment 1.
Attribute all PD text read aloud in-script (e.g. Bellows translation of the Poetic Edda, 1923, public domain).
Do not invoke Marvel's Odin, Anthony Hopkins, or any copyrighted modern adaptation.
```

**Outline (abbreviated):**

```
INTRO (0:00–1:30)
[HOST] What would you give up to know everything you need to know?
[HOST] Not everything you want — everything you NEED. The Norse god Odin gave up an eye.
       That sounds like a metaphor. It isn't. [Scene-setting: what this episode will reveal.]

SEGMENT 1: Who Is Odin? (1:30–6:30)
[HOST] Introduce the Norse cosmos and Odin's place in it: the All-Father, wanderer, warlord, and above all — seeker.
       Key material: the Prose Edda's description of Odin, his hall, the ravens.
[HOST] Huginn and Muninn — Thought and Memory — fly out each morning to observe the worlds.
       [QUOTE] From Henry Adams Bellows' 1923 translation of the Poetic Edda (Grímnismál 20):
       "Hugin and Munin fly each day / Over the spacious earth; / I fear for Hugin, that he come not back, / Yet more anxious am I for Munin."
       Attribution: *Grímnismál*, Poetic Edda; trans. Bellows, 1923. Public domain.
[HOST] Even Odin — who gave everything to know — fears that his own faculty of memory might not return.

SEGMENT 2: The Three Sacrifices (6:30–14:30)
[HOST] Walk through each sacrifice in detail. The eye at Mimir's well. The nine-day hanging.
       The daily risk of the ravens.
[HOST] Each one: what Odin gave, what he gained, and what the myth says about the cost structure of deep knowledge.

SEGMENT 3: The Pattern Today (14:30–19:00)
[HOST] The Odin archetype in contemporary life — the researcher who ruins their health,
       the artist who gives up connection, the obsessive who pays in ways they didn't anticipate.
[HOST] Is it worth it? The myth doesn't say yes or no. It says: you will pay, and you will pay permanently.

OUTRO (19:00–20:00)
[HOST] Restate central insight. CTA: "If this was worth your 20 minutes, follow the show and leave a review —
       it's how Huginn and Muninn find their way back."
```

**Legal note:** `myth-norse-odin` risk_level: **caution**. Source texts (Prose Edda, Poetic Edda) are PD. Bellows 1923 translation is PD. Do NOT invoke Marvel, Anthony Hopkins, or any recent video game/TV adaptation. Rune imagery: avoid the Valknut and any symbols associated with extremist groups — do not use them in promotional artwork for this episode.

---

### Example 2 — Sherlock Holmes and the Rational Mind (Literature, 45-min Two-Voice Episode)

**Slots:**
- `[SOURCE]` = `pd-char-sherlock-holmes` → Arthur Conan Doyle's canon, fully PD since Jan 2023; specifically *A Study in Scarlet* (1887) and *The Sign of the Four* (1890)
- `[EPISODE_ANGLE]` = "What Holmes's method of observation and deduction reveals about how to think clearly — and where pure rationalism breaks down"
- `[HOOK_QUOTE]` = none; write original
- `[SHOW_FORMAT]` = "scripted two-voice discussion (Host A + Host B)"
- `[EPISODE_LENGTH]` = "45 min"
- `[TONE]` = "curious and slightly irreverent, smart but not snobbish"
- `[CTA]` = "join the newsletter"
- `[SEGMENT_COUNT]` = 4

**Outline (abbreviated):**

```
INTRO (0:00–2:00)
[HOST A] Cold hook: "The most influential thinking teacher of the last 150 years is a fictional drug addict."
[HOST B] "And we're going to use his actual original stories — now fully in the public domain — to figure out exactly what his method is."

SEGMENT 1: The Method (2:00–12:00)
Textual deep-dive: Holmes in A Study in Scarlet (1887, PD) explaining observation vs. inference to Watson.
Read-aloud of relevant PD passage with attribution: Doyle, *A Study in Scarlet* (1887). Public domain.

SEGMENT 2: Where It Works Brilliantly (12:00–22:00)
The Sign of the Four (1890, PD): three worked examples of Holmes's method paying off.
Pattern-recognition, eliminating the impossible, attending to the overlooked.

SEGMENT 3: Where It Breaks Down (22:00–35:00)
Holmes's documented failures and blind spots in the canon.
The shadow of the Sage archetype: the rationalist who substitutes analysis for empathy, and the cases it costs him.

SEGMENT 4: Applying It (35:00–43:00)
Practical extension — how the Holmesian observation method translates to contemporary decision-making.
Use only PD source text; no reference to any modern adaptation.

OUTRO (43:00–45:00)
[HOST A+B] Restate: the method is in the public domain too — it's ours.
CTA: newsletter link.
```

**Legal note:** `pd-char-sherlock-holmes` risk_level: **caution**. All 60 Holmes stories are PD since Jan 2023. Show name must NOT be "Sherlock Holmes [Anything]" due to trademark risk on the name. Do not clip, paraphrase, or imply endorsement from the BBC Sherlock, RDJ films, or any modern adaptation. Quote only from Doyle's original canon; attribute precisely. See [[11-characters/sherlock-holmes]] `risk_notes` for full estate posture.

## Legal Pre-Flight

Sections this template touches: 03-Mythology, 04-Folklore, 05-Literature, 10-Archetypes, 12-Quotes. Before recording: verify `[SOURCE]` is `pd_status: public-domain`; confirm all PD text read aloud is attributed in the script with author, title, year, and translator (if applicable); confirm show/episode title does not use a trademarked name; confirm no audio clip from any copyrighted film/TV/game adaptation is used; run [[shared/legal-preflight]].

---
*Part of [[16-Prompt-Templates/README]]. Resolve slots per [[shared/slot-resolution-protocol]]. Defers to [[01-Legal-Guidelines/README]].*
