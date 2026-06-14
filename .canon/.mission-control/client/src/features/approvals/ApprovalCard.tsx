import { useState } from "react";
import { Check, X, MessageSquare } from "lucide-react";
import type { Approval, ApprovalStatus } from "@/lib/engine";
import { Badge } from "@/components/ui/Badge";
import { ContentPreview } from "./ContentPreview";
import { PublishButton } from "./PublishButton";

export function ApprovalCard({
  approval,
  onDecide,
}: {
  approval: Approval;
  onDecide: (id: string, decision: ApprovalStatus, notes?: string) => void;
}) {
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const decide = async (d: ApprovalStatus) => {
    setBusy(true);
    try {
      await onDecide(approval.id, d, notes.trim() || undefined);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Badge variant="default">{approval.ecosystemId}</Badge>
        {approval.contentType && <Badge variant="outline">{approval.contentType}</Badge>}
        <span className="font-mono text-xs text-zinc-600">{approval.id}</span>
        <div className="flex-1" />
        {approval.taskId && <span className="font-mono text-xs text-zinc-600">task {approval.taskId}</span>}
      </div>

      {approval.previewUrl && (
        <a href={approval.previewUrl} target="_blank" rel="noopener noreferrer" className="mb-3 block">
          <img src={approval.previewUrl} alt="preview" className="max-h-48 rounded border border-zinc-800" />
        </a>
      )}
      {approval.artifactPath && (
        <p className="mb-3 break-all font-mono text-xs text-zinc-500">{approval.artifactPath}</p>
      )}

      <ContentPreview content={approval.contentJson} approvalId={approval.id} contentType={approval.contentType} />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Review notes (required for reject / request-changes)…"
        rows={2}
        className="mt-3 w-full resize-y rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
      />

      <div className="mt-3 flex gap-2">
        <button
          disabled={busy}
          onClick={() => decide("approved")}
          className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          <Check className="h-4 w-4" /> Approve
        </button>
        <button
          disabled={busy || !notes.trim()}
          onClick={() => decide("changes-requested")}
          className="flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
          title={notes.trim() ? "" : "Add review notes first"}
        >
          <MessageSquare className="h-4 w-4" /> Request changes
        </button>
        <button
          disabled={busy || !notes.trim()}
          onClick={() => decide("rejected")}
          className="flex items-center gap-1.5 rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          title={notes.trim() ? "" : "Add review notes first"}
        >
          <X className="h-4 w-4" /> Reject
        </button>
      </div>
      <PublishButton approval={approval} />
    </div>
  );
}
