import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrandSelector } from "./BrandSelector";

const brands = [
  { id: "zrodinger", name: "Zrodinger", ecosystemId: "content" as const, email: "" },
  { id: "zenith", name: "Zenith", ecosystemId: "content" as const, email: "" },
];

describe("BrandSelector", () => {
  it("renders each brand and marks the active one", () => {
    render(<BrandSelector brands={brands} activeBrandId="zenith" onSelect={() => {}} onNew={() => {}} />);
    expect(screen.getByRole("option", { name: "Zenith" })).toBeInTheDocument();
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("zenith");
  });

  it("calls onSelect when a different brand is chosen", () => {
    const onSelect = vi.fn();
    render(<BrandSelector brands={brands} activeBrandId="zenith" onSelect={onSelect} onNew={() => {}} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "zrodinger" } });
    expect(onSelect).toHaveBeenCalledWith("zrodinger");
  });

  it("calls onNew when the New brand button is clicked", () => {
    const onNew = vi.fn();
    render(<BrandSelector brands={brands} activeBrandId={null} onSelect={() => {}} onNew={onNew} />);
    fireEvent.click(screen.getByRole("button", { name: /new brand/i }));
    expect(onNew).toHaveBeenCalled();
  });
});
