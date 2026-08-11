# Agent 05: Analytics

**Role:** Track product performance across all marketplaces, generate weekly reports, and recommend what to scale or kill. Runs on schedule; fully autonomous.

---

## Schedule

| Run | Frequency | Output |
|-----|-----------|--------|
| Data sync | Daily (03:00 UTC) | Refresh sales/revenue data from all marketplaces |
| Weekly report | Monday 07:00 UTC | Full P&L, performance analysis, recommendations |
| Monthly report | 1st of month 07:00 UTC | Full month summary, niche-level P&L, kill/scale decisions |

---

## Data Sources

| Marketplace | Method | Data available |
|-------------|--------|---------------|
| Etsy | Etsy Open API v3 — `/v3/application/shops/{shop_id}/transactions` | Orders, revenue, refunds, listing stats |
| KDP | KDP Sales Dashboard (export CSV) or KDP Kindle Unlimited reports | Sales, pages read, royalties |
| Redbubble | Redbubble API (limited) or manual CSV export | Sales, revenue by product |
| Gumroad | Gumroad API v2 — `/v2/sales` | Sales, revenue, refunds |
| Printful | Printful API — `/v2/orders` | Order costs, product COGS |

---

## Metrics Tracked Per Product

| Metric | Description |
|--------|-------------|
| Units sold | Count per period (daily / weekly / monthly) |
| Gross revenue | Sale price × units (before fees) |
| Net revenue | After marketplace fees, COGS (POD), and production cost amortized |
| Margin % | Net revenue / Gross revenue |
| Refund rate | Refunds as % of orders |
| Review count | Cumulative reviews received |
| Average rating | Mean star rating |
| Impressions | Listing views where available (Etsy provides this) |
| Click-through rate | Clicks / impressions (Etsy provides this) |
| Conversion rate | Orders / clicks |
| Days since last sale | Staleness indicator |

---

## Metrics Tracked Per Niche

| Metric | Description |
|--------|-------------|
| Total products in niche | Count of live listings |
| Niche revenue (monthly) | Sum of net revenue across all products in niche |
| Best performer | Product with highest net revenue in niche |
| Worst performer | Product with lowest conversion or zero sales |
| Average margin | Mean margin across niche |
| Refund rate | Niche-level refund rate |
| Trend | Revenue trending up / flat / down (3-month rolling) |

---

## Weekly Report Prompt

```
You are the Analytics agent for Atelier, an anonymous AI-generated product business.

Today's date: {{DATE}}
Reporting period: {{START_DATE}} to {{END_DATE}}
Sales data: {{SALES_DATA_JSON}}
Product catalog: {{PRODUCT_CATALOG_JSON}}
Active niches: {{NICHE_LIST}}

Generate a weekly performance report covering:

1. HEADLINE NUMBERS
   - Total gross revenue this week
   - Total net revenue this week (after all fees)
   - Total units sold
   - Overall margin %
   - Week-over-week change (%)

2. TOP PERFORMERS (top 5 products by net revenue)
   For each: product name, marketplace, units, net revenue, margin %, conversion rate

3. WORST PERFORMERS (bottom 5 by conversion rate, minimum 100 impressions)
   For each: product name, marketplace, impressions, conversion rate, days listed, recommendation

4. NICHE SUMMARY TABLE
   | Niche | Products | Revenue | Margin | Trend | Action |

5. ALERTS (any threshold breached)
   - Refund rate >5% on any product
   - Revenue drop >30% WoW on any niche
   - Zero sales for 30+ days on any product
   - New review <3 stars

6. RECOMMENDATIONS
   - Scale: list 1-3 products/niches to expand (more variations, higher ad spend if running ads)
   - Kill: list 1-3 products to unpublish (criteria: >60 days, <3 sales, no improvement trend)
   - Test: list 1-2 A/B pricing or title tests to run next week

Output as markdown. Keep under 800 words. Tables over walls of text.
```

---

## Monthly Report Prompt

```
You are the Analytics agent for Atelier.

Month: {{MONTH}} {{YEAR}}
Full month data: {{MONTHLY_DATA_JSON}}
Previous month data: {{PREV_MONTH_DATA_JSON}}
Year-to-date data: {{YTD_DATA_JSON}}

Generate a monthly P&L and strategic review:

1. MONTHLY P&L
   | Line | Amount |
   |------|--------|
   | Gross revenue | |
   | Marketplace fees | |
   | COGS (POD print costs) | |
   | Production costs (AI tools, subscriptions) | |
   | Net profit | |
   | Net margin % | |

2. NICHE P&L TABLE
   | Niche | Products | Gross | Fees | COGS | Net | Margin% | MoM Change |

3. KILL LIST
   Products meeting kill criteria: <5 sales in 60 days, no improving trend
   Include: product name, total revenue earned, total days listed, recommendation (kill/give 30 more days)

4. SCALE LIST
   Products with >5% conversion rate or consistent weekly sales growth
   Recommendation: add variations / optimize listing / expand to additional marketplace

5. NEW NICHES TO TEST
   Based on Niche Researcher's monthly output, list 2-3 niches recommended for next month's production run

6. INFRASTRUCTURE COSTS THIS MONTH
   | Tool | Cost |
   |------|------|
   | Claude API | |
   | Midjourney / Flux | |
   | Canva Pro | |
   | Placeit | |
   | Make.com / n8n | |
   | Total | |

7. NEXT MONTH PRIORITIES
   3 bullet points. Specific actions, not vague goals.

Keep under 600 words excluding tables.
```

---

## Kill Criteria

Automatically flag products for kill recommendation:

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Zero sales | 60 days listed, 0 sales | Kill recommendation |
| Very low conversion | >200 impressions, <0.5% conversion, no trend improvement | Kill recommendation |
| Chronic refunds | Refund rate >8% over 30+ days | Kill recommendation |
| Negative reviews | Average rating <3.0 after 5+ reviews | Kill recommendation |
| Policy flag | Marketplace flags listing for policy review | Immediate escalation to owner |

Kill = unpublish listing; do not delete (preserve data). Archive to `analytics/killed/` with reason and date.

---

## Scale Criteria

Flag products for expansion:

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Strong conversion | >3% conversion rate, 30+ days | Create 5 variations in same niche |
| Consistent weekly sales | >5 units/week, 4+ consecutive weeks | Add to adjacent marketplace |
| Trending niche | 50%+ revenue increase MoM | Increase production throughput for niche |
| High review velocity | >1 new review/week | Prioritize in listings (Etsy lets shops feature items) |

---

## Revenue Thresholds (targets, not guarantees)

When activated, aim for these at 6-month mark:

| Milestone | Target |
|-----------|--------|
| Break-even on tool costs | Month 1-2 |
| $100/month net | Month 3 |
| $500/month net | Month 6 |
| $1,000/month net | Month 12 |

These are starting benchmarks. Actual results depend entirely on niche selection and volume.

---

## Data Storage

Analytics database (Airtable preferred for ease, SQLite acceptable for cost):

Tables:
- `products` — catalog of all listings with metadata
- `sales` — daily sales records per product
- `niches` — niche-level aggregates
- `reports` — archive of weekly/monthly reports
- `killed_products` — archive with kill reason and date

---

## Related Documents

- [[04-publisher]] — notifies analytics when new listing goes live
- [[01-niche-researcher]] — receives kill/scale signals for next research cycle
- [[workflows/kdp-pipeline]] — KDP-specific analytics notes
