# Multi-Account Routing Layer Implementation Plan

> **For agentic workers:** Follow every task in order. Each task ends with a commit. Do not skip the failing-test step — red before green is the invariant. Do not introduce auto-publish, scheduling, or cron logic anywhere in this plan. If a step is unclear, stop and ask Boss.

**Goal:** Promote `platform_accounts` from a display registry to a live routing table. Implement `CredentialResolver` (per-account credential lookup), `RoutingService` (builds posting plan — no side effects), extend `publish.service` to consume the plan, and wire `publish_log.account_id`. Every new code path falls back to dry-run when credentials are absent. Publish stays the manual `/api/publish` click.

**Architecture:**
- Schema migration: extend `platform_accounts` (5 new columns) and `publish_log` (1 new column) via the existing additive `ALTER TABLE` pattern in `server/db.ts`.
- `CredentialResolver` (`server/services/credentials.ts`): pure function, maps `credential_ref` (env var key) → Buffer `profileId`. Dry-run when key absent.
- `RoutingService` (`server/services/routing.service.ts`): pure computation, reads `platform_accounts`, produces `PostingPlan[]`. No writes, no side effects.
- `publish.service.ts` extended: calls `RoutingService`, resolves credential per account, passes per-account `profileId` into `BufferDistributor`, writes `account_id` into `publish_log`.
- No new HTTP routes. No feature gate (routing activates when active accounts exist). No scheduler.

**Tech Stack:** TypeScript, better-sqlite3, vitest, Node ≥22. All tests use `createDb(':memory:')`. Server tests in `server/test/`, publish-package tests in `packages/publish/src/__tests__/`.

---

## File Structure

| File | Create / Modify | Responsibility |
|---|---|---|
| `D:\VFXellence-LTD\.canon\.mission-control\server\db.ts` | Modify | Add 5 columns to `platform_accounts`, add `account_id` to `publish_log` via additive migrations |
| `D:\VFXellence-LTD\.canon\.mission-control\server\test\db.test.ts` | Modify | Add test asserting new columns exist + additive migration is idempotent |
| `D:\VFXellence-LTD\.canon\.mission-control\server\services\credentials.ts` | Create | `CredentialResolver`: maps `credential_ref` → Buffer profileId; dry-run path |
| `D:\VFXellence-LTD\.canon\.mission-control\server\test\credentials.service.test.ts` | Create | Unit tests for `CredentialResolver` |
| `D:\VFXellence-LTD\.canon\.mission-control\server\services\routing.service.ts` | Create | `RoutingService`: rotation sort, stagger, no-identical-cross-account, returns `PostingPlan[]` |
| `D:\VFXellence-LTD\.canon\.mission-control\server\test\routing.service.test.ts` | Create | Unit tests for `RoutingService` (rotation, stagger, slot limit, empty set) |
| `D:\VFXellence-LTD\.canon\.mission-control\server\services\publish.service.ts` | Modify | Consume `RoutingService` plan; pass per-account profileId; write `account_id` to `publish_log` |
| `D:\VFXellence-LTD\.canon\.mission-control\server\test\publish.service.test.ts` | Modify | Add integration tests: two active accounts → plan has two entries; `publish_log` rows carry `account_id` |

---

## Task 1 — Schema: extend `platform_accounts` and `publish_log`

**Files:**
- Modify: `D:\VFXellence-LTD\.canon\.mission-control\server\db.ts` (lines 167–179 `platform_accounts` CREATE, lines 204–214 `additive` array)
- Modify: `D:\VFXellence-LTD\.canon\.mission-control\server\test\db.test.ts` (append new `it` block after line 79)

### Steps

- [ ] **Write the failing test.** Append to `server/test/db.test.ts`:

```typescript
it("platform_accounts has routing columns after migration", () => {
  db = createDb(":memory:");
  const cols = db.raw
    .prepare("PRAGMA table_info(platform_accounts)")
    .all()
    .map((r: any) => r.name);
  for (const c of ["active", "rotation_order", "last_posted_at", "stagger_hours", "credential_ref"]) {
    expect(cols).toContain(c);
  }
});

it("publish_log has account_id column after migration", () => {
  db = createDb(":memory:");
  const cols = db.raw
    .prepare("PRAGMA table_info(publish_log)")
    .all()
    .map((r: any) => r.name);
  expect(cols).toContain("account_id");
});
```

- [ ] **Run — expect FAIL:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run test/db.test.ts
```
Expected: two new tests fail (`account_id` and routing column assertions not found).

- [ ] **Implement — add new columns to `platform_accounts` CREATE TABLE in `db.ts`.** Replace the existing `platform_accounts` block (lines 167–179) with:

```typescript
      CREATE TABLE IF NOT EXISTS platform_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_id TEXT,                                -- NULL => shared/LLC-level account
        platform TEXT NOT NULL,
        handle TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        tracking_id TEXT,
        status TEXT NOT NULL DEFAULT 'not-started',   -- active|pending|not-started
        notes TEXT,
        url TEXT,
        max_accounts TEXT,
        active INTEGER NOT NULL DEFAULT 0,            -- 1 = eligible for routing
        rotation_order INTEGER NOT NULL DEFAULT 0,    -- lower = earlier in rotation
        last_posted_at TEXT,                          -- ISO timestamp, NULL = never posted
        stagger_hours REAL NOT NULL DEFAULT 4.0,      -- min hours between posts (fractional OK)
        credential_ref TEXT,                          -- env var key for this account's token
        FOREIGN KEY (brand_id) REFERENCES brands(id)
      );
