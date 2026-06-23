# Shared Agent: Research Analyst

Autonomous research intelligence system. Discovers profitable niches, viral trends, emerging products, high-retention content formats, and underserved audience opportunities across the internet. Feeds ALL ecosystems with actionable intelligence.

## Relationship to Trend Scanner

| Agent | Scope | Frequency | Depth |
|-------|-------|-----------|-------|
| **Trend Scanner** | What's trending RIGHT NOW | Every 6 hours | Surface — headlines, velocity, keywords |
| **Research Analyst** | What's EMERGING, underserved, monetizable | Weekly + on-demand | Deep — scoring, audience analysis, monetization paths, format analysis |

Trend Scanner = tactical radar. Research Analyst = strategic intelligence.

## Automation Tier

**Autonomous** — runs on weekly schedule. Human reviews digest and routes opportunities to ecosystems. Can also be triggered on-demand ("research [topic]").

## Ecosystem Routing

| Finding type | Routes to |
|-------------|-----------|
| Viral content format / hook pattern / retention structure | Surge (vertical ideas, content strategy) |
| Niche topic with depth potential | Signal (pillar content ideas) |
| Trending product / impulse-buy / aesthetic product | Atelier (product ideas — parked until activation) |
| Affiliate opportunity / high-commission product | Conduit (affiliate ideas — parked until activation) |
| Kid-friendly content opportunity | Surge (kid-friendly verticals) |
| Newsletter / community opportunity | Signal or Surge (depending on niche) |
| Cross-ecosystem opportunity | Controller (logged for Boss review) |

## Tools Required

| Tool | Purpose |
|------|---------|
| Supadata MCP | Social media transcript + metrics extraction from viral content |
| Claude API (claude-sonnet-4-6) | Analysis, scoring, synthesis, pattern detection |
| Web search | Google Trends, Reddit, Hacker News, Product Hunt, Exploding Topics |
| Airtable | Opportunity tracking database |

## Data Sources

### Social Platforms
- Reddit (subreddit monitoring, rising posts, comment sentiment)
- TikTok (via Supadata — trending sounds, formats, creators)
- YouTube (trending, rising creators, comment analysis)
- Instagram (Reels trends, hashtag velocity)
- X/Twitter (trending topics, viral threads)
- Facebook groups (community pain points, product discussion)
- Discord communities (niche signal, early adopter behavior)

### Trend Sources
- Google Trends (search volume velocity)
- Exploding Topics (pre-mainstream trend detection)
- TikTok Creative Center (trending hashtags, sounds, creators)
- Amazon Movers & Shakers (product velocity)
- Etsy Trends (handmade/digital product demand)
- Product Hunt (new product launches, upvote velocity)
- IndieHackers (bootstrapper community, SaaS/product ideas)
- Hacker News (tech community signal)

### Signal Types

**Community signals** (high weight — organic demand indicators):
- Repeated complaints = market opportunity
- "Why doesn't this exist?" = product gap
- Arguments and debates = emotional engagement
- Confession-style posts = audience vulnerability
- FAQs = content opportunity
- Viral reposting = format validation

**Content signals:**
- Rapid engagement growth on new formats
- Unusually high comment-to-view ratios
- Content cloning behavior (creators copying a format = validated)
- Recurring hooks across unrelated creators
- Creator imitation waves

**Ecommerce signals:**
- Fast-rising products on Amazon/Etsy
- Impulse-buy products trending on TikTok Shop
- Fandom-driven purchase spikes
- Aesthetic/lifestyle product adoption curves
- Hobby ecosystem spending patterns

## Research Process

### Weekly scan (automated)

```
1. COLLECT — Pull data from all sources for configured niche categories
2. FILTER — Remove noise: corporate press, bot activity, recycled trends
3. CLUSTER — Group related signals into opportunity clusters
4. SCORE — Rate each cluster on 10 dimensions (see scoring system below)
5. ANALYZE — For top-scoring opportunities, deep-analyze format, audience, monetization
6. ROUTE — Tag each opportunity for relevant ecosystem(s)
7. REPORT — Generate weekly intelligence digest
```

### On-demand research (human-triggered)

Boss drops a topic/URL/idea → Research Analyst produces a full opportunity analysis with scoring, audience map, content format recommendations, and monetization paths.

## Scoring System

