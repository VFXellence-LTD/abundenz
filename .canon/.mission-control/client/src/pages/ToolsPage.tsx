import { StatCard } from "@/components/StatCard";
import { useTools } from "@/hooks/useTools";
import { formatCurrency } from "@/lib/utils";
import { ECOSYSTEMS } from "@/data/ecosystems";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { ToolStatus } from "@/types";

const statusStyles: Record<ToolStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-400",
  candidate: "bg-blue-500/15 text-blue-400",
  rejected: "bg-zinc-700/40 text-zinc-500 line-through",
};


export function ToolsPage() {
  const { tools, monthlyBurn, updateToolStatus } = useTools();

  const activeCount = tools.filter((t) => t.status === "active").length;
  const candidateCount = tools.filter((t) => t.status === "candidate").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Tools</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Stack inventory — active tools, candidates, and rejected
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Monthly Burn"
          value={formatCurrency(monthlyBurn)}
          accent={monthlyBurn > 0 ? "red" : "default"}
          sub="Active tools only"
        />
        <StatCard
          label="Active Tools"
          value={String(activeCount)}
          accent="green"
          sub="In production use"
        />
        <StatCard
          label="Under Evaluation"
          value={String(candidateCount)}
          accent="blue"
          sub="Candidate tools"
        />
      </div>

      {/* Tools table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-300">Tool Inventory</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Tool
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Ecosystems
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Cost / mo
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-zinc-900/50 group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        tool.status === "rejected" ? "text-zinc-600" : "text-zinc-200"
                      )}
                    >
                      {tool.name}
                    </span>
                    {tool.url && (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-zinc-400 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {tool.ecosystems.map((ecoId) => {
                      const eco = ECOSYSTEMS.find((e) => e.id === ecoId);
                      return (
                        <span
                          key={ecoId}
                          className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400"
                        >
                          {eco?.name ?? ecoId}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-right tabular-nums text-zinc-300">
                  {tool.costPerMonth === 0 ? (
                    <span className="text-zinc-600">Free</span>
                  ) : (
                    formatCurrency(tool.costPerMonth)
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <select
                    value={tool.status}
                    onChange={(e) => updateToolStatus(tool.id, e.target.value as ToolStatus)}
                    className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium border-0 focus:outline-none cursor-pointer",
                      statusStyles[tool.status]
                    )}
                  >
                    <option value="active">Active</option>
                    <option value="candidate">Candidate</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-5 py-3.5 text-xs text-zinc-500 max-w-xs">{tool.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
