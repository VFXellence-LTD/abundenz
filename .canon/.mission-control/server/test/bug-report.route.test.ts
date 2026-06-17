import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { createApp } from "../index.js";
import { createDb, type Db } from "../db.js";
import { SessionService } from "../services/session.service.js";
import { AgentRunsService } from "../services/agentRuns.service.js";

// Mock node:child_process so execSync is never called in tests.
vi.mock("node:child_process", () => ({
  execSync: vi.fn(() => {
    throw new Error("execSync must not be called in tests");
  }),
}));

import { execSync } from "node:child_process";

let db: Db;

function makeApp() {
  db = createDb(":memory:");
  const sessions = new SessionService(new AgentRunsService(db));
  return createApp({ db, vaultLaunchesDir: "/tmp", sessions });
}

beforeEach(() => {
  vi.clearAllMocks();
  // Ensure MC_BUG_REPORT_ENABLED is off (dry-run) by default for every test.
  delete process.env["MC_BUG_REPORT_ENABLED"];
});

afterEach(() => {
  db?.close();
  delete process.env["MC_BUG_REPORT_ENABLED"];
});

describe("POST /api/bug-report — validation", () => {
  it("400 when title is missing", async () => {
    const app = makeApp();
    await request(app)
      .post("/api/bug-report")
      .send({ description: "no title here" })
      .expect(400);
  });

  it("400 when title is empty string", async () => {
    const app = makeApp();
    await request(app)
      .post("/api/bug-report")
      .send({ title: "   " })
      .expect(400);
  });

  it("400 when body is empty", async () => {
    const app = makeApp();
    await request(app).post("/api/bug-report").send({}).expect(400);
  });
});

describe("POST /api/bug-report — dry-run (MC_BUG_REPORT_ENABLED unset)", () => {
  it("returns 200 with dryRun=true and synthetic URL", async () => {
    const app = makeApp();
    const res = await request(app)
      .post("/api/bug-report")
      .send({ title: "Something broke", description: "It crashes on startup", area: "server", severity: "high" })
      .expect(200);

    expect(res.body.dryRun).toBe(true);
    expect(res.body.url).toBe("https://github.com/VFXellence-LTD/vfxellence/issues/DRY-RUN");
  });

  it("never invokes execSync in dry-run mode", async () => {
    const app = makeApp();
    await request(app)
      .post("/api/bug-report")
      .send({ title: "Crash on load" })
      .expect(200);

    expect(execSync).not.toHaveBeenCalled();
  });

  it("works with only title (optional fields absent)", async () => {
    const app = makeApp();
    const res = await request(app)
      .post("/api/bug-report")
      .send({ title: "Minimal bug report" })
      .expect(200);

    expect(res.body.dryRun).toBe(true);
    expect(typeof res.body.url).toBe("string");
  });
});

describe("BugReportService — area→label mapping", () => {
  // Import the service directly to unit-test the mapping without HTTP overhead.
  it("maps every valid area to the correct label", async () => {
    const { BugReportService } = await import("../services/bug-report.service.js");
    const svc = new BugReportService({});

    const cases: Array<[string, string]> = [
      ["mission-control", "area/mission-control"],
      ["server", "area/server"],
      ["dashboard-client", "area/dashboard-client"],
      ["polymath-engine", "area/polymath-engine"],
      ["governance", "area/governance"],
      ["automation", "area/automation"],
    ];

    for (const [area, expected] of cases) {
      expect(svc.areaToLabel(area), `area ${area}`).toBe(expected);
    }
  });

  it("falls back to area/mission-control for an unknown area value", async () => {
    const { BugReportService } = await import("../services/bug-report.service.js");
    const svc = new BugReportService({});
    expect(svc.areaToLabel("unknown-area")).toBe("area/mission-control");
    expect(svc.areaToLabel(undefined)).toBe("area/mission-control");
  });
});
