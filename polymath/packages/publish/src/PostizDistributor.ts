// VERIFY current API — Postiz REST /api base path and auth header may change. Boss go-live concern.
import type { Distributor, PublishClip, PublishResult, PublishTarget } from "./types.js";

interface PostizCreds {
  postizApiKey: string;
  postizApiUrl: string;
}

export class PostizDistributor implements Distributor {
  readonly name = "postiz";
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(creds: PostizCreds) {
    this.apiKey = creds.postizApiKey;
    this.apiUrl = creds.postizApiUrl.replace(/\/$/, "");
  }

  async publish(clip: PublishClip, target: PublishTarget): Promise<PublishResult> {
    const text = [clip.caption, ...clip.hashtags].join(" ");
    const body = JSON.stringify({
      platform: target,
      text,
      media: [{ path: clip.videoPath, type: "video" }],
    });

    try {
      const resp = await fetch(`${this.apiUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body,
      });

      if (!resp.ok) {
        const msg = await resp.text();
        return { platform: target, status: "failed", dryRun: false, message: `Postiz error ${resp.status}: ${msg}` };
      }

      const data = (await resp.json()) as { id?: string; url?: string };
      return { platform: target, status: "published", dryRun: false, url: data.url };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { platform: target, status: "failed", dryRun: false, message: `Postiz fetch error: ${msg}` };
    }
  }
}
