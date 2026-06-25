import { describe, it, expect, afterEach } from "vitest";
import { createDb, type Db } from "../db.js";

let db: Db;
afterEach(() => { db?.close(); });

describe("SetupService — field data", () => {
  it("setField inserts; getData returns nested {stepId:{fieldKey:value}}", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "abundenz.com");
    svc.setField("content", "email", "address", "hi@abundenz.com");
    expect(svc.getData("content")).toEqual({
      domain: { domain: "abundenz.com" },
      email: { address: "hi@abundenz.com" },
    });
  });

  it("setField overwrites an existing value", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "old.com");
    svc.setField("content", "domain", "domain", "new.com");
    expect(svc.getData("content").domain.domain).toBe("new.com");
  });

  it("getData scopes to the requested ecosystem", async () => {
    const { SetupService } = await import("../services/setup.service.js");
    db = createDb(":memory:");
    const svc = new SetupService(db);
    svc.setField("content", "domain", "domain", "c.com");
    svc.setField("viral", "v1", "handle", "@x");
    expect(svc.getData("content")).toEqual({ domain: { domain: "c.com" } });
  });
});
