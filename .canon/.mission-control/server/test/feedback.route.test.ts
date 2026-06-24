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
