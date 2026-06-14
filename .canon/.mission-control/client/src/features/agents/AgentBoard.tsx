import { Terminal } from "lucide-react";
import type { AgentRun } from "@/lib/engine";
import { Badge } from "@/components/ui/Badge";

export function AgentBoard({ runs }: { runs: AgentRun[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-500">
        <Terminal className="h-4 w-4" />
        Live terminal streaming arrives in Plan 3. This is a read-only run list.
      </div>
      {runs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-800 py-12 text-center text-sm text-zinc-600">
          No agent runs yet.
        </p>
      ) : (
        runs.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
            <Badge variant="secondary">{r.status}</Badge>
            <span className="truncate text-sm text-zinc-300">{r.agentName ?? r.command ?? r.id}</span>
            <div className="flex-1" />
            {r.campaignId && <span className="font-mono text-xs text-zinc-600">{r.campaignId}</span>}
          </div>
        ))
      )}
    </div>
  );
}
