# Agent 05 — Analytics

Tracks all performance metrics across platforms, products, and niches. Generates weekly automated reports and monthly P&L statements. Provides the kill/double-down signals used in monthly reviews.

---

## Responsibility

- Aggregate data from Pinterest Analytics, affiliate dashboards, and blog analytics
- Calculate click-through rates per pin and per niche
- Calculate revenue per product, per niche, per platform
- Track ad spend vs. revenue if running Pinterest paid promotion
- Generate weekly automated report
- Generate monthly P&L per niche
- Flag niches for kill or double-down based on 90-day performance

---

## Data Sources

| Source | Data | Access |
|--------|------|--------|
| Pinterest Analytics API | Impressions, outbound clicks, saves, CTR per pin | Pinterest v5 Analytics API |
| Amazon Associates dashboard | Clicks, ordered items, revenue, conversion rate | Associates API or CSV export |
| Clickbank dashboard | Hops, sales, commissions | Clickbank API or CSV export |
| Digistore24 dashboard | Clicks, sales, commissions | API or CSV export |
| Bitly API | Click counts per short link | Bitly API |
| WordPress analytics | Page views, time on page, bounce rate | Google Analytics API or Jetpack |
| Pinterest Ads (when active) | Ad spend, impressions, clicks, ROAS | Pinterest Ads API |

---

## Metrics Hierarchy

### Tier 1 — Revenue Metrics (Care Most)

| Metric | Formula | Target |
|--------|---------|--------|
| Net revenue per niche | Gross commissions – ad spend | Positive after 90 days |
| Revenue per 1000 impressions (RPM) | (Revenue / Impressions) × 1000 | >$0.50 |
| Return on ad spend (ROAS) | Revenue / Ad spend | >3× when running ads |

### Tier 2 — Funnel Metrics (Diagnostic)

| Metric | Formula | Target (when healthy) |
|--------|---------|----------------------|
| Pin outbound CTR | (Outbound clicks / Impressions) × 100 | ≥0.5% |
| Affiliate link CTR | (Affiliate clicks / Bitly clicks) × 100 | ≥80% (if diverging, check redirect chain) |
| Blog conversion rate | (Affiliate clicks / Page views) × 100 | ≥5% |
| Affiliate conversion rate | (Sales / Affiliate clicks) × 100 | Varies by product, typically 1–5% |

### Tier 3 — Vanity Metrics (Monitor Only)

| Metric | Why it's Tier 3 |
|--------|----------------|
| Saves/Repins | Engagement, not revenue |
| Followers | Conduit doesn't need followers |
| Total impressions | Volume without CTR is noise |
| Page views | Without affiliate clicks, irrelevant |

Do not optimise for Tier 3 metrics.

---

## Weekly Automated Report

Generated every Monday at 08:00 UTC. Covers the previous 7 days.

### Report Format

```
CONDUIT WEEKLY REPORT
Week: [YYYY-MM-DD] to [YYYY-MM-DD]
Generated: [DATETIME]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVENUE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total gross revenue:     $[X]
Total ad spend:          $[X]
Net revenue:             $[X]
Month-to-date net:       $[X]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BY NICHE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[NICHE 1]
  Impressions:    [X]
  Outbound CTR:   [X]%
  Affiliate clicks: [X]
  Revenue:        $[X]
  Status:         [OK / WATCH / KILL CANDIDATE]

[NICHE 2]
  ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP PERFORMING PINS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [PIN TITLE] | [NICHE] | CTR: [X]% | Clicks: [X]
2. [PIN TITLE] | [NICHE] | CTR: [X]% | Clicks: [X]
3. [PIN TITLE] | [NICHE] | CTR: [X]% | Clicks: [X]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP PERFORMING PRODUCTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [PRODUCT] | Revenue: $[X] | Units: [X] | Rate: [X]%
2. [PRODUCT] | Revenue: $[X] | Units: [X] | Rate: [X]%
3. [PRODUCT] | Revenue: $[X] | Units: [X] | Rate: [X]%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALERTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Any flagged issues from Link Manager, rate limits, content failures]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT QUEUE STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pending review: [X] pins, [X] blog posts
Approved, unposted: [X] pins, [X] blog posts
Posted this week: [X] pins, [X] blog posts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[List of automated recommendations — human reviews these]
```

