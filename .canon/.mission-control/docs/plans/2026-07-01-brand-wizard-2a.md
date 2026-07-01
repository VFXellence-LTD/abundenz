# Brand-centric Wizard — PR 2a (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or a Workflow pipeline. Steps use checkbox (`- [ ]`) syntax. TDD throughout.

**Goal:** Server + hooks + brand create/select/seed foundation for the brand-centric wizard — every wizard field becomes brand-scoped, and users can create/select brands per ecosystem.

**Architecture:** Additive, back-compatible. `setup_data` + `setup_progress` gain a `brand_id` column (via table-rebuild migration, since their PKs must include it); `brand_id=''` is the legacy/global scope so existing behavior is preserved. `SetupService` + `setup.ts` routes thread an optional `brandId`. Client hooks thread `brandId`; `useBrands.addBrand` returns the created record. New `BrandSelector` + `BrandCreateForm` components + `SetupPage` wiring. 2b rewires the actual step content — 2a leaves the stepper rendering current steps, just brand-scoped.

**Tech Stack:** TypeScript NodeNext ESM (`.js` import suffixes on server), Express, better-sqlite3 (synchronous), React + React Router v7, Tailwind 4, Vitest + supertest + @testing-library/react.

**Issue:** #18. **Spec:** `docs/specs/2026-07-01-brand-centric-wizard-design.md`.

**Working dir:** server cmds from `.canon/.mission-control/server`; client cmds from `.canon/.mission-control/client`. Paths below are relative to `.canon/.mission-control/`. Git: `git -C "<worktree-root>"`.

---

## File Structure

- Modify `server/db.ts` — new `setup_data`/`setup_progress` schema + guarded rebuild migration.
- Modify `server/services/setup.service.ts` — brand-scope all four methods.
- Modify `server/routes/setup.ts` — thread `brandId` (query on GET, body on PUT/POST).
- Modify `server/test/setup.test.ts` + `server/test/setup.route.test.ts` — brand-scoping + migration tests.
- Modify `client/src/hooks/useSetupData.ts` — `useSetupData(ecosystem, brandId?)`.
- Modify `client/src/hooks/useSetupProgress.ts` — `useSetupProgress(brandId?)`.
- Modify `client/src/hooks/useBrands.ts` — `addBrand` returns `Promise<BrandRecord>`.
- Create `client/src/components/BrandSelector.tsx` + `.test.tsx`.
- Create `client/src/components/BrandCreateForm.tsx` + `.test.tsx`.
- Modify `client/src/pages/SetupPage.tsx` — selector + empty state + `?brand=` + brand-scoped hooks.

---

## Task 1: Server migration — brand_id on setup_data + setup_progress

**Files:** Modify `server/db.ts`. Test: `server/test/setup.migration.test.ts` (new).

- [ ] **Step 1: Write the failing migration test** — `server/test/setup.migration.test.ts`

```typescript
import { describe, it, expect, afterEach } from "vitest";
import Database from "better-sqlite3";
import { createDb, type Db } from "../db.js";

let db: Db;
afterEach(() => db?.close());

function cols(raw: Database.Database, table: string): string[] {
  return (raw.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).map((r) => r.name);
}

describe("setup brand_id migration", () => {
  it("fresh DB has brand_id on setup_data and setup_progress", () => {
    db = createDb(":memory:");
    expect(cols(db.raw, "setup_data")).toContain("brand_id");
    expect(cols(db.raw, "setup_progress")).toContain("brand_id");
  });

  it("migrate() is idempotent (running twice keeps one brand_id column)", () => {
    db = createDb(":memory:");
    db.migrate();
    db.migrate();
    expect(cols(db.raw, "setup_data").filter((c) => c === "brand_id")).toHaveLength(1);
    expect(cols(db.raw, "setup_progress").filter((c) => c === "brand_id")).toHaveLength(1);
  });

  it("rebuilds a legacy (pre-brand_id) setup_data table, preserving rows as brand_id=''", () => {
    const raw = new Database(":memory:");
    // Simulate the OLD schema + a legacy row
    raw.exec(`
      CREATE TABLE setup_data (ecosystem_id TEXT NOT NULL, step_id TEXT NOT NULL, field_key TEXT NOT NULL, value TEXT NOT NULL DEFAULT '', PRIMARY KEY (ecosystem_id, step_id, field_key));
      CREATE TABLE setup_progress (step_id TEXT PRIMARY KEY, done INTEGER NOT NULL DEFAULT 0);
      INSERT INTO setup_data VALUES ('content','domain','domain','old.com');
      INSERT INTO setup_progress VALUES ('s1', 1);
    `);
    raw.close();
    // Note: :memory: can't be reopened; this test asserts the rebuild helper logic via a file DB instead.
  });
});
```

