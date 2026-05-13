# Agent 01 — Product Scout

Finds profitable products for Conduit to promote. Runs on a daily scan (new trending products) and weekly deep research (review mining, competitor analysis). Outputs a ranked product list consumed by [[02-content-generator]].

---

## Responsibility

- Scan Amazon bestseller lists across active niches
- Identify products with high commission potential
- Mine Amazon reviews for buyer psychology and marketing angles
- Score each product against a profitability model
- Maintain a ranked active product list
- Flag discontinued products and expired promotions for [[04-link-manager]]

---

## Data Sources

| Source | Data | Access Method |
|--------|------|--------------|
| Amazon Bestsellers | Trending physical products | Web scrape or Product Advertising API |
| Amazon Reviews | Buyer psychology, pain points, praise language | Web scrape + Claude analysis |
| Clickbank Marketplace | Digital product commission rates and gravity | Web scrape |
| Digistore24 Marketplace | European digital products | Web scrape |
| Google Trends | Search trend signals | Google Trends API or web |
| Pinterest Trends | Pinterest-specific trending topics | Pinterest Trends page |

---

## Product Scoring Model

Each product receives a score. Products with score ≥ 60 enter the active rotation.

```
Score = (commission_value × 40) + (demand_signal × 30) + (competition_score × 20) + (content_ease × 10)
```

**commission_value** (0–10): estimated revenue per 100 clicks
- Amazon physical, 2–4% rate, $50 avg order → ~$1.50/100 clicks = score 3
- Amazon physical, 6–8% rate, $150 avg order → ~$10.50/100 clicks = score 7
- Clickbank digital, 50% rate, $200 product → ~$20/100 clicks = score 9

**demand_signal** (0–10): search and social interest
- BSR < 1000 in category = 10
- BSR 1000–5000 = 8
- BSR 5000–20000 = 6
- BSR 20000+ = 3

**competition_score** (0–10): reverse of competition level
- Top Google results: only aggregators and Amazon itself = 8 (low competition)
- Top results: mix of independent sites = 5
- Top results: many established affiliate sites = 2

**content_ease** (0–10): how easily AI can create accurate, compelling content
- Bestseller with 1000+ reviews, clear use case = 10
- Product with few reviews or complex feature set = 5
- Product requiring personal testing claim = 2

---

## Runs

### Daily Scan (Automated, no human input)
- Check Amazon bestseller lists for all active niches
- Check Clickbank Gravity leaderboard
- Identify any new entries in top 10 of each niche
- Score new products
- Add products scoring ≥ 60 to active queue
- Flag products from active queue that have dropped out of top 50 BSR for review

**Output**: Updated product list in data store (Google Sheets / Airtable row)

### Weekly Deep Research (Automated, output reviewed in weekly batch)
- For top 3 new products by score: run review mining analysis
- Pull 50 most recent Amazon reviews per product
- Run Claude analysis prompt (below) to extract marketing angles
- Output: Product card with marketing angles, ready for [[02-content-generator]]

---

## Review Mining

Review mining extracts the language real buyers use to describe problems and solutions. This is the single highest-value input to content generation — content that uses buyer language converts better than content written from product specs.

### Scraping Reviews

Scrape the Amazon product page for the target product. Extract:
- All 4-star and 5-star reviews (up to 50)
- All 1-star and 2-star reviews (up to 20, for understanding objections)

Target URL pattern:
```
https://www.amazon.com/product-reviews/{ASIN}/?filterByStar=five_star&pageNumber=1
```

### Review Mining Prompt

Send the scraped review text to Claude with this prompt:

```
You are a direct response copywriter analysing Amazon reviews for a product we want to promote as affiliates.

Product: [PRODUCT NAME]
Category: [CATEGORY]

Here are real customer reviews:

[PASTE REVIEWS HERE]

Analyse these reviews and output:

1. TOP 5 BUYING TRIGGERS
List the 5 most common reasons people bought this product (use their exact language where possible).

2. TOP 3 FEARED ALTERNATIVES  
What were people doing before buying this? What was failing them? What did they want to avoid?

3. TOP 3 TRANSFORMATION PHRASES
Phrases customers use to describe how their situation changed after purchase. ("Finally...", "I used to... now I...", etc.)

4. TOP 3 OBJECTIONS (from negative reviews)
Common complaints or hesitations. We'll address these in content to build trust.

5. POWER WORDS
10–15 specific words or short phrases customers use repeatedly. These are our keyword candidates.

6. ONE-SENTENCE HOOK
A single punchy sentence that captures why someone MUST have this product, written in the style of the reviews (not corporate).

Format as numbered lists. Use buyer language, not marketing language.
```

### Review Mining Output (Product Card)

```yaml
product_name: [NAME]
asin: [ASIN]
affiliate_link: [LINK - filled by Agent 04]
category: [CATEGORY]
score: [SCORE]
avg_commission_est: $[X]
bsr: [NUMBER]

buying_triggers:
  - [trigger 1]
  - [trigger 2]
  - [trigger 3]
  - [trigger 4]
  - [trigger 5]

feared_alternatives:
  - [alternative 1]
  - [alternative 2]
  - [alternative 3]

transformation_phrases:
  - [phrase 1]
  - [phrase 2]
  - [phrase 3]

objections:
  - [objection 1]
  - [objection 2]
  - [objection 3]

power_words:
  - [word 1]
  - [word 2]
  - [word 3]
  # ... up to 15

hook: "[ONE-SENTENCE HOOK]"
```

---

## Clickbank / Digistore24 Product Research Prompt

For digital products where reviews are sparse or on a separate platform:

```
You are researching a digital product for affiliate promotion.

Product: [PRODUCT NAME]
Sales page URL: [URL]
Price: $[X]
Commission: [X]%

Analyse the sales page and any available testimonials. Output:

1. CORE PROMISE — What does the product promise to change in the buyer's life?
2. TARGET BUYER — Who is this for? What situation are they in right now?
3. URGENCY ANGLE — Why should someone buy now rather than later?
4. TRUST SIGNALS — What proof does the page use? (testimonials, guarantees, credentials)
5. CONTENT ANGLES — 5 specific angles I could use for Pinterest pins or blog content
   (each angle = one pin concept, e.g. "Before/After", "Top 3 Reasons", "Common Mistake", etc.)
6. KEYWORDS — 10 search terms someone would use when looking for a solution this product provides
```

---

## Output Schema

The Scout maintains a live product database:

| Field | Type | Notes |
|-------|------|-------|
| product_name | string | Full product name |
| asin | string | Amazon ASIN or Clickbank ID |
| platform | string | amazon / clickbank / digistore24 / direct |
| niche | string | From active niche list |
| score | int | 0–100 |
| affiliate_link | string | Filled by Agent 04 |
| commission_rate | float | Percentage |
| avg_order_value | float | Estimated AOV in $ |
| bsr | int | Amazon BSR if applicable |
| status | enum | active / paused / dead |
| product_card | text | Full YAML product card |
| added_date | date | When added to database |
| last_checked | date | Last BSR / availability check |

---

## Failure Handling

| Failure | Action |
|---------|--------|
| Amazon API rate limit | Backoff 1 hour, retry |
| Product page 404 on check | Flag status = dead, notify Agent 04 |
| No products score ≥ 60 in niche | Widen BSR threshold to top 100, re-score |
| Claude API unavailable | Skip deep research for that run, retry next day |
| Review scraping blocked | Switch to cached review data from previous week |
