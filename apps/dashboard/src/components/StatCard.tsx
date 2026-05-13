import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  accent?: "green" | "red" | "blue" | "purple" | "default";
  className?: string;
}

const accentMap = {
  green: "text-emerald-400",
  red: "text-red-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  default: "text-zinc-100",
};

export function StatCard({ label, value, sub, icon, accent = "default", className }: StatCardProps) {
  return (
    <div className={cn("bg-zinc-900 border border-zinc-800 rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{label}</span>
        {icon && <span className="text-zinc-600">{icon}</span>}
      </div>
      <div className={cn("text-2xl font-semibold tabular-nums", accentMap[accent])}>{value}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
    </div>
  );
}
