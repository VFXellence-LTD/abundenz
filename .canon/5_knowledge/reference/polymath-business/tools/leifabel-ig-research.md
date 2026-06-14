# Leif Abel — IG Research Tool (remote MCP)

**Category:** Instagram research / trend + competitor intelligence (remote MCP server)
**URL:** https://apply.leifabel.com/ig-research-tool/ — *(accessed via a per-user tokenized MCP link; token REDACTED, never stored)*
**Captured:** 2026-06-14
**Status:** evaluating — NOT connected, NOT adopted; capabilities UNVERIFIED
**Source:** link shared by Boss; originally surfaced via a Facebook/Instagram **ad** (`fbclid` present in the link)

> ⚠️ **Security:** the original link embedded a live `mcp_token` (a JWT credential, ~Apr-2026 expiry). That token is a secret — it is intentionally **NOT** recorded here and must **never** be committed to the repo/vault. To trial this tool, the token goes in MCP config / an env var **outside** the repo, entered by the Boss.

## What it is
A hosted (remote) MCP server marketed as an "IG research tool," delivered as a per-user tokenized URL meant to be added as an MCP connector in an AI client (e.g. Claude). Exact tools/endpoints are **UNVERIFIED** — it was not connected or inspected, because connecting activates the credential and grants the server tool-execution + data access in-session. Verification deferred to the checks below.

## Why it might matter for polymath
Maps to Surge's **Source-Scanner** (agent 01): discovering trending IG content, hooks, competitor accounts, and viral formats to feed `/surge-generate` for the Zrodinger (Tech/AI) vertical. If it reliably surfaces trend/hook data over MCP, it could automate the manual source-scan step. Research/intel only — not a publishing tool.

## ⚠️ Pitfall #7 — "AI passive income" content trap (read before adopting)
This surfaced via a **Meta/Instagram ad**. Per `polymath-pitfalls` #7: tools sold this way usually monetize *teaching*, not *doing*. Verify before trusting:
- Who is "Leif Abel"? Is there a verifiable track record of the tool actually working (vs a course/upsell funnel — note the `apply.` subdomain suggests an application/funnel)?
- What does the MCP actually expose — read-only public research, or does it require IG login/scraping that risks platform ToS and account bans?
- Free / paid / freemium?
- Data handling: what does the remote server see and log about our queries and accounts? (A 3rd party gains visibility into our research intent.)

## Vendor (verified 2026-06-14)

**Who:** Leif Abel is a San Diego-based furniture restoration practitioner (@revisionfurniture, ~93K followers; @leifabel11). Built ReVision Furniture over 7 years — organic IG growth to 125K+ followers, $500K+ in sales. Now pivots to a **personal-brand-as-a-service** business ("I make invisible experts famous") targeting busy professionals, using AI to automate content across 7+ platforms. Also sells restoration courses (educator layer on top of practitioner base).

**Legitimacy read:** Real practitioner with documented results — not a pure course-seller. However, the current pivot is squarely into *teaching/selling personal branding services*, not running IG growth campaigns for others. The IG research tool is a lead-gen asset (surfaced via paid Meta ad, delivered through an `apply.` subdomain funnel) — pitfall #7 pattern is confirmed. He is credible *as a person* but the tool is unproven and the delivery model (tokenized MCP via funnel) is a red flag for a business productivity tool.

**Pricing / access model (verified 2026-06-14):** The landing page at `https://apply.leifabel.com/ig-research-tool/` returned **HTTP 403 Forbidden** to automated fetch — it is not a publicly crawlable page. No pricing is indexed anywhere on the web or on leifabel.com. The `apply.` subdomain + per-user token in the shared link strongly suggests **application-gated access** (likely free-to-apply, with paid tier or upsell behind the application). Status: **pricing UNKNOWN — application/waitlist gate confirmed; free tier unverified**.

## Real questions before any connection
1. **Credentials:** does it need our IG account login, or only public data? Surge accounts are anonymous — **never** feed them to an unverified 3rd party (brand isolation + ToS).
2. **Token scope/expiry** + exactly what the server can do once connected (MCP tools run in-session).
3. **Value vs what we already have:** is it better than **Supadata** (already installed — social transcript/source-scanning MCP) or manual IG search?
4. **Cost + Boss spend approval** if paid.

## Related / alternatives already in stack
- **Supadata** (installed) — social transcript/source MCP, already used for Surge source scanning.
- Manual IG trend scan — the 30-day-manual baseline before any automation.

## Verdict
- [ ] Adopt now
- [ ] Trial-connect (ONLY after the vendor + data-handling + ToS checks above; token via env, never vault)
- [x] Park / evaluate — verify vendor legitimacy + capabilities before any connection
- [ ] Reject

*Related: feeds [[ecosystems/viral]] Source-Scanner. Token handling per the no-secrets-in-vault doctrine.*
