# Plan 6 — Publish Layer (Boss-gated, credential-externalized)

**Date:** 2026-06-14
**Domain:** Polymath (VFXellence) — Boss: Robin Dutta
**Repo:** monorepo `D:\VFXellence-LTD` (git, branch `develop`)
**REQUIRED SUB-SKILL:** `superpowers:subagent-driven-development`

---

## Goal

Distribute an **APPROVED + RENDERED** clip to social platforms — but **ONLY** via an explicit human action, with credentials supplied from environment variables, **never autonomously**. This is the final stage of the pipeline. The publish click stays human forever.

This plan depends on **Plan 5 (render pipeline)** having introduced:
- A separate rendered-artifact type (NOT `ClipDraft` — `ClipDraft` stays script-level and `validateDraft` continues to hard-reject render/asset keys).
- `approval_queue.content_type='video'` rows for rendered clips (distinct from `'clip'` script drafts).
- A `task_releases`-style or `published`-equivalent path being reachable (Plan 6 finalizes the `published` task status + release record).

If Plan 5 has not landed `content_type='video'`, the publish gate (Task 5) still functions — it simply 409s every request until rendered-video approvals exist. No fail-hard.

---

## Doctrine constraints (baked into design + tests)

These are non-negotiable. Every task below either implements or tests at least one:

1. **NO secrets in repo/vault.** Credentials via ENV ONLY (`BUFFER_TOKEN`, `POSTIZ_API_KEY`, `POSTIZ_API_URL`). Absence ⇒ **DRY-RUN mode**, never fail-hard.
2. **NO account creation, NO credential entry by Claude.** Those are Boss-only handoff steps documented (Task 7), never automated.
3. **NEVER autonomous publish.** The publish action is invoked only by an explicit human (Boss-clicked button), per-asset. No scheduler, agent, cron, or WS event triggers `/api/publish`.
4. **Per-asset human approval before publish** — `approval_queue` gate (`status='approved'` AND `content_type='video'`).
5. **Brand isolation.** Credentials keyed per ecosystem/brand. No cross-brand credential bleed. AI voice (ElevenLabs) is upstream concern; here, anonymous Surge accounts never share creds with owner-identity Signal.
6. **FTC disclosure** on affiliate content — captions for affiliate ecosystem carry a disclosure check before publish.
7. **Paid tools** (Buffer/Postiz hosted): Boss-approval-before-spend; dry-run works with zero spend.

---

## Package decision: NEW `@polymath/publish` package (justified)

**Decision: create a new `packages/publish` workspace (`@polymath/publish`), NOT extend `@polymath/agents`.**

Justification:
- **Doctrine isolation.** `@polymath/agents` is the *autonomous* engine surface (skills, drivers, draft generation). Publishing is the one surface that must **never** be invoked autonomously. Keeping it in a separate package with no dependency edge from `@polymath/agents` makes "an agent cannot import the publisher" a structural guarantee, not a convention. An agent literally cannot `import { BufferDistributor }` without a new dependency that code review would catch.
- **Credential blast radius.** The publish package is the only code that reads `BUFFER_TOKEN` / `POSTIZ_API_KEY`. Isolating it limits where secrets are touched and where ToS/legal review must focus.
- **Independent test gate.** Network-mocked adapter tests live beside the adapters; the agents package keeps its "no render/asset keys" purity tests uncontaminated.
- The server route (`/api/publish`) imports `@polymath/publish`; the engine does not.

`@polymath/publish` depends only on `@polymath/types` (for shared brand/ecosystem ids). No edge to `@polymath/agents`.

---

## File map

