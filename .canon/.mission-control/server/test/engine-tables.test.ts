import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createTasksRouter } from "../routes/tasks.js";
import { createCampaignsRouter } from "../routes/campaigns.js";
import { createApprovalsRouter } from "../routes/approvals.js";
import { createAgentRunsRouter } from "../routes/agentRuns.js";

let db: Db;
let app: express.Express;
beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/tasks", createTasksRouter(db));
  app.use("/api/campaigns", createCampaignsRouter(db));
  app.use("/api/approvals", createApprovalsRouter(db));
  app.use("/api/agent-runs", createAgentRunsRouter(db));
});
afterEach(() => db.close());

const TASK = { id: "VIRAL-001", title: "First Zrodinger clip", type: "content-piece", ecosystemId: "viral", source: "agent", priority: "high" };

describe("tasks", () => {
  it("POST creates a task in backlog by default", async () => {
    const res = await request(app).post("/api/tasks").send(TASK);
    expect(res.status).toBe(201);
    expect(res.body.id).toBe("VIRAL-001");
    expect(res.body.status).toBe("backlog");
    expect(res.body.ecosystemId).toBe("viral");
  });

  it("GET scoped to viral excludes content tasks", async () => {
    await request(app).post("/api/tasks").send(TASK);
    await request(app).post("/api/tasks").send({ ...TASK, id: "CONTENT-1", ecosystemId: "content" });
    const res = await request(app).get("/api/tasks?ecosystem=viral");
    expect(res.body.map((t: any) => t.id)).toEqual(["VIRAL-001"]);
  });

  it("PATCH transitions status", async () => {
    await request(app).post("/api/tasks").send(TASK);
    const res = await request(app).patch("/api/tasks/VIRAL-001/status").send({ status: "in-progress" });
    expect(res.body.status).toBe("in-progress");
  });

  it("cannot mark done while a pending approval exists -> 409", async () => {
    await request(app).post("/api/tasks").send(TASK);
    await request(app).post("/api/approvals").send({ taskId: "VIRAL-001", ecosystemId: "viral", contentType: "clip" });
    const res = await request(app).patch("/api/tasks/VIRAL-001/status").send({ status: "done" });
    expect(res.status).toBe(409);
  });
});

describe("campaigns", () => {
  it("POST creates a planned campaign", async () => {
    const res = await request(app).post("/api/campaigns").send({ id: "CAMP-1", name: "Zrodinger launch", ecosystemId: "viral" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("planned");
  });

  it("cannot run without approval -> 409", async () => {
    await request(app).post("/api/campaigns").send({ id: "CAMP-1", name: "x", ecosystemId: "viral" });
    const res = await request(app).patch("/api/campaigns/CAMP-1/status").send({ status: "running" });
    expect(res.status).toBe(409);
  });

  it("can run after approval", async () => {
    await request(app).post("/api/campaigns").send({ id: "CAMP-1", name: "x", ecosystemId: "viral" });
    await request(app).post("/api/campaigns/CAMP-1/approve").send({ approvedBy: "Robin" });
    const res = await request(app).patch("/api/campaigns/CAMP-1/status").send({ status: "running" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("running");
  });
});

describe("approval_queue (the per-asset gate)", () => {
  beforeEach(async () => {
    await request(app).post("/api/tasks").send(TASK);
  });

  it("POST creates a pending approval", async () => {
    const res = await request(app).post("/api/approvals").send({ taskId: "VIRAL-001", ecosystemId: "viral", contentType: "clip", artifactPath: "/drafts/zrod-001.mp4" });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("pending");
  });

  it("GET ?status=pending lists the gate queue", async () => {
    await request(app).post("/api/approvals").send({ taskId: "VIRAL-001", ecosystemId: "viral", contentType: "clip" });
    const res = await request(app).get("/api/approvals?status=pending");
    expect(res.body).toHaveLength(1);
  });

  it("PATCH approve sets reviewer + timestamp", async () => {
    const created = await request(app).post("/api/approvals").send({ taskId: "VIRAL-001", ecosystemId: "viral", contentType: "clip" });
    const res = await request(app).patch(`/api/approvals/${created.body.id}/status`).send({ status: "approved", reviewedBy: "Robin" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("approved");
    expect(res.body.reviewedBy).toBe("Robin");
    expect(res.body.reviewedAt).toBeTruthy();
  });

  it("approved is terminal -> re-transition 409", async () => {
    const created = await request(app).post("/api/approvals").send({ taskId: "VIRAL-001", ecosystemId: "viral", contentType: "clip" });
    await request(app).patch(`/api/approvals/${created.body.id}/status`).send({ status: "approved", reviewedBy: "Robin" });
    const res = await request(app).patch(`/api/approvals/${created.body.id}/status`).send({ status: "rejected", reviewedBy: "Robin" });
    expect(res.status).toBe(409);
  });
});

describe("agent_runs", () => {
  it("POST creates a queued run; PATCH advances status", async () => {
    const created = await request(app).post("/api/agent-runs").send({ id: "RUN-1", taskId: null, agentName: "surge-writer", ecosystemId: "viral" });
    expect(created.status).toBe(201);
    expect(created.body.status).toBe("queued");
    const res = await request(app).patch("/api/agent-runs/RUN-1/status").send({ status: "running" });
    expect(res.body.status).toBe("running");
  });
});
