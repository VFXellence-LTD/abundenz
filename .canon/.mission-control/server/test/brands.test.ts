import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createBrandsRouter } from "../routes/brands.js";

let db: Db;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/brands", createBrandsRouter(db));
});
afterEach(() => db.close());

const NEW = { name: "Zrodinger", ecosystemId: "content", email: "hello@abundenz.com" };

describe("brands API", () => {
  it("GET returns [] initially", async () => {
    const res = await request(app).get("/api/brands");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST creates and returns camelCase row with generated brn_ id", async () => {
    const res = await request(app).post("/api/brands").send(NEW);
    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^brn_/);
    expect(res.body.ecosystemId).toBe("content");
    expect(res.body).not.toHaveProperty("ecosystem_id");
  });

  it("POST honors a supplied slug id", async () => {
    const res = await request(app).post("/api/brands").send({ ...NEW, id: "zrodinger" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe("zrodinger");
  });

  it("POST then GET round-trips (newest first)", async () => {
    await request(app).post("/api/brands").send(NEW);
    await request(app).post("/api/brands").send({ ...NEW, name: "Zenith" });
    const res = await request(app).get("/api/brands");
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe("Zenith");
  });

  it("GET /:id returns the brand; 404 when missing", async () => {
    const created = await request(app).post("/api/brands").send({ ...NEW, id: "zrodinger" });
    const ok = await request(app).get(`/api/brands/${created.body.id}`);
    expect(ok.status).toBe(200);
    expect(ok.body.name).toBe("Zrodinger");
    const miss = await request(app).get("/api/brands/nope");
    expect(miss.status).toBe(404);
  });

  it("PUT updates a partial field; preserves others; 404 on missing", async () => {
    const created = await request(app).post("/api/brands").send({ ...NEW, id: "zrodinger" });
    const res = await request(app).put(`/api/brands/${created.body.id}`).send({ email: "new@abundenz.com" });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("new@abundenz.com");
    expect(res.body.name).toBe("Zrodinger");
    const miss = await request(app).put("/api/brands/nope").send({ email: "x" });
    expect(miss.status).toBe(404);
  });

  it("DELETE removes; 404 on missing", async () => {
    const created = await request(app).post("/api/brands").send({ ...NEW, id: "zrodinger" });
    const del = await request(app).delete(`/api/brands/${created.body.id}`);
    expect(del.status).toBe(200);
    const res = await request(app).get("/api/brands");
    expect(res.body).toEqual([]);
    const miss = await request(app).delete("/api/brands/nope");
    expect(miss.status).toBe(404);
  });

  it("POST validates required fields -> 400", async () => {
    const res = await request(app).post("/api/brands").send({ email: "x" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });
});
