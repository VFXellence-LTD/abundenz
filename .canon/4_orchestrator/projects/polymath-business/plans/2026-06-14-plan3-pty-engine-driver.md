# PTY Claude-Session Engine Driver Implementation Plan (Plan 3 of 5)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Port Halon CMC's PTY Claude-session driver into the Polymath Mission Control server + client so a campaign **Run** spawns a real Claude Code session that executes `/surge-generate <campaignId>`. Build `pty.service.ts` (node-pty wrapper with scrollback + data/exit events), `session.service.ts` (running→waiting→done lifecycle, idle detect, command allowlist, `agent_runs` writes), `claude-sessions.service.ts` (scan `~/.claude/projects/<encoded-cwd>/*.jsonl` for the session UUID → persist `agent_runs.claude_session_id` for `--resume`), `prompt.service.ts` (`buildSurgePrompt()` reading `.canon` viral doctrine + Surge spec + safeguards), the HTTP surface (`POST /api/sessions/start`, `GET /api/sessions`, `POST /api/sessions/:id/stop`), the WS surface (`/ws/terminal?sessionId=` PTY I/O bridge + upgrade the Plan‑1 `/ws` stub into a real status/log broadcast), and the client `EmbeddedTerminal` (xterm.js + FitAddon) plus a **Session board** surface. The Plan‑2 Campaign Control Panel **Run** button now hits `POST /api/sessions/start`. Plan 3 proves the **driver** with a harmless command — a real `/surge-generate` run needs Plan 4.

**Architecture:** Mirrors CMC's session driver at `D:\dev\halon-rdutta\_canon_factory\canon-instances\halon.canon\.mission-control\server\` (`services/pty.service.ts`, `services/session.service.ts`, `services/claude-sessions.service.ts`, `services/prompt.service.ts`, `ws/terminal.ws.ts`, `ws/sessions.ws.ts`) and client `features/terminal/EmbeddedTerminal.tsx` + `hooks/useWebSocket.ts`. Patterns reused **verbatim** (Canon specifics swapped for Polymath): `PtyService extends EventEmitter` keyed by sessionId with 200 KB scrollback ring + `"data"`/`"exit"` events; `terminal.ws.ts` reattach-or-spawn with scrollback replay and a delayed single-line CLI write; `sessions.ws.ts` broadcasting `{type:"status"}` / `{type:"log"}`; `claude-sessions.service.ts` encoded-cwd scan of `*.jsonl`; xterm + `@xterm/addon-fit` + `@xterm/addon-web-links` client with exponential-backoff reconnect. **Swaps from Canon:** the session key is a Polymath `agent_runs.id` (UUID) — NOT a `JIRA-123` ticket key; the allowlist is `['/surge-generate','/surge-safeguard-check','/surge-continue']` + `--resume {uuid}` — NOT `/start`/`/pr`/`/done`; `cwd` is `D:\VFXellence-LTD\polymath\packages\agents`; lifecycle writes go to the `agent_runs` SQLite table — NOT to tracker `.md` Time Log files; the prompt builder reads `.canon` viral doctrine — NOT Jira issue context. The new `/ws/terminal` WSS and the upgraded `/ws` status WSS are both `noServer:true` and routed by `pathname` in the single `httpServer.on("upgrade")` handler (replacing the Plan‑1 stub).