> Note for implementer: `:memory:` DBs cannot be reopened, so the third test above is a placeholder illustrating intent. Replace it with a **file-based** temp DB: create an OLD-schema DB at a temp path, close it, then open it via `createDb(tempPath)` (which runs `migrate()`), and assert `brand_id` now exists and the legacy row survives with `brand_id=''`. Use `node:os` tmpdir + `node:fs` to make/cleanup the temp file. Write this test concretely — no placeholder in the final file.

- [ ] **Step 2: Run test — expect FAIL** (`brand_id` not present).
Run: `npx vitest run test/setup.migration.test.ts`

- [ ] **Step 3: Update the CREATE statements in `db.ts`**

In the big `this.raw.exec(...)` block, replace the two table definitions:

```sql
    CREATE TABLE IF NOT EXISTS setup_progress (
      step_id TEXT PRIMARY KEY,
      done INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS setup_data (
      ecosystem_id TEXT NOT NULL,
      step_id TEXT NOT NULL,
      field_key TEXT NOT NULL,
      value TEXT NOT NULL DEFAULT '',
      PRIMARY KEY (ecosystem_id, step_id, field_key)
    );
```

with:

```sql
    CREATE TABLE IF NOT EXISTS setup_progress (
      brand_id TEXT NOT NULL DEFAULT '',
      step_id TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (brand_id, step_id)
    );

    CREATE TABLE IF NOT EXISTS setup_data (
      brand_id TEXT NOT NULL DEFAULT '',
      ecosystem_id TEXT NOT NULL,
      step_id TEXT NOT NULL,
      field_key TEXT NOT NULL,
      value TEXT NOT NULL DEFAULT '',
      PRIMARY KEY (brand_id, ecosystem_id, step_id, field_key)
    );
```

- [ ] **Step 4: Add the guarded rebuild for legacy DBs**

At the end of `migrate()`, AFTER the `additive` loop and BEFORE `createScopedViews(this.raw)`, add:

```typescript
    migrateSetupBrandScope(this.raw);
```

Then add this module-level helper in `db.ts` (near `createScopedViews`, matching its style):

```typescript
/**
 * One-time rebuild for DBs created before setup_data / setup_progress gained
 * brand_id. SQLite can't ALTER a PRIMARY KEY, so we rebuild the table and
 * backfill legacy rows with brand_id='' (the global/legacy scope). Idempotent:
 * skips when brand_id already exists.
 */
function migrateSetupBrandScope(raw: Database.Database): void {
  const hasCol = (table: string, col: string): boolean =>
    (raw.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).some((r) => r.name === col);

  if (!hasCol("setup_data", "brand_id")) {
    raw.exec(`
      ALTER TABLE setup_data RENAME TO setup_data_old;
      CREATE TABLE setup_data (
        brand_id TEXT NOT NULL DEFAULT '',
        ecosystem_id TEXT NOT NULL,
        step_id TEXT NOT NULL,
        field_key TEXT NOT NULL,
        value TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (brand_id, ecosystem_id, step_id, field_key)
      );
      INSERT INTO setup_data (brand_id, ecosystem_id, step_id, field_key, value)
        SELECT '', ecosystem_id, step_id, field_key, value FROM setup_data_old;
      DROP TABLE setup_data_old;
    `);
  }

  if (!hasCol("setup_progress", "brand_id")) {
    raw.exec(`
      ALTER TABLE setup_progress RENAME TO setup_progress_old;
      CREATE TABLE setup_progress (
        brand_id TEXT NOT NULL DEFAULT '',
        step_id TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (brand_id, step_id)
      );
      INSERT INTO setup_progress (brand_id, step_id, done)
        SELECT '', step_id, done FROM setup_progress_old;
      DROP TABLE setup_progress_old;
    `);
  }
}
```

Ensure `Database` is imported in `db.ts` (it already imports `better-sqlite3` as `Database` — reuse that type).

- [ ] **Step 5: Run test — expect PASS.** `npx vitest run test/setup.migration.test.ts`

