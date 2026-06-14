import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { recordApproval } from "../src/apiClient.js";
import { runSafeguardCheck } from "../src/safeguard.js";
import type { ClipDraft } from "../src/types.js";

function draftWithReport(): ClipDraft {
  const d: ClipDraft = {
    brand: "zrodinger",
    hook: "This free AI tool just killed a $40/month app.",
    script: "This free AI tool just killed a $40/month app. It runs in your browser. AI-generated.",
    shotlist: [{ line: 1, visual: "dark UI", narration: "hook", durationSeconds: 3 }],
    caption: "Free beats paid. AI-generated. #ai",
    hashtags: ["#aitools", "#tech", "#free"],
    sourceRefs: [{ label: "Product Hunt", confidence: "verified" }],
    safeguardReport: null,
  };
  d.safeguardReport = runSafeguardCheck(d);
  return d;
}

const calls: { url: string; init: RequestInit }[] = [];
beforeEach(() => {
  calls.length = 0;
  globalThis.fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    if (String(url).endsWith("/api/approvals")) {
      return new Response(JSON.stringify({ id: "aq_123", status: "pending" }), { status: 201, headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ id: "task-1", status: "in-review" }), { status: 200, headers: { "content-type": "application/json" } });
  }) as unknown as typeof fetch;
});
afterEach(() => vi.restoreAllMocks());

describe("recordApproval", () => {
  it("POSTs a camelCase approval row then PATCHes the task to in-review", async () => {
    const res = await recordApproval(draftWithReport(), {
      apiBase: "http://localhost:4500/api",
      taskId: "task-1",
      campaignId: "camp-1",
      artifactPath: "/drafts/x/draft.json",
    });
    expect(res.approvalId).toBe("aq_123");
    expect(res.taskStatus).toBe("in-review");

    // 1st call = POST /api/approvals
    expect(calls[0].url).toBe("http://localhost:4500/api/approvals");
    expect(calls[0].init.method).toBe("POST");
    const body = JSON.parse(String(calls[0].init.body));
    expect(body.ecosystemId).toBe("viral");
    expect(body.contentType).toBe("clip");
    expect(body.taskId).toBe("task-1");
    expect(body.campaignId).toBe("camp-1");
    expect(body.artifactPath).toBe("/drafts/x/draft.json");
    expect("status" in body).toBe(false); // server forces pending
    expect(body.contentJson.hook).toContain("free AI tool");
    expect(body.contentJson.safeguardReport.pass).toBe(true);

    // 2nd call = PATCH /api/tasks/task-1/status {status:'in-review'}
    expect(calls[1].url).toBe("http://localhost:4500/api/tasks/task-1/status");
    expect(calls[1].init.method).toBe("PATCH");
    expect(JSON.parse(String(calls[1].init.body))).toEqual({ status: "in-review" });
  });

  it("throws and does NOT PATCH the task if the approval POST fails", async () => {
    globalThis.fetch = vi.fn(async () => new Response("boom", { status: 500 })) as unknown as typeof fetch;
    await expect(
      recordApproval(draftWithReport(), { apiBase: "http://localhost:4500/api", taskId: "t", campaignId: "c", artifactPath: "/x.json" }),
    ).rejects.toThrow(/approval/i);
  });

  it("throws if safeguardReport is missing (never record an unchecked draft)", async () => {
    const d = draftWithReport();
    d.safeguardReport = null;
    await expect(
      recordApproval(d, { apiBase: "http://localhost:4500/api", taskId: "t", campaignId: "c", artifactPath: "/x.json" }),
    ).rejects.toThrow(/safeguard/i);
  });
});
