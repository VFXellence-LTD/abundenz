# Shared Agent — Cross-Platform Scheduler

## Purpose

Unified posting scheduler across all platforms and ecosystems. Routes approved content to the right platform at the right time.

## Automation tier

Fully autonomous (content already approved at human review gate before reaching scheduler).

## Used by

- **Content**: YouTube uploads, TikTok posts, Instagram posts/reels, newsletter sends, blog publishes, podcast episodes
- **Products**: Etsy listing publishes, KDP uploads, Gumroad launches
- **Affiliate**: Pinterest pin scheduling, blog post publishes

## Platform posting specs

| Platform | API | Optimal times (UTC) | Max frequency |
|----------|-----|-------------------|---------------|
| YouTube | YouTube Data API v3 | 14:00-18:00 weekdays | 1/day |
| TikTok | TikTok API | 11:00-14:00, 19:00-22:00 | 3/day |
| Instagram | Instagram Graph API / Zernio MCP | 11:00-13:00, 17:00-19:00 | 2/day |
| Pinterest | Pinterest API | 20:00-23:00 | 15-25/day |
| Newsletter (beehiiv) | beehiiv API | 10:00-11:00 Tue/Thu | 3/week |
| Blog (Ghost) | Ghost Admin API | anytime (SEO, not time-sensitive) | 1/day |
| LinkedIn | LinkedIn API | 07:00-09:00 weekdays | 1/day |
| X/Twitter | X API v2 | 12:00-15:00 | 3/day |
| Podcast (Spotify) | RSS feed update | weekly | 1/week |

## Queue management

```
queue/
├── pending/       ← approved content waiting to post
├── scheduled/     ← content with assigned time slot
├── posted/        ← successfully posted (archived 30 days)
└── failed/        ← failed posts (retry or escalate)
```

Each item in queue:
- Content (text, images, video, links)
- Target platform
- Scheduled datetime
- Ecosystem source
- Status (pending → scheduled → posted | failed)

## Orchestration

**Make.com** (Phase 0-1) or **n8n** (Phase 2+) as automation backbone. Scheduler agent generates the queue; Make.com/n8n executes the posts via platform APIs.

## Error handling

| Error | Action |
|-------|--------|
| API rate limit | Delay 15 min, retry |
| Auth expired | Alert Boss, pause posting for that platform |
| Content rejected by platform | Move to failed, alert with rejection reason |
| Platform outage | Queue continues to build, auto-retry every hour |

## Trigger

Continuous: checks queue every 15 minutes. Batch mode: process entire day's queue at midnight.