- [ ] **Step 6: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/server/db.ts .canon/.mission-control/server/test/setup.migration.test.ts
git -C "<worktree-root>" commit -m "Add brand_id scoping to setup_data and setup_progress tables"
```

---

## Task 2: SetupService — brand-scope all methods

**Files:** Modify `server/services/setup.service.ts`. Test: extend `server/test/setup.route.test.ts` (service-layer section).

Read the current `setup.service.ts` first. It has: `getProgress()`, `toggle(stepId)`, `getData(ecosystemId)`, `setField(ecosystemId, stepId, fieldKey, value)`. All operate on the tables without a brand dimension.

- [ ] **Step 1: Write failing service tests** — add to `server/test/setup.route.test.ts` inside the "SetupService — field data" describe (or a new describe):

```typescript
  it("setField/getData isolate by brand; '' is the default/legacy scope", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "z-one.com", "brnA");
    svc.setField("content", "domain", "domain", "z-two.com", "brnB");
    svc.setField("content", "domain", "domain", "legacy.com"); // no brandId => ''
    expect(svc.getData("content", "brnA")).toEqual({ domain: { domain: "z-one.com" } });
    expect(svc.getData("content", "brnB")).toEqual({ domain: { domain: "z-two.com" } });
    expect(svc.getData("content")).toEqual({ domain: { domain: "legacy.com" } });
  });

  it("getProgress/toggle isolate by brand", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.toggle("s1", "brnA");
    expect(svc.getProgress("brnA")).toEqual({ s1: true });
    expect(svc.getProgress("brnB")).toEqual({});
    expect(svc.getProgress()).toEqual({}); // legacy scope untouched
  });
```

- [ ] **Step 2: Run — expect FAIL** (methods don't accept brandId). `npx vitest run test/setup.route.test.ts`

- [ ] **Step 3: Update `setup.service.ts`** — give each method an optional `brandId` defaulting to `""`, and include `brand_id` in every SQL statement. Exact target signatures + SQL:

```typescript
  getProgress(brandId = ""): Record<string, boolean> {
    const rows = this.db.raw
      .prepare("SELECT step_id, done FROM setup_progress WHERE brand_id = ?")
      .all(brandId) as { step_id: string; done: number }[];
    const out: Record<string, boolean> = {};
    for (const r of rows) out[r.step_id] = r.done === 1;
    return out;
  }

  toggle(stepId: string, brandId = ""): Record<string, boolean> {
    const cur = this.db.raw
      .prepare("SELECT done FROM setup_progress WHERE brand_id = ? AND step_id = ?")
      .get(brandId, stepId) as { done: number } | undefined;
    const next = cur?.done === 1 ? 0 : 1;
    this.db.raw
      .prepare(
        `INSERT INTO setup_progress (brand_id, step_id, done) VALUES (?, ?, ?)
         ON CONFLICT(brand_id, step_id) DO UPDATE SET done = excluded.done`
      )
      .run(brandId, stepId, next);
    return this.getProgress(brandId);
  }

  getData(ecosystemId: string, brandId = ""): Record<string, Record<string, string>> {
    const rows = this.db.raw
      .prepare("SELECT step_id, field_key, value FROM setup_data WHERE brand_id = ? AND ecosystem_id = ?")
      .all(brandId, ecosystemId) as { step_id: string; field_key: string; value: string }[];
    const out: Record<string, Record<string, string>> = {};
    for (const r of rows) {
      (out[r.step_id] ??= {})[r.field_key] = r.value;
    }
    return out;
  }

  setField(ecosystemId: string, stepId: string, fieldKey: string, value: string, brandId = ""): void {
    this.db.raw
      .prepare(
        `INSERT INTO setup_data (brand_id, ecosystem_id, step_id, field_key, value) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(brand_id, ecosystem_id, step_id, field_key) DO UPDATE SET value = excluded.value`
      )
      .run(brandId, ecosystemId, stepId, fieldKey, value);
  }
```

Match the existing method bodies' surrounding structure (constructor `constructor(private db: Db) {}`, imports). If the current implementation uses different internal helpers (e.g. a shared upsert), adapt to preserve the same style while adding `brand_id`. Preserve exact current return SHAPES (the existing tests assert them).

- [ ] **Step 4: Run — expect PASS** (new + existing service tests). `npx vitest run test/setup.route.test.ts`

- [ ] **Step 5: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/server/services/setup.service.ts .canon/.mission-control/server/test/setup.route.test.ts
git -C "<worktree-root>" commit -m "Brand-scope SetupService progress and field-data methods"
```

