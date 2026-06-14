import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Task, TaskStatus } from "@/lib/engine";
import { BOARD_COLUMNS } from "./board.types";
import { BoardColumn } from "./BoardColumn";

const SCOPES: { id: string; label: string }[] = [
  { id: "all", label: "All ecosystems" },
  { id: "content", label: "Content (Signal)" },
  { id: "viral", label: "Viral (Surge)" },
  { id: "products", label: "Products (Atelier)" },
  { id: "affiliate", label: "Affiliate (Conduit)" },
  { id: "apps", label: "Apps (Forge)" },
];

export function Board({
  tasks,
  scope,
  onScopeChange,
  onMove,
  onRefresh,
  error,
}: {
  tasks: Task[];
  scope: string;
  onScopeChange: (s: string) => void;
  onMove?: (id: string, status: TaskStatus) => void;
  onRefresh?: () => void;
  error?: string | null;
}) {
  const [query, setQuery] = useState("");

  const byStatus = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
      : tasks;
    const map: Record<TaskStatus, Task[]> = {
      backlog: [], todo: [], "in-progress": [], blocked: [], "in-review": [], done: [],
    };
    for (const t of filtered) (map[t.status] ??= []).push(t);
    return map;
  }, [tasks, query]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 pt-4">
        <select
          aria-label="Ecosystem scope"
          value={scope}
          onChange={(e) => onScopeChange(e.target.value)}
          className="cursor-pointer rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-300 hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {SCOPES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter tasks…"
          className="w-48 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <div className="flex-1" />
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        )}
      </div>
      {error && <p className="px-4 pt-2 text-xs text-red-400">{error}</p>}
      <div className="flex flex-1 gap-4 overflow-x-auto px-4 py-3">
        {BOARD_COLUMNS.map((col) => (
          <BoardColumn key={col.id} column={col} tasks={byStatus[col.id]} onMove={onMove} />
        ))}
      </div>
    </div>
  );
}
