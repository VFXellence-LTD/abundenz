import { ExternalLink, Building2, Globe, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENTITY } from "@/data/entity";
import { ECOSYSTEMS } from "@/data/ecosystems";
import type { PlatformAccount } from "@/types";

// ─── Status badge ───────────────────────────────────────────────────

const statusStyles: Record<PlatformAccount["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-amber-500/15 text-amber-400",
  "not-started": "bg-zinc-800 text-zinc-600",
};

const statusLabel: Record<PlatformAccount["status"], string> = {
  active: "Active",
  pending: "Pending",
  "not-started": "Not Started",
};

function StatusBadge({ status }: { status: PlatformAccount["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        statusStyles[status]
      )}
    >
      {statusLabel[status]}
    </span>
  );
}

// ─── Masked value ───────────────────────────────────────────────────

function MaskedField({ label, value }: { label: string; value: string }) {
  const isEmpty = !value;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-zinc-600 uppercase tracking-wider font-medium">{label}</span>
      <span className={cn("text-sm font-mono", isEmpty ? "text-zinc-700 italic" : "text-zinc-300")}>
        {isEmpty ? "not set" : "••••••••"}
      </span>
    </div>
  );
}

// ─── Platform account table ─────────────────────────────────────────

function AccountTable({ accounts }: { accounts: PlatformAccount[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-zinc-800/60">
          <th className="pb-2 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
            Platform
          </th>
          <th className="pb-2 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
            Handle
          </th>
          <th className="pb-2 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider hidden sm:table-cell">
            Email
          </th>
          <th className="pb-2 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
            Status
          </th>
          <th className="pb-2 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider hidden lg:table-cell">
            Notes
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-800/40">
        {accounts.map((acc, i) => (
          <tr key={i} className="group">
            <td className="py-2.5 pr-3">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-zinc-200 font-medium whitespace-nowrap">
                  {acc.platform}
                </span>
                {acc.url && (
                  <a
                    href={acc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-zinc-400 transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </td>
            <td className="py-2.5 pr-3">
              <span className="text-xs font-mono text-zinc-400">
                {acc.handle || <span className="text-zinc-700">—</span>}
              </span>
              {acc.trackingId && (
                <div className="text-xs text-amber-500/80 font-mono mt-0.5">
                  ID: {acc.trackingId}
                </div>
              )}
            </td>
            <td className="py-2.5 pr-3 hidden sm:table-cell">
              <span className="text-xs text-zinc-500 font-mono">
                {acc.email || <span className="text-zinc-700">—</span>}
              </span>
            </td>
            <td className="py-2.5 pr-3">
              <StatusBadge status={acc.status} />
            </td>
            <td className="py-2.5 hidden lg:table-cell">
              <span className="text-xs text-zinc-600 max-w-xs">{acc.notes}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Ecosystem accent border colors ────────────────────────────────

const ecosystemBorderColor: Record<string, string> = {
  content: "border-t-emerald-500",
  viral: "border-t-orange-500",
  products: "border-t-blue-500",
  affiliate: "border-t-purple-500",
};

const ecosystemDotBg: Record<string, string> = {
  content: "bg-emerald-400",
  viral: "bg-orange-400",
  products: "bg-blue-400",
  affiliate: "bg-purple-400",
};

// ─── Platform limit tracker ─────────────────────────────────────────

interface PlatformLimit {
  name: string;
  used: number;
  max: number;
}

function computePlatformLimits(): PlatformLimit[] {
  const tiktokActive = ENTITY.brands.filter((b) =>
    b.accounts.some((a) => a.platform === "TikTok" && a.status === "active")
  ).length;
  const tiktokAll = ENTITY.brands.filter((b) =>
    b.accounts.some((a) => a.platform === "TikTok")
  ).length;

  const igActive = ENTITY.brands.filter((b) =>
    b.accounts.some((a) => a.platform === "Instagram" && a.status === "active")
  ).length;
  const igAll = ENTITY.brands.filter((b) =>
    b.accounts.some((a) => a.platform === "Instagram")
  ).length;

  return [
    { name: "TikTok", used: tiktokAll, max: 3 },
    { name: "Instagram", used: igAll, max: 5 },
    { name: "Active TikTok", used: tiktokActive, max: 3 },
    { name: "Active IG", used: igActive, max: 5 },
  ];
}

// ─── Page ───────────────────────────────────────────────────────────

export function EntityPage() {
  const limits = computePlatformLimits();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Entity Registry</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Legal structure, brand hierarchy, and platform account map
        </p>
      </div>

      {/* Legal Entity Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-300">Legal Entity</h2>
        </div>
        <div className="px-5 py-5">
          <div className="flex items-start gap-6 flex-wrap">
            {/* LLC name — prominent */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-600 uppercase tracking-wider font-medium">LLC</span>
              <span className="text-lg font-semibold text-zinc-100">{ENTITY.llc}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-600 uppercase tracking-wider font-medium">Parent Brand</span>
              <span className="text-sm text-zinc-300 font-medium">{ENTITY.parentBrand}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-600 uppercase tracking-wider font-medium flex items-center gap-1">
                <Globe className="w-3 h-3" /> Domain
              </span>
              <span className="text-sm font-mono text-emerald-400">{ENTITY.domain}</span>
            </div>

            <MaskedField label="EIN" value={ENTITY.ein} />
            <MaskedField label="Bank" value={ENTITY.bank} />
            <MaskedField label="Phone" value={ENTITY.phone} />
          </div>

          {/* Constraints note */}
          <div className="mt-5 flex items-start gap-2 p-3 bg-zinc-950 rounded-md border border-zinc-800">
            <Shield className="w-3.5 h-3.5 text-zinc-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-zinc-600 leading-relaxed">
              Single-entity constraints: 1 LLC · 1 bank account · 1 phone · 1 device
              primary · 1 SSN/EIN across all brands. All brands operate under{" "}
              <span className="text-zinc-500 font-medium">{ENTITY.parentBrand}</span>{" "}
              ({ENTITY.domain}).
            </p>
          </div>
        </div>
      </div>

      {/* Platform Limits */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">Platform Account Limits</h2>
        <div className="flex flex-wrap gap-4">
          {limits.map((l) => {
            const pct = l.used / l.max;
            const barColor =
              pct >= 1 ? "bg-red-500" : pct >= 0.6 ? "bg-amber-500" : "bg-emerald-500";
            return (
              <div key={l.name} className="flex flex-col gap-1.5 min-w-[120px]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">{l.name}</span>
                  <span
                    className={cn(
                      "text-xs font-mono font-semibold",
                      pct >= 1 ? "text-red-400" : pct >= 0.6 ? "text-amber-400" : "text-zinc-400"
                    )}
                  >
                    {l.used}/{l.max}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", barColor)}
                    style={{ width: `${Math.min(pct * 100, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Cards */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">
          Brands
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {ENTITY.brands.map((brand) => {
            const eco = ECOSYSTEMS.find((e) => e.id === brand.ecosystemId);
            const borderClass =
              ecosystemBorderColor[brand.ecosystemId] ?? "border-t-zinc-700";
            const dotClass = ecosystemDotBg[brand.ecosystemId] ?? "bg-zinc-600";

            const activeCount = brand.accounts.filter((a) => a.status === "active").length;
            const totalCount = brand.accounts.length;

            return (
              <div
                key={brand.id}
                className={cn(
                  "bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden border-t-2",
                  borderClass
                )}
              >
                {/* Card header */}
                <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={cn("w-2 h-2 rounded-full flex-shrink-0", dotClass)} />
                    <h3 className="text-sm font-semibold text-zinc-100">{brand.name}</h3>
                    {eco && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {eco.codename}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-600">{brand.email}</span>
                    <span className="text-xs text-zinc-600">
                      {activeCount}/{totalCount} active
                    </span>
                  </div>
                </div>

                {/* Accounts table */}
                <div className="px-5 py-4 overflow-x-auto">
                  <AccountTable accounts={brand.accounts} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared Accounts */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300">Shared Accounts</h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Held at the LLC level — shared across all brands
          </p>
        </div>
        <div className="px-5 py-4 overflow-x-auto">
          <AccountTable accounts={ENTITY.sharedAccounts} />
        </div>
      </div>
    </div>
  );
}
