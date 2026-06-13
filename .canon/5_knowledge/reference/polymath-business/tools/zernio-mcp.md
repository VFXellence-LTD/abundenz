# Zernio MCP

**Category:** Instagram integration (MCP / Model Context Protocol)
**URL:** (verify before adopting)
**Captured:** 2026-05-08
**Status:** evaluating
**Ecosystem fit:** signal

---

## What it does

Provides an MCP (Model Context Protocol) server that connects Claude Code to Instagram. Enables Claude agents to post directly to Instagram — read feeds, publish content, potentially interact with the platform — without manual copy-paste from Claude to the app.

## Where it fits in polymath

- **Signal**: If Signal publishes to Instagram as a platform, Zernio MCP would allow the Signal orchestrator or atomization agent to post Reels, carousels, or stories directly. Eliminates the human-in-the-loop step for posting.
- **Conduit**: Could automate Pinterest/Instagram cross-posting if Conduit expands to Instagram-style platforms.

This is automation infrastructure, not content creation — it changes *how* content is published, not what's in it.

**Important constraint**: the 30-day manual rule applies. Do not wire this into an agent until that platform is already being posted to manually for 30 days. See [[CLAUDE#Core Doctrine]].

## Pricing

Unknown. MCP servers are typically free/open-source or low-cost. Verify whether Instagram API rate limits apply.

## Decision rule

Adopt when: Signal has an active Instagram posting cadence (30 days manual), the manual posting step is the identified bottleneck, and Instagram publishing is ready to automate.

## Verdict

- [ ] Adopt now
- [x] Park — revisit when Signal has an established Instagram cadence and manual posting is the bottleneck
- [ ] Reject — reason: ___
