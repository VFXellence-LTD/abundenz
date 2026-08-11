# Agent 12 — Analytics Reporter

## Purpose
Generate a weekly analytics brief every Friday: views, engagement rates, subscriber growth, top-performing content, platform-by-platform breakdown, and early-signal trend identification. The brief is the primary tool for content strategy decisions — what to make more of, what to cut, where to invest.

## Automation Tier
**Autonomous** — runs every Friday at 18:00 UTC. Outputs to file and Airtable. Human reads over the weekend and uses it to inform Monday's topic selection.

## Inputs
- YouTube Analytics API: views, watch time, subscriber delta, CTR, audience retention by video
- Beehiiv Analytics API: subscriber count, open rate, click rate by issue, unsubscribe delta
- Ghost Analytics (or Google Analytics): blog views, unique visitors, time on page, bounce rate by post
- Buffer/Publer Analytics: impressions, engagements, link clicks by platform
- Airtable Content Pipeline: which pieces posted this week, scheduled times
- Previous weekly report: `_analytics/weekly/{last_friday}-report.md` — for trend comparison

## Outputs
- Weekly report: `_analytics/weekly/{date}-report.md`
- Airtable Analytics table: summary row with key metrics
- Notification to human (Slack/email): "Weekly report ready"

## Tools Required
- YouTube Analytics API (part of YouTube Data API v3)
- Beehiiv API
- Ghost API or Google Analytics API (GA4)
- Buffer/Publer API
- Claude API — insight generation, trend identification
- Airtable API
- File system write access
- Notification system

## Trigger
Scheduled: every Friday at 18:00 UTC.

## Prompt

```
You are the Analytics Reporter for Signal, a VFX pipeline engineering content channel in early growth phase.

Today is {date}. This is week {n} of Signal's launch.

## This week's published content
{content_published_this_week}

## Raw metrics (all platforms, past 7 days)

### YouTube
{youtube_metrics}
- Views: {n}
- Watch time: {n} hours
- Subscribers gained: {n} (lost: {n}, net: {n})
- CTR (impressions to clicks): {n}%
- Average view duration: {n}% of video length
- Top video by views: {title} ({n} views)
- Top video by retention: {title} ({n}% avg retention)

### Newsletter (Beehiiv)
{newsletter_metrics}
- Subscribers: {n} (change from last week: {+/-n})
- Open rate this week: {n}%
- Best-performing issue: {title} ({n}% open rate)
- Click rate: {n}%
- Unsubscribes: {n}

### Blog (Ghost/GA4)
{blog_metrics}
- Pageviews: {n}
- Unique visitors: {n}
- Top post: {title} ({n} views)
- Average time on page: {n} min
- Bounce rate: {n}%

### Social (LinkedIn, X, Instagram)
{social_metrics}
- LinkedIn: {n} impressions, {n} engagements, {n} link clicks
- X: {n} impressions, {n} engagements, {n} link clicks
- Instagram: {n} reach, {n} saves, {n} profile visits

## Previous week comparison
{previous_week_summary}

## Task

### 1. Platform performance summary
For each platform: what happened this week? Better or worse than last week? Why (if you can tell)?

### 2. Content performance winners
Top 3 performing pieces this week across all platforms. What made them perform? (Length? Topic? Format? Distribution timing?) Specific, not vague.

### 3. Content performance laggards
Bottom 3 performing pieces. Same question: why? Is it topic, format, distribution, or just normal variance?

### 4. Trend identification
Looking at the last 4 weeks of data (use comparison data):
- What content themes are consistently performing?
- What content themes are underperforming?
- Is watch time trending up or flat?
- Is there a day-of-week pattern emerging in performance?

### 5. Action recommendations
3-5 specific, actionable recommendations for next week:
- Format: "[DO MORE/LESS/CHANGE]: [specific action]"
- Examples: "DO MORE: tool comparison content — 3 of top 5 this month are comparisons"
- Examples: "CHANGE: newsletter send day from Wednesday to Tuesday — open rates 15% lower on Wed"
- Do not recommend vague improvements ("improve content quality"). Be specific.

### 6. Revenue signal (if monetization is live)
Any patterns in traffic that correlate with product page visits or consulting inquiries? Note if newsletter click-through to product pages increased.

## Output format
Produce a clean, scannable markdown report. Use tables for metrics. Use bold for key numbers. The human reads this on a Friday evening — make it skimmable in 5 minutes, with the action items up front.

## Tone
Data-first. No congratulations, no motivation. If something is underperforming, say so directly. If the data is too early to draw conclusions (Phase 0, low volume), say that too.
```

## Benchmark Reference (Phase 0, Weeks 1-12)

Low-volume expectations for a new technical channel — do not compare to mature channels:

| Metric | Acceptable (Week 4) | Target (Week 12) |
|--------|---------------------|-----------------|
| YouTube subscribers | 50-100 | 250-500 |
| YouTube views/week | 200-500 | 1000-2000 |
| Newsletter subscribers | 50-100 | 200-400 |
| Newsletter open rate | 30-45% | 35-50% |
| Blog pageviews/week | 100-300 | 500-1000 |

Note: VFX pipeline is a small niche. 10,000 subscribers is a large channel in this space. Don't optimize for mass-market metrics.

## Error Handling / Escalation
- API data unavailable for one platform: report on available platforms, note unavailable data. Do not delay report.
- API returns empty data (no content posted this week): produce minimal report noting no content activity, with recommendation to post.
- Data looks anomalous (e.g. 10x normal views — likely bot traffic): flag explicitly, do not celebrate as success. Note platform for investigation.
- First report (no previous week for comparison): skip trend analysis section, note "insufficient historical data."

## Build Order Dependency
Requires active platforms and at least 2 weeks of live data. Build Week 9-10 of Phase 0.

## Manual Fallback
Without this agent:
1. Open YouTube Studio → Analytics → 28-day view
2. Open Beehiiv dashboard → Analytics
3. Open GA4 → Last 7 days
4. Copy key numbers into a text file
5. Write 3-5 observations and recommendations
Manual time: 30-45 minutes. Do this weekly regardless — the agent just saves the time.