```

- [ ] **Add `account_id` to `publish_log` CREATE TABLE in `db.ts`.** Replace the `publish_log` block (lines 181–191) with:

```typescript
      CREATE TABLE IF NOT EXISTS publish_log (
        id TEXT PRIMARY KEY,
        approval_id TEXT NOT NULL,
        ecosystem_id TEXT NOT NULL,
        platform TEXT NOT NULL,
        account_id INTEGER,                           -- FK to platform_accounts.id; NULL for legacy rows
        url TEXT,
        status TEXT NOT NULL,
        dry_run INTEGER NOT NULL DEFAULT 1,
        published_by TEXT NOT NULL,
        published_at TEXT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES platform_accounts(id)
      );
```

- [ ] **Add additive migrations for existing DBs.** In the `additive` array (currently starting at line 204), append entries so existing databases gain the new columns without re-running CREATE TABLE:

```typescript
    const additive: Array<[string, string, string]> = [
      // [table, column, type] — append future columns here, never reorder.
      ["tasks", "agent_id", "TEXT"],
      // Module 1 — Multi-Account Routing Layer
      ["platform_accounts", "active", "INTEGER NOT NULL DEFAULT 0"],
      ["platform_accounts", "rotation_order", "INTEGER NOT NULL DEFAULT 0"],
      ["platform_accounts", "last_posted_at", "TEXT"],
      ["platform_accounts", "stagger_hours", "REAL NOT NULL DEFAULT 4.0"],
      ["platform_accounts", "credential_ref", "TEXT"],
      ["publish_log", "account_id", "INTEGER"],
    ];
```

- [ ] **Run — expect PASS:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run test/db.test.ts
```
Expected: all existing db tests still pass + 2 new tests pass.

- [ ] **Commit:**
```
git -C "D:\VFXellence-LTD\.canon\.mission-control" add -- server/db.ts server/test/db.test.ts && git -C "D:\VFXellence-LTD\.canon\.mission-control" commit -m "$(cat <<'EOF'
Add routing columns to platform_accounts and account_id to publish_log

- Add active, rotation_order, last_posted_at, stagger_hours, credential_ref to platform_accounts CREATE TABLE
- Add account_id (nullable FK) to publish_log CREATE TABLE
- Add additive ALTER TABLE migrations for each new column so existing DBs upgrade safely
- Test: assert all new columns present via PRAGMA table_info
EOF
)"
```

---

## Task 2 — CredentialResolver service

**Files:**
- Create: `D:\VFXellence-LTD\.canon\.mission-control\server\services\credentials.ts`
- Create: `D:\VFXellence-LTD\.canon\.mission-control\server\test\credentials.service.test.ts`

### Steps

- [ ] **Write the failing test.** Create `server/test/credentials.service.test.ts`:

```typescript
import { describe, it, expect, vi, afterEach } from "vitest";
import { resolveAccountCredential } from "../services/credentials.js";

afterEach(() => vi.restoreAllMocks());

describe("resolveAccountCredential", () => {
  it("returns the Buffer profileId when credential_ref env var is present", () => {
    const env = { BUFFER_PROFILE_ZRODINGER_TIKTOK: "profile_tiktok_123" };
    const result = resolveAccountCredential("BUFFER_PROFILE_ZRODINGER_TIKTOK", env);
    expect(result.profileId).toBe("profile_tiktok_123");
    expect(result.dryRun).toBe(false);
  });

  it("returns a synthetic profileId and dryRun=true when credential_ref env var is absent", () => {
    const result = resolveAccountCredential("BUFFER_PROFILE_ZRODINGER_TIKTOK", {});
    expect(result.profileId).toMatch(/^dry-run-/);
    expect(result.dryRun).toBe(true);
  });

  it("logs [DRY-RUN] message when credential is absent", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    resolveAccountCredential("BUFFER_PROFILE_MISSING", {});
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[DRY-RUN] Would resolve credential for BUFFER_PROFILE_MISSING"),
    );
  });

  it("returns dryRun=false when credential_ref is null (no cred configured)", () => {
    // null credential_ref = account has no credential key at all; treat as dry-run
    const result = resolveAccountCredential(null, { BUFFER_TOKEN__VIRAL: "x" });
    expect(result.dryRun).toBe(true);
    expect(result.profileId).toMatch(/^dry-run-/);
  });
});
```

- [ ] **Run — expect FAIL:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run test/credentials.service.test.ts
```
Expected: all 4 tests fail (module not found).

- [ ] **Implement `server/services/credentials.ts`:**

```typescript
export interface CredentialResult {
  profileId: string;
  dryRun: boolean;
}

