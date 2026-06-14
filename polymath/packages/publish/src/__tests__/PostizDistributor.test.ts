import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PostizDistributor } from "../PostizDistributor.js";
import type { PublishClip } from "../types.js";

const clip: PublishClip = {
  approvalId: "aq_7", ecosystemId: "content", caption: "postiz test cap", hashtags: ["#test"], videoPath: "/a/aq_7.mp4",
};

describe("PostizDistributor (mocked HTTP)", () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it("POSTs to postizApiUrl with the faked api key and returns published + url", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ id: "pz_1", url: "https://postiz.local/pz_1" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const d = new PostizDistributor({ postizApiKey: "FAKE_KEY", postizApiUrl: "https://postiz.local" });
    const r = await d.publish(clip, "instagram");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("postiz.local");
    const keyHeader = init.headers["x-api-key"] ?? init.headers["X-Api-Key"] ?? init.headers["authorization"] ?? init.headers["Authorization"] ?? "";
    expect(String(keyHeader)).toContain("FAKE_KEY");
    expect(r).toMatchObject({ platform: "instagram", status: "published", dryRun: false });
  });

  it("returns failed (never throws) on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403, text: async () => "forbidden" }));
    const r = await new PostizDistributor({ postizApiKey: "bad", postizApiUrl: "https://postiz.local" }).publish(clip, "tiktok");
    expect(r.status).toBe("failed");
    expect(r.dryRun).toBe(false);
  });
});
