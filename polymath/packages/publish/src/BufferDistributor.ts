// VERIFY current API — Buffer GraphQL beta endpoint and schema may change. Boss go-live concern.
import type { Distributor, PublishClip, PublishResult, PublishTarget } from "./types.js";

interface BufferCreds {
  bufferToken: string;
  /** Buffer profile ID to post to. Resolved from credential_ref at runtime.
   *  Absent during dry-run (DryRunDistributor selected instead — this path
   *  is only reached when a real token is present). */
  profileId?: string;
}

// Buffer GraphQL API endpoint (beta)
const BUFFER_GRAPHQL_URL = "https://api.bufferapp.com/graphql";

export class BufferDistributor implements Distributor {
  readonly name = "buffer";
  private readonly token: string;
  private readonly profileId: string | undefined;

  constructor(creds: BufferCreds) {
    this.token = creds.bufferToken;
    this.profileId = creds.profileId;
  }

  async publish(clip: PublishClip, target: PublishTarget): Promise<PublishResult> {
    const text = [clip.caption, ...clip.hashtags].join(" ");
    const body = JSON.stringify({
      query: `mutation CreatePost($input: PostInput!) { createPost(input: $input) { id url } }`,
      variables: {
        input: {
          profileIds: this.profileId ? [this.profileId] : [],
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