Every opportunity scored 1-10 on 10 dimensions:

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Virality Potential | 15% | Would people share this? Does it trigger emotional forwarding? |
| Emotional Intensity | 12% | How strongly does the audience feel about this? (anger, awe, fear, joy, curiosity) |
| Monetization Potential | 15% | Can this generate revenue? Through what channels? |
| Audience Obsession | 10% | Is there a dedicated community? Do people return repeatedly? |
| Growth Velocity | 12% | Is engagement accelerating? What's the trajectory? |
| Repeatability | 8% | Can this topic sustain 50+ pieces of content, or is it one-off? |
| Low Competition Opportunity | 10% | How many creators/products already serve this? |
| AI Automation Compatibility | 8% | Can content/products be generated with AI tools at scale? |
| Short-Form Suitability | 5% | Does this work as 30-90 sec clips? |
| Long-Form Expansion Potential | 5% | Could this grow into pillar content, courses, or products? |

**Composite opportunity score** = weighted sum, 0-100.

| Score range | Classification |
|-------------|---------------|
| 80-100 | Priority opportunity — escalate to Boss |
| 60-79 | Strong opportunity — add to ecosystem backlog |
| 40-59 | Worth monitoring — flag for next week |
| 0-39 | Skip — low signal |

## Content Pattern Analysis

Track recurring successful patterns across platforms:

### Hook taxonomy

| Category | Examples |
|----------|---------|
| Impossibility | "This is statistically impossible" / "Nobody can explain" |
| Survival | "This guy survived..." / "0.01% chance" |
| Revelation | "Nobody talks about..." / "This sounds fake but is real" |
| Outrage | "This company accidentally..." / "They tried to hide this" |
| Mystery | "The internet found..." / "No one noticed for years" |
| Aspiration | "From $0 to $X in Y months" / "The system that changed everything" |
| Disbelief | "Wait, this is actually legal?" / "This shouldn't work but does" |

### Format analysis (per opportunity)

- Pacing speed (cuts per minute)
- Average cut frequency
- Subtitle/caption style
- Emotional spike cadence
- Cliffhanger usage pattern
- Retention loop structure
- Thumbnail language patterns
- Title structure patterns

## Output Schema

### Per-opportunity JSON

```json
{
  "opportunity_id": "",
  "topic": "",
  "summary": "",
  "discovered_date": "",
  "platforms_detected": [],
  "audience": {
    "demographics": "",
    "psychographics": "",
    "size_estimate": "",
    "spending_behavior": ""
  },
  "why_it_works": "",
  "emotional_drivers": [],
  "viral_hooks": [],
  "recommended_content_formats": [],
  "monetization_options": [
    {
      "method": "",
      "estimated_revenue": "",
      "difficulty": ""
    }
  ],
  "competition_level": "low|medium|high|saturated",
  "growth_stage": "emerging|accelerating|mainstream|declining",
  "estimated_longevity": "flash|weeks|months|evergreen",
  "affiliate_or_product_potential": "",
  "ai_automation_potential": "low|medium|high|full",
  "content_examples": [],
  "search_keywords": [],
  "related_subreddits": [],
  "creator_opportunities": [],
  "ecosystem_routing": {
    "surge": { "relevant": true, "vertical_suggestion": "", "format": "" },
    "signal": { "relevant": false, "topic_suggestion": "" },
    "atelier": { "relevant": false, "product_suggestion": "" },
    "conduit": { "relevant": false, "affiliate_suggestion": "" }
  },
  "scores": {
    "virality_potential": 0,
    "emotional_intensity": 0,
    "monetization_potential": 0,
    "audience_obsession": 0,
    "growth_velocity": 0,
    "repeatability": 0,
    "low_competition": 0,
    "ai_automation_compatibility": 0,
    "short_form_suitability": 0,
    "long_form_expansion": 0,
    "composite_score": 0
  },
  "kid_friendly_viable": false,
  "safeguard_flags": []
}
```

### Weekly digest format

```
# Research Digest — Week of {date}

## Priority Opportunities (score 80+)
[opportunity cards with full analysis]

## Strong Opportunities (score 60-79)
[summary cards with key metrics]

## Monitoring (score 40-59)
[one-line entries with score and growth direction]

## Pattern Updates
- New hooks detected this week
- Formats gaining traction
- Niches showing saturation signals
- Platform policy changes affecting strategy

## Ecosystem Recommendations
- Surge: [new vertical suggestions, format updates]
- Signal: [topic ideas, audience insights]
- Atelier: [product opportunities — logged for activation]
- Conduit: [affiliate opportunities — logged for activation]
```

Written to: `ecosystems/shared/_research/{YYYY-MM-DD}-digest.json` + `_research/{date}-digest.md`

## Advanced Capabilities

### Pre-mainstream detection
- Track topics appearing in small communities (< 10K subscribers) that match patterns of past viral breakouts
- Monitor "Why doesn't this exist?" posts across Reddit, HN, and Discord

