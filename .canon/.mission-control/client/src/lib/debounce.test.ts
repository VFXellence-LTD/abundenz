import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./debounce";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("debounce", () => {
  it("fires once after the window, with the latest args", () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d("a"); d("b"); d("c");
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
  });

  it("fires again for a new call after the window elapses", () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d("x");
    vi.advanceTimersByTime(100);
    d("y");
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