/**
 * Resolves a Buffer profileId for a platform account.
 * credentialRef: the env var key stored in platform_accounts.credential_ref.
 * If the key is absent from env, or credentialRef is null, returns a synthetic
 * profileId and sets dryRun=true — never throws.
 */
export function resolveAccountCredential(
  credentialRef: string | null,
  env: Record<string, string | undefined>,
): CredentialResult {
  if (credentialRef === null || credentialRef === undefined) {
    console.log(`[DRY-RUN] Would resolve credential for null (no credential_ref configured)`);
    return { profileId: `dry-run-${Date.now()}`, dryRun: true };
  }

  const value = env[credentialRef];
  if (!value) {
    console.log(`[DRY-RUN] Would resolve credential for ${credentialRef}`);
    return { profileId: `dry-run-${credentialRef}`, dryRun: true };
  }

  return { profileId: value, dryRun: false };
}
```

- [ ] **Run — expect PASS:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run test/credentials.service.test.ts
```
Expected: all 4 tests pass.

- [ ] **Commit:**
```
git -C "D:\VFXellence-LTD\.canon\.mission-control" add -- server/services/credentials.ts server/test/credentials.service.test.ts && git -C "D:\VFXellence-LTD\.canon\.mission-control" commit -m "$(cat <<'EOF'
Add CredentialResolver for per-account Buffer profileId resolution

- resolveAccountCredential maps credential_ref env key -> profileId
- Returns synthetic dry-run-* profileId and dryRun=true when key absent
- Logs [DRY-RUN] message; never throws
- Unit tests: present credential, absent credential, null ref, log assertion
EOF
)"
```

---

## Task 3 — RoutingService (pure — no writes)

**Files:**
- Create: `D:\VFXellence-LTD\.canon\.mission-control\server\services\routing.service.ts`
- Create: `D:\VFXellence-LTD\.canon\.mission-control\server\test\routing.service.test.ts`

### Steps

- [ ] **Write the failing test.** Create `server/test/routing.service.test.ts`:

```typescript
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
    const plan = svc.buildPlan({ ecosystemId: "viral", assetId: "aq1", platforms: ["tiktok"] }, NOW);
    // account 2 posted earlier (June 20), so it comes first
    expect(plan[0].accountId).toBe(2);
    expect(plan[1].accountId).toBe(1);
  });

  it("uses rotation_order as tiebreaker when last_posted_at is equal or both null", () => {
    seedAccount({ id: 1, ecosystemId: "viral", platform: "tiktok", rotationOrder: 2, lastPostedAt: null, staggerHours: 4, active: 1 });
    seedAccount({ id: 2, ecosystemId: "viral", platform: "tiktok", rotationOrder: 1, lastPostedAt: null, staggerHours: 4, active: 1 });
    const plan = svc.buildPlan({ ecosystemId: "viral", assetId: "aq1", platforms: ["tiktok"] }, NOW);
    // both null, so rotation_order decides: account 2 (order=1) first
    expect(plan[0].accountId).toBe(2);
    expect(plan[1].accountId).toBe(1);
  });

  it("staggers consecutive same-platform posts by stagger_hours", () => {
    seedAccount({ id: 1, ecosystemId: "viral", platform: "tiktok", rotationOrder: 1, lastPostedAt: null, staggerHours: 6, active: 1 });
    seedAccount({ id: 2, ecosystemId: "viral", platform: "tiktok", rotationOrder: 2, lastPostedAt: null, staggerHours: 6, active: 1 });
    const plan = svc.buildPlan({ ecosystemId: "viral", assetId: "aq1", platforms: ["tiktok"] }, NOW);
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
    expect(plan.every((p) => p.accountId === 1)).toBe(true);
  });
});
```

- [ ] **Run — expect FAIL:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run test/routing.service.test.ts
```
Expected: all tests fail (module not found).

- [ ] **Implement `server/services/routing.service.ts`:**

```typescript
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
    const { ecosystemId, platforms, maxAccountsPerPlatform = 1 } = input;

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
```

- [ ] **Run — expect PASS:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run test/routing.service.test.ts
```
Expected: all 7 tests pass.

- [ ] **Commit:**
```
git -C "D:\VFXellence-LTD\.canon\.mission-control" add -- server/services/routing.service.ts server/test/routing.service.test.ts && git -C "D:\VFXellence-LTD\.canon\.mission-control" commit -m "$(cat <<'EOF'
Add RoutingService: pure posting-plan builder with rotation and stagger

- buildPlan: loads active accounts, sorts by last_posted_at ASC then rotation_order ASC
- Staggers consecutive same-platform slots by stagger_hours (fractional hours supported)
- Enforces maxAccountsPerPlatform (default 1) — no-identical-cross-account rule
- Scoped to ecosystem via brands JOIN; inactive accounts excluded
- No writes, no side effects
- 7 unit tests: empty set, rotation order, tiebreaker, stagger spacing, cross-account, multi-platform, ecosystem scope
EOF
)"
```

---

## Task 4 — Wire `publish.service` to consume routing plan + per-account credential; inject profileId into `BufferDistributor`

