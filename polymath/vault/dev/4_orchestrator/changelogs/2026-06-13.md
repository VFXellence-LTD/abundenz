# 2026-06-13 — Polymath Dev Changelog

## Summary
Integrated the chandlerintel "Build Your Own Jarvis: Full Toolkit" Notion page (Instagram link-in-bio) into `references/`. Extracted the page via the Notion public web API (no browser), then captured it as a source plus a full fan-out of 7 tool-evaluation files. 8 files created.

## Work completed
- [x] Extracted the JS-rendered Notion site via its public web API (crawler-UA → og:url page ID → `loadPageChunk` JSON); reconstructed the full 11-row toolkit table — no browser, no sub-pages
- [x] Wrote source capture `references/articles/2026-06-13_build-your-own-jarvis-toolkit.md` (full toolkit table, polymath controller-layer mapping, doctrine constraints, verdict)
- [x] Wrote 7 tool-eval files in `references/tools/` with live-verified pricing/status (2026-06-13): elevenlabs, buffer, postiz, claude-for-chrome, meta-ads-connector, gmail-mcp, playwright-mcp
- [x] Cross-linked all tool files to the source capture and to `shared/brand-isolation/POLICY`

## Decisions made
- **Source captured under `articles/`** (written guide), not `reels/` — the IG reel shortcode wasn't in the link (fbclid only); the Notion page is the written artifact
- **Claude Code / Subagents / Routines / `/voice` / `/schedule` folded into the source capture**, not given tool files — they are Claude-native features already in use, not third-party SaaS to evaluate
- **RevenueCat not duplicated** — `tools/revenuecat.md` already existed
- **Whole pattern parked, not adopted** — honors the 30-day manual rule + "no adoption before validated demand"; nothing is live yet. ElevenLabs marked already-in-stack for Viral/Surge voice only
- **Meta Ads connector parked to Phase 3+** (paid ads); only its row-6 IG-analytics token slice flagged as a nearer-term read-only candidate

## Files changed
- `references/articles/2026-06-13_build-your-own-jarvis-toolkit.md` — new (source capture)
- `references/tools/elevenlabs.md` — new
- `references/tools/buffer.md` — new
- `references/tools/postiz.md` — new
- `references/tools/claude-for-chrome.md` — new
- `references/tools/meta-ads-connector.md` — new
- `references/tools/gmail-mcp.md` — new
- `references/tools/playwright-mcp.md` — new

## Constraints flagged across the notes
- **Voice authenticity** — owner's real voice is the Content moat; ElevenLabs AI voice for Viral/Surge + patches/translations ONLY, never pillar/Lullaby narration
- **Brand isolation** — a single scheduler workspace (Buffer/Postiz), browser profile (Claude for Chrome/Playwright), or inbox (Gmail) spanning all ecosystems is a cross-account fingerprint risk; isolate per ecosystem. A unified "Jarvis" console is acceptable only in the private controller layer
- **Security** — no OAuth tokens / credentials / API keys in the vault (Gmail MCP, Meta token)
- **Side-effectful actions** — browser agents and email send must never publish/send/pay/spend autonomously without Boss approval; ad spend needs hard budget caps

## Open questions
- Buffer offers no official MCP server (community-built only); Postiz ships a native MCP — does that tip the scheduler choice toward Postiz?
- Surge account model must be designed before any scheduler tool is adopted (isolation architecture)
- Which specific Gmail MCP server (no single official one) — defer until a live support inbox exists

## Next steps
- Boss to review the capture + tool notes and decide which (if any) to test during the manual period
- Revisit the broad automation pattern 09-2026 (per source-capture verdict)
- When Surge selects its first vertical + account model, revisit Buffer vs Postiz for the Scheduler agent
