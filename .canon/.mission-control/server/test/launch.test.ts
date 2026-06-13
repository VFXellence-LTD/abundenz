import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createLaunchRouter } from "../routes/launch.js";

let db: Db;
let app: express.Express;
beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/launch", createLaunchRouter(db));
});
afterEach(() => db.close());

describe("launch progress API", () => {
  it("GET returns empty progress + data blobs", async () => {
    const res = await request(app).get("/api/launch");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ progress: {}, data: {} });
  });

  it("POST /toggle flips a (verticalKey, stepId) step", async () => {
    const res = await request(app)
      .post("/api/launch/toggle")
      .send({ verticalKey: "viral:zrodinger", stepId: "s1" });
    expect(res.status).toBe(200);
    expect(res.body.progress["viral:zrodinger"].s1).toBe(true);
  });

  it("PUT /field sets a value at (verticalKey, fieldKey)", async () => {
    const res = await request(app)
      .put("/api/launch/field")
      .send({ verticalKey: "viral:zrodinger", fieldKey: "s1.handle", value: "@surge" });
    expect(res.status).toBe(200);
    expect(res.body.data["viral:zrodinger"]["s1.handle"]).toBe("@surge");
  });

  it("GET reconstructs nested maps from both tables", async () => {
    await request(app).post("/api/launch/toggle").send({ verticalKey: "viral:zrodinger", stepId: "s1" });
    await request(app).put("/api/launch/field").send({ verticalKey: "viral:zrodinger", fieldKey: "s1.handle", value: "@surge" });
    const res = await request(app).get("/api/launch");
    expect(res.body.progress["viral:zrodinger"].s1).toBe(true);
    expect(res.body.data["viral:zrodinger"]["s1.handle"]).toBe("@surge");
  });

  it("POST /toggle missing keys -> 400", async () => {
    const res = await request(app).post("/api/launch/toggle").send({ stepId: "s1" });
    expect(res.status).toBe(400);
  });
});
