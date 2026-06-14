import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContentPreview } from "./ContentPreview";

describe("ContentPreview", () => {
  it("renders every present field and skips absent ones", () => {
    render(<ContentPreview content={{
      hook: "POV: your render farm just paid your rent",
      script: "Scene 1...",
      shotlist: ["wide", "close"],
      caption: "link in bio",
      hashtags: ["vfx", "#ai"],
      safeguardReport: "PASS: no claims, no minors, disclosed AI",
    }} />);
    expect(screen.getByText(/render farm/)).toBeInTheDocument();
    expect(screen.getByText("wide")).toBeInTheDocument();
    expect(screen.getByText("#vfx")).toBeInTheDocument();   // normalises leading #
    expect(screen.getByText("#ai")).toBeInTheDocument();
    expect(screen.getByText(/PASS: no claims/)).toBeInTheDocument();
    expect(screen.queryByText("Hashtags")).toBeInTheDocument();
  });

  it("accepts a newline string shotlist and an object safeguard report", () => {
    render(<ContentPreview content={{ shotlist: "a\nb", safeguardReport: { verdict: "pass" } }} />);
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(screen.getByText(/"verdict": "pass"/)).toBeInTheDocument();
  });

  it("shows a fallback when no content", () => {
    render(<ContentPreview />);
    expect(screen.getByText("No content payload.")).toBeInTheDocument();
  });

  it("renders a <video> for content_type='video'", () => {
    render(<ContentPreview approvalId="aq1" contentType="video" content={{ videoPath: "a/clip.mp4", renderReport: { dryRun: true, missing: [], renderedAt: "x" } }} />);
    const v = document.querySelector("video");
    expect(v).toBeTruthy();
    expect(v?.getAttribute("src")).toContain("/api/artifacts/aq1");
    expect(screen.getByText(/dry-run/i)).toBeTruthy();
  });

  it("keeps script preview for content_type='clip'", () => {
    render(<ContentPreview approvalId="aq2" contentType="clip" content={{ hook: "H", script: "S" }} />);
    expect(document.querySelector("video")).toBeNull();
    expect(screen.getByText("H")).toBeTruthy();
  });
});
