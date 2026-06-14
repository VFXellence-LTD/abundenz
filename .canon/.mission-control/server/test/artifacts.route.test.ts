import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createDb, type Db } from "../db.js";
import { ApprovalsService } from "../services/approvals.service.js";
import { createArtifactsRouter } from "../routes/artifacts.js";

let db: Db;
let tmpArtifactsRoot: string;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  tmpArtifactsRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mc-artifacts-"));
  app = express();
  app.use(express.json());
  app.use("/api/artifacts", createArtifactsRouter(db, tmpArtifactsRoot));
});

afterEach(() => {
  db.close();
  fs.rmSync(tmpArtifactsRoot, { recursive: true, force: true });
});

describe("GET /api/artifacts/:id", () => {
  it("(a) returns 200 with video/mp4 content-type and the file bytes for a valid approval", async () => {
    const clipPath = path.join(tmpArtifactsRoot, "clip.mp4");
    fs.writeFileSync(clipPath, Buffer.from("stub-video-bytes"));

    const svc = new ApprovalsService(db);
    const approval = svc.create({
      ecosystemId: "viral",
      contentType: "video",
      previewUrl: clipPath,
    });

    const res = await request(app).get(`/api/artifacts/${approval.id}`);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/video\/mp4/);
    expect(res.body).toBeTruthy();
  });

  it("(b) returns 400 for path traversal attempt", async () => {
    const svc = new ApprovalsService(db);
    const approval = svc.create({
      ecosystemId: "viral",
      contentType: "video",
      previewUrl: "../../etc/passwd",
    });

    const res = await request(app).get(`/api/artifacts/${approval.id}`);
    expect(res.status).toBe(400);
  });

  it("(c) returns 404 for unknown id", async () => {
    const res = await request(app).get("/api/artifacts/unknown-id");
    expect(res.status).toBe(404);
  });

  it("(d) returns 404 when file is missing inside the root", async () => {
    const missingPath = path.join(tmpArtifactsRoot, "missing.mp4");

    const svc = new ApprovalsService(db);
    const approval = svc.create({
      ecosystemId: "viral",
      contentType: "video",
      previewUrl: missingPath,
    });

    const res = await request(app).get(`/api/artifacts/${approval.id}`);
    expect(res.status).toBe(404);
  });
});
