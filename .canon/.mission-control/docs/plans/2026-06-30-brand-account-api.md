# Brand & Account Data/API Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tested data + API layer (services, routes, client types, hooks) over the existing `brands` and `platform_accounts` tables — no UI.

**Architecture:** Mirror the existing `transactions` pattern: per-resource service class taking a `Db`, factory-function Express router with `REQUIRED`-field validation, optimistic client hook over the `api.*` helper. camelCase DTOs at the boundary, snake_case `Row` internally, explicit conversion functions. Server tests use Vitest + supertest with a fresh in-memory DB per test.

**Tech Stack:** TypeScript (NodeNext ESM — note `.js` import suffixes), Express, better-sqlite3, Vitest, supertest, React.

**Issue:** #16 (sub-issue of epic #15). **Spec:** `docs/specs/2026-06-30-brand-account-api-design.md`.

**Working directory for all commands:** server commands run from `D:\VFXellence-LTD\.claude\worktrees\feat+16-brand-account-api\.canon\.mission-control\server`; client commands from the sibling `client` directory. Paths in tasks are relative to `.canon/.mission-control/`.

---

## File Structure

- Create `server/services/brands.service.ts` — `BrandsService` CRUD over `brands` table.
- Create `server/services/platform-accounts.service.ts` — `PlatformAccountsService` CRUD + filter over `platform_accounts` table.
- Create `server/routes/brands.ts` — `createBrandsRouter(db)`.
- Create `server/routes/platform-accounts.ts` — `createPlatformAccountsRouter(db)`.
- Modify `server/index.ts` — mount both routers.
- Create `server/test/brands.test.ts` + `server/test/platform-accounts.test.ts`.
- Modify `client/src/types/index.ts` — extend `PlatformAccount` (optional DB fields).
- Create `client/src/hooks/useBrands.ts` + `client/src/hooks/usePlatformAccounts.ts`.

---

## Task 1: BrandsService

**Files:**
- Create: `server/services/brands.service.ts`
- Test: `server/test/brands.test.ts`

- [ ] **Step 1: Write the failing test** — `server/test/brands.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createBrandsRouter } from "../routes/brands.js";

let db: Db;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/brands", createBrandsRouter(db));
});
afterEach(() => db.close());

const NEW = { name: "Zrodinger", ecosystemId: "content", email: "hello@abundenz.com" };

describe("brands API", () => {
  it("GET returns [] initially", async () => {
    const res = await request(app).get("/api/brands");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST creates and returns camelCase row with generated brn_ id", async () => {
    const res = await request(app).post("/api/brands").send(NEW);
    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^brn_/);
    expect(res.body.ecosystemId).toBe("content");
    expect(res.body).not.toHaveProperty("ecosystem_id");
  });

  it("POST honors a supplied slug id", async () => {
    const res = await request(app).post("/api/brands").send({ ...NEW, id: "zrodinger" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe("zrodinger");
  });

  it("POST then GET round-trips (newest first)", async () => {
    await request(app).post("/api/brands").send(NEW);
    await request(app).post("/api/brands").send({ ...NEW, name: "Zenith" });
    const res = await request(app).get("/api/brands");
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe("Zenith");
  });

  it("GET /:id returns the brand; 404 when missing", async () => {
    const created = await request(app).post("/api/brands").send({ ...NEW, id: "zrodinger" });
    const ok = await request(app).get(`/api/brands/${created.body.id}`);
    expect(ok.status).toBe(200);
    expect(ok.body.name).toBe("Zrodinger");
    const miss = await request(app).get("/api/brands/nope");
    expect(miss.status).toBe(404);
  });

  it("PUT updates a partial field; preserves others; 404 on missing", async () => {
    const created = await request(app).post("/api/brands").send({ ...NEW, id: "zrodinger" });
    const res = await request(app).put(`/api/brands/${created.body.id}`).send({ email: "new@abundenz.com" });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("new@abundenz.com");
    expect(res.body.name).toBe("Zrodinger");
    const miss = await request(app).put("/api/brands/nope").send({ email: "x" });
    expect(miss.status).toBe(404);
  });

  it("DELETE removes; 404 on missing", async () => {
    const created = await request(app).post("/api/brands").send({ ...NEW, id: "zrodinger" });
    const del = await request(app).delete(`/api/brands/${created.body.id}`);
    expect(del.status).toBe(200);
    const res = await request(app).get("/api/brands");
    expect(res.body).toEqual([]);
    const miss = await request(app).delete("/api/brands/nope");
    expect(miss.status).toBe(404);
  });

  it("POST validates required fields -> 400", async () => {
    const res = await request(app).post("/api/brands").send({ email: "x" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/brands.test.ts`
