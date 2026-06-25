import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { debounce } from "@/lib/debounce";
import type { EcosystemId } from "@/types";

type DataMap = Record<string, Record<string, string>>;

export function useSetupData(ecosystemId: EcosystemId) {
  const [data, setData] = useState<DataMap>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const persistersRef = useRef<Record<string, (value: string) => void>>({});

  useEffect(() => {
    let alive = true;
    persistersRef.current = {};
    api
      .get<DataMap>(`/setup/data/${ecosystemId}`)
      .then((d) => { if (alive) setData(d); })
      .catch(console.error);
    return () => { alive = false; };
  }, [ecosystemId]);

  const getPersister = useCallback(
    (stepId: string, fieldKey: string) => {
      const k = `${stepId}.${fieldKey}`;
      if (!persistersRef.current[k]) {
        persistersRef.current[k] = debounce((value: string) => {
          api
            .put(`/setup/data`, { ecosystemId, stepId, fieldKey, value })
            .then(() => setSaved((s) => ({ ...s, [k]: true })))
            .catch(console.error);
        }, 500);
      }
      return persistersRef.current[k];
    },
    [ecosystemId],
  );

  const getFieldValue = useCallback(
    (stepId: string, fieldKey: string) => data[stepId]?.[fieldKey] ?? "",
    [data],
  );

  const saveFieldValue = useCallback(
    (stepId: string, fieldKey: string, value: string) => {
      const k = `${stepId}.${fieldKey}`;
      setData((prev) => ({ ...prev, [stepId]: { ...prev[stepId], [fieldKey]: value } }));
      setSaved((s) => ({ ...s, [k]: false }));
      getPersister(stepId, fieldKey)(value);
    },
    [getPersister],
  );

  const setLocal = useCallback((stepId: string, fieldKey: string, value: string) => {
    const k = `${stepId}.${fieldKey}`;
    setData((prev) => ({ ...prev, [stepId]: { ...prev[stepId], [fieldKey]: value } }));
    setSaved((s) => ({ ...s, [k]: false }));
  }, []);

  const isSaved = useCallback(
    (stepId: string, fieldKey: string) => !!saved[`${stepId}.${fieldKey}`],
    [saved],
  );

  return { getFieldValue, saveFieldValue, setLocal, isSaved };
}