**Tech Stack:** `node-pty ^1.0.0` (native — must be approved/rebuilt against the server's Node ABI), `ws ^8.20.1` (already a server dep; promote from stub), `xterm ^5.3.0` + `@xterm/addon-fit ^0.10.0` + `@xterm/addon-web-links ^0.11.0` (client). Server: Express 5, better-sqlite3 12, ESM (`"type":"module"`), vitest 4 + supertest 7. Client: React 19 + Vite + Tailwind 4 + react-router-dom 7. TS `~6.0.2`, `module: ESNext`, `moduleResolution: bundler`, `strict: true`. node-pty/`pty.spawn` is mockable in vitest via `vi.mock("node-pty")` so `session.service` unit tests use a **fake PTY** (an `EventEmitter` exposing `write`/`resize`/`kill`/`pid`/`onData`/`onExit`); PTY/WS integration is proven by a **scripted smoke** that spawns a harmless `cmd /c echo ...` (or `node -e`) command — never a real `claude` invocation.

**Scope guardrails (DO NOT exceed):**
- Build the PTY driver + WS bridge + client terminal/session board + wire Plan‑2's Run button. Nothing else.
- Plan 3 spawns a PTY that *would* type `claude "/surge-generate <campaignId>"`; the `/surge-generate` skill itself is **Plan 4**. Integration tests MUST use a harmless command, gated behind an env flag so CI never shells out to `claude`.
- No publishing, no social accounts, no video/ElevenLabs/render pipeline — the engine output contract (approval_queue row, task→`in-review`) is **Plan 4**.
- Reuse Plan‑1 services (`AgentRunsService`, `CampaignsService`, `TasksService`) — do NOT duplicate `agent_runs` SQL. The driver calls the existing service methods.
- The `/ws` broadcast upgrade replaces `ws/stub.ws.ts`; keep the `/ws` pathname contract so the existing client `useWebSocket` (port‑4500 in this repo) keeps working.

---

## File map

All paths relative to `D:\VFXellence-LTD\.canon\.mission-control\` unless absolute.

```
.mission-control/
├── server/
│   ├── package.json                       # MODIFY — add node-pty dep (Task 1)
│   ├── index.ts                           # MODIFY — instantiate services, mount /api/sessions, route WS upgrades (Task 6, Task 9)
│   ├── services/
│   │   ├── logger.service.ts              # NEW  — tiny EventEmitter logger (info/warn/error/debug + "log") (Task 1)
│   │   ├── pty.service.ts                 # NEW  — node-pty wrapper, scrollback, data/exit (Task 2)
│   │   ├── session.service.ts             # NEW  — lifecycle, idle detect, allowlist, agent_runs writes (Task 3)
│   │   ├── claude-sessions.service.ts     # NEW  — scan ~/.claude/projects/<cwd>/*.jsonl for UUID (Task 5)
│   │   └── prompt.service.ts              # NEW  — buildSurgePrompt() reading .canon doctrine (Task 8)
│   ├── routes/
│   │   └── sessions.ts                     # NEW  — POST /start, GET /, POST /:id/stop (Task 6)
│   ├── ws/
│   │   ├── terminal.ws.ts                  # NEW  — /ws/terminal PTY I/O bridge (Task 4)
│   │   ├── sessions.ws.ts                  # NEW  — /ws status + log broadcast (Task 9)
│   │   └── stub.ws.ts                      # DELETE after Task 9 (replaced)
│   └── test/
│       ├── session.service.test.ts         # NEW  — allowlist/lifecycle/agent_runs (fake PTY) (Task 3)
│       ├── claude-sessions.service.test.ts # NEW  — encoded-cwd scan (tmp fixtures) (Task 5)
│       ├── sessions.route.test.ts          # NEW  — supertest start/list/stop + gate (Task 6)
│       ├── prompt.service.test.ts          # NEW  — buildSurgePrompt content (Task 8)
│       └── pty-ws.smoke.test.ts            # NEW  — scripted echo PTY over WS (Task 7)
└── client/
    └── src/
        ├── lib/api.ts                       # MODIFY — add sessions.start/list/stop typed calls (Task 6)
        ├── hooks/
        │   └── useWebSocket.ts              # NEW  — /ws status subscribe (port 4500) (Task 10)
        ├── features/terminal/
        │   └── EmbeddedTerminal.tsx         # NEW  — xterm + FitAddon + reconnect (Task 10)
        ├── components/
        │   └── SessionBoard.tsx             # NEW  — live agent_runs list + terminal pane (Task 11)
        ├── pages/
        │   └── SessionsPage.tsx             # NEW  — route surface for SessionBoard (Task 11)
        ├── App.tsx                          # MODIFY — add /sessions route (Task 11)
        └── components/Sidebar.tsx           # MODIFY — add Sessions nav item (Task 11)
```

> Plan‑2 dependency: the **Run** button lives in Plan 2's `CampaignControlPanel`. Task 12 here only rewires its `onRun` to call `api.sessions.start({ campaignId })`. If Plan 2 is not yet merged, Task 12 is a no-op stub documented as a follow-up; Tasks 1–11 stand alone.

---

## Cross-plan contract recap (keep identical across plans)

- **Engine command** (Plan 4 implements, Plan 3 invokes): `/surge-generate <campaignId>`; also `/surge-safeguard-check`, `/surge-continue`; resume via `--resume {uuid}`. **PTY allowlist** = `['/surge-generate','/surge-safeguard-check','/surge-continue']` + `--resume {uuid}`.
- **Session start** (Plan 3 implements, Plan 2 Run button calls): `POST /api/sessions/start {campaignId}` → creates `agent_runs` row (status `running`) → spawns a PTY (`powershell`) at `cwd=D:\VFXellence-LTD\polymath\packages\agents` that after a brief delay writes `claude "/surge-generate <campaignId>"\r` → streams over WS `/ws/terminal?sessionId=<agent_runs.id>`.
- **JSON casing:** all `/api` responses are **camelCase** (matches Plan‑1 `AgentRun`/`Campaign` services).

---

## TDD Tasks

### Task 1 — Logger service + node-pty dependency
**Model/effort:** haiku — mechanical. **Worktree: yes** (`superpowers:using-git-worktrees`).
**Files:**
- Create: `server/services/logger.service.ts`
- Create: `server/test/logger.service.test.ts`
- Modify: `server/package.json`

CMC's `pty.service.ts`, `session.service.ts`, and the WS files all import `./logger.service.js` (an `EventEmitter` that re-emits a `"log"` event consumed by `sessions.ws.ts`). Plan 1 did not create it, so we build a minimal version here.

- [ ] **Write failing test.** Create `server/test/logger.service.test.ts`:
  ```ts
  import { describe, it, expect, vi } from "vitest";
  import { logger, type LogEntry } from "../services/logger.service.js";

  describe("logger.service", () => {
    it("emits a 'log' event with level, scope, message", () => {
      const spy = vi.fn();
      logger.on("log", spy as (e: LogEntry) => void);
      logger.info("test", "hello", { a: 1 });
      logger.off("log", spy as (e: LogEntry) => void);
      expect(spy).toHaveBeenCalledTimes(1);
      const entry = spy.mock.calls[0]![0] as LogEntry;
      expect(entry.level).toBe("info");
      expect(entry.scope).toBe("test");
      expect(entry.message).toBe("hello");
      expect(entry.meta).toEqual({ a: 1 });
      expect(typeof entry.timestamp).toBe("string");
    });

    it("supports warn, error, debug levels", () => {
      const levels: string[] = [];
      const spy = (e: LogEntry) => levels.push(e.level);
      logger.on("log", spy);
      logger.warn("s", "w");
      logger.error("s", "e");
      logger.debug("s", "d");
      logger.off("log", spy);
      expect(levels).toEqual(["warn", "error", "debug"]);
    });
  });
  ```
- [ ] **Run — expect FAIL.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/logger.service.test.ts`
  Expected: `Error: Failed to resolve import "../services/logger.service.js"` (module does not exist).
- [ ] **Minimal impl.** Create `server/services/logger.service.ts`:
  ```ts
  import { EventEmitter } from "node:events";

  export type LogLevel = "info" | "warn" | "error" | "debug";

  export interface LogEntry {
    level: LogLevel;
    scope: string;
    message: string;
    meta?: Record<string, unknown>;
    timestamp: string;
  }

  class Logger extends EventEmitter {
    private log(level: LogLevel, scope: string, message: string, meta?: Record<string, unknown>): void {
      const entry: LogEntry = { level, scope, message, meta, timestamp: new Date().toISOString() };
      // Console mirror — keeps the dev terminal useful without coupling consumers to console.
      const line = `[${entry.timestamp}] ${level.toUpperCase()} (${scope}) ${message}`;
      if (level === "error") console.error(line, meta ?? "");
      else if (level === "warn") console.warn(line, meta ?? "");
      else console.log(line, meta ?? "");
      this.emit("log", entry);
    }
    info(scope: string, message: string, meta?: Record<string, unknown>): void { this.log("info", scope, message, meta); }
    warn(scope: string, message: string, meta?: Record<string, unknown>): void { this.log("warn", scope, message, meta); }
    error(scope: string, message: string, meta?: Record<string, unknown>): void { this.log("error", scope, message, meta); }
    debug(scope: string, message: string, meta?: Record<string, unknown>): void { this.log("debug", scope, message, meta); }
  }

  export const logger = new Logger();
  ```
- [ ] Add `node-pty` to `server/package.json` dependencies:
  ```json
  "node-pty": "^1.0.0"
  ```
  Then run `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control install` and approve/rebuild the native binding (`pnpm rebuild node-pty` if prompted). Record the resolved version in the changelog.
- [ ] **Run — expect PASS.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/logger.service.test.ts` → `2 passed`.
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/server/services/logger.service.ts .canon/.mission-control/server/test/logger.service.test.ts .canon/.mission-control/server/package.json D:/VFXellence-LTD/.canon/.mission-control/pnpm-lock.yaml
  git -C D:\VFXellence-LTD commit -m "Add MC logger service and node-pty dependency

  - Add EventEmitter logger (info/warn/error/debug) re-emitting a 'log' event for WS broadcast
  - Mirror console output so the dev terminal stays useful
  - Add node-pty ^1.0.0 to the MC server for the PTY driver"
  ```

---

### Task 2 — PtyService (node-pty wrapper, scrollback, data/exit events)
**Model/effort:** opus — driver code. **Worktree: yes.**
**Files:**
- Create: `server/services/pty.service.ts`
- Create: `server/test/pty.service.test.ts`

Mirror CMC `pty.service.ts` verbatim (200 KB scrollback ring, `"data"`/`"exit"` events, `create`/`write`/`resize`/`kill`/`get`/`killAll`). The default shell on win32 is `powershell.exe` for our spawns (CMC defaults `cmd.exe` in `create` but `terminal.ws.ts` passes `powershell.exe`; we keep the same split). Unit test uses a fake PTY via `vi.mock("node-pty")`.

- [ ] **Write failing test.** Create `server/test/pty.service.test.ts`:
  ```ts
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
  ```
- [ ] **Run — expect FAIL.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/pty.service.test.ts`
  Expected: `Error: Failed to resolve import "../services/pty.service.js"`.
- [ ] **Minimal impl.** Create `server/services/pty.service.ts`:
  ```ts
  import { EventEmitter } from "node:events";
  import * as pty from "node-pty";
  import { logger } from "./logger.service.js";

  const SCROLLBACK_LIMIT = 200_000;

  export interface PtyInstance {
    process: pty.IPty;
    sessionId: string;
    createdAt: string;
    scrollback: string[];
    scrollbackSize: number;
  }

  export interface PtyCreateOpts {
    cwd?: string;
    command?: string;
    args?: string[];
    cols?: number;
    rows?: number;
  }

  /**
   * Manages PTY instances keyed by session ID.
   * Events:
   *   "data" — { sessionId: string, data: string }
   *   "exit" — { sessionId: string, exitCode: number, signal?: number }
   */
  export class PtyService extends EventEmitter {
    private instances: Map<string, PtyInstance> = new Map();

    create(sessionId: string, opts: PtyCreateOpts = {}): PtyInstance {
      if (this.instances.has(sessionId)) {
        throw new Error(`PTY already exists for session ${sessionId}`);
      }
      const shell = opts.command
        ?? (process.platform === "win32" ? "powershell.exe" : (process.env["SHELL"] || "/bin/sh"));
      const args = opts.args ?? [];
      const cols = opts.cols ?? 80;
      const rows = opts.rows ?? 24;
      const cwd = opts.cwd ?? process.env["USERPROFILE"] ?? process.env["HOME"] ?? process.cwd();

      logger.info("pty", `Spawning PTY for session ${sessionId}`, { shell, cwd, cols, rows });

      const proc = pty.spawn(shell, args, {
        name: "xterm-256color",
        cols,
        rows,
        cwd,
        env: { ...process.env, TERM: "xterm-256color" } as { [key: string]: string },
      });

      const instance: PtyInstance = {
        process: proc,
        sessionId,
        createdAt: new Date().toISOString(),
        scrollback: [],
        scrollbackSize: 0,
      };
      this.instances.set(sessionId, instance);

      proc.onData((data: string) => {
        instance.scrollback.push(data);
        instance.scrollbackSize += data.length;
        while (instance.scrollbackSize > SCROLLBACK_LIMIT && instance.scrollback.length > 1) {
          instance.scrollbackSize -= instance.scrollback[0]!.length;
          instance.scrollback.shift();
        }
        this.emit("data", { sessionId, data });
      });

      proc.onExit(({ exitCode, signal }) => {
        logger.info("pty", `PTY exited for session ${sessionId}`, { exitCode, signal });
        this.instances.delete(sessionId);
        this.emit("exit", { sessionId, exitCode, signal });
      });

      logger.info("pty", `PTY spawned for session ${sessionId}`, { pid: proc.pid });
      return instance;
    }

    write(sessionId: string, data: string): void {
      const instance = this.instances.get(sessionId);
      if (!instance) throw new Error(`No PTY found for session ${sessionId}`);
      instance.process.write(data);
    }

    resize(sessionId: string, cols: number, rows: number): void {
      const instance = this.instances.get(sessionId);
      if (!instance) throw new Error(`No PTY found for session ${sessionId}`);
      const safeCols = Math.max(1, cols);
      const safeRows = Math.max(1, rows);
      instance.process.resize(safeCols, safeRows);
      logger.debug("pty", `Resized PTY for session ${sessionId}`, { cols: safeCols, rows: safeRows });
    }

    kill(sessionId: string): void {
      const instance = this.instances.get(sessionId);
      if (!instance) return;
      logger.info("pty", `Killing PTY for session ${sessionId}`);
      try { instance.process.kill(); } catch { /* already dead */ }
      this.instances.delete(sessionId);
    }

    get(sessionId: string): PtyInstance | null {
      return this.instances.get(sessionId) ?? null;
    }

    killAll(): void {
      for (const [sessionId] of this.instances) this.kill(sessionId);
    }
  }
  ```
- [ ] **Run — expect PASS.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/pty.service.test.ts` → `6 passed`.
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/server/services/pty.service.ts .canon/.mission-control/server/test/pty.service.test.ts
  git -C D:\VFXellence-LTD commit -m "Add PtyService node-pty wrapper with scrollback

  - Mirror CMC PtyService: instances keyed by sessionId, 200KB scrollback ring
  - Emit 'data' and 'exit' events; clamp resize to >=1; killAll for shutdown
  - Default win32 shell to powershell.exe; unit-tested with a mocked node-pty"
  ```

---

### Task 3 — SessionService (lifecycle, idle detect, allowlist, agent_runs writes)
**Model/effort:** opus — driver/state-machine. **Worktree: yes.**
**Files:**
- Create: `server/services/session.service.ts`
- Create: `server/test/session.service.test.ts`

Mirror CMC `session.service.ts` but swap: key = `agent_runs.id` (UUID) not a ticket key; allowlist = surge commands; lifecycle writes go through Plan‑1's `AgentRunsService` (status `running`→`waiting`→`done`/`error`) instead of tracker `.md` Time Log. Keep CMC's idle detector (`running`→`waiting` after 8 s of no PTY output; output resets to `running`). The validator accepts a bare slash command **or** a command with a trailing argument (e.g. `/surge-generate camp-1`), plus `--resume <uuid>`.

- [ ] **Write failing test.** Create `server/test/session.service.test.ts`:
  ```ts
  import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
  import { createDb, type Db } from "../db.js";
  import { AgentRunsService } from "../services/agentRuns.service.js";
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
    it("accepts the three surge skills, bare or with an argument", () => {
      expect(() => validateCommand("/surge-generate")).not.toThrow();
      expect(() => validateCommand("/surge-generate camp-001")).not.toThrow();
      expect(() => validateCommand("/surge-safeguard-check camp-001")).not.toThrow();
      expect(() => validateCommand("/surge-continue")).not.toThrow();
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
  ```
- [ ] **Run — expect FAIL.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/session.service.test.ts`
  Expected: `Error: Failed to resolve import "../services/session.service.js"`.
- [ ] **Minimal impl.** First extend `AgentRunsService.setStatus` to persist `error` (Plan‑1 lacked it). Modify `server/services/agentRuns.service.ts` `setStatus` to accept an optional error and write it:
  ```ts
    setStatus(id: string, status: AgentRunStatus, error?: string): AgentRun | undefined {
      const existing = this.get(id);
      if (!existing) return undefined;
      const now = new Date().toISOString();
      const startedAt = status === "running" && !existing.startedAt ? now : existing.startedAt ?? null;
      const completedAt = ["done", "error", "killed"].includes(status) ? now : existing.completedAt ?? null;
      this.db.raw
        .prepare("UPDATE agent_runs SET status=?, started_at=?, completed_at=?, error=COALESCE(?, error) WHERE id=?")
        .run(status, startedAt, completedAt, error ?? null, id);
      return this.get(id);
    }
  ```
  Then create `server/services/session.service.ts`:
  ```ts
  import { EventEmitter } from "node:events";
  import { randomUUID } from "node:crypto";
  import { logger } from "./logger.service.js";
  import type { PtyService } from "./pty.service.js";
  import type { AgentRunsService } from "./agentRuns.service.js";

  export type SessionStatus = "running" | "waiting" | "done" | "error";

  const ALLOWED_SKILLS = ["/surge-generate", "/surge-safeguard-check", "/surge-continue"] as const;
  // UUID v4-ish: --resume <uuid> with optional trailing -- <directive>
  const RESUME_PATTERN =
    /^--resume [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(\s+--\s+.*)?$/i;

  export function validateCommand(command: string): void {
    if (RESUME_PATTERN.test(command)) return;
    const allowed = ALLOWED_SKILLS.some(
      (skill) => command === skill || command.startsWith(`${skill} `),
    );
    if (!allowed) {
      throw new Error(
        `Command not allowed. Must be one of: ${ALLOWED_SKILLS.join(", ")} (optionally with an argument) or '--resume <uuid>'`,
      );
    }
  }

  export interface SessionInfo {
    id: string;            // == agent_runs.id == PTY session key
    command: string;
    cwd: string | null;
    campaignId: string | null;
    taskId: string | null;
    status: SessionStatus;
    startedAt: string;
    endedAt: string | null;
  }

  const IDLE_THRESHOLD_MS = 8_000;

  export interface StartSessionOpts {
    command: string;
    cwd?: string;
    campaignId?: string;
    taskId?: string;
    agentName?: string;
  }

  export class SessionService extends EventEmitter {
    private sessions: Map<string, SessionInfo> = new Map();
    private ptyService: PtyService | null = null;
    private lastOutputAt: Map<string, number> = new Map();
    private idleTimer: ReturnType<typeof setInterval> | null = null;

    constructor(private runs: AgentRunsService) { super(); }

    setPtyService(ptyService: PtyService): void {
      this.ptyService = ptyService;
      ptyService.on("data", ({ sessionId }: { sessionId: string }) => this.recordOutput(sessionId));
      ptyService.on("exit", ({ sessionId, exitCode }: { sessionId: string; exitCode: number }) => {
        const session = this.sessions.get(sessionId);
        if (!session || session.status === "done" || session.status === "error") return;
        if (exitCode === 0) this.finish(sessionId, "done");
        else this.markError(sessionId, `PTY exited with code ${exitCode}`);
      });
    }

    recordOutput(sessionId: string): void {
      const session = this.sessions.get(sessionId);
      if (!session || session.status === "done" || session.status === "error") return;
      this.lastOutputAt.set(sessionId, Date.now());
      if (session.status === "waiting") {
        session.status = "running";
        this.runs.setStatus(sessionId, "running");
        this.emit("status", { sessionId, status: "running" });
      }
    }

    startIdleDetection(): void {
      if (this.idleTimer) return;
      this.idleTimer = setInterval(() => {
        const now = Date.now();
        for (const [id, session] of this.sessions) {
          if (session.status !== "running") continue;
          const lastOutput = this.lastOutputAt.get(id);
          if (lastOutput && now - lastOutput > IDLE_THRESHOLD_MS) {
            session.status = "waiting";
            this.runs.setStatus(id, "waiting");
            this.emit("status", { sessionId: id, status: "waiting" });
          }
        }
      }, 2_000);
    }

    stopIdleDetection(): void {
      if (this.idleTimer) { clearInterval(this.idleTimer); this.idleTimer = null; }
    }

    listSessions(): SessionInfo[] { return Array.from(this.sessions.values()); }
    getSession(id: string): SessionInfo | undefined { return this.sessions.get(id); }

    startSession(opts: StartSessionOpts): SessionInfo {
      validateCommand(opts.command);
      const id = randomUUID();
      const startedAt = new Date().toISOString();
      const session: SessionInfo = {
        id,
        command: opts.command,
        cwd: opts.cwd ?? null,
        campaignId: opts.campaignId ?? null,
        taskId: opts.taskId ?? null,
        status: "running",
        startedAt,
        endedAt: null,
      };
      this.sessions.set(id, session);
      this.lastOutputAt.set(id, Date.now());
      // agent_runs row: create (queued) then flip to running so started_at is stamped.
      this.runs.create({
        id,
        campaignId: opts.campaignId,
        taskId: opts.taskId ?? null,
        agentName: opts.agentName ?? "surge-engine",
        cwd: opts.cwd,
        command: opts.command,
      });
      this.runs.setStatus(id, "running");
      this.startIdleDetection();
      logger.info("session", `Session created`, { id, command: opts.command, cwd: opts.cwd });
      this.emit("status", { sessionId: id, status: "running" });
      return session;
    }

    private finish(id: string, status: "done" | "error", error?: string): void {
      const session = this.sessions.get(id);
      if (!session) return;
      session.status = status;
      session.endedAt = new Date().toISOString();
      this.lastOutputAt.delete(id);
      this.runs.setStatus(id, status, error);
      logger.info("session", `Session ${status}`, { id });
      this.emit("status", { sessionId: id, status });
      const hasActive = Array.from(this.sessions.values()).some(
        (s) => s.status === "running" || s.status === "waiting",
      );
      if (!hasActive) this.stopIdleDetection();
    }

    stopSession(id: string): void {
      const session = this.sessions.get(id);
      if (!session) throw new Error(`Session not found: ${id}`);
      if (this.ptyService) this.ptyService.kill(id);
      this.finish(id, "done");
    }

    markError(id: string, error: string): void {
      const session = this.sessions.get(id);
      if (!session) throw new Error(`Session not found: ${id}`);
      this.finish(id, "error", error);
    }
  }
  ```
- [ ] **Run — expect PASS.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/session.service.test.ts test/agentRuns.service.test.ts` → all green (re-run existing agent_runs tests to confirm the `setStatus` signature change is backward-compatible).
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/server/services/session.service.ts .canon/.mission-control/server/services/agentRuns.service.ts .canon/.mission-control/server/test/session.service.test.ts
  git -C D:\VFXellence-LTD commit -m "Add SessionService lifecycle, idle detect, allowlist

  - Mirror CMC SessionService keyed by agent_runs.id (UUID), not a ticket key
  - Allowlist: /surge-generate, /surge-safeguard-check, /surge-continue + --resume <uuid>
  - Lifecycle running->waiting (8s idle)->done/error writes agent_runs rows via AgentRunsService
  - Extend AgentRunsService.setStatus to persist an error message"
  ```

---

### Task 4 — terminal.ws.ts (/ws/terminal PTY I/O bridge)
**Model/effort:** opus — driver/WS. **Worktree: yes.**
**Files:**
- Create: `server/ws/terminal.ws.ts`

Mirror CMC `terminal.ws.ts` verbatim, swapping the command-building branch for the surge allowlist. Reattach-or-spawn keyed on `sessionId` (== `agent_runs.id`); replay scrollback on reattach; after 800 ms on a new PTY, build and type the full `claude "..."` invocation as a single line; bridge PTY `data`/`exit` to WS frames; WS input (`{type:"data"}` / `{type:"resize"}`) → PTY; WS close detaches listeners only (PTY survives reconnect). No unit test here (covered by Task 7 smoke + Task 6 route test); this task ends with a typecheck.

- [ ] **Impl.** Create `server/ws/terminal.ws.ts`:
  ```ts
  import { WebSocketServer, WebSocket } from "ws";
  import type { IncomingMessage } from "node:http";
  import type { PtyService } from "../services/pty.service.js";
  import type { SessionService } from "../services/session.service.js";
  import { logger } from "../services/logger.service.js";

  /**
   * WebSocket handling for terminal connections.
   * PTY stays alive until the session is stopped or the process exits; a WS
   * disconnect only detaches listeners. Reconnecting reattaches with scrollback replay.
   */
  export function setupTerminalWebSocket(
    ptyService: PtyService,
    sessionService: SessionService,
  ): WebSocketServer {
    const wss = new WebSocketServer({ noServer: true });

    wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      const url = new URL(req.url ?? "", `http://${req.headers.host}`);
      const sessionId = url.searchParams.get("sessionId");

      if (!sessionId) {
        logger.warn("terminal-ws", "Connection rejected: missing sessionId");
        ws.close(4400, "Missing sessionId query parameter");
        return;
      }
      const session = sessionService.getSession(sessionId);
      if (!session) {
        logger.warn("terminal-ws", `Connection rejected: session not found: ${sessionId}`);
        ws.close(4404, "Session not found");
        return;
      }

      logger.info("terminal-ws", `Terminal WS connected for session ${sessionId}`);

      let isNewPty = false;
      if (!ptyService.get(sessionId)) {
        const shell = process.platform === "win32"
          ? "powershell.exe"
          : (process.env["SHELL"] ?? "/bin/bash");
        try {
          const instance = ptyService.create(sessionId, {
            command: shell,
            args: [],
            cwd: session.cwd ?? undefined,
            cols: 120,
            rows: 30,
          });
          isNewPty = true;
          logger.info("terminal-ws", `PTY created for session ${sessionId}`, { pid: instance.process.pid });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          logger.error("terminal-ws", `Failed to create PTY for session ${sessionId}`, { error: message });
          ws.close(4500, "Failed to create PTY");
          return;
        }
      } else {
        logger.info("terminal-ws", `Reattaching to existing PTY for session ${sessionId}`);
        const ptyInst = ptyService.get(sessionId);
        if (ptyInst && ptyInst.scrollback.length > 0) {
          for (const chunk of ptyInst.scrollback) {
            if (ws.readyState === WebSocket.OPEN) ws.send(chunk);
          }
          logger.info("terminal-ws", `Replayed ${ptyInst.scrollback.length} scrollback chunks for ${sessionId}`);
        }
      }

      // After the shell initializes, type the full claude command as a single CLI invocation.
      // Accepts: `claude "/surge-generate <id>"`, `claude --resume <uuid>`, `claude --resume <uuid> "<directive>"`.
      if (isNewPty && session.command) {
        const command = session.command;
        let fullCmd: string;
        if (command.startsWith("--")) {
          const resumeMatch = command.match(/^--resume\s+([0-9a-f-]+)(?:\s+--\s+(.+))?$/i);
          if (resumeMatch) {
            const directive = resumeMatch[2];
            fullCmd = directive
              ? `claude --resume ${resumeMatch[1]} "${directive.replace(/"/g, '\\"')}"`
              : `claude --resume ${resumeMatch[1]}`;
          } else {
            fullCmd = `claude ${command}`;
          }
        } else {
          fullCmd = `claude "${command.replace(/"/g, '\\"')}"`;
        }
        setTimeout(() => {
          try { ptyService.write(sessionId, `${fullCmd}\r`); } catch { /* PTY may have exited */ }
        }, 800);
      }

      const onData = (event: { sessionId: string; data: string }) => {
        if (event.sessionId !== sessionId) return;
        if (ws.readyState === WebSocket.OPEN) ws.send(event.data);
      };
      const onExit = (event: { sessionId: string; exitCode: number; signal?: number }) => {
        if (event.sessionId !== sessionId) return;
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "exit", exitCode: event.exitCode }));
      };
      ptyService.on("data", onData);
      ptyService.on("exit", onExit);

      ws.on("message", (raw: Buffer | string) => {
        const text = raw instanceof Buffer ? raw.toString("utf8") : String(raw);
        try {
          const msg = JSON.parse(text) as { type?: string; data?: string; cols?: string; rows?: string };
          if (msg.type === "data" && typeof msg.data === "string") {
            ptyService.write(sessionId, msg.data);
          } else if (msg.type === "resize") {
            const cols = Math.max(1, parseInt(String(msg.cols), 10) || 80);
            const rows = Math.max(1, parseInt(String(msg.rows), 10) || 24);
            ptyService.resize(sessionId, cols, rows);
          }
        } catch {
          try { ptyService.write(sessionId, text); } catch { /* PTY gone */ }
        }
      });

      ws.on("close", () => {
        logger.info("terminal-ws", `Terminal WS disconnected for session ${sessionId} (PTY kept alive)`);
        ptyService.off("data", onData);
        ptyService.off("exit", onExit);
      });

      ws.on("error", (err) => {
        logger.error("terminal-ws", `Terminal WS error for session ${sessionId}`, { error: err.message });
      });
    });

    return wss;
  }
  ```
- [ ] **Run — expect PASS (typecheck).** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec tsc -p ../tsconfig.server.json --noEmit` → no errors.
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/server/ws/terminal.ws.ts
  git -C D:\VFXellence-LTD commit -m "Add /ws/terminal PTY I/O bridge

  - Mirror CMC terminal.ws: reattach-or-spawn keyed on agent_runs.id, scrollback replay
  - After 800ms type claude \"/surge-generate <id>\" (or --resume) as one CLI line
  - Bridge PTY data/exit to WS; WS close detaches listeners, keeps PTY alive"
  ```

---

### Task 5 — claude-sessions.service.ts (scan ~/.claude/projects for the UUID)
**Model/effort:** sonnet — integration/file-scan. **Worktree: yes.**
**Files:**
- Create: `server/services/claude-sessions.service.ts`
- Create: `server/test/claude-sessions.service.test.ts`

Mirror CMC `claude-sessions.service.ts` (encoded-cwd → `~/.claude/projects/<name>`, scan ≤20 newest `*.jsonl`, first 50 lines each, return UUID). Swap the discriminator: CMC matches a *ticket key* in the message; Polymath matches the **command string** `/surge-generate <campaignId>` (the campaignId uniquely identifies the run's transcript). Expose `findSessionForCampaign(campaignId, cwd)`. The constructor accepts an optional `claudeDir` override so the test can point at a tmp fixture.

- [ ] **Write failing test.** Create `server/test/claude-sessions.service.test.ts`:
  ```ts
  import { describe, it, expect, beforeEach, afterEach } from "vitest";
  import fs from "node:fs";
  import os from "node:os";
  import path from "node:path";
  import { ClaudeSessionsService } from "../services/claude-sessions.service.js";

  const CWD = "D:\\VFXellence-LTD\\polymath\\packages\\agents";

  describe("ClaudeSessionsService.findSessionForCampaign", () => {
    let tmp: string; let projectsDir: string;
    beforeEach(() => {
      tmp = fs.mkdtempSync(path.join(os.tmpdir(), "claude-sessions-"));
      // Same encoding the service uses for CWD -> project dir name.
      const encoded = CWD.replace(/[:\\/_ ]/g, "-").replace(/^-/, "");
      projectsDir = path.join(tmp, "projects", encoded);
      fs.mkdirSync(projectsDir, { recursive: true });
    });
    afterEach(() => { fs.rmSync(tmp, { recursive: true, force: true }); });

    it("returns the UUID of the jsonl whose message references the campaignId", async () => {
      const uuid = "123e4567-e89b-42d3-a456-426614174000";
      const line = JSON.stringify({ message: { role: "user", content: 'claude "/surge-generate camp-007"' } });
      fs.writeFileSync(path.join(projectsDir, `${uuid}.jsonl`), `${line}\n`, "utf-8");
      const svc = new ClaudeSessionsService(path.join(tmp, "projects"));
      expect(await svc.findSessionForCampaign("camp-007", CWD)).toBe(uuid);
    });

    it("returns null when no transcript references the campaignId", async () => {
      const line = JSON.stringify({ message: { content: "/surge-generate camp-OTHER" } });
      fs.writeFileSync(path.join(projectsDir, "deadbeef.jsonl"), `${line}\n`, "utf-8");
      const svc = new ClaudeSessionsService(path.join(tmp, "projects"));
      expect(await svc.findSessionForCampaign("camp-007", CWD)).toBeNull();
    });

    it("returns null when the project dir does not exist", async () => {
      const svc = new ClaudeSessionsService(path.join(tmp, "nope"));
      expect(await svc.findSessionForCampaign("camp-007", CWD)).toBeNull();
    });
  });
  ```
- [ ] **Run — expect FAIL.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/claude-sessions.service.test.ts`
  Expected: `Error: Failed to resolve import "../services/claude-sessions.service.js"`.
