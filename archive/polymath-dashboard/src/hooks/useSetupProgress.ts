import { useState, useCallback } from "react";
import type { SetupProgress, EcosystemId } from "@/types";

const STORAGE_KEY = "polymath_setup_progress";

function loadFromStorage(): SetupProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(progress: SetupProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useSetupProgress() {
  const [progress, setProgress] = useState<SetupProgress>(loadFromStorage);

  const toggleStep = useCallback((stepId: string) => {
    setProgress((prev) => {
      const updated = { ...prev, [stepId]: !prev[stepId] };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const isComplete = useCallback(
    (stepId: string) => !!progress[stepId],
    [progress]
  );

  const completedCount = useCallback(
    (stepIds: string[]) => stepIds.filter((id) => progress[id]).length,
    [progress]
  );

  const getEcosystemProgress = useCallback(
    (_ecosystemId: EcosystemId, stepIds: string[]) => {
      const total = stepIds.length;
      const completed = stepIds.filter((id) => progress[id]).length;
      return { total, completed, percent: total > 0 ? (completed / total) * 100 : 0 };
    },
    [progress]
  );

  return {
    progress,
    toggleStep,
    isComplete,
    completedCount,
    getEcosystemProgress,
  };
}
