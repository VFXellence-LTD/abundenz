import type { Db } from "../db.js";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "changes-requested";
export const APPROVAL_STATUSES: ApprovalStatus[] = ["pending", "approved", "rejected", "changes-requested"];
const TERMINAL: ApprovalStatus[] = ["approved", "rejected"];

export interface Approval {
  id: string; taskId?: string; campaignId?: string; ecosystemId: string;
  contentType?: string; artifactPath?: string; previewUrl?: string; contentJson?: unknown;
  status: ApprovalStatus; reviewedBy?: string; reviewedAt?: string; reviewNotes?: string;
  createdAt: string;
}

interface Row {
  id: string; task_id: string | null; campaign_id: string | null; ecosystem_id: string;
  content_type: string | null; artifact_path: string | null; preview_url: string | null;
  content_json: string | null; status: string; reviewed_by: string | null;
  reviewed_at: string | null; review_notes: string | null; created_at: string;
}

function rowToApproval(r: Row): Approval {
  return {
    id: r.id, taskId: r.task_id ?? undefined, campaignId: r.campaign_id ?? undefined,
    ecosystemId: r.ecosystem_id, contentType: r.content_type ?? undefined,
    artifactPath: r.artifact_path ?? undefined, previewUrl: r.preview_url ?? undefined,
    contentJson: r.content_json ? JSON.parse(r.content_json) : undefined,
    status: r.status as ApprovalStatus, reviewedBy: r.reviewed_by ?? undefined,
    reviewedAt: r.reviewed_at ?? undefined, reviewNotes: r.review_notes ?? undefined,
    createdAt: r.created_at,
  };
}

function genId(): string {
  return `aq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class ApprovalsService {
  constructor(private db: Db) {}

  list(opts: { ecosystemId?: string; status?: string } = {}): Approval[] {
    const clauses: string[] = [];
    const params: unknown[] = [];
    if (opts.ecosystemId) { clauses.push("ecosystem_id=?"); params.push(opts.ecosystemId); }
    if (opts.status) { clauses.push("status=?"); params.push(opts.status); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = this.db.raw.prepare(`SELECT * FROM approval_queue ${where} ORDER BY created_at DESC`).all(...params) as Row[];
    return rows.map(rowToApproval);
  }

  get(id: string): Approval | undefined {
    const r = this.db.raw.prepare("SELECT * FROM approval_queue WHERE id=?").get(id) as Row | undefined;
    return r ? rowToApproval(r) : undefined;
  }

  create(data: { taskId?: string; campaignId?: string; ecosystemId: string; contentType?: string; artifactPath?: string; previewUrl?: string; contentJson?: unknown }): Approval {
    const id = genId();
    this.db.raw
      .prepare(
        `INSERT INTO approval_queue (id,task_id,campaign_id,ecosystem_id,content_type,artifact_path,preview_url,content_json,status,created_at)
         VALUES (@id,@task_id,@campaign_id,@ecosystem_id,@content_type,@artifact_path,@preview_url,@content_json,'pending',@created_at)`,
      )
      .run({
        id, task_id: data.taskId ?? null, campaign_id: data.campaignId ?? null,
        ecosystem_id: data.ecosystemId, content_type: data.contentType ?? null,
        artifact_path: data.artifactPath ?? null, preview_url: data.previewUrl ?? null,
        content_json: data.contentJson !== undefined ? JSON.stringify(data.contentJson) : null,
        created_at: new Date().toISOString(),
      });
    return this.get(id)!;
  }

  /** Transition with gate: terminal statuses cannot be re-transitioned. */
  setStatus(id: string, status: ApprovalStatus, reviewedBy?: string, reviewNotes?: string): { approval?: Approval; terminal?: boolean; missing?: boolean } {
    const existing = this.get(id);
    if (!existing) return { missing: true };
    if (TERMINAL.includes(existing.status)) return { terminal: true };
    const reviewedAt = status === "pending" ? null : new Date().toISOString();
    this.db.raw
      .prepare("UPDATE approval_queue SET status=?, reviewed_by=?, reviewed_at=?, review_notes=? WHERE id=?")
      .run(status, reviewedBy ?? null, reviewedAt, reviewNotes ?? null, id);
    return { approval: this.get(id) };
  }
}