- [ ] **Minimal impl.** Create `server/services/claude-sessions.service.ts`:
  ```ts
  import fs from "node:fs";
  import path from "node:path";
  import { logger } from "./logger.service.js";

  export class ClaudeSessionsService {
    private claudeDir: string;

    /** @param claudeDir override for the `<home>/.claude/projects` root (tests). */
    constructor(claudeDir?: string) {
      if (claudeDir) {
        this.claudeDir = claudeDir;
      } else {
        const home = process.env["USERPROFILE"] || process.env["HOME"] || "";
        this.claudeDir = path.join(home, ".claude", "projects");
      }
    }

    /** Convert a cwd to Claude's project dir name: replace : \ / _ space with -, strip leading -. */
    private projectDirName(cwd: string): string {
      return cwd.replace(/[:\\/_ ]/g, "-").replace(/^-/, "");
    }

    /**
     * Find the most recent Claude session transcript that references the campaignId.
     * Scans the 20 newest *.jsonl files, the first 50 lines of each. Returns the UUID or null.
     */
    async findSessionForCampaign(campaignId: string, cwd: string): Promise<string | null> {
      const projectDir = path.join(this.claudeDir, this.projectDirName(cwd));
      if (!fs.existsSync(projectDir)) {
        logger.debug("claude-sessions", `Project dir not found: ${projectDir}`);
        return null;
      }

      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(projectDir, { withFileTypes: true });
      } catch (err) {
        logger.warn("claude-sessions", `Failed to read project dir: ${projectDir}`, {
          error: err instanceof Error ? err.message : String(err),
        });
        return null;
      }

      const files = entries
        .filter((e) => e.isFile() && e.name.endsWith(".jsonl"))
        .map((e) => {
          const filePath = path.join(projectDir, e.name);
          let mtime = 0;
          try { mtime = fs.statSync(filePath).mtimeMs; } catch { /* leave 0 */ }
          return { name: e.name, filePath, mtime };
        })
        .sort((a, b) => b.mtime - a.mtime)
        .slice(0, 20);

      for (const file of files) {
        const sessionId = file.name.replace(".jsonl", "");
        try {
          const content = fs.readFileSync(file.filePath, "utf-8");
          const lines = content.split("\n").slice(0, 50);
          for (const rawLine of lines) {
            if (!rawLine.trim()) continue;
            try {
              const entry = JSON.parse(rawLine) as Record<string, unknown>;
              const msgStr = JSON.stringify(entry["message"] ?? "");
              if (msgStr.includes(campaignId)) {
                logger.info("claude-sessions", `Found session ${sessionId} for campaign ${campaignId}`);
                return sessionId;
              }
            } catch { continue; }
          }
        } catch (err) {
          logger.debug("claude-sessions", `Skipping unreadable session file: ${file.name}`, {
            error: err instanceof Error ? err.message : String(err),
          });
          continue;
        }
      }

      logger.debug("claude-sessions", `No session found for campaign ${campaignId} in ${projectDir}`);
      return null;
    }
  }
  ```
