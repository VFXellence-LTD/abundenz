# Brand Umbrella Policy

**Supersedes:** `brand-isolation.md` (2026-05-13). That policy mandated complete isolation across all ecosystems. This policy replaces it.

**Decision date:** 2026-06-25
**Decided by:** Boss (Robin Dutta)

## The decision

All ecosystems operate publicly under a single **Abundenz** umbrella on the shared `abundenz.com` domain, differentiated by subdomain and email address. Common ownership is transparent, not hidden.

## Why this replaces brand isolation

Two reasons drove the change:

1. **Cost.** `abundenz.com` is already owned (Cloudflare). Cloudflare gives unlimited subdomains and unlimited email addresses on that one domain at no extra cost. Isolation would have required buying, registering, and maintaining a separate domain per ecosystem — recurring cost and admin overhead for a pre-revenue system.
2. **Anonymity is not paramount.** The old isolation thesis rested on protecting anonymity (Conduit/affiliate) and protecting a personal-voice trust premium (Signal) from contamination by AI-volume content (Surge). The Boss has determined anonymity is not a priority. With that constraint removed, the primary justification for separate domains, handles, and entities falls away.

## What this means in practice

- **One domain, many subdomains.** Each ecosystem (and each vertical that needs its own face) gets a subdomain of `abundenz.com`.
- **One email domain.** Brand and function addresses are all `@abundenz.com`.
- **Transparent common ownership.** No effort spent hiding that one operator runs all brands. If asked, "Yes, these are all Abundenz" is the correct answer.
- **One legal entity.** VFXellence-LTD owns everything. One set of books, per-ecosystem internal tracking in the controller. A brand spins into its own LLC only if it independently clears ~$30k/year.

## Subdomain + email naming scheme

Ecosystem IDs stay literal internally (`content`, `viral`, `products`, `affiliate`, `lullaby`). Public-facing subdomains and personas can differ.

| Ecosystem (ID) | Subdomain | Primary email | Notes |
|----------------|-----------|---------------|-------|
| umbrella / hub | `abundenz.com` | `hello@abundenz.com` | Landing page, about, contact |
| viral — tech vertical | `tech.abundenz.com` | `zrodinger@abundenz.com` | Zrodinger persona (already chosen) |
| products | `store.abundenz.com` | `store@abundenz.com` | Printify / tshirts |
| content | `content.abundenz.com` | `content@abundenz.com` | Signal persona |
| affiliate | `go.abundenz.com` | `go@abundenz.com` | FTC disclosure mandatory |
| lullaby | `lullaby.abundenz.com` | `lullaby@abundenz.com` | Design phase |
| future verticals | `<name>.abundenz.com` | `<name>@abundenz.com` | One subdomain + email per new face |

Rule: a new brand or vertical = one new subdomain + one new email alias. No new domain purchase, ever, until a brand has independent revenue justifying its own identity.

## Rules retained from the old policy

These survived the switch because they remain true regardless of isolation:

1. **Distinct visual identity and voice per brand.** Common ownership is fine; lazy sameness is not. Each subdomain gets its own look, tone, and content so audiences self-select and each brand earns its own trust. Do not reuse the same logo, palette, or bio across brands.
2. **FTC affiliate disclosure is mandatory.** Every affiliate or sponsored piece carries a clear disclosure. Transparency of ownership does not remove this — it does not change.
3. **Singular-account platforms stay singular.** ONE Google AdSense account links to all YouTube channels. ONE Amazon Associates account lists all properties. Creating a second of either is a ban risk.
4. **No spam / inauthentic behavior.** Platforms ban coordinated manipulation, fake engagement, duplicate content, and ban-evasion — not multiplicity. Each brand posts genuine, distinct content.
5. **Controller is the private cross-brand view.** Dashboards, budgets, and analytics are the only place all brands appear together. Private infrastructure — not published.

## Rules dropped from the old policy

- Different domains per ecosystem — replaced by shared-domain subdomains.
- "No subdomain sharing" — reversed; subdomain sharing is now the model.
- Different LLC/entity per brand at low revenue — now one entity until ~$30k/year per brand.
- Conduit/Surge anonymity requirements — dropped (anonymity not paramount).
- No-cross-promotion-ever — relaxed; cross-promotion under the shared umbrella is allowed (still optional per brand strategy).

## Reversal clause

If a future brand outgrows the umbrella (independent revenue, conflicting positioning, or a sale), it can be split onto its own domain and identity. Document that split in this folder before acting, same as this policy documented the consolidation.

---

## Last reviewed: 2026-06-25 (created — supersedes brand-isolation.md)
