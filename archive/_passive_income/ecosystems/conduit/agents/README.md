# Conduit Agents

Autonomous agents powering the Conduit ecosystem. Each agent owns a phase of the content-to-revenue pipeline.

## Agent Roles

### Agent 01: Niche Selector
**Owned by**: Market research + Claude
**Input**: Competitive landscape, commission structure
**Output**: [[brief/niche-selection|Niche decision]], product list, content angle

**Process**:
1. Scan Amazon bestsellers + TikTok/Pinterest trends in category
2. Analyze competitor channels (follower count, engagement, products promoted)
3. Check affiliate commission rates (TikTok Shop, Amazon, brand programs)
4. Score niches on: traffic potential, margin, competition level, evergreen demand
5. Recommend top 3 niches + specific products to test

**Triggers**:
- New workspace setup
- Niche fatigue (current niche revenue flat 2+ months)
- Seasonal pivot (holiday season, back-to-school)

---

### Agent 02: Content Generator
**Owned by**: Script generation + video rendering
**Input**: Product list, content calendar template
**Output**: Video scripts, captions with hashtags, rendered videos

**Capabilities**:
- Write TikTok scripts (hook + demo + CTA, 30-60 seconds)
- Generate captions with niche + trending hashtags
- AI video generation (Higgsfield, Keyvello, VideoExpress)
- Batch processing (10+ videos from single product)

**Process**:
1. Parse product list (name, price, key features, benefit, affiliate link)
2. Generate 3-5 script variations (different hooks/angles)
3. Create captions (with #ad, hashtags, CTA)
4. Trigger video generation (CLI batch or API call)
5. Output to scheduling queue

**Configuration**:
- Script template: TikTok cold-start format (hook 1-3s, demo 15-30s, CTA 2-3s)
- Video tool: Higgsfield CLI preferred (faster, cheaper at scale)
- Hashtag strategy: 2 trending + 3 niche + 3 long-tail + 2 branded
- CTA format: "Check pinned comment" or "Link in bio"

**Triggers**:
- Daily (generate 5-10 videos for next day posting)
- Weekly refresh (new trending sounds, seasonal angles)
- On-demand (product research request)

---

### Agent 03: Scheduler
**Owned by**: Publishing + consistency
**Input**: Rendered videos, captions, posting schedule
**Output**: Published videos, analytics tracking

**Capabilities**:
- Schedule 3-5 TikTok posts/day
- Manage posting times by timezone
- Track views, CTR, conversion metrics
- Rotate products based on performance
- Handle pin descriptions for Pinterest

**Process**:
1. Receive video + caption from Agent 02
2. Parse posting time + platform (TikTok, Pinterest, both)
3. Apply scheduling (TikTok API or third-party scheduler)
4. Add affiliate link + product tag
5. Monitor first 12 hours (views, engagement, CTR)
6. Log metrics to tracking sheet

**Tools**:
- **TikTok API** (native, no third-party needed)
- **Later** or **Buffer** (fallback, if API rate-limited)
- **Spreadsheet** (daily metrics log)

**Triggers**:
- 2 hours before posting time
- Continuous during posting window
- Daily analytics review (next morning)

---

## Agent Communication

```
Niche Selection (Agent 01)
          ↓
   (product list)
          ↓
Content Generator (Agent 02)
   (10 scripts + captions)
          ↓
Scheduler (Agent 03)
  (publish on schedule)
          ↓
    Analytics Tracking
          ↓
    (weekly review) → Agent 01 (adjust niche if needed)
```

## Manual Oversight

Agents operate autonomously, but human (Robin) reviews:
- **Weekly**: Revenue + CTR analysis, product rotation decisions
- **Monthly**: Niche health (is current niche still profitable?)
- **Quarterly**: Strategy shift (new niche, new platform, new product category)

## Implementation Notes

- All agents configured in `D:/dev/_passive_income/` codebase
- Conduit ecosystem uses **Agent** abstraction (can be Claude, scheduled scripts, or human-in-loop)
- Vault files (this README, workflows, playbooks) are configuration + training for agents
