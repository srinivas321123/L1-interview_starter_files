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

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import DeploymentCard from "./example1";
import SearchPlaceholder from "./example2";
import { getDeployments } from "../api/diploymentApi";
import { Card, CardContent } from "../components/ui/card";
import { useDeploymentFilters } from "../lib/useDeploymentFilters";
import type { Deployment, DeploymentStatus, StatusFilter } from "../types";

/**
 * TODO
 *
 * Build the Deployment Queue page.
 *
 * Expected flow:
 *
 * React Query
 *        ↓
 * Deployment Data
 *        ↓
 * useDeploymentSearch()
 *        ↓
 * DeploymentCard[]
 */

export default function Example3() {
  // This is a placeholder component to demonstrate the usage of the useQuery hook.
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["deployments"],
    queryFn: getDeployments,
  });
  const [status, setStatus] = useState<Record<string, DeploymentStatus>>({});
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const deployments = useMemo(() => {
    if (!data) return [];

    return data.map((deployment) => ({
      ...deployment,
      status: status[deployment.id] || deployment.status,
    })) as Deployment[];
  }, [data, status]);

  const {
    search,
    setSearch,
    filteredDeployments: searchedDeployments,
  } = useDeploymentFilters(deployments);

  const filteredDeployments = useMemo(() => {
    if (statusFilter === "All") {
      return searchedDeployments;
    }

    return searchedDeployments.filter(
      (deployment) => deployment.status === statusFilter,
    );
  }, [searchedDeployments, statusFilter]);

  const handleStatusChange = useCallback(
    (id: string, status: DeploymentStatus) => {
      setStatus((prev) => ({
        ...prev,
        [id]: status,
      }));
    },
    [],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading deployment</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-red-500">Error: {error?.message}</p>
      </div>
    );
  }

  const totalDeployments = deployments.length;

  return (
    <>
      <div className="min-h-screen bg-[#e8eef5] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1240px] space-y-4">
          {/* Header */}
          <Card className="overflow-hidden rounded-xl border-0 bg-[#111b30] shadow-sm">
            <CardContent className="flex items-center justify-between px-5 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>

                  <h1 className="text-xl font-bold tracking-tight text-white">
                    Deployment Queue
                  </h1>
                </div>

                <p className="mt-1 text-xs text-blue-100">
                  Monitor deployment requests across environments.
                </p>
              </div>

              {/* Active count */}
              <div className="hidden min-w-[105px] rounded-lg border border-blue-200/20 bg-white/5 px-4 py-2 text-center sm:block">
                <p className="text-[9px] font-medium uppercase tracking-wider text-blue-200">
                  Active Deployments
                </p>

                <p className="text-2xl font-bold leading-none text-white">
                  {totalDeployments}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Search & Filter */}
          <SearchPlaceholder
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* Deployment List */}
          {filteredDeployments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredDeployments.map((deployment) => (
                <DeploymentCard
                  key={deployment.id}
                  deployment={deployment}
                  handleStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
              <CardContent className="flex min-h-[180px] items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    No deployments found
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Try changing your search or filter.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
