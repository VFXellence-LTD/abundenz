import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createPlatformAccountsRouter } from "../routes/platform-accounts.js";

let db: Db;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/platform-accounts", createPlatformAccountsRouter(db));
});
afterEach(() => db.close());

const NEW = { brandId: "zrodinger", platform: "youtube", handle: "@zrodinger" };

describe("platform-accounts API", () => {
  it("GET returns [] initially", async () => {
    const res = await request(app).get("/api/platform-accounts");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST creates with integer id and applies defaults", async () => {
    const res = await request(app).post("/api/platform-accounts").send(NEW);
    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe("number");
    expect(res.body.status).toBe("not-started");
    expect(res.body.active).toBe(false);
    expect(res.body.staggerHours).toBe(4);
    expect(res.body.rotationOrder).toBe(0);
    expect(res.body.handle).toBe("@zrodinger");
  });

  it("boolean active round-trips as boolean, not 1", async () => {
    const res = await request(app).post("/api/platform-accounts").send({ ...NEW, active: true });
    expect(res.status).toBe(201);
    expect(res.body.active).toBe(true);
  });

  it("?brandId=<id> filters to that brand", async () => {
    await request(app).post("/api/platform-accounts").send({ ...NEW, brandId: "zrodinger" });
    await request(app).post("/api/platform-accounts").send({ ...NEW, brandId: "zenith" });
    const res = await request(app).get("/api/platform-accounts?brandId=zrodinger");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].brandId).toBe("zrodinger");
  });

  it("?brandId=none filters to shared (NULL) accounts", async () => {
    await request(app).post("/api/platform-accounts").send({ ...NEW, brandId: "zrodinger" });
    await request(app).post("/api/platform-accounts").send({ platform: "tiktok" });
    const res = await request(app).get("/api/platform-accounts?brandId=none");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].brandId).toBeNull();
  });

  it("GET /:id returns the account; 404 when missing", async () => {
    const created = await request(app).post("/api/platform-accounts").send(NEW);
    const ok = await request(app).get(`/api/platform-accounts/${created.body.id}`);
    expect(ok.status).toBe(200);
    const miss = await request(app).get("/api/platform-accounts/99999");
    expect(miss.status).toBe(404);
  });

  it("PUT updates partial; preserves others; 404 on missing", async () => {
    const created = await request(app).post("/api/platform-accounts").send(NEW);
    const res = await request(app).put(`/api/platform-accounts/${created.body.id}`).send({ status: "active" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("active");
    expect(res.body.handle).toBe("@zrodinger");
    const miss = await request(app).put("/api/platform-accounts/99999").send({ status: "active" });
    expect(miss.status).toBe(404);
  });

  it("DELETE removes; 404 on missing", async () => {
    const created = await request(app).post("/api/platform-accounts").send(NEW);
    const del = await request(app).delete(`/api/platform-accounts/${created.body.id}`);
    expect(del.status).toBe(200);
    const res = await request(app).get("/api/platform-accounts");
    expect(res.body).toEqual([]);
    const miss = await request(app).delete("/api/platform-accounts/99999");
    expect(miss.status).toBe(404);
  });

  it("POST validates required platform -> 400", async () => {
    const res = await request(app).post("/api/platform-accounts").send({ handle: "@x" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });
});