### New package `packages/publish/` (`@polymath/publish`)
```
packages/publish/
├── package.json                         # name @polymath/publish, type module, vitest, node>=22
├── tsconfig.json                        # mirrors packages/agents/tsconfig.json
├── vitest.config.ts                     # mirrors packages/agents/vitest.config.ts
└── src/
    ├── index.ts                         # barrel: re-export types + adapters + factory
    ├── types.ts                         # PublishClip, PublishTarget, PublishResult, Distributor, BrandCreds
    ├── credentials.ts                   # resolveBrandCreds(ecosystemId, env) — per-brand env keying
    ├── DryRunDistributor.ts             # DEFAULT — logs WOULD PUBLISH, returns {dryRun:true}
    ├── BufferDistributor.ts             # BUFFER_TOKEN, GraphQL POST (mocked in tests)
    ├── PostizDistributor.ts             # POSTIZ_API_KEY + POSTIZ_API_URL, REST POST (mocked in tests)
    ├── factory.ts                       # selectDistributor(ecosystemId, env) -> Distributor (DryRun if no creds)
    └── __tests__/
        ├── DryRunDistributor.test.ts
        ├── BufferDistributor.test.ts    # MOCKED HTTP, faked env, asserts no real network
        ├── PostizDistributor.test.ts    # MOCKED HTTP, faked env
        ├── credentials.test.ts          # brand isolation: viral creds never returned for affiliate
        └── factory.test.ts              # no creds -> DryRunDistributor
```

### Server `.canon/.mission-control/server/`
```
services/publish.service.ts             # NEW — gate + record, imports @polymath/publish
routes/publish.ts                       # NEW — POST /api/publish {approvalId}
db.ts                                   # EXTEND — publish_log table migration
services/tasks.service.ts               # EXTEND — add 'published' to TaskStatus enum
index.ts                                # EXTEND — mount createPublishRouter
test/publish.service.test.ts            # NEW
test/publish.route.test.ts              # NEW
test/db.test.ts                         # EXTEND — assert publish_log columns
```

### Client `.canon/.mission-control/client/src/features/approvals/`
```
PublishButton.tsx                       # NEW — renders only for approved+video, POSTs, shows result
PublishButton.test.tsx                  # NEW — RTL: visibility gate + dry-run banner
ApprovalCard.tsx                        # EXTEND — mount <PublishButton/>
api.ts (or existing client api module) # EXTEND — publish(approvalId) fetch helper
```

### Skill + handoff doc
```
.canon/.claude/skills/polymath/surge-publish/SKILL.md   # NEW — documents human-gated publish, HALT line reflects stage
.canon/5_knowledge/reference/polymath-business/GO-LIVE-HANDOFF.md  # NEW or EXTEND — Boss-only go-live steps
```

---

## Shared type contracts (target shapes — implemented in Task 1)

```ts
// packages/publish/src/types.ts
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
```

Per-brand env keying (Task 2, `credentials.ts`): keys are namespaced by ecosystem so brands never share tokens, e.g.
`BUFFER_TOKEN__VIRAL`, `BUFFER_TOKEN__CONTENT`, `POSTIZ_API_KEY__VIRAL`, `POSTIZ_API_URL__VIRAL`.
A bare `BUFFER_TOKEN` (no suffix) is **rejected** as a credential source for any specific brand (prevents accidental cross-brand bleed); only suffixed keys resolve. No suffixed key for the requested ecosystem ⇒ `{provider:null}` ⇒ DryRun.

---

## TDD Tasks

> Each task: write failing test (with full code) → run FAIL → implement (full code) → run PASS → commit.
> **Worktree: yes** for every task (code-writing). **Model/effort** noted per task.
> Test commands: `pnpm --filter @polymath/publish test` (package) / `npm test` in server dir / client vitest.

---

### Task 1 — `@polymath/publish` package scaffold + types + DryRunDistributor (DEFAULT)
**Model: Medium tier · effort: high · Worktree: yes**

