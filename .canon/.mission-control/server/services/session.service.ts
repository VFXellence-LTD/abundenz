import { EventEmitter } from "node:events";
import { randomUUID } from "node:crypto";
import { logger } from "./logger.service.js";
import type { PtyService } from "./pty.service.js";
import type { AgentRunsService } from "./agentRuns.service.js";

export type SessionStatus = "running" | "waiting" | "done" | "error";

const ALLOWED_SKILLS = ["/surge-generate", "/surge-safeguard-check", "/surge-continue", "/surge-render"] as const;
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
