# 10 — Archetypes: Character Archetype Library

This section is the **character-archetype layer** of the Polymath Source Material Bible. An archetype is a recurring pattern of personality, motivation, and meaning that audiences recognize instantly across every culture and era — the Hero who sacrifices, the Trickster who breaks the rules, the Sage who knows. Archetypes are not characters and not stories; they are the *template* underneath both.

Archetypes are completely safe to use. They are abstract patterns, not protected expression. **You cannot copyright "the brave warrior" or "the wise old mentor."** Copyright protects a specific character (Aragorn, Gandalf, Yoda); it never protects the archetype those characters all express. This makes the archetype library the single safest creative engine in the whole Bible: it lets us generate original, on-pattern characters and brand voices without touching anyone's IP.

## What this section is for

VFXellence Ltd's content ecosystems (POD, t-shirts, posters, children's books, written storytelling, podcasts, video, blog, social, merch, brand identity, and AI image/video/writing) all need *characters and voices that feel familiar but are legally original*. The archetype library supplies the skeleton:

- A **POD design** needs a recognizable emotional hook ("a Rebel slogan tee," "a Monarch luxury aesthetic"). The archetype defines the values, colors, symbols, and motifs that read as that pattern.
- A **children's book** needs a cast whose roles are clear to a five-year-old (the Guardian who protects, the Trickster who causes trouble, the Sage who explains).
- A **brand voice** needs a stable personality (the Caregiver brand speaks warmly; the Outlaw brand speaks defiantly).
- An **AI prompt** needs a compact, machine-usable description of a personality that will not accidentally describe a copyrighted character.

## How it is used by other sections and by AI generation