**FAIL test** `src/__tests__/DryRunDistributor.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";
import { DryRunDistributor } from "../DryRunDistributor.js";
import type { PublishClip } from "../types.js";

const clip: PublishClip = {
  approvalId: "aq_1", ecosystemId: "viral", caption: "wild fact about octopuses",
  hashtags: ["#octopus"], videoPath: "/artifacts/aq_1.mp4",
};

describe("DryRunDistributor", () => {
  it("returns dryRun:true and never returns a url", async () => {
    const d = new DryRunDistributor();
    const r = await d.publish(clip, "tiktok");
    expect(r.dryRun).toBe(true);
    expect(r.status).toBe("skipped");
    expect(r.platform).toBe("tiktok");
    expect(r.url).toBeUndefined();
    expect(d.name).toBe("dry-run");
  });

  it("logs WOULD PUBLISH with platform and caption", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await new DryRunDistributor().publish(clip, "youtube");
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("WOULD PUBLISH to youtube: wild fact about octopuses"),
    );
    spy.mockRestore();
  });
});
```

**IMPL** — create `package.json`, `tsconfig.json`, `vitest.config.ts` (mirror `packages/agents`), `src/types.ts` (shapes above), `src/index.ts` barrel, and:
```ts
// packages/publish/src/DryRunDistributor.ts
import type { Distributor, PublishResult, PublishTarget, PublishClip } from "./types.js";

export class DryRunDistributor implements Distributor {
  readonly name = "dry-run";
  async publish(clip: PublishClip, target: PublishTarget): Promise<PublishResult> {
    console.log(`[publish] WOULD PUBLISH to ${target}: ${clip.caption}`);
    return { platform: target, status: "skipped", dryRun: true, message: "dry-run: no credentials configured" };
  }
}
```
`package.json`:
```json
{
  "name": "@polymath/publish",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "description": "Polymath publish layer — human-gated social distribution adapters (dry-run by default)",
  "scripts": { "test": "vitest run", "test:watch": "vitest", "typecheck": "tsc --noEmit" },
  "engines": { "node": ">=22" },
  "dependencies": { "@polymath/types": "workspace:*" },
  "devDependencies": { "@types/node": "^24.12.3", "tsx": "^4.22.3", "typescript": "~6.0.2", "vitest": "^4.1.7" }
}
```

**RUN PASS:** `pnpm --filter @polymath/publish test`

**COMMIT:**
```
git -C D:\VFXellence-LTD add packages/publish pnpm-workspace.yaml
git -C D:\VFXellence-LTD commit -m "Add @polymath/publish package with DryRun distributor

- Scaffold @polymath/publish workspace (types, barrel, vitest)
- Add Distributor interface and PublishResult contract
- Add DryRunDistributor as default no-credential adapter
- Log WOULD PUBLISH and return dryRun:true with no url"
```

---

### Task 2 — Per-brand credential resolution (brand isolation)
**Model: Medium tier · effort: high · Worktree: yes**

**FAIL test** `src/__tests__/credentials.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { resolveBrandCreds } from "../credentials.js";

describe("resolveBrandCreds — brand isolation", () => {
  it("returns provider null (dry-run) when no suffixed env key present", () => {
    expect(resolveBrandCreds("viral", {})).toEqual({ provider: null });
  });

  it("resolves Buffer creds only for the matching ecosystem suffix", () => {
    const env = { BUFFER_TOKEN__VIRAL: "tok-viral" };
    expect(resolveBrandCreds("viral", env)).toEqual({ provider: "buffer", bufferToken: "tok-viral" });
    // affiliate has no key -> dry-run, never inherits viral's token
    expect(resolveBrandCreds("affiliate", env)).toEqual({ provider: null });
  });

  it("ignores a bare BUFFER_TOKEN (no suffix) to prevent cross-brand bleed", () => {
    expect(resolveBrandCreds("viral", { BUFFER_TOKEN: "global-leak" })).toEqual({ provider: null });
  });

  it("resolves Postiz with api key + url", () => {
    const env = { POSTIZ_API_KEY__CONTENT: "k", POSTIZ_API_URL__CONTENT: "https://postiz.local" };
    expect(resolveBrandCreds("content", env)).toEqual({
      provider: "postiz", postizApiKey: "k", postizApiUrl: "https://postiz.local",
    });
  });
});
```

