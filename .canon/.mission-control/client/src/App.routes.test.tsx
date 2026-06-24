import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { Layout } from "@/components/Layout";
import { TourProvider } from "@/tour/TourProvider";
import { FeedbackProvider } from "@/feedback/FeedbackProvider";
import { ApprovalsPage } from "@/pages/ApprovalsPage";
import { IntakePage } from "@/pages/IntakePage";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(() => Promise.resolve([])),
    post: vi.fn(() => Promise.resolve({})),
    patch: vi.fn(() => Promise.resolve({})),
  },
}));

function renderAt(path: string, element: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FeedbackProvider>
        <TourProvider>
          <Layout>
            <Routes>
              <Route path={path} element={element} />
            </Routes>
          </Layout>
        </TourProvider>
      </FeedbackProvider>
    </MemoryRouter>,
  );
}

describe("new MC routes", () => {
  it("renders the Approval Queue page with sidebar nav present", () => {
    renderAt("/approvals", <ApprovalsPage />);
    expect(screen.getByText("► Approval Queue ◄")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^board$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^approvals$/i })).toBeInTheDocument();
  });

  it("renders the Intake page", () => {
    renderAt("/intake", <IntakePage />);
    expect(screen.getByRole("button", { name: /register brand/i })).toBeInTheDocument();
  });
});
