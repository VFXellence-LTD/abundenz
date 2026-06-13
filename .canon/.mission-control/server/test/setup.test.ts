import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createSetupRouter } from "../routes/setup.js";

let db: Db;
let app: express.Express;
beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/setup", createSetupRouter(db));
});
afterEach(() => db.close());

describe("setup progress API", () => {
  it("GET returns an empty map initially", async () => {
    const res = await request(app).get("/api/setup");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
  });

  it("POST /toggle flips a step true then false", async () => {
    const on = await request(app).post("/api/setup/toggle").send({ stepId: "s1" });
    expect(on.status).toBe(200);
    expect(on.body).toEqual({ s1: true });
    const off = await request(app).post("/api/setup/toggle").send({ stepId: "s1" });
    expect(off.body).toEqual({ s1: false });
  });

  it("GET reflects persisted booleans", async () => {
    await request(app).post("/api/setup/toggle").send({ stepId: "s1" });
    await request(app).post("/api/setup/toggle").send({ stepId: "s2" });
    const res = await request(app).get("/api/setup");
    expect(res.body).toEqual({ s1: true, s2: true });
  });

  it("POST /toggle without stepId -> 400", async () => {
    const res = await request(app).post("/api/setup/toggle").send({});
    expect(res.status).toBe(400);
  });
});
