# Slice 1: Brand & Account Data/API Foundation — Design

**Issue:** #16 (sub-issue of epic #15 "Brand-centric multi-account Setup (umbrella model)")
**Date:** 2026-06-30
**Status:** Approved
**Scope:** Mission Control server + client. Data/API layer only — no wizard UI, no Entity-page rewire.

## Background

The Setup wizard currently persists ad-hoc fields to the `setup_data` table and ignores the
multi-account / brand-isolation (umbrella) architecture. Module 1's routing model already defines
the canonical tables — `brands` and `platform_accounts` — but no service, route, or client hook
exposes them. This slice builds that foundation so later slices can drive a brand-centric wizard
(slice 2) and rewire the hardcoded Entity page onto the database (slice 3).

Canonical model is **umbrella**: a single root domain (`abundenz.com`) with per-brand subdomain /
email alias, transparent ownership. Brand naming convention: every brand name contains a "z"
(e.g. `Zrodinger`).

## Goal

A working, tested data + API layer over the existing `brands` and `platform_accounts` tables,
plus the client types and hooks needed to consume it. No UI changes.

## Existing tables (already in `server/db.ts`)

```sql
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ecosystem_id TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT ''
);

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
  stagger_hours REAL NOT NULL DEFAULT 4.0,      -- min hours between posts
  credential_ref TEXT,                          -- env var key for this account's token
  FOREIGN KEY (brand_id) REFERENCES brands(id)
);
```

No schema migration required. `pragma("foreign_keys = ON")` is already set on connect.

## Architecture

Mirrors the established `transactions` pattern exactly: per-resource service class taking a `Db`,
factory-function router with `REQUIRED`-field validation, optimistic client hook over the `api.*`
helper. camelCase DTOs at the boundary, snake_case `Row` internally, explicit conversion functions.

### 1. Services — `server/services/`

Two separate files, one class each.

**`brands.service.ts` — `BrandsService`**
- DTO `Brand` (server-side): `{ id, name, ecosystemId, email }`. Note: distinct from the client
  `Brand` type, which nests `accounts[]`. The service returns the flat row only.
- `NewBrand = Omit<Brand, "id"> & { id?: string }` — `create` accepts an optional caller-supplied
  `id` (a slug such as `zrodinger`). When omitted, generate `brn_${...}` using the same id scheme
  as `genId()` in the transactions service.
- Methods: `list()`, `get(id)`, `create(data)`, `update(id, patch)`, `remove(id)`.
- `email` defaults to `""` when not provided (matches column default).

**`platform-accounts.service.ts` — `PlatformAccountsService`**
- DTO `PlatformAccount` (server-side):
  `{ id, brandId, platform, handle, email, trackingId, status, notes, url, maxAccounts,
     active, rotationOrder, lastPostedAt, staggerHours, credentialRef }`.
- `NewPlatformAccount = Omit<PlatformAccount, "id">` — `id` is DB `AUTOINCREMENT`, never generated
  in code. `create` returns the row with its assigned integer id (via `lastInsertRowid`, then re-fetch).
- Boolean coercion: `active` is `boolean` in the DTO, stored as `INTEGER 0/1`. Convert in both
  directions in the row mapper.
- Defaults applied on create when fields omitted: `handle=""`, `email=""`, `status="not-started"`,
  `active=false`, `rotationOrder=0`, `staggerHours=4.0`. `brandId`, `trackingId`, `notes`, `url`,
  `maxAccounts`, `lastPostedAt`, `credentialRef` are nullable.
- Methods: `list(filter?)`, `get(id)`, `create(data)`, `update(id, patch)`, `remove(id)`.
- `list(filter?)`: `filter` is `{ brandId?: string | null }`.
  - omitted / `undefined` → all rows
  - a string → `WHERE brand_id = ?`
  - explicit `null` → `WHERE brand_id IS NULL` (shared accounts)

### 2. Routes — `server/routes/`

