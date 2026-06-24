import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock node:child_process so execSync is never called in tests.
vi.mock("node:child_process", () => ({
  execSync: vi.fn(() => {
    throw new Error("execSync must not be called in tests");
  }),
}));

import { execSync } from "node:child_process";

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env["MC_FEEDBACK_ENABLED"];
});

afterEach(() => {
  delete process.env["MC_FEEDBACK_ENABLED"];
});

describe("FeedbackService — dry-run (MC_FEEDBACK_ENABLED unset)", () => {
  it("returns one dryRun result per item and never shells gh", async () => {
    const { FeedbackService } = await import("../services/feedback.service.js");
    const svc = new FeedbackService({});
    const out = await svc.createBatch([
      { text: "Sidebar should remember collapsed state" },
      { text: "Add dark/light toggle", area: "dashboard-client", severity: "low" },
    ]);
    expect(out.results).toHaveLength(2);
    expect(out.results.every((r) => r.dryRun === true)).toBe(true);
    expect(out.results[0].url).toBe("https://github.com/VFXellence-LTD/abundenz/issues/DRY-RUN");
    expect(execSync).not.toHaveBeenCalled();
  });

  it("derives a concise title from the first line, truncated at 80 chars", async () => {
    const { FeedbackService } = await import("../services/feedback.service.js");
    const svc = new FeedbackService({});
    const short = svc.titleFor("Fix the thing\nmore detail here");
    expect(short).toBe("Fix the thing");
    const long = svc.titleFor("x".repeat(120));
    expect(long.length).toBe(80);
    expect(long.endsWith("...")).toBe(true);
  });
});

import request from "supertest";
import { createApp } from "../index.js";
import { createDb, type Db } from "../db.js";
import { SessionService } from "../services/session.service.js";
import { AgentRunsService } from "../services/agentRuns.service.js";

let db: Db;
function makeApp() {
  db = createDb(":memory:");
  const sessions = new SessionService(new AgentRunsService(db));
  return createApp({ db, vaultLaunchesDir: "/tmp", sessions });
}
afterEach(() => { db?.close(); });

describe("POST /api/feedback — validation", () => {
  it("400 when items is missing", async () => {
    await request(makeApp()).post("/api/feedback").send({}).expect(400);
  });
  it("400 when items is empty array", async () => {
    await request(makeApp()).post("/api/feedback").send({ items: [] }).expect(400);
  });
  it("400 when no item has non-empty text", async () => {
    await request(makeApp()).post("/api/feedback").send({ items: [{ text: "   " }] }).expect(400);
  });
});

describe("POST /api/feedback — dry-run", () => {
  it("returns 200 with one dryRun result per valid item", async () => {
    const res = await request(makeApp())
      .post("/api/feedback")
      .send({ items: [{ text: "Idea one" }, { text: "Idea two", area: "server" }, { text: "  " }] })
      .expect(200);
    expect(res.body.results).toHaveLength(2);
    expect(res.body.results[0].dryRun).toBe(true);
    expect(execSync).not.toHaveBeenCalled();
  });
});
