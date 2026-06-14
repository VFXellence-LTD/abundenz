import { useState } from "react";
import { Play, Check, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import type { Campaign, AgentRun } from "@/lib/engine";
import { Badge } from "@/components/ui/Badge";

const RUN_STATUS_COLOR: Record<string, string> = {
  queued: "text-zinc-400", running: "text-emerald-400", waiting: "text-amber-400",
  done: "text-zinc-500", error: "text-red-400", killed: "text-red-500",
};

export function CampaignPanel({
  campaigns,
  runs,
  onApprove,
  error,
}: {
  campaigns: Campaign[];
  runs: AgentRun[];
  onApprove: (id: string) => Promise<Campaign>;
  error?: string | null;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const runFor = (cid: string) => runs.find((r) => r.campaignId === cid);

  const run = async (c: Campaign) => {
    setBusyId(c.id);
    setNotice(null);
    try {
      if (!c.approvedBy) {
        await onApprove(c.id); // gate: must be approved before running
      }
      // Plan-3 endpoint. Not live yet — expect 404 and degrade gracefully.
      await api.post<{ sessionId: string }>("/sessions/start", { campaignId: c.id });
      setNotice(`Session start requested for ${c.name}.`);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes("404") || msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("failed to fetch")) {
        setNotice("Session engine not yet available (lands in Plan 3). Campaign approved and ready.");
      } else {
        setNotice(msg);
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-400">{error}</p>}
      {notice && (
        <div className="flex items-center gap-2 rounded border border-amber-700/40 bg-amber-950/20 px-3 py-2 text-sm text-amber-200">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {notice}
        </div>
      )}
      {campaigns.length === 0 && (
        <p className="rounded-lg border border-dashed border-zinc-800 py-12 text-center text-sm text-zinc-600">
          No campaigns yet. Create one from Intake.
        </p>
      )}
      {campaigns.map((c) => {
        const r = runFor(c.id);
        return (
          <div key={c.id} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-zinc-100">{c.name}</p>
                <Badge variant="outline">{c.ecosystemId}</Badge>
                <Badge variant="secondary">{c.status}</Badge>
                {c.approvedBy && <Badge variant="default"><Check className="mr-0.5 h-3 w-3" /> approved</Badge>}
              </div>
              <p className="mt-0.5 font-mono text-xs text-zinc-600">{c.id} · target {c.targetCount}</p>
              {r && (
                <p className={`mt-1 text-xs ${RUN_STATUS_COLOR[r.status] ?? "text-zinc-400"}`}>
                  run: {r.status}{r.error ? ` — ${r.error}` : ""}
                </p>
              )}
            </div>
            <button
              disabled={busyId === c.id || c.status === "running"}
              onClick={() => run(c)}
              className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              <Play className="h-4 w-4" /> {c.approvedBy ? "Run" : "Approve & Run"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
