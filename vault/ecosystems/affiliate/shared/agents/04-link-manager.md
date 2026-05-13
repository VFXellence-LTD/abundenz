# Agent 04 — Link Manager

Manages all affiliate links across Conduit. Generates new links, monitors for broken or changed links, and ensures every piece of content has a valid, trackable affiliate link before it reaches the Scheduler.

Built and activated first — before content is generated.

---

## Responsibility

- Generate affiliate links for all products in the Scout's product list
- Track all active links with metadata
- Monitor daily for broken links (dead products, delisted items)
- Detect commission rate changes
- Provide validated links to Content Generator before content is assembled
- Alert when products are discontinued or commission rates change significantly

---

## Link Database

Maintains a master link registry:

| Field | Type | Notes |
|-------|------|-------|
| link_id | string | Internal unique ID |
| product_slug | string | Human-readable product key |
| product_name | string | Full product name |
| asin | string | Amazon ASIN or equivalent |
| platform | enum | amazon / clickbank / digistore24 / direct |
| raw_affiliate_link | string | Full affiliate link from program |
| tracking_link | string | Short/tracking link (Bitly or equivalent) |
| destination_url | string | Canonical product page URL |
| commission_rate | float | Percentage at last check |
| status | enum | active / dead / paused |
| last_checked | datetime | Last health check timestamp |
| created_date | date | When added |
| notes | string | Any manual observations |

---

## Affiliate Link Generation

### Amazon Associates

Amazon links use the `tag` parameter:
```
https://www.amazon.com/dp/{ASIN}?tag={AMAZON_ASSOCIATES_TAG}&linkCode=ogi&th=1&psc=1
```

Do not use Amazon's link shortener (`amzn.to`) — Amazon's own shortener is acceptable per TOS, but third-party cloakers are not. Use the full URL or Amazon's Native Shopping Ads where appropriate.

**Tracking tags**: Use separate tracking tags per niche if possible (Amazon Associates allows multiple tags per account). This enables per-niche revenue attribution in Analytics.

```
conduit-home-01     → home office niche
conduit-pet-01      → pet products niche
conduit-kitchen-01  → kitchen gadgets niche
```

### Clickbank Links

Clickbank affiliate links:
```
https://{AFFILIATE_ID}.{VENDOR_ID}.hop.clickbank.net/
```

Add `tid` parameter for tracking:
```
https://{AFFILIATE_ID}.{VENDOR_ID}.hop.clickbank.net/?tid={NICHE_CODE}_{PRODUCT_CODE}
```

### Digistore24 Links

```
https://www.digistore24.com/redir/{PRODUCT_ID}/{AFFILIATE_ID}/
```

Track with `st` parameter:
```
https://www.digistore24.com/redir/{PRODUCT_ID}/{AFFILIATE_ID}/?st={NICHE_CODE}
```

### Direct Program Links

Format varies by program. Always include the affiliate parameter (usually `ref=`, `aff_id=`, or `partner=`). Document the exact format per program in the link database notes field.

---

## Link Shortening and Tracking

Use Bitly (or Pretty Links WordPress plugin if blog-based):

**Bitly format**:
```
https://bit.ly/conduit-{NICHE_SHORT}-{PRODUCT_SHORT}
```

**Why track**:
- Bitly provides click data independent of affiliate program reporting
- Allows cross-referencing: if Bitly shows 1000 clicks but affiliate dashboard shows 200, something is wrong
- Provides link-level analytics for Pinterest pin performance

**Note**: Bitly redirects are transparent (301) — they do not hide the affiliate relationship. This is compliant.

**Never use**: Link cloakers that present a non-affiliate URL and mask the destination. This violates Amazon Associates TOS and may violate Pinterest policy.

---

## Daily Health Checks

Run every day at 06:00 UTC:

**Check 1: Link reachability**
For every link in status = active:
```python
response = requests.head(destination_url, allow_redirects=True, timeout=10)
if response.status_code == 404:
    mark_dead(link_id)
    flag_for_scout(product_slug, reason="product_delisted")
elif response.status_code >= 500:
    log_warning(link_id, "server_error")
elif response.status_code == 200:
    update_last_checked(link_id)
```

**Check 2: Amazon product availability (weekly, not daily)**
For Amazon ASINs, check if "Add to Cart" or "Buy Now" button is present. If product shows "Currently unavailable" for 7+ consecutive days, mark as paused and flag for review.

**Check 3: Commission rate change detection (monthly)**
Amazon changes commission rates by category periodically. Monthly: scrape current commission rates table from Associates site, compare to stored rates. Flag any changes >1% for review.

---

## Alerts

Link Manager sends alert (email or Slack) for:

| Event | Urgency | Action Required |
|-------|---------|----------------|
| Product 404 (dead) | High | Remove from active content queue immediately |
| Product "unavailable" for 7 days | Medium | Pause links, Scout to find replacement |
| Commission rate drop >2% | Medium | Review profitability, possibly deprioritise niche |
| Bitly click count diverges from affiliate dashboard >30% | High | Investigate link chain, possible tracking break |
| Any affiliate account suspension notice | Critical | Immediate human review required |

---

## Link Validation Before Content Assembly

When Content Generator requests a link for a product:

1. Look up product_slug in link database
2. Check status = active and last_checked within 24 hours
3. Return tracking_link
4. If status ≠ active: return error, Content Generator skips this product

This ensures no content is generated with broken links.

---

## New Product Link Creation Flow

When Agent 01 (Product Scout) identifies a new product:

1. Scout adds product to database with status = needs_link
2. Link Manager picks up needs_link products in next hourly scan
3. Generates affiliate link based on platform
4. Creates Bitly short link
5. Runs initial health check
6. Updates status to active
7. Product card is now ready for Content Generator

---

## Affiliate Program Account Management

Link Manager also tracks account health (reviewed monthly, not automated):

| Account | Status Check | What to Look For |
|---------|-------------|-----------------|
| Amazon Associates | Associates dashboard | Account in good standing, sales count toward 3-in-180-day requirement |
| Clickbank | Affiliate dashboard | Account active, no holds on payments |
| Digistore24 | Dashboard | Account active, payment schedule confirmed |

**Payment threshold tracking**:
- Amazon Associates: $10 minimum for direct deposit, paid monthly (60-day delay)
- Clickbank: $10 minimum, weekly or bi-weekly, 60-day return window holds commissions
- Digistore24: €25 minimum, bi-weekly

Record payment dates and amounts in [[analytics/]] for tax records.

---

## Failure Handling

| Failure | Action |
|---------|--------|
| Bitly API unavailable | Use raw affiliate link directly, skip short link creation, retry Bitly later |
| Amazon API rate limit on health check | Skip that product in this run, check in next run |
| All checks for a product fail for 3 days | Escalate to manual review, do not auto-kill |
| Affiliate account API auth expired | Alert immediately, halt link generation until resolved |
