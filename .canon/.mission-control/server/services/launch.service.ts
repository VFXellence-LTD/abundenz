import type { Db } from "../db.js";

export interface LaunchState {
  [verticalKey: string]: { [stepId: string]: boolean };
}
export interface LaunchData {
  [verticalKey: string]: { [fieldKey: string]: string };
}

export class LaunchService {
  constructor(private db: Db) {}

  getState(): LaunchState {
    const rows = this.db.raw
      .prepare("SELECT vertical_key, step_id, done FROM launch_state")
      .all() as Array<{ vertical_key: string; step_id: string; done: number }>;
    const out: LaunchState = {};
    for (const r of rows) {
      (out[r.vertical_key] ??= {})[r.step_id] = r.done === 1;
    }
    return out;
  }

  getData(): LaunchData {
    const rows = this.db.raw
      .prepare("SELECT vertical_key, field_key, value FROM launch_data")
      .all() as Array<{ vertical_key: string; field_key: string; value: string }>;
    const out: LaunchData = {};
    for (const r of rows) {
      (out[r.vertical_key] ??= {})[r.field_key] = r.value;
    }
    return out;
  }

  toggleStep(verticalKey: string, stepId: string): LaunchState {
    const cur = this.db.raw
      .prepare("SELECT done FROM launch_state WHERE vertical_key=? AND step_id=?")
      .get(verticalKey, stepId) as { done: number } | undefined;
    const next = cur?.done === 1 ? 0 : 1;
    this.db.raw
      .prepare(
        `INSERT INTO launch_state (vertical_key, step_id, done) VALUES (?,?,?)
         ON CONFLICT(vertical_key, step_id) DO UPDATE SET done=excluded.done`,
      )
      .run(verticalKey, stepId, next);
    return this.getState();
  }

  setField(verticalKey: string, fieldKey: string, value: string): LaunchData {
    this.db.raw
      .prepare(
        `INSERT INTO launch_data (vertical_key, field_key, value) VALUES (?,?,?)
         ON CONFLICT(vertical_key, field_key) DO UPDATE SET value=excluded.value`,
      )
      .run(verticalKey, fieldKey, value);
    return this.getData();
  }
}
