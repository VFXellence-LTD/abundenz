// VERIFY current API — Buffer GraphQL beta endpoint and schema may change. Boss go-live concern.
import type { Distributor, PublishClip, PublishResult, PublishTarget } from "./types.js";

interface BufferCreds {
  bufferToken: string;
}

// Buffer GraphQL API endpoint (beta)
const BUFFER_GRAPHQL_URL = "https://api.bufferapp.com/graphql";

export class BufferDistributor implements Distributor {
  readonly name = "buffer";
  private readonly token: string;

  constructor(creds: BufferCreds) {
    this.token = creds.bufferToken;
  }

  async publish(clip: PublishClip, target: PublishTarget): Promise<PublishResult> {
    const text = [clip.caption, ...clip.hashtags].join(" ");
    const body = JSON.stringify({
      query: `mutation CreatePost($input: PostInput!) { createPost(input: $input) { id url } }`,
      variables: {
        input: {
          profileIds: [],   // profiles must be pre-configured by Boss during go-live
          text,
          media: { type: "video", video: { filePath: clip.videoPath } },
          platform: target,
        },
      },
    });

    try {
      const resp = await fetch(BUFFER_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body,
      });

      if (!resp.ok) {
        const msg = await resp.text();
        return { platform: target, status: "failed", dryRun: false, message: `Buffer error ${resp.status}: ${msg}` };
      }

      const data = (await resp.json()) as { id?: string; url?: string };
      return { platform: target, status: "published", dryRun: false, url: data.url };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { platform: target, status: "failed", dryRun: false, message: `Buffer fetch error: ${msg}` };
    }
  }
}
