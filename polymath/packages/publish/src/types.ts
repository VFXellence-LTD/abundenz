export type PublishStatus = "queued" | "published" | "failed" | "skipped";

/**
 * Distributor-facing publish input — built by PublishService from an approval row's
 * content_json. Deliberately SEPARATE from @polymath/agents RenderedClip (the full
 * render artifact); this carries only what a social distributor needs.
 * Named PublishClip to avoid collision with the agents-package type.
 */
export interface PublishClip {
  approvalId: string;
  ecosystemId: string;          // brand scope — drives credential selection
  caption: string;
  hashtags: string[];
  videoPath: string;            // local path to rendered mp4 (from Plan 5 artifact)
  affiliateDisclosure?: string; // required when ecosystemId === 'affiliate'
}

export type PublishTarget = "tiktok" | "youtube" | "instagram";

export interface PublishResult {
  platform: PublishTarget;
  url?: string;
  status: PublishStatus;
  dryRun: boolean;
  message?: string;
}

export interface Distributor {
  readonly name: string;        // "dry-run" | "buffer" | "postiz"
  publish(clip: PublishClip, target: PublishTarget): Promise<PublishResult>;
}

export interface BrandCreds {
  provider: "buffer" | "postiz" | null;  // null => dry-run
  bufferToken?: string;
  postizApiKey?: string;
  postizApiUrl?: string;
}
