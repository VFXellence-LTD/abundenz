import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useApprovals } from "@/hooks/useApprovals";
import { ApprovalQueue } from "@/features/approvals/ApprovalQueue";

export function ApprovalsPage() {
  const [scope, setScope] = useState("all");
  const { approvals, error, reload, decide } = useApprovals(scope);

  useEffect(() => {
    const id = setInterval(reload, 4000);
    return () => clearInterval(id);
  }, [reload]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <h1 className="text-2xl font-bold text-zinc-100">► Approval Queue ◄</h1>
          <span className="rounded bg-zinc-800 px-2 py-0.5 text-sm text-zinc-400">{approvals.length}</span>
        </div>
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
        </select>
      </div>
      <p className="text-sm text-zinc-500">
        Every agent draft halts here. Nothing publishes. Approve to mark the task done; reject or request changes to send it back.
      </p>
      <ApprovalQueue approvals={approvals} onDecide={decide} error={error} />
    </div>
  );
}