Report delivered via email to operator. No login required to read weekly status.

---

## Monthly P&L Report

Generated on the 1st of each month. Covers the previous calendar month.

```
CONDUIT MONTHLY P&L
Month: [MONTH YEAR]

INCOME
━━━━━━━━━━━━━━━━━━━━━━
Amazon Associates:     $[X]
Clickbank:             $[X]
Digistore24:           $[X]
Other:                 $[X]
GROSS INCOME:          $[X]

EXPENSES
━━━━━━━━━━━━━━━━━━━━━━
Claude API:            $[X]
Make.com/n8n:          $[X]
Canva API:             $[X]
Pinterest Ads:         $[X]
Hosting (blog):        $[X]
Domain:                $[X] (annualised monthly)
Bitly:                 $[X]
Other tools:           $[X]
TOTAL EXPENSES:        $[X]

NET PROFIT:            $[X]

BY NICHE
━━━━━━━━━━━━━━━━━━━━━━
[NICHE]  Revenue: $[X]  | Allocated cost: $[X] | Net: $[X] | Margin: [X]%

NOTES
━━━━━━━━━━━━━━━━━━━━━━
[Any platform events, algorithm changes, commission rate changes this month]
```

---

## Kill / Double-Down Signals

Evaluated at 90 days for each niche. Rules are deterministic — no subjective calls.

### Kill Criteria (all three must be true to kill)
1. 90-day net revenue < $0 (costs exceed income)
2. No week in the last 30 days showed positive net revenue
3. Outbound CTR < 0.3% on average across all pins in the niche

**Kill action**: Stop content production for niche. Leave existing content live (may still generate passive clicks). Reallocate content generation budget to top performers.

### Double-Down Criteria
1. 30-day net revenue > $50
2. Outbound CTR ≥ 1.0%
3. At least 2 products in niche generating conversion events

**Double-down action**: Increase pin velocity for this niche by 50%. Expand product range. Consider allocating Pinterest ad budget.

### Watch Criteria
Neither kill nor double-down. Continue monitoring, no budget reallocation.

---

## Pinterest Analytics API Integration

```python
GET https://api.pinterest.com/v5/user_account/analytics
Authorization: Bearer {ACCESS_TOKEN}

Parameters:
  start_date: YYYY-MM-DD
  end_date: YYYY-MM-DD
  metric_types: IMPRESSION,OUTBOUND_CLICK,OUTBOUND_CLICK_RATE,SAVE
  granularity: DAY

# Per-pin analytics:
GET https://api.pinterest.com/v5/pins/{pin_id}/analytics
Parameters:
  start_date: YYYY-MM-DD
  end_date: YYYY-MM-DD
  metric_types: IMPRESSION,OUTBOUND_CLICK,OUTBOUND_CLICK_RATE
```

---

## Affiliate Dashboard Data Collection

Amazon Associates provides an API; Clickbank and Digistore24 primarily provide CSV exports. Make.com can automate CSV download and parsing.

**Amazon Associates API**: Use the `GetOrdersStatistics` endpoint if available, or use the Earnings Report download.

**Clickbank**: Download Transaction Report CSV via scheduled Make.com browser automation. Parse with Python.

**Digistore24**: Same — CSV download automation.

Map all revenue data to the internal link database using product_slug for attribution.

---

## Data Storage

Analytics data stored in Google Sheets (free, accessible, easy for human review):

| Sheet | Contents |
|-------|---------|
| `pin_performance` | Daily metrics per pin |
| `product_revenue` | Daily revenue per product per platform |
| `niche_summary` | Weekly niche-level rollup |
| `monthly_pl` | Monthly P&L table |
| `alerts_log` | All alerts generated |
| `link_health` | Link check results from Agent 04 |

---

## Failure Handling

| Failure | Action |
|---------|--------|
| Pinterest Analytics API unavailable | Use previous week's data with note in report |
| Affiliate dashboard CSV format changed | Alert operator, pause that data source until fixed |
| Google Sheets API write fails | Write to local CSV backup, retry next run |
| Report generation fails | Send plain-text alert: "Weekly report failed to generate. Check analytics dashboard manually." |
