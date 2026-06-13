import type { Db } from "../db.js";

export type ToolStatus = "active" | "candidate" | "rejected";
export interface Tool {
  id: string;
  name: string;
  costPerMonth: number;
  ecosystems: string[];
  status: ToolStatus;
  url?: string;
  notes?: string;
}
export const TOOL_STATUSES: ToolStatus[] = ["active", "candidate", "rejected"];

interface Row {
  id: string;
  name: string;
  cost_per_month: number;
  ecosystems: string;
  status: string;
  url: string | null;
  notes: string | null;
}

function rowToTool(r: Row): Tool {
  return {
    id: r.id,
    name: r.name,
    costPerMonth: r.cost_per_month,
    ecosystems: JSON.parse(r.ecosystems) as string[],
    status: r.status as ToolStatus,
    url: r.url ?? undefined,
    notes: r.notes ?? undefined,
  };
}

export class ToolsService {
  constructor(private db: Db) {}

  list(): Tool[] {
    return (this.db.raw.prepare("SELECT * FROM tools ORDER BY name").all() as Row[]).map(rowToTool);
  }

  get(id: string): Tool | undefined {
    const r = this.db.raw.prepare("SELECT * FROM tools WHERE id=?").get(id) as Row | undefined;
    return r ? rowToTool(r) : undefined;
  }

  updateStatus(id: string, status: ToolStatus): Tool | undefined {
    const info = this.db.raw.prepare("UPDATE tools SET status=? WHERE id=?").run(status, id);
    if (info.changes === 0) return undefined;
    return this.get(id);
  }
}
