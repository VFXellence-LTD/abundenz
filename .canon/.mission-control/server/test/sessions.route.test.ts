import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { CampaignsService } from "../services/campaigns.service.js";
import { AgentRunsService } from "../services/agentRuns.service.js";
import { SessionService } from "../services/session.service.js";
import { createSessionsRouter } from "../routes/sessions.js";

class FakePtyService { kill() {} on() { return this; } }

function makeApp(db: Db) {
  const runs = new AgentRunsService(db);
  const sessions = new SessionService(runs);
  sessions.setPtyService(new FakePtyService() as unknown as never);
  const app = express();
  app.use(express.json());
  app.use("/api/sessions", createSessionsRouter({ db, sessions }));
  return { app, sessions, runs };
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
});
