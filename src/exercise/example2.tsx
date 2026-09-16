/**
 * ============================================================================
 * Exercise 2 - useDeploymentFilters
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * The Release Engineering team would like to make the Deployment Queue easier
 * to navigate as the number of deployments continues to grow.
 *
 * Your task is to implement a reusable custom hook that manages searching
 * and filtering deployment data.
 *
 * ============================================================================
 *
 * Create a custom hook named:
 *
 *      useDeploymentFilters
 *
 * ============================================================================
 *
 * The hook should accept an array of deployments.
 *
 * Example
 *
 * const {
 *   search,
 *   setSearch,
 *   filteredDeployments
 * } = useDeploymentFilters(deployments);
 *
 * ============================================================================
 *
 * Functional Requirements
 *
 * The hook should:
 *
 * ✓ Maintain the search text
 *
 * ✓ Return a filtered list of deployments
 *
 * ✓ Filter by Application Name
 *
 * ✓ Filtering should be case-insensitive
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • Use React Hooks
 *
 * • Use TypeScript
 *
 * • Keep the hook reusable
 *
 *
 * • Prefer performant solutions where appropriate
 *
 * ============================================================================
 *
 * Notes
 *
 * • Do not modify the supplied deployment data.
 *
 * • This hook will be reused in the next exercise.
 *
 * • Additional filtering requirements may be introduced later.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * ✓ Custom Hooks
 * ✓ TypeScript
 * ✓ React Fundamentals
 * ✓ Code Quality
 * ✓ Reusability
 * ✓ Performance
 *
 * ============================================================================
 */
import { useMemo, useState, type ComponentProps } from "react";
import DeploymentCard from "./DeploymentCard";
import type { StatusFilterValue } from "@/types/deployment";
import { Input } from "@/components/ui/input";

type Deployment = ComponentProps<typeof DeploymentCard>["deployment"];

// Constrain T rather than leaving it fully generic — the hook needs to
// read `application` off every item, so any type it accepts must have one.
// Deployment satisfies this automatically; other lists (e.g. future
// "Application" or "Release" types) can reuse the hook as long as they do too.
export interface Filterable {
  application: string;
  status: string;
}

export function useDeploymentFilters<T extends Filterable>(deployments: T[]) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("All");

  const filteredDeployments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return deployments.filter((deployment) => {
      const matchesSearch =
        !normalizedSearch ||
        deployment.application.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || deployment.status === statusFilter;

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

interface SearchPlaceholderProps {
  deployments: Deployment[];
}

const SearchPlaceholder = ({ deployments }: SearchPlaceholderProps) => {
  const { search, setSearch, filteredDeployments } =
    useDeploymentFilters(deployments);

  return (
    <div className="space-y-4 p-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Search Deployments</h1>
      </div>
      <Input
        placeholder="Search by application name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDeployments.length > 0 ? (
          filteredDeployments.map((deployment) => (
            <DeploymentCard key={deployment.id} deployment={deployment} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No deployments match "{search}".
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPlaceholder;
