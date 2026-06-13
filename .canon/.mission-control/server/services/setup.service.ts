import type { Db } from "../db.js";

export type SetupProgress = Record<string, boolean>;

export class SetupService {
  constructor(private db: Db) {}

  getProgress(): SetupProgress {
    const rows = this.db.raw.prepare("SELECT step_id, done FROM setup_progress").all() as Array<{
      step_id: string;
      done: number;
    }>;
    const out: SetupProgress = {};
    for (const r of rows) out[r.step_id] = r.done === 1;
    return out;
  }

  toggle(stepId: string): SetupProgress {
    const current = this.db.raw
      .prepare("SELECT done FROM setup_progress WHERE step_id=?")
      .get(stepId) as { done: number } | undefined;
    const next = current?.done === 1 ? 0 : 1;
    this.db.raw
      .prepare(
        `INSERT INTO setup_progress (step_id, done) VALUES (?, ?)
         ON CONFLICT(step_id) DO UPDATE SET done=excluded.done`,
      )
      .run(stepId, next);
    return this.getProgress();
  }
}
