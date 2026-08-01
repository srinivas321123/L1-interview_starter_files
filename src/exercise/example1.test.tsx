import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DeploymentCard from "./example1";

type TestDeployment = {
  id: number;
  application: string;
  version: string;
  environment: "Production" | "QA" | "Development" | "Staging";
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High" | "Critical";
};

const deployment: TestDeployment = {
  id: 1001,
  application: "Customer Portal",
  version: "v4.2.1",
  environment: "Production",
  status: "Pending",
  priority: "High",
};

describe("DeploymentCard", () => {
  it("renders the application name and version", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(screen.getByText("Customer Portal")).toBeInTheDocument();
    expect(screen.getByText("Version : v4.2.1")).toBeInTheDocument();
  });

  it("renders the deployment metadata badges", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(screen.getByText("Production")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("shows the next status in the action button", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByRole("button", { name: /advance to in progress/i })
    ).toBeInTheDocument();
  });

  it("disables the button when the deployment is completed", () => {
    render(
      <DeploymentCard deployment={{ ...deployment, status: "Completed" }} />
    );

    expect(
      screen.getByRole("button", { name: /advance to completed/i })
    ).toBeDisabled();
  });
});
