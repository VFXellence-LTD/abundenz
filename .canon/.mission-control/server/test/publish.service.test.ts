import { describe, it, expect, beforeEach } from "vitest";
import { createDb, type Db } from "../db.js";
import { PublishService } from "../services/publish.service.js";

let db: Db;
let svc: PublishService;

beforeEach(() => {
  db = createDb(":memory:");
  svc = new PublishService(db, {}); // empty env -> dry-run
});

function seedApproval(status: string, contentType: string, taskId = "t1") {
  db.raw
    .prepare(
      `INSERT INTO tasks (id, title, type, ecosystem_id) VALUES (?, 'x', 'clip', 'viral')`,
    )
    .run(taskId);
  db.raw
    .prepare(
      `INSERT INTO approval_queue (id, task_id, ecosystem_id, content_type, status, created_at)
       VALUES ('aq1', ?, 'viral', ?, ?, '2026-01-01')`,
    )
    .run(taskId, contentType, status);
}

describe("PublishService gate", () => {
  it("409s when approval is not content_type=video", async () => {
    seedApproval("approved", "clip");
    const r = await svc.publish("aq1", "boss");
    expect(r).toHaveProperty("conflict", true);
  });

  it("409s when video approval is not approved", async () => {
    seedApproval("pending", "video");
    const r = await svc.publish("aq1", "boss");
    expect(r).toHaveProperty("conflict", true);
  });

  it("404s when approval missing", async () => {
    const r = await svc.publish("nope", "boss");
    expect(r).toHaveProperty("missing", true);
  });

  it("dry-run publishes approved video: writes publish_log row + sets task published", async () => {
    seedApproval("approved", "video");
    const r = await svc.publish("aq1", "boss");
    expect(r).toHaveProperty("results");
    const outcome = r as { results: Array<{ dryRun: boolean }> };
    expect(outcome.results[0].dryRun).toBe(true);

    const log = db.raw
      .prepare("SELECT * FROM publish_log WHERE approval_id='aq1'")
      .get() as any;
    expect(log).toBeTruthy();
    expect(log.dry_run).toBe(1);
    expect(log.published_by).toBe("boss");

    const task = db.raw
      .prepare("SELECT status FROM tasks WHERE id='t1'")
      .get() as any;
    expect(task.status).toBe("published");
  });
});
