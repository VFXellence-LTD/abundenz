import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createTransactionsRouter } from "../routes/transactions.js";

let db: Db;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/transactions", createTransactionsRouter(db));
});
afterEach(() => db.close());

const NEW = {
  date: "2026-06-13",
  amount: 250.5,
  ecosystemId: "viral",
  stream: "rpm",
  description: "YouTube RPM",
  type: "income",
};

describe("transactions API", () => {
  it("GET returns [] initially", async () => {
    const res = await request(app).get("/api/transactions");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST creates and returns the row with a generated id (camelCase)", async () => {
    const res = await request(app).post("/api/transactions").send(NEW);
    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^txn_/);
    expect(res.body.ecosystemId).toBe("viral");
    expect(res.body.amount).toBe(250.5);
    expect(res.body).not.toHaveProperty("ecosystem_id");
  });

  it("POST then GET round-trips (newest first)", async () => {
    await request(app).post("/api/transactions").send(NEW);
    await request(app).post("/api/transactions").send({ ...NEW, description: "second" });
    const res = await request(app).get("/api/transactions");
    expect(res.body).toHaveLength(2);
    expect(res.body[0].description).toBe("second"); // newest first
  });

  it("PUT updates a partial field", async () => {
    const created = await request(app).post("/api/transactions").send(NEW);
    const id = created.body.id;
    const res = await request(app).put(`/api/transactions/${id}`).send({ amount: 999 });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(999);
    expect(res.body.description).toBe("YouTube RPM");
  });

  it("DELETE removes a row", async () => {
    const created = await request(app).post("/api/transactions").send(NEW);
    const del = await request(app).delete(`/api/transactions/${created.body.id}`);
    expect(del.status).toBe(200);
    const res = await request(app).get("/api/transactions");
    expect(res.body).toEqual([]);
  });

  it("POST validates required fields -> 400", async () => {
    const res = await request(app).post("/api/transactions").send({ amount: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("PUT on missing id -> 404", async () => {
    const res = await request(app).put("/api/transactions/nope").send({ amount: 1 });
    expect(res.status).toBe(404);
  });

  it("POST /import bulk-inserts", async () => {
    const res = await request(app).post("/api/transactions/import").send([NEW, { ...NEW, description: "b" }]);
    expect(res.status).toBe(201);
    expect(res.body).toHaveLength(2);
  });
});
