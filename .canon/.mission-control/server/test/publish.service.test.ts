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

describe("PublishService routing integration", () => {
  function seedBrandAndApproval(ecosystemId = "viral") {
    db.raw
      .prepare(`INSERT OR IGNORE INTO brands (id, name, ecosystem_id, email) VALUES (?, ?, ?, '')`)
      .run(`brand_${ecosystemId}`, ecosystemId, ecosystemId);
    db.raw
      .prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES (?, 'x', 'clip', ?)`)
      .run("t2", ecosystemId);
    db.raw
      .prepare(
        `INSERT INTO approval_queue
           (id, task_id, ecosystem_id, content_type, status, content_json, created_at)
         VALUES ('aq2', 't2', ?, 'video', 'approved', '{"caption":"test","hashtags":["#x"],"videoPath":"/a/aq2.mp4"}', '2026-01-01')`,
      )
      .run(ecosystemId);
  }

  function seedAccount(id: number, ecosystemId: string, platform: string, credentialRef: string | null = null) {
    const brandId = `brand_${ecosystemId}`;
    db.raw
      .prepare(
        `INSERT INTO platform_accounts
           (id, brand_id, platform, handle, active, rotation_order, last_posted_at, stagger_hours, credential_ref)
         VALUES (?, ?, ?, ?, 1, 0, NULL, 4.0, ?)`,
      )
      .run(id, brandId, platform, `@h_${id}`, credentialRef);
  }

  it("writes ONE publish_log row for two same-platform accounts (no-identical cap)", async () => {
    seedBrandAndApproval();
    seedAccount(10, "viral", "tiktok", null); // dry-run: no credential
    seedAccount(11, "viral", "tiktok", null);

    const r = await svc.publish("aq2", "boss");
    expect(r).toHaveProperty("results");

    const logs = db.raw
      .prepare("SELECT account_id, platform FROM publish_log WHERE approval_id='aq2'")
      .all() as any[];
    // No-identical-cross-account cap (maxAccountsPerPlatform=1): only the LRU winner
    // is selected. Both accounts have last_posted_at NULL and rotation_order 0, so
    // SQLite returns the first-inserted row (id=10). id=11 is skipped by the cap.
    expect(logs).toHaveLength(1);
    expect(logs[0].account_id).toBe(10);
  });

  it("dry-run still works when no active accounts (falls back to legacy DEFAULT_TARGETS behaviour)", async () => {
    // No active accounts seeded — publish must not throw and must return results
    seedBrandAndApproval();
    const r = await svc.publish("aq2", "boss");
    expect(r).toHaveProperty("results");
    const outcome = r as { results: Array<{ dryRun: boolean }> };
    expect(outcome.results[0].dryRun).toBe(true);
  });

  it("publish_log rows carry correct account_id when credential resolves (dry-run)", async () => {
    seedBrandAndApproval();
    seedAccount(20, "viral", "instagram", null); // credential_ref null => dry-run
    const r = await svc.publish("aq2", "boss");
    expect(r).toHaveProperty("results");
    const log = db.raw
      .prepare("SELECT account_id FROM publish_log WHERE approval_id='aq2' AND platform='instagram'")
      .get() as any;
    expect(log).toBeTruthy();
    expect(log.account_id).toBe(20);
  });
});
