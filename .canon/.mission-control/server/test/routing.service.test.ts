import { describe, it, expect, beforeEach } from "vitest";
import { createDb, type Db } from "../db.js";
import { RoutingService, type PostingPlan } from "../services/routing.service.js";

let db: Db;
let svc: RoutingService;

beforeEach(() => {
  db = createDb(":memory:");
  svc = new RoutingService(db);
});

// Helper: seed a brand + account in platform_accounts
function seedAccount(opts: {
  id: number;
  ecosystemId: string;
  platform: string;
  rotationOrder: number;
  lastPostedAt: string | null;
  staggerHours: number;
  active: 1 | 0;
}) {
  // Ensure a brand exists for the ecosystem
  const brandId = `brand_${opts.ecosystemId}`;
  db.raw
    .prepare(`INSERT OR IGNORE INTO brands (id, name, ecosystem_id, email) VALUES (?, ?, ?, '')`)
    .run(brandId, opts.ecosystemId, opts.ecosystemId);

  db.raw
    .prepare(
      `INSERT INTO platform_accounts
         (id, brand_id, platform, handle, active, rotation_order, last_posted_at, stagger_hours, credential_ref)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      opts.id,
      brandId,
      opts.platform,
      `@handle_${opts.id}`,
      opts.active,
      opts.rotationOrder,
      opts.lastPostedAt,
      opts.staggerHours,
      `CRED_${opts.id}`,
    );
}

const NOW = new Date("2026-06-21T12:00:00.000Z");

describe("RoutingService.buildPlan", () => {
  it("returns empty plan when no active accounts exist", () => {
    seedAccount({ id: 1, ecosystemId: "viral", platform: "tiktok", rotationOrder: 0, lastPostedAt: null, staggerHours: 4, active: 0 });
    const plan = svc.buildPlan({ ecosystemId: "viral", assetId: "aq1", platforms: ["tiktok"] }, NOW);
    expect(plan).toHaveLength(0);
  });

  it("sorts active accounts by last_posted_at ASC (least-recently-posted first)", () => {
    seedAccount({ id: 1, ecosystemId: "viral", platform: "tiktok", rotationOrder: 1, lastPostedAt: "2026-06-21T10:00:00.000Z", staggerHours: 4, active: 1 });
    seedAccount({ id: 2, ecosystemId: "viral", platform: "tiktok", rotationOrder: 2, lastPostedAt: "2026-06-20T08:00:00.000Z", staggerHours: 4, active: 1 });
    const plan = svc.buildPlan({ ecosystemId: "viral", assetId: "aq1", platforms: ["tiktok"], maxAccountsPerPlatform: 2 }, NOW);
    // account 2 posted earlier (June 20), so it comes first
    expect(plan[0].accountId).toBe(2);
    expect(plan[1].accountId).toBe(1);
  });

  it("uses rotation_order as tiebreaker when last_posted_at is equal or both null", () => {
    seedAccount({ id: 1, ecosystemId: "viral", platform: "tiktok", rotationOrder: 2, lastPostedAt: null, staggerHours: 4, active: 1 });
    seedAccount({ id: 2, ecosystemId: "viral", platform: "tiktok", rotationOrder: 1, lastPostedAt: null, staggerHours: 4, active: 1 });
    const plan = svc.buildPlan({ ecosystemId: "viral", assetId: "aq1", platforms: ["tiktok"], maxAccountsPerPlatform: 2 }, NOW);
    // both null, so rotation_order decides: account 2 (order=1) first
    expect(plan[0].accountId).toBe(2);
    expect(plan[1].accountId).toBe(1);
  });

  it("staggers consecutive same-platform posts by stagger_hours", () => {
    seedAccount({ id: 1, ecosystemId: "viral", platform: "tiktok", rotationOrder: 1, lastPostedAt: null, staggerHours: 6, active: 1 });
    seedAccount({ id: 2, ecosystemId: "viral", platform: "tiktok", rotationOrder: 2, lastPostedAt: null, staggerHours: 6, active: 1 });
    const plan = svc.buildPlan({ ecosystemId: "viral", assetId: "aq1", platforms: ["tiktok"], maxAccountsPerPlatform: 2 }, NOW);
    expect(plan).toHaveLength(2);
    const t1 = new Date(plan[0].scheduledAt).getTime();
    const t2 = new Date(plan[1].scheduledAt).getTime();
    const diffHours = (t2 - t1) / (1000 * 60 * 60);
    // second post must be at least stagger_hours (6h) after the first
    expect(diffHours).toBeGreaterThanOrEqual(6);
  });

  it("enforces no-identical-cross-account: same asset, same platform, within stagger window → only first account scheduled", () => {
    // Both accounts have stagger_hours=24; posting same asset to two tiktok accounts
    // within 24h is the violation — only the first account should appear in the plan
    seedAccount({ id: 1, ecosystemId: "viral", platform: "tiktok", rotationOrder: 1, lastPostedAt: null, staggerHours: 24, active: 1 });
    seedAccount({ id: 2, ecosystemId: "viral", platform: "tiktok", rotationOrder: 2, lastPostedAt: null, staggerHours: 24, active: 1 });
    const plan = svc.buildPlan(
      { ecosystemId: "viral", assetId: "aq1", platforms: ["tiktok"], maxAccountsPerPlatform: 1 },
      NOW,
    );
    expect(plan).toHaveLength(1);
    expect(plan[0].accountId).toBe(1);
  });

  it("includes accounts across multiple platforms independently", () => {
    seedAccount({ id: 1, ecosystemId: "viral", platform: "tiktok", rotationOrder: 1, lastPostedAt: null, staggerHours: 4, active: 1 });
    seedAccount({ id: 2, ecosystemId: "viral", platform: "youtube", rotationOrder: 1, lastPostedAt: null, staggerHours: 4, active: 1 });
    seedAccount({ id: 3, ecosystemId: "viral", platform: "instagram", rotationOrder: 1, lastPostedAt: null, staggerHours: 4, active: 1 });
    const plan = svc.buildPlan({ ecosystemId: "viral", assetId: "aq1", platforms: ["tiktok", "youtube", "instagram"] }, NOW);
    expect(plan).toHaveLength(3);
    const platforms = plan.map((p) => p.platform).sort();
    expect(platforms).toEqual(["instagram", "tiktok", "youtube"]);
  });

  it("scopes to ecosystem — accounts from content do not appear in viral plan", () => {
    seedAccount({ id: 1, ecosystemId: "viral", platform: "tiktok", rotationOrder: 1, lastPostedAt: null, staggerHours: 4, active: 1 });
    seedAccount({ id: 2, ecosystemId: "content", platform: "tiktok", rotationOrder: 1, lastPostedAt: null, staggerHours: 4, active: 1 });
    const plan = svc.buildPlan({ ecosystemId: "viral", assetId: "aq1", platforms: ["tiktok"] }, NOW);
    // default maxAccountsPerPlatform=1 → exactly one slot; must be the viral account
    expect(plan).toHaveLength(1);
    expect(plan[0].accountId).toBe(1);
  });
});
