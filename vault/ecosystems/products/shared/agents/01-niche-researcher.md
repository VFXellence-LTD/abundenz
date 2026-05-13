# Agent 01: Niche Researcher

**Role:** Identify profitable product opportunities across target marketplaces. Runs on schedule; outputs ranked niche briefs for Design Generator.

---

## Schedule

| Run type | Frequency | Scope |
|----------|-----------|-------|
| Deep scan | Weekly (Sunday 02:00 UTC) | Full category sweep, competition analysis, policy check |
| Quick scan | Daily (06:00 UTC) | Trending searches, seasonal signals, anomaly detection |

---

## Inputs

- Active marketplace list (current: Etsy, KDP, Redbubble, Gumroad)
- Current niche portfolio (what Atelier is already selling — avoid re-evaluating settled niches)
- Policy update flag from [[brief/marketplace-policies]] (re-check if >90 days since last verify)

---

## Outputs

`niche_brief_YYYY-MM-DD.json` with structure:

```json
{
  "scan_date": "2025-05-08",
  "scan_type": "deep",
  "opportunities": [
    {
      "rank": 1,
      "niche": "Sobriety milestone tracker journal",
      "marketplace": "KDP",
      "score": 26,
      "score_breakdown": {
        "market_size": 4,
        "competition_density": 5,
        "ai_policy_risk": 4,
        "production_difficulty": 4,
        "margin": 4,
        "evergreen_demand": 5
      },
      "evidence": {
        "top_seller_bsr": 45000,
        "top_seller_reviews": 87,
        "estimated_monthly_sales": 120,
        "keyword_search_volume": 8500
      },
      "action": "test",
      "suggested_title": "My Sobriety Journey: A 90-Day Milestone Tracker and Daily Reflection Journal"
    }
  ],
  "rejected_niches": [],
  "policy_flags": []
}
```

Decision key: score ≥ 28 → lock; 20-27 → test; < 20 → reject.
See [[../../shared/skills/niche-locker/SKILL]] for full scoring rubric.

---

## Tools

| Tool | Purpose |
|------|---------|
| Etsy API (or scraper) | Category bestseller lists, search result counts |
| Amazon PA API / ASIN scraper | KDP BSR data, review counts, keyword rankings |
| Publisher Rocket API (if licensed) | KDP keyword search volume, competition score |
| Claude API | Reasoning, gap analysis, brief generation |

---

## Deep Scan Prompt

Used weekly. Paste into Claude API call with the tool outputs as context.

```
You are the Niche Researcher agent for Atelier, an anonymous AI-generated product business.

Today's date: {{DATE}}
Current active niches: {{ACTIVE_NICHES}}
Marketplace data: {{TOOL_OUTPUT_JSON}}

Your job: identify 5-10 new product niche opportunities ranked by the Atelier scoring matrix.

Scoring matrix (1-5 each, max 30):
1. Market size — active buyer pool, search volume
2. Competition density — listings count, AI saturation
3. AI policy risk — platform acceptance of AI content
4. Production difficulty — time/cost per unit at quality threshold
5. Margin — net revenue after all fees and COGS
6. Evergreen demand — year-round vs seasonal

Decision thresholds: ≥28 = lock, 20-27 = test, <20 = reject

For each opportunity provide:
- Niche name (specific, not broad — "ADHD daily planner for nurses" not "planner")
- Marketplace (Etsy / KDP / Redbubble / Gumroad)
- Score and breakdown per criterion with 1-sentence justification for each score
- Evidence: BSR / review count / estimated monthly sales / keyword volume
- Action: lock / test / reject
- If KDP: suggested title and subtitle
- If Etsy: suggested primary keyword and 3 secondary keywords

Do not suggest:
- Niches where top sellers have >500 reviews unless there's a clear underserved sub-niche
- Niches requiring celebrity/IP that Atelier cannot legally produce
- Adobe Stock or Shutterstock (AI banned there)

Output as JSON matching this schema: {{OUTPUT_SCHEMA}}
```

---

## Quick Scan Prompt

Used daily. Lighter — trend detection only.

```
You are the Niche Researcher agent for Atelier.

Today's date: {{DATE}}
Active niches: {{ACTIVE_NICHES}}
Trending data: {{TRENDING_DATA}}

Check for:
1. Seasonal opportunity opening in the next 30 days (e.g., upcoming holidays, back-to-school)
2. Sudden spike in search volume for any term near our active niches
3. Policy change signals on Etsy, KDP, or Redbubble (scan headlines, forum posts)
4. Competitor shop that recently scaled dramatically — what are they selling?

Output:
- 0-3 opportunities worth adding to next deep scan queue
- Any policy flags (HIGH / MEDIUM / LOW urgency)
- One-sentence seasonal note for the week

Keep response under 300 words. Flag anything HIGH urgency immediately.
```

---

## Orchestration (Make.com / n8n)

```
WEEKLY TRIGGER (Sunday 02:00 UTC)
  → Fetch Etsy bestseller data (HTTP module)
  → Fetch KDP BSR data (HTTP module or scraper)
  → Load active niche portfolio (Google Sheets or Airtable)
  → Run Claude deep scan prompt
  → Parse JSON output
  → IF any score ≥ 28: send brief to Design Generator queue
  → IF any score 20-27: add to "test queue" with 30-day auto-review
  → IF policy flag HIGH: send alert to owner (email/Slack)
  → Save brief to shared storage

DAILY TRIGGER (06:00 UTC)
  → Fetch trending data (Google Trends, Etsy trending)
  → Run Claude quick scan prompt
  → IF policy flag: escalate to owner immediately
  → IF seasonal opportunity: add to Design Generator queue with "SEASONAL: urgent"
  → Log to weekly niche file
```

---

## Related Documents

- [[brief/product-niches]] — evaluated niche reference guide
- [[brief/marketplace-policies]] — platform AI content rules
- [[02-design-generator]] — receives niche briefs, produces designs
- [[../../shared/skills/niche-locker/SKILL]] — scoring rubric
