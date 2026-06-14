import { describe, it, expect, vi } from "vitest";
import { recordVideoApproval } from "../src/videoApiClient.js";
import type { RenderedClip } from "../src/renderTypes.js";

function rendered(): RenderedClip {
  return { sourceDraftPath: "drafts/x/draft.json", voiceoverPath: "a/vo.mp3", visualPaths: ["a/01.png"],
    videoPath: "a/clip.mp4", thumbnailPath: "a/thumb.png", durationSec: 31, renderedAt: "2026-06-14T00:00:00Z",
    renderReport: { dryRun: true, missing: ["ELEVENLABS_API_KEY"], steps: [], renderedAt: "2026-06-14T00:00:00Z" } };
}

describe("recordVideoApproval", () => {
  it("POSTs a content_type='video' pending row with RenderedClip payload", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: "aq_video_1" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await recordVideoApproval(rendered(), { apiBase: "http://localhost:4500/api", taskId: "t1", campaignId: "c1" });
    expect(res.approvalId).toBe("aq_video_1");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:4500/api/approvals");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.ecosystemId).toBe("viral");
    expect(body.contentType).toBe("video");
    expect(body.previewUrl).toBe("a/clip.mp4");
    expect(body.artifactPath).toBe("a/clip.mp4");
    expect(body.contentJson.videoPath).toBe("a/clip.mp4");
    expect(body.contentJson.renderReport.dryRun).toBe(true);
    vi.unstubAllGlobals();
  });
});