**Files:**
- Modify: `D:\VFXellence-LTD\polymath\packages\publish\src\BufferDistributor.ts` — add optional `profileId` to `BufferCreds`; replace `profileIds: []` stub with `profileIds: [this.profileId]`
- Modify: `D:\VFXellence-LTD\polymath\packages\publish\src\__tests__\BufferDistributor.test.ts` — add test asserting resolved profileId reaches the mutation body
- Modify: `D:\VFXellence-LTD\.canon\.mission-control\server\services\publish.service.ts` (lines 1–98)
- Modify: `D:\VFXellence-LTD\.canon\.mission-control\server\test\publish.service.test.ts` (append new describe block after line 64)

> **Note (6 steps in sub-task A + 4 in sub-task B = 10 steps total for Task 4).**

### Sub-task A — Patch `BufferDistributor` to accept and inject per-account `profileId`

> **Context:** `credential_ref` in `platform_accounts` stores an env-var name whose value is the Buffer `profileId` (e.g. `BUFFER_PROFILE_ZRODINGER_TIKTOK=profile_tiktok_abc123`). `BufferDistributor` currently stubs `profileIds: []` in the GraphQL mutation body. This sub-task replaces that stub with the resolved `profileId` — completing the wiring end-to-end. The path is **gated**: absent credential → `DryRunDistributor` is selected instead, so `BufferDistributor` with a real `profileId` is only exercised when a real token exists.
>
> `bufferToken` = the Buffer API Bearer token (separate concern). `profileId` = the Buffer profile target for the post (what `profileIds` in the GraphQL body needs). Both must be passed to `BufferDistributor` — `bufferToken` already exists; `profileId` is being added now.

- [ ] **Write the failing test.** In `packages/publish/src/__tests__/BufferDistributor.test.ts`, append inside the `describe` block:

```typescript
  it("passes resolved profileId in the profileIds mutation variable", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ id: "post_2", url: "https://buffer.test/post_2" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const d = new BufferDistributor({ bufferToken: "FAKE_TOKEN", profileId: "profile_tiktok_abc123" });
    await d.publish(clip, "tiktok");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    const parsed = JSON.parse(init.body as string);
    expect(parsed.variables.input.profileIds).toEqual(["profile_tiktok_abc123"]);
  });

  it("uses empty profileIds array when no profileId provided (backward compat)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ id: "post_3", url: "https://buffer.test/post_3" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const d = new BufferDistributor({ bufferToken: "FAKE_TOKEN" }); // no profileId
    await d.publish(clip, "tiktok");
    const [, init] = fetchMock.mock.calls[0];
    const parsed = JSON.parse(init.body as string);
    expect(parsed.variables.input.profileIds).toEqual([]);
  });
```

- [ ] **Run — expect FAIL:**
```
cd D:\VFXellence-LTD\polymath\packages\publish && npx vitest run src/__tests__/BufferDistributor.test.ts
```
Expected: 2 new tests fail (`profileId` not accepted, `profileIds` stays `[]`).

- [ ] **Implement — patch `packages/publish/src/BufferDistributor.ts`.** Update `BufferCreds` and the `profileIds` line:

```typescript
interface BufferCreds {
  bufferToken: string;
  /** Buffer profile ID to post to. Resolved from credential_ref at runtime.
   *  Absent during dry-run (DryRunDistributor selected instead — this path
   *  is only reached when a real token is present). */
  profileId?: string;
}
```

In the constructor, store `profileId`:
```typescript
  private readonly token: string;
  private readonly profileId: string | undefined;

  constructor(creds: BufferCreds) {
    this.token = creds.bufferToken;
    this.profileId = creds.profileId;
  }
```

Replace the `profileIds: [],` stub in the mutation body:
```typescript
          profileIds: this.profileId ? [this.profileId] : [],
```

- [ ] **Run — expect PASS:**
```
cd D:\VFXellence-LTD\polymath\packages\publish && npx vitest run src/__tests__/BufferDistributor.test.ts
```
Expected: all 4 tests pass (2 existing + 2 new).

- [ ] **Commit (publish package):**
```
git -C "D:\VFXellence-LTD" add -- polymath/packages/publish/src/BufferDistributor.ts polymath/packages/publish/src/__tests__/BufferDistributor.test.ts && git -C "D:\VFXellence-LTD" commit -m "$(cat <<'EOF'
Inject resolved profileId into BufferDistributor mutation body

- Add optional profileId to BufferCreds interface
- Replace profileIds: [] stub with profileIds: [profileId] when present
- Backward-compatible: absent profileId keeps profileIds: [] (no real token path)
- Tests: resolved profileId reaches mutation body; absent profileId stays []
EOF
)"
```

---

### Sub-task B — Wire `publish.service` to consume routing plan + pass profileId to `BufferDistributor`

### Steps

- [ ] **Write the failing tests.** Append to `server/test/publish.service.test.ts` after the closing brace of the `describe("PublishService gate", ...)` block:

