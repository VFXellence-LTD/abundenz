import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createToolsRouter } from "../routes/tools.js";
import { seedTools } from "../seed.js";

let db: Db;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/tools", createToolsRouter(db));
});
afterEach(() => db.close());

describe("tools API + seed", () => {
  it("seeds INITIAL_TOOLS only when the table is empty", () => {
    seedTools(db);
    const first = (db.raw.prepare("SELECT COUNT(*) c FROM tools").get() as any).c;
    expect(first).toBeGreaterThan(10);
    seedTools(db); // second call must not duplicate
    const second = (db.raw.prepare("SELECT COUNT(*) c FROM tools").get() as any).c;
    expect(second).toBe(first);
  });

  it("GET returns seeded tools with ecosystems as a JSON array", async () => {
    seedTools(db);
    const res = await request(app).get("/api/tools");
    expect(res.status).toBe(200);
    const beehiiv = res.body.find((t: any) => t.id === "beehiiv");
    expect(beehiiv.costPerMonth).toBe(0);
    expect(Array.isArray(beehiiv.ecosystems)).toBe(true);
    expect(beehiiv.ecosystems).toContain("content");
    expect(beehiiv).not.toHaveProperty("cost_per_month");
  });

  it("PUT /:id/status updates status", async () => {
    seedTools(db);
    const res = await request(app).put("/api/tools/riverside/status").send({ status: "active" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("active");
  });

  it("PUT /:id/status with bad status -> 400", async () => {
    seedTools(db);
    const res = await request(app).put("/api/tools/riverside/status").send({ status: "bogus" });
    expect(res.status).toBe(400);
  });

  it("PUT status on missing tool -> 404", async () => {
    seedTools(db);
    const res = await request(app).put("/api/tools/nope/status").send({ status: "active" });
    expect(res.status).toBe(404);
  });
});
