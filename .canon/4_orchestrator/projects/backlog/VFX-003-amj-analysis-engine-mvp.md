---
id: VFX-003
title: AMJ analysis engine MVP (CLI/API, no UI)
status: backlog
created: 2026-06-05
project: amj
priority: high
depends_on: [VFX-002]
---

# VFX-003: AMJ Analysis Engine MVP

## Goal

Build the MVP for AMJ (A Musical Journey — temp name, confirm with Boss) as a pure analysis engine: CSV/data input → taste profile → discovery prompts → Claude API → structured JSON + markdown output. No UI in MVP. Proves the core value engine before building any interface.

## Context

### App Name — PROVISIONAL

**AMJ (A Musical Journey)** is a temporary working name. Boss must confirm final name. Z-naming convention applies (e.g., potential candidates: Rhythmz, Resonanz, Melodiz — Boss decides).

App location in polymath monorepo: `apps/amj/`.

### Locked Decisions (from session handoff)

1. **MVP scope**: Analysis engine only. CLI or simple REST API. No UI.
   - Input: CSV (Spotify export, or equivalent)
   - Process: CSV parser → taste profile builder → discovery prompt generator → Claude API → structured output
   - Output: JSON + Markdown (taste profile + discovery results)

2. **Database**: SQLite (via `better-sqlite3`) for MVP. Postgres is the upgrade path. No premature migration.

3. **Music data sources** (multi-source, priority order):
   - Spotify (primary — user CSV exports)
   - Last.fm (scrobble history)
   - MusicBrainz (metadata enrichment, open data)
   - Discogs (release data, especially for niche/vinyl)

4. **Discovery modes** (multi-mode, all implemented in MVP):
   - **Influences**: "What did this artist listen to?"
   - **Forgotten gems**: Underrated tracks by known artists
   - **New gems**: New releases matching taste profile
   - **Mood**: Discovery filtered by mood/energy
   - **Era**: Discovery filtered by era/decade
   - **Genre**: Discovery filtered by genre cluster

5. **Agent model**: Hybrid.
   - **Sync** (quick): Fast discovery queries, taste profile summary
   - **Async** (deep): Background deep-dive research (longer Claude chains, multi-source enrichment)

### Open Questions (Boss confirms)

- **Multi-mode confirmation**: Are all 6 modes in scope for MVP or should Boss prioritize 2-3?
- **AMJ final name**: Z-name decision pending Boss
- **Mission-control port scope**: Is the "mission control" dashboard (currently in polymath vault-only context) intended to be a full Electron app, a web app in the Zappz marketplace, or vault-only for now? This decision affects architecture substantially.
- **Zappz name confirmation**: AMJ lives inside Zappz marketplace — that name must be confirmed before AMJ public brand is established.

## Tasks

- [ ] Boss confirms discovery modes scope for MVP
- [ ] Boss confirms AMJ name
- [ ] Boss clarifies mission-control port scope
- [ ] Set up `apps/amj/` directory in polymath monorepo
- [ ] Implement CSV parser (Spotify export format)
- [ ] Build taste profile builder (aggregation + weighting logic)
- [ ] Design discovery prompt templates (one per mode)
- [ ] Integrate Claude API via `packages/ai-engine`
- [ ] Define structured output schema (JSON + Markdown)
- [ ] Implement sync mode (fast queries)
- [ ] Implement async mode (background deep research)
- [ ] Wire up multi-source data (Spotify → Last.fm → MusicBrainz → Discogs)
- [ ] Write integration tests (CSV in → expected output shape)
- [ ] Write CLI entry point
- [ ] Write golden file tests for each discovery mode

## Acceptance Criteria

- [ ] CLI: `amj analyze --input my-spotify-export.csv --mode influences` returns valid JSON
- [ ] All 6 discovery modes produce structured output (or confirmed reduced scope)
- [ ] SQLite stores taste profile and discovery history
- [ ] Tests pass for all implemented modes
- [ ] Claude API integration uses `packages/ai-engine`

## Notes

- Multi-source music APIs each have different rate limits and auth flows. Design with adapters so each source is swappable.
- Spotify export CSVs vary by what the user exports — validate format strictly, fail loudly on unrecognized columns.
- Last.fm and MusicBrainz are free/open; Discogs has rate limits on free tier. Plan accordingly.

## Time Log

| Timestamp (UTC) | Event |
|-----------------|-------|
| 2026-06-05 | Created from session handoff |
