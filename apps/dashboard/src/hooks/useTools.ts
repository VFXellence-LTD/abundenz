import { useState, useCallback } from "react";
import type { Tool, ToolStatus, EcosystemId } from "@/types";
import { INITIAL_TOOLS } from "@/data/tools";

const STORAGE_KEY = "polymath_tools";

function loadFromStorage(): Tool[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_TOOLS;
  } catch {
    return INITIAL_TOOLS;
  }
}

function saveToStorage(tools: Tool[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
}

export function useTools() {
  const [tools, setTools] = useState<Tool[]>(loadFromStorage);

  const updateToolStatus = useCallback((id: string, status: ToolStatus) => {
    setTools((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, status } : t));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const activeTools = tools.filter((t) => t.status === "active");
  const monthlyBurn = activeTools.reduce((sum, t) => sum + t.costPerMonth, 0);

  const toolsByEcosystem = useCallback(
    (ecosystemId: EcosystemId) =>
      tools.filter((t) => t.ecosystems.includes(ecosystemId)),
    [tools]
  );

  return {
    tools,
    activeTools,
    monthlyBurn,
    updateToolStatus,
    toolsByEcosystem,
  };
}
