# Shared Agent: Trend Scanner

Cross-ecosystem trend detection. Monitors social media, news, and search trends. Feeds Signal (topic ideas) and Surge (content sources). Each ecosystem decides independently what to do with the output.

## Purpose

Surface what's trending RIGHT NOW in configurable niche categories. Output is a ranked list of trending topics with velocity scores and source links. No content generation — only detection.

## Automation Tier

**Autonomous** — runs on schedule (daily or more frequent). Human reviews digest.

## Inputs

- Niche keyword lists per ecosystem (configured in Airtable or JSON config)
- Platform API credentials (where available)
- Previous trend data (for velocity calculation — is this rising or peaked?)

## Sources

| Source | Method | Frequency |
|--------|--------|-----------|
| TikTok trending sounds/topics | Supadata MCP | Every 6 hours |
| Twitter/X trending topics | Web search / API | Every 6 hours |
| Reddit rising posts | Reddit API (PRAW) | Every 6 hours |
| Google Trends | Google Trends API | Daily |
| YouTube trending | YouTube Data API | Daily |
| Hacker News | HN API | Daily |
| Industry RSS feeds | Feed parser | Daily |
| Niche-specific subreddits | Reddit API | Every 6 hours |

## Output

```json
{
  "scan_timestamp": "",
  "trends": [
    {
      "topic": "",
      "velocity_score": 0,
      "source_platform": "",
      "source_url": "",
      "niche_match": ["signal", "surge"],
      "relevance_score": 0,
      "peaked": false,
      "first_detected": "",
      "summary": ""
    }
  ]
}
```

Written to: `ecosystems/shared/_trends/{YYYY-MM-DD}-trends.json`

## Routing

- Topics matching Signal niche keywords → flagged for Signal topic pipeline (Agent 01 Trend Scout picks up)
- Topics matching Surge vertical keywords → flagged for Surge content pipeline (Agent 01 Source Scanner picks up)
- Topics matching both → appear in both feeds (brand isolation maintained — same topic, different treatment)

## Tools Required

- Supadata MCP (installed)
- Claude API (trend analysis and relevance scoring)
- Reddit API (PRAW)
- YouTube Data API
- RSS parser
- Airtable (trend log storage)

## Build Order

Independent — no dependencies. Can build as first shared agent. Serves both Signal and Surge from day one.

## Manual Fallback

Without this agent: manually check TikTok trending page, Twitter/X Explore, Reddit front page, Google Trends dashboard. Time: ~15 minutes/day. Agent target: 0 minutes human time, daily digest in inbox.
