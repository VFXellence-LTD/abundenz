# Brand Provisioning Checklist

Executable steps to stand up a new brand/vertical under the Abundenz umbrella. Governed by `brand-umbrella.md`. Run top to bottom; each brand repeats sections 2–6.

Cost note: sections 1–6 are free except the optional storefront/email-scaling items flagged with 💲.

---

## 0. One-time foundation (do once for the whole umbrella)

- [ ] Confirm `abundenz.com` zone is active in Cloudflare (DNS managed there)
- [ ] Confirm Cloudflare WHOIS/registrant privacy is on (default — verify)
- [ ] Apex `abundenz.com` → umbrella landing page (Cloudflare Pages / Carrd / static host)
- [ ] Create ONE Google account to own all YouTube channels (e.g. a Workspace user on `abundenz.com`, or a dedicated personal Google login). Record it in the controller secrets store.
- [ ] Create ONE Google AdSense account, linked to the above. **Never create a second.**
- [ ] Create ONE Amazon Associates account (only if running affiliate). List properties as they launch.
- [ ] Create ONE Meta Business Suite / Business Manager to hold all Pages.
- [ ] Set up email **receiving**: enable Cloudflare Email Routing on `abundenz.com` (free, unlimited addresses → forward to your real inbox).
- [ ] Set up email **sending**: create Zoho Mail free org on `abundenz.com` (free, up to 5 mailboxes). 💲 If >5 sending identities needed later, switch to Migadu (flat price, unlimited).

---

## 1. Decide the brand's identity (before touching infrastructure)

- [ ] Pick ecosystem ID (`content` / `viral` / `products` / `affiliate` / `lullaby`)
- [ ] Pick public persona/brand name and subdomain label (e.g. `tech` → `tech.abundenz.com`)
- [ ] Pick email alias (e.g. `zrodinger@abundenz.com`)
- [ ] Define distinct visual identity: logo, palette, fonts, bio tone (must differ from sibling brands)

---

## 2. DNS (Cloudflare)

- [ ] Add subdomain record `<name>.abundenz.com`:
  - Static site → CNAME to Cloudflare Pages project, or A/AAAA to host
  - Shopify store → CNAME per Shopify's DNS instructions
- [ ] Proxy status: orange-cloud (proxied) for sites you host; grey-cloud for third-party (Shopify) per their docs
- [ ] Verify resolution: `nslookup <name>.abundenz.com`

## 3. Email for the brand

- [ ] Cloudflare Email Routing: add custom address `<alias>@abundenz.com` → forward to real inbox (receiving)
- [ ] Zoho: add mailbox `<alias>@abundenz.com` if this brand needs to **send** (sales, support, replies)
- [ ] Add SPF / DKIM / DMARC records (Zoho provides exact values) so sent mail isn't spam-flagged
- [ ] Send + receive test from the new address

## 4. Social / platform accounts

- [ ] **YouTube:** in the one Google account, create a new Brand Account channel for this brand. Link to the single AdSense.
- [ ] **Meta:** add a new Page in Business Suite (Instagram + Facebook) for this brand
- [ ] **TikTok:** create per-brand account (own login/email alias)
- [ ] **X:** create per-brand account if used
- [ ] Set each profile bio/links to point at `<name>.abundenz.com` and `<alias>@abundenz.com`
- [ ] Use the brand's distinct logo/handle everywhere — no shared assets across brands

## 5. Storefront (products/affiliate only)

- [ ] **Products:** Printify store under the one Printify account
  - 💲 Sell via Shopify on `store.abundenz.com` (paid), or Etsy, or free Printify pop-up store
- [ ] **Affiliate:** add the brand's site to the one Amazon Associates account; apply to other affiliate programs as needed
- [ ] **FTC:** add clear affiliate/sponsored disclosure to every page and post — mandatory

## 6. Register in the controller

- [ ] Add the brand to the controller/dashboard with its ecosystem ID
- [ ] Record subdomain, email, account handles, and credentials in the secrets store
- [ ] Set per-ecosystem revenue/expense tracking category
- [ ] Confirm brand appears in the private cross-brand controller view (never published)

---

## Hard limits to never break

- **One** AdSense account, **one** Amazon Associates account — multiples = ban.
- No duplicate content across brands — distinct content each.
- FTC disclosure on all affiliate/sponsored content.
- New brand = new subdomain + email. **No new domain purchase** until a brand has independent revenue.

---

## Last reviewed: 2026-06-25 (created alongside brand-umbrella.md)
