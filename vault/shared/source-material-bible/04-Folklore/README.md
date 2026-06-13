# 04 — Folklore, Fairy Tales & Legends

This section catalogues the world's **folklore**: fairy tales, legends, tall tales, folk heroes, tricksters, and cryptids. These are the oral and traditional narratives that predate (or sit alongside) the literary canon — Cinderella, Robin Hood, King Arthur, Paul Bunyan, Baba Yaga, La Llorona, Anansi, the Jersey Devil, and hundreds more.

Folklore is the single richest, cheapest, and most legally-flexible reservoir of creative material VFXellence Ltd has access to. A folk *story* almost never carries copyright — it is the shared property of a culture. But the moment a story is fixed by a named author, illustrator, or studio, that *particular telling* can become protected. This section's job is to separate the free, ancient core of each tale from the protected modern skins layered over it.

## What this section is for

Folklore feeds nearly every product line: a poster of a witch's hut on chicken legs, a children's book retelling of Anansi, a podcast on Appalachian cryptids, a t-shirt graphic of a folk-hero silhouette, an AI-generated illustration of a fairy-tale forest. The narratives are public-domain raw material, but the *images and phrasings most people picture* are usually copyrighted (Disney's Cinderella, a specific modern cryptid illustration, a beloved 20th-century picture-book style). This section exists so a human or an AI can grab the free story core and steer clear of the protected skin.

## How it is used

### By other sections
- **[[../03-Mythology/README|03 Mythology]]** — the boundary is fuzzy. We file *gods and creation cosmology* under Mythology and *human/animal heroes, tricksters, ghosts, and monsters of regional tradition* under Folklore. Cross-linked at the seams (e.g. Baba Yaga relates to Slavic mythic figures; Anansi relates to West African deities).
- **[[../05-Literature/README|05 Literature]]** — when a folk tale was *fixed* by a named author (Perrault's "Cinderella", the Brothers Grimm collection, Tennyson's *Idylls of the King*), the literary fixation is logged in 05; the underlying folk motif lives here.
- **[[../10-Archetypes/README|10 Archetypes]]** — folk figures are primary feedstock for archetypes (the Trickster, the Hag/Crone, the Outlaw Hero, the Vengeful Ghost).
- **[[../09-Symbols/README|09 Symbols]]** and **[[../13-Visual-Motifs/README|13 Visual Motifs]]** — folklore supplies motifs (the chicken-legged hut, the green-clad archer, the giant's footprint as a lake).
- **[[../15-Remix-Frameworks/README|15 Remix Frameworks]]** and **[[../16-Prompt-Templates/README|16 Prompt Templates]]** — folk tales are ideal remix fuel because the story is free and infinitely re-skinnable.

### By AI generation systems
Every entry's YAML frontmatter carries `pd_status`, `risk_level`, and `risk_notes`. An AI planning a product walks the **[[../01-Legal-Guidelines/decision-tree|decision tree]]** in Section 01, reads this entry's `risk_notes`, and learns the exact thing to avoid — almost always "use the free folk narrative, do NOT copy the specific modern (often Disney or 20th-century-illustrator) visual design." The `remix_hooks` field gives ready-made creative angles.

## The folklore-specific legal pattern

Folklore concentrates four recurring traps. Section 01 is canonical; this is the folklore-flavoured summary.

| Trap | Free (safe) | Protected (avoid) |
|---|---|---|
| **Tale vs. telling** | The Cinderella *story* (ancient, global). | Disney's 1950 Cinderella *film and character design*. |
| **Figure vs. franchise** | Robin Hood *as folk hero*. | A specific film/game Robin Hood design; trademarked "Robin Hood" product brands. |
| **Motif vs. illustration** | Baba Yaga's hut on chicken legs (folk motif). | A named modern artist's specific copyrighted painting of it. |
| **Cryptid vs. commercial mascot** | Bigfoot/Sasquatch *as folklore*. | Trademarked commercial Bigfoot logos/mascots; specific copyrighted cryptid art (e.g. the modern "Mothman" statue design, the patterned "Jackalope" postcard art). |

Two extra cautions unique to folklore:

1. **Sacred / living-tradition material.** Some folklore belongs to living Indigenous or closed cultural traditions (certain Native American, Aboriginal Australian, and African religious figures). Even when *legally* unprotected, using them can be **culturally harmful or offensive**. Such entries are marked `risk_level: caution` with a `sacred/sensitive` note. Conservative handling: stick to widely-published, secular, folkloric framings; avoid sacred ceremony, secret/initiatory content, and stereotype.
2. **Recent folklore is copyrighted.** "Creepypasta" and internet-era figures (Slender Man and most named modern creepypasta) have **identifiable authors and are NOT public domain** despite feeling folkloric. They are logged here only as `avoid` warnings, never as usable material.

## Section conventions

- **Organized by region, then type.** Subfolders group entries: `europe/`, `british-isles/`, `slavic/`, `americas/`, `africa/`, `asia/`, `tall-tales/`, `cryptids/`, and `fairy-tale-motifs/`. A figure that spans regions is filed by its strongest origin and cross-linked.
- **Each entry is its own file** with full frontmatter (see [[_template]]).
- **Tales are filed by motif where the named author owns the wording.** We log "the Cinderella tale type" (free) rather than reproducing Perrault's or Grimm's exact text (their *translations* may carry their own rights; the 1812–1857 Grimm German originals are PD, but specific modern English translations are not).
- **Conservative bias** per Section 01: uncertain status → `caution`; living-sacred → `caution` with cultural note; named-modern-author → `avoid`.
- **Prose is plain professional English**, readable by humans and machines alike.

## File index

| Group | Folder | Contents |
|---|---|---|
| Fairy-tale motifs | `fairy-tale-motifs/` | Cinderella, Little Red Riding Hood, Snow White, Sleeping Beauty, Beauty and the Beast, Hansel & Gretel, Rumpelstiltskin, Rapunzel, Bluebeard, The Frog Prince, Jack and the Beanstalk, Puss in Boots, The Pied Piper. |
| British Isles | `british-isles/` | Robin Hood, King Arthur, Merlin, Morgan le Fay, Lady of the Lake, Excalibur, Knights of the Round Table, the Green Knight, fairies/the Fae, Jack the Giant Killer, Spring-heeled Jack. |
| Continental Europe | `europe/` | Krampus, the Wild Hunt, the Erlking, the Lorelei, the Flying Dutchman, the Golem of Prague, William Tell. |
| Slavic | `slavic/` | Baba Yaga, Koschei the Deathless, the Firebird, Vasilisa the Beautiful, the Rusalka, Domovoi, the Leshy. |
| Africa & Diaspora | `africa/` | Anansi the Spider, Br'er Rabbit, the High John conjure figure (caution). |
| Asia | `asia/` | The Kitsune (fox spirit), the Tengu, Momotaro, the Kappa, the Yuki-onna, the Monkey King (Sun Wukong), the Jiangshi. |
| The Americas | `americas/` | La Llorona, El Cucuy/El Coco, the Wendigo (caution — sacred), the Jersey Devil, Pecos Bill (tall-tale crossover). |
| American Tall Tales | `tall-tales/` | Paul Bunyan, John Henry, Pecos Bill, Johnny Appleseed, Calamity Jane (caution — historical person). |
| Cryptids | `cryptids/` | Bigfoot/Sasquatch, the Loch Ness Monster, the Chupacabra, Mothman, the Jackalope, the Thunderbird, the Kraken (folkloric), creepypasta warning entry. |

---
*Part of the Polymath Source Material Bible — Section 04 Folklore. Defers to [[../01-Legal-Guidelines/README|Section 01 Legal Guidelines]]. Not legal advice.*
