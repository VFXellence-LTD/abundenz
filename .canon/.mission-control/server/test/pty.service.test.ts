import { describe, it, expect, beforeEach, vi } from "vitest";
import { EventEmitter } from "node:events";

// Fake node-pty: a spawnable IPty backed by an EventEmitter.
class FakePty extends EventEmitter {
  pid = 4242;
  written: string[] = [];
  cols = 80;
  rows = 24;
  killed = false;
  onData(cb: (d: string) => void) { this.on("data", cb); return { dispose() {} }; }
  onExit(cb: (e: { exitCode: number; signal?: number }) => void) { this.on("exit", cb); return { dispose() {} }; }
  write(d: string) { this.written.push(d); }
  resize(c: number, r: number) { this.cols = c; this.rows = r; }
  kill() { this.killed = true; this.emit("exit", { exitCode: 0 }); }
  // test helpers
  pushData(d: string) { this.emit("data", d); }
}
const spawned: FakePty[] = [];
vi.mock("node-pty", () => ({
  spawn: vi.fn(() => { const p = new FakePty(); spawned.push(p); return p; }),
}));

import { PtyService } from "../services/pty.service.js";

describe("PtyService", () => {
  beforeEach(() => { spawned.length = 0; });

  it("spawns a PTY and forwards data events with sessionId", () => {
    const svc = new PtyService();
    const dataEvents: Array<{ sessionId: string; data: string }> = [];
    svc.on("data", (e) => dataEvents.push(e));
    svc.create("s1", { command: "powershell.exe", cwd: "C:\\" });
    spawned[0]!.pushData("hello");
    expect(dataEvents).toEqual([{ sessionId: "s1", data: "hello" }]);
  });

  it("throws when creating a PTY for an existing session", () => {
    const svc = new PtyService();
    svc.create("dup", {});
    expect(() => svc.create("dup", {})).toThrow(/already exists/i);
  });

  it("buffers scrollback and trims past the limit", () => {
    const svc = new PtyService();
    svc.create("s2", {});
    spawned[0]!.pushData("a".repeat(300_000));
    spawned[0]!.pushData("b");
    const inst = svc.get("s2")!;
    expect(inst.scrollbackSize).toBeLessThanOrEqual(200_000);
    expect(inst.scrollback.at(-1)).toBe("b");
  });

  it("writes to stdin, resizes, and clamps to >=1", () => {
    const svc = new PtyService();
    svc.create("s3", {});
    svc.write("s3", "ls\r");
    expect(spawned[0]!.written).toContain("ls\r");
    svc.resize("s3", 0, -5);
    expect(spawned[0]!.cols).toBe(1);
    expect(spawned[0]!.rows).toBe(1);
  });

  it("emits exit and deletes the instance on process exit", () => {
    const svc = new PtyService();
    const exits: Array<{ sessionId: string; exitCode: number }> = [];
    svc.on("exit", (e) => exits.push(e));
    svc.create("s4", {});
    spawned[0]!.emit("exit", { exitCode: 0 });
    expect(exits[0]).toMatchObject({ sessionId: "s4", exitCode: 0 });
    expect(svc.get("s4")).toBeNull();
  });

  it("kill() terminates and killAll() clears all", () => {
    const svc = new PtyService();
    svc.create("k1", {});
    svc.create("k2", {});
    svc.killAll();
    expect(svc.get("k1")).toBeNull();
    expect(svc.get("k2")).toBeNull();
  });
});
