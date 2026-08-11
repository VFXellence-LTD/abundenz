# Entity Strategy

One LLC, multiple brands. Maximum granularity within platform constraints.

---

## Legal Structure

```
VFXellence Ltd (LLC)
  └── DBA: Abundenz (parent brand / domain — not public-facing)
        ├── Zrodinger        → Surge (viral content + affiliate)
        │     ├── vertical: tech / AI tools
        │     ├── vertical: kitchen / home gadgets
        │     ├── vertical: scary stories
        │     ├── vertical: lullaby / bedtime ← content vertical, not separate brand
        │     ├── vertical: stoic / motivation
        │     └── ...all verticals share same accounts
        ├── Ateliez          → Atelier (POD designs / Etsy)
        └── [Signal brand]   → Signal (VFX pipeline content)
```

**VFXellence Ltd** = legal entity on all tax docs, bank, LLC filing
**Abundenz** = internal umbrella brand, owns the domain (abundenz.com), routes emails
**Each sub-brand** = public-facing identity, operates independently, Z-naming convention
**Lullaby** = content vertical under Zrodinger, not a separate brand. Safeguards still apply (see [[ecosystems/lullaby/safeguards/POLICY]])

---

## Constraints

| Resource | Count | Shared Across |
|----------|-------|---------------|
| LLC (VFXellence Ltd) | 1 | All brands |
| Bank account | 1 | All brands |
| Phone number | 1 | All brands (up to 3 TikTok accounts) |
| Device | 1 | All brands |
| SSN/EIN | 1 | All brands |

---

## Brand → Account Mapping

### Zrodinger (Conduit — tech affiliate)

| Platform | Handle/ID | Email | Notes |
|----------|-----------|-------|-------|
| TikTok | @zrodinger | zrodinger@abundenz.com | Account 1 of 3 on phone |
| YouTube | @zrodinger | zrodinger@abundenz.com | Channel under main Google |
| Instagram | @zrodinger | zrodinger@abundenz.com | Account 1 of 5 on device |
| Pinterest | @zrodinger | zrodinger@abundenz.com | Business account |
| X/Twitter | @zrodinger | zrodinger@abundenz.com | |
| Reddit | zrodinger | zrodinger@abundenz.com | |
| Threads | @zrodinger | (linked to Instagram) | |
| Amazon Associates | Store ID: `zrodinger-20` | (shared account) | Tracking ID per brand |
| Blog | zrodinger.abundenz.com | — | Subdomain or Medium |

### Ateliez (Atelier — POD designs)

| Platform | Handle/ID | Email | Notes |
|----------|-----------|-------|-------|
| Etsy | Ateliez | ateliez@abundenz.com | 1 store, sections per line |
| Printify | Ateliez | ateliez@abundenz.com | Connected to Etsy |
| Pinterest | @ateliez | ateliez@abundenz.com | Product pins → Etsy |
| Instagram | @ateliez | ateliez@abundenz.com | Account 2 of 5 |
| TikTok | @ateliez | ateliez@abundenz.com | Account 2 of 3 (product showcases) |
| Redbubble | Ateliez | ateliez@abundenz.com | |
| Amazon Associates | Store ID: `ateliez-20` | (shared account) | Same Associates account, different tag |

### Signal Brand TBD (Signal — VFX pipeline)

Z-name candidates: **Synthezis**, **Teknikz**, **Pipelinez**, **Forj** (forge with implied Z sound)

| Platform | Handle/ID | Email | Notes |
|----------|-----------|-------|-------|
| YouTube | @[signalbrand] | [signal]@abundenz.com | Primary platform (long-form) |
| Blog/Newsletter | [signal].abundenz.com | [signal]@abundenz.com | Ghost or beehiiv |
| GitHub | [signalbrand] | [signal]@abundenz.com | Open-source pipeline tools |
| X/Twitter | @[signalbrand] | [signal]@abundenz.com | Industry presence |
| LinkedIn | [signalbrand] | [signal]@abundenz.com | Professional audience |
| Instagram | @[signalbrand] | [signal]@abundenz.com | Account 3 of 5 |
| Gumroad | [signalbrand] | [signal]@abundenz.com | Digital products |
| Amazon Associates | Store ID: `[signal]-20` | (shared account) | Tool affiliate links |

### Lullaby Brand TBD (Lullaby — bedtime stories)

Z-name candidates: **Whizperz**, **Snoozville**, **Dreamz**, **Lullabyz**, **Slumberz**

| Platform | Handle/ID | Email | Notes |
|----------|-----------|-------|-------|
| YouTube | @[lullabybrand] | [lullaby]@abundenz.com | Made for Kids designation |
| Spotify | [lullabybrand] | [lullaby]@abundenz.com | Audio-only podcast |
| TikTok | @[lullabybrand] | [lullaby]@abundenz.com | Account 3 of 3 on phone |
| Instagram | @[lullabybrand] | [lullaby]@abundenz.com | Account 4 of 5 |

---

## Shared Accounts (1 account, multiple tracking IDs)

| Platform | Account | Tracking Separation |
|----------|---------|-------------------|
| Amazon Associates | 1 account (VFXellence Ltd) | Store IDs: `zrodinger-20`, `ateliez-20`, `[signal]-20` |
| Stripe | 1 account (VFXellence Ltd) | Products tagged by brand |
| Google Analytics | 1 GA4 property | Separate data streams per brand domain |
| Cloudflare | 1 account | Routes all abundenz.com subdomains |

---

## Email Routing (Cloudflare Email Routing on abundenz.com)

```
zrodinger@abundenz.com    → personal Gmail
ateliez@abundenz.com      → personal Gmail
[signal]@abundenz.com     → personal Gmail
[lullaby]@abundenz.com    → personal Gmail
hello@abundenz.com        → personal Gmail (catch-all)
```

All forward to same inbox. Outbound replies: use alias or set up Google Workspace later ($6/mo) when revenue justifies it.

---

## Platform Limits Cheat Sheet

| Platform | Max Accounts | Our Usage | Headroom |
|----------|-------------|-----------|----------|
| TikTok | 3 per phone | Zrodinger + Ateliez + Lullaby | Full (Signal uses YouTube/X not TikTok) |
| Instagram | 5 per device | 4 brands | 1 spare |
| YouTube | Unlimited channels | 4 channels under 1 Google | Unlimited |
| Pinterest | Unlimited biz accounts | 2-3 active | Unlimited |
| Amazon Associates | 1 per SSN/EIN | 1 account, 4 Store IDs | N/A |
| Etsy | 1 per SSN/EIN | 1 store (Ateliez) | N/A |
| Stripe | 1 per entity | 1 account | Add accounts when LLCs split |

---

## Future: LLC Split

When any brand hits ~$30k/yr:
1. Form new LLC for that brand
2. Get separate EIN
3. Open separate bank account
4. Separate Stripe account
5. Can now have separate Etsy store, Amazon seller account, etc.
6. Update brand isolation: truly separate legal entities

**Order of likely splits:**
1. Zrodinger/Conduit (fastest to revenue)
2. Ateliez/Atelier (if POD takes off)
3. Signal (consulting revenue may justify)
4. Lullaby (last — slowest ramp)
