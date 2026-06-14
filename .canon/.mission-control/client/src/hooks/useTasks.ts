import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Task, TaskStatus } from "@/lib/engine";

export function useTasks(ecosystem: string = "all") {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    api
      .get<Task[]>(`/tasks?ecosystem=${encodeURIComponent(ecosystem)}`)
      .then((t) => {
        setTasks(t);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  }, [ecosystem]);

  useEffect(() => {
    reload();
  }, [reload]);

  const move = useCallback(
    async (id: string, status: TaskStatus) => {
      // optimistic
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      try {
        const updated = await api.patch<Task>(`/tasks/${id}/status`, { status });
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } catch (e) {
        setError((e as Error).message); // e.g. 409: can't complete with pending approval
        reload(); // resync truth
      }
    },
    [reload],
  );

  return { tasks, error, reload, move };
}