- [ ] **Run — expect PASS.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/claude-sessions.service.test.ts` → `3 passed`.
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/server/services/claude-sessions.service.ts .canon/.mission-control/server/test/claude-sessions.service.test.ts
  git -C D:\VFXellence-LTD commit -m "Add ClaudeSessionsService to resolve a run's session UUID

  - Mirror CMC encoded-cwd scan of ~/.claude/projects/<cwd>/*.jsonl
  - Match the campaignId in the transcript (not a ticket key) -> session UUID
  - Constructor accepts a claudeDir override for tmp-fixture tests"
  ```

---

### Task 6 — POST/GET/STOP /api/sessions route + spawn + UUID backfill
**Model/effort:** opus — driver/integration. **Worktree: yes.**
**Files:**
- Create: `server/routes/sessions.ts`
- Create: `server/test/sessions.route.test.ts`
- Modify: `client/src/lib/api.ts`

`POST /api/sessions/start {campaignId|taskId}` validates the campaign exists and (gate) is **approved**, then `SessionService.startSession({ command: "/surge-generate <campaignId>", cwd: AGENTS_CWD, campaignId })`. The PTY is **not** spawned by the route — it is spawned lazily by `/ws/terminal` on first connect (CMC pattern), so the route is fast and the test needs no real PTY. After the session is created, kick off (fire-and-forget) `ClaudeSessionsService.findSessionForCampaign` on a short delay and, when found, write `agent_runs.claude_session_id` for `--resume`. `GET /api/sessions` lists `SessionService.listSessions()`. `POST /api/sessions/:id/stop` → `SessionService.stopSession`. The router factory takes injected services so the test wires fakes.

- [ ] **Write failing test.** Create `server/test/sessions.route.test.ts`:
  ```ts
  import { describe, it, expect, beforeEach, afterEach } from "vitest";
  import express from "express";
  import request from "supertest";
  import { createDb, type Db } from "../db.js";
  import { CampaignsService } from "../services/campaigns.service.js";
  import { AgentRunsService } from "../services/agentRuns.service.js";
  import { SessionService } from "../services/session.service.js";
  import { createSessionsRouter } from "../routes/sessions.js";

  class FakePtyService { kill() {} on() { return this; } }

  function makeApp(db: Db) {
    const runs = new AgentRunsService(db);
    const sessions = new SessionService(runs);
    sessions.setPtyService(new FakePtyService() as unknown as never);
    const app = express();
    app.use(express.json());
    app.use("/api/sessions", createSessionsRouter({ db, sessions }));
    return { app, sessions, runs };
  }

  describe("POST/GET/STOP /api/sessions", () => {
    let db: Db;
    beforeEach(() => { db = createDb(":memory:"); });
    afterEach(() => { db.close(); });

    it("400 when neither campaignId nor taskId is provided", async () => {
      const { app } = makeApp(db);
      await request(app).post("/api/sessions/start").send({}).expect(400);
    });

    it("404 when the campaign does not exist", async () => {
      const { app } = makeApp(db);
      await request(app).post("/api/sessions/start").send({ campaignId: "nope" }).expect(404);
    });

    it("409 (gate) when the campaign is not approved", async () => {
      const camps = new CampaignsService(db);
      camps.create({ id: "camp-1", name: "C1", ecosystemId: "viral" });
      const { app } = makeApp(db);
      await request(app).post("/api/sessions/start").send({ campaignId: "camp-1" }).expect(409);
    });

    it("201 + agent_runs row + surge command when the campaign is approved", async () => {
      const camps = new CampaignsService(db);
      camps.create({ id: "camp-2", name: "C2", ecosystemId: "viral" });
      camps.approve("camp-2", "Boss");
      const { app, runs } = makeApp(db);
      const res = await request(app).post("/api/sessions/start").send({ campaignId: "camp-2" }).expect(201);
      expect(res.body.status).toBe("running");
      expect(res.body.command).toBe("/surge-generate camp-2");
      expect(res.body.campaignId).toBe("camp-2");
      expect(res.body.cwd).toBe("D:\\VFXellence-LTD\\polymath\\packages\\agents");
      const run = runs.get(res.body.id);
      expect(run!.status).toBe("running");
      expect(run!.campaignId).toBe("camp-2");
    });

    it("GET lists sessions; STOP marks the run done", async () => {
      const camps = new CampaignsService(db);
      camps.create({ id: "camp-3", name: "C3", ecosystemId: "viral" });
      camps.approve("camp-3", "Boss");
      const { app, runs } = makeApp(db);
      const start = await request(app).post("/api/sessions/start").send({ campaignId: "camp-3" }).expect(201);
      const list = await request(app).get("/api/sessions").expect(200);
      expect(list.body.map((s: { id: string }) => s.id)).toContain(start.body.id);
      await request(app).post(`/api/sessions/${start.body.id}/stop`).expect(200);
      expect(runs.get(start.body.id)!.status).toBe("done");
    });
  });
  ```
