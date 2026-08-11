# Shared Workflow — Pinterest Pipeline

## Purpose

Pinterest is used by all 3 ecosystems for different purposes. This shared workflow defines the common infrastructure; each ecosystem adds its own content strategy on top.

## How each ecosystem uses Pinterest

| Ecosystem | Pinterest purpose | Content type | Link destination |
|-----------|------------------|-------------|-----------------|
| Content | Distribution | Blog post pins, video pins, infographic pins | Blog, YouTube |
| Products | Traffic driver | Product mockup pins, lifestyle pins | Etsy, Shopify, Gumroad |
| Affiliate | Revenue driver | Product recommendation pins, comparison pins | Affiliate links |

## Shared Pinterest infrastructure

### Account strategy

One Pinterest business account per ecosystem (brand isolation). Each account:
- Separate email
- Separate brand name
- Website claimed and verified
- Rich pins enabled

### Board structure (per account)

5-10 boards per account, organized by niche/category:
- Each board has keyword-optimized title and description
- Boards map to content verticals (Content), product categories (Products), or affiliate niches (Affiliate)

### Pin creation pipeline

```
1. Image Generator agent creates pin image (2:3 ratio, 1000×1500px)
2. SEO Optimizer agent writes pin title + description (keyword-forward)
3. Compliance check — FTC disclosure added if affiliate link (Affiliate ecosystem)
4. Link attached (blog URL, product URL, or affiliate link)
5. → Human review gate (weekly batch)
6. Scheduler agent posts at optimal times
7. Analytics agent tracks impressions, clicks, saves
```

### Posting cadence

| Phase | Pins/day | Mix |
|-------|----------|-----|
| Launch (weeks 1-2) | 5 | 100% own content |
| Ramp (weeks 3-6) | 10-15 | 70% own, 30% repins |
| Steady state | 15-25 | 70% own, 30% repins |

### SEO rules for Pinterest

- Title: keyword first, 100 chars max
- Description: 2-3 sentences, primary keyword in first sentence, CTA at end
- Hashtags: 2-5 relevant (Pinterest hashtags have diminished but not zero value)
- Alt text: describe the image for accessibility AND keywords

## Tools

- Image Generator (shared agent) for pin images
- Pinterest API for publishing
- Scheduler (shared agent) for timing
- Analytics (shared agent) for tracking
- Canva Pro for template-based pin design (when AI generation insufficient)
