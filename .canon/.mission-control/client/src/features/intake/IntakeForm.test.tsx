import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { IntakeForm } from "./IntakeForm";

const createCampaignWithTasks = vi.fn((_a: unknown) => Promise.resolve({ campaign: {}, tasks: [{}, {}, {}] }));
const fileInfraTask = vi.fn((_title: unknown, _description: unknown) => Promise.resolve({}));
vi.mock("./intake.api", () => ({
  createCampaignWithTasks: (a: unknown) => createCampaignWithTasks(a),
  registerBrand: vi.fn(() => Promise.resolve()),
  fileInfraTask: (title: unknown, description: unknown) => fileInfraTask(title, description),
}));

describe("IntakeForm", () => {
  it("creates a campaign with the entered name, ecosystem and target count", async () => {
    render(<IntakeForm />);
    await userEvent.type(screen.getByPlaceholderText("Surge Tech Sprint"), "Surge Tech Sprint");
    await userEvent.click(screen.getByRole("button", { name: /create campaign/i }));
    await waitFor(() =>
      expect(createCampaignWithTasks).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Surge Tech Sprint", ecosystemId: "viral", targetCount: 3 }),
      ),
    );
    expect(screen.getByText(/Campaign created with 3 task/i)).toBeInTheDocument();
  });

  it("files an infra task from the Improve Mission Control tab", async () => {
    render(<IntakeForm />);
    await userEvent.click(screen.getByRole("button", { name: /improve mission control/i }));
    await userEvent.type(screen.getByPlaceholderText(/Add bulk-approve/i), "Add bulk approve");
    await userEvent.click(screen.getByRole("button", { name: /file infra task/i }));
    await waitFor(() => expect(fileInfraTask).toHaveBeenCalled());
    expect(screen.getByText(/Infra task filed against Mission Control/i)).toBeInTheDocument();
  });
});
