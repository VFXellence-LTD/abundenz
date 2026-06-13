# Affiliate Networks Playbook

Reference for all affiliate programs Conduit may use. Covers how to join, commission structures, approval requirements, and programme-specific gotchas.

---

## Network Comparison Table

| Network | Type | Commission | Payment | Cookie | Approval | Best For |
|---------|------|-----------|---------|--------|----------|---------|
| Amazon Associates | Per-sale | 1–10% (varies by category) | Monthly, 60-day delay, $10 min | 24 hours | Automatic | Physical products, high buyer trust |
| Clickbank | Per-sale | 30–75% | Weekly/bi-weekly, $10 min | 60 days | Automatic | Digital products, info products |
| Digistore24 | Per-sale | 30–70% | Bi-weekly, €25 min | 180 days | Automatic | Digital products, European market |
| Copecart | Per-sale | 30–50% | Monthly | Varies | Manual review | European digital products |
| ShareASale | Per-sale / per-lead | Varies by advertiser | Monthly, $50 min | Varies | Per-advertiser | Branded products, niche brands |
| Impact | Per-sale / per-lead | Varies | Monthly, $10 min | Varies | Per-advertiser | Premium brands, SaaS |
| CJ Affiliate | Per-sale / per-lead | Varies | Monthly, $50 min | Varies | Per-advertiser | Enterprise brands |

---

## Amazon Associates

### Overview
The largest affiliate programme for physical products. Low commission rates but extremely high buyer trust and conversion rates. Amazon's product selection and Prime shipping close sales that other merchants lose.

### How to Join
1. Go to `affiliate-program.amazon.com`
2. Sign in or create an Amazon account
3. Enter website URL (Conduit blog must have content before applying)
4. Enter preferred Associates tag (e.g. `conduit-home-20`)
5. Describe how you drive traffic
6. Account is provisionally active immediately

**Critical**: Account is reviewed after 3 qualifying sales. Must generate 3 sales within 180 days of joining. If not, account is closed and you must re-apply. Do not apply before the blog has content and Pinterest has posts with affiliate links live.

### Commission Rates by Category (verify at activation)

| Category | Rate |
|----------|------|
| Luxury Beauty | 10% |
| Amazon Explore | 10% |
| Furniture, Lawn & Garden, Pet Products, Pantry | 8% |
| Headphones, Beauty, Musical Instruments, Business, Industrial, Scientific | 6% |
| Outdoors, Tools | 5.5% |
| Digital Music, Grocery, Handmade, Sporting Goods | 5% |
| Physical Books, Kitchen, Automotive | 4.5% |
| Amazon Echo, Fire TV, Kindle | 4% |
| Toys, Video Games | 3% |
| PC, PC Components | 2.5% |
| Amazon Fresh, Baby | 3% |
| Televisions, Digital Video Games | 2% |
| Amazon Gift Cards, Alcohol | 0% |

### Key Rules
- No affiliate links in emails, PDFs distributed offline, or any offline media
- No cloaking — links must resolve to amazon.com
- No incentivising clicks
- Do not display Amazon prices in content (prices change; stale price = policy violation)
- Multiple tracking tags allowed — create one per niche for revenue attribution

### Gotchas
- 24-hour cookie: if a buyer visits Amazon through your link but doesn't buy within 24 hours, no commission. (Exception: if they add to cart, cookie extends to 89 days)
- Commission is on total cart value, not just the referred product — if buyer buys other things within 24 hours, you earn on all of it
- Category switches: Amazon has changed commission rates without warning. Monitor Associates newsletter.
- Account can be terminated without warning for TOS violation. Keep screenshots of all disclosures.

### Tracking Tags Strategy
```
conduit-home-20      → home office niche
conduit-pet-20       → pet products niche  
conduit-kitchen-20   → kitchen gadgets niche
conduit-fitness-20   → fitness gear niche
conduit-baby-20      → baby products niche
```
Create all tags before generating content. Link Manager uses the correct tag per niche.

---

## Clickbank

### Overview
Marketplace for digital products (courses, ebooks, software). High commission rates (30–75%) make individual sales worth $50–$500+. Lower volume but significantly higher revenue per conversion than Amazon.

**Gravity score**: Clickbank's proprietary metric. Higher Gravity = more affiliates making sales recently. Use Gravity as a proxy for product viability (product converts for affiliates). Gravity 50+ is generally solid; 100+ is a strong product.

### How to Join
1. Go to `clickbank.com` → Sign Up → Choose Affiliate
2. Complete account setup — nickname becomes your affiliate ID
3. No website verification required
4. Access Marketplace immediately

### Finding Products
- Go to Marketplace, filter by category and sort by Gravity
- Review the vendor's sales page — does it look credible? Good sales copy = good conversions
- Check refund rate if visible (lower is better; high refund = bad product)
- Look for products with 60-day money-back guarantee (Clickbank standard) — reduces buyer risk

### Commission Structure
- Most products: 50–75%
- Some have upsell sequences — you may earn commission on upsells too
- Recurring billing products: commission on initial sale, optionally on recurring payments (varies by vendor)

