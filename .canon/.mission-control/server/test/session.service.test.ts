import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createDb, type Db } from "../db.js";
import { AgentRunsService } from "../services/agentRuns.service.js";
import { CampaignsService } from "../services/campaigns.service.js";
import { SessionService, validateCommand } from "../services/session.service.js";

// Fake PtyService — only the methods SessionService touches.
class FakePtyService {
  killed: string[] = [];
  private handlers: Record<string, Array<(e: unknown) => void>> = {};
  on(ev: string, cb: (e: unknown) => void) { (this.handlers[ev] ??= []).push(cb); return this; }
  emit(ev: string, payload: unknown) { (this.handlers[ev] ?? []).forEach((h) => h(payload)); }
  kill(id: string) { this.killed.push(id); }
}

describe("validateCommand (allowlist)", () => {
  it("accepts the four surge skills, bare or with an argument", () => {
    expect(() => validateCommand("/surge-generate")).not.toThrow();
    expect(() => validateCommand("/surge-generate camp-001")).not.toThrow();
    expect(() => validateCommand("/surge-safeguard-check camp-001")).not.toThrow();
    expect(() => validateCommand("/surge-continue")).not.toThrow();
    expect(() => validateCommand("/surge-render aq_abc_123")).not.toThrow();
  });
  it("accepts --resume <uuid> with optional trailing directive", () => {
    expect(() => validateCommand("--resume 123e4567-e89b-42d3-a456-426614174000")).not.toThrow();
    expect(() => validateCommand("--resume 123e4567-e89b-42d3-a456-426614174000 -- keep going")).not.toThrow();
  });
  it("rejects anything else, including Canon skills", () => {
    expect(() => validateCommand("/start ENG-1")).toThrow(/not allowed/i);
    expect(() => validateCommand("rm -rf /")).toThrow(/not allowed/i);
    expect(() => validateCommand("/surge-evil")).toThrow(/not allowed/i);
  });
});

describe("SessionService lifecycle + agent_runs", () => {
  let db: Db; let runs: AgentRunsService; let pty: FakePtyService; let svc: SessionService;
  beforeEach(() => {
    vi.useFakeTimers();
    db = createDb(":memory:");
    runs = new AgentRunsService(db);
    // agent_runs.campaign_id has a FK to campaigns(id) (foreign_keys = ON);
    // seed the campaigns the lifecycle cases reference so the inserts are valid.
    const campaigns = new CampaignsService(db);
    for (const id of ["camp-1", "camp-2", "camp-3"]) {
      campaigns.create({ id, name: id, ecosystemId: "viral" });
    }
    pty = new FakePtyService();
    svc = new SessionService(runs);
    svc.setPtyService(pty as unknown as never);
  });
  afterEach(() => { svc.stopIdleDetection(); vi.useRealTimers(); db.close(); });

  it("startSession creates an agent_runs row at status running and returns it", () => {
    const s = svc.startSession({ command: "/surge-generate camp-1", cwd: "C:\\x", campaignId: "camp-1" });
    expect(s.status).toBe("running");
    const row = runs.get(s.id);
    expect(row).toBeDefined();
    expect(row!.status).toBe("running");
    expect(row!.campaignId).toBe("camp-1");
    expect(row!.command).toBe("/surge-generate camp-1");
    expect(row!.cwd).toBe("C:\\x");
  });

  it("rejects a command not on the allowlist before writing a row", () => {
    expect(() => svc.startSession({ command: "/start ENG-1" })).toThrow(/not allowed/i);
    expect(runs.list()).toHaveLength(0);
  });

  it("idle detector flips running -> waiting after the threshold; output flips it back", () => {
    const events: Array<{ sessionId: string; status: string }> = [];
    svc.on("status", (e) => events.push(e as { sessionId: string; status: string }));
    const s = svc.startSession({ command: "/surge-continue" });
    vi.advanceTimersByTime(11_000);
    expect(svc.getSession(s.id)!.status).toBe("waiting");
    pty.emit("data", { sessionId: s.id });
    expect(svc.getSession(s.id)!.status).toBe("running");
    expect(events.some((e) => e.status === "waiting")).toBe(true);
    expect(events.some((e) => e.status === "running")).toBe(true);
  });

  it("stopSession kills the PTY, marks the run done, emits status", () => {
    const s = svc.startSession({ command: "/surge-generate camp-2", campaignId: "camp-2" });
    const events: Array<{ sessionId: string; status: string }> = [];
    svc.on("status", (e) => events.push(e as { sessionId: string; status: string }));
    svc.stopSession(s.id);
    expect(pty.killed).toContain(s.id);
    expect(svc.getSession(s.id)!.status).toBe("done");
    expect(runs.get(s.id)!.status).toBe("done");
    expect(events.at(-1)).toMatchObject({ sessionId: s.id, status: "done" });
  });

  it("markError sets the run to error", () => {
    const s = svc.startSession({ command: "/surge-generate camp-3", campaignId: "camp-3" });
    svc.markError(s.id, "boom");
    expect(svc.getSession(s.id)!.status).toBe("error");
    expect(runs.get(s.id)!.status).toBe("error");
    expect(runs.get(s.id)!.error).toBe("boom");
  });
});
