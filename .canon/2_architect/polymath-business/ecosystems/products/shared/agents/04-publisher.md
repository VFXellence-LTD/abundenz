# Agent 04: Publisher

**Role:** Publish approved listings to marketplaces and configure fulfillment. Runs only after human review gate is passed. Handles Etsy, KDP, Redbubble, and Gumroad.

**GATE:** This agent runs ONLY after owner has reviewed and approved the listing package from [[03-listing-optimizer]]. Never run autonomously without explicit approval.

---

## Inputs

- Approved listing package from [[03-listing-optimizer]] (listing.json + mockups + source files)
- Owner approval signal (manual flag in queue, or Airtable/Notion approval status)
- Marketplace target from listing.json

---

## Outputs

- Published listing URL(s) per marketplace
- Published product ID logged to analytics database
- Confirmation pushed to [[05-analytics]] to begin tracking

---

## Marketplace Handlers

### Etsy Handler

**Tool:** Etsy Open API v3 (OAuth 2.0)

Steps:
1. Create listing draft via `POST /v3/application/shops/{shop_id}/listings`
2. Upload images via `POST /v3/application/shops/{shop_id}/listings/{listing_id}/images`
3. Upload digital files (if digital product) via `POST /v3/application/shops/{shop_id}/listings/{listing_id}/files`
4. Activate listing: set `state: "active"` on create or patch afterward

**Required fields from listing.json:**
```json
{
  "title": "...",
  "description": "...",
  "tags": ["...", "..."],
  "price": 6.00,
  "quantity": 999,
  "who_made": "i_did",
  "when_made": "made_to_order",
  "is_supply": false,
  "is_digital": true,
  "type": "download"
}
```

**Shipping:** Not required for digital listings. For POD, Etsy listing connects to Printful — Printful auto-creates shipping profiles once OAuth integration is set.

**Printful integration (for POD):**
- Connect Etsy shop to Printful via Printful dashboard
- Create Printful product via Printful API: `POST /v2/products`
- Sync creates corresponding Etsy listing automatically
- Alternative: use Printful → Etsy sync directly (no custom code needed for basic POD)

---

### KDP Handler

**Tool:** KDP does not have a public API. Upload is manual or semi-automated.

**Semi-automation options:**
- KDP bulk upload tool (CSV + ZIP for interior/cover files) — available in KDP dashboard
- Selenium/Playwright automation for browser-based upload (fragile, use cautiously)

**Preferred workflow:**
1. Publisher prepares upload package: interior PDF, cover PDF, metadata CSV
2. Owner uploads to KDP manually (5-10 minutes per title)
3. Publisher logs KDP ASIN to analytics once live

This is the one workflow where full automation is not practical without violating KDP ToS risk. Keep it semi-manual.

**Metadata CSV structure for KDP bulk:**
```
title, subtitle, author, description, keywords, category_1, category_2, language, publication_date, price_usd
```

---

### Redbubble Handler

**Tool:** Redbubble does not have a public upload API. Options:

- **Redbubble "Add New Work" flow** — browser-based, semi-automated via Playwright
- **Redbubble's bulk upload** — CSV tool for existing shops (requires shop to be established)

**Semi-automated approach:**
1. Publisher formats design file (PNG, transparent background, correct dimensions)
2. Publisher creates listing_data object (title, description, tags)
3. Owner uploads via Redbubble UI (or Playwright bot if account ToS permits)
4. Publisher logs Redbubble URL to analytics

**Redbubble image specs:**
- Minimum 1500×1995px for most products
- PNG with transparency preferred (enables product-specific cropping)
- 7500×10050px for maximum quality across all products

---

### Gumroad Handler

**Tool:** Gumroad API (v2, REST)

Steps:
1. Create product: `POST /v2/products`
2. Upload product file: `POST /v2/products/{product_id}/product_files`
3. Upload cover image: via `product[cover_url]` field or dashboard

**Required fields:**
```json
{
  "product": {
    "name": "...",
    "description": "...",
    "price": 1500,
    "url": "...",
    "published": true
  }
}
```

Price in cents (1500 = $15.00).

---

## Pricing Strategy

At publish time, Publisher executes pricing logic from [[03-listing-optimizer]]:

```
1. Pull current median price for niche (from Niche Researcher weekly cache)
2. Apply shop tier pricing:
   - If shop reviews < 25: median × 0.85 (undercut by 15%)
   - If shop reviews 25-100: median
   - If shop reviews > 100: median × 1.10
3. Round to nearest .99 or .00 based on niche convention
   (digital art: .99 pricing common; premium items: .00 or .95)
4. Log recommended vs. actual price
```

---

## Fulfillment Configuration

**Digital products (Etsy):**
- Digital files attached at listing level — Etsy delivers automatically on purchase
- No fulfillment configuration needed beyond file upload

**POD via Printful (Etsy + Shopify):**
- Printful syncs with Etsy/Shopify via native integration
- Design file uploaded to Printful; Printful creates mockup + product listing
- On sale: Printful auto-fulfills, handles printing + shipping
- Publisher logs Printful product ID alongside Etsy listing ID

**KDP:**
- Amazon handles all print-on-demand fulfillment (KDP Select or wide distribution)
- Publisher sets distribution channels: Amazon + Expanded Distribution if applicable
- Expanded Distribution = libraries, bookstores — small additional royalty, no downside for most titles

---

## Post-Publish Checklist

After each listing goes live:

- [ ] Verify listing URL accessible (HTTP 200)
- [ ] Verify price displays correctly
- [ ] Verify AI disclosure present in description
- [ ] Verify at least 5 mockup images display
- [ ] Log to analytics database: {product_id, title, marketplace, publish_date, niche, price}
- [ ] Notify [[05-analytics]] to begin tracking

---

## Error Handling

| Error | Action |
|-------|--------|
| API rate limit | Retry after 60s, max 3 retries; log failure |
| File size exceeds limit | Compress/resize, retry; alert owner if unresolvable |
| Listing rejected by platform | Log rejection reason; route back to Listing Optimizer for revision |
| Payment/auth error | Alert owner immediately; pause queue |
| Duplicate listing detected | Skip; log as duplicate; do not re-publish same ASIN/listing |

---

## Related Documents

- [[03-listing-optimizer]] — provides approved listing packages
- [[05-analytics]] — receives publish confirmation, begins tracking
- [[workflows/kdp-pipeline]] — KDP-specific publish steps
- [[workflows/pod-pipeline]] — POD publish steps