- [ ] **Run — expect FAIL.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/sessions.route.test.ts`
  Expected: `Error: Failed to resolve import "../routes/sessions.js"`.
- [ ] **Minimal impl.** Create `server/routes/sessions.ts`:
  ```ts
  import { Router, type Request, type Response } from "express";
  import type { Db } from "../db.js";
  import type { SessionService } from "../services/session.service.js";
  import { CampaignsService } from "../services/campaigns.service.js";
  import { AgentRunsService } from "../services/agentRuns.service.js";
  import { ClaudeSessionsService } from "../services/claude-sessions.service.js";
  import { logger } from "../services/logger.service.js";

  export const AGENTS_CWD = "D:\\VFXellence-LTD\\polymath\\packages\\agents";
  const UUID_BACKFILL_DELAY_MS = 6_000;

  export interface SessionsRouterDeps {
    db: Db;
    sessions: SessionService;
    /** Injected in tests; defaults to a real scanner. */
    claudeSessions?: ClaudeSessionsService;
  }

  export function createSessionsRouter(deps: SessionsRouterDeps): Router {
    const router = Router();
    const campaigns = new CampaignsService(deps.db);
    const runs = new AgentRunsService(deps.db);
    const claudeSessions = deps.claudeSessions ?? new ClaudeSessionsService();

    router.post("/start", (req: Request, res: Response) => {
      const b = req.body as { campaignId?: string; taskId?: string };
      if (!b.campaignId && !b.taskId) {
        res.status(400).json({ error: "Missing required field: campaignId or taskId" });
        return;
      }
      // Campaign-driven start enforces the Plan-1 approval gate.
      if (b.campaignId) {
        const camp = campaigns.get(b.campaignId);
        if (!camp) { res.status(404).json({ error: `Campaign not found: ${b.campaignId}` }); return; }
        if (!camp.approvedBy) { res.status(409).json({ error: "Campaign must be approved before running" }); return; }
      }
      const command = b.campaignId ? `/surge-generate ${b.campaignId}` : "/surge-continue";
      try {
        const session = deps.sessions.startSession({
          command,
          cwd: AGENTS_CWD,
          campaignId: b.campaignId,
          taskId: b.taskId,
        });
        // Fire-and-forget: backfill claude_session_id once the transcript exists, for --resume.
        if (b.campaignId) {
          const campaignId = b.campaignId;
          setTimeout(() => {
            claudeSessions
              .findSessionForCampaign(campaignId, AGENTS_CWD)
              .then((uuid) => {
                if (uuid) {
                  deps.db.raw
                    .prepare("UPDATE agent_runs SET claude_session_id=? WHERE id=?")
                    .run(uuid, session.id);
                  logger.info("sessions", `Backfilled claude_session_id for ${session.id}`, { uuid });
                }
              })
              .catch((err: unknown) => logger.warn("sessions", "UUID backfill failed", {
                error: err instanceof Error ? err.message : String(err),
              }));
          }, UUID_BACKFILL_DELAY_MS);
        }
        res.status(201).json(session);
      } catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
      }
    });

    router.get("/", (_req: Request, res: Response) => {
      res.json(deps.sessions.listSessions());
    });

    router.post("/:id/stop", (req: Request, res: Response) => {
      const id = String(req.params["id"]);
      if (!deps.sessions.getSession(id)) { res.status(404).json({ error: "Session not found" }); return; }
      deps.sessions.stopSession(id);
      const run = runs.get(id);
      res.json(run ?? { id, status: "done" });
    });

    return router;
  }
  ```
- [ ] Add typed session calls to `client/src/lib/api.ts` (append; do not change the existing `api` object's verbs):
  ```ts
  export interface SessionInfo {
    id: string;
    command: string;
    cwd: string | null;
    campaignId: string | null;
    taskId: string | null;
    status: "running" | "waiting" | "done" | "error";
    startedAt: string;
    endedAt: string | null;
  }

  export const sessions = {
    start: (body: { campaignId?: string; taskId?: string }) => api.post<SessionInfo>("/sessions/start", body),
    list: () => api.get<SessionInfo[]>("/sessions"),
    stop: (id: string) => api.post<{ id: string; status: string }>(`/sessions/${id}/stop`, {}),
  };
  ```
- [ ] **Run — expect PASS.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/sessions.route.test.ts` → `5 passed`.
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/server/routes/sessions.ts .canon/.mission-control/server/test/sessions.route.test.ts .canon/.mission-control/client/src/lib/api.ts
  git -C D:\VFXellence-LTD commit -m "Add /api/sessions start/list/stop with approval gate

  - POST /start: require an approved campaign, create a session running /surge-generate <id>
  - cwd = polymath/packages/agents; PTY spawns lazily on /ws/terminal connect
  - Fire-and-forget backfill of agent_runs.claude_session_id for --resume
  - GET / lists sessions; POST /:id/stop marks the run done; add client api.sessions"
  ```

---

### Task 7 — Scripted PTY/WS integration smoke (harmless command)
**Model/effort:** sonnet — integration. **Worktree: yes.**
**Files:**
- Create: `server/test/pty-ws.smoke.test.ts`

Prove the real `node-pty` ↔ `/ws/terminal` ↔ client-frame round-trip end to end **without invoking `claude`**. Boot a tiny http server with `terminal.ws.ts`, register a session whose command is `--resume`-shaped is wrong here, so instead pre-create the PTY directly with a harmless command and skip the auto-typed `claude` line, then assert the echoed bytes arrive over the WS. Because `terminal.ws.ts` only auto-types when it spawns a *new* PTY for a session, we pre-spawn a PTY for the sessionId via `PtyService.create` with `cmd /c echo` (win32) / `sh -c echo` so the bridge reattaches and streams existing output — no `claude`, no slash command. Gate the whole file behind `process.env.MC_PTY_SMOKE === "1"` so CI never spawns a shell unless explicitly opted in; document the opt-in in the changelog.

- [ ] **Write the smoke (self-passing once impl from Tasks 2/4 exists).** Create `server/test/pty-ws.smoke.test.ts`:
  ```ts
  import { describe, it, expect, beforeAll, afterAll } from "vitest";
  import http from "node:http";
  import { WebSocket } from "ws";
  import { AddressInfo } from "node:net";
  import { PtyService } from "../services/pty.service.js";
  import { SessionService } from "../services/session.service.js";
  import { AgentRunsService } from "../services/agentRuns.service.js";
  import { createDb, type Db } from "../db.js";
  import { setupTerminalWebSocket } from "../ws/terminal.ws.js";

  const RUN = process.env["MC_PTY_SMOKE"] === "1";
  const d = RUN ? describe : describe.skip;

  d("PTY <-> /ws/terminal smoke (harmless echo, no claude)", () => {
    let server: http.Server; let pty: PtyService; let db: Db; let port: number;
    const MARKER = "POLYMATH_SMOKE_OK";

    beforeAll(async () => {
      db = createDb(":memory:");
      pty = new PtyService();
      const sessions = new SessionService(new AgentRunsService(db));
      sessions.setPtyService(pty);
      const wss = setupTerminalWebSocket(pty, sessions);

      // Register a session record (so the WS accepts the connection) WITHOUT a surge command:
      // we pre-spawn the PTY ourselves with a harmless echo so the bridge reattaches & streams.
      const id = "smoke-session";
      (sessions as unknown as { sessions: Map<string, unknown> }).sessions.set(id, {
        id, command: "/surge-continue", cwd: process.cwd(),
        campaignId: null, taskId: null, status: "running",
        startedAt: new Date().toISOString(), endedAt: null,
      });
      const shell = process.platform === "win32" ? "cmd.exe" : "sh";
      const args = process.platform === "win32" ? ["/c", `echo ${MARKER}`] : ["-c", `echo ${MARKER}`];
      pty.create(id, { command: shell, args });

      server = http.createServer();
      server.on("upgrade", (req, socket, head) => {
        const url = new URL(req.url ?? "", `http://${req.headers.host}`);
        if (url.pathname === "/ws/terminal") wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
        else socket.destroy();
      });
      await new Promise<void>((r) => server.listen(0, r));
      port = (server.address() as AddressInfo).port;
    });

    afterAll(() => { pty.killAll(); server.close(); db.close(); });

    it("streams the echoed marker over the WebSocket", async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${port}/ws/terminal?sessionId=smoke-session`);
      ws.binaryType = "arraybuffer";
      const received = await new Promise<string>((resolve, reject) => {
        let buf = "";
        const timer = setTimeout(() => reject(new Error(`marker not seen; got: ${buf}`)), 8000);
        ws.on("message", (data: ArrayBuffer | Buffer | string) => {
          buf += typeof data === "string" ? data : Buffer.from(data as ArrayBuffer).toString("utf8");
          if (buf.includes(MARKER)) { clearTimeout(timer); ws.close(); resolve(buf); }
        });
        ws.on("error", reject);
      });
      expect(received).toContain(MARKER);
    }, 15000);
  });
  ```
- [ ] **Run — opt-in smoke PASS.** `MC_PTY_SMOKE=1 pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/pty-ws.smoke.test.ts`
  (PowerShell: `$env:MC_PTY_SMOKE=1; pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/pty-ws.smoke.test.ts; Remove-Item Env:MC_PTY_SMOKE`)
  Expected: `1 passed` (echoed `POLYMATH_SMOKE_OK` observed over the WS).
- [ ] **Run — default (gated) PASS.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/pty-ws.smoke.test.ts` → `1 skipped` (no shell spawned in CI).
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/server/test/pty-ws.smoke.test.ts
  git -C D:\VFXellence-LTD commit -m "Add gated PTY/WS integration smoke (harmless echo)

  - Boot http + /ws/terminal, pre-spawn a cmd/sh echo PTY, assert bytes stream over WS
  - Proves the real node-pty <-> WebSocket bridge without invoking claude
  - Gated behind MC_PTY_SMOKE=1 so CI never spawns a shell by default"
  ```

---

### Task 8 — prompt.service.ts (buildSurgePrompt from .canon doctrine)
**Model/effort:** sonnet — integration/IO. **Worktree: yes.**
**Files:**
- Create: `server/services/prompt.service.ts`
- Create: `server/test/prompt.service.test.ts`

Mirror CMC `prompt.service.ts`'s shape (a pure function that assembles a Claude prompt from context), but read **Polymath viral doctrine** off disk: the viral-formula playbook, the Surge ecosystem README (the "Zrodinger" clip spec lives in the viral docs), and the `viral-surge.md` safeguards POLICY. `buildSurgePrompt({ campaignId, canonPath })` returns a `/surge-generate <campaignId>`-led prompt embedding those sources. Missing files degrade gracefully to a labeled "(not found)" section (never throw). This seed text is what Plan 4's skill / a future smart-start writes into the session; Plan 3 only needs the builder + its test.

- [ ] **Write failing test.** Create `server/test/prompt.service.test.ts`:
  ```ts
  import { describe, it, expect, beforeEach, afterEach } from "vitest";
  import fs from "node:fs";
  import os from "node:os";
  import path from "node:path";
  import { buildSurgePrompt } from "../services/prompt.service.js";

  describe("buildSurgePrompt", () => {
    let canon: string;
    beforeEach(() => {
      canon = fs.mkdtempSync(path.join(os.tmpdir(), "canon-doctrine-"));
      const formula = path.join(canon, "2_architect", "polymath-business", "ecosystems", "viral", "shared", "playbooks");
      const eco = path.join(canon, "2_architect", "polymath-business", "ecosystems", "viral");
      const safe = path.join(canon, "1_controller", "standards", "polymath-business", "safeguards");
      fs.mkdirSync(formula, { recursive: true });
      fs.mkdirSync(safe, { recursive: true });
      fs.writeFileSync(path.join(formula, "viral-formula.md"), "# Surge Formula\nHOOK then SCRIPT.", "utf-8");
      fs.writeFileSync(path.join(eco, "README.md"), "# Surge\nZrodinger clip spec here.", "utf-8");
      fs.writeFileSync(path.join(safe, "viral-surge.md"), "# Surge Safeguards\nNo medical claims.", "utf-8");
    });
    afterEach(() => { fs.rmSync(canon, { recursive: true, force: true }); });

    it("leads with /surge-generate <campaignId> and embeds the three doctrine sources", () => {
      const prompt = buildSurgePrompt({ campaignId: "camp-9", canonPath: canon });
      expect(prompt.startsWith("/surge-generate camp-9")).toBe(true);
      expect(prompt).toContain("HOOK then SCRIPT");
      expect(prompt).toContain("Zrodinger clip spec");
      expect(prompt).toContain("No medical claims");
    });

    it("degrades gracefully when a doctrine file is missing (no throw)", () => {
      fs.rmSync(path.join(canon, "1_controller"), { recursive: true, force: true });
      const prompt = buildSurgePrompt({ campaignId: "camp-9", canonPath: canon });
      expect(prompt).toContain("(not found)");
      expect(prompt).toContain("HOOK then SCRIPT");
    });
  });
  ```
- [ ] **Run — expect FAIL.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/prompt.service.test.ts`
  Expected: `Error: Failed to resolve import "../services/prompt.service.js"`.
- [ ] **Minimal impl.** Create `server/services/prompt.service.ts`:
  ```ts
  import fs from "node:fs";
  import path from "node:path";

  export interface BuildSurgePromptOpts {
    campaignId: string;
    /** .canon root; defaults to config.canonPath at the call site. */
    canonPath: string;
  }

  function readOrMissing(filePath: string): string {
    try {
      return fs.readFileSync(filePath, "utf-8");
    } catch {
      return `(not found: ${filePath})`;
    }
  }

  /**
   * Assemble the Surge engine seed prompt from .canon viral doctrine.
   * Sources: viral-formula playbook, the Surge ecosystem README (Zrodinger clip spec),
   * and the viral-surge safeguards policy. Missing files degrade to a labeled section.
   */
  export function buildSurgePrompt(opts: BuildSurgePromptOpts): string {
    const { campaignId, canonPath } = opts;
    const formulaPath = path.join(
      canonPath, "2_architect", "polymath-business", "ecosystems", "viral",
      "shared", "playbooks", "viral-formula.md",
    );
    const specPath = path.join(
      canonPath, "2_architect", "polymath-business", "ecosystems", "viral", "README.md",
    );
    const safeguardsPath = path.join(
      canonPath, "1_controller", "standards", "polymath-business", "safeguards", "viral-surge.md",
    );

    const formula = readOrMissing(formulaPath);
    const spec = readOrMissing(specPath);
    const safeguards = readOrMissing(safeguardsPath);

    return `/surge-generate ${campaignId}

Context pre-loaded for this Surge session (read-only doctrine):

## Surge Formula (playbook)
${formula}

## Surge / Zrodinger Clip Spec
${spec}

## Surge Safeguards POLICY (mandatory)
${safeguards}

## Instructions
Produce ONE Zrodinger clip DRAFT artifact for campaign ${campaignId}:
1. Read the doctrine above plus the campaign context.
2. Generate a SCRIPT-LEVEL draft only — hook, script, shotlist, caption, hashtags.
3. Run the safeguard check against the POLICY; attach the safeguard report.
4. Write the draft to disk (artifactPath) and POST an approval_queue row via
   POST /api/approvals { ecosystemId: 'viral', contentType: 'clip', artifactPath, contentJson }
   (server forces status:'pending'; do NOT send status in the body).
5. Set the linked task to 'in-review' and HALT. No publish, no social accounts, no render.
`;
  }
  ```
- [ ] **Run — expect PASS.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/prompt.service.test.ts` → `2 passed`.
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/server/services/prompt.service.ts .canon/.mission-control/server/test/prompt.service.test.ts
  git -C D:\VFXellence-LTD commit -m "Add buildSurgePrompt seeding from .canon viral doctrine

  - Read viral-formula playbook, Surge README (Zrodinger spec), viral-surge safeguards
  - Lead with /surge-generate <campaignId>; embed the draft+halt contract instructions
  - Missing doctrine files degrade to a labeled '(not found)' section, never throw"
  ```

---

### Task 9 — Wire services into index.ts + upgrade /ws stub to status/log broadcast
**Model/effort:** opus — driver/integration. **Worktree: yes.**
**Files:**
- Create: `server/ws/sessions.ws.ts`
- Modify: `server/index.ts`
- Delete: `server/ws/stub.ws.ts`
- Create: `server/test/sessions.ws.test.ts`

Replace the Plan‑1 `/ws` stub with CMC `sessions.ws.ts` (broadcast `{type:"status",sessionId,status}` from `SessionService` and `{type:"log",entry}` from `logger`). Instantiate `PtyService` + `SessionService` (sharing the singleton DB's `AgentRunsService`) in `startServer`, mount `createSessionsRouter`, and route both `/ws` and `/ws/terminal` upgrades by pathname.

- [ ] **Write failing test.** Create `server/test/sessions.ws.test.ts`:
  ```ts
  import { describe, it, expect, beforeAll, afterAll } from "vitest";
  import http from "node:http";
  import { WebSocket } from "ws";
  import { AddressInfo } from "node:net";
  import { createDb, type Db } from "../db.js";
  import { AgentRunsService } from "../services/agentRuns.service.js";
  import { SessionService } from "../services/session.service.js";
  import { setupSessionsWebSocket } from "../ws/sessions.ws.js";

  describe("/ws status broadcast", () => {
    let server: http.Server; let port: number; let db: Db; let sessions: SessionService;
    beforeAll(async () => {
      db = createDb(":memory:");
      sessions = new SessionService(new AgentRunsService(db));
      const wss = setupSessionsWebSocket(sessions);
      server = http.createServer();
      server.on("upgrade", (req, socket, head) => {
        const url = new URL(req.url ?? "", `http://${req.headers.host}`);
        if (url.pathname === "/ws") wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
        else socket.destroy();
      });
      await new Promise<void>((r) => server.listen(0, r));
      port = (server.address() as AddressInfo).port;
    });
    afterAll(() => { sessions.stopIdleDetection(); server.close(); db.close(); });

    it("broadcasts a status event when a session emits status", async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
      const msg = await new Promise<{ type: string; status: string }>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("no status broadcast")), 5000);
        ws.on("open", () => sessions.emit("status", { sessionId: "x", status: "running" }));
        ws.on("message", (d) => {
          try {
            const m = JSON.parse(String(d));
            if (m.type === "status") { clearTimeout(timer); ws.close(); resolve(m); }
          } catch { /* ignore non-JSON */ }
        });
        ws.on("error", reject);
      });
      expect(msg).toMatchObject({ type: "status", status: "running" });
    }, 8000);
  });
  ```
- [ ] **Run — expect FAIL.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run test/sessions.ws.test.ts`
  Expected: `Error: Failed to resolve import "../ws/sessions.ws.js"`.
