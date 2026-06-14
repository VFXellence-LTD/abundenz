import type { Db } from "../db.js";
import { ApprovalsService } from "./approvals.service.js";
import { TasksService } from "./tasks.service.js";
import { selectDistributor } from "@polymath/publish";
import type { PublishClip, PublishTarget, PublishResult } from "@polymath/publish";

const DEFAULT_TARGETS: PublishTarget[] = ["tiktok", "youtube", "instagram"];

function genLogId(): string {
  return `pl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export type PublishOutcome =
  | { missing: true }
  | { conflict: true; reason?: string }
  | { results: PublishResult[] };

export class PublishService {
  private approvals: ApprovalsService;
  private tasks: TasksService;

  constructor(private db: Db, private env: Record<string, string | undefined>) {
    this.approvals = new ApprovalsService(db);
    this.tasks = new TasksService(db);
  }

  async publish(approvalId: string, publishedBy: string): Promise<PublishOutcome> {
    const approval = this.approvals.get(approvalId);
    if (!approval) return { missing: true };

    // Gate: must be approved video
    if (approval.contentType !== "video" || approval.status !== "approved") {
      return { conflict: true };
    }

    // FTC disclosure guard for affiliate ecosystem
    if (approval.ecosystemId === "affiliate") {
      const content = approval.contentJson as { affiliateDisclosure?: string } | undefined;
      if (!content?.affiliateDisclosure) {
        return { conflict: true, reason: "ftc-disclosure-missing" };
      }
    }

    // Build PublishClip from approval content_json
    const contentJson = approval.contentJson as {
      caption?: string;
      hashtags?: string[] | string;
      videoPath?: string;
      affiliateDisclosure?: string;
    } | undefined;

    const clip: PublishClip = {
      approvalId: approval.id,
      ecosystemId: approval.ecosystemId,
      caption: contentJson?.caption ?? "",
      hashtags: Array.isArray(contentJson?.hashtags)
        ? (contentJson!.hashtags as string[])
        : typeof contentJson?.hashtags === "string"
          ? [contentJson.hashtags]
          : [],
      videoPath: contentJson?.videoPath ?? approval.artifactPath ?? "",
      affiliateDisclosure: contentJson?.affiliateDisclosure,
    };

    const distributor = selectDistributor(approval.ecosystemId, this.env);
    const results: PublishResult[] = [];

    for (const target of DEFAULT_TARGETS) {
      const result = await distributor.publish(clip, target);
      results.push(result);

      // Record publish_log row per platform
      this.db.raw
        .prepare(
          `INSERT INTO publish_log (id, approval_id, ecosystem_id, platform, url, status, dry_run, published_by, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          genLogId(),
          approvalId,
          approval.ecosystemId,
          result.platform,
          result.url ?? null,
          result.status,
          result.dryRun ? 1 : 0,
          publishedBy,
          new Date().toISOString(),
        );
    }

    // Mark task as published
    if (approval.taskId) {
      this.tasks.setStatus(approval.taskId, "published");
    }

    return { results };
  }
}
