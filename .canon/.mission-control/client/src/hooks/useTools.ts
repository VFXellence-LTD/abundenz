import { useState, useCallback, useEffect } from "react";
import type { Tool, ToolStatus, EcosystemId } from "@/types";
import { api } from "@/lib/api";

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    api.get<Tool[]>("/tools").then(setTools).catch(console.error);
  }, []);

  const updateToolStatus = useCallback((id: string, status: ToolStatus) => {
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    api.put<Tool>(`/tools/${id}/status`, { status }).catch(console.error);
  }, []);

  const activeTools = tools.filter((t) => t.status === "active");
  const monthlyBurn = activeTools.reduce((sum, t) => sum + t.costPerMonth, 0);

  const toolsByEcosystem = useCallback(
    (ecosystemId: EcosystemId) => tools.filter((t) => t.ecosystems.includes(ecosystemId)),
    [tools],
  );

  return { tools, activeTools, monthlyBurn, updateToolStatus, toolsByEcosystem };
}
