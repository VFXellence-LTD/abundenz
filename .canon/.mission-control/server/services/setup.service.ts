import type { Db } from "../db.js";

export type SetupProgress = Record<string, boolean>;

export type SetupData = Record<string, Record<string, string>>;

export class SetupService {
  constructor(private db: Db) {}

  getProgress(brandId = ""): SetupProgress {
    const rows = this.db.raw
      .prepare("SELECT step_id, done FROM setup_progress WHERE brand_id=?")
      .all(brandId) as Array<{
      step_id: string;
      done: number;
    }>;
    const out: SetupProgress = {};
    for (const r of rows) out[r.step_id] = r.done === 1;
    return out;
  }

  toggle(stepId: string, brandId = ""): SetupProgress {
    const current = this.db.raw
      .prepare("SELECT done FROM setup_progress WHERE brand_id=? AND step_id=?")
      .get(brandId, stepId) as { done: number } | undefined;
    const next = current?.done === 1 ? 0 : 1;
    this.db.raw
      .prepare(
        `INSERT INTO setup_progress (brand_id, step_id, done) VALUES (?, ?, ?)
         ON CONFLICT(brand_id, step_id) DO UPDATE SET done=excluded.done`,
      )
      .run(brandId, stepId, next);
    return this.getProgress(brandId);
  }

  getData(ecosystemId: string, brandId = ""): SetupData {
    const rows = this.db.raw
      .prepare("SELECT step_id, field_key, value FROM setup_data WHERE brand_id=? AND ecosystem_id=?")
      .all(brandId, ecosystemId) as Array<{ step_id: string; field_key: string; value: string }>;
    const out: SetupData = {};
    for (const r of rows) {
      (out[r.step_id] ??= {})[r.field_key] = r.value;
    }
    return out;
  }

  setField(ecosystemId: string, stepId: string, fieldKey: string, value: string, brandId = ""): void {
    this.db.raw
      .prepare(
        `INSERT INTO setup_data (brand_id, ecosystem_id, step_id, field_key, value) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(brand_id, ecosystem_id, step_id, field_key) DO UPDATE SET value=excluded.value`,
      )
      .run(brandId, ecosystemId, stepId, fieldKey, value);
  }
}
