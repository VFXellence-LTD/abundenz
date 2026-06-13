# Affiliate Pipeline

End-to-end automation flow for Conduit. From product discovery to posted content to revenue reporting. 95% autonomous. Human involvement: ~30 minutes per week.

---

## Pipeline Overview

```
[Agent 01: Product Scout]
        ↓ ranked product list + marketing angles (product cards)
[Agent 04: Link Manager]
        ↓ validates + injects affiliate links into product cards
[Agent 02: Content Generator]
        ↓ creates pins, blog posts, copy — deposited to /staging/pending-review/
        ↓
    ┌───────────────────────────────────┐
    │  HUMAN REVIEW GATE                │
    │  Weekly batch review              │
    │  ~15 minutes                      │
    │  Approves to /staging/approved/   │
    └───────────────────────────────────┘
        ↓
[Agent 03: Scheduler]
        ↓ posts approved content to Pinterest + WordPress on schedule
[Agent 05: Analytics]
        ← reads Pinterest Analytics, affiliate dashboards
        → weekly report (email), monthly P&L
        → kill/double-down signals
```

---

## Step-by-Step Flow

### Step 1 — Product Scout Runs (Daily + Weekly)

**Daily scan** (06:00 UTC):
- Scout checks Amazon bestseller lists for all active niches
- Scores new products using the scoring model
- Products scoring ≥ 60 added to product database with status `needs_link`
- Scout also checks if any active products have dropped in BSR significantly

**Weekly deep research** (Monday 07:00 UTC):
- Scout selects top 3 newly scored products
- Scrapes Amazon reviews for each
- Runs review mining Claude prompt
- Generates complete product cards (YAML format)
- Product cards written to product database and shared data store

**Tools at this step**: Amazon Product Advertising API or web scraping, Claude API, Google Sheets API

**Error handling**:
- Amazon API throttled → backoff 1 hour, retry
- Claude API unavailable → queue for next day, notify via email
- No new products ≥ 60 score → carry top performers from previous week forward

---

### Step 2 — Link Manager Validates Links (Hourly)

- Link Manager picks up all products with status `needs_link`
- Generates raw affiliate link (Amazon Associates, Clickbank, etc.)
- Creates Bitly tracking short link
- Runs initial health check (HTTP HEAD request to destination URL)
- Updates product status to `active` if healthy, `dead` if 404

**Tools at this step**: Amazon Associates API, Clickbank API, Digistore24 API, Bitly API, HTTP requests

**Error handling**:
- Bitly API down → use raw affiliate link, skip short link, flag for retry
- Product page returns 404 → mark dead, notify Scout to find replacement

---

### Step 3 — Content Generator Runs (On Demand, Triggered by Product Completion)

Triggered when a product reaches status `active` with a complete product card.

- Loads product card from database
- Retrieves affiliate link from Link Manager
- Generates 10–20 Pinterest pins (image + copy per pin variant)
- Generates 1 blog post (1500–2000 words)
- Uploads pin images to S3 / storage bucket
- Writes all content to `/staging/pending-review/YYYY-MM-DD/`
- Updates content queue with status `pending_review`

**Tools at this step**: Claude API, Canva API or PIL, S3 or equivalent image hosting, WordPress API (draft status), Google Drive or filesystem

**Error handling**:
- Claude API unavailable → queue product, retry in 2 hours
- Canva API fails → fall back to PIL template generation
- Image upload fails → retry 3 times, then flag for manual intervention

**Time estimate**: ~10–15 minutes per product to generate full content package

---

### Step 4 — Human Review Gate (Weekly, ~15 Minutes)

Operator reviews `/staging/pending-review/` content once per week.

**Review checklist (per piece of content)**:
- [ ] Content does not make fabricated claims
- [ ] FTC disclosure is present (Generator should always include, but verify)
- [ ] Pin images look clean and on-brand
- [ ] No prohibited product types (re-check anti-niche list)
- [ ] Blog post reads naturally, not like spam

**Actions**:
- Move to `/staging/approved/` — Scheduler picks up and queues for posting
- Move to `/staging/rejected/` — Scheduler ignores. Add rejection reason note.
- Delete — for anything obviously wrong

