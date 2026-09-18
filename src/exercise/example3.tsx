/**
 * ============================================================================
 * Exercise 3 - Deployment Queue
 * ============================================================================
 */

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import DeploymentCard from "../exercise/example1";
import { useDeploymentFilters } from "./example2";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { data } from "@/data/MOCK_DATA";  

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type DeploymentStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Failed";

export interface Deployment {
  id: string;
  application: string;
  version: string;
  environment:
  | "Production"
  | "QA"
  | "Development"
  | "Staging";
  status: DeploymentStatus;
  requestedBy: string;
  requestedAt: string;
  scheduledAt: string;
  region: string;
  priority:
  | "Low"
  | "Medium"
  | "High"
  | "Critical";
}
// -----------------------------------------------------------------------------
// Mock API
// -----------------------------------------------------------------------------

export const fetchDeployments = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return data;
};
// -----------------------------------------------------------------------------
// Status filters
// -----------------------------------------------------------------------------

const STATUS_FILTERS = [
  "All",
  "Pending",
  "In Progress",
  "Completed",
  "Failed",
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number];

// -----------------------------------------------------------------------------
// Example3
// -----------------------------------------------------------------------------

export default function Example3() {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  // ---------------------------------------------------------------------------
  // React Query
  // ---------------------------------------------------------------------------

  const {
    data: deployments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Deployment[], Error>({
    queryKey: ["deployments"],
    queryFn: fetchDeployments,
  });

  // ---------------------------------------------------------------------------
  // Exercise 2 - Search
  // ---------------------------------------------------------------------------

  const {
    search,
    setSearch,
    filteredDeployments,
  } = useDeploymentFilters(deployments);

  // ---------------------------------------------------------------------------
  // Status filtering
  // ---------------------------------------------------------------------------

  const statusFilteredDeployments = useMemo(() => {
    if (statusFilter === "All") {
      return filteredDeployments;
    }

    return filteredDeployments.filter(
      (deployment) => deployment.status === statusFilter
    );
  }, [filteredDeployments, statusFilter]);

  // ---------------------------------------------------------------------------
  // Loading State
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-10">
            <p className="text-muted-foreground">
              Loading deployments...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error State
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-10">
            <p className="text-destructive">
              Failed to load deployments.
            </p>

            <p className="text-sm text-muted-foreground">
              {error.message}
            </p>

            <Button onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Deployment Queue
          </h1>

          <p className="text-muted-foreground">
            Monitor and manage application deployments.
          </p>
        </div>

        <Badge variant="secondary" className="w-fit">
          Total Deployments: {deployments.length}
        </Badge>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Search */}
      {/* ------------------------------------------------------------------ */}

      <div className="w-full">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by application name..."
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Status Filter */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <Button
            key={status}
            variant={
              statusFilter === status
                ? "default"
                : "outline"
            }
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Filtered count */}
      {/* ------------------------------------------------------------------ */}

      <div className="text-sm text-muted-foreground">
        Showing {statusFilteredDeployments.length} of{" "}
        {deployments.length} deployments
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Empty State */}
      {/* ------------------------------------------------------------------ */}

      {statusFilteredDeployments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <h2 className="text-lg font-semibold">
              No deployments found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              No deployments match the current search or status
              filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* --------------------------------------------------------------- */
        /* Deployment Cards */
        /* --------------------------------------------------------------- */

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
