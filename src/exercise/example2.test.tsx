import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useDeploymentFilters } from "./example2";

type TestDeployment = {
  id: number;
  application: string;
  version: string;
  environment: "Production" | "QA" | "Development" | "Staging";
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High" | "Critical";
};

const deployments: TestDeployment[] = [
  {
    id: 1,
    application: "Release Portal",
    version: "1.0.0",
    environment: "Production",
    status: "Pending",
    priority: "High",
  },
  {
    id: 2,
    application: "Inventory Service",
    version: "2.1.3",
    environment: "QA",
    status: "Completed",
    priority: "Medium",
  },
  {
    id: 3,
    application: "Payment Gateway",
    version: "3.0.0",
    environment: "Development",
    status: "In Progress",
    priority: "Critical",
  },
];

describe("useDeploymentFilters", () => {
  it("returns all deployments when the search term is empty", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    expect(result.current.filteredDeployments).toHaveLength(3);
  });

  it("filters deployments by application name in a case-insensitive way", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.setSearch("portal");
    });

    expect(result.current.filteredDeployments).toHaveLength(1);
    expect(result.current.filteredDeployments[0]?.application).toBe("Release Portal");
  });

  it("updates the search value when setSearch is called", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.setSearch("payment");
    });

    expect(result.current.search).toBe("payment");
  });
});
