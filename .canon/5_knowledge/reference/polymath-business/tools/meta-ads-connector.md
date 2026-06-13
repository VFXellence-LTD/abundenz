# Meta Ads Connector

**Category:** Paid advertising automation / Meta Ads API connector
**URL:** https://www.facebook.com/business/news/meta-ads-ai-connectors
**Captured:** 2026-06-13
**Status:** parked — out of scope until Phase 3+ (paid ads)
**Source:** [[references/articles/2026-06-13_build-your-own-jarvis-toolkit]] (chandlerintel "Build Your Own Jarvis" toolkit, row 7; row 6 = Meta developer app + access token for IG analytics — distinct use case, see below)

---

## What it does

Meta launched an official AI Connectors program in open beta on 29 April 2026. It exposes a Model Context Protocol (MCP) server at `mcp.facebook.com/ads` that gives Claude (and other AI agents) direct read/write access to a Meta ad account. The server surfaces 29 tools covering four areas: performance reporting, campaign management, catalog management, and signal diagnostics. In plain terms, Claude can read live campaign metrics, draft new campaigns, adjust budgets, and create or pause ad sets — all through natural language.

Two important safety guardrails ship by default: newly created campaigns and ad sets are placed in a paused state, meaning nothing goes live without a human activating it manually in Ads Manager. There is no Marketing API approval process required for the MCP path — standard Meta Business account access is sufficient.

**Do not conflate this with toolkit row 6.** Row 6 is a separate credential setup: a Meta developer app plus a long-lived access token handed to Claude for reading Instagram organic analytics (reach, impressions, follower growth). That is read-only analytics access on organic content — no ad spend, no campaign management. Row 7 (this file) is the paid ads control plane. They share the Meta platform but are architecturally and financially completely different.

---

## Why it matters for polymath

It matters because paid advertising is the growth lever that every organic content business eventually considers once it has validated demand and positive unit economics. At that point, being able to instruct Claude to audit a campaign, adjust targeting, or pause an underperforming ad set without opening Ads Manager is a genuine operational advantage. The connector makes that plausible at a cost of zero (MCP server is free in open beta; Claude Pro/Max/Team plan required for MCP).

It does not matter right now. Polymath is in Content Phase 0 and Viral design phase. Nothing is live. There is no validated demand, no revenue, and no unit economics to optimise against. Spending money on paid acquisition at this stage violates the foundational constraint: validated demand first. An ad budget spent before knowing what converts is not an investment — it is a signal-destroying experiment that also costs money.

The row-6 analytics token is a different story and has nearer-term relevance. Feeding organic Instagram reach and engagement data into the Analytics Reporter agent is useful even in Phase 0, because it helps calibrate what organic content is working before any spend decision is made. That piece can be evaluated and adopted independently of this file.

---

## Where it would fit

- **Phase 3+ only** — after at least one ecosystem reaches validated Phase 2 revenue and a paid acquisition test is explicitly approved by Boss.
- **Controller layer** — any Claude agent given access to this connector must be wired into the Controller's budget oversight system. Hard budget caps are not optional; they are a prerequisite for granting spend authority to an agent.
- **Ecosystem routing** — which ecosystem would run ads? Content (Signal brand) is the most natural candidate for a Phase 3 audience-acquisition push. Viral (Surge) brands could theoretically run paid promotion, but that requires anonymous payment isolation — see brand isolation constraints below.
- **Vault location when active** — agent config would live in the relevant ecosystem's `agents/` folder, not in shared, because ad creative, targeting, and budget are brand-specific.

---

## Pricing (verify before adopting — may have changed)

The Meta Ads MCP server itself is free during open beta. Claude Pro ($20/mo), Claude Max ($100/mo), or a Team/Enterprise plan is required to use MCP integrations — Claude's free tier does not support MCP connections. The meaningful cost here is not the tooling; it is the ad spend itself, which is real money leaving the account on a schedule an AI agent can influence. That is the financial exposure to model carefully before enabling this.

Meta's Ads API rate limits and any future connector pricing are worth verifying at adoption time.

---

## Real questions before adopting

1. **Is there validated demand to advertise into?** If there is no organic proof that an audience exists and converts, paid ads will amplify uncertainty, not resolve it. Confirm Phase 2 revenue before considering Phase 3 spend.

2. **What are the hard budget caps, and how are they enforced?** A Claude agent with ad spend authority must operate under explicit controller oversight: alert Boss at 80% of monthly budget, hard-pause all spending at 100%. This is non-negotiable. The controller budget oversight mechanism must be built and tested before the connector is enabled.

3. **Does the paused-by-default guardrail cover all spend paths?** Meta's MCP server pauses newly created campaigns, but what about budget increases on existing campaigns, or reactivating a paused campaign? Verify the full scope of what the agent can do without triggering the pause state before granting live access.

4. **Which brand runs the ads, and is the payment identity isolated?** Content (Signal) ads would be fine under the Signal brand. Surge/Viral ads must keep payment and identity fully isolated from Signal and from the owner's personal identity. A single Stripe account or Facebook Business account spanning multiple brands violates the brand isolation policy. Confirm the payment separation is already in place before enabling ad spend for any Surge brand.

5. **AI avatar in paid ads — is a separate brand set up?** The voice/avatar policy is clear: AI avatars in paid ads are only permitted under a brand that is separate from the owner's Content identity. If any paid ad creative uses an AI-generated presenter, it cannot appear under the Signal brand. This requires a dedicated brand entity to be established first, which is additional overhead.

6. **Is there a human review step in the campaign approval workflow?** Meta's paused-by-default guardrail is a soft protection. A formal internal process — Boss reviews and explicitly activates every new campaign — needs to be documented and followed, not just implied.

7. **What does attribution look like?** Paid ad ROI cannot be assessed without tracking conversions back to ad spend. Confirm that the ecosystem has working revenue attribution before running any paid test, otherwise there is no signal to optimise against.

---

## Related tools to evaluate alongside

- **Native Meta Ads Manager** — the no-code baseline. Before wiring up an MCP connector, be comfortable running and reading campaigns manually. The connector adds leverage only once the underlying workflow is understood.
- **Row 6 / IG analytics token** (see [[references/articles/2026-06-13_build-your-own-jarvis-toolkit]], row 6) — the read-only Instagram analytics credential. Nearer-term relevance than this connector. Evaluate this first; it feeds the Analytics Reporter agent and informs organic content strategy before any spend decisions are made.
- **Meta Business Suite reporting** — built-in cross-account analytics before a custom analytics layer is warranted.
- **Third-party ad intelligence tools** (e.g. AdSpy, Minea) — useful at Phase 3 for competitive research before committing spend, but out of scope until then.

---

## Verdict

- [ ] Adopt now
- [ ] Test in next product launch
- [x] Park — revisit when an ecosystem reaches Phase 3 and paid acquisition is validated
- [ ] Reject

**Park rationale:** No validated demand, no live revenue, and no unit economics to optimise against. Ad spend at this stage would destroy signal, not create it. The connector is architecturally sound and worth returning to when Phase 3 criteria are met: at least one ecosystem generating consistent Phase 2 revenue, Boss-approved paid acquisition test plan, controller budget caps in place, and brand payment isolation confirmed.

The row-6 IG analytics token (organic read-only) is a separate evaluation and should not be blocked by this park decision. See [[references/articles/2026-06-13_build-your-own-jarvis-toolkit]] for the full toolkit context and [[shared/brand-isolation/POLICY]] for payment and identity isolation requirements that apply to any future paid ads work.
