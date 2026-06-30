import { describe, it, expect } from "vitest";
import { initExpansion, expansionReducer } from "./setupExpansion";

describe("setupExpansion", () => {
  it("initExpansion sets every step expanded", () => {
    expect(initExpansion(["a", "b"])).toEqual({ a: true, b: true });
  });
  it("TOGGLE flips one step, leaves others", () => {
    const s = initExpansion(["a", "b"]);
    expect(expansionReducer(s, { type: "TOGGLE", stepId: "a" })).toEqual({ a: false, b: true });
  });
  it("TOGGLE on an unknown id treats it as expanded, then collapses it", () => {
    expect(expansionReducer({}, { type: "TOGGLE", stepId: "x" })).toEqual({ x: false });
  });
  it("COLLAPSE_ALL sets all listed ids false", () => {
    expect(expansionReducer({ a: true, b: true }, { type: "COLLAPSE_ALL", stepIds: ["a", "b"] })).toEqual({ a: false, b: false });
  });
  it("EXPAND_ALL sets all listed ids true", () => {
    expect(expansionReducer({ a: false, b: false }, { type: "EXPAND_ALL", stepIds: ["a", "b"] })).toEqual({ a: true, b: true });
  });
});
