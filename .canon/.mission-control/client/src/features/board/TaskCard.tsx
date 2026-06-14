import type { Task, TaskStatus } from "@/lib/engine";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { PRIORITY_BORDER, PRIORITY_BG, STATUS_ACCENT, TRANSITION_OPTIONS } from "./board.types";

export function TaskCard({
  task,
  onMove,
}: {
  task: Task;
  onMove?: (id: string, status: TaskStatus) => void;
}) {
  const accent = STATUS_ACCENT[task.status] ?? "#6b7280";
  return (
    <div
      style={{ borderTopColor: accent }}
      className={cn(
        "group relative rounded-md border border-zinc-800 border-t-2 border-l-4 p-3 select-none transition-colors hover:bg-zinc-800/60",
        PRIORITY_BG[task.priority] ?? "bg-zinc-900",
        PRIORITY_BORDER[task.priority] ?? "border-l-zinc-600",
      )}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="truncate font-mono text-xs text-zinc-500">{task.id}</span>
        {task.claudeSessionId && (
          <span
            className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-emerald-500"
            title="Active session"
          />
        )}
        <div className="flex-1" />
        <Badge variant="outline">{task.ecosystemId}</Badge>
      </div>
      <p className="line-clamp-3 text-sm leading-snug text-zinc-200">{task.title}</p>
      <p className="mt-1.5 text-xs italic text-zinc-500">{task.owner ?? "Unassigned"}</p>
      {onMove && (
        <div className="mt-2 flex justify-end">
          <select
            aria-label={`Move ${task.id}`}
            value={task.status}
            onChange={(e) => onMove(task.id, e.target.value as TaskStatus)}
            className="cursor-pointer appearance-none rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300 transition-colors hover:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            style={{ color: accent }}
          >
            {TRANSITION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-zinc-900 text-zinc-200">
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