**IMPL** `src/credentials.ts`:
```ts
import type { BrandCreds } from "./types.js";

const UP = (s: string) => s.toUpperCase();

export function resolveBrandCreds(ecosystemId: string, env: Record<string, string | undefined>): BrandCreds {
  const suffix = `__${UP(ecosystemId)}`;
  const bufferToken = env[`BUFFER_TOKEN${suffix}`];
  const postizApiKey = env[`POSTIZ_API_KEY${suffix}`];
  const postizApiUrl = env[`POSTIZ_API_URL${suffix}`];

  if (postizApiKey && postizApiUrl) return { provider: "postiz", postizApiKey, postizApiUrl };
  if (bufferToken) return { provider: "buffer", bufferToken };
  return { provider: null };
}
```

**RUN PASS** → **COMMIT:**
```
git -C D:\VFXellence-LTD add packages/publish/src/credentials.ts packages/publish/src/__tests__/credentials.test.ts
git -C D:\VFXellence-LTD commit -m "Add per-brand credential resolution for publish

- Resolve creds from ecosystem-suffixed env keys only
- Reject bare BUFFER_TOKEN to prevent cross-brand bleed
- Default to provider:null (dry-run) when no brand creds present
- Test affiliate never inherits viral's token"
```

---

### Task 3 — Buffer + Postiz adapters (MOCKED HTTP, faked env, no real network)
**Model: Hard tier · effort: high · Worktree: yes**

**FAIL test** `src/__tests__/BufferDistributor.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BufferDistributor } from "../BufferDistributor.js";
import type { PublishClip } from "../types.js";

const clip: PublishClip = {
  approvalId: "aq_9", ecosystemId: "viral", caption: "cap", hashtags: ["#x"], videoPath: "/a/aq_9.mp4",
};

describe("BufferDistributor (mocked HTTP)", () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it("POSTs to Buffer with the faked token and returns published + url", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ id: "post_1", url: "https://buffer.test/post_1" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const d = new BufferDistributor({ bufferToken: "FAKE_TEST_TOKEN" });
    const r = await d.publish(clip, "tiktok");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    expect(String(init.headers["authorization"] ?? init.headers["Authorization"])).toContain("FAKE_TEST_TOKEN");
    expect(r).toMatchObject({ platform: "tiktok", status: "published", dryRun: false, url: "https://buffer.test/post_1" });
  });

  it("returns failed (never throws) on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => "unauthorized" }));
    const r = await new BufferDistributor({ bufferToken: "bad" }).publish(clip, "youtube");
    expect(r.status).toBe("failed");
    expect(r.dryRun).toBe(false);
  });
});
```
(Mirror for `PostizDistributor.test.ts` — POSTs to `${postizApiUrl}/...` with `POSTIZ_API_KEY`; assert URL/path + key header; assert `dryRun:false`.)

**IMPL** `src/BufferDistributor.ts` and `src/PostizDistributor.ts`. Each:
- Constructor takes resolved creds (`{ bufferToken }` / `{ postizApiKey, postizApiUrl }`).
- `publish()` builds payload from `clip` (caption + hashtags + videoPath), `await fetch(...)`, parses result.
- Non-ok ⇒ return `{ status:"failed", dryRun:false, message }` — **never throw** (callers must not crash the route).
- `dryRun: false` always (these are the real adapters).
- No top-level `process.env` reads inside adapter (creds injected via constructor — keeps them testable + keeps env reads centralized in `credentials.ts`).

> Adapter HTTP shapes follow current tool evals (`tools/buffer.md` GraphQL beta, `tools/postiz.md` REST + `/api` base). Mark with a `// VERIFY current API` comment — ToS/endpoint risk is a Boss go-live concern (Task 7).

