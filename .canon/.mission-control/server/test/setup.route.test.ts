import { describe, it, expect, afterEach } from "vitest";
import { createDb, type Db } from "../db.js";

let db: Db;
afterEach(() => { db?.close(); });

describe("SetupService — field data", () => {
  it("setField inserts; getData returns nested {stepId:{fieldKey:value}}", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "abundenz.com");
    svc.setField("content", "email", "address", "hi@abundenz.com");
    expect(svc.getData("content")).toEqual({
      domain: { domain: "abundenz.com" },
      email: { address: "hi@abundenz.com" },
    });
  });

  it("setField overwrites an existing value", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "old.com");
    svc.setField("content", "domain", "domain", "new.com");
    expect(svc.getData("content").domain.domain).toBe("new.com");
  });

  it("getData scopes to the requested ecosystem", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "c.com");
    svc.setField("viral", "v1", "handle", "@x");
    expect(svc.getData("content")).toEqual({ domain: { domain: "c.com" } });
  });

  it("setField/getData isolate by brand; '' is the default/legacy scope", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "z-one.com", "brnA");
    svc.setField("content", "domain", "domain", "z-two.com", "brnB");
    svc.setField("content", "domain", "domain", "legacy.com"); // no brandId => ''
    expect(svc.getData("content", "brnA")).toEqual({ domain: { domain: "z-one.com" } });
    expect(svc.getData("content", "brnB")).toEqual({ domain: { domain: "z-two.com" } });
    expect(svc.getData("content")).toEqual({ domain: { domain: "legacy.com" } });
  });

  it("getProgress/toggle isolate by brand", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.toggle("s1", "brnA");
    expect(svc.getProgress("brnA")).toEqual({ s1: true });
    expect(svc.getProgress("brnB")).toEqual({});
    expect(svc.getProgress()).toEqual({}); // legacy scope untouched
  });
});

import request from "supertest";
import { createApp } from "../index.js";
import { SessionService } from "../services/session.service.js";
import { AgentRunsService } from "../services/agentRuns.service.js";

function makeApp() {
  db = createDb(":memory:");
  const sessions = new SessionService(new AgentRunsService(db));
  return createApp({ db, vaultLaunchesDir: "/tmp", sessions });
}

describe("/api/setup/data routes", () => {
  it("PUT /setup/data 400 on missing fields", async () => {
    await request(makeApp()).put("/api/setup/data").send({ ecosystemId: "content" }).expect(400);
  });

  it("PUT then GET round-trips a field value", async () => {
    const app = makeApp();
    await request(app).put("/api/setup/data")
      .send({ ecosystemId: "content", stepId: "domain", fieldKey: "domain", value: "abundenz.com" })
      .expect(200);
    const res = await request(app).get("/api/setup/data/content").expect(200);
    expect(res.body).toEqual({ domain: { domain: "abundenz.com" } });
  });

  it("PUT accepts an empty-string value", async () => {
    await request(makeApp()).put("/api/setup/data")
      .send({ ecosystemId: "content", stepId: "domain", fieldKey: "domain", value: "" })
      .expect(200);
  });
});
