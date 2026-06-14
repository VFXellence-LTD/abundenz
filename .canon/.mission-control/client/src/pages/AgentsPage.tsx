import { useAgentRuns } from "@/hooks/useAgentRuns";
import { AgentBoard } from "@/features/agents/AgentBoard";

export function AgentsPage() {
  const { runs } = useAgentRuns();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">Agents &amp; Sessions</h1>
      <AgentBoard runs={runs} />
    </div>
  );
}
