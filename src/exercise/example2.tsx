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
import { useMemo, useState } from "react";
import type { SearchableDeployment } from "@/types/deployment";

export function useDeploymentFilters<T extends SearchableDeployment>(deployments: readonly T[]) {
  const [search, setSearch] = useState("");

  const filteredDeployments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return deployments.filter((deployment) => deployment.application.toLowerCase().includes(query));
  }, [deployments, search]);

  return {
    search,
    setSearch,
    filteredDeployments,
  };
}

export default useDeploymentFilters;
