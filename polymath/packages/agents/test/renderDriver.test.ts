import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runRender } from "../src/renderDriver.js";
import { makeEmptyDraft } from "../src/types.js";

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), "driver-")); });
afterEach(() => { rmSync(dir, { recursive: true, force: true }); vi.unstubAllGlobals(); });

function makeDraftJson(outDir: string): string {
  const draft = makeEmptyDraft("zrodinger");
  draft.hook = "10 tools"; draft.script = "x ".repeat(60).trim();
  draft.shotlist = [{ line: 1, visual: "ui", narration: "n", durationSeconds: 3 }];
  draft.hashtags = ["#ai", "#tools", "#tech"];
  draft.sourceRefs = [{ label: "PH", confidence: "verified" }];
  draft.caption = "caption #ai";
  const p = join(outDir, "draft.json");
  writeFileSync(p, JSON.stringify(draft), "utf8");
  return p;
}

const approvedClipRow = (artifactPath: string) => ({
  id: "aq_clip_1", contentType: "clip", status: "approved",
  artifactPath, taskId: "t1", campaignId: "c1",
});

describe("runRender", () => {
  it("refuses when approval status is not approved", async () => {
    const draftPath = makeDraftJson(dir);
    const fetchMock = vi.fn(async (url: string) => {
      if (String(url).includes("/approvals/aq_clip_1")) {
        return new Response(JSON.stringify({ ...approvedClipRow(draftPath), status: "pending" }), { status: 200 });
      }
      return new Response("not found", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);
    await expect(runRender("aq_clip_1", { apiBase: "http://localhost:4500/api", artifactsRoot: dir, forceDryRun: true }))
      .rejects.toThrow(/refuses|not approved/i);
    // No POST /approvals should have been made
    const postCalls = fetchMock.mock.calls.filter(([, init]) => (init as RequestInit)?.method === "POST");
    expect(postCalls.length).toBe(0);
  });

  it("refuses when contentType is not clip", async () => {
    const draftPath = makeDraftJson(dir);
    const fetchMock = vi.fn(async (url: string) => {
      if (String(url).includes("/approvals/aq_video_x")) {
        return new Response(JSON.stringify({ id: "aq_video_x", contentType: "video", status: "approved", artifactPath: draftPath, taskId: "t1", campaignId: "c1" }), { status: 200 });
      }
      return new Response("not found", { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);
    await expect(runRender("aq_video_x", { apiBase: "http://localhost:4500/api", artifactsRoot: dir, forceDryRun: true }))
      .rejects.toThrow(/refuses|not.*clip/i);
  });

  it("on valid approved clip: renders, posts exactly one video row, returns halted", async () => {
    const draftPath = makeDraftJson(dir);
    const endpointsCalled: string[] = [];
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      const u = String(url);
      endpointsCalled.push(`${init?.method ?? "GET"} ${u}`);
      if (u.includes("/approvals/aq_clip_1") && (init?.method ?? "GET") === "GET") {
        return new Response(JSON.stringify(approvedClipRow(draftPath)), { status: 200 });
      }
      if (u.endsWith("/approvals") && init?.method === "POST") {
        return new Response(JSON.stringify({ id: "aq_video_2" }), { status: 201 });
      }
      return new Response("unexpected", { status: 500 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const result = await runRender("aq_clip_1", { apiBase: "http://localhost:4500/api", artifactsRoot: dir, forceDryRun: true });
    expect(result.halted).toBe(true);
    expect(result.approvalId).toBe("aq_video_2");
    expect(result.dryRun).toBe(true);
    // Exactly one POST to /approvals (the video row)
    const postApprovals = endpointsCalled.filter(e => e.startsWith("POST") && e.includes("/approvals"));
    expect(postApprovals.length).toBe(1);
    // No publish endpoints
    const publishCalls = endpointsCalled.filter(e => e.includes("publish") || e.includes("tiktok") || e.includes("instagram"));
    expect(publishCalls.length).toBe(0);
  });
});
