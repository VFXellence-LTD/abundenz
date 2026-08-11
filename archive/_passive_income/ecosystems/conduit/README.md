# Conduit Ecosystem

Conduit is a multi-channel affiliate marketing ecosystem. Traffic flows from content platforms (Pinterest, TikTok) → product content → affiliate links → commission.

## Traffic Channels

### [[workflows/pinterest-growth|Pinterest]]
- Long-form content: pins, boards, descriptions
- SEO-friendly: pins indexed by Google, drive long-tail organic traffic
- Audience: 30-50yo females, lifestyle/home/wellness focus
- Monetization: affiliate links in pin descriptions, creator program
- Timeline: 2-3 months to initial traffic, 6+ months to meaningful revenue

### [[workflows/tiktok-growth|TikTok]]
- Short-form video: 15-60 sec, vertical (9:16)
- Algorithm-driven: trending sounds, hashtags, hook in first 3 seconds
- Audience: 13-40yo, broad interests (product reviews, unboxings, lifestyle)
- Monetization: Amazon Associates from day 1 (bio links), TikTok Shop Affiliate at 1K followers (10-25% commission)
- Timeline: Amazon revenue from day 1 via bio links. TikTok Shop unlocks at 1K followers (~4-8 weeks). Bridge with Amazon until then.
- **Risks**: Algorithm changes, platform moderation inconsistency, potential US regulatory uncertainty

## Ecosystem Architecture

```
Content Creation → Scheduling → Publishing → Analytics → Optimization
    (agents)       (scheduler)   (platforms)   (tracking)   (feedback loop)
       ↓                ↓            ↓              ↓             ↓
  TikTok, Pinterest   3-5x daily   Native APIs   CTR, Views   Niche refinement
   script/captions                              Conversions   Content iteration
```

## Workflow Files

- [[workflows/affiliate-pipeline|Affiliate Pipeline]] — End-to-end monetization setup (Stripe, TikTok Creator Affiliate, Amazon Associates)
- [[workflows/pinterest-growth|Pinterest Growth]] — Cold start to monetization strategy
- [[workflows/tiktok-growth|TikTok Growth]] — Cold start to Creator Affiliate unlocking

## Agents

See [[agents/README|agents README]] for agent roles and capabilities.

- **Agent 01**: Niche selector (market research)
- **Agent 02**: [[agents/02-content-generator|Content generator]] (scripts, captions, video generation)
- **Agent 03**: [[agents/03-scheduler|Scheduler]] (3-5 posts/day to TikTok, Pinterest)

## Playbooks

- [[playbooks/tiktok-best-practices|TikTok Best Practices]] — Platform tactics, FTC compliance, Creator Affiliate setup

## Brief

- [[brief/niche-selection|Niche Selection]] — Decision framework for product categories and content angles

## Key Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| TikTok followers | 1,000 (Shop Affiliate unlock) | 4-8 weeks (3-5 posts/day) |
| TikTok avg views/video | 500-2k | Month 1-2 |
| TikTok avg views/video | 5k-20k | Month 3+ (after Creator Affiliate) |
| Pinterest monthly views | 10k | 2-3 months |
| Pinterest monthly views | 100k+ | 6+ months |
| Conversion rate (traffic → click) | 2-5% | Steady |
| Conversion rate (click → purchase) | 1-3% | Steady |
| Revenue per 1k views | $0.50-$2.00 | Platform + niche dependent |

## Starting a New Niche

1. **Select niche** via [[brief/niche-selection|niche selection framework]]
2. **Research competitors** — what products are they promoting? What's the affiliate commission structure?
3. **Set up affiliate programs** — TikTok Creator Affiliate, Amazon Associates, brand-specific programs
4. **Create content calendar** — 30 days of product ideas (Agent 02)
5. **Generate video + pin content** — short clips (TikTok), long-form pins (Pinterest)
6. **Launch TikTok channel** — 3-5 posts/day, Amazon bio links from day 1, TikTok Shop at 1K followers
7. **Launch Pinterest boards** — organize by product category
8. **Track performance** — views, CTR, conversions (in [[workflows/affiliate-pipeline|pipeline]])
9. **Iterate** — double down on high-performing content types, pivot away from low performers

## Success Factors

- **Consistency**: 3-5 TikTok posts/day is non-negotiable until 1K followers (TikTok Shop unlock)
- **Hook**: First 3 seconds of TikTok video determine 80% of retention — hook must be immediate
- **Trending audio**: TikTok algorithm favors content using trending sounds in first 3 months
- **Product relevance**: Only promote products you'd actually use — authenticity matters
- **FTC compliance**: All affiliate content must disclose #ad or #affiliate
- **Niche focus**: Don't jump between niches — pick one, own it for 3+ months before pivoting
