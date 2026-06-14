import { describe, it, expect } from "vitest";
import { makeEmptyRenderReport, isRenderedClip, type RenderedClip } from "../src/renderTypes.js";

describe("RenderedClip types", () => {
  it("makeEmptyRenderReport starts as a real (non-dry) report with no missing capabilities", () => {
    const r = makeEmptyRenderReport();
    expect(r.dryRun).toBe(false);
    expect(r.missing).toEqual([]);
    expect(r.steps).toEqual([]);
    expect(typeof r.renderedAt).toBe("string");
  });

  it("isRenderedClip accepts a full artifact and rejects a script-level draft", () => {
    const full: RenderedClip = {
      sourceDraftPath: "drafts/x/draft.json",
      voiceoverPath: "artifacts/x/vo.mp3",
      visualPaths: ["artifacts/x/01.png"],
      videoPath: "artifacts/x/clip.mp4",
      thumbnailPath: "artifacts/x/thumb.png",
      durationSec: 32,
      renderedAt: new Date().toISOString(),
      renderReport: { dryRun: true, missing: ["ELEVENLABS_API_KEY"], steps: [], renderedAt: new Date().toISOString() },
    };
    expect(isRenderedClip(full)).toBe(true);
    expect(isRenderedClip({ hook: "h", script: "s" })).toBe(false);
  });
});
