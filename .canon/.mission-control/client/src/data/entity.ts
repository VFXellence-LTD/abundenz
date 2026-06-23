import type { Entity } from "@/types";

export const ENTITY: Entity = {
  llc: "VFXellence Ltd",
  ein: "",
  bank: "",
  phone: "",
  parentBrand: "Abundenz",
  domain: "abundenz.com",
  brands: [
    {
      id: "zrodinger",
      name: "Zrodinger",
      ecosystemId: "viral",
      email: "zrodinger@abundenz.com",
      accounts: [
        { platform: "TikTok", handle: "@zrodinger", email: "zrodinger@abundenz.com", status: "active", notes: "Account 1/3 on phone", url: "https://tiktok.com/@zrodinger" },
        { platform: "YouTube", handle: "@zrodinger", email: "zrodinger@abundenz.com", status: "active", url: "https://youtube.com/@zrodinger" },
        { platform: "Instagram", handle: "@zrodinger", email: "zrodinger@abundenz.com", status: "active", notes: "Account 1/5 on device", url: "https://instagram.com/zrodinger" },
        { platform: "Pinterest", handle: "@zrodinger", email: "zrodinger@abundenz.com", status: "active", url: "https://pinterest.com/zrodinger" },
        { platform: "X / Twitter", handle: "@zrodinger", email: "zrodinger@abundenz.com", status: "active", url: "https://x.com/zrodinger" },
        { platform: "Reddit", handle: "zrodinger", email: "zrodinger@abundenz.com", status: "active" },
        { platform: "Threads", handle: "@zrodinger", email: "(linked to Instagram)", status: "active" },
        { platform: "Blog", handle: "", email: "", status: "not-started", notes: "zrodinger.abundenz.com or Medium" },
      ],
    },
    {
      id: "ateliez",
      name: "Ateliez",
      ecosystemId: "products",
      email: "ateliez@abundenz.com",
      accounts: [
        { platform: "Etsy", handle: "Ateliez", email: "ateliez@abundenz.com", status: "not-started", notes: "1 store, use sections per product line" },
        { platform: "Printify", handle: "Ateliez", email: "ateliez@abundenz.com", status: "not-started", notes: "Connect to Etsy store" },
        { platform: "Pinterest", handle: "@ateliez", email: "ateliez@abundenz.com", status: "not-started", notes: "Product pins → Etsy" },
        { platform: "Instagram", handle: "@ateliez", email: "ateliez@abundenz.com", status: "not-started", notes: "Account 2/5 on device" },
        { platform: "TikTok", handle: "@ateliez", email: "ateliez@abundenz.com", status: "not-started", notes: "Account 2/3 on phone, product showcases" },
        { platform: "Redbubble", handle: "Ateliez", email: "ateliez@abundenz.com", status: "not-started" },
      ],
    },
    {
      id: "content",
      name: "[Content TBD]",
      ecosystemId: "content",
      email: "[content]@abundenz.com",
      accounts: [
        { platform: "YouTube", handle: "[TBD]", email: "[content]@abundenz.com", status: "not-started", notes: "Primary platform — long-form" },
        { platform: "Blog / Newsletter", handle: "", email: "[content]@abundenz.com", status: "not-started", notes: "Ghost or beehiiv" },
        { platform: "GitHub", handle: "[TBD]", email: "[content]@abundenz.com", status: "not-started", notes: "Open-source pipeline tools" },
        { platform: "X / Twitter", handle: "[TBD]", email: "[content]@abundenz.com", status: "not-started", notes: "Industry presence" },
        { platform: "LinkedIn", handle: "[TBD]", email: "[content]@abundenz.com", status: "not-started", notes: "Professional audience" },
        { platform: "Instagram", handle: "[TBD]", email: "[content]@abundenz.com", status: "not-started", notes: "Account 3/5 on device" },
        { platform: "Gumroad", handle: "[TBD]", email: "[content]@abundenz.com", status: "not-started", notes: "Digital products" },
      ],
    },
    // Lullaby is a vertical under Zrodinger/Viral, not a separate brand.
    // Lullaby content uses Zrodinger's YouTube + Spotify accounts.
    // Safeguards (child involvement, COPPA) are content rules, not entity separation.
    // See: _passive_income/ecosystems/lullaby/safeguards/POLICY.md
  ],
  sharedAccounts: [
    { platform: "Amazon Associates", handle: "", email: "(VFXellence Ltd)", status: "active", trackingId: "zrodinger-20", notes: "1 account, multiple Store IDs: zrodinger-20, ateliez-20, [content]-20" },
    { platform: "Stripe", handle: "", email: "(VFXellence Ltd)", status: "not-started", notes: "1 account until LLC split. Tag products by brand." },
    { platform: "Cloudflare", handle: "", email: "(VFXellence Ltd)", status: "active", notes: "Routes all abundenz.com emails + DNS" },
    { platform: "Google Analytics", handle: "", email: "(VFXellence Ltd)", status: "not-started", notes: "1 GA4 property, separate data streams per brand domain" },
  ],
};
