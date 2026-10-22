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

import { getDeployments } from "@/api/diploymentApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type {
  Deployment,
  DeploymentStatus,
} from "@/types/deployment";
import { statusOptions } from "@/utils/deployment";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import DeploymentCard from "./DeploymentCard";
import { useDeploymentFilters } from "./useDeploymentFilters";
import { Rocket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

export default function DeploymentQueue() {
  // This is a placeholder component to demonstrate the usage of the useQuery hook.

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["deployments"],
    queryFn: getDeployments,
  });

  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, DeploymentStatus>
  >({});

  const deployments = useMemo<Deployment[]>(() => {
    return (data ?? []).map((deployment) => ({
      ...deployment,
      status: statusOverrides[deployment.id] ?? deployment.status,
    }));
  }, [data, statusOverrides]);

  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredDeployments,
  } = useDeploymentFilters(deployments);

  const handleAdvance = (id: string, nextStatus: DeploymentStatus) => {
    setStatusOverrides((previous) => ({
      ...previous,
      [id]: nextStatus,
    }));
  };

  if (isPending) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        role="status"
      >
        Loading deployments...
      </main>
    );
  }

  if (isError) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-4"
        role="alert"
      >
        <h1 className="text-xl font-semibold">Failed to load deployments</h1>

        <p className="text-sm text-muted-foreground">{error.message}</p>

        <Button onClick={() => void refetch()}>Try Again</Button>
      </main>
    );
  }

  
return (
  <main className="min-h-screen bg-[#e5eaf2] px-4 py-5 sm:px-6">
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Dashboard Header */}
      <Card className="gap-0 rounded-xl border-0 bg-[#182338] py-0 text-white shadow-none ring-0">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <Rocket className="size-5 text-orange-400" />
              Deployment Queue
            </CardTitle>

            <p className="mt-1 text-xs text-slate-300">
              Monitor deployment requests across environments.
            </p>
          </div>

          <Card className="gap-0 rounded-lg border border-slate-600 bg-[#233149] px-5 py-3 text-center text-white shadow-none ring-0">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Active Deployments
            </p>
            <p className="text-2xl font-bold">
              {deployments.length}
            </p>
          </Card>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="gap-0 rounded-xl border border-slate-200 bg-white py-0 shadow-none ring-0">
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-xs font-semibold text-slate-900">
            Search &amp; Filters
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 px-4 pb-4">
          <label className="block">
            <span className="sr-only">
              Search applications
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by application name..."
              className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-400"
            />
          </label>

          <Separator className="bg-slate-100" />

          <div
            role="group"
            aria-label="Filter by status"
            className="flex flex-wrap gap-2"
          >
            {statusOptions.map((status) => (
              <Button
                key={status}
                type="button"
                size="sm"
                variant={
                  statusFilter === status
                    ? "default"
                    : "outline"
                }
                aria-pressed={statusFilter === status}
                onClick={() => setStatusFilter(status)}
                className={
                  statusFilter === status
                    ? "h-7 rounded-md bg-neutral-900 px-3 text-[11px] text-white hover:bg-neutral-800"
                    : "h-7 rounded-md border-slate-200 bg-white px-3 text-[11px] text-slate-800 hover:bg-slate-100"
                }
              >
                {status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Cards */}
      <section aria-label="Deployments">
        {filteredDeployments.length === 0 ? (
          <Card className="gap-0 rounded-xl border border-slate-200 bg-white py-0 shadow-none ring-0">
            <CardContent className="flex flex-col items-center px-5 py-14 text-center">
              <Badge variant="secondary" className="mb-4">
                No Results
              </Badge>

              <CardTitle className="text-base font-semibold text-slate-900">
                No deployments found
              </CardTitle>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDeployments.map((deployment) => (
              <DeploymentCard
                key={deployment.id}
                deployment={deployment}
                onAdvance={handleAdvance}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  </main>
);

}
