import { useState, useCallback, useEffect } from "react";
import type { SetupProgress, EcosystemId } from "@/types";
import { api } from "@/lib/api";

export function useSetupProgress(brandId?: string) {
  const [progress, setProgress] = useState<SetupProgress>({});

  useEffect(() => {
    const q = brandId ? `?brandId=${encodeURIComponent(brandId)}` : "";
    api.get<SetupProgress>(`/setup${q}`).then(setProgress).catch(console.error);
  }, [brandId]);

  const toggleStep = useCallback((stepId: string) => {
    setProgress((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
    api.post<SetupProgress>("/setup/toggle", { stepId, brandId }).then(setProgress).catch(console.error);
  }, [brandId]);

  const isComplete = useCallback((stepId: string) => !!progress[stepId], [progress]);

  const completedCount = useCallback(
    (stepIds: string[]) => stepIds.filter((id) => progress[id]).length,
    [progress],
  );

  const getEcosystemProgress = useCallback(
    (_ecosystemId: EcosystemId, stepIds: string[]) => {
      const total = stepIds.length;
      const completed = stepIds.filter((id) => progress[id]).length;
      return { total, completed, percent: total > 0 ? (completed / total) * 100 : 0 };
    },
    [progress],
  );

  return { progress, toggleStep, isComplete, completedCount, getEcosystemProgress };
}
