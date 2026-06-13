# Gmail MCP

**Category:** Email integration / inbox automation (MCP connector)
**URL:** https://developers.google.com/workspace/gmail/api/guides/configure-mcp-server
**Captured:** 2026-06-13
**Status:** evaluating — not yet adopted
**Source:** [[references/articles/2026-06-13_build-your-own-jarvis-toolkit]] (chandlerintel "Build Your Own Jarvis" toolkit, row 8: "read your inbox"; alternative listed = Google Workspace CLI)

---

## What it does

Gmail MCP is a Model Context Protocol connector that gives Claude (or any MCP-compatible AI client) direct access to a Gmail inbox via Google's official Gmail API. It allows an AI agent to read messages, search threads, retrieve attachments, and — depending on implementation — compose drafts, send replies, manage labels, and archive mail, all through natural language commands.

There is no single official server. As of mid-2026, Google has published an official Gmail MCP server under the Google Workspace developer docs (linked above). There are also several well-maintained community implementations (GongRzhe/Gmail-MCP-Server on GitHub is a widely forked reference; Composio hosts a managed version). All use OAuth 2.0 against the Gmail API. The Google-hosted server requires a Claude Enterprise, Pro, Max, or Team plan to connect via Claude.ai remote MCP. The self-hosted community servers can be wired into Claude Desktop or Claude Code without a plan restriction.

The "alternative" listed in the source toolkit row is the **Google Workspace CLI** — a separate Google-maintained tool for managing Workspace resources from the command line. It is more administrative in scope (user provisioning, Drive, Docs) and less suited to per-message inbox automation than the Gmail API-based MCP servers.

## Why it matters for polymath

Polymath will eventually need a customer-support layer as each ecosystem accumulates an audience. Right now nothing is live and there is no real customer mail to triage — but when revenue starts flowing, someone (human or agent) needs to handle replies. The Jarvis toolkit pairs row 8 (read inbox) with row 9 (answer customers in your voice from a markdown knowledge base), and that pairing is the core of a lightweight operator-layer support workflow.

This connector would serve the **operator/controller layer**, not any individual ecosystem agent. It sits one level above the ecosystem pipelines and would route incoming customer enquiries (returns, collab requests, account issues) to the right place without Robin having to monitor multiple inboxes manually.

## Where it would fit

- **Controller layer** — `controller/` is the only place in the vault where all ecosystems appear together. An inbox-reading agent that triages incoming mail across ecosystem support addresses fits here.
- **Candidate path:** `ecosystems/shared/agents/` for a future Customer Support Agent that reads a designated support inbox, matches enquiries to ecosystem knowledge base entries, drafts a reply for Robin to approve, and logs the ticket.
- **Not relevant to** the content pipeline, the Surge short-form pipeline, or the product listing workflow. Those are outbound, not inbound.

## Pricing (verify before adopting — may have changed)

- **Google's official Gmail API:** Free within standard quota limits (1 billion quota units per day, which is effectively unlimited for low-volume personal use). No cost to call the API.
- **Google Cloud OAuth credentials:** Free to create in Google Cloud Console. Requires a Google Cloud project — no billing needed unless other paid APIs are enabled.
- **Claude.ai remote MCP hosting** (to use Google's hosted server): Requires Claude Pro, Max, Team, or Enterprise plan. Claude Pro is $20/mo as of capture date — verify current pricing.
- **Self-hosted community server** (e.g. GongRzhe/Gmail-MCP-Server run locally via Claude Desktop): No additional cost beyond Claude plan already in use.
- **Composio managed connector:** Has a free tier; paid tiers for higher volume — verify before adopting.

For polymath purposes, the self-hosted path is likely sufficient and lowest cost. The Google-hosted remote server adds convenience but requires a paid Claude plan.

## Real questions before adopting

1. **Is there real customer mail to triage yet?** Nothing is live. No audience, no customers, no support volume. This is premature until at least one ecosystem reaches Phase 1 and has a public contact channel. Do not build support infrastructure for an audience that doesn't exist.

2. **Read vs. send — where is the risk boundary?** Reading the inbox is low-risk: Claude sees mail, surfaces summaries, suggests actions. Sending on Robin's behalf is a side-effectful action that requires explicit per-message approval. Never configure auto-send. Any implementation must require Robin to approve each outbound reply before it is dispatched.

3. **Brand isolation — one connector or many inboxes?** Each ecosystem must have its own separate public-facing contact email (see [[shared/brand-isolation/POLICY]]). A single Gmail connector spanning all ecosystem support inboxes risks blending identities at the data layer even if the outbound brands stay separate. The safer architecture is one dedicated support address per ecosystem, each with its own OAuth credential scope, or a single aggregator inbox that is strictly internal (never public-facing).

4. **Where do OAuth credentials live?** Credentials and tokens must NEVER be stored in this vault. OAuth client secrets, refresh tokens, and app passwords belong in environment variables or a secret store (e.g. Windows Credential Manager, 1Password, a `.env` file outside the repo). This is a hard vault rule. Verify the chosen MCP server's default token storage location before wiring it up — some community servers write tokens to a local JSON file; make sure that file is gitignored and outside the vault directory.

5. **Inbox privacy scope.** A Gmail connector granted broad access sees all mail in the account — personal, professional, sensitive. Scope the OAuth grant to the narrowest set of permissions the use case requires (e.g. read-only on a specific label or filtered inbox, not full `https://mail.google.com/` scope). Prefer a dedicated support-only Gmail account over connecting a personal inbox.

6. **Which server to use?** The official Google-hosted server is the most stable long-term but requires a paid Claude plan. The GongRzhe community server is the most widely forked and documented for self-hosting. Composio offers a managed path with less setup friction but adds a third-party dependency. Evaluate against current plan and trust tolerance — verify before adopting.

## Related tools to evaluate alongside

- **Google Workspace CLI** — the toolkit row 8 alternative. Better suited to Workspace admin tasks than per-message inbox automation. Evaluate if the need shifts from customer support to workspace management.
- **Zapier / Make** — if the inbox routing logic is simple (e.g. forward support mail to a Notion database), a no-code router may be enough without an MCP server at all.
- **Notion MCP / Asana MCP** — the ticket destination. Pairing Gmail MCP (input) with Asana or Notion (output) creates a basic triage loop: read mail → create task → Robin resolves → reply sent with approval.
- **Row 9 knowledge base tool** (from same toolkit) — the other half of the "answer customers in your voice" pattern. Gmail MCP is the intake; the knowledge base is the reply source. Neither is useful without the other.

## Verdict

- [ ] Adopt now
- [ ] Test in next product launch
- [x] Park — revisit when at least one ecosystem has a live public contact channel and actual support volume
- [ ] Reject

The connector is technically sound and the official Google-backed version is a credible long-term foundation. The blocker is timing: no live ecosystems, no customers, no real inbox to triage. Building support infrastructure now would violate the core doctrine of no adoption before validated demand. When Content (VFX Pipeline) or Viral (Surge) reaches Phase 1 and a support inbox goes live, revisit this note — at that point, the read-only intake pattern paired with the row 9 knowledge base becomes worth a focused test.

When that time comes: start with a dedicated support-only Gmail account (not the personal inbox), use the self-hosted community server, scope OAuth to read-only, require explicit approval for every outbound reply, and keep all credentials outside the vault.
