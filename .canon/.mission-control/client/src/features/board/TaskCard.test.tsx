import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TaskCard } from "./TaskCard";
import type { Task } from "@/lib/engine";

const base: Task = {
  id: "t_1", title: "Render Surge clip draft", type: "content",
  ecosystemId: "viral", source: "agent", status: "todo", priority: "high",
  autonomyStage: 0, createdAt: "2026-06-14T00:00:00Z", updatedAt: "2026-06-14T00:00:00Z",
};

describe("TaskCard", () => {
  it("shows title, id, ecosystem and a high-priority left border", () => {
    const { container } = render(<TaskCard task={base} />);
    expect(screen.getByText("Render Surge clip draft")).toBeInTheDocument();
    expect(screen.getByText("t_1")).toBeInTheDocument();
    expect(screen.getByText("viral")).toBeInTheDocument();
    expect(container.querySelector(".border-l-orange-500")).not.toBeNull();
  });

  it("calls onMove with the chosen status", async () => {
    const onMove = vi.fn();
    render(<TaskCard task={base} onMove={onMove} />);
    await userEvent.selectOptions(screen.getByLabelText("Move t_1"), "in-review");
    expect(onMove).toHaveBeenCalledWith("t_1", "in-review");
  });
});
