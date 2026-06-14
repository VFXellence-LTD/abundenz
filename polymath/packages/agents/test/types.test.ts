import { describe, it, expect } from "vitest";
import { CLIP_CONTENT_TYPE, VIRAL_ECOSYSTEM_ID, makeEmptyDraft } from "../src/types.js";

describe("draft type contract", () => {
  it("pins the cross-plan constants", () => {
    expect(VIRAL_ECOSYSTEM_ID).toBe("viral");
    expect(CLIP_CONTENT_TYPE).toBe("clip");
  });

  it("makeEmptyDraft returns a fully-shaped draft skeleton", () => {
    const d = makeEmptyDraft("zrodinger");
    expect(d.brand).toBe("zrodinger");
    expect(d.hook).toBe("");
    expect(Array.isArray(d.shotlist)).toBe(true);
    expect(Array.isArray(d.hashtags)).toBe(true);
    expect(Array.isArray(d.sourceRefs)).toBe(true);
    expect(d.safeguardReport).toBeNull();
  });
});
