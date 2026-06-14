import { useEffect, useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useAgentRuns } from "@/hooks/useAgentRuns";
import { CampaignPanel } from "@/features/campaigns/CampaignPanel";

export function CampaignsPage() {
  const [scope, setScope] = useState("all");
  const { campaigns, error, reload, approve } = useCampaigns(scope);
  const { runs } = useAgentRuns();

  useEffect(() => {
    const id = setInterval(reload, 5000);
    return () => clearInterval(id);
  }, [reload]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Campaign Control</h1>
        <select
          aria-label="Ecosystem scope"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="cursor-pointer rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-300 hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">All ecosystems</option>
          <option value="content">Content</option>
          <option value="viral">Viral</option>
          <option value="products">Products</option>
          <option value="affiliate">Affiliate</option>
          <option value="apps">Apps</option>
        </select>
      </div>
      <CampaignPanel campaigns={campaigns} runs={runs} onApprove={approve} error={error} />
    </div>
  );
}
