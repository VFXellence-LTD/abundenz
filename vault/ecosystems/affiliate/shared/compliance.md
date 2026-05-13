# Compliance Safeguards

Hard rules for Conduit. These are non-negotiable and apply to every piece of content generated, every platform used, and every affiliate programme joined.

---

## The Non-Negotiables

### Rule 1 — Every affiliate-linked piece of content must include FTC disclosure

No exceptions. No "I'll add it later." The disclosure must be:
- Present before or at the affiliate link, not only in a site-wide footer
- In plain language that a first-time visitor understands
- Not hidden by small font, low contrast, or formatting tricks

Violation consequence: FTC fines, affiliate programme termination, platform account ban.

### Rule 2 — Never make misleading product claims

Content must only assert what is grounded in:
- Verifiable product specifications (manufacturer claims, Amazon listing)
- Real buyer reviews (attributed appropriately)
- General consumer reporting (publicly available)

Content must not:
- Claim Conduit "tested" or "reviewed" any product (Conduit has no human reviewer)
- Fabricate buyer testimonials or attribute fake quotes to named individuals
- Use "best" without qualification (say "top-rated" or "bestselling in [category]" with verifiable basis)
- Make superlative claims without evidence ("the only chair that...")

### Rule 3 — Never make prohibited category claims

| Claim Type | Prohibited Language | Compliant Alternative |
|-----------|--------------------|--------------------|
| Health cure | "This supplement cures diabetes" | "Supports blood sugar management" (only if manufacturer claims this) |
| Weight loss | "Lose 30 lbs in 30 days guaranteed" | "Customers report feeling lighter" (only if sourced from real reviews) |
| Income | "This course made me $50K/month" | Do not make income claims for digital products at all |
| Medical | "Clinically proven to..." | Only use if product has actual clinical studies, cited correctly |

### Rule 4 — Never cloak affiliate links

Do not use link cloakers that present a non-affiliate URL to the user or to platform systems while redirecting to an affiliate destination.

- Amazon requires links that resolve to amazon.com domain
- Bitly and similar transparent redirects (301) are acceptable — they do not hide the destination
- Pretty Links (WordPress plugin) in redirect mode (not cloaking mode) is acceptable
- "Cloaking" plugins that mask amazon.com are explicitly prohibited by Amazon TOS

### Rule 5 — Never incentivise clicks

Do not offer anything of value in exchange for clicking an affiliate link:
- Contest entries
- Discounts
- Cashback
- Points
- Any reward

This applies to all platforms and all affiliate programmes.

### Rule 6 — Amazon Associates: no links in email or offline

Amazon explicitly prohibits using Associates links in:
- Email newsletters (any mailing list)
- PDFs sent via email
- Printed materials
- Any offline media

Blog posts and Pinterest pins: allowed.

### Rule 7 — Brand isolation from other Polymath ecosystems

Conduit must never cross-link to or reference:
- Signal ecosystem (any Signal brand name, handles, domain, or content)
- Atelier ecosystem
- Lullaby ecosystem
- Any other Polymath ecosystem

This is not a compliance requirement in the legal sense — it is an operational rule to protect Signal's authenticity and Conduit's anonymity.

---

## Platform-Specific Rules

### Pinterest
- Affiliate links in pins: allowed (as of current policy)
- Link cloaking that hides destination: prohibited
- Incentivised clicks: prohibited
- Misleading imagery (showing results not typical): prohibited
- Spam behaviour (bulk identical pins): account ban risk

Verify Pinterest's current policy on affiliate links at activation. Policy has changed in the past.

### Amazon Associates
- Disclosure required: yes
- Link in email: prohibited
- Link cloaking: prohibited
- Price display: prohibited (prices change; displaying stale prices is a violation)
- Minimum 3 sales within 180 days of joining or account closed

### Clickbank
- FTC disclosure required
- Health and income product categories: heightened scrutiny
- Misleading advertising prohibited by platform and by law

### Digistore24
- GDPR compliance for EU audience
- Privacy policy required on website
- Cookie consent banner if collecting any user data

---

## Disclosure Language Templates

### Pinterest Pin Description (End of Description)
```
*Affiliate link — I earn a small commission if you buy through this link, at no extra cost to you.*
```

### Short Pinterest (when character count is tight)
```
*[Affiliate link]*
```

### Blog Post Header (Immediately After H1, Before Any Content)
```html
<div class="disclosure-box">
  <strong>Disclosure:</strong> This article contains affiliate links. 
  If you purchase through these links, I earn a small commission at 
  no additional cost to you. This doesn't influence my recommendations — 
  I only feature products I believe provide real value.
</div>
```