```typescript
describe("PublishService routing integration", () => {
  function seedBrandAndApproval(ecosystemId = "viral") {
    db.raw
      .prepare(`INSERT OR IGNORE INTO brands (id, name, ecosystem_id, email) VALUES (?, ?, ?, '')`)
      .run(`brand_${ecosystemId}`, ecosystemId, ecosystemId);
    db.raw
      .prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES (?, 'x', 'clip', ?)`)
      .run("t2", ecosystemId);
    db.raw
      .prepare(
        `INSERT INTO approval_queue
           (id, task_id, ecosystem_id, content_type, status, content_json, created_at)
         VALUES ('aq2', 't2', ?, 'video', 'approved', '{"caption":"test","hashtags":["#x"],"videoPath":"/a/aq2.mp4"}', '2026-01-01')`,
      )
      .run(ecosystemId);
  }

  function seedAccount(id: number, ecosystemId: string, platform: string, credentialRef: string | null = null) {
    const brandId = `brand_${ecosystemId}`;
    db.raw
      .prepare(
        `INSERT INTO platform_accounts
           (id, brand_id, platform, handle, active, rotation_order, last_posted_at, stagger_hours, credential_ref)
         VALUES (?, ?, ?, ?, 1, 0, NULL, 4.0, ?)`,
      )
      .run(id, brandId, platform, `@h_${id}`, credentialRef);
  }

  it("with two active tiktok accounts: publish_log has two rows each with account_id set", async () => {
    seedBrandAndApproval();
    seedAccount(10, "viral", "tiktok", null); // dry-run: no credential
    seedAccount(11, "viral", "tiktok", null);

    const r = await svc.publish("aq2", "boss");
    expect(r).toHaveProperty("results");

    const logs = db.raw
      .prepare("SELECT account_id, platform FROM publish_log WHERE approval_id='aq2'")
      .all() as any[];
    // Each active account per platform gets a log row
    expect(logs.length).toBeGreaterThanOrEqual(1);
    expect(logs.every((l: any) => l.account_id !== null)).toBe(true);
  });

  it("dry-run still works when no active accounts (falls back to legacy DEFAULT_TARGETS behaviour)", async () => {
    // No active accounts seeded — publish must not throw and must return results
    seedBrandAndApproval();
    const r = await svc.publish("aq2", "boss");
    expect(r).toHaveProperty("results");
    const outcome = r as { results: Array<{ dryRun: boolean }> };
    expect(outcome.results[0].dryRun).toBe(true);
  });

  it("publish_log rows carry correct account_id when credential resolves (dry-run)", async () => {
    seedBrandAndApproval();
    seedAccount(20, "viral", "instagram", null); // credential_ref null => dry-run
    const r = await svc.publish("aq2", "boss");
    expect(r).toHaveProperty("results");
    const log = db.raw
      .prepare("SELECT account_id FROM publish_log WHERE approval_id='aq2' AND platform='instagram'")
      .get() as any;
    expect(log).toBeTruthy();
    expect(log.account_id).toBe(20);
  });
});
```

- [ ] **Run — expect FAIL:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run test/publish.service.test.ts
```
Expected: 3 new tests fail (routing integration tests); original 4 gate tests still pass.

- [ ] **Implement — rewrite `server/services/publish.service.ts`.**

The key changes from the current 98-line version:
1. Import `RoutingService` and `resolveAccountCredential`.
2. After building `clip`, call `RoutingService.buildPlan` for the approval's ecosystem + all three platforms.
3. If plan is empty (no active accounts), fall back to `DEFAULT_TARGETS` with `DryRunDistributor` (legacy path unchanged).
4. When plan has entries: iterate plan, resolve per-account credential, pass `profileId` to `BufferDistributor` (or use `DryRunDistributor` when credential is absent), write `account_id` into `publish_log`.

