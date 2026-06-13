# RevenueCat

**Category:** Paywall / subscription infrastructure
**URL:** https://www.revenuecat.com/
**Captured:** 2026-05-03
**Status:** evaluating — not yet adopted

---

## What it does
Cross-platform subscription and paywall infrastructure. Handles receipt validation, entitlements, trials, promotional offers, and analytics across App Store, Google Play, Stripe, Amazon, and web. SDKs for iOS, Android, React Native, Flutter, web. You configure products once; RevenueCat reconciles them across stores.

## Why it matters for polymath
Relevant for monetization streams 4-6 in the Operation Signal plan (paid newsletter tier, digital products, community/cohort) **if and only if** any of them ship as a mobile app or need cross-platform sub management. Not relevant for:
- Stripe-only web checkout (use Stripe directly — RevenueCat adds a layer you don't need)
- Substack / beehiiv / Kit paid tiers (they handle billing internally)
- One-time digital product sales (Gumroad, Lemon Squeezy)

## Where it would fit
- `agents/` — none directly; this is infrastructure, not an agent
- Likely candidate area: a future `products/` folder when you ship something with its own app

## Pricing (verify before adopting — may have changed)
- Free up to $2.5k MTR (monthly tracked revenue)
- Then 1% of MTR above the threshold
- Compare against: Stripe (~2.9% + 30¢, but no entitlement/cross-platform layer), Apphud, Adapty, Glassfx

## Real questions before adopting
1. **Do you actually have a mobile app on the roadmap?** If polymath stays web + newsletter + social → skip. RevenueCat solves a problem you don't have.
2. **Will you sell the same subscription on iOS, Android, AND web?** This is the killer use case. If only one platform, it's overkill.
3. **What's the integration cost vs. just using Stripe Customer Portal?** For pure web, Stripe is enough until ~$50k MRR.
4. **Vendor lock-in** — entitlements config, webhooks, and analytics are all RevenueCat-shaped. Migrating off later is real work.

## Decision rule
**Adopt only when:** you've validated a product idea with paying customers AND you've decided to ship it as a mobile app on at least iOS. Until then, this lives in `tools/` as a reference, not in the active stack.

## Related tools to evaluate alongside
- **Stripe** — default for any web-only subscription. Already industry-standard.
- **Lemon Squeezy** — merchant of record, handles VAT/tax globally. Good for digital products to international audiences.
- **Gumroad** — simplest path for one-time digital products and ebooks.
- **Memberstack / Outseta** — membership site infra if the product is a gated content site, not an app.

## Verdict
- [ ] Adopt now
- [ ] Test in next product launch
- [x] Park — revisit when a mobile app is actually on the roadmap
- [ ] Reject