### Blog Post Inline (Near Each Affiliate Link)
```
→ [Product Name on Amazon] (affiliate link)
```

### Blog Post Footer Reminder
```
*This post contains affiliate links. See our full disclosure policy.*
```

### Video / Short-Form (On-Screen Text)
```
#ad | Affiliate links in description
```

---

## Anti-Niche Hard List

Never generate content promoting:

| Category | Reason |
|----------|--------|
| Supplements / weight loss products | High FTC scrutiny, claim restrictions, frequent deplatforming |
| Gambling / betting | Platform prohibited, regulatory exposure |
| Adult content | Payment processor and platform total prohibition |
| Financial advice / investment products | Regulatory exposure (SEC, FINRA registration requirements) |
| Cryptocurrency promotions | High regulatory uncertainty, platform bans |
| MLM / network marketing products | FTC scrutiny, disclosure complexity, brand damage risk |
| Political content | Toxic association, no consistent affiliate model |
| Payday loans / debt products | Predatory lending regulations |
| Fake ID / counterfeit products | Illegal |
| Any product that's illegal in the target market | Illegal |

Also never promote:
- VFX/3D software, pipeline tools (Signal domain — brand isolation)
- Kids entertainment content, toddler products (Lullaby domain — brand isolation)

---

## Record-Keeping Requirements

Keep on file for 3 years minimum:

| Record | Where to Store | Format |
|--------|---------------|--------|
| Screenshots of all published content showing FTC disclosure in context | [[analytics/]] folder | PNG, named YYYY-MM-DD-platform-postid |
| Copies of affiliate programme agreements at time of joining | [[analytics/]] folder | PDF |
| Monthly revenue reports from each affiliate platform | [[analytics/]] folder | CSV or PDF |
| Any account warnings or policy flags received + action taken | [[analytics/]] folder | Text document |
| Annual compliance review records | [[analytics/]] folder | Checklist document |

Screenshot every new piece of published content within 24 hours of posting. Build this into the post-publishing workflow.

---

## Annual Compliance Review

Set a recurring calendar reminder for January of each year.

**Checklist:**

**FTC / Legal:**
- [ ] Re-read current FTC guidance on endorsement and affiliate disclosure (ftc.gov/tips-advice/business-center/advertising-and-marketing)
- [ ] Confirm all active content has compliant disclosures
- [ ] Confirm no health claims, income claims, or prohibited language in active content

**Affiliate Programmes:**
- [ ] Read Amazon Associates Operating Agreement changelog for the past year
- [ ] Read Clickbank's TOS for any updates
- [ ] Read Digistore24's TOS for any updates
- [ ] Confirm commission rates are accurate in Link Manager database

**Pinterest:**
- [ ] Read Pinterest's spam and community guidelines for any updates affecting affiliate content
- [ ] Confirm current affiliate link policy has not changed

**Tax:**
- [ ] Confirm all 1099s received from affiliate programmes (for amounts ≥ $600)
- [ ] Confirm all income below $600/programme threshold is tracked for self-reporting
- [ ] Set aside current year's estimated tax liability

**Records:**
- [ ] Confirm 3 years of records are preserved and accessible
- [ ] Archive old records older than 3 years if storage is a concern

---

## Incident Response

If a compliance issue is discovered:

### Discovered: missing disclosure on active content
1. Immediately update the content with compliant disclosure
2. Screenshot updated content
3. Log incident: what was found, when, what was corrected
4. If the content has been live for more than 30 days: assess whether FTC reporting is warranted (generally for isolated cases of non-wilful violations, correcting is the standard remedy)

### Discovered: affiliate link violates programme TOS
1. Immediately remove or replace the link
2. Screenshot corrected content
3. Log incident
4. If the affiliate programme has flagged the account: contact support, explain correction made

### Affiliate account suspended
1. Stop all new content generation and posting for that platform immediately
2. Do not create a second account (violates terms of every programme)
3. Contact affiliate programme support with explanation
4. If suspension is unresolvable: remove all content referencing that platform's products and seek alternative programme for the same products

### Pinterest account suspended
1. Do not create a secondary account on the same device or IP (Pinterest will detect and ban both)
2. Review all recent content for guideline violations
3. Appeal via Pinterest Business support
4. If account is permanently banned: assess whether Conduit can continue with only blog/SEO traffic, or whether the ecosystem should remain parked until a clean account can be established
