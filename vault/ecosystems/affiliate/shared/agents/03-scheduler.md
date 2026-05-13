# Agent 03 — Scheduler

Posts approved content across platforms on a controlled schedule. Manages the content queue, respects platform rate limits, and avoids patterns that trigger spam detection.

---

## Responsibility

- Maintain a posting queue from the approved content staging folder
- Post Pinterest pins at optimal times across niche boards
- Publish blog posts to WordPress on schedule
- Manage posting velocity (ramp up correctly, never burst)
- Detect and handle rate limits and API errors
- Log every post with timestamp, platform, content ID, and board

---

## Platforms

| Platform | API | Posting Method | Daily Limit |
|----------|-----|---------------|------------|
| Pinterest | Pinterest v5 API | Direct pin creation | 25 pins/day (conservative) |
| WordPress | REST API | Post creation with scheduled publish date | 1–2 posts/day |
| Instagram (Phase 2) | Meta Graph API | Image post with caption | 20 posts/day |

---

## Pinterest Posting Configuration

### Board Mapping

Each niche maps to one or more Pinterest boards. Scheduler knows which products belong to which niche and posts to the corresponding board.

```yaml
board_map:
  home_office:
    board_id: "[PINTEREST_BOARD_ID]"
    board_name: "Home Office Setup"
    daily_pin_target: 5
  pet_products:
    board_id: "[PINTEREST_BOARD_ID]"
    board_name: "Pet Products We Love"
    daily_pin_target: 5
  kitchen_gadgets:
    board_id: "[PINTEREST_BOARD_ID]"
    board_name: "Kitchen Gadgets Worth It"
    daily_pin_target: 5
```

### Posting Velocity Schedule

Pinterest rewards consistent posting. Ramp up over 8 weeks — do not burst from zero to 25 pins/day on day one.

| Week | Pins/Day | Notes |
|------|----------|-------|
| 1–2 | 5 | Establish account posting pattern |
| 3–4 | 10 | Increase steadily |
| 5–6 | 15 | Add more board coverage |
| 7–8 | 20 | Approaching steady state |
| 8+ | 20–25 | Steady state |

### Optimal Posting Times

Target times based on Pinterest audience research (US-centric):

| Day | Best Times (EST) |
|-----|-----------------|
| Saturday | 8–11 AM, 8–11 PM |
| Sunday | 8–11 PM |
| Monday | 2–4 PM, 8–11 PM |
| Tuesday | 2–4 PM |
| Wednesday | 9 PM |
| Thursday | 2–4 PM, 9 PM |
| Friday | 5 PM |

Scheduler distributes pins across these windows. No bunching (do not post 5 pins within 10 minutes).

**Minimum gap between pins on same board**: 30 minutes.
**Minimum gap between pins (any board)**: 10 minutes.

### Content Mix

Pinterest penalises accounts that post only outbound-link pins. Mix in repins:

| Content Type | Target Mix |
|-------------|-----------|
| Original Conduit pins | 70% |
| Repins from relevant niche accounts | 30% |

Repin sourcing: Scheduler searches each niche board topic for high-engagement pins from non-competitor accounts and queues them as repins. Prioritise pins from manufacturers, lifestyle bloggers, interior designers — not other affiliate accounts.

---

## Pinterest API Pin Creation

Make.com or n8n workflow. Core API call:

```json
POST https://api.pinterest.com/v5/pins
Authorization: Bearer {ACCESS_TOKEN}

{
  "board_id": "{BOARD_ID}",
  "media_source": {
    "source_type": "image_url",
    "url": "{HOSTED_IMAGE_URL}"
  },
  "title": "{PIN_TITLE}",
  "description": "{PIN_DESCRIPTION}",
  "link": "{AFFILIATE_LINK}",
  "alt_text": "{IMAGE_ALT_TEXT}"
}
```

Image must be hosted (not attached as binary). Before posting, upload image to S3 bucket or equivalent, use the public URL in the API call.

---

## Blog Publishing Configuration

WordPress REST API post creation:

```json
POST https://[YOUR_DOMAIN]/wp-json/wp/v2/posts
Authorization: Basic {BASE64_USER:APP_PASSWORD}

{
  "title": "{POST_TITLE}",
  "content": "{POST_HTML_CONTENT}",
  "status": "future",
  "date": "{ISO_8601_PUBLISH_DATETIME}",
  "categories": [{CATEGORY_ID}],
  "tags": [{TAG_IDS}],
  "meta": {
    "_yoast_wpseo_focuskw": "{PRIMARY_KEYWORD}",
    "_yoast_wpseo_metadesc": "{META_DESCRIPTION}"
  }
}
```

**Publishing schedule**: 2 posts per week. No back-to-back same-day publishing. Space posts at least 48 hours apart.

---

## Queue Management

Scheduler maintains a queue in a spreadsheet or database:

| Field | Type | Notes |
|-------|------|-------|
| content_id | string | Unique ID from Content Generator |
| content_type | enum | pin / blog_post / reel |
| platform | enum | pinterest / wordpress |
| board_or_category | string | Target board or category |
| product_slug | string | Associated product |
| niche | string | Associated niche |
| status | enum | queued / scheduled / posted / failed |
| scheduled_time | datetime | When to post |
| posted_time | datetime | Actual post time |
| platform_post_id | string | ID returned by platform API |
| error_message | string | If status = failed |

**Queue priority rules:**
1. New product content (first 10 pins per product) — post within 72 hours of approval
2. Seasonal content — post before seasonal window opens
3. Standard rotation — FIFO within niche

---

## Duplicate Prevention

Pinterest penalises repetitive content. Scheduler tracks:
- Last 30 days of post history per board
- Minimum 14-day gap before reposting same image to same board
- Minimum 7-day gap before reposting same image to different board
- Pin descriptions must vary — Scheduler selects different variant copy if reposting

---

## Rate Limit Handling

| Platform | Rate Limit | Scheduler Response |
|----------|-----------|------------------|
| Pinterest API | 200 requests/day per user token | Track usage, pause posting if >180 requests reached |
| WordPress API | No hard limit | Throttle to max 10 requests/minute |
| Instagram Graph API | 200 posts/day | Track and cap |

On 429 (Too Many Requests): wait for Retry-After header value, then retry. Log all rate limit events.

---

## Error Handling

| Error | Recovery |
|-------|---------|
| Pin creation fails (5xx from Pinterest) | Retry 3 times with exponential backoff. If still failing, move to failed queue and alert. |
| Invalid affiliate link (Link Manager missed it) | Remove pin from queue, flag to Link Manager |
| Image URL broken | Re-upload image, regenerate URL, requeue |
| WordPress publish fails | Retry once, then move to failed queue and alert |
| Board not found | Alert — board may have been deleted. Halt posting to that niche until resolved. |

---

## Failure Alerting

Scheduler sends email or Slack message (configure at activation) for:
- 3 consecutive failed posts
- Rate limit hit
- Board not found
- Daily pin count falls below 50% of target for any niche

---

## Logging

Every post action is logged:

```
[2025-01-15 09:00:00 UTC] POSTED | pinterest | home_office | pin_id:abc123 | product:standing-desk-converter | board:Home Office Setup
[2025-01-15 09:31:00 UTC] POSTED | pinterest | pet_products | pin_id:abc124 | product:automatic-cat-feeder | board:Pet Products We Love
[2025-01-15 14:02:00 UTC] FAILED | pinterest | kitchen_gadgets | product:air-fryer-xl | error:429 | retry_at:2025-01-15 15:02:00 UTC
```

Logs feed into [[05-analytics]] for posting volume tracking.
