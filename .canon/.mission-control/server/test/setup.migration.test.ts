import { describe, it, expect, afterEach } from "vitest";
import Database from "better-sqlite3";
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import { createDb, type Db } from "../db.js";

let db: Db;
afterEach(() => db?.close());

function cols(raw: Database.Database, table: string): string[] {
  return (raw.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).map((r) => r.name);
}

describe("setup brand_id migration", () => {
  it("fresh DB has brand_id on setup_data and setup_progress", () => {
    db = createDb(":memory:");
    expect(cols(db.raw, "setup_data")).toContain("brand_id");
    expect(cols(db.raw, "setup_progress")).toContain("brand_id");
  });

  it("migrate() is idempotent (running twice keeps one brand_id column)", () => {
    db = createDb(":memory:");
    db.migrate();
    db.migrate();
    expect(cols(db.raw, "setup_data").filter((c) => c === "brand_id")).toHaveLength(1);
    expect(cols(db.raw, "setup_progress").filter((c) => c === "brand_id")).toHaveLength(1);
  });

  it("rebuilds a legacy (pre-brand_id) setup_data table, preserving rows as brand_id=''", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cmc-migration-"));
    const dbPath = path.join(dir, "legacy.sqlite");

    // Create an OLD-schema DB (no brand_id) with legacy rows, then close it.
    const raw = new Database(dbPath);
    raw.exec(`
      CREATE TABLE setup_data (ecosystem_id TEXT NOT NULL, step_id TEXT NOT NULL, field_key TEXT NOT NULL, value TEXT NOT NULL DEFAULT '', PRIMARY KEY (ecosystem_id, step_id, field_key));
      CREATE TABLE setup_progress (step_id TEXT PRIMARY KEY, done INTEGER NOT NULL DEFAULT 0);
      INSERT INTO setup_data VALUES ('content','domain','domain','old.com');
      INSERT INTO setup_progress VALUES ('s1', 1);
    `);
    raw.close();

    try {
      // Reopen via createDb — this runs migrate() and rebuilds the legacy tables.
      db = createDb(dbPath);

      expect(cols(db.raw, "setup_data")).toContain("brand_id");
      expect(cols(db.raw, "setup_progress")).toContain("brand_id");

      const dataRow = db.raw
        .prepare("SELECT brand_id, ecosystem_id, step_id, field_key, value FROM setup_data")
        .get() as { brand_id: string; ecosystem_id: string; step_id: string; field_key: string; value: string };
      expect(dataRow).toEqual({
        brand_id: "",
        ecosystem_id: "content",
        step_id: "domain",
        field_key: "domain",
        value: "old.com",
      });

      const progressRow = db.raw
        .prepare("SELECT brand_id, step_id, done FROM setup_progress")
        .get() as { brand_id: string; step_id: string; done: number };
      expect(progressRow).toEqual({ brand_id: "", step_id: "s1", done: 1 });

      db.close();
      db = undefined as unknown as Db;
    } finally {
      // Best-effort cleanup: Windows may briefly hold the WAL/SHM handles.
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        /* temp dir cleanup is not the assertion under test */
      }
    }
  });
});
