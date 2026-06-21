import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createPublishRouter } from "../routes/publish.js";

let db: Db;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  // Mount publish route with empty env (dry-run credentials)
  app.use("/api/publish", createPublishRouter(db, {}));
});
afterEach(() => db.close());

function seed() {
  // Brand
  db.raw
    .prepare(`INSERT INTO brands (id, name, ecosystem_id, email) VALUES ('brand_viral', 'Zrodinger', 'viral', '')`)
    .run();

  // Task + approval (approved video)
  db.raw
    .prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES ('t9', 'smoke', 'clip', 'viral')`)
    .run();
  db.raw
    .prepare(
      `INSERT INTO approval_queue
         (id, task_id, ecosystem_id, content_type, status, content_json, created_at)
       VALUES ('aq9', 't9', 'viral', 'video', 'approved',
               '{"caption":"smoke","hashtags":["#test"],"videoPath":"/a/aq9.mp4"}',
               '2026-06-21T00:00:00.000Z')`,
    )
    .run();

  // Two active platform accounts: TikTok and YouTube
  db.raw
    .prepare(
      `INSERT INTO platform_accounts
         (id, brand_id, platform, handle, active, rotation_order, last_posted_at, stagger_hours, credential_ref)
       VALUES (100, 'brand_viral', 'tiktok', '@zrodinger', 1, 1, NULL, 4.0, NULL)`,
    )
    .run();
  db.raw
    .prepare(
      `INSERT INTO platform_accounts
         (id, brand_id, platform, handle, active, rotation_order, last_posted_at, stagger_hours, credential_ref)
       VALUES (101, 'brand_viral', 'youtube', '@zrodinger', 1, 1, NULL, 4.0, NULL)`,
    )
    .run();
}

describe("POST /api/publish — routing integration", () => {
  it("returns 200 results and publish_log rows carry account_id for each active account", async () => {
    seed();
    const res = await request(app).post("/api/publish").send({ approvalId: "aq9", publishedBy: "boss" });
    expect(res.status).toBe(200);
    expect(res.body.results).toBeInstanceOf(Array);
    expect(res.body.results.length).toBeGreaterThanOrEqual(2); // tiktok + youtube

    const logs = db.raw
      .prepare("SELECT platform, account_id, dry_run FROM publish_log WHERE approval_id='aq9' ORDER BY platform")
      .all() as any[];

    expect(logs.length).toBeGreaterThanOrEqual(2);
    expect(logs.every((l: any) => l.account_id !== null)).toBe(true);
    expect(logs.every((l: any) => l.dry_run === 1)).toBe(true); // no credentials -> dry-run

    const platforms = logs.map((l: any) => l.platform).sort();
    expect(platforms).toContain("tiktok");
    expect(platforms).toContain("youtube");
  });

  it("account_id in publish_log matches the seeded platform_accounts.id", async () => {
    seed();
    await request(app).post("/api/publish").send({ approvalId: "aq9", publishedBy: "boss" });
    const tiktokLog = db.raw
      .prepare("SELECT account_id FROM publish_log WHERE approval_id='aq9' AND platform='tiktok'")
      .get() as any;
    expect(tiktokLog.account_id).toBe(100);

    const youtubeLog = db.raw
      .prepare("SELECT account_id FROM publish_log WHERE approval_id='aq9' AND platform='youtube'")
      .get() as any;
    expect(youtubeLog.account_id).toBe(101);
  });

  it("no active accounts -> falls back to dry-run legacy path, publish_log account_id is null", async () => {
    // Seed approval but NO active platform_accounts
    db.raw.prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES ('t10', 'legacy', 'clip', 'viral')`).run();
    db.raw
      .prepare(
        `INSERT INTO approval_queue
           (id, task_id, ecosystem_id, content_type, status, content_json, created_at)
         VALUES ('aq10', 't10', 'viral', 'video', 'approved',
                 '{"caption":"legacy","hashtags":[],"videoPath":"/a/aq10.mp4"}',
                 '2026-06-21T00:00:00.000Z')`,
      )
      .run();

    const res = await request(app).post("/api/publish").send({ approvalId: "aq10", publishedBy: "boss" });
    expect(res.status).toBe(200);
    const logs = db.raw
      .prepare("SELECT account_id FROM publish_log WHERE approval_id='aq10'")
      .all() as any[];
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.every((l: any) => l.account_id === null)).toBe(true);
  });

  it("existing gate tests: 404 for missing approval, 409 for non-video", async () => {
    const missing = await request(app).post("/api/publish").send({ approvalId: "nope", publishedBy: "boss" });
    expect(missing.status).toBe(404);

    db.raw.prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES ('t11', 'x', 'clip', 'viral')`).run();
    db.raw
      .prepare(
        `INSERT INTO approval_queue (id, task_id, ecosystem_id, content_type, status, created_at)
         VALUES ('aq11', 't11', 'viral', 'clip', 'approved', '2026-06-21')`,
      )
      .run();
    const conflict = await request(app).post("/api/publish").send({ approvalId: "aq11", publishedBy: "boss" });
    expect(conflict.status).toBe(409);
  });
});
