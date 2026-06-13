# Build Your Own Jarvis: Full Toolkit

**Source:** https://chandlerintel.notion.site/Build-Your-Own-Jarvis-Full-Toolkit-37d95295c83b80f3a99fcb520137a368
**Captured:** 2026-06-13
**Creator:** chandlerintel (Instagram link-in-bio)
**Format:** article
**Ecosystem fit:** controller
**Status:** processed

---

## What it is

A companion reference page to an Instagram video, listing every tool and connection described in the "build your own Jarvis" demo. The premise: Claude Code is the core runtime; MCP connectors (described as "a direct line between Claude and one app") wire it into the tools you already use. The page's own framing: "Everything mentioned in the video, in one place. It's mostly Claude Code plugged into apps you already use, one connector at a time." The result is a personal AI operator that can browse, post, read email, track revenue, run ads, and schedule autonomous agent tasks — all from a single Claude Code session.

| # | What you're building | Tool to use | Alternatives |
|---|---|---|---|
| 1 | The Jarvis dashboard | Drop a screenshot into [Claude Code](https://claude.com/product/claude-code) | |
| 2 | Talk to it + British voice | `/voice` (talk TO it) + [ElevenLabs](https://try.elevenlabs.io/ochf0i5ekcd1) (Jarvis voice back) | |
| 3 | Let it use your browser | [Claude for Chrome](https://www.anthropic.com/news/claude-for-chrome) | Playwright MCP (advanced) |
| 4 | Track revenue | [RevenueCat](https://www.revenuecat.com) MCP | |
| 5 | Auto-post content | [Buffer](https://buffer.com) MCP | [Postiz](https://postiz.com) MCP |
| 6 | Instagram analytics | Meta developer app + token, handed to Claude | |
| 7 | Read + run ads | [Meta Ads connector](https://www.facebook.com/business/news/meta-ads-ai-connectors) | |
| 8 | Read your inbox | Gmail MCP | Google Workspace CLI |
| 9 | Answer customers in your voice | Business knowledge base via markdown files | |
| 10 | A team of specialized agents | [Subagents](https://code.claude.com/docs/en/sub-agents) | |
| 11 | Run it before you wake up | [Routines](https://code.claude.com/docs/en/routines) via `/schedule` | |

## Tool evaluations

Per-tool eval files being tracked alongside this capture: [[references/tools/elevenlabs]], [[references/tools/buffer]], [[references/tools/postiz]], [[references/tools/claude-for-chrome]], [[references/tools/meta-ads-connector]], [[references/tools/gmail-mcp]], [[references/tools/playwright-mcp]], and existing [[references/tools/revenuecat]].

---

## What I'd steal

The architectural pattern is the steal, not any individual tool. Chandler is describing what polymath already calls the controller layer: a private operator console where Claude Code has read/write access to all the live systems — analytics, scheduling, inbox, ad spend — and can act across them without exposing any ecosystem's brand. That framing validates the controller design and gives it a concrete implementation shape.

More specifically:

**Row 5 (Buffer/Postiz MCP)** maps directly to the Scheduler agent already specced at `ecosystems/shared/agents/scheduler/`. Before building that agent, wire Buffer or Postiz as an MCP connector first — that's the manual-for-30-days step, and it may turn out that a connector is all the "agent" you actually need.

**Row 6 (Instagram analytics via Meta token)** maps to the Analytics Reporter agent at `ecosystems/shared/agents/analytics-reporter/`. This is the right integration path: a developer app + token handed to Claude, not a third-party dashboard subscription. Operationally cheaper and more granular.

**Row 10 (Subagents) + Row 11 (Routines)** map to the controller scheduling architecture and the full agent pipeline. The implementation reference here is useful: Routines via `/schedule` is the mechanism; Subagents is the dispatch model. Worth reading the linked docs before designing the controller's scheduling layer.

**Row 9 (Business knowledge base via markdown files)** is already how this vault works. The vault's ecosystem specs, playbooks, and briefs are the knowledge base. Claude Code already reads them. No new tool needed — just intentional organization of what to hand Claude when it's operating in a given context.

What I would **not** steal without careful scrutiny: ElevenLabs voice-as-Jarvis-output (see constraints below), the Meta Ads connector (Phase 3+), and the Gmail MCP (evaluate only when inbox volume justifies it).

---

## Where it fits in polymath

This is controller-layer infrastructure. The controller (`controller/`) is the one place all ecosystems may appear together — it's private, has no public brand surface, and is specifically designed to hold exactly this kind of cross-ecosystem operator tooling. See [[shared/brand-isolation/POLICY]] for why the controller is the *only* place this pattern is acceptable.

Specific mapping:

- `controller/` — the "Jarvis console" concept lives here. A Claude Code session with MCP connectors to Buffer (or Postiz), the Instagram analytics token, and the vault as its knowledge base is the controller's runtime shape.
- `ecosystems/shared/agents/scheduler/` — Buffer or Postiz MCP is the tool this agent routes through. Evaluate both before building custom scheduler logic; the MCP may be the full solution.
- `ecosystems/shared/agents/analytics-reporter/` — Meta developer token approach (Row 6) is the right integration model. Also relevant: when the Trend Scanner agent needs platform signal data.
- `shared/automation/` — the overall MCP connector topology (which apps are wired, which tokens exist, which agents have access to which connectors) should be documented here when connectors are adopted.

The browser control rows (Row 3 — Claude for Chrome, Playwright MCP) fit `shared/automation/` as well, but only if a task genuinely can't be done via an API. Browser automation is brittle and slow; prefer MCP connectors with proper API access first.

---

## Open questions

**Voice (Row 2):** The vault's voice rules are explicit — see the Voice Authenticity Rules table in `vault/CLAUDE.md`. ElevenLabs AI voice is allowed for Surge/Viral content, for short content patches on existing pillar videos, and for translated derivatives of evergreen content. It is **never** allowed to replace owner narration on pillar content or Lullaby recordings. A "Jarvis speaks back to me" use case in the private controller layer is a different category — it's a personal productivity tool, not published content — but that distinction needs to be made consciously before wiring ElevenLabs into the controller. Evaluate [[references/tools/elevenlabs]] with that constraint in mind.

**Buffer vs. Postiz (Row 5):** Both have MCP connectors. Buffer is mature and has wide platform support; Postiz is open-source and self-hostable. Cost and platform coverage need to be verified — neither should be adopted until the Scheduler agent's manual phase has run for 30 days and the actual posting workflow is understood. See [[references/tools/buffer]] and [[references/tools/postiz]].

**Claude for Chrome vs. Playwright MCP (Row 3):** Claude for Chrome is a browser extension and is the lower-friction path; Playwright MCP is more powerful but requires running a local server. For controller-layer tasks (spot-checking analytics pages, navigating a dashboard that has no API), Claude for Chrome is probably sufficient. Playwright MCP becomes relevant only if the task needs headless execution in a scheduled routine. See [[references/tools/claude-for-chrome]] and [[references/tools/playwright-mcp]].

**Meta Ads connector (Row 7):** Paid ads are Phase 3+ and currently parked across all ecosystems. Do not evaluate this connector until at least one ecosystem has reached Phase 2. Log it, don't touch it.

**Gmail MCP (Row 8):** Not yet relevant — inbox volume doesn't justify it at Phase 0. Revisit when customer support load is real. See [[references/tools/gmail-mcp]].

**Routines / `/schedule` (Row 11):** The Claude Code Routines feature is the scheduling primitive the controller will use. Read the linked docs to understand what's available before designing the controller's cadence system — the design should fit the primitive, not the other way around.

**The 30-day manual rule applies to all of this.** This toolkit is seductive because it describes a fully automated personal operator. Resist the pull. The Jarvis dashboard (Row 1) is harmless to set up now — it's just Claude Code looking at a screenshot. Everything else requires a manual workflow that has run long enough to know what the automation actually needs to do.

---

## Verdict

- [ ] Apply now (creates a polymath edit)
- [x] Test in next pillar piece
- [x] Park for later — revisit 09-2026
- [ ] Reject — reason: ___

The "test in next pillar piece" check is specific: wire a Buffer or Postiz MCP connector when the Scheduler agent's manual phase begins, and evaluate whether the connector alone is sufficient before writing any custom agent code. The broader Jarvis pattern — controller layer with MCP connectors to live systems — is validated by this source and worth building toward; the 09-2026 revisit is when the active ecosystems should be at or near Phase 2 and the controller's scheduling and analytics layers will be the natural next build.