- [ ] **Minimal impl.** Create `server/ws/sessions.ws.ts`:
  ```ts
  import { WebSocketServer, WebSocket } from "ws";
  import type { SessionService } from "../services/session.service.js";
  import { logger, type LogEntry } from "../services/logger.service.js";

  interface WsStatusEvent { sessionId: string; status: string; }

  function broadcast(wss: WebSocketServer, message: string): void {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) client.send(message);
    }
  }

  export function setupSessionsWebSocket(sessionService: SessionService): WebSocketServer {
    const wss = new WebSocketServer({ noServer: true });

    const onStatus = (event: WsStatusEvent) => {
      broadcast(wss, JSON.stringify({ type: "status", sessionId: event.sessionId, status: event.status }));
    };
    const onLog = (entry: LogEntry) => {
      broadcast(wss, JSON.stringify({ type: "log", entry }));
    };

    sessionService.on("status", onStatus);
    logger.on("log", onLog);

    wss.on("connection", () => { /* clients receive broadcasts; no per-client subscription */ });
    wss.on("close", () => {
      sessionService.off("status", onStatus);
      logger.off("log", onLog);
    });

    return wss;
  }
  ```
- [ ] **Modify `server/index.ts`.** Replace the stub import + `setupWebSocketStub(httpServer)` with the real wiring. Updated `startServer` (and imports):
  ```ts
  import { PtyService } from "./services/pty.service.js";
  import { SessionService } from "./services/session.service.js";
  import { AgentRunsService } from "./services/agentRuns.service.js";
  import { createSessionsRouter } from "./routes/sessions.js";
  import { setupTerminalWebSocket } from "./ws/terminal.ws.js";
  import { setupSessionsWebSocket } from "./ws/sessions.ws.js";
  // (remove: import { setupWebSocketStub } from "./ws/stub.ws.js";)
  ```
  In `createApp`, after the other `app.use("/api/...")` lines, the sessions router needs the live `SessionService`, so pass it via `deps`. Extend `AppDeps`:
  ```ts
  export interface AppDeps {
    db: Db;
    vaultLaunchesDir: string;
    sessions: SessionService;
  }
  ```
  and mount it:
  ```ts
  app.use("/api/sessions", createSessionsRouter({ db: deps.db, sessions: deps.sessions }));
  ```
  Then `startServer`:
  ```ts
  export async function startServer(): Promise<void> {
    const db = getDb(config.dbPath);
    const ptyService = new PtyService();
    const sessions = new SessionService(new AgentRunsService(db));
    sessions.setPtyService(ptyService);

    const app = createApp({ db, vaultLaunchesDir: config.vaultLaunchesDir, sessions });
    const httpServer = http.createServer(app);

    const terminalWss = setupTerminalWebSocket(ptyService, sessions);
    const statusWss = setupSessionsWebSocket(sessions);
    httpServer.on("upgrade", (req, socket, head) => {
      const url = new URL(req.url ?? "", `http://${req.headers.host}`);
      if (url.pathname === "/ws/terminal") {
        terminalWss.handleUpgrade(req, socket, head, (ws) => terminalWss.emit("connection", ws, req));
      } else if (url.pathname === "/ws") {
        statusWss.handleUpgrade(req, socket, head, (ws) => statusWss.emit("connection", ws, req));
      } else {
        socket.destroy();
      }
    });

    httpServer.listen(config.port, () => {
      console.log(`Polymath Mission Control server running on port ${config.port}`);
      console.log(`DB: ${config.dbPath}`);
    });

    const shutdown = () => {
      ptyService.killAll();
      sessions.stopIdleDetection();
      db.close();
      httpServer.close(() => process.exit(0));
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  }
  ```
  Update any existing `index.test.ts` `createApp(...)` callers to pass a `sessions` dep (construct a `SessionService(new AgentRunsService(db))`). Delete `server/ws/stub.ws.ts`.
- [ ] **Run — expect PASS.** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec vitest run` → full suite green (new `sessions.ws.test.ts` passes; existing `index.test.ts` updated). Then `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\server exec tsc -p ../tsconfig.server.json --noEmit` → no errors.
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/server/ws/sessions.ws.ts .canon/.mission-control/server/index.ts .canon/.mission-control/server/test/sessions.ws.test.ts .canon/.mission-control/server/test/index.test.ts
  git -C D:\VFXellence-LTD rm .canon/.mission-control/server/ws/stub.ws.ts
  git -C D:\VFXellence-LTD commit -m "Wire PTY/session services and upgrade /ws to broadcast

  - Instantiate PtyService + SessionService in startServer; mount /api/sessions
  - Route /ws/terminal and /ws upgrades by pathname; delete the Plan-1 stub
  - sessions.ws broadcasts status + log events; killAll/stopIdleDetection on shutdown"
  ```

---

### Task 10 — Client EmbeddedTerminal + useWebSocket hook
**Model/effort:** opus — driver/UI. **Worktree: yes.**
**Files:**
- Create: `client/src/features/terminal/EmbeddedTerminal.tsx`
- Create: `client/src/hooks/useWebSocket.ts`
- Modify: `client/package.json` (add xterm deps)

Mirror CMC `EmbeddedTerminal.tsx` and `useWebSocket.ts` verbatim, swapping the dev WS host to **port 4500** (this repo's server port) and the dev port check to `5174`. Add `xterm`, `@xterm/addon-fit`, `@xterm/addon-web-links` to the client. Verification is a build/typecheck (no DOM test harness in scope); the live round-trip is covered by Task 7's server smoke and a manual `pnpm dev` check at the end.

- [ ] Add to `client/package.json` dependencies:
  ```json
  "xterm": "^5.3.0",
  "@xterm/addon-fit": "^0.10.0",
  "@xterm/addon-web-links": "^0.11.0"
  ```
  then `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control install`.
- [ ] Create `client/src/hooks/useWebSocket.ts` (port 4500, dev port 5174):
  ```ts
  import { useEffect, useRef, useState, useCallback } from "react";

  export interface LogEntry {
    level: "info" | "warn" | "error" | "debug";
    scope: string;
    message: string;
    meta?: Record<string, unknown>;
    timestamp: string;
  }

  type WsMessage = {
    type: "status" | "log";
    sessionId?: string;
    status?: string;
    entry?: LogEntry;
  };

  type Listener = (msg: WsMessage) => void;
  const RECONNECT_DELAY_MS = 3000;

  export function useWebSocket() {
    const [connected, setConnected] = useState(false);
    const listenersRef = useRef<Set<Listener>>(new Set());
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const unmountedRef = useRef(false);

    const connect = useCallback(() => {
      if (unmountedRef.current) return;
      const isDev = window.location.port === "5174";
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = isDev ? `${window.location.hostname}:4500` : window.location.host;
      const url = `${protocol}//${host}/ws`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => { if (!unmountedRef.current) setConnected(true); };
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as WsMessage;
          for (const listener of listenersRef.current) listener(msg);
        } catch { /* ignore malformed */ }
      };
      ws.onclose = () => {
        wsRef.current = null;
        if (!unmountedRef.current) {
          setConnected(false);
          reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };
      ws.onerror = () => { ws.close(); };
    }, []);

    useEffect(() => {
      unmountedRef.current = false;
      connect();
      return () => {
        unmountedRef.current = true;
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
      };
    }, [connect]);

    const subscribe = useCallback((fn: Listener): (() => void) => {
      listenersRef.current.add(fn);
      return () => { listenersRef.current.delete(fn); };
    }, []);

    return { connected, subscribe };
  }
  ```
- [ ] Create `client/src/features/terminal/EmbeddedTerminal.tsx` — mirror CMC verbatim, but the dev WS host = port 4500 and dev port = 5174:
  ```tsx
  import { useEffect, useRef } from "react";
  import { Terminal } from "xterm";
  import { FitAddon } from "@xterm/addon-fit";
  import { WebLinksAddon } from "@xterm/addon-web-links";
  import "xterm/css/xterm.css";

  interface EmbeddedTerminalProps {
    sessionId: string;
    onReady?: () => void;
    onExit?: (exitCode: number) => void;
    onTitleChange?: (title: string) => void;
  }

  export function EmbeddedTerminal({ sessionId, onReady, onExit, onTitleChange }: EmbeddedTerminalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const onReadyRef = useRef(onReady);
    const onExitRef = useRef(onExit);
    const onTitleChangeRef = useRef(onTitleChange);
    onReadyRef.current = onReady;
    onTitleChangeRef.current = onTitleChange;
    onExitRef.current = onExit;

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !sessionId) return;

      let term: Terminal | null = null;
      let ws: WebSocket | null = null;
      let fitAddon: FitAddon | null = null;
      let onDataDisposable: { dispose(): void } | null = null;
      let resizeObserver: ResizeObserver | null = null;
      let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
      let cancelled = false;

      function init() {
        if (cancelled || !container) return;
        term = new Terminal({
          theme: {
            background: "#181818", foreground: "#dddddd", cursor: "#6366f1",
            selectionBackground: "#6366f140", black: "#121212", red: "#ef4444",
            green: "#22c55e", yellow: "#f59e0b", blue: "#6366f1", magenta: "#a855f7",
            cyan: "#06b6d4", white: "#fafafa", brightBlack: "#52525b", brightRed: "#f87171",
            brightGreen: "#4ade80", brightYellow: "#fbbf24", brightBlue: "#818cf8",
            brightMagenta: "#c084fc", brightCyan: "#22d3ee", brightWhite: "#ffffff",
          },
          fontFamily: "JetBrains Mono, Cascadia Code, Fira Code, Consolas, monospace",
          fontSize: 13, lineHeight: 1.3, cursorBlink: true, cursorStyle: "bar",
          scrollback: 10000, cols: 80, rows: 24,
        });

        fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.loadAddon(new WebLinksAddon());
        term.open(container);
        term.onTitleChange((title) => { if (title && onTitleChangeRef.current) onTitleChangeRef.current(title); });
        try { fitAddon.fit(); } catch { /* will fit on resize */ }

        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const port = parseInt(window.location.port, 10);
        const isDev = port === 5174;
        const wsHost = isDev ? `${window.location.hostname}:4500` : window.location.host;
        const wsUrl = `${wsProtocol}//${wsHost}/ws/terminal?sessionId=${encodeURIComponent(sessionId)}`;

        const currentFit = fitAddon;
        const currentTerm = term;
        let reconnectAttempts = 0;
        const MAX_RECONNECT_ATTEMPTS = 20;

        function sendResize() {
          try {
            if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) return;
            currentFit.fit();
            const dims = currentFit.proposeDimensions();
            if (dims && dims.cols > 10 && dims.rows > 2 && ws?.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "resize", cols: dims.cols, rows: dims.rows }));
            }
          } catch { /* fit not ready */ }
        }

        function connectWs() {
          if (cancelled) return;
          ws = new WebSocket(wsUrl);
          ws.binaryType = "arraybuffer";
          const currentWs = ws;

          currentWs.addEventListener("open", () => { reconnectAttempts = 0; sendResize(); onReadyRef.current?.(); });
          currentWs.addEventListener("message", (event) => {
            if (event.data instanceof ArrayBuffer) {
              currentTerm.write(new Uint8Array(event.data));
            } else {
              try {
                const msg = JSON.parse(event.data as string);
                if (msg.type === "exit") {
                  currentTerm.writeln(`\r\n\x1b[90m[Process exited with code ${msg.exitCode}]\x1b[0m`);
                  onExitRef.current?.(msg.exitCode);
                  return;
                }
              } catch { /* raw output */ }
              currentTerm.write(event.data as string);
            }
          });
          currentWs.addEventListener("close", (event) => {
            if (cancelled) return;
            if (event.code === 4404) {
              currentTerm.writeln("\r\n\x1b[90m[Session expired — start a new session]\x1b[0m");
              return;
            }
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
              const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 10000);
              reconnectAttempts++;
              reconnectTimer = setTimeout(connectWs, delay);
            } else {
              currentTerm.writeln("\r\n\x1b[90m[Terminal disconnected — reload to reconnect]\x1b[0m");
            }
          });
        }

        connectWs();

        onDataDisposable = currentTerm.onData((data) => {
          if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "data", data }));
        });

        let resizeDebounce: ReturnType<typeof setTimeout> | null = null;
        resizeObserver = new ResizeObserver(() => {
          if (resizeDebounce) clearTimeout(resizeDebounce);
          resizeDebounce = setTimeout(sendResize, 50);
        });
        resizeObserver.observe(container);
      }

      if (container.offsetHeight > 0 && container.offsetWidth > 0) {
        init();
      } else {
        const interval = setInterval(() => {
          if (cancelled) { clearInterval(interval); return; }
          if (container.offsetHeight > 0 && container.offsetWidth > 0) { clearInterval(interval); init(); }
        }, 50);
      }

      return () => {
        cancelled = true;
        if (reconnectTimer) clearTimeout(reconnectTimer);
        resizeObserver?.disconnect();
        onDataDisposable?.dispose();
        ws?.close();
        term?.dispose();
      };
    }, [sessionId]);

    return <div ref={containerRef} className="w-full h-full overflow-hidden" style={{ minHeight: 200 }} />;
  }
  ```
- [ ] **Run — expect PASS (typecheck + build).** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\client exec tsc --noEmit` then `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\client build` → both succeed.
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/client/src/features/terminal/EmbeddedTerminal.tsx .canon/.mission-control/client/src/hooks/useWebSocket.ts .canon/.mission-control/client/package.json D:/VFXellence-LTD/.canon/.mission-control/pnpm-lock.yaml
  git -C D:\VFXellence-LTD commit -m "Add client EmbeddedTerminal (xterm) and useWebSocket hook

  - Mirror CMC EmbeddedTerminal: xterm + FitAddon + WebLinks, backoff reconnect, resize
  - Dev WS host = port 4500, dev port = 5174 (Polymath MC), /ws/terminal?sessionId=
  - useWebSocket subscribes to /ws status + log broadcasts"
  ```

---

### Task 11 — SessionBoard surface + route + nav
**Model/effort:** sonnet — UI/integration. **Worktree: yes.**
**Files:**
- Create: `client/src/components/SessionBoard.tsx`
- Create: `client/src/pages/SessionsPage.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/components/Sidebar.tsx`

A `SessionBoard` lists live sessions (`api.sessions.list`, refreshed on `useWebSocket` status events) with a status dot, command, elapsed time, and a Stop button; selecting a session renders `<EmbeddedTerminal sessionId=…/>` in a pane. `SessionsPage` hosts it; add a `/sessions` route + a Sidebar "Sessions" link. Verification = typecheck + build (no DOM test harness).

- [ ] Create `client/src/components/SessionBoard.tsx`:
  ```tsx
  import { useCallback, useEffect, useState } from "react";
  import { sessions as sessionsApi, type SessionInfo } from "@/lib/api";
  import { useWebSocket } from "@/hooks/useWebSocket";
  import { EmbeddedTerminal } from "@/features/terminal/EmbeddedTerminal";

  const STATUS_DOT: Record<SessionInfo["status"], string> = {
    running: "bg-green-500 animate-pulse",
    waiting: "bg-yellow-500",
    done: "bg-zinc-500",
    error: "bg-red-500",
  };

  export function SessionBoard() {
    const [list, setList] = useState<SessionInfo[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const { subscribe } = useWebSocket();

    const refresh = useCallback(() => {
      sessionsApi.list().then(setList).catch(() => { /* surfaced elsewhere */ });
    }, []);

    useEffect(() => { refresh(); }, [refresh]);
    useEffect(() => subscribe((msg) => { if (msg.type === "status") refresh(); }), [subscribe, refresh]);

    const stop = (id: string) => sessionsApi.stop(id).then(refresh).catch(() => { /* noop */ });

    return (
      <div className="flex h-full gap-4">
        <div className="w-72 shrink-0 space-y-1 overflow-auto">
          {list.length === 0 && <p className="text-xs text-zinc-500">No sessions yet.</p>}
          {list.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs ${
                selected === s.id ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-800 hover:bg-zinc-800/50"
              }`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[s.status]}`} />
              <span className="flex-1 truncate font-mono">{s.command}</span>
              {(s.status === "running" || s.status === "waiting") && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); stop(s.id); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); stop(s.id); } }}
                  className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-300 hover:bg-red-500/30"
                >
                  Stop
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 rounded-md border border-zinc-800 bg-[#181818] p-1">
          {selected ? (
            <EmbeddedTerminal sessionId={selected} />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-500">
              Select a session to attach its terminal.
            </div>
          )}
        </div>
      </div>
    );
  }
  ```
- [ ] Create `client/src/pages/SessionsPage.tsx`:
  ```tsx
  import { SessionBoard } from "@/components/SessionBoard";

  export default function SessionsPage() {
    return (
      <div className="flex h-full flex-col p-6">
        <h1 className="mb-4 text-lg font-semibold text-zinc-100">Sessions</h1>
        <div className="min-h-0 flex-1">
          <SessionBoard />
        </div>
      </div>
    );
  }
  ```
- [ ] Add the `/sessions` route in `client/src/App.tsx` (mirror the existing route registration pattern, lazy or eager as the file already does) and a "Sessions" entry in `client/src/components/Sidebar.tsx` (mirror the existing nav-item shape — icon + label + `to="/sessions"`).
- [ ] **Run — expect PASS (typecheck + build).** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\client exec tsc --noEmit` then `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\client build` → both succeed.
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/client/src/components/SessionBoard.tsx .canon/.mission-control/client/src/pages/SessionsPage.tsx .canon/.mission-control/client/src/App.tsx .canon/.mission-control/client/src/components/Sidebar.tsx
  git -C D:\VFXellence-LTD commit -m "Add Sessions board surface, route, and nav

  - SessionBoard lists live sessions (refreshed on /ws status), Stop + terminal pane
  - SessionsPage at /sessions; add Sidebar nav entry
  - Attaches EmbeddedTerminal to the selected session"
  ```

---

### Task 12 — Rewire Plan‑2 Campaign Run button to /api/sessions/start
**Model/effort:** sonnet — integration. **Worktree: yes.**
**Files:**
- Modify: `client/src/components/CampaignControlPanel.tsx` (Plan‑2 file)

Plan 2 builds the Campaign Control Panel with a **Run** button whose `onRun` currently calls the campaign status transition. Rewire `onRun` to `api.sessions.start({ campaignId })`, then navigate to `/sessions` (or open the board) so the operator sees the live terminal. Keep the approval gate UX: if the server returns 409, surface "Campaign must be approved before running".

- [ ] **Guard:** if Plan 2 is not yet merged (file absent), skip this task and record a follow-up note in the changelog: "Task 12 deferred — Plan 2 CampaignControlPanel not present." Tasks 1–11 already make the driver fully exercisable from the Sessions board.
- [ ] **If present — Impl.** In `CampaignControlPanel.tsx`, replace the Run handler body with:
  ```tsx
  const handleRun = async () => {
    try {
      const session = await sessions.start({ campaignId: campaign.id });
      navigate(`/sessions`);
      onStarted?.(session.id);
    } catch (err) {
      setRunError(err instanceof Error ? err.message : "Failed to start session");
    }
  };
  ```
  Import `{ sessions }` from `@/lib/api` and `useNavigate` from `react-router-dom`; render `runError` near the button. Do not change the Plan‑2 approval flow.
- [ ] **Run — expect PASS (typecheck + build).** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control\client exec tsc --noEmit` then `build` → succeed.
- [ ] **Manual end-to-end check (no real claude).** `pnpm --dir D:\VFXellence-LTD\.canon\.mission-control dev`; approve a viral campaign; click **Run**; confirm a session row appears on the Sessions board, the terminal attaches, and `powershell` launches (it will *attempt* `claude "/surge-generate <id>"`; with no Plan‑4 skill, Claude reports an unknown command — that is expected and proves the driver). Stop the session; confirm the `agent_runs` row flips to `done`.
- [ ] **Commit.**
  ```bash
  git -C D:\VFXellence-LTD add .canon/.mission-control/client/src/components/CampaignControlPanel.tsx
  git -C D:\VFXellence-LTD commit -m "Rewire campaign Run button to /api/sessions/start

  - onRun calls api.sessions.start({ campaignId }) and navigates to /sessions
  - Surface the 409 approval-gate error inline; preserve the Plan-2 approval flow"
  ```

