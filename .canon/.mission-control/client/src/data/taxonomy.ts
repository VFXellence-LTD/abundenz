import { BANDS, VERTICALS, REVENUE_STREAMS } from "@/data/ecosystems";

// ─── Legend Reference ───────────────────────────────────────────────
//
// Quick-reference for the Polymath taxonomy.
// Import LEGEND in any component to render tooltips, help panels, or reference cards.

export interface LegendEntry {
  code: string;
  name: string;
  description: string;
}

export const ECOSYSTEM_LEGEND: LegendEntry[] = [
  { code: "SUR", name: "Surge (Viral)", description: "Anonymous short-form video — volume × RPM + affiliate" },
  { code: "SIG", name: "Signal (Content)", description: "Voice-driven pillar content — audience × trust × monetization" },
  { code: "ATE", name: "Atelier (Products)", description: "AI-generated products on marketplaces — design × listings × margin" },
  { code: "CON", name: "Conduit (Affiliate)", description: "SEO content driving affiliate traffic — search × conversion × commission" },
];

export const BAND_LEGEND: LegendEntry[] = BANDS.map((b) => ({
  code: b.alias,
  name: `${b.name} (${b.priceRange})`,
  description: b.description,
}));

export const STREAM_LEGEND: LegendEntry[] = REVENUE_STREAMS.map((s) => ({
  code: s.code,
  name: s.label,
  description: s.description,
}));

export const EXPENSE_LEGEND: LegendEntry[] = [
  { code: "SUB", name: "Subscriptions", description: "Monthly SaaS/tool subscriptions" },
  { code: "TOL", name: "Tools", description: "One-time tool purchases" },
  { code: "CTR", name: "Contractors", description: "Freelancer or outsourced work" },
  { code: "ADS", name: "Advertising", description: "Paid promotion and ads" },
  { code: "HST", name: "Hosting", description: "Server, domain, CDN costs" },
  { code: "EDU", name: "Education", description: "Courses, books, training" },
  { code: "EQP", name: "Equipment", description: "Hardware, mic, camera, GPU" },
  { code: "HOM", name: "Home Office", description: "Workspace costs (tax-deductible)" },
  { code: "OTH", name: "Other", description: "Uncategorized expenses" },
];

// ─── Full Legend ────────────────────────────────────────────────────
//
// TAXONOMY HIERARCHY
// ──────────────────────────────────────────────────────────────────
//
// ECOSYSTEM    Business model         Surge, Signal, Atelier, Conduit
//  └─ VERTICAL    Topic niche         Tech, Kitchen, Finance, VFX Pipeline
//      └─ BAND       Price tier       Impulse ($1-30), Recurring ($5-50/mo), Premium ($100-500+)
//          └─ LISTING    Product      Notion, MagSafe Mount, Shopify
//              └─ STREAM     Revenue  COM, REC, RPM, MAR, SPO, SUB, LIC
//
// STREAM CODES (Revenue)
// ──────────────────────────────────────────────────────────────────
// COM  Commission    One-time affiliate payout per sale
// REC  Recurring     Monthly/annual affiliate payout that repeats
// RPM  RPM           Platform ad revenue per 1000 views
// MAR  Margin        Profit on products you sell (price − COGS)
// SPO  Sponsorship   Flat fee for featuring a brand in content
// SUB  Subscription  Recurring payment from audience to you
// LIC  Licensing     Ongoing royalty from created content/products
//
// BAND ↔ STREAM MAPPING
// ──────────────────────────────────────────────────────────────────
// Impulse    → COM (one-time commission)
// Recurring  → REC (monthly affiliate) or SUB (audience pays you)
// Premium    → COM (high-ticket) or REC (high-ticket recurring)
// Any        → RPM (platform pays per view), SPO (flat sponsorship)
// Products   → MAR (you set price, keep margin)
// Content    → LIC (royalties from published works)
//
// ECOSYSTEM ↔ STREAM MAPPING
// ──────────────────────────────────────────────────────────────────
// Surge    → RPM + COM + REC + SPO
// Signal   → RPM + SUB + SPO + LIC
// Atelier  → MAR + LIC
// Conduit  → COM + REC
// ──────────────────────────────────────────────────────────────────

export { BANDS, VERTICALS, REVENUE_STREAMS };
