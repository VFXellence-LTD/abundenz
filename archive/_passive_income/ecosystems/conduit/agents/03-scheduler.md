# Agent 03: Scheduler

Autonomous publishing + metrics tracking. Manages consistent posting (3-5 posts/day), monitors performance, flags underperformers.

## Input Specification

### Video Queue (from Agent 02)
```json
{
  "platform": "tiktok",
  "posting_time": "2025-05-18T08:00:00Z",
  "video_file": "/videos/tiktok/day_1/08_00_product_a.mp4",
  "caption": "Full caption text with hashtags",
  "hashtags": ["#ad", "#AITools"],
  "affiliate_link": "https://amazon.com/...",
  "product_name": "AI Writing Assistant",
  "affiliate_program": "Amazon Associates",
  "expected_ctr": 0.03,
  "expected_conversion": 0.02
}
```

## Publishing Workflow

### TikTok Native API

**Endpoint**: `POST /v1/post/publish/`
**Authentication**: TikTok API token (OAuth)

```python
tiktok_api.publish_video(
    video_path="video.mp4",
    caption="Full caption with #ad",
    hashtags=["#ad", "#AITools"],
    post_time="2025-05-18T08:00:00Z"
)
```

**Schedule**: 3-5 posts daily
- 7-9am (morning peak)
- 12-2pm (lunch peak)
- 7-11pm (evening peak)

**Retry logic**: If API fails, retry 3x with exponential backoff (5s, 10s, 30s)

### Fallback: Third-Party Scheduler

If TikTok API unavailable, use Later or Buffer:

```python
# Later API
later_api.schedule_post(
    network="tiktok",
    media=video_file,
    caption=caption,
    schedule_time=post_time
)
```

### Pinterest Native Pins

**Endpoint**: `POST /v5/pins/`
**Authentication**: Pinterest API token

```python
pinterest_api.create_pin(
    board_id="top-ai-tools",
    image_url="pin_design.png",
    description="Full description with affiliate link",
    link="https://amazon.com/..."
)
```

**Schedule**: 3-5 pins daily (can be more flexible than TikTok)

## Metrics Tracking

### Real-Time Monitoring (First 12 Hours Post Publishing)

**Check every 2 hours**:
- Views
- Engagement (likes, comments, shares)
- Watch time (%) — how much of video was watched
- CTR — clicks on affiliate link
- Conversions — purchases attributed to link

### Data Collection

```python
{
  "video_id": "tiktok_video_123",
  "platform": "tiktok",
  "posted_at": "2025-05-18T08:00:00Z",
  "product": "AI Writing Assistant",
  "metrics": {
    "views_2h": 150,
    "views_6h": 520,
    "views_12h": 1200,
    "views_24h": 2500,
    "likes": 85,
    "comments": 12,
    "shares": 5,
    "watch_time_percent": 65,
    "clicks_affiliate": 45,
    "conversions": 3,
    "revenue": 45.00
  },
  "performance_rating": "A"
}
```

### Daily Analytics Spreadsheet

| Timestamp | Product | Views | CTR | Conversions | Revenue | Status |
|-----------|---------|-------|-----|-----------|---------|--------|
| 2025-05-18 08:00 | AI Writing | 2.5k | 1.8% | 3 | $45 | GOOD |
| 2025-05-18 13:00 | Spelling Checker | 450 | 0.2% | 0 | $0 | KILL |
| 2025-05-18 20:00 | Autocomplete | 3.2k | 3.1% | 7 | $105 | EXCELLENT |

## Performance Thresholds & Actions

### Kill Decision (Stop Promoting Product)
**Criteria**: <100 views in 24h OR <1% CTR after 48h

