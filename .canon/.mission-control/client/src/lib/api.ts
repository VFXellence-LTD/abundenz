const BASE = "/api";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => fetch(`${BASE}${path}`).then((r) => handle<T>(r)),
  post: <T>(path: string, body: unknown) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  put: <T>(path: string, body: unknown) =>
    fetch(`${BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  patch: <T>(path: string, body: unknown) =>
    fetch(`${BASE}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r)),
  del: <T>(path: string) => fetch(`${BASE}${path}`, { method: "DELETE" }).then((r) => handle<T>(r)),
};

export interface SessionInfo {
  id: string;
  command: string;
  cwd: string | null;
  campaignId: string | null;
  taskId: string | null;
  status: "running" | "waiting" | "done" | "error";
  startedAt: string;
  endedAt: string | null;
}

export const sessions = {
  start: (body: { campaignId?: string; taskId?: string }) => api.post<SessionInfo>("/sessions/start", body),
  list: () => api.get<SessionInfo[]>("/sessions"),
  stop: (id: string) => api.post<{ id: string; status: string }>(`/sessions/${id}/stop`, {}),
};
