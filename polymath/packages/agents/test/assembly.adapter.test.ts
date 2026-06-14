import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { makeAssemblyAdapter } from "../src/adapters/assembly.js";
import { makeEmptyDraft } from "../src/types.js";
import type { VoiceResult, VisualResult } from "../src/adapters/types.js";

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), "assembly-")); });
afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

const voiceResult: VoiceResult = {
  voiceoverPath: "vo.mp3", durationSec: 31,
  step: { adapter: "voice", mode: "dry-run", note: "stub" },
};
const visualResult: VisualResult = {
  visualPaths: ["01.png"],
  step: { adapter: "visual", mode: "dry-run", note: "stub" },
};

describe("AssemblyAdapter", () => {
  it("tool-absent → dry-run stub mp4 and thumbnail", async () => {
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
});
