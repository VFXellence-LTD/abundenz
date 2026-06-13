# Database Readiness

This document explains how the Source Material Bible — a folder of markdown files with YAML frontmatter — becomes a queryable database across multiple platforms, and how to feed it to retrieval-augmented generation (RAG) systems. The design goal is **write once, ingest anywhere**: the same files serve a human reading Obsidian, an analyst filtering Airtable, an app querying Postgres, and an LLM retrieving context.

The enabling contract is the [[METADATA-STANDARD]] — consistent, exactly-named frontmatter fields on every entry.

---

## The format model

Each entry is a single `.md` file with two parts:

1. **Frontmatter** (YAML between `---` fences) → becomes **structured columns / metadata**.
2. **Body** (markdown prose with `[[wikilinks]]`) → becomes the **document / chunk content**.

This split is the whole trick. Structured fields drive filtering, faceting, joins, and metadata-filtered vector search. The body drives full-text reading and semantic embedding.

---

## Per-platform mapping

### Markdown / Obsidian (native)

- The vault *is* the database. Obsidian reads frontmatter as properties and `[[wikilinks]]` as graph edges.
- Query with the Dataview plugin: `TABLE pd_status, risk_level, year FROM "02-Public-Domain-Library" WHERE risk_level = "safe"`.
- No transformation needed — this is the canonical, editable source of truth. All other targets are *derived* from it.

### Notion

- Each entry → one **database row (page)**. Frontmatter fields → Notion properties.
- Field type mapping:
  - `id`, `title`, `creator`, `pd_basis`, `risk_notes`, `source_url`, `country` → **Text / URL**.
  - `type`, `pd_status`, `risk_level` → **Select** (single).
  - `themes`, `symbols`, `archetypes`, `visual_motifs`, `emotional_tags`, `applications`, `remix_hooks`, `tags` → **Multi-select**.
  - `verified` → **Checkbox**.
  - `year`, `created` → **Number / Date** (year stays text where `Ancient` is allowed).
  - `related` → **Relation** (resolve wikilinks to row references by `id`/`title`).
- Body markdown → page content.

### Airtable

- One **base**, one primary **table** (`entries`), one row per entry.
- Single-select fields: `type`, `pd_status`, `risk_level`.
- Multiple-select fields: the array fields above.
- `related` → a **linked-record** field pointing back at the same table (self-join on `id`).
- Lookup/rollup views: e.g. group by `applications`, filter `risk_level = safe`, count by `type`.

### Postgres

Recommended relational shape (normalize the arrays):

```sql
CREATE TABLE entries (
  id           text PRIMARY KEY,
  type         text NOT NULL,
  title        text NOT NULL,
  creator      text,
  year         text,            -- text, because "Ancient" is valid
  country      text,
  pd_status    text NOT NULL,   -- enum-checked
  pd_basis     text,
  verified     boolean NOT NULL DEFAULT false,
  risk_level   text NOT NULL,   -- enum-checked
  risk_notes   text,
  source_url   text,
  created      date,
  body         text             -- raw markdown body
);

-- Array fields as junction tables (one pattern, reused per array):
CREATE TABLE entry_themes        (entry_id text REFERENCES entries(id), value text);
CREATE TABLE entry_symbols       (entry_id text REFERENCES entries(id), value text);
CREATE TABLE entry_archetypes    (entry_id text REFERENCES entries(id), value text);
CREATE TABLE entry_visual_motifs (entry_id text REFERENCES entries(id), value text);
CREATE TABLE entry_emotional_tags(entry_id text REFERENCES entries(id), value text);
CREATE TABLE entry_applications  (entry_id text REFERENCES entries(id), value text);
CREATE TABLE entry_remix_hooks   (entry_id text REFERENCES entries(id), value text);
CREATE TABLE entry_tags          (entry_id text REFERENCES entries(id), value text);
CREATE TABLE entry_related       (entry_id text REFERENCES entries(id), related_id text);
```

Or, for a lighter touch, keep arrays as `text[]` / `jsonb` columns on `entries` and index with GIN. Enforce enums with `CHECK` constraints mirroring the [[METADATA-STANDARD]].

### Vector store / RAG (Pinecone, pgvector, Chroma, Weaviate, etc.)

