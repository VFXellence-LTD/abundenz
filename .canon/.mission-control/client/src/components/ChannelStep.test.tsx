import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChannelStep } from "./ChannelStep";
import type { SetupStep, PlatformAccount } from "@/types";

const youtubeStep = {
  id: "youtube", ecosystemId: "content", order: 3, title: "Create YouTube Channel", description: "", instructions: "",
  kind: "channel",
  channelSpec: [{ platform: "youtube", fields: [
    { fieldKey: "channelUrl", accountField: "url" },
    { fieldKey: "channelName", accountField: "handle" },
  ] }],
  fields: [
    { key: "channelUrl", label: "Channel URL", type: "url" },
    { key: "channelName", label: "Channel name", type: "text" },
  ],
} as unknown as SetupStep;

const ytAccount: PlatformAccount = { id: 5, platform: "youtube", handle: "", email: "", status: "not-started", url: "" };

function base(overrides = {}) {
  return {
    step: youtubeStep, accounts: [ytAccount], updateAccount: vi.fn(),
    isComplete: false, onToggleComplete: vi.fn(), index: 2, expanded: true, onToggleExpand: vi.fn(),
    ...overrides,
  };
}

describe("ChannelStep", () => {
  it("renders each mapped field bound to the account", () => {
    render(<ChannelStep {...base()} />);
    expect(screen.getByLabelText(/Channel URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Channel name/i)).toBeInTheDocument();
  });

  it("editing a field updates the account with the mapped field + status active", () => {
    const updateAccount = vi.fn();
    render(<ChannelStep {...base({ updateAccount })} />);
    fireEvent.blur(screen.getByLabelText(/Channel URL/i), { target: { value: "https://youtube.com/@z" } });
    expect(updateAccount).toHaveBeenCalledWith(5, { url: "https://youtube.com/@z", status: "active" });
  });

  it("shows a hint and does not render inputs when the account is missing (not seeded)", () => {
    render(<ChannelStep {...base({ accounts: [] })} />);
    expect(screen.queryByLabelText(/Channel URL/i)).not.toBeInTheDocument();
    expect(screen.getByText(/not seeded|no account/i)).toBeInTheDocument();
  });
});
