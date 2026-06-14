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
