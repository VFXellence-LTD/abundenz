import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CampaignPanel } from "./CampaignPanel";
import type { Campaign } from "@/lib/engine";

vi.mock("@/lib/api", () => ({
  api: { post: vi.fn(() => Promise.reject(new Error("404 Not Found"))) },
}));

const c: Campaign = {
  id: "c_1", name: "Surge Tech Sprint", ecosystemId: "viral", status: "planned",
  autonomyStage: 0, targetCount: 5, approvedBy: "Robin Dutta",
  createdAt: "2026-06-14T00:00:00Z", updatedAt: "2026-06-14T00:00:00Z",
};

describe("CampaignPanel", () => {
  it("degrades gracefully when the Plan-3 session endpoint 404s", async () => {
    render(<CampaignPanel campaigns={[c]} runs={[]} onApprove={vi.fn(() => Promise.resolve(c))} />);
    await userEvent.click(screen.getByRole("button", { name: /run/i }));
    await waitFor(() =>
      expect(screen.getByText(/not yet available \(lands in Plan 3\)/i)).toBeInTheDocument(),
    );
  });

  it("shows the run status when an agent run exists for the campaign", () => {
    render(
      <CampaignPanel
        campaigns={[c]}
        runs={[{ id: "r1", campaignId: "c_1", status: "running" }]}
        onApprove={vi.fn(() => Promise.resolve(c))}
      />,
    );
    expect(screen.getByText(/run: running/)).toBeInTheDocument();
  });
});
