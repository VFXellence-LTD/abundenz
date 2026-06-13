import type { Db } from "./db.js";

interface SeedTool {
  id: string;
  name: string;
  costPerMonth: number;
  ecosystems: string[];
  status: "active" | "candidate" | "rejected";
  url?: string;
  notes?: string;
}

/** Verbatim mirror of client/src/data/tools.ts INITIAL_TOOLS. Keep in sync. */
export const INITIAL_TOOLS: SeedTool[] = [
  { id: "beehiiv", name: "beehiiv", costPerMonth: 0, ecosystems: ["content"], status: "active", url: "https://www.beehiiv.com", notes: "Free tier — up to 2,500 subscribers" },
  { id: "ghost", name: "Ghost.org", costPerMonth: 0, ecosystems: ["content"], status: "active", url: "https://ghost.org", notes: "Self-hosted on Railway — $0/mo" },
  { id: "youtube_studio", name: "YouTube Studio", costPerMonth: 0, ecosystems: ["content"], status: "active", url: "https://studio.youtube.com", notes: "Free — monetization unlocked at 1,000 subs" },
  { id: "obs", name: "OBS Studio", costPerMonth: 0, ecosystems: ["content"], status: "active", url: "https://obsproject.com", notes: "Free, open-source recording + streaming" },
  { id: "n8n", name: "n8n", costPerMonth: 0, ecosystems: ["content", "affiliate"], status: "active", url: "https://n8n.io", notes: "Self-hosted — $0/mo for automation workflows" },
  { id: "cloudflare", name: "Cloudflare", costPerMonth: 0, ecosystems: ["content", "products", "affiliate"], status: "active", url: "https://cloudflare.com", notes: "DNS, email routing, pages — free tier" },
  { id: "riverside", name: "Riverside.fm", costPerMonth: 15, ecosystems: ["content"], status: "candidate", url: "https://riverside.fm", notes: "Remote recording with local quality — evaluating" },
  { id: "descript", name: "Descript", costPerMonth: 12, ecosystems: ["content"], status: "candidate", url: "https://www.descript.com", notes: "AI video editing — evaluating vs. manual Premiere" },
  { id: "gumroad", name: "Gumroad", costPerMonth: 0, ecosystems: ["products"], status: "candidate", url: "https://gumroad.com", notes: "10% + payment fees — considering for digital products" },
  { id: "lemon_squeezy", name: "Lemon Squeezy", costPerMonth: 0, ecosystems: ["products"], status: "candidate", url: "https://lemonsqueezy.com", notes: "5% + payment fees — Merchant of Record, handles VAT" },
  { id: "ahrefs", name: "Ahrefs", costPerMonth: 99, ecosystems: ["content", "affiliate"], status: "rejected", url: "https://ahrefs.com", notes: "Too expensive for Phase 0 — revisit at 10k/mo revenue" },
  { id: "notion", name: "Notion", costPerMonth: 0, ecosystems: ["content", "products", "affiliate"], status: "active", url: "https://notion.so", notes: "Free tier — content calendar, CRM, notes" },
  { id: "stripe", name: "Stripe", costPerMonth: 0, ecosystems: ["products"], status: "candidate", url: "https://stripe.com", notes: "2.9% + 30c per transaction — direct payments" },
  { id: "make", name: "Make.com", costPerMonth: 0, ecosystems: ["content", "affiliate"], status: "candidate", url: "https://make.com", notes: "Free tier — 1,000 ops/mo. Alternative to n8n" },
];

/** Insert INITIAL_TOOLS only if the tools table is empty. Idempotent. */
export function seedTools(db: Db): void {
  const count = (db.raw.prepare("SELECT COUNT(*) c FROM tools").get() as { c: number }).c;
  if (count > 0) return;
  const ins = db.raw.prepare(
    `INSERT INTO tools (id,name,cost_per_month,ecosystems,status,url,notes)
     VALUES (@id,@name,@cost_per_month,@ecosystems,@status,@url,@notes)`,
  );
  const tx = db.raw.transaction((tools: SeedTool[]) => {
    for (const t of tools) {
      ins.run({
        id: t.id,
        name: t.name,
        cost_per_month: t.costPerMonth,
        ecosystems: JSON.stringify(t.ecosystems),
        status: t.status,
        url: t.url ?? null,
        notes: t.notes ?? null,
      });
    }
  });
  tx(INITIAL_TOOLS);
}
