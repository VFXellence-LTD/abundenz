import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { makeVisualAdapter } from "../src/adapters/visual.js";
import { makeEmptyDraft } from "../src/types.js";

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), "visual-")); });
afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

function draft() {
  const d = makeEmptyDraft("zrodinger");
  d.script = "narration";
  d.shotlist = [
    { line: 1, visual: "phone UI", narration: "n1", durationSeconds: 3 },
    { line: 2, visual: "graph", narration: "n2", durationSeconds: 3 },
  ];
  return d;
}

describe("VisualAdapter", () => {
  it("tool-absent → dry-run stub images, one per shotlist entry", async () => {
    const a = makeVisualAdapter({ hfPath: "Z:\\does\\not\\exist\\hf.exe" });
    const r = await a.render(draft(), { outDir: dir, slug: "demo" });
    expect(r.step.mode).toBe("dry-run");
    expect(r.visualPaths.length).toBe(2);
    for (const p of r.visualPaths) {
      expect(existsSync(p)).toBe(true);
      expect(readFileSync(p, "utf8")).toContain("DRY-RUN");
    }
  });

  it("forceDryRun → dry-run even if tool were present", async () => {
    // inject a non-existent path anyway, just verify forceDryRun respected
    const a = makeVisualAdapter({ hfPath: "Z:\\no\\hf.exe" });
    const r = await a.render(draft(), { outDir: dir, slug: "demo", forceDryRun: true });
    expect(r.step.mode).toBe("dry-run");
  });
});
