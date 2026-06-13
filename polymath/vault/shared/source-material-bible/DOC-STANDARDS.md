# Documentation Standards

How to write entries for the Source Material Bible so the vault stays consistent, navigable, and database-ready. These rules apply to every contributor — human or AI. They pair with the [[METADATA-STANDARD]] (the schema) and [[DATABASE-READINESS]] (the ingestion targets).

---

## File naming

- **Format:** kebab-case `.md`. Lowercase, words separated by single hyphens.
  - Good: `frankenstein.md`, `art-deco.md`, `the-hero.md`, `medusa.md`.
  - Bad: `Frankenstein.md`, `art_deco.md`, `The Hero.md`, `medusa (greek).md`.
- **No spaces, no underscores, no parentheses, no uppercase** in entry filenames.
- **One entry per file.** Do not bundle multiple source works into a single file.
- **Filename should match the slug portion of `id`** where practical (`id: pd-lit-frankenstein` → `frankenstein.md`). The `id` carries the namespace prefix; the filename can be the bare slug.
- **Section folder names are fixed** — never rename the numbered folders (`01-Legal-Guidelines` … `18-Yearly-Public-Domain-Updates`). New entries go *inside* the correct numbered folder.
- **Reserved meta-files** use a leading underscore and SCREAMING-KEBAB or specific names: `_VERIFICATION.md`, `_template.md`, `_COVERAGE-REPORT.md`, `INDEX.md`. The leading underscore sorts them to the top of a folder and signals "not an entry."

---

## Required frontmatter

Every **entry** file begins with YAML frontmatter following the [[METADATA-STANDARD]]. Minimum required fields on every entry:

- `id` — unique, kebab-case, never reused.
- `type` — one value from the type enum.
- `title` — human-readable.
- `pd_status` — legal status enum.
- `verified` — `true` / `false`.
- `risk_level` — `safe` / `caution` / `avoid`.
- `created` — `YYYY-MM-DD`.

All other fields are included when relevant and omitted only when genuinely not applicable. For any entry whose `pd_status` is `caution` or `restricted`, or whose `risk_level` is `caution` or `avoid`, **`risk_notes` and `pd_basis` are mandatory** — they explain the danger and the legal reasoning.

Foundation/meta docs (this file, README, MAP, etc.) are human-facing guides and are exempt from entry frontmatter, though `legal-doc` and `sop` type files inside section folders should still carry frontmatter.

---

## Body conventions

- Prose is **normal, clear, professional English** — full sentences, not terse fragments. These entries are read by people and by AI; clarity wins.
- Lead with a short orientation paragraph (what the source is, era, why it matters).
- Use `##` / `###` headings to structure longer entries. Common entry sections:
  - **Overview / summary**
  - **Themes & symbolism**
  - **Visual reference** (motifs, palettes, design cues)
  - **Reuse & risk** — restates and expands `risk_notes` in prose
  - **Remix hooks** — concrete transformation ideas
  - **Related material** — wikilinks
- Keep claims factual and, where legal status is asserted, traceable to `source_url`.

---

## Wikilink conventions

- Use Obsidian `[[wikilinks]]` to connect related entries — these become the vault's graph and map to relational `related` edges (see [[DATABASE-READINESS]]).
- **Link by entry title or filename slug**, matching the target file: `[[frankenstein]]`, `[[the-hero]]`, `[[art-deco]]`.
- **Cross-folder links use the folder name** when pointing at a section landing page: `[[01-Legal-Guidelines]]`, `[[14-Trending-Categories]]`.
- Mirror important links in the frontmatter `related` array so the connection is both human-visible (body) and machine-readable (metadata).
- Link generously but meaningfully — every entry should connect to at least its archetypes, palettes, motifs, and any legal reference it depends on.
- Always link legally-sensitive entries back to **[[01-Legal-Guidelines]]**.

---

## Entry-template usage

- Each section folder may contain a `_template.md` showing the expected frontmatter and body skeleton for that section's `type`.
- **Copy the template, fill it, rename to the entry slug.** Never edit the template in place to create an entry.
- Templates are excluded from database ingest (their leading-underscore name marks them as meta).
- If a section has no `_template.md`, use the worked examples in the [[METADATA-STANDARD]] as the pattern.

---

## Verification-flag conventions

Three frontmatter fields encode trust and safety. They work together:

### `verified` (boolean)

- `verified: true` — the entry's factual and legal claims have been checked against a real source (recorded in `source_url`). Production-safe to query.
- `verified: false` — claims are asserted but not yet confirmed. The entry is usable for ideation but **must not** be relied on for a commercial decision until verified. Treated as provisional by the database (can be filtered out of production queries).

### `pd_status` (enum)

The legal classification. Drives whether material may be used at all:
- `public-domain` / `openly-licensed` → usable (subject to `risk_notes`).
- `caution` → usable only after reading `risk_notes`; status uncertain or derivatives restricted.
- `restricted` → the protected element must not be used.
- `na` → not applicable (Polymath-original or process docs).

### `risk_level` (enum)

The operational traffic light for production teams:
- `safe` (green) → go.
- `caution` (amber) → go only within the constraints in `risk_notes`.
- `avoid` (red) → do not use the restricted element.

**Conservative default rule:** when legal status is uncertain, set `pd_status: caution` (or `restricted`), `risk_level: caution` (or `avoid`), set `verified: false` until confirmed, and write an explicit `risk_notes`. The safe failure mode for IP is "don't use it." This mirrors the doctrine in [[01-Legal-Guidelines]].

**Consistency rule:** these three fields must not contradict each other. A `restricted` entry cannot be `risk_level: safe`. A `risk_level: avoid` entry should have no production `applications` listed.

---

## How `_VERIFICATION.md` files work

Each section folder (02–17) contains a `_VERIFICATION.md` ledger that tracks the verification state of every entry in that folder. It is the audit trail for legal safety.

**Purpose:** answer, at a glance, "which entries in this folder are confirmed safe, which are provisional, and which are flagged for review?"

**Structure (per folder):**

```markdown
# Verification Ledger — <folder name>

Last reviewed: YYYY-MM-DD by <reviewer>

| entry id | title | pd_status | verified | risk_level | source checked | notes / open questions |
|----------|-------|-----------|----------|------------|----------------|------------------------|
| pd-lit-frankenstein | Frankenstein | public-domain | true | caution | gutenberg.org/ebooks/84 | film design caveat noted |
| ...      | ...   | ...       | ...      | ...        | ...            | ...                    |

## Open items
- [ ] <entry> — needs source confirmation for first-publication date
- [ ] <entry> — confirm no live trademark on the name
```

**Workflow:**

1. When an entry is added, append a row with `verified: false` and list any open question under **Open items**.
2. When the legal status is confirmed against a source, set `verified: true` in the entry's frontmatter, fill `source_url`, and update the ledger row + check off the open item.
3. Entries with unresolved open items stay `verified: false` and are excluded from production queries (see [[DATABASE-READINESS]] — provisional records are filterable).
4. The folder-level ledgers roll up into the vault-wide [[_COVERAGE-REPORT]], which reports total entries, verified counts, and outstanding risk flags.

**Rule:** never mark an entry `verified: true` without a real, citable source. An unverifiable claim stays provisional.

---

See [[METADATA-STANDARD]] for the field schema, [[DATABASE-READINESS]] for ingestion, and [[01-Legal-Guidelines]] for the legal doctrine these standards enforce.
