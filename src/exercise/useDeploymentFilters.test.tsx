
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useDeploymentFilters } from "./useDeploymentFilters";

import type { DeploymentStatus } from "@/types/deployment";

const deployments: {
  application: string;
  status: DeploymentStatus;
}[] = [
  { application: "Customer Portal", status: "Pending" },
  { application: "Payments API", status: "In Progress" },
  { application: "Inventory Service", status: "Completed" },
];

describe("useDeploymentFilters", () => {
  it("returns all deployments initially", () => {
    const { result } = renderHook(() =>
      useDeploymentFilters(deployments),
    );

    expect(result.current.filteredDeployments).toHaveLength(3);
  });

  it("filters by application name", () => {
    const { result } = renderHook(() =>
      useDeploymentFilters(deployments),
    );

    act(() => {
      result.current.setSearch("Customer");
    });

    expect(result.current.filteredDeployments).toHaveLength(1);
    expect(
      result.current.filteredDeployments[0].application,
    ).toBe("Customer Portal");
  });

  it("searches case-insensitively", () => {
    const { result } = renderHook(() =>
      useDeploymentFilters(deployments),
    );

    act(() => {
      result.current.setSearch("PAYMENTS");
    });

    expect(result.current.filteredDeployments).toHaveLength(1);
  });

  it("ignores surrounding whitespace", () => {
    const { result } = renderHook(() =>
      useDeploymentFilters(deployments),
    );

    act(() => {
      result.current.setSearch("  customer  ");
    });

    expect(result.current.filteredDeployments).toHaveLength(1);
  });

  it("returns an empty list for no matches", () => {
    const { result } = renderHook(() =>
      useDeploymentFilters(deployments),
    );

    act(() => {
      result.current.setSearch("Unknown");
    });

    expect(result.current.filteredDeployments).toEqual([]);
  });

  it("filters by status", () => {
    const { result } = renderHook(() =>
      useDeploymentFilters(deployments),
    );

    act(() => {
      result.current.setStatusFilter("Pending");
    });

    expect(result.current.filteredDeployments).toHaveLength(1);
  });

  it("combines search and status filters", () => {
    const { result } = renderHook(() =>
      useDeploymentFilters(deployments),
    );

    act(() => {
      result.current.setSearch("Customer");
      result.current.setStatusFilter("Completed");
    });

    expect(result.current.filteredDeployments).toEqual([]);
  });

  it("does not mutate the original data", () => {
    const original = structuredClone(deployments);

    const { result } = renderHook(() =>
      useDeploymentFilters(deployments),
    );

    act(() => {
      result.current.setSearch("Portal");
    });

    expect(deployments).toEqual(original);
  });
});