Expected: FAIL — cannot find module `../routes/brands.js`.

- [ ] **Step 3: Write the service** — `server/services/brands.service.ts`

```typescript
import type { Db } from "../db.js";

export interface Brand {
  id: string;
  name: string;
  ecosystemId: string;
  email: string;
}
export type NewBrand = Omit<Brand, "id"> & { id?: string };

interface Row {
  id: string;
  name: string;
  ecosystem_id: string;
  email: string;
}

function rowToBrand(r: Row): Brand {
  return { id: r.id, name: r.name, ecosystemId: r.ecosystem_id, email: r.email };
}

function genId(): string {
  return `brn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class BrandsService {
  constructor(private db: Db) {}

  list(): Brand[] {
    const rows = this.db.raw.prepare("SELECT * FROM brands ORDER BY rowid DESC").all() as Row[];
    return rows.map(rowToBrand);
  }

  get(id: string): Brand | undefined {
    const r = this.db.raw.prepare("SELECT * FROM brands WHERE id=?").get(id) as Row | undefined;
    return r ? rowToBrand(r) : undefined;
  }

  create(data: NewBrand): Brand {
    const id = data.id ?? genId();
    this.db.raw
      .prepare("INSERT INTO brands (id, name, ecosystem_id, email) VALUES (@id, @name, @ecosystem_id, @email)")
      .run({ id, name: data.name, ecosystem_id: data.ecosystemId, email: data.email ?? "" });
    return this.get(id)!;
  }

  update(id: string, patch: Partial<NewBrand>): Brand | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...patch };
    this.db.raw
      .prepare("UPDATE brands SET name=@name, ecosystem_id=@ecosystem_id, email=@email WHERE id=@id")
      .run({ id, name: merged.name, ecosystem_id: merged.ecosystemId, email: merged.email });
    return this.get(id);
  }

  remove(id: string): boolean {
    const info = this.db.raw.prepare("DELETE FROM brands WHERE id=?").run(id);
    return info.changes > 0;
  }
}
```

- [ ] **Step 4: Write the router** — `server/routes/brands.ts`

```typescript
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { BrandsService, type NewBrand } from "../services/brands.service.js";

const REQUIRED: (keyof NewBrand)[] = ["name", "ecosystemId"];

