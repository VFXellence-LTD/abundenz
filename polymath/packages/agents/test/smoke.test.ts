import { describe, it, expect } from "vitest";

describe("@polymath/agents scaffold", () => {
  it("exposes a version banner", async () => {
    const mod = await import("../src/index.js");
    expect(mod.AGENTS_PACKAGE).toBe("@polymath/agents");
  });
});
