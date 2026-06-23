import { describe, it, expect, afterEach } from "vitest";
import { createDb, type Db } from "../db.js";
import { createScopedViews, scopedSelect, ECOSYSTEM_VIEW } from "../scoping.js";

let db: Db | undefined;
afterEach(() => db?.close());

function seedTwoEcosystems(d: Db) {
  const ins = d.raw.prepare(
    `INSERT INTO tasks (id,title,type,ecosystem_id,source,status,priority,created_at,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
  );
  ins.run("VIRAL-1", "viral one", "task", "viral", "manual", "todo", "high", "t", "t");
  ins.run("CONTENT-1", "content one", "task", "content", "manual", "todo", "high", "t", "t");
}

describe("ecosystem scoping", () => {
  it("creates per-ecosystem views", () => {
    db = createDb(":memory:");
    createScopedViews(db.raw);
    const views = db.raw
      .prepare("SELECT name FROM sqlite_master WHERE type='view'")
      .all()
      .map((r: any) => r.name);
    expect(views).toContain("v_viral_tasks");        // viral
    expect(views).toContain("v_content_tasks");      // content
    expect(views).toContain("v_viral_approval_queue");
    expect(views).toContain("v_products_tasks");     // products
    expect(views).toContain("v_affiliate_tasks");    // affiliate
  });

  it("a scoped view cannot read another ecosystem's rows", () => {
    db = createDb(":memory:");
    createScopedViews(db.raw);
    seedTwoEcosystems(db);
    const viral: any[] = db.raw.prepare(`SELECT * FROM ${ECOSYSTEM_VIEW("viral", "tasks")}`).all();
    expect(viral.map((r) => r.id)).toEqual(["VIRAL-1"]);
    expect(viral.find((r) => r.id === "CONTENT-1")).toBeUndefined();
  });

  it("scopedSelect injects WHERE ecosystem_id and blocks leakage", () => {
    db = createDb(":memory:");
    createScopedViews(db.raw);
    seedTwoEcosystems(db);
    const rows = scopedSelect(db.raw, "tasks", { ecosystemId: "viral", crossEcosystem: false });
    expect(rows.map((r: any) => r.id)).toEqual(["VIRAL-1"]);
  });

  it("crossEcosystem=true bypasses the filter (explicit override only)", () => {
    db = createDb(":memory:");
    createScopedViews(db.raw);
    seedTwoEcosystems(db);
    const rows = scopedSelect(db.raw, "tasks", { ecosystemId: "viral", crossEcosystem: true });
    expect(rows.map((r: any) => r.id).sort()).toEqual(["CONTENT-1", "VIRAL-1"]);
  });
});
