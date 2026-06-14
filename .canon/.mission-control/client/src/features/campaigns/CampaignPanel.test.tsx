import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CampaignPanel } from "./CampaignPanel";
import type { Campaign } from "@/lib/engine";
import type { SessionInfo } from "@/lib/api";

// ---------------------------------------------------------------------------
// Mock the api module — use vi.hoisted so the fn reference is available when
// the factory runs (vi.mock is hoisted above all imports by vitest).
// ---------------------------------------------------------------------------
const { mockSessionsStart } = vi.hoisted(() => ({ mockSessionsStart: vi.fn() }));

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn(() => Promise.reject(new Error("404 Not Found"))),
    get: vi.fn(),
  },
  sessions: {
    start: mockSessionsStart,
    list: vi.fn(() => Promise.resolve([])),
    stop: vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// Mock EmbeddedTerminal — avoids xterm + WebSocket complexity in unit tests
// ---------------------------------------------------------------------------
vi.mock("@/features/terminal/EmbeddedTerminal", () => ({
  EmbeddedTerminal: ({ sessionId }: { sessionId: string }) => (
    <div data-testid="embedded-terminal" data-session-id={sessionId} />
  ),
}));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const c: Campaign = {
  id: "c_1", name: "Surge Tech Sprint", ecosystemId: "viral", status: "planned",
  autonomyStage: 0, targetCount: 5, approvedBy: "Robin Dutta",
  createdAt: "2026-06-14T00:00:00Z", updatedAt: "2026-06-14T00:00:00Z",
};

const mockSession: SessionInfo = {
  id: "test-session-1",
  command: "claude",
  cwd: "/tmp",
  campaignId: "c_1",
  taskId: null,
  status: "running",
  startedAt: "2026-06-14T00:00:00Z",
  endedAt: null,
};

describe("CampaignPanel", () => {
  beforeEach(() => {
    mockSessionsStart.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("degrades gracefully when the session endpoint 404s", async () => {
    mockSessionsStart.mockRejectedValueOnce(new Error("404 Not Found"));
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

  it("calls sessions.start with campaignId and renders EmbeddedTerminal on success", async () => {
    mockSessionsStart.mockResolvedValueOnce(mockSession);
    render(<CampaignPanel campaigns={[c]} runs={[]} onApprove={vi.fn(() => Promise.resolve(c))} />);

    await userEvent.click(screen.getByRole("button", { name: /run/i }));

    await waitFor(() => {
      expect(mockSessionsStart).toHaveBeenCalledWith({ campaignId: "c_1" });
    });

    const terminal = await screen.findByTestId("embedded-terminal");
    expect(terminal).toBeInTheDocument();
    expect(terminal).toHaveAttribute("data-session-id", "test-session-1");
  });

  it("shows a Close button and hides terminal when closed", async () => {
    mockSessionsStart.mockResolvedValueOnce(mockSession);
    render(<CampaignPanel campaigns={[c]} runs={[]} onApprove={vi.fn(() => Promise.resolve(c))} />);

    await userEvent.click(screen.getByRole("button", { name: /run/i }));
    await screen.findByTestId("embedded-terminal");

    const closeBtn = screen.getByRole("button", { name: /close terminal/i });
    expect(closeBtn).toBeInTheDocument();

    await userEvent.click(closeBtn);
    await waitFor(() =>
      expect(screen.queryByTestId("embedded-terminal")).not.toBeInTheDocument(),
    );
  });
});
