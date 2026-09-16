import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DeploymentCard from "./example1";
import type { Deployment } from "@/types/deployment";

const deployment: Deployment = {
  id: "DEP-1001",
  application: "Customer Portal",
  version: "v4.2.1",
  environment: "Production",
  status: "Pending",
  requestedBy: "John Smith",
  requestedAt: "2026-07-18T09:30:00Z",
  scheduledAt: "2026-07-20T10:00:00Z",
  region: "US-East",
  priority: "High",
};

describe("DeploymentCard", () => {
  it("renders the application name", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("Customer Portal")
    ).toBeInTheDocument();
  });

  it("renders the deployment id", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("DEP-1001")
    ).toBeInTheDocument();
  });

  it("renders the version", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("v4.2.1")
    ).toBeInTheDocument();
  });


  it("renders the deployment status", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("Pending")
    ).toBeInTheDocument();
  });

  it("renders the requested by value", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("John Smith")
    ).toBeInTheDocument();
  });

  it("renders the scheduled date", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText(/20 Jul 2026/i)
    ).toBeInTheDocument();
  });

  it("advances a pending deployment through the callback", () => {
    const onAdvance = vi.fn();
    render(<DeploymentCard deployment={deployment} onAdvance={onAdvance} />);
    fireEvent.click(screen.getByRole("button", { name: "Advance to In Progress" }));
    expect(onAdvance).toHaveBeenCalledWith(deployment.id);
  });

  it("offers completion for an in-progress deployment", () => {
    render(<DeploymentCard deployment={{ ...deployment, status: "In Progress" }} onAdvance={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Advance to Completed" })).toBeEnabled();
  });

  it.each(["Completed", "Failed"] as const)("does not advance %s deployments", (status) => {
    render(<DeploymentCard deployment={{ ...deployment, status }} onAdvance={vi.fn()} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables advancement while saving", () => {
    render(<DeploymentCard deployment={deployment} onAdvance={vi.fn()} isUpdating />);
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
  });
});
