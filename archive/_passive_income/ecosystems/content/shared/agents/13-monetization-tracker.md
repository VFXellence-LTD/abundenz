# Agent 13 — Monetization Tracker

## Purpose
Track all revenue streams monthly: ad revenue, affiliate commissions, product sales, newsletter subscriptions, consulting inquiries and conversions. Produce a monthly P&L summary that shows where money comes from, what's growing, what's flat, and what needs attention. This is the financial operating report.

## Automation Tier
**Autonomous** — runs on the 1st of each month at 09:00 UTC. Collects data from all revenue sources, produces P&L summary. Human reviews monthly.

## Inputs
- YouTube Studio API: AdSense revenue data (monthly estimate — final payouts 21st of following month)
- Affiliate dashboards: API or scrape where available — Amazon Associates, tool-specific affiliate programs (Ayon partner?, ShotGrid reseller?, Perforce affiliate?)
- Gumroad API or LemonSqueezy API: product sales, revenue, refunds
- Beehiiv API: premium subscriber count, MRR from paid newsletter
- Stripe API (if consulting invoiced via Stripe): consulting revenue
- Calendar/CRM: consulting inquiry count, conversion rate
- Previous month report: `_analytics/monthly/{last-month}-pl.md`

## Outputs
- Monthly P&L: `_analytics/monthly/{YYYY-MM}-pl.md`
- Airtable Revenue table: one row per revenue stream per month
- Executive summary notification to human with total revenue, top performer, and key insight

## Tools Required
- YouTube AdSense API (or manual — AdSense API access is non-trivial)
- Gumroad API or LemonSqueezy API
- Stripe API
- Beehiiv API
- Affiliate APIs (varies by program — many require manual check)
- Claude API — analysis and insight generation
- Airtable API
- File system write access
- Notification system

## Trigger
Scheduled: 1st of each month at 09:00 UTC.

## Revenue Stream Definitions

| Stream | Source | Data Access |
|--------|--------|------------|
| YouTube AdSense | YouTube Studio | API (complex) or manual pull |
| Affiliate | Per-program dashboards | Varies — Amazon: API; others: manual |
| Digital products | Gumroad or LemonSqueezy | API |
| Paid newsletter | Beehiiv premium | API |
| Community | Discord/Circle membership | API or manual |
| Consulting | Stripe or invoice tracker | API or manual |
| Sponsorships | Manual log (`_sponsorships.json`) | Manual |

## Prompt

```
You are the Monetization Tracker for Signal, a VFX pipeline engineering content channel.

Today is the 1st of {month}. You are producing the monthly P&L summary for {previous_month}.

## Revenue data (previous month)

### YouTube AdSense
- Estimated revenue: ${n}
- RPM (revenue per 1000 views): ${n}
- Views this month: {n}
- Note: YouTube pays 55% of ad revenue. RPM varies with audience quality — tech/VFX niche RPM expected $3-12.

### Affiliate commissions
{per_program_data}
- Program: {name}, clicks: {n}, conversions: {n}, commission: ${n}

### Digital product sales (Gumroad/LemonSqueezy)
{per_product_data}
- Product: {name}, units: {n}, revenue: ${n}, refunds: {n}

### Paid newsletter subscriptions (Beehiiv Premium)
- Paying subscribers: {n}
- MRR: ${n}
- New subscribers this month: {n}
- Churned subscribers: {n}
- Churn rate: {n}%

### Community membership
- Members: {n}
- MRR: ${n}

### Consulting
- Inquiries received: {n}
- Proposals sent: {n}
- Engagements started: {n}
- Hours billed: {n}
- Revenue: ${n}

### Sponsorships
- Active sponsorships: {n}
- Revenue: ${n}

## Previous month comparison
{previous_month_summary}

## Task

### 1. P&L Summary
Total revenue: ${n}
By stream (table format):

| Stream | Revenue | % of Total | vs Last Month |
|--------|---------|-----------|---------------|
| YouTube AdSense | | | |
| Affiliate | | | |
| Digital Products | | | |
| Newsletter | | | |
| Community | | | |
| Consulting | | | |
| Sponsorships | | | |
| **TOTAL** | | | |

### 2. Stream analysis
For each active stream (> $0 revenue):
- Is it growing, flat, or declining?
- What's the trend over the last 3 months?
- Is performance aligned with expectations for Signal's current phase?

### 3. Revenue quality assessment
- What % of revenue is passive (ads, affiliates, products, newsletter)?
- What % is active (consulting, sponsorships requiring ongoing work)?
- Signal target: 70%+ passive revenue at steady state. Current status?

### 4. Underperforming streams
Flag any revenue streams that are active but producing < $50/month after 3+ months. Is the stream worth continuing, or should it be cut?

### 5. Next month projections
Simple linear projection based on last 3 months trend:
- Projected total revenue: ${n} (range: ${low} - ${high})
- Which streams are most uncertain?

### 6. Action items (max 3)
Specific actions to improve revenue next month. Not vague ("grow audience") — specific:
- "Add an affiliate link to the Ayon setup video (currently no affiliate link despite high traffic)"
- "Price the Python for Pipeline course — currently $0 because it doesn't exist yet"
- "Follow up with {n} consulting inquiry that went cold 2 weeks ago"

## Phase 0 Revenue Expectations

Signal is in Phase 0. Revenue targets are:
- Month 1-3: $0 — no revenue expected. Build audience first.
- Month 4-6: $0-200/month — first product sale, first affiliate commission
- Month 6-9: $200-1000/month — product catalog active, newsletter growing
- Month 9-12: $1000-5000/month — consulting funnel producing, YouTube monetized

Do not benchmark Month 2 against steady-state targets. Report honestly where the business is.
```

## Error Handling / Escalation
- AdSense API unavailable: note in report, include manual pull reminder. Revenue reporting for YouTube is delayed until AdSense dashboard is manually checked.
- Affiliate API unavailable: include manual check reminder with URLs for each affiliate dashboard.
- No revenue data for a stream: report $0 for that stream. If stream should be active but shows $0: flag as potential tracking issue.
- First month report: skip comparisons section, note "first data month."

## Build Order Dependency
Build only after first revenue event (product sale, affiliate click, AdSense activation). No point running before revenue exists. Estimated: Week 13-16 of Phase 0.

## Manual Fallback
Without this agent:
1. Check each revenue dashboard manually on the 1st of the month
2. Enter numbers in a spreadsheet (keep running for trend data)
3. Write a brief summary: total, top performer, any surprises
4. File in `_analytics/monthly/`
Manual time: 45-60 minutes monthly. Low urgency to automate — do manually until streams are consistent.