Two factory routers, mirroring `createTransactionsRouter`. Status codes: 200 (GET/PUT/DELETE),
201 (POST create), 400 (validation), 404 (not found), 500 (caught exception).

**`brands.ts` — `createBrandsRouter(db)`** mounted at `/api/brands`
- `GET /` → list
- `POST /` → create. `REQUIRED = ["name", "ecosystemId"]`.
- `GET /:id` → 404 if missing
- `PUT /:id` → 404 if missing
- `DELETE /:id` → 404 if missing

**`platform-accounts.ts` — `createPlatformAccountsRouter(db)`** mounted at `/api/platform-accounts`
- `GET /` → list. Query `?brandId=<id>` filters by brand; `?brandId=none` filters to shared
  (NULL) accounts; absent → all.
- `POST /` → create. `REQUIRED = ["platform"]`.
- `GET /:id` → 404 if missing (id parsed as integer)
- `PUT /:id` → 404 if missing
- `DELETE /:id` → 404 if missing

Both routers registered in `server/index.ts` alongside the existing `/api/transactions` mount.

### 3. Client types — `client/src/types/index.ts`

Extend the existing `PlatformAccount` interface with the DB routing fields, all **optional**
(option A — non-breaking, so the hardcoded `entity.ts` keeps compiling until slice 3):

```typescript
export interface PlatformAccount {
  // existing
  platform: string;
  handle: string;
  email: string;
  trackingId?: string;
  status: "active" | "pending" | "not-started";
  notes?: string;
  url?: string;
  maxAccounts?: string;
  // added (DB-sourced, optional)
  id?: number;
  brandId?: string | null;
  active?: boolean;
  rotationOrder?: number;
  lastPostedAt?: string | null;
  staggerHours?: number;
  credentialRef?: string | null;
}
```

`Brand` and `Entity` types are left unchanged in this slice.

### 4. Client hooks — `client/src/hooks/`

Mirror `useTransactions` (useState + useEffect autofetch + useCallback optimistic CRUD over
`api.get/post/put/del`).

**`useBrands.ts` — `useBrands()`** → `{ brands, addBrand, updateBrand, deleteBrand }`,
fetches `/brands`.

**`usePlatformAccounts.ts` — `usePlatformAccounts(brandId?)`** →
`{ accounts, addAccount, updateAccount, deleteAccount }`, fetches `/platform-accounts`
(with `?brandId=` when an argument is given). Re-fetches when `brandId` changes.

### 5. Tests — `server/test/`

Vitest + supertest, fresh `createDb(":memory:")` per test, fixture-driven. Mirror
`transactions.test.ts`.

**`brands.test.ts`**
- GET returns `[]` initially
- POST creates, returns camelCase row; generated `brn_` id when none supplied; honors a
  supplied slug id
- POST + GET round-trip
- PUT partial update preserves other fields; 404 on missing id
- DELETE removes; 404 on missing id
- POST validation → 400 when `name`/`ecosystemId` missing

**`platform-accounts.test.ts`**
- GET returns `[]` initially
- POST creates with integer id; defaults applied (status, active=false, staggerHours=4.0,
  rotationOrder=0)
- boolean coercion: `active: true` round-trips as boolean, not `1`
- `?brandId=<id>` filter returns only that brand's accounts
- `?brandId=none` returns only NULL/shared accounts
- PUT partial update; 404 on missing id
- DELETE removes; 404 on missing id
- POST validation → 400 when `platform` missing

## Out of scope (later slices)

- Slice 2: brand-centric wizard UI.
- Slice 3: Entity-page DB rewire, seeding `entity.ts` → DB, fixing the wizard's domain step
  (currently says "register yourbrand.com", contradicts the umbrella subdomain decision),
  tightening the optional `PlatformAccount` fields to required.

## Verification

- `cd .canon\.mission-control\server; npx vitest run` — existing 132 pass/1 skip plus the new
  brand + account tests, all green.
- `cd .canon\.mission-control\client; npx vitest run` — existing 52 pass unaffected; `npm run build`
  clean (type extension compiles, `entity.ts` untouched).
