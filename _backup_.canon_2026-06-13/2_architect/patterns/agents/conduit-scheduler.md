> Salvaged from _passive_income/ecosystems/conduit/agents/03-scheduler.md — 2026-06-05. Overlaps polymath/vault/ecosystems/conduit if agent specs exist there. Dedupe TODO — see [[3_notes/dedupe-passive-income-vs-polymath]].

# Agent Pattern: Scheduler (Conduit / Zrodinger)

Autonomous publishing + metrics tracking. Manages consistent posting (3-5 posts/day TikTok, 3-5 pins/day Pinterest), monitors performance, flags underperformers.

---

## Publishing Workflow

### TikTok (Primary)

- Endpoint: `POST /v1/post/publish/`
- Schedule: 3-5 posts daily at peak hours (7-9am, 12-2pm, 7-11pm)
- Retry: 3x with exponential backoff (5s, 10s, 30s)
- Fallback: Later or Buffer if API unavailable

### Pinterest

- Endpoint: `POST /v5/pins/`
- Schedule: 3-5 pins daily (more flexible than TikTok)

---

## Performance Thresholds & Actions

| Threshold | Criteria | Action |
|-----------|----------|--------|
| Kill | <100 views in 24h OR <1% CTR after 48h | Remove from rotation 30 days |
| Moderate | 500-1k views, 1-2% CTR | Keep, test different hooks |
| Top performer | 2k+ views, 3%+ CTR, 1%+ conversion | Post 5-7x/week, create variations |

---

## Alert Triggers (Escalate to Boss)

| Alert | Trigger |
|-------|---------|
| Channel health declining | 3 days avg views <20% of prior week |
| Viral opportunity | Video >10k views in 24h |
| Algorithm shift | Hashtag performance drops >50% |
| API outage | TikTok API failures >3x daily |
| Compliance issue | Video flagged for policy violation |

---

## Reporting

**Daily**: Top performers (views, CTR, conversions, revenue), killed products, next actions.
**Weekly (Sunday)**: Revenue total, top 3 products, killed products + reasons, algorithm observations, next week recommendations.
**Monthly**: Revenue trajectory, top products cumulative, niche health assessment, forecast.

---

## Auto-Actions (No Human Intervention)
- Publish on schedule
- Track metrics
- Kill underperformers (<100 views/24h)
- Alert on viral (>10k views)

## Human Review (Weekly)
- Product rotation decisions
- Niche pivot decision
- Budget allocation

---

## Related

- [[2_architect/patterns/agents/conduit-content-generator]] — upstream content producer
- [[5_knowledge/reference/growth-playbooks/tiktok-best-practices]] — platform tactics
- [[5_knowledge/reference/growth-playbooks/affiliate-pipeline]] — revenue tracking
