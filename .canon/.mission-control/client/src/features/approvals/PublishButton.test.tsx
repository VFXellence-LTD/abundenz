import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PublishButton } from "./PublishButton";

afterEach(() => {
  vi.restoreAllMocks();
});

const approvedVideo = {
  id: "aq1",
  contentType: "video",
  status: "approved",
  ecosystemId: "viral",
  createdAt: "2026-01-01",
} as any;

describe("PublishButton", () => {
  it("does NOT render for a non-video approval", () => {
    const { container } = render(
      <PublishButton approval={{ ...approvedVideo, contentType: "clip" }} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("does NOT render for a pending video approval", () => {
    const { container } = render(
      <PublishButton approval={{ ...approvedVideo, status: "pending" }} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders Publish button for approved video", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) }),
    );
    render(<PublishButton approval={approvedVideo} />);
    expect(screen.getByRole("button", { name: /publish/i })).toBeInTheDocument();
  });

  it("shows DRY RUN banner on dry-run result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [{ platform: "tiktok", status: "skipped", dryRun: true }],
        }),
      }),
    );
    render(<PublishButton approval={approvedVideo} />);
    fireEvent.click(screen.getByRole("button", { name: /publish/i }));
    await waitFor(() =>
      expect(screen.getByText(/DRY RUN — not actually posted/i)).toBeInTheDocument(),
    );
  });

  it("shows platform result after publish", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [{ platform: "tiktok", status: "skipped", dryRun: true }],
        }),
      }),
    );
    render(<PublishButton approval={approvedVideo} />);
    fireEvent.click(screen.getByRole("button", { name: /publish/i }));
    await waitFor(() =>
      expect(screen.getByText(/tiktok/i)).toBeInTheDocument(),
    );
  });
});
