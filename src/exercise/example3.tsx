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

import DeploymentCard from "./example1";
import { useDeploymentFilters } from "./example2";

import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface Deployment {
  id: number;
  application: string;
  version: string;
  environment: "Production" | "QA" | "Development" | "Staging";
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High" | "Critical";
}

const fetchDeployments = async (): Promise<Deployment[]> => {
  const response = await fetch("/api/deployments");

  if (!response.ok) {
    throw new Error("Failed to fetch deployments");
  }

  return response.json();
};

export default function Example3() {
  const [status, setStatus] = useState("All");

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["deployments"],
    queryFn: fetchDeployments,
  });

  const {
    search,
    setSearch,
    filteredDeployments,
  } = useDeploymentFilters(data);

  const deployments =
    status === "All"
      ? filteredDeployments
      : filteredDeployments.filter(
          (deployment) => deployment.status === status
        );

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        Loading deployments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load deployments.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Deployment Queue
      </h1>

      <div className="text-sm font-medium">
        Total Deployments : {data.length}
      </div>

      <div className="flex gap-4">

        <Input
          placeholder="Search Application"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />

        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">
              In Progress
            </SelectItem>
            <SelectItem value="Completed">
              Completed
            </SelectItem>
            <SelectItem value="Failed">
              Failed
            </SelectItem>
          </SelectContent>
        </Select>

      </div>

      {deployments.length === 0 ? (
        <div className="text-center py-10">
          No deployments found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deployments.map((deployment) => (
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