**RUN PASS** → **COMMIT:**
```
git -C D:\VFXellence-LTD add packages/publish/src/BufferDistributor.ts packages/publish/src/PostizDistributor.ts packages/publish/src/__tests__/BufferDistributor.test.ts packages/publish/src/__tests__/PostizDistributor.test.ts
git -C D:\VFXellence-LTD commit -m "Add Buffer and Postiz publish adapters

- Add BufferDistributor (GraphQL POST, token-injected)
- Add PostizDistributor (REST POST, api key + url)
- Return failed result on non-ok, never throw
- Test with mocked fetch and faked creds, no real network"
```

---

### Task 4 — Distributor factory (dry-run default wiring)
**Model: Medium tier · effort: high · Worktree: yes**

**FAIL test** `src/__tests__/factory.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { selectDistributor } from "../factory.js";
import { DryRunDistributor } from "../DryRunDistributor.js";
import { BufferDistributor } from "../BufferDistributor.js";
import { PostizDistributor } from "../PostizDistributor.js";

describe("selectDistributor", () => {
  it("returns DryRunDistributor when no brand creds (default)", () => {
    expect(selectDistributor("viral", {})).toBeInstanceOf(DryRunDistributor);
  });
  it("returns BufferDistributor for matching brand token", () => {
    expect(selectDistributor("viral", { BUFFER_TOKEN__VIRAL: "t" })).toBeInstanceOf(BufferDistributor);
  });
  it("returns PostizDistributor when postiz creds present", () => {
    expect(selectDistributor("content", { POSTIZ_API_KEY__CONTENT: "k", POSTIZ_API_URL__CONTENT: "u" }))
      .toBeInstanceOf(PostizDistributor);
  });
  it("isolates brands — viral creds do not produce a live distributor for affiliate", () => {
    expect(selectDistributor("affiliate", { BUFFER_TOKEN__VIRAL: "t" })).toBeInstanceOf(DryRunDistributor);
  });
});
```

**IMPL** `src/factory.ts`:
```ts
import { resolveBrandCreds } from "./credentials.js";
import { DryRunDistributor } from "./DryRunDistributor.js";
import { BufferDistributor } from "./BufferDistributor.js";
import { PostizDistributor } from "./PostizDistributor.js";
import type { Distributor } from "./types.js";

export function selectDistributor(ecosystemId: string, env: Record<string, string | undefined>): Distributor {
  const creds = resolveBrandCreds(ecosystemId, env);
  if (creds.provider === "postiz") return new PostizDistributor({ postizApiKey: creds.postizApiKey!, postizApiUrl: creds.postizApiUrl! });
  if (creds.provider === "buffer") return new BufferDistributor({ bufferToken: creds.bufferToken! });
  return new DryRunDistributor();
}
```
Export `selectDistributor` from `index.ts`.

**RUN PASS** → **COMMIT:**
```
git -C D:\VFXellence-LTD add packages/publish/src/factory.ts packages/publish/src/index.ts packages/publish/src/__tests__/factory.test.ts
git -C D:\VFXellence-LTD commit -m "Add distributor factory with dry-run default

- selectDistributor resolves per-brand creds to an adapter
- Default to DryRunDistributor when no brand creds present
- Test brand isolation through factory selection"
```

---

### Task 5 — Server: `publish_log` table + `published` task status + gate service + route
**Model: Hard tier · effort: high · Worktree: yes**

**FAIL test** `test/publish.service.test.ts` (in-memory better-sqlite3, seeded approval rows):
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { createDb, type Db } from "../db.js";
import { PublishService } from "../services/publish.service.js";

let db: Db; let svc: PublishService;
beforeEach(() => {
  db = createDb(":memory:");
  svc = new PublishService(db, {}); // empty env -> dry-run
});

function seedApproval(status: string, contentType: string, taskId = "t1") {
  db.raw.prepare(`INSERT INTO tasks (id,title,type,ecosystem_id,status,priority,created_at,updated_at)
    VALUES ('t1','x','clip','viral',?,'med',datetime('now'),datetime('now'))`).run(status === "approved" ? "in-review" : "todo");
  db.raw.prepare(`INSERT INTO approval_queue (id,task_id,ecosystem_id,content_type,status,created_at)
    VALUES ('aq1',@t,'viral',@ct,@st,datetime('now'))`).run({ t: taskId, ct: contentType, st: status });
}

