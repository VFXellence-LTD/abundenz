import type { Distributor, PublishResult, PublishTarget, PublishClip } from "./types.js";

export class DryRunDistributor implements Distributor {
  readonly name = "dry-run";
  async publish(clip: PublishClip, target: PublishTarget): Promise<PublishResult> {
    console.log(`[publish] WOULD PUBLISH to ${target}: ${clip.caption}`);
    return { platform: target, status: "skipped", dryRun: true, message: "dry-run: no credentials configured" };
  }
}
