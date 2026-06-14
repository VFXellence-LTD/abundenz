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
