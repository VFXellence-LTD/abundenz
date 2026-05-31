import { useState, useCallback } from "react";

const STORAGE_KEY = "polymath_launch_progress";
const DATA_KEY = "polymath_launch_data";

interface LaunchState {
  [verticalKey: string]: {
    [stepId: string]: boolean;
  };
}

interface LaunchData {
  [verticalKey: string]: {
    [fieldKey: string]: string;
  };
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useLaunchProgress() {
  const [state, setState] = useState<LaunchState>(() => load(STORAGE_KEY, {}));
  const [data, setData] = useState<LaunchData>(() => load(DATA_KEY, {}));

  const getVerticalKey = (ecosystemId: string, verticalId: string) =>
    `${ecosystemId}:${verticalId}`;

  const isComplete = useCallback(
    (ecosystemId: string, verticalId: string, stepId: string) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      return state[key]?.[stepId] ?? false;
    },
    [state]
  );

  const toggleStep = useCallback(
    (ecosystemId: string, verticalId: string, stepId: string) => {
      setState((prev) => {
        const key = getVerticalKey(ecosystemId, verticalId);
        const verticalState = prev[key] ?? {};
        const updated = {
          ...prev,
          [key]: {
            ...verticalState,
            [stepId]: !verticalState[stepId],
          },
        };
        save(STORAGE_KEY, updated);
        return updated;
      });
    },
    []
  );

  const getProgress = useCallback(
    (ecosystemId: string, verticalId: string, stepIds: string[]) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      const verticalState = state[key] ?? {};
      const completed = stepIds.filter((id) => verticalState[id]).length;
      return {
        completed,
        total: stepIds.length,
        percent: stepIds.length > 0 ? Math.round((completed / stepIds.length) * 100) : 0,
      };
    },
    [state]
  );

  const getFieldValue = useCallback(
    (ecosystemId: string, verticalId: string, stepId: string, fieldKey: string) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      const compositeKey = `${stepId}.${fieldKey}`;
      return data[key]?.[compositeKey] ?? "";
    },
    [data]
  );

  const setFieldValue = useCallback(
    (ecosystemId: string, verticalId: string, stepId: string, fieldKey: string, value: string) => {
      setData((prev) => {
        const key = getVerticalKey(ecosystemId, verticalId);
        const compositeKey = `${stepId}.${fieldKey}`;
        const updated = {
          ...prev,
          [key]: {
            ...(prev[key] ?? {}),
            [compositeKey]: value,
          },
        };
        save(DATA_KEY, updated);
        return updated;
      });
    },
    []
  );

  const getAllData = useCallback(
    (ecosystemId: string, verticalId: string) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      return data[key] ?? {};
    },
    [data]
  );

  const exportData = useCallback(
    (ecosystemId: string, verticalId: string) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      const verticalState = state[key] ?? {};
      const verticalData = data[key] ?? {};
      return {
        ecosystem: ecosystemId,
        vertical: verticalId,
        progress: verticalState,
        data: verticalData,
        exportedAt: new Date().toISOString(),
      };
    },
    [state, data]
  );

  const exportMarkdown = useCallback(
    (ecosystemId: string, verticalId: string, steps: { id: string; title: string; fields?: { key: string; label: string; sensitive?: boolean }[] }[]) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      const verticalState = state[key] ?? {};
      const verticalData = data[key] ?? {};

      const lines: string[] = [
        `# Launch Data — ${ecosystemId} / ${verticalId}`,
        "",
        `**Exported:** ${new Date().toISOString().slice(0, 10)}`,
        "",
        "---",
        "",
      ];

      for (const step of steps) {
        const done = verticalState[step.id] ? "x" : " ";
        lines.push(`## [${done}] ${step.title}`);
        lines.push("");

        if (step.fields) {
          for (const field of step.fields) {
            const compositeKey = `${step.id}.${field.key}`;
            const value = verticalData[compositeKey] ?? "";
            if (field.sensitive) {
              lines.push(`- **${field.label}:** [REDACTED]`);
            } else {
              lines.push(`- **${field.label}:** ${value || "(not set)"}`);
            }
          }
          lines.push("");
        }
      }

      return lines.join("\n");
    },
    [state, data]
  );

  return {
    isComplete,
    toggleStep,
    getProgress,
    getFieldValue,
    setFieldValue,
    getAllData,
    exportData,
    exportMarkdown,
  };
}
