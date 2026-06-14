import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Board } from "./Board";
import type { Task } from "@/lib/engine";

const mk = (id: string, status: Task["status"], title: string): Task => ({
  id, title, type: "content", ecosystemId: "viral", source: "agent",
  status, priority: "medium", autonomyStage: 0,
  createdAt: "2026-06-14T00:00:00Z", updatedAt: "2026-06-14T00:00:00Z",
});

describe("Board", () => {
  const tasks = [mk("t1", "todo", "Alpha"), mk("t2", "in-review", "Bravo"), mk("t3", "done", "Charlie")];

  it("renders the five columns and groups cards by status (no Triage column)", () => {
    render(<Board tasks={tasks} scope="all" onScopeChange={() => {}} />);
    for (const label of ["Backlog", "To Do", "In Progress", "In Review", "Done"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.queryByText("Triage")).toBeNull();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("fires onScopeChange when the scope selector changes", async () => {
    const onScopeChange = vi.fn();
    render(<Board tasks={tasks} scope="all" onScopeChange={onScopeChange} />);
    await userEvent.selectOptions(screen.getByLabelText("Ecosystem scope"), "viral");
    expect(onScopeChange).toHaveBeenCalledWith("viral");
  });
});
