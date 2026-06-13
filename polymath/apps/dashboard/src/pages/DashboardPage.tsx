import { CheckCircle2 } from "lucide-react";
import { EcosystemCard } from "@/components/EcosystemCard";
import { RevenueChart } from "@/components/RevenueChart";
import { ECOSYSTEMS, TODAY_ACTIONS } from "@/data/ecosystems";

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Polymath AI-driven income — Phase 0 in progress
        </p>
      </div>

      {/* Ecosystem cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {ECOSYSTEMS.map((eco) => (
          <EcosystemCard key={eco.id} ecosystem={eco} revenueThisMonth={0} />
        ))}
      </div>

      {/* Revenue chart + today actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <h3 className="text-sm font-medium text-zinc-300 mb-4">What to do today</h3>
          <ul className="space-y-2.5">
            {TODAY_ACTIONS.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-zinc-700 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{action}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-600 mt-4">
            These are Phase 0 foundation tasks for the Content ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
}