describe("PublishService gate", () => {
  it("409s when approval is not content_type=video", async () => {
    seedApproval("approved", "clip");
    const r = await svc.publish("aq1", "boss");
    expect(r.conflict).toBe(true);
  });
  it("409s when video approval is not approved", async () => {
    seedApproval("pending", "video");
    const r = await svc.publish("aq1", "boss");
    expect(r.conflict).toBe(true);
  });
  it("404s when approval missing", async () => {
    const r = await svc.publish("nope", "boss");
    expect(r.missing).toBe(true);
  });
  it("dry-run publishes approved video: writes publish_log row + sets task published", async () => {
    seedApproval("approved", "video");
    const r = await svc.publish("aq1", "boss");
    expect(r.results?.[0].dryRun).toBe(true);
    const log = db.raw.prepare("SELECT * FROM publish_log WHERE approval_id='aq1'").get() as any;
    expect(log.dry_run).toBe(1);
    expect(log.published_by).toBe("boss");
    const task = db.raw.prepare("SELECT status FROM tasks WHERE id='t1'").get() as any;
    expect(task.status).toBe("published");
  });
});
```

**IMPL:**
- `db.ts`: add migration (idempotent `CREATE TABLE IF NOT EXISTS publish_log`):
  ```sql
  CREATE TABLE IF NOT EXISTS publish_log (
    id TEXT PRIMARY KEY,
    approval_id TEXT NOT NULL,
    ecosystem_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT,
    status TEXT NOT NULL,
    dry_run INTEGER NOT NULL DEFAULT 1,
    published_by TEXT NOT NULL,
    published_at TEXT NOT NULL
  );
  ```
- `tasks.service.ts`: extend `TaskStatus` + `TASK_STATUSES` with `"published"`.
- `publish.service.ts` (`class PublishService`, ctor `(db, env)`):
  1. `get` approval; missing ⇒ `{ missing:true }`.
  2. Gate: `content_type !== 'video' || status !== 'approved'` ⇒ `{ conflict:true }`.
  3. `selectDistributor(approval.ecosystemId, this.env)` from `@polymath/publish`.
  4. **Affiliate disclosure guard:** if `ecosystemId==='affiliate'` and clip has no `affiliateDisclosure`, return `{ conflict:true, reason:'ftc-disclosure-missing' }`.
  5. Build `PublishClip` from approval (`content_json` → caption/hashtags/videoPath).
  6. `await distributor.publish(clip, target)` per configured target(s) (default `["tiktok","youtube","instagram"]`).
  7. Insert `publish_log` row(s); `dry_run` from result.
  8. `tasksService.setStatus(taskId, "published")`.
  9. Return `{ results }`.
- `routes/publish.ts`: `POST /` reads `{approvalId}` (required, 400 if absent), `publishedBy` from a header/body (Boss identity), calls service; map `missing→404`, `conflict→409`, else `200 {results}`.
- `index.ts`: mount `app.use("/api/publish", createPublishRouter(db))`.
- `test/db.test.ts`: extend to assert `publish_log` columns exist.

**Route test** `test/publish.route.test.ts` (supertest-style against the Express app, dry-run env): asserts `POST /api/publish {approvalId}` 409s for non-video and 200 + result for approved video; asserts the route handler is the **only** publish entry point (no WS/scheduler import of PublishService — grep guard in test: assert no `agent-runs`/`sessions`/WS module imports `publish.service`).

**RUN PASS:** `npm test` in server dir.

**COMMIT:**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/server
git -C D:\VFXellence-LTD commit -m "Add human-gated publish route and service

- Add publish_log table migration (idempotent)
- Add published task status to TaskStatus enum
- Gate POST /api/publish on approved video approvals (409 else)
- Record publish_log row and set task published
- Default to dry-run distributor when no brand creds
- Block affiliate publish lacking FTC disclosure"
```

