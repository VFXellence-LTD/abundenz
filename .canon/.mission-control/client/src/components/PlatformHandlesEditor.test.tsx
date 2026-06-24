import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import {
  PlatformHandlesEditor,
  serializePlatformHandles,
  parsePlatformHandles,
} from "./PlatformHandlesEditor";

const DEFAULT_PLATFORMS = ["TikTok", "YouTube", "Instagram"];

describe("PlatformHandlesEditor", () => {
  it("renders seeded rows from defaultPlatforms when stored value is empty", () => {
    render(
      <PlatformHandlesEditor
        value=""
        onChange={vi.fn()}
        defaultPlatforms={DEFAULT_PLATFORMS}
      />
    );
    expect(screen.getByDisplayValue("TikTok")).toBeInTheDocument();
    expect(screen.getByDisplayValue("YouTube")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Instagram")).toBeInTheDocument();
  });

  it("can add a new platform row via Add-platform button", async () => {
    render(
      <PlatformHandlesEditor
        value=""
        onChange={vi.fn()}
        defaultPlatforms={DEFAULT_PLATFORMS}
      />
    );
    const rowsBefore = screen.getAllByRole("row").length;
    await userEvent.click(screen.getByRole("button", { name: /add platform/i }));
    expect(screen.getAllByRole("row").length).toBe(rowsBefore + 1);
  });

  it("can remove a row via Remove button", async () => {
    render(
      <PlatformHandlesEditor
        value=""
        onChange={vi.fn()}
        defaultPlatforms={DEFAULT_PLATFORMS}
      />
    );
    const rowsBefore = screen.getAllByRole("row").length;
    // click the first remove button
    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await userEvent.click(removeButtons[0]);
    expect(screen.getAllByRole("row").length).toBe(rowsBefore - 1);
  });

  it("editing a handle input updates the value", async () => {
    const onChange = vi.fn();
    render(
      <PlatformHandlesEditor
        value=""
        onChange={onChange}
        defaultPlatforms={DEFAULT_PLATFORMS}
      />
    );
    // Find the handle input for the first row (TikTok)
    const handleInputs = screen.getAllByPlaceholderText(/handle/i);
    await userEvent.clear(handleInputs[0]);
    await userEvent.type(handleInputs[0], "@zrodinger");
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    const parsed = JSON.parse(lastCall);
    expect(parsed[0].handle).toBe("@zrodinger");
  });

  it("rows serialize and parse as JSON round-trip", () => {
    const rows = [
      { platform: "TikTok", handle: "@test", status: "Active" },
      { platform: "YouTube", handle: "", status: "Not started" },
    ];
    const serialized = serializePlatformHandles(rows);
    const parsed = parsePlatformHandles(serialized, DEFAULT_PLATFORMS);
    expect(parsed).toEqual(rows);
  });

  it("parsePlatformHandles seeds from defaultPlatforms when value is empty", () => {
    const parsed = parsePlatformHandles("", DEFAULT_PLATFORMS);
    expect(parsed).toHaveLength(3);
    expect(parsed[0].platform).toBe("TikTok");
    expect(parsed[0].handle).toBe("");
    expect(parsed[0].status).toBe("Not started");
  });

  it("parsePlatformHandles seeds from defaultPlatforms when value is invalid JSON", () => {
    const parsed = parsePlatformHandles("not-json", DEFAULT_PLATFORMS);
    expect(parsed).toHaveLength(3);
    expect(parsed[0].platform).toBe("TikTok");
  });
});
