import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Approval, ApprovalStatus, Task } from "@/lib/engine";

const REVIEWER = "Robin Dutta";

export function useApprovals(ecosystem: string = "all") {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    const eco = ecosystem === "all" ? "" : `&ecosystem=${encodeURIComponent(ecosystem)}`;
    api
      .get<Approval[]>(`/approvals?status=pending${eco}`)
      .then((a) => { setApprovals(a); setError(null); })
      .catch((e: Error) => setError(e.message));
  }, [ecosystem]);

  useEffect(() => { reload(); }, [reload]);

  const decide = useCallback(
    async (id: string, decision: ApprovalStatus, reviewNotes?: string) => {
      try {
        const updated = await api.patch<Approval>(`/approvals/${id}/status`, {
          status: decision,
          reviewedBy: REVIEWER,
          reviewNotes,
        });
        // Server gate: it does NOT move the task. We do.
        // approved -> task done ; rejected/changes-requested -> task back in-progress.
        if (updated.taskId) {
          const next = decision === "approved" ? "done" : "in-progress";
          await api.patch<Task>(`/tasks/${updated.taskId}/status`, { status: next }).catch(() => {});
        }
        setApprovals((prev) => prev.filter((a) => a.id !== id));
      } catch (e) {
        setError((e as Error).message); // e.g. 409 terminal
        reload();
      }
    },
    [reload],
  );

  return { approvals, error, reload, decide };
}