### Generating Affiliate Links
```
Affiliate URL format:
https://{AFFILIATE_NICKNAME}.{VENDOR_NICKNAME}.hop.clickbank.net/

With tracking ID:
https://{AFFILIATE_NICKNAME}.{VENDOR_NICKNAME}.hop.clickbank.net/?tid={NICHE}_{PRODUCT}

Example:
https://conduit1.vendorx.hop.clickbank.net/?tid=fitness_course
```

### Payment
- Minimum: $10 (direct deposit) or $100 (cheque)
- Frequency: weekly (after first 90 days and meeting minimum threshold)
- Return window: 60-day money-back guarantee means commissions are held ~60 days before release
- New account pay frequency: bi-weekly until account history established

### Gotchas
- Quality varies enormously. Many Clickbank products are low-quality info products. Scout must evaluate each product's sales page and reviews before promoting.
- Some products make aggressive income claims — avoid these (FTC liability)
- Clickbank can pull products from marketplace at any time. Link Manager must monitor.
- Promoting certain product categories (health, weight loss) requires careful content — no cure claims.

---

## Digistore24

### Overview
European-focused digital product marketplace. Similar to Clickbank but with stronger European presence and GDPR compliance built in. Good for digital products targeting European buyers.

### How to Join
1. `digistore24.com` → Become an Affiliate
2. Account verified automatically for most affiliates
3. European VAT handled by Digistore24 — one less compliance issue

### Products
- Digital courses, software, online services
- Some German-language only products — filter for English if targeting US audience
- Commission rates: 30–70%

### Affiliate Link Format
```
https://www.digistore24.com/redir/{PRODUCT_ID}/{AFFILIATE_ID}/

With tracking:
https://www.digistore24.com/redir/{PRODUCT_ID}/{AFFILIATE_ID}/?st={TRACKING_CODE}
```

### Payment
- Minimum: €25
- Frequency: bi-weekly (14 days)
- Currency: EUR (if bank account is USD, conversion fees apply — factor in)

### Gotchas
- 180-day cookie — very long, great for content with longer consideration cycles
- GDPR compliance required for EU audience targeting — ensure blog has privacy policy and cookie consent
- Some products are available in multiple currencies; commission rate applies to the currency the buyer pays in

---

## Copecart

### Overview
Newer European digital product platform. Growing marketplace, particularly for German-language digital products and courses. Less saturated than Clickbank.

### How to Join
1. `copecart.com` → Affiliate Registration
2. Manual review process — may take 1–3 days
3. Some vendors require separate approval even after platform approval

### Products
- Digital courses, software, coaching
- Commission: 30–50%
- Strong in German-speaking market but has English products

### Payment
- Monthly, varies by vendor

### Gotchas
- Manual review means cannot join day-of-activation — apply early
- Smaller marketplace = fewer products to choose from, but less affiliate competition

---

## ShareASale

### Overview
Network aggregator with hundreds of individual advertiser programmes. Useful for brand-name products that aren't on Amazon or Clickbank. Physical and digital products, services.

### How to Join
1. `shareasale.com` → Affiliate Signup
2. Account approved (manual review, typically 1–2 business days)
3. Each advertiser programme requires separate application — approval varies

### Products
- Wide variety: fashion, home goods, software, services
- Commission structure varies by advertiser (per-sale, per-lead, per-click)
- Rate range: 5–30% typical

### Payment
- Minimum: $50
- Frequency: monthly (around the 20th)

### Approval Tips
- Have a functioning website with real content before applying to individual programmes
- Some advertisers require minimum monthly traffic — if asked, start with programmes that don't specify this
- Approve time varies: same day to 2 weeks depending on advertiser

### Gotchas
- Some programmes have inactive thresholds — if no sales in X months, account deactivated
- Commission rates can be changed by advertisers mid-partnership
- Affiliate link format varies by advertiser

---

## Impact

### Overview
Premium affiliate network used by major brands (Levi's, HP, Airbnb, etc.). Higher quality products, higher buyer trust, more competitive to join.

### How to Join
1. `impact.com` → Affiliate / Publisher signup
2. Manual review: apply with functioning website and traffic data
3. Each brand requires separate partnership application

### Products
- Premium and enterprise brands
- Commission rates often lower percentage but on higher-value items
- Mix of per-sale and per-lead

### Best Use Case
Phase 2+, when blog has measurable SEO traffic. Impact advertisers want sites with traffic.

---

## Programme Priority at Activation

At activation, join these first:

1. **Amazon Associates** — required for validation phase, immediate approval
2. **Clickbank** — immediate access, start researching products
3. **Digistore24** — quick approval, start with European digital products

Join later (Phase 2):
4. **ShareASale** — once blog has content and traffic
5. **Impact** — once blog has measurable SEO traffic (3–6 months in)
6. **Copecart** — apply early for the manual review, onboard when ready

---

## Payment Processing Setup

Each affiliate network pays to a different account. At activation:

1. Set up a dedicated bank account for Conduit (separate from personal and Signal)
2. Set up PayPal if preferred by networks (Clickbank option)
3. Use the same bank account across all affiliate networks — simplifies tax reporting
4. Record all payment dates and amounts as they arrive — see [[agents/05-analytics]] for tracking

Tax ID (EIN or SSN) required by all US affiliate programmes. W-9 form will be requested.