---

## Task 3: setup.ts routes — thread brandId

**Files:** Modify `server/routes/setup.ts`. Test: extend `server/test/setup.test.ts`.

- [ ] **Step 1: Write failing route tests** — add to `server/test/setup.test.ts`:

```typescript
describe("setup API brand scoping", () => {
  it("toggle + GET isolate by brandId query", async () => {
    await request(app).post("/api/setup/toggle").send({ stepId: "s1", brandId: "brnA" });
    const a = await request(app).get("/api/setup?brandId=brnA");
    expect(a.body).toEqual({ s1: true });
    const b = await request(app).get("/api/setup?brandId=brnB");
    expect(b.body).toEqual({});
    const legacy = await request(app).get("/api/setup");
    expect(legacy.body).toEqual({});
  });

  it("PUT/GET data isolate by brandId", async () => {
    await request(app).put("/api/setup/data")
      .send({ ecosystemId: "content", stepId: "domain", fieldKey: "domain", value: "z.com", brandId: "brnA" });
    const a = await request(app).get("/api/setup/data/content?brandId=brnA");
    expect(a.body).toEqual({ domain: { domain: "z.com" } });
    const none = await request(app).get("/api/setup/data/content?brandId=brnB");
    expect(none.body).toEqual({});
  });
});
```

- [ ] **Step 2: Run — expect FAIL.** `npx vitest run test/setup.test.ts`

- [ ] **Step 3: Update `setup.ts`** — read `brandId` from query (GET) / body (PUT/POST), pass through. `brandId` is optional; coerce to string or `undefined` (the service defaults to `""`). Full updated handlers:

```typescript
  router.get("/", (req: Request, res: Response) => {
    try {
      const brandId = typeof req.query.brandId === "string" ? req.query.brandId : undefined;
      res.json(svc.getProgress(brandId));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/toggle", (req: Request, res: Response) => {
    const { stepId, brandId } = req.body as { stepId?: string; brandId?: string };
    if (!stepId || typeof stepId !== "string") {
      res.status(400).json({ error: "Missing required field: stepId" });
      return;
    }
    try {
      res.json(svc.toggle(stepId, typeof brandId === "string" ? brandId : undefined));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.get("/data/:ecosystemId", (req: Request, res: Response) => {
    try {
      const brandId = typeof req.query.brandId === "string" ? req.query.brandId : undefined;
      res.json(svc.getData(req.params.ecosystemId, brandId));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.put("/data", (req: Request, res: Response) => {
    const { ecosystemId, stepId, fieldKey, value, brandId } = req.body as {
      ecosystemId?: string; stepId?: string; fieldKey?: string; value?: string; brandId?: string;
    };
    if (
      typeof ecosystemId !== "string" || !ecosystemId ||
      typeof stepId !== "string" || !stepId ||
      typeof fieldKey !== "string" || !fieldKey ||
      typeof value !== "string"
    ) {
      res.status(400).json({ error: "Missing/invalid fields: ecosystemId, stepId, fieldKey, value" });
      return;
    }
    try {
      svc.setField(ecosystemId, stepId, fieldKey, value, typeof brandId === "string" ? brandId : undefined);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });
```

- [ ] **Step 4: Run — expect PASS** (new + existing). `npx vitest run test/setup.test.ts test/setup.route.test.ts`

- [ ] **Step 5: Full server suite green.** `npx vitest run` — no regressions.

- [ ] **Step 6: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/server/routes/setup.ts .canon/.mission-control/server/test/setup.test.ts
git -C "<worktree-root>" commit -m "Thread optional brandId through setup routes"
```

---

## Task 4: Client hooks — brandId threading + addBrand returns record

**Files:** Modify `useSetupData.ts`, `useSetupProgress.ts`, `useBrands.ts`.

- [ ] **Step 1: `useBrands.addBrand` returns `Promise<BrandRecord>`**

Replace `addBrand` in `client/src/hooks/useBrands.ts`:

```typescript
  const addBrand = useCallback((data: NewBrand): Promise<BrandRecord> => {
    return api
      .post<BrandRecord>("/brands", data)
      .then((created) => {
        setBrands((prev) => [created, ...prev]);
        return created;
      });
  }, []);
