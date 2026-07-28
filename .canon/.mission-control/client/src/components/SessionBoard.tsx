import { useCallback, useEffect, useState } from "react";
import { sessions as sessionsApi, type SessionInfo } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";
import { EmbeddedTerminal } from "@/features/terminal/EmbeddedTerminal";

const STATUS_DOT: Record<SessionInfo["status"], string> = {
  running: "bg-green-500 animate-pulse",
  waiting: "bg-yellow-500",
  done: "bg-zinc-500",
  error: "bg-red-500",
};

export function SessionBoard() {
  const [list, setList] = useState<SessionInfo[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [stopError, setStopError] = useState<string | null>(null);
  const { subscribe } = useWebSocket();

  const refresh = useCallback(() => {
    sessionsApi.list().then(setList).catch(() => { /* surfaced elsewhere */ });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => subscribe((msg) => { if (msg.type === "status") refresh(); }), [subscribe, refresh]);

  // Always reconcile against the server (finally), and surface stop failures
  // instead of swallowing them — a silent 404 was hiding stuck sessions.
  const stop = (id: string) => {
    setStopError(null);
    return sessionsApi
      .stop(id)
      .catch((err: unknown) =>
        setStopError(err instanceof Error ? err.message : "Failed to stop session"),
      )
      .finally(refresh);
  };

  return (
    <div className="flex h-full gap-4">
      <div className="w-72 shrink-0 space-y-1 overflow-auto">
        {stopError && (
          <p className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-[10px] text-red-300">
            {stopError}
          </p>
        )}
        {list.length === 0 && <p className="text-xs text-zinc-500">No sessions yet.</p>}
        {list.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs ${
              selected === s.id ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-800 hover:bg-zinc-800/50"
            }`}
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[s.status]}`} />
            <span className="flex-1 truncate font-mono">{s.command}</span>
            {(s.status === "running" || s.status === "waiting") && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); stop(s.id); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); stop(s.id); } }}
                className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-300 hover:bg-red-500/30"
              >
                Stop
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 rounded-md border border-zinc-800 bg-[#181818] p-1">
        {selected ? (
          <EmbeddedTerminal sessionId={selected} />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-500">
            Select a session to attach its terminal.
          </div>
        )}
      </div>
    </div>
  );
}
