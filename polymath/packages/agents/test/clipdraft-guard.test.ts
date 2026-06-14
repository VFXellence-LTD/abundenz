import { describe, it, expect } from "vitest";
import { validateDraft } from "../src/validateDraft.js";
import { makeEmptyDraft } from "../src/types.js";

describe("ClipDraft guard remains intact after Plan 5", () => {
  it("hard-rejects a draft carrying render keys", () => {
    const d = makeEmptyDraft("zrodinger") as Record<string, unknown>;
    d.hook = "10 AI tools that replace your job"; d.script = "x ".repeat(60).trim();
    d.shotlist = [{ line: 1, visual: "ui", narration: "n", durationSeconds: 3 }];
    d.hashtags = ["#ai", "#tools", "#tech"];
    d.sourceRefs = [{ label: "PH", confidence: "verified" }];
    d.videoPath = "x.mp4"; d.voiceoverPath = "x.mp3"; d.renderedAt = "now"; d.mp4 = true;
    const res = validateDraft(d as never);
    expect(res.ok).toBe(false);
    expect(res.errors.join(" ")).toMatch(/videoPath|voiceoverPath|renderedAt|mp4/);
  });
});
