import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrandCreateForm } from "./BrandCreateForm";

function setup(overrides: Partial<Parameters<typeof BrandCreateForm>[0]> = {}) {
  const onCreate = vi.fn().mockResolvedValue({ id: "zrodinger", name: "Zrodinger", ecosystemId: "content", email: "" });
  const onSeedChannels = vi.fn();
  const onCreated = vi.fn();
  render(
    <BrandCreateForm ecosystemId="content" onCreate={onCreate} onSeedChannels={onSeedChannels} onCreated={onCreated} {...overrides} />
  );
  return { onCreate, onSeedChannels, onCreated };
}

describe("BrandCreateForm", () => {
  it("rejects a name without the letter z", async () => {
    const { onCreate } = setup();
    fireEvent.change(screen.getByLabelText(/brand name/i), { target: { value: "Acme" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    expect(await screen.findByText(/must contain the letter/i)).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("creates a content brand, seeds channels, and reports the new id", async () => {
    const { onCreate, onSeedChannels, onCreated } = setup();
    fireEvent.change(screen.getByLabelText(/brand name/i), { target: { value: "Zrodinger" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "hi@abundenz.com" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    await waitFor(() => expect(onCreate).toHaveBeenCalledWith({ name: "Zrodinger", ecosystemId: "content", email: "hi@abundenz.com" }));
    await waitFor(() => expect(onSeedChannels).toHaveBeenCalledWith("zrodinger"));
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith("zrodinger"));
  });

  it("does NOT seed channels for a non-content ecosystem", async () => {
    const onCreate = vi.fn().mockResolvedValue({ id: "zap", name: "Zap", ecosystemId: "viral", email: "" });
    const onSeedChannels = vi.fn();
    const onCreated = vi.fn();
    render(<BrandCreateForm ecosystemId="viral" onCreate={onCreate} onSeedChannels={onSeedChannels} onCreated={onCreated} />);
    fireEvent.change(screen.getByLabelText(/brand name/i), { target: { value: "Zap" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith("zap"));
    expect(onSeedChannels).not.toHaveBeenCalled();
  });
});