```

(Callers that ignore the return keep working; new callers await it. Errors now propagate to the caller — that's intended for the seed flow.)

- [ ] **Step 2: `useSetupData(ecosystem, brandId?)`**

Update `client/src/hooks/useSetupData.ts`: add a second param `brandId?: string`, include it in the fetch path and PUT body, and add it to the effect + persister dependency lists so switching brand refetches and rebinds persisters. Full changes:

- Signature: `export function useSetupData(ecosystemId: EcosystemId, brandId?: string) {`
- Fetch effect: build the path with an optional query and depend on `brandId`:

```typescript
  useEffect(() => {
    let alive = true;
    persistersRef.current = {};
    const q = brandId ? `?brandId=${encodeURIComponent(brandId)}` : "";
    api
      .get<DataMap>(`/setup/data/${ecosystemId}${q}`)
      .then((d) => { if (alive) setData(d); })
      .catch(console.error);
    return () => { alive = false; };
  }, [ecosystemId, brandId]);
```

- Persister PUT body includes brandId, and `getPersister` depends on `brandId`:

```typescript
  const getPersister = useCallback(
    (stepId: string, fieldKey: string) => {
      const k = `${stepId}.${fieldKey}`;
      if (!persistersRef.current[k]) {
        persistersRef.current[k] = debounce((value: string) => {
          api
            .put(`/setup/data`, { ecosystemId, stepId, fieldKey, value, brandId })
            .then(() => setSaved((s) => ({ ...s, [k]: true })))
            .catch(console.error);
        }, 500);
      }
      return persistersRef.current[k];
    },
    [ecosystemId, brandId],
  );
```

(`brandId` undefined → omitted from JSON → server defaults to `''`. Leave the rest of the hook unchanged.)

- [ ] **Step 3: `useSetupProgress(brandId?)`**

Update `client/src/hooks/useSetupProgress.ts`:

```typescript
export function useSetupProgress(brandId?: string) {
  const [progress, setProgress] = useState<SetupProgress>({});

  useEffect(() => {
    const q = brandId ? `?brandId=${encodeURIComponent(brandId)}` : "";
    api.get<SetupProgress>(`/setup${q}`).then(setProgress).catch(console.error);
  }, [brandId]);

  const toggleStep = useCallback((stepId: string) => {
    setProgress((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
    api.post<SetupProgress>("/setup/toggle", { stepId, brandId }).then(setProgress).catch(console.error);
  }, [brandId]);
```

(Leave `isComplete`, `completedCount`, `getEcosystemProgress` unchanged.)

- [ ] **Step 4: Verify build.** From `client/`: `npm run build` → clean (call sites `useSetupData(eco)` / `useSetupProgress()` still valid since brandId is optional).

- [ ] **Step 5: Client test — addBrand resolves with record.** Create `client/src/hooks/useBrands.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useBrands } from "./useBrands";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), del: vi.fn() },
}));

const mockApi = api as unknown as { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };

beforeEach(() => {
  vi.clearAllMocks();
  mockApi.get.mockResolvedValue([]);
});

describe("useBrands", () => {
  it("addBrand resolves with the created record and prepends it", async () => {
    const created = { id: "zrodinger", name: "Zrodinger", ecosystemId: "content", email: "" };
    mockApi.post.mockResolvedValue(created);
    const { result } = renderHook(() => useBrands());
    await waitFor(() => expect(mockApi.get).toHaveBeenCalled());
    let returned: unknown;
    await act(async () => { returned = await result.current.addBrand({ name: "Zrodinger", ecosystemId: "content" }); });
    expect(returned).toEqual(created);
    expect(result.current.brands[0]).toEqual(created);
  });
});
```

Run: `npx vitest run src/hooks/useBrands.test.ts` → PASS.

- [ ] **Step 6: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/client/src/hooks/useBrands.ts .canon/.mission-control/client/src/hooks/useSetupData.ts .canon/.mission-control/client/src/hooks/useSetupProgress.ts .canon/.mission-control/client/src/hooks/useBrands.test.ts
git -C "<worktree-root>" commit -m "Thread brandId through setup hooks; addBrand returns created record"
```

---

## Task 5: BrandSelector component

**Files:** Create `client/src/components/BrandSelector.tsx` + `client/src/components/BrandSelector.test.tsx`.

