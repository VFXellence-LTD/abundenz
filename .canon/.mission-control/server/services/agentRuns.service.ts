import type { Db } from "../db.js";

export type AgentRunStatus = "queued" | "running" | "waiting" | "done" | "error" | "killed";
export const AGENT_RUN_STATUSES: AgentRunStatus[] = ["queued", "running", "waiting", "done", "error", "killed"];

export interface AgentRun {
  id: string; campaignId?: string; taskId?: string; agentName?: string;
  claudeSessionId?: string; ptySessionId?: string; status: AgentRunStatus;
  cwd?: string; command?: string; startedAt?: string; completedAt?: string;
  outputJson?: unknown; error?: string;
}

interface Row {
  id: string; campaign_id: string | null; task_id: string | null; agent_name: string | null;
  claude_session_id: string | null; pty_session_id: string | null; status: string;
  cwd: string | null; command: string | null; started_at: string | null;
  completed_at: string | null; output_json: string | null; error: string | null;
}

function rowToRun(r: Row): AgentRun {
  return {
    id: r.id, campaignId: r.campaign_id ?? undefined, taskId: r.task_id ?? undefined,
    agentName: r.agent_name ?? undefined, claudeSessionId: r.claude_session_id ?? undefined,
    ptySessionId: r.pty_session_id ?? undefined, status: r.status as AgentRunStatus,
    cwd: r.cwd ?? undefined, command: r.command ?? undefined, startedAt: r.started_at ?? undefined,
    completedAt: r.completed_at ?? undefined,
    outputJson: r.output_json ? JSON.parse(r.output_json) : undefined, error: r.error ?? undefined,
  };
}

export class AgentRunsService {
  constructor(private db: Db) {}

  list(): AgentRun[] {
    return (this.db.raw.prepare("SELECT * FROM agent_runs ORDER BY rowid DESC").all() as Row[]).map(rowToRun);
  }

  get(id: string): AgentRun | undefined {
    const r = this.db.raw.prepare("SELECT * FROM agent_runs WHERE id=?").get(id) as Row | undefined;
    return r ? rowToRun(r) : undefined;
  }

  create(data: { id: string; campaignId?: string; taskId?: string | null; agentName?: string; cwd?: string; command?: string }): AgentRun {
    this.db.raw
      .prepare(
        `INSERT INTO agent_runs (id,campaign_id,task_id,agent_name,status,cwd,command)
         VALUES (@id,@campaign_id,@task_id,@agent_name,'queued',@cwd,@command)`,
      )
      .run({
        id: data.id, campaign_id: data.campaignId ?? null, task_id: data.taskId ?? null,
        agent_name: data.agentName ?? null, cwd: data.cwd ?? null, command: data.command ?? null,
      });
    return this.get(data.id)!;
  }

  setStatus(id: string, status: AgentRunStatus, error?: string): AgentRun | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    const now = new Date().toISOString();
    const startedAt = status === "running" && !existing.startedAt ? now : existing.startedAt ?? null;
    const completedAt = ["done", "error", "killed"].includes(status) ? now : existing.completedAt ?? null;
    this.db.raw
      .prepare("UPDATE agent_runs SET status=?, started_at=?, completed_at=?, error=COALESCE(?, error) WHERE id=?")
      .run(status, startedAt, completedAt, error ?? null, id);
    return this.get(id);
  }
}