**Action**:
1. Remove from rotation (don't post again for 30 days)
2. Log in "underperformer" spreadsheet
3. Notify Agent 01 (maybe niche pivot needed?)

### Moderate Performers (Keep, Don't Expand)
**Criteria**: 500-1k views, 1-2% CTR

**Action**:
1. Keep in rotation (3-4x per week)
2. Test different hooks/angles
3. Monitor for improvement

### Top Performers (Double Down)
**Criteria**: 2k+ views, 3%+ CTR, 1%+ conversion

**Action**:
1. Post 5-7x per week (increase frequency)
2. Test variations (different hooks, angles, timestamps)
3. Consider in multiple niches/channels
4. Tag higher-commission affiliate programs if available

## Product Rotation Strategy

### Weekly Review (Sunday evening)
```
Top 5 performers this week:
1. Autocomplete Tool (3.2k avg views, 3.1% CTR) — 6 posts next week
2. AI Writing Pro (2.5k avg views, 1.8% CTR) — 4 posts next week
3. Grammar Checker (1.8k avg views, 2.1% CTR) — 3 posts next week

Underperformers (kill):
- Spelling Checker (450 views, 0.2% CTR) — remove from rotation
- Thesaurus AI (320 views, 0.1% CTR) — remove from rotation

New products to test (Agent 02):
- Voice Typing Tool (AI competitor, trending on discovery)
- Plagiarism Detector Pro (high margin, 20% commission)
```

### Posting Allocation (Next Week)
```
Monday:
  8am: Autocomplete Tool (top performer #1)
  1pm: AI Writing Pro (top performer #2)
  8pm: Grammar Checker (top performer #3)

Tuesday:
  8am: New test — Voice Typing Tool
  1pm: Autocomplete Tool (repeat winner)
  8pm: AI Writing Pro (repeat winner)

... repeat pattern, rotate products, test 1-2 new products/week
```

## Alert Triggers

### Automatic Escalation (to Robin for decision)

| Alert | Trigger | Action |
|-------|---------|--------|
| Channel health declining | 3 days avg views <20% of previous week | Review niche, consider pivot |
| Viral opportunity | Video >10k views in 24h | Boost with reposts, similar content |
| Competitor product surge | Competitor's video >5k views | Analyze, create counter-content |
| Algorithm shift | Hashtag performance drops >50% | Update hashtag strategy, test new sounds |
| API outage | TikTok API failures >3x daily | Switch to backup scheduler |
| Compliance issue | Video flagged for policy violation | Review FTC disclosure, pull if needed |

## Scheduling Configuration

### Time Zones

**Optimize for timezone(s) of target audience**:

| Niche | Target Audience | Peak Times |
|-------|---|---|
| AI Tools | US Tech workers | 7-9am ET, 12-2pm ET, 7-9pm ET |
| Home/Garden | US Gen-X females | 8-10am CT, 1-3pm CT, 8-10pm CT |
| Fashion | UK/EU women | 10am-12pm GMT, 2-4pm GMT, 7-9pm GMT |

**Default**: Post at same times daily (algorithm rewards consistency)

### Rate Limits & Safety

**TikTok API**:
- Max 50 posts/day (well above our 3-5 target)
- Rate limit: 100 requests/minute (no issue for our volume)
- No artificial delays needed

**Pinterest API**:
- Max 1k pins/day (no constraint)
- Rate limit: 10 requests/second (no issue)

**Safety measure**: Stagger posts by 60s minimum (avoid burst posting patterns)

## Reporting

### Daily Report (To Robin)
```
Date: 2025-05-18

Top performers:
- Autocomplete Tool: 3.2k views, 3.1% CTR, 7 conversions, $105 revenue
- AI Writing Pro: 2.5k views, 1.8% CTR, 3 conversions, $45 revenue

Underperformers (killed):
- Spelling Checker: 450 views, 0.2% CTR — removed from rotation
- Thesaurus AI: 320 views, 0.1% CTR — removed from rotation

New tests:
- Voice Typing Tool: 1.8k views, 2.1% CTR — monitor

Issues:
- None

Next actions:
- Continue rotation with top 3 performers
- Test 2 new products (Plagiarism Detector Pro, AI Summarizer)
- Prepare Week 2 content calendar
```

### Weekly Report (Sunday)
- Revenue total ($X)
- Top 3 products (by revenue)
- Killed products (why)
- Algorithm observations (trending sounds, hashtags)
- Recommendation for next week (scale winners, new niches?)

### Monthly Report (End of month)
- Revenue trajectory ($X → $X next month)
- Top products (cumulative)
- Engagement rate trends
- Niche health (on track? pivot needed?)
- Forecast (if we scale to 5 niches, project monthly revenue)

## Automation Rules

### Auto-actions (No human intervention needed)
- Publish video on schedule ✓
- Track metrics ✓
- Update spreadsheet ✓
- Kill underperformer (<100 views, 24h) ✓
- Alert on viral video (>10k views) ✓

### Human review (Weekly)
- Product rotation (double down on winners, test new products)
- Niche pivot decision (if top 3 products all underperforming)
- Budget allocation (scale successful niches)

## Backup & Disaster Recovery

### Video Archive
- All published videos backed up to Google Drive
- Metadata (captions, metrics) in JSON files
- Recovery: Can re-upload to alternate accounts if platform issues

### Metrics Archive
- Daily CSV export to Google Sheets (auto-backup)
- Monthly export to local drive
- Recovery: Can regenerate reports from archive

### Scheduler Redundancy
- Primary: TikTok API
- Secondary: Later (backup if API fails)
- Manual: Robin can manually post if both systems fail
