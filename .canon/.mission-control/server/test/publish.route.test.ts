import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../index.js";
import { createDb } from "../db.js";
import { SessionService } from "../services/session.service.js";
import { AgentRunsService } from "../services/agentRuns.service.js";
import fs from "node:fs";
import path from "node:path";

function makeApp() {
  const db = createDb(":memory:");
  const agentRunsSvc = new AgentRunsService(db);
  const sessions = new SessionService(agentRunsSvc);
  return { app: createApp({ db, vaultLaunchesDir: "/tmp", sessions }), db };
}

function seedApprovedVideo(db: ReturnType<typeof createDb>) {
  db.raw
    .prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES ('t1','x','clip','viral')`)
    .run();
  db.raw
    .prepare(
      `INSERT INTO approval_queue (id, task_id, ecosystem_id, content_type, status, created_at)
       VALUES ('aq1', 't1', 'viral', 'video', 'approved', '2026-01-01')`,
    )
    .run();
}

describe("POST /api/publish", () => {
  it("400 when approvalId missing", async () => {
    const { app } = makeApp();
    await request(app).post("/api/publish").send({}).expect(400);
  });

  it("404 when approval not found", async () => {
    const { app } = makeApp();
    await request(app).post("/api/publish").send({ approvalId: "nope" }).expect(404);
  });

  it("409 when approval is not video", async () => {
    const { app, db } = makeApp();
    db.raw
      .prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES ('t2','x','clip','viral')`)
      .run();
    db.raw
      .prepare(
        `INSERT INTO approval_queue (id, task_id, ecosystem_id, content_type, status, created_at)
         VALUES ('aq2','t2','viral','clip','approved','2026-01-01')`,
      )
      .run();
    await request(app).post("/api/publish").send({ approvalId: "aq2" }).expect(409);
  });

  it("409 when video is not approved", async () => {
    const { app, db } = makeApp();
    db.raw
      .prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES ('t3','x','clip','viral')`)
      .run();
    db.raw
      .prepare(
        `INSERT INTO approval_queue (id, task_id, ecosystem_id, content_type, status, created_at)
         VALUES ('aq3','t3','viral','video','pending','2026-01-01')`,
      )
      .run();
    await request(app).post("/api/publish").send({ approvalId: "aq3" }).expect(409);
  });

  it("200 + dryRun result for approved video (no creds configured)", async () => {
    const { app, db } = makeApp();
    seedApprovedVideo(db);
    const res = await request(app)
      .post("/api/publish")
      .send({ approvalId: "aq1" })
      .expect(200);
    expect(res.body.results).toBeInstanceOf(Array);
    expect(res.body.results[0].dryRun).toBe(true);
  });
});

// GREP GUARD: no autonomous module imports publish.service
describe("Doctrine guard — no autonomous publish import", () => {
  it("agent-runs service does not import publish.service", () => {
    const agentRunsPath = path.resolve("services/agentRuns.service.ts");
    const content = fs.readFileSync(agentRunsPath, "utf-8");
    expect(content).not.toContain("publish.service");
    expect(content).not.toContain("@polymath/publish");
  });

  it("sessions service does not import publish.service", () => {
    const sessionPath = path.resolve("services/session.service.ts");
    const content = fs.readFileSync(sessionPath, "utf-8");
    expect(content).not.toContain("publish.service");
    expect(content).not.toContain("@polymath/publish");
  });

  it("ws directory does not import publish.service", () => {
    const wsDir = path.resolve("ws");
    if (!fs.existsSync(wsDir)) return;
    const files = fs.readdirSync(wsDir).filter((f) => f.endsWith(".ts"));
    for (const f of files) {
      const content = fs.readFileSync(path.join(wsDir, f), "utf-8");
      expect(content, `${f} must not import publish.service`).not.toContain("publish.service");
      expect(content, `${f} must not import @polymath/publish`).not.toContain("@polymath/publish");
    }
  });
});
