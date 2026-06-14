import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children and applies the outline variant class", () => {
    render(<Badge variant="outline">manual</Badge>);
    const el = screen.getByText("manual");
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("border-zinc-700");
  });
});
