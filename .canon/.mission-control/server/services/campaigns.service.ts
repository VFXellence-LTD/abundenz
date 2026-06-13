import type { Db } from "../db.js";

export type CampaignStatus = "planned" | "running" | "paused" | "review" | "done" | "killed";
export const CAMPAIGN_STATUSES: CampaignStatus[] = ["planned", "running", "paused", "review", "done", "killed"];

export interface Campaign {
  id: string; name: string; ecosystemId: string; verticalId?: string;
  status: CampaignStatus; autonomyStage: number; targetCount: number;
  approvedBy?: string; approvedAt?: string; startedAt?: string; completedAt?: string;
  notes?: string; createdAt: string; updatedAt: string;
}

interface Row {
  id: string; name: string; ecosystem_id: string; vertical_id: string | null;
  status: string; autonomy_stage: number; target_count: number;
  approved_by: string | null; approved_at: string | null; started_at: string | null;
  completed_at: string | null; notes: string | null; created_at: string; updated_at: string;
}

function rowToCampaign(r: Row): Campaign {
  return {
    id: r.id, name: r.name, ecosystemId: r.ecosystem_id, verticalId: r.vertical_id ?? undefined,
    status: r.status as CampaignStatus, autonomyStage: r.autonomy_stage, targetCount: r.target_count,
    approvedBy: r.approved_by ?? undefined, approvedAt: r.approved_at ?? undefined,
    startedAt: r.started_at ?? undefined, completedAt: r.completed_at ?? undefined,
    notes: r.notes ?? undefined, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export class CampaignsService {
  constructor(private db: Db) {}

  list(ecosystemId?: string): Campaign[] {
    const rows = ecosystemId
      ? (this.db.raw.prepare("SELECT * FROM campaigns WHERE ecosystem_id=? ORDER BY created_at DESC").all(ecosystemId) as Row[])
      : (this.db.raw.prepare("SELECT * FROM campaigns ORDER BY created_at DESC").all() as Row[]);
    return rows.map(rowToCampaign);
  }

  get(id: string): Campaign | undefined {
    const r = this.db.raw.prepare("SELECT * FROM campaigns WHERE id=?").get(id) as Row | undefined;
    return r ? rowToCampaign(r) : undefined;
  }

  create(data: { id: string; name: string; ecosystemId: string; verticalId?: string; targetCount?: number; notes?: string }): Campaign {
    const now = new Date().toISOString();
    this.db.raw
      .prepare(
        `INSERT INTO campaigns (id,name,ecosystem_id,vertical_id,status,autonomy_stage,target_count,notes,created_at,updated_at)
         VALUES (@id,@name,@ecosystem_id,@vertical_id,'planned',0,@target_count,@notes,@created_at,@updated_at)`,
      )
      .run({
        id: data.id, name: data.name, ecosystem_id: data.ecosystemId,
        vertical_id: data.verticalId ?? null, target_count: data.targetCount ?? 1,
        notes: data.notes ?? null, created_at: now, updated_at: now,
      });
    return this.get(data.id)!;
  }

  approve(id: string, approvedBy: string): Campaign | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    const now = new Date().toISOString();
    this.db.raw
      .prepare("UPDATE campaigns SET approved_by=?, approved_at=?, updated_at=? WHERE id=?")
      .run(approvedBy, now, now, id);
    return this.get(id);
  }

  /** Returns { campaign } on success or { gate: true } when running without approval. */
  setStatus(id: string, status: CampaignStatus): { campaign?: Campaign; gate?: boolean; missing?: boolean } {
    const existing = this.get(id);
    if (!existing) return { missing: true };
    if (status === "running" && !existing.approvedBy) {
      return { gate: true };
    }
    const now = new Date().toISOString();
    const startedAt = status === "running" && !existing.startedAt ? now : existing.startedAt ?? null;
    const completedAt = status === "done" ? now : existing.completedAt ?? null;
    this.db.raw
      .prepare("UPDATE campaigns SET status=?, started_at=?, completed_at=?, updated_at=? WHERE id=?")
      .run(status, startedAt, completedAt, now, id);
    return { campaign: this.get(id) };
  }
}
