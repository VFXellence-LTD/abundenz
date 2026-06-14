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
