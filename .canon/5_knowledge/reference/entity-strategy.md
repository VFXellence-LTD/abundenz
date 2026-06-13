> Salvaged from _passive_income 2026-06-05. Overlaps polymath/vault ecosystems (lullaby vertical in this doc = polymath canonical). Dedupe TODO — see [[3_notes/dedupe-passive-income-vs-polymath]].

# Entity Strategy

One LLC, multiple brands. Maximum brand granularity within platform constraints.

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
**Lullaby** = content vertical under Zrodinger, not a separate brand

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

### Zrodinger (Surge — tech affiliate / viral content)

| Platform | Handle/ID | Email | Notes |
|----------|-----------|-------|-------|
| TikTok | @zrodinger | zrodinger@abundenz.com | Account 1 of 3 on phone |
| YouTube | @zrodinger | zrodinger@abundenz.com | Channel under main Google |
| Instagram | @zrodinger | zrodinger@abundenz.com | Account 1 of 5 on device |
| Pinterest | @zrodinger | zrodinger@abundenz.com | Business account |
| X/Twitter | @zrodinger | zrodinger@abundenz.com | |
| Reddit | zrodinger | zrodinger@abundenz.com | |
| Amazon Associates | Store ID: `zrodinger-20` | (shared account) | |

### Ateliez (Atelier — POD designs)

| Platform | Handle/ID | Email | Notes |
|----------|-----------|-------|-------|
| Etsy | Ateliez | ateliez@abundenz.com | 1 store, sections per line |
| Printify | Ateliez | ateliez@abundenz.com | Connected to Etsy |
| Pinterest | @ateliez | ateliez@abundenz.com | Product pins → Etsy |
| Instagram | @ateliez | ateliez@abundenz.com | |
| TikTok | @ateliez | ateliez@abundenz.com | Account 2 of 3 |
| Amazon Associates | Store ID: `ateliez-20` | (shared account) | |

### Signal Brand TBD (VFX pipeline content)

Z-name candidates: Synthezis, Teknikz, Pipelinez, Forj

---

## Shared Accounts (1 account, multiple tracking IDs)

| Platform | Account | Tracking Separation |
|----------|---------|-------------------|
| Amazon Associates | 1 account (VFXellence Ltd) | Store IDs per brand |
| Stripe | 1 account (VFXellence Ltd) | Products tagged by brand |
| Google Analytics | 1 GA4 property | Separate data streams per brand domain |
| Cloudflare | 1 account | Routes all abundenz.com subdomains |

---

## Email Routing (Cloudflare on abundenz.com)

All forward to personal Gmail. Separate outbound per brand when revenue justifies Google Workspace.

---

## Platform Limits Cheat Sheet

| Platform | Max Accounts | Our Usage | Headroom |
|----------|-------------|-----------|----------|
| TikTok | 3 per phone | Zrodinger + Ateliez + Lullaby | Full |
| Instagram | 5 per device | 4 brands | 1 spare |
| YouTube | Unlimited channels | 4 channels under 1 Google | Unlimited |
| Pinterest | Unlimited biz accounts | 2-3 active | Unlimited |
| Amazon Associates | 1 per SSN/EIN | 1 account, multiple Store IDs | N/A |
| Etsy | 1 per SSN/EIN | 1 store (Ateliez) | N/A |

---

## Future: LLC Split

When any brand hits ~$30k/yr: form new LLC, separate EIN, separate bank + Stripe. Order of likely splits: Zrodinger/Conduit → Ateliez → Signal → Lullaby.

---

## Brand Isolation

See [[D:/VFXellence-LTD/polymath/vault/shared/brand-isolation/POLICY.md]] for the full isolation policy. Brand isolation is non-negotiable.

## Z-Naming

See [[D:/VFXellence-LTD/polymath/vault/shared/brand-naming.md]] for the Z-naming convention and active name assignments.
