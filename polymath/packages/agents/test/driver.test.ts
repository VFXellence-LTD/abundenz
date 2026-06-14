import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, existsSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGenerate } from "../src/driver.js";
import type { ClipDraft } from "../src/types.js";

let dir: string;
const calls: { url: string; init: RequestInit }[] = [];

function good(): ClipDraft {
  return {
    brand: "zrodinger",
    hook: "This free AI tool just killed a $40/month app.",
    // Script must be 50-180 words to pass validateDraft (plan-fixture bug: original was 24 words)
    script:
      "This free AI tool just killed a $40/month app. It runs entirely in your browser — no signup, no install. " +
      "I tested it against the paid version for two weeks and the output was identical on every benchmark I ran. " +
      "Here is the part nobody mentions: it exports without a watermark and supports batch processing. " +
      "The paid tool costs forty dollars a month. This one is genuinely free and open source. " +
      "I have linked it in my bio. AI-generated content.",
    shotlist: [{ line: 1, visual: "dark UI", narration: "hook", durationSeconds: 3 }],
    caption: "Free beats paid. AI-generated. #ai",
    hashtags: ["#aitools", "#tech", "#free"],
    sourceRefs: [{ label: "Product Hunt", confidence: "verified" }],
    safeguardReport: null,
  };
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "surge-drv-"));
  calls.length = 0;
  globalThis.fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    if (String(url).endsWith("/api/approvals")) {
      return new Response(JSON.stringify({ id: "aq_999", status: "pending" }), { status: 201 });
    }
    return new Response(JSON.stringify({ id: "task-1", status: "in-review" }), { status: 200 });
  }) as unknown as typeof fetch;
});
afterEach(() => {
  vi.restoreAllMocks();
  if (dir && existsSync(dir)) rmSync(dir, { recursive: true, force: true });
});

describe("runGenerate driver", () => {
  it("runs generate→safeguard→write→record→halt for a clean draft", async () => {
    const res = await runGenerate(good(), {
      apiBase: "http://localhost:4500/api",
      taskId: "task-1",
      campaignId: "camp-1",
      slug: "free-ai-tool",
      draftsDir: dir,
    });
    expect(res.halted).toBe(true);
    expect(res.safeguard.pass).toBe(true);
    expect(res.approvalId).toBe("aq_999");
    expect(res.taskStatus).toBe("in-review");
    expect(existsSync(res.artifactPath)).toBe(true);
    expect(JSON.parse(readFileSync(res.artifactPath, "utf8")).safeguardReport.pass).toBe(true);
    // approvals POSTed then task PATCHed — engine recorded, did not publish
    expect(calls[0].url).toContain("/api/approvals");
    expect(calls[1].url).toContain("/api/tasks/task-1/status");
    expect(calls).toHaveLength(2); // NO publish call ever
  });

  it("still writes + records a BLOCKED draft (logged, not dropped) and halts", async () => {
    const d = good();
    d.hook = "Hey guys welcome back";
    const res = await runGenerate(d, { apiBase: "http://localhost:4500/api", taskId: "task-1", campaignId: "camp-1", slug: "weak", draftsDir: dir });
    expect(res.safeguard.pass).toBe(false);
    expect(res.artifactPath).toContain("BLOCKED-");
    expect(res.approvalId).toBe("aq_999"); // still recorded for human rejection
    expect(res.halted).toBe(true);
  });

  it("errors loudly and records NOTHING when the draft is malformed (validateDraft fail)", async () => {
    const d = good();
    d.hashtags = ["#only-one"]; // < 3
    await expect(
      runGenerate(d, { apiBase: "http://localhost:4500/api", taskId: "t", campaignId: "c", slug: "x", draftsDir: dir }),
    ).rejects.toThrow(/validation/i);
    expect(calls).toHaveLength(0); // nothing written/recorded
  });
});