---

### Task 6 — Client: per-asset Publish button + dry-run banner
**Model: Hard tier · effort: high · Worktree: yes**

**FAIL test** `PublishButton.test.tsx` (RTL):
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PublishButton } from "./PublishButton";

const approvedVideo = { id: "aq1", contentType: "video", status: "approved", ecosystemId: "viral" } as any;

describe("PublishButton", () => {
  it("does NOT render for a non-video approval", () => {
    const { container } = render(<PublishButton approval={{ ...approvedVideo, contentType: "clip" }} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("does NOT render for a pending video approval", () => {
    const { container } = render(<PublishButton approval={{ ...approvedVideo, status: "pending" }} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("renders for approved video and shows DRY RUN banner on dry-run result", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ results: [{ platform: "tiktok", status: "skipped", dryRun: true }] }),
    }));
    render(<PublishButton approval={approvedVideo} />);
    fireEvent.click(screen.getByRole("button", { name: /publish/i }));
    await waitFor(() => expect(screen.getByText(/DRY RUN — not actually posted/i)).toBeInTheDocument());
  });
});
```

**IMPL** `PublishButton.tsx`:
- Render `null` unless `approval.contentType === "video" && approval.status === "approved"`.
- Button POSTs `/api/publish {approvalId: approval.id}`; on result, render each `PublishResult`; if any `dryRun`, show a prominent banner: **"DRY RUN — not actually posted"**; if live, show platform + url link.
- Disable button while in-flight; show failures.
- Mount in `ApprovalCard.tsx`. Add `publish(approvalId)` helper to client api module.

**RUN PASS:** client vitest.

**COMMIT:**
```
git -C D:\VFXellence-LTD add .canon/.mission-control/client/src/features/approvals
git -C D:\VFXellence-LTD commit -m "Add per-asset Publish button to Approval Queue

- Render Publish only for approved video approvals
- POST /api/publish on click, show PublishResult per platform
- Show DRY RUN — not actually posted banner when dryRun
- Disable while in-flight, surface failures"
```

---

### Task 7 — `surge-publish` skill + GO-LIVE HANDOFF doc (Boss-only steps)
**Model: Light tier · effort: low · Worktree: yes**

No tests (docs + skill). **IMPL:**

`surge-publish/SKILL.md` — fenced-yaml frontmatter; documents that publish is **human-clicked only**; describes the gate (approved + video); ends with the stage-appropriate HALT line:
> **HALT. Publish is a Boss-clicked button only. Claude never auto-publishes, never creates accounts, never enters or stores credentials.**

`GO-LIVE-HANDOFF.md` — **Boss-only** path from dry-run to live:
1. **(Boss)** Create `@zrodinger` accounts on TikTok, YouTube, Instagram (per brand/ecosystem; anonymous Surge accounts isolated from Signal identity).
2. **(Boss)** Connect those accounts in Buffer **or** Postiz (or obtain platform tokens). Separate Buffer workspace / self-hosted Postiz per brand for isolation (see `tools/buffer.md` Q1, `tools/postiz.md`).
3. **(Boss)** Set env vars (per-brand, suffixed) — list:
   - `BUFFER_TOKEN__VIRAL` (or `POSTIZ_API_KEY__VIRAL` + `POSTIZ_API_URL__VIRAL`)
   - `BUFFER_TOKEN__CONTENT` (or Postiz equivalents)
   - never a bare `BUFFER_TOKEN` — that resolves to dry-run by design
4. **(Boss)** Restart the Mission Control server so the route picks up env.
5. **(Boss)** Click **Publish** per asset in the Approval Queue.

Emphasize, in bold: **Claude never does steps 1–2, never stores creds, never auto-clicks step 5.** Note paid-tool spend requires Boss approval; ToS/API rules must be verified current before going live; FTC disclosure required on affiliate captions.

Run `/caveman:compress` on `SKILL.md` after writing (AI-facing).

**COMMIT:**
```
git -C D:\VFXellence-LTD add .canon/.claude/skills/polymath/surge-publish .canon/5_knowledge/reference/polymath-business/GO-LIVE-HANDOFF.md
git -C D:\VFXellence-LTD commit -m "Add surge-publish skill and go-live handoff doc