**Time investment**: 15–20 pins and 2–3 blog posts per week at steady state. At 30 seconds per pin and 5 minutes per blog post: ~15 minutes total.

**This gate exists for**:
1. Compliance safety — a human catches anything the Generator missed
2. Brand quality — ensures content is coherent before posting at scale
3. Legal protection — documented human review of all affiliate-linked content

---

### Step 5 — Scheduler Posts Content (Continuous)

- Scheduler checks `/staging/approved/` every 30 minutes
- Moves approved content into posting queue with scheduled datetime
- Posts pins at optimal times (see [[agents/03-scheduler]])
- Posts blog posts on 2/week schedule
- Logs every post with platform ID and timestamp

**Tools at this step**: Pinterest v5 API, WordPress REST API, Make.com or n8n

**Error handling**: See [[agents/03-scheduler]] failure handling section

---

### Step 6 — Analytics Tracks Performance (Continuous + Weekly)

- Bitly click data: captured continuously, available in Bitly dashboard
- Pinterest Analytics: captured daily via API
- Affiliate dashboard data: pulled weekly (CSV or API)
- Analytics Agent aggregates and calculates metrics

**Weekly report**: Delivered Monday 09:00 UTC to operator email
**Monthly P&L**: Delivered 1st of each month

---

### Step 7 — Monthly Review (Human, ~20 Minutes)

Operator reviews monthly P&L and Analytics kill/double-down signals:

**Agenda**:
1. Review monthly P&L — is Conduit net positive?
2. Review niche kill signals — any niches to kill?
3. Review niche double-down signals — any niches to scale?
4. Review top performing pins — commission Scout to find more products in similar categories
5. Check affiliate account health — any warnings or issues?

**Decisions that come out of monthly review**:
- Kill an underperforming niche (stop content, maintain existing posts)
- Expand a winning niche (add more boards, increase pin velocity)
- Add a new niche (run through [[brief/niche-selection]] matrix)
- Start paid Pinterest promotion on a validated niche
- Switch from Amazon to higher-commission products in a niche

---

## Time Budget Summary

| Activity | Frequency | Human Time |
|----------|-----------|-----------|
| Content review gate | Weekly | 15 min |
| Monthly P&L review | Monthly | 20 min |
| Alert investigation | As needed | Variable |
| Annual compliance review | Annually | 2 hrs |
| **Total steady-state** | | **~30 min/week** |

All other operations: fully automated.

---

## Error Cascade Handling

What happens when something breaks mid-pipeline:

### Product Scout produces no output
- Link Manager has nothing to link → no new products enter content queue
- Content Generator has no new products → generates no new content
- Scheduler continues posting from existing approved queue (typically 1–2 weeks of buffer)
- Analytics flags zero new products in weekly report
- Operator investigates Scout issue

### Link Manager marks a product dead mid-campaign
- Content for that product stops being generated (new content)
- Existing posted content with that link: Scheduler flags all posts containing that link_id as needing link replacement
- Link Manager finds replacement product (or Scout is queried for replacement)
- Content Generator creates new content with replacement link
- Old posts: if blog, update affiliate link in post. If Pinterest pin, cannot edit link after posting — pin stays live but goes to a 404 if product is delisted.

### Content Generator backlog exceeds 2 weeks
- Alert to operator: content production is ahead of posting capacity
- Options: increase pin velocity, pause new content generation until queue clears

### Affiliate account suspended
- Critical alert immediately
- Pause all content for that affiliate platform
- Operator contacts affiliate program support
- Do not generate new content for suspended platform until resolved

---

## Platform-Specific Notes

**Pinterest**: The highest-leverage platform for Conduit in Phase 1. Organic reach is genuinely strong for product-intent queries. Algorithm rewards consistent posting over viral spikes.

**Google / Blog**: Takes 3–6 months to see meaningful SEO traffic. Build steadily — do not expect early revenue from this channel. Long-term, blog content has indefinite shelf life vs. pins which fade after a few months.

**Paid promotion (Phase 2+)**: Only introduce after organic Pinterest has validated at least 2 niches (proven CTR ≥ 0.5%). Paid on an unvalidated niche burns budget for no signal. See [[workflows/pinterest-growth]] for paid promotion timing.
