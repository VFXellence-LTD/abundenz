import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createDb, type Db } from "../db.js";
import { createApp } from "../index.js";

let db: Db;
let tmpVault: string;
beforeEach(() => {
  db = createDb(":memory:");
  tmpVault = fs.mkdtempSync(path.join(os.tmpdir(), "mc-vault-"));
});
afterEach(() => {
  db.close();
  fs.rmSync(tmpVault, { recursive: true, force: true });
});

describe("createApp wiring", () => {
  it("GET /api/health -> ok", async () => {
    const app = createApp({ db, vaultLaunchesDir: tmpVault });
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("mounts all routers", async () => {
    const app = createApp({ db, vaultLaunchesDir: tmpVault });
    for (const p of ["/api/transactions", "/api/tools", "/api/setup", "/api/launch", "/api/tasks", "/api/campaigns", "/api/approvals", "/api/agent-runs"]) {
      const res = await request(app).get(p);
      expect(res.status).toBeLessThan(500);
    }
  });

  it("POST /api/vault/launches/:filename writes the file", async () => {
    const app = createApp({ db, vaultLaunchesDir: tmpVault });
    const res = await request(app)
      .post("/api/vault/launches/zrodinger.md")
      .set("Content-Type", "text/plain")
      .send("# Launch\n");
    expect(res.status).toBe(200);
    expect(fs.readFileSync(path.join(tmpVault, "zrodinger.md"), "utf-8")).toBe("# Launch\n");
  });

  it("rejects path traversal in vault filename -> 400", async () => {
    const app = createApp({ db, vaultLaunchesDir: tmpVault });
    const res = await request(app).post("/api/vault/launches/..%2Fevil.md").send("x");
    expect(res.status).toBe(400);
  });
});
