import { describe, it, expect } from "vitest";
import { selectMode } from "../src/adapters/types.js";

describe("selectMode", () => {
  it("picks real when the capability is present", () => {
    expect(selectMode({ present: true })).toBe("real");
  });
  it("picks dry-run when absent", () => {
    expect(selectMode({ present: false })).toBe("dry-run");
  });
  it("forces dry-run when forceDryRun set, even if present", () => {
    expect(selectMode({ present: true, forceDryRun: true })).toBe("dry-run");
  });
});
