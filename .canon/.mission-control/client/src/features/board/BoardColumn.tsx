import type { Task, TaskStatus } from "@/lib/engine";
import { Badge } from "@/components/ui/Badge";
import { ScrollColumn } from "@/components/ui/ScrollColumn";
import { STATUS_ACCENT } from "./board.types";
import type { BoardColumn as Col } from "./board.types";
import { TaskCard } from "./TaskCard";

export function BoardColumn({
  column,
  tasks,
  onMove,
}: {
  column: Col;
  tasks: Task[];
  onMove?: (id: string, status: TaskStatus) => void;
}) {
  return (
    <div className="flex min-w-[220px] max-w-[320px] flex-1 flex-shrink-0 flex-col">
      <div className="flex items-center gap-2 px-2 pb-2">
        <h3 className="text-sm font-medium" style={{ color: STATUS_ACCENT[column.id] }}>
          {column.label}
        </h3>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <div className="min-h-[60px] flex-1 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/40">
        <ScrollColumn className="max-h-[calc(100vh-180px)]">
          <div className="flex flex-col gap-2 p-2">
            {tasks.map((t) => (
              <TaskCard key={t.id} task={t} onMove={onMove} />
            ))}
            {tasks.length === 0 && (
              <p className="select-none py-8 text-center text-xs text-zinc-600">No tasks</p>
            )}
          </div>
        </ScrollColumn>
      </div>
    </div>
  );
}
