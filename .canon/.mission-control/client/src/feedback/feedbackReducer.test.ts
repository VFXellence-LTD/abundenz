import { describe, it, expect } from "vitest";
import { feedbackReducer } from "./feedbackReducer";

describe("feedbackReducer", () => {
  it("ADD appends a trimmed item", () => {
    const out = feedbackReducer([], { type: "ADD", item: { text: "  hello  " } });
    expect(out).toEqual([{ text: "hello" }]);
  });
  it("ADD ignores blank text", () => {
    expect(feedbackReducer([], { type: "ADD", item: { text: "   " } })).toEqual([]);
  });
  it("ADD preserves area and severity", () => {
    const out = feedbackReducer([], { type: "ADD", item: { text: "x", area: "server", severity: "low" } });
    expect(out).toEqual([{ text: "x", area: "server", severity: "low" }]);
  });
  it("REMOVE drops the item at the given index", () => {
    const start = [{ text: "a" }, { text: "b" }, { text: "c" }];
    expect(feedbackReducer(start, { type: "REMOVE", index: 1 })).toEqual([{ text: "a" }, { text: "c" }]);
  });
  it("CLEAR empties the list", () => {
    expect(feedbackReducer([{ text: "a" }], { type: "CLEAR" })).toEqual([]);
  });
});