export function createBrandsRouter(db: Db): Router {
  const router = Router();
  const svc = new BrandsService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json(svc.list());
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post("/", (req: Request, res: Response) => {
    const body = req.body as Partial<NewBrand>;
    const missing = REQUIRED.filter((k) => body[k] === undefined || body[k] === null || body[k] === "");
    if (missing.length) {
      res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
      return;
    }
    try {
      res.status(201).json(svc.create(body as NewBrand));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get("/:id", (req: Request, res: Response) => {
    const brand = svc.get(String(req.params["id"]));
    if (!brand) {
      res.status(404).json({ error: `Brand not found: ${req.params["id"]}` });
      return;
    }
    res.json(brand);
  });

  router.put("/:id", (req: Request, res: Response) => {
    const updated = svc.update(String(req.params["id"]), req.body as Partial<NewBrand>);
    if (!updated) {
      res.status(404).json({ error: `Brand not found: ${req.params["id"]}` });
      return;
    }
    res.json(updated);
  });

  router.delete("/:id", (req: Request, res: Response) => {
    const ok = svc.remove(String(req.params["id"]));
    if (!ok) {
      res.status(404).json({ error: `Brand not found: ${req.params["id"]}` });
      return;
    }
    res.json({ ok: true });
  });

  return router;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/brands.test.ts`
Expected: PASS — all 8 tests green.

- [ ] **Step 6: Commit**

```bash
git add server/services/brands.service.ts server/routes/brands.ts server/test/brands.test.ts
git commit -m "Add BrandsService and /api/brands router with tests"
```

---

## Task 2: PlatformAccountsService

**Files:**
- Create: `server/services/platform-accounts.service.ts`
- Test: `server/test/platform-accounts.test.ts`

- [ ] **Step 1: Write the failing test** — `server/test/platform-accounts.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { createDb, type Db } from "../db.js";
import { createPlatformAccountsRouter } from "../routes/platform-accounts.js";

let db: Db;
let app: express.Express;

beforeEach(() => {
  db = createDb(":memory:");
  app = express();
  app.use(express.json());
  app.use("/api/platform-accounts", createPlatformAccountsRouter(db));
});
afterEach(() => db.close());

const NEW = { brandId: "zrodinger", platform: "youtube", handle: "@zrodinger" };

describe("platform-accounts API", () => {
  it("GET returns [] initially", async () => {
    const res = await request(app).get("/api/platform-accounts");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST creates with integer id and applies defaults", async () => {
    const res = await request(app).post("/api/platform-accounts").send(NEW);
    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe("number");
    expect(res.body.status).toBe("not-started");
    expect(res.body.active).toBe(false);
    expect(res.body.staggerHours).toBe(4);
    expect(res.body.rotationOrder).toBe(0);
    expect(res.body.handle).toBe("@zrodinger");
  });

  it("boolean active round-trips as boolean, not 1", async () => {
    const res = await request(app).post("/api/platform-accounts").send({ ...NEW, active: true });
    expect(res.status).toBe(201);
    expect(res.body.active).toBe(true);
  });

  it("?brandId=<id> filters to that brand", async () => {
    await request(app).post("/api/platform-accounts").send({ ...NEW, brandId: "zrodinger" });
    await request(app).post("/api/platform-accounts").send({ ...NEW, brandId: "zenith" });
    const res = await request(app).get("/api/platform-accounts?brandId=zrodinger");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].brandId).toBe("zrodinger");
  });

  it("?brandId=none filters to shared (NULL) accounts", async () => {
    await request(app).post("/api/platform-accounts").send({ ...NEW, brandId: "zrodinger" });
    await request(app).post("/api/platform-accounts").send({ platform: "tiktok" }); // no brandId -> NULL
    const res = await request(app).get("/api/platform-accounts?brandId=none");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].brandId).toBeNull();
  });

  it("GET /:id returns the account; 404 when missing", async () => {
    const created = await request(app).post("/api/platform-accounts").send(NEW);
    const ok = await request(app).get(`/api/platform-accounts/${created.body.id}`);
    expect(ok.status).toBe(200);
    const miss = await request(app).get("/api/platform-accounts/99999");
    expect(miss.status).toBe(404);
  });

  it("PUT updates partial; preserves others; 404 on missing", async () => {
    const created = await request(app).post("/api/platform-accounts").send(NEW);
    const res = await request(app).put(`/api/platform-accounts/${created.body.id}`).send({ status: "active" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("active");
    expect(res.body.handle).toBe("@zrodinger");
    const miss = await request(app).put("/api/platform-accounts/99999").send({ status: "active" });
    expect(miss.status).toBe(404);
  });

  it("DELETE removes; 404 on missing", async () => {
    const created = await request(app).post("/api/platform-accounts").send(NEW);
    const del = await request(app).delete(`/api/platform-accounts/${created.body.id}`);
    expect(del.status).toBe(200);
    const res = await request(app).get("/api/platform-accounts");
    expect(res.body).toEqual([]);
    const miss = await request(app).delete("/api/platform-accounts/99999");
    expect(miss.status).toBe(404);
  });

  it("POST validates required platform -> 400", async () => {
    const res = await request(app).post("/api/platform-accounts").send({ handle: "@x" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/platform-accounts.test.ts`
Expected: FAIL — cannot find module `../routes/platform-accounts.js`.

- [ ] **Step 3: Write the service** — `server/services/platform-accounts.service.ts`

```typescript
import type { Db } from "../db.js";

export interface PlatformAccount {
  id: number;
  brandId: string | null;
  platform: string;
  handle: string;
  email: string;
  trackingId: string | null;
  status: string;
  notes: string | null;
  url: string | null;
  maxAccounts: string | null;
  active: boolean;
  rotationOrder: number;
  lastPostedAt: string | null;
  staggerHours: number;
  credentialRef: string | null;
}
export type NewPlatformAccount = Omit<PlatformAccount, "id">;

export interface AccountFilter {
  brandId?: string | null;
}

interface Row {
  id: number;
  brand_id: string | null;
  platform: string;
  handle: string;
  email: string;
  tracking_id: string | null;
  status: string;
  notes: string | null;
  url: string | null;
  max_accounts: string | null;
  active: number;
  rotation_order: number;
  last_posted_at: string | null;
  stagger_hours: number;
  credential_ref: string | null;
}

function rowToAccount(r: Row): PlatformAccount {
  return {
    id: r.id,
    brandId: r.brand_id,
    platform: r.platform,
    handle: r.handle,
    email: r.email,
    trackingId: r.tracking_id,
    status: r.status,
    notes: r.notes,
    url: r.url,
    maxAccounts: r.max_accounts,
    active: r.active === 1,
    rotationOrder: r.rotation_order,
    lastPostedAt: r.last_posted_at,
    staggerHours: r.stagger_hours,
    credentialRef: r.credential_ref,
  };
}

export class PlatformAccountsService {
  constructor(private db: Db) {}

  list(filter?: AccountFilter): PlatformAccount[] {
    let sql = "SELECT * FROM platform_accounts";
    const params: unknown[] = [];
    if (filter && "brandId" in filter) {
      if (filter.brandId === null) {
        sql += " WHERE brand_id IS NULL";
      } else if (filter.brandId !== undefined) {
        sql += " WHERE brand_id = ?";
        params.push(filter.brandId);
      }
    }
    sql += " ORDER BY rotation_order ASC, id ASC";
    const rows = this.db.raw.prepare(sql).all(...params) as Row[];
    return rows.map(rowToAccount);
  }

  get(id: number): PlatformAccount | undefined {
    const r = this.db.raw.prepare("SELECT * FROM platform_accounts WHERE id=?").get(id) as Row | undefined;
    return r ? rowToAccount(r) : undefined;
  }

  create(data: NewPlatformAccount): PlatformAccount {
    const info = this.db.raw
      .prepare(
        `INSERT INTO platform_accounts
          (brand_id, platform, handle, email, tracking_id, status, notes, url, max_accounts,
           active, rotation_order, last_posted_at, stagger_hours, credential_ref)
         VALUES
          (@brand_id, @platform, @handle, @email, @tracking_id, @status, @notes, @url, @max_accounts,
           @active, @rotation_order, @last_posted_at, @stagger_hours, @credential_ref)`
      )
      .run({
        brand_id: data.brandId ?? null,
        platform: data.platform,
        handle: data.handle ?? "",
        email: data.email ?? "",
        tracking_id: data.trackingId ?? null,
        status: data.status ?? "not-started",
        notes: data.notes ?? null,
        url: data.url ?? null,
        max_accounts: data.maxAccounts ?? null,
        active: data.active ? 1 : 0,
        rotation_order: data.rotationOrder ?? 0,
        last_posted_at: data.lastPostedAt ?? null,
        stagger_hours: data.staggerHours ?? 4.0,
        credential_ref: data.credentialRef ?? null,
      });
    return this.get(Number(info.lastInsertRowid))!;
  }

  update(id: number, patch: Partial<NewPlatformAccount>): PlatformAccount | undefined {
    const existing = this.get(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...patch };
    this.db.raw
      .prepare(
        `UPDATE platform_accounts SET
          brand_id=@brand_id, platform=@platform, handle=@handle, email=@email,
          tracking_id=@tracking_id, status=@status, notes=@notes, url=@url,
          max_accounts=@max_accounts, active=@active, rotation_order=@rotation_order,
          last_posted_at=@last_posted_at, stagger_hours=@stagger_hours, credential_ref=@credential_ref
         WHERE id=@id`
      )
      .run({
        id,
        brand_id: merged.brandId ?? null,
        platform: merged.platform,
        handle: merged.handle,
        email: merged.email,
        tracking_id: merged.trackingId ?? null,
        status: merged.status,
        notes: merged.notes ?? null,
        url: merged.url ?? null,
        max_accounts: merged.maxAccounts ?? null,
        active: merged.active ? 1 : 0,
        rotation_order: merged.rotationOrder,
        last_posted_at: merged.lastPostedAt ?? null,
        stagger_hours: merged.staggerHours,
        credential_ref: merged.credentialRef ?? null,
      });
    return this.get(id);
  }

  remove(id: number): boolean {
    const info = this.db.raw.prepare("DELETE FROM platform_accounts WHERE id=?").run(id);
    return info.changes > 0;
  }
}
```

- [ ] **Step 4: Write the router** — `server/routes/platform-accounts.ts`

```typescript
import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import {
  PlatformAccountsService,
  type NewPlatformAccount,
  type AccountFilter,
} from "../services/platform-accounts.service.js";

const REQUIRED: (keyof NewPlatformAccount)[] = ["platform"];

export function createPlatformAccountsRouter(db: Db): Router {
  const router = Router();
  const svc = new PlatformAccountsService(db);

  router.get("/", (req: Request, res: Response) => {
    try {
      const brandIdParam = req.query["brandId"];
      let filter: AccountFilter | undefined;
      if (typeof brandIdParam === "string") {
        filter = { brandId: brandIdParam === "none" ? null : brandIdParam };
      }
      res.json(svc.list(filter));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post("/", (req: Request, res: Response) => {
    const body = req.body as Partial<NewPlatformAccount>;
    const missing = REQUIRED.filter((k) => body[k] === undefined || body[k] === null || body[k] === "");
    if (missing.length) {
      res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
      return;
    }
    try {
      res.status(201).json(svc.create(body as NewPlatformAccount));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get("/:id", (req: Request, res: Response) => {
    const acct = svc.get(Number(req.params["id"]));
    if (!acct) {
      res.status(404).json({ error: `Platform account not found: ${req.params["id"]}` });
      return;
    }
    res.json(acct);
  });

  router.put("/:id", (req: Request, res: Response) => {
    const updated = svc.update(Number(req.params["id"]), req.body as Partial<NewPlatformAccount>);
    if (!updated) {
      res.status(404).json({ error: `Platform account not found: ${req.params["id"]}` });
      return;
    }
    res.json(updated);
  });

  router.delete("/:id", (req: Request, res: Response) => {
    const ok = svc.remove(Number(req.params["id"]));
    if (!ok) {
      res.status(404).json({ error: `Platform account not found: ${req.params["id"]}` });
      return;
    }
    res.json({ ok: true });
  });

  return router;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/platform-accounts.test.ts`
Expected: PASS — all 9 tests green.

- [ ] **Step 6: Commit**

```bash
git add server/services/platform-accounts.service.ts server/routes/platform-accounts.ts server/test/platform-accounts.test.ts
git commit -m "Add PlatformAccountsService and /api/platform-accounts router with tests"
```

---

## Task 3: Mount both routers in the server

**Files:**
- Modify: `server/index.ts` (near the existing `/api/transactions` mount)

- [ ] **Step 1: Add the router imports**

At the top of `server/index.ts`, alongside the existing route imports (e.g. `import { createTransactionsRouter } from "./routes/transactions.js";`), add:

```typescript
import { createBrandsRouter } from "./routes/brands.js";
import { createPlatformAccountsRouter } from "./routes/platform-accounts.js";
```

- [ ] **Step 2: Mount the routers**

Immediately after the existing `app.use("/api/transactions", createTransactionsRouter(db));` line, add:

```typescript
app.use("/api/brands", createBrandsRouter(db));
app.use("/api/platform-accounts", createPlatformAccountsRouter(db));
```

- [ ] **Step 3: Run the full server suite to confirm nothing regressed**

Run: `npx vitest run`
Expected: PASS — previous 132 pass / 1 skip, plus the new brand + account tests (8 + 9). No failures.

- [ ] **Step 4: Commit**

```bash
git add server/index.ts
git commit -m "Mount /api/brands and /api/platform-accounts routers"
```

---

## Task 4: Extend the client PlatformAccount type

**Files:**
- Modify: `client/src/types/index.ts` (the `PlatformAccount` interface, ~lines 180-189)

- [ ] **Step 1: Add the optional DB fields**

Replace the existing `PlatformAccount` interface with (existing fields unchanged, new optional fields appended):

```typescript
export interface PlatformAccount {
  platform: string;
  handle: string;
  email: string;
  trackingId?: string;
  status: "active" | "pending" | "not-started";
  notes?: string;
  url?: string;
  maxAccounts?: string;
  // DB-sourced routing fields (slice 1) — optional so hardcoded entity.ts still compiles
  id?: number;
  brandId?: string | null;
  active?: boolean;
  rotationOrder?: number;
  lastPostedAt?: string | null;
  staggerHours?: number;
  credentialRef?: string | null;
}
```

- [ ] **Step 2: Verify the client still type-checks and builds**

Run (from the `client` directory): `npm run build`
Expected: PASS — clean build, no type errors. `entity.ts` (which omits the new fields) still compiles because they are optional.

- [ ] **Step 3: Commit**

```bash
git add client/src/types/index.ts
git commit -m "Extend client PlatformAccount type with optional DB routing fields"
```

---

## Task 5: useBrands hook

**Files:**
- Create: `client/src/hooks/useBrands.ts`

- [ ] **Step 1: Write the hook**

Note: the server brand DTO is the flat record (no nested `accounts[]`), so the hook types its state as `Omit<Brand, "accounts">` to match the API shape without altering the `Brand` type.

```typescript
import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Brand } from "../types";

export type BrandRecord = Omit<Brand, "accounts">;

export interface NewBrand {
  id?: string;
  name: string;
  ecosystemId: string;
  email?: string;
}

export function useBrands() {
  const [brands, setBrands] = useState<BrandRecord[]>([]);

  useEffect(() => {
    api.get<BrandRecord[]>("/brands").then(setBrands).catch(console.error);
  }, []);

  const addBrand = useCallback((data: NewBrand) => {
    api
      .post<BrandRecord>("/brands", data)
      .then((created) => setBrands((prev) => [created, ...prev]))
      .catch(console.error);
  }, []);

  const updateBrand = useCallback((id: string, data: Partial<NewBrand>) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    api.put<BrandRecord>(`/brands/${id}`, data).catch(console.error);
  }, []);

  const deleteBrand = useCallback((id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
    api.del(`/brands/${id}`).catch(console.error);
  }, []);

  return { brands, addBrand, updateBrand, deleteBrand };
}
```

- [ ] **Step 2: Verify the client builds**

Run (from the `client` directory): `npm run build`
Expected: PASS — clean build.

- [ ] **Step 3: Commit**

```bash
git add client/src/hooks/useBrands.ts
git commit -m "Add useBrands client hook"
```

---

## Task 6: usePlatformAccounts hook

**Files:**
- Create: `client/src/hooks/usePlatformAccounts.ts`

- [ ] **Step 1: Write the hook**

```typescript
import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { PlatformAccount } from "../types";

export interface NewPlatformAccount {
  brandId?: string | null;
  platform: string;
  handle?: string;
  email?: string;
  trackingId?: string;
  status?: "active" | "pending" | "not-started";
  notes?: string;
  url?: string;
  maxAccounts?: string;
  active?: boolean;
  rotationOrder?: number;
  lastPostedAt?: string;
  staggerHours?: number;
  credentialRef?: string;
}

export function usePlatformAccounts(brandId?: string) {
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);

  useEffect(() => {
    const path = brandId
      ? `/platform-accounts?brandId=${encodeURIComponent(brandId)}`
      : "/platform-accounts";
    api.get<PlatformAccount[]>(path).then(setAccounts).catch(console.error);
  }, [brandId]);

  const addAccount = useCallback((data: NewPlatformAccount) => {
    api
      .post<PlatformAccount>("/platform-accounts", data)
      .then((created) => setAccounts((prev) => [...prev, created]))
      .catch(console.error);
  }, []);

  const updateAccount = useCallback((id: number, data: Partial<NewPlatformAccount>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
    api.put<PlatformAccount>(`/platform-accounts/${id}`, data).catch(console.error);
  }, []);

  const deleteAccount = useCallback((id: number) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    api.del(`/platform-accounts/${id}`).catch(console.error);
  }, []);

  return { accounts, addAccount, updateAccount, deleteAccount };
}
```

- [ ] **Step 2: Verify the client builds**

Run (from the `client` directory): `npm run build`
Expected: PASS — clean build.

- [ ] **Step 3: Commit**

```bash
git add client/src/hooks/usePlatformAccounts.ts
git commit -m "Add usePlatformAccounts client hook"
```

---

## Final verification

- [ ] **Server tests:** from `server/`, run `npx vitest run` → previous 132 pass / 1 skip plus 17 new tests, all green.
- [ ] **Client tests + build:** from `client/`, run `npx vitest run` (existing 52 pass, unaffected) and `npm run build` (clean).

## Notes for the implementer

- This repo uses NodeNext ESM on the server: intra-project imports MUST carry the `.js` suffix even though the source files are `.ts` (see how `transactions.ts` imports `../db.js`). Follow that exactly.
- DB access is `this.db.raw.prepare(...)` with named (`@param`) or positional (`?`) bindings; better-sqlite3 is synchronous — no `await`.
- `genId()` for brands intentionally mirrors the transactions service id scheme but with a `brn_` prefix.
- Do not touch `entity.ts`, `EntityPage.tsx`, or the wizard — those are slice 3.
