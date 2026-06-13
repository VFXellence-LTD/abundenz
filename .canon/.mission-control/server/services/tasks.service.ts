import type { Db } from "../db.js";

export type TaskStatus = "backlog" | "todo" | "in-progress" | "blocked" | "in-review" | "done";
export const TASK_STATUSES: TaskStatus[] = ["backlog", "todo", "in-progress", "blocked", "in-review", "done"];

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: string;
  ecosystemId: string;
  verticalId?: string;
  source: string;
  status: TaskStatus;
  priority: string;
  owner?: string;
  agentId?: string;
  parentId?: string;
  linkedIds?: string[];
  campaignId?: string;
  contentType?: string;
  platform?: string;
  autonomyStage: number;
  checklist?: unknown;
  createdAt: string;
  updatedAt: string;
}

interface Row {
  id: string; title: string; description: string | null; type: string;
  ecosystem_id: string; vertical_id: string | null; source: string;
  status: string; priority: string; owner: string | null; agent_id: string | null;
  parent_id: string | null; linked_ids: string | null; campaign_id: string | null;
  content_type: string | null; platform: string | null; autonomy_stage: number;
  checklist: string | null; created_at: string; updated_at: string;
}

function rowToTask(r: Row): Task {
  return {
    id: r.id, title: r.title, description: r.description ?? undefined, type: r.type,
    ecosystemId: r.ecosystem_id, verticalId: r.vertical_id ?? undefined, source: r.source,
    status: r.status as TaskStatus, priority: r.priority, owner: r.owner ?? undefined,
    agentId: r.agent_id ?? undefined, parentId: r.parent_id ?? undefined,
    linkedIds: r.linked_ids ? (JSON.parse(r.linked_ids) as string[]) : undefined,
    campaignId: r.campaign_id ?? undefined, contentType: r.content_type ?? undefined,
    platform: r.platform ?? undefined, autonomyStage: r.autonomy_stage,
    checklist: r.checklist ? JSON.parse(r.checklist) : undefined,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export class TasksService {
  constructor(private db: Db) {}

  list(ecosystemId?: string): Task[] {
    const rows = ecosystemId
      ? (this.db.raw.prepare("SELECT * FROM tasks WHERE ecosystem_id=? ORDER BY created_at DESC").all(ecosystemId) as Row[])
      : (this.db.raw.prepare("SELECT * FROM tasks ORDER BY created_at DESC").all() as Row[]);
    return rows.map(rowToTask);
  }

  get(id: string): Task | undefined {
    const r = this.db.raw.prepare("SELECT * FROM tasks WHERE id=?").get(id) as Row | undefined;
    return r ? rowToTask(r) : undefined;
  }

  create(data: Partial<Task> & { id: string; title: string; type: string; ecosystemId: string }): Task {
    const now = new Date().toISOString();
    this.db.raw
      .prepare(
        `INSERT INTO tasks (id,title,description,type,ecosystem_id,vertical_id,source,status,priority,
           owner,agent_id,parent_id,linked_ids,campaign_id,content_type,platform,autonomy_stage,checklist,
           created_at,updated_at)
         VALUES (@id,@title,@description,@type,@ecosystem_id,@vertical_id,@source,@status,@priority,
           @owner,@agent_id,@parent_id,@linked_ids,@campaign_id,@content_type,@platform,@autonomy_stage,@checklist,
           @created_at,@updated_at)`,
      )
      .run({
        id: data.id, title: data.title, description: data.description ?? null, type: data.type,
        ecosystem_id: data.ecosystemId, vertical_id: data.verticalId ?? null,
        source: data.source ?? "manual", status: data.status ?? "backlog",
        priority: data.priority ?? "medium", owner: data.owner ?? null, agent_id: data.agentId ?? null,
        parent_id: data.parentId ?? null, linked_ids: data.linkedIds ? JSON.stringify(data.linkedIds) : null,
        campaign_id: data.campaignId ?? null, content_type: data.contentType ?? null,
        platform: data.platform ?? null, autonomy_stage: data.autonomyStage ?? 0,
        checklist: data.checklist ? JSON.stringify(data.checklist) : null,
        created_at: now, updated_at: now,
      });
    return this.get(data.id)!;
  }

  hasPendingApproval(taskId: string): boolean {
    const r = this.db.raw
      .prepare("SELECT COUNT(*) c FROM approval_queue WHERE task_id=? AND status='pending'")
      .get(taskId) as { c: number };
    return r.c > 0;
  }

  setStatus(id: string, status: TaskStatus): Task | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    this.db.raw
      .prepare("UPDATE tasks SET status=?, updated_at=? WHERE id=?")
      .run(status, new Date().toISOString(), id);
    return this.get(id);
  }
}
