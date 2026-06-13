import type { Ecosystem, Band, Vertical, RevenueStreamId, ExpenseStreamId } from "@/types";

// ─── Ecosystems ─────────────────────────────────────────────────────

export const ECOSYSTEMS: Ecosystem[] = [
  {
    id: "content",
    name: "Content",
    codename: "Signal",
    status: "Active",
    phase: "Phase 0 — Foundation",
    nextAction: "Register domain and stand up core accounts",
    accentColor: "emerald",
    dotColor: "bg-emerald-400",
  },
  {
    id: "viral",
    name: "Viral",
    codename: "Surge",
    status: "Active",
    phase: "Phase 0 — Vertical Selection",
    nextAction: "Pick first vertical and create anonymous brand",
    accentColor: "orange",
    dotColor: "bg-orange-400",
  },
  {
    id: "products",
    name: "Products",
    codename: "Atelier",
    status: "Parked",
    phase: "Phase 0 — Not Started",
    nextAction: "Complete Content or Viral Phase 2 first",
    accentColor: "blue",
    dotColor: "bg-zinc-600",
  },
  {
    id: "affiliate",
    name: "Affiliate",
    codename: "Conduit",
    status: "Parked",
    phase: "Phase 0 — Not Started",
    nextAction: "Complete Content or Viral Phase 2 first",
    accentColor: "purple",
    dotColor: "bg-zinc-600",
  },
  // Lullaby demoted from ecosystem to vertical under Surge.
  // Safeguards still apply — see _passive_income/ecosystems/lullaby/safeguards/POLICY.md
  {
    id: "apps",
    name: "Apps",
    codename: "Forge",
    status: "Design",
    phase: "Design Phase",
    nextAction: "Define first app concept and platform targets",
    accentColor: "cyan",
    dotColor: "bg-cyan-400",
  },
];

// ─── Verticals ──────────────────────────────────────────────────────

export const VERTICALS: Vertical[] = [
  { id: "vfx-pipeline", name: "VFX Pipeline", ecosystems: ["content"], status: "active" },
  { id: "tech", name: "Tech / AI Tools", ecosystems: ["viral", "affiliate"], status: "active" },
  { id: "kitchen", name: "Kitchen / Home Gadgets", ecosystems: ["viral", "products", "affiliate"], status: "planned" },
  { id: "finance", name: "Finance / Money Math", ecosystems: ["viral", "affiliate"], status: "planned" },
  { id: "scary", name: "Scary Stories / Horror", ecosystems: ["viral"], status: "planned" },
  { id: "quiz", name: "Quiz / Trivia", ecosystems: ["viral"], status: "planned" },
  { id: "ai-art", name: "AI Art Showcase", ecosystems: ["viral", "products"], status: "planned" },
  { id: "stoic", name: "Stoic / Motivation", ecosystems: ["viral"], status: "planned" },
  { id: "desk-setup", name: "Desk / WFH Setup", ecosystems: ["viral", "affiliate"], status: "planned" },
  { id: "lullaby", name: "Bedtime Stories / Lullaby", ecosystems: ["viral"], status: "planned" },
];

// ─── Bands ──────────────────────────────────────────────────────────

export const BANDS: Band[] = [
  {
    id: "impulse",
    name: "Impulse",
    alias: "Low",
    priceRange: "$1–30",
    description: "See it, want it, buy it. No deliberation. High volume, low margin.",
  },
  {
    id: "recurring",
    name: "Recurring",
    alias: "Mid",
    priceRange: "$5–50/mo",
    description: "Subscribes once, pays monthly. Compounds over time. Passive after conversion.",
  },
  {
    id: "premium",
    name: "Premium",
    alias: "High",
    priceRange: "$100–500+",
    description: "Researches first. Needs trust. Long sales cycle. Low volume, high payout.",
  },
];

// ─── Revenue Streams ────────────────────────────────────────────────
//
// LEGEND
// ──────────────────────────────────────────────────────────────────
// Code │ Name          │ What it means
// ─────┼───────────────┼─────────────────────────────────────────
// COM  │ Commission    │ One-time affiliate payout per sale
// REC  │ Recurring     │ Monthly/annual affiliate payout that repeats
// RPM  │ RPM           │ Platform ad revenue per 1000 views
// MAR  │ Margin        │ Profit on products you sell (price − COGS)
// SPO  │ Sponsorship   │ Flat fee for featuring a brand in content
// SUB  │ Subscription  │ Recurring payment from audience to you
// LIC  │ Licensing     │ Ongoing royalty from created content/products
// ──────────────────────────────────────────────────────────────────
//
// Band ↔ Stream mapping (which streams are typical per band):
//   Impulse   → COM (one-time affiliate commission)
//   Recurring → REC (monthly affiliate) or SUB (audience pays you)
//   Premium   → COM (high-ticket one-time) or REC (high-ticket recurring)
//   Any       → RPM (platform pays per view), SPO (flat sponsorship)
//   Products  → MAR (you set price, you keep margin)
//   Content   → LIC (royalties from published works)
//
// Ecosystem ↔ Stream mapping (primary streams per ecosystem):
//   Surge   → RPM + COM + REC + SPO
//   Signal  → RPM + SUB + SPO + LIC
//   Atelier → MAR + LIC
//   Conduit → COM + REC
//   Lullaby → RPM + SUB + LIC
// ──────────────────────────────────────────────────────────────────

export const REVENUE_STREAMS: { id: RevenueStreamId; code: string; label: string; description: string }[] = [
  { id: "com", code: "COM", label: "Commission", description: "One-time affiliate payout per sale" },
  { id: "rec", code: "REC", label: "Recurring", description: "Monthly/annual affiliate payout that repeats" },
  { id: "rpm", code: "RPM", label: "RPM", description: "Platform ad revenue per 1000 views" },
  { id: "mar", code: "MAR", label: "Margin", description: "Profit on products you sell (price − COGS)" },
  { id: "spo", code: "SPO", label: "Sponsorship", description: "Flat fee for featuring a brand in content" },
  { id: "sub", code: "SUB", label: "Subscription", description: "Recurring payment from audience to you" },
  { id: "lic", code: "LIC", label: "Licensing", description: "Ongoing royalty from created content/products" },
];

export const EXPENSE_STREAMS: { id: ExpenseStreamId; label: string }[] = [
  { id: "subscriptions", label: "Subscriptions" },
  { id: "tools", label: "Tools" },
  { id: "contractors", label: "Contractors" },
  { id: "advertising", label: "Advertising" },
  { id: "hosting", label: "Hosting" },
  { id: "education", label: "Education" },
  { id: "equipment", label: "Equipment" },
  { id: "home_office", label: "Home Office" },
  { id: "other", label: "Other" },
];

// ─── Today Actions ──────────────────────────────────────────────────

export const TODAY_ACTIONS = [
  "Register a domain (polymathpipeline.com or similar)",
  "Create a dedicated Gmail for the brand",
  "Set up YouTube channel with keyword-rich description",
  "Sign up for beehiiv newsletter — free tier",
  "Sign up for Ghost.io starter — free trial",
  "Register handles on X, LinkedIn, Instagram, TikTok",
  "Record first pillar episode (audio only is fine)",
  "Outline Agent 01 Trend Scout — what signals to monitor",
];
