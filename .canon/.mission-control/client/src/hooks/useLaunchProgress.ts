import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";

interface LaunchState {
  [verticalKey: string]: { [stepId: string]: boolean };
}
interface LaunchData {
  [verticalKey: string]: { [fieldKey: string]: string };
}
interface LaunchPayload {
  progress: LaunchState;
  data: LaunchData;
}

export function useLaunchProgress() {
  const [state, setState] = useState<LaunchState>({});
  const [data, setData] = useState<LaunchData>({});

  useEffect(() => {
    api
      .get<LaunchPayload>("/launch")
      .then((p) => {
        setState(p.progress ?? {});
        setData(p.data ?? {});
      })
      .catch(console.error);
  }, []);

  const getVerticalKey = (ecosystemId: string, verticalId: string) => `${ecosystemId}:${verticalId}`;

  const isComplete = useCallback(
    (ecosystemId: string, verticalId: string, stepId: string) =>
      state[getVerticalKey(ecosystemId, verticalId)]?.[stepId] ?? false,
    [state],
  );

  const toggleStep = useCallback((ecosystemId: string, verticalId: string, stepId: string) => {
    const key = getVerticalKey(ecosystemId, verticalId);
    setState((prev) => {
      const vs = prev[key] ?? {};
      return { ...prev, [key]: { ...vs, [stepId]: !vs[stepId] } };
    });
    api.post<LaunchPayload>("/launch/toggle", { verticalKey: key, stepId })
      .then((p) => setState(p.progress ?? {}))
      .catch(console.error);
  }, []);

  const getProgress = useCallback(
    (ecosystemId: string, verticalId: string, stepIds: string[]) => {
      const vs = state[getVerticalKey(ecosystemId, verticalId)] ?? {};
      const completed = stepIds.filter((id) => vs[id]).length;
      return {
        completed,
        total: stepIds.length,
        percent: stepIds.length > 0 ? Math.round((completed / stepIds.length) * 100) : 0,
      };
    },
    [state],
  );

  const getFieldValue = useCallback(
    (ecosystemId: string, verticalId: string, stepId: string, fieldKey: string) =>
      data[getVerticalKey(ecosystemId, verticalId)]?.[`${stepId}.${fieldKey}`] ?? "",
    [data],
  );

  const setFieldValue = useCallback(
    (ecosystemId: string, verticalId: string, stepId: string, fieldKey: string, value: string) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      const compositeKey = `${stepId}.${fieldKey}`;
      setData((prev) => ({ ...prev, [key]: { ...(prev[key] ?? {}), [compositeKey]: value } }));
      api.put<LaunchPayload>("/launch/field", { verticalKey: key, fieldKey: compositeKey, value })
        .then((p) => setData(p.data ?? {}))
        .catch(console.error);
    },
    [],
  );

  const getAllData = useCallback(
    (ecosystemId: string, verticalId: string) => data[getVerticalKey(ecosystemId, verticalId)] ?? {},
    [data],
  );

  const exportData = useCallback(
    (ecosystemId: string, verticalId: string) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      return {
        ecosystem: ecosystemId,
        vertical: verticalId,
        progress: state[key] ?? {},
        data: data[key] ?? {},
        exportedAt: new Date().toISOString(),
      };
    },
    [state, data],
  );

  const exportMarkdown = useCallback(
    (
      ecosystemId: string,
      verticalId: string,
      steps: { id: string; title: string; fields?: { key: string; label: string; sensitive?: boolean }[] }[],
    ) => {
      const key = getVerticalKey(ecosystemId, verticalId);
      const vs = state[key] ?? {};
      const vd = data[key] ?? {};
      const lines: string[] = [
        `# Launch Data — ${ecosystemId} / ${verticalId}`,
        "",
        `**Exported:** ${new Date().toISOString().slice(0, 10)}`,
        "",
        "---",
        "",
      ];
      for (const step of steps) {
        lines.push(`## [${vs[step.id] ? "x" : " "}] ${step.title}`, "");
        if (step.fields) {
          for (const field of step.fields) {
            const value = vd[`${step.id}.${field.key}`] ?? "";
            lines.push(field.sensitive ? `- **${field.label}:** [REDACTED]` : `- **${field.label}:** ${value || "(not set)"}`);
          }
          lines.push("");
        }
      }
      return lines.join("\n");
    },
    [state, data],
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
