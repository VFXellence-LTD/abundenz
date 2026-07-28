import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { CampaignsService } from "../services/campaigns.service.js";
import { AgentRunsService } from "../services/agentRuns.service.js";
import { SessionService } from "../services/session.service.js";
import { createSessionsRouter } from "../routes/sessions.js";

class FakePtyService {
  killed: string[] = [];
  kill(id: string) { this.killed.push(id); }
  on() { return this; }
}

function makeApp(db: Db) {
  const runs = new AgentRunsService(db);
  const sessions = new SessionService(runs);
  const pty = new FakePtyService();
  sessions.setPtyService(pty as unknown as never);
  const app = express();
  app.use(express.json());
  app.use("/api/sessions", createSessionsRouter({ db, sessions }));
  return { app, sessions, runs, pty };
}

describe("POST/GET/STOP /api/sessions", () => {
  let db: Db;
  beforeEach(() => { db = createDb(":memory:"); });
  afterEach(() => { db.close(); });

  it("400 when neither campaignId nor taskId is provided", async () => {
    const { app } = makeApp(db);
    await request(app).post("/api/sessions/start").send({}).expect(400);
  });

  it("404 when the campaign does not exist", async () => {
    const { app } = makeApp(db);
    await request(app).post("/api/sessions/start").send({ campaignId: "nope" }).expect(404);
  });

  it("409 (gate) when the campaign is not approved", async () => {
    const camps = new CampaignsService(db);
    camps.create({ id: "camp-1", name: "C1", ecosystemId: "viral" });
    const { app } = makeApp(db);
    await request(app).post("/api/sessions/start").send({ campaignId: "camp-1" }).expect(409);
  });

  it("201 + agent_runs row + viral command when the campaign is approved", async () => {
    const camps = new CampaignsService(db);
    camps.create({ id: "camp-2", name: "C2", ecosystemId: "viral" });
    camps.approve("camp-2", "Boss");
    const { app, runs } = makeApp(db);
    const res = await request(app).post("/api/sessions/start").send({ campaignId: "camp-2" }).expect(201);
    expect(res.body.status).toBe("running");
    expect(res.body.command).toBe("/viral-generate camp-2");
    expect(res.body.campaignId).toBe("camp-2");
    expect(res.body.cwd).toBe("D:\\VFXellence-LTD\\polymath\\packages\\agents");
    const run = runs.get(res.body.id);
    expect(run!.status).toBe("running");
    expect(run!.campaignId).toBe("camp-2");
  });

  it("GET lists sessions; STOP marks the run done", async () => {
    const camps = new CampaignsService(db);
    camps.create({ id: "camp-3", name: "C3", ecosystemId: "viral" });
    camps.approve("camp-3", "Boss");
    const { app, runs } = makeApp(db);
    const start = await request(app).post("/api/sessions/start").send({ campaignId: "camp-3" }).expect(201);
    const list = await request(app).get("/api/sessions").expect(200);
    expect(list.body.map((s: { id: string }) => s.id)).toContain(start.body.id);
    await request(app).post(`/api/sessions/${start.body.id}/stop`).expect(200);
    expect(runs.get(start.body.id)!.status).toBe("done");
  });

  // Regression: a server restart (or `tsx watch` reload) wipes the in-memory
  // session Map + PtyService, but leaves the durable agent_runs row — often at
  // `waiting`. The old stop route 404'd on the Map miss, so the UI Stop button
  // silently failed and the row stayed `waiting` forever. Stop must be
  // DB-authoritative: transition the orphaned run to `done` and request PTY kill.
  it("STOP transitions an orphaned waiting run (no live session) to done", async () => {
    const camps = new CampaignsService(db);
    camps.create({ id: "camp-4", name: "C4", ecosystemId: "viral" });
    camps.approve("camp-4", "Boss");
    const { app, runs, sessions, pty } = makeApp(db);

    // Simulate a run left behind by a previous process: DB row exists at
    // `waiting`, but nothing is registered in the current SessionService Map.
    const orphanId = "orphan-run-1";
    runs.create({ id: orphanId, campaignId: "camp-4", command: "/viral-generate camp-4" });
    runs.setStatus(orphanId, "waiting");
    expect(sessions.getSession(orphanId)).toBeUndefined(); // not in the live Map

    const res = await request(app).post(`/api/sessions/${orphanId}/stop`).expect(200);
    expect(res.body.status).toBe("done");
    expect(runs.get(orphanId)!.status).toBe("done");
    expect(runs.get(orphanId)!.completedAt).toBeTruthy();
    expect(pty.killed).toContain(orphanId); // best-effort PTY termination requested
  });

  it("STOP still 404s when the id exists in neither the Map nor agent_runs", async () => {
    const { app } = makeApp(db);
    await request(app).post("/api/sessions/does-not-exist/stop").expect(404);
  });
});
