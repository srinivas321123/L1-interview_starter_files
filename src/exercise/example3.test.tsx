import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { advanceDeployment, getDeployments } from "@/api/deploymentApi";
import { data } from "@/data/MOCK_DATA";
import Example3 from "./example3";

vi.mock("@/api/deploymentApi", () => ({ getDeployments: vi.fn(), advanceDeployment: vi.fn() }));

function renderQueue() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}><Example3 /></QueryClientProvider>);
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getDeployments).mockResolvedValue(data.map((item) => ({ ...item })));
});

describe("Deployment Queue", () => {
  it("shows loading, then all deployments and status counts", async () => {
    renderQueue();
    expect(screen.getByText("Loading deployments…")).toBeInTheDocument();
    expect(await screen.findAllByRole("article")).toHaveLength(10);
    const summary = screen.getByRole("region", { name: "Deployment summary" });
    expect(within(summary).getByText("Total Deployments").nextElementSibling).toHaveTextContent("10");
    expect(within(summary).getByText("Pending").nextElementSibling).toHaveTextContent("5");
    expect(screen.getByText("Showing 10 of 10 deployments")).toBeInTheDocument();
  });

  it("combines case-insensitive application search with status and resets filters", async () => {
    renderQueue();
    await screen.findAllByRole("article");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "SERVICE" } });
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "Pending" } });
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("Showing 3 of 10 deployments")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "Failed" } });
    expect(screen.getByText("No deployments match your filters")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getAllByRole("article")).toHaveLength(10);
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("supports Failed deployments", async () => {
    vi.mocked(getDeployments).mockResolvedValue([{ ...data[0], status: "Failed" }]);
    renderQueue();
    await screen.findByRole("article");
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "Failed" } });
    expect(screen.getByRole("article")).toHaveTextContent("Customer Portal");
    expect(screen.getByRole("button", { name: "Deployment failed" })).toBeDisabled();
  });

  it("sorts scheduled dates in both directions", async () => {
    renderQueue();
    await screen.findAllByRole("article");
    fireEvent.change(screen.getByLabelText("Scheduled date"), { target: { value: "earliest" } });
    expect(screen.getAllByRole("article")[0]).toHaveAccessibleName("Search Service deployment");
    fireEvent.change(screen.getByLabelText("Scheduled date"), { target: { value: "latest" } });
    expect(screen.getAllByRole("article")[0]).toHaveAccessibleName("Analytics Dashboard deployment");
    expect(data[0].id).toBe("DEP-1001");
  });

  it("shows an empty queue", async () => {
    vi.mocked(getDeployments).mockResolvedValue([]);
    renderQueue();
    expect(await screen.findByText("No deployments yet")).toBeInTheDocument();
    expect(screen.getByText("Showing 0 of 0 deployments")).toBeInTheDocument();
  });

  it("recovers from a failed request using retry", async () => {
    vi.mocked(getDeployments).mockRejectedValueOnce(new Error("Offline"));
    renderQueue();
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load deployments");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findAllByRole("article")).toHaveLength(10);
  });

  it("retains loaded data when a refresh fails", async () => {
    renderQueue();
    await screen.findAllByRole("article");
    vi.mocked(getDeployments).mockRejectedValueOnce(new Error("Offline"));
    fireEvent.click(screen.getByRole("button", { name: "Refresh deployments" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Showing the last loaded data");
    expect(screen.getAllByRole("article")).toHaveLength(10);
  });

  it("advances a deployment and refreshes cards and summary", async () => {
    const updated = { ...data[0], status: "In Progress" as const };
    vi.mocked(advanceDeployment).mockResolvedValue(updated);
    renderQueue();
    const card = await screen.findByRole("article", { name: "Customer Portal deployment" });
    vi.mocked(getDeployments).mockResolvedValue(data.map((item) => item.id === updated.id ? updated : item));
    fireEvent.click(within(card).getByRole("button", { name: "Advance to In Progress" }));
    await waitFor(() => expect(advanceDeployment).toHaveBeenCalledWith("DEP-1001", expect.anything()));
    expect(await within(card).findByRole("button", { name: "Advance to Completed" })).toBeEnabled();
    const summary = screen.getByRole("region", { name: "Deployment summary" });
    expect(within(summary).getByText("Pending").nextElementSibling).toHaveTextContent("4");
  });

  it("shows an update error without changing the deployment", async () => {
    vi.mocked(advanceDeployment).mockRejectedValue(new Error("Update failed"));
    renderQueue();
    const card = await screen.findByRole("article", { name: "Customer Portal deployment" });
    fireEvent.click(within(card).getByRole("button", { name: "Advance to In Progress" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not update the deployment");
    expect(within(card).getByText("Pending")).toBeInTheDocument();
    expect(within(card).getByRole("button")).toBeEnabled();
  });
});
