import type { Ecosystem } from "@/types";

export const ECOSYSTEMS: Ecosystem[] = [
  {
    id: "content",
    name: "Content",
    status: "Active",
    phase: "Phase 0 — Foundation",
    nextAction: "Register domain and stand up core accounts",
    accentColor: "emerald",
    dotColor: "bg-emerald-400",
  },
  {
    id: "products",
    name: "Products",
    status: "Parked",
    phase: "Phase 0 — Not Started",
    nextAction: "Complete Content foundation first",
    accentColor: "blue",
    dotColor: "bg-zinc-600",
  },
  {
    id: "affiliate",
    name: "Affiliate",
    status: "Parked",
    phase: "Phase 0 — Not Started",
    nextAction: "Complete Content foundation first",
    accentColor: "purple",
    dotColor: "bg-zinc-600",
  },
];

export const REVENUE_STREAMS = [
  { id: "youtube", label: "YouTube AdSense" },
  { id: "affiliate", label: "Affiliate" },
  { id: "sponsorship", label: "Sponsorship" },
  { id: "newsletter", label: "Newsletter" },
  { id: "products", label: "Products" },
  { id: "community", label: "Community" },
  { id: "consulting", label: "Consulting" },
] as const;

export const EXPENSE_STREAMS = [
  { id: "subscriptions", label: "Subscriptions" },
  { id: "tools", label: "Tools" },
  { id: "contractors", label: "Contractors" },
  { id: "advertising", label: "Advertising" },
  { id: "hosting", label: "Hosting" },
  { id: "education", label: "Education" },
  { id: "equipment", label: "Equipment" },
  { id: "home_office", label: "Home Office" },
  { id: "other", label: "Other" },
] as const;

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
