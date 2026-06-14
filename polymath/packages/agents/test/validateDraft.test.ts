import { describe, it, expect } from "vitest";
import { validateDraft } from "../src/validateDraft.js";
import { makeEmptyDraft, type ClipDraft } from "../src/types.js";

function goodDraft(): ClipDraft {
  return {
    brand: "zrodinger",
    hook: "This free AI tool just killed a $40/month app.",
    script:
      "This free AI tool just killed a $40/month app. " +
      "It runs entirely in your browser, no signup. " +
      "I tested it against the paid version and the output was identical. " +
      "Here is the part nobody mentions: it exports without a watermark. " +
      "Link in bio — and yes, it is genuinely free.",
    shotlist: [
      { line: 1, visual: "Dark UI screen recording, bold text overlay", narration: "This free AI tool just killed a $40/month app.", durationSeconds: 3 },
      { line: 2, visual: "Cursor opening the tool in browser", narration: "It runs entirely in your browser, no signup.", durationSeconds: 4 },
    ],
    caption: "Free > paid, every time. AI-generated. #ai",
    hashtags: ["#aitools", "#tech", "#free"],
    sourceRefs: [{ label: "Product Hunt listing", url: "https://producthunt.com/x", confidence: "verified" }],
    safeguardReport: null,
  };
}

describe("validateDraft", () => {
  it("accepts a well-formed in-scope draft", () => {
    const r = validateDraft(goodDraft());
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("rejects an empty skeleton", () => {
    const r = validateDraft(makeEmptyDraft("zrodinger"));
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes("hook"))).toBe(true);
    expect(r.errors.some((e) => e.includes("script"))).toBe(true);
  });

  it("enforces hashtag count 3-5", () => {
    const d = goodDraft();
    d.hashtags = ["#one", "#two"];
    expect(validateDraft(d).ok).toBe(false);
    d.hashtags = ["#1", "#2", "#3", "#4", "#5", "#6"];
    expect(validateDraft(d).ok).toBe(false);
  });

  it("blocks owner-identity leakage (brand isolation)", () => {
    const d = goodDraft();
    d.caption = "Made by Robin Dutta at VFXellence. #ai";
    const r = validateDraft(d);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.toLowerCase().includes("brand isolation"))).toBe(true);
  });

  it("rejects render/asset fields sneaking in (script-level only)", () => {
    const d = goodDraft() as unknown as Record<string, unknown>;
    d["videoPath"] = "out.mp4";
    const r = validateDraft(d as unknown as ClipDraft);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.toLowerCase().includes("script-level"))).toBe(true);
  });
});
