import type { Db } from "../db.js";

export interface RoutingInput {
  ecosystemId: string;
  assetId: string;
  platforms: string[];
  /** Max accounts allowed per platform for the same asset. Default: 1 (no-identical-cross-account). */
  maxAccountsPerPlatform?: number;
}

export interface PostingPlan {
  accountId: number;
  platform: string;
  scheduledAt: string; // ISO timestamp
  credentialRef: string | null;
}

interface AccountRow {
  id: number;
  platform: string;
  rotation_order: number;
  last_posted_at: string | null;
  stagger_hours: number;
  credential_ref: string | null;
}

/**
 * RoutingService — pure read-only computation.
 * Given an ecosystem + asset + platform list, returns a posting plan:
 * an ordered list of (account, platform, scheduledAt) tuples.
 *
 * Algorithm:
 *   1. Load active accounts for the ecosystem filtered to requested platforms.
 *   2. Per platform, sort by last_posted_at ASC (nulls first), break ties by rotation_order ASC.
 *   3. Apply stagger_hours between consecutive same-platform entries.
 *   4. Enforce maxAccountsPerPlatform (default 1) — no-identical-cross-account rule.
 *   5. Return plan. No writes, no side effects.
 */
export class RoutingService {
  constructor(private db: Db) {}

  buildPlan(input: RoutingInput, now: Date = new Date()): PostingPlan[] {
    const { ecosystemId, platforms, maxAccountsPerPlatform = Infinity } = input;

    const placeholders = platforms.map(() => "?").join(", ");
    const rows = this.db.raw
      .prepare(
        `SELECT pa.id, pa.platform, pa.rotation_order, pa.last_posted_at, pa.stagger_hours, pa.credential_ref
         FROM platform_accounts pa
         JOIN brands b ON b.id = pa.brand_id
         WHERE b.ecosystem_id = ?
           AND pa.active = 1
           AND pa.platform IN (${placeholders})
         ORDER BY
           CASE WHEN pa.last_posted_at IS NULL THEN 0 ELSE 1 END ASC,
           pa.last_posted_at ASC,
           pa.rotation_order ASC`,
      )
      .all(ecosystemId, ...platforms) as AccountRow[];

    const plan: PostingPlan[] = [];
    // Track per-platform: last scheduled time + count of accounts added
    const platformState = new Map<string, { lastScheduledAt: Date; count: number }>();

    for (const row of rows) {
      const state = platformState.get(row.platform);
      const accountsAdded = state?.count ?? 0;

      // Enforce no-identical-cross-account: skip if we've already hit maxAccountsPerPlatform
      if (accountsAdded >= maxAccountsPerPlatform) continue;

      // Determine scheduled time
      let scheduledAt: Date;
      if (!state) {
        // First account for this platform — post immediately (now)
        scheduledAt = new Date(now);
      } else {
        // Stagger from the last scheduled post for this platform
        const staggerMs = row.stagger_hours * 60 * 60 * 1000;
        scheduledAt = new Date(state.lastScheduledAt.getTime() + staggerMs);
      }

      plan.push({
        accountId: row.id,
        platform: row.platform,
        scheduledAt: scheduledAt.toISOString(),
        credentialRef: row.credential_ref,
      });

      platformState.set(row.platform, {
        lastScheduledAt: scheduledAt,
        count: accountsAdded + 1,
      });
    }

    return plan;
  }
}