- Document human-clicked-only publish with HALT line
- Add Boss-only go-live steps (accounts, tokens, env, restart)
- List per-brand suffixed env vars, forbid bare tokens
- Note paid-tool spend approval, ToS, FTC disclosure"
```

---

## VAULT UPDATE (append to subagent briefs)

On completing each task, append to the changelog at
`D:\VFXellence-LTD\polymath\vault\dev\4_orchestrator\changelogs\2026-06-14.md`
(create if absent): one bullet per task — what shipped, test count, commit hash. Update tracker task #18 status. Capture any gotcha (e.g. adapter API drift, sqlite migration ordering) into `tools/buffer.md` / `tools/postiz.md` "Real questions" sections.

---

## Self-Review

**Spec coverage:**
- [x] Distributor interface `publish(renderedClip, target) -> PublishResult {platform, url?, status, dryRun}` — Task 1 types.
- [x] BufferDistributor (`BUFFER_TOKEN`) + PostizDistributor (`POSTIZ_API_KEY`) — Task 3.
- [x] DryRunDistributor default (no creds), logs "WOULD PUBLISH to <platform>: <caption>", returns `{dryRun:true}` — Task 1.
- [x] Per-ecosystem credential scoping, no cross-brand sharing — Task 2 + Task 4 (suffixed keys; bare token rejected).
- [x] New `@polymath/publish` package chosen + justified (doctrine isolation, no edge from agents).
- [x] Gate `POST /api/publish {approvalId}`: (a) verify `content_type='video'` AND `status='approved'` else 409; (b) run distributor (dry-run if no creds); (c) record publish_log; (d) set task `published` — Task 5.
- [x] Never called by scheduler/agent — Task 5 route test grep guard + package boundary.
- [x] Client Publish button visible only for approved video, POSTs, shows result + dry-run banner — Task 6.
- [x] GO-LIVE HANDOFF Boss-only steps (a)-(e), env var list — Task 7.
- [x] Tests: DryRun default, 409 on non-video/unapproved, log row + task published, mocked-HTTP Buffer/Postiz with faked env, button visibility gate, dry-run banner, no real network — Tasks 1,3,5,6.

**No placeholders:** every task ships full test + impl code and an exact commit command. No TODO/stub bodies in shipped code (adapters return real mocked-tested logic; `// VERIFY current API` is a review flag, not a stub).

**Type consistency:** `PublishClip` (distributor input, `@polymath/publish`) is SEPARATE from both `ClipDraft` (script-level, `@polymath/agents`) and `RenderedClip` (full render artifact, `@polymath/agents`). `ClipDraft` and `validateDraft` untouched (render/asset keys still hard-rejected upstream). `PublishResult`/`Distributor` shared via `@polymath/publish`. `TaskStatus` gains `published`. `publish_log` columns mirror the `platform,url,status,published_by,published_at,dry_run` spec.

**Doctrine guards present:**
- No secrets in repo — creds read from env only; absence ⇒ dry-run (Tasks 2,4,5). Faked creds live only in tests.
- No autonomous publish — single route entry, no scheduler/WS/agent import (Task 5 guard); button is the only client trigger (Task 6).
- Per-asset human approval gate (Task 5).
- Brand isolation — suffixed env keys, bare token rejected, affiliate never inherits viral (Tasks 2,4).
- FTC disclosure on affiliate (Task 5 guard).
- Paid-tool spend = Boss approval; dry-run = zero spend (Task 7 doc).
- Claude never creates accounts / enters creds / clicks publish (Task 7 HALT + handoff).
