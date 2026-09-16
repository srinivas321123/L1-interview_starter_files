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

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { advanceDeployment, getDeployments } from "@/api/deploymentApi";
import { Button } from "@/components/ui/button";
import { DeploymentSummary } from "@/components/deployments/DeploymentSummary";
import { DeploymentToolbar } from "@/components/deployments/DeploymentToolbar";
import type { Deployment, SortOrder, StatusFilter } from "@/types/deployment";
import DeploymentCard from "./example1";
import { useDeploymentFilters } from "./example2";

const queryKey = ["deployments"];
const emptyDeployments: Deployment[] = [];

export default function Example3() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey, queryFn: getDeployments });
  const deployments = query.data ?? emptyDeployments;
  const { search, setSearch, filteredDeployments } = useDeploymentFilters(deployments);
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sort, setSort] = useState<SortOrder>("default");
  const mutation = useMutation({
    mutationFn: advanceDeployment,
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey }); },
  });

  const visibleDeployments = filteredDeployments.filter((item) => status === "All" || item.status === status);
  if (sort !== "default") {
    visibleDeployments.sort((a, b) => (Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt)) * (sort === "earliest" ? 1 : -1));
  }
  const clearFilters = () => { setSearch(""); setStatus("All"); setSort("default"); };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-5">
          <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">D</span>
          <span className="font-semibold tracking-tight">Release Engineering</span>
          <span className="ml-auto text-xs text-muted-foreground">Deployment portal</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-3xl font-semibold tracking-tight">Deployment Queue</h1><p className="mt-2 text-muted-foreground">Monitor releases and manage deployments across your environments.</p></div>
          <Button variant="outline" disabled={query.isFetching || mutation.isPending} onClick={() => void query.refetch()}>{query.isFetching ? "Refreshing…" : "Refresh deployments"}</Button>
        </div>
        {query.isPending ? <p role="status" className="rounded-xl border bg-white p-12 text-center">Loading deployments…</p> : <>
          {query.isError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4"><p>{query.data ? "Could not refresh deployments. Showing the last loaded data." : "Could not load deployments. Please try again."}</p><Button variant="outline" className="mt-3" disabled={query.isFetching} onClick={() => void query.refetch()}>Try again</Button></div>}
          {query.data && <>
            <DeploymentSummary deployments={deployments} />
            <DeploymentToolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} sort={sort} onSortChange={setSort} onClear={clearFilters} />
            {mutation.isError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">Could not update the deployment. Please try advancing it again.</p>}
            {mutation.isSuccess && <p role="status" className="text-sm text-emerald-800">Deployment status updated.</p>}
            <p role="status" className="text-sm text-muted-foreground">Showing {visibleDeployments.length} of {deployments.length} deployments</p>
            {visibleDeployments.length ? <section aria-label="Deployments" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleDeployments.map((deployment) => <DeploymentCard key={deployment.id} deployment={deployment} isUpdating={mutation.isPending && mutation.variables === deployment.id} onAdvance={mutation.isPending ? undefined : (id) => mutation.mutate(id)} />)}
            </section> : <section className="rounded-xl border border-dashed bg-white px-6 py-16 text-center">
              <h2 className="text-lg font-semibold">{deployments.length ? "No deployments match your filters" : "No deployments yet"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{deployments.length ? "Try a different application name or status." : "New deployment requests will appear here."}</p>
              {deployments.length > 0 && <Button className="mt-5" variant="outline" onClick={clearFilters}>Reset filters</Button>}
            </section>}
          </>}
        </>}
      </main>
    </div>
  );
}
