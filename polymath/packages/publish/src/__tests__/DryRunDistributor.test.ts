import { describe, it, expect, vi } from "vitest";
import { DryRunDistributor } from "../DryRunDistributor.js";
import type { PublishClip } from "../types.js";

const clip: PublishClip = {
  approvalId: "aq_1", ecosystemId: "viral", caption: "wild fact about octopuses",
  hashtags: ["#octopus"], videoPath: "/artifacts/aq_1.mp4",
};

describe("DryRunDistributor", () => {
  it("returns dryRun:true and never returns a url", async () => {
    const d = new DryRunDistributor();
    const r = await d.publish(clip, "tiktok");
    expect(r.dryRun).toBe(true);
    expect(r.status).toBe("skipped");
    expect(r.platform).toBe("tiktok");
    expect(r.url).toBeUndefined();
    expect(d.name).toBe("dry-run");
  });

  it("logs WOULD PUBLISH with platform and caption", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await new DryRunDistributor().publish(clip, "youtube");
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("WOULD PUBLISH to youtube: wild fact about octopuses"),
    );
    spy.mockRestore();
  });
});
