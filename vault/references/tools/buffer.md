# Buffer

**Category:** Social media scheduling / auto-posting
**URL:** https://buffer.com/
**Captured:** 2026-06-13
**Status:** evaluating — not yet adopted
**Source:** [[references/articles/2026-06-13_build-your-own-jarvis-toolkit]] (chandlerintel "Build Your Own Jarvis" toolkit, row 5)

---

## What it does

Buffer is a social media scheduling and publishing platform. You connect your social accounts (Instagram, TikTok, YouTube, LinkedIn, Facebook, X/Twitter, Pinterest, Threads, and more), queue posts through a calendar interface, and Buffer publishes them at scheduled times. Core features include a post queue, analytics per channel, a link-in-bio page, and an AI writing assistant for caption drafts.

In early 2026 Buffer released a GraphQL API in public beta, which enables third-party automation: you can create and schedule posts via API rather than through the dashboard. This is the hook that makes it relevant to an AI-powered workflow.

## Why it matters for polymath

Buffer is the "auto-post content" node in the Jarvis toolkit. The idea is that the Scheduler agent — the shared agent planned in `ecosystems/shared/agents/` — would produce scheduled posts from upstream content production and hand them off to a tool like Buffer for actual platform delivery. That removes the manual "log into TikTok, paste the caption, pick the time" step that otherwise has to happen for every piece of content on every platform.

Both active ecosystems have a posting need:

- **Content / Signal** posts to YouTube, TikTok, and newsletter on a predictable daily cadence. Each post is associated with one known public brand identity (Signal). Scheduling here is relatively straightforward.
- **Viral / Surge** distributes anonymous AI-generated short-form across TikTok, YouTube Shorts, and Instagram Reels. The volume is higher and the accounts are anonymous — this is where Buffer's account model creates a hard question (see below).

## Where it would fit

- `ecosystems/shared/agents/scheduler/` — the planned Scheduler agent would produce post objects and call Buffer's API (or a Buffer MCP server) to enqueue them.
- Not a fit for the newsletter leg of Content — that runs through a dedicated email platform (beehiiv/Kit/Substack), which handles its own scheduling.
- Not a fit for anything requiring interactive comment management or DMs — Buffer is publish-only.

## Pricing (verify before adopting — may have changed)

As of June 2026 (fetched directly from buffer.com/pricing):

| Plan | Price | Channels | Posts |
|------|-------|----------|-------|
| Free | $0/month | Up to 3 | 10 scheduled per channel |
| Essentials | $5/channel/month (billed monthly) — ~$6/channel on monthly billing; 20% off annually | Per channel | Unlimited |
| Team | $10/channel/month (monthly) | Per channel | Unlimited + approval workflows |

Volume discount: channels 1–10 at standard rate; channels above 10 cost less per channel. 14-day free trial available on paid plans.

At Essentials pricing, running 10 channels across Content + Viral would cost roughly $50–60/month. Running Surge at scale across many anonymous accounts (say, 20+ channels) would scale linearly unless the volume discount offsets it meaningfully. Verify current pricing at buffer.com/pricing before committing.

## Real questions before adopting

1. **Does the account model preserve brand isolation?** This is the hardest question. A single Buffer workspace that aggregates Content channels alongside Surge's anonymous channels creates a cross-account fingerprint. Buffer's backend would hold a mapping between Robin Dutta's billing identity and every anonymous Surge account. If Buffer is ever subpoenaed, breached, or if their support team links accounts, the anonymity of Surge collapses. Separate workspaces (one for Signal, one per Surge vertical, each on a separate email + payment method) may be required — but that multiplies the operational overhead and per-seat cost. Verify whether Buffer allows truly isolated workspaces with no shared billing identity visible across them.

2. **Is the MCP server official or community-built?** As of June 2026, Buffer does not appear to offer an official MCP server maintained by Anthropic or Buffer themselves. What exists are several community-built implementations on GitHub (e.g., `damusix/buffer-mcp`, `ahernan2/buffer-mcp`) that wrap Buffer's GraphQL API. The Jarvis toolkit author's MCP connector is almost certainly one of these community builds. Community MCP servers carry maintenance risk — they may break when Buffer updates its API, and they have no SLA. This is acceptable for experimentation, not acceptable for a production posting pipeline. Flag: verify before wiring into the Scheduler agent.

3. **Does the GraphQL API support all required content types?** The beta API (as of the search results) supports creating posts with text. Whether it supports video uploads, carousel posts, Reels-specific metadata, or TikTok-specific fields at the level Surge would need is unclear. Short-form video scheduling may require platform-native tools or additional API endpoints not yet in the beta. Verify API coverage against the content types Surge will actually produce.

4. **30-day manual rule not yet started.** Nothing is live yet — no Content posts, no Surge content. Per vault doctrine, you must do 30 days of manual posting before automating the posting step. Buffer should not be evaluated for adoption until manual posting has been running long enough to know what the actual scheduling workflow looks like and where the friction is. Right now, adopting Buffer would be automating a process that hasn't been run manually even once.

5. **Does the free tier cover the validation period?** Three channels on the free tier is enough to validate whether Buffer's scheduling actually fits the workflow before paying anything. This is the right starting point if you do move forward.

## Related tools to evaluate alongside

- **Postiz** — open-source, self-hostable Buffer alternative. See [[references/tools/postiz]]. The Jarvis toolkit lists it as the explicit alternative to Buffer. Self-hosting eliminates the cross-account fingerprinting risk for Surge because you control the data store. Higher setup cost; no hosted service overhead.
- **Native platform schedulers** — TikTok, YouTube, and Instagram all offer native scheduling via their creator tools. Zero cost, no third-party data exposure, but no unified interface and no API for agent automation.
- **Later, Hootsuite, Sprout Social** — enterprise-tier scheduling alternatives; likely overkill and more expensive for this use case.

## Verdict

- [ ] Adopt now
- [ ] Test in next product launch
- [x] Park — revisit after 30 days of manual posting have been completed AND the brand isolation question is resolved (separate workspaces vs. Postiz self-host)
- [ ] Reject

The tool itself is credible and the pricing is reasonable for Signal. The blocker is not Buffer — it is that nothing is live yet, the 30-day manual rule hasn't started, and the Surge brand isolation risk has not been resolved. Postiz (self-hosted) may be a better default for Surge specifically because it eliminates third-party data exposure entirely. Revisit this evaluation once manual posting is underway and the Surge account model is designed. See [[shared/brand-isolation/POLICY]] before making any tool decision that touches anonymous account management.
