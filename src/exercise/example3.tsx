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
import { useQuery } from "@tanstack/react-query";
import { getDeployments } from "../api/diploymentApi.ts";
import DeploymentCard from "./example1";
import { useDeploymentFilters } from "./example2";
import { Button } from "@/components/ui/button";
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
  const [statusFilter, setStatusFilter] = useState("All");
  const {
    data: deployments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["deployments"],
    queryFn: getDeployments,
  });
  const {
  search,
  setSearch,
  filteredDeployments,
} = useDeploymentFilters(deployments);
const statusFilteredDeployments =
  statusFilter === "All"
    ? filteredDeployments
    : filteredDeployments.filter(
        (deployment) => deployment.status === statusFilter
      );
if (isLoading) {
  return <div className="container mx-auto p-6">Loading...</div>;
}

if (isError) {
  return (
    <div className="container mx-auto p-6">
      Failed to load deployments.
    </div>
  );
}

  return (
  <div className="container mx-auto p-6">
    <h1 className="text-2xl font-bold">Deployment Queue</h1>

    <p className="mt-2 text-muted-foreground">
      Total Deployments: {deployments.length}
    </p>
    <input
  type="text"
  value={search}
  onChange={(event) => setSearch(event.target.value)}
  placeholder="Search by application name"
  className="mt-4 w-full rounded-md border px-3 py-2"
/>
<div className="mt-4 flex flex-wrap gap-2">
  {["All", "Pending", "In Progress", "Completed", "Failed"].map(
    (status) => (
      <Button
        key={status}
        variant={statusFilter === status ? "default" : "outline"}
        onClick={() => setStatusFilter(status)}
      >
        {status}
      </Button>
    )
  )}
</div>
{statusFilteredDeployments.length === 0 ? (
  <p className="mt-6 text-center text-muted-foreground">
    No deployments found.
  </p>
) : ( 
<div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {statusFilteredDeployments.map((deployment) => (
    <DeploymentCard
      key={deployment.id}
      deployment={deployment}
    />
  ))}
</div>
)}
  </div>
);
}