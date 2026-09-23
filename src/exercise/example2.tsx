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
import { Input } from "react-aria-components";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { StatusFilter } from "@/types";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
}


const filters: StatusFilter[] = ["All", "Pending", "In Progress", "Completed"];

const SearchPlaceholder = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: Props) => {
  // This is a placeholder component to demonstrate the usage of the useDeploymentFilters hook.
  //where you can use the hook and display the filtered deployments based on the search input.
  //use sadcn components for input and list rendering.
  return (
    <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
      <CardContent className="p-3">
        <div className="mb-3">
          <p className="mb-2 text-sm font-medium text-gray-900">
            Search & Filters
          </p>

          {/* search input */}
          <Input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search by application name"
            className="h-8 w-full rounded-lg border border-gray-200 px-3 text-xs"
          />
        </div>

        {/* filter tab button */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = statusFilter === filter;

            return (
              <Button
                key={filter}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(filter)}
                className={`
                  h-7
                  rounded-lg
                  px-3
                  text-xs
                  ${
                    isActive
                      ? "bg-gray-900 text-white hover:bg-black"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {filter}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchPlaceholder;
