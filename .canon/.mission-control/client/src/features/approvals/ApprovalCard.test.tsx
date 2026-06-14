import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ApprovalCard } from "./ApprovalCard";
import type { Approval } from "@/lib/engine";

const ap: Approval = {
  id: "aq_1", taskId: "t_1", ecosystemId: "viral", contentType: "clip",
  status: "pending", createdAt: "2026-06-14T00:00:00Z",
  contentJson: { hook: "h", script: "s" },
};

describe("ApprovalCard", () => {
  it("approves without notes", async () => {
    const onDecide = vi.fn();
    render(<ApprovalCard approval={ap} onDecide={onDecide} />);
    await userEvent.click(screen.getByRole("button", { name: /approve/i }));
    expect(onDecide).toHaveBeenCalledWith("aq_1", "approved", undefined);
  });

  it("gates reject behind review notes", async () => {
    const onDecide = vi.fn();
    render(<ApprovalCard approval={ap} onDecide={onDecide} />);
    const reject = screen.getByRole("button", { name: /reject/i });
    expect(reject).toBeDisabled();
    await userEvent.type(screen.getByPlaceholderText(/Review notes/i), "off-brand");
    expect(reject).toBeEnabled();
    await userEvent.click(reject);
    expect(onDecide).toHaveBeenCalledWith("aq_1", "rejected", "off-brand");
  });
});
