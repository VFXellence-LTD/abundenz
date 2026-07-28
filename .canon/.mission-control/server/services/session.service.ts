import { EventEmitter } from "node:events";
import { randomUUID } from "node:crypto";
import { logger } from "./logger.service.js";
import type { PtyService } from "./pty.service.js";
import type { AgentRunsService } from "./agentRuns.service.js";

export type SessionStatus = "running" | "waiting" | "done" | "error";

const ALLOWED_SKILLS = ["/viral-generate", "/viral-safeguard-check", "/viral-continue", "/viral-render"] as const;
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
      agentName: opts.agentName ?? "viral-engine",
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

  /**
   * Stop a session and return whether anything was actually stopped.
   *
   * The in-memory Map + PtyService are process-lifetime only: a server restart
   * (or `tsx watch` reload in dev) wipes them, but the durable `agent_runs` row
   * survives — often stuck at `waiting`. So this is DB-authoritative:
   *   - Map hit  -> kill the PTY (best-effort) and finish the live session.
   *   - Map miss -> if a non-terminal `agent_runs` row exists, still best-effort
   *                 kill any PTY and mark the DB row `done` so the UI can clear it.
   *   - Neither  -> return false so the route can 404.
   */
  stopSession(id: string): boolean {
    // Best-effort PTY kill regardless of Map state (kill() is a no-op if absent).
    if (this.ptyService) this.ptyService.kill(id);

    const session = this.sessions.get(id);
    if (session) {
      this.finish(id, "done");
      return true;
    }

    // No live session in this process — fall back to the durable run row.
    const run = this.runs.get(id);
    if (!run) return false;
    if (run.status === "done" || run.status === "error" || run.status === "killed") {
      // Already terminal; nothing to do, but treat as a successful stop.
      return true;
    }
    this.runs.setStatus(id, "done");
    this.emit("status", { sessionId: id, status: "done" });
    logger.info("session", `Stopped orphaned run (no live session)`, { id, priorStatus: run.status });
    return true;
  }

  markError(id: string, error: string): void {
    const session = this.sessions.get(id);
    if (!session) throw new Error(`Session not found: ${id}`);
    this.finish(id, "error", error);
  }
}