`BrandSelector` is presentational + controlled: parent passes the ecosystem's brands, the active id, and callbacks. It does NOT call hooks itself (keeps it testable and lets `SetupPage` own state).

- [ ] **Step 1: Write the failing test** — `client/src/components/BrandSelector.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrandSelector } from "./BrandSelector";

const brands = [
  { id: "zrodinger", name: "Zrodinger", ecosystemId: "content" as const, email: "" },
  { id: "zenith", name: "Zenith", ecosystemId: "content" as const, email: "" },
];

describe("BrandSelector", () => {
  it("renders each brand and marks the active one", () => {
    render(<BrandSelector brands={brands} activeBrandId="zenith" onSelect={() => {}} onNew={() => {}} />);
    expect(screen.getByRole("option", { name: "Zenith" })).toBeInTheDocument();
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("zenith");
  });

  it("calls onSelect when a different brand is chosen", () => {
    const onSelect = vi.fn();
    render(<BrandSelector brands={brands} activeBrandId="zenith" onSelect={onSelect} onNew={() => {}} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "zrodinger" } });
    expect(onSelect).toHaveBeenCalledWith("zrodinger");
  });

  it("calls onNew when the New brand button is clicked", () => {
    const onNew = vi.fn();
    render(<BrandSelector brands={brands} activeBrandId={null} onSelect={() => {}} onNew={onNew} />);
    fireEvent.click(screen.getByRole("button", { name: /new brand/i }));
    expect(onNew).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run — expect FAIL** (module missing). `npx vitest run src/components/BrandSelector.test.tsx`

- [ ] **Step 3: Implement** — `client/src/components/BrandSelector.tsx`

```typescript
import type { BrandRecord } from "@/hooks/useBrands";

interface BrandSelectorProps {
  brands: BrandRecord[];
  activeBrandId: string | null;
  onSelect: (brandId: string) => void;
  onNew: () => void;
}

