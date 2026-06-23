import { describe, it, expect, afterEach } from "vitest";
import { createDb, type Db } from "../db.js";

let db: Db | undefined;
afterEach(() => db?.close());

describe("db schema + migration", () => {
  it("enables WAL and foreign_keys", () => {
    db = createDb(":memory:");
    expect(String(db.raw.pragma("foreign_keys", { simple: true }))).toBe("1");
    // :memory: reports 'memory' for journal_mode; a file DB reports 'wal'
    const jm = String(db.raw.pragma("journal_mode", { simple: true }));
    expect(["wal", "memory"]).toContain(jm);
  });

  it("creates all 12 core tables", () => {
    db = createDb(":memory:");
    const names = db.raw
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all()
      .map((r: any) => r.name);
    for (const t of [
      "tasks", "campaigns", "approval_queue", "agent_runs",
      "transactions", "tools", "setup_progress",
      "launch_state", "launch_data", "brands", "platform_accounts",
      "publish_log",
    ]) {
      expect(names).toContain(t);
    }
  });

  it("round-trips a task row with FK + JSON columns", () => {
    db = createDb(":memory:");
    db.raw
      .prepare(
        `INSERT INTO tasks (id, title, type, ecosystem_id, source, status, priority, linked_ids, checklist, autonomy_stage)
         VALUES (@id, @title, @type, @ecosystem_id, @source, @status, @priority, @linked_ids, @checklist, @autonomy_stage)`,
      )
      .run({
        id: "VIRAL-001",
        title: "First clip",
        type: "content-piece",
        ecosystem_id: "viral",
        source: "agent",
        status: "todo",
        priority: "high",
        linked_ids: JSON.stringify(["VIRAL-000"]),
        checklist: JSON.stringify([{ label: "draft", done: false }]),
        autonomy_stage: 1,
      });
    const row: any = db.raw.prepare("SELECT * FROM tasks WHERE id=?").get("VIRAL-001");
    expect(row.ecosystem_id).toBe("viral");
    expect(JSON.parse(row.linked_ids)).toEqual(["VIRAL-000"]);
    expect(row.autonomy_stage).toBe(1);
  });

  it("enforces foreign_keys on approval_queue.task_id", () => {
    db = createDb(":memory:");
    expect(() =>
      db!.raw
        .prepare(
          `INSERT INTO approval_queue (id, task_id, ecosystem_id, status, created_at)
           VALUES ('AQ-1', 'NOPE-999', 'viral', 'pending', '2026-06-13T00:00:00Z')`,
        )
        .run(),
    ).toThrow(/FOREIGN KEY/i);
  });

  it("migrate() is idempotent (safe to call twice)", () => {
    db = createDb(":memory:");
    expect(() => db!.migrate()).not.toThrow();
  });

  it("seeds nothing on its own (seeding is Task 5's job)", () => {
    db = createDb(":memory:");
    const count: any = db.raw.prepare("SELECT COUNT(*) c FROM tools").get();
    expect(count.c).toBe(0);
  });

  it("platform_accounts has routing columns after migration", () => {
    db = createDb(":memory:");
    const cols = db.raw
      .prepare("PRAGMA table_info(platform_accounts)")
      .all()
      .map((r: any) => r.name);
    for (const c of ["active", "rotation_order", "last_posted_at", "stagger_hours", "credential_ref"]) {
      expect(cols).toContain(c);
    }
  });

  it("publish_log has account_id column after migration", () => {
    db = createDb(":memory:");
    const cols = db.raw
      .prepare("PRAGMA table_info(publish_log)")
      .all()
      .map((r: any) => r.name);
    expect(cols).toContain("account_id");
  });
});
