# Postiz

**Category:** Social media scheduling / auto-posting (open-source, self-hostable)
**URL:** https://postiz.com/
**Captured:** 2026-06-13
**Status:** evaluating — not yet adopted
**Source:** [[references/articles/2026-06-13_build-your-own-jarvis-toolkit]] (chandlerintel "Build Your Own Jarvis" toolkit, row 5 alternative — listed as the open-source alternative to Buffer)

---

## What it does

Postiz is an open-source social media scheduling and auto-posting tool built on Next.js and Node.js, backed by PostgreSQL and Redis. It supports 20+ platforms (YouTube, TikTok, Instagram, Bluesky, Threads, Mastodon, Reddit, X, LinkedIn, and more) and handles scheduling, queue management, AI-assisted caption generation, and analytics in a single interface.

It ships with a REST API and a built-in MCP server (endpoint at `/api/mcp/{API_KEY}` over Streamable HTTP transport), which means Claude or any MCP-capable agent can schedule and manage posts programmatically without a separate integration layer. Community-built MCP wrappers also exist on GitHub (e.g., `antoniolg/postiz-mcp`, `cristdulcey/postiz-mcp`) for different connection patterns.

Self-hosting runs as a unified container deployment — one Docker host, PostgreSQL volume, Redis volume. One-click Railway deployment is documented. The project is licensed AGPL-3.0 and has approximately 30,000 GitHub stars (gitroomhq/postiz-app), with active maintenance through at least v2.21.7 (April 2026).

---

## Why it matters for polymath

The planned shared Scheduler agent (`ecosystems/shared/agents/scheduler`) needs a tool to cross-post content at optimized times across multiple platforms for both Signal (Content) and Surge (Viral). Buffer is the managed-SaaS option; Postiz is the self-hosted alternative that can do the same job.

The key differentiators over Buffer:

- **Cost structure**: Self-hosted = no per-channel SaaS fee. Hosted Postiz plans start at $29/mo for 5 channels and go up to $99/mo for 100 channels. Buffer's comparable pricing is similar per channel. At Surge scale (many anonymous accounts, potentially 20–100+ channels), per-channel SaaS fees compound fast; self-hosting flattens that to infrastructure cost.
- **Data ownership**: When you run your own instance, post history, account tokens, and schedule data stay on your server. Nothing passes through a third-party SaaS database. This matters for Surge specifically.
- **MCP-native**: The built-in MCP server means a scheduling agent can call Postiz directly without a brittle API wrapper — the integration point is already designed for agent orchestration.
- **Customizability**: Because it is open-source, the pipeline can be extended, rate limits adjusted, and posting behavior modified. A managed SaaS would impose hard limits.

---

## Where it would fit

- `ecosystems/shared/agents/scheduler` — Postiz would be the underlying tool that the shared Scheduler agent drives. The agent constructs the payload (caption, media, timing); Postiz handles the actual platform API calls and retry logic.
- Surge (Viral) distribution step — after the Assemble and Caption agents finish a video, the Distribute agent would push it through Postiz to the appropriate anonymous account queues.
- Signal (Content) distribution — scheduled newsletter promotion posts, YouTube community posts, cross-platform repurposing would all route through the same Postiz instance (or a separate one — see below).

---

## Pricing (verify before adopting — may have changed)

As of capture date, based on the postiz.com/pricing page:

| Plan | Price | Channels | Posts |
|------|-------|----------|-------|
| Standard | $29/mo | 5 | 400/mo |
| Team | $39/mo | 10 | Unlimited |
| Pro | $49/mo | 30 | Unlimited |
| Ultimate | $99/mo | 100 | Unlimited |

No permanent free tier. Seven-day free trial on hosted plans. Self-hosting is free (AGPL-3.0 license means you can run it at no software cost; you pay only for server infrastructure).

For Surge at scale, self-hosting is the economically rational option. A VPS with PostgreSQL and Redis to serve dozens of accounts would cost a fraction of the per-channel SaaS tiers.

---

## Real questions before adopting

1. **Does self-hosting actually isolate Surge accounts from each other?** Running one Postiz instance that manages 20+ anonymous Surge accounts means all account tokens and post history are in the same database. If the instance is compromised or subpoenaed, all accounts are exposed together. Separate instances per brand would eliminate that — but multiplies infrastructure overhead significantly. Evaluate whether one instance with strict access controls is acceptable, or whether a hub-and-spoke model (one instance per Surge vertical) is required.

2. **Does Postiz itself constitute a fingerprinting surface?** Posting patterns (cadence, timing, template similarity) from the same scheduler can make accounts look like they share an operator, even if nothing is linked at the account level. Understand whether Postiz adds any consistent metadata (user-agent strings, timing signatures) to outbound API calls that could correlate accounts on the platform side.

3. **Is the MCP server production-stable?** The MCP endpoint is documented and present in the codebase, but verify it is not experimental. Check the GitHub issues and changelog for stability notes before wiring the Scheduler agent to it.

4. **What is the real maintenance burden?** PostgreSQL + Redis + Next.js on a VPS is not zero-ops. Upstream updates (AGPL means you must run the actual open-source version if you distribute; if you are self-hosting privately, less restrictive), container image pulls, platform API token rotation — estimate the real recurring time cost against the SaaS fee savings.

5. **Does the 30-day manual rule apply here?** Yes — per polymath doctrine, the Scheduler agent should not be built until scheduling has been run manually for 30 days. Postiz can be that manual tool first (you use the UI to schedule) before any agent automation is layered on top. This is the right sequencing.

6. **Will Buffer still be needed alongside Postiz?** Buffer has tighter native integrations on some platforms and a simpler UI for quick manual posting. If you self-host Postiz for automation but prefer Buffer's UI for ad-hoc posts, you end up maintaining two tools. Pick one for the primary role.

---

## Related tools to evaluate alongside

- [[references/tools/buffer]] — the managed-SaaS alternative; no infrastructure cost, no self-host complexity, per-channel pricing, less data control. Evaluate in direct comparison.
- **Native platform schedulers** — YouTube Studio, Meta Business Suite, TikTok Creator Studio all offer free built-in scheduling. Adequate for one or two platforms; falls apart at multi-account, multi-platform Surge scale.
- **n8n / Make.com** — if the goal is agent-driven posting via workflow automation rather than a dedicated scheduler, these are alternatives. Postiz integrates with both (n8n nodes documented), so they are not mutually exclusive.
- **Typefully, Publer, Pallyy** — other mid-market managed schedulers. Less relevant if self-hosting is the direction.

---

## Verdict

- [ ] Adopt now
- [x] Test in next pipeline build — run Postiz manually as the scheduling UI for the first 30 days of Surge distribution before building any agent automation on top of it
- [ ] Park — revisit when Surge is further along
- [ ] Reject

The open-source + MCP-native combination makes Postiz the stronger technical fit for the Surge Scheduler agent compared to Buffer, assuming the brand isolation questions are answered satisfactorily. The self-host path eliminates per-channel cost at scale and keeps account data off third-party servers. The blocking questions are operational: single-instance vs. per-brand isolation architecture, and MCP server stability. Do not adopt or build the Scheduler agent until: (a) Boss approves the infrastructure approach, (b) a first Surge vertical is selected and content is flowing, and (c) the 30-day manual scheduling period confirms the tool fits the workflow.
