# Agent 09 — Scheduler

## Purpose
Take the human-approved derivative batch from Agent 08 and schedule each piece for posting across all platforms at optimal times. Also handles YouTube video upload with metadata. Runs fully autonomous once the human clicks "approve batch."

## Automation Tier
**Autonomous** — triggered by human batch approval. Schedules all derivatives without further input. Posts on schedule via platform APIs.

## Inputs
- Approved derivative batch: `_derivatives/{date}-{slug}/` (all approved files)
- Approved thumbnail: `_thumbnails/{date}-{slug}-selected.jpg`
- Edited audio/video: `_recordings/edited/{date}-{slug}-edited.mp3` or `.mp4`
- YouTube metadata: title, description, tags (from SEO Optimizer output if available; else from transcript)
- Platform posting schedule: `/shared/posting-schedule.json` — optimal days and times per platform
- Airtable derivative rows — confirmation that all are in `approved` status

## Outputs
- Scheduled posts across all platforms with platform-specific timestamps
- Airtable derivative row updates: `scheduled_time`, `scheduler_status: scheduled`
- Confirmation digest to human: what was scheduled, when, on which platform

## Tools Required
- Buffer API or Publer API — multi-platform scheduling (LinkedIn, X, Instagram, Pinterest)
- YouTube Data API — video upload and scheduling
- Beehiiv API — newsletter scheduling
- Ghost API — blog post publishing/scheduling
- Reddit API — post scheduling (or manual: Reddit doesn't support native scheduling via API without third-party)
- Airtable API
- Notification system

## Trigger
Webhook from Airtable: when `batch_status` changes to `approved` on Content Pipeline row.

## Posting Schedule

Optimal posting times (UTC) by platform, based on VFX/tech audience behavior:

```json
{
  "youtube_long_form": {
    "day": "Tuesday",
    "time_utc": "14:00",
    "rationale": "Tue-Thu afternoons peak for technical content"
  },
  "youtube_shorts": {
    "day": ["Monday", "Wednesday", "Friday"],
    "time_utc": "09:00",
    "rationale": "Shorts distributed through Shorts feed, different algorithm"
  },
  "newsletter": {
    "day": "Wednesday",
    "time_utc": "13:00",
    "rationale": "Mid-week, before Friday afternoon slump"
  },
  "blog": {
    "day": "Tuesday",
    "time_utc": "08:00",
    "rationale": "SEO crawl window — published same day as YouTube, indexed within 48hr"
  },
  "linkedin": {
    "day": "Tuesday",
    "time_utc": "11:00",
    "rationale": "LinkedIn engagement peaks Tue-Thu 8am-12pm"
  },
  "x_thread": {
    "day": "Tuesday",
    "time_utc": "13:00",
    "rationale": "X peaks Tue-Thu midday"
  },
  "instagram_carousel": {
    "day": "Wednesday",
    "time_utc": "18:00",
    "rationale": "IG peaks evenings — separate from YouTube day to not split attention"
  },
  "pinterest": {
    "day": "Thursday",
    "time_utc": "20:00",
    "rationale": "Pinterest is evergreen — day matters less, evening slightly better"
  },
  "reddit": {
    "day": "Monday",
    "time_utc": "15:00",
    "rationale": "Reddit VFX subs most active Mon-Wed; post Monday to ride week's activity"
  }
}
```

Note: This schedule serves a single weekly pillar. Three pillars per week (Mon/Wed/Fri recordings per [[workflows/weekly-content-cycle]]) use staggered posting — derivatives from Monday's pillar post Tue-Thu, derivatives from Wednesday's pillar post Wed-Fri, derivatives from Friday's pillar post Sat-Mon.

## YouTube Upload Metadata Template

```
Title: {seo_optimized_title} (max 100 chars)
Description:
{brief paragraph — 150 words — plain English summary}

In this video:
{section list with timestamps — auto-generated from outline structure}
{00:00} Introduction
{02:15} {section 1 title}
...

Links mentioned:
- {any tools referenced with links}

🔔 Subscribe for VFX pipeline engineering content every week.
📬 Newsletter: {newsletter_url}
📝 Blog post (full write-up): {blog_url}

---
Tags: {comma-separated tags from SEO optimizer}
Category: Science & Technology
Playlist: {pillar-appropriate playlist}
```

## Error Handling / Escalation
- Platform API failure (non-critical): retry 3x with exponential backoff. If fails: save as draft in platform, flag to human with "post manually" alert.
- YouTube upload failure: retry once. If fails: flag critical — video is the anchor platform. Human must upload manually.
- Schedule conflict (two pieces scheduled at same time on same platform): auto-resolve by shifting one 2 hours. Log conflict resolution.
- Derivative not approved: skip that derivative, continue scheduling approved ones. Do not hold batch for one incomplete piece.
- Platform API credentials expired: alert human immediately. Do not attempt to post until credentials are renewed.

## Build Order Dependency
Requires Agent 08 (Atomizer). Build after Atomizer is stable and producing approvable batches.

## Manual Fallback
Without this agent:
1. Open Buffer or Publer, manually queue each derivative
2. Upload YouTube video via YouTube Studio with metadata copy-paste
3. Schedule newsletter via Beehiiv dashboard
4. Publish blog via Ghost dashboard
5. Post Reddit manually (can't schedule via API for free)
Manual time: 30-45 minutes per batch. High tedium, high error risk. This agent is a high-priority build.
