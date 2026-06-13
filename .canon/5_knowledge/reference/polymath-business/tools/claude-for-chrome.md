# Claude for Chrome

**Category:** Browser automation / agentic browsing
**URL:** https://www.anthropic.com/news/claude-for-chrome
**Captured:** 2026-06-13
**Status:** evaluating — not yet adopted
**Source:** [[references/articles/2026-06-13_build-your-own-jarvis-toolkit]] (chandlerintel "Build Your Own Jarvis" toolkit, row 3)

---

## What it does

Claude for Chrome is an Anthropic browser extension that gives Claude the ability to see and interact with a live Chrome tab — clicking links, typing into fields, reading page content, and navigating between pages. It is agentic browsing: Claude acts as a controller that can observe and manipulate what is on screen in real time, rather than just reading a static snapshot.

Initially released as a limited research preview in August 2025, it expanded to all paid Claude plans in December 2025. As of mid-2026, it is available to Pro subscribers (USD 20/month, or USD 17/month billed annually) and Max subscribers (starting at USD 100/month). A meaningful caveat: Pro plan users appear to be limited to the Haiku 4.5 model within the extension; Max plan users get access to more capable models. Verify both model access and plan requirements before adopting — pricing structures around new Anthropic features tend to shift.

The Jarvis toolkit positions it as "let it use your browser." The listed advanced/scriptable alternative is Playwright MCP.

## Why it matters for polymath

The polymath use case is narrow and specific: pulling data from platforms that do not expose clean APIs. Several analytics dashboards — TikTok Creator Center, YouTube Studio, Pinterest Analytics — surface useful signals in the UI that are not available via API at the free or standard tier. A browser agent could read those dashboards on a schedule and hand the numbers off to the Analytics Reporter or Trend Scanner agents, without requiring manual copy-paste sessions.

Secondary fit: assisting publishing preparation work — reviewing a draft before submission, checking that a scheduled post went live, reading competitor content for Trend Scanner inputs. None of this involves autonomous publishing; it is all read-and-report or read-and-confirm.

This is not a fit for autonomous action across the ecosystem stack. It is a fit for supervised, read-heavy operator tasks where the bottleneck is a browser UI, not an API.

## Where it would fit

- **`ecosystems/shared/agents/analytics-reporter/`** — browser agent reads platform dashboards on a trigger; reporter agent synthesises the numbers. The extension handles the "get into the UI" step.
- **`ecosystems/shared/agents/trend-scanner/`** — scanning trending pages, reading platform discovery feeds that do not expose RSS or API endpoints.
- **`ecosystems/viral/shared/agents/source/`** — the Source agent ingests viral content candidates; a browser agent could handle platforms where there is no clean embed or API.
- Not applicable to publishing, payment, settings changes, or anything requiring account-level write access.

## Pricing (verify before adopting — may have changed)

- **Pro plan:** USD 20/month (month-to-month) or USD 17/month (annual). Claude for Chrome included, but model appears limited to Haiku 4.5 within the extension.
- **Max plan:** Starting at USD 100/month. Includes Claude for Chrome with access to more capable models.
- **Free plan:** Claude for Chrome not included.

The relevant question is whether the Haiku 4.5 limitation on Pro is a hard architectural constraint or a temporary rollout choice. If Pro-tier browser sessions are capped at a weaker model, the automation quality for multi-step tasks may be insufficient. Verify this before assuming Pro is adequate.

No additional per-task cost has been reported beyond the plan subscription, but agentic sessions consume more context than simple chat — usage limits on Pro could become a constraint if running the extension on a daily analytics schedule.

## Real questions before adopting

1. **Is the Haiku 4.5 cap on Pro actually a blocker?** Multi-step dashboard navigation with error recovery needs judgment. Haiku handles simple linear tasks well but stumbles on pages with variable structure. Test this before paying for Max tier.

2. **What is the prompt-injection risk surface?** A browser agent reads live web content — ads, user-generated comments, page titles — and that content can contain adversarial instructions designed to hijack the agent's next action. Before putting this in any loop that touches platform settings, payment pages, or publishing queues, map exactly what the agent can and cannot do in each context. Never let it perform irreversible actions (publish, send, pay, change account settings) without explicit human confirmation at each step.

3. **Does one Chrome profile serving multiple ecosystems create fingerprinting risk?** If a single logged-in browser session touches a Content account and a Viral/Surge account in the same session, platforms can detect the shared session fingerprint and link otherwise anonymous accounts. Brand isolation policy applies here. The extension needs to run in separate, isolated Chrome profiles — one per ecosystem brand identity — not a shared "agent" profile. This is an operational setup cost that needs solving before the tool is useful.

4. **What is the failure mode when a platform changes its UI?** Browser agents break silently when the DOM structure changes. Unlike an API with versioned endpoints, a UI scrape can return garbage without throwing an error. Any workflow built on browser automation needs a validation step that confirms the data read looks plausible before passing it downstream.

5. **Is a subscription required just for evaluation?** If Pro is USD 20/month and already in use for Claude access, the extension comes at no additional cost — low-risk test. If a new subscription is required, that needs Boss approval before the first dollar is spent.

## Related tools to evaluate alongside

- **[[references/tools/playwright-mcp]]** — the scriptable, programmable alternative. Playwright MCP gives Claude (or any agent) control over a browser via code rather than a live extension. Harder to set up, but reproducible, version-controlled, and not gated behind a subscription tier. Better long-term fit for any workflow that runs on a schedule. Evaluate both before picking one.
- **Platform APIs (YouTube Data API, Pinterest API, TikTok Research API)** — always check whether the platform actually offers the data via API before building a browser workaround. API data is more reliable, cheaper to maintain, and does not carry the injection risk. Browser automation is the fallback, not the first choice.
- **Supadata MCP** — already installed in the polymath stack. Handles social media transcript and content reads via MCP without requiring a browser session. Check whether Supadata already covers the specific data needs before adding browser automation.

## Verdict

- [ ] Adopt now
- [x] Test — low-cost trial once Claude for Chrome is confirmed included in current Pro subscription; evaluate against a single, low-stakes analytics read task (e.g., reading YouTube Studio weekly summary) before building any workflow dependency
- [ ] Park — revisit later
- [ ] Reject

The test gate: run it manually against one platform dashboard for two weeks. If it reads the data cleanly and reliably, build one static workflow (Analytics Reporter input step). If it breaks on UI changes or the Haiku model limitation proves real, evaluate Playwright MCP as the serious alternative instead.

Do not build any automated loop using this tool until the 30-day manual rule is satisfied and the prompt-injection and brand-isolation questions above have documented answers.

Cross-links: [[references/articles/2026-06-13_build-your-own-jarvis-toolkit]] · [[references/tools/playwright-mcp]] · [[shared/brand-isolation/POLICY]]
