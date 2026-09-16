import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDeploymentFilters } from "./example2";
import type { Deployment } from "@/types/deployment";

const deployments: readonly Pick<Deployment, "id" | "application">[] = Object.freeze([
  Object.freeze({ id: "1", application: "Customer Portal" }),
  Object.freeze({ id: "2", application: "Payments API" }),
  Object.freeze({ id: "3", application: "Customer API" }),
]);

describe("useDeploymentFilters", () => {
  it("starts with an empty search and all deployments", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));
    expect(result.current.search).toBe("");
    expect(result.current.filteredDeployments).toEqual(deployments);
  });

  it.each([
    ["CUSTOMER", ["1", "3"]],
    ["api", ["2", "3"]],
    ["  portal  ", ["1"]],
    ["   ", ["1", "2", "3"]],
    ["unknown", []],
    ["1", []],
  ])("filters application names for %s", (search, ids) => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));
    act(() => result.current.setSearch(search));
    expect(result.current.search).toBe(search);
    expect(result.current.filteredDeployments.map(({ id }) => id)).toEqual(ids);
  });

  it("restores all deployments when cleared without changing the input", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));
    act(() => result.current.setSearch("portal"));
    expect(result.current.filteredDeployments[0]).toBe(deployments[0]);
    act(() => result.current.setSearch(""));
    expect(result.current.filteredDeployments).toEqual(deployments);
  });

  it("reapplies the current search when deployments change", () => {
    const { result, rerender } = renderHook(({ items }) => useDeploymentFilters(items), {
      initialProps: { items: deployments },
    });
    act(() => result.current.setSearch("api"));
    rerender({ items: [{ id: "4", application: "New API" }] });
    expect(result.current.filteredDeployments).toEqual([{ id: "4", application: "New API" }]);
  });

  it("handles an empty list", () => {
    const { result } = renderHook(() => useDeploymentFilters([]));
    act(() => result.current.setSearch("portal"));
    expect(result.current.filteredDeployments).toEqual([]);
  });
});
