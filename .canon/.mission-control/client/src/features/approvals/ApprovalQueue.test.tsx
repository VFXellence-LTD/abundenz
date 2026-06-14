import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ApprovalQueue } from "./ApprovalQueue";

describe("ApprovalQueue", () => {
  it("shows the clear-queue message when empty", () => {
    render(<ApprovalQueue approvals={[]} onDecide={() => {}} />);
    expect(screen.getByText(/queue is clear/i)).toBeInTheDocument();
  });
});
