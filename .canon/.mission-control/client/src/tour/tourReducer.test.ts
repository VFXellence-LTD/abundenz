import { describe, it, expect } from "vitest";
import { tourReducer, initialTourState } from "./tourReducer";

const TOTAL = 3;
const r = (s: typeof initialTourState, a: Parameters<typeof tourReducer>[1]) => tourReducer(s, a, TOTAL);

describe("tourReducer", () => {
  it("START activates at step 0", () => {
    expect(r(initialTourState, { type: "START" })).toEqual({ active: true, stepIndex: 0 });
  });
  it("NEXT advances the step index", () => {
    expect(r({ active: true, stepIndex: 0 }, { type: "NEXT" })).toEqual({ active: true, stepIndex: 1 });
  });
  it("NEXT past the last step deactivates", () => {
    expect(r({ active: true, stepIndex: TOTAL - 1 }, { type: "NEXT" })).toEqual({ active: false, stepIndex: 0 });
  });
  it("BACK clamps at 0", () => {
    expect(r({ active: true, stepIndex: 0 }, { type: "BACK" })).toEqual({ active: true, stepIndex: 0 });
  });
  it("SKIP deactivates", () => {
    expect(r({ active: true, stepIndex: 2 }, { type: "SKIP" })).toEqual({ active: false, stepIndex: 0 });
  });
  it("NEXT is a no-op when inactive", () => {
    expect(r({ active: false, stepIndex: 0 }, { type: "NEXT" })).toEqual({ active: false, stepIndex: 0 });
  });
});
