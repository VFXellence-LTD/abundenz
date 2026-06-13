# Agents Overview

Conduit runs on five autonomous agents. Together they replace a team of content creators, a social media manager, a link auditor, and a data analyst. Human involvement targets 30 minutes per week for batch content review.

---

## Agent Roster

| # | Agent | Role | Automation Tier | Run Frequency |
|---|-------|------|----------------|--------------|
| 01 | [[01-product-scout]] | Finds and scores products to promote | Fully autonomous | Daily scan + weekly deep research |
| 02 | [[02-content-generator]] | Creates pins, blog posts, social copy | Fully autonomous | On demand, batch mode |
| 03 | [[03-scheduler]] | Posts content across platforms on schedule | Fully autonomous | Continuous queue management |
| 04 | [[04-link-manager]] | Manages and monitors affiliate links | Fully autonomous | Daily checks |
| 05 | [[05-analytics]] | Tracks performance and generates reports | Fully autonomous | Weekly report, monthly P&L |

All agents operate autonomously. Human review gate exists at one point in the pipeline (weekly batch content approval, ~15 minutes). Everything else runs without intervention.

---

## Build Order

Build and activate agents in this sequence. Each one is a dependency for the next.

### Phase 0 — Pre-Content Infrastructure
1. **Agent 04 (Link Manager)** first — need working affiliate links before content can reference them
2. **Agent 01 (Product Scout)** second — need a product list before generating content

### Phase 1 — Content Production
3. **Agent 02 (Content Generator)** — uses Scout's product list and Link Manager's validated links
4. **Agent 03 (Scheduler)** — needs a content queue to post from

### Phase 2 — Measurement
5. **Agent 05 (Analytics)** — needs posting history and click data to report on

---

## Automation Tiers Defined

| Tier | Description | Human Action Required |
|------|-------------|----------------------|
| Fully autonomous | Runs on schedule, no human input needed | None (only periodic spot-checks) |
| Human-in-loop | Produces output for human review before acting | Weekly batch review |
| Human-triggered | Runs when a human initiates it | As needed |

All five Conduit agents are fully autonomous by design. The **weekly batch review** is a policy gate, not an agent limitation — content is reviewed before Scheduler posts it as a compliance and quality control measure.

---

## Tool Infrastructure

All agents depend on a shared tool stack. Provision before activating any agent:

| Tool | Purpose | Cost Estimate |
|------|---------|--------------|
| Claude API (claude-sonnet) | Content generation, analysis | ~$20–50/month |
| Make.com or n8n | Workflow automation, scheduling | $10–30/month |
| Pinterest API | Posting, analytics | Free (business account) |
| Amazon Product Advertising API | Product data | Free with Associates account |
| Canva API or alternative | Image generation for pins | $15–20/month |
| WordPress or Ghost | Blog hosting | $10–20/month |
| Bitly or similar | Link tracking | Free–$10/month |
| Google Sheets or Airtable | Data storage for product lists, analytics | Free tier likely sufficient |

**Total estimated operating cost: ~$75–150/month when fully operational.**

---

## Data Flow Between Agents

```
Agent 01 (Product Scout)
    ↓ ranked product list + marketing angles
Agent 02 (Content Generator)
    ↓ pin images, descriptions, blog posts (unlinked drafts)
Agent 04 (Link Manager)
    ↓ validates + injects affiliate links
    ↓ assembled content package
[Human Review Gate — weekly, ~15 min]
    ↓ approved content
Agent 03 (Scheduler)
    ↓ posts to Pinterest, WordPress
Agent 05 (Analytics)
    ← reads Pinterest Analytics, affiliate dashboards
    → weekly report
```

---

## Failure Modes and Recovery

| Failure | Detection | Recovery |
|---------|-----------|---------|
| Scout returns no new products | Empty product list in daily run | Scout falls back to repromoting top performers from previous 30 days |
| Content Generator produces policy-violating content | Human review gate catches it | Reject and flag product for human evaluation |
| Scheduler hits Pinterest rate limit | 429 error in Make.com log | Automatic backoff, retry next posting window |
| Link Manager detects dead link | Product page 404 | Remove product from active rotation, flag for Scout to find replacement |
| Analytics report not generated | Missing data from API | Alert operator via email, retry with cached data |

Agent-specific failure handling documented in each agent file.
