# 03 — Mythology: World Mythology Source Library

This is the mythology section of the Polymath **Source Material Bible**. It catalogues the gods, heroes, monsters, symbols, and stories of the world's major mythological traditions, and turns each one into a reusable creative asset for VFXellence Ltd's content ecosystems (print-on-demand, t-shirts, posters, children's books, written storytelling, podcasts, video, blog, social, merch, and AI image / video / writing).

This section **defers to [[01-Legal-Guidelines/README|01 — Legal Guidelines]]** for all rights questions. If anything here conflicts with section 01, section 01 wins.

## What this section is for

Mythology is one of the richest and (mostly) safest wells of creative source material on earth. The underlying stories are ancient, anonymous, and overwhelmingly in the public domain — Zeus, Odin, Anubis, and the Hydra are free for anyone to build on. That makes mythology an ideal engine for original content: archetypes that audiences already recognize, symbols that carry instant meaning, and narrative scaffolding that has been stress-tested for three thousand years.

But mythology comes with two sharp traps, and this section exists to keep you out of both:

1. **The myth is free; the modern depiction is not.** "Thor" the Norse god is public domain. Marvel's blond, hammer-wielding, comic-book Thor is a live, aggressively enforced copyright and trademark. "Kratos" is a minor figure of Greek myth; the bald, ash-skinned, chain-armed God of War Kratos is a Sony copyright. "Hercules" is ancient; Disney's 1997 Hercules design is Disney's. The single most common mistake in this category is reaching for the version you remember from a movie or game instead of the version that is actually free. **Every entry here separates the free mythological substance from the restricted modern look.**

2. **Some of these traditions are living religions.** Hindu deities (Ganesha, Shiva, Lakshmi), many Indigenous and Native American sacred figures, and active Shinto, folk, and ancestral practices are not dead mythology — they are objects of present-day worship for billions of people. Treating sacred living-faith iconography as casual novelty merch is both a reputational disaster and, in some markets, a legal and platform-policy problem. **Entries for living-faith material carry `risk_level: caution` and explicit cultural-respect guidance in `risk_notes`, regardless of copyright status.**

## How it is used

### By human operators
Pick a pantheon folder, browse its README for the cast of characters, then open an entry. Each entry tells you the archetype, the visual motifs and symbols that are safe to draw, the reusable story and design concepts, the product opportunities, and — critically — the remix hooks that let you build something *original* rather than a copy. Always check `risk_level` and `risk_notes` before committing a design.

### By AI generation systems
Each entry's YAML frontmatter is the machine contract. Downstream prompt and generation pipelines read:
- `symbols`, `visual_motifs`, `archetypes`, `themes`, `emotional_tags` — to assemble grounded, specific prompts instead of generic ones.
- `remix_hooks` — to generate *transformative* output (new characters, new settings, new mashups) rather than reproductions.
- `risk_level` + `risk_notes` — to filter automatically. An `avoid`-tagged motif (e.g. "Mjolnir drawn as the Marvel hammer") must never enter a prompt; a `caution`-tagged living-faith deity must route to human review before any merch is produced.
- `applications` — to know which product channels a source is cleared and suited for.

## Pantheons covered

Each pantheon lives in its own folder with a README index plus individual entry files for major deities, heroes, creatures, and symbols.

| Folder | Tradition | Living faith? |
|---|---|---|
| [[greek-roman/README\|greek-roman]] | Greek & Roman (Olympian) | No (classical) |
| [[norse/README\|norse]] | Norse / Germanic | Mostly no (minor modern revival) |
| [[egyptian/README\|egyptian]] | Ancient Egyptian | No |
| [[mesopotamian/README\|mesopotamian]] | Sumerian, Akkadian, Babylonian | No |
| [[celtic/README\|celtic]] | Irish, Welsh, Gaulish | No (minor modern revival) |
| [[hindu/README\|hindu]] | Hindu | **Yes — living religion** |
| [[japanese-shinto/README\|japanese-shinto]] | Japanese / Shinto | **Yes — living religion** |
| [[chinese/README\|chinese]] | Chinese (Taoist, folk, Buddhist) | **Partly living** |
| [[slavic/README\|slavic]] | Slavic | Mostly no (minor revival) |
| [[mesoamerican/README\|mesoamerican]] | Aztec & Maya | No (descendant cultures live) |
| [[african/README\|african]] | West African / Yoruba & others | **Partly living (Orisha worship)** |
| [[polynesian/README\|polynesian]] | Hawaiian, Māori, broader Polynesian | **Partly living (sacred to descendants)** |
| [[native-american/README\|native-american]] | Various North American nations | **Yes — sacred, restricted** |

## Section-specific conventions

- **Myth substance vs. modern look.** Every entry has a *Legal & Safety* section that names the public-domain substance you may freely use AND the specific modern depictions you must avoid (Marvel, DC, Disney, God of War, Rick Riordan / Percy Jackson, Assassin's Creed, Smite, Hades the video game, etc.).
- **Living-faith caution.** Hindu, Shinto, active Chinese folk religion, Orisha, Polynesian, and Native American sacred material default to `risk_level: caution` even though the myths themselves are not copyrighted. Sacred Native American figures and ceremonies default to `avoid` for merch. Respect is the rule, not the exception.
- **Cultural attribution.** `creator` is set to the originating culture (e.g. "Ancient Greek", "Yoruba people") rather than "Unknown", to keep provenance clear.
- **Conservative bias.** Where a figure is entangled with a famous modern franchise to the point that the public can no longer separate them (e.g. a "Norse god of thunder with a hammer" reads as Marvel to most viewers), the entry flags the trap and steers toward differentiating remix hooks.
- **`verified: true`** is used where the public-domain status of the *ancient source* is settled and obvious. The restriction on modern depictions is always noted regardless.

## File index

| File | Purpose |
|---|---|
| [[_template]] | Copy-paste entry template with full frontmatter schema and body headings. |
| Per-pantheon `README.md` | Index and cast list for each tradition, plus pantheon-wide notes. |
| Entry files | One file per deity / hero / creature / symbol, each self-contained and DB-ready. |

---
*Part of the Polymath Source Material Bible. Defers to [[01-Legal-Guidelines/README|01 — Legal Guidelines]]. Operating guidance for VFXellence Ltd. Not legal advice.*
