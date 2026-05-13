# Shared Workflow — Revenue Tracking

## Purpose

Single source of truth for all income and expenses across Polymath. All transactions flow through **VFXellence** business bank account. Feeds the dashboard, tax center, and controller analytics. See [[compliance/business-entity]] for entity structure and [[compliance/tax-categories]] for UK tax classification.

## Data model

### Transaction record

| Field | Type | Example |
|-------|------|---------|
| id | auto-increment | 1042 |
| date | date | 2026-05-11 |
| ecosystem | enum | content / products / affiliate |
| vertical_or_platform | string | vfx-pipeline / etsy / amazon |
| stream | string | adsense / affiliate / product-sale / consulting / sponsorship |
| description | string | "Pipeline Starter Kit sale via Gumroad" |
| amount | decimal | 79.00 |
| currency | string | GBP (default) or USD |
| type | enum | income / expense / refund |
| tax_category | string | product-sales / advertising / subscription / contractor |
| platform_fee | decimal | 7.90 |
| net_amount | decimal | 71.10 |
| receipt_url | string (optional) | link to screenshot or invoice |
| notes | string (optional) | "Repeat customer" |

### Monthly summary

| Field | Example |
|-------|---------|
| month | 2026-05 |
| gross_income | 2,450.00 |
| platform_fees | 245.00 |
| tool_costs | 70.00 |
| ad_spend | 0.00 |
| contractor_costs | 0.00 |
| net_profit | 2,135.00 |
| by_ecosystem | { content: 1800, products: 400, affiliate: 250 } |

## Input methods

1. **API auto-import** — YouTube, Etsy, Gumroad, beehiiv, affiliate dashboards pull automatically
2. **CSV bulk import** — for platforms without API (KDP, some affiliate networks)
3. **Manual entry** — consulting invoices, sponsorship payments, one-off income
4. **Receipt capture** — photo/screenshot upload attached to transaction

## Tax categorization

Every transaction auto-categorized per UK Self Assessment. See [[compliance/tax-categories]] for full breakdown.

| Tax category | Type | Examples |
|-------------|------|---------|
| product-sales | Income (Turnover) | Digital downloads, KDP royalties, POD sales |
| service-income | Income (Turnover) | Consulting fees, sponsorship payments |
| advertising-income | Income (Turnover) | YouTube AdSense, podcast ads |
| affiliate-commission | Income (Turnover) | Amazon Associates, Clickbank, Digistore24 |
| subscription-expense | Expense (Office/admin) | Midjourney, beehiiv, Canva, Make.com |
| tool-expense | Expense (Office/admin) | Higgsfield credits, API costs |
| contractor-expense | Expense (Professional services) | Freelance writers, editors, designers |
| advertising-expense | Expense (Marketing) | Pinterest ads, Facebook ads |
| hosting-expense | Expense (Office/admin) | Ghost, VPS, domain registration |
| education-expense | Expense (Training) | Courses, books, conference tickets |
| equipment-expense | Expense (Capital allowance) | Microphone, camera, computer upgrades |
| home-office | Expense (Use of home) | £6/week flat rate or actual proportion |

## Tax estimate workflow (UK)

1. Sum all income for the tax year (6 Apr – 5 Apr)
2. Sum all allowable expenses
3. Calculate taxable profit (income - expenses)
4. Apply: Income Tax (20% basic / 40% higher) + Class 4 NIC (6% / 2%) + Class 2 NIC (£3.45/week)
5. Subtract payments on account already made
6. Output: estimated tax bill
7. Alert Boss 2 weeks before UK deadlines (31 January, 31 July)

## Currency handling

Most platform payouts arrive in USD. Record:
- Original amount + currency (USD)
- GBP equivalent at date of receipt (use platform conversion rate or mid-market)
- Be consistent with conversion method across all transactions

## Storage

SQLite database in Polymath dashboard app. No cloud dependency. Exportable to CSV/JSON at any time.
