# Surge — Platform RPM Guide

Revenue-per-mille (RPM) rates, monetization requirements, and optimization strategies per platform.

=== ALL NUMBERS ARE ESTIMATES AS OF 2026-05 — VERIFY WITH CURRENT DATA ===

---

## Platform Comparison

| Platform | Monetization program | Estimated RPM | Requirements | Min video length for RPM |
|----------|---------------------|---------------|-------------|--------------------------|
| TikTok | Creator Rewards Program | $0.50-1.50 | 10K followers, 100K views/30 days | 1+ minute |
| YouTube Shorts | Shorts ad revenue sharing | $0.03-0.10 | 1K subs + 10M Shorts views/90 days | No minimum |
| Instagram Reels | Bonuses (invite-only, varies) | $0.10-0.50 | Varies by region/invitation | No minimum |
| X Video | Creator Revenue Sharing | $0.05-0.20 | X Premium subscriber, 5M impressions/3 months | No minimum |
| Facebook Reels | Performance bonuses | $0.10-0.30 | Varies by region/invitation | No minimum |

**Primary revenue target: TikTok.** Highest RPM for short-form, most predictable program.

---

## TikTok Optimization

### Key factors for RPM

| Factor | Impact | Strategy |
|--------|--------|----------|
| Video length | High | Always produce 1+ minute clips (required for Creator Rewards) |
| Retention rate | Very high | Surge Formula optimization — target 75%+ avg view duration |
| Niche | High | Some niches pay more (finance, tech, health > entertainment) |
| Geography | High | US/UK/AU viewers = higher RPM. Content in English optimizes for this. |
| Engagement | Medium | Comments and shares boost distribution, indirectly boosting RPM |
| Posting time | Medium | Post when target audience is active |
| Consistency | Medium | Daily posting maintains algorithmic favor |

### RPM by niche (rough estimates)

| Niche | Estimated RPM range |
|-------|-------------------|
| Finance / investing | $1.00-3.00 |
| Technology / AI | $0.80-2.00 |
| Health / wellness | $0.60-1.50 |
| History / education | $0.50-1.20 |
| Horror / stories | $0.40-1.00 |
| Entertainment / comedy | $0.30-0.80 |
| Motivation / self-improvement | $0.50-1.50 |

### TikTok posting schedule

- Peak hours (US): 7-9am EST, 12-3pm EST, 7-11pm EST
- Best days: Tuesday-Thursday (weekdays > weekends for RPM)
- Minimum: 1 post/day per account
- Target: 2-3 posts/day per account at scale

---

## YouTube Shorts Optimization

### Key differences from TikTok

- RPM is lower but audience is larger and more global
- Shorts can funnel viewers to long-form content (if you have a channel)
- YouTube's algorithm favors subscriber growth — optimize CTAs for subscribing
- Shorts ad revenue is split between creators (45%) and music rights holders

### YouTube-specific strategies

- Use Shorts as a funnel to build subscriber count for long-form monetization
- Optimize titles for YouTube search (Shorts appear in search results)
- YouTube Shorts can be up to 3 minutes — longer Shorts get more ad placements
- Cross-post TikTok content to Shorts with minor adaptations (remove TikTok watermark)

---

## Revenue Projection Model

### Conservative (1 vertical, 3 accounts, 5 clips/day)

```
Monthly views per account: 100K-500K
Total monthly views: 300K-1.5M
At $0.60 avg RPM: $180-900/month
```

### Moderate (2 verticals, 6 accounts, 10 clips/day)

```
Monthly views per account: 200K-1M
Total monthly views: 1.2M-6M
At $0.70 avg RPM: $840-4,200/month
```

### Aggressive (4 verticals, 12 accounts, 25 clips/day)

```
Monthly views per account: 300K-2M
Total monthly views: 3.6M-24M
At $0.80 avg RPM: $2,880-19,200/month
```

=== THESE ARE PROJECTIONS, NOT GUARANTEES. VALIDATE WITH REAL DATA BEFORE SCALING. ===

---

## RPM Tracking (Agent 09)

Agent 09 tracks daily:
- Views per post per platform
- RPM per post (where available via API)
- Revenue per account per day
- Best-performing content (by RPM, not just views)
- Niche RPM trends over time
- Geographic breakdown of viewers

Weekly digest surfaces:
- Top 5 clips by revenue
- Bottom 5 clips by RPM (what's underperforming?)
- Niche RPM trend (rising or falling?)
- Accounts approaching monetization thresholds
- Recommended vertical/niche adjustments

---

## Engagement Signals That Matter

Not all engagement is equal. The algorithm reads signal type as a proxy for content quality. Optimizing for the wrong signal produces views without reach.

**Hierarchy (descending importance as a scale indicator):**

| Signal | Why it matters | What it means |
|--------|---------------|---------------|
| **Saves** | Highest-weight signal on most platforms | "I want this later" — the viewer found it useful enough to retrieve again. Saves on Instagram and TikTok directly boost distribution. |
| **Shares** | Second-highest weight | "Someone else needs this" — the viewer is doing the platform's distribution job for free. Share = reach multiplier. |
| **Comments** | Strong engagement signal, drives dwell time | Generates reply loops, which extend session time on the post. Also a quality signal to the algorithm. |
| **Likes** | Weakest reach signal | Easy to tap, easy to ignore. Useful for A/B hook testing but a lagging indicator of reach. |

**Primary optimization axis:** saves and shares — not likes. These are **leading indicators of reach**, not vanity metrics. A post with 200 saves and 50 shares will outperform a post with 2,000 likes and 5 saves in algorithmic distribution.

**Practical implication — make keepable reference content:** content that delivers a reusable framework, a checklist, a step-by-step, or a contrarian insight the viewer will want back gets saved. Content that is merely entertaining gets liked and forgotten. The `viral` ecosystem's angle set (`mistake | beginner_question | transformation | contrarian | step_by_step`) is calibrated for saves because all five frames produce content the viewer wants to return to.

**Data rule:** let saves and shares data — not taste — decide what scales. When the feedback loop (Module 2 `performance_signal`) accumulates signal data, `saves` and `shares` are the primary columns the StrategyAdjuster should weight. If saves are rising on a particular hook category, double down. If a hook is generating likes but no saves, it is entertaining but not sticky.

---

## Monetization Threshold Strategy

For new accounts that haven't met monetization requirements:

| Platform | Threshold | Strategy |
|----------|-----------|----------|
| TikTok (10K followers) | Post episodic content with cliffhangers — drives follows. Comment-bait drives engagement. Post 3x/day. | 
| YouTube (1K subs + 10M views) | Cross-promote from TikTok. Use end-screen subscribe CTA. Consistent daily posting. |
| Instagram (invitation-based) | Focus on saves and shares. Carousel Reels drive saves. |

**Priority: Get TikTok monetized first** — highest RPM, most predictable path.
