import type { Approval, ApprovalStatus } from "@/lib/engine";
import { ApprovalCard } from "./ApprovalCard";

export function ApprovalQueue({
  approvals,
  onDecide,
  error,
}: {
  approvals: Approval[];
  onDecide: (id: string, decision: ApprovalStatus, notes?: string) => void;
  error?: string | null;
}) {
  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-400">{error}</p>}
      {approvals.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-800 py-12 text-center text-sm text-zinc-600">
          No pending approvals. The queue is clear.
        </p>
      ) : (
        approvals.map((a) => <ApprovalCard key={a.id} approval={a} onDecide={onDecide} />)
      )}
    </div>
  );
}
