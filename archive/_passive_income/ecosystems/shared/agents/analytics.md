# Shared Agent — Analytics Reporter

## Purpose

Universal revenue and performance tracking across all ecosystems. Each ecosystem has its own metrics, but this agent consolidates into a single view for the controller dashboard.

## Automation tier

Fully autonomous. Runs weekly (Sunday night), produces Monday morning brief.

## Used by

- **Content**: YouTube analytics, newsletter metrics, product sales, consulting revenue
- **Products**: Etsy/KDP/Gumroad sales, refund rates, listing performance
- **Affiliate**: Click-through rates, conversion rates, commission revenue per network

## Inputs

- Platform API data (YouTube Studio, Etsy Stats, KDP Dashboard, beehiiv, Gumroad, affiliate dashboards)
- Manual transaction entries (from Polymath dashboard)
- Tool cost data (subscription tracking)

## Outputs

### Weekly Report
- Revenue by ecosystem (Content / Products / Affiliate)
- Revenue by stream within each ecosystem
- Top 3 performers and bottom 3 performers (content pieces, products, affiliate links)
- Week-over-week growth rate
- Monthly burn rate (tool subscriptions + ad spend)
- Net profit

### Monthly Report
- P&L statement per ecosystem
- YTD totals
- Tax-relevant categorization (see [[compliance/tax-categories]])
- Kill-switch indicator check (see [[controller/kill-switch-criteria]])
- Recommended actions (scale what's working, kill what isn't)

## Prompt

```
You are the Polymath Analytics Reporter. Analyze the following data from all active ecosystems and produce a consolidated performance report.

Data provided:
{revenue_data}

Report structure:
1. HEADLINE — one sentence summary of the week (up, down, flat, milestone hit)
2. REVENUE TABLE — by ecosystem, by stream, this week vs last week
3. TOP PERFORMERS — 3 items driving the most revenue or growth
4. UNDERPERFORMERS — 3 items to consider killing or adjusting
5. BURN RATE — total tool/subscription costs this month
6. NET — revenue minus costs
7. KILL-SWITCH CHECK — any ecosystem approaching pause/shutdown criteria?
8. RECOMMENDED ACTIONS — 3 specific things to do this week

Be specific with numbers. No motivational language. Flag problems early.
```

## Tools required

- YouTube Data API v3
- Etsy Open API v3
- Amazon KDP reports (manual CSV export until API available)
- Gumroad API
- beehiiv API
- Affiliate network dashboards (manual or API where available)
- Google Sheets or SQLite for aggregation

## Trigger

Scheduled: weekly (Sunday 23:00 UTC). Also on-demand via dashboard button.

## Error handling

If a platform API is unreachable, report with available data + flag missing source. Never skip the report — partial data is better than no data.