- **Section [[08-Color-Palettes]]** — each archetype links to its signature palette(s). The archetype tells the generator *which* palette to reach for (a Monarch wants deep purple + gold; an Innocent wants soft white + pastel).
- **Section [[09-Symbols]]** — each archetype links to the symbols that express it (the Warrior's sword, the Sage's owl, the Magician's stars). These are the visual shorthand a designer or AI drops into a composition.
- **Section [[11-characters]]** — every archetype lists *example public-domain characters* who embody it. These are real, catalogued PD characters whose entries carry the exact legal guardrails. The archetype is the safe abstraction; the example characters show the pattern in action and link to their own risk notes.
- **Section [[13-Visual-Motifs]]** — archetypes reference the recurring visual scenes/compositions that signal them.
- **Section [[15-Remix-Frameworks]]** — remix recipes use archetype-swapping and archetype-blending as transformation engines (e.g. "take a PD fairy tale and recast the villain as a sympathetic Outlaw").
- **Section [[16-Prompt-Templates]]** — prompt templates pull an archetype's `description`, `core values`, `visual motifs`, `colors`, and `symbols` straight into a generation prompt.

For an AI generation pipeline, the workflow is: **pick an archetype → inherit its values, motifs, colors, and symbols → generate an ORIGINAL character (Z-named if it becomes a Polymath brand/mascot) → never copy a named example character's protected design.**

## How the 18–24 set was reconciled

The Maestro requested a working set — Explorer, Inventor, Warrior, Rebel, Teacher, Sage, Dreamer, Trickster, Monarch, Craftsman, Guardian, Merchant — to be unified with the classic Jungian / brand-marketing 12: Innocent, Everyman, Hero, Outlaw, Magician, Lover, Jester, Caregiver, Ruler, Creator, Sage, Explorer.

Several entries on the two lists are the same pattern under different names. We merged the true duplicates and kept genuinely distinct facets as separate archetypes. The reconciliation:

| Reconciled archetype | Requested-set source | Classic-12 source | Notes |
|---|---|---|---|
| **Explorer** | Explorer | Explorer | Identical pattern — merged. |
| **Sage** | Sage, Teacher (partial) | Sage | Sage = the knower; Teacher split off as its own entry (the *transmitter* of knowledge). |
| **Teacher** | Teacher | — | Kept distinct from Sage: Sage seeks/holds truth, Teacher *gives* it to others. |
| **Hero** | Warrior (partial) | Hero | Hero = the courageous proving-self pattern. |
| **Warrior** | Warrior | — | Kept distinct from Hero: Warrior = disciplined fighter/protector by code; Hero = the journey of proving courage. |
| **Outlaw** | Rebel | Outlaw | "Rebel" and "Outlaw" are the same Jungian pattern — merged (Outlaw is the canonical brand name; Rebel is the alias). |
| **Ruler** | Monarch | Ruler | Same pattern — merged (Ruler canonical, Monarch alias). |
| **Magician** | — | Magician | Transformation/vision pattern. |
| **Creator** | Inventor (partial) | Creator | Creator = the artist/visionary maker. |
| **Inventor** | Inventor | — | Kept distinct: Inventor = the *technologist/problem-solver* facet of making (vs Creator's art and Craftsman's craft). |
| **Craftsman** | Craftsman | — | Kept distinct: the hands-on master of a physical craft/trade. |
| **Lover** | — | Lover | Intimacy/passion/devotion pattern. |
| **Jester** | — | Jester | Joy/entertainment pattern. |
| **Trickster** | Trickster | — | Kept distinct from Jester: Trickster = the mythic, disruptive, boundary-crossing pattern (darker edge); Jester = the benign entertainer. |
| **Caregiver** | — | Caregiver | The nurturer. |
| **Guardian** | Guardian | — | Kept distinct from Caregiver: Guardian = the *protector/sentinel* (shields by strength and vigilance); Caregiver = nurtures by tending. |
| **Innocent** | — | Innocent | Optimism/purity pattern. |
| **Everyman** | — | Everyman | Belonging/relatability pattern. |
| **Merchant** | Merchant | — | Trade/value/exchange pattern (added; underrepresented in the classic 12). |
| **Dreamer** | Dreamer | — | The visionary idealist of the imagination. |

That yields **22 reconciled archetypes**, within the 18–24 target. Each gets its own file.

## Section conventions

- One archetype per file, kebab-case filename (e.g. `hero.md`, `trickster.md`).
- Every file carries the canonical YAML frontmatter schema (`type: archetype`). Field names are EXACT for downstream Notion/Airtable/Postgres/vector ingestion — do not rename.
- Archetypes are **always `pd_status: na`, `risk_level: safe`** — they are abstract patterns, not protected works. The legal risk in this section only appears when an archetype's *example characters* point at a restricted design; that risk lives in section [[11-characters]], not here. Each archetype's `risk_notes` restates this.
- Cross-links: `colors:` reasoning links to [[08-Color-Palettes]]; `symbols:` to [[09-Symbols]]; `archetypes:` aliases and opposites point to other entries in this section; example characters link to [[11-characters]].
- Where an archetype is commonly paired with a **shadow** (its negative/corrupted form), the shadow is described in-body (not given its own file) and tagged in `emotional_tags`.
- Invented Polymath mascots/brand characters built *from* these archetypes follow the **Z-naming convention** (see [[brand-naming]]). The archetypes themselves keep their plain descriptive names — they are universal patterns, not Polymath inventions.

## Files in this section

- `README.md` — this file.
- `_template.md` — copy-paste entry template (full frontmatter + body headings).
- 22 archetype entry files (catalogue below).

### Catalogue (22 archetypes)

| File | Archetype | Aliases | Core drive | Shadow |
|------|-----------|---------|------------|--------|
| `hero.md` | Hero | Champion | Prove worth through courageous action | The bully / the savior complex |
| `warrior.md` | Warrior | Soldier, Defender | Win the fight by discipline and code | The mercenary / the brute |
| `explorer.md` | Explorer | Seeker, Wanderer, Pioneer | Find freedom and authenticity in the new | The aimless drifter |
| `sage.md` | Sage | Scholar, Oracle | Understand the world through truth | The dogmatist / armchair critic |
| `teacher.md` | Teacher | Mentor, Guide | Transmit knowledge and grow others | The condescending pedant |
| `magician.md` | Magician | Visionary, Shaman, Alchemist | Transform reality through hidden knowledge | The manipulator / con artist |
| `outlaw.md` | Outlaw | Rebel, Revolutionary | Break what is broken; freedom by defiance | The criminal / nihilist |
| `ruler.md` | Ruler | Monarch, Sovereign, Leader | Create order and prosperity through control | The tyrant / control freak |
| `creator.md` | Creator | Artist, Maker, Author | Realize a vision; give the world new form | The perfectionist / the dilettante |
| `inventor.md` | Inventor | Engineer, Tinkerer | Solve problems by building what's never existed | The mad scientist / reckless tinkerer |
| `craftsman.md` | Craftsman | Artisan, Smith | Master a craft through patient skill | The joyless drudge |
| `lover.md` | Lover | Companion, Devotee | Connection, intimacy, and devotion | The obsessive / the seducer |
| `jester.md` | Jester | Fool, Comedian | Live and lighten the moment with joy | The cruel mocker / the escapist |
| `trickster.md` | Trickster | Coyote, Shapeshifter | Cross boundaries; expose truth by mischief | The malicious deceiver |
| `caregiver.md` | Caregiver | Nurturer, Healer | Protect and nurture others by tending | The martyr / the smotherer |
| `guardian.md` | Guardian | Sentinel, Protector | Shield the vulnerable by vigilance and strength | The jailer / the zealot |
| `innocent.md` | Innocent | Child, Dreamer-of-good | Be happy and good; trust the world | The naïf / the denier |
| `everyman.md` | Everyman | Regular Guy/Gal, Neighbor | Belong; connect on equal footing | The cynic / the doormat |
| `merchant.md` | Merchant | Trader, Dealmaker | Create value through exchange and abundance | The swindler / the hoarder |
| `dreamer.md` | Dreamer | Idealist, Romantic Visionary | Imagine and chase a more beautiful world | The escapist / the deluded |
| `monarch.md` | Monarch | (alias-of-Ruler aspect entry) | The crowned aspect of the Ruler — legacy and dynasty | The despot |
| `oracle.md` | Oracle | Seer, Prophet | Perceive what is hidden in time and fate | The doom-monger / false prophet |

## Related sections

- [[01-Legal-Guidelines]] — archetypes are abstract patterns (safe); risk only enters via example characters.
- [[08-Color-Palettes]] — archetype-to-palette mappings.
- [[09-Symbols]] — archetype-to-symbol mappings.
- [[11-characters]] — public-domain characters that embody each archetype, with their own legal guardrails.
- [[13-Visual-Motifs]] — recurring scenes/compositions that signal an archetype.
- [[15-Remix-Frameworks]] — archetype-swap and archetype-blend transformation engines.
- [[16-Prompt-Templates]] — prompt scaffolds that consume archetype fields.
- [[brand-naming]] — Z-naming for original Polymath characters built from these archetypes.

---
*Part of the Polymath Source Material Bible — Section 10 Archetypes. Archetypes are not legal advice and carry no IP risk; the legal guardrails live in the example-character entries they reference.*
