/**
 * ============================================================================
 * Exercise 3 - Deployment Queue
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * Congratulations!
 *
 * The DeploymentCard component and search functionality have been completed.
 *
 * Your next task is to build the Deployment Queue page by integrating the
 * previous exercises.
 *
 * ============================================================================
 *
 * Requirements
 *
 * Build a Deployment Queue page using the supplied mock API response.
 *
 * The page should display all deployments using the DeploymentCard component
 * created in Exercise 1.
 *
 * Use the custom hook created in Exercise 2 for searching deployments.
 *
 * ============================================================================
 *
 * Functional Requirements
 *
 * 1. Fetch deployments using React Query.
 *
 * 2. Display all deployments.
 *
 * 3. Search deployments by Application Name.
 *
 * 4. Display the following summary:
 *
 *      Total Deployments
 *
 * 5. Add a Status filter.
 *
 *      All
 *      Pending
 *      In Progress
 *      Completed
 *      Failed
 *
 * 6. Display an Empty State when no deployments match the search/filter.
 *
 * 7. Display a Loading State while data is loading.
 *
 * 8. Display an Error State when the request fails.
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • React Query
 *
 * • TypeScript
 *
 * • Reusable Components
 *
 * • Clean Folder Structure
 *
 * • Avoid duplicated logic
 *
 * • Use the custom hook from Exercise 2
 *
 * ============================================================================
 *
 * Bonus (Optional)
 *
 * If time permits, implement one or more of the following:
 *
 * • Sort deployments by Scheduled Date
 *
 * • Display deployment counts grouped by Status
 *
 * • Display the number of filtered deployments
 *
 * • Highlight the matched search text
 *
 * ============================================================================
 *
 * Notes
 *
 * • You may create additional components if needed.
 *
 * • You may extend the custom hook created in Exercise 2.
 *
 * • Focus on clean architecture over visual appearance.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * ✓ React
 * ✓ React Query
 * ✓ TypeScript
 * ✓ Component Composition
 * ✓ Hooks
 * ✓ State Management
 * ✓ Code Organization
 * ✓ Reusability
 * ✓ Tailwind CSS
 *
 * ============================================================================
 */

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import DeploymentCard from "./DeploymentCard";
import StatusFilter from "@/components/ui/statusFilter";
import type { Deployment, Status } from "@/types/deployment";
import { getDeployments } from "@/api/diploymentApi";

function useDeploymentFilters(deployments: Deployment[]) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const filteredDeployments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
console.log("Selected:", statusFilter);
console.log("Deployment status:", deployments?.[0]?.status);
    return deployments.filter((deployment) => {
      const matchesSearch = deployment.application
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "all" || deployment.status?.toLocaleLowerCase() === statusFilter?.toLocaleLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [deployments, search, statusFilter]);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredDeployments,
  };
}

function useDeployments() {
  return useQuery<Deployment[]>({
    queryKey: ["deployments"],
    queryFn: getDeployments,
  });
}

export default function example3() {
  const { data: deployments, isLoading, isError, error } = useDeployments();

  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredDeployments,
  } = useDeploymentFilters(deployments ?? []);

  // Grouped counts are a bonus item — computed off the full unfiltered
  // list so the summary reflects the whole queue, not just what's visible.
  const statusCounts = useMemo(() => {
    if (!deployments) return {} as Record<Status, number>;
    return deployments.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] ?? 0) + 1;
      return acc;
    }, {} as Record<Status, number>);
  }, [deployments]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-sm text-muted-foreground">Loading deployments...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-sm text-destructive">
          Failed to load deployments
          {error instanceof Error ? `: ${error.message}` : "."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Deployment Queue</h1>
        <p className="text-sm text-muted-foreground">
          Total Deployments: {deployments?.length ?? 0}
          {" · "}
          Showing: {filteredDeployments.length}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by application name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <StatusFilter
          value={statusFilter === "all" ? "All" : statusFilter}
          onChange={(value) => {
            console.log("Selected:", value);
            const normalizedStatus: Status | "all" =
              value as Status;

            setStatusFilter(normalizedStatus);
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {(Object.keys(statusCounts) as Status[]).map((status) => (
          <span key={status}>
            {status}: {statusCounts[status]}
          </span>
        ))}
      </div>

      {filteredDeployments.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
          No deployments match your search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDeployments.map((deployment) => (
            <DeploymentCard key={deployment.id} deployment={deployment} />
          ))}
        </div>
      )}
    </div>
  );
}