---

## VAULT UPDATE (do as part of this plan's work — not a follow-up)

- [ ] Append to today's changelog `D:\VFXellence-LTD\.canon\4_orchestrator\changelogs\2026-06-14.md`: the resolved `node-pty`/`xterm` versions, the `MC_PTY_SMOKE=1` opt-in, the `agent_runs.error` `setStatus` extension, and the Plan‑2 dependency note for Task 12.
- [ ] Capture any node-pty native-rebuild gotcha (ABI mismatch, prebuild availability on Node 24 / win32) in `D:\VFXellence-LTD\.canon\5_knowledge\` so the next session does not rediscover it.
- [ ] Update the master roadmap `…\plans\2026-06-13-MASTER-implementation-roadmap.md` Plan‑3 row to "in progress"/"done" as appropriate.
- [ ] After substantively editing this AI-facing plan, run `/caveman:compress` is NOT applied to plans (human-facing) — skip.

---

## Self-Review

**Spec coverage (1:1 with the brief):**
1. node-pty + ws + xterm deps; `pty.service.ts` (node-pty wrapper, scrollback, data/exit) → Tasks 1, 2, 10. ✔
2. `session.service.ts` lifecycle (running→waiting→done, idle detect) writing `agent_runs` rows; allowlist `['/surge-generate','/surge-safeguard-check','/surge-continue']` + `--resume {uuid}` → Task 3 (verbatim allowlist; idle 8 s; `AgentRunsService` writes; `error` persistence added). ✔
3. `POST /api/sessions/start {campaignId|taskId}` → `agent_runs` row + spawn PTY (powershell) that after a brief delay writes `claude "/surge-generate <campaignId>"\r`, cwd = `…\polymath\packages\agents`; plus list + stop → Task 6 (route) + Task 4 (the 800 ms delayed type, CMC-faithful: PTY spawns lazily on WS connect, which is where CMC types the command). ✔
4. WS `/ws/terminal?sessionId=` PTY I/O bridge + `/ws` status broadcast (upgrade the Plan‑1 stub) → Tasks 4 + 9. ✔
5. `claude-sessions.service.ts`: scan `~/.claude/projects/<encoded-cwd>/*.jsonl` for the UUID → persist `agent_runs.claude_session_id` for `--resume` → Task 5 (scan) + Task 6 (backfill UPDATE). ✔
6. `prompt.service.buildSurgePrompt()` reading `.canon` viral doctrine + Surge/Zrodinger spec + safeguards → Task 8 (paths verified on disk: viral-formula playbook, viral README, viral-surge safeguards). ✔
7. Client `EmbeddedTerminal` + a Session board surface; Plan‑2 Run button now hits `/api/sessions/start` → Tasks 10, 11, 12. ✔
- **TDD:** `session.service` unit-tested (allowlist validation, lifecycle, agent_runs writes) with a **fake PTY** (Task 3); PTY/WS integration via a **scripted echo smoke**, gated, never a real claude call (Task 7). ✔
- **Plan 4 boundary:** a real `/surge-generate` run is explicitly out of scope; Task 12's manual check notes the expected "unknown command" outcome — the driver is what's proven. ✔

**No placeholders:** every code step ships complete, runnable code. The only intentionally descriptive steps are Task 11's `App.tsx`/`Sidebar.tsx` edits (instructed to mirror the file's existing route/nav shape, which Plan 2 may also touch) and Task 12 (gated on the Plan‑2 file's existence) — both call out exactly what to write.

**Type consistency with the Plan‑1 schema/API:**
- `agent_runs` columns used (`id, campaign_id, task_id, agent_name, claude_session_id, status, cwd, command, started_at, completed_at, error`) match `db.ts`; the only service change is the additive `setStatus(id, status, error?)` overload (backward-compatible — existing 2-arg callers unaffected).
- `AgentRunStatus` (`queued|running|waiting|done|error|killed`) is reused; `SessionStatus` (`running|waiting|done|error`) is a strict subset, so every status the driver sets is a valid `agent_runs.status`.
- All `/api` responses stay **camelCase** (`SessionInfo`, `AgentRun`, `Campaign`) consistent with Plan‑1 services and the client `api` wrapper.
- Approval gate reuses `CampaignsService` semantics (run requires `approvedBy`); the route returns 409 exactly like `PATCH /api/campaigns/:id/status`.
- WS pathname contract (`/ws`, `/ws/terminal`) and dev ports (server 4500, client 5174) match the Shared Grounding.
