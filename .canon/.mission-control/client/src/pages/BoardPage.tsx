import { useEffect, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Board } from "@/features/board/Board";

export function BoardPage() {
  const [scope, setScope] = useState("all");
  const { tasks, error, reload, move } = useTasks(scope);

  useEffect(() => {
    const id = setInterval(reload, 5000);
    return () => clearInterval(id);
  }, [reload]);

  return (
    <div className="-mx-6 -my-8 h-[calc(100vh-0px)]">
      <div className="px-2 pt-4">
        <h1 className="px-4 text-2xl font-bold text-zinc-100">Board</h1>
      </div>
      <Board
        tasks={tasks}
        scope={scope}
        onScopeChange={setScope}
        onMove={move}
        onRefresh={reload}
        error={error}
      />
    </div>
  );
}