- Embed the **body** (chunked — see below). Store **all frontmatter as metadata** on each vector.
- This enables **metadata-filtered semantic search**: "find entries semantically about *betrayal* WHERE `pd_status = public-domain` AND `risk_level = safe` AND `applications CONTAINS poster`."
- Keep `id` on every vector so retrieved chunks can be traced back to their source file and re-joined with the relational record.

---

## Field-to-column mapping (master table)

| Frontmatter field | Notion | Airtable | Postgres | Vector metadata |
|-------------------|--------|----------|----------|-----------------|
| `id` | Text (title key) | Primary field | `id PK` | `id` |
| `type` | Select | Single-select | `text` + CHECK | `type` |
| `title` | Text | Text | `text` | `title` |
| `creator` | Text | Text | `text` | `creator` |
| `year` | Text/Number | Text | `text` | `year` |
| `country` | Text | Text | `text` | `country` |
| `pd_status` | Select | Single-select | `text` + CHECK | `pd_status` |
| `pd_basis` | Text | Text | `text` | `pd_basis` |
| `verified` | Checkbox | Checkbox | `boolean` | `verified` |
| `themes` | Multi-select | Multiple-select | junction / `text[]` | `themes` (array) |
| `symbols` | Multi-select | Multiple-select | junction / `text[]` | `symbols` (array) |
| `archetypes` | Multi-select | Multiple-select | junction / `text[]` | `archetypes` (array) |
| `visual_motifs` | Multi-select | Multiple-select | junction / `text[]` | `visual_motifs` (array) |
| `emotional_tags` | Multi-select | Multiple-select | junction / `text[]` | `emotional_tags` (array) |
| `applications` | Multi-select | Multiple-select | junction / `text[]` | `applications` (array) |
| `risk_level` | Select | Single-select | `text` + CHECK | `risk_level` |
| `risk_notes` | Text | Long text | `text` | `risk_notes` |
| `remix_hooks` | Multi-select | Multiple-select | junction / `text[]` | `remix_hooks` (array) |
| `source_url` | URL | URL | `text` | `source_url` |
| `tags` | Multi-select | Multiple-select | junction / `text[]` | `tags` (array) |
| `related` | Relation | Linked records | `entry_related` | `related` (array of ids) |
| `created` | Date | Date | `date` | `created` |
| *(body)* | Page content | Long-text/attachment | `body` | embedded chunk text |

---

## Chunking strategy for RAG

Entries are short-to-medium documents, so chunking is light:

1. **One entry = one logical document.** Prefer embedding the whole body as a single chunk where it fits the model's context comfortably (most entries do).
2. **Split long entries by heading.** If an entry exceeds ~800–1000 tokens, split on markdown `##` / `###` headings so each chunk is self-contained (e.g. "Themes", "Visual motifs", "Reuse & risk", "Remix hooks").
3. **Prepend a metadata header to each chunk** before embedding, so the embedding carries identity even when retrieved in isolation:
   ```
   [title: Frankenstein | type: source-work | pd_status: public-domain | risk_level: caution]
   <chunk body text>
   ```
4. **Always carry full frontmatter as vector metadata** (not just in the text), so retrieval can be hard-filtered by `pd_status` / `risk_level` / `applications` regardless of chunk content.
5. **Never split mid-`risk_notes`.** The `risk_notes` field must always travel intact with any chunk derived from a legally-sensitive entry. When in doubt, attach `risk_notes` to every chunk of that entry.

---

## The consistent-metadata guarantee

The Bible is database-ready because of three enforced invariants:

1. **Exact field names.** Every entry uses the identical field names from the [[METADATA-STANDARD]]. No synonyms, no per-folder variants. This makes a single import script work for every file.
2. **Closed enums.** `type`, `pd_status`, `risk_level`, and `applications` draw only from their published value sets, so Select / CHECK constraints never break on ingest.
3. **Stable `id` primary key.** Every entry has a unique, never-reused kebab `id`. It is the join key that lets the same record exist coherently across Obsidian, Notion, Airtable, Postgres, and the vector store, and lets `related` links resolve as foreign keys.

Validation before ingest: a lightweight linter checks that every `.md` entry has all required fields, that enum fields hold legal values, that `id` is unique vault-wide, and that `related` wikilinks resolve. Files failing validation are flagged in their folder's `_VERIFICATION.md` (see [[DOC-STANDARDS]]) and excluded from production queries until fixed.

See [[METADATA-STANDARD]] for field definitions and [[DOC-STANDARDS]] for the verification workflow.
