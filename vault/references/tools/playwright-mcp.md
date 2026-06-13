# Playwright MCP

**Category:** Browser automation (scriptable / headless) — MCP server
**URL:** https://github.com/microsoft/playwright-mcp
**Captured:** 2026-06-13
**Status:** evaluating — not yet adopted
**Source:** [[references/articles/2026-06-13_build-your-own-jarvis-toolkit]] (chandlerintel "Build Your Own Jarvis" toolkit, row 3 — advanced alternative to Claude for Chrome)

---

## What it does

Playwright MCP is Microsoft's open-source Model Context Protocol server that exposes Playwright browser automation to Claude. It gives the assistant 60+ tools covering navigation, clicking, typing, form filling, tab management, network mocking, storage control, and DevTools integration — essentially a full remote-control layer over a headless or headed browser.

The implementation is noteworthy for how it works under the hood. Rather than relying on screenshots and vision models (which are slow, expensive, and fragile to visual redesigns), it operates on Playwright's accessibility tree — structured, text-based snapshots of the page. This makes interactions deterministic and model-agnostic: no vision model required, and the same script works regardless of whether the page renders in dark mode, at a different resolution, or with slightly shifted layout.

As of June 2026 the project is at v0.0.76 (released June 10, 2026), with 66 releases, 555 commits on main, 33.8k GitHub stars, and Apache 2.0 license. Actively maintained by Microsoft with Docker support and IDE integration guides.

## Why it matters for polymath

The honest reason to look at this is operator/controller automation — specifically scraping platform analytics and performing repeatable web-based checks that platforms don't expose via clean APIs.

Neither Content (Signal) nor Viral (Surge) runs on platforms with tidy, documented APIs for everything we care about. YouTube's analytics API is good but incomplete. TikTok's is limited. Pinterest's has gaps. The dashboard and shared Analytics Reporter agent will eventually need data they can't get any other way, and Playwright MCP is the credible route to filling those gaps.

The second reason is the Surge multi-account workflow. Playwright supports isolated browser contexts — each context gets its own cookies, localStorage, and fingerprint with no bleed between them. For Surge, which runs multiple anonymous accounts across verticals with no shared identity, this is not just convenient but structurally correct. Each anonymous Surge account gets its own isolated context. No shared cookies, no accidental cross-contamination, no login state leaking between brands.

Compare this to a manual operator running a browser window per account: Playwright MCP offers the same isolation guarantee but with scriptable, repeatable control.

## Where it would fit

The natural home is the shared Analytics Reporter and Trend Scanner agents in `ecosystems/shared/agents/`. When a platform's analytics aren't available via API, a Playwright-backed scraper can pull the numbers and feed them into the same reporting workflow the dashboard already reads from.

Surge-specific use: scripting the upload or check flow for anonymous account management — not autonomous posting (that requires human approval), but navigating to dashboards, pulling stats, and surfacing anomalies. The isolated browser context per vertical account maps cleanly to the brand isolation policy already in place.

It would not replace the dashboard or any vault logic. It sits below the agent layer as a capability primitive: a browser the agents can drive when they need one.

## Pricing (verify before adopting — may have changed)

The MCP server itself is free and open-source (Apache 2.0). There is no subscription or hosted tier — you run it locally or in a container alongside Claude Code.

The cost is indirect: Playwright drives a real browser (Chromium, Firefox, or WebKit), which consumes local compute and memory. For headless operation this is modest. For concurrent multi-context sessions (e.g., several Surge accounts checked in parallel) it scales with the number of contexts open simultaneously.

No SaaS vendor, no billing portal, no per-seat fee as of this evaluation. Verify the repo hasn't introduced a hosted/commercial tier before building anything that depends on it staying free.

## Real questions before adopting

1. **Is there a validated scraping need first?** The 30-day manual rule applies. If you haven't manually scraped the analytics you want at least once, you don't know what you actually need or whether the data is worth the engineering effort. Don't build the automation until you've done the manual version for a month.

2. **Does each platform's Terms of Service permit automated login and scraping?** This is not a blanket yes. YouTube's ToS restricts automated access outside of the official API. TikTok's terms are strict. Pinterest has a bot detection posture. Before scripting a login flow for any platform, check its ToS explicitly and flag findings in the relevant platform doc under `ecosystems/shared/platforms/`. This is a per-platform question, not a per-tool question.

3. **Can you scope it strictly to read-only automation?** The most dangerous failure mode is an agent that navigates to a "publish" or "post" or "send" button and clicks it. Any use of Playwright MCP in polymath must be scoped to read-only actions: navigate, read, scrape, screenshot. No writes, no submits, no settings changes without a human in the loop. This constraint needs to be hard-coded into any agent spec that uses it, not left to prompt engineering.

4. **What is the maintenance burden when sites change?** Playwright scripts break when the DOM changes. Platform sites update layouts frequently. Factor in the cost of maintaining scraper scripts over time and weigh that against the value of the data. If a platform changes its analytics page layout quarterly, a fragile scraper may cost more to maintain than it saves.

5. **Credential handling.** Credentials for platform accounts must never enter the vault. If a Playwright script needs to log in to an account, that credential comes from environment variables or a local secrets manager, never from a vault file. This is already covered by global doctrine but worth restating explicitly because browser automation makes it easy to accidentally embed credentials in a script.

## Related tools to evaluate alongside

- [[references/tools/claude-for-chrome]] — the turnkey alternative. Operates on a live Chrome profile with Claude's built-in browser control. More agentic and less setup, but tied to the Claude plan tier, lives in a single named browser profile (no isolated contexts per brand), and is designed for interactive sessions rather than repeatable headless runs. For one-off exploratory tasks Claude for Chrome is probably faster to reach for; for repeatable, isolated, headless automation Playwright MCP is the stronger fit. Evaluate both before committing to either.

- **Supadata** (already installed) — MCP server for social media transcripts. Check whether it already covers the data you'd otherwise scrape with Playwright. Overlap is possible on YouTube/TikTok transcript and analytics surface area. Don't build a Playwright scraper for something Supadata already handles.

- **Platform native APIs** — always the first option. Before scripting a browser to scrape analytics, check whether the platform has an official API endpoint for the same data. Official APIs don't break on DOM changes, don't violate ToS, and are faster. Playwright scraping is the fallback when APIs genuinely don't cover what you need.

## Verdict

- [ ] Adopt now
- [x] Evaluate and test — run the 30-day manual scraping process first, then assess whether automation adds enough value to justify maintenance
- [ ] Park — revisit later
- [ ] Reject

The tool is technically sound, actively maintained, free, and architecturally consistent with the brand isolation policy already in place. The blocking questions are operational, not technical: validate the demand manually first, confirm per-platform ToS compliance before scripting any login flows, and scope all agent use strictly to read-only actions with human approval gates on anything that could post, publish, or submit.
