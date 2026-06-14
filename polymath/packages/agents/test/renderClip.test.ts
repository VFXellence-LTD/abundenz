import { describe, it, expect } from "vitest";
import { renderClip } from "../src/renderClip.js";
import { makeEmptyDraft } from "../src/types.js";
import type { VoiceAdapter, VisualAdapter, AssemblyAdapter } from "../src/adapters/types.js";

function draft() {
  const d = makeEmptyDraft("zrodinger");
  d.script = "narration here";
  d.shotlist = [{ line: 1, visual: "ui", narration: "n", durationSeconds: 3 }];
  return d;
}

describe("renderClip", () => {
  it("sequences voice → visual → assemble and aggregates a dry-run report", async () => {
    const calls: string[] = [];
    const voice: VoiceAdapter = { name: "v", render: async () => { calls.push("voice"); return { voiceoverPath: "vo.mp3", durationSec: 30, step: { adapter: "voice", mode: "dry-run", note: "no key" } }; } };
    const visual: VisualAdapter = { name: "vis", render: async () => { calls.push("visual"); return { visualPaths: ["01.png"], step: { adapter: "visual", mode: "real", note: "ok" } }; } };
    const assembly: AssemblyAdapter = { name: "asm", render: async (_d, vo) => { calls.push("assemble"); return { videoPath: "c.mp4", thumbnailPath: "t.png", durationSec: vo.durationSec, step: { adapter: "assembly", mode: "dry-run", note: "stub" } }; } };

    const out = await renderClip(draft(), {
      sourceDraftPath: "drafts/x/draft.json", outDir: "/tmp/x", slug: "demo",
      adapters: { voice, visual, assembly },
    });

    expect(calls).toEqual(["voice", "visual", "assemble"]);
    expect(out.videoPath).toBe("c.mp4");
    expect(out.thumbnailPath).toBe("t.png");
    expect(out.durationSec).toBe(30);
    expect(out.renderReport.dryRun).toBe(true);       // any step dry-run => true
    expect(out.renderReport.missing).toContain("no key");
    expect(out.renderReport.steps).toHaveLength(3);
  });
});
