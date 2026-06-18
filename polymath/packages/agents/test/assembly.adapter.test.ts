import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { makeAssemblyAdapter, buildCompositionHtml } from "../src/adapters/assembly.js";
import { makeEmptyDraft } from "../src/types.js";
import type { VoiceResult, VisualResult } from "../src/adapters/types.js";
import type { ClipDraft } from "../src/types.js";

vi.mock("node:child_process");

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), "assembly-")); });
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
  delete process.env.HYPERFRAMES_ENABLED;
});

const voiceResult: VoiceResult = {
  voiceoverPath: "vo.mp3", durationSec: 31,
  step: { adapter: "voice", mode: "dry-run", note: "stub" },
};
const visualResult: VisualResult = {
  visualPaths: ["01.png"],
  step: { adapter: "visual", mode: "dry-run", note: "stub" },
};

function draftWithShotlist(): ClipDraft {
  const d = makeEmptyDraft("zrodinger");
  d.hook = "Did you know AI can code?";
  d.script = "Here's the trick everyone missed.";
  d.shotlist = [
    { line: 1, visual: "phone screen", narration: "Did you know AI can code?", durationSeconds: 5 },
    { line: 2, visual: "code editor", narration: "Here is the trick everyone missed.", durationSeconds: 8 },
  ];
  return d;
}

describe("AssemblyAdapter — dry-run gate", () => {
  it("HYPERFRAMES_ENABLED unset → dry-run stub files returned", async () => {
    delete process.env.HYPERFRAMES_ENABLED;
    const a = makeAssemblyAdapter(); // reads env at construction time
    const d = makeEmptyDraft("zrodinger");
    const r = await a.render(d, voiceResult, visualResult, { outDir: dir, slug: "demo" });
    expect(r.step.mode).toBe("dry-run");
    expect(r.videoPath.endsWith(".mp4")).toBe(true);
    expect(r.thumbnailPath.endsWith(".png")).toBe(true);
    expect(existsSync(r.videoPath)).toBe(true);
    expect(existsSync(r.thumbnailPath)).toBe(true);
    expect(readFileSync(r.videoPath, "utf8")).toContain("DRY-RUN");
    expect(r.durationSec).toBe(voiceResult.durationSec);
  });

  it("HYPERFRAMES_ENABLED=false → dry-run", async () => {
    process.env.HYPERFRAMES_ENABLED = "false";
    const a = makeAssemblyAdapter();
    const d = makeEmptyDraft("zrodinger");
    const r = await a.render(d, voiceResult, visualResult, { outDir: dir, slug: "demo" });
    expect(r.step.mode).toBe("dry-run");
  });

  it("explicit available:false → dry-run stub mp4 and thumbnail", async () => {
    const a = makeAssemblyAdapter({ available: false });
    const d = makeEmptyDraft("zrodinger");
    const r = await a.render(d, voiceResult, visualResult, { outDir: dir, slug: "demo" });
    expect(r.step.mode).toBe("dry-run");
    expect(r.videoPath.endsWith(".mp4")).toBe(true);
    expect(r.thumbnailPath.endsWith(".png")).toBe(true);
    expect(existsSync(r.videoPath)).toBe(true);
    expect(existsSync(r.thumbnailPath)).toBe(true);
    expect(readFileSync(r.videoPath, "utf8")).toContain("DRY-RUN");
    expect(r.durationSec).toBe(voiceResult.durationSec);
  });

  it("forceDryRun → dry-run even if available=true", async () => {
    const a = makeAssemblyAdapter({ available: true });
    const d = makeEmptyDraft("zrodinger");
    const r = await a.render(d, voiceResult, visualResult, { outDir: dir, slug: "demo", forceDryRun: true });
    expect(r.step.mode).toBe("dry-run");
  });

  it("dry-run never spawns npx or ffmpeg (execFile not called)", async () => {
    const cp = await import("node:child_process");
    const spy = vi.spyOn(cp, "execFile");
    const a = makeAssemblyAdapter({ available: false });
    const d = makeEmptyDraft("zrodinger");
    await a.render(d, voiceResult, visualResult, { outDir: dir, slug: "demo" });
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("buildCompositionHtml — portrait 1080×1920 format", () => {
  it("produces valid 1080×1920 portrait dimensions", () => {
    const d = draftWithShotlist();
    const html = buildCompositionHtml(d, 1080, 1920, 13);
    expect(html).toContain('data-width="1080"');
    expect(html).toContain('data-height="1920"');
    expect(html).toContain('width: 1080px');
    expect(html).toContain('height: 1920px');
    expect(html).toContain('width=1080, height=1920');
  });

  it("includes data-composition-id=main on root div", () => {
    const d = draftWithShotlist();
    const html = buildCompositionHtml(d, 1080, 1920, 13);
    expect(html).toContain('data-composition-id="main"');
  });

  it("includes window.__timelines for GSAP", () => {
    const d = draftWithShotlist();
    const html = buildCompositionHtml(d, 1080, 1920, 13);
    expect(html).toContain('window.__timelines');
    expect(html).toContain('gsap.timeline');
  });

  it("includes narration text from each shotlist entry", () => {
    const d = draftWithShotlist();
    const html = buildCompositionHtml(d, 1080, 1920, 13);
    expect(html).toContain("Did you know AI can code?");
    expect(html).toContain("Here is the trick everyone missed.");
  });

  it("each shot has correct data-start cumulative offset", () => {
    const d = draftWithShotlist();
    const html = buildCompositionHtml(d, 1080, 1920, 13);
    // Shot 1 starts at 0, shot 2 starts at 5
    expect(html).toContain('data-start="0"');
    expect(html).toContain('data-start="5"');
  });

  it("data-duration set per shotlist entry", () => {
    const d = draftWithShotlist();
    const html = buildCompositionHtml(d, 1080, 1920, 13);
    expect(html).toContain('data-duration="5"');
    expect(html).toContain('data-duration="8"');
  });

  it("includes GSAP CDN script tag", () => {
    const d = draftWithShotlist();
    const html = buildCompositionHtml(d, 1080, 1920, 13);
    expect(html).toContain('cdn.jsdelivr.net/npm/gsap');
  });

  it("empty shotlist → duration from argument, no clip divs", () => {
    const d = makeEmptyDraft("zrodinger");
    const html = buildCompositionHtml(d, 1080, 1920, 31);
    expect(html).toContain('data-duration="31"');
    // No shot clips
    expect(html).not.toContain('id="shot-');
  });
});

describe("AssemblyAdapter — input validation", () => {
  it("empty shotlist → dry-run falls back to voice.durationSec", async () => {
    const a = makeAssemblyAdapter({ available: false });
    const d = makeEmptyDraft("zrodinger"); // no shotlist entries
    const r = await a.render(d, voiceResult, visualResult, { outDir: dir, slug: "empty-shotlist" });
    expect(r.step.mode).toBe("dry-run");
    expect(r.durationSec).toBe(voiceResult.durationSec);
  });
});
