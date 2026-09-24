import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useDeploymentFilters } from "./example2";

const deployments = [
  {
    id: "DEP-1001",
    application: "Customer Portal",
    version: "v4.2.1",
  },
  {
    id: "DEP-1002",
    application: "Payment Service",
    version: "v2.1.0",
  },
  {
    id: "DEP-1003",
    application: "Customer Portal API",
    version: "v3.0.0",
  },
];

describe("useDeploymentFilters", () => {
  it("returns all deployments when search is empty", () => {
    const { result } = renderHook(() =>
      useDeploymentFilters(deployments)
    );

    expect(result.current.filteredDeployments).toHaveLength(3);
  });

  it("filters by application name", () => {
    const { result } = renderHook(() =>
      useDeploymentFilters(deployments)
    );

    act(() => {
      result.current.setSearch("Payment");
    });

    expect(result.current.filteredDeployments).toHaveLength(1);
    expect(result.current.filteredDeployments[0].application).toBe(
      "Payment Service"
    );
  });

  it("filters case-insensitively", () => {
    const { result } = renderHook(() =>
      useDeploymentFilters(deployments)
    );

    act(() => {
      result.current.setSearch("CUSTOMER");
    });

    expect(result.current.filteredDeployments).toHaveLength(2);
  });
});