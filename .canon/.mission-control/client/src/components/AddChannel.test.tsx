import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddChannel } from "./AddChannel";
import type { PlatformAccount } from "@/types";

const accts: PlatformAccount[] = [{ id: 1, platform: "tiktok", handle: "@z", email: "", status: "active" }];

describe("AddChannel", () => {
  it("lists existing accounts", () => {
    render(<AddChannel accounts={accts} onAdd={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText(/tiktok/i)).toBeInTheDocument();
    expect(screen.getByText(/@z/)).toBeInTheDocument();
  });

  it("calls onAdd with platform + handle, and requires a platform", () => {
    const onAdd = vi.fn();
    render(<AddChannel accounts={[]} onAdd={onAdd} onRemove={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /add channel/i }));
    expect(onAdd).not.toHaveBeenCalled(); // platform required
    fireEvent.change(screen.getByLabelText(/platform/i), { target: { value: "threads" } });
    fireEvent.change(screen.getByLabelText(/handle/i), { target: { value: "@zz" } });
    fireEvent.click(screen.getByRole("button", { name: /add channel/i }));
    expect(onAdd).toHaveBeenCalledWith("threads", "@zz");
  });

  it("calls onRemove for an account", () => {
    const onRemove = vi.fn();
    render(<AddChannel accounts={accts} onAdd={vi.fn()} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
