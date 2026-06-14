import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AgentRun } from "@/lib/engine";

export function useAgentRuns(pollMs = 5000) {
  const [runs, setRuns] = useState<AgentRun[]>([]);

  const reload = useCallback(() => {
    api.get<AgentRun[]>("/agent-runs").then(setRuns).catch(() => {});
  }, []);

  useEffect(() => {
    reload();
    const id = setInterval(reload, pollMs);
    return () => clearInterval(id);
  }, [reload, pollMs]);

  return { runs, reload };
}
