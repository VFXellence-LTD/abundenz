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