### Micro-niche clustering
- Group related signals into niche clusters (e.g., "vintage tech nostalgia" = r/retrogaming + VHS aesthetic TikTok + cassette culture Etsy)
- Identify cluster intersections (two niches merging = new opportunity)

### Audience tribal behavior
- Map community identity markers, language patterns, and loyalty signals
- Identify communities with strong in-group identity (high engagement, repeat consumption)

### Saturation detection
- Flag niches where creator supply is outpacing audience demand
- Track diminishing returns on viral formats (same hook, declining engagement)

### Faceless/AI content suitability
- Score every opportunity for feasibility without personal identity
- Prioritize niches where anonymity is neutral or positive (entertainment > trust-based advice)

## Behavioral Rules

1. **Prefer organic discussion over corporate media.** Reddit comments > press releases.
2. **Weight complaints heavily.** Repeated frustration = validated demand.
3. **Treat reposting as validation.** Content being cloned by multiple creators = proven format.
4. **Distinguish flash from durable.** Memes last days; niches last years. Score accordingly.
5. **Favor repeat consumption.** Niches where audiences return daily > one-time viral spikes.
6. **Flag saturation early.** If 50+ creators are already doing it, opportunity score drops.
7. **Surface automation-friendly opportunities.** Polymath's edge is AI pipeline — prioritize niches where AI tools can produce at scale.
8. **Focus on actionable findings.** "People like funny videos" is not a finding. "Pet owners over 40 are spending $X on custom pet portraits and no creator serves this niche with AI-generated options" is a finding.
9. **Apply safeguard check.** Flag opportunities that would require violating Surge safeguards. Score kid-friendly viability separately.

## Special Research Modes

Can be configured to focus on specific opportunity types:

| Mode | Focus | Primary ecosystem |
|------|-------|-------------------|
| `faceless-youtube` | Faceless channel formats, niches, growth strategies | Surge |
| `tiktok-brainrot` | High-retention short-form formats, hooks, pacing | Surge |
| `educational` | Explainer content, course opportunities, knowledge niches | Signal or Surge |
| `ecommerce` | Trending products, impulse-buy opportunities, aesthetic markets | Atelier |
| `affiliate` | High-commission products, review niches, comparison content | Conduit |
| `digital-products` | Templates, courses, guides, printables, tool demand | Atelier or Signal |
| `newsletters` | Newsletter-friendly niches, subscriber willingness, sponsorship markets | Signal |
| `kid-friendly` | Child-safe content opportunities, family audience, educational entertainment | Surge (kid verticals) |
| `ai-automation` | Niches where AI tools provide strongest production advantage | All |

Trigger mode with: "Research [mode]: [optional topic constraint]"

## Build Order

Depends on Supadata MCP (installed) and Claude API. Can be built as a Make.com scenario or n8n workflow. Start with manual research using the prompt template below, automate after 30 days of manual use.

## Prompt Template (for manual use)

Use this prompt with Claude to run research manually before building automation:

```
You are an autonomous AI research analyst. Your purpose is to discover profitable niches, viral trends, emerging products, and underserved audience opportunities.

RESEARCH FOCUS: [specify mode or topic]
TIME HORIZON: [this week / this month / emerging]
ECOSYSTEM PRIORITY: [Surge / Signal / all]

For each opportunity you discover:
1. Score it on 10 dimensions (virality, emotional intensity, monetization, audience obsession, growth velocity, repeatability, low competition, AI automation compatibility, short-form suitability, long-form expansion)
2. Output the full opportunity JSON schema
3. Recommend which Polymath ecosystem should act on it
4. Suggest specific content formats, hooks, and monetization paths
5. Flag safeguard concerns and kid-friendly viability

Behavioral rules:
- Prefer organic community signals over corporate media
- Weight complaints and frustrations as market opportunities
- Treat content cloning as format validation
- Distinguish flash trends from durable niches
- Prioritize automation-friendly opportunities
- Be specific and actionable, not generic

Output a ranked list of opportunities with full analysis.
```

## Related Documents

- [[trend-scanner]] — real-time tactical trend detection (complementary)
- [[../../viral/shared/playbooks/viral-formula]] — how Surge processes content opportunities
- [[../../viral/shared/playbooks/hook-library]] — hook taxonomy (updated by this agent's findings)
- [[../../viral/safeguards/POLICY]] — content safeguards (applies to all opportunities)
- [[../../../shared/skills/niche-locker/SKILL]] — niche evaluation matrix (for deeper niche commitment decisions)