export function BrandSelector({ brands, activeBrandId, onSelect, onNew }: BrandSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Active brand"
        className="border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 rounded focus:border-zinc-500 outline-none"
        value={activeBrandId ?? ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        {activeBrandId === null && <option value="" disabled>Select a brand…</option>}
        {brands.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={onNew}
        className="border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 rounded hover:bg-zinc-800"
      >
        ＋ New brand
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run — expect PASS.** `npx vitest run src/components/BrandSelector.test.tsx`

- [ ] **Step 5: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/client/src/components/BrandSelector.tsx .canon/.mission-control/client/src/components/BrandSelector.test.tsx
git -C "<worktree-root>" commit -m "Add BrandSelector component"
```

---

## Task 6: BrandCreateForm component (z-validation + content seeding)

**Files:** Create `client/src/components/BrandCreateForm.tsx` + `client/src/components/BrandCreateForm.test.tsx`.

Presentational + controlled: parent passes `ecosystemId` and callbacks `onCreate(data): Promise<BrandRecord>` (wraps `addBrand`) and `onSeedChannels(brandId)` (wraps the 7 `addAccount` calls) and `onCreated(brandId)`. The form owns local input state + validation. Keeping create/seed as injected callbacks keeps the component free of hook wiring and unit-testable.

The seed channel list is a shared constant so `SetupPage` and tests agree:

- [ ] **Step 1: Add the seed constant** — create `client/src/data/brand-channels.ts`

```typescript
/** Standard channel set seeded for a new CONTENT brand (slice 2). */
export const CONTENT_SEED_PLATFORMS = [
  "youtube",
  "beehiiv",
  "ghost",
  "x",
  "linkedin",
  "tiktok",
  "instagram",
] as const;
```

- [ ] **Step 2: Write the failing test** — `client/src/components/BrandCreateForm.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrandCreateForm } from "./BrandCreateForm";

function setup(overrides: Partial<Parameters<typeof BrandCreateForm>[0]> = {}) {
  const onCreate = vi.fn().mockResolvedValue({ id: "zrodinger", name: "Zrodinger", ecosystemId: "content", email: "" });
  const onSeedChannels = vi.fn();
  const onCreated = vi.fn();
  render(
    <BrandCreateForm ecosystemId="content" onCreate={onCreate} onSeedChannels={onSeedChannels} onCreated={onCreated} {...overrides} />
  );
  return { onCreate, onSeedChannels, onCreated };
}

describe("BrandCreateForm", () => {
  it("rejects a name without the letter z", async () => {
    const { onCreate } = setup();
    fireEvent.change(screen.getByLabelText(/brand name/i), { target: { value: "Acme" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    expect(await screen.findByText(/must contain the letter/i)).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("creates a content brand, seeds channels, and reports the new id", async () => {
    const { onCreate, onSeedChannels, onCreated } = setup();
    fireEvent.change(screen.getByLabelText(/brand name/i), { target: { value: "Zrodinger" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "hi@abundenz.com" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    await waitFor(() => expect(onCreate).toHaveBeenCalledWith({ name: "Zrodinger", ecosystemId: "content", email: "hi@abundenz.com" }));
    await waitFor(() => expect(onSeedChannels).toHaveBeenCalledWith("zrodinger"));
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith("zrodinger"));
  });

  it("does NOT seed channels for a non-content ecosystem", async () => {
    const onCreate = vi.fn().mockResolvedValue({ id: "zap", name: "Zap", ecosystemId: "viral", email: "" });
    const onSeedChannels = vi.fn();
    const onCreated = vi.fn();
    render(<BrandCreateForm ecosystemId="viral" onCreate={onCreate} onSeedChannels={onSeedChannels} onCreated={onCreated} />);
    fireEvent.change(screen.getByLabelText(/brand name/i), { target: { value: "Zap" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith("zap"));
    expect(onSeedChannels).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run — expect FAIL.** `npx vitest run src/components/BrandCreateForm.test.tsx`

- [ ] **Step 4: Implement** — `client/src/components/BrandCreateForm.tsx`

```typescript
import { useState } from "react";
import type { EcosystemId } from "@/types";
import type { BrandRecord, NewBrand } from "@/hooks/useBrands";

interface BrandCreateFormProps {
  ecosystemId: EcosystemId;
  onCreate: (data: NewBrand) => Promise<BrandRecord>;
  onSeedChannels: (brandId: string) => void;
  onCreated: (brandId: string) => void;
}

export function BrandCreateForm({ ecosystemId, onCreate, onSeedChannels, onCreated }: BrandCreateFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) { setError("Brand name is required."); return; }
    if (!/z/i.test(trimmed)) { setError("Brand name must contain the letter “z”."); return; }
    setError(null);
    setBusy(true);
    try {
      const created = await onCreate({ name: trimmed, ecosystemId, ...(email.trim() ? { email: email.trim() } : {}) });
      if (ecosystemId === "content") onSeedChannels(created.id);
      onCreated(created.id);
      setName("");
      setEmail("");
    } catch {
      setError("Could not create the brand. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="brand-name" className="text-xs text-zinc-400">Brand name</label>
        <input
          id="brand-name"
          className="border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 rounded focus:border-zinc-500 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Zrodinger"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="brand-email" className="text-xs text-zinc-400">Brand email (optional)</label>
        <input
          id="brand-email"
          type="email"
          className="border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 rounded focus:border-zinc-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hi@abundenz.com"
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 rounded hover:bg-zinc-700 disabled:opacity-50"
      >
        Create brand
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Run — expect PASS.** `npx vitest run src/components/BrandCreateForm.test.tsx`

- [ ] **Step 6: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/client/src/components/BrandCreateForm.tsx .canon/.mission-control/client/src/components/BrandCreateForm.test.tsx .canon/.mission-control/client/src/data/brand-channels.ts
git -C "<worktree-root>" commit -m "Add BrandCreateForm with z-name validation and content channel seeding"
```

---

## Task 7: SetupPage integration

**Files:** Modify `client/src/pages/SetupPage.tsx`.

Wire the selector + create form + empty state above the existing stepper, track the active brand in the URL (`?brand=<id>`), and pass `brandId` into `useSetupData` / `useSetupProgress`. The stepper still renders the current step content (2b rewires it) — 2a only makes persistence brand-scoped and adds the brand shell.

- [ ] **Step 1: Add brand state + hooks at the top of `SetupPage`**

Replace the imports/top of the component to add `useSearchParams`, `useBrands`, `usePlatformAccounts`, the two new components, and the seed constant:

```typescript
import { useParams, NavLink, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { SetupStepper } from "@/components/SetupStepper";
import { BrandSelector } from "@/components/BrandSelector";
import { BrandCreateForm } from "@/components/BrandCreateForm";
import { useSetupProgress } from "@/hooks/useSetupProgress";
import { useSetupData } from "@/hooks/useSetupData";
import { useBrands } from "@/hooks/useBrands";
import { usePlatformAccounts } from "@/hooks/usePlatformAccounts";
import { SETUP_STEPS } from "@/data/setup-steps";
import { CONTENT_SEED_PLATFORMS } from "@/data/brand-channels";
import { cn } from "@/lib/utils";
import type { EcosystemId } from "@/types";
```

Inside the component, after reading `ecosystem`:

```typescript
  const { ecosystem = "content" } = useParams<{ ecosystem: string }>();
  const ecoId = ecosystem as EcosystemId;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeBrandId = searchParams.get("brand");
  const [showCreate, setShowCreate] = useState(false);

  const { brands, addBrand } = useBrands();
  const { addAccount } = usePlatformAccounts(activeBrandId ?? undefined);
  const ecoBrands = brands.filter((b) => b.ecosystemId === ecoId);

  const { isComplete, toggleStep, getEcosystemProgress } = useSetupProgress(activeBrandId ?? undefined);
  const { getFieldValue, saveFieldValue, setLocal, isSaved } = useSetupData(ecoId, activeBrandId ?? undefined);

  const selectBrand = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("brand", id);
    setSearchParams(next);
    setShowCreate(false);
  };

  const seedChannels = (brandId: string) => {
    for (const platform of CONTENT_SEED_PLATFORMS) {
      addAccount({ brandId, platform, status: "not-started" });
    }
  };
```

- [ ] **Step 2: Render the brand shell above the ecosystem panels**

Immediately below the ecosystem tabs `</div>` and before the per-ecosystem blocks, insert:

```tsx
      {/* Brand selector + create */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <BrandSelector
            brands={ecoBrands}
            activeBrandId={activeBrandId}
            onSelect={selectBrand}
            onNew={() => setShowCreate(true)}
          />
        </div>
        {showCreate && (
          <BrandCreateForm
            ecosystemId={ecoId}
            onCreate={addBrand}
            onSeedChannels={seedChannels}
            onCreated={selectBrand}
          />
        )}
        {!activeBrandId && !showCreate && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center text-sm text-zinc-400">
            Select a brand or create one to begin setup.
          </div>
        )}
      </div>
```

- [ ] **Step 3: Gate the ecosystem step panels on an active brand**

Wrap each existing `{ecosystem === "..." && (...)}` block so steps only render when `activeBrandId` is set. Simplest: change each guard to `{ecosystem === "content" && activeBrandId && (` ... and likewise for viral/products/affiliate. (The progress + stepper stay as-is otherwise; they now receive brand-scoped data via the hooks.)

- [ ] **Step 4: Verify build + existing tests**

Run (from `client/`): `npm run build` → clean. `npx vitest run` → existing 52+ pass, plus new component/hook tests from Tasks 4-6.

- [ ] **Step 5: Commit**

```bash
git -C "<worktree-root>" add .canon/.mission-control/client/src/pages/SetupPage.tsx
git -C "<worktree-root>" commit -m "Wire brand selector, create form, and empty state into SetupPage"
```

---

## Final verification (2a)

- [ ] Server: from `server/`, `npx vitest run` — existing suite + new setup migration/scoping tests all green; migrations idempotent.
- [ ] Client: from `client/`, `npx vitest run` (existing 52 + new BrandSelector/BrandCreateForm/useBrands tests) and `npm run build` clean.
- [ ] Manual sanity (optional): `pnpm dev` from `.canon/.mission-control`, open `/setup/content`, create "Zrodinger", confirm it appears in the selector and `?brand=` is set, and that fields save under that brand.

## Notes for the implementer

- NodeNext ESM on server: intra-project imports carry `.js` suffix. Client uses the `@/` alias.
- better-sqlite3 is synchronous — no `await` on DB calls. Use `ON CONFLICT ... DO UPDATE` upserts (SQLite supports them).
- `brand_id = ''` is the legacy/global scope; `undefined` brandId from the client omits the field and the server defaults to `''`.
- Do NOT rewire step content or touch `setup-steps.ts` semantics, `entity.ts`, or `EntityPage.tsx` — those are 2b / slice 3.
- `<worktree-root>` = `D:\VFXellence-LTD\.claude\worktrees\feat+18-brand-wizard-2a`.
