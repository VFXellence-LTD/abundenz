---
type: index
title: Source Material Bible — Master Entry Index
created: 2026-05-31
---

# Source Material Bible — Master Entry Index

Generated 2026-05-31. This is the master catalogue of every **entry** file in the Source Material Bible (infrastructure files — README, `_template`, `_VERIFICATION` — are counted per section but excluded from the entry tables). Entries are grouped by section folder; each row carries the frontmatter fields most useful for retrieval. **For RAG / Dataview:** the tables below are valid Obsidian Markdown tables keyed on the same `id` / `type` / `pd_status` / `risk_level` fields that live in each file's YAML frontmatter, so a Dataview `TABLE` query (`FROM "shared/source-material-bible"`) or a vector-store ingest can reproduce or join against this index directly. Filter on `risk_level: safe` + `pd_status: public-domain` for production-cleared material; `19-Trend-Dictionary` additionally exposes `ship_decision` (GO / HOLD / NO). File paths are vault-relative.

## 01-Legal-Guidelines

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| legal-copyright-trademark-likeness | Copyright vs Trademark vs Right of Publicity — Three Independent Regimes | legal-doc | na | safe | `01-Legal-Guidelines/copyright-vs-trademark-vs-likeness.md` |
| legal-decision-tree | Decision Tree — Safe / Caution / Avoid Verdict Flow | legal-doc | na | safe | `01-Legal-Guidelines/decision-tree.md` |
| legal-do-not-use | Do Not Use — Hard No / Actively Dangerous Source Material | legal-doc | restricted | avoid | `01-Legal-Guidelines/do-not-use.md` |
| legal-pd-source-vs-modern-adaptation | PD Source vs Modern Adaptation — SAFE vs RESTRICTED Side-by-Side | legal-doc | na | safe | `01-Legal-Guidelines/pd-source-vs-modern-adaptation.md` |
| legal-safe-to-use | Safe to Use — Genuinely Free Source Material | legal-doc | public-domain | safe | `01-Legal-Guidelines/safe-to-use.md` |
| legal-us-public-domain-cutoff | US Public Domain Cutoff — Exact Mechanics (2026) | legal-doc | na | safe | `01-Legal-Guidelines/us-public-domain-cutoff.md` |
| legal-use-with-caution | Use With Caution — Conditional & Context-Dependent Source Material | legal-doc | caution | caution | `01-Legal-Guidelines/use-with-caution.md` |

**01-Legal-Guidelines total: 7 entries.**

## 02-Public-Domain-Library

_Section infrastructure: 1 README, 1 _template, 1 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| pd-lit-a-christmas-carol | A Christmas Carol | source-work | public-domain | safe | `02-Public-Domain-Library/a-christmas-carol.md` |
| pd-lit-aesops-fables | Aesop's Fables | source-work | public-domain | safe | `02-Public-Domain-Library/aesops-fables.md` |
| pd-lit-alice-in-wonderland | Alice's Adventures in Wonderland | source-work | public-domain | caution | `02-Public-Domain-Library/alice-in-wonderland.md` |
| pd-lit-dracula | Dracula | source-work | public-domain | caution | `02-Public-Domain-Library/dracula.md` |
| pd-lit-frankenstein | Frankenstein; or, The Modern Prometheus | source-work | public-domain | caution | `02-Public-Domain-Library/frankenstein.md` |
| pd-myth-greek-mythology | Greek Mythology | source-work | caution | caution | `02-Public-Domain-Library/greek-mythology.md` |
| pd-lit-grimms-fairy-tales | Grimms' Fairy Tales (Kinder- und Hausmärchen) | source-work | public-domain | caution | `02-Public-Domain-Library/grimms-fairy-tales.md` |
| pd-lit-moby-dick | Moby-Dick; or, The Whale | source-work | public-domain | safe | `02-Public-Domain-Library/moby-dick.md` |
| pd-myth-norse-mythology | Norse Mythology (Eddas & Sagas) | source-work | caution | caution | `02-Public-Domain-Library/norse-mythology.md` |
| pd-lit-peter-pan | Peter Pan (Peter and Wendy) | source-work | caution | caution | `02-Public-Domain-Library/peter-pan.md` |
| pd-lit-pride-and-prejudice | Pride and Prejudice | source-work | public-domain | safe | `02-Public-Domain-Library/pride-and-prejudice.md` |
| pd-lit-shakespeare-works | The Works of William Shakespeare | source-work | caution | caution | `02-Public-Domain-Library/shakespeare-works.md` |
| pd-lit-sherlock-holmes-early-canon | Sherlock Holmes (Early Canon — through 1927 stories) | source-work | caution | caution | `02-Public-Domain-Library/sherlock-holmes-early-canon.md` |
| pd-lit-the-great-gatsby | The Great Gatsby | source-work | public-domain | safe | `02-Public-Domain-Library/the-great-gatsby.md` |
| pd-art-the-great-wave | The Great Wave off Kanagawa | source-work | public-domain | caution | `02-Public-Domain-Library/the-great-wave.md` |
| pd-lit-the-iliad | The Iliad | source-work | caution | caution | `02-Public-Domain-Library/the-iliad.md` |
| pd-music-the-nutcracker | The Nutcracker (ballet score & story) | source-work | caution | caution | `02-Public-Domain-Library/the-nutcracker.md` |
| pd-lit-the-odyssey | The Odyssey | source-work | caution | caution | `02-Public-Domain-Library/the-odyssey.md` |
| pd-poem-the-raven | The Raven | source-work | public-domain | safe | `02-Public-Domain-Library/the-raven.md` |
| pd-lit-wizard-of-oz | The Wonderful Wizard of Oz | source-work | public-domain | caution | `02-Public-Domain-Library/wizard-of-oz.md` |

**02-Public-Domain-Library total: 20 entries.**

## 03-Mythology