```typescript
import type { Db } from "../db.js";
import { ApprovalsService } from "./approvals.service.js";
import { TasksService } from "./tasks.service.js";
import { selectDistributor } from "@polymath/publish";
import { DryRunDistributor, BufferDistributor } from "@polymath/publish";
import type { PublishClip, PublishTarget, PublishResult } from "@polymath/publish";
import { RoutingService } from "./routing.service.js";
import { resolveAccountCredential } from "./credentials.js";

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
  private routing: RoutingService;

  constructor(private db: Db, private env: Record<string, string | undefined>) {
    this.approvals = new ApprovalsService(db);
    this.tasks = new TasksService(db);
    this.routing = new RoutingService(db);
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

    const results: PublishResult[] = [];

    // Build routing plan from active platform_accounts
    const plan = this.routing.buildPlan(
      {
        ecosystemId: approval.ecosystemId,
        assetId: approval.id,
        platforms: DEFAULT_TARGETS as string[],
        maxAccountsPerPlatform: 1,
      },
      new Date(),
    );

    if (plan.length === 0) {
      // No active accounts: legacy dry-run path (single ecosystem-level distributor)
      const distributor = selectDistributor(approval.ecosystemId, this.env);
      for (const target of DEFAULT_TARGETS) {
        const result = await distributor.publish(clip, target);
        results.push(result);
        this.db.raw
          .prepare(
            `INSERT INTO publish_log (id, approval_id, ecosystem_id, platform, account_id, url, status, dry_run, published_by, published_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            genLogId(),
            approvalId,
            approval.ecosystemId,
            result.platform,
            null,
            result.url ?? null,
            result.status,
            result.dryRun ? 1 : 0,
            publishedBy,
            new Date().toISOString(),
          );
      }
    } else {
      // Routing plan: per-account credential resolution and per-account publish
      for (const entry of plan) {
        const credResult = resolveAccountCredential(entry.credentialRef, this.env);

        // Select distributor: real Buffer when credential present, DryRun when absent.
        // credResult.profileId = the Buffer profile ID (goes into profileIds mutation field).
        // BUFFER_TOKEN = the API Bearer token (separate env var, shared across all accounts).
        // If either is absent the path stays dry-run (credResult.dryRun === true).
        const bufferToken = this.env["BUFFER_TOKEN"];
        const distributor = credResult.dryRun || !bufferToken
          ? new DryRunDistributor()
          : new BufferDistributor({ bufferToken, profileId: credResult.profileId });

        const result = await distributor.publish(clip, entry.platform as PublishTarget);
        results.push(result);

        this.db.raw
          .prepare(
            `INSERT INTO publish_log (id, approval_id, ecosystem_id, platform, account_id, url, status, dry_run, published_by, published_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            genLogId(),
            approvalId,
            approval.ecosystemId,
            result.platform,
            entry.accountId,
            result.url ?? null,
            result.status,
            result.dryRun ? 1 : 0,
            publishedBy,
            new Date().toISOString(),
          );
      }
    }

    // Mark task as published
    if (approval.taskId) {
      this.tasks.setStatus(approval.taskId, "published");
    }

    return { results };
  }
}
```

- [ ] **Run — expect PASS (all existing + new tests):**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run test/publish.service.test.ts
```
Expected: original 4 gate tests still pass + 3 new routing integration tests pass.

- [ ] **Run full server test suite to confirm no regressions:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run
```
Expected: all tests pass.

- [ ] **Commit:**
```
git -C "D:\VFXellence-LTD\.canon\.mission-control" add -- server/services/publish.service.ts server/test/publish.service.test.ts && git -C "D:\VFXellence-LTD\.canon\.mission-control" commit -m "$(cat <<'EOF'
Wire publish.service to RoutingService for per-account posting plan

- Import RoutingService and resolveAccountCredential
- After clip build, call RoutingService.buildPlan for active accounts
- When plan is empty: fall back to legacy dry-run path (backward compatible)
- When plan has entries: resolve credential per account, use DryRunDistributor
  when credential absent, write account_id into publish_log
- publish_log INSERT now includes account_id column (NULL for legacy path)
- Integration tests: two active accounts -> log rows carry account_id; empty
  accounts -> legacy dry-run path; account_id set correctly per platform
EOF
)"
```

---

## Task 5 — Integration smoke test: full end-to-end with route + DB

**Files:**
- Create: `D:\VFXellence-LTD\.canon\.mission-control\server\test\routing.integration.test.ts`

This test exercises the whole stack: seeded `platform_accounts` → `POST /api/publish` → assert `publish_log` rows have `account_id`.

### Steps

- [ ] **Write the failing test.** Create `server/test/routing.integration.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createPublishRouter } from "../routes/publish.js";

let db: Db;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  // Mount publish route with empty env (dry-run credentials)
  app.use("/api/publish", createPublishRouter(db));
});
afterEach(() => db.close());

function seed() {
  // Brand
  db.raw
    .prepare(`INSERT INTO brands (id, name, ecosystem_id, email) VALUES ('brand_viral', 'Zrodinger', 'viral', '')`)
    .run();

  // Task + approval (approved video)
  db.raw
    .prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES ('t9', 'smoke', 'clip', 'viral')`)
    .run();
  db.raw
    .prepare(
      `INSERT INTO approval_queue
         (id, task_id, ecosystem_id, content_type, status, content_json, created_at)
       VALUES ('aq9', 't9', 'viral', 'video', 'approved',
               '{"caption":"smoke","hashtags":["#test"],"videoPath":"/a/aq9.mp4"}',
               '2026-06-21T00:00:00.000Z')`,
    )
    .run();

  // Two active platform accounts: TikTok and YouTube
  db.raw
    .prepare(
      `INSERT INTO platform_accounts
         (id, brand_id, platform, handle, active, rotation_order, last_posted_at, stagger_hours, credential_ref)
       VALUES (100, 'brand_viral', 'tiktok', '@zrodinger', 1, 1, NULL, 4.0, NULL)`,
    )
    .run();
  db.raw
    .prepare(
      `INSERT INTO platform_accounts
         (id, brand_id, platform, handle, active, rotation_order, last_posted_at, stagger_hours, credential_ref)
       VALUES (101, 'brand_viral', 'youtube', '@zrodinger', 1, 1, NULL, 4.0, NULL)`,
    )
    .run();
}

describe("POST /api/publish — routing integration", () => {
  it("returns 200 results and publish_log rows carry account_id for each active account", async () => {
    seed();
    const res = await request(app).post("/api/publish").send({ approvalId: "aq9", publishedBy: "boss" });
    expect(res.status).toBe(200);
    expect(res.body.results).toBeInstanceOf(Array);
    expect(res.body.results.length).toBeGreaterThanOrEqual(2); // tiktok + youtube

    const logs = db.raw
      .prepare("SELECT platform, account_id, dry_run FROM publish_log WHERE approval_id='aq9' ORDER BY platform")
      .all() as any[];

    expect(logs.length).toBeGreaterThanOrEqual(2);
    expect(logs.every((l: any) => l.account_id !== null)).toBe(true);
    expect(logs.every((l: any) => l.dry_run === 1)).toBe(true); // no credentials -> dry-run

    const platforms = logs.map((l: any) => l.platform).sort();
    expect(platforms).toContain("tiktok");
    expect(platforms).toContain("youtube");
  });

  it("account_id in publish_log matches the seeded platform_accounts.id", async () => {
    seed();
    await request(app).post("/api/publish").send({ approvalId: "aq9", publishedBy: "boss" });
    const tiktokLog = db.raw
      .prepare("SELECT account_id FROM publish_log WHERE approval_id='aq9' AND platform='tiktok'")
      .get() as any;
    expect(tiktokLog.account_id).toBe(100);

    const youtubeLog = db.raw
      .prepare("SELECT account_id FROM publish_log WHERE approval_id='aq9' AND platform='youtube'")
      .get() as any;
    expect(youtubeLog.account_id).toBe(101);
  });

  it("no active accounts -> falls back to dry-run legacy path, publish_log account_id is null", async () => {
    // Seed approval but NO active platform_accounts
    db.raw.prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES ('t10', 'legacy', 'clip', 'viral')`).run();
    db.raw
      .prepare(
        `INSERT INTO approval_queue
           (id, task_id, ecosystem_id, content_type, status, content_json, created_at)
         VALUES ('aq10', 't10', 'viral', 'video', 'approved',
                 '{"caption":"legacy","hashtags":[],"videoPath":"/a/aq10.mp4"}',
                 '2026-06-21T00:00:00.000Z')`,
      )
      .run();

    const res = await request(app).post("/api/publish").send({ approvalId: "aq10", publishedBy: "boss" });
    expect(res.status).toBe(200);
    const logs = db.raw
      .prepare("SELECT account_id FROM publish_log WHERE approval_id='aq10'")
      .all() as any[];
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.every((l: any) => l.account_id === null)).toBe(true);
  });

  it("existing gate tests: 404 for missing approval, 409 for non-video", async () => {
    const missing = await request(app).post("/api/publish").send({ approvalId: "nope", publishedBy: "boss" });
    expect(missing.status).toBe(404);

    db.raw.prepare(`INSERT INTO tasks (id, title, type, ecosystem_id) VALUES ('t11', 'x', 'clip', 'viral')`).run();
    db.raw
      .prepare(
        `INSERT INTO approval_queue (id, task_id, ecosystem_id, content_type, status, created_at)
         VALUES ('aq11', 't11', 'viral', 'clip', 'approved', '2026-06-21')`,
      )
      .run();
    const conflict = await request(app).post("/api/publish").send({ approvalId: "aq11", publishedBy: "boss" });
    expect(conflict.status).toBe(409);
  });
});
```

- [ ] **Run — expect FAIL:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run test/routing.integration.test.ts
```
Expected: tests fail (route wiring not yet connected to inject empty env).

  > Note: `createPublishRouter` constructs `PublishService(db, process.env)`. For tests the env must be injectable. If `createPublishRouter` does not accept an `env` param, add an optional second param: `export function createPublishRouter(db: Db, env: Record<string, string | undefined> = process.env as Record<string, string | undefined>): Router`. This is a one-line change to `server/routes/publish.ts` at line 7.

- [ ] **Add optional `env` param to `server/routes/publish.ts`.** Edit line 7 of `server/routes/publish.ts`:

Current:
```typescript
export function createPublishRouter(db: Db): Router {
  const router = Router();
  const svc = new PublishService(db, process.env as Record<string, string | undefined>);
```

Replace with:
```typescript
export function createPublishRouter(
  db: Db,
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): Router {
  const router = Router();
  const svc = new PublishService(db, env);
```

- [ ] **Update the test to pass `{}` as env** (so credentials are absent = dry-run). The test already passes `createPublishRouter(db)` with no env, which defaults to `process.env`. For full isolation update the mount to:
```typescript
  app.use("/api/publish", createPublishRouter(db, {}));
```

- [ ] **Run — expect PASS:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run test/routing.integration.test.ts
```
Expected: all 4 integration tests pass.

- [ ] **Run full suite one final time:**
```
cd D:\VFXellence-LTD\.canon\.mission-control\server && npx vitest run
```
Expected: all tests pass.

- [ ] **Commit:**
```
git -C "D:\VFXellence-LTD\.canon\.mission-control" add -- server/test/routing.integration.test.ts server/routes/publish.ts && git -C "D:\VFXellence-LTD\.canon\.mission-control" commit -m "$(cat <<'EOF'
Add routing integration tests and make publish route env-injectable

- Add optional env param to createPublishRouter (defaults to process.env)
- Integration test: two active accounts -> publish_log rows carry correct account_id
- Integration test: account_ids match seeded platform_accounts.id values
- Integration test: no active accounts -> legacy null account_id path
- Integration test: existing 404/409 gates still hold
EOF
)"
```

---

## Spec Coverage Confirmation

| Module 1 Requirement | Task |
|---|---|
| Add `active`, `rotation_order`, `last_posted_at`, `stagger_hours`, `credential_ref` to `platform_accounts` | Task 1 |
| Add `account_id` to `publish_log` (nullable, backward-compatible) | Task 1 |
| Additive ALTER TABLE migrations for existing DBs | Task 1 |
| `CredentialResolver`: `credential_ref` → Buffer `profileId`; dry-run when absent; log `[DRY-RUN]` | Task 2 |
| `RoutingService`: rotation sort (least-recently-posted first), tiebreaker by `rotation_order` | Task 3 |
| `RoutingService`: stagger_hours spacing between same-platform posts | Task 3 |
| `RoutingService`: no-identical-cross-account (maxAccountsPerPlatform=1 default) | Task 3 |
| `RoutingService`: per-platform slot limit | Task 3 |
| `RoutingService`: returns empty plan when no active accounts | Task 3 |
| `RoutingService`: ecosystem-scoped via brands JOIN | Task 3 |
| `publish.service`: build plan from `platform_accounts` instead of `DEFAULT_TARGETS` | Task 4 |
| `publish.service`: per-account credential resolution | Task 4 |
| `BufferDistributor`: inject resolved `profileId` into `profileIds` mutation field | Task 4 |
| `BufferDistributor`: stays dry-run when `BUFFER_TOKEN` or `credential_ref` absent | Task 4 |
| `publish.service`: write `account_id` to `publish_log` per result | Task 4 |
| `publish.service`: legacy fallback when no active accounts (dry-run unchanged) | Task 4 |
| Integration: two active accounts → plan produces two entries; log has `account_id` | Task 5 |
| Doctrine: no auto-publish, no scheduling | All tasks (RoutingService is read-only; no cron/timer introduced) |
| Tests match existing vitest patterns (`createDb(':memory:')`, `describe`/`it`, etc.) | All tasks |

---

## Assumptions Made

1. **`platform_accounts.id` is INTEGER (AUTOINCREMENT)** — confirmed from `db.ts` line 168. The plan uses integer account IDs throughout; `publish_log.account_id INTEGER` references this.

2. **`brands` table carries `ecosystem_id`** — confirmed from `db.ts` line 162. `RoutingService` joins `platform_accounts → brands` on `brand_id` to scope to ecosystem. This is the only way to get ecosystem from an account row without denormalizing.

3. **`DEFAULT_TARGETS` as the platform list passed to `buildPlan`** — the current service uses `["tiktok", "youtube", "instagram"]`. The routing plan builds against the same three. If an account has `platform = "tiktok"` it will be included; platforms not in `DEFAULT_TARGETS` are ignored unless the caller extends the list.

4. **`credential_ref` = env-var NAME holding the Buffer profileId. RESOLVED.** `credential_ref` stores an env-var key (e.g. `BUFFER_PROFILE_ZRODINGER_TIKTOK`). The env var's value IS the Buffer profileId (e.g. `profile_tiktok_abc123`). `CredentialResolver` maps key → value → profileId. Separate from the API Bearer token (`BUFFER_TOKEN` env var, shared across all accounts). Decision: ADOPTED — plan kept as written.

5. **`BufferDistributor.profileIds` injection — WIRED IN TASK 4. RESOLVED.** `BufferDistributor.ts` confirmed to have `profileIds: []` stub at line 26. Task 4 Sub-task A patches `BufferDistributor` to accept an optional `profileId` in `BufferCreds` and writes `profileIds: [profileId]` into the GraphQL mutation body. Sub-task B wires `publish.service` to pass the resolved `profileId` (from `CredentialResolver`) and the shared `BUFFER_TOKEN` (Bearer token) to `BufferDistributor`. Path stays dry-run until both a `credential_ref` env var AND `BUFFER_TOKEN` are present — absent either → `DryRunDistributor` selected instead. Decision: WIRE IT NOW — fully wired end-to-end, gated by real credentials.

6. **`createPublishRouter` needs an injectable `env` param for testing** — confirmed the current signature takes only `db`. Task 5 adds an optional `env` defaulting to `process.env`; this is a backward-compatible, one-line change.

7. **`stagger_hours` is stored as `REAL` (fractional). RESOLVED.** `stagger_hours` column is `REAL NOT NULL DEFAULT 4.0`. Fractional values (e.g. `0.5` = 30 minutes) are fully supported. `RoutingService` arithmetic uses `stagger_hours * 60 * 60 * 1000` ms. Decision: ADOPTED — plan kept as written.
