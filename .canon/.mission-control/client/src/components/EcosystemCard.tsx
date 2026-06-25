import { Globe, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Ecosystem } from "@/types";

interface EcosystemCardProps {
  ecosystem: Ecosystem;
  revenueThisMonth?: number;
  className?: string;
}

const statusStyles = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Parked: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
  Design: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

const cardAccent = {
  emerald: "border-l-emerald-500",
  blue: "border-l-blue-500",
  purple: "border-l-purple-500",
  orange: "border-l-orange-500",
  pink: "border-l-pink-500",
};

export function EcosystemCard({ ecosystem, revenueThisMonth = 0, className }: EcosystemCardProps) {
  return (
    <div
      className={cn(
        "bg-zinc-900 border border-zinc-800 rounded-lg p-5 border-l-2",
        cardAccent[ecosystem.accentColor as keyof typeof cardAccent],
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-zinc-100">{ecosystem.name}</h3>
          {ecosystem.codename !== ecosystem.name && (
            <span className="text-xs text-zinc-500">{ecosystem.codename}</span>
          )}
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full border",
            statusStyles[ecosystem.status]
          )}
        >
          {ecosystem.status}
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-xs text-zinc-500">Phase</span>
          <p className="text-sm text-zinc-300 mt-0.5">{ecosystem.phase}</p>
        </div>
        <div>
          <span className="text-xs text-zinc-500">Next action</span>
          <p className="text-sm text-zinc-300 mt-0.5">{ecosystem.nextAction}</p>
        </div>
        <div className="pt-2 border-t border-zinc-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <Globe className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
            <span className="truncate">{ecosystem.subdomain}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <Mail className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
            <span className="truncate">{ecosystem.email}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-zinc-800">
          <span className="text-xs text-zinc-500">Revenue this month</span>
          <p className="text-lg font-semibold text-zinc-100 tabular-nums mt-0.5">
            ${revenueThisMonth.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