_Section infrastructure: 5 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| myth-egyptian-ankh | Ankh (the Key of Life) | symbol | public-domain | caution | `03-Mythology/egyptian/ankh.md` |
| myth-egyptian-anubis | Anubis (Anpu) | character | public-domain | safe | `03-Mythology/egyptian/anubis.md` |
| myth-egyptian-bastet | Bastet (Bast) | character | public-domain | safe | `03-Mythology/egyptian/bastet.md` |
| myth-egyptian-bennu | Bennu (the Egyptian Phoenix) | creature | public-domain | safe | `03-Mythology/egyptian/bennu.md` |
| myth-egyptian-eye-of-horus | Eye of Horus (Wedjat) | symbol | public-domain | caution | `03-Mythology/egyptian/eye-of-horus.md` |
| myth-egyptian-horus | Horus (Heru) | character | public-domain | safe | `03-Mythology/egyptian/horus.md` |
| myth-egyptian-isis | Isis (Aset) | character | public-domain | caution | `03-Mythology/egyptian/isis.md` |
| myth-egyptian-osiris | Osiris (Wesir) | character | public-domain | safe | `03-Mythology/egyptian/osiris.md` |
| myth-egyptian-ra | Ra (Re) | character | public-domain | safe | `03-Mythology/egyptian/ra.md` |
| myth-egyptian-scarab | Scarab (Khepri) | symbol | public-domain | safe | `03-Mythology/egyptian/scarab.md` |
| myth-egyptian-sekhmet | Sekhmet | character | public-domain | safe | `03-Mythology/egyptian/sekhmet.md` |
| myth-egyptian-set | Set (Seth) | character | public-domain | safe | `03-Mythology/egyptian/set.md` |
| myth-egyptian-sphinx | Sphinx (Egyptian) | creature | public-domain | safe | `03-Mythology/egyptian/sphinx-egyptian.md` |
| myth-egyptian-thoth | Thoth (Djehuty) | character | public-domain | safe | `03-Mythology/egyptian/thoth.md` |
| myth-greek-achilles | Achilles | character | public-domain | safe | `03-Mythology/greek-roman/achilles.md` |
| myth-greek-aphrodite | Aphrodite (Venus) | character | public-domain | safe | `03-Mythology/greek-roman/aphrodite.md` |
| myth-greek-apollo | Apollo | character | public-domain | safe | `03-Mythology/greek-roman/apollo.md` |
| myth-greek-ares | Ares (Mars) | character | public-domain | safe | `03-Mythology/greek-roman/ares.md` |
| myth-greek-artemis | Artemis (Diana) | character | public-domain | safe | `03-Mythology/greek-roman/artemis.md` |
| myth-greek-athena | Athena (Minerva) | character | public-domain | safe | `03-Mythology/greek-roman/athena.md` |
| myth-greek-caduceus | Caduceus | symbol | public-domain | caution | `03-Mythology/greek-roman/caduceus.md` |
| myth-greek-centaur | Centaur | creature | public-domain | safe | `03-Mythology/greek-roman/centaur.md` |
| myth-greek-cerberus | Cerberus | creature | public-domain | safe | `03-Mythology/greek-roman/cerberus.md` |
| myth-greek-chimera | Chimera | creature | public-domain | safe | `03-Mythology/greek-roman/chimera.md` |
| myth-greek-demeter | Demeter (Ceres) | character | public-domain | safe | `03-Mythology/greek-roman/demeter.md` |
| myth-greek-dionysus | Dionysus (Bacchus) | character | public-domain | safe | `03-Mythology/greek-roman/dionysus.md` |
| myth-greek-hades | Hades (Pluto) | character | public-domain | safe | `03-Mythology/greek-roman/hades.md` |
| myth-greek-hephaestus | Hephaestus (Vulcan) | character | public-domain | safe | `03-Mythology/greek-roman/hephaestus.md` |
| myth-greek-hera | Hera (Juno) | character | public-domain | safe | `03-Mythology/greek-roman/hera.md` |
| myth-greek-heracles | Heracles (Hercules) | character | public-domain | safe | `03-Mythology/greek-roman/heracles.md` |
| myth-greek-hermes | Hermes (Mercury) | character | public-domain | safe | `03-Mythology/greek-roman/hermes.md` |
| myth-greek-hydra | Lernaean Hydra | creature | public-domain | safe | `03-Mythology/greek-roman/hydra.md` |
| myth-greek-laurel-wreath | Laurel Wreath | symbol | public-domain | caution | `03-Mythology/greek-roman/laurel-wreath.md` |
| myth-greek-medusa | Medusa | creature | public-domain | safe | `03-Mythology/greek-roman/medusa.md` |
| myth-greek-minotaur | Minotaur | creature | public-domain | safe | `03-Mythology/greek-roman/minotaur.md` |
| myth-greek-odysseus | Odysseus (Ulysses) | character | public-domain | safe | `03-Mythology/greek-roman/odysseus.md` |
| myth-greek-olympian-symbols | Olympian Symbols (Quick-Reference Set) | symbol | public-domain | safe | `03-Mythology/greek-roman/olympian-symbols.md` |
| myth-greek-pegasus | Pegasus | creature | public-domain | safe | `03-Mythology/greek-roman/pegasus.md` |
| myth-greek-persephone | Persephone (Proserpina) | character | public-domain | safe | `03-Mythology/greek-roman/persephone.md` |
| myth-greek-perseus | Perseus | character | public-domain | safe | `03-Mythology/greek-roman/perseus.md` |
| myth-greek-phoenix | Phoenix | creature | public-domain | safe | `03-Mythology/greek-roman/phoenix.md` |
| myth-greek-poseidon | Poseidon (Neptune) | character | public-domain | safe | `03-Mythology/greek-roman/poseidon.md` |
| myth-greek-sphinx | Sphinx (Greek) | creature | public-domain | safe | `03-Mythology/greek-roman/sphinx.md` |
| myth-greek-theseus | Theseus | character | public-domain | safe | `03-Mythology/greek-roman/theseus.md` |
| myth-greek-zeus | Zeus (Jupiter) | character | public-domain | safe | `03-Mythology/greek-roman/zeus.md` |
| myth-mesopotamian-enki | Enki (Ea) | character | public-domain | safe | `03-Mythology/mesopotamian/enki.md` |
| myth-mesopotamian-gilgamesh | Gilgamesh | character | public-domain | safe | `03-Mythology/mesopotamian/gilgamesh.md` |
| myth-mesopotamian-inanna | Inanna (Ishtar) | character | public-domain | safe | `03-Mythology/mesopotamian/inanna.md` |
| myth-mesopotamian-marduk | Marduk | character | public-domain | safe | `03-Mythology/mesopotamian/marduk.md` |
| myth-mesopotamian-tiamat | Tiamat | creature | public-domain | caution | `03-Mythology/mesopotamian/tiamat.md` |
| myth-norse-baldr | Baldr (Balder) | character | public-domain | safe | `03-Mythology/norse/baldr.md` |
| myth-norse-fenrir | Fenrir | creature | public-domain | safe | `03-Mythology/norse/fenrir.md` |
| myth-norse-freya | Freya (Freyja) | character | public-domain | caution | `03-Mythology/norse/freya.md` |
| myth-norse-freyr | Freyr (Frey) | character | public-domain | safe | `03-Mythology/norse/freyr.md` |
| myth-norse-frigg | Frigg | character | public-domain | safe | `03-Mythology/norse/frigg.md` |
| myth-norse-heimdall | Heimdall | character | public-domain | safe | `03-Mythology/norse/heimdall.md` |
| myth-norse-jormungandr | Jörmungandr (the World Serpent) | creature | public-domain | safe | `03-Mythology/norse/jormungandr.md` |
| myth-norse-loki | Loki | character | public-domain | caution | `03-Mythology/norse/loki.md` |
| myth-norse-mjolnir | Mjölnir (Thor's Hammer) | symbol | public-domain | caution | `03-Mythology/norse/mjolnir.md` |
| myth-norse-runes | Norse Runes (the Elder Futhark) | symbol | public-domain | caution | `03-Mythology/norse/norse-runes.md` |
| myth-norse-odin | Odin | character | public-domain | caution | `03-Mythology/norse/odin.md` |
| myth-norse-ragnarok | Ragnarök (the Twilight of the Gods) | source-work | public-domain | safe | `03-Mythology/norse/ragnarok.md` |
| myth-norse-sleipnir | Sleipnir | creature | public-domain | safe | `03-Mythology/norse/sleipnir.md` |
| myth-norse-thor | Thor | character | public-domain | caution | `03-Mythology/norse/thor.md` |
| myth-norse-tyr | Tyr (Týr) | character | public-domain | caution | `03-Mythology/norse/tyr.md` |
| myth-norse-valkyries | Valkyries | character | public-domain | safe | `03-Mythology/norse/valkyries.md` |
| myth-norse-yggdrasil | Yggdrasil (the World Tree) | symbol | public-domain | safe | `03-Mythology/norse/yggdrasil.md` |

**03-Mythology total: 67 entries.**

## 04-Folklore

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| folk-british-king-arthur | King Arthur | character | public-domain | caution | `04-Folklore/british-isles/king-arthur.md` |
| folk-british-merlin | Merlin | character | public-domain | caution | `04-Folklore/british-isles/merlin.md` |
| folk-british-morgan-le-fay | Morgan le Fay | character | public-domain | caution | `04-Folklore/british-isles/morgan-le-fay.md` |
| folk-british-robin-hood | Robin Hood | character | public-domain | caution | `04-Folklore/british-isles/robin-hood.md` |
| folk-british-the-lady-of-the-lake | The Lady of the Lake | character | public-domain | safe | `04-Folklore/british-isles/the-lady-of-the-lake.md` |
| folk-fairytale-beauty-and-the-beast | Beauty and the Beast (ATU 425C) | source-work | public-domain | caution | `04-Folklore/fairy-tale-motifs/beauty-and-the-beast.md` |
| folk-fairytale-bluebeard | Bluebeard (ATU 312) | source-work | public-domain | safe | `04-Folklore/fairy-tale-motifs/bluebeard.md` |
| folk-fairytale-cinderella | Cinderella (the Cinderella tale type, ATU 510A) | source-work | public-domain | caution | `04-Folklore/fairy-tale-motifs/cinderella.md` |
| folk-fairytale-hansel-and-gretel | Hansel and Gretel (ATU 327A) | source-work | public-domain | safe | `04-Folklore/fairy-tale-motifs/hansel-and-gretel.md` |
| folk-fairytale-jack-and-the-beanstalk | Jack and the Beanstalk (ATU 328) | source-work | public-domain | safe | `04-Folklore/fairy-tale-motifs/jack-and-the-beanstalk.md` |
| folk-fairytale-little-red-riding-hood | Little Red Riding Hood (ATU 333) | source-work | public-domain | caution | `04-Folklore/fairy-tale-motifs/little-red-riding-hood.md` |
| folk-fairytale-puss-in-boots | Puss in Boots (ATU 545B) | source-work | public-domain | caution | `04-Folklore/fairy-tale-motifs/puss-in-boots.md` |
| folk-fairytale-rapunzel | Rapunzel (ATU 310) | source-work | public-domain | caution | `04-Folklore/fairy-tale-motifs/rapunzel.md` |
| folk-fairytale-rumpelstiltskin | Rumpelstiltskin (ATU 500) | source-work | public-domain | safe | `04-Folklore/fairy-tale-motifs/rumpelstiltskin.md` |
| folk-fairytale-sleeping-beauty | Sleeping Beauty (ATU 410) | source-work | public-domain | caution | `04-Folklore/fairy-tale-motifs/sleeping-beauty.md` |
| folk-fairytale-snow-white | Snow White (ATU 709) | source-work | public-domain | caution | `04-Folklore/fairy-tale-motifs/snow-white.md` |
| folk-fairytale-the-frog-prince | The Frog Prince (ATU 440) | source-work | public-domain | caution | `04-Folklore/fairy-tale-motifs/the-frog-prince.md` |
| folk-fairytale-the-pied-piper | The Pied Piper of Hamelin | source-work | public-domain | safe | `04-Folklore/fairy-tale-motifs/the-pied-piper.md` |

**04-Folklore total: 18 entries.**

## 05-Literature

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| pd-lit-aesops-fables | Aesop's Fables | source-work | public-domain | safe | `05-Literature/ancient-classical/aesops-fables.md` |
| pd-lit-the-iliad | The Iliad | source-work | public-domain | safe | `05-Literature/ancient-classical/homer-the-iliad.md` |
| pd-lit-the-odyssey | The Odyssey | source-work | public-domain | safe | `05-Literature/ancient-classical/homer-the-odyssey.md` |
| pd-lit-meditations | Meditations | source-work | public-domain | safe | `05-Literature/ancient-classical/marcus-aurelius-meditations.md` |
| pd-lit-metamorphoses | Metamorphoses | source-work | public-domain | safe | `05-Literature/ancient-classical/ovid-metamorphoses.md` |
| pd-lit-oedipus-rex | Oedipus Rex (Oedipus the King) | source-work | public-domain | safe | `05-Literature/ancient-classical/sophocles-oedipus-rex.md` |
| pd-lit-art-of-war | The Art of War | source-work | public-domain | safe | `05-Literature/ancient-classical/sun-tzu-the-art-of-war.md` |
| pd-lit-the-aeneid | The Aeneid | source-work | public-domain | safe | `05-Literature/ancient-classical/virgil-the-aeneid.md` |
| pd-lit-beowulf | Beowulf | source-work | public-domain | safe | `05-Literature/medieval/beowulf.md` |
| pd-lit-canterbury-tales | The Canterbury Tales | source-work | public-domain | safe | `05-Literature/medieval/chaucer-canterbury-tales.md` |
| pd-lit-divine-comedy | The Divine Comedy | source-work | public-domain | safe | `05-Literature/medieval/dante-the-divine-comedy.md` |
| pd-lit-trap-peter-pan-gosh | Trap Dossier — Peter Pan & the GOSH Perpetual Royalty | legal-doc | caution | caution | `05-Literature/traps/peter-pan-gosh-royalty.md` |
| pd-lit-trap-sherlock-holmes | Trap Dossier — Sherlock Holmes & the Conan Doyle Estate | legal-doc | public-domain | caution | `05-Literature/traps/sherlock-holmes-estate.md` |
| pd-lit-trap-tarzan-john-carter | Trap Dossier — Tarzan & John Carter: PD Text, Live Trademarks | legal-doc | caution | caution | `05-Literature/traps/tarzan-john-carter-trademarks.md` |
| pd-lit-trap-translations-editions | Trap Dossier — Translations, Critical Editions & Annotations | legal-doc | caution | caution | `05-Literature/traps/translations-and-editions.md` |
| pd-lit-trap-winnie-the-pooh | Trap Dossier — Winnie-the-Pooh: 1926 Book vs. Disney Version | legal-doc | caution | caution | `05-Literature/traps/winnie-the-pooh-vs-disney.md` |

**05-Literature total: 16 entries.**

## 06-Historical-Art

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| art-baroque | Baroque Art | art-movement | public-domain | safe | `06-Historical-Art/baroque.md` |
| art-byzantine | Byzantine Art | art-movement | public-domain | safe | `06-Historical-Art/byzantine.md` |
| art-egyptian | Ancient Egyptian Art | art-movement | public-domain | safe | `06-Historical-Art/egyptian.md` |
| art-gothic | Gothic Art & Architecture | art-movement | public-domain | safe | `06-Historical-Art/gothic.md` |
| art-greek-roman | Greek & Roman (Classical) Art | art-movement | public-domain | safe | `06-Historical-Art/greek-roman.md` |
| art-impressionism | Impressionism | art-movement | public-domain | safe | `06-Historical-Art/impressionism.md` |
| art-medieval-illuminated | Medieval & Illuminated Manuscript Art | art-movement | public-domain | safe | `06-Historical-Art/medieval-illuminated.md` |
| art-neoclassical | Neoclassical Art | art-movement | public-domain | safe | `06-Historical-Art/neoclassical.md` |
| art-post-impressionism | Post-Impressionism | art-movement | public-domain | safe | `06-Historical-Art/post-impressionism.md` |
| art-prehistoric | Prehistoric Art (Cave Painting & Petroglyphs) | art-movement | public-domain | safe | `06-Historical-Art/prehistoric.md` |
| art-realism | Realism | art-movement | public-domain | safe | `06-Historical-Art/realism.md` |
| art-renaissance | Renaissance Art | art-movement | public-domain | safe | `06-Historical-Art/renaissance.md` |
| art-rococo | Rococo Art | art-movement | public-domain | safe | `06-Historical-Art/rococo.md` |
| art-romanticism | Romanticism | art-movement | public-domain | safe | `06-Historical-Art/romanticism.md` |
| art-symbolism | Symbolism | art-movement | caution | caution | `06-Historical-Art/symbolism.md` |

**06-Historical-Art total: 15 entries.**

## 07-Historical-Design

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| design-system-acanthus | Acanthus Ornament | design-system | public-domain | safe | `07-Historical-Design/ornamentation/acanthus.md` |
| design-system-arabesque | Arabesque (Islimi) Ornament | design-system | public-domain | caution | `07-Historical-Design/ornamentation/arabesque.md` |
| design-system-damask | Damask Pattern | design-system | public-domain | safe | `07-Historical-Design/ornamentation/damask.md` |
| design-system-egg-and-dart | Egg-and-Dart (Egg-and-Tongue) | design-system | public-domain | safe | `07-Historical-Design/ornamentation/egg-and-dart.md` |
| design-system-fleur-de-lis | Fleur-de-lis | design-system | public-domain | caution | `07-Historical-Design/ornamentation/fleur-de-lis.md` |
| design-system-greek-key-meander | Greek Key / Meander | design-system | public-domain | caution | `07-Historical-Design/ornamentation/greek-key-meander.md` |
| design-system-grotesque-grotteschi | Grotesque / Grotteschi | design-system | public-domain | safe | `07-Historical-Design/ornamentation/grotesque-grotteschi.md` |
| design-system-guilloche | Guilloché | design-system | public-domain | caution | `07-Historical-Design/ornamentation/guilloche.md` |
| design-system-paisley | Paisley (Boteh / Buta) | design-system | public-domain | caution | `07-Historical-Design/ornamentation/paisley.md` |
| design-system-palmette-anthemion | Palmette & Anthemion | design-system | public-domain | safe | `07-Historical-Design/ornamentation/palmette-anthemion.md` |
| design-system-rinceau-scrollwork | Rinceau & Scrollwork | design-system | public-domain | safe | `07-Historical-Design/ornamentation/rinceau-scrollwork.md` |
| design-system-rocaille-rococo | Rocaille (Rococo Shell Ornament) | design-system | public-domain | safe | `07-Historical-Design/ornamentation/rocaille-rococo.md` |
| design-system-strapwork | Strapwork | design-system | public-domain | safe | `07-Historical-Design/ornamentation/strapwork.md` |
| design-system-aztec-maya | Aztec & Maya (Mesoamerican) Design | design-system | caution | caution | `07-Historical-Design/pattern-systems/aztec-maya.md` |
| design-system-celtic-knotwork | Celtic Knotwork (Insular Interlace) | design-system | public-domain | caution | `07-Historical-Design/pattern-systems/celtic-knotwork.md` |
| design-system-islamic-geometric | Islamic Geometric Pattern (Girih) | design-system | public-domain | caution | `07-Historical-Design/pattern-systems/islamic-geometric.md` |
| design-system-victorian-pattern | Victorian Pattern & Ornament | design-system | public-domain | caution | `07-Historical-Design/pattern-systems/victorian-pattern.md` |
| design-system-william-morris-textiles | William Morris Textiles (Arts & Crafts) | design-system | public-domain | caution | `07-Historical-Design/pattern-systems/william-morris-textiles.md` |

**07-Historical-Design total: 18 entries.**

## 08-Color-Palettes

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| palette-abyssz-oceanic | Abyssz Oceanic | color-palette | na | safe | `08-Color-Palettes/abyssz-oceanic.md` |
| palette-bloomz-spring-pastel | Bloomz Spring Pastel | color-palette | na | safe | `08-Color-Palettes/bloomz-spring-pastel.md` |
| palette-crimzon-noir | Crimzon Noir | color-palette | na | safe | `08-Color-Palettes/crimzon-noir.md` |
| palette-dreamz-pastel | Dreamz Pastel Nursery | color-palette | na | safe | `08-Color-Palettes/dreamz-pastel.md` |
| palette-frostz-winter | Frostz Winter | color-palette | na | safe | `08-Color-Palettes/frostz-winter.md` |
| palette-gatzby-deco | Gatzby Deco | color-palette | na | caution | `08-Color-Palettes/gatzby-deco.md` |
| palette-monocrome-ink | Monocrome Ink | color-palette | na | safe | `08-Color-Palettes/monocrome-ink.md` |
| palette-pharaohz-gold-lapis | Pharaohz Gold & Lapis | color-palette | na | safe | `08-Color-Palettes/pharaohz-gold-lapis.md` |
| palette-regaliz-jewel | Regaliz Jewel Tones | color-palette | na | safe | `08-Color-Palettes/regaliz-jewel.md` |
| palette-sepiaz-vintage | Sepiaz Vintage Muted | color-palette | na | safe | `08-Color-Palettes/sepiaz-vintage.md` |
| palette-solaraz-sunset | Solaraz Sunset | color-palette | na | safe | `08-Color-Palettes/solaraz-sunset.md` |
| palette-streetwize-contrast | Streetwize High-Contrast | color-palette | na | safe | `08-Color-Palettes/streetwize-contrast.md` |
| palette-terrafolk-earthen | Terrafolk Earthen | color-palette | na | safe | `08-Color-Palettes/terrafolk-earthen.md` |
| palette-valkyrz-cold-steel | Valkyrz Cold Steel | color-palette | na | safe | `08-Color-Palettes/valkyrz-cold-steel.md` |
| palette-verdanz-botanical | Verdanz Botanical | color-palette | na | safe | `08-Color-Palettes/verdanz-botanical.md` |
| palette-voltz-retro-neon | Voltz Retro Neon | color-palette | na | safe | `08-Color-Palettes/voltz-retro-neon.md` |

**08-Color-Palettes total: 16 entries.**

## 09-Symbols

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| sym-alchemical-gold | Gold / Sol (Alchemical Metal) | symbol | public-domain | safe | `09-Symbols/alchemical/alchemy-gold.md` |
| sym-alchemical-mercury | Mercury (Alchemical / Planetary) | symbol | public-domain | safe | `09-Symbols/alchemical/alchemy-mercury.md` |
| sym-alchemical-salt | Salt (Alchemical) | symbol | public-domain | safe | `09-Symbols/alchemical/alchemy-salt.md` |
| sym-alchemical-silver | Silver / Luna (Alchemical Metal) | symbol | public-domain | safe | `09-Symbols/alchemical/alchemy-silver.md` |
| sym-alchemical-sulfur | Sulfur (Alchemical) | symbol | public-domain | safe | `09-Symbols/alchemical/alchemy-sulfur.md` |
| sym-alchemical-ouroboros | Ouroboros | symbol | public-domain | safe | `09-Symbols/alchemical/ouroboros.md` |
| sym-animal-bear | Bear (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/bear.md` |
| sym-animal-butterfly | Butterfly (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/butterfly.md` |
| sym-animal-dove | Dove (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/dove.md` |
| sym-animal-dragon | Dragon (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/dragon.md` |
| sym-animal-koi | Koi Fish (Totem) | archetype | public-domain | caution | `09-Symbols/animal-totems/koi.md` |
| sym-animal-lion | Lion (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/lion.md` |
| sym-animal-owl | Owl (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/owl.md` |
| sym-animal-phoenix | Phoenix (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/phoenix.md` |
| sym-animal-ram | Ram (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/ram.md` |
| sym-animal-raven | Raven (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/raven.md` |
| sym-animal-serpent | Serpent / Snake (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/serpent.md` |
| sym-animal-stag | Stag / Deer (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/stag.md` |
| sym-animal-wolf | Wolf (Totem) | archetype | public-domain | safe | `09-Symbols/animal-totems/wolf.md` |
| sym-astro-aquarius | Aquarius (The Water-Bearer) | symbol | public-domain | safe | `09-Symbols/astrological/aquarius.md` |
| sym-astro-aries | Aries (The Ram) | symbol | public-domain | safe | `09-Symbols/astrological/aries.md` |
| sym-astro-cancer | Cancer (The Crab) | symbol | public-domain | safe | `09-Symbols/astrological/cancer.md` |
| sym-astro-capricorn | Capricorn (The Sea-Goat) | symbol | public-domain | safe | `09-Symbols/astrological/capricorn.md` |
| sym-astro-gemini | Gemini (The Twins) | symbol | public-domain | safe | `09-Symbols/astrological/gemini.md` |
| sym-astro-leo | Leo (The Lion) | symbol | public-domain | safe | `09-Symbols/astrological/leo.md` |
| sym-astro-libra | Libra (The Scales) | symbol | public-domain | safe | `09-Symbols/astrological/libra.md` |
| sym-astro-pisces | Pisces (The Fish) | symbol | public-domain | safe | `09-Symbols/astrological/pisces.md` |
| sym-astro-sagittarius | Sagittarius (The Archer) | symbol | public-domain | safe | `09-Symbols/astrological/sagittarius.md` |
| sym-astro-scorpio | Scorpio (The Scorpion) | symbol | public-domain | safe | `09-Symbols/astrological/scorpio.md` |
| sym-astro-taurus | Taurus (The Bull) | symbol | public-domain | safe | `09-Symbols/astrological/taurus.md` |
| sym-astro-virgo | Virgo (The Maiden) | symbol | public-domain | safe | `09-Symbols/astrological/virgo.md` |
| sym-botanical-feather | Feather | symbol | public-domain | caution | `09-Symbols/botanical/feather.md` |
| sym-botanical-laurel-wreath | Laurel Wreath | symbol | public-domain | caution | `09-Symbols/botanical/laurel-wreath.md` |
| sym-botanical-leaf | Leaf | symbol | public-domain | safe | `09-Symbols/botanical/leaf.md` |
| sym-botanical-lily | Lily | symbol | public-domain | safe | `09-Symbols/botanical/lily.md` |
| sym-botanical-lotus | Lotus | symbol | public-domain | caution | `09-Symbols/botanical/lotus.md` |
| sym-botanical-oak-leaf | Oak Leaf & Acorn | symbol | public-domain | safe | `09-Symbols/botanical/oak-leaf.md` |
| sym-botanical-olive-branch | Olive Branch | symbol | public-domain | caution | `09-Symbols/botanical/olive-branch.md` |
| sym-botanical-rose | Rose | symbol | public-domain | safe | `09-Symbols/botanical/rose.md` |
| sym-botanical-wheat | Wheat Sheaf | symbol | public-domain | safe | `09-Symbols/botanical/wheat.md` |
| sym-celestial-crescent-moon | Crescent Moon | symbol | public-domain | caution | `09-Symbols/celestial/crescent-moon.md` |
| sym-celestial-eight-pointed-star | Eight-Pointed Star | symbol | public-domain | caution | `09-Symbols/celestial/eight-pointed-star.md` |
| sym-celestial-shooting-star | Shooting Star / Comet | symbol | public-domain | safe | `09-Symbols/celestial/shooting-star.md` |
| sym-celestial-sun | Sun | symbol | public-domain | safe | `09-Symbols/celestial/sun.md` |
| sym-elemental-air | Air (Classical Element) | symbol | public-domain | safe | `09-Symbols/elemental/air.md` |
| sym-elemental-earth | Earth (Classical Element) | symbol | public-domain | safe | `09-Symbols/elemental/earth.md` |
| sym-elemental-fire | Fire (Classical Element) | symbol | public-domain | safe | `09-Symbols/elemental/fire.md` |
| sym-elemental-spirit-aether | Spirit / Aether (Fifth Element) | symbol | public-domain | safe | `09-Symbols/elemental/spirit-aether.md` |
| sym-elemental-water | Water (Classical Element) | symbol | public-domain | safe | `09-Symbols/elemental/water.md` |
| sym-heraldic-chevron | Chevron (Heraldic Ordinary) | symbol | public-domain | safe | `09-Symbols/heraldic/chevron.md` |
| sym-heraldic-fleur-de-lis | Fleur-de-lis | symbol | public-domain | safe | `09-Symbols/heraldic/fleur-de-lis.md` |
| sym-heraldic-lion-rampant | Lion Rampant (Heraldic) | symbol | public-domain | safe | `09-Symbols/heraldic/lion-rampant.md` |
| sym-heraldic-scales | Scales of Justice | symbol | public-domain | safe | `09-Symbols/heraldic/scales.md` |
| sym-heraldic-shield | Shield (Escutcheon) | symbol | public-domain | safe | `09-Symbols/heraldic/shield.md` |
| sym-hiero-ankh | Ankh | symbol | public-domain | safe | `09-Symbols/hieroglyphs/ankh.md` |
| sym-hiero-djed | Djed Pillar | symbol | public-domain | safe | `09-Symbols/hieroglyphs/djed.md` |
| sym-hiero-eye-of-horus | Eye of Horus (Wedjat) | symbol | public-domain | safe | `09-Symbols/hieroglyphs/eye-of-horus.md` |
| sym-hiero-scarab | Scarab Beetle | symbol | public-domain | safe | `09-Symbols/hieroglyphs/scarab.md` |
| sym-hiero-was-scepter | Was Scepter | symbol | public-domain | safe | `09-Symbols/hieroglyphs/was-scepter.md` |
| sym-nautical-anchor | Anchor | symbol | public-domain | safe | `09-Symbols/nautical/anchor.md` |
| sym-nautical-caduceus | Caduceus & Rod of Asclepius | symbol | public-domain | safe | `09-Symbols/nautical/caduceus.md` |
| sym-nautical-compass-rose | Compass Rose | symbol | public-domain | safe | `09-Symbols/nautical/compass-rose.md` |
| sym-nautical-ships-wheel | Ship's Wheel (Helm) | symbol | public-domain | safe | `09-Symbols/nautical/ships-wheel.md` |
| sym-religious-cross | Christian Cross | symbol | public-domain | caution | `09-Symbols/religious/cross.md` |
| sym-religious-evil-eye-nazar | Evil Eye / Nazar | symbol | public-domain | caution | `09-Symbols/religious/evil-eye-nazar.md` |
| sym-religious-hamsa | Hamsa (Hand of Fatima / Hand of Miriam) | symbol | public-domain | caution | `09-Symbols/religious/hamsa.md` |
| sym-religious-ichthys | Ichthys (Jesus Fish) | symbol | public-domain | caution | `09-Symbols/religious/ichthys.md` |
| sym-religious-om | Om / Aum (ॐ) | symbol | public-domain | caution | `09-Symbols/religious/om.md` |
| sym-religious-peace-sign | Peace Sign (CND Symbol) | symbol | public-domain | safe | `09-Symbols/religious/peace-sign.md` |
| sym-religious-recycling-symbol | Recycling Symbol (Universal Recycling / Chasing Arrows) | symbol | public-domain | safe | `09-Symbols/religious/recycling-symbol.md` |
| sym-religious-yin-yang | Yin-Yang (Taijitu) | symbol | public-domain | caution | `09-Symbols/religious/yin-yang.md` |
| sym-rune-algiz | Algiz (Elder Futhark Rune) | symbol | public-domain | avoid | `09-Symbols/runes/algiz.md` |
| sym-rune-ansuz | Ansuz (Elder Futhark Rune) | symbol | public-domain | caution | `09-Symbols/runes/ansuz.md` |
| sym-rune-elder-futhark-overview | Elder Futhark — Overview & Full Alphabet | category | public-domain | caution | `09-Symbols/runes/elder-futhark-overview.md` |
| sym-rune-fehu | Fehu (Elder Futhark Rune) | symbol | public-domain | caution | `09-Symbols/runes/fehu.md` |
| sym-rune-raidho | Raidho (Elder Futhark Rune) | symbol | public-domain | caution | `09-Symbols/runes/raidho.md` |
| sym-rune-sowilo | Sowilo (Elder Futhark Rune) | symbol | public-domain | avoid | `09-Symbols/runes/sowilo.md` |
| sym-sacredgeo-flower-of-life | Flower of Life | symbol | public-domain | safe | `09-Symbols/sacred-geometry/flower-of-life.md` |
| sym-sacredgeo-mandala | Mandala | symbol | public-domain | caution | `09-Symbols/sacred-geometry/mandala.md` |
| sym-sacredgeo-metatrons-cube | Metatron's Cube | symbol | public-domain | safe | `09-Symbols/sacred-geometry/metatrons-cube.md` |
| sym-sacredgeo-pentagram | Pentagram | symbol | public-domain | caution | `09-Symbols/sacred-geometry/pentagram.md` |
| sym-sacredgeo-platonic-solids | Platonic Solids | symbol | public-domain | safe | `09-Symbols/sacred-geometry/platonic-solids.md` |
| sym-sacredgeo-seed-of-life | Seed of Life | symbol | public-domain | safe | `09-Symbols/sacred-geometry/seed-of-life.md` |
| sym-sacredgeo-sri-yantra | Sri Yantra | symbol | public-domain | caution | `09-Symbols/sacred-geometry/sri-yantra.md` |
| sym-sacredgeo-star-of-david | Star of David (Hexagram) | symbol | public-domain | caution | `09-Symbols/sacred-geometry/star-of-david.md` |
| sym-sacredgeo-vesica-piscis | Vesica Piscis | symbol | public-domain | safe | `09-Symbols/sacred-geometry/vesica-piscis.md` |

**09-Symbols total: 86 entries.**

## 10-Archetypes

_Section infrastructure: 1 README, 1 _template, 1 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| archetype-caregiver | The Caregiver | archetype | na | safe | `10-Archetypes/caregiver.md` |
| archetype-craftsman | The Craftsman | archetype | na | safe | `10-Archetypes/craftsman.md` |
| archetype-creator | The Creator | archetype | na | safe | `10-Archetypes/creator.md` |
| archetype-dreamer | The Dreamer | archetype | na | safe | `10-Archetypes/dreamer.md` |
| archetype-everyman | The Everyman | archetype | na | safe | `10-Archetypes/everyman.md` |
| archetype-explorer | The Explorer | archetype | na | safe | `10-Archetypes/explorer.md` |
| archetype-guardian | The Guardian | archetype | na | safe | `10-Archetypes/guardian.md` |
| archetype-hero | The Hero | archetype | na | safe | `10-Archetypes/hero.md` |
| archetype-innocent | The Innocent | archetype | na | safe | `10-Archetypes/innocent.md` |
| archetype-inventor | The Inventor | archetype | na | safe | `10-Archetypes/inventor.md` |
| archetype-jester | The Jester | archetype | na | safe | `10-Archetypes/jester.md` |
| archetype-lover | The Lover | archetype | na | safe | `10-Archetypes/lover.md` |
| archetype-magician | The Magician | archetype | na | safe | `10-Archetypes/magician.md` |
| archetype-merchant | The Merchant | archetype | na | safe | `10-Archetypes/merchant.md` |
| archetype-monarch | The Monarch | archetype | na | safe | `10-Archetypes/monarch.md` |
| archetype-oracle | The Oracle | archetype | na | safe | `10-Archetypes/oracle.md` |
| archetype-outlaw | The Outlaw | archetype | na | safe | `10-Archetypes/outlaw.md` |
| archetype-ruler | The Ruler | archetype | na | safe | `10-Archetypes/ruler.md` |
| archetype-sage | The Sage | archetype | na | safe | `10-Archetypes/sage.md` |
| archetype-teacher | The Teacher | archetype | na | safe | `10-Archetypes/teacher.md` |
| archetype-trickster | The Trickster | archetype | na | safe | `10-Archetypes/trickster.md` |
| archetype-warrior | The Warrior | archetype | na | safe | `10-Archetypes/warrior.md` |

**10-Archetypes total: 22 entries.**

## 11-characters

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| pd-char-alice-wonderland | Alice / Mad Hatter / Cheshire Cat (Wonderland characters) | character | public-domain | caution | `11-characters/alice-wonderland.md` |
| pd-char-arthurian-characters | Arthurian Characters (King Arthur, Merlin, Lancelot, Guinevere) | character | public-domain | safe | `11-characters/arthurian-characters.md` |
| pd-char-captain-nemo | Captain Nemo | character | public-domain | safe | `11-characters/captain-nemo.md` |
| pd-char-cinderella | Cinderella | character | public-domain | caution | `11-characters/cinderella.md` |
| pd-char-dracula | Count Dracula | character | public-domain | caution | `11-characters/dracula.md` |
| pd-char-frankensteins-monster | Frankenstein's Monster | character | public-domain | caution | `11-characters/frankensteins-monster.md` |
| pd-char-jekyll-and-hyde | Dr Jekyll & Mr Hyde | character | public-domain | safe | `11-characters/jekyll-and-hyde.md` |
| pd-char-long-john-silver | Long John Silver | character | public-domain | safe | `11-characters/long-john-silver.md` |
| pd-char-oz-characters | Oz Characters (Dorothy, Scarecrow, Tin Man, Cowardly Lion, etc.) | character | public-domain | avoid | `11-characters/oz-characters.md` |
| pd-char-peter-pan | Peter Pan | character | public-domain | caution | `11-characters/peter-pan.md` |
| pd-char-phileas-fogg | Phileas Fogg | character | public-domain | safe | `11-characters/phileas-fogg.md` |
| pd-char-pinocchio | Pinocchio | character | public-domain | caution | `11-characters/pinocchio.md` |
| pd-char-robin-hood | Robin Hood | character | public-domain | safe | `11-characters/robin-hood.md` |
| pd-char-sherlock-holmes | Sherlock Holmes | character | public-domain | caution | `11-characters/sherlock-holmes.md` |
| pd-char-snow-white | Snow White | character | public-domain | caution | `11-characters/snow-white.md` |
| pd-char-tinker-bell | Tinker Bell | character | public-domain | caution | `11-characters/tinker-bell.md` |

**11-characters total: 16 entries.**

## 12-Quotes

_Section infrastructure: 1 README, 1 _template, 1 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| quote-courage-collection | Courage Quotes — Verified Public-Domain Collection | quote | public-domain | safe | `12-Quotes/courage.md` |
| quote-creativity-collection | Creativity Quotes — Verified Public-Domain Collection | quote | public-domain | safe | `12-Quotes/creativity.md` |
| quote-humor-collection | Humor Quotes — Verified Public-Domain Collection | quote | public-domain | safe | `12-Quotes/humor.md` |
| quote-leadership-collection | Leadership Quotes — Verified Public-Domain Collection | quote | public-domain | safe | `12-Quotes/leadership.md` |
| quote-love-collection | Love Quotes — Verified Public-Domain Collection | quote | public-domain | safe | `12-Quotes/love.md` |
| quote-misattributed-avoid-list | Commonly-Misattributed Quotes — AVOID List | quote | caution | avoid | `12-Quotes/misattributed-avoid-list.md` |
| quote-nature-collection | Nature Quotes — Verified Public-Domain Collection | quote | public-domain | safe | `12-Quotes/nature.md` |
| quote-perseverance-collection | Perseverance Quotes — Verified Public-Domain Collection | quote | public-domain | safe | `12-Quotes/perseverance.md` |
| quote-stoicism-collection | Stoicism Quotes — Verified Public-Domain Collection | quote | public-domain | safe | `12-Quotes/stoicism.md` |
| quote-wisdom-collection | Wisdom Quotes — Verified Public-Domain Collection | quote | public-domain | safe | `12-Quotes/wisdom.md` |

**12-Quotes total: 10 entries.**

## 13-Visual-Motifs

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| motif-badges-and-crests | Badges & Crests | visual-motif | public-domain | caution | `13-Visual-Motifs/motifs/badges-and-crests.md` |
| motif-banners-and-ribbons | Banners & Ribbons | visual-motif | public-domain | safe | `13-Visual-Motifs/motifs/banners-and-ribbons.md` |
| motif-botanical-line-drawings | Botanical Line-Drawings | visual-motif | public-domain | caution | `13-Visual-Motifs/motifs/botanical-line-drawings.md` |
| motif-constellation-maps | Constellation Maps | visual-motif | public-domain | caution | `13-Visual-Motifs/motifs/constellation-maps.md` |
| motif-frames-and-borders | Frames & Borders | visual-motif | public-domain | safe | `13-Visual-Motifs/motifs/frames-and-borders.md` |
| motif-geometric-backdrops | Geometric Backdrops | visual-motif | public-domain | safe | `13-Visual-Motifs/motifs/geometric-backdrops.md` |
| motif-halftone-and-risograph-textures | Halftone & Risograph Textures | visual-motif | public-domain | safe | `13-Visual-Motifs/motifs/halftone-and-risograph-textures.md` |
| motif-laurels-and-wreaths | Laurels & Wreaths | visual-motif | public-domain | caution | `13-Visual-Motifs/motifs/laurels-and-wreaths.md` |
| motif-line-art-animals | Line-Art Animals | visual-motif | public-domain | caution | `13-Visual-Motifs/motifs/line-art-animals.md` |
| motif-mandalas | Mandalas | visual-motif | public-domain | caution | `13-Visual-Motifs/motifs/mandalas.md` |
| motif-retro-sunbursts | Retro Sunbursts | visual-motif | public-domain | caution | `13-Visual-Motifs/motifs/retro-sunbursts.md` |
| motif-tarot-card-framing | Tarot-Card Framing | visual-motif | caution | caution | `13-Visual-Motifs/motifs/tarot-card-framing.md` |
| motif-vintage-engraving-anatomical | Vintage-Engraving / Anatomical Style | visual-motif | public-domain | caution | `13-Visual-Motifs/motifs/vintage-engraving-anatomical.md` |
| motif-vintage-label-layouts | Vintage-Label Layouts | visual-motif | public-domain | caution | `13-Visual-Motifs/motifs/vintage-label-layouts.md` |

**13-Visual-Motifs total: 14 entries.**

## 14-Trending-Categories

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| cat-ancient-civilizations | Ancient Civilizations | category | na | safe | `14-Trending-Categories/ancient-civilizations.md` |
| cat-fantasy | Fantasy | category | na | caution | `14-Trending-Categories/fantasy.md` |
| cat-medieval | Medieval | category | na | safe | `14-Trending-Categories/medieval.md` |
| cat-musical-instruments | Musical Instruments | category | na | safe | `14-Trending-Categories/musical-instruments.md` |
| cat-mythology | Mythology | category | na | safe | `14-Trending-Categories/mythology.md` |
| cat-nature | Nature | category | na | safe | `14-Trending-Categories/nature.md` |
| cat-ocean-life | Ocean Life | category | na | safe | `14-Trending-Categories/ocean-life.md` |
| cat-playgrounds | Playgrounds | category | na | safe | `14-Trending-Categories/playgrounds.md` |
| cat-religion-spirituality | Religion & Spirituality | category | na | caution | `14-Trending-Categories/religion-spirituality.md` |
| cat-retro-technology | Retro Technology | category | na | safe | `14-Trending-Categories/retro-technology.md` |
| cat-space-exploration | Space Exploration | category | na | safe | `14-Trending-Categories/space-exploration.md` |
| cat-sports | Sports | category | na | caution | `14-Trending-Categories/sports.md` |
| cat-steampunk | Steampunk | category | na | safe | `14-Trending-Categories/steampunk.md` |
| cat-wildlife | Wildlife | category | na | safe | `14-Trending-Categories/wildlife.md` |

**14-Trending-Categories total: 14 entries.**

## 15-Remix-Frameworks

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| remix-ancient-egypt-x-space | Ancient Egypt × Space | remix-framework | public-domain | safe | `15-Remix-Frameworks/ancient-egypt-x-space.md` |
| remix-botanical-x-geometry | Botanical Illustration × Sacred Geometry | remix-framework | public-domain | safe | `15-Remix-Frameworks/botanical-x-geometry.md` |
| remix-medieval-knight-x-skateboarding | Medieval Knight × Skateboarding | remix-framework | public-domain | safe | `15-Remix-Frameworks/medieval-knight-x-skateboarding.md` |
| remix-norse-myth-x-cyberpunk | Norse Mythology × Cyberpunk | remix-framework | public-domain | safe | `15-Remix-Frameworks/norse-myth-x-cyberpunk.md` |
| remix-ocean-creatures-x-music | Ocean Creatures × Music | remix-framework | public-domain | safe | `15-Remix-Frameworks/ocean-creatures-x-music.md` |
| remix-playground-x-mythology | Playground × Mythology | remix-framework | public-domain | safe | `15-Remix-Frameworks/playground-x-mythology.md` |
| remix-engine | The Remix Engine — Universal Formula for Generating Any Remix | remix-framework | na | safe | `15-Remix-Frameworks/remix-engine.md` |
| remix-victorian-ornament-x-ai | Victorian Ornament × Artificial Intelligence | remix-framework | public-domain | safe | `15-Remix-Frameworks/victorian-ornament-x-ai.md` |

**15-Remix-Frameworks total: 8 entries.**

## 16-Prompt-Templates

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| prompt-shared-model-parameter-cheatsheet | Model Parameter Cheat-Sheet — Midjourney, SDXL, DALL·E 3, Flux | sop | na | safe | `16-Prompt-Templates/shared/model-parameter-cheatsheet.md` |
| prompt-shared-negative-prompt-library | Negative-Prompt Library — Quality Negatives + the IP-Safety Blocklist | sop | na | safe | `16-Prompt-Templates/shared/negative-prompt-library.md` |
| prompt-shared-slot-resolution-protocol | Slot-Resolution Protocol — How Templates Reference Bible Entries as Variables | sop | na | safe | `16-Prompt-Templates/shared/slot-resolution-protocol.md` |

**16-Prompt-Templates total: 3 entries.**

## 17-Design-Recipes

_Section infrastructure: 1 README, 1 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| recipe-alchemy-elements-sticker-pack | Four Elements — Alchemical Sticker Pack | design-recipe | public-domain | safe | `17-Design-Recipes/alchemy-elements-sticker-pack.md` |
| recipe-athletic-lion-tee | Heart of the Lion — Athletic Motivation Tee & Poster | design-recipe | public-domain | safe | `17-Design-Recipes/athletic-lion-tee.md` |
| recipe-bookcover-starter-pack | Book-Cover Starter Pack — Five Fast Cover Recipes | design-recipe | caution | caution | `17-Design-Recipes/bookcover-starter-pack.md` |
| recipe-botanical-moth-totebag | Botanical Moth — Cottagecore Tote, Sticker & Greeting Card | design-recipe | public-domain | safe | `17-Design-Recipes/botanical-moth-totebag.md` |
| recipe-childrens-animal-bookcover | Little Wild Ones — Children's Animal Alphabet Book Cover & Poster | design-recipe | public-domain | safe | `17-Design-Recipes/childrens-animal-bookcover.md` |
| recipe-deco-sunburst-poster | Golden Age — Art Deco Sunburst Poster & Card | design-recipe | caution | caution | `17-Design-Recipes/deco-sunburst-poster.md` |
| recipe-folk-harvest-totebag | Hearth & Harvest — Folk Tote & Tea-Towel | design-recipe | public-domain | caution | `17-Design-Recipes/folk-harvest-totebag.md` |
| recipe-gothic-raven-poster | Gothic Raven — Horror Quote Poster & Tee | design-recipe | public-domain | safe | `17-Design-Recipes/gothic-raven-poster.md` |
| recipe-heraldic-stag-tee | Wild Crest — Heraldic Stag Badge Tee, Patch & Sticker | design-recipe | public-domain | caution | `17-Design-Recipes/heraldic-stag-tee.md` |
| recipe-lunar-moth-sticker | Lunar Phases — Celestial Witchy Sticker, Mug & Card | design-recipe | caution | caution | `17-Design-Recipes/lunar-moth-sticker.md` |
| recipe-master-formula | The Master Formula — Symbol + Animal + Palette + Type + Quote | design-recipe | public-domain | caution | `17-Design-Recipes/master-formula.md` |
| recipe-mug-starter-pack | Mug Starter Pack — Six Fast Mug Recipes | design-recipe | caution | caution | `17-Design-Recipes/mug-starter-pack.md` |
| recipe-oceanic-whale-mug | Deep Current — Oceanic Whale Mug & Poster | design-recipe | public-domain | safe | `17-Design-Recipes/oceanic-whale-mug.md` |
| recipe-pharaoh-cosmos-tee | Pharaoh of the Cosmos — Egyptian-Space Emblem Tee & Poster | design-recipe | public-domain | safe | `17-Design-Recipes/pharaoh-cosmos-tee.md` |
| recipe-poster-starter-pack | Poster Starter Pack — Six Fast Poster Recipes | design-recipe | caution | caution | `17-Design-Recipes/poster-starter-pack.md` |
| recipe-index | Design Recipe Index — Every Recipe at a Glance | sop | na | safe | `17-Design-Recipes/recipe-index.md` |
| recipe-sticker-starter-pack | Sticker Starter Pack — Six Fast Sticker Recipes | design-recipe | caution | caution | `17-Design-Recipes/sticker-starter-pack.md` |
| recipe-stoic-owl-poster | Stoic Owl — Wisdom Emblem Poster & Mug | design-recipe | public-domain | safe | `17-Design-Recipes/stoic-owl-poster.md` |
| recipe-synthwave-wolf-tee | Neon Wolf — Synthwave Animal Tee & Sticker | design-recipe | public-domain | caution | `17-Design-Recipes/synthwave-wolf-tee.md` |
| recipe-tee-starter-pack | Tee Starter Pack — Six Fast T-Shirt Recipes | design-recipe | caution | caution | `17-Design-Recipes/tee-starter-pack.md` |
| recipe-victorian-detective-tee | The Consulting Mind — Victorian Detective Tee & Poster | design-recipe | caution | caution | `17-Design-Recipes/victorian-detective-tee.md` |
| recipe-wonderland-teacup-mug | Curiouser — Wonderland Surreal Mug & Sticker | design-recipe | caution | caution | `17-Design-Recipes/wonderland-teacup-mug.md` |

**17-Design-Recipes total: 22 entries.**

## 18-Yearly-Public-Domain-Updates

_Section infrastructure: 1 README, 0 _template, 0 _VERIFICATION._

| id | title | type | pd_status | risk_level | file |
|---|---|---|---|---|---|
| yearly-pd-archetype-extraction-process | Archetype Extraction Process — New PD Works into Sections 10 and 11 | sop |  | safe | `18-Yearly-Public-Domain-Updates/archetype-extraction-process.md` |
| yearly-pd-categorization-process | Categorization Process — Routing Verified PD Works to Bible Sections | sop |  | safe | `18-Yearly-Public-Domain-Updates/categorization-process.md` |
| yearly-pd-intake-workflow | Annual Public Domain Intake Workflow | sop |  | caution | `18-Yearly-Public-Domain-Updates/intake-workflow.md` |
| yearly-pd-quote-extraction-process | Quote Extraction Process — Verified PD Works into Section 12 | sop |  | caution | `18-Yearly-Public-Domain-Updates/quote-extraction-process.md` |
| yearly-pd-symbol-extraction-process | Symbol and Motif Extraction Process — New PD Works into Sections 09 and 13 | sop |  | safe | `18-Yearly-Public-Domain-Updates/symbol-extraction-process.md` |
| yearly-pd-trend-analysis-process | Trend Analysis Process — Commercial Prioritization of New PD Entrants | sop |  | safe | `18-Yearly-Public-Domain-Updates/trend-analysis-process.md` |
| yearly-pd-verification-process | Public Domain Verification Process | sop |  | caution | `18-Yearly-Public-Domain-Updates/verification-process.md` |

**18-Yearly-Public-Domain-Updates total: 7 entries.**

## 19-Trend-Dictionary

_Section infrastructure: 1 README, 0 _template, 1 _VERIFICATION._

| id | title | type | pd_status | risk_level | ship_decision | file |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `19-Trend-Dictionary/day-0-pipeline.md` |
| trend-ate | ate (and left no crumbs) | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-ate.md` |
| trend-aura | aura / aura points | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-aura.md` |
| trend-brainrot | brainrot | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-brainrot.md` |
| trend-brat-summer | brat summer | trend-phrase |  |  | NO | `19-Trend-Dictionary/dictionary/trend-brat-summer.md` |
| trend-brat | brat | trend-phrase |  |  | NO | `19-Trend-Dictionary/dictionary/trend-brat.md` |
| trend-bussin | bussin | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-bussin.md` |
| trend-cap | cap | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-cap.md` |
| trend-chat-is-this-real | chat, is this real? | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-chat-is-this-real.md` |
| trend-comment-below | comment below | trend-phrase |  |  | GO | `19-Trend-Dictionary/dictionary/trend-comment-below.md` |
| trend-cooked | cooked | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-cooked.md` |
| trend-crash-out | crash out / crashing out | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-crash-out.md` |
| trend-delulu | delulu | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-delulu.md` |
| trend-drip | drip | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-drip.md` |
| trend-edging | edging | trend-phrase |  |  | NO | `19-Trend-Dictionary/dictionary/trend-edging.md` |
| trend-fanum-tax | fanum tax | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-fanum-tax.md` |
| trend-glaze | glaze / glazing | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-glaze.md` |
| trend-gooning | gooning | trend-phrase |  |  | NO | `19-Trend-Dictionary/dictionary/trend-gooning.md` |
| trend-gyat | gyat | trend-phrase |  |  | NO | `19-Trend-Dictionary/dictionary/trend-gyat.md` |
| trend-hit-the-bell | hit the bell | trend-phrase |  |  | GO | `19-Trend-Dictionary/dictionary/trend-hit-the-bell.md` |
| trend-its-giving | it's giving | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-its-giving.md` |
| trend-like-and-subscribe | like and subscribe | trend-phrase |  |  | GO | `19-Trend-Dictionary/dictionary/trend-like-and-subscribe.md` |
| trend-link-in-bio | link in bio | trend-phrase |  |  | GO | `19-Trend-Dictionary/dictionary/trend-link-in-bio.md` |
| trend-locked-in | locked in | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-locked-in.md` |
| trend-looksmaxxing | looksmaxxing | trend-phrase |  |  | NO | `19-Trend-Dictionary/dictionary/trend-looksmaxxing.md` |
| trend-mewing | mewing | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-mewing.md` |
| trend-mid | mid | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-mid.md` |
| trend-mogging | mogging | trend-phrase |  |  | NO | `19-Trend-Dictionary/dictionary/trend-mogging.md` |
| trend-no-cap | no cap | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-no-cap.md` |
| trend-npc | NPC | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-npc.md` |
| trend-ohio | only in Ohio / Ohio | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-ohio.md` |
| trend-ratio | ratio | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-ratio.md` |
| trend-rizz | rizz | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-rizz.md` |
| trend-sigma | sigma | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-sigma.md` |
| trend-six-seven | six seven (6 7) | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-six-seven.md` |
| trend-skibidi-toilet | skibidi / skibidi toilet | trend-phrase |  |  | NO | `19-Trend-Dictionary/dictionary/trend-skibidi-toilet.md` |
| trend-slay | slay | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-slay.md` |
| trend-smash-that-like-button | smash that like button | trend-phrase |  |  | GO | `19-Trend-Dictionary/dictionary/trend-smash-that-like-button.md` |
| trend-sus | sus | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-sus.md` |
| trend-type-beat | type beat | trend-phrase |  |  | HOLD | `19-Trend-Dictionary/dictionary/trend-type-beat.md` |
| trend-very-demure-very-mindful | very demure, very mindful | trend-phrase |  |  | NO | `19-Trend-Dictionary/dictionary/trend-very-demure-very-mindful.md` |
|  |  |  |  |  |  | `19-Trend-Dictionary/ethical/brand-safety-filter.md` |
|  |  |  |  |  |  | `19-Trend-Dictionary/legal/trademark-clearance.md` |
|  |  |  |  |  |  | `19-Trend-Dictionary/sources.md` |
|  |  |  |  |  |  | `19-Trend-Dictionary/three-force-gate.md` |

**19-Trend-Dictionary total: 45 entries.**

---

## Grand total: 424 entries across 19 sections.

Related: [[README]] · [[_COVERAGE-REPORT]] · [[MAP]] · [[METADATA-STANDARD]]
