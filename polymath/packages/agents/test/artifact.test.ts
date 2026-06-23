import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeDraft } from "../src/artifact.js";
import { runSafeguardCheck } from "../src/safeguard.js";
import type { ClipDraft } from "../src/types.js";

let dir: string;
afterEach(() => { if (dir && existsSync(dir)) rmSync(dir, { recursive: true, force: true }); });

function draft(report = true): ClipDraft {
  const d: ClipDraft = {
    brand: "zrodinger",
    hook: "This free AI tool just killed a $40/month app.",
    script: "This free AI tool just killed a $40/month app. It runs in your browser. I tested it. AI-generated.",
    shotlist: [{ line: 1, visual: "dark UI", narration: "hook", durationSeconds: 3 }],
    caption: "Free beats paid. AI-generated. #ai",
    hashtags: ["#aitools", "#tech", "#free"],
    sourceRefs: [{ label: "Product Hunt", confidence: "verified" }],
    safeguardReport: null,
  };
  if (report) d.safeguardReport = runSafeguardCheck(d);
  return d;
}

describe("writeDraft", () => {
  it("writes json + markdown and returns the json artifactPath", () => {
    dir = mkdtempSync(join(tmpdir(), "viral-"));
    const res = writeDraft(draft(), { draftsDir: dir, campaignId: "camp-1", slug: "free-ai-tool" });
    expect(res.artifactPath.endsWith(".json")).toBe(true);
    expect(existsSync(res.artifactPath)).toBe(true);
    expect(existsSync(res.markdownPath)).toBe(true);
    const parsed = JSON.parse(readFileSync(res.artifactPath, "utf8"));
    expect(parsed.hook).toContain("free AI tool");
    expect(parsed.safeguardReport.pass).toBe(true);
    const md = readFileSync(res.markdownPath, "utf8");
    expect(md).toContain("# Zrodinger Clip Draft");
    expect(md).toContain("Safeguard: PASS");
  });

  it("prefixes the dir with BLOCKED- when the report fails", () => {
    dir = mkdtempSync(join(tmpdir(), "viral-"));
    const d = draft(false);
    d.hook = "Hey guys welcome back";
    d.safeguardReport = runSafeguardCheck(d);
    const res = writeDraft(d, { draftsDir: dir, campaignId: "camp-1", slug: "weak" });
    expect(res.artifactPath).toContain("BLOCKED-");
  });

  it("throws if the draft has no safeguardReport (must check before write)", () => {
    dir = mkdtempSync(join(tmpdir(), "viral-"));
    expect(() => writeDraft(draft(false), { draftsDir: dir, campaignId: "c", slug: "x" })).toThrow(/safeguard/i);
  });
});
