import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useBrands } from "./useBrands";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), del: vi.fn() },
}));

const mockApi = api as unknown as { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };

beforeEach(() => {
  vi.clearAllMocks();
  mockApi.get.mockResolvedValue([]);
});

describe("useBrands", () => {
  it("addBrand resolves with the created record and prepends it", async () => {
    const created = { id: "zrodinger", name: "Zrodinger", ecosystemId: "content", email: "" };
    mockApi.post.mockResolvedValue(created);
    const { result } = renderHook(() => useBrands());
    await waitFor(() => expect(mockApi.get).toHaveBeenCalled());
    let returned: unknown;
    await act(async () => { returned = await result.current.addBrand({ name: "Zrodinger", ecosystemId: "content" }); });
    expect(returned).toEqual(created);
    expect(result.current.brands[0]).toEqual(created);
  });
});
