# Tax Categories — Income & Expense Classification

UK-focused. VFXellence is the holding entity for all Polymath ecosystems. Consult accountant for edge cases.

---

## Business Entity

| Field | Value |
|-------|-------|
| Entity | VFXellence |
| Type | Registered business (dormant consultancy, reactivating) |
| Bank | VFXellence business bank account |
| Jurisdiction | UK |
| Tax registration | Self Assessment (sole trader) or Ltd — confirm with accountant |
| VAT | Register when turnover exceeds £90,000 (2024/25 threshold — verify annually) |

### Entity structure

```
VFXellence (registered business)
├── Content ecosystem  ← brand "X" (public-facing)
├── Products ecosystem ← brand "Y" (public-facing)
└── Affiliate ecosystem ← brand "Z" (public-facing)
```

All revenue and expenses flow through VFXellence business account. Ecosystems are tracked as categories/cost centers within VFXellence's books, not separate entities.

**Separate LLCs/Ltd companies per ecosystem:** Only when individual ecosystem exceeds ~£25k/yr revenue. Until then, one entity with good bookkeeping is sufficient.

---

## Income categories

| Category | Self Assessment box | Ecosystems | Examples |
|----------|-------------------|-----------|---------|
| Trading income | Box 15 (Turnover) | All | All revenue is trading income for a sole trader |
| Product sales | Turnover | Products, Content | Etsy digital downloads, KDP royalties, Gumroad sales, POD sales |
| Service income | Turnover | Content | Consulting fees, coaching, audit engagements |
| Advertising revenue | Turnover | Content | YouTube AdSense, podcast ad insertions |
| Sponsorship income | Turnover | Content | Brand sponsorship payments |
| Affiliate commissions | Turnover | Affiliate, Content | Amazon Associates, Clickbank, Digistore24 |
| Membership/subscription | Turnover | Content | Patreon, paid newsletter tier, community fees |
| Licensing income | Turnover | Content (Lullaby) | App licensing fees (Calm, Headspace) |

**Note:** All income categories report as trading income on Self Assessment. The breakdown by category is for internal tracking and accountant reporting, not HMRC line items.

---

## Expense categories (allowable deductions)

| Category | Examples | Ecosystems |
|----------|---------|-----------|
| Office/admin | Software subscriptions, hosting, domains, API costs, Canva, Make.com | All |
| Advertising & marketing | Pinterest ads, Facebook ads, promoted listings, domain purchases | All |
| Professional services | Accountant, lawyer (COPPA review), freelance editors/writers | All |
| Equipment (capital allowance) | Computer, camera, microphone (claim via Annual Investment Allowance) | Content |
| Equipment (small items) | Items under £1,000 — claim full cost in year of purchase | All |
| Travel | Travel to client sites, conferences | Content |
| Use of home | Proportional rent/mortgage interest, utilities, broadband | All |
| Training & education | Courses, books, conference tickets (must relate to existing trade) | All |
| Bank charges | Business account fees, payment processing fees | All |
| Phone & internet | Business proportion of mobile + broadband | All |

### Capital allowances

- **Annual Investment Allowance (AIA):** 100% deduction on qualifying equipment up to £1,000,000/yr
- Computers, cameras, microphones, studio equipment all qualify
- Items under £1,000 can be expensed directly without AIA claim

### Use of home

HMRC simplified method: £6/week (£312/year) flat rate for working from home. No receipts needed. Or calculate actual proportion — whichever is higher.

---

## Platform fee handling

Platform fees (Etsy 6.5%, Gumroad 10%, KDP royalty split) reduce gross receipts. Two valid approaches:

1. **Record gross + fee separately** — gross as income, fee as expense. More transparent.
2. **Record net only** — simpler but less detailed.

**Recommendation:** Record gross + fee separately. Matches platform statements, easier to reconcile, accountant prefers it.

---

## VAT considerations

| Threshold | Action |
|-----------|--------|
| Under £90k turnover | VAT registration optional (flat rate scheme may benefit) |
| Over £90k turnover | VAT registration mandatory |
| Digital services to EU consumers | May trigger OSS (One Stop Shop) obligations |
| Selling on Etsy/Amazon | Marketplace handles VAT on most consumer sales |

**Phase 0 action:** Don't register for VAT yet. Monitor turnover. Register when approaching threshold. Accountant should advise.

---

## Tax deadlines (UK)

| Deadline | Date | What |
|----------|------|------|
| Tax year end | 5 April | UK tax year runs 6 April – 5 April |
| Self Assessment registration | 5 October | Register by 5 Oct following the tax year you started trading |
| Self Assessment filing (online) | 31 January | File + pay by 31 Jan following the tax year |
| Payment on Account 1 | 31 January | 50% of next year's estimated tax |
| Payment on Account 2 | 31 July | Remaining 50% of next year's estimated tax |

**Dashboard should alert Boss:** 2 weeks before 31 January and 31 July deadlines.

---

## Record retention

Keep all receipts, invoices, platform statements, and bank records for **6 years** (HMRC requirement for self-employed). Digital copies acceptable — screenshot + PDF of platform dashboards monthly.

---

## Payments from US platforms

Most Polymath revenue comes from US platforms (YouTube, Amazon, Etsy, Clickbank). Key considerations:

- **W-8BEN form:** File with each US platform to claim UK-US tax treaty benefits (reduced US withholding: 0% on most income types, 15% on royalties)
- **YouTube AdSense:** File W-8BEN to avoid 30% US withholding on US-viewer ad revenue
- **Amazon Associates:** W-8BEN required for payouts
- **Currency conversion:** Record GBP equivalent at date of receipt. Use platform's conversion rate or mid-market rate. Be consistent.
- **Foreign income:** All foreign income reportable on Self Assessment. No double taxation due to UK-US treaty.

---

## National Insurance

Self-employed NICs:
- **Class 2:** £3.45/week (if profits > £12,570 — the personal allowance)
- **Class 4:** 6% on profits between £12,570–£50,270; 2% above £50,270

Paid with Self Assessment. Dashboard should include NIC estimate alongside income tax estimate.

---

## What VFXellence pays for (route through business account)

All of these are deductible business expenses:
- Domain registrations
- Hosting (Ghost, Vercel, VPS)
- Software subscriptions (Midjourney, Canva, beehiiv, Make.com, Higgsfield)
- API costs (Claude API, Deepgram, etc.)
- Equipment (microphone, camera, lighting)
- Professional services (accountant, lawyer)
- Advertising spend (Pinterest ads, etc.)
- Freelancer payments (editors, writers, designers)

**Do NOT pay personal expenses through business account.** Keep personal and business spending strictly separate.
