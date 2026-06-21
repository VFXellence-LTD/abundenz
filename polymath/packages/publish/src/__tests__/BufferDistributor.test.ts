import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BufferDistributor } from "../BufferDistributor.js";
import type { PublishClip } from "../types.js";

const clip: PublishClip = {
  approvalId: "aq_9", ecosystemId: "viral", caption: "cap", hashtags: ["#x"], videoPath: "/a/aq_9.mp4",
};

describe("BufferDistributor (mocked HTTP)", () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it("POSTs to Buffer with the faked token and returns published + url", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ id: "post_1", url: "https://buffer.test/post_1" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const d = new BufferDistributor({ bufferToken: "FAKE_TEST_TOKEN" });
    const r = await d.publish(clip, "tiktok");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    expect(String(init.headers["authorization"] ?? init.headers["Authorization"])).toContain("FAKE_TEST_TOKEN");
    expect(r).toMatchObject({ platform: "tiktok", status: "published", dryRun: false, url: "https://buffer.test/post_1" });
  });

  it("returns failed (never throws) on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => "unauthorized" }));
    const r = await new BufferDistributor({ bufferToken: "bad" }).publish(clip, "youtube");
    expect(r.status).toBe("failed");
    expect(r.dryRun).toBe(false);
  });

  it("passes resolved profileId in the profileIds mutation variable", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ id: "post_2", url: "https://buffer.test/post_2" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const d = new BufferDistributor({ bufferToken: "FAKE_TOKEN", profileId: "profile_tiktok_abc123" });
    await d.publish(clip, "tiktok");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    const parsed = JSON.parse(init.body as string);
    expect(parsed.variables.input.profileIds).toEqual(["profile_tiktok_abc123"]);
  });

  it("uses empty profileIds array when no profileId provided (backward compat)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ id: "post_3", url: "https://buffer.test/post_3" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const d = new BufferDistributor({ bufferToken: "FAKE_TOKEN" }); // no profileId
    await d.publish(clip, "tiktok");
    const [, init] = fetchMock.mock.calls[0];
    const parsed = JSON.parse(init.body as string);
    expect(parsed.variables.input.profileIds).toEqual([]);
  });
});
